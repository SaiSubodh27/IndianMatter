"""
fractions.py — turn an awkward dopant fraction into a neat, buildable supercell.

This is the "0.3 → 3/10 → 10 formula units" step.  Given a target fraction and
the number of host sites per formula unit on the target sublattice, it finds the
smallest supercell (within an atom budget) that represents the fraction exactly,
or the closest representable fraction if no exact one fits — always reporting
`x_target`, `x_real`, and the absolute error.  Nothing is silently rounded.

It also chooses the integer supercell matrix that maximises the shortest
lattice vector (the nearest self-image distance), because a skewed cell hides
the dopant from its own periodic images.
"""

from __future__ import annotations

import math
from dataclasses import dataclass, field
from fractions import Fraction
from typing import List, Optional, Tuple

import numpy as np
from pymatgen.core import Lattice

from .supercell import find_supercell, shortest_lattice_vector

# Memoise the (lattice, k) -> best-matrix search: the fraction resolver calls it
# once per candidate cell, and the HNF enumeration is the hot spot.
_SUPERCELL_CACHE: dict = {}


def _cached_find_supercell(lattice: Lattice, k: int):
    key = (tuple(np.round(lattice.matrix.flatten(), 6)), int(k))
    if key not in _SUPERCELL_CACHE:
        _SUPERCELL_CACHE[key] = find_supercell(lattice, k)
    return _SUPERCELL_CACHE[key]


def _near_cubic_scaling(tiling: int) -> Tuple[int, int, int]:
    """Factor `tiling` into the most compact integer (nx, ny, nz)."""
    best = (1, 1, tiling)
    best_spread = float("inf")
    for nx in range(1, int(tiling ** (1 / 3)) + 2):
        if tiling % nx:
            continue
        rem = tiling // nx
        for ny in range(nx, int(math.isqrt(rem)) + 2):
            if rem % ny:
                continue
            nz = rem // ny
            spread = max(nx, ny, nz) - min(nx, ny, nz)
            if spread < best_spread:
                best_spread = spread
                best = (nx, ny, nz)
    return best


def _fast_cell(lattice: Lattice, tiling: int):
    """Fast supercell choice: near-cubic diagonal scaling.

    A full Hermite-normal-form search is unnecessary here — for the near-cubic
    base cells used by this pipeline the most compact diagonal tiling reaches
    the same longest shortest-vector as any skewed matrix of the same
    determinant, and it is orders of magnitude faster (the resolver calls this
    once per candidate cell).
    """
    scaling = _near_cubic_scaling(tiling)
    matrix = np.diag(scaling)
    slv = shortest_lattice_vector(lattice, matrix)
    return matrix, slv, scaling


@dataclass
class FractionPlan:
    x_target: float
    x_real: float
    error: float
    n_dopant: int
    host_sites_total: int
    formula_units: int
    sites_per_fu: float
    atoms_total: int
    exact: bool
    neat_fraction: str                      # e.g. "3/10"
    base: str = "conventional"              # which base cell the matrix tiles
    base_z: int = 8                         # formula units in that base cell
    supercell_matrix: Optional[List[List[int]]] = None
    supercell_scaling: Optional[Tuple[int, int, int]] = None
    min_image_A: Optional[float] = None     # shortest lattice vector (nearest self-image)
    exact_requires: Optional[int] = None    # atoms needed for an exact cell, if not chosen
    notes: str = ""


@dataclass
class BaseCell:
    """A base cell that can be tiled: its name, formula units, and lattice."""
    name: str
    base_z: int
    lattice: Optional[Lattice] = None


def neat_fraction(target: float, max_denominator: int = 1000) -> Fraction:
    """Nearest reduced fraction to `target` with a bounded denominator."""
    return Fraction(str(round(float(target), 6))).limit_denominator(max_denominator)


