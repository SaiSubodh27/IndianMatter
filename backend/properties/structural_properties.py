"""Structural-descriptor calculators.

Role in the system
------------------
Descriptor calculators matching ``calculations/descriptor_pipeline.py``. Part
of the (unwired) ``/api/materials-prediction`` property pipeline.
"""

from typing import Any, Optional  # type hints
from properties.base_property import BasePropertyCalculator, PropertyResult
from calculations.descriptor_pipeline import compute_structure_descriptors

class StructuralDescriptorsCalculator(BasePropertyCalculator):
    def __init__(self):
        super().__init__(
            key="structural_descriptors",
            name="Structural Descriptors",
            category="structure",
            unit="descriptors",
            description="Lattice parameters, cell volume, space group, crystal system, and neighbor statistics."
        )

    def calculate(self, structure: Any, model_adapter: Optional[Any] = None, settings: Optional[dict] = None) -> PropertyResult:
        try:
            desc = compute_structure_descriptors(structure)
            return PropertyResult(
                property_key=self.key, property_name=self.name, category=self.category,
                value=desc, unit=self.unit, source_model="pymatgen_spglib",
                calculation_method="pymatgen_symmetry_and_lattice_analysis", status="calculated",
                inputs_used=["lattice_vectors", "atomic_positions", "symmetry"], warnings=[],
                raw_details=desc
            )
        except Exception as e:
            return PropertyResult(
                property_key=self.key, property_name=self.name, category=self.category,
                value=None, unit=self.unit, source_model="pymatgen", calculation_method="N/A",
                status="failed", warnings=[f"Structural descriptor calculation failed: {e}"]
            )
