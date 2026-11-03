"""
Stage 4b: resolve the parent (undoped) structure and apply the doping
transformation. Every piece of information needed (host formula, which site
the dopant replaces, dopant species, dopant fraction) comes from the
DopingSpec built in classify.py - never inferred from a bare formula string.
If the parent structure has multiple symmetry-distinct sites matching the
requested host_site_species, the user is asked which one is intended.

Site preference integration (v2):
  - For SPINEL compositions: routes through intent.py for full sublattice-aware
    site assignment (A=tetrahedral, B=octahedral) using the SITE_TABLE.
  - For OTHER structure types: uses site_preference.recommend_site() to provide
    an informed RECOMMENDATION rather than a bare question.
  - Charge compensation is checked and reported after substitution.
"""

from __future__ import annotations
import logging
from typing import Optional, Tuple, Dict, Any, List

from pymatgen.core import Structure
from pymatgen.core.periodic_table import Element as PMGElement
from pymatgen.symmetry.analyzer import SpacegroupAnalyzer
from pymatgen.transformations.standard_transformations import SubstitutionTransformation

from .models import DopingSpec, PipelineResult, DopedStructureValidation
from .search_external import search_external_databases
from .search_internal import search_internal_database
from .generate import generate_with_feedback_loop
from .filter_rules import validate_doped_structure, classify_compound_type
from .user_interaction import AskUserFn
from .site_preference import (
    recommend_site,
    detect_structure_type,
    check_size_compatibility,
    get_default_oxidation_state,
    compute_charge_balance,
    SPINEL_SITE_TABLE,
)

log = logging.getLogger("cif_pipeline.doping")


def resolve_parent_structure(
    spec: DopingSpec,
    mp_api_key: str,
    ask_user: AskUserFn,
    max_iterations: int = 5,
    samples_per_iteration: int = 25,
    mace_model_path: Optional[str] = None,
) -> Optional[Structure]:
    """Find (or generate) the undoped parent structure specified in `spec`."""

    req_sg = getattr(spec, "space_group", None)
    match, _all_ext = search_external_databases(
        spec.host_formula, is_doped=False, doping_spec=None,
        mp_api_key=mp_api_key, requested_space_group=req_sg, ask_user=ask_user,
    )
    if match:
        log.info(f"Parent '{spec.host_formula}' found in {match.source} ({match.record_id})")
        return match.structure
    elif _all_ext:
        log.info(f"Parent '{spec.host_formula}' has {len(_all_ext)} candidate polymorphs; selecting top candidate {_all_ext[0].record_id} ({_all_ext[0].space_group})")
        return _all_ext[0].structure

    match, _all_int = search_internal_database(
        spec.host_formula, is_doped=False, doping_spec=None,
        requested_space_group=req_sg, ask_user=ask_user,
    )
    if match:
        log.info(f"Parent '{spec.host_formula}' found internally ({match.record_id})")
        return match.structure
    elif _all_int:
        log.info(f"Parent '{spec.host_formula}' has {len(_all_int)} internal candidate polymorphs; selecting top candidate {_all_int[0].record_id}")
        return _all_int[0].structure

    log.info(f"Parent '{spec.host_formula}' not found anywhere - generating it first")
    result = generate_with_feedback_loop(
        spec.host_formula, max_iterations=max_iterations,
        samples_per_iteration=samples_per_iteration, mace_model_path=mace_model_path,
        ask_user=ask_user,
    )
    if result.cif_string is None:
        return None
    return Structure.from_str(result.cif_string, fmt="cif")


def _find_candidate_sites(structure: Structure, host_site_species: str) -> list:
    """Return symmetry-distinct site indices occupied by host_site_species."""
    sga = SpacegroupAnalyzer(structure)
    sym_struct = sga.get_symmetrized_structure()
    candidate_indices = []
    for group in sym_struct.equivalent_indices:
        idx = group[0]
        site = structure[idx]
        if host_site_species in [str(sp) for sp in site.species.elements]:
            candidate_indices.append(idx)
    return candidate_indices


