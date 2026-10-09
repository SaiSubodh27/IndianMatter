"""
regime.py — normal / inverse / distorted / mixed decision + inversion.

Answers: *which cation sits on which sublattice, is the spinel normal or
inverse, is it distorted (Jahn-Teller), and what is the inversion parameter λ?*

The inversion parameter λ is the fraction of the divalent cation M on the
octahedral (B) site:

    A: M(1-λ) Fe(λ)          (1 site per formula unit)
    B: M(λ)   Fe(2-λ)        (2 sites per formula unit)

    λ = 0  → normal   (M on A)          e.g. ZnFe2O4
    λ = 1  → inverse  (M on B)          e.g. NiFe2O4
    0<λ<1  → mixed / partially inverse  e.g. CoFe2O4, MgFe2O4

`decide_regime` never guesses a single λ when the literature only gives a
bracket: it returns **all** scenarios (your scenario-bracket principle).
"""

from __future__ import annotations

from dataclasses import dataclass, field
from typing import Any, Dict, List, Optional

from pymatgen.core import Composition

from .site_preference import SPINEL_SITE_TABLE, SPINEL_SCENARIO_TABLE

# Cations that cannot be cubic — cooperative Jahn-Teller distortion.
# Cu2+ (d9) and high-spin Mn3+ (d4) are the classic ones.
JAHN_TELLER_CATIONS: Dict[str, str] = {
    "Cu": "Cu²⁺ (d⁹): tetragonal I4₁/amd, c/a ≈ 1.06",
    "Mn": "Mn³⁺ (d⁴ high-spin): tetragonal distortion possible",
    "Cr": "Cr²⁺ (d⁴ high-spin): tetragonal distortion possible",
}

# Divalent-vs-trivalent role of common spinel cations.
_DIVALENT = {"Zn", "Ni", "Co", "Cu", "Mg", "Mn", "Fe", "Ca", "Cd"}
_TRIVALENT = {"Fe", "Al", "Cr", "Ga", "Mn", "Co", "In", "V", "Sc"}


@dataclass
class RegimeScenario:
    label: str
    inversion: Dict[str, float]          # per divalent cation: fraction on B
    description: str = ""
    ref: str = ""
    sublat: Optional[Dict[str, Dict[str, float]]] = None


@dataclass
class RegimeResult:
    regime: str                          # "normal" | "inverse" | "distorted" | "mixed" | "needs_input"
    inversion: Optional[float] = None    # representative λ for the primary divalent cation
    scenarios: List[RegimeScenario] = field(default_factory=list)
    distortion: Optional[str] = None     # e.g. "tetragonal I4₁/amd"
    lattice_system: str = "cubic"        # "cubic" | "tetragonal" | ...
    factors: Dict[str, Any] = field(default_factory=dict)   # group-dependent factors used
    flags: List[str] = field(default_factory=list)
    method: str = ""
    notes: str = ""


def _divalent_cations(formula: str) -> List[str]:
    """Return the divalent host cation(s).

    Fe is only treated as divalent if it is the *only* candidate (e.g.
    magnetite Fe3O4); in ordinary ferrites Fe is the trivalent B-site ion and
    the divalent host is the M in MFe2O4.
    """
    comp = Composition(formula)
    found = []
    for el in comp.elements:
        sym = el.symbol
        if sym in _DIVALENT and sym not in found:
            found.append(sym)
    non_fe = [s for s in found if s != "Fe"]
    if non_fe:
        return non_fe
    return found


def detect_jahn_teller(formula: str, oxidation_states: Optional[Dict[str, int]] = None) -> Optional[str]:
    """Return a distortion description if a Jahn-Teller-active cation is present."""
    comp = Composition(formula)
    present = {el.symbol for el in comp.elements}
    ox = oxidation_states or {}
    for sym in present:
        if sym not in JAHN_TELLER_CATIONS:
            continue
        # Cu in oxides is essentially always Cu2+; Mn needs an explicit +3 to trigger
        state = ox.get(sym)
        if sym == "Cu":
            return JAHN_TELLER_CATIONS[sym]
        if sym == "Mn" and state == 3:
            return JAHN_TELLER_CATIONS[sym]
    return None


def inversion_to_sublattices(
    host_formula: str,
    inversion: float = 0.0,
    divalent: Optional[str] = None,
    trivalent: str = "Fe",
    trivalent_total: float = 2.0,
) -> Dict[str, Dict[str, float]]:
    """Convert an inversion parameter λ to an explicit A/B sublattice spec.

    Example: NiFe2O4 with λ=1.0 -> A={'Fe':1.0}, B={'Ni':1.0,'Fe':1.0}
             ZnFe2O4 with λ=0.0 -> A={'Zn':1.0}, B={'Fe':2.0}
    """
    if not (0.0 <= inversion <= 1.0):
        raise ValueError(f"inversion must be in [0,1], got {inversion}")

    if divalent is None:
        divs = _divalent_cations(host_formula)
        if len(divs) != 1:
            raise ValueError(
                f"host '{host_formula}' has divalent cations {divs}; "
                f"pass divalent= explicitly for a single-cation inversion model"
            )
        divalent = divs[0]

    A: Dict[str, float] = {}
    B: Dict[str, float] = {}
    lam = float(inversion)

    if lam < 1.0 - 1e-9:
        A[divalent] = round(1.0 - lam, 6)
    if lam > 1e-9:
        B[divalent] = round(lam, 6)
    if lam > 1e-9:
        A[trivalent] = round(lam, 6)
    if trivalent_total - lam > 1e-9:
        B[trivalent] = round(trivalent_total - lam, 6)
    return {"A": A, "B": B}


