"""
dopant_pipeline.py — the public "dopant functional".

One call:
    result = generate_doped_cif(DopantRequest(
        host_formula="NiFe2O4", dopant_element="Co", dopant_fraction=0.3))

runs the whole chain and returns a `DopedCifResult` with:

  1. the base family (family.classify_family),
  2. the site regime + inversion (regime.decide_regime),
  3. the neat-fraction / supercell plan (fractions.resolve_neat_fraction),
  4. the chosen representation / technique (representation.choose_technique),
  5. one or more built CIFs, best first,
  6. independent pass / fail / not_run checks and a provenance record.

For a spinel host it routes through intent + spinel_build (the mature path).
For a non-spinel host it needs an explicit `parent` Structure and routes through
general_doping.
"""

from __future__ import annotations

import json
import os
from dataclasses import dataclass, field
from typing import Any, Dict, List, Optional, Tuple

import numpy as np
from pymatgen.core import Structure, Composition, Lattice
from pymatgen.io.cif import CifWriter

from .family import classify_family, FamilyInfo
from .regime import decide_regime, RegimeResult, inversion_to_sublattices
from .fractions import resolve_neat_fraction, FractionPlan
from .representation import (
    build_representations, choose_technique, rank_representations, Representation,
)
from .geometry import estimate_a_u
from .intent import interpret
from .spinel_build import NOMINAL_CHARGES, verify as verify_spinel


@dataclass
class DopantRequest:
    host_formula: str
    dopant_element: str
    dopant_fraction: float
    host_site_species: Optional[str] = None     # which host element the dopant replaces
    base_family: Optional[str] = None           # override auto-detection
    application: Optional[str] = None           # "mlip" | "dft" | "xrd" | "screening" | ...
    technique: Optional[str] = None             # "vca" | "ordered" | "sqs" | "enumerate" | "ensemble"
    inversion: Any = None                       # scalar λ or {cation: λ}
    synthesis: Optional[str] = None
    ordering_suspected: bool = False            # use cluster-expansion+MC ordering
    relax: bool = False                         # run MACE relaxation if available
    mace_model_path: Optional[str] = None
    relax_fmax: float = 0.05                    # eV/A convergence for the MLIP optimizer
    relax_max_steps: int = 200
    symmetrize_tetragonal: bool = False         # spglib-refine the JT starting cell
    # Energy source for ranking/ordering: "surrogate" (fast Coulomb pre-filter)
    # or "mlip" (MACE-MP-0 single points).  "dft" is intentionally not offered.
    energy_source: str = "surrogate"
    mlip_model: Optional[str] = None
    seed: int = 0
    max_atoms: int = 560
    min_image: float = 10.0
    write_dir: Optional[str] = None             # if given, write CIFs here
    co_dopants: List[Dict[str, Any]] = field(default_factory=list)


@dataclass
class Check:
    name: str
    status: str                 # "pass" | "fail" | "not_run"
    detail: str = ""


@dataclass
class DopedCifResult:
    status: str                 # "ok" | "needs_input" | "unsupported" | "failed"
    best_cif: Optional[str] = None
    cifs: List[str] = field(default_factory=list)
    representation: Optional[str] = None
    family: Optional[FamilyInfo] = None
    regime: Optional[RegimeResult] = None
    fraction_plan: Optional[FractionPlan] = None
    checks: List[Check] = field(default_factory=list)
    warnings: List[str] = field(default_factory=list)
    relaxation: Optional[Dict[str, Any]] = None
    provenance: Dict[str, Any] = field(default_factory=dict)
    written_files: List[str] = field(default_factory=list)
    notes: str = ""


# ─────────────────────────────────────────────────────────────────────────────
# Helpers
# ─────────────────────────────────────────────────────────────────────────────

def _site_of(spec: Dict[str, Dict[str, float]], el: str) -> Optional[str]:
    for site in ("A", "B"):
        if el in spec.get(site, {}):
            return site
    return None


def _nominal_charge(el: str) -> float:
    # Prefer the tabulated common oxidation state (e.g. Cs -> +1, Li -> +1);
    # fall back to +2 only for genuinely unknown elements, and never silently
    # treat an unknown monovalent ion as divalent in charge accounting.
    try:
        from .site_preference import get_default_oxidation_state
        ox = get_default_oxidation_state(el)
        if ox is not None:
            return float(ox)
    except Exception:
        pass
    q = NOMINAL_CHARGES.get(el)
    if q is None:
        q = 3.0 if el in ("Fe", "Al", "Cr") else 2.0
    return q


def _apply_substitution(
    base_spec: Dict[str, Dict[str, float]],
    dopant: str,
    fraction: float,
    host_site_species: Optional[str],
    dopant_site: Optional[str],
) -> Tuple[Dict[str, Dict[str, float]], str]:
    """Return (new A/B spec, host species replaced) with `fraction`/fu of dopant."""
    spec = {site: dict(vals) for site, vals in base_spec.items()}

    if host_site_species is None:
        site = dopant_site or "B"
        pool = spec.get(site, {})
        # Prefer a host species with the same nominal charge as the dopant
        # (charge-neutral substitution); else Fe; else the majority species.
        q_dop = _nominal_charge(dopant)
        same_charge = [el for el in pool if abs(_nominal_charge(el) - q_dop) < 1e-9]
        if same_charge:
            host_site_species = max(same_charge, key=pool.get)
        elif "Fe" in pool:
            host_site_species = "Fe"
        else:
            host_site_species = max(pool, key=pool.get)
    else:
        site = _site_of(spec, host_site_species)
        if site is None:
            raise ValueError(
                f"host species '{host_site_species}' not present in base spec {base_spec}"
            )

    pool = spec[site]
    have = pool.get(host_site_species, 0.0)
    frac_used = min(fraction, have)

    new_pool = dict(pool)
    new_pool[host_site_species] = round(have - frac_used, 6)
    if new_pool[host_site_species] <= 1e-9:
        del new_pool[host_site_species]
    new_pool[dopant] = round(new_pool.get(dopant, 0.0) + frac_used, 6)
    spec[site] = new_pool
    return spec, host_site_species


def _charge_of_spec(spec) -> float:
    total = 0.0
    for site in ("A", "B"):
        for el, amt in spec.get(site, {}).items():
            if el == "Vac":
                continue
            total += amt * _nominal_charge(el)
    return total


def _assess_charge(spec) -> Tuple[str, str, List[str]]:
    """Assess charge balance, accounting for Fe mixed valence.

    Returns (status, detail, notes) where status is "pass" | "needs_input" |
    "fail".  A positive excess that Fe can absorb via Fe3+ -> Fe2+ is a *pass*
    with a mixed-valence note (this is exactly what makes magnetite-type
    formulas such as Zn0.05Ni0.05Fe2.90O4 charge-neutral).  A deficit needs an
    explicit compensation decision and is returned as `needs_input`.
    """
    q = _charge_of_spec(spec)
    diff = q - 8.0
    fe_total = sum(spec.get(s, {}).get("Fe", 0.0) for s in ("A", "B"))
    if abs(diff) < 0.05:
        return "pass", f"cation charge sum = {q:.3f} (target 8.000)", []
    if diff > 0:
        if fe_total >= diff - 1e-6:
            return ("pass",
                    f"cation charge sum = {q:.3f}; +{diff:.3f} absorbed as "
                    f"{diff:.3f} Fe3+ -> Fe2+ (mixed valence)",
                    [f"mixed-valence Fe: ~{diff:.3f} Fe2+ per formula unit"])
        return ("fail",
                f"cation charge sum = {q:.3f}; +{diff:.3f} excess exceeds "
                f"available Fe ({fe_total:.3f})", [])
    # deficit
    return ("needs_input",
            f"cation charge deficit {diff:.3f} (sum {q:.3f}); requires vacancies, "
            f"higher oxidation states or a co-dopant", [])


