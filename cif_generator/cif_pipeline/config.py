"""
Centralized config loading from .env file.
All external credentials and model paths are read here once,
so no module needs to know about dotenv or environment variables directly.
"""

from __future__ import annotations
import os
from pathlib import Path
from dotenv import load_dotenv

# Load .env from project root (two levels up from this file, or cwd)
_project_root = Path(__file__).resolve().parent.parent
_repo_root = _project_root.parent
_env_path = _project_root / ".env"
if _env_path.exists():
    load_dotenv(_env_path)
else:
    load_dotenv()  # fallback: look in cwd


def get_mp_api_key() -> str:
    key = os.getenv("MP_API_KEY", "")
    if not key:
        import logging
        logging.getLogger("cif_pipeline.config").warning(
            "MP_API_KEY not set in .env — Materials Project searches will return no results"
        )
    return key


def get_mace_model() -> str:
    env_val = os.getenv("MACE_MODEL", "")
    if env_val:
        return env_val
    for candidate in [
        Path("/models/mace/20231203mace128L1_epoch199model"),
        _repo_root / "property_prediction_models" / "final_models" / "mace_weights" / "20231203mace128L1_epoch199model",
    ]:
        if candidate.exists():
            return str(candidate)
    return "medium"


def get_mace_device() -> str:
    return os.getenv("MACE_DEVICE", "cpu")


def get_crystallm_checkpoint() -> str:
    env_val = os.getenv("CRYSTALLM_CHECKPOINT_PATH", "")
    if env_val:
        return env_val
    for candidate in [
        Path("/models/crystallm/crystallm_v1_small"),
        _repo_root / "property_prediction_models" / "crystallm_weights" / "crystallm_v1_small",
    ]:
        if (candidate / "ckpt.pt").exists():
            return str(candidate)
    return ""