def resolve_neat_fraction(
    target: float,
    sites_per_fu: float,
    atoms_per_fu: float,
    base_z: int = 1,
    max_atoms: int = 400,
    min_image: float = 10.0,
    lattice: Optional[Lattice] = None,
    require_exact: bool = False,
    isolated_max: int = 1,
    bases: Optional[List[BaseCell]] = None,
) -> FractionPlan:
    """Find the smallest neat supercell representing `target` on a sublattice.

    Searches every supplied base cell (conventional and/or primitive) and every
    whole-cell multiple within the atom budget, then picks the best.  Using the
    primitive cell (spinel: 2 f.u. per cell, 14 atoms) instead of only the
    conventional cell (8 f.u., 56 atoms) can reach the same nearest-self-image
    distance with a fraction of the atoms — e.g. a 5 % dopant fits in ~10
    primitive cells instead of a 2x2x2 conventional supercell.

    Parameters
    ----------
    target : float
        Desired fraction of the sublattice occupied by the dopant (0 < x < 1).
    sites_per_fu : float
        Host sites on the *target sublattice* per formula unit (A: 1, B: 2).
    atoms_per_fu : float
        Total atoms per formula unit (spinel AB2O4 = 7).
    bases : list[BaseCell], optional
        Base cells to tile.  If omitted, a single conventional base of `base_z`
        formula units on `lattice` is used (backwards compatible).
    min_image : float
        Required nearest self-image distance (Å) **only for isolated dopants**.
    isolated_max : int
        A single dopant (up to this count) must not see its own periodic image,
        so the image gate applies.  With more dopants the dopant–dopant
        separation is set by the fraction itself and the gate is released.
    """
    if not (0.0 < target < 1.0):
        raise ValueError(f"target fraction must be in (0,1), got {target}")

    if bases is None:
        bases = [BaseCell("conventional", base_z, lattice)]

    ideal = neat_fraction(target)
    max_n_fu = int(max_atoms // atoms_per_fu) if atoms_per_fu else 0

    candidates: List[FractionPlan] = []
    for base in bases:
        if base.base_z <= 0:
            continue
        n = base.base_z
        while n <= max_n_fu:
            host = n * sites_per_fu
            k = int(round(target * host))
            if 1 <= k <= host:
                x_real = k / host
                err = abs(x_real - target)
                candidates.append(_make_plan(
                    target, x_real, err, k, host, n, sites_per_fu,
                    atoms_per_fu, err < 1e-9, ideal, base,
                ))
            n += base.base_z

    if not candidates:
        raise ValueError(
            f"no representable supercell for x={target} within {max_atoms} atoms"
        )

    # Selection: for isolated dopants the nearest-self-image gate is a hard
    # requirement; for concentrated doping it is released (see docstring).
    # Within the eligible set, prefer exact, then smallest error *bucketed to a
    # physical tolerance* (so two equally-good fractions don't pick a needlessly
    # large cell), then a **balanced cell score** that trades atom count against
    # shape (larger nearest-self-image is better):
    #     score = atoms - 2 * min_image
    ERR_TOL = 0.005

    def _cell_score(c: FractionPlan) -> float:
        return c.atoms_total - 2.0 * (c.min_image_A or 0.0)

    def _key(c: FractionPlan):
        return (0 if c.exact else 1, int(round(c.error / ERR_TOL)), _cell_score(c))

    eligible = [
        c for c in candidates
        if c.n_dopant > isolated_max
        or (c.min_image_A is not None and c.min_image_A >= min_image)
    ]
    pool = eligible if eligible else candidates

    chosen = min(pool, key=_key)

    if not chosen.exact:
        # Report how big an exact cell would need to be.
        exact_host_sites = ideal.denominator
        exact_n_fu = exact_host_sites / sites_per_fu
        exact_atoms = int(round(exact_n_fu * atoms_per_fu))
        chosen.exact_requires = exact_atoms
        chosen.notes += (
            f"; exact cell needs {exact_atoms} atoms (> max_atoms={max_atoms}); "
            f"showing nearest representable"
        )

    if require_exact and not chosen.exact:
        raise ValueError(
            f"x={target} has no exact cell within {max_atoms} atoms "
            f"(nearest {chosen.neat_fraction}, error {chosen.error:.4f})"
        )
    return chosen


def _make_plan(target, x_real, err, k, host, n, spf, apf, is_exact,
               ideal, base: BaseCell) -> FractionPlan:
    frac = Fraction(k, int(round(host))).limit_denominator(1000)
    scaling = None
    matrix = None
    image = None
    if base.lattice is not None:
        tiling = max(1, int(round(n / base.base_z)))
        if tiling <= 8:
            # Small tilings: full Hermite-normal-form search, which can find a
            # less-skewed (larger self-image) cell than any diagonal tiling.
            choice = _cached_find_supercell(base.lattice, tiling)
            matrix = choice.matrix.tolist()
            image = choice.shortest_vector
            scaling = tuple(int(round(x)) for x in np.diag(np.abs(choice.matrix)))
            notes_extra = f"HNF search over det={tiling} matrices"
        else:
            # Large tilings: HNF enumeration explodes, so use the fast
            # near-cubic diagonal tiling (documented fallback; self-image may
            # be smaller than the HNF optimum).
            matrix_np, image, scaling = _fast_cell(base.lattice, tiling)
            matrix = matrix_np.tolist()
            notes_extra = (f"fast diagonal fallback (tiling={tiling} exceeds HNF "
                           f"budget)")
    else:
        notes_extra = ""
    return FractionPlan(
        x_target=float(target), x_real=float(x_real), error=float(err),
        n_dopant=int(k), host_sites_total=int(round(host)),
        formula_units=int(n), sites_per_fu=float(spf),
        atoms_total=int(round(n * apf)), exact=bool(is_exact),
        neat_fraction=f"{frac.numerator}/{frac.denominator}",
        base=base.name, base_z=int(base.base_z),
        supercell_matrix=matrix, supercell_scaling=scaling, min_image_A=image,
        notes=notes_extra,
    )
