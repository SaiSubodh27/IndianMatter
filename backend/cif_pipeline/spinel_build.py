"""
spinel_build.py - Robust Spinel Doping & Structure Builder.

Design Principle:
Site preference is a USER INPUT. You state what sits on each sublattice per
formula unit (A sums to 1.0, B sums to 2.0). The code builds the structure and
then independently measures and verifies it against the requested specification.

Supported modes:
- mode="vca": Virtual Crystal Approximation / fractional disordered CIF for XRD/Rietveld.
- mode="ordered": Discrete supercell with minimal exact integer atoms for DFT.
"""

from __future__ import annotations

import math
import copy
import logging
from typing import Dict, Tuple, Optional, Any, List
from fractions import Fraction

import numpy as np
from pymatgen.core import Structure, Lattice, PeriodicSite, Element, Composition
from pymatgen.io.cif import CifWriter
from pymatgen.analysis.ewald import EwaldSummation

log = logging.getLogger("cif_pipeline.spinel_build")

# Shannon effective ionic radii (in Angstroms) for common spinel cations
# Key: (symbol, coordination_number, oxidation_state)
SHANNON_RADII = {
    # Tetrahedral (CN=4)
    ("Fe", 4, 3): 0.49,
    ("Fe", 4, 2): 0.63,
    ("Zn", 4, 2): 0.60,
    ("Co", 4, 2): 0.58,
    ("Ni", 4, 2): 0.55,
    ("Cu", 4, 2): 0.57,
    ("Mn", 4, 2): 0.66,
    ("Mg", 4, 2): 0.57,
    ("Al", 4, 3): 0.39,
    ("Li", 4, 1): 0.59,
    ("Ti", 4, 4): 0.42,
    # Octahedral (CN=6)
    ("Fe", 6, 3): 0.645,
    ("Fe", 6, 2): 0.78,
    ("Ni", 6, 2): 0.69,
    ("Co", 6, 2): 0.745,
    ("Cu", 6, 2): 0.73,
    ("Zn", 6, 2): 0.74,
    ("Mn", 6, 2): 0.83,
    ("Mn", 6, 3): 0.645,
    ("Mg", 6, 2): 0.72,
    ("Al", 6, 3): 0.535,
    ("Cr", 6, 3): 0.615,
    ("Ti", 6, 4): 0.605,
    ("Ca", 6, 2): 1.00,
    ("Li", 6, 1): 0.76,
}

NOMINAL_CHARGES = {
    "Fe": 3.0,
    "Zn": 2.0,
    "Ni": 2.0,
    "Co": 2.0,
    "Cu": 2.0,
    "Mn": 2.0,
    "Mg": 2.0,
    "Ca": 2.0,
    "Ti": 4.0,
    "Li": 1.0,
    "Al": 3.0,
    "Cr": 3.0,
    "Vac": 0.0,
    "O": -2.0,
}


def _build_parent_spinel(a: float = 8.38, u: float = 0.385) -> Structure:
    """Generate an ideal stoichiometric cubic Fd-3m spinel parent structure.
    Conventional cubic cell (a x a x a), Z = 8 formula units (56 atoms):
    - 8 A-sites (tetrahedral, 8a at 0, 0, 0)
    - 16 B-sites (octahedral, 16d at 5/8, 5/8, 5/8)
    - 32 O-sites (anion, 32e at u, u, u, where u ~ 0.385 in origin 1)
    """
    # Normalize u if given in origin 2 choice (u ~ 0.255 -> u + 0.125 = 0.380)
    u_norm = u if u > 0.30 else (u + 0.125)
    lat = Lattice.cubic(a)
    return Structure.from_spacegroup(
        227,
        lat,
        ["Fe", "Fe", "O"],
        [[0.0, 0.0, 0.0], [0.625, 0.625, 0.625], [u_norm, u_norm, u_norm]],
    )


