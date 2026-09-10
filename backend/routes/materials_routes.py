"""
Materials Project (MP) API client.

Docs: https://docs.materialsproject.org/downloading-data/using-the-api
Client: mp-api (`pip install mp-api`), wraps https://api.materialsproject.org
Requires a free API key (MP_API_KEY) from your Materials Project dashboard.
Rate limit: 25 requests/second.
Data license: CC BY 4.0 — attribution required if this data is surfaced
to end users.

Response fields are normalized to match the schema used by oqmd.py so
the frontend can treat all sources interchangeably:
  material_id, formula, space_group, crystal_system, band_gap,
  formation_energy, density, is_stable

NOTE: this router and the OQMD router both define /explore, /download/csv,
and a /structure or /download/cif path. Mount them under distinct prefixes
in the main app (e.g. /api/mp and /api/oqmd) to avoid path collisions.
"""

import os
import csv
import io
from typing import Optional

from dotenv import load_dotenv
from fastapi import APIRouter, HTTPException, Query
from fastapi.responses import StreamingResponse
from mp_api.client import MPRester

router = APIRouter()

current_dir = os.path.dirname(os.path.abspath(__file__))
backend_dir = os.path.dirname(current_dir)
env_path = os.path.join(backend_dir, ".env")
load_dotenv(dotenv_path=env_path)

API_KEY = os.getenv("MP_API_KEY")
_mpr = None

# Only request the fields we actually use — MP returns every field on a
# document by default, which is slow and unnecessary. See "Tips for Large
# Downloads" in the MP docs. Mirrors the minimal FIELDS constant pattern
# used in oqmd.py.
SEARCH_FIELDS = [
    "material_id",
    "formula_pretty",
    "symmetry",
    "band_gap",
    "formation_energy_per_atom",
    "energy_above_hull",
    "density",
    "is_stable",
]

EXPLORE_FIELDS = [
    "material_id",
    "formula_pretty",
    "symmetry",
    "band_gap",
    "formation_energy_per_atom",
    "density",
    "is_stable",
]


def get_mpr():
    global _mpr
    if not API_KEY:
        raise HTTPException(status_code=500, detail="MP_API_KEY is missing from configuration.")
    if _mpr is None:
        _mpr = MPRester(API_KEY, use_document_model=False)
    return _mpr


def safe_float(value, default=0.0):
    try:
        return round(float(value if value is not None else default), 3)
    except Exception:
        return round(float(default), 3)


def _formation_energy_sort_key(entry: dict) -> float:
    """Sort key for picking the most stable (lowest formation energy)
    entry among search results.

    BUG FIXED: `entry.get("formation_energy_per_atom", float("inf"))`
    only falls back to the default when the KEY is missing — if the key
    exists but its value is None (which MP does return for some
    entries), .get() returns None, and min() then crashes trying to
    compare None < float. Explicitly check for None instead of relying
    on .get()'s default.
    """
    value = entry.get("formation_energy_per_atom")
    return value if value is not None else float("inf")


