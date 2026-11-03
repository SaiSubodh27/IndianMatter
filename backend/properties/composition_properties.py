"""Composition-descriptor calculators.

Role in the system
------------------
Descriptor calculators matching ``calculations/descriptor_pipeline.py``. Part
of the (unwired) ``/api/materials-prediction`` property pipeline.
"""

from typing import Any, Optional  # type hints
from properties.base_property import BasePropertyCalculator, PropertyResult
from calculations.descriptor_pipeline import compute_composition_descriptors

class CompositionDescriptorsCalculator(BasePropertyCalculator):
    def __init__(self):
        super().__init__(
            key="composition_descriptors",
            name="Composition Descriptors",
            category="composition",
            unit="descriptors",
            description="Pymatgen and Matminer composition descriptors (electronegativities, radii, valence)."
        )

    def calculate(self, structure: Any, model_adapter: Optional[Any] = None, settings: Optional[dict] = None) -> PropertyResult:
        try:
            comp = structure.composition if hasattr(structure, "composition") else structure
            desc = compute_composition_descriptors(comp)
            return PropertyResult(
                property_key=self.key, property_name=self.name, category=self.category,
                value=desc, unit=self.unit, source_model="pymatgen_matminer",
                calculation_method="pymatgen_elemental_featurization", status="calculated",
                inputs_used=["chemical_formula", "elemental_properties"], warnings=[],
                raw_details=desc
            )
        except Exception as e:
            return PropertyResult(
                property_key=self.key, property_name=self.name, category=self.category,
                value=None, unit=self.unit, source_model="pymatgen", calculation_method="N/A",
                status="failed", warnings=[f"Composition descriptor calculation failed: {e}"]
            )
