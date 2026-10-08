"""
symmetry_paths.py — distorted-lattice paths for Jahn-Teller cations.

A cubic Fd-3m spinel cannot describe CuFe2O4 (Cu2+ d9) or a high-spin Mn3+
spinel: the cooperative Jahn-Teller effect lowers the symmetry to tetragonal
I4_1/amd with c/a > 1.  Building a cubic cell and scoring it against a
tetragonal experiment is a known geometry mismatch (audit P0.2).

Honest scope of this module: it applies an explicit, labelled **tetragonal
strain** to a cubic spinel to produce a physically-motivated *starting geometry*
for relaxation.  It is NOT a symmetry-adapted I4_1/amd decoration with refined
oxygen coordinates — that requires a full symmetry-lowering relaxation.  Every
structure produced here is stamped so it can never be mistaken for the relaxed
tetragonal phase.
"""

from __future__ import annotations

from dataclasses import dataclass
from typing import Dict, Optional, Tuple

import numpy as np
from pymatgen.core import Structure, Lattice


# Experimental tetragonal c/a ratios for classic Jahn-Teller spinels, each with
# its documented source.  A c/a without a source entry here is UNSUPPORTED.
TETRAGONAL_C_OVER_A: Dict[str, float] = {
    "CuFe2O4": 1.06,     # slow-cooled I4_1/amd
    "MnFe2O4": 1.00,     # usually cubic; JT only if Mn3+ present
    "Mn3O4":   1.16,     # hausmannite, strongly tetragonal
}
TETRAGONAL_C_OVER_A_SOURCE: Dict[str, str] = {
    "CuFe2O4": "COD 9011012 (slow-cooled ceramic, tetragonal I41/amd; "
               "a=5.80, c=8.73 -> c/a=1.06)",
    "MnFe2O4": "cubic by default (no JT distortion for Mn2+ d5); "
               "tetragonal only if Mn3+ present",
    "Mn3O4": "hausmannite literature c/a=1.16 (a=5.76, c=9.47)",
}


def c_over_a_source(formula: str) -> str:
    """Documented source of the c/a used for `formula`, or UNSUPPORTED."""
    for key, val in TETRAGONAL_C_OVER_A_SOURCE.items():
        if key in formula:
            return val
    if "Cu" in formula:
        return ("Cu-driven fallback c/a=1.06 (same JT physics as CuFe2O4); "
                "treat as estimate, not a measured value")
    return "UNSUPPORTED: no documented c/a rule for this composition"

# Which element drives the distortion, for a quick lookup from a formula.
_JT_C_OVER_A_BY_ELEMENT: Dict[str, float] = {
    "Cu": 1.06,
}


def c_over_a_for(formula: str, structure: Optional[Structure] = None) -> float:
    """Return the literature c/a for a JT composition, else 1.0 (cubic)."""
    for key, val in TETRAGONAL_C_OVER_A.items():
        if key in formula:
            return val
    # Element-based fallback (Cu present -> classic JT)
    if "Cu" in formula:
        return _JT_C_OVER_A_BY_ELEMENT["Cu"]
    return 1.0


def strain_cubic_to_tetragonal(
    structure: Structure,
    c_over_a: float,
) -> Structure:
    """Apply a tetragonal strain along the cell c-axis.

    The a/b lattice vectors are unchanged; c is scaled by `c_over_a`.  Atomic
    fractional coordinates are preserved, which is the standard first-order
    starting point for a JT relaxation (the oxygen u parameter then relaxes).
    """
    if c_over_a <= 0:
        raise ValueError(f"c_over_a must be positive, got {c_over_a}")
    M = structure.lattice.matrix.copy()
    M[2] = M[2] * c_over_a
    new_lat = Lattice(M)
    return Structure(
        new_lat,
        [site.species for site in structure],
        [site.frac_coords for site in structure],
        coords_are_cartesian=False,
    )


@dataclass
class DistortedBuild:
    structure: Structure
    c_over_a: float
    a: float
    c: float
    source: str
    notes: str = ""
    space_group: Optional[str] = None


