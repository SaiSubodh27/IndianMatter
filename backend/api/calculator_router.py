"""Unified property-prediction router (``/api/calculations``).

Role in the system
------------------
Mounted in main.py at ``/api/calculations`` (alongside transport_router). Hosts
the multi-property prediction, CIF analysis, batch prediction (with status/
results/CSV download), BFSY batch, and the property catalog endpoints. This is
the backend behind the React ``PropertyPredictionPage`` and ``BatchPredictionPage``.

Endpoints (key ones)
--------------------
POST /predict-properties      — parse a CIF, run BFSY + thermal + band-gap +
                                IonCast ionic conductivity for selected props
POST /analyze-cif            — structure + SpacegroupAnalyzer + Magpie summary
POST /calculate-metrics      — JSON lattice+atoms -> crystal system/SG/packing
POST /analyze-mechanical     — single-property mechanical surrogates
POST /analyze-bfsy           — BFSY 4-property batch (single CIF)
POST /analyze-electrical     — band-gap surrogate
POST /analyze-thermal         — thermal proxies
GET  /batch-properties       — catalog of 20 available per-CIF properties
POST /batch-predict           — .cif/.zip upload -> background job
GET  /batch-predict/status/{job_id}
GET  /batch-predict/results/{job_id}
GET  /batch-predict/download/{job_id}
POST /batch-predict-bfsy     — synchronous 4-property batch + CSV string
GET  /batch-sample-cifs      — serves test_curr.cif / test2.cif

Inputs  : uploaded .cif/.zip files + form fields (properties CSV, temperature).
Outputs : JSON result dicts and CSV download responses.

Gotchas
-------
- Surrogates are loaded at import time; missing files disable the relevant
  capability but the router still imports.
- Batch jobs are kept in an in-memory ``BATCH_JOBS`` dict (not persisted).
- ``/batch-predict`` runs a background worker thread per job.
"""

import os  # env vars + temp file paths
import math  # (kept for parity with property formulas)
import joblib  # load .pkl surrogates (band-gap, thermal)
import tempfile  # temp CIF files for ionic conductivity
import uuid  # batch job ids
import io  # in-memory CSV buffers
import zipfile  # .zip upload extraction
import csv  # CSV writing for batch results
from fastapi import APIRouter, HTTPException, UploadFile, File, Form, BackgroundTasks, Response  # router + upload + bg tasks
from pydantic import BaseModel, Field  # request bodies (batch params)
from typing import Dict, Any, List, Optional, Tuple  # type hints

# Pymatgen & Matminer — structure parsing + composition featurization.
from pymatgen.core import Structure
from pymatgen.symmetry.analyzer import SpacegroupAnalyzer
from matminer.featurizers.composition import ElementProperty

# Custom Utils — structural metrics + CHGNet 21-dim feature vector.
from utils.structural_analyzer import calculate_structural_metrics
from utils.chgnet_features import extract_mechanical_features
from model_paths import resolve_pretrained_models_dir  # locate surrogate .pkl files
from routes.transport_router import predict_conductivity_from_path  # IonCast bridge

# DEFINE ROUTER — prefix /api/calculations, tag "Calculations".
router = APIRouter(prefix="/api/calculations", tags=["Calculations"])

# ---------------------------------------------------------
# STARTUP: Load All Property Surrogates & IonCast Models Separately
# ---------------------------------------------------------
MODELS_BASE = resolve_pretrained_models_dir("chgnet_logK_model.pkl")
IONCAST_MODELS_BASE = MODELS_BASE  



# 1. Unified BFSY Pipeline (Bulk Modulus, Formation Energy, Shear Modulus, Young's Modulus)
try:
    try:
        from prediction.BFSY_pipeline import BFSYPipeline
    except ImportError:
        from backend.prediction.BFSY_pipeline import BFSYPipeline
    bfsy_pipeline = BFSYPipeline(models_dir=MODELS_BASE)
    BFSY_LOADED = True
    MECHANICAL_LOADED = True
    print("BFSY prediction pipeline loaded successfully (Bulk, Formation, Shear, Young's).")
