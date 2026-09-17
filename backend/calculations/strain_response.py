import time
import warnings
import numpy as np
from typing import Any, Optional
from pymatgen.core import Structure
from pymatgen.analysis.elasticity.strain import Strain, DeformedStructureSet
from pymatgen.analysis.elasticity.stress import Stress
from pymatgen.analysis.elasticity.elastic import ElasticTensor

# Unit conversion factor: 1 eV/A^3 = 160.21766208 GPa
EV_PER_ANG3_TO_GPA = 160.21766208


def run_strain_response_calculation(
    model_adapter: Any, 
    structure: Structure, 
    strain_settings: Optional[dict] = None
) -> dict:
    settings = strain_settings or {}
    max_strain = settings.get("max_strain", 0.01)  
    num_points = settings.get("num_points", 4)     

    start_time = time.time()
    display_name = getattr(model_adapter, "display_name", getattr(model_adapter, "name", "Unknown_Model"))

    try:
        strains = np.linspace(-max_strain, max_strain, num_points)
        strains = strains[strains != 0]

        def_structs = DeformedStructureSet(structure, norm_strains=strains)
        stresses = []
        applied_strains = []

        # Extract deformations directly from the set
        deformations = list(def_structs.deformations)

        for d_struct, deformation in zip(def_structs, deformations):
            strain_matrix = deformation.green_lagrange_strain

            if hasattr(model_adapter, "predict_stress"):
                raw_stress = model_adapter.predict_stress(d_struct)
            elif hasattr(model_adapter, "predict_structure"):
                pred = model_adapter.predict_structure(d_struct)
                raw_stress = pred.get("stress", np.zeros((3, 3)))
            else:
                raise AttributeError(f"Adapter '{display_name}' missing stress prediction interface.")

            raw_stress = np.array(raw_stress)

            if np.max(np.abs(raw_stress)) < 5.0:
                raw_stress_gpa = raw_stress * EV_PER_ANG3_TO_GPA
            else:
                raw_stress_gpa = raw_stress

            stresses.append(Stress(raw_stress_gpa))
            applied_strains.append(Strain(strain_matrix))

        # Compatible ElasticTensor fitting (with warnings ignored for missing eq state)
        with warnings.catch_warnings():
            warnings.simplefilter("ignore")
            if hasattr(ElasticTensor, "from_independent_strains"):
                elastic_tensor = ElasticTensor.from_independent_strains(applied_strains, stresses)
            elif hasattr(ElasticTensor, "from_strain_stress_list"):
                elastic_tensor = ElasticTensor.from_strain_stress_list(applied_strains, stresses)
            elif hasattr(ElasticTensor, "from_stress_dict"):
                elastic_tensor = ElasticTensor.from_stress_dict(dict(zip(applied_strains, stresses)))
            else:
                strains_flat = np.array([s.zeroed().to_voigt() for s in applied_strains])
                stresses_flat = np.array([s.zeroed().to_voigt() for s in stresses])
                c_matrix, _, _, _ = np.linalg.lstsq(strains_flat, stresses_flat, rcond=None)
                elastic_tensor = ElasticTensor(c_matrix)

        k_voigt = float(elastic_tensor.k_voigt)
        k_reuss = float(elastic_tensor.k_reuss)
        k_vrh = float(elastic_tensor.k_vrh)
        g_voigt = float(elastic_tensor.g_voigt)
        g_reuss = float(elastic_tensor.g_reuss)
        g_vrh = float(elastic_tensor.g_vrh)

        denom = 3 * k_vrh + g_vrh
        youngs_modulus = float(9 * k_vrh * g_vrh / denom) if denom > 0 else 0.0
        poisson_ratio = float((3 * k_vrh - 2 * g_vrh) / (2 * denom)) if denom > 0 else 0.0

        try:
            anisotropy = float(elastic_tensor.universal_anisotropy)
        except Exception:
            anisotropy = float(5.0 * (g_voigt / max(g_reuss, 1e-4) - 1.0) + (k_voigt / max(k_reuss, 1e-4) - 1.0))

        # Born Stability Criteria Checks (Safely calculated)
        try:
            is_stable = bool(elastic_tensor.is_positive_definite)
        except AttributeError:
            # Fallback for PyMatGen versions where is_positive_definite is missing
            voigt_matrix = elastic_tensor.voigt
            is_stable = bool(np.all(np.linalg.eigvals(voigt_matrix) > 0))

        compressibility = float(1.0 / max(k_vrh, 1e-4))  

        runtime = time.time() - start_time
        calc_warnings = []
        if not is_stable:
            calc_warnings.append("Elastic tensor is not positive definite; system may be mechanically unstable under stress.")
        if k_vrh <= 0:
            calc_warnings.append("Calculated Bulk Modulus is negative or zero, indicating physical instability.")

        return {
            "method": "strain_response_simulation",
            "model_used": display_name,
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
            "warnings": calc_warnings,
            "status": "calculated" if is_stable else "calculated_with_warnings",
        }

    except Exception as e:
        runtime = time.time() - start_time
        return {
            "method": "strain_response_simulation",
            "model_used": display_name,
            "status": "failed",
            "error": f"Elastic tensor fitting failed: {str(e)}",
            "runtime_seconds": round(runtime, 3),
            "warnings": [f"Strain-response calculation failed: {str(e)}"]
        }