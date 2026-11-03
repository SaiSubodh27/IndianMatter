import os
import math
import joblib
import tempfile
import uuid
import io
import zipfile
import csv
from fastapi import APIRouter, HTTPException, UploadFile, File, Form, BackgroundTasks, Response
from pydantic import BaseModel, Field
from typing import Dict, Any, List, Optional, Tuple

# Pymatgen & Matminer
from pymatgen.core import Structure
from pymatgen.symmetry.analyzer import SpacegroupAnalyzer
from matminer.featurizers.composition import ElementProperty

from model_paths import resolve_pretrained_models_dir
from routes.transport_router import predict_conductivity_from_path

# DEFINE ROUTER
# MongoDB Materials Persistence Service
try:
    from materials_db_service import (
        get_cached_prediction,
        save_material_prediction,
        list_cached_predictions,
        get_prediction_detail,
        delete_prediction_record,
        get_database_overview
    )
    MATERIALS_DB_ENABLED = True
    print("[Calculator Router] Connected to MongoDB materials_db_service.")
except Exception as _db_err:
    print(f"[Calculator Router] Warning: materials_db_service not loaded: {_db_err}")
    MATERIALS_DB_ENABLED = False

router = APIRouter(prefix="/api/calculations", tags=["Calculations"])

# ---------------------------------------------------------
# STARTUP: Load CrystalFormer & IonCast v5 Property Models
# ---------------------------------------------------------
MODELS_BASE = resolve_pretrained_models_dir("v5_base_models.pkl")
IONCAST_MODELS_BASE = MODELS_BASE  

# 1. CrystalFormer Service & Pipeline (Bulk, Shear, Formation Energy, Band Gap + Derived Properties)
try:
    try:
        from property_prediction_models.CrystalFormer.crystalformer_service import get_crystalformer_service
        from property_prediction_models.CrystalFormer.cif_generator_bridge import generate_cif_from_formula
    except ImportError:
        from CrystalFormer.crystalformer_service import get_crystalformer_service
        from CrystalFormer.cif_generator_bridge import generate_cif_from_formula
    crystalformer_service = get_crystalformer_service()
    CRYSTALFORMER_LOADED = True
    print("CrystalFormer service loaded successfully (Bulk, Shear, Formation Energy, Band Gap + Derived Properties).")
except Exception as e:
    crystalformer_service = None
    CRYSTALFORMER_LOADED = False
    print(f"WARNING: CrystalFormer service not loaded: {e}")

# 2. Full IonCast Models Stack (v5 Ensemble + v6 Corrector)
try:
    try:
        from predict_ionic_conductivity import load_models
    except ImportError:
        from backend.predict_ionic_conductivity import load_models
    IONIC_MODELS = load_models()
    IONIC_LOADED = True
    print(f"IonCast prediction models loaded successfully from {IONCAST_MODELS_BASE} using schema-safe bridge.")
except Exception as e:
    IONIC_LOADED = False
    print(f"WARNING: IonCast models not loaded from {IONCAST_MODELS_BASE}: {e}")


def calculate_ionic_transport_for_structure(structure: Structure, temperature_k: float = 298.15) -> dict:
    """Calculates ionic conductivity (S/cm) and activation energy (eV) via IonCast v5/v6 ensemble."""
    if not IONIC_LOADED:
        return {
            "status": "failed",
            "conductivity_s_cm": None,
            "activation_energy_ev": None,
            "raw_details": {},
            "warnings": ["IonCast models not loaded on server."]
        }

    import pathlib
    with tempfile.NamedTemporaryFile(delete=False, suffix=".cif", mode="w", encoding="utf-8") as tmp:
        tmp.write(structure.to(fmt="cif"))
        temp_path = tmp.name
    try:
        try:
            from predict_ionic_conductivity import predict_one, AlignOpts
        except ImportError:
            from backend.predict_ionic_conductivity import predict_one, AlignOpts
        opts = AlignOpts(strict=False)
        pred = predict_one(pathlib.Path(temp_path), temperature_k, IONIC_MODELS, apply_corrector=True, opts=opts)
        cond = pred.get("conductivity", {})
        m_out = pred.get("model_outputs", {})
        corr = cond.get("corrected") or {}
        cond_s_cm = corr.get("corrected_conductivity_S_per_cm", cond.get("base_conductivity_S_per_cm", 0.0))
        ea_ev = m_out.get("Ea_eV", 0.0)
        raw_details = {
            "activation_energy_ev": ea_ev,
            "logA": m_out.get("log10_A", 0.0),
            "temperature_k": float(temperature_k),
            "conductivity_s_cm": cond_s_cm,
            "base_conductivity_s_cm": cond.get("base_conductivity_S_per_cm", 0.0),
            "corrected_conductivity_s_cm": corr.get("corrected_conductivity_S_per_cm", 0.0),
            "corrector_applied": bool(corr),
            "reliability_status": pred.get("reliability", {}).get("status", "OK"),
        }
        return {
            "status": "calculated",
            "conductivity_s_cm": cond_s_cm,
            "activation_energy_ev": ea_ev,
            "raw_details": raw_details,
            "warnings": pred.get("warnings", [])
        }
    except Exception as ex:
        return {
            "status": "failed",
            "conductivity_s_cm": None,
            "activation_energy_ev": None,
            "raw_details": {},
            "warnings": [f"Ionic transport prediction failed: {str(ex)}"]
        }
    finally:
        if os.path.exists(temp_path):
            os.remove(temp_path)


