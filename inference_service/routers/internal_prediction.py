"""
internal_prediction.py
======================
Internal prediction endpoints for the Standalone Inference Service.
Protected by X-Internal-Service-Key.
"""

import logging
from fastapi import APIRouter, Depends, HTTPException, status
from inference_service.security import verify_internal_service_key
from inference_service.schemas import (
    PropertyPredictionRequest,
    PropertyPredictionResponse,
    IonicTransportRequest,
    IonicTransportResponse,
    CifGenerationRequest,
    CifGenerationResponse,
    StructureAnalysisRequest,
    StructureAnalysisResponse,
    CrystalFormerPredictionRequest,
    CrystalFormerPredictionResponse,
)
from inference_service.model_manager import model_manager

log = logging.getLogger("inference_service.internal_prediction")

router = APIRouter(
    prefix="/internal/v1",
    tags=["Internal ML Inference"],
    dependencies=[Depends(verify_internal_service_key)],
)


@router.post("/predict-properties", response_model=PropertyPredictionResponse)
def predict_properties(req: PropertyPredictionRequest):
    """
    Evaluates physical, elastic, electronic, thermodynamic and transport properties
    using CrystalFormer, CHGNet, IonCast and Pymatgen.
    """
    try:
        result = model_manager.predict_properties(
            cif_text=req.cif_text,
            properties=req.properties,
            temperature=req.temperature,
            formula=req.formula,
        )
        return result
    except ValueError as ve:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=f"Invalid CIF or parameters: {ve}")
    except Exception as e:
        log.exception(f"Prediction failed: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Inference execution error: {str(e)}",
        )


@router.post("/predict-ionic-transport", response_model=IonicTransportResponse)
def predict_ionic_transport(req: IonicTransportRequest):
    """
    Predicts room-temperature ionic conductivity and activation energy (Ea)
    using the IonCast ML ensemble.
    """
    try:
        result = model_manager.predict_ionic_transport(
            cif_text=req.cif_text,
            temperature=req.temperature,
        )
        return result
    except Exception as e:
        log.exception(f"Ionic transport inference error: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"IonCast execution error: {str(e)}",
        )


@router.post("/predict-crystalformer", response_model=CrystalFormerPredictionResponse)
def predict_crystalformer(req: CrystalFormerPredictionRequest):
    """
    Dedicated CrystalFormer deep graph neural network prediction endpoint.
    """
    try:
        result = model_manager.predict_crystalformer(
            cif_text=req.cif_text,
            temperature_k=req.temperature_k,
            compute_ehull=req.compute_ehull,
        )
        return result
    except Exception as e:
        log.exception(f"CrystalFormer inference error: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"CrystalFormer execution error: {str(e)}",
        )


@router.post("/generate-cif", response_model=CifGenerationResponse)
def generate_cif(req: CifGenerationRequest):
    """
    Generative AI crystal structure synthesis from chemical formula.
    """
    try:
        result = model_manager.generate_cif(
            formula=req.formula,
            max_iterations=req.max_iterations,
            samples_per_iteration=req.samples_per_iteration,
        )
        return result
    except Exception as e:
        log.exception(f"CIF generation error: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"CIF generator error: {str(e)}",
        )


@router.post("/analyze-structure", response_model=StructureAnalysisResponse)
def analyze_structure(req: StructureAnalysisRequest):
    """
    Extracts geometric, lattice, and symmetry parameters from a CIF file.
    """
    try:
        result = model_manager.analyze_structure(req.cif_text)
        return result
    except Exception as e:
        log.exception(f"Structure analysis error: {e}")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Could not parse structure: {str(e)}",
        )
