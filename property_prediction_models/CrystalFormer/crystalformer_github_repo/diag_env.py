"""Runs INSIDE the container: .\run.ps1 diag   -- finds out why `import pandas` fails."""
import os, subprocess, sys

REPO = os.environ.get("CF_REPO_DIR", "/workspace")

def run(label, code, cwd):
    print(f"\n=== {label} (cwd={cwd}) ===", flush=True)
    r = subprocess.run([sys.executable, "-c", code], cwd=cwd, capture_output=True, text=True)
    print((r.stdout + r.stderr).strip()[-1800:] or "(no output)", flush=True)

show = "import numpy, pandas; print('numpy', numpy.__version__, numpy.__file__); print('pandas', pandas.__version__, pandas.__file__)"
run("1. import from a clean folder", show, "/tmp")
run("2. import the way predict_5_properties.py does (repo first on path)",
    f"import sys; sys.path.insert(0, {REPO!r}); " + show, REPO)

print("\n=== 3. repo files/folders whose name matches an installed package (possible shadowing) ===")
names = sorted({os.path.splitext(n)[0] for n in os.listdir(REPO) if not n.startswith((".", "__"))})
code = ("import importlib.util as u, sys; sys.path[:] = [p for p in sys.path if p not in ('', %r)];"
        "print([n for n in %r if u.find_spec(n) is not None])" % (REPO, names))
r = subprocess.run([sys.executable, "-c", code], cwd="/tmp", capture_output=True, text=True)
print((r.stdout + r.stderr).strip())

print("\n=== 4. installed versions ===")
r = subprocess.run([sys.executable, "-m", "pip", "list"], capture_output=True, text=True)
keys = ("numpy", "pandas", "scipy", "pymatgen", "torch", "cupy", "scikit", "matplotlib", "spglib")
print("\n".join(l for l in r.stdout.splitlines() if l.lower().startswith(keys)))
