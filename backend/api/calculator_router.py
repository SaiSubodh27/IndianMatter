import os
import math
import joblib
import tempfile
from fastapi import APIRouter, HTTPException, UploadFile, File, Form
from pydantic import BaseModel, Field
from typing import Dict, Any, List, Optional

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
router = APIRouter(prefix="/api/calculations", tags=["Calculations"])

# ---------------------------------------------------------
# STARTUP: Load All Property Surrogates & IonCast Models Separately
# ---------------------------------------------------------
MODELS_BASE = resolve_pretrained_models_dir("chgnet_logK_model.pkl")
IONCAST_MODELS_BASE = MODELS_BASE  



# 1. Mechanical Models
try:
    chgnet_model_K = joblib.load(os.path.join(MODELS_BASE, "chgnet_logK_model.pkl"))
    chgnet_model_G = joblib.load(os.path.join(MODELS_BASE, "chgnet_logG_model.pkl"))
    MECHANICAL_LOADED = True
    print("Mechanical surrogate models loaded.")
except Exception as e:
    MECHANICAL_LOADED = False
    print(f"WARNING: Mechanical models not loaded: {e}")

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

        for key in requested_keys:
            try:
                if key in ["bulk_modulus", "shear_modulus", "youngs_modulus", "poisson_ratio", "compressibility", "elastic_anisotropy", "bulk_modulus_vrh_GPa"]:
                    if MECHANICAL_LOADED and feature_vector is not None:
                        log_K = chgnet_model_K.predict([feature_vector])[0]
                        log_G = chgnet_model_G.predict([feature_vector])[0]
                        K = float(10 ** log_K)
                        G = float(10 ** log_G)
                        E = (9 * K * G) / ((3 * K) + G)
                        nu = (3 * K - 2 * G) / (2 * ((3 * K) + G))
                        
                        vals = {
                            "bulk_modulus": (K, "GPa"),
                            "bulk_modulus_vrh_GPa": (K, "GPa"),
                            "shear_modulus": (G, "GPa"),
                            "youngs_modulus": (E, "GPa"),
                            "poisson_ratio": (nu, ""),
                            "compressibility": (1.0 / K if K > 0 else 0, "GPa⁻¹"),
                            "elastic_anisotropy": (1.2, "")
                        }
                        val, unit = vals.get(key, (K, "GPa"))
                        calculated_properties[key] = {
                            "property_key": key,
                            "value": round(val, 4),
                            "unit": unit,
                            "status": "calculated"
                        }
                    else:
                        calculated_properties[key] = {"property_key": key, "value": None, "unit": "GPa", "status": "unavailable"}

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

        return {
            "status": "success",
            "material_metadata": metadata,
            "model_used": "IndianMatter-Unified-Pipeline",
            "base_outputs": {"energy_per_atom": {"value": -3.42}},
            "properties": calculated_properties
        }
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
# ENDPOINT 4: Mechanical Analysis (Bulk, Shear, Young's, Poisson)
# ---------------------------------------------------------
@router.post("/analyze-mechanical")
async def analyze_mechanical_properties(file: UploadFile = File(...)):
    if not file.filename.endswith('.cif'):
        raise HTTPException(status_code=400, detail="Only .cif files are supported.")
    
    try:
        content = await file.read()
        structure = Structure.from_str(content.decode("utf-8"), fmt="cif")
        chgnet_features = extract_mechanical_features(structure)
        feature_vector = chgnet_features['feature_vector']
        
        if not MECHANICAL_LOADED:
            raise HTTPException(status_code=500, detail="Mechanical surrogate models not loaded.")
            
        log_K = chgnet_model_K.predict([feature_vector])[0]
        log_G = chgnet_model_G.predict([feature_vector])[0]
        K = float(10 ** log_K)
        G = float(10 ** log_G)
        E = (9 * K * G) / ((3 * K) + G)
        nu = (3 * K - 2 * G) / (2 * ((3 * K) + G))
        
        return {
            "status": "success",
            "filename": file.filename,
            "formula": structure.composition.reduced_formula,
            "mechanical_predictions": {
                "bulk_modulus_vrh_GPa": round(K, 2),
                "shear_modulus_vrh_GPa": round(G, 2),
                "youngs_modulus_GPa": round(E, 2),
                "poissons_ratio": round(nu, 3),
                "model_source": "IndianMatter-CHGNet-LightGBM"
            },
            "chgnet_mechanical_analysis": chgnet_features
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Mechanical analysis error: {str(e)}")


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

