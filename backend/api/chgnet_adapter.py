import time
import numpy as np
from typing import Tuple, Optional, Any
from backend.models.base_adapter import BaseModelAdapter
from core.device_manager import get_device_info, get_torch_device

class CHGNetAdapter(BaseModelAdapter):
    """
    Adapter for CHGNet crystal Hamiltonian graph neural network potential.
    """
    def __init__(self):
        super().__init__(model_key="chgnet", display_name="CHGNet")
        self.chgnet_model = None
        self.calculator = None

    def validate_model_installation(self) -> Tuple[bool, str]:
        try:
            import chgnet
            return True, "chgnet package is installed."
        except ImportError as e:
            return False, f"CHGNet is not installed: {str(e)}"

    def load_model(self, device: str = "auto") -> bool:
        valid, msg = self.validate_model_installation()
        if not valid:
            self.is_loaded = False
            return False
        try:
            from chgnet.model import CHGNet
            from chgnet.model.dynamics import CHGNetCalculator

            torch_dev = get_torch_device(device)
            self.chgnet_model = CHGNet.load()
            self.calculator = CHGNetCalculator(model=self.chgnet_model, use_device=str(torch_dev))
            self.device = str(torch_dev)
            self.is_loaded = True
            return True
        except Exception as e:
            print(f"[CHGNetAdapter] Load error: {e}")
            self.is_loaded = False
            return False

    def check_device(self) -> dict:
        return get_device_info(self.device)

    def _get_ase_atoms(self, structure: Any):
        from pymatgen.io.ase import AseAtomsAdaptor
        if hasattr(structure, "to_ase_atoms"):
            atoms = AseAtomsAdaptor.get_atoms(structure)
        else:
            atoms = structure
        atoms.calc = self.calculator
        return atoms

    def predict_energy(self, structure: Any) -> float:
        if not self.is_loaded:
            if not self.load_model():
                raise RuntimeError("CHGNet model is not installed or failed to load.")
        atoms = self._get_ase_atoms(structure)
        return float(atoms.get_potential_energy())

    def predict_forces(self, structure: Any) -> np.ndarray:
        if not self.is_loaded:
            if not self.load_model():
                raise RuntimeError("CHGNet model is not installed or failed to load.")
        atoms = self._get_ase_atoms(structure)
        return np.array(atoms.get_forces(), dtype=float)

    def predict_stress(self, structure: Any) -> np.ndarray:
        if not self.is_loaded:
            if not self.load_model():
                raise RuntimeError("CHGNet model is not installed or failed to load.")
        atoms = self._get_ase_atoms(structure)
        try:
            stress_voigt_ev = atoms.get_stress(voigt=True)
            stress_voigt_gpa = stress_voigt_ev * 160.21766208
            xx, yy, zz, yz, xz, xy = stress_voigt_gpa
            return np.array([
                [xx, xy, xz],
                [xy, yy, yz],
                [xz, yz, zz]
            ], dtype=float)
        except Exception as e:
            print(f"[CHGNetAdapter] Stress calculation warning: {e}")
            return np.zeros((3, 3), dtype=float)

    def relax_structure(self, structure: Any, settings: Optional[dict] = None) -> Tuple[Any, dict]:
        if not self.is_loaded:
            if not self.load_model():
                return structure, {"converged": False, "error": "CHGNet model is not installed."}
        try:
            from chgnet.model.dynamics import StructOptimizer
            optimizer = StructOptimizer(model=self.chgnet_model, use_device=self.device)
            fmax = settings.get("fmax", 0.05) if settings else 0.05
            steps = settings.get("steps", 50) if settings else 50
            start_time = time.time()
            res = optimizer.relax(structure, fmax=fmax, steps=steps, verbose=False)
            runtime = time.time() - start_time
            relaxed_struct = res.get("final_structure", structure)
            return relaxed_struct, {
                "converged": res.get("trajectory", None) is not None,
                "n_steps": len(res.get("trajectory", {}).get("energies", [])),
                "runtime_seconds": round(runtime, 3),
            }
        except Exception as e:
            return structure, {"converged": False, "error": str(e)}

    def calculate_strain_response(self, structure: Any, strain_settings: Optional[dict] = None) -> dict:
        from calculations.strain_response import run_strain_response_calculation
        return run_strain_response_calculation(self, structure, strain_settings)

    def calculate_energy_volume_curve(self, structure: Any, eos_settings: Optional[dict] = None) -> dict:
        from calculations.eos import run_eos_calculation
        return run_eos_calculation(self, structure, eos_settings)

    def get_model_metadata(self) -> dict:
        valid, msg = self.validate_model_installation()
        return {
            "model_key": self.model_key,
            "name": self.display_name,
            "installed": valid,
            "loaded": self.is_loaded,
            "device": self.device,
            "capabilities": [
                "Total energy", "Energy per atom", "Atomic forces",
                "Stress tensor", "Structural relaxation", "Magnetic moments",
                "Elastic moduli strain-response", "Energy-volume EOS curve"
            ],
            "installation_status": msg if not valid else "Installed and ready",
        }

    def unload_model(self) -> bool:
        self.chgnet_model = None
        self.calculator = None
        self.is_loaded = False
        return True