def _species_symbol(sp) -> str:
    """Element symbol for an Element or Species (ignores oxidation state)."""
    elem = getattr(sp, "element", None)
    return str(elem) if elem is not None else str(sp)


def _cif_with_tag(structure: Structure, mode: str, seed: int,
                  spec: Optional[Dict[str, Dict[str, float]]] = None) -> str:
    # symprec=None (P1) is essential: a decorated supercell has its symmetry
    # broken by the dopant, and letting CifWriter re-symmetrise it (symprec>0)
    # can produce a CIF that reads back as a *different* (symmetry-expanded)
    # cell — e.g. a 140-atom primitive supercell came back as 280 atoms.
    # Explicit Fe2+/Fe3+ oxidation states are attached for ordered structures
    # (fractional-occupancy VCA sites must keep their occupancies).
    ordered = all(s.is_ordered for s in structure)
    already_oxidised = any(
        getattr(sp, "oxi_state", None) is not None
        for site in structure
        for sp in site.species.keys()
    )
    if spec is not None and ordered and not already_oxidised:
        struct = _assign_oxidation_states(structure, spec)
    else:
        struct = structure.copy()
    # Unique site labels (required by the CIF spec and by ML parsers keyed on
    # _atom_site_label).
    counts: dict = {}
    for site in struct:
        el = _species_symbol(list(site.species.keys())[0])
        counts[el] = counts.get(el, 0) + 1
        site.label = f"{el}{counts[el]}"
    body = str(CifWriter(struct, symprec=None))
    tag = (f"_cif_pipeline_representation "
           f"'{mode}{'' if mode == 'vca' else '_seed_' + str(seed)}'")
    return tag + "\n" + body


def _mixed_valence_split(spec: Dict[str, Dict[str, float]]) -> Tuple[float, float]:
    """Return (charge excess per f.u., Fe amount per f.u.).

    A positive excess that Fe can absorb means that many Fe per formula unit are
    Fe2+ (the rest Fe3+) — this is what makes magnetite-type formulas neutral.
    """
    q = _charge_of_spec(spec)
    diff = q - 8.0
    fe_total = sum(spec.get(s, {}).get("Fe", 0.0) for s in ("A", "B"))
    return (max(0.0, diff), fe_total)


def _assign_oxidation_states(structure: Structure,
                             spec: Dict[str, Dict[str, float]]) -> Structure:
    """Return a copy with explicit per-site oxidation states.

    Cations get their nominal charge; Fe is split into Fe2+/Fe3+ according to
    the charge balance (``_mixed_valence_split``), with the Fe2+ sites spread
    evenly to avoid artificial clustering.
    """
    from pymatgen.core import Species

    struct = structure.copy()
    n_o = struct.composition.get("O", 0.0)
    n_fu = n_o / 4.0 if n_o else 1.0
    excess, _fe = _mixed_valence_split(spec)

    # nominal oxidation states for the non-Fe cations (tabulated common states;
    # unknown elements fall back via _nominal_charge, never silently to +2
    # without consulting the oxidation-state table)
    nominal = {"Zn": 2, "Ni": 2, "Co": 2, "Cu": 2, "Mg": 2, "Mn": 2, "Ca": 2,
               "Fe": 3, "Al": 3, "Cr": 3, "Ga": 3, "Ti": 4, "Li": 1, "V": 3}

    # Classify each Fe site by its sublattice: in a ferrimagnetic spinel the
    # Fe2+ whose absence broke the strict magnetic structure lives on the
    # *octahedral* B-site (that is a physical rule, not a coincidence of the
    # charge-balance surplus).  The Fe3+/Fe2+ split
    #
    #   n_Fe2+ = charge_excess  (must match the balance)
    #   n_Fe3+ = total_Fe - n_Fe2+
    #
    # is therefore placed with Fe2+ confined to B-sites, exactly reproducing the
    # expected per-sublattice count (e.g. A: Zn2+1 Fe3+19 ; B: Ni2+1 Fe2+18 Fe3+21).
    from .spinel_build import classify_spinel_sites
    try:
        a_idx, b_idx, _ = classify_spinel_sites(struct)
        b_set = set(b_idx)
    except Exception:
        b_set = None

    fe_idx = [i for i, s in enumerate(struct)
              if any(str(el) == "Fe" for el in s.species.elements)]
    # Prefer Fe indices that are on the B sublattice for the Fe2+ share.
    fe_B = [i for i in fe_idx if (b_set is not None and i in b_set)]
    fe_A = [i for i in fe_idx if (b_set is None or i not in b_set)]
    ordered_fe = fe_B + fe_A          # Fe2+ first on B, overflow to A

    n_fe2 = int(round(excess * n_fu))
    n_fe2 = max(0, min(n_fe2, len(ordered_fe)))
    fe2_set = set(ordered_fe[:n_fe2])

    for i, site in enumerate(struct):
        el = _species_symbol(list(site.species.keys())[0])
        if el == "O":
            q = -2
        elif el == "Fe":
            q = 2 if i in fe2_set else 3
        else:
            q = nominal.get(el, _nominal_charge(el))
        struct.replace(i, {Species(el, oxidation_state=q): 1.0})

    # Magnetic moments (site.properties['magmom']): a simple ferrimagnetic
    # spinel model: A-site moments are "positive", B-site moments "negative"
    # (antiferromagnetic A-B coupling), and |m| from the high-spin ion.
    #   A-site Fe3+: +5 µB ; B-site Fe3+: -5 µB ; B-site HS Fe2+: -4 µB
    #   B-site HS Ni2+: -2 µB ; B-site HS Co2+: -3 µB ; O/Zn/Mg/Al/Cr/Ga: 0
    for i, site in enumerate(struct):
        sp0 = list(site.species.keys())[0]
        el = _species_symbol(sp0)
        ox = getattr(sp0, "oxi_state", None)
        on_B = (b_set is not None and i in b_set)
        if el == "O":
            m = 0.0
        elif el in ("Zn", "Mg", "Al", "Cr", "Ga", "Li", "Ca", "Mn"):
            m = 0.0
        elif el == "Fe":
            if on_B and ox == 2:
                m = -4.0
            elif on_B:
                m = -5.0
            else:
                m = 5.0 if ox == 3 else 4.0
        elif el == "Ni":
            m = -2.0 if on_B else 0.0
        elif el == "Co":
            m = -3.0 if on_B else 0.0
        elif el == "Cu":
            m = -1.0 if on_B else 0.0
        else:
            m = 0.0
        struct[i].properties["magmom"] = round(m, 2)
    return struct


