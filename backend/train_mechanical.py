"""Training script for the mechanical (bulk/shear modulus) LightGBM surrogates.

Role
----
Offline trainer (run manually, not by the API). Extracts the 21-dim CHGNet
feature vector for each material in the matminer `elastic_tensor_2015`
dataset, then fits two independent LGBMRegressor models to log10(K_VRH)
and log10(G_VRH).

Inputs / outputs
----------------
Inputs : matminer "elastic_tensor_2015" (K_VRH, G_VRH in GPa) + downloaded
         CHGNet weights (via utils.chgnet_features).
Outputs: pretrained_models/chgnet_logK_model.pkl and
         pretrained_models/chgnet_logG_model.pkl. These two pickles are the
         surrogates consumed by prediction/prediction_models adapters and the
         BFSY pipeline (K and G are later combined into E, nu, Pugh ratio
         and compressibility: E = 9KG/(3K+G), etc.).
Side files: failures.csv (per-row featurization errors; rows are validated and
         never silently dropped so X / y_K / y_G stay aligned).

Consumers
---------
None import this module; its pickles are loaded at inference time by the
model adapters. Run from the project root so `utils` is importable.

Dependencies
------------
torch, lightgbm, matminer, scikit-learn, joblib, utils.chgnet_features.
"""

import csv
import os

import joblib
import numpy as np
import torch
from lightgbm import LGBMRegressor
from matminer.datasets import load_dataset
from sklearn.metrics import mean_absolute_error, r2_score
from sklearn.model_selection import train_test_split

# Run this from the project root so `utils` is importable
# (and make sure utils/__init__.py exists).
from utils.chgnet_features import extract_mechanical_features

N_FEATURES = 21       # dimension of the CHGNet-derived feature vector (must
                      # match utils.chgnet_features / BFSY pipeline exactly)
SEED = 42             # global reproducibility seed (FP/LGBM/data splits)
FAILURES_CSV = "failures.csv"   # audit log for rows that failed featurization


def featurize(df):
    """Featurize every structure. Failures are logged, never silently dropped.

    All values for a row are validated *before* anything is appended, so X,
    y_K and y_G can never get out of alignment.

    Params
    ------
    df : pandas DataFrame with at least "structure" (pmg Structure objects),
         "K_VRH" and "G_VRH" columns ( Voigt-Reuss-Hill moduli in GPa).

    Returns
    -------
    (X, y_K, y_G) : (n, 21) float64 array plus log10(K) and log10(G) targets.
    Raises RuntimeError if nothing featurizes (see FAILURES_CSV for why).

    Side effects: writes FAILURES_CSV; prints progress every 100 rows.
    Note: moduli are logged (not the raw GPa) because LGBM regressors train
    far better on log-scale targets spanning orders of magnitude.
    """
    X, y_K, y_G = [], [], []

    # Truncate (not append): each run rewrites the failure log from scratch.
    with open(FAILURES_CSV, "w", newline="") as f:
        log = csv.writer(f)
        # Header: dataset row index, material id (if present), error repr.
        log.writerow(["index", "material_id", "error"])

        for n, (idx, row) in enumerate(df.iterrows(), start=1):
            try:
                # CHGNet graph -> 21-dim feature dict (model is a module-level
                # singleton inside utils.chgnet_features, loaded once).
                features = extract_mechanical_features(row["structure"])
                # Flatten so shape is (21,); enforce exact dim + finiteness.
                vec = np.asarray(features["feature_vector"], dtype=np.float64).ravel()

                if vec.shape != (N_FEATURES,):
                    raise ValueError(f"expected {N_FEATURES} features, got {vec.shape}")
                # NaN/inf would poison LightGBM (it treats NaN specially).
                if not np.all(np.isfinite(vec)):
                    raise ValueError("non-finite value in feature vector")

                # Targets must be strictly positive before log10.
                K, G = float(row["K_VRH"]), float(row["G_VRH"])
                if not (np.isfinite(K) and np.isfinite(G) and K > 0 and G > 0):
                    raise ValueError(f"invalid modulus (K={K}, G={G}); cannot take log10")

                # Append only after every check -> row alignment guaranteed.
                X.append(vec)
                y_K.append(np.log10(K))   # log10(GPa) units downstream
                y_G.append(np.log10(G))
            except Exception as e:
                log.writerow([idx, row.get("material_id", ""), repr(e)])

            if n % 100 == 0:
                print(f"  processed {n}/{len(df)} (ok: {len(X)})")

    if not X:
        raise RuntimeError(f"No materials were featurized - check {FAILURES_CSV}")

    return np.vstack(X), np.asarray(y_K), np.asarray(y_G)


