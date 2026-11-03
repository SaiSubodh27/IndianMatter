"""
supercell.py — integer supercell (Hermite normal form) search.

The audit found that a diagonal supercell `(nx, ny, nz)` is often skewed: the
nearest self-image distance can be much smaller than what a general integer
matrix with the same determinant (volume) achieves.  For an fcc-based spinel a
140-atom diagonal cell gave a 5.9 Å nearest image where 10.2 Å was reachable
with a non-diagonal matrix of the same size.

This module enumerates the **Hermite normal forms** `H = [[a,0,0],[b,c,0],[d,e,f]]`
with det(H) = k and picks the one whose transformed lattice has the largest
smallest face width (an upper bound on how far the nearest periodic image is).

Everything is integer arithmetic, so it is fast and deterministic.
"""

from __future__ import annotations

from dataclasses import dataclass
from typing import Iterator, List, Optional, Tuple

import numpy as np
from pymatgen.core import Lattice

# Upper bound on how many HNFs we are willing to enumerate for one k.  k is the
# tiling factor (supercell volume / cell volume), normally <= ~64 for our uses.
_MAX_HNF = 2500


def divisors(k: int) -> List[int]:
    """All positive divisors of k (k >= 1)."""
    ds = []
    i = 1
    while i * i <= k:
        if k % i == 0:
            ds.append(i)
            if i != k // i:
                ds.append(k // i)
        i += 1
    return sorted(ds)


def hermite_normal_forms(k: int) -> Iterator[np.ndarray]:
    """Yield integer 3x3 matrices H with det(H)=k, H = [[a,0,0],[b,c,0],[d,e,f]].

    Standard lower-triangular HNF constraints:
        a, c, f > 0 ;  a*c*f = k ;  0 <= b < c ;  0 <= d < f ;  0 <= e < f
    """
    count = 0
    for a in divisors(k):
        rem = k // a
        for c in divisors(rem):
            f = rem // c
            for b in range(c):
                for d in range(f):
                    for e in range(f):
                        yield np.array([[a, 0, 0],
                                        [b, c, 0],
                                        [d, e, f]], dtype=int)
                        count += 1
                        if count >= _MAX_HNF:
                            return


def face_widths(lattice: Lattice, matrix: np.ndarray) -> Tuple[float, float]:
    """Return (min_face_width, volume) of the lattice transformed by `matrix`.

    The face width along axis i is the perpendicular distance between the two
    faces of the cell spanned by the other two lattice vectors.  The smallest
    face width bounds the nearest self-image distance.
    """
    new = Lattice(np.dot(matrix, lattice.matrix))
    widths = []
    for i in range(3):
        j, k = [x for x in range(3) if x != i]
        vj = new.matrix[j]
        vk = new.matrix[k]
        normal = np.cross(vj, vk)
        norm = np.linalg.norm(normal)
        widths.append(float(abs(np.dot(normal, new.matrix[i])) / norm) if norm > 0 else 0.0)
    return min(widths), float(new.volume)


def shortest_lattice_vector(lattice: Lattice, matrix: Optional[np.ndarray] = None,
                            rng: int = 2) -> float:
    """Shortest non-zero lattice vector of `matrix @ lattice` (nearest self-image).

    A site's periodic images sit at integer combinations of the supercell
    lattice vectors; the closest image is therefore the shortest non-zero
    lattice vector.  This is the physically correct "nearest self-image
    distance" (the min face width is only a lower bound for skewed cells).
    Brute-forced over small integer combinations, which is exact for the
    near-cubic cells used here.
    """
    M = lattice.matrix if matrix is None else np.dot(matrix, lattice.matrix)
    best = float("inf")
    for i in range(-rng, rng + 1):
        for j in range(-rng, rng + 1):
            for k in range(-rng, rng + 1):
                if i == 0 and j == 0 and k == 0:
                    continue
                v = i * M[0] + j * M[1] + k * M[2]
                d = float(np.linalg.norm(v))
                if d < best:
                    best = d
    return best


@dataclass
class SupercellChoice:
    matrix: np.ndarray
    k: int
    min_face_width: float
    volume: float
    n_hnf_scanned: int
    notes: str = ""
    shortest_vector: float = 0.0


def find_supercell(lattice: Lattice, k: int) -> SupercellChoice:
    """Pick the det=k integer matrix maximising the shortest lattice vector.

    For k=1 this returns the identity.  For prime k the only HNFs are diagonal,
    so the result is the best axis scaling; for composite k a non-diagonal
    (skewed but more isotropic) matrix may win.  The score is the shortest
    non-zero lattice vector (true nearest self-image distance), with the min
    face width kept for reference.
    """
    if k <= 0:
        raise ValueError(f"k must be positive, got {k}")
    if k == 1:
        return SupercellChoice(
            np.eye(3, dtype=int), 1, float(min(lattice.lengths)),
            float(lattice.volume), 1,
            shortest_vector=shortest_lattice_vector(lattice))

    best: Optional[SupercellChoice] = None
    scanned = 0
    for H in hermite_normal_forms(k):
        scanned += 1
        width, vol = face_widths(lattice, H)
        slv = shortest_lattice_vector(lattice, H)
        if best is None or slv > best.shortest_vector + 1e-9:
            best = SupercellChoice(H, k, width, vol, scanned, shortest_vector=slv)
    if best is None:  # pragma: no cover - only if k huge and capped
        M = np.diag([k, 1, 1])
        best = SupercellChoice(M, k, float(min(lattice.lengths)),
                               float(lattice.volume), scanned,
                               notes="HNF enumeration capped; diagonal fallback",
                               shortest_vector=shortest_lattice_vector(lattice, M))
    best.n_hnf_scanned = scanned
    return best
