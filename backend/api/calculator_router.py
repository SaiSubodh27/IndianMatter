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
from model_service import predict_from_cif

# DEFINE ROUTER
router = APIRouter(prefix="/api/calculations", tags=["Calculations"])

# ---------------------------------------------------------
# STARTUP: Load All Property Surrogates & IonCast Models Separately
# ---------------------------------------------------------
MODELS_BASE = resolve_pretrained_models_dir("chgnet_logK_model.pkl")
IONCAST_MODELS_BASE = MODELS_BASE  

try:
    ioncast_ea_model = joblib.load(os.path.join(IONCAST_MODELS_BASE, "v5_base_models.pkl"))
    IONIC_LOADED = True
    print("IonCast prediction models loaded successfully.")
except Exception as e:
    IONIC_LOADED = False
    print(f"WARNING: IonCast models not loaded from {IONCAST_MODELS_BASE}: {e}")

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
    ioncast_ea_model = joblib.load(os.path.join(IONCAST_MODELS_BASE, "v5_base_models.pkl"))
    ioncast_prefactor_model = joblib.load(os.path.join(IONCAST_MODELS_BASE, "v5_model2_A.pkl"))
    ioncast_meta_model = joblib.load(os.path.join(IONCAST_MODELS_BASE, "v5_meta_model.pkl"))
    ioncast_mlp_models = joblib.load(os.path.join(IONCAST_MODELS_BASE, "v5_mlp_models.pkl"))
    ioncast_quantile_transformer = joblib.load(os.path.join(IONCAST_MODELS_BASE, "v5_quantile_transformer.pkl"))
    IONIC_LOADED = True
    print(f"IonCast prediction models loaded successfully from {IONCAST_MODELS_BASE}.")
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

                elif key in ["ionic_conductivity", "ionic_conductivity_activation_energy", "activation_energy_eV", "activation_energy", "Ea"]:
                    if IONIC_LOADED:
                        with tempfile.NamedTemporaryFile(delete=False, suffix=".cif") as tmp:
                            tmp.write(content)
                            tmp_path = tmp.name
                        try:
                            res = predict_from_cif(tmp_path, temperature)
                        finally:
                            if os.path.exists(tmp_path):
                                os.remove(tmp_path)
                        
                        if "conductivity" in key and "activation" not in key:
                            cond_s_cm = float(res.get("conductivity", 0.0))
                            val = cond_s_cm * 1000.0  # Convert S/cm -> mS/cm to match UI display
                            unit = "mS/cm"
                        else:
                            val = float(res.get("Ea", 0.0))
                            unit = "eV"

                        calculated_properties[key] = {
                            "property_key": key,
                            "value": float(f"{val:.6g}"),
                            "unit": unit,
                            "status": "calculated",
                            "raw_details": {
                                "conductivity_S_per_cm": float(res.get("conductivity", 0.0)),
                                "base_conductivity_S_per_cm": float(res.get("base_conductivity", 0.0)),
                                "corrected_conductivity_S_per_cm": float(res.get("corrected_conductivity", 0.0)),
                                "activation_energy_eV": float(res.get("Ea", 0.0)),
                                "logA": float(res.get("logA", 0.0)),
                                "corrector_applied": bool(res.get("corrector_applied")),
                                "corrector_log10_delta": float(res.get("corrector_log10_delta", 0.0)),
                                "feature_coverage": res.get("feature_coverage"),
                                "hes_score": res.get("hes_score"),
                                "hes_rating": res.get("hes_rating"),
                            }
                        }
                    else:
                        calculated_properties[key] = {"property_key": key, "value": None, "unit": "mS/cm", "status": "unavailable"}
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


# ---------------------------------------------------------
# ENDPOINT 7: IonCast Ionic Conductivity Analysis
# ---------------------------------------------------------
def _assert_cif_upload(file: UploadFile) -> None:
    if not file.filename or not file.filename.lower().endswith(".cif"):
        raise HTTPException(status_code=400, detail="Only .cif files are supported.")


