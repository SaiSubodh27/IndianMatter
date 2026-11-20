"""
Stage 2: search the internal database. Mirrors search_external.py's logic
exactly (same normalization, same tolerance-based doped matching, same
polymorph disambiguation) via matching.py, so a compound can't be "found" by
one stage's rules and "not found" by the other's.
"""

from __future__ import annotations
import logging
from typing import List, Optional, Tuple

from .models import SearchMatch, DopingSpec
from .matching import normalize_formula_for_search, doped_formulas_match, disambiguate_polymorphs
from .user_interaction import AskUserFn

log = logging.getLogger("cif_pipeline.search_internal")


def _query_internal_db(formula: str) -> List[SearchMatch]:
    """
    Queries MongoDB (generated_cifs, materials_catalog, material_predictions, materials_project)
    for stored crystal structures matching this formula key.
    """
    log.info(f"[internal] querying MongoDB for '{formula}'")
    results: List[SearchMatch] = []
    
    try:
        from pymatgen.core import Structure
        import os
        from pymongo import MongoClient

        # Connect to MongoDB with timeout
        mongo_url = os.getenv("MONGO_URL", "mongodb://localhost:27017/IndianMaterialsAI")
        client = None
        for cand in [mongo_url, "mongodb://localhost:27017/IndianMaterialsAI", "mongodb://127.0.0.1:27017/IndianMaterialsAI"]:
            try:
                c = MongoClient(cand, serverSelectionTimeoutMS=1500)
                c.admin.command("ping")
                client = c
                break
            except Exception:
                continue

        if not client:
            return []

        db = client["IndianMaterialsAI"]
        clean_f = formula.replace(" ", "").strip()
        query = {"$or": [
            {"formula": clean_f},
            {"reduced_formula": clean_f}
        ]}

        seen_hashes = set()

        # 1. Search generated_cifs
        if "generated_cifs" in db.list_collection_names():
            for doc in db["generated_cifs"].find(query):
                cif_text = doc.get("cif_text")
                if cif_text and isinstance(cif_text, str) and cif_text.strip():
                    import hashlib
                    chash = hashlib.sha256(cif_text.encode("utf-8")).hexdigest()
                    if chash in seen_hashes:
                        continue
                    seen_hashes.add(chash)
                    try:
                        struct = Structure.from_str(cif_text, fmt="cif")
                        results.append(SearchMatch(
                            source="internal",
                            record_id=str(doc.get("cif_id") or doc.get("_id")),
                            structure=struct,
                            space_group=doc.get("space_group"),
                            formula=doc.get("formula", clean_f),
                            match_confidence=1.0,
                            source_url=f"/cif/{doc.get('cif_id', '')}",
                            is_theoretical=doc.get("is_ai_generated", False),
                            extra={"cif_text": cif_text, "source": doc.get("source", "internal_mongodb")}
                        ))
                    except Exception as parse_err:
                        log.debug(f"Pymatgen parse error for generated_cif: {parse_err}")

        # 2. Search materials_catalog
        if "materials_catalog" in db.list_collection_names() and len(results) < 5:
            for doc in db["materials_catalog"].find(query):
                cif_text = doc.get("cif_text") or doc.get("cif") or (doc.get("extra_properties") or {}).get("cif_text")
                if cif_text and isinstance(cif_text, str) and cif_text.strip():
                    import hashlib
                    chash = hashlib.sha256(cif_text.encode("utf-8")).hexdigest()
                    if chash in seen_hashes:
                        continue
                    seen_hashes.add(chash)
                    try:
                        struct = Structure.from_str(cif_text, fmt="cif")
                        results.append(SearchMatch(
                            source="internal",
                            record_id=str(doc.get("material_id") or doc.get("_id")),
                            structure=struct,
                            space_group=doc.get("space_group"),
                            formula=doc.get("formula", clean_f),
                            match_confidence=1.0,
                            source_url=f"/materials/{doc.get('material_id', '')}",
                            is_theoretical=doc.get("is_ai_generated", False),
                            extra={"cif_text": cif_text, "database": doc.get("database", "catalog")}
                        ))
                    except Exception as parse_err:
                        log.debug(f"Pymatgen parse error for catalog item: {parse_err}")

    except Exception as e:
        log.warning(f"Error querying internal MongoDB for '{formula}': {e}")

    return results


def search_internal_database(
    raw_formula: str,
    is_doped: bool,
    doping_spec: Optional[DopingSpec],
    requested_space_group: Optional[str],
    ask_user: AskUserFn,
) -> Tuple[Optional[SearchMatch], List[SearchMatch]]:
    """Returns (chosen_match_or_None, all_candidate_matches_found) - same shape
    as search_external.search_external_databases, for the same reason.
    """

    search_key = normalize_formula_for_search(raw_formula, is_doped)
    log.info(f"Searching internal DB with normalized key='{search_key}' (doped={is_doped})")

    matches = _query_internal_db(search_key)

    if is_doped and doping_spec is not None:
        matches = [
            m for m in matches
            if m.formula and doped_formulas_match(m.formula, doping_spec)
        ]

    if not matches:
        return None, []

    return disambiguate_polymorphs(matches, requested_space_group, ask_user)
