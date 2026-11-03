import os
import sys
import numpy as np
from pymatgen.core import Structure

repo_dir = r"c:\Users\Shannu\OneDrive\ドキュメント\Crystal\CrystalFormer\crystalframer"
weights_dir = r"c:\Users\Shannu\OneDrive\ドキュメント\Crystal\CrystalFormer\crystalframer_weights\crystalframer_weights"

cif_path = r"c:\Users\Shannu\OneDrive\Desktop\Model\sample_Li3N.cif"
if not os.path.exists(cif_path):
    # fallback create simple Li3N structure
    struct = Structure.from_spacegroup("P6/mmm", [[3.65, 0, 0], [0, 3.65, 0], [0, 0, 3.87]], ["Li", "Li", "N"], [[0, 0, 0], [0.3333, 0.6667, 0.5], [0, 0, 0.5]])
else:
    struct = Structure.from_file(cif_path)

print("Testing end-to-end prediction for structure:", struct.composition.reduced_formula)

# Import Cell 6 logic
sys.path.insert(0, repo_dir)
import torch
import torch.serialization
import torch_geometric.data.data
try:
    torch.serialization.add_safe_globals([
        torch_geometric.data.data.DataEdgeAttr,
        torch_geometric.data.data.DataTensorAttr
    ])
except Exception:
    pass
from utils import Params
from models.latticeformer import Latticeformer
from torch_geometric.loader import DataLoader
from dataloaders.dataset_latticeformer import RegressionDatasetMP_Latticeformer as Dataset
import pickle, shutil

CRYSTALFORMER_CHECKPOINTS = {
    'formation_energy': dict(param_json="default_mp.json",      ckpt="mp_e_form.ckpt",      target_set="jarvis__megnet",             targets=["e_form"],           idx=0),
    'band_gap':         dict(param_json="default_mp.json",      ckpt="mp_bandgap.ckpt",     target_set="jarvis__megnet",             targets=["bandgap"],          idx=0),
    'bulk_modulus':     dict(param_json="default_mp.json",      ckpt="mp_bulk_modulus.ckpt",        target_set="jarvis__megnet-bulk_modulus", targets=["bulk_modulus"],     idx=0),
    'shear_modulus':    dict(param_json="default_mp.json",      ckpt="mp_shear_modulus.ckpt",       target_set="jarvis__megnet-shear_modulus",targets=["shear_modulus"],    idx=0),
    'e_hull_jarvis':    dict(param_json="default_jarvis.json",  ckpt="jarvis_ehull.ckpt",   target_set="jarvis__dft_3d_2021-ehull",   targets=["ehull"],            idx=0),
}

_orig_cwd = os.getcwd()
_cf_models = {}

def _cf_load_one(prop):
    if prop in _cf_models:
        return _cf_models[prop]
    cfg = CRYSTALFORMER_CHECKPOINTS[prop]
    param_path = os.path.join(repo_dir, "params", "crystalframer", cfg['param_json'])
    ckpt_path = os.path.join(weights_dir, cfg['ckpt'])
    
    os.chdir(repo_dir)
    try:
        params = Params(param_path)
        params.pretrained_model = ckpt_path
        params.targets = cfg['targets']
        model = Latticeformer(params)
        with open(ckpt_path, "rb") as f:
            checkpoint = torch.load(f, map_location="cpu")
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
        return _cf_models[prop]
    finally:
        os.chdir(_orig_cwd)

def _cf_structure_to_batch(structure, target_set):
    tmp_name = "_single_predict_tmp"
    split_dir = os.path.join(repo_dir, "data", tmp_name, "test", "raw")
    os.makedirs(split_dir, exist_ok=True)
    proc_dir = os.path.join(repo_dir, "data", tmp_name, "test", "processed")
    if os.path.isdir(proc_dir):
        shutil.rmtree(proc_dir, ignore_errors=True)
    data_list = [{"id": "sample_0", "structure": structure, "e_form": 0.0, "bandgap": 0.0,
                  "bulk_modulus": 0.0, "shear_modulus": 0.0, "ehull": 0.0}]
    with open(os.path.join(split_dir, "raw_data.pkl"), "wb") as f:
        pickle.dump(data_list, f)
    try:
        os.chdir(repo_dir)
        dataset = Dataset(target_split="test", target_set=tmp_name)
        loader = DataLoader(dataset, batch_size=1, shuffle=False, num_workers=0)
        return next(iter(loader))
    finally:
        os.chdir(_orig_cwd)

def predict_test(structure):
    out = {}
    batch = _cf_structure_to_batch(structure, "jarvis__megnet")
    for prop in CRYSTALFORMER_CHECKPOINTS:
        model, cfg = _cf_load_one(prop)
        with torch.no_grad():
            pred = model(batch)[0, cfg['idx']].item()
        if prop in ('bulk_modulus', 'shear_modulus'):
            pred = float(np.exp(pred))
        out[prop] = round(pred, 4)
    return out

res = predict_test(struct)
print("\nPREDICTION RESULTS:")
for k, v in res.items():
    print(f"  {k:18s}: {v}")
print("\nEND-TO-END PREDICTION TEST PASSED!")
