import os
import io
import json
import asyncio
import tempfile
from typing import List, Optional
from fastapi import APIRouter, File, UploadFile, Form, HTTPException, BackgroundTasks, Response
from fastapi.responses import StreamingResponse, FileResponse
from pydantic import BaseModel

from core.config import settings
from core.exceptions import PredictionPipelineError, DatasetValidationError, PropertyUnsupportedError
from core.device_manager import get_device_info
from prediction_models.model_registry import model_registry
from properties.property_registry import property_registry
from parsing.csv_parser import parse_csv_dataset
from parsing.structure_parser import parse_structure_input
from parsing.feature_validator import validate_row_features
from services.prediction_service import store_uploaded_dataset, get_dataset, create_and_start_prediction_job
from services.visualization_service import build_visualization_payload
from core.job_manager import job_manager

router = APIRouter(prefix="/api/materials-prediction", tags=["Materials Property Prediction"])

class MapColumnsRequest(BaseModel):
    structure_column: Optional[str] = None
    formula_column: Optional[str] = None

class CreatePredictionRequest(BaseModel):
    dataset_id: str
    selected_models: List[str]
    selected_properties: List[str]
    calculation_settings: Optional[dict] = {}

# 1. Dataset Upload
@router.post("/datasets/upload")
async def upload_dataset(
    file: UploadFile = File(...),
    structure_files: Optional[List[UploadFile]] = File(None)
):
    if not file.filename.lower().endswith(".csv"):
        raise HTTPException(status_code=400, detail="Only CSV dataset files are supported.")

    content = await file.read()
    max_upload_bytes = settings.MAX_UPLOAD_SIZE_MB * 1024 * 1024
    if len(content) > max_upload_bytes:
        raise HTTPException(
            status_code=413,
            detail=f"CSV file exceeds the {settings.MAX_UPLOAD_SIZE_MB} MB upload limit.",
        )
    temp_csv_path = os.path.join(settings.TEMP_DIR, f"upload_{file.filename}")
    with open(temp_csv_path, "wb") as f:
        f.write(content)

    try:
        df, summary = parse_csv_dataset(temp_csv_path, max_rows=settings.MAX_CSV_ROWS)
        
        # Read optional structure files
        parsed_structures = []
        structure_warnings = []
        if structure_files:
            for sf in structure_files:
                s_bytes = await sf.read()
                suffix = os.path.splitext(sf.filename or "")[1].lower()
                with tempfile.NamedTemporaryFile(
                    dir=settings.TEMP_DIR,
                    suffix=suffix,
                    delete=False,
                ) as structure_temp:
                    structure_temp.write(s_bytes)
                    structure_temp_path = structure_temp.name
                try:
                    s_obj, structure_summary = parse_structure_input(structure_temp_path)
                finally:
                    if os.path.exists(structure_temp_path):
                        os.remove(structure_temp_path)
                if s_obj:
                    parsed_structures.append(s_obj)
                else:
                    structure_warnings.append({
                        "filename": sf.filename,
                        "error": structure_summary.get("error", "Invalid structure."),
                    })

        dataset_id = store_uploaded_dataset(df, parsed_structures, file.filename)
        summary["dataset_id"] = dataset_id
        summary["structure_files_received"] = len(structure_files or [])
        summary["structure_warnings"] = structure_warnings
        return summary
    except DatasetValidationError as ve:
        raise HTTPException(status_code=400, detail=ve.message)
    except HTTPException:
        raise
    except Exception as exc:
        raise HTTPException(status_code=400, detail=f"Dataset upload failed: {exc}")
    finally:
        if os.path.exists(temp_csv_path):
            os.remove(temp_csv_path)

# 2. Dataset Inspection
@router.get("/datasets/{dataset_id}/inspection")
async def inspect_dataset(dataset_id: str):
    ds = get_dataset(dataset_id)
    if not ds:
        raise HTTPException(status_code=404, detail="Dataset not found.")

    df = ds["df"]
    total_rows = len(df)
    
    rows_preview = df.head(10).to_dict(orient="records")
    
    return {
        "dataset_id": dataset_id,
        "filename": ds["filename"],
        "total_rows": total_rows,
        "max_rows_allowed": settings.MAX_CSV_ROWS,
        "columns": ds["columns"],
        "detected_structure_col": ds.get("detected_structure_col"),
        "detected_formula_col": ds.get("detected_formula_col"),
        "rows_preview": rows_preview,
        "missing_values_per_column": df.isnull().sum().to_dict(),
    }

# 3. Model Capabilities & GPU Status
@router.get("/models/capabilities")
async def get_model_capabilities():
    return model_registry.get_capabilities()

