from typing import Any, Optional
from properties.base_property import BasePropertyCalculator, PropertyResult
from calculations.strain_response import run_strain_response_calculation

class MechanicalPropertyCalculator(BasePropertyCalculator):
    def __init__(self, key: str, name: str, unit: str, description: str):
        super().__init__(key=key, name=name, category="mechanical", unit=unit, description=description)

    def calculate(self, structure: Any, model_adapter: Optional[Any] = None, settings: Optional[dict] = None) -> PropertyResult:
        if model_adapter is None:
            return PropertyResult(
                property_key=self.key, property_name=self.name, category=self.category,
                value=None, unit=self.unit, source_model="N/A", calculation_method="N/A",
                status="failed", warnings=["Atomistic model adapter is required for strain perturbations."]
            )

        # Check if pre-calculated strain response dictionary exists in settings
        ctx = settings or {}
        mech_res = ctx.get("precomputed_strain_response")
        if not mech_res:
            mech_res = run_strain_response_calculation(model_adapter, structure, ctx.get("strain_settings"))

        if mech_res.get("status") == "failed":
            return PropertyResult(
                property_key=self.key, property_name=self.name, category=self.category,
                value=None, unit=self.unit, source_model=model_adapter.display_name,
                calculation_method="strain_response_simulation", status="failed",
                warnings=mech_res.get("warnings", [mech_res.get("error", "Calculation failed.")])
            )

        val_map = {
            "bulk_modulus": mech_res.get("bulk_modulus_gpa"),
            "shear_modulus": mech_res.get("shear_modulus_gpa"),
            "youngs_modulus": mech_res.get("youngs_modulus_gpa"),
            "poisson_ratio": mech_res.get("poisson_ratio"),
            "compressibility": mech_res.get("compressibility_gpa_inv"),
            "elastic_anisotropy": mech_res.get("elastic_anisotropy"),
            "elastic_tensor": mech_res.get("elastic_tensor_6x6_gpa"),
        }

        val = val_map.get(self.key)

        return PropertyResult(
            property_key=self.key, property_name=self.name, category=self.category,
            value=val, unit=self.unit, source_model=model_adapter.display_name,
            calculation_method="strain_response_simulation",
            status=mech_res.get("status", "calculated"),
            inputs_used=["deformed_structure_set", "stress_response", "elastic_tensor_fit"],
            warnings=mech_res.get("warnings", []),
            raw_details=mech_res
        )
