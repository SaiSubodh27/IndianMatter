"""
config.py
=========
Configuration settings for the IndianMaterialsAI Standalone Inference Service.
"""

import os
from pathlib import Path
from dotenv import load_dotenv

load_dotenv()

INFERENCE_SERVICE_DIR = Path(__file__).resolve().parent
PROJECT_ROOT = INFERENCE_SERVICE_DIR.parent

HOST = os.getenv("INFERENCE_HOST", "0.0.0.0")
PORT = int(os.getenv("INFERENCE_PORT", "8001"))
INTERNAL_SERVICE_KEY = os.getenv("INTERNAL_SERVICE_SECRET", "indianmatter-internal-secret-token")
DEVICE_OVERRIDE = os.getenv("COMPUTE_DEVICE", "auto") # auto, cuda, cpu

# Artifact / weights path locations
PROPERTY_MODELS_DIR = PROJECT_ROOT / "property_prediction_models"
CIF_GENERATOR_DIR = PROJECT_ROOT / "cif_generator"
