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
            global IONIC_MODELS
            if 'IONIC_MODELS' not in globals() or IONIC_MODELS is None:
                try:
                    from backend.predict_ionic_conductivity import load_models
                except ImportError:
                    from predict_ionic_conductivity import load_models
                IONIC_MODELS = load_models()

            with tempfile.NamedTemporaryFile(delete=False, suffix=".cif", mode="w", encoding="utf-8") as tmp:
                tmp.write(structure.to(fmt="cif"))
                temp_path = tmp.name

            try:
                from backend.predict_ionic_conductivity import predict_one, AlignOpts
            except ImportError:
                from predict_ionic_conductivity import predict_one, AlignOpts
            
            import pathlib
            opts = AlignOpts(strict=False)
            pred = predict_one(pathlib.Path(temp_path), target_temp_k, IONIC_MODELS, apply_corrector=True, opts=opts)

            cond = pred["conductivity"]
            m_out = pred["model_outputs"]
            corr = cond.get("corrected") or {}
            
            conductivity_s_cm = corr.get("corrected_conductivity_S_per_cm", cond.get("base_conductivity_S_per_cm", 0.0))
            conductivity_ms_cm = conductivity_s_cm * 1000.0
            activation_energy = m_out.get("Ea_eV", 0.0)

            raw_details = {
                "activation_energy_ev": activation_energy,
                "logA": m_out.get("log10_A", 0.0),
                "temperature_k": float(target_temp_k),
                "conductivity_s_cm": conductivity_s_cm,
                "base_conductivity_s_cm": cond.get("base_conductivity_S_per_cm", 0.0),
                "corrected_conductivity_s_cm": corr.get("corrected_conductivity_S_per_cm", 0.0),
                "corrector_applied": bool(corr),
                "corrector_log10_delta": corr.get("predicted_residual_log10_S_per_cm", 0.0) if corr else 0.0,
                "reliability_status": pred.get("reliability", {}).get("status", "OK"),
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
