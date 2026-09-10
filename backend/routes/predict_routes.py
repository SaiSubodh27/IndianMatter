import os
import tempfile
from fastapi import APIRouter, File, UploadFile, Form, HTTPException
from model_service import predict_from_cif

router = APIRouter()

@router.post("/predict")
async def predict_trial(
    file: UploadFile = File(...),
    temperature: float = Form(298.0),
    material_name: str = Form(None)
):
    if not file.filename.lower().endswith(".cif"):
        raise HTTPException(status_code=400, detail="Only single .cif files are supported.")

    # Save incoming CIF to a temporary file for pymatgen/matminer processing
    with tempfile.NamedTemporaryFile(delete=False, suffix=".cif") as tmp:
        content = await file.read()
        tmp.write(content)
        tmp_path = tmp.name

    try:
        result = predict_from_cif(tmp_path, temperature=temperature)

        if material_name and material_name.strip():
            result["composition"] = material_name.strip()

        status = result.get("status")

        # A CIF we cannot parse is a bad request, not a server fault.
        if status == "invalid_cif":
            raise HTTPException(status_code=400, detail=result.get("error", "Invalid CIF file."))

        # Likewise a temperature the model was never fitted over.
        if status == "invalid_temperature":
            raise HTTPException(status_code=400, detail=result.get("error", "Unsupported temperature."))

        # The model stack being absent means we are up but cannot serve.
        if status in ("model_not_loaded", "dependency_missing"):
            raise HTTPException(status_code=503, detail=result.get("error", "Prediction service unavailable."))

        if status == "prediction_failed":
            raise HTTPException(status_code=500, detail=result.get("error", "Prediction failed"))

        return result
    finally:
        if os.path.exists(tmp_path):
            os.remove(tmp_path)