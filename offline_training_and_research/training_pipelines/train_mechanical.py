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

N_FEATURES = 21
SEED = 42
FAILURES_CSV = "failures.csv"


def featurize(df):
    """Featurize every structure. Failures are logged, never silently dropped.

    All values for a row are validated *before* anything is appended, so X,
    y_K and y_G can never get out of alignment.
    """
    X, y_K, y_G = [], [], []

    with open(FAILURES_CSV, "w", newline="") as f:
        log = csv.writer(f)
        log.writerow(["index", "material_id", "error"])

        for n, (idx, row) in enumerate(df.iterrows(), start=1):
            try:
                features = extract_mechanical_features(row["structure"])
                vec = np.asarray(features["feature_vector"], dtype=np.float64).ravel()

                if vec.shape != (N_FEATURES,):
                    raise ValueError(f"expected {N_FEATURES} features, got {vec.shape}")
                if not np.all(np.isfinite(vec)):
                    raise ValueError("non-finite value in feature vector")

                K, G = float(row["K_VRH"]), float(row["G_VRH"])
                if not (np.isfinite(K) and np.isfinite(G) and K > 0 and G > 0):
                    raise ValueError(f"invalid modulus (K={K}, G={G}); cannot take log10")

                X.append(vec)
                y_K.append(np.log10(K))
                y_G.append(np.log10(G))
            except Exception as e:
                log.writerow([idx, row.get("material_id", ""), repr(e)])

            if n % 100 == 0:
                print(f"  processed {n}/{len(df)} (ok: {len(X)})")

    if not X:
        raise RuntimeError(f"No materials were featurized - check {FAILURES_CSV}")

    return np.vstack(X), np.asarray(y_K), np.asarray(y_G)


def make_regressor():
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
    for split_name, (X, y) in splits.items():
        pred = model.predict(X)
        print(
            f"  {name} [{split_name}] "
            f"R2={r2_score(y, pred):.3f}  MAE(log10)={mean_absolute_error(y, pred):.3f}"
        )


def train_models():
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

    # 70/15/15 split, same rows for both targets
    idx = np.arange(len(X))
    tr, tmp = train_test_split(idx, test_size=0.30, random_state=SEED)
    va, te = train_test_split(tmp, test_size=0.50, random_state=SEED)

    os.makedirs("pretrained_models", exist_ok=True)

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