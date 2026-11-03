"""Background worker for the (unwired) batch prediction pipeline.

Role in the system
------------------
``execute_prediction_job`` iterates rows x models x properties, runs per-model
adapter install checks, strain perturbation precompute for mechanical props,
missing-model fallback to "unavailable" results, progress percent + logs on
``core.job_manager.JobState``, optional Celery/Redis execution, then
``services.download_service.generate_download_package`` (CSV/JSON/report/logs/ZIP).
Part of the unwired ``/api/materials-prediction`` flow.
"""

import os  # temp/result paths
import time
import json
import threading
import pandas as pd
from typing import List, Dict, Any, Optional

from core.config import settings
from core.job_manager import job_manager, JobState
from prediction_models.model_registry import model_registry
from properties.property_registry import property_registry
from parsing.structure_parser import parse_structure_input
from services.download_service import generate_download_package


# Optional Celery integration for out-of-process Redis execution
try:
    from celery import Celery
    CELERY_BROKER_URL = os.environ.get("CELERY_BROKER_URL", "redis://localhost:6379/0")
    celery_app = Celery("prediction_worker", broker=CELERY_BROKER_URL, backend=CELERY_BROKER_URL)
    CELERY_AVAILABLE = True
except ImportError:
    celery_app = None
    CELERY_AVAILABLE = False


