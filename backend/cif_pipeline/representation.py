"""
representation.py — technique selection and construction.

Answers: *do we emit the ensemble average (VCA), one explicit snapshot
(ordered), several statistically-correct snapshots (SQS / ensemble), or an
exhaustive set (enumerate)?*

Every representation is a `Representation` carrying its mode, seed, the
structure, a score (lower = better for the active rule), and provenance.  The
"best CIF" is then chosen by `rank_representations`, whose rules are explicit —
never "whichever came out of the script first".
"""

from __future__ import annotations

import itertools
import math
from dataclasses import dataclass, field
from typing import Any, Callable, Dict, List, Optional, Sequence, Tuple

import numpy as np
from pymatgen.core import Structure
from pymatgen.io.cif import CifWriter

from .spinel_build import build_spinel, classify_spinel_sites

REPRESENTATION_MODES = ("vca", "ordered", "sqs", "enumerate", "ensemble",
                        "distorted", "cluster_expansion")


@dataclass
class Representation:
    mode: str
    structure: Structure
    seed: int = 0
    score: Optional[float] = None       # interpretation depends on mode
    score_metric: str = ""
    rank: int = 0
    notes: str = ""
    labels: Dict[str, Any] = field(default_factory=dict)

    def to_cif(self) -> str:
        try:
            return str(CifWriter(self.structure, symprec=0.01))
        except Exception:
            return str(CifWriter(self.structure, symprec=None))


# ─────────────────────────────────────────────────────────────────────────────
# Technique selection
# ─────────────────────────────────────────────────────────────────────────────

def choose_technique(
    application: Optional[str] = None,
    n_dopant: int = 1,
    n_host_sites: int = 1,
    disordered: bool = True,
    ordering_suspected: bool = False,
    mobile: bool = False,
    distorted: bool = False,
    technique_override: Optional[str] = None,
) -> Tuple[str, str]:
    """Pick a representation mode and explain why.

    Returns (mode, rationale).
    """
    if technique_override:
        if technique_override not in REPRESENTATION_MODES:
            raise ValueError(
                f"unknown technique '{technique_override}'; "
                f"choose from {REPRESENTATION_MODES}"
            )
        return technique_override, "user-specified technique"

    app = (application or "").lower()

    if mobile and app in ("snapshot", "md", "dynamics"):
        return "ensemble", (
            "mobile species + snapshot request: emit explicit snapshots; the "
            "VCA average cannot represent a hopping atom in one cell"
        )
    if app in ("xrd", "rietveld", "diffraction", "average"):
        return "vca", "diffraction measures the ensemble average -> VCA"
    if distorted:
        return "distorted", (
            "Jahn-Teller host: build a tetragonal (strained) snapshot; a cubic "
            "cell would be a known geometry mismatch"
        )
    if ordering_suspected and n_dopant >= 2:
        return "cluster_expansion", (
            "ordering suspected: cluster-expansion + Monte-Carlo ground-state search"
        )
    if app in ("mlip", "dft", "energy", "relaxation", "bonds"):
        if n_dopant <= 1:
            return "ordered", "single dopant: one explicit snapshot suffices"
        return "sqs", "several dopants: SQS ensemble reproduces the disordered average statistically"
    if mobile:
        return "vca", "mobile species, no snapshot requested -> average with a mobility note"

    # Default by size
    if n_dopant <= 1:
        return "ordered", "single dopant default: one explicit ordered supercell"
    if n_host_sites <= 8:
        return "enumerate", "small cell: exhaustively enumerate distinct decorations"
    return "sqs", "default for several dopants: SQS ensemble"


# ─────────────────────────────────────────────────────────────────────────────
# SQS / short-range-order scoring
# ─────────────────────────────────────────────────────────────────────────────