def _recommend_site_for_dopant(
    structure: Structure,
    spec: DopingSpec,
    candidate_indices: List[int],
    ask_user: AskUserFn,
) -> int:
    """Use crystallographic knowledge to recommend which symmetry-distinct site
    a dopant should substitute onto, rather than just asking blindly.

    Decision flow:
    1. If the structure is a spinel → use SPINEL_SITE_TABLE for direct lookup
    2. Otherwise → use recommend_site() which checks Shannon radii and CFSE
    3. Build a recommendation into the question shown to the user
    4. If auto-assignment is safe (strength=strong), skip asking

    Returns the chosen site index.
    """
    formula = structure.composition.reduced_formula
    stype = detect_structure_type(formula)
    dopant = spec.dopant_species
    host_site = spec.host_site_species

    # Get recommendation
    rec = recommend_site(dopant, formula, host_site)

    # Build site options with coordination info
    options = []
    for i in candidate_indices:
        site = structure[i]
        # Try to determine coordination number from neighbors
        neighbors_O = [
            n for n in structure.get_neighbors(site, r=3.0)
            if "O" in str(getattr(getattr(n, 'site', n), 'specie', ''))
               or "O" in str(getattr(getattr(n, 'site', n), 'species', ''))
        ]
        cn = len(neighbors_O)
        cn_label = ""
        if cn == 4:
            cn_label = " [tetrahedral, A-site]"
        elif cn == 6:
            cn_label = " [octahedral, B-site]"

        options.append(
            f"Site {i}: {site.species_string} at "
            f"{site.frac_coords.round(3)}{cn_label}"
        )

    # If auto-assignable, check which candidate matches the recommendation
    if rec.get("auto") and rec["site"] in ("A", "B"):
        target_cn = 4 if rec["site"] == "A" else 6
        for idx_pos, i in enumerate(candidate_indices):
            site = structure[i]
            neighbors_O = [
                n for n in structure.get_neighbors(site, r=3.0)
                if "O" in str(getattr(getattr(n, 'site', n), 'specie', ''))
                   or "O" in str(getattr(getattr(n, 'site', n), 'species', ''))
            ]
            if len(neighbors_O) == target_cn:
                log.info(
                    f"[Site Preference] Auto-assigned {dopant} to site {i} "
                    f"({rec['site']}-site, CN={target_cn}): {rec['reason'][:80]}"
                )
                spec.site_preference_used = True
                spec.provenance.append(
                    f"Auto-assigned to {rec['site']}-site (CN={target_cn}): "
                    f"{rec['reason'][:100]}"
                )
                return i

    # Build informed question with recommendation
    rec_note = ""
    if rec["site"] != "?":
        rec_note = (
            f"\n\nRecommendation: {rec['site']}-site "
            f"(strength: {rec['strength']}, reason: {rec['reason'][:100]})"
        )

    choice = ask_user(
        f"The parent structure has {len(candidate_indices)} symmetry-distinct "
        f"'{host_site}' sites. Which one should '{dopant}' substitute onto?"
        f"{rec_note}",
        options,
    )
    from .user_interaction import pick_option_index
    idx = pick_option_index(choice, options)
    if idx is None or idx >= len(candidate_indices):
        # Fall back to recommendation or first candidate
        chosen = candidate_indices[0]
        log.warning(f"No valid site choice for {dopant} — using site {chosen}")
    else:
        chosen = candidate_indices[idx]

    return chosen


def _check_charge_compensation(
    parent_structure: Structure,
    doped_structure: Structure,
    spec: DopingSpec,
) -> List[str]:
    """Check whether doping created a charge imbalance and report compensation needs.

    Example: Sr²⁺ on La³⁺ creates -1 charge per substituted atom.
    Ti⁴⁺ on Fe³⁺ creates +1 charge per substituted atom.
    """
    warnings = []
    host_ox = get_default_oxidation_state(spec.host_site_species)
    dopant_ox = get_default_oxidation_state(spec.dopant_species)

    if host_ox is None or dopant_ox is None:
        return warnings

    charge_diff = dopant_ox - host_ox
    if abs(charge_diff) < 0.01:
        return warnings

    total_charge_change = charge_diff * spec.dopant_fraction
    direction = "excess" if total_charge_change > 0 else "deficit"

    warning = (
        f"Charge {direction}: doping {spec.dopant_species}"
        f"({dopant_ox:+d}) onto {spec.host_site_species}"
        f"({host_ox:+d}) site creates {charge_diff:+d} charge per substituted atom. "
        f"At {spec.dopant_fraction*100:.1f}% doping, total change = "
        f"{total_charge_change:+.3f} per formula unit. "
    )

    if total_charge_change > 0:
        warning += (
            f"Compensation: {abs(total_charge_change):.3f} Fe³⁺ → Fe²⁺, "
            f"or cation vacancies, or oxygen excess."
        )
    else:
        warning += (
            f"Compensation: oxygen vacancies ({abs(total_charge_change)/2:.3f} per f.u.), "
            f"or transition metal oxidation (e.g. Mn³⁺→Mn⁴⁺, Fe²⁺→Fe³⁺)."
        )

    warnings.append(warning)
    return warnings


