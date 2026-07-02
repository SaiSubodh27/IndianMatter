import os
import math
import pandas as pd
import numpy as np
import warnings
import joblib

warnings.filterwarnings('ignore')

try:
    from pymatgen.core import Structure
    from matminer.featurizers.structure import DensityFeatures, GlobalSymmetryFeatures
    from matminer.featurizers.composition import ElementProperty
except ImportError:
    print("Missing required libraries. Please install pymatgen and matminer.")
    sys.exit(1)

print("Loading models (this will take a few seconds)...")
base_dir = "backend/Surrogative_models"
base_models = joblib.load(os.path.join(base_dir, "v5_base_models.pkl"))
mlp_models = joblib.load(os.path.join(base_dir, "v5_mlp_models.pkl"))
meta_model = joblib.load(os.path.join(base_dir, "v5_meta_model.pkl"))
model_A = joblib.load(os.path.join(base_dir, "v5_model2_A.pkl"))

# Pre-load known robust expected cols if shape matching is needed
try:
    import pickle
    with open(os.path.join(base_dir, 'base_cols.pkl'), 'rb') as f:
        expected_cols_base = pickle.load(f)
    with open(os.path.join(base_dir, 'a_cols.pkl'), 'rb') as f:
        expected_cols_a = pickle.load(f)
except:
    expected_cols_base = base_models['lgb'].feature_name_
    expected_cols_a = model_A.feature_name_

print("Models loaded successfully!\n")
print("-" * 50)

def predict(cif_path):
    try:
        st = Structure.from_file(cif_path)
        comp = st.composition
    except Exception as e:
        return f"Failed to parse CIF: {e}"

    feats = {}
    # 1. MAGPIE and COMP
    try:
        ep = ElementProperty.from_preset('magpie')
        for l, v in zip(ep.feature_labels(), ep.featurize(comp)):
            feats['magpie_' + l] = v
    except: pass
    try:
        feats['comp_li_fraction'] = comp.get_atomic_fraction('Li')
        feats['comp_n_elements'] = len(comp.elements)
        feats['comp_n_sites_ratio'] = comp.num_atoms / max(len(comp.elements), 1)
    except: pass

    # 2. CIF features
    feats['cif_lat_a'] = st.lattice.a
    feats['cif_lat_b'] = st.lattice.b
    feats['cif_lat_c'] = st.lattice.c
    feats['cif_lat_alpha'] = st.lattice.alpha
    feats['cif_lat_beta'] = st.lattice.beta
    feats['cif_lat_gamma'] = st.lattice.gamma
    feats['cif_lat_vol'] = st.lattice.volume
    try:
        df_feat = DensityFeatures()
        for n, v in zip(df_feat.feature_labels(), df_feat.featurize(st)):
            feats['cif_dens_' + n] = v
    except: pass
    try:
        gs_feat = GlobalSymmetryFeatures()
        for n, v in zip(gs_feat.feature_labels(), gs_feat.featurize(st)):
            feats['cif_sym_' + n] = v
    except: pass

    df = pd.DataFrame([feats])
    
    for col in expected_cols_base:
        if col not in df.columns: df[col] = 0.0
    for col in expected_cols_a:
        if col not in df.columns: df[col] = 0.0
        
    df_base = df[expected_cols_base]
    df_a = df[expected_cols_a]
    
    pred_A = float(model_A.predict(df_a)[0])
    
    X_meta = pd.DataFrame()
    for name, m in base_models.items():
        X_meta[name] = m.predict(df_base)
    for name, m in mlp_models.items():
        X_meta[name] = m.predict(df_base)
    
    pred_Ea = float(meta_model.predict(X_meta)[0])
        
    k_B = 8.617333262145e-5
    TEMP = 298.15
    A_real = 10 ** pred_A
    cond = A_real * math.exp(-pred_Ea / (k_B * TEMP))
    
    return f"Results for {cif_path}:\n  log10(A) = {pred_A:.4f}\n  Ea (eV)  = {pred_Ea:.4f}\n  Conductivity (S/cm) = {cond:.4e}"

if __name__ == "__main__":
    while True:
        cif = input("Enter path to a .cif file (or 'q' to quit): ").strip()
        if cif.lower() in ['q', 'quit', 'exit', '']:
            break
            
        # Strip quotes if copied directly from explorer
        cif = cif.strip('"').strip("'")
        
        if not os.path.exists(cif):
            print(f"File not found: {cif}\n")
            continue
        
        res = predict(cif)
        print("\n" + res + "\n" + "-" * 50)
