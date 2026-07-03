import logging
import os
import shutil
import threading
from copy import deepcopy
from datetime import datetime
from pathlib import Path
from typing import Any, Optional
from uuid import uuid4

import numpy as np
from fastapi import APIRouter, File, Form, HTTPException, UploadFile

from model_service import MODEL_VERSION, predict_from_cif

router = APIRouter()
logger = logging.getLogger(__name__)

BASE_DIR = Path(__file__).resolve().parents[2]
TEMP_DIR = BASE_DIR / "trial_uploads"
RESULTS_DIR = BASE_DIR / "trial_results"
ALLOWED_EXTENSIONS = {".cif"}
MAX_UPLOAD_BYTES = 25 * 1024 * 1024

_results: dict[str, dict[str, Any]] = {}
_results_lock = threading.Lock()


def _json_safe(value: Any) -> Any:
    if isinstance(value, dict):
        return {str(k): _json_safe(v) for k, v in value.items()}
    if isinstance(value, list):
        return [_json_safe(v) for v in value]
    if isinstance(value, tuple):
        return [_json_safe(v) for v in value]
    if isinstance(value, (np.integer,)):
        return int(value)
    if isinstance(value, (np.floating,)):
        return float(value)
    if isinstance(value, (np.ndarray,)):
        return _json_safe(value.tolist())
    return value


def _store_result(prediction_id: str, result: dict[str, Any]) -> None:
    serializable = _json_safe(result)
    with _results_lock:
        _results[prediction_id] = serializable
    RESULTS_DIR.mkdir(exist_ok=True)
    result_path = RESULTS_DIR / f"{prediction_id}.json"
    result_path.write_text(__import__("json").dumps(serializable, indent=2), encoding="utf-8")


def _get_result(prediction_id: str) -> dict[str, Any]:
    with _results_lock:
        if prediction_id in _results:
            return deepcopy(_results[prediction_id])

    result_path = RESULTS_DIR / f"{prediction_id}.json"
    if result_path.exists():
        try:
            result = __import__("json").loads(result_path.read_text(encoding="utf-8"))
            with _results_lock:
                _results[prediction_id] = result
            return deepcopy(result)
        except Exception:
            logger.exception("Failed to load stored prediction result %s", prediction_id)

    raise HTTPException(status_code=404, detail="Prediction result not found.")


def _safe_filename(filename: str) -> str:
    return Path(filename or "uploaded.cif").name


def _validate_upload(file: UploadFile) -> str:
    filename = _safe_filename(file.filename)
    if not filename:
        raise HTTPException(status_code=400, detail="No CIF file was provided.")

    if Path(filename).suffix.lower() not in ALLOWED_EXTENSIONS:
        raise HTTPException(
            status_code=400,
            detail="Invalid file format. Upload a single .cif file.",
        )

    return filename


def _format_prediction_response(
    *,
    prediction_id: str,
    cif_name: str,
    temperature: float,
    material_id: Optional[str],
    material_name: Optional[str],
    prediction_result: dict[str, Any],
) -> dict[str, Any]:
    status = prediction_result.get("status")
    if status != "success":
        message = prediction_result.get("error") or "Prediction pipeline failed."
        raise HTTPException(status_code=422, detail=message)

    conductivity = float(prediction_result.get("conductivity", 0.0))
    log_conductivity = np.log10(conductivity) if conductivity > 0 else -10.0
    hes = prediction_result.get("hes_validation", {})

    return {
        "id": prediction_id,
        "status": "success",
        "message": "Prediction completed",
        "prediction_timestamp": datetime.utcnow().isoformat() + "Z",
        "model_version": prediction_result.get("model_version", MODEL_VERSION),
        "cif_name": cif_name,
        "input_parameters": {
            "temperature_k": temperature,
            "material_id": material_id or "auto",
            "material_name": material_name or Path(cif_name).stem,
        },
        "conductivity_prediction": {
            "value_s_cm": conductivity,
            "log10_value": float(f"{log_conductivity:.4f}"),
            "unit": "S/cm",
            "temperature_k": temperature,
        },
        "arrhenius_parameters": {
            "Ea_ev": prediction_result.get("Ea", 0.0),
            "logA": prediction_result.get("logA", 0.0),
            "temperature_series": prediction_result.get("temperature_series", []),
        },
        "hes": {
            "score": prediction_result.get("hes_score", 0.0),
            "normalized": prediction_result.get("normalized_hes", 0.0),
            "components": hes.get("components", {}),
            "validation_status": prediction_result.get("validation_status", "unknown"),
            "confidence": prediction_result.get("confidence", "Unknown"),
            "prediction_quality": prediction_result.get("prediction_quality", "Unknown"),
            "rating": prediction_result.get("hes_rating", "Unknown"),
        },
        "predicted_properties": {
            "activation_energy": {
                "value_ev": prediction_result.get("Ea", 0.0),
                "unit": "eV",
            },
            "pre_exponential_factor": {
                "log10_value": prediction_result.get("logA", 0.0),
                "value": 10 ** float(prediction_result.get("logA", 0.0)),
                "unit": "S/cm",
            },
            "ionic_conductivity": {
                "value_s_cm": conductivity,
                "log10_value": float(f"{log_conductivity:.4f}"),
                "unit": "S/cm",
                "temperature_k": temperature,
            },
        },
        "material_properties": {
            "chemical_composition": {
                "formula": prediction_result.get("composition", "Unknown"),
                "source": "CIF file analysis",
            },
            "material_classification": {
                "crystal_system": prediction_result.get("classification", "Unknown"),
                "crystal_type": prediction_result.get("classification", "Unknown"),
                "detailed": prediction_result.get("classification_detailed", {}),
            },
            "structural_details": prediction_result.get("detailed_structure", {}),
        },
        "scoring": {
            "hes_score": prediction_result.get("hes_score", 0.0),
            "normalized_hes": prediction_result.get("normalized_hes", 0.0),
            "hes_rating": prediction_result.get("hes_rating", "Unknown"),
            "confidence": prediction_result.get("confidence", "Unknown"),
            "validation_status": prediction_result.get("validation_status", "unknown"),
            "model_source": prediction_result.get("source", MODEL_VERSION),
        },
        "warnings": prediction_result.get("warnings", []),
        "raw_status": prediction_result.get("status"),
    }


