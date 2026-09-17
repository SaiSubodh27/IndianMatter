"""Batch and single-CIF structural embeddings through the configured M3GNet runtime.

This service never substitutes handcrafted or zero-filled vectors. The installed
MatGL model must expose a representation/embedding method; otherwise the caller
receives an explicit capability error.
"""

from dataclasses import dataclass
from pathlib import Path
from typing import Any, Iterable

import numpy as np

from parsing.structure_parser import parse_structure_input
from prediction_models.m3gnet_adapter import M3GNetAdapter


@dataclass
class CIFEmbedding:
    source: str
    formula: str
    embedding: list[float]
    model: str = "M3GNet"


def _load_structure(source: str | Path):
    structure, summary = parse_structure_input(str(source))
    if structure is None:
        raise ValueError(f"Could not parse CIF '{source}': {summary.get('error', 'unknown error')}")
    return structure


def _call_representation(model: Any, structure: Any) -> np.ndarray:
    """Call a real representation method exposed by the loaded MatGL model."""
    for method_name in ("get_structure_embedding", "get_embedding", "encode_structure", "get_representation"):
        method = getattr(model, method_name, None)
        if callable(method):
            value = method(structure)
            vector = np.asarray(value, dtype=float).reshape(-1)
            if vector.size:
                return vector
    raise RuntimeError(
        "The loaded M3GNet model does not expose a structural embedding API. "
        "No embedding was fabricated."
    )


def extract_cif_embeddings(
    sources: str | Path | Iterable[str | Path],
    adapter: M3GNetAdapter | None = None,
) -> list[CIFEmbedding]:
    """Extract embeddings for one CIF path or an iterable of CIF paths."""
    paths = [sources] if isinstance(sources, (str, Path)) else list(sources)
    runtime = adapter or M3GNetAdapter()
    if not runtime.load_model():
        raise RuntimeError(
            "M3GNet is unavailable. Install a compatible MatGL/DGL runtime and "
            "the M3GNet model before extracting embeddings."
        )

    model = runtime.potential
    if model is None:
        raise RuntimeError("M3GNet loaded without a model instance.")

    results: list[CIFEmbedding] = []
    for source in paths:
        structure = _load_structure(source)
        vector = _call_representation(model, structure)
        results.append(
            CIFEmbedding(
                source=str(source),
                formula=structure.composition.reduced_formula,
                embedding=vector.tolist(),
            )
        )
    return results
