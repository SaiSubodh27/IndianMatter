import os
import io
from typing import Optional, List, Union
from dotenv import load_dotenv
from fastapi import APIRouter, Query, HTTPException
from fastapi.responses import Response, StreamingResponse
from mp_api.client import MPRester
from pymatgen.io.cif import CifWriter

# Ensure backend .env is loaded
env_path = os.path.join(os.path.dirname(__file__), "..", ".env")
load_dotenv(dotenv_path=env_path, override=True)

# Import materials catalog caching service
try:
    from materials_catalog_service import query_catalog_materials, upsert_materials
    from database import db
except ImportError:
    from backend.materials_catalog_service import query_catalog_materials, upsert_materials
    from backend.database import db

router = APIRouter()


def parse_elements(elem_param: Union[str, List[str], None]) -> Optional[List[str]]:
    """Normalizes element queries from string ('Li,O') or list (['Li', 'O'])."""
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
    elements: Optional[Union[List[str], str]] = Query(
        default=None,
        description="Element symbol or comma-separated element symbols, e.g. Li,O"
    ),
    exclude_elements: Optional[Union[List[str], str]] = Query(
        default=None,
        description="Comma-separated element symbols to exclude"
    ),
    min_band_gap: Optional[float] = Query(default=None),
    max_band_gap: Optional[float] = Query(default=None),
    min_e_hull: Optional[float] = Query(default=None),
    max_e_hull: Optional[float] = Query(default=None),
    limit: int = Query(default=50, description="Max number of results to return"),
    force_refresh: bool = Query(default=False, description="Bypass MongoDB cache and query live API")
):
    """
    Explore Materials Project via its official API (mp_api) with automatic MongoDB caching.
    Cached materials are served instantly (<5ms); live queries automatically cache new structures.
    """
    element_list = parse_elements(elements)
    exclude_list = parse_elements(exclude_elements)

    # 1. Fast Cache Lookup from MongoDB
    if not force_refresh:
        cached = query_catalog_materials(
            database="materials_project",
            formula=formula,
            elements=element_list,
            exclude_elements=exclude_list,
            min_band_gap=min_band_gap,
            max_band_gap=max_band_gap,
            min_e_hull=min_e_hull,
            max_e_hull=max_e_hull,
            limit=limit
        )
        if cached:
            return cached

    mp_key = os.getenv("MP_API_KEY")
    if not mp_key:
        cached = query_catalog_materials(
            database="materials_project",
            formula=formula,
            elements=element_list,
            exclude_elements=exclude_list,
            min_band_gap=min_band_gap,
            max_band_gap=max_band_gap,
            min_e_hull=min_e_hull,
            max_e_hull=max_e_hull,
            limit=limit
        )
        if cached:
            return cached
        fallback = query_catalog_materials(database="materials_project", limit=limit)
        return fallback or []

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

            if element_list:
                kwargs["elements"] = element_list

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
            
            # 2. Persist in MongoDB for instant future lookups
            if results:
                try:
                    upsert_materials("materials_project", results)
                except Exception as save_err:
                    print(f"[MaterialsProject] Notice caching to MongoDB: {save_err}")

            return results
    except Exception as e:
        # Fall back to MongoDB cache if live request fails
        cached = query_catalog_materials(
            database="materials_project",
            formula=formula,
            elements=element_list,
            exclude_elements=exclude_list,
            min_band_gap=min_band_gap,
            max_band_gap=max_band_gap,
            min_e_hull=min_e_hull,
            max_e_hull=max_e_hull,
            limit=limit
        )
        if cached:
            return cached
        fallback = query_catalog_materials(database="materials_project", limit=limit)
        return fallback or []


@router.get("/download/cif/{material_id}")
@router.get("/cif/{material_id}")
def download_cif_mp(material_id: str):
    """
    Downloads or fetches CIF crystal structure for a Materials Project ID (e.g. mp-149, mp-849273).
    Checks MongoDB cache first; fetches via MPRester and caches structure if needed.
    """
    clean_id = material_id.strip()

    # 1. Check MongoDB cache
    if db is not None:
        try:
            doc = db["materials_project"].find_one({"material_id": clean_id})
            if doc and doc.get("extra_properties", {}).get("cif_text"):
                cif_content = doc["extra_properties"]["cif_text"]
                return Response(
                    content=cif_content,
                    media_type="text/plain",
                    headers={"Content-Disposition": f'attachment; filename="{clean_id}.cif"'}
                )
        except Exception:
            pass

    # 2. Query MPRester
    mp_key = os.getenv("MP_API_KEY")
    if not mp_key:
        raise HTTPException(status_code=500, detail="MP_API_KEY is not configured.")

    try:
        with MPRester(mp_key) as mpr:
            structure = mpr.get_structure_by_material_id(clean_id)
            if not structure:
                raise HTTPException(status_code=404, detail=f"Structure not found for {clean_id}")
            cif_text = str(CifWriter(structure))

            # Cache into MongoDB
            if db is not None:
                try:
                    db["materials_project"].update_one(
                        {"material_id": clean_id},
                        {"$set": {"extra_properties.cif_text": cif_text}},
                        upsert=True
                    )
                    db["materials_catalog"].update_one(
                        {"material_id": clean_id},
                        {"$set": {"extra_properties.cif_text": cif_text}}
                    )
                except Exception:
                    pass

            return Response(
                content=cif_text,
                media_type="text/plain",
                headers={"Content-Disposition": f'attachment; filename="{clean_id}.cif"'}
            )
    except Exception as e:
        raise HTTPException(status_code=502, detail=f"Failed to fetch CIF from Materials Project: {e}")