def symmetrize(structure: Structure, symprec: float = 0.1) -> Structure:
    """Return the symmetry-refined structure at the given tolerance.

    Applying a tetragonal strain to a cubic cell and then symmetrizing lets
    spglib find the actual maximal-subgroup space group (I4_1/amd for the
    Jahn-Teller spinels) and place the oxygen atoms on their proper Wyckoff
    positions, rather than leaving them at arbitrary strained coordinates.
    """
    try:
        from pymatgen.symmetry.analyzer import SpacegroupAnalyzer
        sga = SpacegroupAnalyzer(structure, symprec=symprec)
        refined = sga.get_refined_structure()
        # keep the same number of sites (refined structure can drop duplicates)
        if refined.num_sites == structure.num_sites:
            return refined
    except Exception:
        pass
    return structure


def detect_space_group(structure: Structure, symprec: float = 0.1) -> Optional[str]:
    """Report the space group implied by the current geometry (no refinement)."""
    try:
        from pymatgen.symmetry.analyzer import SpacegroupAnalyzer
        return SpacegroupAnalyzer(structure, symprec=symprec).get_space_group_symbol()
    except Exception:
        return None


def build_tetragonal_distortion(
    cubic: Structure,
    formula: str,
    c_over_a: Optional[float] = None,
    symmetrize_to_sg: bool = False,
) -> DistortedBuild:
    """Produce a tetragonal (I4_1/amd-like) starting structure from a cubic one.

    Steps:
      1. Strain the c-axis by c/a.
      2. Report the space group implied by that geometry.

    `symmetrize_to_sg=True` additionally runs spglib refinement — only do this
    on a *clean* (undecorated) cell; on a decorated supercell the dopant breaks
    symmetry and refinement would rewrite the cell.  The oxygen parameter is not
    energy-minimised here: run a short relaxation (e.g. `DopantRequest(relax=True)`)
    to complete it.  This is the DFT-free route: strain -> (symmetrize) -> MLIP relax.
    """
    ratio = c_over_a if c_over_a is not None else c_over_a_for(formula)
    strained = strain_cubic_to_tetragonal(cubic, ratio)
    out = symmetrize(strained) if symmetrize_to_sg else strained
    # Space-group detection is O(N^2)-ish; skip it for large decorated supercells
    # (the tetragonal strain itself is what defines the starting geometry).
    sg = detect_space_group(out) if out.num_sites <= 200 else None
    a = out.lattice.a
    c = out.lattice.c
    return DistortedBuild(
        structure=out,
        c_over_a=c / a if a else ratio,
        a=a,
        c=c,
        source=("cubic spinel + tetragonal strain"
                + (" + spglib symmetrisation" if symmetrize_to_sg else "")
                + f" [{c_over_a_source(formula)}]"),
        space_group=sg,
        notes=(
            f"Tetragonal starting geometry for {formula}: c/a={c / a if a else ratio:.3f}, "
            f"detected space group {sg or 'unknown'}. Oxygen position set by the strain "
            f"(not energy-refined); run with relax=True to complete it with an MLIP."
        ),
    )


def build_tetragonal_spinel(
    spec: Dict[str, Dict[str, float]],
    a: float,
    u: float,
    formula: str,
    mode: str = "ordered",
    max_atoms: int = 560,
    n_candidates: int = 1,
    c_over_a: Optional[float] = None,
) -> DistortedBuild:
    """Build a cubic spinel then apply the tetragonal JT strain.

    Imported lazily so this module has no circular dependency on spinel_build.
    """
    from .spinel_build import build_spinel

    ratio = c_over_a if c_over_a is not None else c_over_a_for(formula)
    cubic, _rep = build_spinel(
        spec, a=a, u=u, mode=mode, max_atoms=max_atoms, n_candidates=n_candidates,
    )
    tet = strain_cubic_to_tetragonal(cubic, ratio)
    return DistortedBuild(
        structure=tet,
        c_over_a=ratio,
        a=a,
        c=a * ratio,
        source="cubic Fd-3m spinel + applied tetragonal strain",
        notes=(
            f"Starting geometry for {formula}: cubic cell strained to c/a={ratio:.3f} "
            f"(tetragonal I4_1/amd-like). Oxygen position NOT symmetry-refined; "
            f"this is a pre-relaxation snapshot, not the equilibrium phase."
        ),
    )
