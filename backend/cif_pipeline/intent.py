"""
Spinel-specific intent classification and structured request builder.

This module is the ONLY entry point for spinel doping decisions.  It implements:
  - interpret(formula, decisions)  → full intent from a doped formula
  - from_request(host, dopants, basis, replaces, decisions) → same, from structured input
  - Scope gating (is it a spinel? is it an oxide? stoichiometry checks)
  - Base compound identification (from deficits, not heuristics)
  - Site assignment using SITE_TABLE with strength-based auto/ask rules
  - Chemistry validation (charge balance, ionic radii, mixed valence)

Design rules followed:
  1. A site is a SUBLATTICE, not an element
  2. "What does the dopant replace" ≠ "where does the dopant sit"
  3. Site assignment is an explicit input — never guessed
  4. Every output is re-measured (by verify() in spinel_build.py)
  5. Converged ≠ correct

Status codes returned:
  "ok"          — proceed to build
  "needs_input" — questions must be answered first
  "unsupported" — this composition/request can't be handled
"""

from __future__ import annotations
import logging
import re
from typing import Dict, List, Optional, Tuple, Any
from collections import OrderedDict

# Display formatting: site populations follow the project's 2-decimal rule.
from .formatting import format_amount

from pymatgen.core import Composition, Element

from .site_preference import (
    SPINEL_SITE_TABLE,
    SPINEL_SCENARIO_TABLE,
    get_default_oxidation_state,
    get_shannon_radius,
    get_cfse,
    check_size_compatibility,
    compute_charge_balance,
    SHANNON_RADII,
    COMMON_OXIDATION_STATES,
)

log = logging.getLogger("cif_pipeline.intent")


# ─────────────────────────────────────────────────────────────────────────────
# Constants
# ─────────────────────────────────────────────────────────────────────────────
ANION_SYMBOLS = {"O", "S", "Se", "F", "Cl", "Br", "I", "N"}
SPINEL_ANION_CHARGE = {"O": -2, "S": -2, "Se": -2}

# Doping vs solid solution threshold: base cation share of its site ≥ this → "doping"
DOPING_THRESHOLD = 0.80


def _is_anion(el: str) -> bool:
    return el in ANION_SYMBOLS


def _get_cation_elements(comp: Composition) -> Dict[str, float]:
    """Extract cation elements and their amounts from a Composition."""
    return {str(el): comp[el] for el in comp.elements if not _is_anion(str(el))}


def _normalize_to_O4(comp: Composition, anion: str = "O") -> Optional[Dict[str, float]]:
    """Normalize composition to 4 anions per formula unit.
    Returns None if the anion is not present."""
    anion_count = comp.get(anion, 0)
    if anion_count < 1e-6:
        return None
    scale = 4.0 / anion_count
    result = {}
    for el in comp.elements:
        result[str(el)] = round(comp[el] * scale, 6)
    return result


# ─────────────────────────────────────────────────────────────────────────────
# Stage 1: Scope Gate
# ─────────────────────────────────────────────────────────────────────────────

def _scope_gate(
    normalized: Dict[str, float],
    anion: str = "O",
) -> Tuple[str, str]:
    """Check that the composition is a valid spinel oxide.

    Returns:
        (status, reason)
        status: "ok" | "unsupported" | "needs_input"
    """
    # Must have the anion
    if anion not in normalized or normalized[anion] < 3.99:
        return "unsupported", f"not_an_oxide: no {anion} or insufficient {anion}"

    # Check for non-oxide anions
    other_anions = [el for el in normalized if _is_anion(el) and el != anion]
    if other_anions:
        return "unsupported", (
            f"anion_substitution_out_of_scope: found non-{anion} anions {other_anions}. "
            f"Anion doping (e.g. F⁻/N³⁻ for O²⁻) is not supported for spinels."
        )

    # Cation count per O₄ must be 3.000 (AB₂O₄)
    cations = {el: amt for el, amt in normalized.items() if not _is_anion(el)}
    total_cation = sum(cations.values())
    if abs(total_cation - 3.0) > 0.01:
        if total_cation < 3.0:
            return "unsupported", (
                f"cation_deficiency: {format_amount(total_cation)} cations per O₄ "
                f"(expected exactly 3.0 for AB₂O₄); non-stoichiometric cation-deficient spinel. "
                f"Vacancies (<3) or interstitials (>3) must be stated explicitly with 'Vac', "
                f"never inferred."
            )
        else:
            return "unsupported", (
                f"cation_excess: {format_amount(total_cation)} cations per O₄ "
                f"(expected exactly 3.0 for AB₂O₄); non-stoichiometric cation-excess spinel. "
                f"Vacancies (<3) or interstitials (>3) must be stated explicitly with 'Vac', "
                f"never inferred."
            )

    # Must have at least 2 cation species (excluding Vac)
    real_cations = {el: amt for el, amt in cations.items() if el != "Vac"}
    if len(real_cations) < 2:
        return "unsupported", (
            f"single_cation: only {list(real_cations.keys())} found. "
            f"Spinels require at least 2 cation species."
        )

    # Check for elements with no known oxidation state
    for el in real_cations:
        if el not in COMMON_OXIDATION_STATES:
            return "needs_input", (
                f"unknown_element: '{el}' has no known oxidation state in the database. "
                f"Supply the oxidation state AND preferred spinel site (A or B)."
            )

    return "ok", ""


# ─────────────────────────────────────────────────────────────────────────────
# Stage 2: Base Compound and Replacement Identification
# ─────────────────────────────────────────────────────────────────────────────

