import json

nb = json.load(open('ssb_pipeline_v2.ipynb', 'r', encoding='utf-8'))

new_cell_6 = """# Cell 6 — Crystalformer (CrystalFramer) real integration
# Based on omron-sinicx/crystalframer's demo.py / models.latticeformer.Latticeformer /
# dataloaders.dataset_latticeformer, and custom single/few-structure inference.

import os, sys, pickle, shutil, numpy as np
import torch
from torch_geometric.loader import DataLoader

CRYSTALFORMER_REPO_DIR = r"c:\\Users\\Shannu\\OneDrive\\ドキュメント\\Crystal\\CrystalFormer\\crystalframer"
CRYSTALFORMER_WEIGHTS_DIR = r"c:\\Users\\Shannu\\OneDrive\\ドキュメント\\Crystal\\CrystalFormer\\crystalframer_weights\\crystalframer_weights"

CRYSTALFORMER_CHECKPOINTS = {
    'formation_energy': dict(param_json="default_mp.json",      ckpt="mp_e_form.ckpt",         target_set="jarvis__megnet",             targets=["e_form"],           idx=0),
    'band_gap':         dict(param_json="default_mp.json",      ckpt="mp_bandgap.ckpt",        target_set="jarvis__megnet",             targets=["bandgap"],          idx=0),
    'bulk_modulus':     dict(param_json="default_mp.json",      ckpt="mp_bulk_modulus.ckpt",   target_set="jarvis__megnet-bulk_modulus", targets=["bulk_modulus"],     idx=0),  # log(GPa) -> np.exp
    'shear_modulus':    dict(param_json="default_mp.json",      ckpt="mp_shear_modulus.ckpt",  target_set="jarvis__megnet-shear_modulus",targets=["shear_modulus"],    idx=0),  # log(GPa) -> np.exp
    'e_hull_jarvis':    dict(param_json="default_jarvis.json",  ckpt="jarvis_ehull.ckpt",      target_set="jarvis__dft_3d_2021-ehull",   targets=["ehull"],            idx=0),
}

_cf_models = {}

def _cf_load_one(prop):
    if prop in _cf_models:
        return _cf_models[prop]
    if not CRYSTALFORMER_REPO_DIR or not os.path.isdir(CRYSTALFORMER_REPO_DIR):
        _cf_models[prop] = None
        return None
    cfg = CRYSTALFORMER_CHECKPOINTS[prop]
    param_path = os.path.join(CRYSTALFORMER_REPO_DIR, "params", "crystalframer", cfg['param_json'])
    ckpt_path = os.path.join(CRYSTALFORMER_WEIGHTS_DIR, cfg['ckpt'])
    if not (os.path.exists(param_path) and os.path.exists(ckpt_path)):
        print(f"[Crystalformer] {prop}: checkpoint/param files not found ({cfg['ckpt']} / {cfg['param_json']})")
        _cf_models[prop] = None
        return None
    if CRYSTALFORMER_REPO_DIR not in sys.path:
        sys.path.insert(0, CRYSTALFORMER_REPO_DIR)
    
    _orig_cwd = os.getcwd()
    try:
        os.chdir(CRYSTALFORMER_REPO_DIR)
        from utils import Params
        from models.latticeformer import Latticeformer
        params = Params(param_path)
        params.pretrained_model = ckpt_path
        params.targets = cfg['targets']
        model = Latticeformer(params)
        with open(ckpt_path, "rb") as f:
            checkpoint = torch.load(f, map_location="cpu", weights_only=False)
        state_dict = checkpoint['state_dict']
        target_std = state_dict['target_std']
        target_mean = state_dict['target_mean']
        prefix = "swa_model.module."
        model_dict = {k.replace(prefix, ""): v for k, v in state_dict.items() if k.startswith(prefix)}
        model.load_state_dict(model_dict)
        model.mlp[-1].load_state_dict({
            'weight': model.mlp[-1].weight * target_std[:, None],
            'bias': model.mlp[-1].bias * target_std + target_mean,
        })
        model.eval()
        _cf_models[prop] = (model, cfg)
        print(f"[Crystalformer] {prop}: loaded OK.")
        return _cf_models[prop]
    except Exception as e:
        print(f"[Crystalformer] {prop}: failed to load ({type(e).__name__}: {e}) -> will fall back.")
        _cf_models[prop] = None
        return None
    finally:
        os.chdir(_orig_cwd)

def _cf_structure_to_batch(structure, target_set):
    if CRYSTALFORMER_REPO_DIR not in sys.path:
        sys.path.insert(0, CRYSTALFORMER_REPO_DIR)
    from dataloaders.dataset_latticeformer import RegressionDatasetMP_Latticeformer as Dataset

    tmp_name = "_single_predict_tmp"
    split_dir = os.path.join(CRYSTALFORMER_REPO_DIR, "data", tmp_name, "test", "raw")
    os.makedirs(split_dir, exist_ok=True)
    proc_dir = os.path.join(CRYSTALFORMER_REPO_DIR, "data", tmp_name, "test", "processed")
    if os.path.isdir(proc_dir):
        shutil.rmtree(proc_dir, ignore_errors=True)
    data_list = [{"id": "sample_0", "structure": structure, "e_form": 0.0, "bandgap": 0.0,
                  "bulk_modulus": 0.0, "shear_modulus": 0.0, "ehull": 0.0}]
    with open(os.path.join(split_dir, "raw_data.pkl"), "wb") as f:
        pickle.dump(data_list, f)
    _orig_cwd = os.getcwd()
    try:
        os.chdir(CRYSTALFORMER_REPO_DIR)
        dataset = Dataset(target_split="test", target_set=tmp_name)
        loader = DataLoader(dataset, batch_size=1, shuffle=False, num_workers=0)
        return next(iter(loader))
    finally:
        os.chdir(_orig_cwd)

def crystalformer_predict(structure, cif_path):
    out = {}
    try:
        batch = _cf_structure_to_batch(structure, "jarvis__megnet")
    except Exception as e:
        print(f"[Crystalformer] Featurization failed: {e}")
        return out

    for prop in CRYSTALFORMER_CHECKPOINTS:
        loaded = _cf_load_one(prop)
        if loaded is None:
            continue
        model, cfg = loaded
        try:
            with torch.no_grad():
                pred = model(batch)[0, cfg['idx']].item()
            if prop in ('bulk_modulus', 'shear_modulus'):
                pred = float(np.exp(pred))
            out[prop] = round(pred, 4)
        except Exception as e:
            print(f"[Crystalformer] {prop} inference failed for {os.path.basename(cif_path)}: {e}")
    return out
"""

nb['cells'][6]['source'] = [line + '\n' for line in new_cell_6.split('\n')]
json.dump(nb, open('ssb_pipeline_v2.ipynb', 'w', encoding='utf-8'), indent=1, ensure_ascii=False)
print('Updated Cell 6 in ssb_pipeline_v2.ipynb successfully!')