def _roundtrip_ok(cif: str, structure: Structure) -> Check:
    try:
        rt = Structure.from_str(cif, fmt="cif")
        if rt.composition.reduced_formula != structure.composition.reduced_formula:
            return Check("cif_roundtrip", "fail",
                         f"{rt.composition.reduced_formula} != {structure.composition.reduced_formula}")
        return Check("cif_roundtrip", "pass")
    except Exception as e:  # pragma: no cover
        return Check("cif_roundtrip", "fail", str(e))


# ─────────────────────────────────────────────────────────────────────────────
# Main entry point
# ─────────────────────────────────────────────────────────────────────────────

def generate_doped_cif(
    request: DopantRequest,
    parent: Optional[Structure] = None,
) -> DopedCifResult:
    provenance: Dict[str, Any] = {"request": {
        "host": request.host_formula,
        "dopant": request.dopant_element,
        "fraction": request.dopant_fraction,
        "host_site_species": request.host_site_species,
        "application": request.application,
        "technique": request.technique,
    }}
    warnings: List[str] = []

    # --- Validate the request up front so bad inputs never raise -----------
    from pymatgen.core import Element as _Element
    try:
        _Element(request.dopant_element)
    except Exception:
        return DopedCifResult(
            status="unsupported",
            notes=f"'{request.dopant_element}' is not a valid element symbol.",
            provenance=provenance)
    if not (0.0 < request.dopant_fraction < 2.0):
        return DopedCifResult(
            status="unsupported",
            notes=(f"dopant fraction {request.dopant_fraction} is outside the "
                   f"supported range (0, 2) per formula unit."),
            provenance=provenance)

    # --- Stage 1: family -----------------------------------------------------
    if parent is not None:
        fam = classify_family(formula=request.host_formula, structure=parent)
    else:
        fam = classify_family(formula=request.host_formula)
    if request.base_family:
        fam.family = request.base_family
        fam.method += " (family overridden by request)"
    provenance["family"] = {
        "family": fam.family, "space_group": fam.space_group,
        "method": fam.method, "confidence": fam.confidence,
        "mobile_species": fam.mobile_species, "sites_per_fu": fam.sites_per_formula_unit,
    }

    if fam.family != "spinel":
        # Non-spinel path requires a parent structure for the universal engine.
        # If none was passed, try the databases (COD/MP/internal) before asking
        # the user — but never trigger LLM generation here.
        if parent is None:
            parent = _find_db_parent(request.host_formula, provenance, warnings)
        if parent is None:
            return DopedCifResult(
                status="needs_input",
                family=fam,
                notes=(
                    f"family '{fam.family}' recognized, but no parent structure "
                    f"for '{request.host_formula}' was found in the databases. "
                    f"Pass parent=... explicitly or use the spinel family."
                ),
                provenance=provenance,
            )
        return _generate_general(request, parent, fam, provenance, warnings)

    # --- Stage 2: regime / inversion ----------------------------------------
    reg = decide_regime(request.host_formula, decision=request.inversion,
                        synthesis=request.synthesis)
    provenance["regime"] = {
        "regime": reg.regime, "inversion": reg.inversion,
        "distortion": reg.distortion, "method": reg.method,
        "scenarios": [s.label for s in reg.scenarios],
    }
    if reg.distortion:
        warnings.append(reg.flags[0] if reg.flags else "distortion flagged")

    # --- Base spec from intent ----------------------------------------------
    base = interpret(request.host_formula)
    base_spec = base.get("spec")
    if not base_spec:
        return DopedCifResult(status="failed", family=fam, regime=reg,
                              notes=f"could not resolve base spec for {request.host_formula}",
                              provenance=provenance)
    if not base_spec.get("A") and not base_spec.get("B"):
        # Empty sublattice spec. The usual cause is a mixed-valence M3O4 spinel
        # such as magnetite, which interpret() cannot decompose because the cation
        # occupies the lattice in two oxidation states. _magnetite_spec() supplies
        # a nominal A=M / B=M2 model for exactly that case, so try it before
        # giving up - otherwise every doped ferrite built from a Fe3O4 parent
        # would be rejected.
        spec_fallback = _magnetite_spec(request.host_formula)
        if spec_fallback is not None:
            base_spec = spec_fallback
            warnings.append(
                f"'{request.host_formula}' is a mixed-valence M3O4 spinel; a nominal "
                f"A=M / B=M2 model was used and the mixed valence is reported as such."
            )
            provenance["magnetite_fallback"] = True
        else:
            # Still empty: refuse explicitly instead of crashing later in
            # _apply_substitution on an empty pool.
            return DopedCifResult(
                status="unsupported", family=fam, regime=reg,
                notes=(f"host '{request.host_formula}' has an empty A/B sublattice spec "
                       f"(interpret status: {base.get('status')}); mixed-valence or "
                       f"non-spinel hosts need an explicit parent or formula-driven request"),
                provenance=provenance)

    # --- Stage 3: sublattice + neat fraction --------------------------------
    dopant_site = _site_of(base_spec, request.dopant_element)
    if dopant_site is None:
        dopant_site = _preferred_site(request.dopant_element, reg)
    if request.host_site_species is not None:
        host_site = _site_of(base_spec, request.host_site_species)
        if host_site is not None:
            dopant_site = host_site
    else:
        # Prefer the site that already hosts a same-charge (isovalent) cation,
        # so the default substitution is charge-neutral where possible.
        dopant_site = _preferred_isovalent_site(
            base_spec, request.dopant_element, dopant_site
        )

    sites_per_fu = 1.0 if dopant_site == "A" else 2.0
    # fraction per formula unit -> fraction of the sublattice
    target_sublattice = request.dopant_fraction / sites_per_fu

    a = estimate_a_u(base_spec)["a"] or 8.38
    lattice = None
    try:
        from pymatgen.core import Lattice
        lattice = Lattice.cubic(a)
    except Exception:
        pass

    # Provisional plan (no lattice) to size the dopant count for technique choice.
    try:
        provisional = resolve_neat_fraction(
            target=target_sublattice, sites_per_fu=sites_per_fu, atoms_per_fu=7.0,
            base_z=8, max_atoms=request.max_atoms, min_image=request.min_image,
            lattice=None,
        )
    except ValueError as e:
        return DopedCifResult(
            status="unsupported", family=fam, regime=reg,
            notes=f"cannot represent dopant fraction {request.dopant_fraction} "
                  f"per formula unit on sublattice {dopant_site}: {e}",
            provenance=provenance)
    mode, rationale = choose_technique(
        application=request.application, n_dopant=provisional.n_dopant,
        n_host_sites=int(provisional.host_sites_total),
        disordered=request.inversion is None,
        ordering_suspected=request.ordering_suspected,
        mobile=bool(fam.mobile_species),
        distorted=bool(reg.distortion),
        technique_override=request.technique,
    )
    provenance["technique"] = {"mode": mode, "rationale": rationale}

    # --- Choose the energy source for ranking / ordering ---------------------
    # "surrogate" = fast pair-Coulomb pre-filter; "mlip" = real MACE-MP-0
    # single points (NOT DFT).  VCA has no discrete candidates to score.
    energy_fn = None
    if request.energy_source == "mlip" and mode != "vca":
        try:
            from .mlip import try_make_energy_fn
            energy_fn = try_make_energy_fn(
                "mlip", request.mlip_model or request.mace_model_path)
        except Exception as e:
            warnings.append(f"MLIP unavailable ({type(e).__name__}); using surrogate")
    if request.energy_source == "mlip" and energy_fn is None and mode != "vca":
        warnings.append("MLIP requested but not available; fell back to Coulomb surrogate")
    provenance["energy_source"] = getattr(
        energy_fn, "energy_source",
        "pair Coulomb surrogate (pre-filter)" if mode != "vca" else "n/a (VCA)")

    # For discrete representations the supercell must clear the nearest
    # self-image gate (the audit's rule); VCA is a single averaged cell, so the
    # gate does not apply.
    if mode == "vca":
        frac_plan = provisional
    else:
        try:
            from .spinel_build import spinel_base_cells
            frac_plan = resolve_neat_fraction(
                target=target_sublattice, sites_per_fu=sites_per_fu, atoms_per_fu=7.0,
                base_z=8, max_atoms=request.max_atoms, min_image=request.min_image,
                lattice=lattice,
                bases=spinel_base_cells(a, estimate_a_u(base_spec)["u"] or 0.255),
            )
        except ValueError as e:
            return DopedCifResult(
                status="unsupported", family=fam, regime=reg,
                notes=f"cannot represent dopant fraction {request.dopant_fraction}: {e}",
                provenance=provenance)
    provenance["fraction_plan"] = {
        "mode": mode,
        "x_target": frac_plan.x_target, "x_real": frac_plan.x_real,
        "error": frac_plan.error, "neat_fraction": frac_plan.neat_fraction,
        "n_dopant": frac_plan.n_dopant, "formula_units": frac_plan.formula_units,
        "atoms": frac_plan.atoms_total, "exact": frac_plan.exact,
        "base": frac_plan.base, "base_z": frac_plan.base_z,
        "min_image_A": frac_plan.min_image_A,
        "exact_requires_atoms": frac_plan.exact_requires,
    }

    # --- Build spec with substitution ---------------------------------------
    # Snap the requested fraction to the representable fraction the cell can
    # actually hold (this is the whole point of the neat-fraction step).
    effective_fraction = frac_plan.x_real * sites_per_fu
    spec, host_element = _apply_substitution(
        base_spec, request.dopant_element, effective_fraction,
        request.host_site_species, dopant_site,
    )
    provenance["sublattice_spec"] = spec
    provenance["host_species_replaced"] = host_element
    provenance["fraction_snapped"] = {
        "requested_per_fu": request.dopant_fraction,
        "effective_per_fu": round(effective_fraction, 6),
        "x_target": request.dopant_fraction / sites_per_fu,
        "x_real": frac_plan.x_real,
        "error": round(abs(effective_fraction - request.dopant_fraction), 6),
        "site": dopant_site,
    }

    try:
        reps = build_representations(
            spec, mode=mode, a=a, u=estimate_a_u(base_spec)["u"] or 0.255,
            sublattice=dopant_site, host_element=host_element,
            dopant_element=request.dopant_element, formula=request.host_formula,
            max_atoms=request.max_atoms,
            seed=request.seed, n_seeds=5, n_snapshots=8,
            energy_fn=energy_fn,
            symmetrize_tetragonal=request.symmetrize_tetragonal,
            supercell_matrix=frac_plan.supercell_matrix,
            base=frac_plan.base,
        )
    except ValueError as e:
        # Charge imbalance (aliovalent dopant) is a *decision*, not a failure:
        # surface the available compensation mechanisms.
        msg = str(e)
        if "charge" in msg.lower():
            options = _compensation_options(spec, base_spec, request.dopant_element)
            return DopedCifResult(
                status="needs_input", family=fam, regime=reg, fraction_plan=frac_plan,
                warnings=warnings,
                notes=(f"charge imbalance for {request.dopant_element} on the "
                       f"{dopant_site} site: {msg}"),
                checks=[Check("charge_balance", "fail", msg)],
                provenance={**provenance, "compensation_options": options},
            )
        return DopedCifResult(status="failed", family=fam, regime=reg,
                              fraction_plan=frac_plan,
                              notes=f"build failed: {e}", provenance=provenance)
    except Exception as e:
        return DopedCifResult(status="failed", family=fam, regime=reg,
                              fraction_plan=frac_plan,
                              notes=f"build failed: {type(e).__name__}: {e}",
                              provenance=provenance)

    reps = rank_representations(reps)

    # Surface any integer-rounding of the requested composition (e.g. Mn 80/20
    # in an 8 f.u. cell): reported as a check, never silent.  Errors above
    # 0.005/fu fail; smaller ones pass with the rounding recorded.
    _round_warns = (reps[0].labels or {}).get("rounding_warnings", []) if reps else []
    _round_status, _round_err = _rounding_severity(
        (reps[0].labels or {}).get("rounding", {}) if reps else {})
    checks: List[Check] = []
    c_status, c_detail, c_notes = _assess_charge(spec)
    checks.append(Check("charge_balance", c_status, c_detail))
    for n in c_notes:
        warnings.append(n) if n not in warnings else None
    if c_status == "needs_input":
        return DopedCifResult(
            status="needs_input", family=fam, regime=reg, fraction_plan=frac_plan,
            warnings=warnings,
            notes=f"charge balance: {c_detail}",
            checks=checks,
            provenance={**provenance,
                        "compensation_options": _compensation_options(spec, base_spec, request.dopant_element)},
        )

    best = reps[0]
    # Explicit oxidation states + magmoms are kept on a separate 'output'
    # structure (so the chemistry checks below still see plain elements).
    output_struct = best.structure
    if best.structure is not None and all(s.is_ordered for s in best.structure):
        try:
            output_struct = _assign_oxidation_states(best.structure, spec)
        except Exception:
            output_struct = best.structure
    cif = _cif_with_tag(output_struct, best.mode, best.seed, spec=spec)
    checks.append(_roundtrip_ok(cif, best.structure))
    for _rw in _round_warns:
        checks.append(Check("composition_rounding", _round_status, _rw))
        warnings.append("composition rounded to fit integer cell: " + _rw)
    if best.mode == "vca":
        checks.append(Check("all_occupancies_one", "not_run",
                            "VCA ensemble average has fractional occupancy by design"))
    else:
        checks.append(Check("all_occupancies_one",
                            "pass" if all(s.is_ordered for s in best.structure) else "fail",
                            "ordered modes must have integer occupancy"))
    if frac_plan.exact:
        checks.append(Check("fraction_representable", "pass",
                            f"exact: {frac_plan.neat_fraction}"))
    else:
        status = "pass" if frac_plan.error <= 0.02 else "fail"
        checks.append(Check("fraction_representable", status,
                            f"nearest {frac_plan.neat_fraction}: x_real={frac_plan.x_real:.4f}, "
                            f"error={frac_plan.error:.4f}"
                            + (f"; exact needs {frac_plan.exact_requires} atoms"
                               if frac_plan.exact_requires else "")))
        if frac_plan.error > 0.02:
            warnings.append(
                f"requested fraction not representable within budget; "
                f"nearest {frac_plan.neat_fraction} (error {frac_plan.error:.4f})"
            )
    if mode == "vca":
        checks.append(Check("min_image", "not_run",
                            "VCA is a single averaged cell; no supercell self-image applies"))
    elif frac_plan.min_image_A is None:
        checks.append(Check("min_image", "not_run", "no lattice supplied to the resolver"))
    elif frac_plan.min_image_A >= request.min_image:
        checks.append(Check("min_image", "pass", f"{frac_plan.min_image_A:.3f} A"))
    else:
        msg = (f"best {frac_plan.min_image_A:.3f} A < target {request.min_image} A; "
               f"no eligible cell within {request.max_atoms} atoms meets it")
        checks.append(Check("min_image", "not_run", msg))
        warnings.append(msg)

    # spinel independent verification (composition + sublattice re-measure)
    try:
        verify_spinel(best.structure, spec, atol=0.05)
        checks.append(Check("sublattice_verify", "pass"))
    except Exception as e:
        checks.append(Check("sublattice_verify", "fail", str(e)))

    # --- Optional MACE relaxation (Phase 3 wiring) ---------------------------
    # Guarded: if no checkpoint/CPU-only MACE is available this reports
    # not_run rather than failing the request.
    relax_info = None
    if request.relax:
        try:
            from .relax import relax_with_mace
            rr = relax_with_mace(best.structure, request.mace_model_path,
                                 fmax=request.relax_fmax,
                                 max_steps=request.relax_max_steps)
            relax_info = {
                "converged": rr.converged, "energy": rr.energy,
                "max_force": rr.max_force, "final_space_group": rr.final_space_group,
                "skipped": rr.relaxation_skipped, "notes": rr.notes,
            }
            if rr.relaxation_skipped:
                checks.append(Check("relaxation", "not_run",
                                    "disordered/VCA geometry: ASE relaxation skipped"))
            elif rr.converged:
                best.structure = rr.structure
                if all(s.is_ordered for s in best.structure):
                    try:
                        output_struct = _assign_oxidation_states(best.structure, spec)
                    except Exception:
                        output_struct = best.structure
                    cif = _cif_with_tag(output_struct, best.mode, best.seed, spec=spec)
                else:
                    cif = _cif_with_tag(best.structure, best.mode, best.seed, spec=spec)
                checks.append(Check("relaxation", "pass",
                                    f"E={rr.energy:.4f} eV, max|F|={rr.max_force:.3f} eV/A"))
            else:
                checks.append(Check("relaxation", "fail",
                                    f"not converged, max|F|={rr.max_force:.3f} eV/A"))
                warnings.append("MACE relaxation did not converge; using unrelaxed geometry")
        except Exception as e:
            checks.append(Check("relaxation", "not_run",
                                f"relaxation unavailable: {type(e).__name__}: {e}"))
    else:
        checks.append(Check("relaxation", "not_run", "not requested"))

    cifs = []
    for r in reps[:max(1, 5 if best.mode in ("sqs", "enumerate", "ensemble") else 1)]:
        cifs.append(_cif_with_tag(r.structure, r.mode, r.seed, spec=spec))

    written: List[str] = []
    if request.write_dir:
        os.makedirs(request.write_dir, exist_ok=True)
        for k, r in enumerate(reps):
            path = os.path.join(
                request.write_dir,
                f"{request.host_formula}_{request.dopant_element}{request.dopant_fraction:g}"
                f"_{r.mode}_seed{r.seed}.cif",
            )
            with open(path, "w", encoding="utf-8") as fh:
                fh.write(_cif_with_tag(r.structure, r.mode, r.seed, spec=spec))
            written.append(path)

    failed = [c for c in checks if c.status == "fail" and c.name != "relaxation"]
    status = "ok" if not failed else "failed"
    notes = (
        f"{fam.family} host; regime={reg.regime}"
        + (f" (λ={reg.inversion})" if reg.inversion is not None else "")
        + f"; technique={mode}; x_target={frac_plan.x_target:.4f} "
        f"x_real={frac_plan.x_real:.4f} (neat {frac_plan.neat_fraction})"
    )
    if reg.distortion:
        notes += f"; WARNING distortion: {reg.distortion}"

    # Representation-aware validation vector (three error axes; which are
    # meaningful depends on VCA-average vs explicit-snapshot).
    try:
        from .validation import error_vector
        vec = error_vector(best.structure, spec=spec, dopant=request.dopant_element,
                           relaxation=relax_info, representation=best.mode,
                           min_image_A=frac_plan.min_image_A)
        vec["charge_sum"] = round(_charge_of_spec(spec), 4)
        provenance["validation_vector"] = vec
        provenance["structure"] = best.structure
    except Exception as e:
        warnings.append(f"validation vector unavailable: {type(e).__name__}: {e}")

    return DopedCifResult(
        status=status, best_cif=cif, cifs=cifs, representation=mode,
        family=fam, regime=reg, fraction_plan=frac_plan, checks=checks,
        warnings=warnings, relaxation=relax_info,
        provenance=provenance, written_files=written,
        notes=notes,
    )


