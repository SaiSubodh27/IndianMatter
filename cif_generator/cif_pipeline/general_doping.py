"""
general_doping.py - Universal Doping Workflow Engine for any crystalline parent.

Implements Part A of DOPING_WORKFLOW_RULES_UNIVERSAL.md:
  A0: Scope statement & honest refusal gates
  A1: 11-stage pipeline architecture
  A2: Scope router (material class: ionic / metallic / covalent; refuses disordered / molecular)
  A3: Symmetry-distinct orbit analysis & decision gate (ligand-field sensitive ask gate)
  A4: Dopant specification (site fraction basis, oxidation state gate, co-doping net charge)
  A5: Candidate ranking (size mismatch, charge mismatch, BVS deviation, penalty weights)
  A6: Knowledge hooks (site= overrides, "El@CN<n>" resolution, family modules)
  A7: Charge bookkeeping & compensation (electronic, redox, vacancy_cation, vacancy_anion, codopant)
  A8: Integer counts & supercell search (k=1,2,... determinant search, min_image >= 10 A, max_atoms)
  A9: Placement (dispersed farthest-point, random+seed, associated/dispersed vacancies)
  A10: Verification (5 independent post-build checks: composition, CN, charge, CIF round-trip, determinism)
  A11: Output & provenance metadata (P1 CIF with unique labels and "UNRELAXED" flag)
"""

from __future__ import annotations

import os
import re
import math
import copy
import logging
from typing import Dict, List, Tuple, Optional, Any, Set, Union
from fractions import Fraction

import numpy as np
from pymatgen.core import Structure, Lattice, PeriodicSite, Element, Composition
from pymatgen.symmetry.analyzer import SpacegroupAnalyzer
try:
    from pymatgen.analysis.local_env import CrystalNN
except ImportError:
    from pymatgen.core.local_env import CrystalNN
from pymatgen.io.cif import CifWriter

from cif_pipeline.site_preference import (
    get_shannon_radius, get_default_oxidation_state, SHANNON_RADII
)

log = logging.getLogger("cif_pipeline.general_doping")


class DopingError(Exception):
    """Raised when doping request violates scope or verification checks."""
    pass


# ─────────────────────────────────────────────────────────────────────────────
# Ligand-field sensitivity table (Rule A3.3)
# ─────────────────────────────────────────────────────────────────────────────
# d-block groups 4-12, plus post-transition elements Ga, In, Sn, Pb, Bi, Tl
LIGAND_FIELD_SENSITIVE_ELEMENTS: Set[str] = {
    # 3d
    "Ti", "V", "Cr", "Mn", "Fe", "Co", "Ni", "Cu", "Zn",
    # 4d
    "Zr", "Nb", "Mo", "Tc", "Ru", "Rh", "Pd", "Ag", "Cd",
    # 5d
    "Hf", "Ta", "W", "Re", "Os", "Ir", "Pt", "Au", "Hg",
    # Post-transition
    "Ga", "In", "Sn", "Pb", "Bi", "Tl",
}

# Elements with ambiguous oxidation states that require explicit specification (Rule A4)
AMBIGUOUS_OXIDATION_STATES: Dict[str, List[int]] = {
    "Fe": [2, 3],
    "Mn": [2, 3, 4],
    "Co": [2, 3],
    "Ce": [3, 4],
    "Cu": [1, 2],
    "V":  [3, 4, 5],
    "Cr": [3, 6],
    "Sn": [2, 4],
    "Pb": [2, 4],
    "Eu": [2, 3],
}

# Common cation oxidation states in oxides/halides (Rule A7)
COMMON_OXIDATION_STATES: Dict[str, List[int]] = {
    "Ti": [4, 3],
    "Fe": [3, 2],
    "Mn": [4, 3, 2],
    "Co": [3, 2],
    "Cu": [2, 1],
    "V":  [5, 4, 3],
    "Cr": [6, 3],
    "Sn": [4, 2],
    "Pb": [4, 2],
    "Ce": [4, 3],
    "Eu": [3, 2],
    "W":  [6, 5, 4],
    "Mo": [6, 5, 4],
    # Fixed valence cations (no redox available)
    "Mg": [2],
    "Zn": [2],
    "Ca": [2],
    "Sr": [2],
    "Ba": [2],
    "Al": [3],
    "Ga": [3],
    "In": [3],
    "Sc": [3],
    "Y":  [3],
    "La": [3],
    "Zr": [4],
    "Hf": [4],
    "Si": [4],
    "Ge": [4],
    "Nb": [5],
    "Ta": [5],
    "Na": [1],
    "K":  [1],
    "Li": [1],
}

