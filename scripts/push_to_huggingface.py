#!/usr/bin/env python3
"""
push_to_huggingface.py
======================
Uploads all IndianMatter property prediction, CIF generation (CrystaLLM),
and atomistic model checkpoints to Hugging Face Hub.

Usage:
  python scripts/push_to_huggingface.py [--repo-id SaiSubodh/indianmatter-models] [--token <hf_token>] [--only-new] [--private]
"""

import argparse
import json
import os
import sys
import time
from pathlib import Path

from dotenv import load_dotenv
from huggingface_hub import HfApi

WORKSPACE_ROOT = Path(__file__).resolve().parent.parent
load_dotenv(WORKSPACE_ROOT / ".env")
load_dotenv()

DEFAULT_REPO_ID = os.getenv("HF_MODEL_REPO_ID") or os.getenv("HF_REPO_ID", "SaiSubodh/indianmatter-models")
DESKTOP_ROOT = Path(r"C:\Users\saisu\OneDrive\Desktop\Final_ validation")


def resolve_model_path(rel_path: str) -> Path:
    """Resolve a model file from the local workspace or primary desktop checkout."""
    for base in (WORKSPACE_ROOT, DESKTOP_ROOT):
        candidate = base / rel_path
        if candidate.exists():
            return candidate
    return WORKSPACE_ROOT / rel_path


