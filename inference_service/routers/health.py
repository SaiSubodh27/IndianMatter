"""
health.py
=========
Health and readiness endpoints for the Inference API service.
"""

from fastapi import APIRouter
from inference_service.model_manager import model_manager

router = APIRouter(tags=["Health & Diagnostics"])


@router.get("/health")
def health_check():
    """Liveness probe: verifies that the inference API server is up and accepting connections."""
    return {
        "status": "healthy",
        "service": "IndianMaterialsAI Inference API",
        "version": "1.0.0",
        "port": 8001,
    }


@router.get("/ready")
def readiness_check():
    """Readiness probe: verifies whether model checkpoints are loaded and device is initialized."""
    readiness = model_manager.get_readiness_status()
    return readiness