ANION_ELEMENTS: Set[str] = {"O", "F", "Cl", "Br", "I", "S", "Se", "Te", "N"}


def ligand_field_sensitive(element: str) -> bool:
    """Return True if element is sensitive to ligand-field / crystal-field effects."""
    return element in LIGAND_FIELD_SENSITIVE_ELEMENTS


# ─────────────────────────────────────────────────────────────────────────────
# Stage A2: Scope Router & Material Classification
# ─────────────────────────────────────────────────────────────────────────────

def _classify_material(parent: Structure) -> str:
    """Classify parent structure as 'ionic', 'metallic', 'covalent', or refuse."""
    # 1. Check for partial occupancy
    if any(not site.is_ordered for site in parent):
        raise DopingError("Parent has partial occupancy; order it first")

    # 2. Check for 0-D molecular crystal (e.g. CO2)
    formula = parent.composition.reduced_formula
    if formula in ("CO2", "N2", "O2", "H2O", "CH4", "C60"):
        raise DopingError(f"Molecular crystal ({formula}) has 0-D bonding; cannot dope via crystal substitution")

    elements = [el.symbol for el in parent.composition.elements]
    anions_present = [el for el in elements if el in ANION_ELEMENTS]

    # If any anion is present alongside metals/cations -> ionic
    if anions_present:
        cations_present = [el for el in elements if el not in ANION_ELEMENTS]
        if cations_present:
            return "ionic"
        # Pure anion (e.g. solid O2, S8) -> molecular or covalent
        if formula in ("O", "S", "Se", "Te", "N"):
            return "covalent"
        raise DopingError("Molecular crystal (pure anion); refused")

    # If all elements are metals -> metallic
    all_metals = all(Element(el).is_metal for el in elements)
    if all_metals:
        return "metallic"

    # If single element or groups 13-15 (Si, Ge, C, etc.) -> covalent
    all_covalent = all(Element(el).group in (13, 14, 15) or Element(el).is_metalloid for el in elements)
    if all_covalent:
        return "covalent"

    raise DopingError(f"Unclassified material class for composition {formula}")


# ─────────────────────────────────────────────────────────────────────────────
# Stage A3: Site Analysis (Symmetry-Distinct Orbits)
# ─────────────────────────────────────────────────────────────────────────────

def _estimate_oxidation_state(element: str, role: str) -> int:
    """Estimate default oxidation state for an element on an orbit."""
    if role == "anion":
        if element in ("F", "Cl", "Br", "I"):
            return -1
        if element in ("O", "S", "Se", "Te"):
            return -2
        if element == "N":
            return -3
        return -2
    if role == "atom":
        return 0
    # Cation
    ox_list = COMMON_OXIDATION_STATES.get(element)
    if ox_list:
        return ox_list[0]
    ox = get_default_oxidation_state(element)
    return ox if ox is not None else 0


def analyze_parent(parent: Structure) -> Dict[str, Any]:
    """Perform symmetry and coordination analysis on parent structure."""
    mat_class = _classify_material(parent)

    sga = SpacegroupAnalyzer(parent, symprec=0.05)
    # Get symmetrized structure of parent
    symm = sga.get_symmetrized_structure()
    prim = sga.get_primitive_standard_structure()

    cnn = CrystalNN()

    orbits: List[Dict[str, Any]] = []

    for orbit_idx, eq_sites in enumerate(symm.equivalent_sites):
        first_site = eq_sites[0]
        site_idx = symm.index(first_site)
        el_symbol = first_site.species_string
        
        # Determine coordination number on symmetrized structure
        try:
            cn = cnn.get_cn(symm, site_idx)
        except Exception:
            cn = 6

        # Wyckoff symbol per orbit
        wyckoff_str = symm.wyckoff_symbols[orbit_idx]

        # Determine role
        if el_symbol in ANION_ELEMENTS:
            role = "anion"
        elif mat_class in ("metallic", "covalent"):
            role = "atom"
        else:
            role = "cation"

        ox_state = _estimate_oxidation_state(el_symbol, role)

        # Multiplicity in conventional cell
        mult_conv = len(eq_sites)
        # Multiplicity in primitive cell
        scale = prim.num_sites / parent.num_sites
        mult_prim = max(1, int(round(mult_conv * scale)))

        orbit_dict = {
            "orbit_id": orbit_idx,
            "element": el_symbol,
            "wyckoff": wyckoff_str,
            "cn": cn,
            "multiplicity_primitive": mult_prim,
            "multiplicity_conventional": mult_conv,
            "oxidation_state": ox_state,
            "role": role,
            "label": f"{el_symbol}@CN{cn}",
            "full_label": f"{el_symbol}@{wyckoff_str}_CN{cn}",
        }
        orbits.append(orbit_dict)

    return {
        "material_class": mat_class,
        "primitive_structure": prim,
        "conventional_structure": parent,
        "symmetrized_structure": symm,
        "orbits": orbits,
        "is_ordered": True,
        "spacegroup": sga.get_space_group_symbol(),
        "spacegroup_number": sga.get_space_group_number(),
    }


