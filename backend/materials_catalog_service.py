"""
materials_catalog_service.py
============================
MongoDB persistence and fast-lookup catalog service for multi-database materials.
Unifies materials from:
  1. IndianMatter Database (38,510 materials)
  2. Materials Project (MP API cached results)
  3. OQMD (Open Quantum Materials Database cached results)
  4. AFLOW (AFLUX API cached results)
  5. JARVIS-DFT (NIST OPTIMADE API cached results)
  6. Obliex Dataset (Lithium/Solid-State Electrolyte structures)

All materials are indexed by material_id, formula, elements, band_gap, formation_energy,
e_hull, and stability for sub-millisecond querying without network latency.
"""

import os
import re
import math
import logging
from datetime import datetime
from typing import Optional, List, Dict, Any
from pymongo import UpdateOne

log = logging.getLogger("materials_catalog_service")

# Database connection
try:
    try:
        from database import db, MONGO_AVAILABLE
    except ImportError:
        from backend.database import db, MONGO_AVAILABLE
except Exception as e:
    log.warning(f"Could not import database in materials_catalog_service: {e}")
    db = None
    MONGO_AVAILABLE = False

if db is not None:
    catalog_collection = db["materials_catalog"]
    try:
        catalog_collection.create_index("material_id", unique=True)
        catalog_collection.create_index("database")
        catalog_collection.create_index("formula")
        catalog_collection.create_index("reduced_formula")
        catalog_collection.create_index("elements")
        catalog_collection.create_index([("database", 1), ("formula", 1)])
        catalog_collection.create_index([("database", 1), ("elements", 1)])
        catalog_collection.create_index([("database", 1), ("band_gap", 1)])
        catalog_collection.create_index([("database", 1), ("e_hull", 1)])
        catalog_collection.create_index([("database", 1), ("is_stable", 1)])
    except Exception as idx_err:
        log.warning(f"Failed to create indexes on materials_catalog: {idx_err}")
else:
    catalog_collection = None

# IUPAC 118 Chemical Elements
VALID_ELEMENTS = {
    "H", "He", "Li", "Be", "B", "C", "N", "O", "F", "Ne",
    "Na", "Mg", "Al", "Si", "P", "S", "Cl", "Ar", "K", "Ca",
    "Sc", "Ti", "V", "Cr", "Mn", "Fe", "Co", "Ni", "Cu", "Zn",
    "Ga", "Ge", "As", "Se", "Br", "Kr", "Rb", "Sr", "Y", "Zr",
    "Nb", "Mo", "Tc", "Ru", "Rh", "Pd", "Ag", "Cd", "In", "Sn",
    "Sb", "Te", "I", "Xe", "Cs", "Ba", "La", "Ce", "Pr", "Nd",
    "Pm", "Sm", "Eu", "Gd", "Tb", "Dy", "Ho", "Er", "Tm", "Yb",
    "Lu", "Hf", "Ta", "W", "Re", "Os", "Ir", "Pt", "Au", "Hg",
    "Tl", "Pb", "Bi", "Po", "At", "Rn", "Fr", "Ra", "Ac", "Th",
    "Pa", "U", "Np", "Pu", "Am", "Cm", "Bk", "Cf", "Es", "Fm",
    "Md", "No", "Lr", "Rf", "Db", "Sg", "Bh", "Hs", "Mt", "Ds",
    "Rg", "Cn", "Nh", "Fl", "Mc", "Lv", "Ts", "Og"
}


def safe_float(val: Any, default: Optional[float] = None) -> Optional[float]:
    """Converts a value to float, converting NaN/inf to None for MongoDB compatibility."""
    if val is None or val == "":
        return default
    try:
        f = float(val)
        if math.isnan(f) or math.isinf(f):
            return default
        return round(f, 4)
    except (TypeError, ValueError):
        return default