def _pair_shells(structure: Structure, indices: Sequence[int],
                 max_dist: float) -> Tuple[List[int], List[int]]:
    """Return (i, j) index-pair lists within max_dist for a sublattice."""
    ii, jj = [], []
    idx = list(indices)
    for a in range(len(idx)):
        i = idx[a]
        for b in range(a + 1, len(idx)):
            j = idx[b]
            if structure.get_distance(i, j) <= max_dist:
                ii.append(i)
                jj.append(j)
    return ii, jj


def warren_cowley_deviation(
    structure: Structure,
    sublattice: Sequence[int],
    dopant_indices: Sequence[int],
    max_dist: float = 6.0,
) -> float:
    """L1 deviation of the Warren-Cowley SRO parameters from the random value.

    Random decoration gives alpha=0 at every shell; a clustered or ordered
    decoration moves alpha away from 0.  Lower score = more random = better SQS.
    """
    sub = set(sublattice)
    dop = set(dopant_indices)
    x = len(dop) / max(1, len(sublattice))
    if x <= 0 or x >= 1:
        return 0.0

    # Bin pair distances into shells (0.5 A bins).
    shells: Dict[int, List[int]] = {}
    ii, jj = _pair_shells(structure, sublattice, max_dist)
    for i, j in zip(ii, jj):
        d = structure.get_distance(i, j)
        shell = int(round(d / 0.5))
        shells.setdefault(shell, [0, 0])  # [dopant-anchored pairs, dd pairs]
        if i in dop or j in dop:
            shells[shell][0] += 1
            if i in dop and j in dop:
                shells[shell][1] += 1

    dev = 0.0
    for shell, (anchored, dd) in shells.items():
        if anchored == 0:
            continue
        p = dd / anchored
        alpha = 1.0 - p / x
        dev += abs(alpha)
    return dev


# ─────────────────────────────────────────────────────────────────────────────
# Decoration helpers
# ─────────────────────────────────────────────────────────────────────────────

def _dopant_partition(
    structure: Structure, sublattice: Sequence[int], dopant_element: str
) -> Tuple[List[int], List[int]]:
    """Split a sublattice into (dopant_indices, host_indices) by current species."""
    dop, host = [], []
    for i in sublattice:
        if np.any([str(sp) == dopant_element for sp in structure[i].species.elements]):
            dop.append(i)
        else:
            host.append(i)
    return dop, host


def _substitution_pool(
    structure: Structure, sublattice: Sequence[int],
    dopant_element: str, host_element: str,
) -> List[int]:
    """Sites available for the dopant<->host swap: current dopant or host species only."""
    pool = []
    for i in sublattice:
        el = structure[i].species_string
        if el == dopant_element or el == host_element:
            pool.append(i)
    return pool


def _redecorate(
    structure: Structure,
    pool: Sequence[int],
    dopant_element: str,
    host_element: str,
    n_dopant: int,
    rng: np.random.RandomState,
) -> Structure:
    """Swap n_dopant of the pool sites to dopant, the rest back to host.

    Only sites that are currently the dopant or the substituted host are
    touched, so other species sharing the sublattice (e.g. Fe alongside Ni on
    the B site) are preserved exactly.
    """
    cand = structure.copy()
    if n_dopant > len(pool):
        raise ValueError(f"n_dopant={n_dopant} exceeds substitution pool size {len(pool)}")
    chosen = set(rng.choice(list(pool), size=n_dopant, replace=False).tolist())
    for i in pool:
        cand.replace(i, dopant_element if i in chosen else host_element)
    return cand


