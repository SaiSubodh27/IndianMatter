import os
import torch
import matgl

print("=== Verifying CHGNet Local Load ===")
try:
    chgnet_path = "final_models/chgnet_weights/chgnet_model.pt"
    if os.path.exists(chgnet_path):
        chgnet_model = torch.load(chgnet_path, map_location="cpu", weights_only=False)
        print("[SUCCESS] CHGNet loaded successfully from local file!")
    else:
        print("[ERROR] CHGNet weight file not found.")
except Exception as e:
    print(f"[ERROR] Failed to load CHGNet: {e}")

print("\n=== Verifying M3GNet Local Load ===")
try:
    m3gnet_path = "final_models/m3gnet_weights"
    if os.path.exists(os.path.join(m3gnet_path, "model.pt")):
        # Load M3GNet locally from the weights folder
        m3gnet_model = matgl.load_model(m3gnet_path)
        print("[SUCCESS] M3GNet loaded successfully from local directory!")
    else:
        print("[ERROR] M3GNet local weights not found in final_models/m3gnet_weights.")
except Exception as e:
    print(f"[ERROR] Failed to load M3GNet: {e}")

print("\n=== Verifying MACE Local Load ===")
try:
    from mace.calculators import mace_mp
    mace_dir = "final_models/mace_weights"
    model_files = [f for f in os.listdir(mace_dir) if f.endswith(".model")]
    
    if model_files:
        local_model_path = os.path.join(mace_dir, model_files[0])
        mace_calc = mace_mp(model=local_model_path, device="cpu", default_dtype="float32")
        print(f"[SUCCESS] MACE loaded successfully from local file: {model_files[0]}!")
    else:
        mace_calc = mace_mp(model="medium", device="cpu", default_dtype="float32")
        print("[SUCCESS] MACE loaded successfully via standard fallback!")
except Exception as e:
    print(f"[ERROR] Failed to load MACE: {e}")

print("\nVerification process completed!")
