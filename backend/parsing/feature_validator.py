"""Per-property requirement validator for the (unwired) prediction pipeline.

Role in the system
------------------
Enforces the "ionic conductivity excluded" policy and per-property requirement
maps. Used by services/prediction_service.py.
"""

from typing import Dict, List, Any  # type hints
import pandas as pd

# Define property input requirements
PROPERTY_REQUIREMENTS = {
    "total_energy": {"requires_structure": True, "requires_model": True},
    "energy_per_atom": {"requires_structure": True, "requires_model": True},
    "forces": {"requires_structure": True, "requires_model": True},
    "stress_tensor": {"requires_structure": True, "requires_model": True},
    "density": {"requires_structure": True, "requires_model": False},
    "volume": {"requires_structure": True, "requires_model": False},
    "composition_descriptors": {"requires_structure": False, "requires_formula_or_structure": True},
    "structural_descriptors": {"requires_structure": True, "requires_model": False},
    "bulk_modulus": {"requires_structure": True, "requires_model": True, "requires_strain": True},
    "shear_modulus": {"requires_structure": True, "requires_model": True, "requires_strain": True},
    "youngs_modulus": {"requires_structure": True, "requires_model": True, "requires_strain": True},
    "poisson_ratio": {"requires_structure": True, "requires_model": True, "requires_strain": True},
    "elastic_tensor": {"requires_structure": True, "requires_model": True, "requires_strain": True},
    "debye_temperature": {"requires_structure": True, "requires_model": True, "requires_strain": True},
    "band_gap": {"requires_electronic_data": True},
    "ionic_conductivity": {"unsupported": True, "reason": "Ionic conductivity predictions are explicitly excluded and unsupported."},
    "ionic_conductivity_activation_energy": {"unsupported": True, "reason": "Activation energy predictions are explicitly excluded and unsupported."},
}

def validate_row_features(row_dict: dict, selected_properties: List[str], has_valid_structure: bool, selected_model: str) -> dict:
    row_status = {}
    
    for prop_key in selected_properties:
        reqs = PROPERTY_REQUIREMENTS.get(prop_key, {})
        
        if reqs.get("unsupported", False):
            row_status[prop_key] = {
                "status": "unsupported",
                "valid": False,
                "message": reqs.get("reason", "Property is unsupported.")
            }
            continue

        if reqs.get("requires_structure") and not has_valid_structure:
            row_status[prop_key] = {
                "status": "missing_input",
                "valid": False,
                "message": "Valid crystal structure (CIF/POSCAR/XYZ) is required."
            }
            continue

        if reqs.get("requires_electronic_data"):
            row_status[prop_key] = {
                "status": "unavailable",
                "valid": False,
                "message": "Electronic band gap prediction requires external electronic dataset or dedicated electronic model."
            }
            continue

        row_status[prop_key] = {
            "status": "valid",
            "valid": True,
            "message": "All required inputs are available."
        }

    return row_status