def apply_doping(
    parent_structure: Structure,
    spec: DopingSpec,
    ask_user: AskUserFn,
) -> Structure:
    """Apply the substitution using pymatgen for the primary dopant and any co-dopants.
    Resolves which symmetry-distinct site to target for each dopant.
    Handles both multi-dopant co-substitution on the SAME site (e.g. {Fe: 0.90, Ti: 0.05, Cr: 0.05})
    and co-doping across DIFFERENT sites (e.g. Ti site and O site).
    """
    from collections import defaultdict
    from pymatgen.core.periodic_table import Element
    import copy

    spec_copy = copy.deepcopy(spec)
    all_specs = [spec_copy] + (spec_copy.co_dopants if hasattr(spec_copy, "co_dopants") and spec_copy.co_dopants else [])
    doped_structure = parent_structure.copy()

    # Step 1: Validate element symbols and resolve site index for each dopant
    for s in all_specs:
        # QA §6.3: validate dopant_species against pymatgen's element list before
        # we try to build a site occupancy dict - an invalid symbol would produce
        # an unparseable/corrupted structure rather than a clean error.
        try:
            Element(s.dopant_species)
        except ValueError:
            raise ValueError(
                f"'{s.dopant_species}' is not a valid element symbol. "
                f"Check the dopant spelling (e.g. 'Ti', 'Sr', 'Cr')."
            )

        # QA §6.2: validate host_site_species as well
        try:
            Element(s.host_site_species)
        except ValueError:
            raise ValueError(
                f"'{s.host_site_species}' is not a valid element symbol for the host site. "
                f"Check the host site species spelling."
            )

        if s.site_index is None:
            candidates = _find_candidate_sites(parent_structure, s.host_site_species)
            if len(candidates) == 0:
                raise ValueError(
                    f"No sites with species '{s.host_site_species}' found in the parent "
                    f"structure (formula: {parent_structure.composition.reduced_formula}). "
                    f"Cannot apply doping for '{s.dopant_species}'. "
                    f"Check that host_site_species matches an element actually present in the host."
                )
            elif len(candidates) == 1:
                s.site_index = candidates[0]
            else:
                # Use site preference knowledge to recommend, not just ask blindly
                s.site_index = _recommend_site_for_dopant(
                    parent_structure, s, candidates, ask_user,
                )

    # Step 2: Group dopants by site index to compute composite fractional occupancies
    sites_map = defaultdict(list)
    for s in all_specs:
        sites_map[s.site_index].append(s)

    # Map each site index to all symmetry-equivalent indices in its Wyckoff orbit
    try:
        sga = SpacegroupAnalyzer(parent_structure)
        sym_struct = sga.get_symmetrized_structure()
        equiv_map = {}
        for group in sym_struct.equivalent_indices:
            for idx in group:
                equiv_map[idx] = group
    except Exception:
        equiv_map = {}

    for site_idx, specs_on_site in sites_map.items():
        host_sp = specs_on_site[0].host_site_species
        total_dopant_fraction = sum(s.dopant_fraction for s in specs_on_site)
        remaining_host = max(0.0, 1.0 - total_dopant_fraction)

        occupancy = {}
        if remaining_host > 1e-6:
            occupancy[host_sp] = round(remaining_host, 6)
        for s in specs_on_site:
            if s.dopant_fraction > 1e-6:
                occupancy[s.dopant_species] = round(occupancy.get(s.dopant_species, 0.0) + s.dopant_fraction, 6)

        if not occupancy:
            occupancy = {host_sp: 1.0}

        target_indices = equiv_map.get(site_idx, [site_idx])
        for idx in target_indices:
            doped_structure[idx] = occupancy
            log.info(f"[Doping] Substituted site {idx} ({host_sp}) -> {occupancy}")

    return doped_structure


def apply_doping_with_validation(
    parent_structure: Structure,
    spec: DopingSpec,
    ask_user: AskUserFn,
) -> Tuple[Structure, DopedStructureValidation]:
    """Wraps apply_doping() with the SEPARATE doped-structure validation pass
    (filter_rules.validate_doped_structure). Validates both the primary dopant
    and any co-dopant substitutions.
    """
    doped_structure = apply_doping(parent_structure, spec, ask_user)
    compound_type = classify_compound_type(doped_structure.composition)

    # Validate primary dopant
    validation = validate_doped_structure(
        doped_structure,
        host_site_species=spec.host_site_species,
        dopant_species=spec.dopant_species,
        dopant_fraction=spec.dopant_fraction,
        compound_type=compound_type,
    )

    # Also validate co-dopants if present
    if hasattr(spec, "co_dopants") and spec.co_dopants:
        for co_s in spec.co_dopants:
            co_val = validate_doped_structure(
                doped_structure,
                host_site_species=co_s.host_site_species,
                dopant_species=co_s.dopant_species,
                dopant_fraction=co_s.dopant_fraction,
                compound_type=compound_type,
            )
            if not co_val.is_valid:
                validation.is_valid = False
                validation.notes += f" | Co-dopant {co_s.dopant_species} issue: {co_val.notes}"

    if not validation.is_valid:
        log.warning(f"Doped structure failed validation: {validation.notes}")
    return doped_structure, validation
