"""Electrical-feature extraction from a real CIF.

The property registry is authoritative. M3GNet cannot provide electronic band
structure or ionic conductivity, so unsupported values remain unavailable.
"""

from dataclasses import asdict, dataclass
from pathlib import Path
from typing import Any

from parsing.structure_parser import parse_structure_input
from properties.property_registry import property_registry


@dataclass
class ElectricalFeature:
    key: str
    name: str
    value: Any
    unit: str
    status: str
    source_model: str | None
    warnings: list[str]


def extract_electrical_features(
    cif_path: str | Path,
    *,
    external_band_gap: float | None = None,
) -> dict[str, Any]:
    """Extract registry-defined electrical features from one CIF."""
    structure, summary = parse_structure_input(str(cif_path))
    if structure is None:
        raise ValueError(f"Could not parse CIF '{cif_path}': {summary.get('error', 'unknown error')}")

    settings = {}
    if external_band_gap is not None:
        settings["external_band_gap"] = external_band_gap

    feature_keys = ("band_gap", "electronic_state", "ionic_conductivity", "ionic_conductivity_activation_energy")
    features: list[ElectricalFeature] = []
    for key in feature_keys:
        calculator = property_registry.get_calculator(key)
        if calculator is None:
            continue
        result = calculator.calculate(structure, settings=settings)
        features.append(
            ElectricalFeature(
                key=result.property_key,
                name=result.property_name,
                value=result.value,
                unit=result.unit,
                status=result.status,
                source_model=result.source_model,
                warnings=result.warnings or [],
            )
        )

    return {
        "source": str(cif_path),
        "formula": structure.composition.reduced_formula,
        "features": [asdict(feature) for feature in features],
    }