def extract_elements(formula: str) -> List[str]:
    """Extracts unique chemical elements from a formula string (e.g. 'Li3Ag2AuO4' -> ['Ag', 'Au', 'Li', 'O'])."""
    if not formula:
        return []
    found = {match for match in re.findall(r'([A-Z][a-z]?)', str(formula)) if match in VALID_ELEMENTS}
    return sorted(list(found))


def normalize_formula(formula: str) -> str:
    """Normalizes formula string by removing spaces and leading/trailing whitespace."""
    if not formula:
        return ""
    return str(formula).replace(" ", "").strip()


def upsert_materials(database: str, materials: List[Dict[str, Any]]) -> int:
    """
    Upserts a list of materials into the `materials_catalog` collection.
    Standardizes schema across Materials Project, OQMD, AFLOW, JARVIS, and IndianMatter.
    Returns the count of successfully processed materials.
    """
    if catalog_collection is None or not materials:
        return 0

    operations = []
    now = datetime.utcnow()

    for item in materials:
        # Resolve Material ID
        mat_id = (
            item.get("material_id")
            or item.get("mv_id")
            or item.get("entry_id")
            or item.get("auid")
            or item.get("id")
        )
        if not mat_id:
            continue
        mat_id = str(mat_id).strip()

        # Resolve Formula
        raw_formula = item.get("formula") or item.get("Formula") or item.get("chemical_formula_reduced") or "Unknown"
        clean_form = normalize_formula(raw_formula)
        elements = item.get("elements") or extract_elements(clean_form)

        # Numerical Properties
        bg = safe_float(item.get("band_gap") or item.get("Band Gap E_g (eV)") or item.get("Egap"))
        fe = safe_float(
            item.get("formation_energy")
            or item.get("Form. Energy E_f (eV/atom)")
            or item.get("delta_e")
            or item.get("enthalpy_formation_atom")
        )
        eh = safe_float(
            item.get("e_hull")
            or item.get("E_hull-m (eV/atom)")
            or item.get("ehull")
            or item.get("energy_above_hull")
        )
        density = safe_float(item.get("density"))

        # Stability Flag
        is_stable = item.get("is_stable")
        if is_stable is None and eh is not None:
            is_stable = eh <= 0.025

        # Space Group & Crystal System
        sg = item.get("space_group") or item.get("spacegroup") or "Unknown"
        cs = item.get("crystal_system") or "Unknown"

        # Extra metrics
        extra = {}
        for k in ["nsites", "volume", "bulk_modulus", "shear_modulus", "metal_prob", "cif_text"]:
            if k in item and item[k] is not None:
                extra[k] = item[k]
        for k in ["Bulk Modulus K (GPa)", "Shear Modulus G (GPa)", "Metal Prob."]:
            if k in item and item[k] is not None:
                extra[k] = safe_float(item[k])

        doc = {
            "material_id": mat_id,
            "database": database.lower().strip(),
            "formula": clean_form,
            "reduced_formula": clean_form,
            "elements": elements,
            "space_group": str(sg),
            "crystal_system": str(cs),
            "band_gap": bg,
            "formation_energy": fe,
            "e_hull": eh,
            "density": density,
            "is_stable": is_stable,
            "extra_properties": extra,
            "updated_at": now
        }

        operations.append(
            UpdateOne(
                {"material_id": mat_id},
                {"$set": doc, "$setOnInsert": {"created_at": now}},
                upsert=True
            )
        )

    if not operations:
        return 0

    try:
        res = catalog_collection.bulk_write(operations, ordered=False)
        total_upserted = (res.upserted_count or 0) + (res.modified_count or 0)
        return total_upserted
    except Exception as e:
        log.warning(f"Error bulk upserting to materials_catalog: {e}")
        return 0


