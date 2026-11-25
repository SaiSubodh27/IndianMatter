"""Isolated FastAPI server for CrystalFormer property prediction."""
import os
import sys
from pathlib import Path
from typing import Dict, Any
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from pymatgen.core import Structure

ROOT = Path(__file__).resolve().parent
sys.path.insert(0, str(ROOT / "property_prediction_models"))
sys.path.insert(0, str(ROOT / "property_prediction_models" / "CrystalFormer"))

from crystalformer_service import get_crystalformer_service

app = FastAPI(title="IndianMatter CrystalFormer Service", version="1.0.0")
_service = None


class PredictRequest(BaseModel):
    cif_text: str
    temperature_k: float = 298.15
    compute_ehull: bool = True


@app.on_event("startup")
def startup():
    global _service
    _service = get_crystalformer_service()


@app.get("/health")
def health() -> Dict[str, Any]:
    weights_dir = os.getenv("CRYSTALFORMER_WEIGHTS_DIR", "/models/crystalformer")
    return {
        "status": "healthy",
        "service": "crystalformer",
        "weights_dir": weights_dir,
        "checkpoint_available": getattr(_service, "_checkpoint_available", False) if _service else False,
        "chgnet_fallback_ready": getattr(_service, "_chgnet", None) is not None if _service else False,
    }


@app.post("/predict")
def predict(req: PredictRequest) -> Dict[str, Any]:
    try:
        structure = Structure.from_str(req.cif_text, fmt="cif")
        return _service.predict(structure, temperature_k=req.temperature_k, compute_ehull=req.compute_ehull)
    except Exception as exc:
        raise HTTPException(status_code=500, detail=str(exc))
