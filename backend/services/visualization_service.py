"""Visualization helpers for the prediction pipeline (unwired).

Role in the system
------------------
Helpers for rendering prediction results for the frontend. Part of the unwired
``/api/materials-prediction`` flow.
"""

from typing import Dict, Any, List  # type hints

def build_visualization_payload(job_results: List[dict]) -> dict:
    elastic_heatmaps = []
    eos_curves = []
    property_comparisons = {}

    for res in job_results:
        key = res.get("property_key")
        model = res.get("source_model")
        val = res.get("value")
        details = res.get("raw_details", {})

        # Elastic tensor heatmap
        if key == "elastic_tensor" and isinstance(val, list) and len(val) == 6:
            elastic_heatmaps.append({
                "formula": res.get("formula", "Unknown"),
                "model": model,
                "matrix_6x6": val,
                "labels": ["C11", "C22", "C33", "C44", "C55", "C66"]
            })

        # EOS curves
        if details and "eos_curve_points" in details:
            eos_curves.append({
                "formula": res.get("formula", "Unknown"),
                "model": model,
                "points": details["eos_curve_points"],
                "v0": details.get("equilibrium_volume_v0_ang3"),
                "b0": details.get("eos_bulk_modulus_b0_gpa"),
            })

        # Comparisons across models
        if isinstance(val, (int, float)):
            if key not in property_comparisons:
                property_comparisons[key] = []
            property_comparisons[key].append({
                "formula": res.get("formula", "Unknown"),
                "model": model,
                "value": float(val),
                "unit": res.get("unit"),
            })

    return {
        "elastic_tensor_heatmaps": elastic_heatmaps,
        "eos_curves": eos_curves,
        "property_comparisons": property_comparisons,
    }
