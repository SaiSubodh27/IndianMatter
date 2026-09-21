import os
import shutil
import matgl

# Ensure target directories exist
os.makedirs("final_models/m3gnet_weights", exist_ok=True)
os.makedirs("final_models/mace_weights", exist_ok=True)

print("=== 1. Downloading & Saving M3GNet ===")
try:
    matgl.set_backend('DGL')
    # Load standard Materials Project PES model and save it locally
    m3gnet_model = matgl.load_model('M3GNet-MP-2021.2.8-PES')
    m3gnet_model.save("final_models/m3gnet_weights")
    print("[SUCCESS] M3GNet saved to final_models/m3gnet_weights/")
except Exception as e:
    print(f"[ERROR] M3GNet download failed: {e}")

print("\n=== 2. Downloading & Copying MACE ===")
try:
    from mace.calculators import mace_mp
    # Initialize MACE to trigger automatic caching
    _ = mace_mp(model="medium", device="cpu", default_dtype="float32")
    
    # Copy cached files into your local project directory
    cache_dir = os.path.expanduser("~/.cache/mace")
    target_dir = "final_models/mace_weights"
    
    if os.path.exists(cache_dir):
        for file in os.listdir(cache_dir):
            src = os.path.join(cache_dir, file)
            dst = os.path.join(target_dir, file)
            if os.path.isfile(src):
                shutil.copy2(src, dst)
        print("[SUCCESS] MACE weights copied to final_models/mace_weights/")
    else:
        print("[WARNING] MACE cache directory not found.")
except Exception as e:
    print(f"[ERROR] MACE download/copy failed: {e}")

print("\nAll tasks completed!")