import os
import tempfile
from typing import Any, Optional
from pymatgen.core import Structure

try:
    from backend.properties.base_property import BasePropertyCalculator, PropertyResult
    from backend import model_service
except ImportError:
    from properties.base_property import BasePropertyCalculator, PropertyResult
    import model_service

class IonicConductivityCalculator(BasePropertyCalculator):
    def __init__(
        self, 
        key: str = "ionic_conductivity", 
        name: str = "Ionic Conductivity & Activation Energy", 
        unit: str = "mS/cm", 
        description: str = "Predicts ionic conductivity and activation energy using v5_base_model"
    ):
        super().__init__(
            key=key, 
            name=name, 
            category="transport", 
            unit=unit, 
            description=description
        )

    def calculate(
        self, 
        structure: Structure, 
        model_adapter: Optional[Any] = None, 
        settings: Optional[dict] = None
    ) -> PropertyResult:
        settings = settings or {}
        target_temp_k = settings.get("temperature_k", 298.15)  # Default room temp (25°C)
        
        display_name = "IonCast-v5/v6 OBLiEx workflow"

        temp_path = None
        try:
            if model_service.v5_base_models is None:
                model_service.load_models()

            with tempfile.NamedTemporaryFile(delete=False, suffix=".cif", mode="w", encoding="utf-8") as tmp:
                tmp.write(structure.to(fmt="cif"))
                temp_path = tmp.name

            pred = model_service.predict_from_cif(temp_path, target_temp_k)
            if pred.get("status") != "success":
                raise ValueError(pred.get("error", "IonCast prediction failed."))

            conductivity_s_cm = float(pred["conductivity"])
            conductivity_ms_cm = conductivity_s_cm * 1000.0
            activation_energy = float(pred["Ea"])

            raw_details = {
                "activation_energy_ev": activation_energy,
                "logA": float(pred.get("logA", 0.0)),
                "temperature_k": float(target_temp_k),
                "conductivity_s_cm": conductivity_s_cm,
                "base_conductivity_s_cm": float(pred.get("base_conductivity", conductivity_s_cm)),
                "corrected_conductivity_s_cm": float(pred.get("corrected_conductivity", conductivity_s_cm)),
                "corrector_applied": bool(pred.get("corrector_applied")),
                "corrector_log10_delta": float(pred.get("corrector_log10_delta", 0.0)),
                "feature_coverage": pred.get("feature_coverage"),
            }

            return PropertyResult(
                property_key=self.key,
                property_name=self.name,
                category=self.category,
                value=float(conductivity_ms_cm),
                unit=self.unit,
                source_model=display_name,
                calculation_method="obliex_cif_descriptors_v5_stack_v6_residual",
                status="calculated",
                inputs_used=["structure", f"temperature_{target_temp_k}K"],
                warnings=pred.get("warnings", []),
                raw_details=raw_details
            )

        except Exception as e:
            return PropertyResult(
                property_key=self.key,
                property_name=self.name,
                category=self.category,
                value=None,
                unit=self.unit,
                source_model=display_name,
                calculation_method="obliex_cif_descriptors_v5_stack_v6_residual",
                status="failed",
                warnings=[f"Ionic conductivity calculation failed: {str(e)}"]
            )
        finally:
            if temp_path and os.path.exists(temp_path):
                os.remove(temp_path)