def _identify_base_and_replaced(
    normalized: Dict[str, float],
) -> Dict[str, Any]:
    """Identify the base (undoped parent) compound and what was replaced.

    Logic:
    - Group non-Fe cations by oxidation state
    - Base M = divalent cation with largest amount (the "host")
    - Replaced amounts come from DEFICITS, never guesses:
        replaced[M] = 1 - amount(M)    (M fills 1 A-site per f.u.)
        replaced[Fe] = 2 - amount(Fe)   (Fe fills 2 B-sites per f.u.)
    - If no single base dominates (all divalent share ≈ equally) → solid_solution

    Special case: Magnetite-type (only Fe + higher-valent dopants):
        base = Fe₃O₄, replaced[Fe] = 3 - amount(Fe)

    Returns dict with: base_formula, base_element, intent_label,
                       replaced, divalent_map, trivalent_map
    """
    cations = {el: amt for el, amt in normalized.items()
               if not _is_anion(el) and el != "Vac"}

    fe_amount = cations.get("Fe", 0.0)
    non_fe = {el: amt for el, amt in cations.items() if el != "Fe"}

    # Group by oxidation state
    divalent = {}
    trivalent_plus = {}
    for el, amt in non_fe.items():
        ox = get_default_oxidation_state(el)
        if ox is not None and ox <= 2:
            divalent[el] = amt
        else:
            trivalent_plus[el] = amt

    # Determine base compound
    base_element = None
    base_formula = None
    intent_label = "undoped"

    if divalent:
        # Find the majority divalent cation
        sorted_divalent = sorted(divalent.items(), key=lambda x: x[1], reverse=True)
        base_element = sorted_divalent[0][0]
        base_amount = sorted_divalent[0][1]

        # Determine host trivalent cation (Fe for ferrites, Al for aluminates, Cr for chromites)
        if fe_amount > 0.01:
            base_trivalent = "Fe"
        elif trivalent_plus:
            sorted_tri = sorted(trivalent_plus.items(), key=lambda x: x[1], reverse=True)
            base_trivalent = sorted_tri[0][0]
        else:
            base_trivalent = "Fe"

        # Check doping vs solid solution vs undoped
        total_divalent_site = sum(divalent.values())
        total_trivalent_site = fe_amount + sum(trivalent_plus.values())

        is_pure_binary = (
            len(sorted_divalent) == 1
            and abs(base_amount - 1.0) < 1e-4
            and (
                (base_trivalent == "Fe" and abs(fe_amount - 2.0) < 1e-4 and not trivalent_plus)
                or (base_trivalent != "Fe" and len(trivalent_plus) == 1 and abs(list(trivalent_plus.values())[0] - 2.0) < 1e-4)
            )
        )

        if is_pure_binary:
            intent_label = "undoped"
        elif total_divalent_site > 0 and base_amount / max(total_divalent_site, 1e-9) >= DOPING_THRESHOLD:
            intent_label = "cation_substitution"
        elif len(sorted_divalent) == 1:
            intent_label = "cation_substitution"
        else:
            intent_label = "solid_solution"

        base_formula = f"{base_element}{base_trivalent}2O4"

        if trivalent_plus and base_trivalent == "Fe" and intent_label == "cation_substitution":
            intent_label = "co_substitution"

    elif fe_amount >= 2.99:
        # Magnetite-type: only Fe (+ possible higher-valent dopants)
        base_element = "Fe"
        base_formula = "Fe3O4"
        if trivalent_plus:
            intent_label = "cation_substitution"
        else:
            intent_label = "undoped"
    else:
        # Can't identify a base
        intent_label = "unknown"
        base_formula = None

    # Compute replaced amounts from deficits
    replaced = {}
    if intent_label != "undoped":
        if base_element and base_element != "Fe":
            base_deficit = 1.0 - cations.get(base_element, 1.0)
            if abs(base_deficit) > 1e-6:
                replaced[base_element] = round(base_deficit, 6)

        if fe_amount > 0.01:
            fe_full = 2.0 if base_element != "Fe" else 3.0
            fe_deficit = fe_full - fe_amount
            if abs(fe_deficit) > 1e-6:
                replaced["Fe"] = round(fe_deficit, 6)

    return {
        "base_formula": base_formula,
        "base_element": base_element,
        "intent_label": intent_label,
        "replaced": replaced,
        "divalent_map": divalent,
        "trivalent_plus_map": trivalent_plus,
        "fe_amount": fe_amount,
    }


# ─────────────────────────────────────────────────────────────────────────────
# Stage 3: Site Assignment
# ─────────────────────────────────────────────────────────────────────────────

