"""
family.py — base-family / base-model resolution.

Answers the first question in the doped-CIF pipeline: *what parent model are we
using, and what are the crystallographic roles of its sites?*

Given either a formula or a parent `Structure`, `classify_family` returns a
`FamilyInfo` object that every later stage (regime, fractions, representation)
reads from.  The family decides:

  * which site roles exist (A, B, anion, mobile ion, framework cation, ...),
  * each role's coordination number and multiplicity per formula unit,
  * which species is/are mobile (for the site-hopping / snapshot question),
  * the sites-per-formula-unit count used for supercell sizing.
"""

from __future__ import annotations

from dataclasses import dataclass, field
from typing import Dict, List, Optional, Any

from pymatgen.core import Structure, Composition, Element

try:  # pragma: no cover - import location differs across pymatgen versions
    from pymatgen.analysis.local_env import CrystalNN
except ImportError:  # pragma: no cover
    from pymatgen.core.local_env import CrystalNN

from pymatgen.symmetry.analyzer import SpacegroupAnalyzer

ANION_ELEMENTS = {"O", "F", "Cl", "Br", "I", "S", "Se", "Te", "N"}


@dataclass
class SiteRole:
    """One symmetry-distinct crystallographic orbit and what it is for."""
    element: str
    role: str                       # "A" | "B" | "anion" | "mobile" | "framework" | "polyanion" | "atom"
    cn: Optional[int] = None        # coordination number
    wyckoff: Optional[str] = None
    multiplicity: Optional[int] = None      # sites per conventional cell
    oxidation_state: Optional[int] = None
    label: str = ""
    notes: str = ""


@dataclass
class FamilyInfo:
    family: str                     # "spinel" | "perovskite" | "garnet" | ... | "unknown"
    formula: str
    space_group: Optional[str] = None
    spacegroup_number: Optional[int] = None
    site_roles: List[SiteRole] = field(default_factory=list)
    mobile_species: List[str] = field(default_factory=list)
    sites_per_formula_unit: Optional[float] = None
    source: str = "unknown"         # "structure" | "formula" | "database"
    method: str = ""
    confidence: str = "low"         # "high" | "medium" | "low"
    flags: List[str] = field(default_factory=list)
    notes: str = ""


# ─────────────────────────────────────────────────────────────────────────────
# Formula-based recognition (works without a Structure)
# ─────────────────────────────────────────────────────────────────────────────

_SPINEL_HINT = ("spinel",)
_STOICHIOMETRIC_PATTERNS = [
    # (family, regex on the reduced formula)
    ("olivine",   r"^Li(Fe|Mn|Co|Ni)PO4$"),
    ("nasicon",   r"^Na?Li?[A-Z][a-z]?[A-Z][a-z]?\(PO4\)?3$"),
    ("layered",   r"^Li(Co|Ni|Mn|Fe)O2$"),
    ("garnet",    r"^[A-Z][a-z]?3[A-Z][a-z]?\d+[A-Z][a-z]?\d*O12$"),
    ("fluorite",  r"^[A-Z][a-z]?(O2|F4)$"),
    ("perovskite", r"^[A-Z][a-z]?[A-Z][a-z]?O3$"),
    ("spinel",    r"^[A-Z][a-z]?[A-Z][a-z]?2O4$"),
    ("rocksalt",  r"^[A-Z][a-z]?[A-Z][a-z]?$"),
]


def _family_from_formula(formula: str) -> Optional[str]:
    import re
    # Strip any fractional subscripts like Zn0.5Ni0.5Fe2O4 -> best-effort match
    reduced = Composition(formula).reduced_formula if formula else formula
    for fam, pat in _STOICHIOMETRIC_PATTERNS:
        if re.match(pat, reduced):
            return fam
    # Spinel fallback: AB2O4 with fractional A occupancy
    try:
        comp = Composition(formula)
        amounts = {el.symbol: amt for el, amt in comp.items()}
        if "O" in amounts and abs(amounts["O"] - 4.0) < 1e-6:
            return "spinel"
    except Exception:
        pass
    return None