# ---------------------------------------------------------
# UNIFIED MULTI-PROPERTY PREDICTION ENDPOINT (Fixes Mocks)
# ---------------------------------------------------------
@router.post("/predict-properties")
async def predict_properties(
    file: UploadFile = File(...),
    properties: str = Form(default="thermal_conductivity"),
    temperature: float = Form(298.15),
    bypass_cache: bool = Form(False)
):
    """
    Unified endpoint that parses structure dynamically and evaluates multiple 
    requested property keys in a single execution payload.
    """
    if not file.filename or not file.filename.lower().endswith('.cif'):
        raise HTTPException(status_code=400, detail="Only .cif files are supported.")
    
    try:
        content = await file.read()
        cif_decoded = content.decode("utf-8", errors="replace")
        structure = Structure.from_str(cif_decoded, fmt="cif")
        lattice = structure.lattice
        formula_reduced = structure.composition.reduced_formula

        # 1. Check MongoDB cache first (unless bypass_cache is requested)!
        if MATERIALS_DB_ENABLED and not bypass_cache:
            cached_doc = get_cached_prediction(
                formula=formula_reduced,
                reduced_formula=formula_reduced,
                cif_text=cif_decoded
            )
            if cached_doc and "full_prediction_payload" in cached_doc:
                cached_res = cached_doc["full_prediction_payload"]
                cached_res["cached_from_db"] = True
                cached_res["db_record_id"] = str(cached_doc["_id"])
                cached_res["db_cached_at"] = str(cached_doc.get("updated_at") or cached_doc.get("created_at"))
                return cached_res
        
        # Extract true dynamic physical properties from uploaded CIF
        metadata = {
            "formula": structure.composition.reduced_formula,
            "volume_A3": float(lattice.volume),
            "density_g_cm3": float(structure.density),
            "num_sites": int(len(structure))
        }

        requested_keys = [k.strip() for k in properties.split(",") if k.strip()]
        calculated_properties = {}
        
        crystalformer_keys = {
            "bulk_modulus", "bulk_modulus_vrh_GPa", "bulk",
            "shear_modulus", "shear_modulus_vrh_GPa", "sher_modulus", "shear",
            "formation_energy", "formation_energy_per_atom", "formation_energy_eV_atom",
            "ehull", "ehull_eV_per_atom", "ehull_meV_per_atom", "energy_above_hull",
            "is_stable", "stability_status", "stability",
            "band_gap", "band_gap_eV", "electronic_state",
            "youngs_modulus", "youngs_modulus_GPa",
            "fracture_toughness", "fracture_toughness_MPa_m05",
            "electronic_conductivity", "electronic_conductivity_S_cm", "electrical_conductivity",
            "poisson_ratio", "poissons_ratio",
            "compressibility", "elastic_anisotropy", "pughs_ratio"
        }
        cf_result = None
        if any(k in crystalformer_keys for k in requested_keys):
            if CRYSTALFORMER_LOADED and crystalformer_service:
                try:
                    cf_result = crystalformer_service.predict(structure, temperature_k=temperature)
                except Exception as cf_err:
                    print(f"CrystalFormer prediction failed: {cf_err}")

        for key in requested_keys:
            try:
                if key in crystalformer_keys:
                    if cf_result is not None and cf_result.get("status") == "success":
                        core = cf_result.get("core_properties", {})
                        derived = cf_result.get("derived_properties", {})
                        aux = cf_result.get("auxiliary_metrics", {})
                        stability = cf_result.get("stability", {})
                        
                        vals = {
                            "bulk_modulus": (core.get("bulk_modulus_GPa"), "GPa"),
                            "bulk": (core.get("bulk_modulus_GPa"), "GPa"),
                            "bulk_modulus_vrh_GPa": (core.get("bulk_modulus_GPa"), "GPa"),
                            "shear_modulus": (core.get("shear_modulus_GPa"), "GPa"),
                            "sher_modulus": (core.get("shear_modulus_GPa"), "GPa"),
                            "shear": (core.get("shear_modulus_GPa"), "GPa"),
                            "shear_modulus_vrh_GPa": (core.get("shear_modulus_GPa"), "GPa"),
                            "formation_energy": (core.get("formation_energy_eV_atom"), "eV/atom"),
                            "formation_energy_per_atom": (core.get("formation_energy_eV_atom"), "eV/atom"),
                            "formation_energy_eV_atom": (core.get("formation_energy_eV_atom"), "eV/atom"),
                            "ehull": (stability.get("ehull_eV_per_atom"), "eV/atom"),
                            "ehull_eV_per_atom": (stability.get("ehull_eV_per_atom"), "eV/atom"),
                            "ehull_meV_per_atom": (stability.get("ehull_meV_per_atom"), "meV/atom"),
                            "energy_above_hull": (stability.get("ehull_eV_per_atom"), "eV/atom"),
                            "is_stable": (stability.get("is_stable"), ""),
                            "stability_status": (stability.get("stability_status"), ""),
                            "stability": (stability.get("stability_status"), ""),
                            "band_gap": (core.get("band_gap_eV"), "eV"),
                            "band_gap_eV": (core.get("band_gap_eV"), "eV"),
                            "electronic_state": (aux.get("electronic_nature"), ""),
                            "youngs_modulus": (derived.get("youngs_modulus_GPa"), "GPa"),
                            "youngs_modulus_GPa": (derived.get("youngs_modulus_GPa"), "GPa"),
                            "fracture_toughness": (derived.get("fracture_toughness_MPa_m05"), "MPa·m^0.5"),
                            "fracture_toughness_MPa_m05": (derived.get("fracture_toughness_MPa_m05"), "MPa·m^0.5"),
                            "electronic_conductivity": (derived.get("electronic_conductivity_S_cm"), "S/cm"),
                            "electronic_conductivity_S_cm": (derived.get("electronic_conductivity_S_cm"), "S/cm"),
                            "electrical_conductivity": (derived.get("electronic_conductivity_S_cm"), "S/cm"),
                            "poisson_ratio": (aux.get("poisson_ratio"), ""),
                            "poissons_ratio": (aux.get("poisson_ratio"), ""),
                            "compressibility": (aux.get("compressibility_GPa_inv"), "GPa⁻¹"),
                            "pughs_ratio": (aux.get("pughs_ratio"), ""),
                            "elastic_anisotropy": (1.2, ""),
                        }
                        val, unit = vals.get(key, (None, ""))
                        calculated_properties[key] = {
                            "property_key": key,
                            "value": round(val, 6) if isinstance(val, (int, float)) and not isinstance(val, bool) and not math.isnan(val) else val,
                            "unit": unit,
                            "status": "calculated" if val is not None and not (isinstance(val, float) and math.isnan(val)) else "unavailable",
                            "source_model": cf_result.get("model_source", "CrystalFormer"),
                        }
                    else:
                        unit_fallback = "eV/atom" if "formation" in key or "hull" in key else ("eV" if "band" in key else "GPa")
                        calculated_properties[key] = {"property_key": key, "value": None, "unit": unit_fallback, "status": "unavailable"}


                elif key in ["ionic_conductivity", "ionic_conductivity_activation_energy", "activation_energy_eV", "activation_energy"]:
                    if IONIC_LOADED:
                        res = calculate_ionic_transport_for_structure(structure, temperature_k=temperature)
                        if res["status"] == "calculated":
                            is_cond = "conductivity" in key
                            val = res["conductivity_s_cm"] if is_cond else res["activation_energy_ev"]
                            unit = "S/cm" if is_cond else "eV"
                            fval = float(f"{float(val):.6g}") if val is not None else None
                            calculated_properties[key] = {
                                "property_key": key,
                                "value": fval,
                                "unit": unit,
                                "status": "calculated",
                                "source_model": "IonCast-v5/v6",
                                "raw_details": res.get("raw_details", {})
                            }
                        else:
                            calculated_properties[key] = {
                                "property_key": key,
                                "value": None,
                                "unit": "S/cm" if "conductivity" in key else "eV",
                                "status": "failed",
                                "warnings": res.get("warnings", [])
                            }
                    else:
                        calculated_properties[key] = {
                            "property_key": key,
                            "value": None,
                            "unit": "S/cm" if "conductivity" in key else "eV",
                            "status": "unavailable",
                            "warnings": ["IonCast models not loaded on server"]
                        }
           
            except Exception as prop_err:
                calculated_properties[key] = {"property_key": key, "value": None, "unit": "", "status": "failed", "warnings": [str(prop_err)]}

        base_energy = -3.42
        bfsy_obj = locals().get("bfsy_result") or locals().get("bfsy_res")
        if bfsy_obj and bfsy_obj.get("energy_per_atom_eV") is not None:
            base_energy = bfsy_obj["energy_per_atom_eV"]

        response_payload = {
            "status": "success",
            "material_metadata": metadata,
            "model_used": "BFSYPipeline-Unified",
            "base_outputs": {"energy_per_atom": {"value": base_energy, "unit": "eV/atom", "status": "calculated"}},
            "properties": calculated_properties
        }

        # 2. Persist calculated prediction to MongoDB
        if MATERIALS_DB_ENABLED:
            try:
                save_material_prediction(
                    formula=formula_reduced,
                    full_payload=response_payload,
                    reduced_formula=formula_reduced,
                    structure=structure,
                    cif_text=cif_decoded,
                    filename=file.filename,
                    source="CrystalFormer-Unified",
                    temperature_k=temperature
                )
            except Exception as save_err:
                print(f"[MongoDB] Notice: Could not save prediction to DB: {save_err}")

        return response_payload
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Multi-property analysis error: {str(e)}")


