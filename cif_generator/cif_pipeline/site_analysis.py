"""
site_analysis.py — measure where a dopant actually sits in a structure.

Given a (spinel-type) structure and a dopant element, this reports the
dopant's distribution over the A (tetrahedral, CN=4) and B (octahedral, CN=6)
sublattices, the inversion parameter λ, and the lattice geometry.  Used to
compare real COD structures against the structures our workflow generates.

Everything is measured from coordinates/occupancies — nothing is assumed from
the formula string.
"""

from __future__ import annotations

from dataclasses import dataclass, field
from typing import Dict, List, Optional

import numpy as np
from pymatgen.core import Structure, Composition

from .spinel_build import classify_spinel_sites

# Cations that can play the divalent A-site role in a spinel.
DIVALENT = {"Zn", "Ni", "Co", "Cu", "Mg", "Mn", "Fe", "Ca", "Cd"}


@dataclass
class SiteDistribution:
    dopant: str
    on_A: float                      # fraction of dopant on the tetrahedral site
    on_B: float                      # fraction of dopant on the octahedral site
    total_A: int
    total_B: int
    site: str = "?"                  # "A" | "B" | "mixed"
    inversion_lambda: Optional[float] = None
    per_sublattice: Dict[str, Dict[str, float]] = field(default_factory=dict)
    notes: str = ""

    @property
    def dominant(self) -> str:
        if self.on_A > 0.7:
            return "A"
        if self.on_B > 0.7:
            return "B"
        return "mixed"


def _species_symbol(sp) -> str:
    """Element symbol for a species, ignoring any oxidation-state tag."""
    elem = getattr(sp, "element", None)
    return str(elem) if elem is not None else str(sp)


def _site_species_amounts(structure: Structure, indices: List[int]) -> Dict[str, float]:
    """Sum fractional occupancy of each species over the given sites."""
    out: Dict[str, float] = {}
    for i in indices:
        for sp, occ in structure[i].species.items():
            sym = _species_symbol(sp)
            out[sym] = out.get(sym, 0.0) + float(occ)
    return out


def analyze_sites(structure: Structure, dopant: str = "Co") -> SiteDistribution:
    """Measure the dopant's A/B distribution and the inversion parameter."""
    A_idx, B_idx, _ = classify_spinel_sites(structure)
    a_amt = _site_species_amounts(structure, A_idx)
    b_amt = _site_species_amounts(structure, B_idx)

    nA, nB = len(A_idx), len(B_idx)
    dop_A = a_amt.get(dopant, 0.0)
    dop_B = b_amt.get(dopant, 0.0)
    total = dop_A + dop_B

    if total <= 0:
        return SiteDistribution(dopant=dopant, on_A=0.0, on_B=0.0,
                                total_A=nA, total_B=nB, site="absent",
                                notes=f"no {dopant} found on cation sites")

    # Normalise per sublattice to the same count basis (A:1, B:2 per f.u.)
    on_a = dop_A / nA
    on_b = dop_B / nB
    norm = on_a + on_b
    on_a, on_b = (on_a / norm, on_b / norm) if norm > 0 else (0.0, 0.0)

    # Inversion λ = fraction of the *divalent* cation on B.  If the dopant is
    # the divalent cation, this is on_b; otherwise report None.
    lam = None
    divalent_present = [el for el in (list(a_amt) + list(b_amt)) if el in DIVALENT]
    if dopant in DIVALENT and dopant in (list(a_amt) + list(b_amt)):
        lam = round(on_b, 4)

    return SiteDistribution(
        dopant=dopant, on_A=round(on_a, 4), on_B=round(on_b, 4),
        total_A=nA, total_B=nB, site=("A" if on_a > 0.7 else "B" if on_b > 0.7 else "mixed"),
        inversion_lambda=lam,
        per_sublattice={"A": a_amt, "B": b_amt},
    )


def dopant_fraction_per_fu(structure: Structure, dopant: str) -> float:
    """Dopant amount per formula unit (O/4 convention)."""
    comp = structure.composition
    n_o = comp.get("O", 0)
    if n_o <= 0:
        return 0.0
    fu = n_o / 4.0
    return float(comp.get(dopant, 0.0) / fu)


def xrd_peaks(structure: Structure, two_theta=(10, 80), intensity_cutoff: float = 1.0
              ) -> List[Dict[str, float]]:
    """Powder XRD peaks (Cu Kα) as a list of {two_theta, intensity, d}."""
    from pymatgen.analysis.diffraction.xrd import XRDCalculator
    calc = XRDCalculator(wavelength="CuKa")
    pat = calc.get_pattern(structure, two_theta_range=two_theta)
    return [
        {"two_theta": float(x), "intensity": float(y), "d": float(d)}
        for x, y, d in zip(pat.x, pat.y, pat.d_hkls)
        if y >= intensity_cutoff
    ]


def compare_xrd(pat_a: List[Dict[str, float]], pat_b: List[Dict[str, float]],
                tol: float = 2.0) -> Dict[str, float]:
    """Mean/max |Δ2θ| of the strongest peaks of A matched to nearest peaks of B."""
    if not pat_a or not pat_b:
        return {"n_matched": 0, "mean_delta": None, "max_delta": None}
    xs_b = [p["two_theta"] for p in pat_b]
    major = sorted(pat_a, key=lambda p: -p["intensity"])[:12]
    diffs = []
    for p in major:
        near = min(xs_b, key=lambda x: abs(x - p["two_theta"]))
        if abs(near - p["two_theta"]) < tol:
            diffs.append(abs(near - p["two_theta"]))
    if not diffs:
        return {"n_matched": 0, "mean_delta": None, "max_delta": None}
    return {"n_matched": len(diffs),
            "mean_delta": float(np.mean(diffs)), "max_delta": float(np.max(diffs))}
