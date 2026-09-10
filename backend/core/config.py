import os
from pydantic_settings import BaseSettings

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
