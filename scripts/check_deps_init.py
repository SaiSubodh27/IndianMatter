import sys

libs = [
    'torch', 'pymatgen', 'matminer', 'ase', 'chgnet', 'm3gnet', 'mace', 
    'scipy', 'sklearn', 'pydantic', 'fastapi', 'psutil', 'spglib', 'joblib', 'tqdm'
]

print("Python version:", sys.version, flush=True)
for lib in libs:
    try:
        m = __import__(lib)
        ver = getattr(m, '__version__', 'installed')
        print(f"{lib}: {ver}", flush=True)
    except Exception as e:
        print(f"{lib}: NOT INSTALLED ({e})", flush=True)
