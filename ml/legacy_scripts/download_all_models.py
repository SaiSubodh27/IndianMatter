import os
import torch
import matgl
from chgnet.model import CHGNet

# Ensure directories exist
os.makedirs("final_models/chgnet_weights", exist_ok=True)
os.makedirs("final_models/m3gnet_weights", exist_ok=True)
os.makedirs("final_models/mace_weights", exist_ok=True)

print("=== 1. Downloading & Saving CHGNet ===" )
try:
    chgnet_model = CHGNet.load()
    # Save model state and config or torch model representation
    torch.save(chgnet_model, "final_models/chgnet_weights/chgnet_model.pt")
    print("[SUCCESS] CHGNet saved to final_models/chgnet_weights/")
except Exception as e:
    print(f"[ERROR] CHGNet download failed: {e}")

print("\n=== 2. Downloading & Saving M3GNet ===" )
try:
    matgl.set_backend('DGL')
    # Load standard Materials Project PES model
    m3gnet_model = matgl.load_model('M3GNet-MP-2021.2.8-PES')
    m3gnet_model.save("final_models/m3gnet_weights")
    print("[SUCCESS] M3GNet saved to final_models/m3gnet_weights/")
except Exception as e:
    print(f"[ERROR] M3GNet download failed: {e}")

print("\n=== 3. Downloading & Saving MACE ===" )
try:
    from mace.calculators import mace_mp
    # Initializing mace_mp downloads the medium model checkpoint automatically
    mace_calc = mace_mp(model="medium", device="cpu", default_dtype="float32")
    # Save the underlying model or config if accessible, or let MACE cache it locally
    print("[SUCCESS] MACE model initialized and cached locally!")
except Exception as e:
    print(f"[ERROR] MACE download failed: {e}")

print("\nAll download tasks completed!")