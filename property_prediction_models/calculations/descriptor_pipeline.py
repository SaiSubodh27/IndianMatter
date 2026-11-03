import math
import numpy as np
from typing import Optional, Dict, Any
from pymatgen.core import Structure, Composition
from pymatgen.symmetry.analyzer import SpacegroupAnalyzer

def compute_composition_descriptors(formula_or_comp: Any) -> dict:
    if isinstance(formula_or_comp, str):
        comp = Composition(formula_or_comp)
    elif isinstance(formula_or_comp, Composition):
        comp = formula_or_comp
    else:
        comp = Composition(str(formula_or_comp))

    elements = comp.elements
    n_elements = len(elements)
    n_atoms = float(comp.num_atoms)
    weights = [comp.get_atomic_fraction(el) for el in elements]

    masses = [float(el.atomic_mass) for el in elements]
    avg_mass = sum(w * m for w, m in zip(weights, masses))

    # Electronegativities
    x_vals = [float(el.X) if el.X is not None else 0.0 for el in elements]
    if x_vals and any(x > 0 for x in x_vals):
        valid_x = [x for x in x_vals if x > 0]
        mean_x = sum(w * x for w, x in zip(weights, x_vals))
        min_x = min(valid_x)
        max_x = max(valid_x)
        range_x = max_x - min_x
    else:
        mean_x, min_x, max_x, range_x = 0.0, 0.0, 0.0, 0.0

    # Radii
    r_vals = [float(el.atomic_radius) if el.atomic_radius is not None else 1.0 for el in elements]
    mean_r = sum(w * r for w, r in zip(weights, r_vals))
    min_r = min(r_vals)
    max_r = max(r_vals)
    range_r = max_r - min_r

    # Valence electrons
    valence_counts = [int(el.mendeleev_no) if el.mendeleev_no is not None else 0 for el in elements]
    mean_mendeleev = sum(w * m for w, m in zip(weights, valence_counts))

    return {
        "reduced_formula": str(comp.reduced_formula),
        "num_elements": n_elements,
        "num_atoms": n_atoms,
        "average_atomic_mass_amu": round(avg_mass, 3),
        "mean_electronegativity": round(mean_x, 3),
        "min_electronegativity": round(min_x, 3),
        "max_electronegativity": round(max_x, 3),
        "electronegativity_range": round(range_x, 3),
        "mean_atomic_radius_ang": round(mean_r, 3),
        "atomic_radius_range_ang": round(range_r, 3),
        "mean_mendeleev_number": round(mean_mendeleev, 2),
        "element_fractions": {str(el): round(comp.get_atomic_fraction(el), 4) for el in elements},
    }

def compute_structure_descriptors(structure: Structure) -> dict:
    lat = structure.lattice
    comp = structure.composition

    crystal_system = "Unknown"
    space_group_symbol = "Unknown"
    space_group_number = 0

    try:
        sga = SpacegroupAnalyzer(structure)
        crystal_system = sga.get_crystal_system().title()
        space_group_symbol = sga.get_space_group_symbol()
        space_group_number = sga.get_space_group_number()
    except Exception as e:
        print(f"[descriptor_pipeline] Symmetry warning: {e}")

    # Neighbor distance statistics
    all_dists = []
    for i in range(min(len(structure), 20)):
        neighbors = structure.get_neighbors(structure[i], r=4.0)
        for n in neighbors:
            all_dists.append(n.nn_distance)

    mean_bond_length = float(np.mean(all_dists)) if all_dists else 0.0
    min_bond_length = float(np.min(all_dists)) if all_dists else 0.0

    return {
        "volume_ang3": round(float(lat.volume), 3),
        "density_g_cm3": round(float(structure.density), 3),
        "num_sites": len(structure),
        "num_species": len(comp.elements),
        "lattice_a_ang": round(float(lat.a), 4),
        "lattice_b_ang": round(float(lat.b), 4),
        "lattice_c_ang": round(float(lat.c), 4),
        "lattice_alpha_deg": round(float(lat.alpha), 3),
        "lattice_beta_deg": round(float(lat.beta), 3),
        "lattice_gamma_deg": round(float(lat.gamma), 3),
        "crystal_system": crystal_system,
        "space_group_symbol": space_group_symbol,
        "space_group_number": space_group_number,
        "mean_neighbor_distance_ang": round(mean_bond_length, 3),
        "min_neighbor_distance_ang": round(min_bond_length, 3),
    }
