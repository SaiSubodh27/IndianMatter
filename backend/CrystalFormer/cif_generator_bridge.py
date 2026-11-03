"""
cif_generator_bridge.py -- Bridge between cif_pipeline and CrystalFormer.

Allows synthesizing and relaxing a crystallographic structure from a chemical
formula or doping specification, then passing the generated Structure / CIF
directly to CrystalFormer.
"""

from __future__ import annotations
import logging
from typing import Optional, Dict, Any, Tuple
from pymatgen.core import Structure

log = logging.getLogger("CrystalFormer.cif_generator_bridge")


def generate_cif_from_formula(
    formula: str,
    mp_api_key: Optional[str] = None,
    space_group: Optional[str] = None,
    is_doped_hint: Optional[bool] = None,
    host_formula: Optional[str] = None,
    dopant_element: Optional[str] = None,
    dopant_fraction: Optional[float] = None,
    host_site_species: Optional[str] = None,
    max_iterations: int = 5,
    samples_per_iteration: int = 25,
) -> Tuple[str, Structure, Dict[str, Any]]:
    """
    Synthesize and relax a CIF structure from a chemical formula or description.
    
    Returns:
        (cif_string, structure, metadata_dict)
    """
    clean_formula = formula.strip() if formula else ""
    if not clean_formula:
        raise ValueError("A non-empty material formula or chemical name is required.")

    try:
        from cif_pipeline.models import CompoundQuery
        from cif_pipeline.orchestrator import run_pipeline, structure_to_cif
        from cif_pipeline.config import get_mp_api_key
    except ImportError as e:
        # If relative import fails, try backend.cif_pipeline
        try:
            from backend.cif_pipeline.models import CompoundQuery
            from backend.cif_pipeline.orchestrator import run_pipeline, structure_to_cif
            from backend.cif_pipeline.config import get_mp_api_key
        except ImportError:
            raise RuntimeError(f"cif_pipeline could not be loaded: {e}")

    api_key = mp_api_key or get_mp_api_key()

    query = CompoundQuery(
        raw_input=clean_formula,
        is_doped_hint=is_doped_hint,
        host_formula=host_formula,
        dopant_element=dopant_element,
        dopant_fraction=dopant_fraction,
        host_site_species=host_site_species,
        space_group=space_group,
    )

    log.info(f"Synthesizing CIF for query: {clean_formula} ...")
    res = run_pipeline(
        query=query,
        mp_api_key=api_key,
        max_iterations=max_iterations,
        samples_per_iteration=samples_per_iteration,
    )

    if not res.success or res.structure is None:
        notes = res.notes or "Failed to synthesize valid crystal structure from formula."
        raise RuntimeError(f"CIF generation error for '{clean_formula}': {notes}")

    cif_str = res.cif_string or structure_to_cif(res.structure)
    structure = res.structure

    meta = {
        "formula": structure.composition.reduced_formula,
        "source": res.provenance or "cif_pipeline_synthesized",
        "notes": res.notes,
        "is_relaxed": bool(res.relaxed),
        "num_sites": len(structure),
        "volume_A3": float(structure.lattice.volume),
        "density_g_cm3": float(structure.density),
    }

    return cif_str, structure, meta