def build_sqs(
    base_structure: Structure,
    sublattice: Sequence[int],
    dopant_element: str,
    host_element: str,
    n_dopant: int,
    n_seeds: int = 5,
    max_dist: float = 6.0,
    seed: int = 0,
) -> List[Representation]:
    """Generate SQS-style decorations and score each by SRO deviation."""
    pool = _substitution_pool(base_structure, sublattice, dopant_element, host_element)
    reps: List[Representation] = []
    for s in range(n_seeds):
        rng = np.random.RandomState(seed + s)
        cand = _redecorate(base_structure, pool, dopant_element, host_element, n_dopant, rng)
        dop_idx, _ = _dopant_partition(cand, pool, dopant_element)
        score = warren_cowley_deviation(cand, pool, dop_idx, max_dist=max_dist)
        reps.append(Representation(
            mode="sqs", structure=cand, seed=seed + s, score=score,
            score_metric="warren_cowley_L1 (lower=more random)",
            notes="SQS seed; report the spread across seeds, not just the best",
            labels={"pool_size": len(pool), "n_dopant": n_dopant},
        ))
    reps.sort(key=lambda r: r.score)
    for k, r in enumerate(reps):
        r.rank = k
    return reps


def build_enumerate(
    base_structure: Structure,
    sublattice: Sequence[int],
    dopant_element: str,
    host_element: str,
    n_dopant: int,
    max_configs: int = 5000,
    max_dist: float = 6.0,
) -> List[Representation]:
    """Enumerate distinct decorations when the count is small enough."""
    pool = _substitution_pool(base_structure, sublattice, dopant_element, host_element)
    n_configs = math.comb(len(pool), n_dopant)
    if n_configs > max_configs:
        return build_sqs(base_structure, sublattice, dopant_element, host_element,
                         n_dopant, n_seeds=min(8, max_configs))
    reps: List[Representation] = []
    for k, combo in enumerate(itertools.combinations(pool, n_dopant)):
        cand = base_structure.copy()
        cs = set(combo)
        for i in pool:
            cand.replace(i, dopant_element if i in cs else host_element)
        score = warren_cowley_deviation(cand, pool, list(combo), max_dist=max_dist)
        reps.append(Representation(
            mode="enumerate", structure=cand, seed=k, score=score,
            score_metric="warren_cowley_L1 (lower=more random)",
        ))
    reps.sort(key=lambda r: r.score)
    for k, r in enumerate(reps):
        r.rank = k
    return reps


def build_ensemble(
    base_structure: Structure,
    sublattice: Sequence[int],
    dopant_element: str,
    host_element: str,
    n_dopant: int,
    n_snapshots: int = 8,
    seed: int = 0,
) -> List[Representation]:
    """Emit several explicit snapshots (for mobile / multi-minimum systems)."""
    pool = _substitution_pool(base_structure, sublattice, dopant_element, host_element)
    reps: List[Representation] = []
    for s in range(n_snapshots):
        rng = np.random.RandomState(seed + s)
        cand = _redecorate(base_structure, pool, dopant_element, host_element, n_dopant, rng)
        reps.append(Representation(
            mode="ensemble", structure=cand, seed=seed + s,
            notes="explicit snapshot; average observables over the set, not positions",
        ))
        reps[-1].rank = s
    return reps


# ─────────────────────────────────────────────────────────────────────────────
# Top-level dispatch
# ─────────────────────────────────────────────────────────────────────────────

