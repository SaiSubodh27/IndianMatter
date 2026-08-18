import os
import math
import joblib
import warnings
import pandas as pd
import numpy as np
from flask import Flask, request, jsonify
from flask_cors import CORS
from pymatgen.core import Structure

warnings.filterwarnings('ignore')

try:
    from matminer.featurizers.composition import ElementProperty
    from matminer.featurizers.structure import DensityFeatures, GlobalSymmetryFeatures
except ImportError:
    print('WARNING: matminer missing')

app = Flask(__name__)
# Enable CORS so the HTML file can make requests to this API
CORS(app)

print("Loading Machine Learning Models...")
base_dir = os.path.dirname(os.path.abspath(__file__))
models_dir = os.path.join(base_dir, "..", "final_models", "pretrained_models")
if not os.path.exists(models_dir):
    models_dir = os.path.join(base_dir, "final_models", "pretrained_models")
if not os.path.exists(models_dir):
    models_dir = "final_models/pretrained_models"

base_models = joblib.load(os.path.join(models_dir, 'v5_base_models.pkl'))
model_A = joblib.load(os.path.join(models_dir, 'v5_model2_A.pkl'))
meta_Ea = joblib.load(os.path.join(models_dir, 'v5_meta_model.pkl'))
mlp_models = joblib.load(os.path.join(models_dir, 'v5_mlp_models.pkl'))
qt_transformer = joblib.load(os.path.join(models_dir, 'v5_quantile_transformer.pkl'))
print(f"Matrix and Ensembles Loaded successfully from {os.path.abspath(models_dir)}.")

def extract_all_features_from_cif(cif_path):
    st = Structure.from_file(cif_path)
    comp = st.composition
    feats = {}

    feats['comp_li_fraction'] = comp.get_atomic_fraction('Li')
    feats['comp_n_elements'] = len(comp.elements)
    feats['comp_n_sites_ratio'] = comp.num_atoms / max(len(comp.elements), 1)

    feats['li_fraction'] = feats['comp_li_fraction']
    feats['n_elements'] = feats['comp_n_elements']
    feats['n_sites_ratio'] = feats['comp_n_sites_ratio']

    try:
        ep = ElementProperty.from_preset('magpie')
        for l, v in zip(ep.feature_labels(), ep.featurize(comp)):
            feats['magpie_' + l] = v
            feats['ep_MagpieData_' + l] = v
            feats['MagpieData ' + l] = v
            feats[l] = v
    except Exception: pass

    try:
        from matminer.featurizers.composition import Stoichiometry, ValenceOrbital, IonProperty
        st_feat = Stoichiometry()
        for l, v in zip(st_feat.feature_labels(), st_feat.featurize(comp)):
            feats[l] = v
            feats['stoich_' + l] = v

        vo_feat = ValenceOrbital()
        for l, v in zip(vo_feat.feature_labels(), vo_feat.featurize(comp)):
            feats['vo_' + l] = v
            feats[l] = v

        ip_feat = IonProperty()
        for l, v in zip(ip_feat.feature_labels(), ip_feat.featurize(comp)):
            feats['ip_' + l] = v
            feats[l] = v
    except Exception: pass

    feats['cif_lat_a'] = st.lattice.a
    feats['cif_lat_b'] = st.lattice.b
    feats['cif_lat_c'] = st.lattice.c
    feats['cif_lat_alpha'] = st.lattice.alpha
    feats['cif_lat_beta'] = st.lattice.beta
    feats['cif_lat_gamma'] = st.lattice.gamma
    feats['cif_lat_vol'] = st.lattice.volume

    feats['lat_a'] = st.lattice.a
    feats['lat_b'] = st.lattice.b
    feats['lat_c'] = st.lattice.c
    feats['lat_alpha'] = st.lattice.alpha
    feats['lat_beta'] = st.lattice.beta
    feats['lat_gamma'] = st.lattice.gamma
    feats['lat_vol'] = st.lattice.volume
    feats['vol_per_atom'] = st.lattice.volume / max(st.num_sites, 1)
    feats['n_sites'] = st.num_sites
    li_sites = sum(1 for site in st if site.specie.symbol == 'Li')
    feats['n_li_sites'] = li_sites
    feats['li_site_frac'] = li_sites / max(st.num_sites, 1)

    try:
        df_feat = DensityFeatures()
        for name, val in zip(df_feat.feature_labels(), df_feat.featurize(st)):
            feats['cif_dens_' + name] = val
            feats['dens_' + name] = val
            feats[name] = val
    except Exception: pass

    try:
        gs = GlobalSymmetryFeatures()
        for name, val in zip(gs.feature_labels(), gs.featurize(st)):
            feats['cif_sym_' + name] = val
            feats['sym_' + name] = val
            feats[name] = val
    except Exception: pass

    return st, comp, feats