# ─────────────────────────────────────────────────────────────────────────────
# Structure-based recognition
# ─────────────────────────────────────────────────────────────────────────────

def _estimate_cn(structure: Structure, idx: int, cnn: CrystalNN) -> int:
    try:
        return int(cnn.get_cn(structure, idx))
    except Exception:
        # Distance fallback: count neighbours within 1.3x the shortest contact
        site = structure[idx]
        dists = sorted(structure.get_distance(idx, j) for j in range(len(structure)) if j != idx)
        if not dists:
            return 0
        cutoff = dists[0] * 1.3
        return sum(1 for d in dists if d <= cutoff)


_ROLE_BY_CN_OXIDE = {
    4: "A", 6: "B",
}

_FAMILY_BY_SG = {
    227: "spinel",       # Fd-3m
    141: "spinel",       # I4_1/amd (distorted spinel)
    221: "perovskite",   # Pm-3m
    62: "olivine",       # Pnma (olivine)
    167: "corundum",     # R-3c (some NASICON/layered too)
    230: "garnet",       # Ia-3d
    225: "rocksalt",     # Fm-3m (rocksalt/fluorite)
    166: "layered",      # R-3m
    148: "layered",      # R-3
}


def _structure_family_and_roles(structure: Structure) -> FamilyInfo:
    sga = SpacegroupAnalyzer(structure, symprec=0.1)
    sg_num = sga.get_space_group_number()
    sg_sym = sga.get_space_group_symbol()
    symm = sga.get_symmetrized_structure()
    cnn = CrystalNN()

    roles: List[SiteRole] = []
    for orbit_idx, eq_sites in enumerate(symm.equivalent_sites):
        first = eq_sites[0]
        el = first.species_string
        try:
            idx = symm.index(first)
        except Exception:
            idx = 0
        cn = _estimate_cn(symm, idx, cnn)
        wyck = symm.wyckoff_symbols[orbit_idx] if orbit_idx < len(symm.wyckoff_symbols) else None

        if el in ANION_ELEMENTS:
            role = "anion"
        elif cn >= 10:
            role = "A"
        elif cn <= 4:
            role = "A"
        elif cn == 6:
            role = "B"
        else:
            role = "framework"

        roles.append(SiteRole(
            element=el, role=role, cn=cn, wyckoff=wyck,
            multiplicity=len(eq_sites), label=f"{el}@{wyck}_CN{cn}",
        ))

    # Family guess: space group first, else coordination signature
    family = _FAMILY_BY_SG.get(sg_num)
    flags = []
    if family is None:
        tetra = [r for r in roles if r.cn == 4]
        octa = [r for r in roles if r.cn == 6]
        if tetra and octa:
            ratio = len(octa) / max(1, len(tetra))
            if 1.8 <= ratio <= 2.2:
                family = "spinel"
        if family is None:
            family = _family_from_formula(structure.composition.reduced_formula) or "unknown"
            flags.append("family inferred from formula, not space group")

    # Sites per formula unit
    comp = structure.composition
    n_fu = _formula_units_in_cell(structure, comp)
    sites_per_fu = len(structure) / n_fu if n_fu else None

    mobile = _guess_mobile_species(structure, roles, family)
    return FamilyInfo(
        family=family, formula=comp.reduced_formula, space_group=sg_sym,
        spacegroup_number=sg_num, site_roles=roles, mobile_species=mobile,
        sites_per_formula_unit=sites_per_fu, source="structure",
        method=f"spacegroup {sg_sym} ({sg_num}) + coordination signature",
        confidence="high" if sg_num in _FAMILY_BY_SG else "medium", flags=flags,
    )


