"""Draft v5 feature extraction (superseded by model_service.extract_features).

Role in the system
------------------
Early feature-extraction sketch used during v5 development. Superseded by
``backend/model_service.extract_features`` + ``backend/cif_descriptors``.
Kept for reference; not on the live request path.
"""

import numpy as np  # numerical feature transforms
import pandas as pd
from pymatgen.core import Structure

def extract_v5_features(cif_string: str) -> pd.DataFrame:
    """
    Takes a raw CIF string from Materials Project, parses it with Pymatgen,
    and extracts the feature columns required by the v5 model stack.
    """
    # 1. Parse the CIF string into a Pymatgen Structure object
    struct = Structure.from_str(cif_string, fmt="cif")
    
    features = {}
    
    # --- Structural/Geometric Feature Extraction Examples ---
    features["density"] = struct.density
    features["volume"] = struct.volume
    features["volume_per_atom"] = struct.volume / len(struct)
    features["num_sites"] = len(struct)
    
    # Lattice parameters
    features["lattice_a"] = struct.lattice.a
    features["lattice_b"] = struct.lattice.b
    features["lattice_c"] = struct.lattice.c
    features["alpha"] = struct.lattice.alpha
    features["beta"] = struct.lattice.beta
    features["gamma"] = struct.lattice.gamma
    
    # --- Compositional Feature Extraction Examples ---
    comp = struct.composition
    features["weight"] = comp.weight
    features["num_elements"] = len(comp.elements)
    
    # Element fractional attributes (e.g., Fraction of Lithium for Solid State Electrolytes)
    features["li_fraction"] = comp.get_atomic_fraction("Li")
    
    # NOTE: Since your training set requires 343 specific columns (Magpie descriptors, etc.),
    # we will initialize the remaining required benchmark columns to match your exact v5 feature list.
    
    # Convert to DataFrame (single row)
    df_features = pd.DataFrame([features])
    
    return df_features