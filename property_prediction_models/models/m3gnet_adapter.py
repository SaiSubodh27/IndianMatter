import time
import numpy as np
from typing import Tuple, Optional, Any
from models.base_adapter import BaseModelAdapter
from core.device_manager import get_device_info, get_torch_device

class M3GNetAdapter(BaseModelAdapter):
    """
    Adapter for M3GNet atomistic neural network potential (via matgl).
    """
    def __init__(self):
        super().__init__(model_key="m3gnet", display_name="M3GNet")
        self.potential = None
        self.calculator = None

    def validate_model_installation(self) -> Tuple[bool, str]:
        try:
            import matgl
            return True, "matgl package is installed."
        except ImportError as e:
            return False, f"M3GNet (matgl) is not installed: {str(e)}"

    def load_model(self, device: str = "auto") -> bool:
        valid, msg = self.validate_model_installation()
        if not valid:
            self.is_loaded = False
            return False
        try:
            import matgl
            from matgl.ext.ase import M3GNetCalculator

            torch_dev = get_torch_device(device)
            # Load default pre-trained M3GNet PES model
            try:
                self.potential = matgl.load_model("M3GNet-MP-2021.2.8-PES")
            except Exception:
                self.potential = matgl.load_model("M3GNet-MP-2021.2.8-DIRECT")

            self.calculator = M3GNetCalculator(self.potential)
            self.device = str(torch_dev)
            self.is_loaded = True
            return True
        except Exception as e:
            print(f"[M3GNetAdapter] Load error: {e}")
            self.is_loaded = False
            return False

    def check_device(self) -> dict:
        return get_device_info(self.device)

    def _get_ase_atoms(self, structure: Any):
        from pymatgen.io.ase import AseAtomsAdaptor
        if hasattr(structure, "to_ase_atoms"):
            atoms = AseAtomsAdaptor.get_atoms(structure)
        else:
            atoms = structure  # Already ASE atoms
        atoms.calc = self.calculator
        return atoms

    def predict_energy(self, structure: Any) -> float:
        if not self.is_loaded:
            self.load_model()
        if self.calculator is None:
            raise RuntimeError("M3GNet model is not loaded.")
        atoms = self._get_ase_atoms(structure)
        return float(atoms.get_potential_energy())

    def predict_forces(self, structure: Any) -> np.ndarray:
        if not self.is_loaded:
            self.load_model()
        if self.calculator is None:
            raise RuntimeError("M3GNet model is not loaded.")
        atoms = self._get_ase_atoms(structure)
        return np.array(atoms.get_forces(), dtype=float)

    def predict_stress(self, structure: Any) -> np.ndarray:
        if not self.is_loaded:
            self.load_model()
        if self.calculator is None:
            raise RuntimeError("M3GNet model is not loaded.")
        atoms = self._get_ase_atoms(structure)
        try:
            # ASE stress convention: [xx, yy, zz, yz, xz, xy] in eV/Angstrom^3
            stress_voigt_ev = atoms.get_stress(voigt=True)
            # Convert to GPa: 1 eV/Angstrom^3 = 160.21766208 GPa
            stress_voigt_gpa = stress_voigt_ev * 160.21766208
            xx, yy, zz, yz, xz, xy = stress_voigt_gpa
            tensor_3x3 = np.array([
                [xx, xy, xz],
                [xy, yy, yz],
                [xz, yz, zz]
            ], dtype=float)
            return tensor_3x3
        except Exception as e:
            print(f"[M3GNetAdapter] Stress calculation warning: {e}")
            return np.zeros((3, 3), dtype=float)

    def relax_structure(self, structure: Any, settings: Optional[dict] = None) -> Tuple[Any, dict]:
        if not self.is_loaded:
            self.load_model()
        try:
            from ase.optimize import BFGS
            atoms = self._get_ase_atoms(structure)
            dyn = BFGS(atoms, logfile=None)
            fmax = settings.get("fmax", 0.05) if settings else 0.05
            steps = settings.get("steps", 50) if settings else 50
            start_time = time.time()
            dyn.run(fmax=fmax, steps=steps)
            runtime = time.time() - start_time

            from pymatgen.io.ase import AseAtomsAdaptor
            relaxed_pmg = AseAtomsAdaptor.get_structure(atoms)
            return relaxed_pmg, {
                "converged": dyn.nsteps < steps,
                "n_steps": dyn.nsteps,
                "fmax_achieved": float(np.max(np.linalg.norm(atoms.get_forces(), axis=1))),
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
                "Stress tensor", "Structural relaxation", "Elastic moduli strain-response",
                "Energy-volume EOS curve"
            ],
            "installation_status": msg if not valid else "Installed and ready",
        }

    def unload_model(self) -> bool:
        self.potential = None
        self.calculator = None
        self.is_loaded = False
        return True
