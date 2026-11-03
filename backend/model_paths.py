"""Resolver for the on-disk surrogate-model directory.

Role in the system
------------------
The IonCast v5/v6 stack and the CHGNet mechanical/thermal/band-gap
surrogates are persisted as joblib ``.pkl`` files in a ``pretrained_models/``
folder. Different deployments put that folder in different places (repo root,
inside ``backend/``, under ``final_models/`` or ``IonCastBackup/``), so this
module provides a single canonical lookup. ``backend/api/calculator_router.py``,
``backend/routes/transport_router.py`` and ``backend/model_service.py`` all call
``resolve_pretrained_models_dir(...)`` at import time, so a missing directory
fails fast with a clear error rather than a confusing KeyError later.

Inputs  : required_filename (default ``v5_base_models.pkl``) used as the
          presence marker for a valid directory.
Outputs : absolute-ish path string of the first candidate directory that
          actually contains the requested file.
"""

import os  # only needed for os.linesep in the error message
from pathlib import Path  # cross-platform path handling

# The directory containing this file (backend/).
BACKEND_DIR = Path(__file__).resolve().parent
# One level above backend/ — the project root.
PROJECT_ROOT = BACKEND_DIR.parent


def resolve_pretrained_models_dir(required_filename: str = "v5_base_models.pkl") -> str:
    """Return the first ``pretrained_models`` directory containing the requested file.

    The candidate list is ordered from most-likely (repo root) to legacy
    fallbacks (IonCastBackup). The first directory that actually has the
    marker file wins, which lets the same code run on a dev checkout and on
    a packaged deployment without changes.

    Raises:
        FileNotFoundError: if none of the candidate directories contains the
        requested marker file — the error message lists every path tried.
    """
    # Ordered search list: root first, then backend/, then packaged/legacy.
    candidate_dirs = [
        PROJECT_ROOT / "pretrained_models",
        BACKEND_DIR / "pretrained_models",
        PROJECT_ROOT / "final_models" / "pretrained_models",
        PROJECT_ROOT / "IonCastBackup" / "pretrained_models",
        BACKEND_DIR / "IonCastBackup" / "pretrained_models",
    ]

    # Return the first directory that actually contains the marker file.
    for candidate in candidate_dirs:
        if (candidate / required_filename).exists():
            return str(candidate)

    # None matched — build a readable multi-line error listing every path tried.
    searched = os.linesep.join(f"  - {candidate}" for candidate in candidate_dirs)
    raise FileNotFoundError(
        f"Could not find {required_filename} in any known pretrained model directory:{os.linesep}{searched}"
    )
