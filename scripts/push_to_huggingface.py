"""
Hugging Face Model Uploader for IndianMatter / Property Prediction Models
========================================================================
Uploads local model checkpoints (CHGNet, M3GNet, MACE, CrystalFormer) to Hugging Face Hub.

Usage:
  python scripts/push_to_huggingface.py --repo-id <username>/<model-name> [--token <hf_token>] [--private]
"""

import os
import sys
import argparse
from pathlib import Path

def create_model_card(repo_id: str) -> str:
    return f"""---
license: mit
tags:
  - materials-science
  - crystal-structure
  - chgnet
  - m3gnet
  - mace
  - crystalformer
  - property-prediction
pipeline_tag: feature-extraction
---

# {repo_id}

This repository contains trained weights and checkpoints for crystal structure property prediction and relaxation:

## Contained Models & Weights

1. **CHGNet** (`final_models/chgnet_weights/`):
   - `chgnet_model.pt`: Pretrained Crystal Hamiltonian Graph Neural Network weights.
2. **M3GNet** (`final_models/m3gnet_weights/`):
   - `model.pt`, `model.json`, `state.pt`: Pretrained Materials 3-body Graph Network.
3. **MACE** (`final_models/mace_weights/`):
   - `20231203mace128L1_epoch199model`: Higher-order equivariant message passing potential.
4. **CrystalFormer** (`CrystalFormer/weights/`):
   - `jarvis_ehull.ckpt`, `jarvis_formation_energy.ckpt`, `jarvis_mbj_bandgap.ckpt`, `jarvis_opt_bandgap.ckpt`, `jarvis_total_energy.ckpt`
   - `mp_bandgap.ckpt`, `mp_bulk_modulus.ckpt`, `mp_e_form.ckpt`, `mp_shear_modulus.ckpt`

## Usage with huggingface_hub

To download these models in Python:

```python
from huggingface_hub import snapshot_download

# Download all models to a local directory
local_dir = snapshot_download(repo_id="{repo_id}")
print(f"Models downloaded to: {{local_dir}}")
```

Or download a specific file:

```python
from huggingface_hub import hf_hub_download

chgnet_path = hf_hub_download(repo_id="{repo_id}", filename="final_models/chgnet_weights/chgnet_model.pt")
```
"""

def main():
    parser = argparse.ArgumentParser(description="Push models to Hugging Face Hub")
    parser.add_argument("--repo-id", type=str, required=True, help="Target Hugging Face repo ID (e.g. 'username/model-name')")
    parser.add_argument("--token", type=str, default=None, help="Hugging Face Write Token (or set HF_TOKEN env var)")
    parser.add_argument("--private", action="store_true", help="Set repository to private")
    parser.add_argument("--folder", type=str, default="property_prediction_models", help="Folder to upload (default: property_prediction_models)")
    args = parser.parse_args()

    try:
        from huggingface_hub import HfApi, login
    except ImportError:
        print("Error: huggingface_hub is not installed. Run: pip install huggingface_hub")
        sys.exit(1)

    token = args.token or os.environ.get("HF_TOKEN")
    if token:
        login(token=token)

    api = HfApi(token=token)

    # Verify user identity
    try:
        user_info = api.whoami()
        print(f"Logged in as: {user_info.get('name', 'User')} ({user_info.get('type')})")
    except Exception as e:
        print(f"\nAuthentication Error: {e}")
        print("Please provide a valid token using --token or run 'hf auth login' first.")
        print("You can get a token with Write access from: https://huggingface.co/settings/tokens\n")
        sys.exit(1)

    print(f"\nCreating/Verifying repository: {args.repo_id} (private={args.private})...")
    api.create_repo(
        repo_id=args.repo_id,
        repo_type="model",
        private=args.private,
        exist_ok=True
    )

    base_path = Path(args.folder).resolve()
    if not base_path.exists():
        print(f"Error: Folder '{base_path}' does not exist.")
        sys.exit(1)

    # Write Model Card if not present
    readme_path = base_path / "README.md"
    readme_created = False
    if not readme_path.exists():
        readme_path.write_text(create_model_card(args.repo_id), encoding="utf-8")
        readme_created = True

    print(f"Uploading files from '{base_path}' to '{args.repo_id}'...")
    try:
        api.upload_folder(
            folder_path=str(base_path),
            repo_id=args.repo_id,
            repo_type="model",
            commit_message="Upload crystal property prediction model checkpoints",
            ignore_patterns=["**/__pycache__/**", "**/.DS_Store", "**/__MACOSX/**"]
        )
        print(f"\n Success! Models uploaded successfully to:")
        print(f"https://huggingface.co/{args.repo_id}\n")
    finally:
        # Clean up generated README if it was temporary in local folder
        if readme_created and readme_path.exists():
            # Keep it or remove it? Keeping it is helpful documentation
            pass

if __name__ == "__main__":
    main()