def build_aligned_dataframe(feats, expected_cols):
    df_aligned = pd.DataFrame(columns=expected_cols)
    for col in expected_cols:
        col_mod1 = col.replace(' ', '_')
        col_mod2 = col.replace('_', ' ')
        if col in feats:
            df_aligned.loc[0, col] = feats[col]
        elif col_mod1 in feats:
            df_aligned.loc[0, col] = feats[col_mod1]
        elif col_mod2 in feats:
            df_aligned.loc[0, col] = feats[col_mod2]
        else:
            df_aligned.loc[0, col] = 0.0
    return df_aligned.astype(float)

@app.route('/predict', methods=['POST'])
def predict():
    if 'file' not in request.files:
        return jsonify({"error": "No .cif file uploaded"}), 400
    
    file = request.files['file']
    temp_k = float(request.form.get('temperature', 298.15))
    
    temp_path = "temp_uploaded.cif"
    file.save(temp_path)
    
    try:
        st, comp, feats = extract_all_features_from_cif(temp_path)
        formula = comp.reduced_formula

        expected_cols_base = base_models['lgb'].feature_name_
        expected_cols_A = model_A.feature_name_
        
        df_base = build_aligned_dataframe(feats, expected_cols_base)
        df_A = build_aligned_dataframe(feats, expected_cols_A)
        
        pred_A = model_A.predict(df_A)[0]
        
        base_preds = np.zeros((1, len(base_models) + len(mlp_models)))
        idx = 0
        for name, model in base_models.items():
            if hasattr(model, 'feature_names_in_'): expected = list(model.feature_names_in_)
            elif hasattr(model, 'get_booster'): expected = list(model.get_booster().feature_names)
            elif hasattr(model, 'feature_names_'): expected = list(model.feature_names_)
            elif hasattr(model, 'feature_name_'): expected = list(model.feature_name_)
            else: expected = list(expected_cols_base)
                
            df_curr = build_aligned_dataframe(feats, expected)
            base_preds[:, idx] = model.predict(df_curr)[0]
            idx += 1
            
        qt_expected = list(qt_transformer.feature_names_in_) if hasattr(qt_transformer, 'feature_names_in_') else list(expected_cols_base)
        df_qt = build_aligned_dataframe(feats, qt_expected)

        X_qt = qt_transformer.transform(df_qt)
        for name, model in mlp_models.items():
            base_preds[:, idx] = model.predict(X_qt)[0]
            idx += 1
            
        log_pred = meta_Ea.predict(base_preds)[0]
        pred_Ea = np.clip(np.expm1(log_pred) / 10.0, 0.005, 5.0)
        
        k_B = 8.617333262145e-5
        cond = (10 ** pred_A) * math.exp(-pred_Ea / (k_B * temp_k))
        
        if os.path.exists(temp_path):
            os.remove(temp_path)
            
        return jsonify({
            "status": "success",
            "formula": formula,
            "space_group": st.get_space_group_info()[0],
            "volume": float(st.lattice.volume),
            "density": float(st.density),
            "ea": float(pred_Ea),
            "conductivity": float(cond),
            "temp": temp_k
        })
        
    except Exception as e:
        if os.path.exists(temp_path):
            os.remove(temp_path)
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(port=5000, debug=False)