def build_representations(
    spec: Dict[str, Dict[str, float]],
    mode: str,
    a: float,
    u: float,
    sublattice: str = "auto",
    host_element: Optional[str] = None,
    dopant_element: Optional[str] = None,
    formula: Optional[str] = None,
    max_atoms: int = 560,
    seed: int = 0,
    n_seeds: int = 5,
    n_snapshots: int = 8,
    energy_fn: Optional[Callable[[Structure], float]] = None,
    symmetrize_tetragonal: bool = False,
    supercell_matrix: Optional[List[List[int]]] = None,
    base: str = "conventional",
) -> List[Representation]:
    """Build one or more representations for a spinel A/B spec.

    For non-spinel parents, call the lower-level helpers with a parent structure
    and its orbit indices instead (see `build_sqs` / `build_enumerate`).

    energy_fn: optional MLIP single-point function used to (a) train the cluster
    expansion and (b) rank discrete candidates by a real energy.
    """
    if mode == "vca":
        # The VCA cell is tiled with the plan matrix/base like every other
        # mode, so plan and build always agree; occupancies stay fractional.
        struct, rep = build_spinel(spec, a=a, u=u, mode="vca",
                                   supercell_matrix=supercell_matrix, base=base)
        return [Representation(mode="vca", structure=struct,
                               notes="ensemble average (fractional occupancy)",
                               labels=rep)]

    # All other modes need a discrete supercell to decorate.
    np.random.seed(seed)
    struct, rep = build_spinel(spec, a=a, u=u, mode="ordered",
                               max_atoms=max_atoms, n_candidates=1,
                               supercell_matrix=supercell_matrix, base=base)
    A_idx, B_idx, _ = classify_spinel_sites(struct)

    targets = {"A": A_idx, "B": B_idx}

    if mode == "ordered":
        reps = [Representation(mode="ordered", structure=struct, seed=seed,
                               notes="one explicit snapshot; any symmetry-equivalent site",
                               labels=rep)]
        return _score_with_energy(reps, energy_fn)

    if mode == "distorted":
        # Jahn-Teller host: build the tetragonal (I4_1/amd-like) starting cell.
        from .symmetry_paths import build_tetragonal_distortion
        db = build_tetragonal_distortion(
            struct, formula or "", symmetrize_to_sg=symmetrize_tetragonal,
        )
        reps = [Representation(
            mode="distorted", structure=db.structure, seed=seed,
            notes=db.notes, labels={**rep, "c_over_a": db.c_over_a,
                                    "space_group": db.space_group},
        )]
        return _score_with_energy(reps, energy_fn)

    # The remaining modes all need to know which species is the dopant.
    dopant_el = dopant_element or _dominant_dopant(spec)

    if mode in ("sqs", "enumerate", "ensemble", "cluster_expansion"):
        sub_name = sublattice if sublattice in ("A", "B") else _dopant_sublattice(struct, targets, dopant_el)
        sub_idx = targets[sub_name]
        n_dopant = sum(
            1 for i in sub_idx
            if dopant_el in [str(sp) for sp in struct[i].species.elements]
        )
        if n_dopant <= 0:
            raise ValueError(f"no {dopant_el} found on sublattice {sub_name}")
        if host_element is None:
            host_element = _infer_host_element(struct, sub_idx, dopant_el)
        # Carry the builder's integer-rounding report on every representation
        # so downstream checks can report composition rounding for all modes.
        _round = list(rep.get("rounding_warnings", []))
        _round_detail = dict(rep.get("rounding", {}))
        if mode == "sqs":
            reps = build_sqs(struct, sub_idx, dopant_el, host_element, n_dopant,
                             n_seeds=n_seeds, seed=seed)
            for r in reps:
                r.labels["rounding_warnings"] = _round
                r.labels["rounding"] = _round_detail
            return _score_with_energy(reps, energy_fn)
        if mode == "enumerate":
            reps = build_enumerate(struct, sub_idx, dopant_el, host_element, n_dopant)
            for r in reps:
                r.labels["rounding_warnings"] = _round
                r.labels["rounding"] = _round_detail
            return _score_with_energy(reps, energy_fn)
        if mode == "ensemble":
            reps = build_ensemble(struct, sub_idx, dopant_el, host_element, n_dopant,
                                  n_snapshots=n_snapshots, seed=seed)
            for r in reps:
                r.labels["rounding_warnings"] = _round
                r.labels["rounding"] = _round_detail
            return _score_with_energy(reps, energy_fn)
        # cluster expansion + Monte Carlo
        from .ordering import order_doped_supercell
        # Only the sites currently holding the dopant or the replaced host may
        # participate; otherwise coexisting species (e.g. Fe on the B site)
        # would be overwritten.
        ce_pool = _substitution_pool(struct, sub_idx, dopant_el, host_element)
        # MLIP training: fewer training configs, still plenty for a pair model.
        res = order_doped_supercell(
            struct, ce_pool, dopant_el, host_element, n_dopant, seed=seed,
            energy_fn=energy_fn,
            n_training=(12 if energy_fn is None else 6),
        )
        return [Representation(
            mode="cluster_expansion", structure=res.structure, seed=seed,
            score=res.best_energy, score_metric="cluster-expansion energy (lower=better)",
            notes=res.notes, labels={
                "energy_source": res.energy_source,
                "n_training": res.n_training,
                "n_parameters": res.fitted.n_parameters,
                "determinacy": res.fitted.determinacy,
                "ce_rms_error": res.fitted.rms_error,
                "mc_steps": res.mc_steps,
                "mc_acceptance_rate": res.mc_acceptance_rate,
                "mc_converged": res.mc_converged,
            },
        )]

    raise ValueError(f"unknown mode '{mode}'")


