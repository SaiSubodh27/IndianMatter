"""
cif_storage_service.py
======================
MongoDB persistence and retrieval service for all generated CIF files.
Every CIF produced by the CrystaLLM pipeline, MACE-MP-0 relaxer, Doping Engine,
or Materials Project CifWriter is automatically:
1. Validated and parsed via pymatgen.
2. Fingerprinted with SHA-256 (cif_hash) to avoid duplicates.
3. Enriched with predicted physical/elastic properties (CrystalFormer + CHGNet + Physics).
4. Persisted into the dedicated MongoDB `generated_cifs` collection.
5. Dual-indexed into `materials_catalog` (database: "cif_generated") and `lithium_materials` (if Li).
"""

import os
import io
import hashlib
import logging
from datetime import datetime
from typing import Optional, Dict, Any, List
from pymongo import UpdateOne

try:
    from database import db, MONGO_AVAILABLE
except ImportError:
    from backend.database import db, MONGO_AVAILABLE

try:
    from materials_catalog_service import (
        upsert_materials,
        calculate_and_infill_properties,
        classify_lithium_family,
        normalize_formula,
        extract_elements,
        safe_float,
    )
except ImportError:
    from backend.materials_catalog_service import (
        upsert_materials,
        calculate_and_infill_properties,
        classify_lithium_family,
        normalize_formula,
        extract_elements,
        safe_float,
    )

try:
    from materials_db_service import save_material_prediction
except ImportError:
    from backend.materials_db_service import save_material_prediction

log = logging.getLogger("cif_storage_service")


def _init_cif_indexes():
    """Initializes high-performance indexes on generated_cifs collection."""
    if db is not None:
        try:
            coll = db["generated_cifs"]
            coll.create_index("cif_id", unique=True)
            coll.create_index("cif_hash", unique=True)
            coll.create_index("formula")
            coll.create_index("reduced_formula")
            coll.create_index("elements")
            coll.create_index("source")
            coll.create_index("created_at")
            coll.create_index([("formula", 1), ("source", 1)])
        except Exception as e:
            log.warning(f"Notice creating indexes on generated_cifs: {e}")


_init_cif_indexes()


def compute_cif_hash(cif_text: str) -> str:
    """Generates a SHA-256 hash of normalized CIF content."""
    if not cif_text:
        return ""
    normalized = "".join(cif_text.split())
    return hashlib.sha256(normalized.encode("utf-8")).hexdigest()


