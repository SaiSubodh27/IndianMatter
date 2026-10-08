"""
validation.py — the error/validation vector for a generated CIF.

There is no single honest "error %" for a doped structure, so this computes the
three *separate* error axes the project cares about and returns them alongside a
documented composite:

  * crystallographic:  lattice Δa %, XRD peak Δ2θ  (vs a reference, if any)
  * site / doping:     dopant A/B site match, inversion λ difference
  * energy:            MLIP energy per atom, relaxation max force

Representation awareness
------------------------
Which axes *mean* something depends on the CIF's representation (the
`_cif_pipeline_representation` tag):

  * ``ensemble_average`` (VCA): the structure is a time/ensemble average with
    fractional occupancy.  Lattice and XRD are valid (diffraction measures the
    average!).  A per-site A/B "match" is an *average occupancy* comparison, and
    the nearest-self-image distance is meaningless (there is no single dopant to
    image).  A VCA structure must never be validated as if it were a snapshot.
  * ``*_seed_N`` (ordered / SQS / enumerate / ensemble / distorted): every atom
    is at a real position, so site occupancy, nearest-self-image, MLIP energy and
    relaxation are all well defined, and the structure can be compared directly
    to a measured reference.

`error_vector(...)` therefore records the representation and a
`validation_scope` describing what each axis can and cannot claim for that
representation.  Every field is None when it cannot be computed (never a silent
0).
"""

from __future__ import annotations

from typing import Dict, Optional

import numpy as np
from pymatgen.core import Structure

from .site_analysis import analyze_sites, xrd_peaks, compare_xrd


# Representations that are ensemble averages (fractional occupancy) vs explicit
# snapshots (integer occupancy).
ENSEMBLE_REPRESENTATIONS = {"vca", "ensemble_average"}


def is_ensemble(representation: Optional[str]) -> bool:
    return representation in ENSEMBLE_REPRESENTATIONS


def validation_scope(representation: Optional[str]) -> Dict[str, str]:
    """Explain what each validation axis means for the representation."""
    ens = is_ensemble(representation)
    if ens:
        return {
            "kind": "ensemble_average",
            "lattice": "valid — diffraction/XRD measures the average lattice",
            "xrd": "valid — the average pattern is exactly what is compared",
            "site": ("average occupancy — reports the ensemble fraction of the "
                     "dopant on A/B, NOT a specific atom position"),
            "min_image": "not_applicable — there is no single dopant to image",
            "energy": ("not_applicable — a fractional-occupancy cell is not an "
                       "atomistic configuration a potential can score"),
            "reference": ("compare lattice/XRD only; a site 'match' against a "
                          "snapshot is average-vs-snapshot"),
        }
    return {
        "kind": "explicit_snapshot",
        "lattice": "valid",
        "xrd": "valid (peak positions; intensities are weak evidence)",
        "site": "valid — each dopant is at a definite A/B site",
        "min_image": "valid — nearest self-image of the placed dopants",
        "energy": "valid — a definite atomistic configuration",
        "reference": "direct comparison to a measured structure is meaningful",
    }


def conventional_a(structure: Structure) -> Optional[float]:
    """Conventional cubic lattice parameter of a spinel, from its volume.

    COD stores spinels in either the conventional (8 f.u.) or the primitive
    (2 f.u.) cell; comparing `lattice.a` directly across settings is meaningless
    (5.9 Å vs 8.4 Å).  For a spinel, a^3 = 8 * volume / n_fu, with n_fu = O/4.
    """
    n_o = structure.composition.get("O", 0.0)
    if n_o <= 0:
        return None
    n_fu = n_o / 4.0
    if n_fu <= 0:
        return None
    return float((8.0 * structure.lattice.volume / n_fu) ** (1.0 / 3.0))


