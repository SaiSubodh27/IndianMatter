"""Abstract base adapter for ML interatomic potentials (M3GNet/CHGNet/MACE).

Role in the system
------------------
Defines the common interface (predict energy/forces/stress, relax_structure,
calculate_single_point, strain response, energy-volume curve, unload_model)
implemented by the three MLIP adapters. Part of the (unwired)
``/api/materials-prediction`` pipeline; live MLIP usage goes through
cif_pipeline (MACE) and the chgnet_features util.
"""

from abc import ABC, abstractmethod  # abstract base for MLIP adapters
from typing import Dict, Any, Optional, Tuple, List
import numpy as np

class BaseModelAdapter(ABC):
    """
    Abstract base adapter for atomistic ML models (M3GNet, CHGNet, MACE).
    Enforces a uniform interface for energy, force, stress, structural relaxation,
    and strain perturbation responses.
    """
    def __init__(self, model_key: str, display_name: str):
        self.model_key = model_key
        self.display_name = display_name
        self.model = None
        self.is_loaded = False
        self.device = "cpu"

    @abstractmethod
    def validate_model_installation(self) -> Tuple[bool, str]:
        """Check if required packages/checkpoints for this model are installed."""
        pass

    @abstractmethod
    def load_model(self, device: str = "auto") -> bool:
        """Load model weights onto the target compute device."""
        pass

    @abstractmethod
    def check_device(self) -> dict:
        """Return device details and memory usage for this adapter."""
        pass

    @abstractmethod
    def predict_energy(self, structure: Any) -> float:
        """Predict total energy (eV) for the given pymatgen/ASE Structure."""
        pass

    @abstractmethod
    def predict_forces(self, structure: Any) -> np.ndarray:
        """Predict atomic forces (eV/Angstrom) of shape [N_atoms, 3]."""
        pass

    @abstractmethod
    def predict_stress(self, structure: Any) -> np.ndarray:
        """Predict 3x3 stress tensor (GPa) or Voigt components [s_xx, s_yy, s_zz, s_yz, s_xz, s_xy]."""
        pass

    @abstractmethod
    def relax_structure(self, structure: Any, settings: Optional[dict] = None) -> Tuple[Any, dict]:
        """Relax internal atomic positions and lattice parameters if supported."""
        pass

    def calculate_single_point(self, structure: Any, settings: Optional[dict] = None) -> dict:
        """Evaluate single-point energy, energy per atom, forces, and stress tensor."""
        if not self.is_loaded:
            self.load_model(device=settings.get("device", "auto") if settings else "auto")

        e_tot = self.predict_energy(structure)
        n_atoms = len(structure)
        e_per_atom = e_tot / max(n_atoms, 1)
        forces = self.predict_forces(structure)
        stress = self.predict_stress(structure)

        vol = float(structure.volume)
        density = float(structure.density)

        return {
            "total_energy_eV": float(e_tot),
            "energy_per_atom_eV": float(e_per_atom),
            "forces_ev_ang": forces.tolist() if isinstance(forces, np.ndarray) else forces,
            "stress_tensor_gpa": stress.tolist() if isinstance(stress, np.ndarray) else stress,
            "num_atoms": n_atoms,
            "volume_ang3": vol,
            "density_g_cm3": density,
            "model": self.display_name,
            "device": self.device,
        }

    @abstractmethod
    def calculate_strain_response(self, structure: Any, strain_settings: Optional[dict] = None) -> dict:
        """Apply controlled strain perturbations to evaluate stress response and fit elastic moduli."""
        pass

    @abstractmethod
    def calculate_energy_volume_curve(self, structure: Any, eos_settings: Optional[dict] = None) -> dict:
        """Calculate energy-volume equation of state response."""
        pass

    @abstractmethod
    def get_model_metadata(self) -> dict:
        """Return model metadata, capabilities, checkpoint, and version."""
        pass

    @abstractmethod
    def unload_model(self) -> bool:
        """Unload model from GPU/memory."""
        pass
