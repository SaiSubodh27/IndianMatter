import json
import os
import sys
from pathlib import Path

import pandas as pd
from tqdm import tqdm

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT))

with open(ROOT / "configs" / "paths.json", encoding="utf-8") as handle:
    CONFIG = json.load(handle)

from src.features.feature_extractor import extract_features_v5


def build_v5_dataset():
    cif_directory = (ROOT / CONFIG["cif_directory"]).resolve()
    dataset_path = (ROOT / CONFIG["dataset_path"]).resolve()
    output_csv = (ROOT / CONFIG["output_csv"]).resolve()
    output_merged = (ROOT / CONFIG["output_merged"]).resolve()

    print(f"Starting V5 feature extraction pipeline targeting {cif_directory}...")
    if not cif_directory.exists():
        print(f"ERROR: Could not find the folder '{cif_directory}'.")
        return

    if not dataset_path.exists():
        print(f"ERROR: Could not find the dataset '{dataset_path}'.")
        return

    df_main = pd.read_csv(dataset_path)
    print(f"Loaded main dataset with {len(df_main)} records.")

    all_features = []
    cif_files = [f for f in os.listdir(cif_directory) if f.endswith(".cif")]
    print(f"Found {len(cif_files)} CIF files to process.")

    if len(cif_files) == 0:
        print("No .cif files found. Add them to proceed.")
        return

    for fname in tqdm(cif_files):
        cif_path = cif_directory / fname
        mat_id = fname.replace(".cif", "")
        try:
            feats = extract_features_v5(str(cif_path))
            feats["material_id"] = mat_id
            all_features.append(feats)
        except Exception as exc:
            print(f"\nError processing {fname}: {exc}")

    df_features = pd.DataFrame(all_features)
    print(f"\nExtraction complete! Feature DataFrame shape: {df_features.shape}")

    df_features.to_csv(output_csv, index=False)
    print(f"Saved 300+ features to: {output_csv}")

    df_merged = pd.merge(df_main, df_features, on="material_id", how="inner")
    print(f"Merged Dataset shape (Features + Labels): {df_merged.shape}")
    df_merged.to_csv(output_merged, index=False)
    print(f"Saved merged training data to: {output_merged}")


if __name__ == "__main__":
    build_v5_dataset()
