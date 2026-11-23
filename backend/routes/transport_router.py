"""
transport_router.py
===================
Ionic transport prediction endpoint for Main API (Port 8000).
Delegates ML execution to Standalone Inference Service (Port 8001).
"""

import os
import logging
from fastapi import APIRouter, HTTPException, UploadFile, File, Form

log = logging.getLogger("transport_router")

router = APIRouter(tags=["Calculations"])

try:
    from core.inference_client import inference_client, InferenceUnavailableError, InferenceError
except ImportError:
    from backend.core.inference_client import inference_client, InferenceUnavailableError, InferenceError


def predict_conductivity_from_path(file_path: str, temperature: float = 298.15):
    """Synchronous helper for file-path based ionic transport via inference service."""
    with open(file_path, "r", encoding="utf-8", errors="replace") as f:
        cif_text = f.read()
    res = inference_client.predict_properties_sync(
        cif_text=cif_text,
        properties=["ionic_conductivity", "activation_energy"],
        temperature=temperature
    )
    props = res.get("properties", {})
    return {
        "status": "success",
        "formula": res.get("material_metadata", {}).get("formula", ""),
        "space_group": res.get("material_metadata", {}).get("space_group", "Unknown"),
        "volume": float(res.get("material_metadata", {}).get("volume_A3", 0.0)),
        "density": float(res.get("material_metadata", {}).get("density_g_cm3", 0.0)),
        "ea": float(props.get("activation_energy", {}).get("value") or 0.0),
        "conductivity": float(props.get("ionic_conductivity", {}).get("value") or 0.0),
        "temp": float(temperature)
    }


@router.post("/ionic-conductivity")
async def predict_conductivity(
    file: UploadFile = File(...),
    temperature: float = Form(298.15),
):
    """
    Predicts room-temperature ionic conductivity and activation energy
    via the Standalone Inference Service (Port 8001).
    """
    if not file.filename or not file.filename.lower().endswith(".cif"):
        raise HTTPException(status_code=400, detail="Only .cif files are supported.")

    try:
        content = await file.read()
        cif_text = content.decode("utf-8", errors="replace")

        # 1. Structural inspection for geometry metadata
        meta = {}
        try:
            from pymatgen.core import Structure
            from pymatgen.symmetry.analyzer import SpacegroupAnalyzer
            struct = Structure.from_str(cif_text, fmt="cif")
            sga = SpacegroupAnalyzer(struct)
            meta = {
                "formula": struct.composition.reduced_formula,
                "space_group": sga.get_space_group_symbol(),
                "volume": round(float(struct.lattice.volume), 3),
                "density": round(float(struct.density), 3),
            }
        except Exception:
            meta = {
                "formula": "Unknown",
                "space_group": "Unknown",
                "volume": 0.0,
                "density": 0.0,
            }

        # 2. Delegate to Standalone Inference Service
        try:
            inf_res = await inference_client.predict_ionic_transport(
                cif_text=cif_text,
                temperature=temperature,
            )
        except InferenceUnavailableError:
            raise HTTPException(
                status_code=503,
                detail="Inference Service is unavailable on port 8001. Please verify inference service is running.",
            )
        except InferenceError as ie:
            raise HTTPException(status_code=ie.status_code, detail=ie.message)

        cond_val = inf_res.get("conductivity_s_cm") or 0.0
        ea_val = inf_res.get("activation_energy_ev") or 0.0

        return {
            "status": "success",
            "formula": meta["formula"],
            "space_group": meta["space_group"],
            "volume": meta["volume"],
            "density": meta["density"],
            "ea": float(ea_val),
            "conductivity": float(cond_val),
            "temp": float(temperature),
            "details": inf_res.get("details", {}),
        }
    except HTTPException:
        raise
    except Exception as e:
        log.exception(f"Ionic transport prediction error: {e}")
        raise HTTPException(status_code=500, detail=str(e))
