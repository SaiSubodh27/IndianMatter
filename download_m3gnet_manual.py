"""Manual (offline-friendly) downloader for the original M3GNet-MP-2021.2.8-PES.

Why this exists
---------------
``matgl.load_model('M3GNet-MP-2021.2.8-PES')`` and the HuggingFace-based
route both fail on machines where the registry is unreachable or the model
ID has been retired. This script bypasses both by fetching the three raw
files that make up the model directly from the MatGL GitHub repository's
``pretrained_models/`` folder via plain HTTP ``urlretrieve``.

Files fetched
-------------
- ``model.pt``   — the serialized model weights (required; used as the
  success marker at the end of the script).
- ``model.json`` — the model architecture / config.
- ``scaler.json`` — the input-feature scaler (note: MatGL's ``.save()``
  route does NOT write this file, so a folder produced by the newer
  scripts may be missing it — see the gap notes in the models artifact).

Inputs  : internet access to raw.githubusercontent.com.
Outputs : the three files above written into ``final_models/m3gnet_weights/``.
"""

import os  # filesystem helpers for building output paths / checking existence
import urllib.request  # stdlib HTTP client used to fetch the raw model files

# Target local folder that the rest of the backend expects for M3GNet weights.
output_dir = "final_models/m3gnet_weights"
# Create the folder if it does not yet exist so urlretrieve never fails.
os.makedirs(output_dir, exist_ok=True)

# Base URL pointing at the raw files of the original M3GNet-MP-2021.2.8-PES
# model inside the MatGL GitHub repository.
base_url = "https://raw.githubusercontent.com/materialsvirtuallab/matgl/main/pretrained_models/M3GNet-MP-2021.2.8-PES/"
# The three files that together constitute the model.
files = ["model.pt", "model.json", "scaler.json"]

# Inform the user what we are about to do.
print("Manually downloading M3GNet model files...")
# Track whether every file downloaded cleanly.
success = True
# Iterate over each required file and fetch it individually.
for file in files:
    # Build the full source URL for this file.
    url = base_url + file
    # Build the destination path inside the target folder.
    dest = os.path.join(output_dir, file)
    try:
        # Log which file is being fetched.
        print(f"Downloading {file}...")
        # Download the file to disk (blocking; raises on HTTP/network errors).
        urllib.request.urlretrieve(url, dest)
    except Exception as e:
        # Non-fatal: record the failure and continue with the remaining files.
        print(f"[WARNING] Could not download {file}: {e}")
        success = False

# Only report full success if the critical weight file actually made it to disk.
if os.path.exists(os.path.join(output_dir, "model.pt")):
    print("[SUCCESS] M3GNet weights downloaded successfully to local folder!")
else:
    print("[ERROR] Failed to download M3GNet model weights.")