def _assign_sites(
    normalized: Dict[str, float],
    decisions: Dict[str, Any],
    base_info: Dict[str, Any],
) -> Tuple[
    Dict[str, float],
    Dict[str, float],
    List[str],
    List[str],
    List[str],
    List[Dict[str, Any]],
    List[Dict[str, Any]],
]:
    """Assign each element to A (tetrahedral) or B (octahedral) sublattice.

    Site rules in strict order:
      1. User decision (source="user")
      2. Literature table (source="literature:<technique>")
      3. Heuristic / CFSE / radius (source="heuristic:<rule>")
      4. Competing coordination -> scenarios + needs_input

    Returns:
        (A_spec, B_spec, provenance, questions, warnings, decisions_list, flags_list)
    """
    cations = {el: amt for el, amt in normalized.items()
               if not _is_anion(el) and el != "Vac" and el != "Fe"}

    A_spec: Dict[str, float] = {}
    B_spec: Dict[str, float] = {}
    provenance: List[str] = []
    questions: List[str] = []
    warnings: List[str] = []
    decisions_list: List[Dict[str, Any]] = []
    flags_list: List[Dict[str, Any]] = []

    is_aluminate = (
        base_info.get("base_formula") == "MgAl2O4"
        or ("Al" in cations and cations["Al"] >= 1.5)
        or (base_info.get("base_element") == "Mg" and "Al" in cations)
    )

    fe_total = normalized.get("Fe", 0.0)

    for el, amt in cations.items():
        # Check user-supplied decision first (Rule 1: user override)
        decision = decisions.get(el)

        if decision is not None:
            if isinstance(decision, str):
                decision_clean = decision.upper()
                if decision_clean == "A":
                    A_spec[el] = amt
                    provenance.append(f"{el}: A (user decision)")
                    decisions_list.append({
                        "key": f"site_{el}",
                        "value": "A",
                        "source": "user",
                        "ref": "",
                        "confidence": "high",
                        "note": "User-supplied site override: A",
                    })
                elif decision_clean == "B":
                    B_spec[el] = amt
                    provenance.append(f"{el}: B (user decision)")
                    decisions_list.append({
                        "key": f"site_{el}",
                        "value": "B",
                        "source": "user",
                        "ref": "",
                        "confidence": "high",
                        "note": "User-supplied site override: B",
                    })
                else:
                    questions.append(
                        f"Invalid decision for '{el}': '{decision}'. "
                        f"Use 'A', 'B', or a fraction on B (0-1)."
                    )
            elif isinstance(decision, (int, float)):
                frac_B = float(decision)
                frac_A = 1.0 - frac_B
                amt_A = round(amt * frac_A, 6)
                amt_B = round(amt * frac_B, 6)
                if amt_A > 1e-6:
                    A_spec[el] = amt_A
                if amt_B > 1e-6:
                    B_spec[el] = amt_B
                provenance.append(
                    f"{el}: {frac_A*100:.1f}% A + {frac_B*100:.1f}% B "
                    f"(user-supplied fraction on B = {frac_B})"
                )
                decisions_list.append({
                    "key": f"site_{el}",
                    "value": {"A": amt_A, "B": amt_B, "fraction_on_B": frac_B},
                    "source": "user",
                    "ref": "",
                    "confidence": "high",
                    "note": f"User-supplied split: {frac_A*100:.1f}% A, {frac_B*100:.1f}% B",
                })
            continue

        # Ca: special handling — no tetrahedral Shannon radius, +55% octahedral mismatch, strain ~0.65 eV/ion
        if el == "Ca":
            flag_ca = {
                "code": "CA_NO_TET_RADIUS",
                "message": (
                    "Ca2+ has no tetrahedral Shannon radius (CN=4). Octahedral size mismatch "
                    "is +55% with host Fe3+ (strain ~0.65 eV/ion); Ca composition is probably multiphase in spinels."
                ),
                "severity": "error",
            }
            flags_list.append(flag_ca)
            warnings.append(
                "Ca flagged: strain 0.65 eV/ion, probably multiphase; Ca2+ has no tetrahedral Shannon radius."
            )
            questions.append(
                f"'{el}' has NO tetrahedral Shannon radius and +55% octahedral mismatch with Fe3+ "
                f"(strain ~0.65 eV/ion; probably multiphase). Specify explicit site or hold until single-phase evidence exists."
            )
            provenance.append(f"{el}: NOT assigned (strain ~0.65 eV/ion, multiphase risk, no tetrahedral radius)")
            continue

        # Special case for aluminate spinels (e.g. MgAl2O4 mineral spinel)
        if is_aluminate:
            if el == "Al":
                B_spec[el] = amt
                provenance.append("Al: B (strong, auto: octahedral B-site preference in aluminate spinel)")
                decisions_list.append({
                    "key": "site_Al",
                    "value": "B",
                    "source": "literature:neutron",
                    "ref": "Roth (1964)",
                    "confidence": "high",
                    "note": "Al on B in aluminate spinel",
                })
                continue
            elif el == "Mg":
                A_spec[el] = amt
                provenance.append("Mg: A (strong, auto: normal mineral spinel MgAl2O4)")
                decisions_list.append({
                    "key": "site_Mg",
                    "value": "A",
                    "source": "literature:neutron",
                    "ref": "Roth (1964)",
                    "confidence": "high",
                    "note": "Mg on A in normal mineral spinel MgAl2O4",
                })
                continue

        # Special case for Li spinels: the site is set by the B-site host.
        # - LiMn2O4 / Li4Ti5O12-type (Mn/Ti B-host, little or no Fe): Li+ is
        #   small and takes tetrahedral 8a (A); excess beyond 1/f.u. shares
        #   octahedral 16d (B), i.e. Li[Li1/3Ti5/3]O4.
        # - Ferrites (Fe B-host, LiFe5O8-type): Li+ takes octahedral B sites;
        #   use the site table default below instead.
        b_host_Mn_Ti = ((normalized.get("Mn", 0.0) + normalized.get("Ti", 0.0)) >
                        (normalized.get("Fe", 0.0) + 1e-9))
        if el == "Li" and (b_host_Mn_Ti or normalized.get("Fe", 0.0) <= 1e-9):
            li_A = min(amt, 1.0)
            li_B = amt - li_A
            if li_A > 1e-6:
                A_spec[el] = round(li_A, 6)
            if li_B > 1e-6:
                B_spec[el] = round(li_B, 6)
            provenance.append(
                f"Li: {format_amount(li_A)} A (8a tetrahedral, LiMn2O4-type) + "
                f"{format_amount(li_B)} B (16d, Li4Ti5O12-type excess)")
            decisions_list.append({
                "key": "site_Li",
                "value": {"A": round(li_A, 6), "B": round(li_B, 6)},
                "source": "literature:neutron",
                "ref": "Thackeray et al. (LiMn2O4); Li[Li1/3Ti5/3]O4 titanate",
                "confidence": "medium",
                "note": "Li site is context-dependent; A-first with B overflow",
            })
            questions.append(
                "'Li' has context-dependent site preference (8a tetrahedral in "
                "LiMn2O4; shared 16d in Li4Ti5O12). Assigned A-first with excess "
                "on B; confirm against your synthesis."
            )
            continue

        # Lookup in SPINEL_SITE_TABLE (Rule 2: literature table)
        entry = SPINEL_SITE_TABLE.get(el)

        if entry is None or entry["strength"] == "unknown":
            questions.append(
                f"Element '{el}' ({format_amount(amt)} per f.u.) has no known spinel site preference. "
                f"Assign to: (A) tetrahedral, (B) octahedral, or provide fraction on B (0-1)."
            )
            B_spec[el] = amt
            provenance.append(f"{el}: B (TENTATIVE — unknown preference, needs user input)")
            decisions_list.append({
                "key": f"site_{el}",
                "value": "B",
                "source": "heuristic:unknown_default_B",
                "ref": "",
                "confidence": "undecided",
                "note": "Tentative default B-site, needs user confirmation",
            })
            flags_list.append({
                "code": f"UNKNOWN_SITE_PREFERENCE_{el}",
                "message": f"Element {el} has unknown site preference; tentatively placed on B",
                "severity": "warning",
            })
            continue

        if entry["strength"] == "strong":
            target_site = entry["site"]
            if target_site == "A":
                A_spec[el] = amt
            elif target_site == "B":
                B_spec[el] = amt
            elif target_site == "both":
                B_spec[el] = amt
                target_site = "B"
            provenance.append(f"{el}: {target_site} (strong, auto: {entry['reason'][:80]})")
            decisions_list.append({
                "key": f"site_{el}",
                "value": target_site,
                "source": entry.get("source", "literature:table"),
                "ref": entry.get("ref", ""),
                "confidence": "high",
                "note": entry.get("reason", ""),
            })

        elif entry["strength"] == "weak":
            if el == "Mn" and fe_total > 0.01:
                # Boucher et al. (1971): MnFe2O4 is mostly normal (~80% Mn on A, 20% on B)
                mn_A = round(amt * 0.80, 6)
                mn_B = round(amt * 0.20, 6)
                if mn_A > 1e-6:
                    A_spec[el] = mn_A
                if mn_B > 1e-6:
                    B_spec[el] = mn_B
                provenance.append(f"Mn: {format_amount(mn_A)} A + {format_amount(mn_B)} B (~80% on A in ferrites, Boucher et al. 1971)")
                decisions_list.append({
                    "key": f"site_{el}",
                    "value": {"A": mn_A, "B": mn_B},
                    "source": entry.get("source", "literature:neutron"),
                    "ref": entry.get("ref", "Boucher et al. (1971)"),
                    "confidence": "medium",
                    "note": "Mn mostly on A (~80%) in ferrites (Boucher et al. 1971)",
                })
                questions.append(
                    f"'{el}' has WEAK A-site preference ({entry['reason'][:80]}). "
                    f"Assigned ~80% on A as baseline; confirm or choose a scenario."
                )
            else:
                target_site = entry["site"]
                if el == "Mn" and fe_total <= 0.01:
                    # No Fe host (e.g. LiMn2O4): the ferrite 80/20 rule does not
                    # apply; Mn3+/Mn4+ go to octahedral B (16d).
                    target_site = "B"
                    provenance.append(
                        f"{el}: B (non-ferrite spinel: Mn3+/Mn4+ octahedral, "
                        f"e.g. LiMn2O4)")
                    decisions_list.append({
                        "key": f"site_{el}",
                        "value": "B",
                        "source": "literature:neutron",
                        "ref": "Thackeray et al. (LiMn2O4)",
                        "confidence": "medium",
                        "note": "Mn on B in non-ferrite spinels",
                    })
                    B_spec[el] = amt
                    continue
                if target_site == "A":
                    A_spec[el] = amt
                elif target_site in ("B", "both"):
                    B_spec[el] = amt
                    target_site = "B"
                provenance.append(f"{el}: {target_site} (weak preference, baseline: {entry['reason'][:60]})")
                decisions_list.append({
                    "key": f"site_{el}",
                    "value": target_site,
                    "source": entry.get("source", "literature:table"),
                    "ref": entry.get("ref", ""),
                    "confidence": "medium",
                    "note": entry.get("reason", ""),
                })
                questions.append(
                    f"'{el}' has WEAK {entry['site']}-site preference ({entry['reason'][:80]}). "
                    f"Confirm, or provide measured inversion / fraction on B."
                )

        elif entry["strength"] == "none":
            questions.append(
                f"'{el}' has NO clear site preference in spinels ({entry['reason'][:80]}). "
                f"Please specify: (A) tetrahedral, (B) octahedral, or fraction on B."
            )
            warnings.append(
                f"'{el}' ({amt:.4f} per f.u.) NOT assigned to any sublattice. Needs user decision."
            )
            provenance.append(f"{el}: NOT assigned (no clear preference)")

    # ── Ionic radius warnings (only relevant for ferrites with Fe host) ──
    if fe_total > 0.01:
        r_fe_tet = get_shannon_radius("Fe", 4, 3) or 0.49
        r_fe_oct = get_shannon_radius("Fe", 6, 3) or 0.645
        for el, amt in A_spec.items():
            if el == "Fe":
                continue
            ox = get_default_oxidation_state(el) or 2
            r = get_shannon_radius(el, 4, ox)
            if r is None:
                warnings.append(
                    f"⚠ '{el}' has NO tetrahedral Shannon radius (CN=4, ox={ox}+). "
                    f"Ion essentially never observed on A-site."
                )
                flags_list.append({
                    "code": f"NO_TET_RADIUS_{el}",
                    "message": f"'{el}' has NO tetrahedral Shannon radius (CN=4, ox={ox}+)",
                    "severity": "error",
                })
            elif abs(r - r_fe_tet) / r_fe_tet > 0.30:
                warnings.append(
                    f"⚠ '{el}' tetrahedral radius ({r:.3f} Å) differs by "
                    f"{abs(r - r_fe_tet)/r_fe_tet*100:.0f}% from Fe³⁺ ({r_fe_tet:.3f} Å). "
                    f"Large size mismatch on A-site."
                )
                flags_list.append({
                    "code": f"SIZE_MISMATCH_A_{el}",
                    "message": f"'{el}' tetrahedral radius ({r:.3f} Å) differs by >30% from Fe3+",
                    "severity": "warning",
                })

        for el, amt in B_spec.items():
            if el == "Fe":
                continue
            ox = get_default_oxidation_state(el) or 2
            r = get_shannon_radius(el, 6, ox)
            if r is not None and abs(r - r_fe_oct) / r_fe_oct > 0.30:
                warnings.append(
                    f"⚠ '{el}' octahedral radius ({r:.3f} Å) differs by "
                    f"{abs(r - r_fe_oct)/r_fe_oct*100:.0f}% from Fe³⁺ ({r_fe_oct:.3f} Å). "
                    f"Large size mismatch on B-site."
                )
                flags_list.append({
                    "code": f"SIZE_MISMATCH_B_{el}",
                    "message": f"'{el}' octahedral radius ({r:.3f} Å) differs by >30% from Fe3+",
                    "severity": "warning",
                })

    sum_A = sum(A_spec.values())
    sum_B = sum(B_spec.values())

    if fe_total > 0.01:
        # Fe fills remainder
        fe_A = round(1.0 - sum_A, 6)
        fe_B = round(2.0 - sum_B, 6)
        fe_calc = fe_A + fe_B

        if fe_A < -0.001:
            warnings.append(
                f"A-sublattice overcommitted: non-Fe cations sum to {sum_A:.4f} > 1.0. "
                f"Excess: {-fe_A:.4f}."
            )
        if fe_B < -0.001:
            warnings.append(
                f"B-sublattice overcommitted: non-Fe cations sum to {sum_B:.4f} > 2.0. "
                f"Excess: {-fe_B:.4f}."
            )

        if abs(fe_calc - fe_total) > 0.01:
            warnings.append(
                f"Fe remainder inconsistency: A needs {fe_A:.4f} + B needs {fe_B:.4f} = {fe_calc:.4f}, "
                f"but composition has {fe_total:.4f} Fe. Difference: {abs(fe_calc - fe_total):.4f}."
            )

        if fe_A > 1e-6:
            A_spec["Fe"] = fe_A
            provenance.append(f"Fe: {fe_A:.4f} on A (remainder after non-Fe cations)")
        if fe_B > 1e-6:
            B_spec["Fe"] = fe_B
            provenance.append(f"Fe: {fe_B:.4f} on B (remainder after non-Fe cations)")

        decisions_list.append({
            "key": "site_Fe",
            "value": {"A": fe_A, "B": fe_B},
            "source": "heuristic:remainder",
            "ref": "Neel (1948)",
            "confidence": "high",
            "note": f"Fe fills sublattice remainder: {fe_A:.4f} on A, {fe_B:.4f} on B",
        })
    else:
        if abs(sum_A - 1.0) > 0.01:
            warnings.append(f"A-sublattice capacity mismatch: sum is {sum_A:.4f} (expected 1.0).")
        if abs(sum_B - 2.0) > 0.01:
            warnings.append(f"B-sublattice capacity mismatch: sum is {sum_B:.4f} (expected 2.0).")

    # ── Ordered P4_332 flag: Li:Fe ≈ 1:3 on B (Li0.5Fe2.5O4-type) orders
    # below Fd-3m symmetry; the cubic build is then a disordered average.
    # (Must run after Fe remainder filling, which completes B_spec.)
    li_B = B_spec.get("Li", 0.0)
    fe_B = B_spec.get("Fe", 0.0)
    if li_B > 1e-9 and fe_B > 1e-9 and abs(li_B / fe_B - 1.0 / 3.0) < 0.05:
        flags_list.append({
            "code": "POSSIBLE_P4332_ORDERING",
            "message": ("Li:Fe ≈ 1:3 on B matches ordered Li0.5Fe2.5O4 "
                        "(P4_332); the Fd-3m build is a disordered average, "
                        "not the ordered ground state."),
            "severity": "warning",
        })

    # Aliovalent charge compensation check (e.g. Ti4+ replacing Fe3+)
    for el, amt in normalized.items():
        if _is_anion(el) or el in ("Fe", "Vac"):
            continue
        ox = get_default_oxidation_state(el) or 2
        if ox > 3 and fe_total > 0.01:
            excess_charge = round((ox - 3) * amt, 4)
            if excess_charge > 1e-4:
                decisions_list.append({
                    "key": f"charge_comp_{el}",
                    "value": "Fe3+->Fe2+",
                    "source": "heuristic:aliovalent",
                    "ref": "Smit & Wijn (1959)",
                    "confidence": "high",
                    "note": (
                        f"{el}{ox}+ (+{ox}) replaces Fe3+ (+3); excess positive charge "
                        f"(+{excess_charge:.2f}) compensated by reducing {excess_charge:.2f} Fe3+ to Fe2+ "
                        f"(mixed valence Fe2+/Fe3+)."
                    ),
                })
                flags_list.append({
                    "code": "ALIOVALENT_CHARGE_COMPENSATION",
                    "message": (
                        f"{el}{ox}+ aliovalent substitution requires charge compensation: "
                        f"{excess_charge:.2f} Fe3+ reduced to Fe2+ (mixed valence Fe2+/Fe3+)."
                    ),
                    "severity": "info",
                })
                provenance.append(
                    f"Charge compensation: {excess_charge:.2f} Fe3+ -> Fe2+ compensates excess charge from {el}{ox}+"
                )

    # Néel model validity check: non-magnetic cations on A-site
    non_mag_elements = {"Zn", "Cd", "Mg", "Al", "Ga", "In", "Ca", "Ge", "Sn", "Ti", "Si"}
    non_mag_A = sum(amt for el, amt in A_spec.items() if el in non_mag_elements)
    if non_mag_A > 0.30:
        flags_list.append({
            "code": "NEEL_MODEL_INVALID",
            "message": (
                f"Non-magnetic A-site fraction ({non_mag_A:.2f}) exceeds 0.30; "
                f"collinear Néel magnetic model is invalid due to spin canting and frustration."
            ),
            "severity": "warning",
        })
        warnings.append(
            f"⚠ Non-magnetic A-site fraction ({non_mag_A:.2f}) > 0.30; "
            f"collinear Néel magnetic model is invalid (spin canting/frustration)."
        )

    return A_spec, B_spec, provenance, questions, warnings, decisions_list, flags_list


