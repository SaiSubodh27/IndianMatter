"""
AFLOW (AFLUX search API) client.

Docs: https://aflow.org/documentation/  (AFLUX language)
Base: https://aflow.org/API/aflux/
No API key required.

AFLUX uses a "matchbook,directives" query string format, e.g.:
  https://aflow.org/API/aflux/?species(Si,O),nspecies(2),format(json)

Response fields are normalized to match the schema used by materials.py
(MP client) so the frontend can treat all sources interchangeably:
  material_id, formula, space_group, crystal_system, band_gap,
  formation_energy, density, is_stable

NOTE: AFLUX field/keyword names below (Egap, enthalpy_formation_atom,
spacegroup_relax, compound, auid, density) are the standard documented
AFLOW keywords, but this hasn't been tested against a live call from
this environment — verify with a simple query first (e.g. just
species(Si,O)) before relying on the filters.
"""

import requests
from typing import Optional
from fastapi import APIRouter, HTTPException, Query
from fastapi.responses import StreamingResponse
import csv
import io

router = APIRouter()

# BUG FIXED: was http:// — many hosts now redirect or reject plain HTTP,
# which shows up as a connection/timeout error rather than an obvious
# 4xx you can debug from the response body. AFLOW's docs and current
# site are served over HTTPS; use it directly instead of relying on a
# redirect that may or may not happen transparently through `requests`.
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

    if exclude_elements:
        # AFLUX doesn't have a native "exclude species" keyword in the
        # basic matchbook grammar — accepted for interface parity only.
        # Post-filter in Python if this is required.
        pass

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
        # AFLOW's convention: energy above hull ~0 for stable phases.
        parts.append("enthalpy_formation_cell(*0.001)")

    # Request the specific fields we need back, plus paging.
    parts.append(
        "compound,spacegroup_relax,Egap,enthalpy_formation_atom,density,auid"
    )
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
):
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
        # AFLUX expects the matchbook as a raw query string (not standard
        # key=value pairs), so we build the URL manually rather than using
        # requests' `params` dict, which would URL-encode the commas/parens
        # AFLUX relies on for its grammar.
        resp = requests.get(f"{BASE_URL}?{matchbook}", timeout=20)
        resp.raise_for_status()
        payload = resp.json()
    except requests.exceptions.RequestException as e:
        raise HTTPException(status_code=502, detail=f"AFLOW API request failed: {e}")
    except ValueError:
        raise HTTPException(status_code=502, detail="AFLOW API returned a non-JSON response.")

    # AFLUX returns either a list of entries directly, or a dict keyed by
    # AURL depending on query shape — handle both.
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

        # BUG FIXED: previously used safe_float(...) — which defaults
        # to 0.0 when the value is missing — directly as the input to
        # the is_stable check below. That silently marked every entry
        # with NO formation-energy data as "stable" (0.0 <= 0 is True),
        # which is a false positive, not an unknown. Keep the raw value
        # separate so "missing data" and "actually zero" are distinguished.
        raw_formation_energy = entry.get("enthalpy_formation_atom")
        formation_energy = safe_float(raw_formation_energy)

        compiled_list.append({
            "material_id": f"aflow-{entry.get('auid', 'unknown')}",
            "formula": entry.get("compound", "Unknown"),
            "space_group": entry.get("spacegroup_relax", "Unknown"),
            "crystal_system": "Unknown",  # AFLOW exposes Bravais_lattice_relax
                                           # separately; add to matchbook fields
                                           # above if you need this mapped too
            "band_gap": safe_float(entry.get("Egap")),
            "formation_energy": formation_energy,
            "density": safe_float(entry.get("density")),
            "is_stable": raw_formation_energy is not None and raw_formation_energy <= 0,
        })

    return compiled_list


@router.get("/structure/{auid}")
def get_aflow_structure(auid: str):
    """
    Fetches structural data (CONTCAR/geometry) for a single AFLOW entry
    by its AUID. auid should be passed without the 'aflow-' prefix used
    in explore_aflow's material_id.
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
    """
    NOTE: AFLOW's geometry field (fetched via get_aflow_structure) comes
    back in AFLOW's own serialization format, not directly as CIF text.
    Converting requires parsing that geometry string into lattice +
    site data and building CIF output (or using pymatgen if you can get
    it into a Structure object). Left as a stub for now.
    """
    raise HTTPException(
        status_code=501,
        detail="CIF export for AFLOW not yet implemented — geometry data "
               "needs conversion to CIF format. See function docstring.",
    )