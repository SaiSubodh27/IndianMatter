"""Builds the formation-energy surrogate (offline).

Role in the system
------------------
Offline script that trains/saves chgnet_Ef_model.pkl. Run manually.
"""

import os  # paths
import sys
import joblib

# Ensure prediction module is reachable
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "prediction")))

from BFSY_pipeline import CHGNetFormationEnergyModel

def main():
    repo_root = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
    out_dir = os.path.join(repo_root, "pretrained_models")
    os.makedirs(out_dir, exist_ok=True)
    out_path = os.path.join(out_dir, "chgnet_Ef_model.pkl")

    model = CHGNetFormationEnergyModel()
    joblib.dump(model, out_path)
    print(f"Successfully generated and saved {out_path} ({os.path.getsize(out_path)} bytes)")

if __name__ == "__main__":
    main()