def _rounding_severity(rounding: Dict[str, Dict[str, Dict[str, float]]]):
    """Severity of integer-cell rounding from the structured rounding report.

    Returns (status, max_abs_error): 'pass' when every species is within
    0.005/fu of request, else 'fail'.  Empty report -> ('pass', 0.0).
    """
    errs = [abs(r.get("error", 0.0))
            for site in rounding.values() if isinstance(site, dict)
            for r in site.values() if isinstance(r, dict)]
    m = max(errs) if errs else 0.0
    return ("pass" if m <= 0.005 else "fail", m)


def _compensation_options(spec, base_spec, dopant: str) -> List[str]:
    """Available charge-compensation mechanisms for an aliovalent substitution."""
    host_elements = sorted({el for site in base_spec.values()
                            for el in site if el != "Vac"})
    dq = _charge_of_spec(spec) - 8.0
    try:
        from .general_doping import compensation_options
        return compensation_options(None, dq, host_elements)
    except Exception:
        return []


def _preferred_site(dopant: str, reg: RegimeResult) -> str:
    from .site_preference import SPINEL_SITE_TABLE
    entry = SPINEL_SITE_TABLE.get(dopant, {})
    return entry.get("site", "B")


def _preferred_isovalent_site(
    base_spec: Dict[str, Dict[str, float]], dopant: str, preferred: str
) -> str:
    """Prefer a site that already hosts a same-charge cation as the dopant.

    Falls back to the site-preference answer.  This makes default substitutions
    charge-neutral (Ni2+ into ZnFe2O4 replaces Zn2+ on A, not Fe3+ on B).
    """
    q = _nominal_charge(dopant)
    order = [preferred] + [s for s in ("A", "B") if s != preferred]
    for site in order:
        for el in base_spec.get(site, {}):
            if abs(_nominal_charge(el) - q) < 1e-9:
                return site
    return preferred


