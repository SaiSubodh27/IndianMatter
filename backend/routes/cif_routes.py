import io

from fastapi import APIRouter, File, HTTPException, UploadFile
from pymatgen.io.cif import CifParser

router = APIRouter()


@router.post("/parse")
async def parse_uploaded_cif(file: UploadFile = File(...)):
    if not file.filename or not file.filename.lower().endswith(".cif"):
        raise HTTPException(status_code=415, detail="Only .cif files are supported.")

    content = await file.read()
    if not content.strip():
        raise HTTPException(status_code=400, detail="The uploaded CIF is empty.")

    try:
        parser = CifParser(io.StringIO(content.decode("utf-8")))
        structures = parser.parse_structures(primitive=False)
        if not structures:
            raise ValueError("No crystal structure was found in the CIF.")
        structure = structures[0]
        space_group, space_group_number = structure.get_space_group_info()
        lattice = structure.lattice
        atoms = [
            {
                "species": str(site.specie),
                "fractional_coordinates": [round(float(value), 6) for value in site.frac_coords],
                "occupancy": site.properties.get("occupancy"),
            }
            for site in structure.sites
        ]
        return {
            "data_block": file.filename.rsplit(".", 1)[0],
            "formula": structure.composition.reduced_formula,
            "space_group": space_group,
            "space_group_number": int(space_group_number),
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
