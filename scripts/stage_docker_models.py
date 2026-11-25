#!/usr/bin/env python3
"""
stage_docker_models.py
======================
Populates docker/model-store/models/ with all verified model weights so
`docker compose -f docker-compose.models.yml build` packages every model
into the immutable `indianmatter-model-store` Docker image.

Uses NTFS hardlinks when source and destination share a filesystem (zero extra
disk space) and falls back to file copy across drives.
"""

import os
import shutil
from pathlib import Path

WORKSPACE = Path(__file__).resolve().parent.parent
DESKTOP_ROOT = Path(r"C:\Users\saisu\OneDrive\Desktop\Final_ validation")
STAGE_ROOT = WORKSPACE / "docker" / "model-store" / "models"


def resolve_src(rel: str) -> Path:
    for base in (DESKTOP_ROOT, WORKSPACE):
        cand = base / rel
        if cand.exists():
            return cand
    raise FileNotFoundError(f"Could not locate model artifact: {rel}")


STAGE_MAP = {
    # 1. CrystaLLM generative CIF model
    "crystallm/crystallm_v1_small/ckpt.pt": "property_prediction_models/crystallm_weights/crystallm_v1_small/ckpt.pt",

    # 2. CrystalFormer (9 checkpoints)
    "crystalformer/mp_e_form.ckpt": "property_prediction_models/CrystalFormer/weights/mp_e_form.ckpt",
    "crystalformer/mp_bandgap.ckpt": "property_prediction_models/CrystalFormer/weights/mp_bandgap.ckpt",
    "crystalformer/mp_bulk_modulus.ckpt": "property_prediction_models/CrystalFormer/weights/mp_bulk_modulus.ckpt",
    "crystalformer/mp_shear_modulus.ckpt": "property_prediction_models/CrystalFormer/weights/mp_shear_modulus.ckpt",
    "crystalformer/jarvis_ehull.ckpt": "property_prediction_models/CrystalFormer/weights/jarvis_ehull.ckpt",
    "crystalformer/jarvis_formation_energy.ckpt": "property_prediction_models/CrystalFormer/weights/jarvis_formation_energy.ckpt",
    "crystalformer/jarvis_mbj_bandgap.ckpt": "property_prediction_models/CrystalFormer/weights/jarvis_mbj_bandgap.ckpt",
    "crystalformer/jarvis_opt_bandgap.ckpt": "property_prediction_models/CrystalFormer/weights/jarvis_opt_bandgap.ckpt",
    "crystalformer/jarvis_total_energy.ckpt": "property_prediction_models/CrystalFormer/weights/jarvis_total_energy.ckpt",

    # 3. IonCast Ensemble
    "ioncast/v5_base_models.pkl": "property_prediction_models/pretrained_models/v5_base_models.pkl",
    "ioncast/v5_mlp_models.pkl": "property_prediction_models/pretrained_models/v5_mlp_models.pkl",
    "ioncast/v5_meta_model.pkl": "property_prediction_models/pretrained_models/v5_meta_model.pkl",
    "ioncast/v5_model2_A.pkl": "property_prediction_models/pretrained_models/v5_model2_A.pkl",
    "ioncast/v6_corrector_model.pkl": "property_prediction_models/pretrained_models/v6_corrector_model.pkl",
    "ioncast/v5_quantile_transformer.pkl": "property_prediction_models/pretrained_models/v5_quantile_transformer.pkl",
    "ioncast/base_cols.pkl": "property_prediction_models/pretrained_models/base_cols.pkl",
    "ioncast/a_cols.pkl": "property_prediction_models/pretrained_models/a_cols.pkl",

    # 4. CHGNet (custom + official 0.3.0)
    "chgnet/chgnet_model.pt": "property_prediction_models/final_models/chgnet_weights/chgnet_model.pt",
    "chgnet/chgnet_0.3.0_e29f68s314m37.pth.tar": "property_prediction_models/final_models/chgnet_weights/chgnet_0.3.0_e29f68s314m37.pth.tar",

    # 5. M3GNet (MP-2021.2.8-PES + MatPES-PBE-2025.2)
    "m3gnet/model.json": "property_prediction_models/final_models/m3gnet_weights/model.json",
    "m3gnet/model.pt": "property_prediction_models/final_models/m3gnet_weights/model.pt",
    "m3gnet/state.pt": "property_prediction_models/final_models/m3gnet_weights/state.pt",
    "m3gnet/matpes_2025_2/model.json": "property_prediction_models/final_models/m3gnet_matpes_weights/model.json",
    "m3gnet/matpes_2025_2/model.pt": "property_prediction_models/final_models/m3gnet_matpes_weights/model.pt",
    "m3gnet/matpes_2025_2/state.pt": "property_prediction_models/final_models/m3gnet_matpes_weights/state.pt",

    # 6. MACE-MP-0 (medium + small)
    "mace/20231203mace128L1_epoch199model": "property_prediction_models/final_models/mace_weights/20231203mace128L1_epoch199model",
    "mace/2023-12-10-mace-128-L0_energy_epoch-249.model": "property_prediction_models/final_models/mace_weights/2023-12-10-mace-128-L0_energy_epoch-249.model",

    # 7. BFSY Pipeline
    "prediction/bfsy_pipeline.pkl": "property_prediction_models/prediction/bfsy_pipeline.pkl",
}


def main():
    STAGE_ROOT.mkdir(parents=True, exist_ok=True)
    total_bytes = 0
    linked = 0
    copied = 0

    for rel_dst, rel_src in STAGE_MAP.items():
        src = resolve_src(rel_src)
        dst = STAGE_ROOT / rel_dst
        dst.parent.mkdir(parents=True, exist_ok=True)
        if dst.exists():
            dst.unlink()
        try:
            os.link(src, dst)
            linked += 1
        except OSError:
            shutil.copy2(src, dst)
            copied += 1
        total_bytes += dst.stat().st_size

    print(
        f"Staged {len(STAGE_MAP)} model files ({total_bytes / (1024 * 1024):.2f} MB) "
        f"into {STAGE_ROOT} (hardlinked={linked}, copied={copied})"
    )


if __name__ == "__main__":
    main()