def _find_db_parent(host_formula: str, provenance: Dict[str, Any],
                    warnings: List[str]):
    """Look up an undoped parent structure in the databases (no generation).

    Returns the Structure or None.  Records which source was used.
    """
    try:
        from .search_external import search_external_databases
        from .search_internal import search_internal_database
        from .config import get_mp_api_key
    except Exception as e:
        warnings.append(f"database lookup unavailable: {type(e).__name__}")
        return None
    ask = lambda prompt, options=None: ""  # non-interactive: never pick blindly
    try:
        match, _ = search_external_databases(
            host_formula, is_doped=False, doping_spec=None,
            mp_api_key=get_mp_api_key(), requested_space_group=None, ask_user=ask)
        if match is not None and getattr(match, "structure", None) is not None:
            provenance["parent_source"] = f"{match.source}:{match.record_id}"
            return match.structure
    except Exception as e:
        warnings.append(f"external DB lookup failed: {type(e).__name__}: {e}")
    try:
        match, _ = search_internal_database(
            host_formula, is_doped=False, doping_spec=None,
            requested_space_group=None, ask_user=ask)
        if match is not None and getattr(match, "structure", None) is not None:
            provenance["parent_source"] = f"internal:{match.record_id}"
            return match.structure
    except Exception as e:
        warnings.append(f"internal DB lookup failed: {type(e).__name__}: {e}")
    return None


