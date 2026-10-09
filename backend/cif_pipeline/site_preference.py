"""
Site Preference Knowledge Base.

Comprehensive crystallographic knowledge for deciding where a dopant ion sits
in a crystal structure, based on:
  1. Shannon effective ionic radii (coordination-number and oxidation-state specific)
  2. Crystal Field Stabilization Energy (CFSE) — octahedral site preference energies
  3. Pauling electronegativity and covalency arguments
  4. Structure-type-specific rules (spinel, perovskite, garnet, …)

This module is the SINGLE source of truth for site preference decisions.
It never guesses: it classifies preference strength as strong / weak / none / unknown,
and downstream code must ask the user for anything below "strong".

References:
  - Shannon, R. D. Acta Cryst. A32, 751–767 (1976)
  - Dunitz, J. D. & Orgel, L. E. J. Phys. Chem. Solids 3, 318–323 (1957)
  - Navrotsky, A. & Kleppa, O. J. J. Inorg. Nucl. Chem. 29, 2701–2714 (1967)
"""

from __future__ import annotations
import logging
import math
from typing import Dict, List, Optional, Tuple, Any

from pymatgen.core import Composition, Element

# Display formatting: sublattice populations follow the project's 2-decimal rule.
from .formatting import format_amount

log = logging.getLogger("cif_pipeline.site_preference")

# ─────────────────────────────────────────────────────────────────────────────
# 1. SHANNON EFFECTIVE IONIC RADII (Å)
#    Key: (element_symbol, coordination_number, oxidation_state)
#    Values are for high-spin unless noted.  CN = 4 (tetrahedral), 6 (octahedral),
#    8 (cubic/dodecahedral), 12 (cuboctahedral/A-site perovskite).
# ─────────────────────────────────────────────────────────────────────────────
SHANNON_RADII: Dict[Tuple[str, int, int], float] = {
    # ── Alkali metals ──
    ("Li", 4, 1): 0.59,   ("Li", 6, 1): 0.76,   ("Li", 8, 1): 0.92,
    ("Na", 4, 1): 0.99,   ("Na", 6, 1): 1.02,   ("Na", 8, 1): 1.18,   ("Na", 12, 1): 1.39,
    ("K",  6, 1): 1.38,   ("K",  8, 1): 1.51,   ("K",  12, 1): 1.64,
    ("Rb", 6, 1): 1.52,   ("Rb", 8, 1): 1.61,   ("Rb", 12, 1): 1.72,
    ("Cs", 6, 1): 1.67,   ("Cs", 8, 1): 1.74,   ("Cs", 12, 1): 1.88,

    # ── Alkaline earth metals ──
    ("Be", 4, 2): 0.27,   ("Be", 6, 2): 0.45,
    ("Mg", 4, 2): 0.57,   ("Mg", 6, 2): 0.72,   ("Mg", 8, 2): 0.89,
    ("Ca", 6, 2): 1.00,   ("Ca", 8, 2): 1.12,   ("Ca", 12, 2): 1.34,
    ("Sr", 6, 2): 1.18,   ("Sr", 8, 2): 1.26,   ("Sr", 12, 2): 1.44,
    ("Ba", 6, 2): 1.35,   ("Ba", 8, 2): 1.42,   ("Ba", 12, 2): 1.61,

    # ── 3d transition metals ──
    # Sc
    ("Sc", 6, 3): 0.745,  ("Sc", 8, 3): 0.870,
    # Ti
    ("Ti", 4, 4): 0.42,   ("Ti", 6, 2): 0.86,   ("Ti", 6, 3): 0.67,   ("Ti", 6, 4): 0.605,
    # V
    ("V",  4, 3): 0.355,  ("V",  4, 5): 0.355,
    ("V",  6, 2): 0.79,   ("V",  6, 3): 0.64,   ("V",  6, 4): 0.58,   ("V",  6, 5): 0.54,
    # Cr
    ("Cr", 4, 4): 0.41,
    ("Cr", 6, 2): 0.73,   ("Cr", 6, 3): 0.615,  ("Cr", 6, 6): 0.44,
    # Mn
    ("Mn", 4, 2): 0.66,   ("Mn", 4, 3): 0.39,
    ("Mn", 6, 2): 0.83,   ("Mn", 6, 3): 0.645,  ("Mn", 6, 4): 0.53,   ("Mn", 6, 7): 0.46,
    # Fe
    ("Fe", 4, 2): 0.63,   ("Fe", 4, 3): 0.49,
    ("Fe", 6, 2): 0.78,   ("Fe", 6, 3): 0.645,  ("Fe", 6, 4): 0.585,
    # Co
    ("Co", 4, 2): 0.58,   ("Co", 4, 3): 0.40,
    ("Co", 6, 2): 0.745,  ("Co", 6, 3): 0.61,   ("Co", 6, 4): 0.53,
    # Ni
    ("Ni", 4, 2): 0.55,
    ("Ni", 6, 2): 0.69,   ("Ni", 6, 3): 0.56,   ("Ni", 6, 4): 0.48,
    # Cu
    ("Cu", 4, 1): 0.60,   ("Cu", 4, 2): 0.57,
    ("Cu", 6, 1): 0.77,   ("Cu", 6, 2): 0.73,   ("Cu", 6, 3): 0.54,
    # Zn
    ("Zn", 4, 2): 0.60,   ("Zn", 6, 2): 0.74,

    # ── 4d transition metals ──
    ("Y",  6, 3): 0.90,   ("Y",  8, 3): 1.019,  ("Y",  9, 3): 1.075,
    ("Zr", 4, 4): 0.59,   ("Zr", 6, 4): 0.72,   ("Zr", 8, 4): 0.84,
    ("Nb", 4, 5): 0.48,   ("Nb", 6, 4): 0.68,   ("Nb", 6, 5): 0.64,
    ("Mo", 4, 6): 0.41,   ("Mo", 6, 4): 0.65,   ("Mo", 6, 6): 0.59,
    ("Ru", 6, 3): 0.68,   ("Ru", 6, 4): 0.62,   ("Ru", 6, 5): 0.565,
    ("Rh", 6, 3): 0.665,  ("Rh", 6, 4): 0.60,
    ("Pd", 4, 2): 0.64,   ("Pd", 6, 2): 0.86,   ("Pd", 6, 4): 0.615,
    ("Ag", 4, 1): 1.00,   ("Ag", 6, 1): 1.15,   ("Ag", 6, 2): 0.94,
    ("Cd", 4, 2): 0.78,   ("Cd", 6, 2): 0.95,   ("Cd", 8, 2): 1.10,

    # ── 5d transition metals ──
    ("Hf", 6, 4): 0.71,   ("Hf", 8, 4): 0.83,
    ("Ta", 6, 5): 0.64,
    ("W",  4, 6): 0.42,   ("W",  6, 4): 0.66,   ("W",  6, 6): 0.60,
    ("Re", 6, 4): 0.63,   ("Re", 6, 7): 0.53,
    ("Os", 6, 4): 0.63,
    ("Ir", 6, 3): 0.68,   ("Ir", 6, 4): 0.625,
    ("Pt", 4, 2): 0.60,   ("Pt", 6, 2): 0.80,   ("Pt", 6, 4): 0.625,
    ("Au", 4, 1): 0.64,   ("Au", 6, 3): 0.85,

    # ── Lanthanides (3+ in CN=6, 8, 9, 12) ──
    ("La", 6, 3): 1.032,  ("La", 8, 3): 1.160,  ("La", 9, 3): 1.216,  ("La", 12, 3): 1.36,
    ("Ce", 6, 3): 1.01,   ("Ce", 6, 4): 0.87,   ("Ce", 8, 3): 1.143,  ("Ce", 12, 3): 1.34,
    ("Pr", 6, 3): 0.99,   ("Pr", 8, 3): 1.126,
    ("Nd", 6, 3): 0.983,  ("Nd", 8, 3): 1.109,  ("Nd", 9, 3): 1.163,  ("Nd", 12, 3): 1.27,
    ("Sm", 6, 3): 0.958,  ("Sm", 8, 3): 1.079,  ("Sm", 12, 3): 1.24,
    ("Eu", 6, 2): 1.17,   ("Eu", 6, 3): 0.947,  ("Eu", 8, 3): 1.066,
    ("Gd", 6, 3): 0.938,  ("Gd", 8, 3): 1.053,
    ("Tb", 6, 3): 0.923,  ("Tb", 6, 4): 0.76,   ("Tb", 8, 3): 1.040,
    ("Dy", 6, 3): 0.912,  ("Dy", 8, 3): 1.027,
    ("Ho", 6, 3): 0.901,  ("Ho", 8, 3): 1.015,
    ("Er", 6, 3): 0.890,  ("Er", 8, 3): 1.004,
    ("Yb", 6, 3): 0.868,  ("Yb", 8, 3): 0.985,
    ("Lu", 6, 3): 0.861,  ("Lu", 8, 3): 0.977,

    # ── p-block elements ──
    ("Al", 4, 3): 0.39,   ("Al", 6, 3): 0.535,
    ("Ga", 4, 3): 0.47,   ("Ga", 6, 3): 0.62,
    ("In", 6, 3): 0.80,   ("In", 8, 3): 0.92,
    ("Tl", 6, 1): 1.50,   ("Tl", 6, 3): 0.885,
    ("Si", 4, 4): 0.26,   ("Si", 6, 4): 0.40,
    ("Ge", 4, 4): 0.39,   ("Ge", 6, 4): 0.53,
    ("Sn", 4, 4): 0.55,   ("Sn", 6, 2): 0.93,   ("Sn", 6, 4): 0.69,
    ("Pb", 6, 2): 1.19,   ("Pb", 6, 4): 0.775,  ("Pb", 8, 2): 1.29,  ("Pb", 12, 2): 1.49,
    ("Bi", 6, 3): 1.03,   ("Bi", 8, 3): 1.17,
    ("Sb", 6, 3): 0.76,   ("Sb", 6, 5): 0.60,
    ("Te", 4, 4): 0.66,   ("Te", 6, 4): 0.97,   ("Te", 6, 6): 0.56,
    # Anions (for reference)
    ("O",  6, -2): 1.40,  ("O",  4, -2): 1.38,
    ("F",  6, -1): 1.33,
    ("Cl", 6, -1): 1.81,
    ("Br", 6, -1): 1.96,
    ("I",  6, -1): 2.20,
    ("N",  4, -3): 1.46,  ("N",  6, -3): 1.50,
    ("S",  6, -2): 1.84,
    ("Se", 6, -2): 1.98,
}