@router.post("/predict")
async def run_predict(
    file: UploadFile = File(...),
    temperature: float = Form(298.0),
    material_id: Optional[str] = Form(None),
    material_name: Optional[str] = Form(None),
):
    filename = _validate_upload(file)

    if temperature <= 0 or temperature > 2000:
        raise HTTPException(status_code=422, detail="Temperature must be between 0 K and 2000 K.")

    prediction_id = uuid4().hex
    upload_dir = TEMP_DIR / prediction_id
    upload_dir.mkdir(parents=True, exist_ok=True)
    file_path = upload_dir / filename

    try:
        with file_path.open("wb") as buffer:
            shutil.copyfileobj(file.file, buffer)

        if not file_path.exists() or file_path.stat().st_size == 0:
            raise HTTPException(status_code=400, detail="Uploaded CIF file is empty or unreadable.")
        if file_path.stat().st_size > MAX_UPLOAD_BYTES:
            raise HTTPException(status_code=413, detail="Uploaded CIF file exceeds the 25 MB limit.")

        prediction_result = predict_from_cif(str(file_path), temperature=temperature)
        response = _format_prediction_response(
            prediction_id=prediction_id,
            cif_name=filename,
            temperature=temperature,
            material_id=material_id,
            material_name=material_name,
            prediction_result=prediction_result,
        )
        _store_result(prediction_id, response)
        return response

    except HTTPException:
        raise
    except ValueError as err:
        logger.warning("Trial prediction validation failed for %s: %s", filename, err)
        raise HTTPException(status_code=422, detail=str(err))
    except Exception:
        logger.exception("Trial prediction failed for %s", filename)
        raise HTTPException(
            status_code=500,
            detail="Internal server error while running CIF prediction.",
        )
    finally:
        try:
            if file_path.exists():
                file_path.unlink()
            if upload_dir.exists():
                upload_dir.rmdir()
        except OSError:
            logger.debug("Could not fully clean upload directory %s", upload_dir)


@router.get("/status")
async def get_trial_status():
    return {
        "status": "ready",
        "model_version": MODEL_VERSION,
        "loaded_models_reused": True,
        "endpoints": {
            "predict": "/trial/predict",
            "status": "/trial/status",
            "result": "/trial/result/{id}",
        },
    }


@router.get("/result/{prediction_id}")
async def get_trial_result(prediction_id: str):
    return _get_result(prediction_id)


@router.get("/predict/info")
async def get_predict_info():
    return {
        "endpoint": "/trial/predict",
        "method": "POST",
        "description": "Predict ionic conductivity and HES-validated properties from a single CIF file.",
        "model_info": {
            "model_name": MODEL_VERSION,
            "input_type": "Single CIF crystal structure",
            "output_type": "Validated ionic conductivity, Ea, logA, Arrhenius series, and HES metrics",
        },
        "parameters": {
            "file": "Required .cif file",
            "temperature": "Optional Kelvin temperature, default 298.0",
            "material_id": "Optional material identifier",
            "material_name": "Optional display name",
        },
    }