def query_catalog_materials(
    database: Optional[str] = None,
    formula: Optional[str] = None,
    elements: Optional[List[str]] = None,
    exclude_elements: Optional[List[str]] = None,
    min_band_gap: Optional[float] = None,
    max_band_gap: Optional[float] = None,
    min_formation_energy: Optional[float] = None,
    max_formation_energy: Optional[float] = None,
    min_e_hull: Optional[float] = None,
    max_e_hull: Optional[float] = None,
    is_stable: Optional[bool] = None,
    limit: int = 50,
    skip: int = 0
) -> List[Dict[str, Any]]:
    """
    Fast query engine for materials in MongoDB materials_catalog.
    Supports multi-database filtering, element intersection, and physical property bounds.
    """
    if catalog_collection is None:
        return []

    filters = {}

    if database and database.strip() and database.lower() != "all":
        filters["database"] = database.lower().strip()

    if formula and formula.strip():
        clean_f = normalize_formula(formula)
        filters["$or"] = [
            {"formula": clean_f},
            {"reduced_formula": clean_f},
            {"material_id": formula.strip()}
        ]

    # Element filtering via MongoDB array operators
    if elements:
        clean_els = [e.strip() for e in elements if e.strip() in VALID_ELEMENTS]
        if clean_els:
            filters["elements"] = {"$all": clean_els}

    if exclude_elements:
        clean_ex = [e.strip() for e in exclude_elements if e.strip() in VALID_ELEMENTS]
        if clean_ex:
            if "elements" in filters:
                filters["elements"]["$nin"] = clean_ex
            else:
                filters["elements"] = {"$nin": clean_ex}

    # Range filters
    if min_band_gap is not None or max_band_gap is not None:
        bg_filter = {}
        if min_band_gap is not None:
            bg_filter["$gte"] = float(min_band_gap)
        if max_band_gap is not None:
            bg_filter["$lte"] = float(max_band_gap)
        filters["band_gap"] = bg_filter

    if min_formation_energy is not None or max_formation_energy is not None:
        fe_filter = {}
        if min_formation_energy is not None:
            fe_filter["$gte"] = float(min_formation_energy)
        if max_formation_energy is not None:
            fe_filter["$lte"] = float(max_formation_energy)
        filters["formation_energy"] = fe_filter

    if min_e_hull is not None or max_e_hull is not None:
        eh_filter = {}
        if min_e_hull is not None:
            eh_filter["$gte"] = float(min_e_hull)
        if max_e_hull is not None:
            eh_filter["$lte"] = float(max_e_hull)
        filters["e_hull"] = eh_filter

    if is_stable is not None:
        filters["is_stable"] = bool(is_stable)

    try:
        cursor = (
            catalog_collection.find(filters, {"_id": 0})
            .sort("e_hull", 1)
            .skip(skip)
            .limit(limit)
        )
        return list(cursor)
    except Exception as e:
        log.warning(f"Query error on materials_catalog: {e}")
        return []


def count_catalog_materials(
    database: Optional[str] = None,
    formula: Optional[str] = None,
    elements: Optional[List[str]] = None
) -> int:
    """Returns the matching document count in materials_catalog."""
    if catalog_collection is None:
        return 0
    filters = {}
    if database and database.lower() != "all":
        filters["database"] = database.lower().strip()
    if formula:
        clean_f = normalize_formula(formula)
        filters["$or"] = [{"formula": clean_f}, {"reduced_formula": clean_f}, {"material_id": formula.strip()}]
    if elements:
        clean_els = [e.strip() for e in elements if e.strip() in VALID_ELEMENTS]
        if clean_els:
            filters["elements"] = {"$all": clean_els}
    try:
        return catalog_collection.count_documents(filters)
    except Exception:
        return 0


def get_catalog_overview() -> Dict[str, Any]:
    """Returns total materials cached across all connected databases."""
    if catalog_collection is None:
        return {"connected": False, "total_records": 0, "by_database": {}}

    try:
        pipeline = [
            {"$group": {"_id": "$database", "count": {"$sum": 1}}},
            {"$sort": {"count": -1}}
        ]
        results = list(catalog_collection.aggregate(pipeline))
        by_db = {r["_id"]: r["count"] for r in results if r["_id"]}
        total = sum(by_db.values())
        return {
            "connected": True,
            "total_records": total,
            "by_database": by_db
        }
    except Exception as e:
        log.warning(f"Error getting catalog overview: {e}")
        return {"connected": False, "error": str(e), "total_records": 0, "by_database": {}}