# ─────────────────────────────────────────────────────────────────────────────
# Stage 4: Chemistry Validation
# ─────────────────────────────────────────────────────────────────────────────

def _validate_chemistry(
    A_spec: Dict[str, float],
    B_spec: Dict[str, float],
) -> Tuple[List[str], List[str]]:
    """Validate charge balance and ionic radius plausibility.

    Returns (reports, flags)
    """
    reports = []
    flags = []

    # Charge balance
    charge_result = compute_charge_balance({"A": A_spec, "B": B_spec})
    if not charge_result["balanced"]:
        if charge_result["imbalance"] > 0:
            reports.append(charge_result["compensation"])
        else:
            flags.append(charge_result["compensation"])
    else:
        reports.append("Charge balance: +8.0 per f.u. ✓")

    # Sublattice capacity
    sum_A = sum(A_spec.values())
    sum_B = sum(B_spec.values())
    if abs(sum_A - 1.0) > 0.001:
        flags.append(f"A-sublattice sum = {sum_A:.4f} ≠ 1.0")
    if abs(sum_B - 2.0) > 0.001:
        flags.append(f"B-sublattice sum = {sum_B:.4f} ≠ 2.0")

    return reports, flags


# ─────────────────────────────────────────────────────────────────────────────
# PUBLIC API: interpret()
# ─────────────────────────────────────────────────────────────────────────────