def execute_prediction_job(job_id: str, df: pd.DataFrame, structures: List[Any]) -> Optional[Dict[str, Any]]:
    """
    Executes a multi-row, multi-model property calculation job.
    Updates in-memory job status, logs operations, handles strain perturbations,
    and constructs export packages.
    """
    job = job_manager.get_job(job_id)
    if not job:
        print(f"[Worker Error] Job '{job_id}' not found in job manager.")
        return None

    job.status = JobState.RUNNING if hasattr(JobState, "RUNNING") else "running"
    job.log("Starting prediction execution worker...")

    total_rows = min(len(df), getattr(settings, "MAX_CSV_ROWS", 10000))
    selected_models = getattr(job, "selected_models", ["chgnet"])
    selected_properties = getattr(job, "selected_properties", ["mechanical", "thermal", "electrical"])
    
    total_operations = total_rows * max(len(selected_models), 1) * len(selected_properties)
    completed_ops = 0

    results: List[Dict[str, Any]] = []

    try:
        for idx in range(total_rows):
            if getattr(job, "canceled", False):
                job.log("Execution stopped due to job cancellation.")
                job.status = "canceled"
                return None

            row = df.iloc[idx].to_dict()
            formula = str(row.get("formula", row.get("composition", f"Material_{idx+1}")))
            raw_struct = structures[idx] if idx < len(structures) else (row.get("cif") or row.get("structure"))

            # 1. Parse Crystallographic Structure
            structure_obj, struct_meta = parse_structure_input(raw_struct)
            has_valid_struct = struct_meta.get("valid", False)

            job.current_operation = f"Processing row {idx+1}/{total_rows}: {formula}"
            job.log(f"Row {idx+1}/{total_rows} ({formula}): Structure {'valid' if has_valid_struct else 'invalid/missing'}")

            # 2. Iterate Model Adapters
            for model_key in selected_models:
                adapter = model_registry.get_adapter(model_key)
                
                if not adapter:
                    job.log(f"  Warning: Model '{model_key}' not found in registry.")
                    continue

                # Validate GPU/Package dependencies
                valid_install, install_msg = True, "OK"
                if hasattr(adapter, "validate_model_installation"):
                    valid_install, install_msg = adapter.validate_model_installation()

                # 3. Precompute Strain-Response Matrix (Mechanical Elastic Constants)
                precomputed_strain = None
                if valid_install and has_valid_struct:
                    mechanical_keys = (
                        "bulk_modulus", "shear_modulus", "youngs_modulus", 
                        "poisson_ratio", "elastic_tensor", "debye_temperature", "mechanical"
                    )
                    requires_strain = any(p in mechanical_keys for p in selected_properties)
                    
                    if requires_strain:
                        job.log(f"  Running strain-perturbation simulation for {formula} using {getattr(adapter, 'display_name', model_key)}...")
                        try:
                            from backend.calculations.strain_response import run_strain_response_calculation
                            strain_settings = getattr(job, "settings", {}).get("strain_settings")
                            precomputed_strain = run_strain_response_calculation(adapter, structure_obj, strain_settings)
                        except Exception as strain_e:
                            job.log(f"  Strain calculation warning for {formula}: {strain_e}")

                calc_context = {
                    "strain_settings": getattr(job, "settings", {}).get("strain_settings"),
                    "precomputed_strain_response": precomputed_strain,
                    "device": getattr(job, "settings", {}).get("device", "auto"),
                }

                # 4. Compute Each Target Property
                for prop_key in selected_properties:
                    if getattr(job, "canceled", False):
                        return None

                    calculator = property_registry.get_calculator(prop_key)
                    if not calculator:
                        job.log(f"  Warning: Calculator for property '{prop_key}' not registered.")
                        completed_ops += 1
                        continue

                    display_name = getattr(adapter, "display_name", model_key)

                    # Model dependency missing fallback
                    if not valid_install and prop_key in (
                        "total_energy", "energy_per_atom", "forces", "stress_tensor", 
                        "bulk_modulus", "shear_modulus", "youngs_modulus"
                    ):
                        prop_res = {
                            "property_key": prop_key,
                            "property_name": getattr(calculator, "name", prop_key),
                            "category": getattr(calculator, "category", "General"),
                            "value": None,
                            "unit": getattr(calculator, "unit", ""),
                            "source_model": display_name,
                            "calculation_method": "N/A",
                            "status": "unavailable",
                            "inputs_used": [],
                            "warnings": [f"{display_name} package is not installed: {install_msg}"],
                            "limitations": "Model package must be installed to run direct calculations."
                        }
                    else:
                        try:
                            target_adapter = adapter if valid_install else None
                            res_obj = calculator.calculate(
                                structure_obj, 
                                model_adapter=target_adapter, 
                                settings=calc_context
                            )
                            prop_res = res_obj.to_dict() if hasattr(res_obj, "to_dict") else res_obj
                        except Exception as calc_e:
                            prop_res = {
                                "property_key": prop_key,
                                "property_name": getattr(calculator, "name", prop_key),
                                "category": getattr(calculator, "category", "General"),
                                "value": None,
                                "unit": getattr(calculator, "unit", ""),
                                "source_model": display_name,
                                "calculation_method": "N/A",
                                "status": "failed",
                                "warnings": [f"Calculation failed: {str(calc_e)}"],
                                "limitations": "Error during property evaluation."
                            }
                            if hasattr(job, "failed_count"):
                                job.failed_count += 1

                    prop_res["row_id"] = idx + 1
                    prop_res["formula"] = formula
                    prop_res["model"] = display_name

                    results.append(prop_res)
                    if hasattr(job, "completed_count"):
                        job.completed_count += 1
                    completed_ops += 1

                    if total_operations > 0:
                        job.progress_percent = min(99.0, (completed_ops / total_operations) * 100.0)

        # 5. Finalize Job Execution
        job.results = results
        job.progress_percent = 100.0
        job.status = JobState.COMPLETED if hasattr(JobState, "COMPLETED") else "completed"
        job.completed_at = time.time()
        job.current_operation = "Prediction completed successfully."
        job.log(f"Job finished. Evaluated {len(results)} total property results across {total_rows} rows.")

        # 6. Generate Export Files (CSV / ZIP)
        try:
            results_dir = getattr(settings, "RESULTS_DIR", settings.BASE_DIR / "prediction_results")
            generate_download_package(job.to_dict() if hasattr(job, "to_dict") else job.__dict__, results_dir)
        except Exception as dl_e:
            job.log(f"Download package generation warning: {dl_e}")

        return {"job_id": job_id, "status": "completed", "total_results": len(results)}

    except Exception as job_e:
        job.status = JobState.FAILED if hasattr(JobState, "FAILED") else "failed"
        if hasattr(job, "errors"):
            job.errors.append(str(job_e))
        job.log(f"Job execution encountered fatal error: {job_e}")
        return {"job_id": job_id, "status": "failed", "error": str(job_e)}


# If Celery is installed, wrap task as a Celery background task
if CELERY_AVAILABLE and celery_app:
    @celery_app.task(name="backend.workers.prediction_worker.celery_execute_job")
    def celery_execute_job(job_id: str, df_json: str, structures_json: List[Any]):
        df = pd.read_json(df_json)
        return execute_prediction_job(job_id, df, structures_json)


def start_prediction_background_worker(job_id: str, df: pd.DataFrame, structures: List[Any]):
    """
    Dispatcher function to start worker thread or trigger Celery task.
    """
    if CELERY_AVAILABLE and os.environ.get("USE_CELERY") == "1":
        celery_execute_job.delay(job_id, df.to_json(), structures)
    else:
        thread = threading.Thread(
            target=execute_prediction_job,
            args=(job_id, df, structures),
            daemon=True
        )
        thread.start()