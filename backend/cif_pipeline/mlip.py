"""
mlip.py — machine-learning interatomic potential (MLIP) energy functions.

Used to give the cluster expansion / candidate ranking a *real* energy instead
of the formal-charge Coulomb surrogate — without DFT.  The default model is
MACE-MP-0 (mace-torch), the same potential already used for relaxation in
`relax.py`.

Every function returned here carries an `energy_source` attribute so callers can
record exactly which potential produced the numbers.
"""

from __future__ import annotations

import logging
from typing import Callable, Optional

from pymatgen.core import Structure

log = logging.getLogger("cif_pipeline.mlip")


def make_mace_energy_fn(
    model_path: Optional[str] = None,
    device: Optional[str] = None,
) -> Callable[[Structure], float]:
    """Return a single-point energy function backed by MACE-MP-0.

    The returned callable `fn(structure) -> energy_eV` reuses the cached
    calculator from `relax._get_mace_calculator`, so loading the checkpoint
    happens at most once per process.

    Raises ImportError / RuntimeError if mace-torch is not usable, so the
    caller can fall back to the Coulomb surrogate cleanly.
    """
    if device is None:
        try:
            from .config import get_mace_device
            device = get_mace_device() or "cpu"
        except Exception:
            device = "cpu"

    from .relax import _get_mace_calculator
    from pymatgen.io.ase import AseAtomsAdaptor

    calc = _get_mace_calculator(model_path, device)

    def energy_fn(structure: Structure) -> float:
        # ASE calculators need fully ordered structures (integer occupancy).
        if not structure.is_ordered or any(len(site.species) > 1 for site in structure):
            raise ValueError(
                "MACE single-point requires a fully ordered structure; "
                "use a discrete representation (ordered/sqs/enumerate/ensemble)."
            )
        atoms = AseAtomsAdaptor.get_atoms(structure)
        atoms.calc = calc
        return float(atoms.get_potential_energy())

    energy_fn.energy_source = f"MACE-MP-0 ('{model_path or 'medium'}') MLIP single-point"
    return energy_fn


def try_make_energy_fn(
    source: str = "surrogate",
    model_path: Optional[str] = None,
    device: Optional[str] = None,
) -> Optional[Callable[[Structure], float]]:
    """Return an energy function for `source`, or None for the surrogate.

    `source="mlip"` tries MACE and returns None (with a warning) if unavailable,
    letting the caller degrade gracefully to the surrogate rather than failing.
    """
    if source in (None, "", "surrogate", "coulomb"):
        return None
    if source != "mlip":
        raise ValueError(f"unknown energy source '{source}' (use 'surrogate' or 'mlip')")
    try:
        return make_mace_energy_fn(model_path, device)
    except Exception as e:  # pragma: no cover - environment dependent
        log.warning(f"[MLIP] could not load MACE ({type(e).__name__}: {e}); "
                    f"falling back to the Coulomb surrogate")
        return None