# ─────────────────────────────────────────────────────────────────────────────
# 2. NOMINAL / COMMON OXIDATION STATES
#    Used for default charge-balance calculations when the user hasn't
#    specified an oxidation state.  Multiple states are listed in order
#    of frequency in oxide/ferrite contexts.
# ─────────────────────────────────────────────────────────────────────────────
COMMON_OXIDATION_STATES: Dict[str, List[int]] = {
    # Alkali
    "Li": [1], "Na": [1], "K": [1], "Rb": [1], "Cs": [1],
    # Alkaline earth
    "Be": [2], "Mg": [2], "Ca": [2], "Sr": [2], "Ba": [2],
    # 3d
    "Sc": [3],
    "Ti": [4, 3, 2],
    "V":  [5, 4, 3, 2],
    "Cr": [3, 6, 2],
    "Mn": [2, 3, 4, 7],
    "Fe": [3, 2],
    "Co": [2, 3],
    "Ni": [2, 3],
    "Cu": [2, 1],
    "Zn": [2],
    # 4d
    "Y":  [3],
    "Zr": [4],
    "Nb": [5, 4],
    "Mo": [6, 4],
    "Ru": [4, 3],
    "Rh": [3, 4],
    "Pd": [2, 4],
    "Ag": [1, 2],
    "Cd": [2],
    # 5d
    "Hf": [4],
    "Ta": [5],
    "W":  [6, 4],
    "Re": [7, 4],
    "Ir": [4, 3],
    "Pt": [4, 2],
    "Au": [3, 1],
    # Lanthanides
    "La": [3], "Ce": [3, 4], "Pr": [3], "Nd": [3], "Sm": [3],
    "Eu": [3, 2], "Gd": [3], "Tb": [3, 4], "Dy": [3], "Ho": [3],
    "Er": [3], "Yb": [3], "Lu": [3],
    # p-block
    "Al": [3], "Ga": [3], "In": [3], "Tl": [3, 1],
    "Si": [4], "Ge": [4], "Sn": [4, 2], "Pb": [2, 4],
    "Bi": [3, 5], "Sb": [3, 5], "Te": [4, 6],
    # Anions
    "O": [-2], "F": [-1], "Cl": [-1], "Br": [-1], "I": [-1],
    "N": [-3], "S": [-2], "Se": [-2],
}

# ─────────────────────────────────────────────────────────────────────────────
# 3. CRYSTAL FIELD STABILIZATION ENERGY (CFSE)
#    Octahedral Site Preference Energy (OSPE) in kJ/mol.
#    Positive = prefers octahedral over tetrahedral.
#    Zero = no crystal-field preference.
#    These are textbook Dunitz-Orgel values for high-spin configurations.
# ─────────────────────────────────────────────────────────────────────────────
CFSE_OCTAHEDRAL_PREFERENCE: Dict[Tuple[str, int], float] = {
    # (element, oxidation_state) → OSPE in kJ/mol
    # d⁰
    ("Sc", 3): 0.0,   ("Ti", 4): 0.0,   ("Zr", 4): 0.0,   ("Hf", 4): 0.0,
    ("V",  5): 0.0,   ("Nb", 5): 0.0,   ("Ta", 5): 0.0,
    ("Cr", 6): 0.0,   ("Mo", 6): 0.0,   ("W",  6): 0.0,
    # d¹
    ("Ti", 3): 26.8,  ("V",  4): 26.8,
    # d²
    ("Ti", 2): 50.2,  ("V",  3): 50.2,  ("Cr", 4): 50.2,
    # d³ — maximum OSPE
    ("V",  2): 158.2, ("Cr", 3): 158.2, ("Mn", 4): 158.2,
    # d⁴ (high spin)
    ("Cr", 2): 30.1,  ("Mn", 3): 30.1,
    # d⁵ (high spin) — zero OSPE, all orbitals singly occupied
    ("Mn", 2): 0.0,   ("Fe", 3): 0.0,
    # d⁶ (high spin)
    ("Fe", 2): 16.3,  ("Co", 3): 16.3,
    # d⁷ (high spin)
    ("Co", 2): 31.4,
    # d⁸
    ("Ni", 2): 86.2,  ("Cu", 3): 86.2,
    # d⁹ — Jahn-Teller distortion adds extra stabilisation
    ("Cu", 2): 63.6,  # literature range 60-90 depending on JT contribution
    ("Cu", 1): 0.0,   # d¹⁰
    # d¹⁰ — zero OSPE, drives tetrahedral preference via covalency
    ("Zn", 2): 0.0,   ("Ga", 3): 0.0,   ("Ge", 4): 0.0,
    ("Cd", 2): 0.0,   ("In", 3): 0.0,   ("Sn", 4): 0.0,
    ("Ag", 1): 0.0,
    # Non-transition metals
    ("Al", 3): 0.0,   ("Mg", 2): 0.0,   ("Ca", 2): 0.0,
    ("Li", 1): 0.0,   ("Na", 1): 0.0,
    ("Sr", 2): 0.0,   ("Ba", 2): 0.0,
}

