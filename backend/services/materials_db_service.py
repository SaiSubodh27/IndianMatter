"""
materials_db_service.py
========================
MongoDB caching and persistence service for material property predictions.
Stores all calculated physical, quantum, thermodynamic, and mechanical properties.
Provides instant retrieval for repeated queries by formula or CIF hash.
"""

import os
import hashlib
import logging
from datetime import datetime
from typing import Optional, Dict, Any, List
from bson import ObjectId

log = logging.getLogger("materials_db_service")

# Import database collections from backend.database
try:
    from database import db, MONGO_AVAILABLE
    if db is not None:
        predictions_collection = db["material_predictions"]
        try:
            predictions_collection.create_index("formula")
            predictions_collection.create_index("reduced_formula")
            predictions_collection.create_index("cif_hash")
            predictions_collection.create_index("created_at")
        except Exception as idx_err:
            log.warning(f"Failed to create indexes on material_predictions: {idx_err}")
    else:
        predictions_collection = None
except Exception as e:
    log.warning(f"Could not import database in materials_db_service: {e}")
    db = None
    predictions_collection = None
    MONGO_AVAILABLE = False


def _clean_for_mongo(obj: Any) -> Any:
    """Recursively clean dict/list to remove floats like NaN or Infinity which MongoDB rejects."""
    import math
    if isinstance(obj, dict):
        return {k: _clean_for_mongo(v) for k, v in obj.items()}
    elif isinstance(obj, list):
        return [_clean_for_mongo(item) for item in obj]
    elif isinstance(obj, float):
        if math.isnan(obj) or math.isinf(obj):
            return None
        return obj
    elif isinstance(obj, ObjectId):
        return str(obj)
    return obj


def compute_cif_hash(cif_text: str) -> str:
    """Generates a SHA-256 hash of normalized CIF content."""
    if not cif_text:
        return ""
    normalized = "".join(cif_text.split())
    return hashlib.sha256(normalized.encode("utf-8")).hexdigest()


def normalize_formula(formula: str) -> str:
    """Standardizes formula string representation."""
    if not formula:
        return ""
    # Strip spaces
    clean = str(formula).replace(" ", "").strip()
    return clean


def get_cached_prediction(
    formula: Optional[str] = None,
    reduced_formula: Optional[str] = None,
    cif_text: Optional[str] = None
) -> Optional[Dict[str, Any]]:
    """
    Looks up MongoDB for an existing prediction calculation.
    Matches primarily by CIF hash (exact structure match), or by normalized formula.
    """
    if predictions_collection is None:
        return None

    try:
        query_conditions = []

        if cif_text and cif_text.strip():
            chash = compute_cif_hash(cif_text)
            if chash:
                query_conditions.append({"cif_hash": chash})

        clean_formula = normalize_formula(formula) if formula else None
        clean_reduced = normalize_formula(reduced_formula) if reduced_formula else None

        if clean_reduced:
            query_conditions.append({"reduced_formula": clean_reduced})
            query_conditions.append({"formula": clean_reduced})

        if clean_formula:
            query_conditions.append({"formula": clean_formula})
            query_conditions.append({"reduced_formula": clean_formula})

        if not query_conditions:
            return None

        # Find the most recently updated matching prediction
        doc = predictions_collection.find_one(
            {"$or": query_conditions},
            sort=[("updated_at", -1)]
        )

        if doc:
            doc["_id"] = str(doc["_id"])
            log.info(f"[MongoDB Cache HIT] Retrieved stored prediction for formula='{doc.get('formula')}' (ID: {doc['_id']})")
            return doc

        return None
    except Exception as e:
        log.warning(f"Error querying MongoDB prediction cache: {e}")
        return None