@router.get("/system/devices")
async def get_system_devices():
    return get_device_info()

# 4. Property Registry
@router.get("/properties")
async def list_available_properties():
    return property_registry.list_properties()

@router.get("/properties/{property_key}")
async def get_property_details(property_key: str):
    calc = property_registry.get_calculator(property_key)
    if not calc:
        raise HTTPException(status_code=404, detail=f"Property '{property_key}' not found.")
    return {
        "key": calc.key,
        "name": calc.name,
        "category": calc.category,
        "unit": calc.unit,
        "description": calc.description,
        "unsupported": calc.key in ("ionic_conductivity", "ionic_conductivity_activation_energy")
    }

# 5. Create Prediction Job
@router.post("/predictions")
async def create_prediction(req: CreatePredictionRequest):
    # Check max rows limit
    ds = get_dataset(req.dataset_id)
    if not ds:
        raise HTTPException(status_code=404, detail="Dataset not found.")

    if ds["total_rows"] > settings.MAX_CSV_ROWS:
        raise HTTPException(status_code=400, detail=f"Dataset exceeds the maximum 100 row limit.")

    try:
        job = create_and_start_prediction_job(
            dataset_id=req.dataset_id,
            selected_models=req.selected_models,
            selected_properties=req.selected_properties,
            calculation_settings=req.calculation_settings
        )
        return job.to_dict()
    except PropertyUnsupportedError as pue:
        raise HTTPException(status_code=400, detail=pue.message)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# 6. Job Status
@router.get("/predictions/{job_id}")
async def get_prediction_status(job_id: str):
    job = job_manager.get_job(job_id)
    if not job:
        raise HTTPException(status_code=404, detail="Prediction job not found.")
    return job.to_dict()

# 7. Job Progress Stream (SSE)
@router.get("/predictions/{job_id}/stream")
async def stream_prediction_progress(job_id: str):
    job = job_manager.get_job(job_id)
    if not job:
        raise HTTPException(status_code=404, detail="Job not found.")

    async def event_generator():
        while True:
            payload = json.dumps(job.to_dict())
            yield f"data: {payload}\n\n"
            if job.status in ("completed", "failed", "canceled"):
                break
            await asyncio.sleep(0.5)

    return StreamingResponse(event_generator(), media_type="text/event-stream")

# 8. Cancel Job
@router.post("/predictions/{job_id}/cancel")
async def cancel_prediction_job(job_id: str):
    success = job_manager.cancel_job(job_id)
    if not success:
        raise HTTPException(status_code=400, detail="Job could not be canceled or is already finished.")
    return {"message": f"Job {job_id} canceled."}

# 9. Results
@router.get("/predictions/{job_id}/results")
async def get_prediction_results(job_id: str):
    job = job_manager.get_job(job_id)
    if not job:
        raise HTTPException(status_code=404, detail="Job not found.")
    return {
        "job_id": job_id,
        "status": job.status,
        "total_results": len(job.results),
        "results": job.results,
    }

# 10. Dynamic Visualizations
@router.get("/predictions/{job_id}/visualizations")
async def get_prediction_visualizations(job_id: str):
    job = job_manager.get_job(job_id)
    if not job:
        raise HTTPException(status_code=404, detail="Job not found.")
    return build_visualization_payload(job.results)

# 11. Downloads
@router.get("/predictions/{job_id}/download/{format_type}")
async def download_results(job_id: str, format_type: str):
    job = job_manager.get_job(job_id)
    if not job:
        raise HTTPException(status_code=404, detail="Job not found.")

    zip_path = os.path.join(settings.RESULTS_DIR, f"{job_id}_all_outputs.zip")
    csv_path = os.path.join(settings.RESULTS_DIR, f"{job_id}_combined_results.csv")
    json_path = os.path.join(settings.RESULTS_DIR, f"{job_id}_results.json")

    if format_type == "zip" and os.path.exists(zip_path):
        return FileResponse(zip_path, filename=f"{job_id}_outputs.zip", media_type="application/zip")
    elif format_type == "csv" and os.path.exists(csv_path):
        return FileResponse(csv_path, filename=f"{job_id}_results.csv", media_type="text/csv")
    elif format_type == "json" and os.path.exists(json_path):
        return FileResponse(json_path, filename=f"{job_id}_results.json", media_type="application/json")
    else:
        # Generate on demand
        from services.download_service import generate_download_package
        package = generate_download_package(job.to_dict(), settings.RESULTS_DIR)
        target = package.get(format_type, package.get("zip"))
        return FileResponse(target, filename=os.path.basename(target))
