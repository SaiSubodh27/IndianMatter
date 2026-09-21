
import os
import pathlib
from pymatgen.core import Structure, Lattice

def download_and_initialize_alignn():
    base_dir = pathlib.Path(__file__).resolve().parent.parent.parent
    alignn_dir = os.path.join(base_dir, "final_models", "alignn_weights")
    os.makedirs(alignn_dir, exist_ok=True)
    
    print(f"Target local ALIGNN directory: {alignn_dir}")
    
    try:
        from alignn.pretrained import get_prediction
        
        # Create a simple test structure to trigger ALIGNN's automatic model download & caching
        test_struct = Structure(Lattice.cubic(5.69), ["Na", "Cl"], [[0, 0, 0], [0.5, 0.5, 0.5]])
        
        print("Triggering ALIGNN model download & caching (jv_formation_energy_per_atom)...")
        # get_prediction automatically downloads and caches the specified model weights
        res = get_prediction(model_name="jv_formation_energy_per_atom", structure=test_struct)
        print(f"ALIGNN model initialized successfully! Sample prediction: {res}")
        
    except Exception as e:
        import traceback
        traceback.print_exc()
        print(f"Failed to initialize ALIGNN: {str(e)}")

if __name__ == "__main__":
    download_and_initialize_alignn()