def _contains_element(site, symbol: str) -> bool:
    """True if a site contains the element, regardless of oxidation-state tags.

    Handles both plain `Element` species and `Species` carrying an oxidation
    state (e.g. `O2-`, `Fe3+`), which is how many deposited CIFs are written.
    """
    try:
        for sp in site.species:
            elem = getattr(sp, "element", None)
            name = str(elem) if elem is not None else str(sp)
            if name == symbol:
                return True
        return False
    except Exception:
        return symbol in str(site.species_string)


def classify_spinel_sites(structure: Structure, r_cut: float = 3.0) -> Tuple[List[int], List[int], List[int]]:
    """Classify cation sites into tetrahedral (A, CN=4) and octahedral (B, CN=6)
    by counting coordinating Oxygen atoms within r_cut (default 3.0 Angstroms).
    Robust against Jahn-Teller tetragonal strain, oxidation-state tags on the
    species (e.g. 'O2-'), and noise up to 0.1 Angstrom.
    Returns: (A_indices, B_indices, O_indices).
    """
    O_indices = [i for i, s in enumerate(structure) if _contains_element(s, "O")]
    cation_indices = [i for i, s in enumerate(structure) if not _contains_element(s, "O")]

    A_indices = []
    B_indices = []

    for i in cation_indices:
        site = structure[i]
        o_count = 0
        for o_idx in O_indices:
            dist = structure.get_distance(i, o_idx)
            if dist <= r_cut:
                o_count += 1

        if o_count == 4:
            A_indices.append(i)
        elif o_count == 6:
            B_indices.append(i)
        else:
            raise ValueError(
                f"Site {i} ({site.species_string}) has coordination number {o_count} to Oxygen "
                f"(within {r_cut} A), which is neither tetrahedral (4) nor octahedral (6). "
                f"Structure is not a valid spinel or has severe distortion."
            )

    # Check A:B ratio (must be 1:2)
    if len(A_indices) * 2 != len(B_indices):
        raise ValueError(
            f"Not a valid spinel: found {len(A_indices)} A-sites and {len(B_indices)} B-sites "
            f"(A:B ratio {len(A_indices)}:{len(B_indices)} != 1:2)."
        )

    return A_indices, B_indices, O_indices


# Candidate fillers for the charge-balance inference below, as
# (element, nominal_charge_on_A_site, nominal_charge_on_B_site).
# Ordered so that ties resolve toward the more common spinel cation.
_AUTO_FILL_CANDIDATES = [
    ("Fe", 3.0, 3.0),   # ferrites - the overwhelmingly most common spinel host
    ("Mg", 2.0, 2.0),   # MgAl2O4 / MgCr2O4 aluminates & chromites
    ("Zn", 2.0, 2.0),   # ZnAl2O4 family
    ("Co", 2.0, 2.0),   # CoAl2O4 family
    ("Ni", 2.0, 2.0),   # NiAl2O4 family
    ("Mn", 2.0, 2.0),   # MnAl2O4 family
    ("Ca", 2.0, 2.0),   # CaAl2O4 family
    ("Al", 3.0, 3.0),
    ("Cr", 3.0, 3.0),
    ("Ga", 3.0, 3.0),
]


