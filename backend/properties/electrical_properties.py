from typing import Any, Optional
from properties.base_property import BasePropertyCalculator, PropertyResult

class BandGapCalculator(BasePropertyCalculator):
    def __init__(self):
        super().__init__(
            key="band_gap",
            name="Electronic Band Gap",
            category="electrical",
            unit="eV",
            description="Electronic band gap energy."
        )

    def calculate(self, structure: Any, model_adapter: Optional[Any] = None, settings: Optional[dict] = None) -> PropertyResult:
        ctx = settings or {}
        supplied_bg = ctx.get("external_band_gap")
        if supplied_bg is not None:
            return PropertyResult(
                property_key=self.key, property_name=self.name, category=self.category,
                value=round(float(supplied_bg), 3), unit=self.unit, source_model="external_electronic_dataset",
                calculation_method="user_supplied_electronic_data", status="calculated",
                inputs_used=["external_band_gap"], warnings=[]
            )

        return PropertyResult(
            property_key=self.key, property_name=self.name, category=self.category,
            value=None, unit=self.unit, source_model=model_adapter.display_name if model_adapter else "N/A",
            calculation_method="unsupported_direct_evaluation", status="unavailable",
            inputs_used=[],
            warnings=[
                "Atomistic potentials (M3GNet, CHGNet, MACE) predict interatomic energy and forces, not electronic band structure. Electronic band gap requires DFT or a dedicated electronic structure model."
            ]
        )

class ElectronicStateClassifier(BasePropertyCalculator):
    def __init__(self):
        super().__init__(
            key="electronic_state",
            name="Electronic State Classification",
            category="electrical",
            unit="category",
            description="Heuristic electronic classification (metal vs non-metal)."
        )

    def calculate(self, structure: Any, model_adapter: Optional[Any] = None, settings: Optional[dict] = None) -> PropertyResult:
        comp = structure.composition
        has_metals = any(el.is_metal for el in comp.elements)
        all_metals = all(el.is_metal for el in comp.elements)

        if all_metals:
            cls_name = "Metallic (Heuristic)"
        elif has_metals and any(el.is_halogen or el.symbol in ("O", "S", "Se", "N", "P") for el in comp.elements):
            cls_name = "Insulating/Semiconducting (Heuristic)"
        else:
            cls_name = "Non-Metallic (Heuristic)"

        return PropertyResult(
            property_key=self.key, property_name=self.name, category=self.category,
            value=cls_name, unit=self.unit, source_model="Pymatgen Elemental Heuristic",
            calculation_method="composition_elemental_property_heuristic", status="estimated",
            inputs_used=["elemental_metallicity", "electronegativity"],
            warnings=["Heuristic classification based on elemental properties only. Verify with electronic DFT."]
        )

class ExcludedIonicConductivityCalculator(BasePropertyCalculator):
    def __init__(self):
        super().__init__(
            key="ionic_conductivity",
            name="Ionic Conductivity",
            category="electrical",
            unit="S/cm",
            description="Ionic conductivity (Unsupported property)."
        )

    def calculate(self, structure: Any, model_adapter: Optional[Any] = None, settings: Optional[dict] = None) -> PropertyResult:
        return PropertyResult(
            property_key=self.key, property_name=self.name, category=self.category,
            value=None, unit=self.unit, source_model="N/A", calculation_method="N/A",
            status="unsupported",
            warnings=["Ionic conductivity predictions are intentionally excluded and unsupported in this property prediction pipeline."]
        )

class ExcludedActivationEnergyCalculator(BasePropertyCalculator):
    def __init__(self):
        super().__init__(
            key="ionic_conductivity_activation_energy",
            name="Ionic Conductivity Activation Energy",
            category="electrical",
            unit="eV",
            description="Ionic conductivity activation energy (Unsupported property)."
        )

    def calculate(self, structure: Any, model_adapter: Optional[Any] = None, settings: Optional[dict] = None) -> PropertyResult:
        return PropertyResult(
            property_key=self.key, property_name=self.name, category=self.category,
            value=None, unit=self.unit, source_model="N/A", calculation_method="N/A",
            status="unsupported",
            warnings=["Ionic conductivity activation energy predictions are intentionally excluded and unsupported in this property prediction pipeline."]
        )
