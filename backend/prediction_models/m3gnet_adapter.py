"""M3GNet MLIP adapter (prediction_models/ variant — live path).

Role in the system
------------------
Wraps matgl.load_model('M3GNet-MP-2021.2.8-PES'/'DIRECT') + M3GNetCalculator;
``predict_mechanical_instant`` computes K/G via finite-strain stress.
"""

import time  # timing for predict calls
import numpy as np
from typing import Tuple, Optional, Any
from prediction_models.base_adapter import BaseModelAdapter
from core.device_manager import get_device_info, get_torch_device

class M3GNetAdapter(BaseModelAdapter):
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
    def predict_mechanical_instant(self, structure: Any) -> dict:
        """
        Predicts Bulk (K) and Shear (G) modulus using matgl (M3GNet-MP).
        Uses a lightweight finite-difference strain approach on the M3GNet
        potential — no TensorFlow required.
        """
        try:
            import matgl
            from matgl.ext.ase import M3GNetCalculator
            from pymatgen.io.ase import AseAtomsAdaptor
            import numpy as np

            # Ensure we have a pymatgen Structure
            if hasattr(structure, "get_positions"):
                pmg_structure = AseAtomsAdaptor.get_structure(structure)
            else:
                pmg_structure = structure

            # Lazy-load the M3GNet potential (reuse if already loaded)
            if getattr(self, '_mech_potential', None) is None:
                print("[M3GNetAdapter] Loading M3GNet potential for mechanical prediction...")
                try:
                    self._mech_potential = matgl.load_model("M3GNet-MP-2021.2.8-PES")
                except Exception:
                    self._mech_potential = matgl.load_model("M3GNet-MP-2021.2.8-DIRECT")
                self._mech_calculator = M3GNetCalculator(self._mech_potential)

            atoms = AseAtomsAdaptor.get_atoms(pmg_structure)
            atoms.calc = self._mech_calculator

            # Get equilibrium stress tensor (Voigt, eV/Å³)
            stress_voigt = atoms.get_stress(voigt=True)  # [xx, yy, zz, yz, xz, xy] eV/Å³
            stress_gpa = stress_voigt * 160.21766208     # convert eV/Å³ → GPa

            # Bulk modulus: K = -V * (dP/dV) ≈ mean normal stress magnitude (hydrostatic)
            # For a quick estimate from the stress tensor:
            # P = -(sigma_xx + sigma_yy + sigma_zz)/3
            # K estimated via finite difference on isotropic compression
            delta = 0.01  # 1% strain
            vol0 = atoms.get_volume()

            def stress_at_strain(eps):
                """Apply isotropic strain eps and get pressure."""
                from ase import Atoms as AseAtoms
                strained = atoms.copy()
                strained.set_cell(atoms.get_cell() * (1 + eps) ** (1/3), scale_atoms=True)
                strained.calc = self._mech_calculator
                s = strained.get_stress(voigt=True) * 160.21766208
                return -(s[0] + s[1] + s[2]) / 3.0  # pressure in GPa

            P_plus  = stress_at_strain(+delta)
            P_minus = stress_at_strain(-delta)
            K = vol0 * (P_plus - P_minus) / (2 * delta * vol0) * 160.21766208 / 160.21766208
            # Simplified: K ≈ -V * dP/dV = -(P_plus - P_minus)/(2*delta) * sign
            K = abs((P_plus - P_minus) / (2 * delta))

            # Shear modulus: apply shear strain and measure shear stress
            def stress_at_shear(eps_xy):
                from copy import deepcopy
                strained = atoms.copy()
                cell = strained.get_cell().copy()
                cell[0, 1] += eps_xy * cell[1, 1]
                strained.set_cell(cell, scale_atoms=True)
                strained.calc = self._mech_calculator
                s = strained.get_stress(voigt=True) * 160.21766208
                return s[5]  # sigma_xy in GPa

            tau_plus  = stress_at_shear(+delta)
            tau_minus = stress_at_shear(-delta)
            G = abs((tau_plus - tau_minus) / (2 * delta))

            return {
                "status": "success",
                "model": "M3GNet-MP (matgl)",
                "bulk_modulus_gpa": round(float(K), 2),
                "shear_modulus_gpa": round(float(G), 2),
            }

        except ImportError:
            return {
                "status": "error",
                "detail": "The 'matgl' package is missing. Run: pip install matgl"
            }
        except Exception as e:
            return {"status": "error", "detail": str(e)}

    def load_model(self, device: str = "auto") -> bool:
        valid, msg = self.validate_model_installation()
        if not valid:
            self.is_loaded = False
            return False
        try:
            import matgl
            from matgl.ext.ase import M3GNetCalculator

            torch_dev = get_torch_device(device)
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
            atoms = structure
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
            stress_voigt_ev = atoms.get_stress(voigt=True)
            stress_voigt_gpa = stress_voigt_ev * 160.21766208
            xx, yy, zz, yz, xz, xy = stress_voigt_gpa
            return np.array([
                [xx, xy, xz],
                [xy, yy, yz],
                [xz, yz, zz]
            ], dtype=float)
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
