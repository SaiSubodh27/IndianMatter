import os
import json
from typing import Optional, Tuple, Any
from pymatgen.core import Structure
from pymatgen.io.cif import CifParser
from pymatgen.io.vasp import Poscar
from pymatgen.io.xyz import XYZ

def parse_structure_input(raw_input: Any, fmt_hint: Optional[str] = None) -> Tuple[Optional[Structure], dict]:
    """
    Parse a structure from file path, raw string, dictionary, or Pymatgen Structure object.
    Supports CIF, POSCAR, CONTCAR, XYZ, and JSON structure objects, returning both 
    the Pymatgen Structure and a fully serialized metadata dictionary for the frontend.
    """
    if raw_input is None:
        return None, {"valid": False, "error": "Structure input is null."}

    struct = None

    try:
        if isinstance(raw_input, Structure):
            struct = raw_input
        elif isinstance(raw_input, dict):
            struct = Structure.from_dict(raw_input)
        else:
            raw_str = str(raw_input).strip()

            # Case 1: File path exists
            if os.path.isfile(raw_str):
                ext = os.path.splitext(raw_str)[1].lower()
                if ext == ".cif":
                    parser = CifParser(raw_str)
                    struct = parser.get_structures(primitive=False)[0]
                elif ext in (".poscar", ".contcar") or "poscar" in os.path.basename(raw_str).lower():
                    poscar = Poscar.from_file(raw_str)
                    struct = poscar.structure
                elif ext == ".xyz":
                    xyz = XYZ.from_file(raw_str)
                    struct = xyz.molecule.get_boxed_structure()
                else:
                    struct = Structure.from_file(raw_str)
            # Case 2: Inline CIF string
            elif "data_" in raw_str or "_cell_length_a" in raw_str or "loop_" in raw_str:
                parser = CifParser.from_str(raw_str)
                struct = parser.get_structures(primitive=False)[0]
            # Case 3: Inline JSON string
            elif raw_str.startswith("{") and raw_str.endswith("}"):
                data = json.loads(raw_str)
                struct = Structure.from_dict(data)
            # Case 4: POSCAR string format
            elif "Direct" in raw_str or "Cartesian" in raw_str:
                poscar = Poscar.from_str(raw_str)
                struct = poscar.structure
            else:
                return None, {"valid": False, "error": f"Unrecognized structure format or missing file: '{raw_str[:50]}...'"}
    except Exception as e:
        return None, {"valid": False, "error": f"Failed parsing structure: {e}"}

    if struct is None:
        return None, {"valid": False, "error": "Failed to generate valid Pymatgen structure."}

    # Extract clean metadata payload for frontend / 3D Viewer consumption
    try:
        lattice = struct.lattice
        atoms_list = []
        for site in struct:
            # FIX: Use species_string or species instead of the deprecated .specie attribute
            species_str = site.species_string if hasattr(site, "species_string") else str(site.species)
            atoms_list.append({
                "species": species_str,
                "fractional_coordinates": [round(float(c), 5) for c in site.frac_coords],
                "occupancy": getattr(site, "occupancy", 1.0)
            })

        metadata = {
            "valid": True,
            "formula": struct.composition.reduced_formula,
            "data_block": "parsed_structure",
            "space_group": struct.get_space_group_info()[0],
            "space_group_number": struct.get_space_group_info()[1],
            "atom_count": len(struct),
            "lattice": {
                "a": f"{lattice.a:.3f}",
                "b": f"{lattice.b:.3f}",
                "c": f"{lattice.c:.3f}",
                "alpha": f"{lattice.alpha:.1f}",
                "beta": f"{lattice.beta:.1f}",
                "gamma": f"{lattice.gamma:.1f}",
                "vol": f"{lattice.volume:.1f}"
            },
            "atoms": atoms_list
        }
        return struct, metadata
    except Exception as e:
        return struct, {"valid": True, "format": "pymatgen_structure", "warning": f"Metadata extraction partial: {e}"}