@router.get("/search/{formula}")
def search_by_composition(formula: str):
    mpr_client = get_mpr()
    try:
        results = mpr_client.materials.summary.search(
            formula=formula,
            fields=SEARCH_FIELDS,
        )
        if not results:
            raise HTTPException(status_code=404, detail=f"No structures found matching formula '{formula}'.")

        stable_entry = min(results, key=_formation_energy_sort_key)

        mp_id = stable_entry.get("material_id")
        if not mp_id:
            raise HTTPException(status_code=500, detail="Missing material_id in Materials Project response.")

        structure = mpr_client.get_structure_by_material_id(mp_id)
        cif_string = structure.to(fmt="cif")

        symmetry = stable_entry.get("symmetry", {}) or {}

        return {
            "material_id": str(mp_id),
            "formula": stable_entry.get("formula_pretty", formula),
            "space_group": symmetry.get("symbol", "Unknown"),
            "crystal_system": str(symmetry.get("crystal_system", "Unknown")),
            "band_gap": safe_float(stable_entry.get("band_gap")),
            "formation_energy": safe_float(stable_entry.get("formation_energy_per_atom")),
            "energy_above_hull": safe_float(stable_entry.get("energy_above_hull")),
            "density": safe_float(stable_entry.get("density")),
            "is_stable": bool(stable_entry.get("is_stable", False)),
            "cif_string": cif_string,
        }

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/explore")
def explore_and_filter_elements(
    elements: Optional[str] = Query(None, description="Elements to INCLUDE (e.g., 'Li,O')"),
    exclude_elements: Optional[str] = Query(None, description="Elements to AVOID completely (e.g., 'Co,Ni')"),
    min_band_gap: Optional[float] = Query(None),
    max_band_gap: Optional[float] = Query(None),
    min_formation_energy: Optional[float] = Query(None),
    max_formation_energy: Optional[float] = Query(None),
    is_stable: Optional[bool] = Query(None),
    limit: int = Query(85, ge=1, le=1000),
):
    mpr_client = get_mpr()
    try:
        query_params = {}

        if elements:
            query_params["elements"] = [el.strip() for el in elements.split(",") if el.strip()]

        if exclude_elements:
            query_params["exclude_elements"] = [el.strip() for el in exclude_elements.split(",") if el.strip()]

        if min_band_gap is not None or max_band_gap is not None:
            query_params["band_gap"] = (
                min_band_gap if min_band_gap is not None else 0.0,
                max_band_gap if max_band_gap is not None else 15.0,
            )

        if min_formation_energy is not None or max_formation_energy is not None:
            query_params["formation_energy_per_atom"] = (
                min_formation_energy if min_formation_energy is not None else -10.0,
                max_formation_energy if max_formation_energy is not None else 5.0,
            )

        if is_stable is not None:
            query_params["is_stable"] = is_stable

        results = mpr_client.materials.summary.search(
            **query_params,
            fields=EXPLORE_FIELDS,
            num_chunks=1,
            chunk_size=limit,
        )

        compiled_list = []
        for entry in results[:limit]:
            sym = entry.get("symmetry", {}) or {}
            compiled_list.append({
                "material_id": str(entry.get("material_id")),
                "formula": entry.get("formula_pretty", "Unknown"),
                "space_group": sym.get("symbol", "Unknown"),
                "crystal_system": str(sym.get("crystal_system", "Unknown")),
                "band_gap": safe_float(entry.get("band_gap")),
                "formation_energy": safe_float(entry.get("formation_energy_per_atom")),
                "density": safe_float(entry.get("density")),
                "is_stable": bool(entry.get("is_stable", False)),
            })

        return compiled_list

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/structure/{material_id}")
def get_cif_by_id(material_id: str):
    mpr_client = get_mpr()
    try:
        structure = mpr_client.get_structure_by_material_id(material_id)
        return {"cif_string": structure.to(fmt="cif")}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/download/csv")
def download_csv(
    elements: Optional[str] = Query(None),
    exclude_elements: Optional[str] = Query(None),
    min_band_gap: Optional[float] = Query(None),
    max_band_gap: Optional[float] = Query(None),
    min_formation_energy: Optional[float] = Query(None),
    max_formation_energy: Optional[float] = Query(None),
    is_stable: Optional[bool] = Query(None),
    limit: int = Query(25, ge=1, le=100),
):
    data = explore_and_filter_elements(
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
            "material_id",
            "formula",
            "space_group",
            "crystal_system",
            "band_gap",
            "formation_energy",
            "density",
            "is_stable",
        ],
    )
    writer.writeheader()
    writer.writerows(data)

    output.seek(0)
    return StreamingResponse(
        iter([output.getvalue()]),
        media_type="text/csv",
        headers={"Content-Disposition": "attachment; filename=materials_results.csv"},
    )


@router.get("/download/cif/{material_id}")
def download_cif(material_id: str):
    mpr_client = get_mpr()
    try:
        structure = mpr_client.get_structure_by_material_id(material_id)
        cif_string = structure.to(fmt="cif")
        return StreamingResponse(
            iter([cif_string]),
            media_type="text/plain",
            headers={"Content-Disposition": f'attachment; filename="{material_id}.cif"'},
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
