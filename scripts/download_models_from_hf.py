#!/usr/bin/env python3
"""
download_models_from_hf.py
==========================
Utility script to download IndianMatter model checkpoints from Hugging Face Hub.
"""

import os
import sys
from pathlib import Path

def download_models(target_dir: str = None, repo_id: str = "SaiSubodh/indianmatter-models"):
    try:
        from huggingface_hub import snapshot_download
    except ImportError:
        print("Error: huggingface_hub is required. Install via: pip install huggingface_hub")
        return 1

    if target_dir is None:
        project_root = Path(__file__).resolve().parent.parent
        target_dir = project_root / "property_prediction_models" / "hf_weights"
    else:
        target_dir = Path(target_dir)

    target_dir.mkdir(parents=True, exist_ok=True)
    token = os.getenv("HF_TOKEN") or os.getenv("HUGGINGFACE_HUB_TOKEN")

    print(f"Downloading model checkpoints from {repo_id}...")
    print(f"Destination: {target_dir}")

    path = snapshot_download(
        repo_id=repo_id,
        local_dir=str(target_dir),
        token=token
    )

    print(f"Successfully downloaded all models to: {path}")
    return 0

if __name__ == "__main__":
    dest = sys.argv[1] if len(sys.argv) > 1 else None
    sys.exit(download_models(dest))
