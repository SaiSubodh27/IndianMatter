import os
from pathlib import Path


BACKEND_DIR = Path(__file__).resolve().parent
PROJECT_ROOT = BACKEND_DIR.parent


def resolve_pretrained_models_dir(required_filename: str = "v5_base_models.pkl") -> str:
    """Return the first pretrained_models directory containing the requested file."""
    candidate_dirs = [
        PROJECT_ROOT / "pretrained_models",
        BACKEND_DIR / "pretrained_models",
        PROJECT_ROOT / "final_models" / "pretrained_models",
        PROJECT_ROOT / "IonCastBackup" / "pretrained_models",
        BACKEND_DIR / "IonCastBackup" / "pretrained_models",
    ]

    for candidate in candidate_dirs:
        if (candidate / required_filename).exists():
            return str(candidate)

    searched = os.linesep.join(f"  - {candidate}" for candidate in candidate_dirs)
    raise FileNotFoundError(
        f"Could not find {required_filename} in any known pretrained model directory:{os.linesep}{searched}"
    )
