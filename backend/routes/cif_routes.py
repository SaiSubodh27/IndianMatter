"""CIF parsing endpoint for uploaded CIF files.

Role in the system
------------------
Exposes ``POST /api/cif/parse`` (mounted at ``/api/cif`` in main.py). Used by
the frontend's StructureViewer / MaterialDetails flows to turn an uploaded
CIF into a structured JSON description (formula, space group, lattice params,
atom list with fractional coords + occupancy). This is a *parse-only*
endpoint: it does not run the generation pipeline.

Inputs  : a multipart-uploaded ``.cif`` file (UTF-8 text).
Outputs : JSON with data_block, formula, space_group, space_group_number,
          lattice {a,b,c,alpha,beta,gamma,volume}, atom_count, atoms[].
"""

import io  # in-memory text stream handed to pymatgen's CifParser

from fastapi import APIRouter, File, HTTPException, UploadFile  # router + upload handling
from pymatgen.io.cif import CifParser  # pymatgen CIF reader

# Router instance; main.py mounts it at /api/cif.
router = APIRouter()


@router.post("/parse")
async def parse_uploaded_cif(file: UploadFile = File(...)):
    """Parse an uploaded CIF into a JSON structural summary.

    Validates the upload (extension, non-empty, UTF-8), reads the first
    structure from the file, and returns its formula, space group, lattice
    parameters and atom list. Raises 415/400/422 on bad input.
    """
    # Reject anything that is not a .cif file.
    if not file.filename or not file.filename.lower().endswith(".cif"):
        raise HTTPException(status_code=415, detail="Only .cif files are supported.")

    # Read the whole upload into memory.
    content = await file.read()
    # Empty files are meaningless; fail fast with a clear message.
    if not content.strip():
        raise HTTPException(status_code=400, detail="The uploaded CIF is empty.")

    try:
        # Decode bytes -> str and parse with pymatgen (keep the original cell).
        parser = CifParser(io.StringIO(content.decode("utf-8")))
        structures = parser.parse_structures(primitive=False)
        if not structures:
            raise ValueError("No crystal structure was found in the CIF.")
        structure = structures[0]
        # Space group symbol + number from pymatgen's analyzer.
        space_group, space_group_number = structure.get_space_group_info()
        lattice = structure.lattice
        # One entry per site: species, fractional coords, occupancy.
        atoms = [
            {
                "species": site.species_string,
                "fractional_coordinates": [round(float(value), 6) for value in site.frac_coords],
                "occupancy": site.properties.get("occupancy"),
            }
            for site in structure.sites
        ]
        return {
            "data_block": file.filename.rsplit(".", 1)[0],  # filename without extension
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
        # Non-UTF-8 bytes cannot be a valid CIF text file.
        raise HTTPException(status_code=400, detail="The CIF must be UTF-8 text.") from error
    except Exception as error:
        # Anything else (bad syntax, missing fields) -> 422 with the pymatgen message.
        raise HTTPException(status_code=422, detail=f"CIF parsing failed: {error}") from error