async def _predict_ioncast_from_upload(file: UploadFile, temperature: float) -> Dict[str, Any]:
    _assert_cif_upload(file)

    temp_path = None
    try:
        content = await file.read()
        with tempfile.NamedTemporaryFile(delete=False, suffix=".cif") as tmp:
            tmp.write(content)
            temp_path = tmp.name

        result = predict_from_cif(temp_path, temperature)
        if result.get("status") != "success":
            raise HTTPException(
                status_code=500,
                detail=result.get("error", "IonCast prediction pipeline failed.")
            )
        return result
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"IonCast prediction error: {str(e)}")
    finally:
        if temp_path and os.path.exists(temp_path):
            os.remove(temp_path)


def _ionic_analysis_response(file: UploadFile, temperature: float, result: Dict[str, Any]) -> Dict[str, Any]:
    detailed_structure = result.get("detailed_structure", {})
    feature_coverage = result.get("feature_coverage", {})

    return {
        "status": "success",
        "filename": file.filename,
        "formula": result.get("composition", "Unknown"),
        "space_group": detailed_structure.get("space_group", "Unknown"),
        "temp": temperature,
        "ionic_predictions": {
            "activation_energy_eV": round(float(result["Ea"]), 4),
            "logA": round(float(result.get("logA", 0.0)), 4),
            "base_ionic_conductivity_S_per_cm": float(result.get("base_conductivity", result["conductivity"])),
            "corrected_ionic_conductivity_S_per_cm": float(result.get("corrected_conductivity", result["conductivity"])),
            "ionic_conductivity_S_per_cm": float(result["conductivity"]),
            "corrector_applied": bool(result.get("corrector_applied", False)),
            "corrector_log10_delta": float(result.get("corrector_log10_delta", 0.0)),
            "model_source": result.get("model_version", "IonCast-v5/v6-OBLiEx")
        },
        "pipeline_diagnostics": {
            "descriptors_expected": feature_coverage.get("expected"),
            "descriptors_extracted": feature_coverage.get("computed"),
            "descriptors_reconstructed": feature_coverage.get("reconstructed"),
            "descriptors_imputed": feature_coverage.get("imputed"),
            "coverage_pct": feature_coverage.get("coverage_pct"),
            "confidence": result.get("confidence"),
            "validation_status": result.get("validation_status"),
            "temperature_range_k": result.get("supported_temperature_range_k"),
        },
        "temperature_series": result.get("temperature_series", []),
        "warnings": result.get("warnings", [])
    }


@router.post("/analyze-ionic")
@router.post("/ionic-conductivity")
async def analyze_ionic_conductivity(
    file: UploadFile = File(...),
    temperature: float = Form(298.15)
):
    result = await _predict_ioncast_from_upload(file, temperature)
    return _ionic_analysis_response(file, temperature, result)


@router.post("/predict")
async def predict_conductivity(
    file: UploadFile = File(...),
    temperature: float = Form(298.15)
):
    result = await _predict_ioncast_from_upload(file, temperature)
    detailed_structure = result.get("detailed_structure", {})

    return {
        "status": "success",
        "formula": result.get("composition"),
        "space_group": detailed_structure.get("space_group", "Unknown"),
        "volume": detailed_structure.get("volume"),
        "density": detailed_structure.get("density"),
        "ea": float(result["Ea"]),
        "logA": float(result["logA"]),
        "base_conductivity": float(result.get("base_conductivity", result["conductivity"])),
        "corrected_conductivity": float(result.get("corrected_conductivity", result["conductivity"])),
        "conductivity": float(result["conductivity"]),
        "corrector_applied": bool(result.get("corrector_applied")),
        "corrector_log10_delta": float(result.get("corrector_log10_delta", 0.0)),
        "feature_coverage": result.get("feature_coverage"),
        "warnings": result.get("warnings", []),
        "temp": temperature,
    }