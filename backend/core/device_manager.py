"""Device (CPU/GPU) introspection helpers for the prediction pipeline.

Role in the system
------------------
Used by the unwired prediction pipeline (workers/prediction_worker.py) and
scripts/check_models.py to probe torch/psutil availability and select a
compute device. Imports torch and psutil optionally so the module still
imports when they are absent.
"""

import sys  # sys.path / platform info for device probing

try:
    import psutil
    PSUTIL_AVAILABLE = True
except ImportError:
    psutil = None
    PSUTIL_AVAILABLE = False

try:
    import torch
    TORCH_AVAILABLE = True
except ImportError:
    TORCH_AVAILABLE = False

def get_device_info(selected_device: str = "auto") -> dict:
    gpu_available = False
    gpu_name = "N/A"
    gpu_count = 0
    alloc_mem_mb = 0.0
    total_mem_mb = 0.0
    free_mem_mb = 0.0
    gpu_list = []

    if TORCH_AVAILABLE and torch.cuda.is_available():
        gpu_available = True
        gpu_count = torch.cuda.device_count()
        for idx in range(gpu_count):
            name = torch.cuda.get_device_name(idx)
            props = torch.cuda.get_device_properties(idx)
            tot = props.total_memory / (1024 ** 2)
            gpu_list.append({"index": idx, "name": name, "total_memory_mb": round(tot, 1)})
        
        current_idx = 0
        if selected_device.startswith("cuda:"):
            try:
                current_idx = int(selected_device.split(":")[1])
            except ValueError:
                current_idx = 0
        
        gpu_name = torch.cuda.get_device_name(current_idx)
        total_mem_mb = torch.cuda.get_device_properties(current_idx).total_memory / (1024 ** 2)
        alloc_mem_mb = torch.cuda.memory_allocated(current_idx) / (1024 ** 2)
        free_mem_mb = total_mem_mb - alloc_mem_mb

    if selected_device == "auto":
        target = "cuda:0" if gpu_available else "cpu"
    elif selected_device in ("cuda", "gpu"):
        target = "cuda:0" if gpu_available else "cpu"
    elif selected_device.startswith("cuda:"):
        target = selected_device if gpu_available else "cpu"
    else:
        target = "cpu"

    if PSUTIL_AVAILABLE:
        sys_ram = psutil.virtual_memory()
        ram_total_gb = round(sys_ram.total / (1024 ** 3), 2)
        ram_used_gb = round(sys_ram.used / (1024 ** 3), 2)
        ram_percent = sys_ram.percent
    else:
        ram_total_gb = 0.0
        ram_used_gb = 0.0
        ram_percent = None

    return {
        "gpu_available": gpu_available,
        "gpu_count": gpu_count,
        "gpu_name": gpu_name,
        "gpu_list": gpu_list,
        "selected_device": target,
        "allocated_vram_mb": round(alloc_mem_mb, 1),
        "total_vram_mb": round(total_mem_mb, 1),
        "free_vram_mb": round(free_mem_mb, 1),
        "cpu_fallback": not gpu_available or target == "cpu",
        "system_ram_total_gb": ram_total_gb,
        "system_ram_used_gb": ram_used_gb,
        "system_ram_percent": ram_percent,
        "system_monitoring_available": PSUTIL_AVAILABLE,
    }

def get_torch_device(requested: str = "auto"):
    if not TORCH_AVAILABLE:
        return "cpu"
    if requested == "auto":
        return torch.device("cuda:0" if torch.cuda.is_available() else "cpu")
    if requested in ("cuda", "gpu") or requested.startswith("cuda:"):
        if torch.cuda.is_available():
            return torch.device(requested if ":" in requested else "cuda:0")
        return torch.device("cpu")
    return torch.device("cpu")
