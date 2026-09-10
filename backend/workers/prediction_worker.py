import time
import threading
import pandas as pd
from typing import List, Dict, Any
from core.job_manager import job_manager, JobState
from prediction_models.model_registry import model_registry
from properties.property_registry import property_registry
from parsing.structure_parser import parse_structure_input
from services.download_service import generate_download_package
from core.config import settings

def execute_prediction_job(job_id: str, df: pd.DataFrame, structures: List[Any]):
    job = job_manager.get_job(job_id)
    if not job:
        return

    job.status = "running"
    job.log("Starting prediction execution worker...")

    total_rows = min(len(df), settings.MAX_CSV_ROWS)
    total_operations = total_rows * max(len(job.selected_models), 1) * len(job.selected_properties)
    completed_ops = 0

    results = []

    try:
        for idx in range(total_rows):
            if job.canceled:
                job.log("Execution stopped due to job cancellation.")
                return

            row = df.iloc[idx].to_dict()
            formula = str(row.get("formula", row.get("composition", f"Material_{idx+1}")))
            raw_struct = structures[idx] if idx < len(structures) else row.get("cif") or row.get("structure")

            # Parse structure
            structure_obj, struct_meta = parse_structure_input(raw_struct)
            has_valid_struct = struct_meta.get("valid", False)

            job.current_operation = f"Processing row {idx+1}/{total_rows}: {formula}"
            job.log(f"Row {idx+1}/{total_rows} ({formula}): Structure {'valid' if has_valid_struct else 'invalid/missing'}")

            for model_key in job.selected_models:
                adapter = model_registry.get_adapter(model_key)
                
                # Check adapter availability
                if not adapter:
                    job.log(f"  Warning: Model '{model_key}' not found in registry.")
                    continue

                valid_install, install_msg = adapter.validate_model_installation()
                
                # Precompute strain response if mechanical properties requested and adapter is available
                precomputed_strain = None
                if valid_install and has_valid_struct:
                    requires_strain = any(p in ("bulk_modulus", "shear_modulus", "youngs_modulus", "poisson_ratio", "elastic_tensor", "debye_temperature") for p in job.selected_properties)
                    if requires_strain:
                        job.log(f"  Running strain-perturbation simulation for {formula} using {adapter.display_name}...")
                        try:
                            from calculations.strain_response import run_strain_response_calculation
                            precomputed_strain = run_strain_response_calculation(adapter, structure_obj, job.settings.get("strain_settings"))
                        except Exception as strain_e:
                            job.log(f"  Strain calculation warning for {formula}: {strain_e}")

                calc_context = {
                    "strain_settings": job.settings.get("strain_settings"),
                    "precomputed_strain_response": precomputed_strain,
                    "device": job.settings.get("device", "auto"),
                }

                for prop_key in job.selected_properties:
                    if job.canceled:
                        return

                    calculator = property_registry.get_calculator(prop_key)
                    if not calculator:
                        job.log(f"  Warning: Calculator for property '{prop_key}' not registered.")
                        completed_ops += 1
                        continue

                    # If model not installed but property requires model
                    if not valid_install and prop_key in ("total_energy", "energy_per_atom", "forces", "stress_tensor", "bulk_modulus", "shear_modulus", "youngs_modulus", "poisson_ratio", "elastic_tensor"):
                        prop_res = {
                            "property_key": prop_key,
                            "property_name": calculator.name,
                            "category": calculator.category,
                            "value": None,
                            "unit": calculator.unit,
                            "source_model": adapter.display_name,
                            "calculation_method": "N/A",
                            "status": "unavailable",
                            "inputs_used": [],
                            "warnings": [f"{adapter.display_name} package is not installed: {install_msg}"],
                            "limitations": "Model package must be installed to run direct calculations."
                        }
                    else:
                        try:
                            # Execute calculator
                            target_adapter = adapter if valid_install else None
                            res_obj = calculator.calculate(structure_obj, model_adapter=target_adapter, settings=calc_context)
                            prop_res = res_obj.to_dict()
                        except Exception as calc_e:
                            prop_res = {
                                "property_key": prop_key,
                                "property_name": calculator.name,
                                "category": calculator.category,
                                "value": None,
                                "unit": calculator.unit,
                                "source_model": adapter.display_name,
                                "calculation_method": "N/A",
                                "status": "failed",
                                "warnings": [f"Calculation failed: {str(calc_e)}"],
                                "limitations": "Error during property evaluation."
                            }
                            job.failed_count += 1

                    prop_res["row_id"] = idx + 1
                    prop_res["formula"] = formula
                    prop_res["model"] = adapter.display_name

                    results.append(prop_res)
                    job.completed_count += 1
                    completed_ops += 1

                    if total_operations > 0:
                        job.progress_percent = min(99.0, (completed_ops / total_operations) * 100.0)

        job.results = results
        job.progress_percent = 100.0
        job.status = "completed"
        job.completed_at = time.time()
        job.current_operation = "Prediction completed successfully."
        job.log(f"Job finished. Evaluated {len(results)} total property results across {total_rows} rows.")

        # Generate download files
        try:
            generate_download_package(job.to_dict(), settings.RESULTS_DIR)
        except Exception as dl_e:
            job.log(f"Download package generation warning: {dl_e}")

    except Exception as job_e:
        job.status = "failed"
        job.errors.append(str(job_e))
        job.log(f"Job execution encountered fatal error: {job_e}")

def start_prediction_background_worker(job_id: str, df: pd.DataFrame, structures: List[Any]):
    thread = threading.Thread(
        target=execute_prediction_job,
        args=(job_id, df, structures),
        daemon=True
    )
    thread.start()
