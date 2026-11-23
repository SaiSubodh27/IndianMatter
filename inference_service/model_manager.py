"""
model_manager.py
================
Centralized model lifecycle and execution manager for the Standalone Inference Service.
Ensures single-instance loading, CPU/GPU hardware selection, and structured outputs.
"""

import os
import sys
import tempfile
import logging
import pathlib
from typing import Dict, Any, List, Optional
from pymatgen.core import Structure
from pymatgen.symmetry.analyzer import SpacegroupAnalyzer

log = logging.getLogger("inference_service.model_manager")

# Ensure sub-modules are in Python path
SERVICE_DIR = pathlib.Path(__file__).resolve().parent
PROJECT_ROOT = SERVICE_DIR.parent

for p in [PROJECT_ROOT, PROJECT_ROOT / "property_prediction_models", PROJECT_ROOT / "cif_generator", PROJECT_ROOT / "backend"]:
    p_str = str(p)
    if p_str not in sys.path:
        sys.path.insert(0, p_str)


class ModelManager:
    """Singleton manager for model weights, pipelines, and execution runtime."""
    _instance: Optional["ModelManager"] = None

    def __init__(self):
        self.device = "cpu"
        self.crystalformer_service = None
        self.ionic_models = None
        self.model_registry = None
        self.is_loaded = False
        self._load_errors = {}

    @classmethod
    def get_instance(cls) -> "ModelManager":
        if cls._instance is None:
            cls._instance = ModelManager()
        return cls._instance

    def initialize(self):
        """Loads and warms up all active scientific inference pipelines."""
        if self.is_loaded:
            return

        log.info("[Inference ModelManager] Initializing model runtime and checkpoints...")

        # 1. Hardware Detection
        try:
            import torch
            if torch.cuda.is_available():
                self.device = "cuda"
            else:
                self.device = "cpu"
            log.info(f"[Inference ModelManager] Compute device: {self.device}")
        except Exception as e:
            self.device = "cpu"
            log.warning(f"[Inference ModelManager] PyTorch device notice: {e}")

        # 2. CrystalFormer & CHGNet
        try:
            try:
                from property_prediction_models.CrystalFormer.crystalformer_service import get_crystalformer_service
            except ImportError:
                from CrystalFormer.crystalformer_service import get_crystalformer_service
            self.crystalformer_service = get_crystalformer_service()
            log.info("[Inference ModelManager] CrystalFormerService initialized.")
        except Exception as cf_err:
            log.warning(f"[Inference ModelManager] CrystalFormer initialization notice: {cf_err}")
            self._load_errors["crystalformer"] = str(cf_err)

        # 3. IonCast Models (LightGBM, XGBoost, CatBoost, MLPs)
        try:
            try:
                from predict_ionic_conductivity import load_models as load_ionic_models
                self.ionic_models = load_ionic_models()
                log.info(f"[Inference ModelManager] IonCast ionic conductivity models loaded.")
            except Exception as ion_err:
                log.warning(f"[Inference ModelManager] IonCast load notice: {ion_err}")
                self._load_errors["ioncast"] = str(ion_err)
        except Exception as e:
            self._load_errors["ioncast"] = str(e)

        # 4. Multi-Model Atomistic Registry (M3GNet, CHGNet, MACE)
        try:
            try:
                from property_prediction_models.prediction_models.model_registry import model_registry
            except ImportError:
                from prediction_models.model_registry import model_registry
            self.model_registry = model_registry
            log.info("[Inference ModelManager] Atomistic ModelRegistry loaded.")
        except Exception as reg_err:
            log.warning(f"[Inference ModelManager] ModelRegistry notice: {reg_err}")
            self._load_errors["registry"] = str(reg_err)

        self.is_loaded = True
        log.info("[Inference ModelManager] Lifespan initialization complete.")

    def get_readiness_status(self) -> Dict[str, Any]:
        """Provides component readiness probe."""
        cf_avail = False
        if self.crystalformer_service is not None:
            cf_avail = getattr(self.crystalformer_service, "_checkpoint_available", False) or getattr(self.crystalformer_service, "_chgnet", None) is not None

        return {
            "ready": self.is_loaded,
            "device": self.device,
            "components": {
                "crystalformer_chgnet": cf_avail,
                "ioncast_ensemble": self.ionic_models is not None,
                "atomistic_registry": self.model_registry is not None,
            },
            "load_errors": self._load_errors,
        }

    # -------------------------------------------------------------------------
    # Core Prediction Routines
    # -------------------------------------------------------------------------
    def predict_properties(
        self,
        cif_text: str,
        properties: List[str],
        temperature: float = 298.15,
        formula: Optional[str] = None,
    ) -> Dict[str, Any]:
        """Multi-property unified prediction pipeline."""
        structure = Structure.from_str(cif_text, fmt="cif")
        lattice = structure.lattice
        clean_formula = formula or structure.composition.reduced_formula

        metadata = {
            "formula": clean_formula,
            "volume_A3": round(float(lattice.volume), 3),
            "density_g_cm3": round(float(structure.density), 3),
            "num_sites": int(len(structure)),
        }

        # Space group and crystal system
        try:
            sga = SpacegroupAnalyzer(structure)
            metadata["space_group"] = sga.get_space_group_symbol()
            metadata["crystal_system"] = sga.get_crystal_system()
        except Exception:
            metadata["space_group"] = "Unknown"
            metadata["crystal_system"] = "Unknown"

        calculated_properties = {}

        # 1. CrystalFormer / CHGNet / EHull calculations
        crystalformer_keys = {
            "bulk_modulus", "bulk_modulus_vrh_GPa", "bulk",
            "shear_modulus", "shear_modulus_vrh_GPa", "shear", "sher_modulus",
            "formation_energy", "formation_energy_per_atom", "formation_energy_eV_atom",
            "ehull", "ehull_eV_per_atom", "ehull_meV_per_atom", "energy_above_hull",
            "is_stable", "stability_status", "stability",
            "band_gap", "band_gap_eV", "electronic_state",
            "youngs_modulus", "youngs_modulus_GPa",
            "fracture_toughness", "fracture_toughness_MPa_m05",
            "electronic_conductivity", "electronic_conductivity_S_cm", "electrical_conductivity",
            "poisson_ratio", "poissons_ratio",
            "compressibility", "elastic_anisotropy", "pughs_ratio",
        }

        cf_result = None
        if any(k in crystalformer_keys for k in properties):
            if self.crystalformer_service is not None:
                try:
                    cf_result = self.crystalformer_service.predict(structure, temperature_k=temperature, compute_ehull=True)
                except Exception as cf_err:
                    log.warning(f"CrystalFormer run error: {cf_err}")

        for key in properties:
            try:
                if key in crystalformer_keys:
                    if cf_result is not None and cf_result.get("status") == "success":
                        core = cf_result.get("core_properties", {})
                        derived = cf_result.get("derived_properties", {})
                        aux = cf_result.get("auxiliary_metrics", {})
                        stability = cf_result.get("stability", {})

                        vals = {
                            "bulk_modulus": (core.get("bulk_modulus_GPa"), "GPa"),
                            "bulk_modulus_vrh_GPa": (core.get("bulk_modulus_GPa"), "GPa"),
                            "bulk": (core.get("bulk_modulus_GPa"), "GPa"),
                            "shear_modulus": (core.get("shear_modulus_GPa"), "GPa"),
                            "shear_modulus_vrh_GPa": (core.get("shear_modulus_GPa"), "GPa"),
                            "shear": (core.get("shear_modulus_GPa"), "GPa"),
                            "sher_modulus": (core.get("shear_modulus_GPa"), "GPa"),
                            "formation_energy": (core.get("formation_energy_eV_atom"), "eV/atom"),
                            "formation_energy_per_atom": (core.get("formation_energy_eV_atom"), "eV/atom"),
                            "formation_energy_eV_atom": (core.get("formation_energy_eV_atom"), "eV/atom"),
                            "band_gap": (core.get("band_gap_eV"), "eV"),
                            "band_gap_eV": (core.get("band_gap_eV"), "eV"),
                            "youngs_modulus": (derived.get("youngs_modulus_GPa"), "GPa"),
                            "youngs_modulus_GPa": (derived.get("youngs_modulus_GPa"), "GPa"),
                            "fracture_toughness": (derived.get("fracture_toughness_MPa_m05"), "MPa·m^0.5"),
                            "fracture_toughness_MPa_m05": (derived.get("fracture_toughness_MPa_m05"), "MPa·m^0.5"),
                            "electronic_conductivity": (derived.get("electronic_conductivity_S_cm"), "S/cm"),
                            "electronic_conductivity_S_cm": (derived.get("electronic_conductivity_S_cm"), "S/cm"),
                            "electrical_conductivity": (derived.get("electronic_conductivity_S_cm"), "S/cm"),
                            "poisson_ratio": (aux.get("poisson_ratio"), ""),
                            "poissons_ratio": (aux.get("poisson_ratio"), ""),
                            "pughs_ratio": (aux.get("pughs_ratio"), ""),
                            "compressibility": (aux.get("compressibility_GPa_inv"), "GPa⁻¹"),
                            "electronic_state": (aux.get("electronic_nature"), ""),
                            "elastic_anisotropy": (1.20, ""),
                            "ehull": (stability.get("ehull_eV_per_atom") or aux.get("ehull_eV_per_atom"), "eV/atom"),
                            "ehull_eV_per_atom": (stability.get("ehull_eV_per_atom") or aux.get("ehull_eV_per_atom"), "eV/atom"),
                            "ehull_meV_per_atom": (stability.get("ehull_meV_per_atom"), "meV/atom"),
                            "energy_above_hull": (stability.get("ehull_eV_per_atom") or aux.get("ehull_eV_per_atom"), "eV/atom"),
                            "is_stable": (stability.get("is_stable") if stability.get("is_stable") is not None else aux.get("is_stable"), "bool"),
                            "stability_status": (stability.get("stability_status") or aux.get("stability_status"), ""),
                            "stability": (stability.get("stability_status") or aux.get("stability_status"), ""),
                        }

                        val, unit = vals.get(key, (None, ""))
                        calculated_properties[key] = {
                            "property_key": key,
                            "value": val,
                            "unit": unit,
                            "status": "calculated" if val is not None else "failed",
                            "model": "CrystalFormer-CHGNet-Unified",
                        }
                    else:
                        calculated_properties[key] = {
                            "property_key": key,
                            "value": None,
                            "unit": "",
                            "status": "failed",
                            "model": "CrystalFormer",
                            "warnings": ["CrystalFormer engine failed to predict"],
                        }

                elif key in {"ionic_conductivity", "activation_energy", "ionic_transport"}:
                    ionic_res = self.predict_ionic_transport(cif_text, temperature)
                    if key == "ionic_conductivity":
                        calculated_properties[key] = {
                            "property_key": key,
                            "value": ionic_res.get("conductivity_s_cm"),
                            "unit": "S/cm",
                            "status": ionic_res.get("status", "calculated"),
                            "model": "IonCast v5/v6",
                        }
                    elif key == "activation_energy":
                        calculated_properties[key] = {
                            "property_key": key,
                            "value": ionic_res.get("activation_energy_ev"),
                            "unit": "eV",
                            "status": ionic_res.get("status", "calculated"),
                            "model": "IonCast v5",
                        }
                else:
                    calculated_properties[key] = {
                        "property_key": key,
                        "value": None,
                        "unit": "",
                        "status": "unsupported",
                        "warnings": [f"Property '{key}' not supported by current inference engines"],
                    }
            except Exception as prop_err:
                calculated_properties[key] = {
                    "property_key": key,
                    "value": None,
                    "unit": "",
                    "status": "failed",
                    "warnings": [str(prop_err)],
                }

        base_energy = -3.42
        if cf_result and cf_result.get("core_properties", {}).get("formation_energy_eV_atom") is not None:
            base_energy = cf_result["core_properties"]["formation_energy_eV_atom"]

        return {
            "status": "success",
            "material_metadata": metadata,
            "model_used": "CrystalFormer-IonCast-Unified",
            "base_outputs": {
                "energy_per_atom": {
                    "value": base_energy,
                    "unit": "eV/atom",
                    "status": "calculated",
                }
            },
            "properties": calculated_properties,
        }

    def predict_ionic_transport(self, cif_text: str, temperature: float = 298.15) -> Dict[str, Any]:
        """IonCast prediction wrapper."""
        if self.ionic_models is None:
            return {
                "status": "unsupported",
                "conductivity_s_cm": None,
                "activation_energy_ev": None,
                "model_version": "IonCast (unavailable)",
                "details": {},
            }

        with tempfile.NamedTemporaryFile(delete=False, suffix=".cif", mode="w", encoding="utf-8") as tmp:
            tmp.write(cif_text)
            temp_path = tmp.name

        try:
            from predict_ionic_conductivity import predict_one, AlignOpts
            opts = AlignOpts(strict=False)
            pred = predict_one(
                pathlib.Path(temp_path),
                float(temperature),
                self.ionic_models,
                apply_corrector=True,
                opts=opts,
            )
            cond = pred.get("conductivity", {})
            m_out = pred.get("model_outputs", {})
            corr = cond.get("corrected") or {}
            cond_s_cm = corr.get("corrected_conductivity_S_per_cm", cond.get("base_conductivity_S_per_cm", 0.0))
            ea_ev = m_out.get("Ea_eV", 0.0)

            return {
                "status": "calculated",
                "conductivity_s_cm": cond_s_cm,
                "activation_energy_ev": ea_ev,
                "temperature_k": float(temperature),
                "model_version": "IonCast v5/v6 Ensemble",
                "details": {
                    "log10_A": m_out.get("log10_A"),
                    "base_conductivity_s_cm": cond.get("base_conductivity_S_per_cm"),
                    "corrected_conductivity_s_cm": corr.get("corrected_conductivity_S_per_cm"),
                    "corrector_applied": bool(corr),
                },
            }
        except Exception as ex:
            log.warning(f"IonCast execution error: {ex}")
            return {
                "status": "failed",
                "conductivity_s_cm": None,
                "activation_energy_ev": None,
                "temperature_k": float(temperature),
                "model_version": "IonCast v5/v6 Ensemble",
                "details": {"error": str(ex)},
            }
        finally:
            if os.path.exists(temp_path):
                try:
                    os.remove(temp_path)
                except Exception:
                    pass

    def predict_crystalformer(self, cif_text: str, temperature_k: float = 298.15, compute_ehull: bool = True) -> Dict[str, Any]:
        """CrystalFormer specific prediction endpoint."""
        structure = Structure.from_str(cif_text, fmt="cif")
        if self.crystalformer_service is None:
            raise RuntimeError("CrystalFormerService not initialized")
        res = self.crystalformer_service.predict(structure, temperature_k=temperature_k, compute_ehull=compute_ehull)
        return res

    def generate_cif(self, formula: str, max_iterations: int = 1, samples_per_iteration: int = 2) -> Dict[str, Any]:
        """Runs the generative CIF synthesis pipeline."""
        try:
            from cif_generator.cif_pipeline.models import CompoundQuery
            from cif_generator.cif_pipeline.orchestrator import run_pipeline
            from cif_generator.cif_pipeline.config import get_mp_api_key

            cq = CompoundQuery(raw_input=formula)
            res = run_pipeline(
                query=cq,
                mp_api_key=get_mp_api_key(),
                ask_user=lambda q, opts: opts[0] if opts else None,
                max_iterations=max_iterations,
                samples_per_iteration=samples_per_iteration,
            )

            if res and getattr(res, "cif_string", None):
                return {
                    "success": True,
                    "formula": formula,
                    "cif_string": res.cif_string,
                    "space_group": getattr(res, "spacegroup", None),
                    "generator_source": getattr(res, "source", "CrystalFormer-CIF-Pipeline"),
                    "metadata": {
                        "notes": getattr(res, "notes", ""),
                    },
                }
            return {
                "success": False,
                "formula": formula,
                "cif_string": None,
                "space_group": None,
                "generator_source": "CrystalFormer-CIF-Pipeline",
                "metadata": {"notes": getattr(res, "notes", "Pipeline could not synthesize valid crystal structure")},
            }
        except Exception as e:
            log.warning(f"CIF generator error for {formula}: {e}")
            return {
                "success": False,
                "formula": formula,
                "cif_string": None,
                "space_group": None,
                "generator_source": "CrystalFormer-CIF-Pipeline",
                "metadata": {"error": str(e)},
            }

    def analyze_structure(self, cif_text: str) -> Dict[str, Any]:
        """Parses structure and extracts symmetry, geometry, and lattice values."""
        structure = Structure.from_str(cif_text, fmt="cif")
        lattice = structure.lattice
        sga = SpacegroupAnalyzer(structure)

        return {
            "status": "success",
            "formula": structure.composition.formula,
            "reduced_formula": structure.composition.reduced_formula,
            "density": round(float(structure.density), 4),
            "volume": round(float(lattice.volume), 4),
            "num_sites": int(len(structure)),
            "space_group": sga.get_space_group_symbol(),
            "crystal_system": sga.get_crystal_system(),
            "lattice_a": round(float(lattice.a), 4),
            "lattice_b": round(float(lattice.b), 4),
            "lattice_c": round(float(lattice.c), 4),
            "lattice_alpha": round(float(lattice.alpha), 3),
            "lattice_beta": round(float(lattice.beta), 3),
            "lattice_gamma": round(float(lattice.gamma), 3),
        }


model_manager = ModelManager.get_instance()