def _resolve_host_element(A_in: Dict[str, float], B_in: Dict[str, float],
                          sum_A: float, sum_B: float,
                          host_formula: Optional[str] = None,
                          ) -> Tuple[str, str, str]:
    """Decide which cation should fill the un-specified remainder on the A and B
    sublattices when the caller left a sublattice short of 1.0 / 2.0.

    Resolution priority (most trustworthy first):
      1. An element named explicitly via ``spec["host_element"]`` -> used verbatim.
      2. Fe already on either sublattice (the classic ferrite case).
      3. The single host cation from ``host_formula`` that the caller did NOT
         already place - in a ferrite that is Fe (which genuinely occupies both
         sublattices); in an aluminate/chromite it is the other host cation.
      4. Charge-balance inference: the candidate cation that lands the total
         cation charge closest to the spinel target of +8.0 per formula unit.

    Returns (element_for_A, element_for_B, human-readable explanation).
    """
    notes: List[str] = []

    # --- Priority 1: caller stated the host element outright ---
    for key in ("host_element", "host"):
        value = A_in.get(key)
        if value:
            notes.append(f"Using explicitly declared host element '{value}' for auto-fill.")
            return str(value), str(value), "; ".join(notes)

    # --- Priority 2: Fe already occupies a sublattice ---
    if "Fe" in A_in or "Fe" in B_in:
        notes.append("Auto-fill element taken as Fe (already present on a sublattice).")
        return "Fe", "Fe", "; ".join(notes)

    # --- Priority 3: read the host's own cations out of host_formula ---
    if host_formula:
        try:
            host_comp = Composition(host_formula)
        except Exception:
            host_comp = None
        if host_comp is not None:
            anions = {"O", "S", "F", "Cl", "Se", "Te", "N", "P", "As"}
            placed = set(A_in) | set(B_in)
            host_cations = [str(el) for el in host_comp.elements if str(el) not in anions]
            unplaced = [el for el in host_cations if el not in placed]
            if len(unplaced) == 1:
                notes.append(
                    f"Auto-fill element read from host formula '{host_formula}': "
                    f"'{unplaced[0]}' is the only host cation not explicitly placed, "
                    f"so it fills both sublattice remainders."
                )
                return unplaced[0], unplaced[0], "; ".join(notes)
            if len(unplaced) > 1:
                notes.append(
                    f"Host '{host_formula}' has multiple unplaced cations "
                    f"({', '.join(unplaced)}); deferring to charge-balance inference."
                )

    # --- Priority 4: charge-balance-driven inference ---
    # The spinel anion framework fixes the target at +8.0 per formula unit, so the
    # correct filler is whichever candidate cation lands closest to it.
    rem_A = max(0.0, 1.0 - sum_A)          # missing A-site amount
    rem_B = max(0.0, 2.0 - sum_B)          # missing B-site amount
    base_charge = 0.0
    for el, amt in A_in.items():
        base_charge += amt * NOMINAL_CHARGES.get(el, 2.0)
    for el, amt in B_in.items():
        base_charge += amt * NOMINAL_CHARGES.get(el, 2.0 if el not in ("Fe", "Al", "Cr") else 3.0)

    best_a, best_a_err = "Fe", float("inf")   # Fe3+ is the default tie-breaker
    best_b, best_b_err = "Fe", float("inf")
    for candidate, charge_a, charge_b in _AUTO_FILL_CANDIDATES:
        err_a = abs(base_charge + rem_A * charge_a - 8.0)
        if err_a < best_a_err - 1e-9:
            best_a, best_a_err = candidate, err_a
        err_b = abs(base_charge + rem_A * charge_a + rem_B * charge_b - 8.0)
        if err_b < best_b_err - 1e-9:
            best_b, best_b_err = candidate, err_b

    notes.append(
        f"Auto-fill element inferred from charge balance (target +8.0/f.u.): "
        f"A<-{best_a} (err {best_a_err:.3f}), B<-{best_b} (err {best_b_err:.3f})."
    )
    return best_a, best_b, "; ".join(notes)