def seed_indianmatter_dataset(force: bool = False) -> int:
    """
    Ingests the 38,510 materials from IndianMatter CSV into MongoDB materials_catalog.
    Runs in fast batches of 5,000 documents.
    """
    if catalog_collection is None:
        return 0

    existing_count = count_catalog_materials(database="indianmatter")
    if existing_count >= 38000 and not force:
        log.info(f"IndianMatter materials already seeded in MongoDB ({existing_count} records). Skipping.")
        return existing_count

    # Locate CSV file
    possible_paths = [
        os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "frontend", "src", "data", "indianmatter", "38510.csv")),
        os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "src", "data", "indianmatter", "38510.csv")),
        os.path.abspath(os.path.join(os.path.dirname(__file__), "data", "indianmatter", "38510.csv")),
    ]
    csv_file = next((p for p in possible_paths if os.path.exists(p)), None)
    if not csv_file:
        log.warning("38510.csv not found for seeding.")
        return 0

    log.info(f"Seeding IndianMatter dataset into MongoDB from {csv_file}...")
    import pandas as pd

    try:
        df = pd.read_csv(csv_file)
        df.columns = df.columns.str.strip()
        records = df.to_dict(orient="records")

        batch_size = 5000
        total_seeded = 0

        for i in range(0, len(records), batch_size):
            chunk = records[i:i + batch_size]
            formatted_chunk = []
            for r in chunk:
                mv_id = str(r.get("mv_id", "")).strip()
                form = str(r.get("Formula", "")).strip()
                if not mv_id or not form:
                    continue
                formatted_chunk.append({
                    "material_id": mv_id,
                    "formula": form,
                    "elements": extract_elements(form),
                    "band_gap": safe_float(r.get("Band Gap E_g (eV)")),
                    "formation_energy": safe_float(r.get("Form. Energy E_f (eV/atom)")),
                    "e_hull": safe_float(r.get("E_hull-m (eV/atom)")),
                    "nsites": r.get("nsites"),
                    "bulk_modulus": safe_float(r.get("Bulk Modulus K (GPa)")),
                    "shear_modulus": safe_float(r.get("Shear Modulus G (GPa)")),
                    "metal_prob": safe_float(r.get("Metal Prob.")),
                    "is_stable": safe_float(r.get("E_hull-m (eV/atom)", 99.0)) <= 0.025,
                })
            upserted = upsert_materials("indianmatter", formatted_chunk)
            total_seeded += upserted

        log.info(f"Successfully seeded {total_seeded} IndianMatter materials into MongoDB materials_catalog!")
        return total_seeded
    except Exception as e:
        log.error(f"Failed to seed IndianMatter dataset: {e}")
        return 0


def seed_obliex_dataset() -> int:
    """Migrates Obliex CIFs dataset into materials_catalog."""
    if db is None or catalog_collection is None:
        return 0
    obliex_col = db.get_collection("obliex_dataset")
    if obliex_col is None:
        return 0

    try:
        docs = list(obliex_col.find({}))
        if not docs:
            return 0
        formatted = []
        for d in docs:
            mat_id = d.get("material_id") or d.get("filename", "").replace(".cif", "")
            form = d.get("formula") or d.get("reduced_formula", "Unknown")
            formatted.append({
                "material_id": f"obliex-{mat_id}",
                "formula": form,
                "space_group": d.get("space_group", "Unknown"),
                "crystal_system": d.get("crystal_system", "Unknown"),
                "density": safe_float(d.get("density_g_cm3")),
                "volume": safe_float(d.get("volume_A3")),
                "nsites": d.get("num_sites"),
                "cif_text": d.get("cif_content"),
            })
        return upsert_materials("obliex", formatted)
    except Exception as e:
        log.warning(f"Error migrating obliex to materials_catalog: {e}")
        return 0