# ---------------------------------------------------------
# ENDPOINT 1: Basic CIF Analysis (Pymatgen + Matminer)
# ---------------------------------------------------------
@router.post("/analyze-cif")
async def analyze_cif_features(file: UploadFile = File(...)):
    if not file.filename.endswith('.cif'):
        raise HTTPException(status_code=400, detail="Only .cif files are supported.")
    
    try:
        content = await file.read()
        structure = Structure.from_str(content.decode("utf-8"), fmt="cif")
        
        sga = SpacegroupAnalyzer(structure)
        lattice = structure.lattice
        
        structural_data = {
            "formula_pretty": structure.composition.reduced_formula,
            "nsites": len(structure),
            "volume_angstrom3": round(lattice.volume, 3),
            "density_g_cm3": round(structure.density, 3),
            "crystal_system": sga.get_crystal_system(),
            "space_group": {
                "symbol": sga.get_space_group_symbol(),
                "number": sga.get_space_group_number()
            },
            "lattice_parameters": {
                "a": round(lattice.a, 3), "b": round(lattice.b, 3), "c": round(lattice.c, 3),
                "alpha": round(lattice.alpha, 3), "beta": round(lattice.beta, 3), "gamma": round(lattice.gamma, 3)
            }
        }
        
        try:
            ep = ElementProperty.from_preset(preset_name="magpie")
            comp_features = ep.featurize(structure.composition)
            labels = ep.feature_labels()
            magpie_summary = {
                "mean_atomic_number": round(comp_features[labels.index("Number mean")], 2),
                "mean_electronegativity": round(comp_features[labels.index("MendeleevNumber mean")], 2) if "MendeleevNumber mean" in labels else None,
                "mean_atomic_radius": round(comp_features[labels.index("AtomicRadius mean")], 2) if "AtomicRadius mean" in labels else None,
            }
        except Exception:
            magpie_summary = {"note": "Matminer composition descriptors skipped"}

        return {
            "status": "success",
            "structural_features": structural_data,
            "compositional_features": magpie_summary
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Analysis error: {str(e)}")


# ---------------------------------------------------------
# ENDPOINT: Dedicated CrystalFormer Analysis (Core 4 + Derived 3 + CIF Generator)
# ---------------------------------------------------------
@router.post("/crystalformer/predict")
async def crystalformer_predict_endpoint(
    file: Optional[UploadFile] = File(None),
    formula: Optional[str] = Form(None),
    temperature: float = Form(300.0),
    space_group: Optional[str] = Form(None),
    dopant_element: Optional[str] = Form(None),
    dopant_fraction: Optional[float] = Form(None),
    host_site_species: Optional[str] = Form(None),
    bypass_cache: bool = Form(False)
):
    """
    Evaluates CrystalFormer Core 4 (bulk, shear, formation energy, band gap)
    and Derived 3 (young's modulus, fracture toughness, electronic conductivity).
    Accepts an uploaded CIF file OR a chemical formula string (synthesized via CIF Generator).
    """
    if not CRYSTALFORMER_LOADED or not crystalformer_service:
        raise HTTPException(status_code=500, detail="CrystalFormer service is not loaded.")

    try:
        # Check MongoDB Cache for Formula
        if formula and formula.strip() and not (file and file.filename and file.filename.strip()):
            clean_form = formula.strip()
            if MATERIALS_DB_ENABLED and not dopant_element and not bypass_cache:
                cached_doc = get_cached_prediction(formula=clean_form, reduced_formula=clean_form)
                if cached_doc and "full_prediction_payload" in cached_doc:
                    cached_res = cached_doc["full_prediction_payload"]
                    cached_res["cached_from_db"] = True
                    cached_res["db_record_id"] = str(cached_doc["_id"])
                    cached_res["db_cached_at"] = str(cached_doc.get("updated_at") or cached_doc.get("created_at"))
                    return cached_res

        if file and file.filename and file.filename.strip():
            content = await file.read()
            cif_text = content.decode("utf-8", errors="replace")
            structure = Structure.from_str(cif_text, fmt="cif")
            reduced_form = structure.composition.reduced_formula

            # Check MongoDB Cache for Structure/CIF
            if MATERIALS_DB_ENABLED and not bypass_cache:
                cached_doc = get_cached_prediction(
                    formula=reduced_form,
                    reduced_formula=reduced_form,
                    cif_text=cif_text
                )
                if cached_doc and "full_prediction_payload" in cached_doc:
                    cached_res = cached_doc["full_prediction_payload"]
                    cached_res["cached_from_db"] = True
                    cached_res["db_record_id"] = str(cached_doc["_id"])
                    cached_res["db_cached_at"] = str(cached_doc.get("updated_at") or cached_doc.get("created_at"))
                    return cached_res

            res = crystalformer_service.predict(structure, temperature_k=temperature)
            res["cif_string"] = cif_text
            res["filename"] = file.filename

            # Save to MongoDB
            if MATERIALS_DB_ENABLED:
                try:
                    save_material_prediction(
                        formula=res.get("formula", reduced_form),
                        full_payload=res,
                        reduced_formula=reduced_form,
                        structure=structure,
                        cif_text=cif_text,
                        filename=file.filename,
                        source=res.get("model_source", "CrystalFormer"),
                        temperature_k=temperature
                    )
                except Exception as save_err:
                    print(f"[MongoDB] Notice: Could not save prediction to DB: {save_err}")

            return res

        elif formula and formula.strip():
            res = crystalformer_service.predict_from_formula(
                formula=formula.strip(),
                temperature_k=temperature,
                space_group=space_group,
                dopant_element=dopant_element,
                dopant_fraction=dopant_fraction,
                host_site_species=host_site_species,
            )

            # Save to MongoDB
            if MATERIALS_DB_ENABLED and not dopant_element and not bypass_cache:
                try:
                    save_material_prediction(
                        formula=res.get("formula", formula.strip()),
                        full_payload=res,
                        reduced_formula=res.get("formula"),
                        cif_text=res.get("cif_string"),
                        filename=f"{formula.strip()}.cif",
                        source=res.get("model_source", "CrystalFormer"),
                        temperature_k=temperature
                    )
                except Exception as save_err:
                    print(f"[MongoDB] Notice: Could not save prediction to DB: {save_err}")

            return res
        else:
            raise HTTPException(status_code=400, detail="Please upload a .cif file or provide a material formula.")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"CrystalFormer prediction error: {str(e)}")