def interpret(
    formula: str,
    decisions: Optional[Dict[str, Any]] = None,
) -> Dict[str, Any]:
    """Main entry point: classify a spinel ferrite formula and produce
    a fully resolved sublattice specification.

    Args:
        formula:    chemical formula, e.g. "Zn0.05Ni0.95Fe2O4"
        decisions:  user-supplied site decisions, e.g. {"Co": "B", "Ca": 0.0}
                    element → "A" | "B" | fraction_on_B (0-1)

    Returns dict with:
        status:       "ok" | "needs_input" | "unsupported"
        reason:       explanation string if status is unsupported or needs_input
        intent:       "undoped" | "cation_substitution" | "co_substitution" | "solid_solution"
        base_formula: e.g. "NiFe2O4"
        base_element: e.g. "Ni"
        replaced:     {element: deficit_amount} — stoichiometric bookkeeping
        spec:         {"A": {...}, "B": {...}} — per-f.u. sublattice amounts
        decisions:    [{key, value, source, ref, confidence, note}] — chemistry provenance
        flags:        [{code, message, severity}] — domain alerts
        scenarios:    [{label, element, description, ref, spec}] — candidate distributions
        provenance:   [str] — why each element was placed where
        questions:    [str] — questions that must be answered for "needs_input"
        warnings:     [str] — non-blocking warnings/flags
        reports:      [str] — charge balance etc.
        normalized:   {element: amount_per_O4} — the composition normalised to O₄
    """
    if decisions is None:
        decisions = {}

    result: Dict[str, Any] = {
        "status": "ok",
        "reason": "",
        "intent": "unknown",
        "base_formula": None,
        "base_element": None,
        "replaced": {},
        "spec": {"A": {}, "B": {}},
        "decisions": [],
        "flags": [],
        "scenarios": [],
        "provenance": [],
        "questions": [],
        "warnings": [],
        "reports": [],
        "normalized": {},
    }

    # Reject ambiguous percentage notation
    if "%" in formula:
        result["status"] = "unsupported"
        result["reason"] = (
            "ambiguous_percentage: Formula contains '%' notation. Doping percentages are ambiguous "
            "(site fraction vs per-formula-unit vs mass percent). Please provide an explicit stoichiometry "
            "formula or use from_request() with an explicit basis ('site_fraction' or 'per_formula_unit')."
        )
        result["warnings"].append(result["reason"])
        return result

    # Parse formula
    try:
        comp = Composition(formula)
    except Exception as e:
        result["status"] = "unsupported"
        result["reason"] = f"parse_error: Cannot parse formula '{formula}': {e}"
        result["warnings"].append(result["reason"])
        return result

    # Normalize to O₄
    normalized = _normalize_to_O4(comp)
    if normalized is None:
        result["status"] = "unsupported"
        result["reason"] = "not_an_oxide: No oxygen found in formula. Not a spinel oxide."
        result["warnings"].append(result["reason"])
        return result
    result["normalized"] = normalized

    # Stage 1: Scope gate
    gate_status, gate_reason = _scope_gate(normalized)
    if gate_status != "ok":
        result["status"] = gate_status
        result["reason"] = gate_reason
        result["warnings"].append(gate_reason)
        return result

    # Stage 2: Base compound and replacement
    base_info = _identify_base_and_replaced(normalized)
    result["intent"] = base_info["intent_label"]
    result["base_formula"] = base_info["base_formula"]
    result["base_element"] = base_info["base_element"]
    result["replaced"] = base_info["replaced"]

    # Stage 3: Site assignment
    A_spec, B_spec, provenance, questions, warnings, decisions_list, flags_list = _assign_sites(
        normalized, decisions, base_info,
    )
    result["spec"] = {"A": A_spec, "B": B_spec}
    result["provenance"] = provenance
    result["questions"].extend(questions)
    result["warnings"].extend(warnings)
    result["decisions"] = decisions_list
    result["flags"] = flags_list

    # Stage 4: Chemistry validation
    reports, chem_flags = _validate_chemistry(A_spec, B_spec)
    result["reports"].extend(reports)
    result["warnings"].extend(chem_flags)

    # Stage 5: Scenario generation for weak / competing ions
    scenarios_list: List[Dict[str, Any]] = []
    weak_elements = [
        el for el in normalized
        if not _is_anion(el) and el not in ("Fe", "Vac") and el in SPINEL_SCENARIO_TABLE and el not in decisions
    ]
    if weak_elements:
        for w_el in weak_elements:
            w_amt = normalized[w_el]
            for scen_entry in SPINEL_SCENARIO_TABLE[w_el]:
                s_A = dict(A_spec)
                s_B = dict(B_spec)
                s_A.pop("Fe", None)
                s_B.pop("Fe", None)
                s_A.pop(w_el, None)
                s_B.pop(w_el, None)

                if "fraction_on_B" in scen_entry:
                    frac_B = scen_entry["fraction_on_B"]
                    frac_A = 1.0 - frac_B
                elif "fraction_on_A" in scen_entry:
                    frac_A = scen_entry["fraction_on_A"]
                    frac_B = 1.0 - frac_A
                else:
                    frac_B = 1.0
                    frac_A = 0.0

                amt_A = round(w_amt * frac_A, 6)
                amt_B = round(w_amt * frac_B, 6)
                if amt_A > 1e-6:
                    s_A[w_el] = amt_A
                if amt_B > 1e-6:
                    s_B[w_el] = amt_B

                fe_s_A = round(1.0 - sum(s_A.values()), 6)
                fe_s_B = round(2.0 - sum(s_B.values()), 6)
                if fe_s_A > 1e-6:
                    s_A["Fe"] = fe_s_A
                if fe_s_B > 1e-6:
                    s_B["Fe"] = fe_s_B

                scenarios_list.append({
                    "label": scen_entry["label"],
                    "element": w_el,
                    "description": scen_entry.get("description", ""),
                    "ref": scen_entry.get("ref", ""),
                    "inversion": scen_entry.get("inversion"),
                    "spec": {"A": s_A, "B": s_B},
                })
    result["scenarios"] = scenarios_list

    # Determine final status
    if result["questions"]:
        result["status"] = "needs_input"
    elif any(f.get("severity") == "error" for f in flags_list):
        result["status"] = "needs_input"
    elif result["warnings"] and any("overcommitted" in w or "NOT assigned" in w for w in result["warnings"]):
        result["status"] = "needs_input"
    else:
        result["status"] = "ok"

    return result


