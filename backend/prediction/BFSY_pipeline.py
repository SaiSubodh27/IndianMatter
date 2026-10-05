"""
BFSY Pipeline - Bulk modulus, Formation energy, Shear modulus, Young's modulus
================================================================================

Unified prediction pipeline that takes one or more CIF files as input and
returns predictions for:
    - Bulk modulus  (K)   - from pretrained chgnet_logK_model
    - Shear modulus (G)   - from pretrained chgnet_logG_model
    - Young's modulus (E) - derived from K & G via isotropic elasticity
    - Formation energy per atom (Ef) - from pretrained chgnet_Ef_model

All models share the same 21-dimensional CHGNet feature vector (energy,
forces, stress) extracted once per structure.

Usage
-----
    # From the command line:
    python BFSY_pipeline.py --input_dir ./cif_files

    # Or programmatically:
    from BFSY_pipeline import BFSYPipeline
    pipeline = BFSYPipeline()
    results = pipeline.predict("path/to/structure.cif")
"""

import os
import sys
import csv
import json
import argparse
import warnings
from pathlib import Path
from typing import Optional, Union

import numpy as np
import joblib

warnings.filterwarnings("ignore")

# ==============================================================================
# PATH CONFIGURATION - change INPUT_CIF_DIR to wherever your CIF files live.
# No Google Drive dependency; works locally, on Colab (upload), or on servers.
# ==============================================================================

# Default: <project_root>/cif_files
BACKEND_DIR = Path(__file__).resolve().parent
PROJECT_ROOT = BACKEND_DIR.parent

INPUT_CIF_DIR = os.environ.get(
    "BFSY_CIF_DIR",
    str(BACKEND_DIR / "cif_files"),
)

OUTPUT_DIR = os.environ.get(
    "BFSY_OUTPUT_DIR",
    str(BACKEND_DIR / "bfsy_results"),
)

# Pretrained model directory - searches the same locations as model_paths.py
PRETRAINED_MODEL_CANDIDATES = [
    PROJECT_ROOT / "pretrained_models",
    BACKEND_DIR / "pretrained_models",
    PROJECT_ROOT / "final_models" / "pretrained_models",
    PROJECT_ROOT / "IonCastBackup" / "pretrained_models",
    BACKEND_DIR / "IonCastBackup" / "pretrained_models",
]

# Model filenames
MODEL_FILES = {
    "bulk_modulus":      "chgnet_logK_model.pkl",      # log10(K) in GPa
    "shear_modulus":     "chgnet_logG_model.pkl",      # log10(G) in GPa
    "formation_energy":  "chgnet_Ef_model.pkl",        # Ef in eV/atom
}

# ==============================================================================
# FEATURE EXTRACTION (CHGNet 21-feature vector)
# ==============================================================================

N_FEATURES = 21

FEATURE_NAMES = [
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
    "von_mises_stress_GPa",
]


def _get_chgnet_calculator():
    """Lazily initialise CHGNet calculator once, return the cached instance."""
    if not hasattr(_get_chgnet_calculator, "_calc"):
        import torch
        from chgnet.model.dynamics import CHGNetCalculator

        device = "cuda" if torch.cuda.is_available() else "cpu"
        print(f"[BFSY] Initialising CHGNet on {device} ...")
        _get_chgnet_calculator._calc = CHGNetCalculator()
        print("[BFSY] CHGNet ready.")
    return _get_chgnet_calculator._calc


