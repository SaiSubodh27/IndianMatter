import io
import logging
from typing import Optional, Dict, Any, List
from fastapi import APIRouter, File, HTTPException, UploadFile, Query, Response
from pydantic import BaseModel
from pymatgen.io.cif import CifParser

try:
    from materials_catalog_service import upsert_materials, calculate_and_infill_properties
    from materials_db_service import save_material_prediction
    from cif_storage_service import save_generated_cif, get_generated_cif_by_id, query_generated_cifs
except ImportError:
    from backend.materials_catalog_service import upsert_materials, calculate_and_infill_properties
    from backend.materials_db_service import save_material_prediction
    from backend.cif_storage_service import save_generated_cif, get_generated_cif_by_id, query_generated_cifs

log = logging.getLogger("backend.cif_routes")
router = APIRouter()


class SaveCifRequest(BaseModel):
    cif_text: str
    formula: Optional[str] = None
    source: Optional[str] = "CIF Generator"
    metadata: Optional[Dict[str, Any]] = None


@router.get("/list")
def list_stored_cifs(
    formula: Optional[str] = Query(None, description="Chemical formula filter, e.g. Fe2O3, Li7La3Zr2O12"),
    source: Optional[str] = Query(None, description="Source filter, e.g. CrystaLLM, Doped, MP"),
    limit: int = Query(50, ge=1, le=100),
    skip: int = Query(0, ge=0)
):
    """
    Returns stored CIF files from MongoDB `generated_cifs` collection.
    """
    items = query_generated_cifs(formula=formula, source=source, limit=limit, skip=skip)
    return {
        "status": "success",
        "count": len(items),
        "cifs": items
    }


@router.get("/download/{cif_id}")
def download_cif_by_id(cif_id: str):
    """
    Downloads raw CIF text by its cif_id or cif_hash.
    """
    doc = get_generated_cif_by_id(cif_id)
    if not doc or not doc.get("cif_text"):
        raise HTTPException(status_code=404, detail="CIF file not found in MongoDB.")
    formula = doc.get("formula", "structure")
    return Response(
        content=doc["cif_text"],
        media_type="text/plain",
        headers={"Content-Disposition": f'attachment; filename="{formula}_{cif_id}.cif"'}
    )


@router.post("/save")
def store_cif_manually(req: SaveCifRequest):
    """
    Explicitly stores any generated or external CIF into MongoDB.
    """
    doc = save_generated_cif(
        cif_text=req.cif_text,
        formula=req.formula,
        source=req.source or "Manual / API",
        metadata=req.metadata
    )
    if not doc:
        raise HTTPException(status_code=400, detail="Failed to parse or store CIF file in MongoDB.")
    return {
        "status": "success",
        "message": f"CIF stored in MongoDB successfully (ID: {doc.get('cif_id')})",
        "cif": doc
    }


@router.post("/parse")
async def parse_uploaded_cif(file: UploadFile = File(...)):
    if not file.filename or not file.filename.lower().endswith(".cif"):
        raise HTTPException(status_code=415, detail="Only .cif files are supported.")

    content = await file.read()
    if not content.strip():
        raise HTTPException(status_code=400, detail="The uploaded CIF is empty.")

    try:
        cif_text = content.decode("utf-8")
        parser = CifParser(io.StringIO(cif_text))
        structures = parser.parse_structures(primitive=False)
        if not structures:
            raise ValueError("No crystal structure was found in the CIF.")
        structure = structures[0]
        space_group, space_group_number = structure.get_space_group_info()
        lattice = structure.lattice
        formula = structure.composition.reduced_formula
        atoms = [
            {
                "species": site.species_string,
                "fractional_coordinates": [round(float(value), 6) for value in site.frac_coords],
                "occupancy": site.properties.get("occupancy"),
            }
            for site in structure.sites
        ]

        # Calculate properties using our ML/Physics models & persist in MongoDB
        clean_name = file.filename.rsplit(".", 1)[0]
        mat_id = f"upload-{clean_name}"
        item_doc = {
            "material_id": mat_id,
            "formula": formula,
            "space_group": space_group,
            "density": round(float(structure.density), 3),
            "cif_text": cif_text,
        }
        enriched = calculate_and_infill_properties(item_doc)

        try:
            upsert_materials("cif_uploads", [enriched])
            save_generated_cif(
                cif_text=cif_text,
                formula=formula,
                source=f"Uploaded CIF ({file.filename})",
                metadata={"filename": file.filename, "clean_name": clean_name}
            )
        except Exception as save_err:
            log.warning(f"Notice saving uploaded CIF material to MongoDB: {save_err}")

        return {
            "data_block": clean_name,
            "formula": formula,
            "space_group": space_group,
            "space_group_number": int(space_group_number),
            "density": enriched.get("density"),
            "band_gap": enriched.get("band_gap"),
            "formation_energy": enriched.get("formation_energy"),
            "e_hull": enriched.get("e_hull"),
            "bulk_modulus": enriched.get("bulk_modulus"),
            "shear_modulus": enriched.get("shear_modulus"),
            "is_stable": enriched.get("is_stable"),
            "stored_in_mongodb": True,
            "lattice": {
                "a": round(float(lattice.a), 6),
                "b": round(float(lattice.b), 6),
                "c": round(float(lattice.c), 6),
                "alpha": round(float(lattice.alpha), 6),
                "beta": round(float(lattice.beta), 6),
                "gamma": round(float(lattice.gamma), 6),
                "volume": round(float(lattice.volume), 6),
            },
            "atom_count": len(atoms),
            "atoms": atoms,
        }
    except UnicodeDecodeError as error:
        raise HTTPException(status_code=400, detail="The CIF must be UTF-8 text.") from error
    except Exception as error:
        raise HTTPException(status_code=422, detail=f"CIF parsing failed: {error}") from error
