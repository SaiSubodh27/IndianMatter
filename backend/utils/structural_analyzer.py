from pymatgen.core import Structure, Lattice
from pymatgen.symmetry.analyzer import SpacegroupAnalyzer

def calculate_structural_metrics(data: dict) -> dict:
    """
    Reconstructs a Pymatgen structure from JSON data and computes 
    key crystallographic and physical metrics.
    """
    # 1. Extract lattice parameters
    lat = data["lattice"]
    lattice = Lattice.from_parameters(
        a=lat["a"],
        b=lat["b"],
        c=lat["c"],
        alpha=lat["alpha"],
        beta=lat["beta"],
        gamma=lat["gamma"]
    )
    
    # 2. Extract atomic species and fractional coordinates
    species = [atom["species"] for atom in data["atoms"]]
    coords = [atom["fractional_coordinates"] for atom in data["atoms"]]
    
    # 3. Build the core Pymatgen Structure object
    structure = Structure(lattice, species, coords)
    
    # 4. Analyze symmetry and crystal system
    sga = SpacegroupAnalyzer(structure)
    primitive_struct = sga.get_primitive_standard_structure()
    
    # 5. Compile structural metrics
    structural_metrics = {
        "data_block": data.get("data_block", "unknown"),
        "formula": structure.composition.reduced_formula,
        "crystal_system": sga.get_crystal_system(),
        "space_group_symbol": sga.get_space_group_symbol(),
        "space_group_number": sga.get_space_group_number(),
        "atom_count": len(structure),
        "volume_angstrom3": round(structure.volume, 3),
        "density_g_cm3": round(structure.density, 3),
        "packing_fraction": round(primitive_struct.volume / structure.volume, 3) if structure.volume else None
    }
    
    return structural_metrics