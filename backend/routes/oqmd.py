"""
OQMD (Open Quantum Materials Database) API client.

Docs: https://static.oqmd.org/static/docs/restful.html
Base: http://oqmd.org/oqmdapi
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

BASE_URL = "http://oqmd.org/oqmdapi"

FIELDS = "name,entry_id,spacegroup,band_gap,delta_e,stability,volume,natoms"


def safe_float(value, default=0.0):
    try:
        return round(float(value if value is not None else default), 3)
    except Exception:
        return round(float(default), 3)


def spacegroup_number_to_crystal_system(number: Optional[int]) -> str:
    """OQMD's `spacegroup` field is the H-M symbol, not the number, in
    most responses — this helper is a placeholder in case a numeric
    space group ever comes through. Otherwise we return 'Unknown'."""
    if number is None:
        return "Unknown"
    try:
        n = int(number)
    except (TypeError, ValueError):
        return "Unknown"
    if 1 <= n <= 2:
        return "Triclinic"
    if 3 <= n <= 15:
        return "Monoclinic"
    if 16 <= n <= 74:
        return "Orthorhombic"
    if 75 <= n <= 142:
        return "Tetragonal"
    if 143 <= n <= 167:
        return "Trigonal"
    if 168 <= n <= 194:
        return "Hexagonal"
    if 195 <= n <= 230:
        return "Cubic"
    return "Unknown"


def build_filter_string(
    elements: Optional[str],
    exclude_elements: Optional[str],
    min_band_gap: Optional[float],
    max_band_gap: Optional[float],
    min_formation_energy: Optional[float],
    max_formation_energy: Optional[float],
    is_stable: Optional[bool],
) -> str:
    clauses = []

    if elements:
        els = [e.strip() for e in elements.split(",") if e.strip()]
        if els:
            clauses.append(f"element_set=({'-'.join(els)})")

    if min_band_gap is not None and max_band_gap is not None:
        clauses.append(f"band_gap>={min_band_gap} AND band_gap<={max_band_gap}")
    elif min_band_gap is not None:
        clauses.append(f"band_gap>={min_band_gap}")
    elif max_band_gap is not None:
        clauses.append(f"band_gap<={max_band_gap}")

    if min_formation_energy is not None and max_formation_energy is not None:
        clauses.append(f"delta_e>={min_formation_energy} AND delta_e<={max_formation_energy}")
    elif min_formation_energy is not None:
        clauses.append(f"delta_e>={min_formation_energy}")
    elif max_formation_energy is not None:
        clauses.append(f"delta_e<={max_formation_energy}")

    if is_stable is True:
        clauses.append("stability<=0")
    elif is_stable is False:
        clauses.append("stability>0")

    return " AND ".join(clauses)


@router.get("/explore")
def explore_oqmd(
    elements: Optional[str] = Query(None, description="Elements to INCLUDE (e.g., 'Li,O')"),
    exclude_elements: Optional[str] = Query(None, description="Not supported by OQMD native filter — accepted for parity only"),
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
            database="oqmd",
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

    filter_str = build_filter_string(
        elements,
        exclude_elements,
        min_band_gap,
        max_band_gap,
        min_formation_energy,
        max_formation_energy,
        is_stable,
    )

    params = {
        "fields": FIELDS,
        "limit": limit,
        "format": "json",
    }
    if filter_str:
        params["filter"] = filter_str

    try:
        resp = requests.get(f"{BASE_URL}/formationenergy", params=params, timeout=10)
        if not resp.ok:
            # Fall back to MongoDB if available
            cached = query_catalog_materials(database="oqmd", elements=el_list, limit=limit)
            if cached:
                return cached
            raise HTTPException(
                status_code=502,
                detail=f"OQMD API rejected the request (status {resp.status_code})."
            )
        payload = resp.json()
    except Exception as e:
        cached = query_catalog_materials(database="oqmd", elements=el_list, limit=limit)
        if cached:
            return cached
        raise HTTPException(status_code=502, detail=f"OQMD API request failed: {e}")

    raw_entries = payload.get("data", [])
    compiled_list = []
    for entry in raw_entries[:limit]:
        stability = entry.get("stability")
        compiled_list.append({
            "material_id": f"oqmd-{entry.get('entry_id')}",
            "formula": entry.get("name", "Unknown"),
            "space_group": entry.get("spacegroup", "Unknown"),
            "crystal_system": "Unknown",
            "band_gap": safe_float(entry.get("band_gap")),
            "formation_energy": safe_float(entry.get("delta_e")),
            "density": 0.0,
            "is_stable": bool(stability is not None and stability <= 0),
        })

    # 2. Persist in MongoDB Materials Catalog
    if compiled_list:
        try:
            upsert_materials("oqmd", compiled_list)
        except Exception:
            pass

    return compiled_list


@router.get("/structure/{entry_id}")
def get_oqmd_structure(entry_id: str):
    """
    Fetches structural data for a single OQMD entry.
    """
    params = {
        "fields": "name,entry_id,spacegroup,sites,unit_cell",
        "format": "json",
    }
    try:
        resp = requests.get(f"{BASE_URL}/formationenergy/{entry_id}", params=params, timeout=15)
        resp.raise_for_status()
        return resp.json()
    except requests.exceptions.RequestException as e:
        raise HTTPException(status_code=502, detail=f"OQMD API request failed: {e}")


@router.get("/download/csv")
def download_csv_oqmd(
    elements: Optional[str] = Query(None),
    exclude_elements: Optional[str] = Query(None),
    min_band_gap: Optional[float] = Query(None),
    max_band_gap: Optional[float] = Query(None),
    min_formation_energy: Optional[float] = Query(None),
    max_formation_energy: Optional[float] = Query(None),
    is_stable: Optional[bool] = Query(None),
    limit: int = Query(25, ge=1, le=100),
):
    data = explore_oqmd(
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
        headers={"Content-Disposition": "attachment; filename=oqmd_results.csv"},
    )


@router.get("/download/cif/{entry_id}")
def download_cif_oqmd(entry_id: str):
    raise HTTPException(
        status_code=501,
        detail="CIF export for OQMD not yet implemented.",
    )
