import os
import uuid
import pandas as pd
from typing import Dict, Any, List, Optional
from core.config import settings
from core.exceptions import DatasetValidationError, PropertyUnsupportedError
from core.job_manager import job_manager, JobState
from workers.prediction_worker import start_prediction_background_worker

# In-memory dataset cache for uploaded datasets
DATASET_CACHE: Dict[str, dict] = {}

def store_uploaded_dataset(df: pd.DataFrame, structure_files: List[Any], filename: str) -> str:
    total_rows = len(df)
    if total_rows > settings.MAX_CSV_ROWS:
        raise DatasetValidationError(
            f"Dataset exceeds the maximum limit of {settings.MAX_CSV_ROWS} rows. Uploaded file contains {total_rows} rows."
        )

    dataset_id = f"ds_{uuid.uuid4().hex[:10]}"
    DATASET_CACHE[dataset_id] = {
        "dataset_id": dataset_id,
        "filename": filename,
        "df": df,
        "structures": structure_files,
        "total_rows": total_rows,
        "columns": list(df.columns),
    }
    return dataset_id

def get_dataset(dataset_id: str) -> Optional[dict]:
    return DATASET_CACHE.get(dataset_id)

def create_and_start_prediction_job(
    dataset_id: str,
    selected_models: List[str],
    selected_properties: List[str],
    calculation_settings: Optional[dict] = None
) -> JobState:
    ds = get_dataset(dataset_id)
    if not ds:
        raise DatasetValidationError(f"Dataset '{dataset_id}' not found.")

    # Explicit check for excluded properties
    excluded = [p for p in selected_properties if p in ("ionic_conductivity", "ionic_conductivity_activation_energy")]
    if excluded:
        raise PropertyUnsupportedError(
            f"The selected properties {excluded} are explicitly unsupported and excluded from this pipeline.",
            status_code=400
        )

    settings_dict = calculation_settings or {}
    job = job_manager.create_job(
        dataset_id=dataset_id,
        total_rows=ds["total_rows"],
        selected_models=selected_models,
        selected_properties=selected_properties,
        settings=settings_dict
    )

    # Start background execution
    start_prediction_background_worker(job.job_id, ds["df"], ds["structures"])
    return job
