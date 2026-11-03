"""
geometry.py — composition-derived lattice parameter `a` and oxygen
parameter `u` for spinel ferrites/aluminates.

Replaces the old hardcoded literals (a inherited from a parent guess,
u=0.2556 everywhere).  Every returned value records exactly which
end-member values and interpolation weights produced it, so the number
is traceable — never a silent constant.

Method: Vegard-style linear interpolation over the divalent/trivalent
end-member spinels:
    MFe2O4   (M = divalent A-site cation)  -> a, u
    MgAl2O4-type end-members for aluminates/chromites where Fe is absent.

End-member values below are taken from the deposited COD ground-truth
structures this pipeline validates against (see validation_10/ground_truth_cifs
and prepare_ground_truth.py).  This is a first-order estimate; real values
shift with synthesis, inversion, and Jahn-Teller distortion — hence the
provenance record.
"""

from __future__ import annotations

from typing import Dict, List, Tuple

# (a_angstrom, u) for the end-member spinels below, from deposited
# COD refinements.
_END_MEMBERS: Dict[str, Tuple[float, float]] = {
    "ZnFe2O4": (8.4475, 0.2500),
    "NiFe2O4": (8.3597, 0.2575),
    "CuFe2O4": (8.2020, 0.2500),   # equivalent cubic of tetragonal GT
    "CoFe2O4": (8.3806, 0.2566),
    "MgFe2O4": (8.3805, 0.2557),
    "MnFe2O4": (8.4983, 0.2639),
    "MgAl2O4": (8.0750, 0.2640),
    "ZnAl2O4": (8.0860, 0.2650),
    "CoAl2O4": (8.1050, 0.2645),
    "NiAl2O4": (8.0480, 0.2635),
    "FeAl2O4": (8.1500, 0.2620),
    "MgCr2O4": (8.3337, 0.2670),
    "ZnCr2O4": (8.3291, 0.2666),
    "CoCr2O4": (8.3350, 0.2670),
    "NiCr2O4": (8.3200, 0.2670),
}

# M -> end-member template for M(X)2O4 series
_B_SERIES = {"Fe": "{M}Fe2O4", "Al": "{M}Al2O4", "Cr": "{M}Cr2O4"}


def _end_member_for(m: str, b: str) -> str:
    series = _B_SERIES.get(b)
    if series is None:
        return None
    name = series.format(M=m)
    return name if name in _END_MEMBERS else None


def estimate_a_u(spec: Dict[str, Dict[str, float]],
                 exclude: List[str] | None = None) -> Dict:
    """Estimate (a, u) from a resolved builder spec.

    spec: {"A": {el: frac_per_fu}, "B": {el: frac_per_fu}} as produced
    by intent.interpret().

    Weights: for every A-site divalent species M on site A and every
    dominant trivalent B-site species X, the end-member M X2O4 contributes
    weight (amount of M on A) x (amount of X on B / 2).  Missing
    end-members are reported; weights are renormalised over what exists.

    exclude: optional list of end-member names to leave out (leave-one-out
    validation).  Excluded end-members are reported under "excluded".

    Returns dict with keys: a, u, weights [(end_member, w, a, u)],
    missing [end_member], method, note.
    """
    excluded = set(exclude or [])
    # Use composition totals (A+B merged, per f.u.), not site-resolved
    # amounts — end-members are classified by composition, and an inverse
    # spinel (e.g. A=Fe, B=Ni+Fe) must still map to NiFe2O4.
    totals: Dict[str, float] = {}
    for el, v in spec.get("A", {}).items():
        if el != "Vac" and v > 0:
            totals[el] = totals.get(el, 0.0) + v
    for el, v in spec.get("B", {}).items():
        if el != "Vac" and v > 0:
            totals[el] = totals.get(el, 0.0) + v

    contributions: List[Tuple[str, float]] = []
    missing: List[str] = []
    for m, amt_m in totals.items():
        for x, amt_x in totals.items():
            if x in ("Fe", "Al", "Cr", "Ga", "In") and m != x:
                w = amt_m * amt_x / 2.0
                if w > 0:
                    em = _end_member_for(m, x)
                    contributions.append((em or f"{m}{x}2O4?", w))
                    if em is None:
                        missing.append(f"{m}{x}2O4")

    total_w = sum(w for name, w in contributions
                  if not name.endswith("?") and name not in excluded)
    if total_w <= 0:
        # Fall back to a single divalent-Fe average when nothing matched.
        per_fu_m = sorted(totals.items(), key=lambda kv: -kv[1])
        ref = None
        present = set(totals)
        for m, _ in per_fu_m:
            for b in ("Fe", "Al", "Cr"):
                # Only end-members whose BOTH cations are actually present.
                if b not in present:
                    continue
                cand = _end_member_for(m, b)
                if cand and cand not in excluded:
                    ref = cand
                    break
            if ref:
                break
        if ref is None:
            return {"a": None, "u": None, "weights": [], "missing": missing,
                    "excluded": sorted(excluded),
                    "method": "no_end_member_match", "note": "no usable end-member"}
        a, u = _END_MEMBERS[ref]
        return {"a": a, "u": u, "weights": [(ref, 1.0, a, u)], "missing": missing,
                "excluded": sorted(excluded),
                "method": "single_end_member_fallback",
                "note": f"only {ref} available; no interpolation possible"}

    a_est, u_est = 0.0, 0.0
    weights = []
    for name, w in contributions:
        if name in _END_MEMBERS and name not in excluded:
            a_m, u_m = _END_MEMBERS[name]
            a_est += (w / total_w) * a_m
            u_est += (w / total_w) * u_m
            weights.append((name, round(w / total_w, 4), a_m, u_m))

    return {"a": round(a_est, 4), "u": round(u_est, 4), "weights": weights,
            "missing": missing, "excluded": sorted(excluded),
            "method": "vegard_end_member_interpolation",
            "note": "composition-weighted mean of deposited end-member a/u"}


def estimate_a(spec: Dict[str, Dict[str, float]]) -> float:
    return estimate_a_u(spec)["a"]


def estimate_u(spec: Dict[str, Dict[str, float]]) -> float:
    return estimate_a_u(spec)["u"]