def _validate_and_fill_spec(
    spec: Dict[str, Dict[str, float]],
    host_formula: Optional[str] = None,
) -> Tuple[Dict[str, float], Dict[str, float], List[str]]:
    """Validate the sublattice specification and auto-fill any un-specified
    remainder so that A sums to 1.0 and B sums to 2.0.

    The filler element is chosen by :func:`_resolve_host_element`, so classic
    ferrites (Fe fills the gap) and non-ferrite spinels (Mg, Al, Zn, ...) are
    both handled without the caller having to restate the host.

    Returns: (A_spec, B_spec, reports)
    """
    reports: List[str] = []
    A_in = dict(spec.get("A", {}))
    B_in = dict(spec.get("B", {}))

    # Never let the meta keys leak into the chemistry dictionaries.
    for meta_key in ("host", "host_element", "host_formula"):
        A_in.pop(meta_key, None)
        B_in.pop(meta_key, None)

    sum_A = sum(A_in.values())
    sum_B = sum(B_in.values())

    # Decide the filler element once, up front, so A and B stay consistent.
    fill_a, fill_b, how = _resolve_host_element(A_in, B_in, sum_A, sum_B, host_formula)
    reports.append(how)

    # --- Sublattice A must sum to exactly 1.0 ---
    if sum_A > 1.0001:
        raise ValueError(f"Sublattice A fractions sum to {sum_A:.4f} > 1.0.")
    if sum_A < 0.9999:
        rem_A = round(1.0 - sum_A, 6)
        A_in[fill_a] = round(A_in.get(fill_a, 0.0) + rem_A, 6)
        reports.append(f"Auto-filled {rem_A*100:.2f}% {fill_a} on Sublattice A to reach 1.0.")

    # --- Sublattice B must sum to exactly 2.0 ---
    if sum_B > 2.0001:
        raise ValueError(f"Sublattice B fractions sum to {sum_B:.4f} > 2.0.")
    if sum_B < 1.9999:
        rem_B = round(2.0 - sum_B, 6)
        B_in[fill_b] = round(B_in.get(fill_b, 0.0) + rem_B, 6)
        reports.append(f"Auto-filled {rem_B/2*100:.2f}% {fill_b} on Sublattice B to reach 2.0.")

    return A_in, B_in, reports


def _check_charge_balance(A_spec: Dict[str, float], B_spec: Dict[str, float]) -> List[str]:
    """Check charge neutrality (+8 total per formula unit).
    Excess charge (e.g. Ti4+) is compensated by Fe3+ -> Fe2+.
    Charge deficit (e.g. Li+) without explicit 'Vac' raises an error.
    """
    reports = []
    total_pos_charge = 0.0

    for el, amt in A_spec.items():
        chg = NOMINAL_CHARGES.get(el, 2.0 if el != "Fe" else 3.0)
        total_pos_charge += amt * chg

    for el, amt in B_spec.items():
        chg = NOMINAL_CHARGES.get(el, 3.0 if el in ("Fe", "Al", "Cr") else 2.0)
        total_pos_charge += amt * chg

    vac_count = A_spec.get("Vac", 0.0) + B_spec.get("Vac", 0.0)
    if vac_count > 0.0:
        reports.append(f"Structure contains {vac_count:.3f} cation vacancies ('Vac') per formula unit.")

    charge_diff = total_pos_charge - 8.0

    if abs(charge_diff) > 0.01:
        if charge_diff > 0.0:
            # Excess positive charge: check if Fe3+ can reduce to Fe2+
            fe_total = A_spec.get("Fe", 0.0) + B_spec.get("Fe", 0.0)
            if fe_total >= charge_diff:
                reports.append(
                    f"Charge excess (+{charge_diff:.3f}): compensated by reducing "
                    f"{charge_diff:.3f} Fe3+ -> Fe2+ per formula unit."
                )
            else:
                raise ValueError(
                    f"Charge imbalance: total cation charge is +{total_pos_charge:.3f} "
                    f"(target +8.0). Excess cannot be compensated by available Fe."
                )
        else:
            # Deficit: requires vacancies
            if vac_count <= 0.0:
                raise ValueError(
                    f"Charge deficit: total cation charge is +{total_pos_charge:.3f} < +8.0 "
                    f"(deficit: {abs(charge_diff):.3f}). Requires explicit cation vacancies ('Vac')."
                )
            else:
                reports.append(f"Charge deficit compensated by {vac_count:.3f} cation vacancies ('Vac').")

    return reports


