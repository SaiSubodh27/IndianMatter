"""Bootstrapper: download and persist the original M3GNet-MP-2021.2.8-PES
potential and the MACE-MP-0 medium model.

Role in the system
------------------
First-stage downloader used on machines where the original model IDs are still
reachable. It pulls the (now-retired) ``M3GNet-MP-2021.2.8-PES`` MatGL
potential and initializes MACE-MP-0 so its checkpoint lands in the user's
``~/.cache/mace`` cache, which is then copied into the project folder.

Inputs  : internet access + matgl (DGL backend) + mace-torch packages.
Outputs : ``final_models/m3gnet_weights/`` (model.pt + JSON configs) and
          ``final_models/mace_weights/`` (copied cache files).

NOTE: if the M3GNet model ID 404s on your machine, fall back to
``download_m3gnet_hf.py``, ``redownload_m3gnet.py`` or
``download_m3gnet_manual.py`` which use the replacement model.
"""

import os  # filesystem helpers (mkdir, path joins, existence checks)
import shutil  # used to copy MACE cache files into the project folder
import matgl  # MatGL framework entry point (DGL/PyG backends)

# Make sure both target folders exist before we try to save into them.
# exist_ok=True keeps the script idempotent across repeated runs.
os.makedirs("final_models/m3gnet_weights", exist_ok=True)
os.makedirs("final_models/mace_weights", exist_ok=True)

# ---------------------------------------------------------------------------
# Step 1 — M3GNet (Materials Project PES)
# ---------------------------------------------------------------------------
print("=== 1. Downloading & Saving M3GNet ===")
try:
    # MatGL supports DGL and PyG backends; this model was trained under DGL,
    # so pin the backend before loading or the weights won't align.
    matgl.set_backend('DGL')
    # Load the standard Materials Project PES model (now retired from HF).
    # NOTE: this ID may 404 on fresh machines — see the fallback scripts.
    m3gnet_model = matgl.load_model('M3GNet-MP-2021.2.8-PES')
    # Persist the model (architecture JSON + weight tensors) into the folder.
    m3gnet_model.save("final_models/m3gnet_weights")
    print("[SUCCESS] M3GNet saved to final_models/m3gnet_weights/")
except Exception as e:
    # Non-fatal: report and continue so MACE can still be fetched.
    print(f"[ERROR] M3GNet download failed: {e}")

# ---------------------------------------------------------------------------
# Step 2 — MACE-MP-0 (medium)
# ---------------------------------------------------------------------------
print("\n=== 2. Downloading & Copying MACE ===")
try:
    # Lazy import so the script can still run M3GNet-only if mace is absent.
    from mace.calculators import mace_mp
    # Initializing mace_mp downloads the medium checkpoint into ~/.cache/mace.
    # CPU + float32 keeps the cached weights portable across machines.
    _ = mace_mp(model="medium", device="cpu", default_dtype="float32")

    # MACE persists via its own cache, so we copy that cache into the project.
    cache_dir = os.path.expanduser("~/.cache/mace")
    target_dir = "final_models/mace_weights"

    if os.path.exists(cache_dir):
        # Walk the cache and copy only regular files (skip subdirs).
        for file in os.listdir(cache_dir):
            src = os.path.join(cache_dir, file)
            dst = os.path.join(target_dir, file)
            if os.path.isfile(src):
                # copy2 preserves metadata/timestamps for reproducibility.
                shutil.copy2(src, dst)
        print("[SUCCESS] MACE weights copied to final_models/mace_weights/")
    else:
        print("[WARNING] MACE cache directory not found.")
except Exception as e:
    # Non-fatal: report and continue.
    print(f"[ERROR] MACE download/copy failed: {e}")

# Final banner — both steps may have partially succeeded.
print("\nAll tasks completed!")
