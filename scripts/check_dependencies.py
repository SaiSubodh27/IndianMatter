#!/usr/bin/env python3
"""
Dependency Health-Check Script
Verifies installation and version status of core scientific Python libraries
and atomistic machine learning packages for the IndianMatter property prediction pipeline.
"""
import sys

def check_dependencies():
    print("=" * 60)
    print(" IndianMatter Materials Prediction Dependency Health Check")
    print("=" * 60)
    print(f"Python Version: {sys.version.split()[0]} ({sys.executable})\n")

    required_packages = [
        ("numpy", "NumPy"),
        ("pandas", "Pandas"),
        ("scipy", "SciPy"),
        ("sklearn", "Scikit-Learn"),
        ("torch", "PyTorch"),
        ("pymatgen", "Pymatgen"),
        ("matminer", "Matminer"),
        ("ase", "ASE"),
        ("spglib", "Spglib"),
        ("psutil", "psutil"),
        ("joblib", "joblib"),
        ("tqdm", "tqdm"),
        ("pydantic", "Pydantic"),
        ("fastapi", "FastAPI"),
    ]

    optional_models = [
        ("chgnet", "CHGNet (chgnet)"),
        ("matgl", "M3GNet (matgl / m3gnet)"),
        ("mace", "MACE (mace-torch)"),
    ]

    all_passed = True
    print("--- Required Core Libraries ---")
    for pkg, label in required_packages:
        try:
            m = __import__(pkg)
            ver = getattr(m, "__version__", "installed")
            print(f" [OK] {label:<25} Version: {ver}")
        except Exception as e:
            print(f" [FAIL] {label:<25} NOT INSTALLED ({e})")
            all_passed = False

    print("\n--- Atomistic GNN Model Packages (Optional / Capability-Aware) ---")
    for pkg, label in optional_models:
        try:
            m = __import__(pkg)
            ver = getattr(m, "__version__", "installed")
            print(f" [AVAILABLE] {label:<25} Version: {ver}")
        except Exception as e:
            print(f" [UNAVAILABLE] {label:<25} {e} (Fallback to surrogate/descriptor mode)")

    print("\n" + "=" * 60)
    if all_passed:
        print(" Core dependency check PASSED cleanly!")
    else:
        print(" Some required core dependencies are missing.")
    print("=" * 60)
    return 0 if all_passed else 1

if __name__ == "__main__":
    sys.exit(check_dependencies())