MODEL_REGISTRY = {
    # CrystaLLM Generative CIF Model
    "crystallm/crystallm_v1_small/ckpt.pt": {
        "rel_path": "property_prediction_models/crystallm_weights/crystallm_v1_small/ckpt.pt",
        "description": "CrystaLLM v1 Small autoregressive Transformer checkpoint for crystal structure CIF generation from formula/space-group prompts",
        "target": "Generative Crystal Structure (CIF)",
        "framework": "PyTorch / CrystaLLM (nanoGPT)",
        "metric": "Trained on 2.28M deduplicated CIF structures (Zenodo 10642388)"
    },

    # CrystalFormer Transformers
    "crystalformer/mp_e_form.ckpt": {
        "rel_path": "property_prediction_models/CrystalFormer/weights/mp_e_form.ckpt",
        "description": "CrystalFormer Space-group frame Transformer for Formation Energy (eV/atom) trained on Materials Project",
        "target": "Formation Energy (eV/atom)",
        "framework": "PyTorch / PyTorch Lightning",
        "metric": "MAE: 0.017 eV/atom (paper test), 0.034 eV/atom (50 Li blind test)"
    },
    "crystalformer/mp_bandgap.ckpt": {
        "rel_path": "property_prediction_models/CrystalFormer/weights/mp_bandgap.ckpt",
        "description": "CrystalFormer Space-group frame Transformer for Electronic Band Gap (eV) trained on Materials Project",
        "target": "Band Gap (eV)",
        "framework": "PyTorch / PyTorch Lightning",
        "metric": "MAE: ~0.30 eV (0.13-0.28 eV on non-metals)"
    },
    "crystalformer/mp_bulk_modulus.ckpt": {
        "rel_path": "property_prediction_models/CrystalFormer/weights/mp_bulk_modulus.ckpt",
        "description": "CrystalFormer Space-group frame Transformer for Bulk Modulus (log10 GPa) trained on Materials Project",
        "target": "Bulk Modulus (log10 GPa)",
        "framework": "PyTorch / PyTorch Lightning",
        "metric": "Median Error: ~5%"
    },
    "crystalformer/mp_shear_modulus.ckpt": {
        "rel_path": "property_prediction_models/CrystalFormer/weights/mp_shear_modulus.ckpt",
        "description": "CrystalFormer Space-group frame Transformer for Shear Modulus (log10 GPa) trained on Materials Project",
        "target": "Shear Modulus (log10 GPa)",
        "framework": "PyTorch / PyTorch Lightning",
        "metric": "Median Error: ~19%"
    },
    "crystalformer/jarvis_ehull.ckpt": {
        "rel_path": "property_prediction_models/CrystalFormer/weights/jarvis_ehull.ckpt",
        "description": "CrystalFormer Space-group frame Transformer for Energy Above Convex Hull (eV/atom) trained on JARVIS",
        "target": "Energy Above Hull (eV/atom)",
        "framework": "PyTorch / PyTorch Lightning",
        "metric": "JARVIS DFT 3D benchmarked"
    },
    "crystalformer/jarvis_formation_energy.ckpt": {
        "rel_path": "property_prediction_models/CrystalFormer/weights/jarvis_formation_energy.ckpt",
        "description": "CrystalFormer Space-group frame Transformer for Formation Energy (eV/atom) trained on JARVIS",
        "target": "Formation Energy (eV/atom)",
        "framework": "PyTorch / PyTorch Lightning",
        "metric": "JARVIS DFT 3D benchmarked"
    },
    "crystalformer/jarvis_mbj_bandgap.ckpt": {
        "rel_path": "property_prediction_models/CrystalFormer/weights/jarvis_mbj_bandgap.ckpt",
        "description": "CrystalFormer Space-group frame Transformer for MBJ Band Gap (eV) trained on JARVIS",
        "target": "MBJ Band Gap (eV)",
        "framework": "PyTorch / PyTorch Lightning",
        "metric": "JARVIS DFT 3D benchmarked"
    },
    "crystalformer/jarvis_opt_bandgap.ckpt": {
        "rel_path": "property_prediction_models/CrystalFormer/weights/jarvis_opt_bandgap.ckpt",
        "description": "CrystalFormer Space-group frame Transformer for Optical Band Gap (eV) trained on JARVIS",
        "target": "OPT Band Gap (eV)",
        "framework": "PyTorch / PyTorch Lightning",
        "metric": "JARVIS DFT 3D benchmarked"
    },
    "crystalformer/jarvis_total_energy.ckpt": {
        "rel_path": "property_prediction_models/CrystalFormer/weights/jarvis_total_energy.ckpt",
        "description": "CrystalFormer Space-group frame Transformer for Total Energy (eV/atom) trained on JARVIS",
        "target": "Total Energy (eV/atom)",
        "framework": "PyTorch / PyTorch Lightning",
        "metric": "JARVIS DFT 3D benchmarked"
    },

    # IonCast Ensemble for Solid-State Ionic Transport
    "ioncast/v5_base_models.pkl": {
        "rel_path": "property_prediction_models/pretrained_models/v5_base_models.pkl",
        "description": "IonCast v5 Stacking Base Ensemble (LightGBM, XGBoost, CatBoost, HistGradientBoosting, ExtraTrees) for Activation Energy Ea",
        "target": "Activation Energy Ea (eV)",
        "framework": "Scikit-Learn / LightGBM / XGBoost / CatBoost",
        "metric": "5-Fold Cross Validation on 9,956 solid-state electrolyte structures"
    },
    "ioncast/v5_mlp_models.pkl": {
        "rel_path": "property_prediction_models/pretrained_models/v5_mlp_models.pkl",
        "description": "IonCast v5 Multi-Layer Perceptrons (PyTorch) trained on QuantileTransformed composition features",
        "target": "Activation Energy Ea (eV)",
        "framework": "PyTorch MLP",
        "metric": "5-Fold CV ensemble learners"
    },
    "ioncast/v5_meta_model.pkl": {
        "rel_path": "property_prediction_models/pretrained_models/v5_meta_model.pkl",
        "description": "IonCast v5 Ridge Stacking Meta-Regressor blending 5 base tree learners and 2 MLP regressors",
        "target": "Activation Energy Ea Meta-Prediction (eV)",
        "framework": "Scikit-Learn Ridge",
        "metric": "Out-of-fold meta-learner"
    },
    "ioncast/v5_model2_A.pkl": {
        "rel_path": "property_prediction_models/pretrained_models/v5_model2_A.pkl",
        "description": "IonCast Arrhenius Prefactor log10(A) Regressor (LightGBM)",
        "target": "Arrhenius Prefactor log10(A) (S*K/cm)",
        "framework": "LightGBM",
        "metric": "Predicts sigma_0 in sigma = (A/T) * exp(-Ea / kB*T)"
    },
    "ioncast/v6_corrector_model.pkl": {
        "rel_path": "property_prediction_models/pretrained_models/v6_corrector_model.pkl",
        "description": "IonCast v6 Gradient Boosting Residual Corrector for empirical ionic conductivity delta log10(sigma)",
        "target": "Conductivity Residual delta log10(sigma)",
        "framework": "Scikit-Learn GradientBoosting",
        "metric": "Experimental Li-ion dataset calibrated"
    },
    "ioncast/v5_quantile_transformer.pkl": {
        "rel_path": "property_prediction_models/pretrained_models/v5_quantile_transformer.pkl",
        "description": "Fitted QuantileTransformer feature preprocessor for IonCast models",
        "target": "Feature Normalization",
        "framework": "Scikit-Learn",
        "metric": "Robust rank-based feature transform"
    },
    "ioncast/base_cols.pkl": {
        "rel_path": "property_prediction_models/pretrained_models/base_cols.pkl",
        "description": "List of 343 composition and Magpie feature column names expected by IonCast base and MLP models",
        "target": "Feature Schema",
        "framework": "Pickle / Python List",
        "metric": "343 features"
    },
    "ioncast/a_cols.pkl": {
        "rel_path": "property_prediction_models/pretrained_models/a_cols.pkl",
        "description": "List of 312 feature column names expected by Arrhenius Prefactor Model A",
        "target": "Feature Schema",
        "framework": "Pickle / Python List",
        "metric": "312 features"
    },

    # CHGNet Pretrained Models
    "chgnet/chgnet_model.pt": {
        "rel_path": "property_prediction_models/final_models/chgnet_weights/chgnet_model.pt",
        "description": "Pretrained CHGNet Universal Potential weights",
        "target": "Energy, Forces, Stress, Magmom",
        "framework": "PyTorch / CHGNet",
        "metric": "Energy MAE: 0.029 eV/atom, Force MAE: 0.068 eV/A"
    },
    "chgnet/chgnet_0.3.0_e29f68s314m37.pth.tar": {
        "rel_path": "property_prediction_models/final_models/chgnet_weights/chgnet_0.3.0_e29f68s314m37.pth.tar",
        "description": "Official CHGNet v0.3.0 MPtrj checkpoint loaded by CHGNet.load()",
        "target": "Energy, Forces, Stress, Magmom",
        "framework": "PyTorch / CHGNet 0.3.0",
        "metric": "MPtrj 1.5M structures pretrained"
    },

    # M3GNet Pretrained Models (Legacy MP-2021.2.8 + MatPES-PBE-2025.2)
    "m3gnet/model.json": {
        "rel_path": "property_prediction_models/final_models/m3gnet_weights/model.json",
        "description": "M3GNet-MP-2021.2.8-PES architecture definition",
        "target": "M3GNet Architecture Config",
        "framework": "MatGL 2.x / M3GNet",
        "metric": "Materials Project 2021 potential"
    },
    "m3gnet/model.pt": {
        "rel_path": "property_prediction_models/final_models/m3gnet_weights/model.pt",
        "description": "M3GNet-MP-2021.2.8-PES PyTorch model metadata",
        "target": "Model Definition",
        "framework": "MatGL 2.x / PyTorch",
        "metric": "Universal potential"
    },
    "m3gnet/state.pt": {
        "rel_path": "property_prediction_models/final_models/m3gnet_weights/state.pt",
        "description": "M3GNet-MP-2021.2.8-PES trained weights",
        "target": "Potential Energy, Forces, Stress",
        "framework": "MatGL 2.x / PyTorch",
        "metric": "Trained on MPtrj dataset"
    },
    "m3gnet/matpes_2025_2/model.json": {
        "rel_path": "property_prediction_models/final_models/m3gnet_matpes_weights/model.json",
        "description": "M3GNet-PES-MatPES-PBE-2025.2 architecture config (MatGL 4.x)",
        "target": "M3GNet MatPES Architecture Config",
        "framework": "MatGL 4.x / PyTorch",
        "metric": "MatPES PBE 2025.2"
    },
    "m3gnet/matpes_2025_2/model.pt": {
        "rel_path": "property_prediction_models/final_models/m3gnet_matpes_weights/model.pt",
        "description": "M3GNet-PES-MatPES-PBE-2025.2 model metadata (MatGL 4.x)",
        "target": "Model Definition",
        "framework": "MatGL 4.x / PyTorch",
        "metric": "MatPES PBE 2025.2"
    },
    "m3gnet/matpes_2025_2/state.pt": {
        "rel_path": "property_prediction_models/final_models/m3gnet_matpes_weights/state.pt",
        "description": "M3GNet-PES-MatPES-PBE-2025.2 trained weights (MatGL 4.x)",
        "target": "Potential Energy, Forces, Stress",
        "framework": "MatGL 4.x / PyTorch",
        "metric": "MatPES PBE 2025.2"
    },

    # MACE-MP-0 Pretrained Models (medium + small)
    "mace/20231203mace128L1_epoch199model": {
        "rel_path": "property_prediction_models/final_models/mace_weights/20231203mace128L1_epoch199model",
        "description": "MACE-MP-0 Medium (L1) equivariant message passing potential for CIF float64 relaxation",
        "target": "Interatomic Potential & Forces (Relaxation)",
        "framework": "PyTorch / MACE",
        "metric": "MACE-MP-0 Medium"
    },
    "mace/2023-12-10-mace-128-L0_energy_epoch-249.model": {
        "rel_path": "property_prediction_models/final_models/mace_weights/2023-12-10-mace-128-L0_energy_epoch-249.model",
        "description": "MACE-MP-0 Small (L0) equivariant message passing potential for fast property screening",
        "target": "Interatomic Potential & Forces (Fast Inference)",
        "framework": "PyTorch / MACE",
        "metric": "MACE-MP-0 Small"
    },

    # BFSY Pipeline
    "prediction/bfsy_pipeline.pkl": {
        "rel_path": "property_prediction_models/prediction/bfsy_pipeline.pkl",
        "description": "Pre-compiled BFSY feature extraction and multi-property surrogate prediction pipeline",
        "target": "Property Prediction Pipeline",
        "framework": "Scikit-Learn / LightGBM",
        "metric": "End-to-end crystal property pipeline"
    }
}

