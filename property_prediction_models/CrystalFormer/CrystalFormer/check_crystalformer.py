import os
import sys

repo_dir = r"c:\Users\Shannu\OneDrive\ドキュメント\Crystal\CrystalFormer\crystalframer"
weights_dir = r"c:\Users\Shannu\OneDrive\ドキュメント\Crystal\CrystalFormer\crystalframer_weights\crystalframer_weights"

print("=" * 60)
print("CRYSTALFORMER CONNECTIVITY CHECK")
print("=" * 60)

# 1. Directory Checks
print(f"1. Repo Directory: {'EXISTS' if os.path.isdir(repo_dir) else 'MISSING'}")
print(f"2. Weights Directory: {'EXISTS' if os.path.isdir(weights_dir) else 'MISSING'}")

# 2. Checkpoint & Param Checks
checkpoints = {
    'formation_energy': ("default_mp.json", "mp_e_form.ckpt"),
    'band_gap':         ("default_mp.json", "mp_bandgap.ckpt"),
    'bulk_modulus':     ("default_mp.json", "mp_bulk_modulus.ckpt"),
    'shear_modulus':    ("default_mp.json", "mp_shear_modulus.ckpt"),
    'e_hull_jarvis':    ("default_jarvis.json", "jarvis_ehull.ckpt"),
}

print("\n3. Checkpoints & Parameters:")
for prop, (param_file, ckpt_file) in checkpoints.items():
    p_path = os.path.join(repo_dir, "params", "crystalframer", param_file)
    c_path = os.path.join(weights_dir, ckpt_file)
    p_status = "OK" if os.path.exists(p_path) else "MISSING"
    c_status = "OK" if os.path.exists(c_path) else "MISSING"
    print(f"   - {prop:18s} | Param: {p_status:7s} ({param_file}) | Ckpt: {c_status:7s} ({ckpt_file})")

# 3. Python Packages Check
print("\n4. Required Python Packages:")
packages = ['torch', 'torch_geometric', 'torch_scatter', 'pymatgen', 'ase', 'chgnet']
for pkg in packages:
    try:
        m = __import__(pkg)
        ver = getattr(m, '__version__', 'available')
        print(f"   - {pkg:18s}: INSTALLED ({ver})")
    except ImportError:
        print(f"   - {pkg:18s}: NOT INSTALLED")
    except Exception as e:
        print(f"   - {pkg:18s}: ERROR ({e})")
print("=" * 60)
