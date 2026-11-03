"""Minimal fallback downloader for the newer M3GNet-PES-MatPES-PBE-2025.2
potential (PyG / MatGL >= 3.0.0).

Why this exists
---------------
The original model ID ``M3GNet-MP-2021.2.8-PES`` was retired from the
Hugging Face registry that ``matgl.load_model`` queries. This script is the
shortest working path when you are on a recent MatGL installation: it loads
the replacement model by its HuggingFace name and saves it into the canonical
``final_models/m3gnet_weights/`` folder so the rest of the IndianMatter
pipeline (backend MLIP adapters, CIF generator relaxation) can find it.

Inputs  : internet access + MatGL >= 3.0.0 with the PyG backend.
Outputs : ``final_models/m3gnet_weights/{model.pt, model.json, state.pt}``.

NOTE: this replaces the weight files in the target folder; if you need to
keep the old ones, back them up first.
"""

import os  # filesystem helpers for creating / checking the output directory
import matgl  # MatGL framework used to fetch + persist the M3GNet potential

# Canonical on-disk location that backend/model_paths.py and the MLIP adapters
# look for when resolving M3GNet weights.
output_dir = "final_models/m3gnet_weights"
# Ensure the folder exists so matgl's .save() never fails on a missing parent.
os.makedirs(output_dir, exist_ok=True)

# The replacement model ID (the original 2021.2.8-PES ID is no longer served).
MODEL_NAME = "materialyze/M3GNet-PES-MatPES-PBE-2025.2"
# Log which model we are about to fetch.
print(f"Downloading {MODEL_NAME} (PyG, matgl >=3.0.0)...")
# Fetch the model from the registry (downloads weights into MatGL's cache).
potential = matgl.load_model(MODEL_NAME)
# Persist the model (architecture JSON + weight tensors) into output_dir.
potential.save(output_dir)
# Confirm completion to the user.
print(f"[SUCCESS] Saved to {output_dir}/")