MODEL_CARD_CONTENT = """---
language:
- en
license: apache-2.0
tags:
- materials-science
- solid-state-batteries
- crystal-structure
- ionic-conductivity
- graph-neural-networks
- crystallm
- crystalformer
- chgnet
- m3gnet
- mace
- ioncast
- pytorch
task_categories:
- tabular-regression
- graph-ml
- text-generation
pretty_name: IndianMatter AI Materials, CIF Generation & Crystal Property Prediction Suite
---

# IndianMatter AI — Complete Model Repository

This repository hosts all **29 validated model checkpoints, ensembles, and foundation potentials** for the **IndianMatter AI** platform:
1. **CrystaLLM (`crystallm/`)**: Autoregressive Transformer (`crystallm_v1_small`) generating crystallographic CIF structures from chemical formulas & space groups.
2. **CrystalFormer (`crystalformer/`)**: 9 Space-group frame Transformer checkpoints for formation energy, band gap, bulk modulus, shear modulus, and convex hull energy.
3. **IonCast v5/v6 (`ioncast/`)**: Stacking ensemble predicting solid-state ionic conductivity ($\\sigma$) and activation energy ($E_a$).
4. **CHGNet (`chgnet/`)**: Universal charge-informed GNN (`0.3.0` + fine-tuned weights).
5. **M3GNet (`m3gnet/`)**: Both `M3GNet-MP-2021.2.8-PES` (MatGL 2.x) and `M3GNet-PES-MatPES-PBE-2025.2` (MatGL 4.x).
6. **MACE-MP-0 (`mace/`)**: Both `medium` (CIF float64 relaxation) and `small` (fast screening) foundation potentials.
7. **BFSY (`prediction/`)**: Compiled multi-property prediction pipeline.

## Quickstart

```python
from huggingface_hub import snapshot_download

local_dir = snapshot_download(
    repo_id="SaiSubodh/indianmatter-models",
    local_dir="./models"
)
```

Or deploy via the **version-isolated multi-container Docker architecture** (`docker-compose.models.yml`) in the repository so each model family runs in its own pinned Python runtime without dependency conflicts.
"""


