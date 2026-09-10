#!/usr/bin/env python3
"""
GPU Status and Memory Check Script
"""
import sys
import os

sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", "backend"))

def check_gpu():
    print("=" * 60)
    print(" IndianMatter GPU Monitoring & Diagnostics")
    print("=" * 60)

    try:
        import torch
        cuda_avail = torch.cuda.is_available()
        print(f"PyTorch Version       : {torch.__version__}")
        print(f"CUDA Available        : {cuda_avail}")
        if cuda_avail:
            print(f"CUDA Device Count     : {torch.cuda.device_count()}")
            print(f"Current Device Index  : {torch.cuda.current_device()}")
            print(f"GPU Device Name       : {torch.cuda.get_device_name(0)}")
            mem_total = torch.cuda.get_device_properties(0).total_memory / (1024 ** 3)
            mem_alloc = torch.cuda.memory_allocated(0) / (1024 ** 3)
            mem_res = torch.cuda.memory_reserved(0) / (1024 ** 3)
            print(f"Total VRAM            : {mem_total:.2f} GB")
            print(f"Allocated VRAM        : {mem_alloc:.2f} GB")
            print(f"Reserved VRAM         : {mem_res:.2f} GB")
        else:
            print("System is operating in CPU Fallback Mode.")
    except Exception as e:
        print(f"GPU Check Error: {e}")

    try:
        import psutil
        ram_gb = psutil.virtual_memory().total / (1024 ** 3)
        ram_used = psutil.virtual_memory().used / (1024 ** 3)
        print(f"System RAM            : {ram_used:.2f} GB / {ram_gb:.2f} GB ({psutil.virtual_memory().percent}% used)")
    except Exception:
        pass

    print("=" * 60)
    return 0

if __name__ == "__main__":
    sys.exit(check_gpu())