def _check_ionic_radii(A_spec: Dict[str, float], B_spec: Dict[str, float]) -> List[str]:
    """Flag unrealistic ions:
    - Ca2+ has no tetrahedral Shannon radius (essentially never seen on A site).
    - Radii differing from host Fe3+ by > 30% are flagged as warnings.
    """
    warnings = []
    # Tetrahedral A-site check
    r_fe_tet = SHANNON_RADII[("Fe", 4, 3)]
    for el in A_spec:
        if el in ("Fe", "Vac"):
            continue
        radius = SHANNON_RADII.get((el, 4, 2)) or SHANNON_RADII.get((el, 4, 3))
        if radius is None:
            warnings.append(
                f"Unrealistic ion: '{el}' has no reported tetrahedral Shannon radius "
                f"and strongly disfavors the A-site."
            )
        elif abs(radius - r_fe_tet) / r_fe_tet > 0.30:
            warnings.append(
                f"Site strain warning: '{el}' tetrahedral radius ({radius:.2f} A) differs "
                f"by >30% from Fe3+ ({r_fe_tet:.2f} A)."
            )

    # Octahedral B-site check
    r_fe_oct = SHANNON_RADII[("Fe", 6, 3)]
    for el in B_spec:
        if el in ("Fe", "Vac"):
            continue
        radius = SHANNON_RADII.get((el, 6, 2)) or SHANNON_RADII.get((el, 6, 3))
        if radius is not None and abs(radius - r_fe_oct) / r_fe_oct > 0.30:
            warnings.append(
                f"Site strain warning: '{el}' octahedral radius ({radius:.2f} A) differs "
                f"by >30% from Fe3+ ({r_fe_oct:.2f} A)."
            )

    return warnings


def _find_minimal_supercell(fractions: List[float], max_atoms: int = 500) -> Tuple[int, Tuple[int, int, int]]:
    """Compute minimal formula unit count N_fu needed so that all N_fu * fraction are integers.
    Returns: (N_fu, supercell_scaling (nx, ny, nz))
    """
    denominators = []
    for f in fractions:
        frac = Fraction(str(round(f, 6))).limit_denominator(1000)
        denominators.append(frac.denominator)

    def lcm(a, b):
        return abs(a * b) // math.gcd(a, b)

    n_fu = 1
    for d in denominators:
        n_fu = lcm(n_fu, d)

    # Conventional cell has 8 formula units. Primitive cell has 2 formula units.
    # To tile the conventional cell (Z=8), minimal conventional multiples:
    k = math.ceil(n_fu / 8.0)
    # Find smallest integer multiple of 8 >= n_fu divisible by n_fu
    while (k * 8) % n_fu != 0:
        k += 1
    total_fu = k * 8
    total_atoms = total_fu * 7  # 7 atoms per AB2O4 formula unit

    if total_atoms > max_atoms:
        raise ValueError(
            f"Exact ordered supercell for fractional doping requires {total_fu} formula units "
            f"({total_atoms} atoms), which exceeds max_atoms={max_atoms}. "
            f"Use mode='vca' for fractional/disordered models."
        )

    # Factor k into near-cubic scaling (nx, ny, nz)
    # k = nx * ny * nz
    best_diff = float("inf")
    best_factors = (1, 1, k)
    for nx in range(1, int(k ** (1/3)) + 2):
        if k % nx == 0:
            rem = k // nx
            for ny in range(nx, int(rem ** 0.5) + 2):
                if rem % ny == 0:
                    nz = rem // ny
                    diff = max(nx, ny, nz) - min(nx, ny, nz)
                    if diff < best_diff:
                        best_diff = diff
                        best_factors = (nx, ny, nz)

    return total_fu, best_factors


def spinel_base_cells(a: float, u: float = 0.255) -> List["BaseCell"]:
    """The base cells a spinel supercell can be tiled from.

    * conventional: 8 formula units / 56 atoms (cubic Fd-3m cell)
    * primitive:    2 formula units / 14 atoms (rhombohedral primitive cell)

    Tiling the primitive cell lets a dilute dopant reach a given nearest
    self-image distance with far fewer atoms than conventional-only tiling.
    """
    from .fractions import BaseCell
    conv = _build_parent_spinel(a=a, u=u)
    prim = conv.get_primitive_structure()
    return [
        BaseCell("conventional", 8, Lattice.cubic(a)),
        BaseCell("primitive", 2, prim.lattice),
    ]