# =========================================================
# BATCH CIF PREDICTION & CSV EXPORT PIPELINE
# =========================================================

AVAILABLE_BATCH_PROPERTIES = [
    {
        "key": "formula",
        "name": "Reduced Formula",
        "category": "Structural",
        "unit": "",
        "default": True,
        "description": "Calculated chemical composition formula from lattice sites."
    },
    {
        "key": "crystal_system",
        "name": "Crystal System",
        "category": "Structural",
        "unit": "",
        "default": True,
        "description": "Symmetry classification (Cubic, Tetragonal, Orthorhombic, etc.)."
    },
    {
        "key": "space_group",
        "name": "Space Group",
        "category": "Structural",
        "unit": "",
        "default": True,
        "description": "International crystallographic space group symbol and number."
    },
    {
        "key": "density",
        "name": "Density",
        "category": "Structural",
        "unit": "g/cm³",
        "default": True,
        "description": "Mass density computed from atomic weights and cell volume."
    },
    {
        "key": "volume",
        "name": "Cell Volume",
        "category": "Structural",
        "unit": "Å³",
        "default": True,
        "description": "Lattice unit cell volume in cubic Angstroms."
    },
    {
        "key": "num_sites",
        "name": "Number of Sites",
        "category": "Structural",
        "unit": "atoms",
        "default": False,
        "description": "Total number of atomic coordinates in the unit cell."
    },
    {
        "key": "lattice_params",
        "name": "Lattice Parameters",
        "category": "Structural",
        "unit": "Å, deg",
        "default": False,
        "description": "Unit cell lengths (a, b, c) and interaxial angles (alpha, beta, gamma)."
    },
    {
        "key": "bulk_modulus",
        "name": "Bulk Modulus (K_VRH)",
        "category": "Mechanical",
        "unit": "GPa",
        "default": True,
        "description": "Resistance to uniform hydrostatic compression (CHGNet GNN surrogate)."
    },
    {
        "key": "shear_modulus",
        "name": "Shear Modulus (G_VRH)",
        "category": "Mechanical",
        "unit": "GPa",
        "default": True,
        "description": "Resistance to shape deformation without volume change."
    },
    {
        "key": "youngs_modulus",
        "name": "Young's Modulus (E)",
        "category": "Mechanical",
        "unit": "GPa",
        "default": True,
        "description": "Tensile stiffness derived from Voigt-Reuss-Hill elastic moduli."
    },
    {
        "key": "poisson_ratio",
        "name": "Poisson's Ratio (ν)",
        "category": "Mechanical",
        "unit": "ratio",
        "default": True,
        "description": "Ratio of transverse strain to axial strain."
    },
    {
        "key": "compressibility",
        "name": "Compressibility",
        "category": "Mechanical",
        "unit": "GPa⁻¹",
        "default": False,
        "description": "Inverse of bulk modulus (1/K)."
    },
    {
        "key": "pughs_ratio",
        "name": "Pugh's Ratio (K/G)",
        "category": "Mechanical",
        "unit": "ratio",
        "default": False,
        "description": "Ductility vs. brittleness index (B/G > 1.75 indicates ductile behaviour)."
    },
    {
        "key": "fracture_toughness",
        "name": "Fracture Toughness (K_Ic)",
        "category": "Mechanical",
        "unit": "MPa·m^0.5",
        "default": True,
        "description": "Critical stress intensity factor via CrystalFormer Niu-Oganov model."
    },
    {
        "key": "formation_energy",
        "name": "Formation Energy (Ef)",
        "category": "Thermodynamics",
        "unit": "eV/atom",
        "default": True,
        "description": "Calculated formation energy per atom relative to elemental reference chemical potentials (CrystalFormer mp_e_form.ckpt)."
    },
    {
        "key": "ehull",
        "name": "Energy Above Hull (E_hull)",
        "category": "Thermodynamics",
        "unit": "eV/atom",
        "default": True,
        "description": "Thermodynamic stability distance to the Materials Project convex hull (EHull Prediction Tool)."
    },
    {
        "key": "is_stable",
        "name": "Thermodynamic Stability",
        "category": "Thermodynamics",
        "unit": "",
        "default": True,
        "description": "Classification into Stable (<= 25 meV/atom) or Unstable."
    },
    {
        "key": "band_gap",
        "name": "Electronic Band Gap",
        "category": "Electronic",
        "unit": "eV",
        "default": True,
        "description": "Forbidden energy gap between valence band maximum and conduction band minimum (CrystalFormer mp_bandgap.ckpt)."
    },
    {
        "key": "electronic_conductivity",
        "name": "Electronic Conductivity (σ_e)",
        "category": "Electronic",
        "unit": "S/cm",
        "default": True,
        "description": "Intrinsic electronic conductivity derived from CrystalFormer band gap (Arrhenius model)."
    },
    {
        "key": "electronic_state",
        "name": "Electronic Nature",
        "category": "Electronic",
        "unit": "",
        "default": True,
        "description": "Classification into Insulator, Semiconductor, or Metal."
    },

    {
        "key": "ionic_conductivity",
        "name": "Ionic Conductivity (σ)",
        "category": "Ionic Transport",
        "unit": "S/cm",
        "default": True,
        "description": "Fast-ion transport rate at target temperature (IonCast ML stack)."
    },
    {
        "key": "activation_energy",
        "name": "Activation Energy (Ea)",
        "category": "Ionic Transport",
        "unit": "eV",
        "default": True,
        "description": "Arrhenius migration barrier energy for ion hopping."
    }
]

