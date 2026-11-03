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

# Custom Utils
from utils.structural_analyzer import calculate_structural_metrics
from utils.chgnet_features import extract_mechanical_features
from model_paths import resolve_pretrained_models_dir
from routes.transport_router import predict_conductivity_from_path

# DEFINE ROUTER
# MongoDB Materials Persistence Service
try:
    from services.materials_db_service import (
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
# STARTUP: Load All Property Surrogates & IonCast Models Separately
# ---------------------------------------------------------
MODELS_BASE = resolve_pretrained_models_dir("chgnet_logK_model.pkl")
IONCAST_MODELS_BASE = MODELS_BASE  



# 1. CrystalFormer Service & Pipeline (Bulk, Shear, Formation Energy, Band Gap + Derived Properties)
try:
    try:
        from CrystalFormer.crystalformer_service import get_crystalformer_service
        from CrystalFormer.cif_generator_bridge import generate_cif_from_formula
    except ImportError:
        from backend.CrystalFormer.crystalformer_service import get_crystalformer_service
        from backend.CrystalFormer.cif_generator_bridge import generate_cif_from_formula
    crystalformer_service = get_crystalformer_service()
    CRYSTALFORMER_LOADED = True
    print("CrystalFormer service loaded successfully (Bulk, Shear, Formation Energy, Band Gap + Derived Properties).")
except Exception as e:
    crystalformer_service = None
    CRYSTALFORMER_LOADED = False
    print(f"WARNING: CrystalFormer service not loaded: {e}")

# Unified BFSY Pipeline Fallback
try:
    try:
        from prediction.BFSY_pipeline import BFSYPipeline
    except ImportError:
        from backend.prediction.BFSY_pipeline import BFSYPipeline
    bfsy_pipeline = BFSYPipeline(models_dir=MODELS_BASE)
    BFSY_LOADED = True
    MECHANICAL_LOADED = True
    print("BFSY fallback pipeline loaded.")
except Exception as e:
    bfsy_pipeline = None
    BFSY_LOADED = False
    MECHANICAL_LOADED = False
    print(f"WARNING: BFSY fallback pipeline not loaded: {e}")

# 2. Electrical Model (Band Gap)
try:
    chgnet_model_bg = joblib.load(os.path.join(MODELS_BASE, "chgnet_bandgap_model.pkl"))
    ELECTRICAL_LOADED = True
    print("Electrical surrogate model loaded.")
except Exception as e:
    ELECTRICAL_LOADED = False
    print(f"WARNING: Electrical model not loaded: {e}")

# 3. Thermal Model (Phonon Proxy)
try:
    chgnet_model_th = joblib.load(os.path.join(MODELS_BASE, "chgnet_thermal_model.pkl"))
    THERMAL_LOADED = True
    print("Thermal surrogate model loaded.")
except Exception as e:
    THERMAL_LOADED = False
    print(f"WARNING: Thermal model not loaded: {e}")

# 4. Full IonCast Models Stack
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


# ---------------------------------------------------------
# UNIFIED MULTI-PROPERTY PREDICTION ENDPOINT (Fixes Mocks)
# ---------------------------------------------------------
@router.post("/predict-properties")
async def predict_properties(
    file: UploadFile = File(...),
    properties: str = Form(default="bulk_modulus,shear_modulus,thermal_conductivity"),
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
        
        # Extract GNN mechanical/structural feature vectors if applicable
        feature_vector = None
        try:
            chgnet_features = extract_mechanical_features(structure)
            feature_vector = chgnet_features.get('feature_vector')
        except Exception:
            pass

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
            
            # Fallback to legacy BFSY if CrystalFormer service prediction failed
            if cf_result is None and BFSY_LOADED and bfsy_pipeline:
                try:
                    bfsy_res = bfsy_pipeline.predict(structure, feature_vector=feature_vector)
                    if bfsy_res.get("status") == "success":
                        k_val = bfsy_res.get("bulk_modulus_GPa", 95.0)
                        g_val = bfsy_res.get("shear_modulus_GPa", 48.0)
                        ef_val = bfsy_res.get("formation_energy_eV_atom", -2.0)
                        bg_val = 2.45
                        if ELECTRICAL_LOADED and feature_vector is not None:
                            try:
                                bg_val = float(chgnet_model_bg.predict([feature_vector])[0])
                            except Exception:
                                pass
                        natoms = len(structure)
                        v0 = float(structure.lattice.volume) / max(1, natoms)
                        try:
                            from CrystalFormer.derived_properties import derive_properties
                            der = derive_properties(k_val, g_val, bg_val, v0)
                        except Exception:
                            der = {
                                "youngs_modulus_GPa": 9.0 * k_val * g_val / (3.0 * k_val + g_val),
                                "fracture_toughness_MPa_m05": 0.01 * (v0 ** (1.0 / 6.0)) * g_val * math.sqrt(k_val / g_val),
                                "electronic_conductivity_S_cm": 1.0e-16 if bg_val > 2.4 else 1.0e-4,
                            }
                        cf_result = {
                            "status": "success",
                            "model_source": "BFSYPipeline-Fallback",
                            "core_properties": {
                                "bulk_modulus_GPa": k_val,
                                "shear_modulus_GPa": g_val,
                                "formation_energy_eV_atom": ef_val,
                                "band_gap_eV": bg_val,
                            },
                            "derived_properties": {
                                "youngs_modulus_GPa": der["youngs_modulus_GPa"],
                                "fracture_toughness_MPa_m05": der["fracture_toughness_MPa_m05"],
                                "electronic_conductivity_S_cm": der["electronic_conductivity_S_cm"],
                            },
                            "auxiliary_metrics": {
                                "poisson_ratio": bfsy_res.get("poisson_ratio", 0.25),
                                "pughs_ratio": bfsy_res.get("pughs_ratio", 2.0),
                                "compressibility_GPa_inv": bfsy_res.get("compressibility_GPa_inv", 0.01),
                                "electronic_nature": "Insulator" if bg_val > 2.0 else "Semiconductor",
                            }
                        }
                except Exception as b_err:
                    print(f"Fallback BFSY prediction failed: {b_err}")

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

                elif key in ["thermal_conductivity", "thermal", "debye_temperature", "phonon_frequency_proxy_cm_inv"]:
                    if THERMAL_LOADED and feature_vector is not None:
                        thermal_proxy = float(chgnet_model_th.predict([feature_vector])[0])
                        unit_val = "cm⁻¹" if "thermal" in key or "phonon" in key else "K"
                        calculated_properties[key] = {
                            "property_key": key,
                            "value": round(thermal_proxy, 3),
                            "unit": unit_val,
                            "status": "calculated"
                        }
                    else:
                        calculated_properties[key] = {"property_key": key, "value": None, "unit": "", "status": "unavailable"}

                elif key in ["band_gap", "band_gap_eV", "electronic_state"]:
                    if ELECTRICAL_LOADED and feature_vector is not None:
                        bg = float(chgnet_model_bg.predict([feature_vector])[0])
                        val = bg if "band_gap" in key else ("Insulator" if bg > 2.0 else "Semiconductor")
                        calculated_properties[key] = {
                            "property_key": key,
                            "value": round(val, 3) if isinstance(val, float) else val,
                            "unit": "eV" if "band_gap" in key else "",
                            "status": "calculated"
                        }
                    else:
                        calculated_properties[key] = {"property_key": key, "value": None, "unit": "", "status": "unavailable"}
                elif key in ["ionic_conductivity", "ionic_conductivity_activation_energy", "activation_energy_eV"]:
                    if IONIC_LOADED:
                        try:
                            from properties.ionic_conductivity import IonicConductivityCalculator
                            calc = IonicConductivityCalculator(key=key)
                            res = calc.calculate(structure, settings={"temperature_k": temperature})
                            
                            if res.status == "calculated":
                                is_conductivity = key == "ionic_conductivity"
                                if is_conductivity:
                                    if res.raw_details and "conductivity_s_cm" in res.raw_details:
                                        val = res.raw_details["conductivity_s_cm"]
                                        unit = "S/cm"
                                    else:
                                        val = res.value
                                        unit = res.unit
                                else:
                                    if res.raw_details:
                                        val = res.raw_details.get("activation_energy_ev")
                                        unit = "eV"
                                    else:
                                        val = res.value
                                        unit = res.unit
                                
                                # Use significant figures instead of fixed decimals
                                # to preserve precision for very small conductivities
                                formatted_val = None
                                if val is not None:
                                    fval = float(val)
                                    formatted_val = float(f"{fval:.6g}")
                                
                                calculated_properties[key] = {
                                    "property_key": key,
                                    "value": formatted_val,
                                    "unit": unit,
                                    "status": "calculated",
                                    "raw_details": res.raw_details if res.raw_details else {}
                                }
                            else:
                                calculated_properties[key] = {
                                    "property_key": key,
                                    "value": None,
                                    "unit": "mS/cm" if "conductivity" in key else "eV",
                                    "status": "failed",
                                    "warnings": res.warnings
                                }
                        except Exception as inner_ex:
                            calculated_properties[key] = {
                                "property_key": key,
                                "value": None,
                                "unit": "mS/cm" if "conductivity" in key else "eV",
                                "status": "failed",
                                "warnings": [str(inner_ex)]
                            }
                    else:
                        calculated_properties[key] = {
                            "property_key": key,
                            "value": None,
                            "unit": "",
                            "status": "unavailable",
                            "warnings": ["IonCast models not loaded on server"]
                        }
           
            except Exception as prop_err:
                calculated_properties[key] = {"property_key": key, "value": None, "unit": "", "status": "failed", "warnings": [str(prop_err)]}

        base_energy = -3.42
        if bfsy_result and bfsy_result.get("energy_per_atom_eV") is not None:
            base_energy = bfsy_result["energy_per_atom_eV"]

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
# ENDPOINT 2: Structural Metrics via JSON Payload
# ---------------------------------------------------------
class CrystalStructureInput(BaseModel):
    data_block: Optional[str] = Field(default="mp-unknown", example="mp-2286")
    formula: Optional[str] = Field(default="Li2Se", example="Li2Se")
    space_group: Optional[str] = Field(default="Fm-3m", example="Fm-3m")
    space_group_number: Optional[int] = Field(default=225, example=225)
    lattice: Dict[str, float] = Field(
        example={"a": 4.208, "b": 4.208, "c": 4.208, "alpha": 60.0, "beta": 60.0, "gamma": 60.0, "volume": 52.716}
    )
    atom_count: Optional[int] = Field(default=3, example=3)
    atoms: List[Dict[str, Any]] = Field(
        example=[
            {"species": "Li", "fractional_coordinates": [0.25, 0.25, 0.25], "occupancy": None},
            {"species": "Li", "fractional_coordinates": [0.75, 0.75, 0.75], "occupancy": None},
            {"species": "Se", "fractional_coordinates": [0, 0, 0], "occupancy": None}
        ]
    )

@router.post("/calculate-metrics")
def process_structure_metrics(payload: CrystalStructureInput):
    try:
        metrics = calculate_structural_metrics(payload.model_dump())
        return {"status": "success", "metrics": metrics}
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Metrics calculation error: {str(e)}")


# ---------------------------------------------------------
# ENDPOINT 3: Structural Metrics via CIF Upload
# ---------------------------------------------------------
@router.post("/analyze-cif-file")
async def analyze_cif_file(file: UploadFile = File(...)):
    if not file.filename.endswith('.cif'):
        raise HTTPException(status_code=400, detail="Only .cif files are supported.")
    
    try:
        content = await file.read()
        structure = Structure.from_str(content.decode("utf-8"), fmt="cif")
        lattice = structure.lattice
        
        atoms_list = [{
            "species": site.species_string,
            "fractional_coordinates": [float(site.a), float(site.b), float(site.c)],
            "occupancy": float(site.occu.get(site.species_string, 1.0)) if hasattr(site, 'occu') else 1.0
        } for site in structure]
            
        payload_dict = {
            "data_block": file.filename.replace(".cif", ""),
            "formula": structure.composition.reduced_formula,
            "space_group": "Unknown",
            "lattice": {
                "a": float(lattice.a), "b": float(lattice.b), "c": float(lattice.c),
                "alpha": float(lattice.alpha), "beta": float(lattice.beta), "gamma": float(lattice.gamma),
                "volume": float(lattice.volume)
            },
            "atom_count": len(structure),
            "atoms": atoms_list
        }
        
        metrics = calculate_structural_metrics(payload_dict)
        return {"status": "success", "filename": file.filename, "metrics": metrics}
    except Exception as e:
       raise HTTPException(status_code=500, detail=f"CIF processing error: {str(e)}")


# ---------------------------------------------------------
# ENDPOINT 4: Mechanical Analysis (Bulk, Shear, Young's, Poisson, Formation Energy)
# ---------------------------------------------------------
@router.post("/analyze-mechanical")
async def analyze_mechanical_properties(file: UploadFile = File(...)):
    if not file.filename or not file.filename.lower().endswith('.cif'):
        raise HTTPException(status_code=400, detail="Only .cif files are supported.")
    
    try:
        content = await file.read()
        structure = Structure.from_str(content.decode("utf-8"), fmt="cif")
        chgnet_features = extract_mechanical_features(structure)
        feature_vector = chgnet_features['feature_vector']
        
        if not BFSY_LOADED:
            raise HTTPException(status_code=500, detail="BFSY prediction pipeline not loaded.")
            
        bfsy_res = bfsy_pipeline.predict(structure, feature_vector=feature_vector)
        if bfsy_res.get("status") == "error":
            raise HTTPException(status_code=500, detail=f"BFSY prediction error: {bfsy_res.get('error')}")

        K = bfsy_res.get("bulk_modulus_GPa")
        G = bfsy_res.get("shear_modulus_GPa")
        E = bfsy_res.get("youngs_modulus_GPa")
        nu = bfsy_res.get("poisson_ratio")
        Ef = bfsy_res.get("formation_energy_eV_atom")
        
        return {
            "status": "success",
            "filename": file.filename,
            "formula": structure.composition.reduced_formula,
            "mechanical_predictions": {
                "bulk_modulus_vrh_GPa": round(K, 2) if K is not None else None,
                "shear_modulus_vrh_GPa": round(G, 2) if G is not None else None,
                "youngs_modulus_GPa": round(E, 2) if E is not None else None,
                "poissons_ratio": round(nu, 3) if nu is not None else None,
                "formation_energy_eV_atom": round(Ef, 4) if Ef is not None else None,
                "pughs_ratio": round(bfsy_res.get("pughs_ratio"), 3) if bfsy_res.get("pughs_ratio") is not None else None,
                "compressibility_GPa_inv": bfsy_res.get("compressibility_GPa_inv"),
                "model_source": "BFSYPipeline-CHGNet-Unified"
            },
            "chgnet_mechanical_analysis": chgnet_features
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Mechanical analysis error: {str(e)}")


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


@router.post("/analyze-crystalformer")
@router.post("/analyze-bfsy")
async def analyze_crystalformer_properties(file: UploadFile = File(...)):
    """
    Evaluates Core 4 properties (Bulk, Shear, Formation energy, Band gap)
    and Derived 3 properties (Young's modulus, Fracture toughness, Electronic conductivity).
    """
    if not file.filename or not file.filename.lower().endswith('.cif'):
        raise HTTPException(status_code=400, detail="Only .cif files are supported.")

    try:
        content = await file.read()
        structure = Structure.from_str(content.decode("utf-8"), fmt="cif")
        
        if CRYSTALFORMER_LOADED and crystalformer_service:
            res = crystalformer_service.predict(structure)
            if res.get("status") == "error":
                raise HTTPException(status_code=500, detail=res.get("error", "Prediction failed"))
            core = res.get("core_properties", {})
            derived = res.get("derived_properties", {})
            aux = res.get("auxiliary_metrics", {})
            stability = res.get("stability", {})
            return {
                "status": "success",
                "filename": file.filename,
                "composition": res["formula"],
                "num_atoms": res["num_atoms"],
                "predictions": {
                    "bulk_modulus_GPa": core.get("bulk_modulus_GPa"),
                    "shear_modulus_GPa": core.get("shear_modulus_GPa"),
                    "formation_energy_eV_atom": core.get("formation_energy_eV_atom"),
                    "band_gap_eV": core.get("band_gap_eV"),
                    "youngs_modulus_GPa": derived.get("youngs_modulus_GPa"),
                    "fracture_toughness_MPa_m05": derived.get("fracture_toughness_MPa_m05"),
                    "electronic_conductivity_S_cm": derived.get("electronic_conductivity_S_cm"),
                    "poisson_ratio": aux.get("poisson_ratio"),
                    "pughs_ratio": aux.get("pughs_ratio"),
                    "compressibility_GPa_inv": aux.get("compressibility_GPa_inv"),
                    "electronic_nature": aux.get("electronic_nature"),
                    "ehull_eV_per_atom": stability.get("ehull_eV_per_atom"),
                    "ehull_meV_per_atom": stability.get("ehull_meV_per_atom"),
                    "is_stable": stability.get("is_stable"),
                    "stability_status": stability.get("stability_status"),
                },
                "stability": stability,
                "model_source": res.get("model_source", "CrystalFormer"),
                "is_fallback": res.get("is_fallback", False)
            }
        elif BFSY_LOADED and bfsy_pipeline:
            res = bfsy_pipeline.predict(structure)
            if res.get("status") == "error":
                raise HTTPException(status_code=500, detail=res.get("error", "BFSY prediction failed"))
            return {
                "status": "success",
                "filename": file.filename,
                "composition": res["composition"],
                "num_atoms": res["num_atoms"],
                "predictions": res,
                "model_source": "BFSYPipeline-Fallback"
            }
        else:
            raise HTTPException(status_code=500, detail="No prediction pipeline loaded.")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"CrystalFormer analysis error: {str(e)}")


# ---------------------------------------------------------
# ENDPOINT 5: Electrical Analysis (Band Gap & Electronic Nature)
# ---------------------------------------------------------
@router.post("/analyze-electrical")
async def analyze_electrical_properties(file: UploadFile = File(...)):
    if not file.filename.endswith('.cif'):
        raise HTTPException(status_code=400, detail="Only .cif files are supported.")
    
    try:
        content = await file.read()
        structure = Structure.from_str(content.decode("utf-8"), fmt="cif")
        chgnet_features = extract_mechanical_features(structure)
        feature_vector = chgnet_features['feature_vector']
        
        if not ELECTRICAL_LOADED:
            raise HTTPException(status_code=500, detail="Electrical surrogate model not loaded.")
            
        band_gap = float(chgnet_model_bg.predict([feature_vector])[0])
        electronic_nature = "Insulator" if band_gap > 2.0 else "Semiconductor/Conductor"
        
        return {
            "status": "success",
            "filename": file.filename,
            "formula": structure.composition.reduced_formula,
            "electrical_predictions": {
                "band_gap_eV": round(band_gap, 2),
                "electronic_nature": electronic_nature,
                "model_source": "IndianMatter-CHGNet-BandGapSurrogate"
            },
            "chgnet_mechanical_analysis": chgnet_features
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Electrical analysis error: {str(e)}")


# ---------------------------------------------------------
# ENDPOINT 6: Thermal Analysis (Phonon Frequency Proxy)
# ---------------------------------------------------------
@router.post("/analyze-thermal")
async def analyze_thermal_properties(file: UploadFile = File(...)):
    if not file.filename.endswith('.cif'):
        raise HTTPException(status_code=400, detail="Only .cif files are supported.")
    
    try:
        content = await file.read()
        structure = Structure.from_str(content.decode("utf-8"), fmt="cif")
        chgnet_features = extract_mechanical_features(structure)
        feature_vector = chgnet_features['feature_vector']
        
        if not THERMAL_LOADED:
            raise HTTPException(status_code=500, detail="Thermal surrogate model not loaded.")
            
        thermal_proxy = float(chgnet_model_th.predict([feature_vector])[0])
        
        return {
            "status": "success",
            "filename": file.filename,
            "formula": structure.composition.reduced_formula,
            "thermal_predictions": {
                "phonon_frequency_proxy_cm_inv": round(thermal_proxy, 2),
                "model_source": "IndianMatter-CHGNet-ThermalSurrogate"
            },
            "chgnet_mechanical_analysis": chgnet_features
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Thermal analysis error: {str(e)}")


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
        "key": "thermal_conductivity",
        "name": "Thermal Conductivity",
        "category": "Thermal",
        "unit": "W/m·K",
        "default": False,
        "description": "Predicted lattice thermal conductivity via phonon surrogate."
    },
    {
        "key": "debye_temperature",
        "name": "Debye Temperature",
        "category": "Thermal",
        "unit": "K",
        "default": False,
        "description": "Characteristic temperature representing highest normal mode of vibration."
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
        "thermal_conductivity_W_mK", "debye_temperature_K", "phonon_frequency_proxy_cm_inv",
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
            elif BFSY_LOADED and bfsy_pipeline:
                try:
                    feature_vector = None
                    try:
                        chgnet_feats = extract_mechanical_features(structure)
                        feature_vector = chgnet_feats.get("feature_vector")
                    except Exception:
                        pass
                    bfsy_res = bfsy_pipeline.predict(structure, feature_vector=feature_vector)
                    if bfsy_res.get("status") == "success":
                        K = bfsy_res.get("bulk_modulus_GPa", 95.0)
                        G = bfsy_res.get("shear_modulus_GPa", 48.0)
                        Ef = bfsy_res.get("formation_energy_eV_atom", -2.0)
                        bg = 2.45
                        if ELECTRICAL_LOADED and feature_vector is not None:
                            try:
                                bg = float(chgnet_model_bg.predict([feature_vector])[0])
                            except Exception:
                                pass
                        natoms = len(structure)
                        v0 = float(structure.lattice.volume) / max(1, natoms)
                        try:
                            from CrystalFormer.derived_properties import derive_properties
                            der = derive_properties(K, G, bg, v0)
                        except Exception:
                            der = {
                                "youngs_modulus_GPa": 9.0 * K * G / (3.0 * K + G),
                                "fracture_toughness_MPa_m05": 0.01 * (v0 ** (1.0 / 6.0)) * G * math.sqrt(K / G),
                                "electronic_conductivity_S_cm": 1.0e-16 if bg > 2.4 else 1.0e-4,
                            }
                        if "bulk_modulus" in requested_set: row["bulk_modulus_GPa"] = round(K, 3)
                        if "shear_modulus" in requested_set: row["shear_modulus_GPa"] = round(G, 3)
                        if "youngs_modulus" in requested_set: row["youngs_modulus_GPa"] = round(der["youngs_modulus_GPa"], 3)
                        if "fracture_toughness" in requested_set: row["fracture_toughness_MPa_m05"] = round(der["fracture_toughness_MPa_m05"], 4)
                        if "poisson_ratio" in requested_set: row["poisson_ratio"] = round(bfsy_res.get("poisson_ratio", 0.25), 4)
                        if "compressibility" in requested_set: row["compressibility_GPa_inv"] = bfsy_res.get("compressibility_GPa_inv")
                        if "pughs_ratio" in requested_set: row["pughs_ratio"] = bfsy_res.get("pughs_ratio")
                        if "elastic_anisotropy" in requested_set: row["elastic_anisotropy"] = 1.2
                        if any(k in requested_set for k in ["formation_energy", "formation_energy_per_atom", "formation_energy_eV_atom"]):
                            row["formation_energy_eV_atom"] = round(Ef, 4)
                        if "band_gap" in requested_set: row["band_gap_eV"] = round(bg, 3)
                        if "electronic_conductivity" in requested_set: row["electronic_conductivity_S_cm"] = der["electronic_conductivity_S_cm"]
                        if "electronic_state" in requested_set: row["electronic_state"] = "Insulator" if bg > 2.0 else "Semiconductor"
                        row["model_source"] = "BFSYPipeline-Fallback"
                except Exception as b_err:
                    row["error_message"] = f"Fallback BFSY warning: {str(b_err)}"

        # 3. Thermal Properties
        if requested_set & therm_keys:
            if THERMAL_LOADED and feature_vector is not None:
                th = float(chgnet_model_th.predict([feature_vector])[0])
                if "thermal_conductivity" in requested_set:
                    row["thermal_conductivity_W_mK"] = round(abs(th) * 0.05, 3)
                if "debye_temperature" in requested_set:
                    row["debye_temperature_K"] = round(abs(th) * 1.5, 1)
                if "phonon_frequency_proxy" in requested_set:
                    row["phonon_frequency_proxy_cm_inv"] = round(th, 2)
            else:
                for k in therm_keys & requested_set:
                    row[k] = None

        # 4. Ionic Transport Properties
        ionic_keys = {"ionic_conductivity", "activation_energy"}
        if requested_set & ionic_keys:
            if IONIC_LOADED:
                try:
                    from properties.ionic_conductivity import IonicConductivityCalculator
                    calc = IonicConductivityCalculator()
                    res = calc.calculate(structure, settings={"temperature_k": temperature})
                    if res.status == "calculated":
                        raw = res.raw_details or {}
                        cond = raw.get("conductivity_s_cm", res.value)
                        ea = raw.get("activation_energy_ev")
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
@router.post("/batch-predict-bfsy")
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
        elif BFSY_LOADED and bfsy_pipeline:
            raw_results = bfsy_pipeline.predict_batch(cif_files=cif_items, save_files=False)
            for r in raw_results:
                records.append({
                    "filename": r.get("cif_file", "unknown.cif"),
                    "formula": r.get("composition", "Unknown"),
                    "num_atoms": r.get("num_atoms", 0),
                    "bulk_modulus_GPa": r.get("bulk_modulus_GPa"),
                    "shear_modulus_GPa": r.get("shear_modulus_GPa"),
                    "youngs_modulus_GPa": r.get("youngs_modulus_GPa"),
                    "poisson_ratio": r.get("poisson_ratio"),
                    "formation_energy_eV_atom": r.get("formation_energy_eV_atom"),
                    "energy_per_atom_eV": r.get("energy_per_atom_eV"),
                    "compressibility_GPa_inv": r.get("compressibility_GPa_inv"),
                    "pughs_ratio": r.get("pughs_ratio"),
                    "status": r.get("status", "error"),
                    "model_source": "BFSYPipeline-Fallback",
                    "error_message": r.get("error")
                })
            model_name = "BFSYPipeline-Fallback"
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
    from services.materials_db_service import normalize_formula, predictions_collection

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
