import os
import warnings
import numpy as np
from pymatgen.core import Structure

# Suppress annoying loading warnings in the terminal
warnings.filterwarnings("ignore")

# ---------------------------------------------------------
# 1. LAZY-INITIALIZE CHGNET ON FIRST USE
#    Allows the server to start even if chgnet is installed
#    system-wide (conda) rather than inside the active venv.
# ---------------------------------------------------------
_GLOBAL_CALCULATOR = None
_CHGNET_INIT_ATTEMPTED = False
_CHGNET_AVAILABLE = False


def _ensure_chgnet_calculator():
    """Lazily import chgnet and build the calculator on first call."""
    global _GLOBAL_CALCULATOR, _CHGNET_INIT_ATTEMPTED, _CHGNET_AVAILABLE

    if _CHGNET_INIT_ATTEMPTED:
        return _GLOBAL_CALCULATOR

    _CHGNET_INIT_ATTEMPTED = True

    try:
        from chgnet.model.dynamics import CHGNetCalculator  # noqa: F811
        print("Initializing CHGNet Calculator (first use, this should only happen once)...")
        _GLOBAL_CALCULATOR = CHGNetCalculator()
        _CHGNET_AVAILABLE = True
        print("CHGNet Calculator initialized successfully.")
    except ImportError:
        print(
            "WARNING: 'chgnet' package not found in the current Python environment. "
            "CHGNet-based feature extraction will be unavailable. "
            "Install it with: pip install chgnet"
        )
        _GLOBAL_CALCULATOR = None
    except Exception as e:
        print(f"WARNING: Failed to initialize CHGNet calculator: {e}")
        _GLOBAL_CALCULATOR = None

    return _GLOBAL_CALCULATOR


def extract_mechanical_features(structure: Structure) -> dict:
    """
    Performs a single unrelaxed ML inference pass (via CHGNet) on a pymatgen Structure
    and extracts exactly 21 fixed-length numerical input features for downstream ML models.
    
    Does NOT calculate or derive K, G, E, or nu.
    """
    calculator = _ensure_chgnet_calculator()
    if calculator is None:
        raise RuntimeError(
            "CHGNet calculator is not available. "
            "Make sure the 'chgnet' package is installed: pip install chgnet"
        )

    num_atoms = len(structure)
    if num_atoms == 0:
        raise ValueError("Structure contains zero atoms.")

    # Lazy import — only needed when CHGNet is available
    from pymatgen.io.ase import AseAtomsAdaptor

    # 2. ATTACH THE GLOBAL CALCULATOR (Fast inference)
    adaptor = AseAtomsAdaptor()
    atoms = adaptor.get_atoms(structure)
    atoms.calc = calculator

    energy_eV = float(atoms.get_potential_energy())
    forces = np.array(atoms.get_forces()) # N x 3 array
    stress = np.array(atoms.get_stress()) # Voigt 6-element format: [xx, yy, zz, yz, xz, xy] in GPa

    # 3. Compute Energy Features (2)
    energy_per_atom_eV = energy_eV / num_atoms

    # 4. Compute Force Features from Force Magnitudes (9)
    force_magnitudes = np.linalg.norm(forces, axis=1)

    force_mean = float(np.mean(force_magnitudes))
    force_max = float(np.max(force_magnitudes))
    force_min = float(np.min(force_magnitudes))
    force_std = float(np.std(force_magnitudes))
    force_rms = float(np.sqrt(np.mean(force_magnitudes ** 2)))
    force_p25 = float(np.percentile(force_magnitudes, 25))
    force_median = float(np.median(force_magnitudes))
    force_p75 = float(np.percentile(force_magnitudes, 75))
    force_p95 = float(np.percentile(force_magnitudes, 95))

    # 5. Normalize Stress Components (Voigt: Sxx, Syy, Szz, Sxy, Syz, Sxz)
    # index 0: xx, 1: yy, 2: zz, 3: yz, 4: xz, 5: xy
    s_xx = float(stress[0])
    s_yy = float(stress[1])
    s_zz = float(stress[2])
    s_yz = float(stress[3])
    s_xz = float(stress[4])
    s_xy = float(stress[5])

    # Derived stress statistics
    hydrostatic_stress_GPa = float((s_xx + s_yy + s_zz) / 3.0)
    stress_std_GPa = float(np.std([s_xx, s_yy, s_zz, s_xy, s_yz, s_xz]))
    max_abs_stress_GPa = float(max(abs(s_xx), abs(s_yy), abs(s_zz), abs(s_xy), abs(s_yz), abs(s_xz)))

    # 3D von Mises stress definition from full symmetric tensor
    von_mises_stress_GPa = float(np.sqrt(
        0.5 * (
            (s_xx - s_yy) ** 2 +
            (s_yy - s_zz) ** 2 +
            (s_zz - s_xx) ** 2 +
            6.0 * (s_xy ** 2 + s_yz ** 2 + s_xz ** 2)
        )
    ))

    # Assemble the exact 21-element feature vector in strict order
    feature_vector = [
        energy_eV,
        energy_per_atom_eV,
        force_mean,
        force_max,
        force_min,
        force_std,
        force_rms,
        force_p25,
        force_median,
        force_p75,
        force_p95,
        s_xx,
        s_yy,
        s_zz,
        s_xy,
        s_yz,
        s_xz,
        hydrostatic_stress_GPa,
        stress_std_GPa,
        max_abs_stress_GPa,
        von_mises_stress_GPa
    ]

    feature_names = [
        "energy_eV",
        "energy_per_atom_eV",
        "force_mean_eV_ang",
        "force_max_eV_ang",
        "force_min_eV_ang",
        "force_std_eV_ang",
        "force_rms_eV_ang",
        "force_p25_eV_ang",
        "force_median_eV_ang",
        "force_p75_eV_ang",
        "force_p95_eV_ang",
        "stress_xx_GPa",
        "stress_yy_GPa",
        "stress_zz_GPa",
        "stress_xy_GPa",
        "stress_yz_GPa",
        "stress_xz_GPa",
        "hydrostatic_stress_GPa",
        "stress_std_GPa",
        "max_abs_stress_GPa",
        "von_mises_stress_GPa"
    ]

    units = {
        "energy": "eV",
        "energy_per_atom": "eV",
        "forces": "eV/Angstrom",
        "stress": "GPa"
    }

    # Strict Validation Checks
    assert len(feature_vector) == 21, f"Expected 21 features, got {len(feature_vector)}"
    assert all(np.isfinite(feature_vector)), "Feature vector contains NaN or Inf values."

    return {
        "feature_vector": feature_vector,
        "feature_names": feature_names,
        "units": units,
        "num_atoms": num_atoms,
        "relaxation_performed": False
    }


if __name__ == "__main__":
    # Test execution with a sample NaCl structure
    from pymatgen.core import Lattice
    test_struct = Structure(Lattice.cubic(5.69), ["Na", "Cl"], [[0, 0, 0], [0.5, 0.5, 0.5]])
    print("Running feature extraction test...")
    result = extract_mechanical_features(test_struct)
    print(f"Successfully extracted {len(result['feature_vector'])} features for {result['num_atoms']} atoms.")
    for name, val in zip(result["feature_names"], result["feature_vector"]):
        print(f"  {name}: {val:.4f}")