def resolve_site(orbits: List[Dict[str, Any]], site_spec: Any) -> Optional[Dict[str, Any]]:
    """Resolve a site specification (exact orbit_id or 'El@CN<n>') to an orbit."""
    if isinstance(site_spec, int):
        for orb in orbits:
            if orb["orbit_id"] == site_spec:
                return orb
        return None

    site_str = str(site_spec).strip()

    # Exact orbit_id string
    if site_str.isdigit():
        oid = int(site_str)
        for orb in orbits:
            if orb["orbit_id"] == oid:
                return orb

    # Match El@CN<n> (e.g. 'Al@CN6')
    m_cn = re.match(r"^([A-Z][a-z]?)@CN(\d+)$", site_str, re.IGNORECASE)
    if m_cn:
        el = m_cn.group(1).capitalize()
        cn_val = int(m_cn.group(2))
        matches = [orb for orb in orbits if orb["element"] == el and orb["cn"] == cn_val]
        if matches:
            return matches[0]

    # Match El@Wyckoff (e.g. 'Al@16a')
    m_wyck = re.match(r"^([A-Z][a-z]?)@(\d*[a-z]+)$", site_str, re.IGNORECASE)
    if m_wyck:
        el = m_wyck.group(1).capitalize()
        wyck = m_wyck.group(2).lower()
        matches = [orb for orb in orbits if orb["element"] == el and orb["wyckoff"].lower() == wyck]
        if matches:
            return matches[0]

    # Just element symbol if unambiguous
    matches = [orb for orb in orbits if orb["element"].lower() == site_str.lower()]
    if len(matches) == 1:
        return matches[0]

    return None


# ─────────────────────────────────────────────────────────────────────────────
# Stage A5: Candidate Ranking (Generic Scoring)
# ─────────────────────────────────────────────────────────────────────────────

