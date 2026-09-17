import os
import uuid
import pandas as pd
from typing import Dict, Any, List, Optional
from core.config import settings
from core.exceptions import DatasetValidationError, PropertyUnsupportedError
from core.job_manager import job_manager, JobState
from workers.prediction_worker import start_prediction_background_worker
from parsing.structure_parser import parse_structure_input
from prediction_models.model_registry import model_registry
from properties.property_registry import property_registry

# In-memory dataset cache for uploaded datasets
DATASET_CACHE: Dict[str, dict] = {}
CATEGORY_TO_KEYS = {
    "mechanical": [
        "bulk_modulus", "shear_modulus", "youngs_modulus",
        "poisson_ratio", "elastic_tensor", "elastic_anisotropy", "compressibility",
    ],
    "thermal": ["thermal", "debye_temperature", "thermal_conductivity"],
    "electrical": ["band_gap", "electronic_state"],
}

MECHANICAL_KEYS = set(CATEGORY_TO_KEYS["mechanical"])


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


# ---------------------------------------------------------------------------
# Single-structure, synchronous prediction path (instant result, no job queue)
# ---------------------------------------------------------------------------

BASE_OUTPUT_KEYS = ["total_energy", "energy_per_atom", "atomic_forces", "stress_tensor"]


class PredictionService:
    """Synchronous single-structure prediction path (instant result, no job queue)."""

    async def predict_from_cif(
        self,
        cif_string: str,
        model_name: str = "chgnet",
        requested_properties: Optional[List[str]] = None,
    ) -> Dict[str, Any]:
        # 1. Parse structure
        structure_obj, struct_meta = parse_structure_input(cif_string)
        if not struct_meta.get("valid", False):
            raise ValueError(struct_meta.get("error", "Invalid or unparseable CIF content."))

        # 2. Resolve model adapter
        adapter = model_registry.get_adapter(model_name)
        if not adapter:
            raise ValueError(f"Unknown model '{model_name}'. Available: {list(model_registry.adapters.keys())}")

        valid_install, install_msg = True, "OK"
        if hasattr(adapter, "validate_model_installation"):
            valid_install, install_msg = adapter.validate_model_installation()
        if not valid_install:
            raise ValueError(f"Model '{model_name}' is not available: {install_msg}")

        # 3. Determine which properties to compute
        if not requested_properties:
            requested_properties = [
                k for k in property_registry.calculators.keys()
                if k not in ("ionic_conductivity", "ionic_conductivity_activation_energy")
            ]
        else:
            # Expand category names (e.g. "mechanical") into actual registry keys
            expanded = []
            for p in requested_properties:
                key = p.strip().lower()
                if key in CATEGORY_TO_KEYS:
                    expanded.extend(CATEGORY_TO_KEYS[key])
                else:
                    expanded.append(key)
            requested_properties = list(dict.fromkeys(expanded))  # dedupe, preserve order

        base_outputs: Dict[str, Any] = {}
        properties: Dict[str, Any] = {}

        # Compute the strain-response simulation once (if any mechanical property was
        # requested) instead of letting each of the 7 mechanical calculators re-run
        # the full deformed-structure / CHGNet stress simulation independently.
        precomputed_strain_response = None
        if any(k in MECHANICAL_KEYS for k in requested_properties):
            try:
                from calculations.strain_response import run_strain_response_calculation
                precomputed_strain_response = run_strain_response_calculation(adapter, structure_obj, None)
            except Exception as e:
                precomputed_strain_response = {
                    "status": "failed",
                    "error": str(e),
                    "warnings": [f"Strain response simulation failed: {str(e)}"],
                }

        for prop_key in requested_properties:
            calculator = property_registry.get_calculator(prop_key)
            if not calculator:
                continue

            calc_settings = None
            if prop_key in MECHANICAL_KEYS and precomputed_strain_response is not None:
                calc_settings = {"precomputed_strain_response": precomputed_strain_response}

            try:
                res_obj = calculator.calculate(structure_obj, model_adapter=adapter, settings=calc_settings)
                result = res_obj.to_dict() if hasattr(res_obj, "to_dict") else res_obj
            except Exception as e:
                result = {
                    "property_key": prop_key,
                    "status": "failed",
                    "value": None,
                    "warnings": [f"Calculation failed: {str(e)}"],
                }

            if prop_key in BASE_OUTPUT_KEYS:
                base_outputs[prop_key] = result
            else:
                properties[prop_key] = result

        # 4. Structure metadata
        material_metadata = {
            "formula": structure_obj.composition.reduced_formula,
            "volume_A3": float(structure_obj.volume),
            "density_g_cm3": float(structure_obj.density),
            "num_sites": len(structure_obj),
        }

        return {
            "material_metadata": material_metadata,
            "model_used": getattr(adapter, "display_name", model_name),
            "base_outputs": base_outputs,
            "properties": properties,
        }