"""
lithium_routes.py
=================
API endpoints for Lithium Battery & Solid-State Electrolyte Materials.
Organizes materials into dedicated families (e.g. LLZO: "Li7La3Zr2O12", LFP: "LiFePO4", etc.)
and automatically calculates and predicts properties from Materials Project, OQMD, AFLOW, and JARVIS.
"""

import os
import logging
from typing import Optional, List, Dict, Any
from fastapi import APIRouter, Query, HTTPException, BackgroundTasks
from pydantic import BaseModel

try:
    from materials_catalog_service import (
        LITHIUM_BATTERY_FAMILIES,
        classify_lithium_family,
        calculate_and_infill_properties,
        upsert_materials,
        query_lithium_materials,
        get_battery_families_catalog,
        normalize_formula
    )
    from database import db, MONGO_AVAILABLE
except ImportError:
    from backend.materials_catalog_service import (
        LITHIUM_BATTERY_FAMILIES,
        classify_lithium_family,
        calculate_and_infill_properties,
        upsert_materials,
        query_lithium_materials,
        get_battery_families_catalog,
        normalize_formula
    )
    from backend.database import db, MONGO_AVAILABLE

logger = logging.getLogger("backend.lithium_routes")
router = APIRouter()


class FetchAndPredictRequest(BaseModel):
    family: Optional[str] = "LLZO"
    formula: Optional[str] = None
    source: Optional[str] = "materials_project"  # materials_project, oqmd, aflow, jarvis, or all
    limit: Optional[int] = 10


@router.get("/families")
def list_battery_families():
    """
    Returns all registered battery material families with canonical formulas (e.g. LLZO: Li7La3Zr2O12),
    categories, crystal structures, and live counts in MongoDB.
    """
    return {
        "status": "success",
        "count": len(LITHIUM_BATTERY_FAMILIES),
        "families": get_battery_families_catalog()
    }


@router.get("/materials")
def get_lithium_materials(
    family: Optional[str] = Query(None, description="Battery family acronym, e.g. LLZO, LFP, LCO, NMC, LGPS"),
    formula: Optional[str] = Query(None, description="Exact or prefix formula, e.g. Li7La3Zr2O12"),
    database: Optional[str] = Query(None, description="Source database: materials_project, oqmd, aflow, jarvis, indianmatter"),
    category: Optional[str] = Query(None, description="Solid Electrolyte, Cathode, Anode"),
    is_stable: Optional[bool] = Query(None, description="Thermodynamic stability flag"),
    limit: int = Query(50, ge=1, le=200),
    skip: int = Query(0, ge=0)
):
    """
    Queries the dedicated MongoDB `lithium_materials` collection.
    Every document contains predicted properties and family classification.
    """
    materials = query_lithium_materials(
        family=family,
        formula=formula,
        database=database,
        category=category,
        is_stable=is_stable,
        limit=limit,
        skip=skip
    )

    total_count = 0
    if db is not None:
        try:
            q = {}
            if family and family.upper() != "ALL":
                q["family"] = family.upper()
            if formula:
                q["formula"] = {"$regex": f"^{normalize_formula(formula)}", "$options": "i"}
            if database and database.lower() != "all":
                q["database"] = database.lower()
            if category and category.lower() != "all":
                q["category"] = category
            if is_stable is not None:
                q["is_stable"] = is_stable
            total_count = db["lithium_materials"].count_documents(q)
        except Exception:
            total_count = len(materials)

    return {
        "status": "success",
        "family": family or "all",
        "count": len(materials),
        "total_available": total_count,
        "materials": materials
    }


@router.get("/summary")
def get_lithium_summary():
    """
    Returns summary statistics for all Lithium materials stored in MongoDB.
    """
    if db is None:
        return {"status": "mongodb_unavailable", "total": 0}

    lith_coll = db["lithium_materials"]
    total = lith_coll.count_documents({})

    by_family = {}
    for doc in lith_coll.aggregate([{"$group": {"_id": "$family", "count": {"$sum": 1}}}]):
        by_family[doc["_id"] or "Unknown"] = doc["count"]

    by_database = {}
    for doc in lith_coll.aggregate([{"$group": {"_id": "$database", "count": {"$sum": 1}}}]):
        by_database[doc["_id"] or "Unknown"] = doc["count"]

    by_category = {}
    for doc in lith_coll.aggregate([{"$group": {"_id": "$category", "count": {"$sum": 1}}}]):
        by_category[doc["_id"] or "Unknown"] = doc["count"]

    return {
        "status": "success",
        "total_lithium_materials": total,
        "by_family": by_family,
        "by_database": by_database,
        "by_category": by_category,
    }


@router.post("/fetch-and-predict")
def fetch_and_predict_lithium(payload: FetchAndPredictRequest):
    """
    Fetches materials for a lithium family (e.g. LLZO -> Li7La3Zr2O12) or custom formula
    from external databases (Materials Project, OQMD, AFLOW, JARVIS),
    predicts/infills all missing physical and mechanical properties using IndianMatter models,
    and stores them in MongoDB (lithium_materials, materials_catalog, and source collection).
    """
    fam_key = (payload.family or "LLZO").upper()
    meta = LITHIUM_BATTERY_FAMILIES.get(fam_key, {})
    target_formula = payload.formula or meta.get("canonical_formula") or "Li7La3Zr2O12"
    source = (payload.source or "materials_project").lower()
    limit = payload.limit or 10

    results = []

    # 1. Fetch from Materials Project
    if source in ["materials_project", "all"]:
        mp_key = os.getenv("MP_API_KEY")
        if mp_key:
            try:
                from mp_api.client import MPRester
                with MPRester(mp_key) as mpr:
                    fields = [
                        "material_id", "formula_pretty", "symmetry",
                        "band_gap", "formation_energy_per_atom", "density",
                        "is_stable", "energy_above_hull"
                    ]
                    docs = mpr.materials.summary.search(formula=target_formula, fields=fields)
                    for d in docs[:limit]:
                        cs = "Unknown"
                        if d.symmetry and hasattr(d.symmetry, "crystal_system"):
                            cs = getattr(d.symmetry.crystal_system, "value", str(d.symmetry.crystal_system))
                        results.append({
                            "material_id": str(d.material_id),
                            "formula": d.formula_pretty,
                            "space_group": getattr(d.symmetry, "symbol", "Unknown") if d.symmetry else "Unknown",
                            "crystal_system": str(cs),
                            "band_gap": d.band_gap,
                            "formation_energy": d.formation_energy_per_atom,
                            "e_hull": d.energy_above_hull,
                            "density": d.density,
                            "is_stable": d.is_stable,
                            "database": "materials_project"
                        })
            except Exception as mp_err:
                logger.warning(f"MPRester fetch error for {target_formula}: {mp_err}")

    # Process, predict and store in MongoDB
    upserted_count = 0
    if results:
        # Group by database and upsert (which triggers calculate_and_infill_properties and stores in lithium_materials)
        upserted_count = upsert_materials("materials_project", results)

    return {
        "status": "success",
        "family": fam_key,
        "formula": target_formula,
        "fetched_count": len(results),
        "persisted_count": upserted_count,
        "materials": results
    }

