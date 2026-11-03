import os
import math
import joblib
import warnings
import pandas as pd
import numpy as np
from fastapi import APIRouter, HTTPException, UploadFile, File, Form
from pymatgen.core import Structure
from pydantic import BaseModel
from model_paths import resolve_pretrained_models_dir

warnings.filterwarnings('ignore')

# Router tag groups it under Calculations when included in calculator_router.pyW
router = APIRouter(tags=["Calculations"])

MODELS_BASE = resolve_pretrained_models_dir("v5_base_models.pkl")

try:
    try:
        from predict_ionic_conductivity import load_models
    except ImportError:
        from backend.predict_ionic_conductivity import load_models
    IONIC_MODELS = load_models()
    MODELS_LOADED = True
    print("v5 IonCast Ensembles loaded successfully using schema-safe bridge.")
except Exception as e:
    MODELS_LOADED = False
    print(f"WARNING: Could not load v5 models: {e}")

def predict_conductivity_from_path(file_path: str, temperature: float):
    if not MODELS_LOADED:
        raise Exception("Prediction models are not loaded on the server.")

    import pathlib
    try:
        from predict_ionic_conductivity import predict_one, AlignOpts
    except ImportError:
        from backend.predict_ionic_conductivity import predict_one, AlignOpts
        
    opts = AlignOpts(strict=False)
    pred = predict_one(pathlib.Path(file_path), temperature, IONIC_MODELS, apply_corrector=True, opts=opts)
    
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
        "conductivity": float(corr.get("corrected_conductivity_S_per_cm", cond.get("base_conductivity_S_per_cm", 0.0))),
        "temp": float(temperature)
    }

@router.post("/ionic-conductivity")
async def predict_conductivity(
    file: UploadFile = File(...),
    temperature: float = Form(298.15)
):
    if not file.filename.endswith('.cif'):
        raise HTTPException(status_code=400, detail="Only .cif files are supported.")

    temp_path = f"temp_{file.filename}"
    try:
        content = await file.read()
        with open(temp_path, "wb") as f:
            f.write(content)
            
        result = predict_conductivity_from_path(temp_path, temperature)
        
        if os.path.exists(temp_path):
            os.remove(temp_path)
            
        return result
    except Exception as e:
        if os.path.exists(temp_path):
            os.remove(temp_path)
        raise HTTPException(status_code=500, detail=str(e))