# ─────────────────────────────────────────────────────────────────────────────
# 4. PAULING ELECTRONEGATIVITY
# ─────────────────────────────────────────────────────────────────────────────
ELECTRONEGATIVITY: Dict[str, float] = {
    "H": 2.20, "He": 0.0,
    "Li": 0.98, "Be": 1.57, "B": 2.04, "C": 2.55, "N": 3.04, "O": 3.44, "F": 3.98,
    "Na": 0.93, "Mg": 1.31, "Al": 1.61, "Si": 1.90, "P": 2.19, "S": 2.58, "Cl": 3.16,
    "K": 0.82, "Ca": 1.00, "Sc": 1.36, "Ti": 1.54, "V": 1.63, "Cr": 1.66,
    "Mn": 1.55, "Fe": 1.83, "Co": 1.88, "Ni": 1.91, "Cu": 1.90, "Zn": 1.65,
    "Ga": 1.81, "Ge": 2.01, "As": 2.18, "Se": 2.55, "Br": 2.96,
    "Rb": 0.82, "Sr": 0.95, "Y": 1.22, "Zr": 1.33, "Nb": 1.60, "Mo": 2.16,
    "Ru": 2.20, "Rh": 2.28, "Pd": 2.20, "Ag": 1.93, "Cd": 1.69,
    "In": 1.78, "Sn": 1.96, "Sb": 2.05, "Te": 2.10, "I": 2.66,
    "Cs": 0.79, "Ba": 0.89, "La": 1.10, "Ce": 1.12, "Pr": 1.13,
    "Nd": 1.14, "Sm": 1.17, "Eu": 1.20, "Gd": 1.20, "Tb": 1.20,
    "Dy": 1.22, "Ho": 1.23, "Er": 1.24, "Yb": 1.25, "Lu": 1.27,
    "Hf": 1.30, "Ta": 1.50, "W": 2.36, "Re": 1.90, "Os": 2.20,
    "Ir": 2.20, "Pt": 2.28, "Au": 2.54, "Pb": 2.33, "Bi": 2.02,
}

