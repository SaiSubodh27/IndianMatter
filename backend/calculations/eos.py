import time
import numpy as np
from typing import Any, Optional
from pymatgen.core import Structure
from scipy.optimize import curve_fit

def murnaghan_eos(v, e0, b0, b0_prime, v0):
    """Murnaghan Equation of State."""
    eta = v0 / v
    return e0 + 160.21766208 * (b0 * v / (b0_prime * (b0_prime - 1.0))) * (
        (eta ** b0_prime) + b0_prime * (1.0 - eta) - 1.0
    )

def run_eos_calculation(model_adapter: Any, structure: Structure, eos_settings: Optional[dict] = None) -> dict:
    settings = eos_settings or {}
    vol_factors = np.linspace(0.92, 1.08, 9)  # +/- 8% volume scaling
    
    volumes = []
    energies = []
    start_time = time.time()

    orig_lattice = structure.lattice

    for factor in vol_factors:
        scaled_vol = orig_lattice.volume * factor
        scaled_struct = structure.copy()
        scaled_struct.scale_lattice(scaled_vol)
        
        e_tot = model_adapter.predict_energy(scaled_struct)
        volumes.append(scaled_vol)
        energies.append(e_tot)

    volumes = np.array(volumes)
    energies = np.array(energies)

    # Initial guesses: e0 = min(E), v0 = V at min(E), b0 = 100 GPa, b0_prime = 4.0
    min_idx = np.argmin(energies)
    p0 = [energies[min_idx], 100.0, 4.0, volumes[min_idx]]

    try:
        popt, _ = curve_fit(murnaghan_eos, volumes, energies, p0=p0, maxfev=2000)
        e0, b0, b0_prime, v0 = popt
        runtime = time.time() - start_time

        eos_points = [
            {"volume_ang3": float(v), "energy_eV": float(e)}
            for v, e in zip(volumes, energies)
        ]

        return {
            "method": "murnaghan_eos_fit",
            "model_used": model_adapter.display_name,
            "minimum_energy_e0_eV": round(float(e0), 4),
            "equilibrium_volume_v0_ang3": round(float(v0), 3),
            "eos_bulk_modulus_b0_gpa": round(float(b0), 3),
            "bulk_modulus_derivative_b0_prime": round(float(b0_prime), 3),
            "eos_curve_points": eos_points,
            "runtime_seconds": round(runtime, 3),
            "status": "calculated"
        }
    except Exception as e:
        runtime = time.time() - start_time
        return {
            "method": "murnaghan_eos_fit",
            "model_used": model_adapter.display_name,
            "status": "failed",
            "error": f"EOS fitting failed: {str(e)}",
            "runtime_seconds": round(runtime, 3),
        }
