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
from typing import Optional
from fastapi import APIRouter, HTTPException, Query
from fastapi.responses import StreamingResponse
import csv
import io

router = APIRouter()

BASE_URL = "http://oqmd.org/oqmdapi"

# Fields we request from OQMD's formationenergy endpoint.
# NOTE: verify these against a live call — OQMD's native field names
# (as opposed to the OPTIMADE-mirrored ones) are: name, entry_id,
# spacegroup, ntypes, band_gap, delta_e, stability, volume, natoms.
# `crystal_system` is not directly exposed by this endpoint; OQMD
# returns `spacegroup` (Hermann-Mauguin symbol) but not the crystal
# system name, so we derive a best-effort mapping from the space
# group number range below.
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
    """
    Builds an OQMD native `filter=` clause.
    Example from docs: filter=element_set=(Al-Fe),O AND stability=0
    (per oqmd.org/api/search: ',' = AND, '-' = OR, so this example
    means: contains (Al OR Fe), AND contains O)

    NOTE: OQMD's filter grammar is picky about spacing/operators —
    this is a best-effort builder covering the common cases. Test
    against http://oqmd.org/oqmdapi/formationenergy?filter=... directly
    if a query returns 0 results unexpectedly.
    """
    clauses = []

    if elements:
        els = [e.strip() for e in elements.split(",") if e.strip()]
        if els:
            # CORRECTED: verified against oqmd.org/api/search and the
            # qmpy_rester docs — OQMD's element_set grammar is
            #   ',' = AND   '-' = OR
            # A prior pass through this file had this backwards (used
            # parens + '-' assuming that meant AND), which produced
            # invalid/wrong-semantics filters and caused OQMD to
            # return a 400. A bare comma-joined list, e.g.
            # element_set=Li,O, already means "contains Li AND O" —
            # no parens needed for the simple "must contain all of
            # these" case. Parens + '-' are only for grouping an OR
            # clause, e.g. element_set=(Al-Fe),O means
            # (Al OR Fe) AND O.
            clauses.append("element_set=" + ",".join(els))

    if exclude_elements:
        # OQMD doesn't have a direct "NOT elements" filter in the native
        # API; this is a known limitation — exclude_elements is accepted
        # here for interface parity but not applied. Post-filter results
        # in Python if this matters for your use case.
        pass

    if min_band_gap is not None:
        clauses.append(f"band_gap>={min_band_gap}")
    if max_band_gap is not None:
        clauses.append(f"band_gap<={max_band_gap}")

    if min_formation_energy is not None:
        clauses.append(f"delta_e>={min_formation_energy}")
    if max_formation_energy is not None:
        clauses.append(f"delta_e<={max_formation_energy}")

    if is_stable is True:
        clauses.append("stability=0")
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
):
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
        resp = requests.get(f"{BASE_URL}/formationenergy", params=params, timeout=20)
        if not resp.ok:
            # CHANGED: resp.raise_for_status() only gives a generic
            # "400 Client Error: Bad Request for url: ..." message —
            # it discards whatever explanation OQMD actually put in the
            # response body. Surface that body directly so a rejected
            # filter string tells us WHY it was rejected instead of
            # just that it was.
            raise HTTPException(
                status_code=502,
                detail=(
                    f"OQMD API rejected the request (status {resp.status_code}). "
                    f"Query sent: {resp.url} — "
                    f"OQMD response body: {resp.text[:1000]}"
                ),
            )
        payload = resp.json()
    except requests.exceptions.RequestException as e:
        raise HTTPException(status_code=502, detail=f"OQMD API request failed: {e}")
    except ValueError:
        raise HTTPException(status_code=502, detail="OQMD API returned a non-JSON response.")

    raw_entries = payload.get("data", [])
    compiled_list = []
    for entry in raw_entries[:limit]:
        stability = entry.get("stability")
        compiled_list.append({
            "material_id": f"oqmd-{entry.get('entry_id')}",
            "formula": entry.get("name", "Unknown"),
            "space_group": entry.get("spacegroup", "Unknown"),
            "crystal_system": "Unknown",  # see note on FIELDS above
            "band_gap": safe_float(entry.get("band_gap")),
            "formation_energy": safe_float(entry.get("delta_e")),
            "density": 0.0,  # not directly returned by this endpoint;
                              # would need natoms + volume + composition
                              # to compute — left as 0.0 placeholder
            "is_stable": bool(stability is not None and stability <= 0),
        })

    return compiled_list


@router.get("/structure/{entry_id}")
def get_oqmd_structure(entry_id: str):
    """
    Fetches structural data for a single OQMD entry.
    entry_id should be the numeric OQMD entry_id (without the 'oqmd-' prefix
    used in explore_oqmd's material_id — strip it before calling this).
    """
    params = {
        "fields": "name,entry_id,spacegroup,sites,unit_cell",
        "format": "json",
    }
    try:
        resp = requests.get(f"{BASE_URL}/formationenergy/{entry_id}", params=params, timeout=20)
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
    """
    NOTE: OQMD's formationenergy endpoint returns site/unit_cell data,
    not a ready-made CIF string like MP's pymatgen Structure.to(fmt="cif")
    does. Converting sites+unit_cell into a proper CIF file requires
    building the CIF text manually (or piping through pymatgen's
    Structure.from_dict / Structure.to). Left as a stub — wire this up
    once you confirm the get_oqmd_structure() response shape.
    """
    raise HTTPException(
        status_code=501,
        detail="CIF export for OQMD not yet implemented — structure data "
               "needs conversion to CIF format. See function docstring.",
    )