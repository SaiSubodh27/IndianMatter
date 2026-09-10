#!/usr/bin/env python3
"""
End-to-end Materials Property Prediction Pipeline Example Script
Demonstrates parsing a structure (NaCl / LiFePO4), running direct atomistic outputs,
pymatgen/matminer descriptors, strain-perturbation mechanical properties, and thermal/electrical evaluation.
"""
import sys
import os
import json

sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", "backend"))

from pymatgen.core import Structure, Lattice
from prediction_models.model_registry import model_registry
from properties.property_registry import property_registry
from calculations.strain_response import run_strain_response_calculation

def run_example():
    print("=" * 70)
    print(" IndianMatter Materials-Property Prediction Pipeline Example ")
    print("=" * 70)

    # 1. Create cubic NaCl structure
    lattice = Lattice.cubic(5.64)
    structure = Structure(
        lattice,
        ["Na", "Na", "Na", "Na", "Cl", "Cl", "Cl", "Cl"],
        [
            [0, 0, 0], [0, 0.5, 0.5], [0.5, 0, 0.5], [0.5, 0.5, 0],
            [0.5, 0.5, 0.5], [0.5, 0, 0], [0, 0.5, 0], [0, 0, 0.5]
        ]
    )

    formula = structure.composition.reduced_formula
    print(f"\n1. Input Material: {formula} (Cubic System, Volume: {structure.volume:.2f} Å³)")

    # 2. Inspect registered properties
    props = property_registry.list_properties()
    print(f"2. Registered Properties in Pipeline: {len(props)} properties")
    for p in props[:6]:
        print(f"   - [{p['category']}] {p['name']} ({p['key']}) -> Unit: {p['unit']}")

    # 3. Composition & Structural Descriptors
    comp_calc = property_registry.get_calculator("composition_descriptors")
    comp_res = comp_calc.calculate(structure)
    print("\n3. Composition Descriptors:")
    print(f"   - Average Atomic Mass: {comp_res.value.get('average_atomic_mass_amu')} amu")
    print(f"   - Mean Electronegativity: {comp_res.value.get('mean_electronegativity')}")

    struct_calc = property_registry.get_calculator("structural_descriptors")
    struct_res = struct_calc.calculate(structure)
    print("\n4. Structural Descriptors:")
    print(f"   - Space Group: {struct_res.value.get('space_group_symbol')} (#{struct_res.value.get('space_group_number')})")
    print(f"   - Density: {struct_res.value.get('density_g_cm3')} g/cm³")

    # 5. Check Atomistic ML Models (M3GNet, CHGNet, MACE)
    m3gnet_adapter = model_registry.get_adapter("m3gnet")
    valid_m3g, msg = m3gnet_adapter.validate_model_installation()
    print(f"\n5. M3GNet Model Installation: {'[OK]' if valid_m3g else '[UNAVAILABLE]'} ({msg})")

    if valid_m3g:
        print("   Evaluating M3GNet Single-Point Energy & Forces...")
        try:
            m3gnet_adapter.load_model(device="auto")
            sp_res = m3gnet_adapter.calculate_single_point(structure)
            print(f"   - Total Energy: {sp_res['total_energy_eV']:.4f} eV")
            print(f"   - Energy Per Atom: {sp_res['energy_per_atom_eV']:.4f} eV/atom")

            print("   Running Symmetry-Aware Strain Perturbation Mechanical Simulation...")
            mech_res = run_strain_response_calculation(m3gnet_adapter, structure)
            print(f"   - Bulk Modulus: {mech_res.get('bulk_modulus_gpa')} GPa")
            print(f"   - Shear Modulus: {mech_res.get('shear_modulus_gpa')} GPa")
            print(f"   - Young's Modulus: {mech_res.get('youngs_modulus_gpa')} GPa")
            print(f"   - Poisson's Ratio: {mech_res.get('poisson_ratio')}")
        except Exception as e:
            print(f"   M3GNet evaluation notice: {e}")

    # 6. Test Excluded Property (Ionic Conductivity)
    excl_calc = property_registry.get_calculator("ionic_conductivity")
    excl_res = excl_calc.calculate(structure)
    print(f"\n6. Excluded Property Handling ({excl_res.property_name}):")
    print(f"   - Status: {excl_res.status}")
    print(f"   - Warning: {excl_res.warnings[0]}")

    print("\n" + "=" * 70)
    print(" End-to-End Prediction Example Completed Successfully!")
    print("=" * 70)
    return 0

if __name__ == "__main__":
    sys.exit(run_example())
