"""Fallback bootstrapper: fetch the replacement M3GNet potential from Hugging
Face and persist it under ``final_models/m3gnet_weights/``.

Role in the system
------------------
The historical model ID ``M3GNet-MP-2021.2.8-PES`` was removed from the
MatGL / Hugging Face model registry, so scripts that reference it
(download_m3gnet.py, download_all_models.py, m3gnet_finite_displacement_features.py)
break on a fresh download. This script uses the *retrained* universal
potential that replaced it (MatPES-PBE-2025.2) and is the recommended way
to (re)populate ``final_models/m3gnet_weights/`` when the registry name
changed.

Inputs  : internet access + the "matgl" package (optionally "huggingface_hub").
Outputs : the MatGL model folder (model.pt + JSON configs) for later offline
          load by the backend MLIP adapters.
"""

import os  # filesystem helpers (mkdir, path existence)
import matgl  # MatGL framework entry point for loading/saving potentials

# Target local folder — the same path the backend's model_service.py and MLIP
# adapters load from.
output_dir = "final_models/m3gnet_weights"
# Idempotent: create the folder if it does not yet exist.
os.makedirs(output_dir, exist_ok=True)

# The old "M3GNet-MP-2021.2.8-PES" name no longer exists on Hugging Face.
# It was superseded by this retrained universal potential:
MODEL_NAME = "materialyze/M3GNet-PES-MatPES-PBE-2025.2"

# Log which model we are about to fetch.
print(f"Downloading {MODEL_NAME} from Hugging Face...")
try:
    # Resolves the HF repo, downloads + caches its files locally.
    potential = matgl.load_model(MODEL_NAME)
    # Re-save into the canonical project layout for offline use.
    potential.save(output_dir)
    print(f"[SUCCESS] M3GNet downloaded and saved to {output_dir}/")
except Exception as e:
    # Primary path failed (often a matgl/HF metadata incompatibility); try
    # grabbing every file in the repo with huggingface_hub instead, then
    # load the model from those raw files.
    print(f"[ERROR] matgl.load_model failed: {e}")
    print("Falling back to direct huggingface_hub snapshot_download...")

    try:
        # Lazy import: only needed on the fallback path.
        from huggingface_hub import snapshot_download
        # Downloads all repo files into the Hugging Face cache directory.
        local_path = snapshot_download(repo_id=MODEL_NAME)
        print(f"[SUCCESS] Downloaded via huggingface_hub to: {local_path}")

        # Load straight from the raw snapshot directory.
        potential = matgl.load_model(local_path)
        # Normalize into the canonical project folder layout.
        potential.save(output_dir)
        print(f"[SUCCESS] M3GNet re-saved to {output_dir}/")
    except Exception as e2:
        # Deliberately no re-raise: this is a best-effort bootstrapping script.
        print(f"[ERROR] Fallback also failed: {e2}")