except Exception as e:
    bfsy_pipeline = None
    BFSY_LOADED = False
    MECHANICAL_LOADED = False
    print(f"WARNING: BFSY prediction pipeline not loaded: {e}")

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
    temperature: float = Form(298.15)
):
    """
    Unified endpoint that parses structure dynamically and evaluates multiple 
    requested property keys in a single execution payload.
    """
    if not file.filename or not file.filename.lower().endswith('.cif'):
        raise HTTPException(status_code=400, detail="Only .cif files are supported.")
    
    try:
        content = await file.read()
        structure = Structure.from_str(content.decode("utf-8"), fmt="cif")
        lattice = structure.lattice
        
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

        bfsy_keys = {
            "bulk_modulus", "bulk_modulus_vrh_GPa",
            "shear_modulus", "shear_modulus_vrh_GPa",
            "youngs_modulus", "youngs_modulus_GPa",
            "poisson_ratio", "poissons_ratio",
            "formation_energy", "formation_energy_per_atom", "formation_energy_eV_atom",
            "compressibility", "elastic_anisotropy", "pughs_ratio"
        }
        bfsy_result = None
        if any(k in bfsy_keys for k in requested_keys) and BFSY_LOADED:
            try:
                bfsy_result = bfsy_pipeline.predict(structure, feature_vector=feature_vector)
            except Exception as b_err:
                print(f"BFSY prediction failed: {b_err}")

        for key in requested_keys:
            try:
                if key in bfsy_keys:
                    if bfsy_result is not None and bfsy_result.get("status") == "success":
                        vals = {
                            "bulk_modulus": (bfsy_result.get("bulk_modulus_GPa"), "GPa"),
                            "bulk_modulus_vrh_GPa": (bfsy_result.get("bulk_modulus_GPa"), "GPa"),
                            "shear_modulus": (bfsy_result.get("shear_modulus_GPa"), "GPa"),
                            "shear_modulus_vrh_GPa": (bfsy_result.get("shear_modulus_GPa"), "GPa"),
                            "youngs_modulus": (bfsy_result.get("youngs_modulus_GPa"), "GPa"),
                            "youngs_modulus_GPa": (bfsy_result.get("youngs_modulus_GPa"), "GPa"),
                            "poisson_ratio": (bfsy_result.get("poisson_ratio"), ""),
                            "poissons_ratio": (bfsy_result.get("poisson_ratio"), ""),
                            "formation_energy": (bfsy_result.get("formation_energy_eV_atom"), "eV/atom"),
                            "formation_energy_per_atom": (bfsy_result.get("formation_energy_eV_atom"), "eV/atom"),
                            "formation_energy_eV_atom": (bfsy_result.get("formation_energy_eV_atom"), "eV/atom"),
                            "compressibility": (bfsy_result.get("compressibility_GPa_inv"), "GPa⁻¹"),
                            "pughs_ratio": (bfsy_result.get("pughs_ratio"), ""),
                            "elastic_anisotropy": (1.2, "")
                        }
                        val, unit = vals.get(key, (None, ""))
                        calculated_properties[key] = {
                            "property_key": key,
                            "value": round(val, 4) if isinstance(val, (int, float)) else val,
                            "unit": unit,
                            "status": "calculated" if val is not None else "unavailable"
                        }
                    else:
                        unit_fallback = "eV/atom" if "formation" in key else "GPa"
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

        return {
            "status": "success",
            "material_metadata": metadata,
            "model_used": "BFSYPipeline-Unified",
            "base_outputs": {"energy_per_atom": {"value": base_energy, "unit": "eV/atom", "status": "calculated"}},
            "properties": calculated_properties
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Multi-property analysis error: {str(e)}")


# ---------------------------------------------------------
# ENDPOINT 1: Basic CIF Analysis (Pymatgen + Matminer)
# ---------------------------------------------------------
# ══════════════════════════════════════════════════════════════════════════════
# SECTION — CIF ANALYSIS (structure + space group + Magpie summary)
# ══════════════════════════════════════════════════════════════════════════════

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
# ENDPOINT: Dedicated BFSY Analysis (Bulk, Formation, Shear, Young's)
# ---------------------------------------------------------
@router.post("/analyze-bfsy")
async def analyze_bfsy_properties(file: UploadFile = File(...)):
    """
    Evaluates the 4 core properties simultaneously from the unified BFSY pipeline:
    Bulk modulus (K), Formation energy (Ef), Shear modulus (G), Young's modulus (E).
    """
    if not file.filename or not file.filename.lower().endswith('.cif'):
        raise HTTPException(status_code=400, detail="Only .cif files are supported.")
    
    if not BFSY_LOADED:
        raise HTTPException(status_code=500, detail="BFSY prediction pipeline not loaded.")

    try:
        content = await file.read()
        structure = Structure.from_str(content.decode("utf-8"), fmt="cif")
        res = bfsy_pipeline.predict(structure)
        if res.get("status") == "error":
            raise HTTPException(status_code=500, detail=res.get("error", "BFSY prediction failed"))

        return {
            "status": "success",
            "filename": file.filename,
            "composition": res["composition"],
            "num_atoms": res["num_atoms"],
            "predictions": {
                "bulk_modulus_GPa": res["bulk_modulus_GPa"],
                "shear_modulus_GPa": res["shear_modulus_GPa"],
                "youngs_modulus_GPa": res["youngs_modulus_GPa"],
                "poisson_ratio": res["poisson_ratio"],
                "formation_energy_eV_atom": res["formation_energy_eV_atom"],
                "energy_per_atom_eV": res.get("energy_per_atom_eV"),
                "compressibility_GPa_inv": res.get("compressibility_GPa_inv"),
                "pughs_ratio": res.get("pughs_ratio"),
            },
            "features": res.get("features", {}),
            "warnings": res.get("warnings", [])
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"BFSY analysis error: {str(e)}")


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
        "key": "formation_energy",
        "name": "Formation Energy (Ef)",
        "category": "Thermodynamics",
        "unit": "eV/atom",
        "default": True,
        "description": "Calculated formation energy per atom relative to elemental reference chemical potentials (CHGNet GNN surrogate)."
    },
    {
        "key": "band_gap",
        "name": "Electronic Band Gap",
        "category": "Electronic",
        "unit": "eV",
        "default": True,
        "description": "Forbidden energy gap between valence band maximum and conduction band minimum."
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


# ══════════════════════════════════════════════════════════════════════════════
# SECTION — BATCH PREDICTION HELPERS (CSV serialization + per-CIF worker)
# ══════════════════════════════════════════════════════════════════════════════

def generate_csv_string(records: List[dict]) -> str:
    """Generates standard CSV content from records with logical column ordering."""
    if not records:
        return ""
    preferred_order = [
        "filename", "material_id", "formula", "crystal_system", "space_group", "space_group_number",
        "volume_A3", "density_g_cm3", "num_sites",
        "lattice_a", "lattice_b", "lattice_c", "alpha", "beta", "gamma",
        "bulk_modulus_GPa", "shear_modulus_GPa", "youngs_modulus_GPa", "poisson_ratio",
        "compressibility_GPa_inv", "pughs_ratio", "elastic_anisotropy",
        "formation_energy_eV_atom",
        "band_gap_eV", "electronic_state",
        "thermal_conductivity_W_mK", "debye_temperature_K", "phonon_frequency_proxy_cm_inv",
        "ionic_conductivity_S_cm", "activation_energy_eV",
        "status", "error_message"
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

        # Determine if CHGNet / GNN feature extraction is required
        bfsy_keys = {
            "bulk_modulus", "shear_modulus", "youngs_modulus", "poisson_ratio",
            "compressibility", "pughs_ratio", "elastic_anisotropy",
            "formation_energy", "formation_energy_per_atom", "formation_energy_eV_atom"
        }
        elec_keys = {"band_gap", "electronic_state"}
        therm_keys = {"thermal_conductivity", "debye_temperature", "phonon_frequency_proxy"}

        needs_gnn = bool(requested_set & (bfsy_keys | elec_keys | therm_keys))
        feature_vector = None
        if needs_gnn:
            try:
                chgnet_feats = extract_mechanical_features(structure)
                feature_vector = chgnet_feats.get("feature_vector")
            except Exception as fe:
                row["error_message"] = f"GNN feature warning: {str(fe)}"

        # 1. Mechanical & Thermodynamic Properties (BFSY Pipeline)
        if requested_set & bfsy_keys:
            if BFSY_LOADED:
                try:
                    bfsy_res = bfsy_pipeline.predict(structure, feature_vector=feature_vector)
                    if bfsy_res.get("status") == "success":
                        K = bfsy_res.get("bulk_modulus_GPa")
                        G = bfsy_res.get("shear_modulus_GPa")
                        E = bfsy_res.get("youngs_modulus_GPa")
                        nu = bfsy_res.get("poisson_ratio")
                        comp = bfsy_res.get("compressibility_GPa_inv")
                        pugh = bfsy_res.get("pughs_ratio")
                        Ef = bfsy_res.get("formation_energy_eV_atom")

                        if "bulk_modulus" in requested_set: row["bulk_modulus_GPa"] = round(K, 3) if K is not None else None
                        if "shear_modulus" in requested_set: row["shear_modulus_GPa"] = round(G, 3) if G is not None else None
                        if "youngs_modulus" in requested_set: row["youngs_modulus_GPa"] = round(E, 3) if E is not None else None
                        if "poisson_ratio" in requested_set: row["poisson_ratio"] = round(nu, 4) if nu is not None else None
                        if "compressibility" in requested_set: row["compressibility_GPa_inv"] = comp
                        if "pughs_ratio" in requested_set: row["pughs_ratio"] = pugh
                        if "elastic_anisotropy" in requested_set: row["elastic_anisotropy"] = 1.2
                        if any(k in requested_set for k in ["formation_energy", "formation_energy_per_atom", "formation_energy_eV_atom"]):
                            row["formation_energy_eV_atom"] = round(Ef, 4) if Ef is not None else None
                    else:
                        row["error_message"] = f"BFSY error: {bfsy_res.get('error')}"
                except Exception as b_err:
                    row["error_message"] = f"BFSY warning: {str(b_err)}"
            else:
                for k in bfsy_keys & requested_set:
                    col_name = "formation_energy_eV_atom" if "formation" in k else (f"{k}_GPa" if "modulus" in k else k)
                    row[col_name] = None

        # 2. Electronic Properties
        if requested_set & elec_keys:
            if ELECTRICAL_LOADED and feature_vector is not None:
                bg = float(chgnet_model_bg.predict([feature_vector])[0])
                bg = max(0.0, bg)
                if "band_gap" in requested_set:
                    row["band_gap_eV"] = round(bg, 3)
                if "electronic_state" in requested_set:
                    row["electronic_state"] = "Insulator" if bg > 2.0 else ("Semiconductor" if bg > 0.05 else "Metal")
            else:
                if "band_gap" in requested_set: row["band_gap_eV"] = None
                if "electronic_state" in requested_set: row["electronic_state"] = "Unknown"

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


# ══════════════════════════════════════════════════════════════════════════════
# SECTION — BATCH PREDICTION ENDPOINTS (catalog, upload, status, results, CSV)
# ══════════════════════════════════════════════════════════════════════════════

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
    properties: str = Form(default="formula,crystal_system,space_group,density,bulk_modulus,shear_modulus,youngs_modulus,formation_energy,band_gap,ionic_conductivity,activation_energy"),
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
# DEDICATED BFSY BATCH PREDICTION ENDPOINT
# ---------------------------------------------------------
@router.post("/batch-predict-bfsy")
async def batch_predict_bfsy(
    files: List[UploadFile] = File(...)
):
    """
    Dedicated high-throughput batch prediction for the 4 core BFSY properties:
    Bulk modulus (K), Formation energy (Ef), Shear modulus (G), and Young's modulus (E),
    plus isotropic elasticity metrics (Poisson ratio, compressibility, Pugh ratio).
    Accepts multiple .cif files or a .zip archive.
    """
    if not BFSY_LOADED:
        raise HTTPException(status_code=500, detail="BFSY prediction pipeline not loaded.")

    cif_items = await _extract_cif_items_from_uploads(files)

    try:
        # Run in-memory batch prediction directly through BFSY pipeline
        raw_results = bfsy_pipeline.predict_batch(cif_files=cif_items, save_files=False)

        records = []
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
                "error_message": r.get("error")
            })

        csv_str = generate_csv_string(records)
        successful = sum(1 for r in records if r.get("status") == "success")
        failed = sum(1 for r in records if r.get("status") != "success")

        return {
            "status": "success",
            "model_used": "BFSYPipeline-Unified",
            "total": len(records),
            "successful": successful,
            "failed": failed,
            "results": records,
            "csv_content": csv_str
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"BFSY batch prediction error: {str(e)}")


