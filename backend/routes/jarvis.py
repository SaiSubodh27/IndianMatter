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

BASE_URL = "https://jarvis.nist.gov/optimade/jarvisdft/v1/structures/"


def safe_float(value, default=0.0):
    try:
        return round(float(value if value is not None else default), 3)
    except Exception:
        return round(float(default), 3)


def build_optimade_filter(
    elements: Optional[str],
    exclude_elements: Optional[str],
    is_stable: Optional[bool],
) -> str:
    clauses = []

    if elements:
        els = [e.strip() for e in elements.split(",") if e.strip()]
        if els:
            quoted = ",".join(f'"{el}"' for el in els)
            clauses.append(f"elements HAS ALL {quoted}")

    if is_stable is True:
        clauses.append("_jarvis_ehull<=0.05")
    elif is_stable is False:
        clauses.append("_jarvis_ehull>0.05")

    return " AND ".join(clauses)


def _fetch(elements, exclude_elements, is_stable, limit):
    filter_str = build_optimade_filter(elements, exclude_elements, is_stable)
    params = {"page_limit": limit}
    if filter_str:
        params["filter"] = filter_str

    try:
        resp = requests.get(BASE_URL, params=params, timeout=10)
        resp.raise_for_status()
        return resp.json()
    except requests.exceptions.RequestException as e:
        raise HTTPException(status_code=502, detail=f"JARVIS API request failed: {e}")
    except ValueError:
        raise HTTPException(status_code=502, detail="JARVIS API returned a non-JSON response.")


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
    elements: Optional[str] = Query(None, description="Elements to INCLUDE (e.g., 'Li,O')"),
    exclude_elements: Optional[str] = Query(None, description="Not fully supported by JARVIS OPTIMADE filter"),
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
            database="jarvis",
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

    try:
        payload = _fetch(elements, exclude_elements, is_stable, limit)
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

        # 2. Persist in MongoDB Materials Catalog
        if compiled_list:
            try:
                upsert_materials("jarvis", compiled_list)
            except Exception:
                pass

        return compiled_list[:limit]
    except Exception as e:
        cached = query_catalog_materials(database="jarvis", elements=el_list, limit=limit)
        if cached:
            return cached
        raise HTTPException(status_code=502, detail=f"JARVIS API request failed: {e}")


@router.get("/structure/{jid}")
def get_jarvis_structure(jid: str):
    try:
        resp = requests.get(f"{BASE_URL}{jid}", timeout=20)
        resp.raise_for_status()
        return resp.json()
    except requests.exceptions.RequestException as e:
        raise HTTPException(status_code=502, detail=f"JARVIS API request failed: {e}")


@router.get("/download/csv")
def download_csv_jarvis(
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
    raise HTTPException(
        status_code=501,
        detail="CIF export for JARVIS not yet implemented.",
    )
