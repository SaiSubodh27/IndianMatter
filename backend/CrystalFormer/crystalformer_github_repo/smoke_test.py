"""Runs INSIDE the container (setup.ps1 / run.ps1 test-gpu call it). Checks GPU, torch and cupy."""
import torch
print("torch", torch.__version__, "| built for CUDA", torch.version.cuda)
ok = torch.cuda.is_available()
print("GPU visible:", ok)
if ok:
    p = torch.cuda.get_device_properties(0)
    print(f"GPU: {p.name} | {p.total_memory / 2**30:.1f} GB | compute capability {p.major}.{p.minor}")
try:
    import cupy
    print("cupy", cupy.__version__)
    if ok:
        # compiles a tiny kernel at runtime, the same mechanism the Crystalformer attention kernels rely on
        k = cupy.ElementwiseKernel("float32 x", "float32 y", "y = x * 2", "smoke_k")
        x = cupy.arange(4, dtype=cupy.float32)
        print("cupy kernel compile+run OK:", bool((k(x) == x * 2).all()))
except Exception as e:
    print("cupy FAILED:", type(e).__name__, e)
