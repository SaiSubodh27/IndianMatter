"""Direct-output property calculators (energy, forces, stress).

Role in the system
------------------
``TotalEnergy``, ``EnergyPerAtom``, ``AtomicForces``, ``StressTensor``
calculators that delegate to a model adapter (CHGNet/M3GNet/MACE). Part of
the (unwired) ``/api/materials-prediction`` property pipeline.
"""

import numpy as np  # numerical arrays for forces/stress
from typing import Any, Optional, Dict
from properties.base_property import BasePropertyCalculator, PropertyResult

class TotalEnergyCalculator(BasePropertyCalculator):
    def __init__(self):
        super().__init__(
            key="total_energy",
            name="Total Energy",
            category="direct_outputs",
            unit="eV",
            description="Total potential energy evaluated by the atomistic neural network model."
        )

    def calculate(self, structure: Any, model_adapter: Optional[Any] = None, settings: Optional[dict] = None) -> PropertyResult:
        if model_adapter is None:
            return PropertyResult(
                property_key=self.key, property_name=self.name, category=self.category,
                value=None, unit=self.unit, source_model="N/A", calculation_method="N/A",
                status="failed", warnings=["Atomistic model adapter is required."]
            )
        try:
            val = model_adapter.predict_energy(structure)
            return PropertyResult(
                property_key=self.key, property_name=self.name, category=self.category,
                value=round(float(val), 4), unit=self.unit, source_model=model_adapter.display_name,
                calculation_method="direct_atomistic_model_evaluation", status="calculated",
                inputs_used=["crystal_structure", "atomic_species", "lattice"],
                warnings=[]
            )
        except Exception as e:
            return PropertyResult(
                property_key=self.key, property_name=self.name, category=self.category,
                value=None, unit=self.unit, source_model=model_adapter.display_name, calculation_method="N/A",
                status="failed", warnings=[f"Prediction failed: {e}"]
            )

class EnergyPerAtomCalculator(BasePropertyCalculator):
    def __init__(self):
        super().__init__(
            key="energy_per_atom",
            name="Energy Per Atom",
            category="direct_outputs",
            unit="eV/atom",
            description="Total potential energy normalized by the number of atoms in the unit cell."
        )

    def calculate(self, structure: Any, model_adapter: Optional[Any] = None, settings: Optional[dict] = None) -> PropertyResult:
        if model_adapter is None:
            return PropertyResult(
                property_key=self.key, property_name=self.name, category=self.category,
                value=None, unit=self.unit, source_model="N/A", calculation_method="N/A",
                status="failed", warnings=["Atomistic model adapter is required."]
            )
        try:
            tot_e = model_adapter.predict_energy(structure)
            n_atoms = len(structure)
            val = tot_e / max(n_atoms, 1)
            return PropertyResult(
                property_key=self.key, property_name=self.name, category=self.category,
                value=round(float(val), 4), unit=self.unit, source_model=model_adapter.display_name,
                calculation_method="derived_from_total_energy", status="derived",
                inputs_used=["total_energy", "num_atoms"],
                warnings=[]
            )
        except Exception as e:
            return PropertyResult(
                property_key=self.key, property_name=self.name, category=self.category,
                value=None, unit=self.unit, source_model=model_adapter.display_name, calculation_method="N/A",
                status="failed", warnings=[f"Prediction failed: {e}"]
            )

class AtomicForcesCalculator(BasePropertyCalculator):
    def __init__(self):
        super().__init__(
            key="forces",
            name="Forces on Atoms",
            category="direct_outputs",
            unit="eV/Angstrom",
            description="Vector forces on each atom in the cell [N_atoms, 3]."
        )

    def calculate(self, structure: Any, model_adapter: Optional[Any] = None, settings: Optional[dict] = None) -> PropertyResult:
        if model_adapter is None:
            return PropertyResult(
                property_key=self.key, property_name=self.name, category=self.category,
                value=None, unit=self.unit, source_model="N/A", calculation_method="N/A",
                status="failed", warnings=["Atomistic model adapter is required."]
            )
        try:
            forces = model_adapter.predict_forces(structure)
            max_force = float(np.max(np.linalg.norm(forces, axis=1)))
            return PropertyResult(
                property_key=self.key, property_name=self.name, category=self.category,
                value=forces.tolist(), unit=self.unit, source_model=model_adapter.display_name,
                calculation_method="direct_atomistic_model_gradient", status="calculated",
                inputs_used=["crystal_structure"],
                raw_details={"max_force_norm_ev_ang": round(max_force, 4), "shape": list(forces.shape)}
            )
        except Exception as e:
            return PropertyResult(
                property_key=self.key, property_name=self.name, category=self.category,
                value=None, unit=self.unit, source_model=model_adapter.display_name, calculation_method="N/A",
                status="failed", warnings=[f"Prediction failed: {e}"]
            )

class StressTensorCalculator(BasePropertyCalculator):
    def __init__(self):
        super().__init__(
            key="stress_tensor",
            name="Stress Tensor",
            category="direct_outputs",
            unit="GPa",
            description="Full 3x3 Cauchy stress tensor evaluated by the model."
        )

    def calculate(self, structure: Any, model_adapter: Optional[Any] = None, settings: Optional[dict] = None) -> PropertyResult:
        if model_adapter is None:
            return PropertyResult(
                property_key=self.key, property_name=self.name, category=self.category,
                value=None, unit=self.unit, source_model="N/A", calculation_method="N/A",
                status="failed", warnings=["Atomistic model adapter is required."]
            )
        try:
            stress = model_adapter.predict_stress(structure)
            hydrostatic_p = -float(np.trace(stress)) / 3.0
            return PropertyResult(
                property_key=self.key, property_name=self.name, category=self.category,
                value=np.round(stress, 4).tolist(), unit=self.unit, source_model=model_adapter.display_name,
                calculation_method="direct_virial_stress_prediction", status="calculated",
                inputs_used=["crystal_structure"],
                raw_details={"hydrostatic_pressure_gpa": round(hydrostatic_p, 4)}
            )
        except Exception as e:
            return PropertyResult(
                property_key=self.key, property_name=self.name, category=self.category,
                value=None, unit=self.unit, source_model=model_adapter.display_name, calculation_method="N/A",
                status="failed", warnings=[f"Prediction failed: {e}"]
            )


class DirectPropertyCalculator:
    """Dispatcher class to execute direct property calculators dynamically by key."""
    
    _registry: Dict[str, BasePropertyCalculator] = {
        "total_energy": TotalEnergyCalculator(),
        "energy_per_atom": EnergyPerAtomCalculator(),
        "forces": AtomicForcesCalculator(),
        "stress_tensor": StressTensorCalculator(),
    }

    @classmethod
    def compute(cls, property_key: str, structure: Any, model_adapter: Optional[Any] = None, settings: Optional[dict] = None) -> PropertyResult:
        calculator = cls._registry.get(property_key)
        if not calculator:
            raise KeyError(f"Direct property calculator for '{property_key}' is not registered.")
        return calculator.calculate(structure, model_adapter=model_adapter, settings=settings)