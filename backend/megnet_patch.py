import pymatgen.analysis.local_env

# 1. Create a dummy class to replace the deleted pymatgen algorithms
class _DummyNN: pass

# 2. List all the algorithms MEGNet looks for that no longer exist
_missing_env_classes = [
    'BrunnerNN_real', 'BrunnerNN_reciprocal', 'BrunnerNN_relative', 
    'EconNN', 'MinimumOKeeffeNN', 'MinimumVIRENN'
]

# 3. Inject them into pymatgen's namespace BEFORE megnet tries to load them
for _cls in _missing_env_classes:
    if not hasattr(pymatgen.analysis.local_env, _cls):
        setattr(pymatgen.analysis.local_env, _cls, _DummyNN)

if not hasattr(pymatgen.analysis.local_env, 'cutoff_radius_class_dict'):
    setattr(pymatgen.analysis.local_env, 'cutoff_radius_class_dict', {})