# ─────────────────────────────────────────────────────────────────────────────
# 5. SPINEL SITE PREFERENCE TABLE
#    Key: element symbol → dict with fields:
#      ox:       common oxidation state in spinel context
#      site:     "A" (tetrahedral) | "B" (octahedral) | "both" | "?" (unknown)
#      strength: "strong" | "weak" | "none" | "unknown"
#      reason:   human-readable crystallographic rationale
#      ospe:     octahedral site preference energy (kJ/mol), if applicable
#      notes:    additional caveats
# ─────────────────────────────────────────────────────────────────────────────
SPINEL_SITE_TABLE: Dict[str, Dict[str, Any]] = {
    # ── Strong A-site (tetrahedral) ──
    "Zn": {
        "ox": 2, "site": "A", "strength": "strong",
        "reason": "d¹⁰ (no CFSE); sp³ covalent bonding with O strongly favours tetrahedral; "
                  "ZnFe₂O₄ is the canonical normal spinel",
        "ospe": 0.0,
        "source": "literature:neutron",
        "ref": "Hastings & Corliss (1956)",
        "notes": "Always A in ferrites. End-member: ZnFe₂O₄ (normal).",
    },
    "Cd": {
        "ox": 2, "site": "A", "strength": "strong",
        "reason": "d¹⁰, same as Zn; CdFe₂O₄ is normal spinel",
        "ospe": 0.0,
        "source": "literature:xray",
        "ref": "O'Neill & Navrotsky (1983)",
        "notes": "Isoelectronic with Zn. Always A.",
    },

    # ── Strong B-site (octahedral) ──
    "Ni": {
        "ox": 2, "site": "B", "strength": "strong",
        "reason": "d⁸ → large octahedral CFSE (86 kJ/mol); NiFe₂O₄ is inverse spinel",
        "ospe": 86.2,
        "source": "literature:neutron",
        "ref": "Bhowmik et al. (2008)",
        "notes": "NiFe₂O₄ inverse: (Fe)[Ni Fe]O₄. Ni always on B.",
    },
    "Cr": {
        "ox": 3, "site": "B", "strength": "strong",
        "reason": "d³ → maximum octahedral CFSE (158 kJ/mol); FeCr₂O₄ (chromite) has Cr entirely on B",
        "ospe": 158.2,
        "source": "literature:neutron",
        "ref": "Shiratori et al. (1965)",
        "notes": "Strongest known octahedral preference among common dopants.",
    },
    "Ti": {
        "ox": 4, "site": "B", "strength": "strong",
        "reason": "d⁰, small, highly charged; fits octahedral hole; Fe₂TiO₄ (ulvöspinel) is inverse",
        "ospe": 0.0,
        "source": "literature:xray",
        "ref": "Smit & Wijn (1959)",
        "notes": "Electrostatic + size favour B. Ti⁴⁺ replaces Fe³⁺ (charge compensation needed).",
    },
    "Sn": {
        "ox": 4, "site": "B", "strength": "strong",
        "reason": "d¹⁰ but large charge (4+) and suitable octahedral size; always B in ferrites",
        "ospe": 0.0,
        "source": "literature:mossbauer",
        "ref": "Berry et al. (1983)",
        "notes": "SnFe₂O₄ has Sn entirely on B.",
    },
    "V": {
        "ox": 3, "site": "B", "strength": "strong",
        "reason": "d² → significant octahedral CFSE (~50 kJ/mol); V³⁺ prefers octahedral",
        "ospe": 50.2,
        "source": "literature:xray",
        "ref": "Riedel et al. (1981)",
        "notes": "Vanadium ferrites place V on B.",
    },
    "Ru": {
        "ox": 4, "site": "B", "strength": "strong",
        "reason": "4d transition metal; strong octahedral preference in oxides",
        "ospe": 0.0,  # 4d CFSE not well-tabulated in same framework
        "source": "literature:xray",
        "ref": "Shannon (1976)",
        "notes": "Always octahedral in spinel-type oxides.",
    },
    "Rh": {
        "ox": 3, "site": "B", "strength": "strong",
        "reason": "4d⁶ (low-spin); strong octahedral preference",
        "ospe": 0.0,
        "source": "literature:xray",
        "ref": "Shannon (1976)",
        "notes": "Octahedral in ferrites.",
    },

    # ── B-site with variable inversion (scenario-dependent) ──
    "Cu": {
        "ox": 2, "site": "B", "strength": "weak",
        "reason": "d⁹ → octahedral CFSE (64 kJ/mol) + Jahn-Teller distortion stabilises B; "
                  "CuFe₂O₄ is largely inverse, but inversion varies 0.7–1.0 depending on quench/anneal temperature",
        "ospe": 63.6,
        "source": "literature:mossbauer",
        "ref": "Onodera et al. (1993); Hastings & Corliss (1956)",
        "notes": "Inversion degree varies with heat treatment (quenched vs slow-cooled). "
                 "Range i ≈ 0.70–1.0 in literature. Jahn-Teller can cause tetragonal distortion (c/a ≈ 1.06).",
    },

    # ── Weak preferences ──
    "Co": {
        "ox": 2, "site": "B", "strength": "weak",
        "reason": "d⁷ → moderate octahedral CFSE (31 kJ/mol); mostly B but inversion varies 0.2–0.96 "
                  "with synthesis conditions",
        "ospe": 31.4,
        "source": "literature:mossbauer",
        "ref": "Sawatzky et al. (1969)",
        "notes": "CoFe₂O₄ is partially inverse. Use measured inversion for your sample, "
                 "or run scenarios with fraction_on_B ∈ {0.6, 0.76, 0.96}.",
    },
    "Mg": {
        "ox": 2, "site": "B", "strength": "weak",
        "reason": "No CFSE (no d-electrons); partially inverse by electrostatic arguments; "
                  "MgFe₂O₄ quenching shifts site distribution (λ in 0.75–0.94)",
        "ospe": 0.0,
        "source": "literature:neutron",
        "ref": "Bertaut et al. (1964)",
        "notes": "MgFe₂O₄ is partially inverse (i ≈ 0.94 quenched, i ≈ 0.75 slow-cooled). "
                 "Highly treatment-dependent.",
    },
    "Mn": {
        "ox": 2, "site": "A", "strength": "weak",
        "reason": "d⁵ high-spin → zero CFSE; MnFe₂O₄ is ~80% normal (Mn on A), "
                  "but inversion varies with synthesis",
        "ospe": 0.0,
        "source": "literature:neutron",
        "ref": "Boucher et al. (1971)",
        "notes": "MnFe₂O₄ mostly normal (~80% Mn on A). Mn³⁺ (d⁴) would prefer B.",
    },
    "Al": {
        "ox": 3, "site": "B", "strength": "weak",
        "reason": "No d-electrons, no CFSE; size favours B in ferrites (0.535 Å octahedral); "
                  "but some spinels have Al on A (MgAl₂O₄ is normal)",
        "ospe": 0.0,
        "source": "literature:neutron",
        "ref": "Roth (1964)",
        "notes": "In FERRITES (Fe on both sites), Al usually goes to B. "
                 "In non-ferrite spinels (MgAl₂O₄), Al is on B and Mg distributes. Context-dependent.",
    },
    "Ga": {
        "ox": 3, "site": "A", "strength": "weak",
        "reason": "d¹⁰, covalent bonding like Zn; GaFe₂O₄ ~ 'more normal'; "
                  "but not as clear-cut as Zn",
        "ospe": 0.0,
        "source": "literature:mossbauer",
        "ref": "De Grave et al. (1979)",
        "notes": "Often A in ferrites, but distribution depends on composition and temperature.",
    },
    "In": {
        "ox": 3, "site": "B", "strength": "weak",
        "reason": "Large ion (0.80 Å oct); fits octahedral better than tetrahedral",
        "ospe": 0.0,
        "source": "literature:xray",
        "ref": "Shannon (1976)",
        "notes": "Limited data on In-ferrites; usually B by size.",
    },

    # ── None / problematic ──
    "Ca": {
        "ox": 2, "site": "?", "strength": "none",
        "reason": "r(Ca²⁺) = 1.00 Å (octahedral) — far too large for either spinel site "
                  "(Fe³⁺ oct = 0.645 Å, tet = 0.49 Å). No tetrahedral Shannon radius. "
                  "Lattice strain ~0.65 eV/ion; multiphase risk.",
        "ospe": 0.0,
        "source": "literature:crystallography",
        "ref": "Shannon (1976)",
        "strain_ev_per_ion": 0.65,
        "notes": "Ca²⁺ on B: +55% size mismatch vs Fe³⁺. No tetrahedral radius. "
                 "Strain ~0.65 eV/ion; probably multiphase in spinels. "
                 "Requires explicit human decision or single-phase verification.",
    },
    "Sr": {
        "ox": 2, "site": "?", "strength": "none",
        "reason": "r(Sr²⁺) = 1.18 Å — even larger than Ca. Cannot fit any spinel site. "
                  "Sr-doped ferrites are essentially perovskite-type, not spinel.",
        "ospe": 0.0,
        "source": "literature:crystallography",
        "ref": "Shannon (1976)",
        "notes": "Unsuitable for spinel. Route to perovskite pathway if A-site doping intended.",
    },
    "Ba": {
        "ox": 2, "site": "?", "strength": "none",
        "reason": "r(Ba²⁺) = 1.35 Å — far too large. BaFe₂O₄ is NOT a spinel (it's orthorhombic).",
        "ospe": 0.0,
        "source": "literature:crystallography",
        "ref": "Shannon (1976)",
        "notes": "Ba cannot enter the spinel lattice. Use hexaferrite or perovskite pathways.",
    },
    "Li": {
        "ox": 1, "site": "B", "strength": "weak",
        "reason": "LiFe₅O₈ has Li on octahedral sites; charge compensation via Fe²⁺→Fe³⁺ or vacancies",
        "ospe": 0.0,
        "source": "literature:xray",
        "ref": "Shannon (1976)",
        "notes": "Li⁺ creates charge deficit (needs compensation). Site assignment context-dependent.",
    },

    # ── Fe: special role ──
    "Fe": {
        "ox": 3, "site": "both", "strength": "strong",
        "reason": "d⁵ high-spin → zero CFSE → no site preference → fills remainder of both sublattices",
        "ospe": 0.0,
        "source": "heuristic:filler",
        "ref": "Neel (1948)",
        "notes": "Fe is the 'flexible filler' in ferrites. Never assigned by preference; "
                 "always fills whatever capacity remains after other cations are placed.",
    },

    # ── Lanthanides in spinels (generally unfavourable) ──
    "La": {
        "ox": 3, "site": "?", "strength": "none",
        "reason": "r(La³⁺) = 1.032 Å (oct) — too large for spinel B site",
        "ospe": 0.0,
        "notes": "Limited solubility in spinel. Some nano-ferrite papers claim La doping "
                 "but may be surface/grain-boundary incorporation.",
    },
    "Ce": {
        "ox": 3, "site": "B", "strength": "weak",
        "reason": "Ce³⁺/Ce⁴⁺ can occupy octahedral site at low concentrations",
        "ospe": 0.0,
        "notes": "Limited solubility; Ce⁴⁺ (0.87 Å) fits better than Ce³⁺ (1.01 Å).",
    },
    "Nd": {
        "ox": 3, "site": "B", "strength": "weak",
        "reason": "Similar to Ce; limited solubility due to large size",
        "ospe": 0.0,
        "notes": "Nanoparticle studies report Nd on B at ≤5%.",
    },
    "Gd": {
        "ox": 3, "site": "B", "strength": "weak",
        "reason": "r(Gd³⁺) = 0.938 Å oct — large but closer to fitting than La",
        "ospe": 0.0,
        "notes": "Limited solubility in spinel; some reports of Gd-doped ferrites.",
    },
    "Dy": {
        "ox": 3, "site": "B", "strength": "weak",
        "reason": "r(Dy³⁺) = 0.912 Å oct — borderline for spinel B",
        "ospe": 0.0,
        "notes": "Very limited data.",
    },
    "Er": {
        "ox": 3, "site": "B", "strength": "weak",
        "reason": "r(Er³⁺) = 0.890 Å oct — marginally more suitable among RE series",
        "ospe": 0.0,
        "notes": "Small rare earths fit slightly better.",
    },
    "Y": {
        "ox": 3, "site": "B", "strength": "weak",
        "reason": "r(Y³⁺) = 0.90 Å oct — similar to heavy lanthanides",
        "ospe": 0.0,
        "notes": "YFe₂O₄ is NOT a spinel (it's a different structure). Y in spinel limited.",
    },
}

