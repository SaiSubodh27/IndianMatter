from typing import Any, Optional

# Fixed relative / absolute imports according to backend layout
try:
    from backend.properties.base_property import BasePropertyCalculator, PropertyResult
    from backend.calculations.strain_response import run_strain_response_calculation
except ImportError:
    from properties.base_property import BasePropertyCalculator, PropertyResult
    from calculations.strain_response import run_strain_response_calculation


class MechanicalPropertyCalculator(BasePropertyCalculator):
    def __init__(self, key: str, name: str, unit: str, description: str):
        super().__init__(
            key=key, 
            name=name, 
            category="mechanical", 
            unit=unit, 
            description=description
        )

    def calculate(
        self, 
        structure: Any, 
        model_adapter: Optional[Any] = None, 
        settings: Optional[dict] = None
    ) -> PropertyResult:
        # 1. Safely resolve model adapter display name
        display_name = (
            getattr(model_adapter, "display_name", None) 
            or getattr(model_adapter, "name", None) 
            or "Unknown_Model"
        )

        # 2. Validate input adapter availability
        if model_adapter is None:
            return PropertyResult(
                property_key=self.key,
                property_name=self.name,
                category=self.category,
                value=None,
                unit=self.unit,
                source_model="N/A",
                calculation_method="N/A",
                status="failed",
                warnings=["Atomistic model adapter is required for strain perturbations."]
            )

        # 3. Validate input structure
        if structure is None:
            return PropertyResult(
                property_key=self.key,
                property_name=self.name,
                category=self.category,
                value=None,
                unit=self.unit,
                source_model=display_name,
                calculation_method="N/A",
                status="failed",
                warnings=["Invalid or empty structure passed for mechanical property evaluation."]
            )

        # 4. Check for pre-calculated strain response in execution context
        ctx = settings or {}
        mech_res = ctx.get("precomputed_strain_response")
        
        if not mech_res:
            try:
                strain_settings = ctx.get("strain_settings")
                mech_res = run_strain_response_calculation(model_adapter, structure, strain_settings)
            except Exception as e:
                return PropertyResult(
                    property_key=self.key,
                    property_name=self.name,
                    category=self.category,
                    value=None,
                    unit=self.unit,
                    source_model=display_name,
                    calculation_method="strain_response_simulation",
                    status="failed",
                    warnings=[f"Strain response simulation failed: {str(e)}"]
                )

        # 5. Handle failed strain response outputs
        if not isinstance(mech_res, dict) or mech_res.get("status") == "failed":
            warnings_list = mech_res.get("warnings", []) if isinstance(mech_res, dict) else []
            error_msg = mech_res.get("error", "Calculation failed.") if isinstance(mech_res, dict) else "Invalid result format."
            if not warnings_list:
                warnings_list = [error_msg]

            return PropertyResult(
                property_key=self.key,
                property_name=self.name,
                category=self.category,
                value=None,
                unit=self.unit,
                source_model=display_name,
                calculation_method="strain_response_simulation",
                status="failed",
                warnings=warnings_list
            )

        # 6. Map requested mechanical key to value
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
            property_key=self.key,
            property_name=self.name,
            category=self.category,
            value=val,
            unit=self.unit,
            source_model=display_name,
            calculation_method="strain_response_simulation",
            status=mech_res.get("status", "calculated"),
            inputs_used=["deformed_structure_set", "stress_response", "elastic_tensor_fit"],
            warnings=mech_res.get("warnings", []),
            raw_details=mech_res
        )