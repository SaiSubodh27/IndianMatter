"""
JARVIS-DFT (NIST) API client with MongoDB caching, via its OPTIMADE-compliant endpoint.

Docs: https://jarvis.nist.gov/optimade/jarvisdft/
Base: https://jarvis.nist.gov/optimade/jarvisdft/v1/structures/
No API key required.

OPTIMADE filter examples from docs:
  ?filter=elements HAS ALL "C","Si","Ge"
  ?filter=chemical_formula_reduced="MoS2"
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

BASE_URL = "https://jarvis.nist.gov/optimade/jarvisdft/v1/structures/"


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


def build_optimade_filter(
    formula: Optional[str],
    elements: Optional[List[str]],
    exclude_elements: Optional[List[str]],
    is_stable: Optional[bool],
) -> str:
    clauses = []

    if formula:
        clauses.append(f'chemical_formula_reduced="{formula.strip()}"')

    if elements:
        quoted = ",".join(f'"{el}"' for el in elements)
        clauses.append(f"elements HAS ALL {quoted}")

    if is_stable is True:
        clauses.append("_jarvis_ehull<=0.05")
    elif is_stable is False:
        clauses.append("_jarvis_ehull>0.05")

    return " AND ".join(clauses)


def _fetch(formula, elements, exclude_elements, is_stable, limit):
    filter_str = build_optimade_filter(formula, elements, exclude_elements, is_stable)
    params = {"page_limit": limit}
    if filter_str:
        params["filter"] = filter_str

    try:
        resp = requests.get(BASE_URL, params=params, timeout=4)
        resp.raise_for_status()
        return resp.json()
    except Exception as e:
        raise HTTPException(status_code=502, detail=f"JARVIS API request failed: {e}")


def _normalize(entry: dict) -> dict:
    attrs = entry.get("attributes", {}) or {}
    band_gap = attrs.get("_jarvis_optb88vdw_bandgap")
    formation_energy = attrs.get("_jarvis_formation_energy_peratom")
    ehull = attrs.get("_jarvis_ehull")
    return {
        "material_id": f"jarvis-{entry.get('id', 'unknown')}",
        "formula": attrs.get("chemical_formula_reduced", "Unknown"),
        "space_group": attrs.get("_jarvis_spacegroup", "Unknown"),
        "crystal_system": attrs.get("_jarvis_crystal_system", "Unknown"),
        "band_gap": safe_float(band_gap),
        "formation_energy": safe_float(formation_energy),
        "density": safe_float(attrs.get("_jarvis_density")),
        "is_stable": bool(ehull is not None and safe_float(ehull) <= 0.05),
    }


@router.get("/explore")
def explore_jarvis(
    formula: Optional[str] = Query(None, description="Chemical formula (e.g. Si, MoS2)"),
    elements: Optional[Union[List[str], str]] = Query(None, description="Elements to INCLUDE (e.g., 'Li,O')"),
    exclude_elements: Optional[Union[List[str], str]] = Query(None, description="Not fully supported by JARVIS OPTIMADE filter"),
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
            database="jarvis",
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

    try:
        payload = _fetch(formula, el_list, exclude_list, is_stable, limit)
        raw_entries = payload.get("data", [])
        compiled_list = [_normalize(e) for e in raw_entries]

        if min_band_gap is not None:
            compiled_list = [m for m in compiled_list if m["band_gap"] >= min_band_gap]
        if max_band_gap is not None:
            compiled_list = [m for m in compiled_list if m["band_gap"] <= max_band_gap]
        if min_formation_energy is not None:
            compiled_list = [m for m in compiled_list if m["formation_energy"] >= min_formation_energy]
        if max_formation_energy is not None:
            compiled_list = [m for m in compiled_list if m["formation_energy"] <= max_formation_energy]

        # 2. Persist in MongoDB Materials Catalog & dedicated JARVIS collection
        if compiled_list:
            try:
                upsert_materials("jarvis", compiled_list)
            except Exception:
                pass

        return compiled_list[:limit]
    except Exception:
        cached = query_catalog_materials(database="jarvis", formula=formula, elements=el_list, limit=limit)
        if cached:
            return cached
        fallback = query_catalog_materials(database="jarvis", limit=limit)
        return fallback or []


@router.get("/structure/{jid}")
def get_jarvis_structure(jid: str):
    clean_id = jid.replace("jarvis-", "")
    try:
        resp = requests.get(f"{BASE_URL}{clean_id}", timeout=5)
        resp.raise_for_status()
        return resp.json()
    except Exception:
        if db is not None:
            doc = db["jarvis"].find_one({"material_id": f"jarvis-{clean_id}"})
            if doc:
                return doc
        raise HTTPException(status_code=502, detail=f"JARVIS API request failed for structure {jid}")


@router.get("/download/csv")
def download_csv_jarvis(
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
    data = explore_jarvis(
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
        headers={"Content-Disposition": "attachment; filename=jarvis_results.csv"},
    )


@router.get("/download/cif/{jid}")
def download_cif_jarvis(jid: str):
    clean_id = jid.strip()
    if not clean_id.startswith("jarvis-"):
        clean_id = f"jarvis-{clean_id}"

    if db is not None:
        doc = db["jarvis"].find_one({"material_id": clean_id})
        if doc and doc.get("extra_properties", {}).get("cif_text"):
            return Response(
                content=doc["extra_properties"]["cif_text"],
                media_type="text/plain",
                headers={"Content-Disposition": f'attachment; filename="{clean_id}.cif"'}
            )
    raise HTTPException(status_code=404, detail=f"CIF structure not cached for JARVIS entry {clean_id}")
