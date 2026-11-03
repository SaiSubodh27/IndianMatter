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

DATASET = "phonon_dielectric_mp"   # 1,296 materials
TARGET_COL = "last phdos peak"     # 1/cm; the column is not called "last freq"
N_FEATURES = 21
SEED = 42

CACHE_NPZ = "thermal_features.npz"
PARTIAL_NPZ = "thermal_partial.npz"
FAILURES_CSV = "thermal_failures.csv"
CHECKPOINT_EVERY = 100


def save_partial(X, y, n_done, n_total):
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
            log.writerow(["index", "mpid", "error"])

        for n in range(start, len(df)):
            idx, row = df.index[n], df.iloc[n]
            try:
                features = extract_mechanical_features(row["structure"])
                vec = np.asarray(features["feature_vector"], dtype=np.float64).ravel()

                if vec.shape != (N_FEATURES,):
                    raise ValueError(f"expected {N_FEATURES} features, got {vec.shape}")
                if not np.all(np.isfinite(vec)):
                    raise ValueError("non-finite value in feature vector")

                target = float(row[TARGET_COL])
                if not np.isfinite(target):
                    raise ValueError(f"invalid target: {target}")

                X.append(vec)
                y.append(target)
            except Exception as e:
                log.writerow([idx, row.get("mpid", ""), repr(e)])

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

    print(f"Loading {DATASET}...")
    df = load_dataset(DATASET)
    df = df.dropna(subset=[TARGET_COL]).reset_index(drop=True)

    print(f"Extracting CHGNet features for {len(df)} materials...")
    X, y = featurize(df)
    print(f"Featurized {len(X)}/{len(df)} (failures in {FAILURES_CSV}).")

    np.savez(CACHE_NPZ, X=X, y=y)
    if os.path.exists(PARTIAL_NPZ):
        os.remove(PARTIAL_NPZ)
    return X, y


def train_thermal():
    X, y = get_features()

    # 70/15/15 split
    idx = np.arange(len(X))
    tr, tmp = train_test_split(idx, test_size=0.30, random_state=SEED)
    va, te = train_test_split(tmp, test_size=0.50, random_state=SEED)

    print("Training Thermal Surrogate Model (last phonon DOS peak, 1/cm)...")
    model = LGBMRegressor(
        n_estimators=150, learning_rate=0.05, random_state=SEED, verbose=-1
    )
    model.fit(X[tr], y[tr])

    for name, ids in [("val", va), ("test", te)]:
        pred = model.predict(X[ids])
        print(
            f"  [{name}] R2={r2_score(y[ids], pred):.3f}  "
            f"MAE={mean_absolute_error(y[ids], pred):.1f} 1/cm"
        )

    os.makedirs("pretrained_models", exist_ok=True)
    joblib.dump(model, "pretrained_models/chgnet_thermal_model.pkl")
    print("Saved pretrained_models/chgnet_thermal_model.pkl successfully!")


if __name__ == "__main__":
    train_thermal()