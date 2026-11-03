"""Training script for the band-gap LightGBM surrogate (chgnet_bandgap_model.pkl).

Role
----
Offline trainer (run manually). Samples the matminer `matbench_mp_gap`
dataset, extracts the 21-dim CHGNet feature vector per structure, and fits an
LGBMRegressor on the PBE band gap (eV, linear scale — no log transform).

Inputs / outputs
----------------
Inputs : matminer "matbench_mp_gap" ("gap pbe" column, eV). MAX_SAMPLES caps
         runtime (CHGNet featurization on 106k rows would take many hours).
Outputs: pretrained_models/chgnet_bandgap_model.pkl — consumed at inference
         by the electrical properties path (band gap -> Pugh-style filters /
         conductivity heuristics in the app).
Side files: bandgap_features_<TAG>.npz (final cache), bandgap_partial_<TAG>.npz
         (resumable checkpoint, deleted on success), bandgap_failures_<TAG>.csv
         (per-row error audit).

Consumers
---------
Nothing imports this module; the pickle is what matters. Run from project root.

Dependencies
------------
lightgbm, matminer, scikit-learn, numpy, joblib, utils.chgnet_features.
"""

import csv
import os

import joblib
import numpy as np
from lightgbm import LGBMRegressor
from matminer.datasets import load_dataset
from sklearn.metrics import mean_absolute_error, r2_score
from sklearn.model_selection import train_test_split

# Run from the project root so `utils` is importable (needs utils/__init__.py).
from utils.chgnet_features import extract_mechanical_features

DATASET = "matbench_mp_gap"   # "matbench_exg" does not exist in matminer
TARGET_COL = "gap pbe"        # PBE band gap in eV (the column is not called "gap")
N_FEATURES = 21               # must match utils.chgnet_features output dim
SEED = 42

# CHGNet on CPU is slow. Start small; set to None for the full 106,113 (many hours).
MAX_SAMPLES = 3000

# Sampling tag used in every side-file name so cache files from a 3k run can
# never be confused with files from a full-dataset run (TAG would be "all").
TAG = MAX_SAMPLES or "all"
CACHE_NPZ = f"bandgap_features_{TAG}.npz"      # finished features
PARTIAL_NPZ = f"bandgap_partial_{TAG}.npz"     # checkpoint while running
FAILURES_CSV = f"bandgap_failures_{TAG}.csv"
CHECKPOINT_EVERY = 250   # rows between checkpoints (NPZ write is cheap-ish)


def save_partial(X, y, n_done, n_total):
    """Write a resumable checkpoint of featurization progress.

    Params: X (list of feature rows), y (list of targets), n_done (df rows
    processed so far, including failures), n_total (len(df)).
    Side effects: overwrites PARTIAL_NPZ. On resume, n_total must still match
    len(df) or the checkpoint is ignored (guards against dataset changes).
    X/y only (raw python lists) so failures don't desync indices.
    """
    np.savez(
        PARTIAL_NPZ,
        X=np.vstack(X) if X else np.empty((0, N_FEATURES)),
        y=np.asarray(y),
        n_done=n_done,
        n_total=n_total,
    )


def featurize(df):
    """Featurize all structures, resumable, logging failures instead of hiding them.

    X and y are appended together only after every check passes, so they
    can never get out of alignment. Progress is checkpointed, so Ctrl+C
    and re-running picks up where it stopped.

    Params: df with "structure" and TARGET_COL columns.
    Returns: (X, y) — (n, 21) float64 array and float64 target array.

    Side effects: writes/appends FAILURES_CSV, rewrites PARTIAL_NPZ every
    CHECKPOINT_EVERY rows. Resumes from PARTIAL_NPZ only if its recorded
    n_total equals the current df length (otherwise starts fresh).
    """
    X, y, start = [], [], 0

    if os.path.exists(PARTIAL_NPZ):
        d = np.load(PARTIAL_NPZ)
        if int(d["n_total"]) == len(df):
            X, y, start = list(d["X"]), list(d["y"]), int(d["n_done"])
            print(f"Resuming from {start}/{len(df)}")

    with open(FAILURES_CSV, "a" if start else "w", newline="") as f:
        log = csv.writer(f)
        if not start:
            log.writerow(["index", "error"])

        for n in range(start, len(df)):
            idx, row = df.index[n], df.iloc[n]
            try:
                features = extract_mechanical_features(row["structure"])
                vec = np.asarray(features["feature_vector"], dtype=np.float64).ravel()

                if vec.shape != (N_FEATURES,):
                    raise ValueError(f"expected {N_FEATURES} features, got {vec.shape}")
                if not np.all(np.isfinite(vec)):
                    raise ValueError("non-finite value in feature vector")

                gap = float(row[TARGET_COL])
                if not np.isfinite(gap):
                    raise ValueError(f"invalid band gap: {gap}")

                X.append(vec)
                y.append(gap)
            except Exception as e:
                log.writerow([idx, repr(e)])

            done = n + 1
            if done % CHECKPOINT_EVERY == 0:
                f.flush()
                save_partial(X, y, done, len(df))
                print(f"  processed {done}/{len(df)} (ok: {len(X)})")

    if not X:
        raise RuntimeError(f"No materials were featurized - check {FAILURES_CSV}")

    return np.vstack(X), np.asarray(y)


def get_features():
    if os.path.exists(CACHE_NPZ):
        print(f"Loading cached features from {CACHE_NPZ}")
        data = np.load(CACHE_NPZ)
        return data["X"], data["y"]

    print(f"Loading {DATASET} (parsing 100k+ structures can take a few minutes)...")
    df = load_dataset(DATASET)
    if MAX_SAMPLES:
        df = df.sample(n=min(MAX_SAMPLES, len(df)), random_state=SEED)

    print(f"Extracting features for {len(df)} materials...")
    X, y = featurize(df)
    print(f"Featurized {len(X)}/{len(df)} (failures in {FAILURES_CSV}).")

    np.savez(CACHE_NPZ, X=X, y=y)
    if os.path.exists(PARTIAL_NPZ):
        os.remove(PARTIAL_NPZ)
    return X, y


def train_electrical():
    X, y = get_features()

    # 70/15/15 split
    idx = np.arange(len(X))
    tr, tmp = train_test_split(idx, test_size=0.30, random_state=SEED)
    va, te = train_test_split(tmp, test_size=0.50, random_state=SEED)

    print("Training Band Gap Model...")
    model = LGBMRegressor(
        n_estimators=150, learning_rate=0.05, random_state=SEED, verbose=-1
    )
    model.fit(X[tr], y[tr])

    for name, ids in [("val", va), ("test", te)]:
        pred = model.predict(X[ids])
        print(
            f"  [{name}] R2={r2_score(y[ids], pred):.3f}  "
            f"MAE={mean_absolute_error(y[ids], pred):.3f} eV"
        )

    os.makedirs("pretrained_models", exist_ok=True)
    joblib.dump(model, "pretrained_models/chgnet_bandgap_model.pkl")
    print("Saved chgnet_bandgap_model.pkl successfully!")


if __name__ == "__main__":
    train_electrical()