def _formula_units_in_cell(structure: Structure, comp: Composition) -> float:
    """Best-effort Z: use the reduced formula and cell contents if it divides."""
    reduced = comp.reduced_formula
    for z in range(1, 17):
        from pymatgen.core import Composition as C
        if abs(comp.get_atomic_fraction(comp.elements[0]) * 0) == 0:  # no-op guard
            pass
        try:
            test = C(reduced) * z
            if test.almost_equals(comp, rtol=1e-3, atol=1e-3):
                return float(z)
        except Exception:
            continue
    return 1.0


_MOBILE_BY_FAMILY = {
    "nasicon": ["Na", "Li"],
    "layered": ["Li"],
    "olivine": ["Li"],
    "garnet": ["Li"],
}


def _guess_mobile_species(structure, roles, family) -> List[str]:
    mobile: List[str] = []
    # Family-implied mobile ions
    for el in _MOBILE_BY_FAMILY.get(family, []):
        if el in [r.element for r in roles] and el not in mobile:
            mobile.append(el)
    # Partial occupancy on any site is a mobility flag
    for site in structure:
        if not site.is_ordered and site.species_string not in mobile:
            mobile.append(site.species_string)
    return mobile


# ─────────────────────────────────────────────────────────────────────────────
# Public API
# ─────────────────────────────────────────────────────────────────────────────

# Conventional formula-unit counts and roles for common families when only a
# formula is available (no structure).
_FORMULA_FAMILY_SPECS = {
    "spinel": dict(sites_per_fu=7.0, roles=[
        ("A", 4, 1), ("B", 6, 2), ("anion", 3, 4),
    ]),
    "perovskite": dict(sites_per_fu=5.0, roles=[("A", 12, 1), ("B", 6, 1), ("anion", 3, 3)]),
    "garnet": dict(sites_per_fu=20.0, roles=[("A", 8, 3), ("B", 6, 2), ("framework", 4, 3), ("anion", 3, 12)]),
    "olivine": dict(sites_per_fu=7.0, roles=[("A", 6, 1), ("B", 6, 1), ("anion", 4, 4)]),
    "nasicon": dict(sites_per_fu=20.0, roles=[("mobile", 6, 3), ("framework", 6, 2), ("polyanion", 4, 3), ("anion", 2, 12)]),
    "layered": dict(sites_per_fu=4.0, roles=[("mobile", 6, 1), ("B", 6, 1), ("anion", 3, 2)]),
    "rocksalt": dict(sites_per_fu=2.0, roles=[("A", 6, 1), ("anion", 6, 1)]),
    "fluorite": dict(sites_per_fu=3.0, roles=[("A", 8, 1), ("anion", 4, 2)]),
}


def classify_family(
    formula: Optional[str] = None,
    structure: Optional[Structure] = None,
) -> FamilyInfo:
    """Resolve the base family and its site roles.

    Prefer passing a `structure` (highest confidence).  A `formula` alone still
    yields the family and the canonical role template, flagged lower-confidence.
    """
    if structure is not None:
        info = _structure_family_and_roles(structure)
        if formula is None:
            return info
        if info.family == "unknown":
            info.family = _family_from_formula(formula) or info.family
        return info

    if not formula:
        raise ValueError("classify_family requires either a formula or a structure")

    family = _family_from_formula(formula) or "unknown"
    spec = _FORMULA_FAMILY_SPECS.get(family)
    roles: List[SiteRole] = []
    if spec:
        for role, cn, mult in spec["roles"]:
            roles.append(SiteRole(element="", role=role, cn=cn, multiplicity=mult,
                                  label=f"{role}_CN{cn}"))

    mobile = _MOBILE_BY_FAMILY.get(family, [])
    return FamilyInfo(
        family=family, formula=formula, site_roles=roles,
        mobile_species=list(mobile),
        sites_per_formula_unit=spec["sites_per_fu"] if spec else None,
        source="formula", method=f"stoichiometry pattern -> {family}",
        confidence="medium" if spec else "low",
        flags=[] if spec else ["family not recognized from formula alone"],
    )
