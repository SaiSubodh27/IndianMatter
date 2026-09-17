from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional, Dict, Any
from pymatgen.core import Structure

# Import your calculators
from calculations.strain_response import run_strain_response_calculation
from properties.thermal_properties import ThermalPropertyCalculator
from properties.ionic_conductivity import IonicConductivityCalculator

router = APIRouter(prefix="/api/calculations", tags=["Calculations"])

class CalculationRequest(BaseModel):
    cif_string: str
    settings: Optional[Dict[str, Any]] = None

# Simple mock adapter for API demonstration
class APIModelAdapter:
    def __init__(self, name: str = "v5_base_model"):
        self.display_name = name

    def predict_structure(self, structure: Structure) -> dict:
        import numpy as np
        vol = structure.volume
        return {
            "energy_per_atom": -5.4 + 0.001 * (vol - 160.0)**2,
            "stress": np.diag([100.0, 100.0, 100.0])
        }

    def predict_ionic_transport(self, structure: Structure, temperature: float) -> dict:
        return {
            "activation_energy_ev": 0.38,
            "ionic_conductivity_ms_cm": 2.45
        }

@router.post("/mechanical")
def calculate_mechanical(payload: CalculationRequest):
    try:
        structure = Structure.from_str(payload.cif_string, fmt="cif")
        adapter = APIModelAdapter("CHGNet_Adapter")
        result = run_strain_response_calculation(adapter, structure, payload.settings)
        return result
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.post("/thermal")
def calculate_thermal(payload: CalculationRequest):
    try:
        structure = Structure.from_str(payload.cif_string, fmt="cif")
        adapter = APIModelAdapter("M3GNet_Adapter")
        calculator = ThermalPropertyCalculator()
        result = calculator.calculate(structure, adapter, payload.settings)
        return result.to_dict() if hasattr(result, "to_dict") else dict(result)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.post("/transport")
def calculate_transport(payload: CalculationRequest):
    try:
        structure = Structure.from_str(payload.cif_string, fmt="cif")
        adapter = APIModelAdapter("v5_base_model")
        calculator = IonicConductivityCalculator()
        result = calculator.calculate(structure, adapter, payload.settings)
        return result.to_dict() if hasattr(result, "to_dict") else dict(result)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))