# ─────────────────────────────────────────────────────────────────────────────
# PUBLIC API: from_request()
# ─────────────────────────────────────────────────────────────────────────────

def from_request(
    host: str,
    dopants: Dict[str, float],
    basis: str = "per_formula_unit",
    replaces: Optional[Dict[str, str]] = None,
    decisions: Optional[Dict[str, Any]] = None,
) -> Dict[str, Any]:
    """Build intent from a structured request (e.g. from a web form or API).

    Args:
        host:      host formula, e.g. "NiFe2O4"
        dopants:   {dopant_element: amount}, e.g. {"Ti": 0.05}
        basis:     "per_formula_unit" → amount is absolute per O₄ f.u.
                   "site_fraction"    → amount is fraction of the replaced site
        replaces:  {dopant: element_it_replaces}, e.g. {"Ti": "Fe"}
                   If not specified, uses oxidation-state default:
                     2+ dopant → replaces divalent host cation
                     3+/4+ dopant → replaces Fe
        decisions: site decisions (same as interpret())

    Returns same dict as interpret().
    """
    if decisions is None:
        decisions = {}
    if replaces is None:
        replaces = {}

    # Validate basis
    if basis not in ("per_formula_unit", "site_fraction"):
        return {
            "status": "unsupported",
            "reason": f"invalid_basis: Basis '{basis}' is unsupported or ambiguous. Must be 'per_formula_unit' or 'site_fraction'.",
            "warnings": [f"Invalid basis '{basis}'. Must be 'per_formula_unit' or 'site_fraction'."],
            "intent": "unknown", "base_formula": None, "base_element": None,
            "replaced": {}, "spec": {"A": {}, "B": {}},
            "decisions": [], "flags": [], "scenarios": [],
            "provenance": [], "questions": [], "reports": [], "normalized": {},
        }

    # Check for ambiguous percentage specifications in dopants
    for dopant, amt in dopants.items():
        if isinstance(amt, str) and "%" in amt:
            return {
                "status": "unsupported",
                "reason": (
                    f"ambiguous_percentage: Dopant '{dopant}' specifies percentage string '{amt}'. "
                    f"Specify an explicit float fraction (e.g. 0.05) and explicit basis."
                ),
                "warnings": [f"Ambiguous percentage '{amt}' for dopant '{dopant}'."],
                "intent": "unknown", "base_formula": None, "base_element": None,
                "replaced": {}, "spec": {"A": {}, "B": {}},
                "decisions": [], "flags": [], "scenarios": [],
                "provenance": [], "questions": [], "reports": [], "normalized": {},
            }

    # Parse host
    try:
        host_comp = Composition(host)
    except Exception as e:
        return {
            "status": "unsupported",
            "reason": f"parse_error: Cannot parse host formula '{host}': {e}",
            "warnings": [f"Cannot parse host formula '{host}': {e}"],
            "intent": "unknown", "base_formula": None, "base_element": None,
            "replaced": {}, "spec": {"A": {}, "B": {}},
            "decisions": [], "flags": [], "scenarios": [],
            "provenance": [], "questions": [], "reports": [], "normalized": {},
        }

    # Normalize host to O₄
    host_norm = _normalize_to_O4(host_comp)
    if host_norm is None:
        return {
            "status": "unsupported",
            "reason": "not_an_oxide: Host has no oxygen — not an oxide spinel.",
            "warnings": ["Host has no oxygen — not an oxide spinel."],
            "intent": "unknown", "base_formula": None, "base_element": None,
            "replaced": {}, "spec": {"A": {}, "B": {}},
            "decisions": [], "flags": [], "scenarios": [],
            "provenance": [], "questions": [], "reports": [], "normalized": {},
        }

    # Build doped composition
    doped_norm = dict(host_norm)

    for dopant, amount in dopants.items():
        # Determine which element is replaced
        replaced_el = replaces.get(dopant)
        if replaced_el is None:
            # Default: 2+ dopant replaces divalent host cation, 3+/4+ replaces Fe
            ox = get_default_oxidation_state(dopant)
            if ox is not None and ox <= 2:
                host_cations = {el: amt for el, amt in host_norm.items()
                                if not _is_anion(el) and el != "Fe"}
                if host_cations:
                    replaced_el = max(host_cations, key=host_cations.get)
                else:
                    replaced_el = "Fe"
            else:
                replaced_el = "Fe"

        # Compute actual dopant amount based on basis
        if basis == "site_fraction":
            site_amount = host_norm.get(replaced_el, 0.0)
            actual_amount = amount * site_amount
        else:  # per_formula_unit
            actual_amount = amount

        # Apply substitution
        if replaced_el in doped_norm:
            doped_norm[replaced_el] = round(doped_norm[replaced_el] - actual_amount, 6)
            if doped_norm[replaced_el] < -0.001:
                return {
                    "status": "unsupported",
                    "reason": (
                        f"negative_occupancy: Dopant '{dopant}' amount {actual_amount:.4f} exceeds available "
                        f"'{replaced_el}' ({host_norm.get(replaced_el, 0):.4f}). Cannot create negative occupancy."
                    ),
                    "warnings": [
                        f"Dopant '{dopant}' amount {actual_amount:.4f} exceeds available "
                        f"'{replaced_el}' ({host_norm.get(replaced_el, 0):.4f}). "
                        f"Cannot create negative occupancy."
                    ],
                    "intent": "unknown", "base_formula": None, "base_element": None,
                    "replaced": {}, "spec": {"A": {}, "B": {}},
                    "decisions": [], "flags": [], "scenarios": [],
                    "provenance": [], "questions": [], "reports": [], "normalized": {},
                }

        doped_norm[dopant] = round(doped_norm.get(dopant, 0.0) + actual_amount, 6)

    # Reconstruct formula string from normalised amounts
    parts = []
    for el in sorted(doped_norm.keys(), key=lambda x: (x == "O", x)):
        if doped_norm[el] > 1e-6:
            if abs(doped_norm[el] - round(doped_norm[el])) < 1e-4:
                parts.append(f"{el}{int(round(doped_norm[el]))}" if round(doped_norm[el]) != 1 else el)
            else:
                parts.append(f"{el}{doped_norm[el]:.4g}")

    formula_str = "".join(parts)

    # Now run through interpret()
    result = interpret(formula_str, decisions)

    # Add basis info to provenance
    result["provenance"].insert(0,
        f"Built from request: host='{host}', dopants={dopants}, basis='{basis}', replaces={replaces}"
    )
    for dopant, amount in dopants.items():
        replaced_el = replaces.get(dopant, "auto")
        result["provenance"].append(
            f"Dopant '{dopant}': {amount} ({basis}) replaces '{replaced_el}'"
        )

    return result