def save_material_prediction(
    formula: str,
    full_payload: Dict[str, Any],
    reduced_formula: Optional[str] = None,
    structure: Optional[Any] = None,
    cif_text: Optional[str] = None,
    filename: Optional[str] = None,
    source: str = "CrystalFormer",
    temperature_k: float = 298.15
) -> Optional[str]:
    """
    Saves or updates a material prediction in the MongoDB `material_predictions` collection.
    Upserts by reduced_formula or formula so duplicates are updated rather than multiplied.
    """
    if predictions_collection is None:
        return None

    try:
        clean_formula = normalize_formula(formula)
        clean_reduced = normalize_formula(reduced_formula or formula)
        c_hash = compute_cif_hash(cif_text) if cif_text else ""

        # Extract summary key properties for fast indexing and table display
        core_props = full_payload.get("core_properties", {})
        derived_props = full_payload.get("derived_properties", {})
        aux_metrics = full_payload.get("auxiliary_metrics", {})
        stability_info = full_payload.get("stability", {})
        properties_dict = full_payload.get("properties", {})

        # Helper to extract property value
        def _get_val(key_name, fallback=None):
            if key_name in full_payload and full_payload[key_name] is not None:
                return full_payload[key_name]
            if key_name in core_props and core_props[key_name] is not None:
                return core_props[key_name]
            if key_name in derived_props and derived_props[key_name] is not None:
                return derived_props[key_name]
            if key_name in aux_metrics and aux_metrics[key_name] is not None:
                return aux_metrics[key_name]
            if key_name in stability_info and stability_info[key_name] is not None:
                return stability_info[key_name]
            if key_name in properties_dict:
                p = properties_dict[key_name]
                if isinstance(p, dict):
                    return p.get("value")
                return p
            return fallback

        def _get_first(keys, fallback=None):
            for k in keys:
                v = _get_val(k)
                if v is not None:
                    return v
            return fallback

        bulk_modulus = _get_first(["bulk_modulus_GPa", "bulk_modulus", "bulk"])
        shear_modulus = _get_first(["shear_modulus_GPa", "shear_modulus", "shear"])
        youngs_modulus = _get_first(["youngs_modulus_GPa", "youngs_modulus"])
        formation_energy = _get_first(["formation_energy_eV_atom", "formation_energy", "formation_energy_per_atom"])
        band_gap = _get_first(["band_gap_eV", "band_gap"])
        ehull = _get_first(["ehull_eV_per_atom", "ehull", "energy_above_hull"])
        is_stable = _get_first(["is_stable"])
        stability_status = _get_first(["stability_status"], fallback="Unknown")
        conductivity_e = _get_first(["electronic_conductivity_S_cm", "electronic_conductivity"])
        conductivity_i = _get_first(["ionic_conductivity_S_cm", "ionic_conductivity"])

        # Structural metadata
        meta = full_payload.get("material_metadata", {})
        volume_a3 = meta.get("volume_A3")
        density = meta.get("density_g_cm3")
        nsites = meta.get("num_sites")

        if structure is not None:
            try:
                volume_a3 = volume_a3 or float(structure.lattice.volume)
                density = density or float(structure.density)
                nsites = nsites or int(len(structure))
            except Exception:
                pass

        now = datetime.utcnow()

        document = {
            "formula": clean_formula,
            "reduced_formula": clean_reduced,
            "cif_hash": c_hash,
            "filename": filename or f"{clean_formula}.cif",
            "source_model": source or full_payload.get("model_source", "CrystalFormer"),
            "temperature_k": temperature_k,
            "metadata": {
                "volume_A3": volume_a3,
                "density_g_cm3": density,
                "num_sites": nsites,
            },
            "summary_metrics": {
                "bulk_modulus_GPa": bulk_modulus,
                "shear_modulus_GPa": shear_modulus,
                "youngs_modulus_GPa": youngs_modulus,
                "formation_energy_eV_atom": formation_energy,
                "band_gap_eV": band_gap,
                "ehull_eV_per_atom": ehull,
                "is_stable": is_stable,
                "stability_status": stability_status,
                "electronic_conductivity_S_cm": conductivity_e,
                "ionic_conductivity_S_cm": conductivity_i,
            },
            "cif_content": cif_text if cif_text and len(cif_text) < 100000 else None,
            "full_prediction_payload": _clean_for_mongo(full_payload),
            "updated_at": now
        }

        # Query condition for upsert
        filter_q = {"$or": [
            {"reduced_formula": clean_reduced},
            {"formula": clean_formula}
        ]}
        if c_hash:
            filter_q = {"$or": [
                {"cif_hash": c_hash},
                {"reduced_formula": clean_reduced}
            ]}

        existing = predictions_collection.find_one(filter_q)
        if existing:
            document["created_at"] = existing.get("created_at", now)
            predictions_collection.update_one({"_id": existing["_id"]}, {"$set": document})
            doc_id = str(existing["_id"])
            log.info(f"[MongoDB UPDATED] Material '{clean_formula}' updated in DB (ID: {doc_id})")
        else:
            document["created_at"] = now
            result = predictions_collection.insert_one(document)
            doc_id = str(result.inserted_id)
            log.info(f"[MongoDB INSERTED] Material '{clean_formula}' saved to DB (ID: {doc_id})")

        return doc_id
    except Exception as e:
        log.warning(f"Failed to save material prediction to MongoDB: {e}")
        return None


