from typing import Dict, Optional, List
from properties.base_property import BasePropertyCalculator
from properties.direct_outputs import (
    TotalEnergyCalculator, EnergyPerAtomCalculator, AtomicForcesCalculator, StressTensorCalculator
)
from properties.mechanical_properties import MechanicalPropertyCalculator
from properties.thermal_properties import ThermalPropertyCalculator, DebyeTemperatureCalculator, ThermalConductivityCalculator
from properties.electrical_properties import (
    BandGapCalculator, ElectronicStateClassifier, ExcludedIonicConductivityCalculator, ExcludedActivationEnergyCalculator
)
from properties.composition_properties import CompositionDescriptorsCalculator
from properties.structural_properties import StructuralDescriptorsCalculator

class PropertyRegistry:
    def __init__(self):
        self.calculators: Dict[str, BasePropertyCalculator] = {}
        self._register_default_calculators()

    def _register_default_calculators(self):
        # Direct Outputs
        self.register(TotalEnergyCalculator())
        self.register(EnergyPerAtomCalculator())
        self.register(AtomicForcesCalculator())
        self.register(StressTensorCalculator())

        # Composition & Structure
        self.register(CompositionDescriptorsCalculator())
        self.register(StructuralDescriptorsCalculator())

        # Mechanical Properties (Strain Perturbation response)
        self.register(MechanicalPropertyCalculator("bulk_modulus", "Bulk Modulus (VRH)", "GPa", "Voigt-Reuss-Hill bulk modulus calculated via strain-stress perturbations."))
        self.register(MechanicalPropertyCalculator("shear_modulus", "Shear Modulus (VRH)", "GPa", "Voigt-Reuss-Hill shear modulus calculated via strain-stress perturbations."))
        self.register(MechanicalPropertyCalculator("youngs_modulus", "Young's Modulus", "GPa", "Isotropic Young's modulus evaluated from elastic constants."))
        self.register(MechanicalPropertyCalculator("poisson_ratio", "Poisson's Ratio", "dimensionless", "Isotropic Poisson's ratio evaluated from elastic constants."))
        self.register(MechanicalPropertyCalculator("elastic_tensor", "Elastic Tensor (Cij)", "GPa", "Full 6x6 elastic stiffness tensor matrix."))
        self.register(MechanicalPropertyCalculator("elastic_anisotropy", "Elastic Anisotropy", "dimensionless", "Universal elastic anisotropy index AU."))
        self.register(MechanicalPropertyCalculator("compressibility", "Compressibility", "GPa^-1", "Volumetric compressibility beta = 1/K."))

        # Thermal
        self.register(DebyeTemperatureCalculator())
        self.register(ThermalConductivityCalculator())
        self.register(ThermalPropertyCalculator())
        self.register(DebyeTemperatureCalculator())
        self.register(ThermalConductivityCalculator())

        # Electrical
        self.register(BandGapCalculator())
        self.register(ElectronicStateClassifier())

        # Excluded Properties (Registered to return explicit unsupported validation error)
        self.register(ExcludedIonicConductivityCalculator())
        self.register(ExcludedActivationEnergyCalculator())

    def register(self, calculator: BasePropertyCalculator):
        self.calculators[calculator.key] = calculator

    def get_calculator(self, key: str) -> Optional[BasePropertyCalculator]:
        return self.calculators.get(key.lower().strip())

    def list_properties(self) -> List[dict]:
        props = []
        for calc in self.calculators.values():
            props.append({
                "key": calc.key,
                "name": calc.name,
                "category": calc.category,
                "unit": calc.unit,
                "description": calc.description,
                "unsupported": calc.key in ("ionic_conductivity", "ionic_conductivity_activation_energy")
            })
        return props

property_registry = PropertyRegistry()
