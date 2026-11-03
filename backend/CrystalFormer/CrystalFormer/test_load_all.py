import os
import sys
import torch

repo = r"c:\Users\Shannu\OneDrive\ドキュメント\Crystal\CrystalFormer\crystalframer"
weights = r"c:\Users\Shannu\OneDrive\ドキュメント\Crystal\CrystalFormer\crystalframer_weights\crystalframer_weights"

sys.path.insert(0, repo)
os.chdir(repo)

from utils import Params
from models.latticeformer import Latticeformer

checkpoints = {
    'formation_energy': ("default_mp.json", "mp_e_form.ckpt", ["e_form"]),
    'band_gap':         ("default_mp.json", "mp_bandgap.ckpt", ["bandgap"]),
    'bulk_modulus':     ("default_mp.json", "mp_bulk_modulus.ckpt", ["bulk_modulus"]),
    'shear_modulus':    ("default_mp.json", "mp_shear_modulus.ckpt", ["shear_modulus"]),
    'e_hull_jarvis':    ("default_jarvis.json", "jarvis_ehull.ckpt", ["ehull"]),
}

for prop, (param_file, ckpt_file, targets) in checkpoints.items():
    param_path = os.path.join(repo, "params", "crystalframer", param_file)
    ckpt_path = os.path.join(weights, ckpt_file)
    params = Params(param_path)
    params.pretrained_model = ckpt_path
    params.targets = targets
    model = Latticeformer(params)
    
    ckpt = torch.load(ckpt_path, map_location='cpu')
    state_dict = ckpt['state_dict']
    prefix = 'swa_model.module.'
    model_dict = {k.replace(prefix, ''): v for k, v in state_dict.items() if k.startswith(prefix)}
    model.load_state_dict(model_dict)
    
    target_std = state_dict['target_std']
    target_mean = state_dict['target_mean']
    model.mlp[-1].load_state_dict({
        'weight': model.mlp[-1].weight * target_std[:, None],
        'bias': model.mlp[-1].bias * target_std + target_mean,
    })
    model.eval()
    print(f"Loaded {prop:18s} successfully!")

print("\nALL 5 CRYSTALFORMER MODELS LOADED AND READY!")