def _generate_general(request, parent, fam, provenance, warnings) -> DopedCifResult:
    """Non-spinel path via the universal engine (general_doping)."""
    from .general_doping import plan as gd_plan, build as gd_build
    try:
        pl = gd_plan(
            parent,
            [{"element": request.dopant_element, "amount": request.dopant_fraction,
              "target": request.host_site_species}],
            max_atoms=request.max_atoms, min_image=request.min_image,
        )
    except Exception as e:
        return DopedCifResult(status="failed", family=fam,
                              notes=f"general_doping plan failed: {e}",
                              provenance=provenance)
    if pl.get("status") != "ok":
        return DopedCifResult(status=pl.get("status", "failed"), family=fam,
                              notes=str(pl.get("questions") or pl.get("reason")),
                              provenance=provenance)
    struct, rep = gd_build(parent, pl, seed=request.seed)
    cif = _cif_with_tag(struct, "ordered", request.seed)
    return DopedCifResult(
        status="ok", best_cif=cif, cifs=[cif], representation="ordered",
        family=fam, checks=[_roundtrip_ok(cif, struct)],
        provenance={**provenance, "general_plan": {
            "k": pl.get("k"), "min_image_A": pl.get("min_image_A"),
            "natoms": pl.get("natoms")}},
        notes=f"{fam.family} host via universal engine; {rep['natoms']} atoms",
    )


# ─────────────────────────────────────────────────────────────────────────────
# Formula-driven entry point (already-doped / co-doped formulas)
# ─────────────────────────────────────────────────────────────────────────────

def _magnetite_spec(formula: str) -> Optional[Dict[str, Dict[str, float]]]:
    """Nominal A/B spec for a mixed-valence M3O4 spinel (e.g. Fe3O4).

    Magnetite is an inverse spinel (A = Fe3+, B = Fe2+ Fe3+); for a nominal
    model we put one M per formula unit on A and two on B, and let
    `_assess_charge` report the Fe2+/Fe3+ mixed valence.
    """
    try:
        comp = Composition(formula)
    except Exception:
        return None
    if abs(comp.get("O", 0.0) - 4.0) > 1e-6:
        return None
    cats = {str(e): comp.get(str(e), 0.0) for e in comp.elements
            if str(e) != "O" and comp.get(str(e), 0.0) > 0}
    if len(cats) != 1:
        return None
    m, amt = next(iter(cats.items()))
    if abs(amt - 3.0) > 0.05:
        return None
    return {"A": {m: 1.0}, "B": {m: 2.0}}


