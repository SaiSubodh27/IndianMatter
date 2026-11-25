"""Isolated FastAPI server for IonCast, CHGNet, M3GNet, MACE, and BFSY models."""
import os
import sys
import tempfile
from pathlib import Path
from typing import Dict, Any, Optional
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from pymatgen.core import Structure

ROOT = Path(__file__).resolve().parent
sys.path.insert(0, str(ROOT / "backend"))
sys.path.insert(0, str(ROOT / "property_prediction_models"))

import model_service

app = FastAPI(title="IndianMatter Atomistic & Surrogate Service", version="1.0.0")
_chgnet_model = None
_m3gnet_pot = None


class IonicRequest(BaseModel):
    cif_text: str
    temperature_k: float = 298.15


class StructureRequest(BaseModel):
    cif_text: str
    model: str = "chgnet"


@app.on_event("startup")
def startup():
    model_service.load_models()


@app.get("/health")
def health() -> Dict[str, Any]:
    return {
        "status": "healthy",
        "service": "atomistic-surrogate",
        "ioncast_loaded": model_service.v5_base_models is not None,
        "models_dir": os.getenv("PRETRAINED_MODELS_DIR", "/models/ioncast"),
        "chgnet_weights": os.getenv("CHGNET_MODEL_PATH", "/models/chgnet/chgnet_0.3.0_e29f68s314m37.pth.tar"),
        "m3gnet_weights": os.getenv("M3GNET_WEIGHTS_DIR", "/models/m3gnet"),
    }


@app.post("/predict/ionic-conductivity")
def predict_ionic(req: IonicRequest) -> Dict[str, Any]:
    tmp_path = None
    try:
        with tempfile.NamedTemporaryFile(mode="w", suffix=".cif", delete=False, encoding="utf-8") as tmp:
            tmp.write(req.cif_text)
            tmp_path = tmp.name
        return model_service.predict_conductivity(tmp_path, temperature_k=req.temperature_k)
    except Exception as exc:
        raise HTTPException(status_code=500, detail=str(exc))
    finally:
        if tmp_path and os.path.exists(tmp_path):
            os.remove(tmp_path)


@app.post("/predict/energy")
def predict_energy(req: StructureRequest) -> Dict[str, Any]:
    global _chgnet_model, _m3gnet_pot
    try:
        structure = Structure.from_str(req.cif_text, fmt="cif")
        kind = req.model.lower().strip()
        if kind == "chgnet":
            if _chgnet_model is None:
                from chgnet.model import CHGNet
                ckpt = os.getenv("CHGNET_MODEL_PATH")
                _chgnet_model = CHGNet.from_file(ckpt) if ckpt and os.path.exists(ckpt) else CHGNet.load()
            pred = _chgnet_model.predict_structure(structure)
            return {"model": "chgnet", "energy_per_atom_ev": float(pred["e"])}
        elif kind == "m3gnet":
            if _m3gnet_pot is None:
                import matgl
                m3_dir = os.getenv("M3GNET_WEIGHTS_DIR", "/models/m3gnet")
                _m3gnet_pot = matgl.load_model(m3_dir if os.path.exists(os.path.join(m3_dir, "model.json")) else "M3GNet-MP-2021.2.8-PES")
            from matgl.ext.ase import PESCalculator
            from pymatgen.io.ase import AseAtomsAdaptor
            atoms = AseAtomsAdaptor.get_atoms(structure)
            atoms.calc = PESCalculator(_m3gnet_pot)
            e_tot = float(atoms.get_potential_energy())
            return {"model": "m3gnet", "energy_total_ev": e_tot, "energy_per_atom_ev": e_tot / len(atoms)}
        raise HTTPException(status_code=400, detail=f"Unsupported model: {req.model}")
    except HTTPException:
        raise
    except Exception as exc:
        raise HTTPException(status_code=500, detail=str(exc))
