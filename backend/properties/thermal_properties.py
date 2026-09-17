import numpy as np
from typing import Any, Optional
from pymatgen.core import Structure
from pymatgen.analysis.eos import BirchMurnaghan

try:
    from backend.properties.base_property import BasePropertyCalculator, PropertyResult
except ImportError:
    from properties.base_property import BasePropertyCalculator, PropertyResult


class ThermalPropertyCalculator(BasePropertyCalculator):
    def __init__(
        self, 
        key: str = "thermal", 
        name: str = "Birch-Murnaghan EOS", 
        unit: str = "GPa", 
        description: str = "Fits volume-energy curves to Birch-Murnaghan Equation of State"
    ):
        super().__init__(
            key=key, 
            name=name, 
            category="thermal", 
            unit=unit, 
            description=description
        )

    def calculate(
        self, 
        structure: Structure, 
        model_adapter: Optional[Any] = None, 
        settings: Optional[dict] = None
    ) -> PropertyResult:
        display_name = (
            getattr(model_adapter, "display_name", None) 
            or getattr(model_adapter, "name", None) 
            or "Unknown_Model"
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
                warnings=["Atomistic model adapter is required for EOS volume scaling."]
            )

        volumes = []
        energies = []
        scale_factors = [0.95, 0.98, 1.0, 1.02, 1.05]

        try:
            for scale in scale_factors:
                s = structure.copy()
                s.scale_lattice(structure.volume * scale)
                
                if hasattr(model_adapter, "predict_structure"):
                    pred = model_adapter.predict_structure(s)
                else:
                    raise AttributeError(f"Adapter '{display_name}' missing structure prediction interface.")

                e_per_atom = pred.get("energy_per_atom", 0.0)
                volumes.append(float(s.volume))
                energies.append(float(e_per_atom * len(s)))

            # Fit Birch-Murnaghan Equation of State
            eos = BirchMurnaghan(volumes=volumes, energies=energies)
            eos.fit()

            b0_gpa = float(eos.b0 * 160.21766208)

            raw_details = {
                "e0": float(eos.e0),
                "v0_equilibrium": float(eos.v0),
                "b0_eos_gpa": b0_gpa,
                "b1_prime": float(eos.b1),
                "volumes": volumes,
                "energies": energies
            }

            return PropertyResult(
                property_key=self.key,
                property_name=self.name,
                category=self.category,
                value=b0_gpa,
                unit=self.unit,
                source_model=display_name,
                calculation_method="birch_murnaghan_eos",
                status="calculated",
                inputs_used=["scaled_structures", "energy_volume_curve"],
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
                calculation_method="birch_murnaghan_eos",
                status="failed",
                warnings=[f"EOS fitting failed: {str(e)}"]
            )
class DebyeTemperatureCalculator(BasePropertyCalculator):
    def __init__(
        self,
        key: str = "debye_temperature",
        name: str = "Debye Temperature",
        unit: str = "K",
        description: str = "Debye temperature estimated from elastic/acoustic properties."
    ):
        super().__init__(
            key=key,
            name=name,
            category="thermal",
            unit=unit,
            description=description
        )

    def calculate(
        self,
        structure: Structure,
        model_adapter: Optional[Any] = None,
        settings: Optional[dict] = None
    ) -> PropertyResult:
        display_name = (
            getattr(model_adapter, "display_name", None)
            or getattr(model_adapter, "name", None)
            or "Unknown_Model"
        )
        return PropertyResult(
            property_key=self.key,
            property_name=self.name,
            category=self.category,
            value=None,
            unit=self.unit,
            source_model=display_name,
            calculation_method="N/A",
            status="unavailable",
            warnings=["Debye temperature calculation is not yet implemented."]
        )


class ThermalConductivityCalculator(BasePropertyCalculator):
    def __init__(
        self,
        key: str = "thermal_conductivity",
        name: str = "Thermal Conductivity",
        unit: str = "W/m·K",
        description: str = "Lattice thermal conductivity estimated from phonon/elastic properties."
    ):
        super().__init__(
            key=key,
            name=name,
            category="thermal",
            unit=unit,
            description=description
        )

    def calculate(
        self,
        structure: Structure,
        model_adapter: Optional[Any] = None,
        settings: Optional[dict] = None
    ) -> PropertyResult:
        display_name = (
            getattr(model_adapter, "display_name", None)
            or getattr(model_adapter, "name", None)
            or "Unknown_Model"
        )
        return PropertyResult(
            property_key=self.key,
            property_name=self.name,
            category=self.category,
            value=None,
            unit=self.unit,
            source_model=display_name,
            calculation_method="N/A",
            status="unavailable",
            warnings=["Thermal conductivity calculation is not yet implemented."]
        )