def extract_features(structure) -> np.ndarray:
    """
    Run a single unrelaxed CHGNet inference on a pymatgen Structure and return
    the 21-element feature vector used by all BFSY downstream models.
    """
    from pymatgen.io.ase import AseAtomsAdaptor

    num_atoms = len(structure)
    if num_atoms == 0:
        raise ValueError("Structure contains zero atoms.")

    calculator = _get_chgnet_calculator()
    adaptor = AseAtomsAdaptor()
    atoms = adaptor.get_atoms(structure)
    atoms.calc = calculator

    energy_eV = float(atoms.get_potential_energy())
    forces = np.array(atoms.get_forces())
    stress = np.array(atoms.get_stress())  # Voigt: [xx, yy, zz, yz, xz, xy]

    # Energy features (2)
    energy_per_atom = energy_eV / num_atoms

    # Force features (9)
    fmag = np.linalg.norm(forces, axis=1)
    f_mean   = float(np.mean(fmag))
    f_max    = float(np.max(fmag))
    f_min    = float(np.min(fmag))
    f_std    = float(np.std(fmag))
    f_rms    = float(np.sqrt(np.mean(fmag ** 2)))
    f_p25    = float(np.percentile(fmag, 25))
    f_median = float(np.median(fmag))
    f_p75    = float(np.percentile(fmag, 75))
    f_p95    = float(np.percentile(fmag, 95))

    # Stress features (10)
    sxx, syy, szz = float(stress[0]), float(stress[1]), float(stress[2])
    syz, sxz, sxy = float(stress[3]), float(stress[4]), float(stress[5])

    hydrostatic = (sxx + syy + szz) / 3.0
    stress_std  = float(np.std([sxx, syy, szz, sxy, syz, sxz]))
    max_abs     = float(max(abs(sxx), abs(syy), abs(szz), abs(sxy), abs(syz), abs(sxz)))
    von_mises   = float(np.sqrt(
        0.5 * (
            (sxx - syy) ** 2 + (syy - szz) ** 2 + (szz - sxx) ** 2
            + 6.0 * (sxy ** 2 + syz ** 2 + sxz ** 2)
        )
    ))

    vec = np.array([
        energy_eV, energy_per_atom,
        f_mean, f_max, f_min, f_std, f_rms, f_p25, f_median, f_p75, f_p95,
        sxx, syy, szz, sxy, syz, sxz,
        hydrostatic, stress_std, max_abs, von_mises,
    ], dtype=np.float64)

    assert vec.shape == (N_FEATURES,), f"Expected {N_FEATURES} features, got {vec.shape}"
    assert np.all(np.isfinite(vec)), "Feature vector contains NaN/Inf."
    return vec


# ==============================================================================
# DERIVED ELASTIC PROPERTIES
# ==============================================================================

def compute_youngs_modulus(K: float, G: float) -> float:
    """
    Compute Young's modulus from Bulk (K) and Shear (G) moduli using the
    isotropic elasticity relation:  E = 9KG / (3K + G)
    """
    denom = 3.0 * K + G
    if abs(denom) < 1e-12:
        return 0.0
    return (9.0 * K * G) / denom


def compute_poisson_ratio(K: float, G: float) -> float:
    """
    Compute Poisson's ratio from Bulk (K) and Shear (G) moduli:
        nu = (3K - 2G) / (6K + 2G)
    """
    denom = 6.0 * K + 2.0 * G
    if abs(denom) < 1e-12:
        return 0.0
    return (3.0 * K - 2.0 * G) / denom


# ==============================================================================
# PIPELINE CLASS
# ==============================================================================