def build_spinel(
    spec: Dict[str, Dict[str, float]],
    a: float = 8.38,
    mode: str = "vca",
    u: float = 0.255,
    max_atoms: int = 500,
    n_candidates: int = 1,
    supercell_matrix: Optional[List[List[int]]] = None,
    base: str = "conventional",
    host_formula: Optional[str] = None,
) -> Tuple[Structure, Dict[str, Any]]:
    """Build a spinel ferrite structure adhering to exact sublattice specifications.

    Parameters:
    - spec: Sublattice specification, e.g. {"A": {"Zn": 0.05}, "B": {"Ni": 0.95}}
    - a: Conventional cubic lattice parameter (Angstroms)
    - mode: "vca" (fractional occupancy CIF) or "ordered" (discrete integer supercell)
    - u: Oxygen positional parameter (default 0.255 in origin 2)
    - max_atoms: Threshold for supercell generation in mode="ordered"
    - n_candidates: Number of permutations evaluated by Ewald energy for ordered cells
    - supercell_matrix: optional integer 3x3 matrix (in base-cell units) to use
      instead of recomputing the cell — keeps the build consistent with the
      fraction plan produced by `fractions.py`.
    - base: "conventional" (8 f.u., 56 atoms) or "primitive" (2 f.u., 14 atoms).
    - host_formula: parent spinel formula (e.g. "NiFe2O4"). Used to infer which
      cation fills any un-specified sublattice remainder. Optional - the engine
      falls back to a charge-balance inference when it is absent.

    Returns:
    - (structure, report_dict)
    """
    # Step 1: Validate & fill spec (inferring the host element if a sublattice is short)
    A_spec, B_spec, auto_reports = _validate_and_fill_spec(spec, host_formula=host_formula)

    # Step 2: Charge balance check
    charge_reports = _check_charge_balance(A_spec, B_spec)

    # Step 3: Ionic radii & site plausibility heuristic
    radii_warnings = _check_ionic_radii(A_spec, B_spec)

    # Step 4: Build parent Fd-3m structure (conventional or primitive base)
    parent = _build_parent_spinel(a=a, u=u)
    if base == "primitive":
        parent = parent.get_primitive_structure()
    A_indices, B_indices, O_indices = classify_spinel_sites(parent)
    base_z = len(A_indices)   # spinel: one A site per formula unit

    report = {
        "A_spec": A_spec,
        "B_spec": B_spec,
        "mode": mode,
        "lattice_a": a,
        "auto_reports": auto_reports,
        "charge_reports": charge_reports,
        "radii_warnings": radii_warnings,
    }

    if mode == "vca":
        # Mode VCA: apply exact fractional occupancies across all A and B sites.
        # The plan matrix/base are honored (tiled VCA cell), so plan == build.
        struct = parent.copy()
        if supercell_matrix is not None:
            struct.make_supercell(np.asarray(supercell_matrix, dtype=int))
        A_v, B_v, _ = classify_spinel_sites(struct)
        for idx in A_v:
            struct[idx] = {el: amt for el, amt in A_spec.items() if el != "Vac"}
        for idx in B_v:
            # B sublattice has 2 sites per f.u., so per-site occupancy is fraction / 2.0
            struct[idx] = {el: round(amt / 2.0, 6) for el, amt in B_spec.items() if el != "Vac"}

        # Handle vacancies: remove sites if total occupancy < 1.0 (or keep partial)
        report["num_atoms"] = len(struct)
        report["formula"] = struct.composition.reduced_formula
        report["supercell_matrix"] = (np.asarray(supercell_matrix, dtype=int).tolist()
                                      if supercell_matrix is not None else [[1, 0, 0], [0, 1, 0], [0, 0, 1]])
        return struct, report

    elif mode == "ordered":
        # Mode Ordered: discrete integer assignment in minimal supercell
        # NOTE: B_spec values are per formula unit.  B_counts below are computed
        # as (amt/2)*num_B = (amt/2)*(2*total_fu) = amt*total_fu, so the
        # integrality condition is amt*total_fu ∈ Z — i.e. use the per-fu amount
        # directly.  Dividing by 2 here (an earlier bug) required a cell twice
        # as large as necessary.
        all_fractions = list(A_spec.values()) + list(B_spec.values())

        # Make supercell.  If the caller supplied a matrix (from the fraction
        # plan), use it directly so the build matches the plan exactly — and do
        # not run the minimal-supercell search, which would reject a
        # deliberately large (primitive-tiled) cell.
        if supercell_matrix is not None:
            sc_matrix = np.asarray(supercell_matrix, dtype=int)
            sc = parent.copy()
            sc.make_supercell(sc_matrix)
            used_scaling = tuple(int(round(x)) for x in np.diag(np.abs(sc_matrix)))
            total_fu = int(round(abs(np.linalg.det(sc_matrix)) * base_z))
        else:
            total_fu, scaling = _find_minimal_supercell(all_fractions, max_atoms=max_atoms)
            # Search all integer matrices of the right determinant
            # (Hermite normal forms) and use the least-skewed one.
            tiling = max(1, int(round(total_fu / base_z)))
            if tiling > 1:
                from .supercell import find_supercell
                choice = find_supercell(parent.lattice, tiling)
                sc_matrix = np.asarray(choice.matrix, dtype=int)
                sc = parent.copy()
                sc.make_supercell(sc_matrix)
                used_scaling = tuple(int(round(x)) for x in np.diag(np.abs(sc_matrix)))
            else:
                sc_matrix = np.eye(3, dtype=int)
                used_scaling = scaling
                sc = parent.copy()
                sc.make_supercell(scaling)
        sc_A, sc_B, sc_O = classify_spinel_sites(sc)

        num_A = len(sc_A)
        num_B = len(sc_B)

        # Calculate exact integer counts of each species on A and B.
        # Rounding is REPORTED per species (requested vs actual per f.u.) so a
        # case like Mn 80/20 in an 8 f.u. cell (6.4 Mn -> 6, i.e. 0.75 not 0.80)
        # can never silently change composition.
        def _rounded_counts(spec_dict, n_sites, per_fu_norm):
            counts, rounding = {}, {}
            for el, amt in spec_dict.items():
                exact = amt / per_fu_norm * n_sites
                got = int(round(exact))
                counts[el] = got
                actual = got / n_sites * per_fu_norm
                rounding[el] = {"requested_per_fu": round(amt, 6),
                                "actual_per_fu": round(actual, 6),
                                "error": round(actual - amt, 6)}
            return counts, rounding

        A_counts, A_round = _rounded_counts(A_spec, num_A, 1.0)
        B_counts, B_round = _rounded_counts(B_spec, num_B, 2.0)
        report["rounding"] = {"A": A_round, "B": B_round}
        report["rounding_warnings"] = [
            f"{el} on {site}: requested {r['requested_per_fu']}/fu, "
            f"built {r['actual_per_fu']}/fu (error {r['error']:+.4f})"
            for site, rr in (("A", A_round), ("B", B_round))
            for el, r in rr.items() if abs(r["error"]) > 1e-9
        ]

        # Verify sum matches
        assert sum(A_counts.values()) == num_A, f"A count sum {sum(A_counts.values())} != {num_A}"
        assert sum(B_counts.values()) == num_B, f"B count sum {sum(B_counts.values())} != {num_B}"

        # Build list of species to distribute.  Pools are sorted canonically by
        # element so the same seed always gives the same decoration regardless
        # of the input order of the spec dict (metamorphic M-e invariance).
        A_pool = []
        for el in sorted(A_counts):
            A_pool.extend([el] * A_counts[el])

        B_pool = []
        for el in sorted(B_counts):
            B_pool.extend([el] * B_counts[el])

        best_struct = None
        best_ewald = float("inf")

        for _ in range(max(1, n_candidates)):
            cand = sc.copy()
            perm_A = np.random.permutation(A_pool)
            perm_B = np.random.permutation(B_pool)

            for i, idx in enumerate(sc_A):
                cand[idx] = perm_A[i]
            for i, idx in enumerate(sc_B):
                cand[idx] = perm_B[i]

            # Remove explicit vacancies
            vac_sites = [i for i, s in enumerate(cand) if s.species_string == "Vac"]
            if vac_sites:
                cand.remove_sites(vac_sites)

            if n_candidates > 1:
                try:
                    # Assign nominal charges for Ewald evaluation
                    for s in cand:
                        s.species = {Element(s.species_string): NOMINAL_CHARGES.get(s.species_string, 2.0)}
                    ewald_energy = EwaldSummation(cand).total_energy
                except Exception:
                    ewald_energy = 0.0
            else:
                ewald_energy = 0.0

            if ewald_energy < best_ewald or best_struct is None:
                best_ewald = ewald_energy
                best_struct = cand

        report["supercell_scaling"] = used_scaling
        report["supercell_matrix"] = sc_matrix.tolist()
        report["num_formula_units"] = total_fu
        report["num_atoms"] = len(best_struct)
        report["formula"] = best_struct.composition.reduced_formula
        return best_struct, report

    else:
        raise ValueError(f"Unknown mode '{mode}'. Supported modes: 'vca', 'ordered'.")


