"""M3GNet-backed CIF structure relaxation and export."""

from dataclasses import dataclass
from pathlib import Path
from typing import Any

from pymatgen.core import Structure

from parsing.structure_parser import parse_structure_input
from prediction_models.m3gnet_adapter import M3GNetAdapter


@dataclass
class GeneratedStructure:
    source: str
    formula_before: str
    formula_after: str
    output_path: str
    converged: bool
    steps: int | None
    runtime_seconds: float | None
    error: str | None = None


def relax_cif_to_file(
    cif_path: str | Path,
    output_path: str | Path,
    *,
    fmax: float = 0.05,
    steps: int = 50,
    adapter: M3GNetAdapter | None = None,
) -> GeneratedStructure:
    """Relax one real CIF with M3GNet and write the returned structure as CIF."""
    structure, summary = parse_structure_input(str(cif_path))
    if structure is None:
        raise ValueError(f"Could not parse CIF '{cif_path}': {summary.get('error', 'unknown error')}")

    runtime = adapter or M3GNetAdapter()
    if not runtime.load_model():
        raise RuntimeError(
            "M3GNet is unavailable. The structure was not modified or fabricated."
        )

    relaxed, metadata = runtime.relax_structure(
        structure,
        settings={"fmax": fmax, "steps": steps},
    )
    if not isinstance(relaxed, Structure):
        raise RuntimeError("M3GNet relaxation did not return a pymatgen Structure.")
    if metadata.get("error"):
        raise RuntimeError(f"M3GNet relaxation failed: {metadata['error']}")

    target = Path(output_path)
    target.parent.mkdir(parents=True, exist_ok=True)
    relaxed.to(filename=str(target), fmt="cif")
    return GeneratedStructure(
        source=str(cif_path),
        formula_before=structure.composition.reduced_formula,
        formula_after=relaxed.composition.reduced_formula,
        output_path=str(target),
        converged=bool(metadata.get("converged", False)),
        steps=metadata.get("n_steps"),
        runtime_seconds=metadata.get("runtime_seconds"),
    )
