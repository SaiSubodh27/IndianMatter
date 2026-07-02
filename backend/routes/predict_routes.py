import os
import shutil
import numpy as np
from fastapi import APIRouter, File, UploadFile, HTTPException, Form
from typing import Optional
from datetime import datetime

from model_service import predict_from_cif

router = APIRouter()

TEMP_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "temp_files")

@router.post("/predict")
async def run_predict(
    file: UploadFile = File(...),
    temperature: float = Form(298.0),
    material_id: Optional[str] = Form(None),
    material_name: Optional[str] = Form(None)
):
    """
    Trial Mode Prediction Endpoint with Extended Input Support
    
    Accepts:
    - file: CIF crystallographic file (required)
    - temperature: Analysis temperature in Kelvin (default: 298.0 K)
    - material_id: Optional custom material identifier
    - material_name: Optional custom material name
    
    Returns:
    - Activation Energy (Ea) in eV
    - Pre-exponential factor (logA)
    - Ionic Conductivity in S/cm
    - Chemical Composition (automatically extracted)
    - Material Classification (crystal system type)
    - HES Score and Rating
    """
    # Validate file extension
    if not file.filename.endswith(".cif"):
        raise HTTPException(
            status_code=400, 
            detail="Invalid file format. Only .cif (Crystallographic Information File) files are allowed."
        )
    
    # Validate temperature
    if temperature < 0 or temperature > 2000:
        raise HTTPException(
            status_code=422,
            detail="Temperature must be between 0 K and 2000 K"
        )
    
    # Ensure temporary directory exists
    os.makedirs(TEMP_DIR, exist_ok=True)
    
    file_path = os.path.join(TEMP_DIR, file.filename)
    
    try:
        # Save uploaded file
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
        
        # Get predictions from model
        prediction_result = predict_from_cif(
            file_path, 
            temperature=temperature
        )
        
        # Format response with structured output
        formatted_response = {
            "status": prediction_result.get("status", "success"),
            "timestamp": datetime.utcnow().isoformat(),
            "input_parameters": {
                "temperature_k": temperature,
                "cif_file": file.filename,
                "material_id": material_id or "auto",
                "material_name": material_name or file.filename.split('.')[0]
            },
            "material_properties": {
                "chemical_composition": {
                    "formula": prediction_result.get("composition", "Unknown"),
                    "source": "CIF file analysis"
                },
                "material_classification": {
                    "crystal_system": prediction_result.get("classification", "Unknown"),
                    "crystal_type": prediction_result.get("classification", "Unknown"),
                    "detailed": prediction_result.get("classification_detailed", {
                        "crystal_system": "Unknown",
                        "material_type": "Unknown",
                        "ion_conductor_type": "Unknown"
                    })
                },
                "structural_details": prediction_result.get("detailed_structure", {
                    "space_group": "Unknown",
                    "density": 0.0,
                    "volume": 0.0,
                    "elements": [],
                    "lattice": {
                        "a": 0.0, "b": 0.0, "c": 0.0,
                        "alpha": 0.0, "beta": 0.0, "gamma": 0.0
                    }
                })
            },
            "predicted_properties": {
                "activation_energy": {
                    "value_ev": prediction_result.get("Ea", 0),
                    "unit": "eV",
                    "description": "Activation energy for ion migration"
                },
                "pre_exponential_factor": {
                    "log10_value": prediction_result.get("logA", 0),
                    "value": 10 ** prediction_result.get("logA", 0),
                    "unit": "S/cm (estimated)",
                    "description": "Pre-exponential factor A from Arrhenius equation"
                },
                "ionic_conductivity": {
                    "value_s_cm": prediction_result.get("conductivity", 0),
                    "log10_value": float(f"{np.log10(prediction_result.get('conductivity', 1e-10)) if prediction_result.get('conductivity', 0) > 0 else -10:.2f}"),
                    "unit": "S/cm",
                    "temperature_k": temperature,
                    "description": "Ionic conductivity calculated using Arrhenius equation"
                }
            },
            "scoring": {
                "hes_score": prediction_result.get("hes_score", 0),
                "hes_rating": prediction_result.get("hes_rating", "Unknown"),
                "model_source": prediction_result.get("source", "v6_corrector_model")
            },
            "error": prediction_result.get("error") if prediction_result.get("status") != "success" else None
        }
        
        return formatted_response
        
    except ValueError as val_err:
        raise HTTPException(status_code=422, detail=f"Validation error: {str(val_err)}")
    except Exception as err:
        raise HTTPException(
            status_code=500, 
            detail=f"Processing error: {str(err)}"
        )
    finally:
        # Cleanup temporary file
        if os.path.exists(file_path):
            os.remove(file_path)


@router.get("/predict/info")
async def get_predict_info():
    """
    Get information about the prediction API
    """
    return {
        "endpoint": "/api/ml/predict",
        "method": "POST",
        "description": "Predict ionic conductivity and material properties from CIF files",
        "model_info": {
            "model_name": "v6_corrector_model",
            "features": 81,
            "input_type": "Crystal structure (CIF format)",
            "output_type": "Ionic conductivity & material properties"
        },
        "parameters": {
            "file": {
                "type": "file",
                "required": True,
                "description": "Crystallographic Information File (.cif)",
                "example": "Li2O.cif"
            },
            "temperature": {
                "type": "float",
                "required": False,
                "default": 298.0,
                "min": 0,
                "max": 2000,
                "unit": "Kelvin",
                "description": "Analysis temperature"
            },
            "material_id": {
                "type": "string",
                "required": False,
                "description": "Optional custom identifier for the material"
            },
            "material_name": {
                "type": "string",
                "required": False,
                "description": "Optional custom name for the material"
            }
        },
        "response_fields": {
            "chemical_composition": "Extracted chemical formula from structure",
            "material_classification": "Crystal system type (e.g., cubic, tetragonal)",
            "activation_energy": "Migration barrier energy in eV",
            "ionic_conductivity": "Predicted conductivity in S/cm",
            "hes_score": "Material stability score (0-100)"
        }
    }
