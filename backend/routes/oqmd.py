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
from typing import Optional, List, Union
from fastapi import APIRouter, HTTPException, Query
from fastapi.responses import StreamingResponse, Response
import csv
import io

# Import materials catalog service for MongoDB caching
try:
    from materials_catalog_service import query_catalog_materials, upsert_materials
    from database import db
except ImportError:
    from backend.materials_catalog_service import query_catalog_materials, upsert_materials
    from backend.database import db

router = APIRouter()

BASE_URL = "http://oqmd.org/oqmdapi"

FIELDS = "name,entry_id,spacegroup,band_gap,delta_e,stability,volume,natoms"


def safe_float(value, default=0.0):
    try:
        return round(float(value if value is not None else default), 3)
    except Exception:
        return round(float(default), 3)


def parse_elements(elem_param: Union[str, List[str], None]) -> Optional[List[str]]:
    if not elem_param:
        return None
    if isinstance(elem_param, str):
        parts = [e.strip() for e in elem_param.split(",") if e.strip()]
        return parts if parts else None
    if isinstance(elem_param, list):
        out = []
        for item in elem_param:
            for sub in str(item).split(","):
                if sub.strip():
                    out.append(sub.strip())
        return out if out else None
    return None


def build_filter_string(
    formula: Optional[str],
    elements: Optional[List[str]],
    exclude_elements: Optional[List[str]],
    min_band_gap: Optional[float],
    max_band_gap: Optional[float],
    min_formation_energy: Optional[float],
    max_formation_energy: Optional[float],
    is_stable: Optional[bool],
) -> str:
    clauses = []

    if formula:
        clauses.append(f"name={formula.strip()}")

    if elements:
        clauses.append(f"element_set=({'-'.join(elements)})")

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
    formula: Optional[str] = Query(None, description="Chemical formula (e.g. LiCoO2, Li2O)"),
    elements: Optional[Union[List[str], str]] = Query(None, description="Elements to INCLUDE (e.g., 'Li,O')"),
    exclude_elements: Optional[Union[List[str], str]] = Query(None, description="Not supported by OQMD native filter — accepted for parity only"),
    min_band_gap: Optional[float] = Query(None),
    max_band_gap: Optional[float] = Query(None),
    min_formation_energy: Optional[float] = Query(None),
    max_formation_energy: Optional[float] = Query(None),
    is_stable: Optional[bool] = Query(None),
    limit: int = Query(25, ge=1, le=100),
    force_refresh: bool = Query(False, description="Bypass MongoDB cache and query live API")
):
    el_list = parse_elements(elements)
    exclude_list = parse_elements(exclude_elements)

    # 1. Fast Cache Lookup from MongoDB
    if not force_refresh:
        cached = query_catalog_materials(
            database="oqmd",
            formula=formula,
            elements=el_list,
            exclude_elements=exclude_list,
            min_band_gap=min_band_gap,
            max_band_gap=max_band_gap,
            min_formation_energy=min_formation_energy,
            max_formation_energy=max_formation_energy,
            is_stable=is_stable,
            limit=limit
        )
        if cached:
            return cached

    filter_str = build_filter_string(
        formula,
        el_list,
        exclude_list,
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
        resp = requests.get(f"{BASE_URL}/formationenergy", params=params, timeout=4)
        if not resp.ok:
            cached = query_catalog_materials(database="oqmd", formula=formula, elements=el_list, limit=limit)
            if cached:
                return cached
            fallback = query_catalog_materials(database="oqmd", limit=limit)
            return fallback or []
        payload = resp.json()
    except Exception:
        cached = query_catalog_materials(database="oqmd", formula=formula, elements=el_list, limit=limit)
        if cached:
            return cached
        fallback = query_catalog_materials(database="oqmd", limit=limit)
        return fallback or []

    raw_entries = payload.get("data", [])
    compiled_list = []
    for entry in raw_entries[:limit]:
        stability = entry.get("stability")
        compiled_list.append({
            "material_id": f"oqmd-{entry.get('entry_id')}",
            "formula": entry.get("name", "Unknown"),
            "space_group": str(entry.get("spacegroup", "Unknown")),
            "crystal_system": "Unknown",
            "band_gap": safe_float(entry.get("band_gap")),
            "formation_energy": safe_float(entry.get("delta_e")),
            "density": 0.0,
            "is_stable": bool(stability is not None and stability <= 0),
        })

    # 2. Persist in MongoDB Materials Catalog & dedicated OQMD collection
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
    clean_id = entry_id.replace("oqmd-", "")
    try:
        resp = requests.get(f"{BASE_URL}/formationenergy/{clean_id}", params=params, timeout=5)
        resp.raise_for_status()
        return resp.json()
    except Exception:
        if db is not None:
            doc = db["oqmd"].find_one({"material_id": f"oqmd-{clean_id}"})
            if doc:
                return doc
        raise HTTPException(status_code=502, detail=f"OQMD API request failed for entry {entry_id}")


@router.get("/download/csv")
def download_csv_oqmd(
    formula: Optional[str] = Query(None),
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
        formula=formula,
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
    clean_id = entry_id.strip()
    if not clean_id.startswith("oqmd-"):
        clean_id = f"oqmd-{clean_id}"

    # 1. Check MongoDB cache
    if db is not None:
        doc = db["oqmd"].find_one({"material_id": clean_id})
        if doc and doc.get("extra_properties", {}).get("cif_text"):
            return Response(
                content=doc["extra_properties"]["cif_text"],
                media_type="text/plain",
                headers={"Content-Disposition": f'attachment; filename="{clean_id}.cif"'}
            )

    raise HTTPException(
        status_code=404,
        detail=f"CIF structure not cached for OQMD entry {clean_id}.",
    )