# ─────────────────────────────────────────────────────────────────────────────
# 5b. SPINEL SCENARIO TABLE (weak / competing ions)
#     For ions with variable inversion or synthesis-dependent site distribution.
# ─────────────────────────────────────────────────────────────────────────────
SPINEL_SCENARIO_TABLE: Dict[str, List[Dict[str, Any]]] = {
    "Cu": [
        {
            "label": "CuFe2O4_slow_cooled_inverse",
            "fraction_on_B": 1.00,
            "inversion": 1.00,
            "description": "Annealed / slow-cooled: fully inverse (λ=1.00)",
            "ref": "Onodera et al. (1993)",
        },
        {
            "label": "CuFe2O4_quenched_partial",
            "fraction_on_B": 0.85,
            "inversion": 0.85,
            "description": "Quenched from 900°C: partially inverse (λ=0.85)",
            "ref": "Hastings & Corliss (1956)",
        },
    ],
    "Co": [
        {
            "label": "CoFe2O4_high_inversion",
            "fraction_on_B": 0.96,
            "inversion": 0.96,
            "description": "High inversion ceramic (λ=0.96)",
            "ref": "Sawatzky et al. (1969)",
        },
        {
            "label": "CoFe2O4_intermediate_inversion",
            "fraction_on_B": 0.76,
            "inversion": 0.76,
            "description": "Nanocrystalline / intermediate (λ=0.76)",
            "ref": "Sawatzky et al. (1969)",
        },
        {
            "label": "CoFe2O4_low_inversion",
            "fraction_on_B": 0.20,
            "inversion": 0.20,
            "description": "Low inversion state (λ=0.20)",
            "ref": "Sawatzky et al. (1969)",
        },
    ],
    "Mn": [
        {
            "label": "MnFe2O4_mostly_normal",
            "fraction_on_A": 0.80,
            "fraction_on_B": 0.20,
            "description": "Typical ceramic MnFe2O4 (~80% Mn on A)",
            "ref": "Boucher et al. (1971)",
        },
        {
            "label": "MnFe2O4_fully_normal",
            "fraction_on_A": 1.00,
            "fraction_on_B": 0.00,
            "description": "Ideal normal spinel (100% Mn on A)",
            "ref": "Boucher et al. (1971)",
        },
    ],
    "Mg": [
        {
            "label": "MgFe2O4_quenched",
            "fraction_on_B": 0.94,
            "inversion": 0.94,
            "description": "Quenched from 1000°C (λ=0.94)",
            "ref": "Bertaut et al. (1964)",
        },
        {
            "label": "MgFe2O4_slow_cooled",
            "fraction_on_B": 0.75,
            "inversion": 0.75,
            "description": "Slow-cooled / annealed (λ=0.75)",
            "ref": "Bertaut et al. (1964)",
        },
    ],
    "Al": [
        {
            "label": "Al_on_B",
            "fraction_on_B": 1.00,
            "description": "Al fully octahedral in ferrites",
            "ref": "Roth (1964)",
        },
        {
            "label": "Al_partial_A",
            "fraction_on_B": 0.80,
            "description": "Al partially tetrahedral",
            "ref": "Roth (1964)",
        },
    ],
    "Ga": [
        {
            "label": "Ga_on_A",
            "fraction_on_A": 0.80,
            "fraction_on_B": 0.20,
            "description": "Ga mostly tetrahedral",
            "ref": "De Grave et al. (1979)",
        },
        {
            "label": "Ga_on_B",
            "fraction_on_A": 0.40,
            "fraction_on_B": 0.60,
            "description": "Ga distributed across A/B",
            "ref": "De Grave et al. (1979)",
        },
    ],
}

# ─────────────────────────────────────────────────────────────────────────────
# 6. PEROVSKITE SITE PREFERENCE TABLE
#    ABO₃: A-site (CN=12, large cations), B-site (CN=6, small cations)
# ─────────────────────────────────────────────────────────────────────────────
PEROVSKITE_SITE_TABLE: Dict[str, Dict[str, Any]] = {
    # ── A-site cations (large, low-valent) ──
    "La": {"site": "A", "strength": "strong", "ox": 3, "reason": "r(La³⁺,XII) = 1.36 Å; canonical A-site"},
    "Sr": {"site": "A", "strength": "strong", "ox": 2, "reason": "r(Sr²⁺,XII) = 1.44 Å; common A-site dopant"},
    "Ba": {"site": "A", "strength": "strong", "ox": 2, "reason": "r(Ba²⁺,XII) = 1.61 Å; BaTiO₃"},
    "Ca": {"site": "A", "strength": "strong", "ox": 2, "reason": "r(Ca²⁺,XII) = 1.34 Å; CaTiO₃"},
    "K":  {"site": "A", "strength": "strong", "ox": 1, "reason": "r(K⁺,XII) = 1.64 Å"},
    "Na": {"site": "A", "strength": "strong", "ox": 1, "reason": "r(Na⁺,XII) = 1.39 Å"},
    "Pr": {"site": "A", "strength": "strong", "ox": 3, "reason": "r(Pr³⁺,VIII) = 1.126 Å"},
    "Nd": {"site": "A", "strength": "strong", "ox": 3, "reason": "r(Nd³⁺,XII) = 1.27 Å"},
    "Sm": {"site": "A", "strength": "strong", "ox": 3, "reason": "r(Sm³⁺,XII) = 1.24 Å"},
    "Gd": {"site": "A", "strength": "strong", "ox": 3, "reason": "Gd³⁺; A-site in manganites/cobaltites"},
    "Ce": {"site": "A", "strength": "strong", "ox": 3, "reason": "r(Ce³⁺,XII) = 1.34 Å"},
    "Eu": {"site": "A", "strength": "strong", "ox": 3, "reason": "Eu³⁺; A-site in manganites"},
    "Bi": {"site": "A", "strength": "strong", "ox": 3, "reason": "r(Bi³⁺,VIII) = 1.17 Å; BiFeO₃"},
    "Pb": {"site": "A", "strength": "strong", "ox": 2, "reason": "r(Pb²⁺,XII) = 1.49 Å; PbTiO₃/PZT"},
    "Y":  {"site": "A", "strength": "weak",   "ox": 3, "reason": "r(Y³⁺,VIII) = 1.019 Å; borderline A/B"},

    # ── B-site cations (small, high-valent) ──
    "Ti": {"site": "B", "strength": "strong", "ox": 4, "reason": "r(Ti⁴⁺,VI) = 0.605 Å; BaTiO₃, SrTiO₃"},
    "Mn": {"site": "B", "strength": "strong", "ox": 3, "reason": "r(Mn³⁺,VI) = 0.645 Å; LaMnO₃"},
    "Fe": {"site": "B", "strength": "strong", "ox": 3, "reason": "r(Fe³⁺,VI) = 0.645 Å; LaFeO₃"},
    "Co": {"site": "B", "strength": "strong", "ox": 3, "reason": "r(Co³⁺,VI) = 0.61 Å; LaCoO₃"},
    "Ni": {"site": "B", "strength": "strong", "ox": 2, "reason": "r(Ni²⁺,VI) = 0.69 Å; LaNiO₃"},
    "Cr": {"site": "B", "strength": "strong", "ox": 3, "reason": "r(Cr³⁺,VI) = 0.615 Å; LaCrO₃"},
    "Cu": {"site": "B", "strength": "strong", "ox": 2, "reason": "r(Cu²⁺,VI) = 0.73 Å; LaCuO₃ (limited)"},
    "Zr": {"site": "B", "strength": "strong", "ox": 4, "reason": "r(Zr⁴⁺,VI) = 0.72 Å; BaZrO₃"},
    "Nb": {"site": "B", "strength": "strong", "ox": 5, "reason": "r(Nb⁵⁺,VI) = 0.64 Å; KNbO₃"},
    "Al": {"site": "B", "strength": "strong", "ox": 3, "reason": "r(Al³⁺,VI) = 0.535 Å; LaAlO₃"},
    "Ga": {"site": "B", "strength": "strong", "ox": 3, "reason": "r(Ga³⁺,VI) = 0.62 Å; LaGaO₃"},
    "Sc": {"site": "B", "strength": "strong", "ox": 3, "reason": "r(Sc³⁺,VI) = 0.745 Å; BaScO₃ family"},
    "Ru": {"site": "B", "strength": "strong", "ox": 4, "reason": "r(Ru⁴⁺,VI) = 0.62 Å; SrRuO₃"},
    "Ir": {"site": "B", "strength": "strong", "ox": 4, "reason": "r(Ir⁴⁺,VI) = 0.625 Å; SrIrO₃"},
    "Sn": {"site": "B", "strength": "strong", "ox": 4, "reason": "r(Sn⁴⁺,VI) = 0.69 Å; BaSnO₃"},
    "Mo": {"site": "B", "strength": "strong", "ox": 6, "reason": "r(Mo⁶⁺,VI) = 0.59 Å; Sr₂FeMoO₆"},
    "W":  {"site": "B", "strength": "strong", "ox": 6, "reason": "r(W⁶⁺,VI) = 0.60 Å; Ba₂MnWO₆"},
    "V":  {"site": "B", "strength": "strong", "ox": 5, "reason": "r(V⁵⁺,VI) = 0.54 Å"},
    "Ta": {"site": "B", "strength": "strong", "ox": 5, "reason": "r(Ta⁵⁺,VI) = 0.64 Å; KTaO₃"},
    "Hf": {"site": "B", "strength": "strong", "ox": 4, "reason": "r(Hf⁴⁺,VI) = 0.71 Å; BaHfO₃"},
    "Mg": {"site": "B", "strength": "weak",   "ox": 2, "reason": "r(Mg²⁺,VI) = 0.72 Å; can occupy B in some perovskites"},

    # ── Anion dopants on O site ──
    "N":  {"site": "O", "strength": "strong", "ox": -3, "reason": "N-doping replaces O; charge compensation needed"},
    "F":  {"site": "O", "strength": "strong", "ox": -1, "reason": "F-doping replaces O; oxy-fluoride perovskites"},
}


