import time
import numpy as np
from typing import Any, Optional, Dict
from pymatgen.core import Structure
from pymatgen.analysis.elasticity.strain import Strain, DeformedStructureSet
from pymatgen.analysis.elasticity.stress import Stress
from pymatgen.analysis.elasticity.elastic import ElasticTensor

def run_strain_response_calculation(model_adapter: Any, structure: Structure, strain_settings: Optional[dict] = None) -> dict:
    """
    Perform symmetry-aware strain perturbations around the equilibrium structure
    to fit the elastic tensor and derive bulk modulus, shear modulus, Young's modulus,
    Poisson's ratio, and elastic anisotropy.
    """
    settings = strain_settings or {}
    max_strain = settings.get("max_strain", 0.01)  # 1% max strain
    num_points = settings.get("num_points", 4)     # 4 strain points per mode (-1%, -0.5%, +0.5%, +1%)

    start_time = time.time()
    strains = np.linspace(-max_strain, max_strain, num_points)
    strains = strains[strains != 0]  # Remove 0 strain

    try:
        def_structs = DeformedStructureSet(structure, norm_strains=strains)
        stresses = []
        applied_strains = []

        for d_struct in def_structs:
            # Predict stress for deformed structure
            stress_matrix = model_adapter.predict_stress(d_struct)
            # Stress matrix in GPa
            stresses.append(Stress(stress_matrix))
            applied_strains.append(d_struct.strain)

        # Fit elastic tensor using pymatgen's ElasticTensor
        elastic_tensor = ElasticTensor.from_stress_dict(dict(zip(applied_strains, stresses)))
        
        # Voigt-Reuss-Hill averages
        k_voigt = float(elastic_tensor.k_voigt)
        k_reuss = float(elastic_tensor.k_reuss)
        k_vrh = float(elastic_tensor.k_vrh)

        g_voigt = float(elastic_tensor.g_voigt)
        g_reuss = float(elastic_tensor.g_reuss)
        g_vrh = float(elastic_tensor.g_vrh)

        # Young's modulus E = 9*K*G / (3*K + G)
        if (3 * k_vrh + g_vrh) > 0:
            youngs_modulus = float(9 * k_vrh * g_vrh / (3 * k_vrh + g_vrh))
        else:
            youngs_modulus = 0.0

        # Poisson ratio nu = (3*K - 2*G) / (2*(3*K + G))
        if (3 * k_vrh + g_vrh) > 0:
            poisson_ratio = float((3 * k_vrh - 2 * g_vrh) / (2 * (3 * k_vrh + g_vrh)))
        else:
            poisson_ratio = 0.0

        # Universal elastic anisotropy
        try:
            anisotropy = float(elastic_tensor.universal_anisotropy)
        except Exception:
            anisotropy = float(5.0 * (g_voigt / max(g_reuss, 1e-4) - 1.0) + (k_voigt / max(k_reuss, 1e-4) - 1.0))

        # Stability checks: Born stability criteria
        is_stable = bool(elastic_tensor.is_positive_definite)
        compressibility = float(1.0 / max(k_vrh, 1e-4))  # 1/GPa

        runtime = time.time() - start_time
        warnings = []
        if not is_stable:
            warnings.append("Elastic tensor is not positive definite; system may be mechanically unstable under stress.")
        if k_vrh <= 0:
            warnings.append("Calculated Bulk Modulus is negative or zero, indicating instability.")

        return {
            "method": "strain_response_simulation",
            "model_used": model_adapter.display_name,
            "bulk_modulus_gpa": round(k_vrh, 3),
            "bulk_modulus_voigt_gpa": round(k_voigt, 3),
            "bulk_modulus_reuss_gpa": round(k_reuss, 3),
            "shear_modulus_gpa": round(g_vrh, 3),
            "shear_modulus_voigt_gpa": round(g_voigt, 3),
            "shear_modulus_reuss_gpa": round(g_reuss, 3),
            "youngs_modulus_gpa": round(youngs_modulus, 3),
            "poisson_ratio": round(poisson_ratio, 4),
            "compressibility_gpa_inv": round(compressibility, 6),
            "elastic_anisotropy": round(anisotropy, 4),
            "elastic_tensor_6x6_gpa": elastic_tensor.tolist(),
            "mechanically_stable": is_stable,
            "num_strain_states": len(def_structs),
            "max_strain_amplitude": max_strain,
            "runtime_seconds": round(runtime, 3),
            "warnings": warnings,
            "status": "calculated" if is_stable else "calculated_with_warnings",
        }

    except Exception as e:
        runtime = time.time() - start_time
        return {
            "method": "strain_response_simulation",
            "model_used": model_adapter.display_name,
            "status": "failed",
            "error": f"Elastic tensor fitting failed: {str(e)}",
            "runtime_seconds": round(runtime, 3),
            "warnings": [f"Strain-response calculation failed: {e}"]
        }
