"""Materials Project explore endpoint (``/api/materials``).

Role in the system
------------------
Exposes ``GET /api/materials/explore`` and ``GET /api/materials/features``.
Backs the frontend's MaterialsSearchPage "Materials Project" dataset tab.
Queries the official Materials Project API (mp_api.MPRester) with formula /
element / exclusion / band-gap / E-hull filters and normalizes each document
into the shared row schema used by the UI table.

Inputs  : query params (formula or mp-id, elements, exclude_elements,
          min/max band_gap, min/max e_hull, limit).
Outputs : list of normalized material rows (material_id, formula, space_group,
          crystal_system, band_gap, formation_energy, e_hull, density,
          is_stable). 500 if MP_API_KEY is missing.
"""

import os  # env var access for MP_API_KEY
from typing import Optional  # optional query params
from dotenv import load_dotenv  # load backend/.env for MP_API_KEY
from fastapi import APIRouter, Query, HTTPException  # router + query params + errors
from mp_api.client import MPRester  # official Materials Project client

# Ensure backend/.env is loaded (override so a stale shell env doesn't win).
env_path = os.path.join(os.path.dirname(__file__), "..", ".env")
load_dotenv(dotenv_path=env_path, override=True)

# Router instance; main.py mounts it at /api/materials.
router = APIRouter()


@router.get("/features")
def get_material_features():
    """
    Return the available material properties for Materials Project.
    """
    return {
        "properties": [
            {"key": "formula", "column": "Formula"},
            {"key": "material_id", "column": "Material ID"},
            {"key": "space_group", "column": "Space Group"},
            {"key": "crystal_system", "column": "Crystal System"},
            {"key": "band_gap", "column": "Band Gap (eV)"},
            {"key": "formation_energy", "column": "Formation Energy (eV/atom)"},
            {"key": "e_hull", "column": "E Above Hull (eV/atom)"},
            {"key": "density", "column": "Density (g/cm³)"},
            {"key": "is_stable", "column": "Is Stable"},
        ]
    }

@router.get("/explore")
def explore_materials(
    formula: Optional[str] = Query(
        default=None,
        description="Chemical formula or Materials Project ID (e.g. Li2O, mp-1245009)"
    ),
    elements: Optional[str] = Query(
        default=None,
        description="Comma-separated element symbols, e.g. Li,Ag"
    ),
    exclude_elements: Optional[str] = Query(
        default=None,
        description="Comma-separated element symbols to exclude"
    ),
    min_band_gap: Optional[float] = Query(default=None),
    max_band_gap: Optional[float] = Query(default=None),
    min_e_hull: Optional[float] = Query(default=None),
    max_e_hull: Optional[float] = Query(default=None),
    limit: int = Query(default=50, description="Max number of results to return")
):
    """
    Explore Materials Project via its official API (mp_api).
    """
    mp_key = os.getenv("MP_API_KEY")
    if not mp_key:
        raise HTTPException(
            status_code=500,
            detail="MP_API_KEY environment variable is not set. Cannot query Materials Project."
        )

    try:
        with MPRester(mp_key) as mpr:
            fields = [
                "material_id", "formula_pretty", "symmetry", 
                "band_gap", "formation_energy_per_atom", "density", "is_stable", "energy_above_hull"
            ]
            
            kwargs = {}
            if formula and isinstance(formula, str):
                cleaned_formula = formula.strip()
                if cleaned_formula.lower().startswith("mp-") or cleaned_formula.lower().startswith("mvc-"):
                    kwargs["material_ids"] = [cleaned_formula]
                else:
                    kwargs["formula"] = cleaned_formula

            if elements and isinstance(elements, str):
                element_list = [e.strip() for e in elements.split(",") if e.strip()]
                if element_list:
                    kwargs["elements"] = element_list

            if exclude_elements and isinstance(exclude_elements, str):
                exclude_list = [e.strip() for e in exclude_elements.split(",") if e.strip()]
                if exclude_list:
                    kwargs["exclude_elements"] = exclude_list

            band_gap_min = min_band_gap if isinstance(min_band_gap, (int, float)) else None
            band_gap_max = max_band_gap if isinstance(max_band_gap, (int, float)) else None
            if band_gap_min is not None or band_gap_max is not None:
                kwargs["band_gap"] = (band_gap_min, band_gap_max)

            e_hull_min = min_e_hull if isinstance(min_e_hull, (int, float)) else None
            e_hull_max = max_e_hull if isinstance(max_e_hull, (int, float)) else None
            if e_hull_min is not None or e_hull_max is not None:
                kwargs["energy_above_hull"] = (e_hull_min, e_hull_max)

            docs = mpr.materials.summary.search(**kwargs, fields=fields)
            docs = docs[:limit]
            
            results = []
            for doc in docs:
                cs = "Unknown"
                if doc.symmetry and hasattr(doc.symmetry, "crystal_system"):
                    cs = getattr(doc.symmetry.crystal_system, "value", str(doc.symmetry.crystal_system))

                results.append({
                    "material_id": str(doc.material_id),
                    "formula": doc.formula_pretty,
                    "space_group": getattr(doc.symmetry, "symbol", "Unknown") if doc.symmetry else "Unknown",
                    "crystal_system": str(cs),
                    "band_gap": doc.band_gap,
                    "formation_energy": doc.formation_energy_per_atom,
                    "e_hull": doc.energy_above_hull,
                    "density": doc.density,
                    "is_stable": doc.is_stable,
                })
            
            return results
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