# ─────────────────────────────────────────────────────────────────────────────
# 7. PUBLIC API FUNCTIONS
# ─────────────────────────────────────────────────────────────────────────────

def get_shannon_radius(
    element: str, coordination_number: int, oxidation_state: int,
) -> Optional[float]:
    """Look up Shannon effective ionic radius.  Returns None if not in table."""
    return SHANNON_RADII.get((element, coordination_number, oxidation_state))


def get_default_oxidation_state(element: str) -> Optional[int]:
    """Return the most common oxidation state for this element in oxide contexts."""
    states = COMMON_OXIDATION_STATES.get(element)
    return states[0] if states else None


def get_cfse(element: str, oxidation_state: int) -> Optional[float]:
    """Return the octahedral site preference energy in kJ/mol, or None."""
    return CFSE_OCTAHEDRAL_PREFERENCE.get((element, oxidation_state))


def check_size_compatibility(
    dopant: str, host: str,
    coordination_number: int,
    dopant_ox: Optional[int] = None,
    host_ox: Optional[int] = None,
    threshold: float = 0.30,
) -> Dict[str, Any]:
    """Check ionic radius compatibility between dopant and host on a given site.

    Returns a dict:
      ok:         True if within threshold
      mismatch:   fractional mismatch |r_dopant - r_host| / r_host
      r_dopant:   dopant Shannon radius (or None)
      r_host:     host Shannon radius (or None)
      warning:    human-readable string if problematic
    """
    dox = dopant_ox or get_default_oxidation_state(dopant)
    hox = host_ox or get_default_oxidation_state(host)

    r_d = get_shannon_radius(dopant, coordination_number, dox) if dox else None
    r_h = get_shannon_radius(host, coordination_number, hox) if hox else None

    result: Dict[str, Any] = {
        "ok": True, "mismatch": 0.0,
        "r_dopant": r_d, "r_host": r_h, "warning": None,
    }

    if r_d is None:
        result["ok"] = False
        result["warning"] = (
            f"No Shannon radius for {dopant}"
            f"{'%d+' % dox if dox and dox > 0 else '%d-' % abs(dox) if dox else '?'} "
            f"in CN={coordination_number}. Ion may not fit this site."
        )
        return result

    if r_h is None:
        result["warning"] = f"No Shannon radius for host {host} in CN={coordination_number}."
        return result

    mismatch = abs(r_d - r_h) / r_h
    result["mismatch"] = round(mismatch, 4)
    if mismatch > threshold:
        result["ok"] = False
        result["warning"] = (
            f"Size mismatch: {dopant} ({r_d:.3f} Å) vs {host} ({r_h:.3f} Å) "
            f"in CN={coordination_number} = {mismatch*100:.1f}% "
            f"(threshold: {threshold*100:.0f}%)"
        )

    return result


def _garnet_like(comp, cations: set, ratio: float) -> bool:
    """True when the cation stoichiometry matches a garnet X₃Y₂Z₃X₁₂-type phase.

    Stoichiometry alone is ambiguous here: garnet, perovskite and corundum all
    sit at 8 cations per 12 anions. Garnets are distinguished by the cation
    *partition* — the counts reduce to a garnet pattern (3:2:3 across three
    distinct sites, or the 3:5 collapse seen in Y3Al5O12 where the Al occupies
    both the B and C sites) AND the elements are ones that actually form
    garnets. A 3+ species compound that fails both tests is left unclassified
    rather than being called a perovskite, which it usually is not.
    """
    if abs(ratio - 8.0 / 12.0) > 0.05:
        return False
    # Garnet-forming cation sets: the classic natural garnets plus the common
    # synthetic aluminates/gallates/silicates used as host lattices.
    garnet_cations = {
        frozenset({"Y", "Al"}), frozenset({"Gd", "Ga"}), frozenset({"Y", "Fe"}),
        frozenset({"Gd", "Al"}), frozenset({"Lu", "Al"}), frozenset({"Y", "Ga"}),
        frozenset({"Tb", "Al"}), frozenset({"Dy", "Al"}), frozenset({"Sm", "Al"}),
        frozenset({"Eu", "Al"}), frozenset({"Y", "Ce"}), frozenset({"Y", "Yb"}),
        frozenset({"Ca", "Al", "Si"}), frozenset({"Mg", "Al", "Si"}),
        frozenset({"Fe", "Al", "Si"}), frozenset({"Mn", "Al", "Si"}),
        frozenset({"Ca", "Fe", "Si"}), frozenset({"Ca", "Al", "Ge"}),
        frozenset({"La", "Al", "Si"}), frozenset({"Ca", "Mg", "Si"}),
        frozenset({"Mg", "Si"}), frozenset({"Ca", "Si"}),
    }
    # Membership needs a hashable key; plain sets are unhashable, hence frozenset.
    if frozenset(cations) in garnet_cations:
        return True
    # Y3Al5O12-style: exactly two cation species at a 3:5 ratio.
    amounts = sorted((comp[el] for el in cations), reverse=True)
    if len(amounts) == 2:
        hi, lo = amounts
        if hi > 0 and abs(hi / lo - 5.0 / 3.0) < 0.05:
            return True
    return False


def detect_structure_type(formula_or_comp) -> str:
    """Classify a composition into a structure type from its stoichiometry.

    Returns one of:
      "spinel"     — AB₂X₄ (A+B cations per 4 anions = 3)
      "garnet"     — X₃Y₂Z₃X₁₂ / X₃Y₅X₁₂ (8 cations per 12 anions)
      "perovskite" — ABO₃ (2 cations per 3 anions)
      "pyrochlore" — A₂B₂O₇ (4 cations per 7 anions)
      "corundum"   — A₂O₃ (2 cations per 3 anions, single-cation)
      "silica"     — SiO₂ network (single Si with 2 O)
      "fluorite"   — MO₂, cubic 8-coordinate cation
      "rutile"     — MO₂, octahedral 6-coordinate cation
      "rock_salt"  — MO (1:1)
      "unknown"    — couldn't classify

    Note that stoichiometry alone cannot separate every family — garnet,
    perovskite and corundum all sit at 8 cations per 12 anions. Where a single
    ratio maps to several structures the tie is broken with the cation/anion
    radius ratio, and anything still ambiguous is reported as "unknown" rather
    than guessed. A wrong family sends a compound down the wrong doping rules,
    so "unknown" is a safer answer than a confident mistake.
    """
    comp = formula_or_comp if isinstance(formula_or_comp, Composition) else Composition(formula_or_comp)

    elements = {str(el) for el in comp.elements}
    anion_symbols = {"O", "S", "Se", "F", "Cl", "Br", "I", "N"}
    anions = elements & anion_symbols
    cations = elements - anion_symbols

    if not anions or not cations:
        return "unknown"

    # Total anion and cation counts across the whole composition.
    total_anion = sum(comp[el] for el in comp.elements if str(el) in anion_symbols)
    total_cation = sum(comp[el] for el in comp.elements if str(el) not in anion_symbols)

    if total_anion < 1e-6:
        return "unknown"

    ratio = total_cation / total_anion

    # Spinel: 3 cations per 4 anions (0.75).
    # Magnetite (Fe3O4) has only 1 cation species but is still a spinel,
    # because Fe occupies both sublattices in two oxidation states.
    if abs(ratio - 0.75) < 0.05:
        return "spinel"

    # Garnet is checked BEFORE perovskite because both sit at 8/12 = 0.667,
    # and defaulting to "perovskite" would misfile every garnet.
    if _garnet_like(comp, cations, ratio):
        return "garnet"

    # Perovskite: 2 cations per 3 anions with exactly 2 cation species.
    # With 3+ species at this ratio we cannot tell perovskite from other
    # 8:12 phases without structural data, so report unknown rather than guess.
    if abs(ratio - 2.0 / 3.0) < 0.05 and len(cations) == 2:
        return "perovskite"

    # Pyrochlore: 4 cations per 7 anions (0.571).
    if abs(ratio - 4.0 / 7.0) < 0.05 and len(cations) >= 2:
        return "pyrochlore"

    # Corundum: 2 cations per 3 anions with a single cation species (Al2O3, Fe2O3).
    if abs(ratio - 2.0 / 3.0) < 0.05 and len(cations) == 1:
        return "corundum"

    # Single-cation MO2: silica network, fluorite, or rutile - all share the
    # same stoichiometry and must be separated on coordination, not ratio.
    if abs(ratio - 0.5) < 0.05:
        cation = next(iter(cations))
        # SiO2 is a corner-sharing network, neither rutile nor fluorite.
        if cation == "Si":
            return "silica"
        # Multi-cation MO2 (e.g. Y2O3-stabilised zirconia, C-doped ceria) is
        # fluorite-derived with the dopant on a cation site.
        if len(cations) >= 2:
            return "fluorite"
        # Look the single-cation case up by its own formula.
        return _fluorite_or_rutile(comp.reduced_formula, cation, anions)

    # Rock salt: 1:1 ratio.
    if abs(ratio - 1.0) < 0.05:
        return "rock_salt"

    return "unknown"


