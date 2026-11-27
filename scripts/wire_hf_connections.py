import os
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent

# 1. Update property_prediction_models/CrystalFormer/crystalformer_service.py
cf_service_path = ROOT / "property_prediction_models" / "CrystalFormer" / "crystalformer_service.py"
if cf_service_path.exists():
    text = cf_service_path.read_text(encoding="utf-8")
    target = """WEIGHTS_DIR = None
for d in CANDIDATE_WEIGHTS_DIRS:
    if d.is_dir() and (d / "mp_e_form.ckpt").exists():
        WEIGHTS_DIR = d
        break"""
    replacement = """WEIGHTS_DIR = None
for d in CANDIDATE_WEIGHTS_DIRS:
    if d.is_dir() and (d / "mp_e_form.ckpt").exists():
        WEIGHTS_DIR = d
        break

if WEIGHTS_DIR is None:
    try:
        from huggingface_hub import hf_hub_download
        hf_repo = os.getenv("HF_MODEL_REPO_ID", "SaiSubodh/indianmatter-models")
        weights_dest = BASE_DIR / "weights"
        weights_dest.mkdir(parents=True, exist_ok=True)
        for ckpt_name in ["mp_e_form.ckpt", "mp_bandgap.ckpt", "mp_bulk_modulus.ckpt", "mp_shear_modulus.ckpt"]:
            target_file = weights_dest / ckpt_name
            if not target_file.exists():
                hf_hub_download(repo_id=hf_repo, filename=f"crystalformer/{ckpt_name}", local_dir=str(BASE_DIR))
        if (weights_dest / "mp_e_form.ckpt").exists():
            WEIGHTS_DIR = weights_dest
            log.info(f"[CrystalFormer] Resolved weights from Hugging Face: {WEIGHTS_DIR}")
    except Exception as hf_err:
        log.warning(f"[CrystalFormer] Hugging Face checkpoint auto-download skipped: {hf_err}")"""
    
    if target in text:
        text = text.replace(target, replacement, 1)
        cf_service_path.write_text(text, encoding="utf-8")
        print("[OK] crystalformer_service.py wired with Hugging Face Hub")
    else:
        print("[SKIP] crystalformer_service.py already updated or target mismatch")

# 2. Update backend/model_paths.py
model_paths_file = ROOT / "backend" / "model_paths.py"
if model_paths_file.exists():
    text = model_paths_file.read_text(encoding="utf-8")
    target = """    searched = os.linesep.join(f"  - {candidate}" for candidate in candidate_dirs)
    raise FileNotFoundError(
        f"Could not find {required_filename} in any known pretrained model directory:{os.linesep}{searched}"
    )"""
    replacement = """    # Fallback: Auto-download from Hugging Face Hub
    try:
        from huggingface_hub import hf_hub_download
        hf_repo = os.getenv("HF_MODEL_REPO_ID", "SaiSubodh/indianmatter-models")
        dest_dir = PROJECT_ROOT / "property_prediction_models" / "pretrained_models"
        dest_dir.mkdir(parents=True, exist_ok=True)
        hf_hub_download(
            repo_id=hf_repo,
            filename=f"ioncast/{required_filename}",
            local_dir=str(PROJECT_ROOT / "property_prediction_models"),
        )
        if (dest_dir / required_filename).exists():
            return str(dest_dir)
    except Exception:
        pass

    searched = os.linesep.join(f"  - {candidate}" for candidate in candidate_dirs)
    raise FileNotFoundError(
        f"Could not find {required_filename} in any known pretrained model directory:{os.linesep}{searched}"
    )"""
    if target in text:
        text = text.replace(target, replacement, 1)
        model_paths_file.write_text(text, encoding="utf-8")
        print("[OK] backend/model_paths.py wired with Hugging Face Hub")
    else:
        print("[SKIP] backend/model_paths.py already updated or target mismatch")

# 3. Update cif_generator/cif_pipeline/config.py
config_file = ROOT / "cif_generator" / "cif_pipeline" / "config.py"
if config_file.exists():
    text = config_file.read_text(encoding="utf-8")
    target = """    for candidate in [
        Path("/models/crystallm/crystallm_v1_small"),
        _repo_root / "property_prediction_models" / "crystallm_weights" / "crystallm_v1_small",
    ]:
        if (candidate / "ckpt.pt").exists():
            return str(candidate)
    return \"\""""
    replacement = """    for candidate in [
        Path("/models/crystallm/crystallm_v1_small"),
        _repo_root / "property_prediction_models" / "crystallm_weights" / "crystallm_v1_small",
    ]:
        if (candidate / "ckpt.pt").exists():
            return str(candidate)

    # Fallback: Auto-download CrystaLLM checkpoint from Hugging Face Hub
    try:
        from huggingface_hub import hf_hub_download
        hf_repo = os.getenv("HF_MODEL_REPO_ID", "SaiSubodh/indianmatter-models")
        dest = _repo_root / "property_prediction_models" / "crystallm_weights" / "crystallm_v1_small"
        dest.mkdir(parents=True, exist_ok=True)
        hf_hub_download(
            repo_id=hf_repo,
            filename="crystallm/crystallm_v1_small/ckpt.pt",
            local_dir=str(_repo_root / "property_prediction_models"),
        )
        if (dest / "ckpt.pt").exists():
            return str(dest)
    except Exception:
        pass

    return \"\""""
    if target in text:
        text = text.replace(target, replacement, 1)
        config_file.write_text(text, encoding="utf-8")
        print("[OK] cif_generator/cif_pipeline/config.py wired with Hugging Face Hub")
    else:
        print("[SKIP] cif_generator/cif_pipeline/config.py already updated or target mismatch")

print("All Hugging Face model connections wired successfully!")