# Global store for active and completed batch prediction jobs
BATCH_JOBS: Dict[str, Dict[str, Any]] = {}


def generate_csv_string(records: List[dict]) -> str:
    """Generates standard CSV content from records with logical column ordering."""
    if not records:
        return ""
    preferred_order = [
        "filename", "material_id", "formula", "crystal_system", "space_group", "space_group_number",
        "volume_A3", "density_g_cm3", "num_sites",
        "lattice_a", "lattice_b", "lattice_c", "alpha", "beta", "gamma",
        "bulk_modulus_GPa", "shear_modulus_GPa", "youngs_modulus_GPa", "fracture_toughness_MPa_m05",
        "poisson_ratio", "compressibility_GPa_inv", "pughs_ratio", "elastic_anisotropy",
        "formation_energy_eV_atom",
        "ehull_eV_per_atom", "ehull_meV_per_atom", "is_stable", "stability_status",
        "band_gap_eV", "electronic_conductivity_S_cm", "electronic_state",
        "ionic_conductivity_S_cm", "activation_energy_eV",
        "model_source", "status", "error_message"
    ]
    fieldnames = []
    for col in preferred_order:
        if any(col in r for r in records):
            fieldnames.append(col)
    for r in records:
        for k in r.keys():
            if k not in fieldnames:
                fieldnames.append(k)

    output = io.StringIO()
    writer = csv.DictWriter(output, fieldnames=fieldnames, extrasaction="ignore")
    writer.writeheader()
    for r in records:
        writer.writerow(r)
    return output.getvalue()


def process_single_cif_record(
    filename: str,
    cif_text: str,
    requested_keys: List[str],
    temperature: float
) -> dict:
    """
    Parses a single CIF structure string and computes the requested properties.
    Never raises an uncaught exception; returns error details inside the record if failed.
    """
    requested_set = set(requested_keys)
    base_id = filename.rsplit(".", 1)[0]
    row: Dict[str, Any] = {
        "filename": filename,
        "material_id": base_id,
        "formula": "Unknown",
        "status": "success",
        "error_message": None,
    }

    try:
        structure = Structure.from_str(cif_text, fmt="cif")
        lattice = structure.lattice
        row["formula"] = structure.composition.reduced_formula

        if "num_sites" in requested_set:
            row["num_sites"] = len(structure)
        if "volume" in requested_set:
            row["volume_A3"] = round(float(lattice.volume), 3)
        if "density" in requested_set:
            row["density_g_cm3"] = round(float(structure.density), 3)

        # Space Group & Crystal System
        if any(k in requested_set for k in ["space_group", "crystal_system", "lattice_params"]):
            try:
                sga = SpacegroupAnalyzer(structure, symprec=0.1)
                if "space_group" in requested_set:
                    row["space_group"] = sga.get_space_group_symbol()
                    row["space_group_number"] = sga.get_space_group_number()
                if "crystal_system" in requested_set:
                    row["crystal_system"] = sga.get_crystal_system()
            except Exception:
                if "space_group" in requested_set:
                    row["space_group"] = "Unknown"
                    row["space_group_number"] = None
                if "crystal_system" in requested_set:
                    row["crystal_system"] = "Unknown"

            if "lattice_params" in requested_set:
                row["lattice_a"] = round(float(lattice.a), 3)
                row["lattice_b"] = round(float(lattice.b), 3)
                row["lattice_c"] = round(float(lattice.c), 3)
                row["alpha"] = round(float(lattice.alpha), 2)
                row["beta"] = round(float(lattice.beta), 2)
                row["gamma"] = round(float(lattice.gamma), 2)

        # Determine if CrystalFormer / GNN feature extraction is required
        crystalformer_batch_keys = {
            "bulk_modulus", "shear_modulus", "youngs_modulus", "fracture_toughness",
            "poisson_ratio", "compressibility", "pughs_ratio", "elastic_anisotropy",
            "formation_energy", "formation_energy_per_atom", "formation_energy_eV_atom",
            "ehull", "is_stable", "energy_above_hull",
            "band_gap", "electronic_conductivity", "electronic_state"
        }
        therm_keys = {"thermal_conductivity", "debye_temperature", "phonon_frequency_proxy"}

        # 1. CrystalFormer Core & Derived Properties (Bulk, Shear, Young's, Fracture Toughness, Band Gap, Electronic Cond, Ef, Ehull)
        if requested_set & crystalformer_batch_keys:
            if CRYSTALFORMER_LOADED and crystalformer_service:
                try:
                    cf_res = crystalformer_service.predict(structure, temperature_k=temperature)
                    if cf_res.get("status") == "success":
                        core = cf_res.get("core_properties", {})
                        derived = cf_res.get("derived_properties", {})
                        aux = cf_res.get("auxiliary_metrics", {})
                        stability = cf_res.get("stability", {})

                        if "bulk_modulus" in requested_set:
                            row["bulk_modulus_GPa"] = core.get("bulk_modulus_GPa")
                        if "shear_modulus" in requested_set:
                            row["shear_modulus_GPa"] = core.get("shear_modulus_GPa")
                        if "youngs_modulus" in requested_set:
                            row["youngs_modulus_GPa"] = derived.get("youngs_modulus_GPa")
                        if "fracture_toughness" in requested_set:
                            row["fracture_toughness_MPa_m05"] = derived.get("fracture_toughness_MPa_m05")
                        if "poisson_ratio" in requested_set:
                            row["poisson_ratio"] = aux.get("poisson_ratio")
                        if "compressibility" in requested_set:
                            row["compressibility_GPa_inv"] = aux.get("compressibility_GPa_inv")
                        if "pughs_ratio" in requested_set:
                            row["pughs_ratio"] = aux.get("pughs_ratio")
                        if "elastic_anisotropy" in requested_set:
                            row["elastic_anisotropy"] = 1.2
                        if any(k in requested_set for k in ["formation_energy", "formation_energy_per_atom", "formation_energy_eV_atom"]):
                            row["formation_energy_eV_atom"] = core.get("formation_energy_eV_atom")
                        if any(k in requested_set for k in ["ehull", "energy_above_hull"]):
                            row["ehull_eV_per_atom"] = stability.get("ehull_eV_per_atom")
                            row["ehull_meV_per_atom"] = stability.get("ehull_meV_per_atom")
                        if "is_stable" in requested_set:
                            row["is_stable"] = stability.get("is_stable")
                            row["stability_status"] = stability.get("stability_status")
                        if "band_gap" in requested_set:
                            row["band_gap_eV"] = core.get("band_gap_eV")
                        if "electronic_conductivity" in requested_set:
                            row["electronic_conductivity_S_cm"] = derived.get("electronic_conductivity_S_cm")
                        if "electronic_state" in requested_set:
                            row["electronic_state"] = aux.get("electronic_nature")
                        row["model_source"] = cf_res.get("model_source", "CrystalFormer")
                    else:
                        row["error_message"] = f"CrystalFormer error: {cf_res.get('error')}"
                except Exception as cf_err:
                    row["error_message"] = f"CrystalFormer warning: {str(cf_err)}"
            elif not (CRYSTALFORMER_LOADED and crystalformer_service):
                row["error_message"] = "CrystalFormer service unavailable on server."

        # 2. Ionic Transport Properties (IonCast v5 Stack)
        ionic_keys = {"ionic_conductivity", "activation_energy"}
        if requested_set & ionic_keys:
            if IONIC_LOADED:
                try:
                    res = calculate_ionic_transport_for_structure(structure, temperature_k=temperature)
                    if res["status"] == "calculated":
                        cond = res.get("conductivity_s_cm")
                        ea = res.get("activation_energy_ev")
                        if "ionic_conductivity" in requested_set:
                            row["ionic_conductivity_S_cm"] = float(f"{float(cond):.6g}") if cond is not None else None
                        if "activation_energy" in requested_set:
                            row["activation_energy_eV"] = round(float(ea), 4) if ea is not None else None
                    else:
                        row["status"] = "warning"
                        if "ionic_conductivity" in requested_set: row["ionic_conductivity_S_cm"] = None
                        if "activation_energy" in requested_set: row["activation_energy_eV"] = None
                except Exception as ie:
                    row["status"] = "warning"
                    if "ionic_conductivity" in requested_set: row["ionic_conductivity_S_cm"] = None
                    if "activation_energy" in requested_set: row["activation_energy_eV"] = None
            else:
                if "ionic_conductivity" in requested_set: row["ionic_conductivity_S_cm"] = None
                if "activation_energy" in requested_set: row["activation_energy_eV"] = None

    except Exception as e:
        row["status"] = "failed"
        row["error_message"] = str(e)

    # Persist batch row prediction into MongoDB
    if MATERIALS_DB_ENABLED and row.get("status") in ["success", "warning"]:
        try:
            save_material_prediction(
                formula=row.get("formula", "Unknown"),
                full_payload=row,
                reduced_formula=row.get("formula"),
                structure=structure if 'structure' in locals() else None,
                cif_text=cif_text,
                filename=filename,
                source=row.get("model_source", "BatchPipeline"),
                temperature_k=temperature
            )
        except Exception as save_err:
            pass

    return row


