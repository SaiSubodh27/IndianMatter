import numpy as np
from typing import Any, Optional
from pymatgen.core import Structure

try:
    from backend.properties.base_property import BasePropertyCalculator, PropertyResult
except ImportError:
    from properties.base_property import BasePropertyCalculator, PropertyResult

# Boltzmann constant in eV/K
KB = 8.617333262145e-5


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
        
        display_name = (
            getattr(model_adapter, "display_name", None) 
            or getattr(model_adapter, "name", None) 
            or "v5_base_model"
        )

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
                warnings=["v5_base_model adapter is required for transport calculations."]
            )

        try:
            # Dispatch prediction to v5_base_model adapter
            if hasattr(model_adapter, "predict_ionic_transport"):
                pred = model_adapter.predict_ionic_transport(structure, temperature=target_temp_k)
            elif hasattr(model_adapter, "predict_structure"):
                pred = model_adapter.predict_structure(structure)
            else:
                raise AttributeError(f"Adapter '{display_name}' missing transport prediction interface.")

            # Extract or infer activation energy (Ea in eV) and pre-exponential factor (sigma_0)
            activation_energy = pred.get("activation_energy_ev", pred.get("ea", 0.45))
            conductivity_ms_cm = pred.get("ionic_conductivity_ms_cm", None)

            # Fallback Arrhenius calculation if direct conductivity isn't returned: sigma = (sigma_0 / T) * exp(-Ea / kBT)
            if conductivity_ms_cm is None:
                sigma_0 = pred.get("pre_exponential_factor", 1e5)  # mS*K/cm baseline
                conductivity_ms_cm = (sigma_0 / target_temp_k) * np.exp(-activation_energy / (KB * target_temp_k))

            raw_details = {
                "activation_energy_ev": float(activation_energy),
                "temperature_k": float(target_temp_k),
                "diffusivity_cm2_s": pred.get("diffusivity_cm2_s", None),
                "carrier_concentration": pred.get("carrier_concentration", None)
            }

            return PropertyResult(
                property_key=self.key,
                property_name=self.name,
                category=self.category,
                value=float(conductivity_ms_cm),
                unit=self.unit,
                source_model=display_name,
                calculation_method="v5_base_model_arrhenius",
                status="calculated",
                inputs_used=["structure", f"temperature_{target_temp_k}K"],
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
                calculation_method="v5_base_model_arrhenius",
                status="failed",
                warnings=[f"Ionic conductivity calculation failed: {str(e)}"]
            )