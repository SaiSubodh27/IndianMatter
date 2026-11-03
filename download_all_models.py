"""One-off bootstrap script: download and persist all three ML interatomic
potentials used by the IndianMatter backend (CHGNet, M3GNet via MatGL, and
MACE-MP-0) into ``final_models/`` so the app can run fully offline.

Role in the system
------------------
Run this once on a machine with internet access. The saved weights under
``final_models/{chgnet,m3gnet,mace}_weights/`` are what ``backend/model_service.py``
and the calculator routers load at startup. Inputs: internet access + the
"chgnet", "matgl" (with DGL backend) and "mace-torch" packages installed.
Outputs: serialized ``.pt`` checkpoints plus MatGL model directories.

NOTE: each download is wrapped in its own try/except so one failure (network
blip, missing package) does not abort the remaining downloads.
"""

import os  # filesystem helpers for creating the target weight directories
import torch  # used to pickle the entire CHGNet module into a .pt checkpoint
import matgl  # MatGL framework entry point used to fetch/save the M3GNet PES model
from chgnet.model import CHGNet  # CHGNet universal interatomic potential (CHGNet-v0.3 by default)

# Ensure the target directories exist up-front so torch.save / matgl.save
# never fail on a missing parent folder.
os.makedirs("final_models/chgnet_weights", exist_ok=True)
os.makedirs("final_models/m3gnet_weights", exist_ok=True)
os.makedirs("final_models/mace_weights", exist_ok=True)

print("=== 1. Downloading & Saving CHGNet ===" )
try:
    chgnet_model = CHGNet.load()  # fetches the pretrained CHGNet-v0.3 checkpoint from its registry
    # Save model state and config or torch model representation
    # (pickling the whole module keeps the architecture + weights together; it
    # must be unpickled with the same chgnet package available.)
    torch.save(chgnet_model, "final_models/chgnet_weights/chgnet_model.pt")
    print("[SUCCESS] CHGNet saved to final_models/chgnet_weights/")
except Exception as e:
    print(f"[ERROR] CHGNet download failed: {e}")

print("\n=== 2. Downloading & Saving M3GNet ===" )
try:
    matgl.set_backend('DGL')  # MatGL supports DGL and PyG backends; DGL is what the saved model expects
    # Load standard Materials Project PES model
    # NOTE: this model ID was later retired from Hugging Face — if this call
    # fails, use download_m3gnet_hf.py / download_m3gnet_manual.py instead.
    m3gnet_model = matgl.load_model('M3GNet-MP-2021.2.8-PES')
    m3gnet_model.save("final_models/m3gnet_weights")  # writes model.pt + json configs into the folder
    print("[SUCCESS] M3GNet saved to final_models/m3gnet_weights/")
except Exception as e:
    print(f"[ERROR] M3GNet download failed: {e}")

print("\n=== 3. Downloading & Saving MACE ===" )
try:
    from mace.calculators import mace_mp
    # Initializing mace_mp downloads the medium model checkpoint automatically
    # into the user's ~/.cache/mace directory (CPU + float32 keeps it portable).
    mace_calc = mace_mp(model="medium", device="cpu", default_dtype="float32")
    # The calculator object itself is discarded; the cached checkpoint under
    # ~/.cache/mace IS the persistence mechanism for MACE (see download_m3gnet.py
    # for a variant that explicitly copies the cache into final_models/).
    print("[SUCCESS] MACE model initialized and cached locally!")
except Exception as e:
    print(f"[ERROR] MACE download failed: {e}")

print("\nAll download tasks completed!")