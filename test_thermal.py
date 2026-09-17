import sys
import numpy as np
from pymatgen.core import Structure, Lattice
from backend.properties.thermal_properties import ThermalPropertyCalculator

class MockThermalAdapter:
    def __init__(self):
        self.display_name = "Mock_M3GNet_Thermal"

    def predict_structure(self, structure: Structure) -> dict:
        V0_ideal = 160.0
        E0_ideal = -5.4 
        k = 0.002 
        
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
    species = ["Si"] * 8
    coords = [
        [0.0, 0.0, 0.0], [0.5, 0.5, 0.0], [0.5, 0.0, 0.5], [0.0, 0.5, 0.5],
        [0.25, 0.25, 0.25], [0.75, 0.75, 0.25], [0.75, 0.25, 0.75], [0.25, 0.75, 0.75]
    ]
    structure = Structure(lattice, species, coords)

    adapter = MockThermalAdapter()
    calculator = ThermalPropertyCalculator()

    print("\nRunning volumetric scaling and EOS fitting...")
    res = calculator.calculate(structure, adapter)

    # Convert PropertyResult to standard dict safely
    data = res.to_dict() if hasattr(res, "to_dict") else dict(res)
    raw = data.get("raw_details", {}) or {}

    print("\n" + "-" * 40)
    print("Calculation Output Summary:")
    print("-" * 40)
    print(f"Status                  : {data.get('status')}")
    print(f"Model Used              : {adapter.display_name}")
    print(f"Equilibrium Energy (E0) : {raw.get('e0')} eV")
    print(f"Equilibrium Vol (V0)    : {raw.get('v0_equilibrium')} Å³")
    print(f"EOS Bulk Modulus (B0)   : {data.get('value')} GPa")
    print(f"B1 Prime (Derivative)   : {raw.get('b1_prime')}")

    if data.get("warnings"):
        print(f"Warnings                : {data.get('warnings')}")

    if data.get('value') is not None:
        print("\nSUCCESS: Birch-Murnaghan EOS fitted cleanly!")
    else:
        print("\nFAILURE: EOS fitting returned empty or failed.")

if __name__ == "__main__":
    main()