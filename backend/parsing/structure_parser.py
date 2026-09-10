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
    Supports CIF, POSCAR, CONTCAR, XYZ, and JSON structure objects.
    """
    if raw_input is None:
        return None, {"valid": False, "error": "Structure input is null."}

    if isinstance(raw_input, Structure):
        return raw_input, {"valid": True, "format": "pymatgen_structure"}

    # If dict (e.g. JSON structure)
    if isinstance(raw_input, dict):
        try:
            struct = Structure.from_dict(raw_input)
            return struct, {"valid": True, "format": "pymatgen_dict"}
        except Exception as e:
            return None, {"valid": False, "error": f"Invalid structure dictionary: {e}"}

    raw_str = str(raw_input).strip()

    # Case 1: File path exists
    if os.path.isfile(raw_str):
        file_path = raw_str
        ext = os.path.splitext(file_path)[1].lower()
        try:
            if ext == ".cif":
                parser = CifParser(file_path)
                struct = parser.get_structures(primitive=False)[0]
                return struct, {"valid": True, "format": "CIF", "source": file_path}
            elif ext in (".poscar", ".contcar") or "poscar" in os.path.basename(file_path).lower():
                poscar = Poscar.from_file(file_path)
                return poscar.structure, {"valid": True, "format": "POSCAR", "source": file_path}
            elif ext == ".xyz":
                xyz = XYZ.from_file(file_path)
                return xyz.molecule.get_boxed_structure(), {"valid": True, "format": "XYZ", "source": file_path}
            else:
                # Default pymatgen auto-read
                struct = Structure.from_file(file_path)
                return struct, {"valid": True, "format": ext.strip(".").upper(), "source": file_path}
        except Exception as e:
            return None, {"valid": False, "error": f"Failed reading file {file_path}: {e}"}

    # Case 2: Inline CIF string
    if "data_" in raw_str or "_cell_length_a" in raw_str or "loop_" in raw_str:
        try:
            parser = CifParser.from_str(raw_str)
            struct = parser.get_structures(primitive=False)[0]
            return struct, {"valid": True, "format": "CIF_string"}
        except Exception as e:
            return None, {"valid": False, "error": f"Failed parsing inline CIF string: {e}"}

    # Case 3: Inline JSON string
    if raw_str.startswith("{") and raw_str.endswith("}"):
        try:
            data = json.loads(raw_str)
            struct = Structure.from_dict(data)
            return struct, {"valid": True, "format": "JSON_string"}
        except Exception as e:
            return None, {"valid": False, "error": f"Failed parsing inline JSON structure: {e}"}

    # Case 4: POSCAR string format
    if "Direct" in raw_str or "Cartesian" in raw_str:
        try:
            poscar = Poscar.from_str(raw_str)
            return poscar.structure, {"valid": True, "format": "POSCAR_string"}
        except Exception as e:
            return None, {"valid": False, "error": f"Failed parsing inline POSCAR string: {e}"}

    return None, {"valid": False, "error": f"Unrecognized structure format or missing file: '{raw_str[:50]}...'"}