# Single-cation MO2 phases whose structure type is settled. Fluorite and rutile
# are both 1:2, so stoichiometry cannot separate them, and a radius-ratio rule
# alone misassigns high-valence cations - it calls CeO2 rutile when CeO2 is
# cubic fluorite. An explicit table of unambiguous cases beats the heuristic,
# and anything not listed stays "unknown".
#
# Compounds with several well-known room-temperature polymorphs are deliberately
# ABSENT (ZrO2 is monoclinic but fluoritic above 2370 C; MnO2 has alpha/beta/
# gamma/ramsdellite), because guessing between their polymorphs is not useful.
_KNOWN_MO2_FAMILIES = {
    # Fluorite (cubic, cation 8-coordinate)
    "CaF2": "fluorite", "SrF2": "fluorite", "BaF2": "fluorite",
    "ZnF2": "fluorite", "CdF2": "fluorite", "PbF2": "fluorite",
    "UO2": "fluorite", "ThO2": "fluorite", "CeO2": "fluorite",
    "PrO2": "fluorite", "TbO2": "fluorite", "PuO2": "fluorite",
    # Rutile (tetragonal, cation 6-coordinate octahedral)
    "TiO2": "rutile", "SnO2": "rutile", "GeO2": "rutile",
    "PbO2": "rutile", "RuO2": "rutile", "IrO2": "rutile",
    "MgF2": "rutile", "MnO2": "rutile",
}


def _fluorite_or_rutile(formula: str, cation: str, anions: set) -> str:
    """Distinguish fluorite (CaF2-type) from rutile (TiO2-type) for single-cation MO2.

    Both are 1:2, so stoichiometry carries no information. Resolution is by exact
    lookup in _KNOWN_MO2_FAMILIES; anything unlisted returns "unknown". A
    confident but wrong family routes the compound into the wrong doping rules,
    which is worse than declining and letting a retrieved structure settle it.
    """
    return _KNOWN_MO2_FAMILIES.get(formula, "unknown")


def recommend_spinel_site(
    dopant: str,
    host_species: Optional[str] = None,
) -> Dict[str, Any]:
    """Recommend whether a dopant should go on A (tetrahedral) or B (octahedral)
    site in a spinel ferrite.

    Returns dict with:
      site:       "A" | "B" | "both" | "?" (unknown)
      strength:   "strong" | "weak" | "none" | "unknown"
      reason:     human-readable explanation
      ospe:       octahedral site preference energy (kJ/mol)
      auto:       True if assignment can be made automatically (strength == "strong")
      questions:  list of questions to ask user if not auto
      radius_check: size compatibility report (if host_species provided)
    """
    entry = SPINEL_SITE_TABLE.get(dopant)

    if entry is None:
        # Unknown element — try to reason from oxidation state and radius
        ox = get_default_oxidation_state(dopant)
        r_tet = get_shannon_radius(dopant, 4, ox) if ox else None
        r_oct = get_shannon_radius(dopant, 6, ox) if ox else None
        cfse = get_cfse(dopant, ox) if ox else None

        reason_parts = [f"'{dopant}' not in spinel site preference table"]
        if r_tet:
            reason_parts.append(f"tetrahedral radius: {r_tet:.3f} Å")
        if r_oct:
            reason_parts.append(f"octahedral radius: {r_oct:.3f} Å")
        if cfse is not None and cfse > 0:
            reason_parts.append(f"OSPE: {cfse:.1f} kJ/mol → favours octahedral")

        return {
            "site": "?", "strength": "unknown",
            "reason": "; ".join(reason_parts),
            "ospe": cfse or 0.0,
            "auto": False,
            "questions": [
                f"Element '{dopant}' is not in the spinel site preference database. "
                f"Should it be placed on: (A) tetrahedral, or (B) octahedral site? "
                f"Or provide a fraction on B (0-1)."
            ],
            "notes": entry.get("notes", "") if entry else "",
            "radius_check": None,
        }

    result = {
        "site": entry["site"],
        "strength": entry["strength"],
        "reason": entry["reason"],
        "ospe": entry.get("ospe", 0.0),
        "auto": entry["strength"] == "strong" and entry["site"] in ("A", "B"),
        "notes": entry.get("notes", ""),
        "questions": [],
        "radius_check": None,
    }

    if not result["auto"]:
        if entry["strength"] == "weak":
            result["questions"].append(
                f"'{dopant}' has a weak site preference for {entry['site']} "
                f"({entry['reason']}). Confirm site assignment, or provide "
                f"inversion data / fraction on B."
            )
        elif entry["strength"] == "none":
            result["questions"].append(
                f"'{dopant}' has no clear site preference in spinels "
                f"({entry['reason']}). Please specify the target site."
            )

    # Radius compatibility check against host
    if host_species and host_species != dopant:
        if entry["site"] == "A" or entry["site"] == "both":
            result["radius_check_A"] = check_size_compatibility(
                dopant, host_species, 4,
                dopant_ox=entry.get("ox"),
            )
        if entry["site"] == "B" or entry["site"] == "both":
            result["radius_check_B"] = check_size_compatibility(
                dopant, host_species, 6,
                dopant_ox=entry.get("ox"),
            )

    return result