def save_generated_cif(
    cif_text: str,
    formula: Optional[str] = None,
    source: str = "CrystaLLM CIF Generator",
    metadata: Optional[Dict[str, Any]] = None
) -> Optional[Dict[str, Any]]:
    """
    Saves a generated CIF file into MongoDB `generated_cifs` collection.
    Automatically parses structural geometry, calculates missing properties,
    and indexes into materials_catalog and lithium_materials (if Li).
    """
    if not cif_text or not isinstance(cif_text, str) or not cif_text.strip():
        return None

    if db is None:
        log.warning("MongoDB not connected; cannot store generated CIF.")
        return None

    try:
        now = datetime.utcnow()
        cif_clean = cif_text.strip()
        c_hash = compute_cif_hash(cif_clean)
        cif_id = f"cif-{c_hash[:12]}"

        # Parse structure via pymatgen
        structure = None
        parsed_formula = formula or "Unknown"
        sg_symbol = "Unknown"
        sg_number = 0
        cs = "Unknown"
        density = None
        volume = None
        nsites = None
        lattice_data = {}

        try:
            from pymatgen.io.cif import CifParser
            parser = CifParser(io.StringIO(cif_clean))
            structures = parser.parse_structures(primitive=False)
            if structures:
                structure = structures[0]
                parsed_formula = structure.composition.reduced_formula
                sg_symbol, sg_number = structure.get_space_group_info()
                cs = structure.lattice.crystal_system.title() if hasattr(structure.lattice, "crystal_system") else "Unknown"
                density = round(float(structure.density), 3)
                volume = round(float(structure.lattice.volume), 3)
                nsites = len(structure)
                lat = structure.lattice
                lattice_data = {
                    "a": round(float(lat.a), 4),
                    "b": round(float(lat.b), 4),
                    "c": round(float(lat.c), 4),
                    "alpha": round(float(lat.alpha), 3),
                    "beta": round(float(lat.beta), 3),
                    "gamma": round(float(lat.gamma), 3),
                    "volume": volume,
                }
        except Exception as parse_err:
            log.debug(f"Pymatgen parsing notice for CIF: {parse_err}")

        clean_formula = normalize_formula(parsed_formula or formula or "Unknown")
        elements = extract_elements(clean_formula)

        meta = dict(metadata or {})
        is_doped = meta.get("is_doped", False) or "doped" in source.lower()

        # Build material record and run property infilling
        item_doc = {
            "material_id": cif_id,
            "formula": clean_formula,
            "space_group": sg_symbol,
            "crystal_system": cs,
            "density": density,
            "cif_text": cif_clean,
            "extra_properties": meta
        }
        enriched = calculate_and_infill_properties(item_doc)

        cif_doc = {
            "cif_id": cif_id,
            "cif_hash": c_hash,
            "formula": clean_formula,
            "reduced_formula": clean_formula,
            "elements": elements,
            "source": source,
            "is_doped": bool(is_doped),
            "space_group": sg_symbol,
            "space_group_number": int(sg_number),
            "crystal_system": cs,
            "density": enriched.get("density"),
            "volume": volume,
            "nsites": nsites,
            "lattice": lattice_data,
            "band_gap": enriched.get("band_gap"),
            "formation_energy": enriched.get("formation_energy"),
            "e_hull": enriched.get("e_hull"),
            "bulk_modulus": enriched.get("bulk_modulus"),
            "shear_modulus": enriched.get("shear_modulus"),
            "is_stable": enriched.get("is_stable"),
            "cif_text": cif_clean,
            "metadata": meta,
            "updated_at": now
        }

        # 1. Upsert into generated_cifs collection
        coll = db["generated_cifs"]
        coll.update_one(
            {"cif_hash": c_hash},
            {"$set": cif_doc, "$setOnInsert": {"created_at": now}},
            upsert=True
        )

        # 2. Dual-index into materials_catalog
        try:
            upsert_materials("cif_generated", [enriched])
        except Exception as cat_err:
            log.debug(f"Catalog sync notice: {cat_err}")

        # 3. Dual-index into lithium_materials if formula contains Li
        if "Li" in elements or "LI" in clean_formula.upper():
            try:
                fam = classify_lithium_family(clean_formula, elements)
                lith_doc = {
                    "material_id": cif_id,
                    "family": fam["family"],
                    "family_name": fam["family_name"],
                    "canonical_formula": fam["canonical_formula"],
                    "formula": clean_formula,
                    "reduced_formula": clean_formula,
                    "database": "cif_generated",
                    "elements": elements,
                    "category": fam["category"],
                    "crystal_structure": fam["crystal_structure"],
                    "space_group": sg_symbol,
                    "crystal_system": cs,
                    "density": enriched.get("density"),
                    "band_gap": enriched.get("band_gap"),
                    "formation_energy": enriched.get("formation_energy"),
                    "e_hull": enriched.get("e_hull"),
                    "bulk_modulus": enriched.get("bulk_modulus"),
                    "shear_modulus": enriched.get("shear_modulus"),
                    "is_stable": enriched.get("is_stable"),
                    "cif_text": cif_clean,
                    "updated_at": now
                }
                db["lithium_materials"].update_one(
                    {"material_id": cif_id},
                    {"$set": lith_doc, "$setOnInsert": {"created_at": now}},
                    upsert=True
                )
            except Exception as lith_err:
                log.debug(f"Lithium sync notice: {lith_err}")

        # 4. Save into material_predictions collection with standard DirectPredictionResponse shape
        try:
            pred_props = {}
            for p_key, p_val, p_unit in [
                ("bulk_modulus", enriched.get("bulk_modulus"), "GPa"),
                ("shear_modulus", enriched.get("shear_modulus"), "GPa"),
                ("formation_energy", enriched.get("formation_energy"), "eV/atom"),
                ("band_gap", enriched.get("band_gap"), "eV"),
                ("ehull", enriched.get("e_hull"), "eV/atom"),
                ("is_stable", enriched.get("is_stable"), ""),
            ]:
                if p_val is not None:
                    pred_props[p_key] = {
                        "property_key": p_key,
                        "value": p_val,
                        "unit": p_unit,
                        "status": "calculated",
                        "source_model": f"Generated ({source})"
                    }

            std_pred_payload = {
                "status": "success",
                "material_metadata": {
                    "formula": clean_formula,
                    "volume_A3": volume or 0.0,
                    "density_g_cm3": enriched.get("density") or 0.0,
                    "num_sites": nsites or 0
                },
                "model_used": f"Generated ({source})",
                "base_outputs": {
                    "energy_per_atom": {
                        "value": enriched.get("formation_energy"),
                        "unit": "eV/atom",
                        "status": "calculated" if enriched.get("formation_energy") is not None else "unavailable"
                    }
                },
                "properties": pred_props,
                "raw_enriched": enriched
            }

            save_material_prediction(
                formula=clean_formula,
                full_payload=std_pred_payload,
                reduced_formula=clean_formula,
                structure=structure,
                cif_text=cif_clean,
                filename=f"{clean_formula}.cif",
                source=f"Generated ({source})"
            )
        except Exception as pred_err:
            log.debug(f"Prediction sync notice: {pred_err}")

        log.info(f"[MongoDB] Stored generated CIF for '{clean_formula}' (ID: {cif_id}) successfully!")
        return cif_doc

    except Exception as e:
        log.error(f"Error storing generated CIF in MongoDB: {e}", exc_info=True)
        return None


def get_generated_cif_by_id(cif_id: str) -> Optional[Dict[str, Any]]:
    """Retrieves a generated CIF record by cif_id or cif_hash."""
    if db is None:
        return None
    clean_id = cif_id.strip()
    return db["generated_cifs"].find_one(
        {"$or": [{"cif_id": clean_id}, {"cif_hash": clean_id}]},
        {"_id": 0}
    )


def query_generated_cifs(
    formula: Optional[str] = None,
    source: Optional[str] = None,
    limit: int = 50,
    skip: int = 0
) -> List[Dict[str, Any]]:
    """Lists stored generated CIFs with sorting and pagination."""
    if db is None:
        return []
    q = {}
    if formula and formula.strip():
        cf = normalize_formula(formula)
        q["$or"] = [
            {"formula": cf},
            {"reduced_formula": cf},
            {"formula": {"$regex": f"^{cf}", "$options": "i"}}
        ]
    if source and source.strip() and source.lower() != "all":
        q["source"] = {"$regex": source.strip(), "$options": "i"}

    cursor = db["generated_cifs"].find(q, {"_id": 0}).sort("created_at", -1).skip(skip).limit(limit)
    return list(cursor)
