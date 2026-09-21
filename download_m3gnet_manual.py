import os
import urllib.request

# Target local folder
output_dir = "final_models/m3gnet_weights"
os.makedirs(output_dir, exist_ok=True)

# Official raw files for M3GNet-MP-2021.2.8-PES
base_url = "https://raw.githubusercontent.com/materialsvirtuallab/matgl/main/pretrained_models/M3GNet-MP-2021.2.8-PES/"
files = ["model.pt", "model.json", "scaler.json"]

print("Manually downloading M3GNet model files...")
success = True
for file in files:
    url = base_url + file
    dest = os.path.join(output_dir, file)
    try:
        print(f"Downloading {file}...")
        urllib.request.urlretrieve(url, dest)
    except Exception as e:
        print(f"[WARNING] Could not download {file}: {e}")
        success = False

if os.path.exists(os.path.join(output_dir, "model.pt")):
    print("[SUCCESS] M3GNet weights downloaded successfully to local folder!")
else:
    print("[ERROR] Failed to download M3GNet model weights.")