def recommend_perovskite_site(
    dopant: str,
    host_A: Optional[str] = None,
    host_B: Optional[str] = None,
) -> Dict[str, Any]:
    """Recommend whether a dopant should go on A-site or B-site in a perovskite (ABO₃).

    Uses a combination of:
    1. The perovskite site table (known assignments)
    2. Goldschmidt tolerance factor considerations
    3. Ionic radius compatibility with host species

    Returns dict with site, strength, reason, auto, questions, radius_check.
    """
    entry = PEROVSKITE_SITE_TABLE.get(dopant)

    if entry is None:
        # Unknown — try to infer from size
        ox = get_default_oxidation_state(dopant)
        r6 = get_shannon_radius(dopant, 6, ox) if ox else None
        r12 = get_shannon_radius(dopant, 12, ox) if ox else None
        r8 = get_shannon_radius(dopant, 8, ox) if ox else None

        # Size-based heuristic: A-site needs r ≳ 1.0 Å (in CN≥8),
        # B-site needs r ≲ 0.8 Å (in CN=6)
        inferred_site = "?"
        if r12 and r12 > 1.0:
            inferred_site = "A"
        elif r8 and r8 > 1.0:
            inferred_site = "A"
        elif r6 and r6 < 0.85:
            inferred_site = "B"

        return {
            "site": inferred_site,
            "strength": "weak" if inferred_site != "?" else "unknown",
            "reason": f"Inferred from ionic radius: r(CN=6)={r6 or '?'}, r(CN=12)={r12 or '?'}",
            "auto": False,
            "questions": [f"'{dopant}' site in perovskite not in database. Specify A or B site."],
            "radius_check": None,
        }

    result = {
        "site": entry["site"],
        "strength": entry["strength"],
        "reason": entry["reason"],
        "auto": entry["strength"] == "strong",
        "questions": [],
        "radius_check": None,
    }

    if not result["auto"]:
        result["questions"].append(
            f"'{dopant}' has {entry['strength']} preference for {entry['site']}-site. "
            f"Please confirm."
        )

    # Radius checks against host
    if host_A and entry["site"] == "A":
        result["radius_check"] = check_size_compatibility(
            dopant, host_A, 12,
            dopant_ox=entry.get("ox"),
        )
    elif host_B and entry["site"] == "B":
        result["radius_check"] = check_size_compatibility(
            dopant, host_B, 6,
            dopant_ox=entry.get("ox"),
        )

    return result


def goldschmidt_tolerance_factor(
    r_A: float, r_B: float, r_X: float = 1.40,
) -> float:
    """Compute the Goldschmidt tolerance factor for a perovskite ABX₃.

    t = (r_A + r_X) / [√2 × (r_B + r_X)]

    t ≈ 1.0 → ideal cubic perovskite
    0.8 < t < 1.0 → distorted perovskite (orthorhombic/tetragonal)
    t > 1.0 → hexagonal polytypes
    t < 0.8 → ilmenite / other structure

    Args:
        r_A: A-site ionic radius (Å)
        r_B: B-site ionic radius (Å)
        r_X: anion radius (Å), default 1.40 for O²⁻
    """
    return (r_A + r_X) / (math.sqrt(2) * (r_B + r_X))


def recommend_site(
    dopant: str,
    formula_or_comp,
    host_site_species: Optional[str] = None,
) -> Dict[str, Any]:
    """Universal site recommendation dispatcher.

    Detects the structure type from the composition and routes to the
    appropriate site preference function.

    Returns a dict with:
      structure_type: detected type
      site:           recommended site
      strength:       confidence level
      reason:         explanation
      auto:           whether auto-assignment is safe
      questions:      list of questions if manual input needed
    """
    stype = detect_structure_type(formula_or_comp)

    if stype == "spinel":
        rec = recommend_spinel_site(dopant, host_site_species or "Fe")
        rec["structure_type"] = "spinel"
        return rec

    elif stype == "perovskite":
        comp = formula_or_comp if isinstance(formula_or_comp, Composition) else Composition(formula_or_comp)
        # Identify A and B site species from composition
        cation_amounts = sorted(
            [(str(el), comp[el]) for el in comp.elements if str(el) not in {"O", "S", "F", "N"}],
            key=lambda x: x[1], reverse=True,
        )
        host_A = cation_amounts[0][0] if len(cation_amounts) > 0 else None
        host_B = cation_amounts[1][0] if len(cation_amounts) > 1 else None
        rec = recommend_perovskite_site(dopant, host_A, host_B)
        rec["structure_type"] = "perovskite"
        return rec

    else:
        # Generic — provide radius info but don't auto-assign
        ox = get_default_oxidation_state(dopant)
        r6 = get_shannon_radius(dopant, 6, ox) if ox else None
        r4 = get_shannon_radius(dopant, 4, ox) if ox else None
        return {
            "structure_type": stype,
            "site": "?",
            "strength": "unknown",
            "reason": (
                f"Structure type '{stype}' — no automatic site preference rules. "
                f"Dopant {dopant}: r(CN=6)={r6 or '?'} Å, r(CN=4)={r4 or '?'} Å."
            ),
            "auto": False,
            "questions": [
                f"Cannot automatically determine site for '{dopant}' in {stype}-type structure. "
                f"Please specify the target Wyckoff position or host species to replace."
            ],
            "radius_check": None,
        }


def compute_charge_balance(
    sublattice_spec: Dict[str, Dict[str, float]],
    anion: str = "O",
    anion_count: float = 4.0,
    anion_charge: int = -2,
) -> Dict[str, Any]:
    """Compute charge balance for a sublattice specification.

    Args:
        sublattice_spec: {"A": {"Zn": 0.05, ...}, "B": {"Ni": 0.95, ...}}
        anion: anion species (default "O")
        anion_count: anions per formula unit (default 4.0 for spinel)
        anion_charge: anion oxidation state (default -2)

    Returns dict with:
        total_cation_charge: sum of (amount × oxidation_state)
        required_charge: target (= -anion_count × anion_charge)
        imbalance: total_cation_charge - required_charge
        balanced: True if |imbalance| < 0.01
        compensation: description of how to fix (Fe³⁺→Fe²⁺, vacancies, etc.)
    """
    required_charge = -anion_count * anion_charge  # e.g. 4 × 2 = +8 for spinel
    total_charge = 0.0
    details = []

    for sublat_name, spec in sublattice_spec.items():
        for el, amt in spec.items():
            if el == "Vac":
                continue
            ox = get_default_oxidation_state(el) or 0
            charge_contribution = amt * ox
            total_charge += charge_contribution
            details.append(f"{el}({sublat_name}): {format_amount(amt)} × {ox:+d} = {charge_contribution:+.3f}")

    imbalance = total_charge - required_charge
    balanced = abs(imbalance) < 0.01

    compensation = ""
    if not balanced:
        if imbalance > 0:
            # Excess positive → Fe³⁺→Fe²⁺
            fe_total = sum(
                spec.get("Fe", 0.0) for spec in sublattice_spec.values()
            )
            if fe_total >= imbalance:
                compensation = (
                    f"Excess charge +{imbalance:.3f}: compensated by reducing "
                    f"{imbalance:.3f} Fe³⁺ → Fe²⁺ per formula unit."
                )
            else:
                compensation = (
                    f"Excess charge +{imbalance:.3f}: insufficient Fe for compensation "
                    f"(only {fe_total:.3f} Fe available). Add explicit vacancies or "
                    f"re-check oxidation states."
                )
        else:
            compensation = (
                f"Charge deficit {imbalance:.3f}: requires cation vacancies ('Vac') "
                f"or higher oxidation states."
            )

    return {
        "total_cation_charge": round(total_charge, 4),
        "required_charge": required_charge,
        "imbalance": round(imbalance, 4),
        "balanced": balanced,
        "compensation": compensation,
        "details": details,
    }


def get_vegard_lattice_parameter(
    base_a: float,
    dopant_specs: Dict[str, float],
    site_cn: int = 6,
    host_element: str = "Fe",
    host_ox: int = 3,
) -> float:
    """Estimate lattice parameter shift from Vegard's law.

    a(doped) ≈ a(base) × [1 + k × Σ(fraction_i × Δr_i / r_host)]

    where k ≈ 1.0 (linear Vegard), and Δr_i = r_dopant_i - r_host.
    This is a first-order estimate; real shifts depend on many factors.

    Args:
        base_a:       undoped lattice parameter (Å)
        dopant_specs:  {"Ti": 0.05, "Zn": 0.10} — element → fraction on the site
        site_cn:      coordination number of the site (4 or 6)
        host_element: element being replaced
        host_ox:      oxidation state of host
    """
    r_host = get_shannon_radius(host_element, site_cn, host_ox)
    if r_host is None:
        return base_a

    total_shift = 0.0
    for dopant, fraction in dopant_specs.items():
        ox_d = get_default_oxidation_state(dopant)
        r_d = get_shannon_radius(dopant, site_cn, ox_d) if ox_d else None
        if r_d is not None:
            total_shift += fraction * (r_d - r_host) / r_host

    return base_a * (1.0 + total_shift)
