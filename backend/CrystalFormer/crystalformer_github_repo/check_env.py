"""Environment check:  python check_env.py   (inside the Docker container or the conda environment)."""
import importlib, sys

print("python", sys.version.split()[0])
mods = ["numpy", "pandas", "scipy", "sklearn", "torch", "torch_scatter", "torch_sparse", "torch_cluster",
        "torch_geometric", "cupy", "pymatgen.core", "requests"]
bad = []
for m in mods:
    try:
        mod = importlib.import_module(m)
        print(f"  ok       {m:<16} {getattr(mod, '__version__', '')}")
    except Exception as e:
        print(f"  MISSING  {m:<16} {type(e).__name__}: {str(e)[:90]}")
        bad.append(m)

try:
    import torch
    ok = torch.cuda.is_available()
    print("GPU visible:", ok)
    if ok:
        p = torch.cuda.get_device_properties(0)
        print(f"  {p.name} | {p.total_memory / 2**30:.0f} GB | compute capability {p.major}.{p.minor} | torch built for CUDA {torch.version.cuda}")
    else:
        bad.append("GPU")
    import cupy
    if ok:
        k = cupy.ElementwiseKernel("float32 x", "float32 y", "y = x * 2", "env_check_kernel")
        x = cupy.arange(4, dtype=cupy.float32)
        good = bool((k(x) == x * 2).all())
        print("cupy kernel compile + run:", "OK" if good else "WRONG RESULT")
        if not good:
            bad.append("cupy-kernel")
except Exception as e:
    print("GPU / cupy test failed:", type(e).__name__, str(e)[:200])
    bad.append("gpu-test")

print("\nENV", "OK" if not bad else f"PROBLEM with: {bad}")
sys.exit(1 if bad else 0)
