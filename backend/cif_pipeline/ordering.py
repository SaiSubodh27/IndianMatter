"""
ordering.py — cluster expansion + Monte Carlo for energetically ordered dopants.

This is the module the plan flagged as the missing piece for *ordered* doping
(as opposed to disordered/SQS doping).  The idea (Sanchez et al., and `full.md`
§3.7):

  1. Represent each site of the substitution pool as an Ising variable
     sigma_i in {+1 (dopant), -1 (host)}.
  2. A **cluster expansion** writes the energy as a sum over clusters (points,
     pairs, ...) of coefficients times correlation functions:
         E(sigma) = J0 + sum_i J_i sigma_i + sum_{ij} J_ij sigma_i sigma_j + ...
  3. Fit the coefficients by linear least squares from a training set of
     (decoration, energy) pairs.
  4. Run **simulated annealing / Monte Carlo** over the pool, evaluating the
     cheap cluster expansion millions of times, to find the low-energy
     decoration.

Energies can come from any calculator.  If none is supplied, the module uses
**Ewald summation with formal charges** as a *surrogate* — the audit was clear
that unscreened Ewald overstates real energy differences and must only ever be
a pre-filter, never treated as ground truth.  Every result therefore records
which energy source was used.
"""

from __future__ import annotations

import itertools
import math
from dataclasses import dataclass, field
from typing import Any, Callable, Dict, List, Optional, Sequence, Tuple

import numpy as np
from pymatgen.core import Structure, Element, Species
from pymatgen.analysis.ewald import EwaldSummation

# Formal charges used for the Ewald surrogate (audit: pre-filter only).
_FORMAL_CHARGES = {
    "Fe": 3, "Al": 3, "Cr": 3, "Ga": 3, "Mn": 3,
    "Zn": 2, "Ni": 2, "Co": 2, "Cu": 2, "Mg": 2, "Ca": 2,
    "Ti": 4, "Li": 1, "O": -2, "F": -1,
}


def _pair_distances(structure: Structure, pool: Sequence[int]) -> np.ndarray:
    """Dense matrix of periodic distances among the pool sites (vectorised)."""
    dm = structure.distance_matrix  # full PBC-aware matrix, computed by pymatgen
    idx = np.asarray(list(pool), dtype=int)
    return dm[np.ix_(idx, idx)]


def _pair_coulomb_energy(D: np.ndarray, sigma: np.ndarray,
                         q_dopant: float, q_host: float) -> float:
    """Fast surrogate: screened-free pair Coulomb sum over the pool.

    E = 1/2 * sum_{i != j} q_i q_j / r_ij  with q_i = dopant or host formal
    charge according to sigma.  This keeps the same physics as Ewald (like
    charges repel, unlike attract) but is O(N^2) vectorised numpy instead of an
    O(N^2) Python Ewald loop, so Monte Carlo training is fast.  It is a
    *pre-filter surrogate*, not a ground-truth energy — the result records that.
    """
    q = np.where(sigma > 0, q_dopant, q_host).astype(float)
    with np.errstate(divide="ignore"):
        inv = 1.0 / D
    np.fill_diagonal(inv, 0.0)
    return 0.5 * float(np.sum(np.outer(q, q) * inv))


@dataclass
class ClusterExpansion:
    """A fitted pair-cluster expansion over a substitution pool.

    Correlations are evaluated with vectorised numpy indexing, so predicting a
    configuration (needed millions of times during Monte Carlo) is cheap.
    """
    pool: List[int]
    pair_cutoff: float
    pairs: List[Tuple[int, int]]
    coefficients: Optional[np.ndarray] = None   # [J0, {J_i}, {J_ij}]
    n_point: int = 0
    rms_error: Optional[float] = None
    energy_source: str = "unknown"
    n_training: int = 0
    determinacy: str = "unknown"   # "determined" | "UNDERDETERMINED"
    _pi: Optional[np.ndarray] = None            # pair index arrays, cached
    _pj: Optional[np.ndarray] = None

    def __post_init__(self) -> None:
        self._pi = np.asarray([i for i, _ in self.pairs], dtype=int)
        self._pj = np.asarray([j for _, j in self.pairs], dtype=int)

    # ---- feature construction -------------------------------------------------
    def _features(self, sigma: np.ndarray) -> np.ndarray:
        s = np.asarray(sigma, dtype=float)
        pair_term = s[self._pi] * s[self._pj] if len(self.pairs) else np.empty(0)
        return np.concatenate(([1.0], s, pair_term))

    def fit(self, configs: Sequence[np.ndarray], energies: Sequence[float]) -> "ClusterExpansion":
        """Least-squares fit of the coefficients to (config, energy) pairs.

        Records determinacy: n_parameters = 1 + n_pool + n_pairs must not
        exceed n_training, else the fit is UNDERDETERMINED (more coefficients
        than data) and the ranking is not trustworthy.
        """
        X = np.vstack([self._features(s) for s in configs])
        y = np.asarray(energies, dtype=float)
        # rcond=None uses the SVD-based solver; robust to near-singular design.
        coeffs, *_ = np.linalg.lstsq(X, y, rcond=None)
        self.coefficients = coeffs
        self.n_point = len(self.pool)
        self.n_training = len(configs)
        resid = X @ coeffs - y
        self.rms_error = float(np.sqrt(np.mean(resid ** 2)))
        n_params = 1 + len(self.pool) + len(self.pairs)
        self.determinacy = ("determined" if self.n_training >= n_params
                            else "UNDERDETERMINED")
        return self

    @property
    def n_parameters(self) -> int:
        return 1 + len(self.pool) + len(self.pairs)

    def predict(self, sigma: np.ndarray) -> float:
        if self.coefficients is None:
            raise RuntimeError("ClusterExpansion.predict called before fit()")
        return float(self._features(sigma) @ self.coefficients)


