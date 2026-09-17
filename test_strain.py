import sys
import numpy as np
from pymatgen.core import Structure, Lattice

# Import your thermal calculator
from backend.properties.thermal_properties import ThermalPropertyCalculator

# 1. Mock Adapter simulating an Energy-Volume curve
class MockThermalAdapter:
    def __init__(self):
        self.display_name = "Mock_M3GNet_Thermal"

    def predict_structure(self, structure: Structure) -> dict:
        V0_ideal = 160.0
        E0_ideal = -5.4 # eV/atom
        k = 0.002 # curvature
        
        V = structure.volume
        e_per_atom = E0_ideal + k * (V - V0_ideal)**2
        
        return {
            "energy_per_atom": e_per_atom,
            "status": "success"
        }

def main():
    print("=" * 60)
    print("Testing `ThermalPropertyCalculator` (Birch-Murnaghan EOS)")
    print("=" * 60)

    lattice = Lattice.cubic(5.4306) 
    species = ["Si", "Si", "Si", "Si", "Si", "Si", "Si", "Si"]
    coords = [
        [0.0, 0.0, 0.0], [0.5, 0.5, 0.0], [0.5, 0.0, 0.5], [0.0, 0.5, 0.5],
        [0.25, 0.25, 0.25], [0.75, 0.75, 0.25], [0.75, 0.25, 0.75], [0.25, 0.75, 0.75]
    ]
    structure = Structure(lattice, species, coords)

    print(f"✓ Target Structure: {structure.composition.reduced_formula}")
    print(f"  Initial Volume: {structure.volume:.2f} Å³ | Sites: {len(structure)}")

    adapter = MockThermalAdapter()
    calculator = ThermalPropertyCalculator()

    print("\nRunning volumetric scaling and EOS fitting...")
    res = calculator.calculate(structure, adapter)

    print("\n" + "-" * 40)
    print("Calculation Output Summary:")
    print("-" * 40)
    
    # Handle PropertyResult object conversion safely
    if hasattr(res, "to_dict"):
        data = res.to_dict()
    elif isinstance(res, dict):
        data = res
    else:
        data = res.__dict__

    # Extract raw details safely whether nested or flat
    raw = data.get("raw_details", data) or {}

    status = data.get('status', 'unknown')
    e0 = raw.get('e0') or data.get('e0')
    v0 = raw.get('v0_equilibrium') or data.get('v0_equilibrium')
    b0 = data.get('value') or raw.get('b0_eos_gpa')
    b1 = raw.get('b1_prime') or data.get('b1_prime')

    print(f"Status                  : {status}")
    print(f"Model Used              : {adapter.display_name}")
    print(f"Equilibrium Energy (E0) : {e0} eV" if e0 else "Equilibrium Energy (E0) : None eV")
    print(f"Equilibrium Vol (V0)    : {v0:.2f} Å³" if v0 else "Equilibrium Vol (V0)    : None Å³")
    print(f"EOS Bulk Modulus (B0)   : {b0:.3f} GPa" if b0 else "EOS Bulk Modulus (B0)   : None GPa")
    print(f"B1 Prime (Derivative)   : {b1}" if b1 else "B1 Prime (Derivative)   : None")

    warnings = data.get("warnings") or data.get("warning")
    if warnings:
        print(f"Warnings                : {warnings}")

    if b0 is not None:
        print("\nSUCCESS: Birch-Murnaghan EOS fitted cleanly!")
    else:
        print("\nFAILURE: EOS fitting returned empty or failed.")

if __name__ == "__main__":
    main()