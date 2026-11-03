"""Ionic-conductivity (IonCast v5/v6) endpoints under ``/api/calculations``.

Role in the system
------------------
Mounted in main.py at ``/api/calculations`` (alongside calculator_router).
Exposes ``POST /predict``, ``/analyze-ionic`` and ``/ionic-conductivity``
(all three are aliases of the same handler). Accepts an uploaded ``.cif``
plus an optional temperature (default 298.15 K), writes it to a temp file,
runs ``predict_ionic_conductivity.predict_one`` with the v5 IonCast stack +
the v6 residual corrector, and returns formula / space group / volume /
density / Ea / corrected conductivity.

Inputs  : multipart upload (``.cif``) + form field ``temperature`` (float K).
Outputs : ``{ status, formula, space_group, volume, density, ea,
              conductivity (S/cm), temp }``.

Gotchas
-------
- Models are loaded at import time into ``IONIC_MODELS``; if loading fails,
  every request returns 500 with "Prediction models are not loaded".
- The temp file is always removed in the finally-style except block.
- ``AlignOpts(strict=False)`` allows feature imputation rather than failing.
"""

import os  # temp-file handling
import math  # (kept for parity; not strictly used here)
import joblib  # (kept for parity; model loading happens in predict_ionic_conductivity)
import warnings  # silence noisy model-load warnings
import pandas as pd  # (kept for parity)
import numpy as np  # (kept for parity)
from fastapi import APIRouter, HTTPException, UploadFile, File, Form  # router + upload + form
from pymatgen.core import Structure  # (kept for parity; parsing happens in predict_one)
from pydantic import BaseModel  # (kept for parity)
from model_paths import resolve_pretrained_models_dir  # locate v5_base_models.pkl

# Silence chatty third-party warnings during model import.
warnings.filterwarnings('ignore')

# Router instance; main.py mounts it at /api/calculations with the "Calculations" tag.
router = APIRouter(tags=["Calculations"])

# Resolve the surrogate directory using v5_base_models.pkl as the presence marker.
MODELS_BASE = resolve_pretrained_models_dir("v5_base_models.pkl")

# Load the IonCast v5 stack at import time (base models, MLPs, meta, quantile
# transformer, Model A, optional v6 corrector).
try:
    try:
        from predict_ionic_conductivity import load_models
    except ImportError:
        from backend.predict_ionic_conductivity import load_models
    IONIC_MODELS = load_models()  # dict of loaded model objects
    MODELS_LOADED = True
    print("v5 IonCast Ensembles loaded successfully using schema-safe bridge.")
except Exception as e:
    # Non-fatal: the router still imports; requests will fail with a clear error.
    MODELS_LOADED = False
    print(f"WARNING: Could not load v5 models: {e}")


def predict_conductivity_from_path(file_path: str, temperature: float):
    """Run IonCast on a CIF already written to disk.

    Returns a normalized dict (formula, space_group, volume, density, Ea,
    corrected conductivity). Raises if models are not loaded.
    """
    if not MODELS_LOADED:
        raise Exception("Prediction models are not loaded on the server.")

    import pathlib  # local import to avoid top-level cost
    try:
        from predict_ionic_conductivity import predict_one, AlignOpts
    except ImportError:
        from backend.predict_ionic_conductivity import predict_one, AlignOpts

    # strict=False: allow feature imputation rather than hard-failing.
    opts = AlignOpts(strict=False)
    pred = predict_one(pathlib.Path(file_path), temperature, IONIC_MODELS, apply_corrector=True, opts=opts)

    # Unpack the material-level and conductivity-level results.
    mat = pred["material"]
    cond = pred["conductivity"]
    m_out = pred["model_outputs"]
    corr = cond.get("corrected") or {}

    return {
        "status": "success",
        "formula": mat.get("formula", ""),
        "space_group": mat.get("space_group", "Unknown"),
        "volume": float(mat.get("volume_A3", 0.0)),
        "density": float(mat.get("density_g_cm3", 0.0)),
        "ea": float(m_out.get("Ea_eV", 0.0)),
        # Prefer the v6-corrected conductivity; fall back to the base value.
        "conductivity": float(corr.get("corrected_conductivity_S_per_cm", cond.get("base_conductivity_S_per_cm", 0.0))),
        "temp": float(temperature),
    }


@router.post("/predict")
@router.post("/analyze-ionic")
@router.post("/ionic-conductivity")
async def predict_conductivity(
    file: UploadFile = File(...),  # the uploaded .cif
    temperature: float = Form(298.15),  # temperature in Kelvin (default 298.15)
):
    """Handle an uploaded CIF: persist to a temp file, run IonCast, clean up."""
    # Only .cif uploads are accepted.
    if not file.filename.endswith('.cif'):
        raise HTTPException(status_code=400, detail="Only .cif files are supported.")

    # Temp path in the working directory; removed in both success and error paths.
    temp_path = f"temp_{file.filename}"
    try:
        content = await file.read()
        with open(temp_path, "wb") as f:
            f.write(content)

        result = predict_conductivity_from_path(temp_path, temperature)

        # Clean up the temp file on success.
        if os.path.exists(temp_path):
            os.remove(temp_path)

        return result
    except Exception as e:
        # Clean up the temp file on failure too, then surface the error.
        if os.path.exists(temp_path):
            os.remove(temp_path)
        raise HTTPException(status_code=500, detail=str(e))