def _snap_spec_to_budget(spec: Dict[str, Dict[str, float]],
                         max_atoms: int, tol: float = 0.002):
    """Snap every sublattice amount to the nearest integer count in a budgeted
    cell.  Searches even f.u. counts (primitive-tilable) then multiples of 8
    (conventional), smallest first.  ALWAYS returns the best cell found as
    (snapped_spec, total_fu, base, base_z, tiling, max_error, within_tol);
    rounding is the caller's normal path, not a refusal — the error is
    reported, never silent.  Returns None only when no cell fits at all
    (e.g. every candidate rounds some species to zero).
    """
    best = None  # (max_err, total_fu, snapped, base, base_z)
    max_fu = max(2, max_atoms // 7)
    for total_fu in list(range(2, max_fu + 1, 2)) + list(range(8, max_fu + 1, 8)):
        snapped, errs = {"A": {}, "B": {}}, []
        for site in ("A", "B"):
            for el, amt in spec.get(site, {}).items():
                if el == "Vac":
                    snapped[site][el] = amt
                    continue
                k = int(round(amt * total_fu))
                if k <= 0:
                    break
                snapped[site][el] = k / total_fu
                errs.append(abs(k / total_fu - amt))
            else:
                continue
            break
        else:
            max_err = max(errs) if errs else 0.0
            if best is None or (max_err, total_fu) < (best[0], best[1]):
                base = "conventional" if total_fu % 8 == 0 else "primitive"
                base_z = 8 if total_fu % 8 == 0 else 2
                best = (max_err, total_fu, snapped, base, base_z)
                if max_err == 0.0:
                    break
    if best is None:
        return None
    max_err, total_fu, snapped, base, base_z = best
    tiling = max(1, total_fu // base_z)
    return snapped, total_fu, base, base_z, tiling, max_err, (max_err <= tol)


def _formula_dopants(spec: Dict[str, Dict[str, float]]) -> List[Dict[str, Any]]:
    """Species that are *not* the host end-member on their sublattice.

    For a spinel the host is Fe/Al/Cr on B and the majority cation on A; any
    other cation (Zn, Ni, Co, Cu, Mg, Mn, Ti, Li …) is a dopant.
    """
    dopants = []
    for site in ("A", "B"):
        pool = {el: v for el, v in spec.get(site, {}).items()
                if el not in ("Vac", "O") and v > 0}
        if not pool:
            continue
        majority = max(pool, key=pool.get)
        for el, amt in pool.items():
            if el in ("Fe", "Al", "Cr") or el == majority:
                continue
            dopants.append({"element": el, "site": site, "amount": amt})
    return dopants


def generate_cif_from_formula(
    formula: str,
    application: Optional[str] = None,
    technique: Optional[str] = None,
    relax: bool = False,
    energy_source: str = "surrogate",
    mlip_model: Optional[str] = None,
    seed: int = 0,
    max_atoms: int = 560,
    min_image: float = 10.0,
    mace_model_path: Optional[str] = None,
    relax_fmax: float = 0.05,
    relax_max_steps: int = 200,
    write_dir: Optional[str] = None,
    reference: Optional[Structure] = None,
) -> DopedCifResult:
    """Generate a CIF directly from a (possibly already-doped) formula.

    This is the entry point for co-doped / magnetite-type formulas such as
    ``Zn0.05Ni0.05Fe2.90O4``, where there is no single "host + one dopant"
    decomposition: the formula is interpreted into an explicit A/B sublattice
    spec, and the cell is chosen to make every species count integral.

    Optionally relaxes with MACE (`relax=True`), which is a machine-learning
    potential — NOT DFT.
    """
    from .intent import interpret
    from .representation import build_representations, choose_technique, rank_representations

    provenance: Dict[str, Any] = {"request": {"formula": formula, "relax": relax}}
    warnings: List[str] = []

    fam = classify_family(formula=formula)
    with_parent = fam.family
    if with_parent != "spinel":
        return DopedCifResult(
            status="needs_input", family=fam,
            notes=(f"formula-driven generation currently supports the spinel "
                   f"family; '{formula}' was classified as '{with_parent}'. "
                   f"Pass an explicit parent Structure for other families."),
            provenance=provenance)

    interp = interpret(formula)
    spec = interp.get("spec")
    if not spec or not any(spec.get(s, {}) for s in ("A", "B")):
        # Fallback for mixed-valence "M3O4" spinels (magnetite type), which the
        # spinel intent does not decompose because the cation has two valences.
        spec_fb = _magnetite_spec(formula)
        if spec_fb is None:
            return DopedCifResult(
                status="unsupported", family=fam,
                notes=(f"could not resolve an A/B sublattice spec for '{formula}' "
                       f"(interpret status: {interp.get('status')}). Mixed-valence "
                       f"end-members such as pure Fe3O4 are not decomposed automatically."),
                provenance=provenance)
        spec = spec_fb
        warnings.append(
            f"'{formula}' is a mixed-valence M3O4 spinel; a nominal "
            f"A=M/B=M2 model was used and Fe2+/Fe3+ is reported as mixed valence.")
    # Refuse when chemistry dropped an element: an unassigned cation
    # (e.g. Ca, refused with a strain flag) must surface as
    # needs_input/unsupported, not as a quietly Ca-free structure.
    # Weak-preference questions (all elements assigned) still build.
    # (Checked after the magnetite fallback so Fe3O4 is not misread as dropped.)
    try:
        from pymatgen.core import Composition as _Comp
        _cations = {str(e) for e in _Comp(formula).elements} - {"O", "Vac"}
        _placed = {el for s in ("A", "B") for el in (spec or {}).get(s, {})}
        _dropped = sorted(_cations - _placed)
    except Exception:
        _dropped = []
    if _dropped:
        return DopedCifResult(
            status=interp.get("status") if interp.get("status") in ("needs_input", "unsupported") else "needs_input",
            family=fam, warnings=warnings,
            notes="; ".join(interp.get("questions", []) or [interp.get("reason", "")]),
            checks=[Check("chemistry_gate", "fail",
                          f"elements cannot be placed in spinel: {_dropped}")],
            provenance={**provenance,
                        "sublattice_spec": spec,
                        "interpret_status": interp.get("status"),
                        "dropped_elements": _dropped,
                        "interpret_flags": interp.get("flags", [])})
    provenance["sublattice_spec"] = spec

    dopants = _formula_dopants(spec)
    provenance["dopants"] = dopants

    a = estimate_a_u(spec)["a"] or 8.4
    u = estimate_a_u(spec)["u"] or 0.255

    # Cell sizing: choose the smallest cell that makes *all* species counts
    # integral, preferring the conventional cell unless a smaller primitive
    # cell also gives an exact count (fewer atoms for dilute doping).
    from math import gcd
    from fractions import Fraction
    from .fractions import _near_cubic_scaling

    all_amts: List[float] = []
    for site in ("A", "B"):
        all_amts.extend(v for el, v in spec.get(site, {}).items() if el != "Vac")
    N = 1
    for amt in all_amts:
        d = Fraction(str(round(amt, 6))).limit_denominator(512).denominator
        N = N * d // gcd(N, d)
    # Smallest multiple of N that tiles a whole number of base cells,
    # preferring conventional (multiple of 8 f.u.) then primitive (multiple
    # of 2 f.u.).  E.g. N=5 -> 10 f.u. primitive (70 atoms, exact), never 8.
    base, base_z, total_fu, tiling = "conventional", 8, None, None
    m = 1
    while total_fu is None:
        cand = m * N
        if cand * 7 > max_atoms:
            break  # exact cell infeasible -> fall through to snapping below
        if cand % 8 == 0:
            base, base_z, total_fu, tiling = "conventional", 8, cand, cand // 8
        elif cand % 2 == 0:
            base, base_z, total_fu, tiling = "primitive", 2, cand, cand // 2
        m += 1
    snapped = None
    if total_fu is None:
        # No exact cell in budget (e.g. full-precision raw columns): snap every
        # amount to the nearest integer count in a budgeted cell and REPORT the
        # error per species — never silently round.  Snapping always succeeds
        # when any budgeted cell fits; large errors are flagged, not hidden.
        snapped = _snap_spec_to_budget(spec, max_atoms)
        if snapped is None:
            return DopedCifResult(
                status="unsupported", family=fam, warnings=warnings,
                notes=(f"no representable cell for '{formula}' within "
                       f"{max_atoms} atoms (every candidate rounds a species "
                       f"to zero)"),
                provenance=provenance)
        spec, total_fu, base, base_z, tiling, snap_err, within_tol = snapped
        if within_tol:
            warnings.append(
                f"composition snapped to nearest representable cell "
                f"({total_fu} f.u. {base}); max per-species error {snap_err:.5f}/fu; "
                f"see provenance['snapping']")
        else:
            warnings.append(
                f"LARGE rounding error {snap_err:.5f}/fu exceeds tolerance "
                f"(best cell: {total_fu} f.u. {base}); composition is approximate; "
                f"see provenance['snapping']")
        provenance["snapping"] = {
            "total_fu": total_fu, "base": base,
            "max_error_per_fu": round(snap_err, 6),
            "within_tolerance": within_tol,
            "snapped_spec": spec,
        }
    sc = _near_cubic_scaling(max(1, tiling))
    matrix = [[sc[0], 0, 0], [0, sc[1], 0], [0, 0, sc[2]]]
    frac_plan = FractionPlan(
        x_target=float(dopants[0]["amount"]) if len(dopants) == 1 else 0.0,
        x_real=0.0, error=0.0, n_dopant=0, host_sites_total=0,
        formula_units=total_fu, sites_per_fu=0.0, atoms_total=total_fu * 7,
        exact=True, neat_fraction="", base=base, base_z=base_z,
        supercell_matrix=matrix, supercell_scaling=sc, min_image_A=None,
    )
    n_dop_cell = 1

    # Jahn-Teller hosts take the distorted path even when the user did not ask:
    # a cubic cell for a Cu2+-bearing spinel is a known geometry mismatch.
    from .regime import detect_jahn_teller
    _jt = detect_jahn_teller(formula)
    if _jt:
        warnings.append(f"Jahn-Teller active ({_jt}); using tetragonal starting geometry")
    provenance["jahn_teller"] = _jt

    mode, rationale = choose_technique(
        application=application, n_dopant=n_dop_cell, n_host_sites=8,
        distorted=bool(_jt),
        technique_override=technique,
    )
    provenance["technique"] = {"mode": mode, "rationale": rationale}

    energy_fn = None
    if energy_source == "mlip" and mode != "vca":
        try:
            from .mlip import try_make_energy_fn
            energy_fn = try_make_energy_fn("mlip", mlip_model or mace_model_path)
        except Exception as e:
            warnings.append(f"MLIP unavailable ({type(e).__name__}); using surrogate")
    provenance["energy_source"] = getattr(
        energy_fn, "energy_source",
        "pair Coulomb surrogate (pre-filter)" if mode != "vca" else "n/a (VCA)")

    try:
        reps = build_representations(
            spec, mode=mode, a=a, u=u, formula=formula,
            max_atoms=max_atoms, seed=seed, energy_fn=energy_fn,
            supercell_matrix=matrix, base=base,
        )
    except ValueError as e:
        if "charge" in str(e).lower():
            return DopedCifResult(
                status="needs_input", family=fam, warnings=warnings,
                notes=f"charge imbalance for '{formula}': {e}",
                checks=[Check("charge_balance", "fail", str(e))],
                provenance=provenance)
        return DopedCifResult(status="failed", family=fam, warnings=warnings,
                              notes=f"build failed: {e}", provenance=provenance)
    except Exception as e:
        return DopedCifResult(status="failed", family=fam, warnings=warnings,
                              notes=f"build failed: {type(e).__name__}: {e}",
                              provenance=provenance)

    reps = rank_representations(reps)
    best = reps[0]

    # A fully-ordered cell gets explicit per-site oxidation states + magnetic
    # moments.  Keep the plain-element structure for the chemistry checks (they
    # expect plain elements), but carry the oxidised/magerogr version for the
    # emitted CIF and for user inspection.
    output_struct = best.structure
    if best.structure is not None and all(s.is_ordered for s in best.structure):
        try:
            output_struct = _assign_oxidation_states(best.structure, spec)
        except Exception:
            output_struct = best.structure

    checks: List[Check] = []
    c_status, c_detail, c_notes = _assess_charge(spec)
    checks.append(Check("charge_balance", c_status, c_detail))
    for n in c_notes:
        if n not in warnings:
            warnings.append(n)
    if c_status == "needs_input":
        return DopedCifResult(
            status="needs_input", family=fam, warnings=warnings,
            notes=f"charge balance: {c_detail}",
            checks=checks,
            provenance={**provenance,
                        "compensation_options": _compensation_options(spec, spec, "Fe")},
        )
    cif = _cif_with_tag(output_struct, best.mode, best.seed, spec=spec)
    checks.append(_roundtrip_ok(cif, best.structure))
    if best.mode == "vca":
        checks.append(Check("all_occupancies_one", "not_run",
                            "VCA ensemble average has fractional occupancy by design"))
    else:
        checks.append(Check("all_occupancies_one",
                            "pass" if all(s.is_ordered for s in best.structure) else "fail",
                            "ordered modes must have integer occupancy"))
    try:
        verify_spinel(best.structure, spec, atol=0.05)
        checks.append(Check("sublattice_verify", "pass"))
    except Exception as e:
        checks.append(Check("sublattice_verify", "fail", str(e)))
    for _rw in (best.labels or {}).get("rounding_warnings", []):
        _rs, _ = _rounding_severity((best.labels or {}).get("rounding", {}))
        checks.append(Check("composition_rounding", _rs, _rw))
        warnings.append("composition rounded to fit integer cell: " + _rw)

    relax_info = None
    if relax:
        try:
            from .relax import relax_with_mace
            rr = relax_with_mace(best.structure,
                                 mace_model_path or mlip_model or "small",
                                 fmax=relax_fmax, max_steps=relax_max_steps)
            relax_info = {"converged": rr.converged, "energy": rr.energy,
                          "max_force": rr.max_force,
                          "final_space_group": rr.final_space_group,
                          "skipped": rr.relaxation_skipped, "notes": rr.notes}
            if rr.relaxation_skipped:
                checks.append(Check("relaxation", "not_run",
                                    "disordered/VCA geometry: ASE relaxation skipped"))
            elif rr.converged:
                best.structure = rr.structure
                if all(s.is_ordered for s in best.structure):
                    try:
                        output_struct = _assign_oxidation_states(best.structure, spec)
                    except Exception:
                        output_struct = best.structure
                    cif = _cif_with_tag(output_struct, best.mode, best.seed, spec=spec)
                else:
                    cif = _cif_with_tag(best.structure, best.mode, best.seed, spec=spec)
                checks.append(Check("relaxation", "pass",
                                    f"E={rr.energy:.4f} eV, max|F|={rr.max_force:.3f} eV/A"))
            else:
                checks.append(Check("relaxation", "fail",
                                    f"not converged, max|F|={rr.max_force:.3f} eV/A"))
                warnings.append("MACE relaxation did not converge; using unrelaxed geometry")
        except Exception as e:
            checks.append(Check("relaxation", "not_run",
                                f"relaxation unavailable: {type(e).__name__}: {e}"))

    cifs = [_cif_with_tag(r.structure, r.mode, r.seed, spec=spec) for r in reps[:5]]
    written: List[str] = []
    if write_dir:
        os.makedirs(write_dir, exist_ok=True)
        safe = formula.replace("/", "_")
        for r in reps:
            path = os.path.join(write_dir, f"{safe}_{r.mode}_seed{r.seed}.cif")
            with open(path, "w", encoding="utf-8") as fh:
                fh.write(_cif_with_tag(r.structure, r.mode, r.seed, spec=spec))
            written.append(path)

    failed = [c for c in checks if c.status == "fail" and c.name != "relaxation"]
    # Validation vector: report the three error axes separately (never one
    # silent number).
    try:
        from .validation import error_vector
        dep = dopants[0]["element"] if dopants else "Fe"
        vec = error_vector(best.structure, reference=reference, spec=spec,
                           dopant=dep, relaxation=relax_info,
                           representation=best.mode,
                           min_image_A=(frac_plan.min_image_A if frac_plan else None))
        vec["charge_sum"] = round(_charge_of_spec(spec), 4)
        provenance["validation_vector"] = vec
        provenance["structure"] = output_struct
    except Exception as e:
        warnings.append(f"validation vector unavailable: {type(e).__name__}: {e}")
    return DopedCifResult(
        status="ok" if not failed else "failed",
        best_cif=cif, cifs=cifs, representation=mode, family=fam,
        fraction_plan=frac_plan, checks=checks, warnings=warnings,
        relaxation=relax_info, provenance=provenance, written_files=written,
        notes=(f"{fam.family}; formula-driven; technique={mode}; "
               f"{len(dopants)} dopant site(s); {best.structure.num_sites} atoms"),
    )