def make_regressor():
    """Build a fresh LGBMRegressor for one target (logK or logG).

    Returns: un-fitted LGBMRegressor with fixed seed for reproducibility.
    No side effects.
    """
    # LightGBM's device="gpu" is OpenCL (not CUDA) and needs a GPU-enabled
    # build, otherwise it raises LightGBMError. On ~1.2k rows CPU is faster
    # anyway. The GPU only matters for the CHGNet featurization step.
    return LGBMRegressor(
        n_estimators=150,
        learning_rate=0.05,
        random_state=SEED,
        verbose=-1,
    )


def report(name, model, splits):
    """Print R^2 / MAE(log10) for each split of a fitted model.

    Params: name (label for the printout), model (fitted regressor),
    splits (dict split_name -> (X, y) tuple). Returns None; prints only.
    """
    for split_name, (X, y) in splits.items():
        pred = model.predict(X)
        print(
            f"  {name} [{split_name}] "
            f"R2={r2_score(y, pred):.3f}  MAE(log10)={mean_absolute_error(y, pred):.3f}"
        )


def train_models():
    """End-to-end training driver: dataset download -> featurization -> split
    -> fit logK + logG models -> save pickles.

    Returns None. Side effects: downloads the elastic_tensor_2015 dataset,
    writes FAILURES_CSV, and creates pretrained_models/chgnet_logK_model.pkl
    + chgnet_logG_model.pkl (the pickles served at inference time).
    """
    # CUDA visibility check (CHGNet featurization may still run on CPU —
    # extract_mechanical_features decides which device it puts the model on).
    if torch.cuda.is_available():
        print(f"CUDA available: {torch.cuda.get_device_name(0)}")
        print("(CHGNet only uses it if extract_mechanical_features puts the model on the GPU)")
    else:
        print("WARNING: PyTorch does not see CUDA. Feature extraction will run on CPU.")

    print("Downloading Elastic Tensor dataset (contains K and G)...")
    df = load_dataset("elastic_tensor_2015")

    print(f"Extracting CHGNet {N_FEATURES}-features for {len(df)} materials...")
    X, y_K, y_G = featurize(df)
    print(f"Successfully featurized {len(X)}/{len(df)} materials (failures in {FAILURES_CSV}).")

    # Deterministic 70/15/15 split; identical row indices reused for both
    # targets so logK/logG models see exactly the same training set.
    idx = np.arange(len(X))
    tr, tmp = train_test_split(idx, test_size=0.30, random_state=SEED)
    va, te = train_test_split(tmp, test_size=0.50, random_state=SEED)

    # Output dir must exist before joblib.dump; created lazily.
    os.makedirs("pretrained_models", exist_ok=True)

    # Fit one model per target; output filenames are the contract with the
    # inference adapters (chgnet_logK_model.pkl / chgnet_logG_model.pkl).
    for name, y, out in [
        ("Bulk Modulus (log10 K)", y_K, "pretrained_models/chgnet_logK_model.pkl"),
        ("Shear Modulus (log10 G)", y_G, "pretrained_models/chgnet_logG_model.pkl"),
    ]:
        print(f"Training {name} model...")
        model = make_regressor()
        model.fit(X[tr], y[tr])
        report(name, model, {"val": (X[va], y[va]), "test": (X[te], y[te])})
        joblib.dump(model, out)

    print("Models saved successfully to the pretrained_models folder!")


if __name__ == "__main__":
    train_models()