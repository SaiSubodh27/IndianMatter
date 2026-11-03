"""Pydantic-settings configuration for the (unwired) prediction pipeline.

Role in the system
------------------
Provides ``PredictionSettings`` read from env vars prefixed ``PREDICTION_``
(MAX_CSV_ROWS, MAX_UPLOAD_SIZE_MB, DEFAULT_DEVICE, TEMP_DIR, RESULTS_DIR).
Used by the unwired ``/api/materials-prediction`` pipeline (services/
prediction_service.py, workers/prediction_worker.py). Instantiated once at
import time as ``settings``; creates TEMP_DIR and RESULTS_DIR on import.
"""

import os  # directory creation + path joins
from pydantic_settings import BaseSettings  # env-backed settings base class

class PredictionSettings(BaseSettings):
    MAX_CSV_ROWS: int = 100
    MAX_UPLOAD_SIZE_MB: int = 25
    DEFAULT_DEVICE: str = "auto"  # 'auto', 'cpu', 'cuda', 'cuda:0'
    TEMP_DIR: str = os.path.join(os.path.dirname(__file__), "..", "temp_files")
    RESULTS_DIR: str = os.path.join(os.path.dirname(__file__), "..", "prediction_results")

    class Config:
        env_prefix = "PREDICTION_"

settings = PredictionSettings()
os.makedirs(settings.TEMP_DIR, exist_ok=True)
os.makedirs(settings.RESULTS_DIR, exist_ok=True)