def error_vector(
    structure: Structure,
    reference: Optional[Structure] = None,
    spec: Optional[Dict[str, Dict[str, float]]] = None,
    dopant: str = "Co",
    relaxation: Optional[Dict] = None,
    representation: Optional[str] = None,
    min_image_A: Optional[float] = None,
) -> Dict:
    """Compute the validation vector for `structure`.

    Parameters
    ----------
    reference : optional measured/deposited structure to compare against.
    spec : optional A/B sublattice spec (for the intrinsic charge/occupancy checks).
    relaxation : optional relaxation record (energy / max_force / converged).
    representation : the representation tag (e.g. "vca", "ordered") — decides
        which axes are meaningful (see module docstring).
    min_image_A : nearest self-image distance of the placed dopants, if known.
    """
    ens = is_ensemble(representation)
    out: Dict = {
        # ---- identity / representation ----
        "representation": representation,
        "validation_scope": validation_scope(representation),
        # ---- intrinsic, always available ----
        "n_atoms": structure.num_sites,
        "lattice_a": round(structure.lattice.a, 5),
        "lattice_c": round(structure.lattice.c, 5),
        "volume": round(structure.lattice.volume, 3),
        "conventional_a": None if conventional_a(structure) is None
        else round(conventional_a(structure), 5),
        "charge_sum": None,
        "min_image_A": None if ens else (None if min_image_A is None else round(min_image_A, 3)),
    }

    # crystallographic axis (needs a reference) — valid for BOTH representations
    out["lattice_delta_a_pct"] = None
    out["reference_conventional_a"] = None
    out["xrd_mean_delta"] = None
    out["xrd_max_delta"] = None
    out["xrd_n_matched"] = None

    if reference is not None:
        a_s = conventional_a(structure)
        a_r = conventional_a(reference)
        out["reference_conventional_a"] = None if a_r is None else round(a_r, 5)
        if a_s and a_r:
            out["lattice_delta_a_pct"] = round(100 * (a_s - a_r) / a_r, 4)
        pat_s = xrd_peaks(structure)
        pat_r = xrd_peaks(reference)
        cmp = compare_xrd(pat_r, pat_s)   # reference peaks matched to ours
        out["xrd_mean_delta"] = None if cmp["mean_delta"] is None else round(cmp["mean_delta"], 4)
        out["xrd_max_delta"] = None if cmp["max_delta"] is None else round(cmp["max_delta"], 4)
        out["xrd_n_matched"] = cmp["n_matched"]

    # site / doping axis
    out["dopant_site"] = None
    out["dopant_on_B"] = None
    out["reference_dopant_site"] = None
    out["site_match"] = None
    out["site_match_reason"] = None
    try:
        sd = analyze_sites(structure, dopant=dopant)
        out["dopant_on_B"] = sd.on_B
        out["dopant_site"] = ("average:" + sd.dominant) if ens else sd.dominant
        if reference is not None:
            rds = analyze_sites(reference, dopant=dopant)
            out["reference_dopant_site"] = rds.dominant
            if ens:
                # comparing an average occupancy to a snapshot is not a match
                out["site_match_reason"] = (
                    "ensemble-average occupancy vs snapshot reference — not scored")
            elif sd.dominant in ("A", "B") and rds.dominant in ("A", "B"):
                out["site_match"] = (sd.dominant == rds.dominant)
    except Exception:
        pass

    # energy axis (only meaningful for an explicit snapshot)
    out["energy_per_atom"] = None
    out["relax_max_force"] = None
    out["relax_converged"] = None
    if relaxation and not ens:
        out["relax_converged"] = relaxation.get("converged")
        if relaxation.get("max_force") is not None:
            out["relax_max_force"] = round(float(relaxation["max_force"]), 4)
        if relaxation.get("energy") is not None and structure.num_sites:
            out["energy_per_atom"] = round(float(relaxation["energy"]) / structure.num_sites, 4)

    # documented composite (only over the axes that are available; lower = better)
    comp_terms = []
    if out["lattice_delta_a_pct"] is not None:
        comp_terms.append(abs(out["lattice_delta_a_pct"]))
    if out["xrd_mean_delta"] is not None:
        comp_terms.append(out["xrd_mean_delta"])
    if out["site_match"] is not None:
        comp_terms.append(0.0 if out["site_match"] else 1.0)
    out["composite_error"] = round(float(np.mean(comp_terms)), 4) if comp_terms else None
    out["composite_error_axes"] = len(comp_terms)
    return out
