"""Compatibility patch for ``pymatgen`` API changes that break MEGNet imports.

Role in the system
------------------
Newer pymatgen versions removed several legacy "nearest-neighbor" classes
from ``pymatgen.analysis.local_env`` (BrunnerNN_*, EconNN, MinimumOKeeffeNN,
MinimumVIRENN, ...). MEGNet (and some older matminer code paths) still
references those names at import time, so importing them crashes with
AttributeError. This module injects harmless dummy classes *before* MEGNet
is imported, satisfying the attribute lookups without changing any behavior.

Usage: ``import megnet_patch`` must run BEFORE ``import megnet`` anywhere in
the codebase (typically at the top of a backend entry point or training
script). Importing this module has no other side effects.

Inputs  : none.
Outputs : mutated ``pymatgen.analysis.local_env`` namespace (dummy classes
          + an empty ``cutoff_radius_class_dict`` mapping).
"""

# Import the module whose namespace we are going to patch. This must happen
# first so the subsequent setattr calls target the right object.
import pymatgen.analysis.local_env

# 1. Create a dummy class to replace the deleted pymatgen algorithms.
#    It is intentionally empty: MEGNet only needs the *name* to exist; it
#    never instantiates these classes in the code paths we exercise.
class _DummyNN:
    pass

# 2. List all the algorithms MEGNet looks for that no longer exist in
#    modern pymatgen. Keep this list in sync if new AttributeErrors appear.
_missing_env_classes = [
    'BrunnerNN_real', 'BrunnerNN_reciprocal', 'BrunnerNN_relative',
    'EconNN', 'MinimumOKeeffeNN', 'MinimumVIRENN'
]

# 3. Inject them into pymatgen's namespace BEFORE megnet tries to load them.
#    Only set attributes that are missing, so a future pymatgen that re-adds
#    them keeps its real implementation.
for _cls in _missing_env_classes:
    if not hasattr(pymatgen.analysis.local_env, _cls):
        setattr(pymatgen.analysis.local_env, _cls, _DummyNN)

# MEGNet also expects a cutoff-radius dispatch dict; provide an empty one.
if not hasattr(pymatgen.analysis.local_env, 'cutoff_radius_class_dict'):
    setattr(pymatgen.analysis.local_env, 'cutoff_radius_class_dict', {})