def run_batch_prediction_worker(
    job_id: str,
    cif_items: List[Tuple[str, str]],
    requested_keys: List[str],
    temperature: float
):
    """Background worker executing batch property predictions."""
    job = BATCH_JOBS.get(job_id)
    if not job:
        return

    total = len(cif_items)
    results = []

    for idx, (filename, cif_text) in enumerate(cif_items):
        job["current_file"] = filename
        job["completed"] = idx
        job["progress"] = int((idx / total) * 100) if total > 0 else 0

        row = process_single_cif_record(filename, cif_text, requested_keys, temperature)
        results.append(row)
        job["results"] = results

    successful = sum(1 for r in results if r.get("status") == "success")
    failed = sum(1 for r in results if r.get("status") == "failed")
    warnings_count = sum(1 for r in results if r.get("status") == "warning")

    csv_str = generate_csv_string(results)

    job["completed"] = total
    job["progress"] = 100
    job["status"] = "completed"
    job["current_file"] = "Complete"
    job["csv_content"] = csv_str
    job["summary"] = {
        "total": total,
        "successful": successful,
        "warnings": warnings_count,
        "failed": failed
    }


@router.get("/batch-properties")
def get_batch_properties():
    """Returns the list of available properties and categories for batch prediction."""
    return {"properties": AVAILABLE_BATCH_PROPERTIES}


@router.get("/batch-sample-cifs")
def get_batch_sample_cifs():
    """Returns sample CIF filenames and contents for fast testing."""
    sample_files = []
    base_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
    for name in ["test_curr.cif", "test2.cif"]:
        path = os.path.join(base_dir, name)
        if os.path.exists(path):
            try:
                with open(path, "r", encoding="utf-8") as f:
                    sample_files.append({"filename": name, "content": f.read()})
            except Exception:
                pass
    return {"samples": sample_files}


async def _extract_cif_items_from_uploads(files: List[UploadFile]) -> List[Tuple[str, str]]:
    """Helper to extract (filename, cif_text) pairs from uploaded .cif files and .zip archives."""
    cif_items: List[Tuple[str, str]] = []

    for f in files:
        fname = f.filename or "unknown"
        data = await f.read()

        if fname.lower().endswith(".zip"):
            try:
                with zipfile.ZipFile(io.BytesIO(data)) as z:
                    for name in z.namelist():
                        base = os.path.basename(name)
                        if base.lower().endswith(".cif") and not name.startswith("__MACOSX") and not base.startswith("._"):
                            try:
                                text = z.read(name).decode("utf-8", errors="replace")
                                if text.strip():
                                    cif_items.append((base, text))
                            except Exception:
                                pass
            except Exception as ze:
                raise HTTPException(status_code=400, detail=f"Failed to read zip archive '{fname}': {str(ze)}")
        elif fname.lower().endswith(".cif"):
            try:
                text = data.decode("utf-8", errors="replace")
                if text.strip():
                    cif_items.append((os.path.basename(fname), text))
            except Exception as ce:
                raise HTTPException(status_code=400, detail=f"Failed to read CIF file '{fname}': {str(ce)}")
        else:
            # Check if file has CIF headers
            try:
                text = data.decode("utf-8", errors="replace")
                if "data_" in text or "_cell_length_" in text:
                    cif_items.append((os.path.basename(fname), text))
            except Exception:
                pass

    if not cif_items:
        raise HTTPException(
            status_code=400,
            detail="No valid .cif files found. Please upload a .zip containing .cif files, or one or more .cif files."
        )
    return cif_items


