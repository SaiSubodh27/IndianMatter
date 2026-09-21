import os
import matgl

output_dir = "final_models/m3gnet_weights"
os.makedirs(output_dir, exist_ok=True)

MODEL_NAME = "materialyze/M3GNet-PES-MatPES-PBE-2025.2"
print(f"Downloading {MODEL_NAME} (PyG, matgl >=3.0.0)...")
potential = matgl.load_model(MODEL_NAME)
potential.save(output_dir)
print(f"[SUCCESS] Saved to {output_dir}/")