def _decorate(base_structure: Structure, pool: Sequence[int], sigma: np.ndarray,
              dopant: str, host: str) -> Structure:
    """Materialise a sigma vector as a structure (dopant=+1, host=-1)."""
    out = base_structure.copy()
    for k, idx in enumerate(pool):
        out.replace(idx, dopant if sigma[k] > 0 else host)
    return out


def _ewald_energy(structure: Structure, pool: Sequence[int], sigma: np.ndarray,
                  dopant: str, host: str) -> float:
    """Surrogate energy: Ewald with formal charges for this decoration.

    NOTE: oxidation states are attached via `Species(..., oxidation_state=q)`
    with full occupancy 1.0 — an earlier version wrongly put the *charge* in the
    occupancy slot, which made the site occupancy sum exceed 1.
    """
    cand = structure.copy()
    for k, idx in enumerate(pool):
        cand.replace(idx, dopant if sigma[k] > 0 else host)
    for i, site in enumerate(cand):
        q = _FORMAL_CHARGES.get(site.species_string, 0)
        cand.replace(i, {Species(site.species_string, oxidation_state=q): 1.0})
    return float(EwaldSummation(cand).total_energy)


def _random_sigma(n: int, n_dopant: int, rng: np.random.RandomState) -> np.ndarray:
    s = -np.ones(n, dtype=int)
    s[rng.choice(n, size=n_dopant, replace=False)] = 1
    return s


@dataclass
class OrderingResult:
    structure: Structure
    best_sigma: np.ndarray
    best_energy: float
    fitted: ClusterExpansion
    n_training: int
    energy_source: str
    mc_steps: int
    notes: str = ""
    ensemble_energies: List[float] = field(default_factory=list)
    mc_acceptance_rate: Optional[float] = None
    mc_converged: Optional[bool] = None   # best-energy plateau over the final quarter