@router.post("/batch-predict")
async def start_batch_prediction(
    background_tasks: BackgroundTasks,
    files: List[UploadFile] = File(...),
    properties: str = Form(default="formula,crystal_system,space_group,density,bulk_modulus,shear_modulus,youngs_modulus,fracture_toughness,formation_energy,ehull,is_stable,band_gap,electronic_conductivity,ionic_conductivity,activation_energy"),
    temperature: float = Form(298.15)
):
    """
    Accepts uploaded .zip archive(s) or multiple .cif files, extracts structures,
    and launches background batch prediction according to selected properties routing.
    """
    cif_items = await _extract_cif_items_from_uploads(files)

    job_id = str(uuid.uuid4())
    requested_keys = [k.strip() for k in properties.split(",") if k.strip()]

    BATCH_JOBS[job_id] = {
        "job_id": job_id,
        "status": "processing",
        "progress": 0,
        "total": len(cif_items),
        "completed": 0,
        "current_file": cif_items[0][0] if cif_items else "",
        "results": [],
        "csv_content": "",
        "summary": {}
    }

    background_tasks.add_task(
        run_batch_prediction_worker,
        job_id,
        cif_items,
        requested_keys,
        temperature
    )

    return {
        "job_id": job_id,
        "status": "processing",
        "total": len(cif_items),
        "message": f"Successfully loaded {len(cif_items)} CIF structure(s). Batch prediction started."
    }


@router.get("/batch-predict/status/{job_id}")
def get_batch_prediction_status(job_id: str):
    """Returns current progress and execution status of a batch prediction job."""
    job = BATCH_JOBS.get(job_id)
    if not job:
        raise HTTPException(status_code=404, detail="Batch prediction job not found.")
    return {
        "job_id": job_id,
        "status": job["status"],
        "progress": job["progress"],
        "total": job["total"],
        "completed": job["completed"],
        "current_file": job["current_file"],
        "error": job.get("error")
    }


@router.get("/batch-predict/results/{job_id}")
def get_batch_prediction_results(job_id: str):
    """Returns the full results array and summary stats of a batch prediction job."""
    job = BATCH_JOBS.get(job_id)
    if not job:
        raise HTTPException(status_code=404, detail="Batch prediction job not found.")
    return {
        "job_id": job_id,
        "status": job["status"],
        "total": job["total"],
        "completed": job["completed"],
        "results": job["results"],
        "summary": job.get("summary", {})
    }


@router.get("/batch-predict/download/{job_id}")
def download_batch_prediction_csv(job_id: str):
    """Streams the calculated properties of the batch prediction as a CSV download."""
    job = BATCH_JOBS.get(job_id)
    if not job:
        raise HTTPException(status_code=404, detail="Batch prediction job not found.")
    csv_content = job.get("csv_content", "")
    if not csv_content and job.get("results"):
        csv_content = generate_csv_string(job["results"])

    return Response(
        content=csv_content,
        media_type="text/csv",
        headers={
            "Content-Disposition": f"attachment; filename=materials_batch_predictions_{job_id[:8]}.csv"
        }
    )


# ---------------------------------------------------------
# DEDICATED CRYSTALFORMER BATCH PREDICTION ENDPOINT
# ---------------------------------------------------------
@router.post("/batch-predict-crystalformer")
async def batch_predict_crystalformer(
    files: List[UploadFile] = File(...)
):
    """
    Dedicated high-throughput batch prediction for CrystalFormer properties:
    Core: Bulk modulus (K), Formation energy (Ef), Shear modulus (G), Band gap (Eg).
    Derived: Young's modulus (E), Fracture toughness (K_IC), Electronic conductivity (sigma).
    Auxiliary: Poisson ratio, Compressibility, Pugh ratio.
    Accepts multiple .cif files or a .zip archive.
    """
    cif_items = await _extract_cif_items_from_uploads(files)

    try:
        records = []
        if CRYSTALFORMER_LOADED and crystalformer_service:
            raw_results = crystalformer_service.predict_batch(cif_items=cif_items)
            for r in raw_results:
                if r.get("status") == "success":
                    core = r.get("core_properties", {})
                    derived = r.get("derived_properties", {})
                    aux = r.get("auxiliary_metrics", {})
                    stability = r.get("stability", {})
                    records.append({
                        "filename": r.get("filename", "unknown.cif"),
                        "formula": r.get("formula", "Unknown"),
                        "num_atoms": r.get("num_atoms", 0),
                        "bulk_modulus_GPa": core.get("bulk_modulus_GPa"),
                        "shear_modulus_GPa": core.get("shear_modulus_GPa"),
                        "formation_energy_eV_atom": core.get("formation_energy_eV_atom"),
                        "ehull_eV_per_atom": stability.get("ehull_eV_per_atom"),
                        "ehull_meV_per_atom": stability.get("ehull_meV_per_atom"),
                        "is_stable": stability.get("is_stable"),
                        "stability_status": stability.get("stability_status"),
                        "band_gap_eV": core.get("band_gap_eV"),
                        "youngs_modulus_GPa": derived.get("youngs_modulus_GPa"),
                        "fracture_toughness_MPa_m05": derived.get("fracture_toughness_MPa_m05"),
                        "electronic_conductivity_S_cm": derived.get("electronic_conductivity_S_cm"),
                        "poisson_ratio": aux.get("poisson_ratio"),
                        "pughs_ratio": aux.get("pughs_ratio"),
                        "compressibility_GPa_inv": aux.get("compressibility_GPa_inv"),
                        "electronic_nature": aux.get("electronic_nature"),
                        "status": "success",
                        "model_source": r.get("model_source", "CrystalFormer"),
                        "error_message": None
                    })
                else:
                    records.append({
                        "filename": r.get("filename", "unknown.cif"),
                        "formula": r.get("formula", "Unknown"),
                        "status": "error",
                        "error_message": r.get("error", "Prediction failed")
                    })
            model_name = "CrystalFormerService"
        else:
            raise HTTPException(status_code=500, detail="No prediction engine available on server.")

        csv_str = generate_csv_string(records)
        successful = sum(1 for r in records if r.get("status") == "success")
        failed = sum(1 for r in records if r.get("status") != "success")

        return {
            "status": "success",
            "model_used": model_name,
            "total": len(records),
            "successful": successful,
            "failed": failed,
            "results": records,
            "csv_content": csv_str
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"CrystalFormer batch prediction error: {str(e)}")





# ---------------------------------------------------------
# MONGODB MATERIALS DATABASE INSPECTION & CACHE ENDPOINTS
# ---------------------------------------------------------
@router.get("/database/overview")
def get_materials_db_stats():
    """Returns database connection status and collection summary statistics."""
    if not MATERIALS_DB_ENABLED:
        return {"connected": False, "message": "MongoDB service not initialized."}
    return get_database_overview()


@router.get("/database/records")
def list_database_materials(
    query: Optional[str] = None,
    is_stable: Optional[bool] = None,
    page: int = 1,
    limit: int = 50
):
    """
    Returns paginated list of all material property predictions saved in MongoDB.
    Allows searching by formula, filename, or filtering by thermodynamic stability.
    """
    if not MATERIALS_DB_ENABLED:
        return {"total": 0, "page": page, "limit": limit, "items": [], "connected": False}
    return list_cached_predictions(query=query, is_stable=is_stable, page=page, limit=limit)