def _score_with_energy(
    reps: List[Representation],
    energy_fn: Optional[Callable[[Structure], float]],
) -> List[Representation]:
    """If an MLIP is supplied, score/rank discrete candidates by real energy.

    The Warren-Cowley / placement score is preserved in `labels` so the SQS
    spread can still be reported.
    """
    if energy_fn is None:
        return reps
    for r in reps:
        try:
            e = float(energy_fn(r.structure))
            r.labels["sro_or_placement_score"] = r.score
            r.score = e
            r.score_metric = "MLIP energy (lower=better)"
        except Exception as exc:  # pragma: no cover - environment dependent
            r.notes += f" | MLIP scoring failed: {type(exc).__name__}"
    reps.sort(key=lambda r: (r.score if r.score is not None else 0.0, r.seed))
    for k, r in enumerate(reps):
        r.rank = k
    return reps


def _infer_host_element(struct, sub_idx, dopant_el: str) -> str:
    """The species on the sublattice most likely replaced by the dopant."""
    from collections import Counter
    c = Counter(
        struct[i].species_string for i in sub_idx
        if struct[i].species_string != dopant_el
    )
    if not c:
        raise ValueError("cannot infer host element for substitution")
    return c.most_common(1)[0][0]


def _dominant_dopant(spec: Dict[str, Dict[str, float]]) -> str:
    """The species in the spec that is NOT the base spinel cation (Fe/O)."""
    candidates = []
    for site in ("A", "B"):
        for el in spec.get(site, {}):
            if el not in ("Fe", "O", "Vac", "Al", "Cr", "Mg"):
                candidates.append(el)
    if candidates:
        # Most abundant non-host species
        from collections import Counter
        c = Counter(candidates)
        return c.most_common(1)[0][0]
    # Fall back to the divalent species on A
    a_spec = spec.get("A", {})
    for el in a_spec:
        if el not in ("Fe", "O", "Vac"):
            return el
    raise ValueError("could not identify a dopant species in spec")


def _dopant_sublattice(struct, targets, dopant_el) -> str:
    counts = {}
    for name, idx in targets.items():
        counts[name] = sum(
            1 for i in idx
            if dopant_el in [str(sp) for sp in struct[i].species.elements]
        )
    return max(counts, key=counts.get)


# ─────────────────────────────────────────────────────────────────────────────
# Best-CIF ranking
# ─────────────────────────────────────────────────────────────────────────────

def rank_representations(
    reps: List[Representation],
    deposited_available: bool = False,
    ordering_confirmed: bool = False,
) -> List[Representation]:
    """Order candidates by the explicit best-structure rules.

    * SQS/ensemble modes keep the full spread (only ranked by score).
    * Predictions are labelled, never presented as settled fact.
    """
    ranked = sorted(reps, key=lambda r: (r.score if r.score is not None else 0.0, r.seed))
    for k, r in enumerate(ranked):
        r.rank = k
        if r.mode == "sqs":
            r.notes += " | SQS: report the whole seed spread as the answer"
        if r.mode in ("sqs", "ensemble") and ordering_confirmed is False:
            r.notes += " | prediction, pending DFT/cluster-expansion confirmation"
    return ranked