class BFSYPipeline:
    """
    Unified Bulk-Formation-Shear-Young's prediction pipeline.

    Parameters
    ----------
    models_dir : str or Path, optional
        Path to the directory containing pretrained .pkl model files.
        If None, the pipeline searches the standard candidate directories.
    """

    def __init__(self, models_dir=None):
        self.models = {}
        self._resolve_models_dir(models_dir)
        self._load_models()

    # -- model discovery -------------------------------------------------------

    def _resolve_models_dir(self, models_dir):
        if models_dir is not None:
            self.models_dir = Path(models_dir)
            return

        # Search candidate directories for the Bulk model file as sentinel
        sentinel = MODEL_FILES["bulk_modulus"]
        for candidate in PRETRAINED_MODEL_CANDIDATES:
            if (candidate / sentinel).exists():
                self.models_dir = candidate
                return

        searched = "\n  ".join(str(c) for c in PRETRAINED_MODEL_CANDIDATES)
        raise FileNotFoundError(
            f"[BFSY] Could not find '{sentinel}' in any known directory:\n  {searched}\n"
            f"Set the models_dir parameter or place models in one of the above paths."
        )

    def _load_models(self):
        print(f"[BFSY] Loading models from: {self.models_dir}")

        for prop, filename in MODEL_FILES.items():
            path = self.models_dir / filename
            if path.exists():
                self.models[prop] = joblib.load(path)
                print(f"  OK {prop:20s} <- {filename}")
            else:
                self.models[prop] = None
                print(f"  MISS {prop:20s} -- {filename} NOT FOUND (will skip)")

        loaded = sum(1 for m in self.models.values() if m is not None)
        print(f"[BFSY] {loaded}/{len(MODEL_FILES)} models loaded.\n")

    # -- prediction ------------------------------------------------------------

    def predict(self, cif_path, composition=None):
        """
        Run the full BFSY prediction pipeline on a single CIF file.

        Parameters
        ----------
        cif_path : str
            Absolute or relative path to a .cif file.
        composition : str, optional
            Override composition string. If None, extracted from the CIF.

        Returns
        -------
        dict with keys:
            status, cif_file, composition, num_atoms,
            bulk_modulus_GPa, shear_modulus_GPa,
            youngs_modulus_GPa, poisson_ratio,
            formation_energy_eV_atom, features,
            warnings, error
        """
        from pymatgen.core import Structure

        result = {
            "status": "error",
            "cif_file": os.path.basename(cif_path),
            "composition": composition or "Unknown",
            "num_atoms": 0,
            "bulk_modulus_GPa": None,
            "shear_modulus_GPa": None,
            "youngs_modulus_GPa": None,
            "poisson_ratio": None,
            "formation_energy_eV_atom": None,
            "features": {},
            "warnings": [],
            "error": None,
        }

        try:
            # 1. Parse structure
            structure = Structure.from_file(cif_path)
            result["composition"] = str(structure.composition.reduced_formula)
            result["num_atoms"] = len(structure)

            # 2. Extract CHGNet features (single pass for all models)
            feat_vec = extract_features(structure)
            result["features"] = dict(zip(FEATURE_NAMES, feat_vec.tolist()))

            X = feat_vec.reshape(1, -1)

            # 3. Predict Bulk modulus (K)
            K_GPa = None
            if self.models.get("bulk_modulus") is not None:
                log10_K = float(self.models["bulk_modulus"].predict(X)[0])
                K_GPa = 10.0 ** log10_K
                result["bulk_modulus_GPa"] = round(K_GPa, 4)
            else:
                result["warnings"].append("Bulk modulus model not loaded.")

            # 4. Predict Shear modulus (G)
            G_GPa = None
            if self.models.get("shear_modulus") is not None:
                log10_G = float(self.models["shear_modulus"].predict(X)[0])
                G_GPa = 10.0 ** log10_G
                result["shear_modulus_GPa"] = round(G_GPa, 4)
            else:
                result["warnings"].append("Shear modulus model not loaded.")

            # 5. Derive Young's modulus (E) and Poisson's ratio (nu)
            if K_GPa is not None and G_GPa is not None:
                E_GPa = compute_youngs_modulus(K_GPa, G_GPa)
                nu = compute_poisson_ratio(K_GPa, G_GPa)
                result["youngs_modulus_GPa"] = round(E_GPa, 4)
                result["poisson_ratio"] = round(nu, 6)
            else:
                result["warnings"].append(
                    "Young's modulus and Poisson's ratio require both K and G."
                )

            # 6. Predict Formation energy (Ef)
            if self.models.get("formation_energy") is not None:
                Ef = float(self.models["formation_energy"].predict(X)[0])
                result["formation_energy_eV_atom"] = round(Ef, 6)
            else:
                result["warnings"].append("Formation energy model not loaded.")

            result["status"] = "success"

        except Exception as e:
            result["error"] = str(e)
            print(f"[BFSY ERROR] {result['cif_file']}: {e}")

        return result

    # -- batch prediction ------------------------------------------------------

    def predict_batch(self, cif_dir=None, cif_files=None, output_dir=None):
        """
        Run BFSY predictions on all CIF files in a directory.

        Parameters
        ----------
        cif_dir : str, optional
            Directory containing .cif files. Defaults to INPUT_CIF_DIR.
        cif_files : list[str], optional
            Explicit list of CIF file paths (overrides cif_dir).
        output_dir : str, optional
            Directory to save results CSV + JSON. Defaults to OUTPUT_DIR.

        Returns
        -------
        list[dict]  -  List of prediction result dicts.
        """
        if cif_files is None:
            cif_dir = cif_dir or INPUT_CIF_DIR
            cif_dir = Path(cif_dir)

            if not cif_dir.exists():
                raise FileNotFoundError(
                    f"[BFSY] CIF input directory not found: {cif_dir}\n"
                    f"Create it and place your .cif files there, or set BFSY_CIF_DIR env var."
                )

            cif_files = sorted(cif_dir.glob("*.cif"))
            if not cif_files:
                raise FileNotFoundError(f"[BFSY] No .cif files found in {cif_dir}")

            print(f"[BFSY] Found {len(cif_files)} CIF files in: {cif_dir}")
        else:
            cif_files = [Path(f) for f in cif_files]
            print(f"[BFSY] Processing {len(cif_files)} CIF files.")

        results = []
        failures = []

        for i, cif_path in enumerate(cif_files, start=1):
            print(f"  [{i}/{len(cif_files)}] {cif_path.name} ...", end=" ")
            res = self.predict(str(cif_path))
            results.append(res)

            if res["status"] == "success":
                print(
                    f"K={res['bulk_modulus_GPa']}, "
                    f"G={res['shear_modulus_GPa']}, "
                    f"E={res['youngs_modulus_GPa']}, "
                    f"Ef={res['formation_energy_eV_atom']}"
                )
            else:
                failures.append((cif_path.name, res["error"]))
                print(f"FAILED -- {res['error']}")

        # Save outputs
        output_dir = Path(output_dir or OUTPUT_DIR)
        output_dir.mkdir(parents=True, exist_ok=True)

        self._save_csv(results, output_dir / "bfsy_predictions.csv")
        self._save_json(results, output_dir / "bfsy_predictions.json")

        if failures:
            self._save_failures(failures, output_dir / "bfsy_failures.csv")

        print(f"\n[BFSY] Done: {len(results) - len(failures)}/{len(results)} succeeded.")
        print(f"[BFSY] Results saved to: {output_dir}")

        return results

    # -- serialisation helpers -------------------------------------------------

    @staticmethod
    def _save_csv(results, path):
        cols = [
            "cif_file", "composition", "num_atoms",
            "bulk_modulus_GPa", "shear_modulus_GPa",
            "youngs_modulus_GPa", "poisson_ratio",
            "formation_energy_eV_atom", "status",
        ]
        with open(path, "w", newline="") as f:
            writer = csv.DictWriter(f, fieldnames=cols, extrasaction="ignore")
            writer.writeheader()
            writer.writerows(results)

    @staticmethod
    def _save_json(results, path):
        with open(path, "w") as f:
            json.dump(results, f, indent=2, default=str)

    @staticmethod
    def _save_failures(failures, path):
        with open(path, "w", newline="") as f:
            writer = csv.writer(f)
            writer.writerow(["cif_file", "error"])
            writer.writerows(failures)


# ==============================================================================
# CLI ENTRY POINT
# ==============================================================================

def main():
    parser = argparse.ArgumentParser(
        description="BFSY Pipeline -- predict Bulk, Shear, Young's modulus and Formation energy from CIF files."
    )
    parser.add_argument(
        "--input_dir",
        type=str,
        default=INPUT_CIF_DIR,
        help=f"Directory containing .cif files (default: {INPUT_CIF_DIR})",
    )
    parser.add_argument(
        "--output_dir",
        type=str,
        default=OUTPUT_DIR,
        help=f"Directory to save results (default: {OUTPUT_DIR})",
    )
    parser.add_argument(
        "--models_dir",
        type=str,
        default=None,
        help="Override pretrained models directory",
    )
    parser.add_argument(
        "--single",
        type=str,
        default=None,
        help="Path to a single CIF file (skips batch mode)",
    )

    args = parser.parse_args()

    pipeline = BFSYPipeline(models_dir=args.models_dir)

    if args.single:
        result = pipeline.predict(args.single)
        print(json.dumps(result, indent=2, default=str))
    else:
        pipeline.predict_batch(
            cif_dir=args.input_dir,
            output_dir=args.output_dir,
        )


if __name__ == "__main__":
    main()
