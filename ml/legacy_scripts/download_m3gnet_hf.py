import os
import matgl

output_dir = "final_models/m3gnet_weights"
os.makedirs(output_dir, exist_ok=True)

# The old "M3GNet-MP-2021.2.8-PES" name no longer exists on Hugging Face.
# It was superseded by this retrained universal potential:
MODEL_NAME = "materialyze/M3GNet-PES-MatPES-PBE-2025.2"

print(f"Downloading {MODEL_NAME} from Hugging Face...")
try:
    potential = matgl.load_model(MODEL_NAME)
    potential.save(output_dir)
    print(f"[SUCCESS] M3GNet downloaded and saved to {output_dir}/")
except Exception as e:
    print(f"[ERROR] matgl.load_model failed: {e}")
    print("Falling back to direct huggingface_hub snapshot_download...")

    try:
        from huggingface_hub import snapshot_download
        local_path = snapshot_download(repo_id=MODEL_NAME)
        print(f"[SUCCESS] Downloaded via huggingface_hub to: {local_path}")

        potential = matgl.load_model(local_path)
        potential.save(output_dir)
        print(f"[SUCCESS] M3GNet re-saved to {output_dir}/")
    except Exception as e2:
        print(f"[ERROR] Fallback also failed: {e2}")