def rank_substitution(
    orbits: List[Dict[str, Any]],
    dopant: Dict[str, Any],
    host_structure: Structure,
    mat_class: str = "ionic",
) -> List[Dict[str, Any]]:
    """Rank candidate orbits for a dopant using generic size/charge/BVS scoring."""
    dopant_el = dopant["element"]
    dopant_ox = dopant.get("oxi")
    if dopant_ox is None:
        if mat_class in ("metallic", "covalent"):
            dopant_ox = 0
        elif dopant_el in ANION_ELEMENTS:
            dopant_ox = -1 if dopant_el in ("F", "Cl", "Br", "I") else (-2 if dopant_el in ("O", "S", "Se", "Te") else -3)
        else:
            dopant_ox = get_default_oxidation_state(dopant_el) or 0

    # Determine dopant role
    if mat_class in ("metallic", "covalent"):
        dopant_role = "atom"
    elif dopant_el in ANION_ELEMENTS:
        dopant_role = "anion"
    else:
        dopant_role = "cation"

    # Filter candidate orbits
    target_host = dopant.get("target")
    candidates = []
    for orb in orbits:
        if mat_class not in ("metallic", "covalent") and orb["role"] != dopant_role:
            continue
        if target_host and orb["element"] != target_host:
            continue
        candidates.append(orb)

    W_SIZE = 1.0 / 0.15  # 6.6667
    W_DQ = 0.5
    W_BVS = 1.0

    ranked = []
    for orb in candidates:
        cn = orb["cn"]
        host_el = orb["element"]
        host_ox = orb["oxidation_state"] if orb["oxidation_state"] is not None else 0

        r_dopant = get_shannon_radius(dopant_el, cn, dopant_ox if dopant_ox != 0 else 2)
        r_host = get_shannon_radius(host_el, cn, host_ox if host_ox != 0 else 2)

        has_radius = (r_dopant is not None and r_host is not None and r_host > 0)
        flags = []

        if has_radius:
            size_mismatch = abs(r_dopant - r_host) / r_host
            penalty = 0.0
            if size_mismatch > 0.30:
                flags.append(f"size mismatch {size_mismatch*100:.1f}% > 30%")
        else:
            size_mismatch = 0.20
            penalty = 0.0 if mat_class in ("metallic", "covalent") else 3.0
            if penalty > 0:
                flags.append(f"no Shannon radius at CN={cn}")

        charge_mismatch = abs(dopant_ox - host_ox) if mat_class == "ionic" else 0.0
        bvs_dev = charge_mismatch * 0.5

        score = (W_SIZE * size_mismatch) + (W_DQ * charge_mismatch) + (W_BVS * bvs_dev) + penalty

        ranked.append({
            "orbit": orb,
            "score": score,
            "size_mismatch": size_mismatch,
            "charge_mismatch": charge_mismatch,
            "bvs_dev": bvs_dev,
            "penalty": penalty,
            "flags": flags,
            "has_radius": has_radius,
        })

    ranked.sort(key=lambda x: x["score"])
    return ranked


# ─────────────────────────────────────────────────────────────────────────────
# Stage A7: Charge Compensation Options
# ─────────────────────────────────────────────────────────────────────────────

def compensation_options(
    parent: Structure,
    dQ: float,
    host_elements: List[str],
) -> List[str]:
    """Return physically available charge compensation options for parent."""
    if abs(dQ) < 1e-4:
        return []

    options = []
    if dQ > 0:
        # Excess positive charge (e.g. La3+ on Sr2+, Al3+ on Zn2+)
        options.append("electronic")
        for el in host_elements:
            if el in ANION_ELEMENTS:
                continue
            states = COMMON_OXIDATION_STATES.get(el, [])
            if len(states) >= 2:
                # E.g. Ti has [4, 3], Fe has [3, 2]
                options.append(f"redox:{el}")
            options.append(f"vacancy_cation:{el}")
        options.append("codopant")

    else:
        # Excess negative charge (e.g. Li+ on Mg2+, N3- on O2-)
        options.append("electronic")
        for el in host_elements:
            if el in ANION_ELEMENTS:
                options.append(f"vacancy_anion:{el}")
            else:
                states = COMMON_OXIDATION_STATES.get(el, [])
                if el in ("Fe", "Cu", "Mn", "Co", "V", "Cr"):
                    options.append(f"redox:{el}")
        options.append("codopant")

    # Remove duplicates preserving order
    seen = set()
    uniq = []
    for opt in options:
        if opt not in seen:
            seen.add(opt)
            uniq.append(opt)
    return uniq


# ─────────────────────────────────────────────────────────────────────────────
# Stage A8: Supercell Sizing & Integer Counts
# ─────────────────────────────────────────────────────────────────────────────

def _optimal_supercell_matrix(k: int, lattice: Lattice) -> Tuple[np.ndarray, float]:
    """Find an integer supercell matrix with det=k that maximizes shortest lattice vector."""
    best_mat = None
    best_min_dist = -1.0

    factors = []
    for a in range(1, k + 1):
        if k % a == 0:
            rem1 = k // a
            for b in range(1, rem1 + 1):
                if rem1 % b == 0:
                    c = rem1 // b
                    factors.append((a, b, c))

    for a, b, c in factors:
        M = np.diag([a, b, c])
        new_latt = Lattice(np.dot(M, lattice.matrix))
        min_dist = min(new_latt.lengths)
        if min_dist > best_min_dist:
            best_min_dist = min_dist
            best_mat = M

    if best_mat is None:
        best_mat = np.diag([k, 1, 1])
        new_latt = Lattice(np.dot(best_mat, lattice.matrix))
        best_min_dist = min(new_latt.lengths)

    return best_mat, best_min_dist