# ─────────────────────────────────────────────────────────────────────────────
# Helper: describe_sublattice for human-readable output
# ─────────────────────────────────────────────────────────────────────────────

def describe_intent(result: Dict[str, Any]) -> str:
    """Format an intent result as a human-readable report."""
    lines = []
    lines.append(f"Status: {result['status']}")
    lines.append(f"Intent: {result['intent']}")
    lines.append(f"Base:   {result.get('base_formula', '?')}")

    if result.get("replaced"):
        lines.append(f"Replaced: {result['replaced']}")

    spec = result.get("spec", {})
    if spec.get("A"):
        a_parts = [f"{el}={amt:.4f}" for el, amt in spec["A"].items()]
        lines.append(f"A-site (tetrahedral): [{', '.join(a_parts)}] (sum={sum(spec['A'].values()):.4f})")
    if spec.get("B"):
        b_parts = [f"{el}={amt:.4f}" for el, amt in spec["B"].items()]
        lines.append(f"B-site (octahedral):  [{', '.join(b_parts)}] (sum={sum(spec['B'].values()):.4f})")

    if result.get("provenance"):
        lines.append("\nProvenance:")
        for p in result["provenance"]:
            lines.append(f"  • {p}")

    if result.get("reports"):
        lines.append("\nReports:")
        for r in result["reports"]:
            lines.append(f"  ✓ {r}")

    if result.get("warnings"):
        lines.append("\nWarnings:")
        for w in result["warnings"]:
            lines.append(f"  ⚠ {w}")

    if result.get("questions"):
        lines.append("\nQuestions (must be answered):")
        for q in result["questions"]:
            lines.append(f"  ? {q}")

    return "\n".join(lines)
