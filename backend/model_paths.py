import os
from pathlib import Path


BACKEND_DIR = Path(__file__).resolve().parent
PROJECT_ROOT = BACKEND_DIR.parent


def resolve_pretrained_models_dir(required_filename: str = "v5_base_models.pkl") -> str:
    """Return the first pretrained_models directory containing the requested file."""
    env_dir = os.getenv("PRETRAINED_MODELS_DIR") or os.getenv("IONCAST_MODELS_DIR")
    candidate_dirs = []
    if env_dir:
        candidate_dirs.append(Path(env_dir))
    candidate_dirs.extend([
        Path("/models/ioncast"),
        PROJECT_ROOT / "property_prediction_models" / "pretrained_models",
        PROJECT_ROOT / "property_prediction_models" / "final_models",
        PROJECT_ROOT / "pretrained_models",
        BACKEND_DIR / "pretrained_models",
        PROJECT_ROOT / "final_models" / "pretrained_models",
        PROJECT_ROOT / "IonCastBackup" / "pretrained_models",
        BACKEND_DIR / "IonCastBackup" / "pretrained_models",
    ])

    for candidate in candidate_dirs:
        if (candidate / required_filename).exists():
            return str(candidate)

    # Fallback: Auto-download from Hugging Face Hub
    try:
        from huggingface_hub import hf_hub_download
        hf_repo = os.getenv("HF_MODEL_REPO_ID", "SaiSubodh/indianmatter-models")
        dest_dir = PROJECT_ROOT / "property_prediction_models" / "pretrained_models"
        dest_dir.mkdir(parents=True, exist_ok=True)
        hf_hub_download(
            repo_id=hf_repo,
            filename=f"ioncast/{required_filename}",
            local_dir=str(PROJECT_ROOT / "property_prediction_models"),
        )
        if (dest_dir / required_filename).exists():
            return str(dest_dir)
    except Exception:
        pass

    searched = os.linesep.join(f"  - {candidate}" for candidate in candidate_dirs)
    raise FileNotFoundError(
        f"Could not find {required_filename} in any known pretrained model directory:{os.linesep}{searched}"
    )