def main():
    parser = argparse.ArgumentParser(description="Push all IndianMatter models to Hugging Face Hub")
    parser.add_argument("--repo-id", type=str, default=DEFAULT_REPO_ID, help="Target HF repo ID")
    parser.add_argument("--token", type=str, default=None, help="HF write token (or set HF_TOKEN env var)")
    parser.add_argument("--private", action="store_true", help="Create repo as private")
    parser.add_argument("--only-new", action="store_true", help="Skip files already present in HF repo")
    args = parser.parse_args()

    token = args.token or os.getenv("HF_TOKEN") or os.getenv("HUGGINGFACE_HUB_TOKEN")
    if not token:
        print("ERROR: Missing HF_TOKEN / HUGGINGFACE_HUB_TOKEN in environment or --token argument.")
        return 1

    print("=" * 70)
    print(" IndianMatter Hugging Face Model Publisher")
    print(f" Target Repository: {args.repo_id}")
    print("=" * 70)

    api = HfApi(token=token)
    user_info = api.whoami()
    print(f"Authenticated as: {user_info.get('name')} ({user_info.get('fullname')})")

    repo_url = api.create_repo(repo_id=args.repo_id, repo_type="model", exist_ok=True, private=args.private)
    print(f"Repository ready at: {repo_url}")

    existing_files = set(api.list_repo_files(repo_id=args.repo_id)) if args.only_new else set()

    verified_files = []
    total_bytes = 0
    for repo_path, meta in MODEL_REGISTRY.items():
        src_path = resolve_model_path(meta["rel_path"])
        if not src_path.exists():
            print(f"ERROR: Missing local file: {src_path}")
            return 1
        sz = src_path.stat().st_size
        total_bytes += sz
        verified_files.append((repo_path, src_path, sz, meta))

    print(f"All {len(verified_files)} model files verified. Total payload: {total_bytes / (1024 * 1024):.2f} MB")

    index_data = {
        "repository": args.repo_id,
        "updated_at": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()),
        "total_models": len(verified_files),
        "total_bytes": total_bytes,
        "models": {
            repo_path: {
                "size_bytes": sz,
                "size_mb": round(sz / (1024 * 1024), 2),
                "description": meta["description"],
                "target": meta["target"],
                "framework": meta["framework"],
                "metric": meta["metric"]
            }
            for repo_path, _, sz, meta in verified_files
        }
    }

    print("\n[1/3] Uploading updated Model Card (README.md)...")
    api.upload_file(
        path_or_fileobj=MODEL_CARD_CONTENT.encode("utf-8"),
        path_in_repo="README.md",
        repo_id=args.repo_id,
        repo_type="model",
        commit_message="docs: update Model Card with CrystaLLM, MACE-MP-0 small, CHGNet 0.3.0, and M3GNet MatPES"
    )

    print("[2/3] Uploading updated model_index.json...")
    api.upload_file(
        path_or_fileobj=json.dumps(index_data, indent=2).encode("utf-8"),
        path_in_repo="model_index.json",
        repo_id=args.repo_id,
        repo_type="model",
        commit_message="feat(metadata): update model_index.json to all 29 artifacts"
    )

    print(f"\n[3/3] Uploading model checkpoints (only_new={args.only_new})...")
    for idx, (repo_path, src_path, sz, meta) in enumerate(verified_files, 1):
        if args.only_new and repo_path in existing_files:
            print(f"  [{idx:02d}/{len(verified_files):02d}] SKIP (already uploaded): {repo_path}")
            continue
        print(f"  [{idx:02d}/{len(verified_files):02d}] Uploading {repo_path} ({sz / (1024 * 1024):.2f} MB)...", end=" ", flush=True)
        start_t = time.time()
        api.upload_file(
            path_or_fileobj=str(src_path),
            path_in_repo=repo_path,
            repo_id=args.repo_id,
            repo_type="model",
            commit_message=f"feat(weights): upload {repo_path} ({meta['target']})"
        )
        elapsed = time.time() - start_t
        print(f"DONE in {elapsed:.1f}s")

    print("\n" + "=" * 70)
    print(" SUCCESS: All models synced to Hugging Face!")
    print(f" Public Repository: https://huggingface.co/{args.repo_id}")
    print("=" * 70)
    return 0


if __name__ == "__main__":
    sys.exit(main())