def _scenarios_for(divalent: str) -> List[RegimeScenario]:
    """Pull literature inversion scenarios for a divalent cation, if any."""
    entries = SPINEL_SCENARIO_TABLE.get(divalent)
    if not entries:
        return []
    out = []
    for e in entries:
        lam = e.get("inversion")
        if lam is None:
            # Entries sometimes give fraction_on_B / fraction_on_A instead
            if "fraction_on_B" in e:
                lam = e["fraction_on_B"]
            elif "fraction_on_A" in e:
                lam = 1.0 - e["fraction_on_A"]
            else:
                continue
        out.append(RegimeScenario(
            label=e.get("label", f"{divalent}_lam{lam}"),
            inversion={divalent: float(lam)},
            description=e.get("description", ""),
            ref=e.get("ref", ""),
        ))
    return out


def decide_regime(
    formula: str,
    decision: Any = None,
    synthesis: Optional[str] = None,
) -> RegimeResult:
    """Decide the site regime for a (spinel) composition.

    Parameters
    ----------
    formula : str
        Host/doped formula, e.g. "CoFe2O4" or "Zn0.5Ni0.5Fe2O4".
    decision : float | dict | None
        User/explicit inversion.  A scalar applies to the single divalent
        cation; a dict maps cation -> fraction on B.
    synthesis : str, optional
        "quenched" | "slow-cooled" | "annealed" | None — selects among
        literature scenarios when available.
    """
    divs = _divalent_cations(formula)
    if not divs:
        return RegimeResult(
            regime="needs_input", method="no divalent cation found in formula",
            flags=["no divalent cation"],
        )

    # Normalize an explicit decision into a per-cation inversion dict.
    explicit: Optional[Dict[str, float]] = None
    if isinstance(decision, dict):
        explicit = {k: float(v) for k, v in decision.items()}
    elif isinstance(decision, (int, float)):
        explicit = {divs[0]: float(decision)}

    jt = detect_jahn_teller(formula)
    scenarios: List[RegimeScenario] = []
    factors: Dict[str, Any] = {}

    if explicit is not None:
        regime = _label_from_inversion(explicit)
        rep = explicit[divs[0]] if divs[0] in explicit else next(iter(explicit.values()))
        method = "explicit user decision"
    else:
        # Gather literature preference for each divalent cation.
        strengths = {}
        for d in divs:
            entry = SPINEL_SITE_TABLE.get(d, {})
            strengths[d] = (entry.get("site"), entry.get("strength"), entry.get("reason", ""))
        factors["site_table"] = strengths

        weak = [d for d, (_, s, _) in strengths.items() if s != "strong"]
        strong = {d: site for d, (site, s, _) in strengths.items() if s == "strong"}

        if not weak and strong and all(v == "A" for v in strong.values()):
            regime, rep, method = "normal", 0.0, "strong A-site preference (site table)"
        elif not weak and strong and all(v == "B" for v in strong.values()):
            regime, rep, method = "inverse", 1.0, "strong B-site preference (site table)"
        else:
            # Weak/partial: carry the full scenario bracket, don't pick a midpoint.
            regime = "mixed"
            rep = None
            method = "weak preference -> scenario bracket (no single answer)"
            for d in weak:
                scenarios.extend(_scenarios_for(d))
            if not scenarios and weak:
                # No literature scenarios: state the open bracket explicitly.
                scenarios.append(RegimeScenario(
                    label=f"{weak[0]}_bracket",
                    inversion={weak[0]: 0.0},
                    description="no literature scenario; full 0–1 inversion bracket is open",
                ))
                scenarios.append(RegimeScenario(
                    label=f"{weak[0]}_bracket_inverse",
                    inversion={weak[0]: 1.0},
                    description="no literature scenario; full 0–1 inversion bracket is open",
                ))
            # If the user gave synthesis, try to pick matching literature labels.
            if synthesis:
                factors["synthesis_filter"] = synthesis

    result = RegimeResult(
        regime=regime, inversion=rep, scenarios=scenarios,
        factors=factors, method=method,
    )

    if jt:
        result.distortion = jt
        result.lattice_system = "tetragonal"
        result.regime = "distorted" if regime in ("normal", "inverse", "mixed") else regime
        result.flags.append(
            f"Jahn-Teller active: {jt}. Cubic Fd-3m output for this composition is a "
            f"KNOWN GEOMETRY MISMATCH and must be labelled as such."
        )
    return result


def _label_from_inversion(inv: Dict[str, float]) -> str:
    vals = list(inv.values())
    if all(abs(v) < 1e-9 for v in vals):
        return "normal"
    if all(abs(v - 1.0) < 1e-9 for v in vals):
        return "inverse"
    return "mixed"
