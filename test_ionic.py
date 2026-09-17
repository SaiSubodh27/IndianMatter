import sys
import numpy as np
from pymatgen.core import Structure, Lattice
from backend.properties.ionic_conductivity import IonicConductivityCalculator

class MockV5BaseModelAdapter:
    def __init__(self):
        self.display_name = "v5_base_model_electrolyte_adapter"

    def predict_ionic_transport(self, structure: Structure, temperature: float) -> dict:
        # Mocking typical solid-state electrolyte response (e.g., Li-ion conductor like LLZO/LFP)
        return {
            "activation_energy_ev": 0.38,
            "ionic_conductivity_ms_cm": 2.45,  # mS/cm at room temp
            "diffusivity_cm2_s": 1.2e-8
        }

def main():
    print("=" * 60)
    print("Testing `IonicConductivityCalculator` with v5_base_model")
    print("=" * 60)

    lattice = Lattice.cubic(12.96) # Mock cubic garnet-like supercell
    species = ["Li", "La", "Zr", "O"]
    coords = [
        [0.0, 0.0, 0.0], [0.25, 0.25, 0.25], [0.5, 0.5, 0.5], [0.75, 0.75, 0.75]
    ]
    structure = Structure(lattice, species, coords)

    adapter = MockV5BaseModelAdapter()
    calculator = IonicConductivityCalculator()

    print("\nRunning ionic transport prediction...")
    res = calculator.calculate(structure, adapter, settings={"temperature_k": 298.15})

    data = res.to_dict() if hasattr(res, "to_dict") else dict(res)
    raw = data.get("raw_details", {}) or {}

    print("\n" + "-" * 40)
    print("Calculation Output Summary:")
    print("-" * 40)
    print(f"Status                  : {data.get('status')}")
    print(f"Model Used              : {adapter.display_name}")
    print(f"Activation Energy (Ea)  : {raw.get('activation_energy_ev')} eV")
    print(f"Ionic Conductivity      : {data.get('value')} mS/cm")
    print(f"Target Temperature      : {raw.get('temperature_k')} K")

    if data.get("warnings"):
        print(f"Warnings                : {data.get('warnings')}")

    if data.get('value') is not None:
        print("\nSUCCESS: Ionic conductivity pipeline executed cleanly!")
    else:
        print("\nFAILURE: Calculation failed.")

if __name__ == "__main__":
    main()