def list_cached_predictions(
    query: Optional[str] = None,
    is_stable: Optional[bool] = None,
    page: int = 1,
    limit: int = 50
) -> Dict[str, Any]:
    """
    Returns a paginated list of all stored material predictions from MongoDB.
    """
    if predictions_collection is None:
        return {"total": 0, "page": page, "limit": limit, "items": []}

    try:
        filter_dict: Dict[str, Any] = {}

        if query and query.strip():
            clean_q = query.strip()
            filter_dict["$or"] = [
                {"formula": {"$regex": clean_q, "$options": "i"}},
                {"reduced_formula": {"$regex": clean_q, "$options": "i"}},
                {"filename": {"$regex": clean_q, "$options": "i"}},
            ]

        if is_stable is not None:
            filter_dict["summary_metrics.is_stable"] = is_stable

        total = predictions_collection.count_documents(filter_dict)
        skip = max(0, (page - 1) * limit)

        cursor = predictions_collection.find(filter_dict)\
            .sort("updated_at", -1)\
            .skip(skip)\
            .limit(limit)

        items = []
        for doc in cursor:
            items.append({
                "id": str(doc["_id"]),
                "formula": doc.get("formula"),
                "reduced_formula": doc.get("reduced_formula"),
                "filename": doc.get("filename"),
                "source_model": doc.get("source_model"),
                "temperature_k": doc.get("temperature_k"),
                "metadata": doc.get("metadata", {}),
                "metrics": doc.get("summary_metrics", {}),
                "created_at": doc.get("created_at").isoformat() if doc.get("created_at") else None,
                "updated_at": doc.get("updated_at").isoformat() if doc.get("updated_at") else None,
                "has_cif": bool(doc.get("cif_content"))
            })

        return {
            "total": total,
            "page": page,
            "limit": limit,
            "items": items
        }
    except Exception as e:
        log.warning(f"Error listing MongoDB predictions: {e}")
        return {"total": 0, "page": page, "limit": limit, "items": [], "error": str(e)}


def get_prediction_detail(record_id: str) -> Optional[Dict[str, Any]]:
    """Retrieves full prediction record by MongoDB ObjectId."""
    if predictions_collection is None:
        return None
    try:
        doc = predictions_collection.find_one({"_id": ObjectId(record_id)})
        if doc:
            doc["_id"] = str(doc["_id"])
            if "created_at" in doc and doc["created_at"]:
                doc["created_at"] = doc["created_at"].isoformat()
            if "updated_at" in doc and doc["updated_at"]:
                doc["updated_at"] = doc["updated_at"].isoformat()
            return doc
        return None
    except Exception as e:
        log.warning(f"Error fetching record {record_id} from MongoDB: {e}")
        return None


def delete_prediction_record(record_id: str) -> bool:
    """Deletes a prediction record by MongoDB ObjectId."""
    if predictions_collection is None:
        return False
    try:
        res = predictions_collection.delete_one({"_id": ObjectId(record_id)})
        return res.deleted_count > 0
    except Exception as e:
        log.warning(f"Error deleting record {record_id}: {e}")
        return False


def get_database_overview() -> Dict[str, Any]:
    """Returns high-level statistics for the stored materials database."""
    if predictions_collection is None:
        return {"connected": False, "total_records": 0, "message": "MongoDB not connected."}

    try:
        total = predictions_collection.count_documents({})
        stable_count = predictions_collection.count_documents({"summary_metrics.is_stable": True})
        metastable_count = predictions_collection.count_documents({
            "summary_metrics.stability_status": {"$regex": "Metastable", "$options": "i"}
        })

        # Most recent material
        latest = predictions_collection.find_one(sort=[("updated_at", -1)])
        latest_formula = latest.get("formula") if latest else None
        latest_time = latest.get("updated_at").isoformat() if latest and latest.get("updated_at") else None

        return {
            "connected": True,
            "database_name": "IndianMaterialsAI",
            "collection_name": "material_predictions",
            "total_records": total,
            "stable_records": stable_count,
            "metastable_records": metastable_count,
            "latest_material": latest_formula,
            "last_updated": latest_time
        }
    except Exception as e:
        return {"connected": False, "error": str(e)}