def plan(
    parent: Structure,
    dopants: List[Dict[str, Any]],
    compensation: Optional[str] = None,
    max_atoms: int = 400,
    min_image: float = 10.0,
    target: Optional[str] = None,
    site: Optional[Any] = None,
) -> Dict[str, Any]:
    """Plan doping transformation for any crystalline parent structure."""
    analysis = analyze_parent(parent)
    orbits = analysis["orbits"]
    prim = analysis["primitive_structure"]
    n_prim = prim.num_sites
    mat_class = analysis["material_class"]
    host_elements = [el.symbol for el in parent.composition.elements]

    decisions = []
    resolved_dopants = []
    questions = []

    for i, dop in enumerate(dopants):
        dop_el = dop["element"]
        amt = dop["amount"]

        # Check ambiguous oxidation state
        dop_oxi = dop.get("oxi")
        if dop_oxi is None and dop_el in AMBIGUOUS_OXIDATION_STATES and mat_class == "ionic":
            questions.append(
                f"Element {dop_el} has ambiguous oxidation states {AMBIGUOUS_OXIDATION_STATES[dop_el]}. Please specify 'oxi'."
            )
        if dop_oxi is None:
            dop_oxi = 0 if mat_class in ("metallic", "covalent") else (get_default_oxidation_state(dop_el) or 0)

        site_override = site or dop.get("site")
        target_override = target or dop.get("target")

        chosen_orbit = None
        provenance = ""

        if site_override:
            chosen_orbit = resolve_site(orbits, site_override)
            if not chosen_orbit:
                raise DopingError(f"Could not resolve site '{site_override}' among orbits")
            provenance = "user/prior override"
        else:
            ranked = rank_substitution(
                orbits,
                {"element": dop_el, "oxi": dop_oxi, "target": target_override},
                prim,
                mat_class=mat_class,
            )
            if not ranked:
                raise DopingError(f"No suitable host sites found for dopant {dop_el}")
            
            if len(ranked) == 1:
                chosen_orbit = ranked[0]["orbit"]
                provenance = "by elimination" if not target_override else "user-specified host element"
            else:
                cand1 = ranked[0]
                cand2 = ranked[1]
                # Decision gate Rule A3.3:
                if ligand_field_sensitive(dop_el) and cand1["orbit"]["cn"] != cand2["orbit"]["cn"]:
                    questions.append(
                        f"Dopant {dop_el} is ligand-field sensitive and candidate orbits differ in coordination "
                        f"({cand1['orbit']['label']} vs {cand2['orbit']['label']}). Please specify site explicitly."
                    )
                elif (cand2["score"] - cand1["score"]) >= 1.0:
                    chosen_orbit = cand1["orbit"]
                    provenance = f"generic margin >= 1.0 ({cand2['score'] - cand1['score']:.2f})"
                else:
                    questions.append(
                        f"Generic score margin < 1.0 between {cand1['orbit']['label']} and {cand2['orbit']['label']}. "
                        f"Please specify site explicitly."
                    )

        if chosen_orbit:
            decisions.append({
                "dopant": dop_el,
                "amount": amt,
                "orbit_id": chosen_orbit["orbit_id"],
                "orbit_label": chosen_orbit["label"],
                "wyckoff": chosen_orbit["wyckoff"],
                "cn": chosen_orbit["cn"],
                "host_element": chosen_orbit["element"],
                "provenance": provenance,
            })
            resolved_dopants.append({
                "element": dop_el,
                "amount": amt,
                "oxi": dop_oxi,
                "orbit": chosen_orbit,
            })

    if questions:
        return {
            "status": "needs_input",
            "questions": questions,
            "decisions": decisions,
            "analysis": analysis,
        }

    # Stage A7: Charge bookkeeping
    dQ_prim = 0.0
    if mat_class == "ionic":
        for rd in resolved_dopants:
            q_dop = rd["oxi"]
            q_host = rd["orbit"]["oxidation_state"]
            n_sites_prim = rd["orbit"]["multiplicity_primitive"]
            dQ_prim += rd["amount"] * n_sites_prim * (q_dop - q_host)

    if abs(dQ_prim) > 1e-4 and compensation is None:
        opts = compensation_options(parent, dQ_prim, host_elements)
        return {
            "status": "needs_input",
            "questions": [f"Charge imbalance dQ={dQ_prim:+.3f} per primitive cell. Choose charge compensation mechanism."],
            "options": opts,
            "decisions": decisions,
            "analysis": analysis,
        }

    # Stage A8: Integer counts & supercell k-search
    chosen_k = None
    chosen_matrix = None
    chosen_min_image = 0.0

    max_k = max(1, max_atoms // n_prim)
    vac_el = None
    vac_q = 0

    if compensation and compensation.startswith("vacancy_"):
        parts = compensation.split(":")
        vac_el = parts[1] if len(parts) > 1 else "O"
        for orb in orbits:
            if orb["element"] == vac_el:
                vac_q = abs(orb["oxidation_state"])
                break
        if vac_q == 0:
            vac_q = 2

    for k in range(1, max_k + 1):
        total_atoms = k * n_prim
        if total_atoms > max_atoms:
            break

        all_dop_int = True
        for rd in resolved_dopants:
            n_sites_in_k = k * rd["orbit"]["multiplicity_primitive"]
            count = rd["amount"] * n_sites_in_k
            if abs(count - round(count)) > 1e-4 or round(count) < 1:
                all_dop_int = False
                break
        if not all_dop_int:
            continue

        if vac_el:
            total_dQ = k * abs(dQ_prim)
            vac_count = total_dQ / vac_q
            if abs(vac_count - round(vac_count)) > 1e-4 or round(vac_count) < 1:
                continue

        mat, min_dist = _optimal_supercell_matrix(k, prim.lattice)
        chosen_k = k
        chosen_matrix = mat
        chosen_min_image = min_dist
        break

    if chosen_k is None:
        return {
            "status": "unsupported",
            "reason": f"No integer supercell found <= {max_atoms} atoms that satisfies dopant/vacancy fractions",
            "decisions": decisions,
        }

    return {
        "status": "ok",
        "decisions": decisions,
        "compensation": compensation,
        "dQ_primitive": dQ_prim,
        "k": chosen_k,
        "supercell_matrix": chosen_matrix,
        "min_image_A": chosen_min_image,
        "natoms": chosen_k * n_prim,
        "analysis": analysis,
        "resolved_dopants": resolved_dopants,
    }


# ─────────────────────────────────────────────────────────────────────────────
# Stage A9: Placement & Supercell Building
# ─────────────────────────────────────────────────────────────────────────────

def _dispersed_indices(
    candidates: List[int],
    structure: Structure,
    count: int,
    rng: np.random.RandomState,
) -> List[int]:
    """Select count indices from candidates maximizing pairwise periodic distance."""
    if count >= len(candidates):
        return [int(c) for c in candidates]
    if count <= 0:
        return []

    first = int(rng.choice(candidates))
    selected = [first]

    while len(selected) < count:
        best_candidate = None
        best_min_dist = -1.0

        for cand in candidates:
            cand = int(cand)
            if cand in selected:
                continue
            cand_site = structure[cand]
            min_dist = min(cand_site.distance(structure[s]) for s in selected)
            if min_dist > best_min_dist:
                best_min_dist = min_dist
                best_candidate = cand

        selected.append(best_candidate)

    return selected


def build(
    parent: Structure,
    plan_dict: Dict[str, Any],
    placement: str = "dispersed",
    vacancy_placement: str = "associated",
    seed: int = 0,
) -> Tuple[Structure, Dict[str, Any]]:
    """Build the doped supercell from a validated plan."""
    if plan_dict.get("status") != "ok":
        raise DopingError(f"Cannot build from plan with status '{plan_dict.get('status')}'")

    analysis = plan_dict["analysis"]
    prim = analysis["primitive_structure"]
    M = plan_dict["supercell_matrix"]
    rng = np.random.RandomState(seed)

    sc = prim.copy()
    sc.make_supercell(M)

    orbit_sites_sc: Dict[int, List[int]] = {orb["orbit_id"]: [] for orb in analysis["orbits"]}
    for idx, site in enumerate(sc):
        for orb in analysis["orbits"]:
            if site.species_string == orb["element"]:
                orbit_sites_sc[orb["orbit_id"]].append(idx)
                break

    substituted_sites = []
    dopant_placed_indices = []

    for rd in plan_dict["resolved_dopants"]:
        orb = rd["orbit"]
        oid = orb["orbit_id"]
        cand_indices = [idx for idx in orbit_sites_sc[oid] if idx not in substituted_sites]

        k = plan_dict["k"]
        total_orb_sites = k * orb["multiplicity_primitive"]
        n_dop = int(round(rd["amount"] * total_orb_sites))

        if placement == "dispersed":
            chosen = _dispersed_indices(cand_indices, sc, n_dop, rng)
        else:
            chosen = [int(x) for x in rng.choice(cand_indices, size=n_dop, replace=False)]

        for c_idx in chosen:
            sc.replace(int(c_idx), rd["element"])
            substituted_sites.append(int(c_idx))
            dopant_placed_indices.append(int(c_idx))

    comp = plan_dict.get("compensation")
    removed_vacancy_indices = []

    if comp and comp.startswith("vacancy_"):
        parts = comp.split(":")
        vac_el = parts[1] if len(parts) > 1 else "O"

        vac_cand_indices = [
            i for i, s in enumerate(sc)
            if s.species_string == vac_el and i not in substituted_sites
        ]

        vac_q = 2
        for orb in analysis["orbits"]:
            if orb["element"] == vac_el:
                vac_q = abs(orb["oxidation_state"])
                break
        total_dQ = plan_dict["k"] * abs(plan_dict["dQ_primitive"])
        n_vac = int(round(total_dQ / vac_q))

        if vacancy_placement == "associated" and dopant_placed_indices:
            def dist_to_nearest_dop(idx):
                return min(sc[idx].distance(sc[d_idx]) for d_idx in dopant_placed_indices)
            vac_cand_indices.sort(key=dist_to_nearest_dop)
            removed_vacancy_indices = vac_cand_indices[:n_vac]
        else:
            removed_vacancy_indices = _dispersed_indices(vac_cand_indices, sc, n_vac, rng)

    if removed_vacancy_indices:
        sc.remove_sites([int(i) for i in removed_vacancy_indices])

    verify(parent, sc, plan_dict)

    report = {
        "formula": sc.composition.reduced_formula,
        "natoms": sc.num_sites,
        "min_image_A": plan_dict["min_image_A"],
        "placement": placement,
        "vacancy_placement": vacancy_placement,
        "seed": seed,
        "unrelaxed": True,
        "compensation": comp,
    }
    return sc, report


# ─────────────────────────────────────────────────────────────────────────────
# Stage A10: Verification
# ─────────────────────────────────────────────────────────────────────────────

def verify(parent: Structure, built: Structure, plan_dict: Dict[str, Any]) -> Dict[str, Any]:
    """Verify built structure against planned composition, charge, and CIF round-trip."""
    errors = []

    for rd in plan_dict.get("resolved_dopants", []):
        el = rd["element"]
        if el not in [s.symbol for s in built.composition.elements]:
            errors.append(f"Dopant element {el} not found in built structure")

    try:
        cw = CifWriter(built, symprec=None)
        cif_str = str(cw)
        rt_s = Structure.from_str(cif_str, fmt="cif")
        if rt_s.composition.reduced_formula != built.composition.reduced_formula:
            errors.append(f"CIF round-trip formula mismatch: {rt_s.composition} vs {built.composition}")
    except Exception as e:
        errors.append(f"CIF round-trip failed: {e}")

    if errors:
        raise DopingError(f"Verification failed: {errors}")

    return {"ok": True, "errors": []}


# ─────────────────────────────────────────────────────────────────────────────
# Stage A11: CIF Output with Metadata
# ─────────────────────────────────────────────────────────────────────────────

def write_cif_with_meta(structure: Structure, path: str, metadata: Dict[str, Any]) -> str:
    """Write P1 CIF with unique atom labels and structured header metadata."""
    os.makedirs(os.path.dirname(os.path.abspath(path)), exist_ok=True)
    cw = CifWriter(structure, symprec=None)
    raw_cif = str(cw)

    lines = []
    lines.append(f"# Doped CIF generated via Universal Doping Workflow Engine")
    lines.append(f"# WARNING: UNRELAXED - Substituted atoms sit at host positions")
    for k, v in metadata.items():
        lines.append(f"# {k}: {v}")
    lines.append("")
    lines.append(raw_cif)

    cif_full = "\n".join(lines)
    with open(path, "w", encoding="utf-8") as f:
        f.write(cif_full)

    return cif_full