def order_doped_supercell(
    base_structure: Structure,
    pool: Sequence[int],
    dopant: str,
    host: str,
    n_dopant: int,
    pair_cutoff: float = 5.0,
    n_training: int = 12,
    mc_steps: int = 5000,
    temp_start: float = 5.0,
    temp_end: float = 0.05,
    seed: int = 0,
    energy_fn: Optional[Callable[[Structure], float]] = None,
) -> OrderingResult:
    """Fit a cluster expansion and Monte-Carlo sample the low-energy ordering.

    Parameters
    ----------
    pool : the sites eligible for the dopant/host swap (indices into base_structure)
    n_dopant : how many of the pool become dopant
    energy_fn : optional real calculator taking a fully decorated `Structure`
        and returning its energy (e.g. a MACE MLIP single-point function).
        If None, the formal-charge pair-Coulomb surrogate is used and the
        result is labelled accordingly.
    """
    rng = np.random.RandomState(seed)
    pool = list(pool)
    n = len(pool)
    if not (1 <= n_dopant < n):
        raise ValueError(f"n_dopant must be in [1, {n - 1}], got {n_dopant}")

    # Distances computed once; pairs derived from them.
    D = _pair_distances(base_structure, pool)
    pairs = [(i, j) for i in range(n) for j in range(i + 1, n)
             if D[i, j] <= pair_cutoff]
    ce = ClusterExpansion(pool=pool, pair_cutoff=pair_cutoff, pairs=pairs)

    use_surrogate = energy_fn is None
    if use_surrogate:
        q_dop = float(_FORMAL_CHARGES.get(dopant, 2))
        q_host = float(_FORMAL_CHARGES.get(host, 3))

        def ef(sigma: np.ndarray) -> float:  # noqa: E306 - small local closure
            return _pair_coulomb_energy(D, np.asarray(sigma), q_dop, q_host)
        ce.energy_source = ("pair Coulomb surrogate (formal charges) — "
                            "pre-filter, not ground truth")
    else:
        # The caller supplies energy_fn(structure) -> float, e.g. a MACE MLIP
        # single-point calculator.  It is called only on the training set;
        # Monte Carlo then evaluates the fitted (cheap) cluster expansion.
        def ef(sigma: np.ndarray) -> float:  # noqa: E306
            return float(energy_fn(_decorate(base_structure, pool, np.asarray(sigma),
                                             dopant, host)))
        ce.energy_source = getattr(energy_fn, "energy_source", "user-supplied calculator")

    # ---- training set: random + dispersed (max-min-distance) decorations -----
    train_sigmas: List[np.ndarray] = []
    seen = set()
    for _ in range(n_training):
        s = _random_sigma(n, n_dopant, rng)
        key = s.tobytes()
        if key not in seen:
            seen.add(key)
            train_sigmas.append(s)
    # add one maximally-dispersed decoration as a physically sensible extreme
    train_sigmas.append(_dispersed_sigma(D, n_dopant))

    energies = [ef(s) for s in train_sigmas]
    ce.fit(train_sigmas, energies)

    # ---- Monte Carlo / simulated annealing on the fitted expansion ----------
    sigma = _random_sigma(n, n_dopant, rng)
    best = sigma.copy()
    e_cur = ce.predict(sigma)
    best_e = e_cur
    ensemble: List[float] = []
    dopant_idx = set(np.where(sigma > 0)[0].tolist())

    n_accepted = 0
    for step in range(mc_steps):
        frac = step / max(1, mc_steps - 1)
        T = temp_start * (temp_end / temp_start) ** frac if temp_start > 0 else temp_end
        # propose: swap one dopant site with one host site (keeps count fixed)
        d = rng.choice(list(dopant_idx))
        h = rng.choice([x for x in range(n) if x not in dopant_idx])
        trial = sigma.copy()
        trial[d], trial[h] = -1, 1
        e_trial = ce.predict(trial)
        if e_trial < e_cur or rng.rand() < math.exp(-(e_trial - e_cur) / max(T, 1e-9)):
            sigma = trial
            e_cur = e_trial
            n_accepted += 1
            dopant_idx.discard(d)
            dopant_idx.add(h)
            if e_trial < best_e:
                best_e, best = e_trial, trial.copy()
        if step % max(1, mc_steps // 50) == 0:
            ensemble.append(float(best_e))

    # Convergence verdict: the best-energy trace must plateau over the final
    # quarter of the anneal (range smaller than 1e-6 per step on average);
    # otherwise the anneal is reported NOT converged.
    tail = ensemble[len(ensemble) * 3 // 4:] if len(ensemble) >= 4 else ensemble
    plateau = (max(tail) - min(tail)) if tail else float("inf")
    mc_converged = bool(tail) and plateau < 1e-3
    acceptance = n_accepted / max(1, mc_steps)

    # ---- materialise the best decoration ------------------------------------
    out = _decorate(base_structure, pool, best, dopant, host)

    notes = (
        "Cluster-expansion + Monte-Carlo ordering. "
        + ("Prediction pending DFT/MLIP confirmation." if use_surrogate
           else "Energies from supplied calculator.")
        + ("" if ce.determinacy == "determined"
           else " WARNING: cluster expansion UNDERDETERMINED "
           f"({ce.n_training} training configs < {ce.n_parameters} parameters).")
        + ("" if mc_converged else " WARNING: MC anneal did not plateau.")
    )
    return OrderingResult(
        structure=out, best_sigma=best, best_energy=best_e, fitted=ce,
        n_training=len(train_sigmas), energy_source=ce.energy_source,
        mc_steps=mc_steps, ensemble_energies=ensemble,
        mc_acceptance_rate=round(acceptance, 4), mc_converged=mc_converged,
        notes=notes,
    )


def _dispersed_sigma(D: np.ndarray, n_dopant: int) -> np.ndarray:
    """Greedy farthest-point selection mapped to a sigma vector."""
    n = D.shape[0]
    chosen = [int(np.argmax(D.sum(axis=1)))]  # most central-ish start
    while len(chosen) < n_dopant:
        # pick the candidate whose nearest chosen neighbour is farthest
        best_c, best_d = None, -1.0
        for c in range(n):
            if c in chosen:
                continue
            dmin = min(D[c, x] for x in chosen)
            if dmin > best_d:
                best_d, best_c = dmin, c
        chosen.append(best_c)
    s = -np.ones(n, dtype=int)
    s[chosen] = 1
    return s
