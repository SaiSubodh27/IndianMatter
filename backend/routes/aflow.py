"""
AFLOW (AFLUX search API) client with MongoDB caching.

Docs: https://aflow.org/documentation/  (AFLUX language)
Base: https://aflow.org/API/aflux/
No API key required.

Response fields are normalized to match the schema used by materials.py
(MP client) so the frontend can treat all sources interchangeably:
  material_id, formula, space_group, crystal_system, band_gap,
  formation_energy, density, is_stable
"""

import requests
from typing import Optional, List
from fastapi import APIRouter, HTTPException, Query
from fastapi.responses import StreamingResponse
import csv
import io

# Import materials catalog service for MongoDB caching
try:
    from materials_catalog_service import query_catalog_materials, upsert_materials
except ImportError:
    from backend.materials_catalog_service import query_catalog_materials, upsert_materials

router = APIRouter()

BASE_URL = "https://aflow.org/API/aflux/"


def safe_float(value, default=0.0):
    try:
        return round(float(value if value is not None else default), 3)
    except Exception:
        return round(float(default), 3)


def build_matchbook(
    elements: Optional[str],
    exclude_elements: Optional[str],
    min_band_gap: Optional[float],
    max_band_gap: Optional[float],
    min_formation_energy: Optional[float],
    max_formation_energy: Optional[float],
    is_stable: Optional[bool],
    limit: int,
) -> str:
    parts = []

    if elements:
        els = [e.strip() for e in elements.split(",") if e.strip()]
        if els:
            parts.append(f"species({','.join(els)})")

    if min_band_gap is not None and max_band_gap is not None:
        parts.append(f"Egap({min_band_gap}*{max_band_gap})")
    elif min_band_gap is not None:
        parts.append(f"Egap({min_band_gap}*)")
    elif max_band_gap is not None:
        parts.append(f"Egap(*{max_band_gap})")

    if min_formation_energy is not None and max_formation_energy is not None:
        parts.append(f"enthalpy_formation_atom({min_formation_energy}*{max_formation_energy})")
    elif min_formation_energy is not None:
        parts.append(f"enthalpy_formation_atom({min_formation_energy}*)")
    elif max_formation_energy is not None:
        parts.append(f"enthalpy_formation_atom(*{max_formation_energy})")

    if is_stable is True:
        parts.append("enthalpy_formation_cell(*0.001)")

    parts.append("compound,spacegroup_relax,Egap,enthalpy_formation_atom,density,auid")
    parts.append(f"paging(1,{limit})")
    parts.append("format(json)")

    return ",".join(parts)


@router.get("/explore")
def explore_aflow(
    elements: Optional[str] = Query(None, description="Elements to INCLUDE (e.g., 'Li,O')"),
    exclude_elements: Optional[str] = Query(None, description="Not supported by AFLUX matchbook — accepted for parity only"),
    min_band_gap: Optional[float] = Query(None),
    max_band_gap: Optional[float] = Query(None),
    min_formation_energy: Optional[float] = Query(None),
    max_formation_energy: Optional[float] = Query(None),
    is_stable: Optional[bool] = Query(None),
    limit: int = Query(25, ge=1, le=100),
    force_refresh: bool = Query(False, description="Bypass MongoDB cache and query live API")
):
    el_list = [e.strip() for e in elements.split(",") if e.strip()] if elements else None
    exclude_list = [e.strip() for e in exclude_elements.split(",") if e.strip()] if exclude_elements else None

    # 1. Fast Cache Lookup from MongoDB
    if not force_refresh:
        cached = query_catalog_materials(
            database="aflow",
            elements=el_list,
            exclude_elements=exclude_list,
            min_band_gap=min_band_gap,
            max_band_gap=max_band_gap,
            min_formation_energy=min_formation_energy,
            max_formation_energy=max_formation_energy,
            is_stable=is_stable,
            limit=limit
        )
        if len(cached) >= min(limit, 5):
            return cached

    matchbook = build_matchbook(
        elements,
        exclude_elements,
        min_band_gap,
        max_band_gap,
        min_formation_energy,
        max_formation_energy,
        is_stable,
        limit,
    )

    try:
        resp = requests.get(f"{BASE_URL}?{matchbook}", timeout=10)
        resp.raise_for_status()
        payload = resp.json()
    except Exception as e:
        cached = query_catalog_materials(database="aflow", elements=el_list, limit=limit)
        if cached:
            return cached
        raise HTTPException(status_code=502, detail=f"AFLOW API request failed: {e}")

    if isinstance(payload, dict):
        raw_entries = list(payload.values())
    elif isinstance(payload, list):
        raw_entries = payload
    else:
        raw_entries = []

    compiled_list = []
    for entry in raw_entries[:limit]:
        if not isinstance(entry, dict):
            continue

        raw_formation_energy = entry.get("enthalpy_formation_atom")
        formation_energy = safe_float(raw_formation_energy)

        compiled_list.append({
            "material_id": f"aflow-{entry.get('auid', 'unknown')}",
            "formula": entry.get("compound", "Unknown"),
            "space_group": entry.get("spacegroup_relax", "Unknown"),
            "crystal_system": "Unknown",
            "band_gap": safe_float(entry.get("Egap")),
            "formation_energy": formation_energy,
            "density": safe_float(entry.get("density")),
            "is_stable": raw_formation_energy is not None and raw_formation_energy <= 0,
        })

    # 2. Persist in MongoDB Materials Catalog
    if compiled_list:
        try:
            upsert_materials("aflow", compiled_list)
        except Exception:
            pass

    return compiled_list


@router.get("/structure/{auid}")
def get_aflow_structure(auid: str):
    """
    Fetches structural data (CONTCAR/geometry) for a single AFLOW entry by its AUID.
    """
    matchbook = f"auid({auid}),geometry,compound,format(json)"
    try:
        resp = requests.get(f"{BASE_URL}?{matchbook}", timeout=20)
        resp.raise_for_status()
        return resp.json()
    except requests.exceptions.RequestException as e:
        raise HTTPException(status_code=502, detail=f"AFLOW API request failed: {e}")


@router.get("/download/csv")
def download_csv_aflow(
    elements: Optional[str] = Query(None),
    exclude_elements: Optional[str] = Query(None),
    min_band_gap: Optional[float] = Query(None),
    max_band_gap: Optional[float] = Query(None),
    min_formation_energy: Optional[float] = Query(None),
    max_formation_energy: Optional[float] = Query(None),
    is_stable: Optional[bool] = Query(None),
    limit: int = Query(25, ge=1, le=100),
):
    data = explore_aflow(
        elements=elements,
        exclude_elements=exclude_elements,
        min_band_gap=min_band_gap,
        max_band_gap=max_band_gap,
        min_formation_energy=min_formation_energy,
        max_formation_energy=max_formation_energy,
        is_stable=is_stable,
        limit=limit,
    )

    output = io.StringIO()
    writer = csv.DictWriter(
        output,
        fieldnames=[
            "material_id", "formula", "space_group", "crystal_system",
            "band_gap", "formation_energy", "density", "is_stable",
        ],
    )
    writer.writeheader()
    writer.writerows(data)
    output.seek(0)
    return StreamingResponse(
        iter([output.getvalue()]),
        media_type="text/csv",
        headers={"Content-Disposition": "attachment; filename=aflow_results.csv"},
    )


@router.get("/download/cif/{auid}")
def download_cif_aflow(auid: str):
    raise HTTPException(
        status_code=501,
        detail="CIF export for AFLOW not yet implemented.",
    )
