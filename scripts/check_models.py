#!/usr/bin/env python3
"""
Model Installation and Capability Check Script
Inspects M3GNet, CHGNet, MACE, and surrogate model registry availability.
"""
import sys
import os

# Add backend directory to sys.path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", "backend"))

def check_models():
    print("=" * 60)
    print(" IndianMatter Model Availability & Capability Probe")
    print("=" * 60)

    try:
        from core.device_manager import get_device_info
        device_info = get_device_info()
        print(f"Target Compute Device: {device_info['selected_device']} (GPU Available: {device_info['gpu_available']})")
    except Exception as e:
        print(f"Device Manager check notice: {e}")

    try:
        from prediction_models.model_registry import model_registry
        statuses = model_registry.get_all_statuses()
        print("\nRegistered Models Status:")
        for model_key, info in statuses.items():
            avail = "[AVAILABLE]" if info["available"] else "[UNAVAILABLE]"
            print(f" - {info['name']:<12} ({model_key}): {avail}")
            print(f"     Capabilities: {', '.join(info.get('capabilities', []))}")
            if not info["available"]:
                print(f"     Installation Warning: {info.get('error', 'Package not installed')}")
    except Exception as e:
        print(f"Could not initialize Model Registry: {e}")
        return 1

    print("=" * 60)
    return 0

if __name__ == "__main__":
    sys.exit(check_models())
