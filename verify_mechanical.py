import sys

print("1. Checking package imports...")
try:
    from pymatgen.core import Structure
    from chgnet.model.model import CHGNet
    print("✅ Packages successfully imported!")
except ImportError as e:
    print(f"❌ Import failed: {e}")
    sys.exit(1)

print("\n2. Loading CHGNet model weights...")
try:
    model = CHGNet.load()
    print("✅ CHGNet model loaded successfully!")
except Exception as e:
    print(f"❌ Failed to load model weights: {e}")
    sys.exit(1)

print("\n3. Testing stress tensor generation (Required for mechanical properties)...")
# Simple Lithium BCC crystal CIF
cif =  """data_Li
_cell_length_a 3.49
_cell_length_b 3.49
_cell_length_c 3.49
_cell_angle_alpha 90
_cell_angle_beta 90
_cell_angle_gamma 90
_symmetry_space_group_name_H-M 'I m -3 m'
loop_
_atom_site_label
_atom_site_type_symbol
_atom_site_fract_x
_atom_site_fract_y
_atom_site_fract_z
Li1 Li 0.0 0.0 0.0"""

try:
    structure = Structure.from_str(cif, fmt="cif")
    prediction = model.predict_structure(structure)
    print("✅ Inference successful!")
    print(f"   -> Stress tensor computed: {prediction['s'].tolist()}")
except Exception as e:
    print(f"❌ Inference failed: {e}")