@router.get("/database/records/{record_id}")
def get_database_material_detail(record_id: str):
    """Fetches full prediction payload and CIF text for a specific MongoDB record."""
    if not MATERIALS_DB_ENABLED:
        raise HTTPException(status_code=500, detail="MongoDB service not initialized.")
    record = get_prediction_detail(record_id)
    if not record:
        raise HTTPException(status_code=404, detail=f"Material record '{record_id}' not found in MongoDB.")
    return record


@router.delete("/database/records/{record_id}")
def delete_database_material(record_id: str):
    """Deletes a cached material prediction from MongoDB."""
    if not MATERIALS_DB_ENABLED:
        raise HTTPException(status_code=500, detail="MongoDB service not initialized.")
    success = delete_prediction_record(record_id)
    if not success:
        raise HTTPException(status_code=404, detail=f"Material record '{record_id}' not found.")
    return {"status": "success", "message": f"Record '{record_id}' removed from MongoDB."}


@router.get("/lookup")
def lookup_material_by_formula_or_id(
    query: str
):
    """
    Instantly looks up an existing material in MongoDB by formula, reduced formula,
    or material_id / filename. Returns existing properties if found.
    """
    if not MATERIALS_DB_ENABLED:
        return {"found": False, "message": "Database not enabled."}

    clean_q = query.strip()
    import re
    from materials_db_service import normalize_formula, predictions_collection

    cached = get_cached_prediction(formula=clean_q, reduced_formula=clean_q)
    if not cached and predictions_collection is not None:
        doc = predictions_collection.find_one({
            "$or": [
                {"filename": clean_q},
                {"filename": f"{clean_q}.cif"},
                {"material_id": clean_q},
                {"formula": {"$regex": f"^{re.escape(clean_q)}$", "$options": "i"}},
                {"reduced_formula": {"$regex": f"^{re.escape(clean_q)}$", "$options": "i"}}
            ]
        })
        if doc:
            doc["_id"] = str(doc["_id"])
            cached = doc

    # Also search obliex_dataset collection if not found in predictions
    if not cached:
        try:
            from database import db
            if db is not None:
                ob_doc = db["obliex_dataset"].find_one({
                    "$or": [
                        {"material_id": clean_q},
                        {"material_id": clean_q.lower()},
                        {"filename": clean_q},
                        {"filename": f"{clean_q}.cif"},
                        {"formula": {"$regex": f"^{re.escape(clean_q)}$", "$options": "i"}},
                        {"reduced_formula": {"$regex": f"^{re.escape(clean_q)}$", "$options": "i"}}
                    ]
                })
                if ob_doc:
                    # Check if predictions has evaluated it by cif_hash
                    pred_match = predictions_collection.find_one({"cif_hash": ob_doc.get("cif_hash")})
                    if pred_match:
                        pred_match["_id"] = str(pred_match["_id"])
                        cached = pred_match
                    else:
                        ob_doc["_id"] = str(ob_doc["_id"])
                        cached = {
                            "_id": ob_doc["_id"],
                            "formula": ob_doc.get("formula"),
                            "reduced_formula": ob_doc.get("reduced_formula"),
                            "filename": ob_doc.get("filename"),
                            "source_model": "OBLIEX Reference Phase",
                            "metadata": {
                                "volume_A3": ob_doc.get("volume_A3"),
                                "density_g_cm3": ob_doc.get("density_g_cm3"),
                                "num_sites": ob_doc.get("num_sites"),
                                "space_group": ob_doc.get("space_group"),
                                "crystal_system": ob_doc.get("crystal_system")
                            },
                            "summary_metrics": {},
                            "cif_content": ob_doc.get("cif_content"),
                            "created_at": ob_doc.get("updated_at")
                        }
        except Exception:
            pass

    if cached:
        # Extract rich metrics
        sum_m = dict(cached.get("summary_metrics", {}) or {})
        full_p = cached.get("full_prediction_payload") or {}

        # Fallback values from full_prediction_payload if summary_metrics is empty
        if not sum_m.get("bulk_modulus_GPa") and full_p.get("bulk_modulus_GPa") is not None:
            sum_m["bulk_modulus_GPa"] = full_p.get("bulk_modulus_GPa")
        if not sum_m.get("shear_modulus_GPa") and full_p.get("shear_modulus_GPa") is not None:
            sum_m["shear_modulus_GPa"] = full_p.get("shear_modulus_GPa")
        if not sum_m.get("formation_energy_eV_atom") and full_p.get("formation_energy_eV_atom") is not None:
            sum_m["formation_energy_eV_atom"] = full_p.get("formation_energy_eV_atom")
        if not sum_m.get("band_gap_eV") and full_p.get("band_gap_eV") is not None:
            sum_m["band_gap_eV"] = full_p.get("band_gap_eV")
        if not sum_m.get("ionic_conductivity_S_cm") and full_p.get("ionic_conductivity_S_cm") is not None:
            sum_m["ionic_conductivity_S_cm"] = full_p.get("ionic_conductivity_S_cm")
        if not sum_m.get("activation_energy_eV") and full_p.get("activation_energy_eV") is not None:
            sum_m["activation_energy_eV"] = full_p.get("activation_energy_eV")

        meta = dict(cached.get("metadata", {}) or {})
        if not meta.get("space_group") and cached.get("space_group"):
            meta["space_group"] = cached.get("space_group")
        if not meta.get("crystal_system") and cached.get("crystal_system"):
            meta["crystal_system"] = cached.get("crystal_system")

        mat_id = cached.get("material_id") or full_p.get("material_id")
        if not mat_id and cached.get("filename"):
            m = re.match(r"^([a-zA-Z0-9_-]+)\.cif$", cached.get("filename", ""))
            if m:
                mat_id = m.group(1)

        return {
            "found": True,
            "material_id": mat_id,
            "formula": cached.get("formula"),
            "reduced_formula": cached.get("reduced_formula"),
            "filename": cached.get("filename"),
            "source": cached.get("source_model", "MongoDB Cache"),
            "metadata": meta,
            "space_group": meta.get("space_group") or cached.get("space_group"),
            "crystal_system": meta.get("crystal_system") or cached.get("crystal_system"),
            "metrics": sum_m,
            "full_prediction": full_p if full_p else None,
            "has_cif": bool(cached.get("cif_content")),
            "cif_content": cached.get("cif_content"),
            "cached_at": str(cached.get("updated_at") or cached.get("created_at")),
            "db_id": str(cached.get("_id"))
        }

    return {
        "found": False,
        "query": clean_q,
        "message": f"Material '{clean_q}' not found in MongoDB. You can run models on it to calculate properties and save it to the database."
    }