def verify(structure: Structure, expected_spec: Dict[str, Dict[str, float]], atol: float = 1e-4,
           host_formula: Optional[str] = None) -> bool:
    """Independently re-measures the composition and per-site sublattice occupancy
    by classifying polyhedra by oxygen coordination (CN=4 vs CN=6).
    Raises ValueError on mismatch.
    """
    A_exp, B_exp, _ = _validate_and_fill_spec(expected_spec, host_formula=host_formula)
    A_indices, B_indices, O_indices = classify_spinel_sites(structure)

    # Measure A-sublattice
    num_A = len(A_indices)
    A_measured = {}
    for idx in A_indices:
        for sp, occ in structure[idx].species.items():
            sym = str(sp)
            A_measured[sym] = A_measured.get(sym, 0.0) + (occ / num_A)

    # Measure B-sublattice (normalized to 2.0 formula units)
    num_B = len(B_indices)
    B_measured = {}
    for idx in B_indices:
        for sp, occ in structure[idx].species.items():
            sym = str(sp)
            B_measured[sym] = B_measured.get(sym, 0.0) + (occ / num_B) * 2.0

    # Compare A
    for el, exp_amt in A_exp.items():
        if el == "Vac":
            continue
        meas_amt = A_measured.get(el, 0.0)
        if abs(meas_amt - exp_amt) > atol:
            raise ValueError(
                f"Sublattice A mismatch for '{el}': expected {exp_amt:.4f}, measured {meas_amt:.4f}"
            )

    # Compare B
    for el, exp_amt in B_exp.items():
        if el == "Vac":
            continue
        meas_amt = B_measured.get(el, 0.0)
        if abs(meas_amt - exp_amt) > atol:
            raise ValueError(
                f"Sublattice B mismatch for '{el}': expected {exp_amt:.4f}, measured {meas_amt:.4f}"
            )

    return True


def write_cif(structure: Structure, filename: str) -> None:
    """Write an IUCr-compliant CIF file with unique atom labels and symmetry."""
    try:
        cw = CifWriter(structure, symprec=0.1, refine_struct=True)
        cw.write_file(filename)
    except Exception:
        # Fallback with explicit unique labeling
        struct_copy = structure.copy()
        element_counts = {}
        for site in struct_copy:
            el = site.species_string
            element_counts[el] = element_counts.get(el, 0) + 1
            site.properties["label"] = f"{el}{element_counts[el]}"
        cw = CifWriter(struct_copy, symprec=0.1)
        cw.write_file(filename)
