import os
import math
import joblib
import warnings
import pandas as pd
import numpy as np
from fastapi import APIRouter, HTTPException, UploadFile, File, Form
from pymatgen.core import Structure

warnings.filterwarnings('ignore')

# Router tag groups it under Calculations when included in calculator_router.pyW
router = APIRouter(tags=["Calculations"])

MODELS_BASE = os.path.join(os.path.dirname(__file__), "../pretrained_models")

try:
    base_models = joblib.load(os.path.join(MODELS_BASE, 'v5_base_models.pkl'))
    
    # Exclude CatBoost base models to avoid strict string position compatibility errors
    if isinstance(base_models, dict):
        keys_to_remove = [k for k in base_models.keys() if 'catboost' in k.lower() or 'cat' in k.lower()]
        for k in keys_to_remove:
            print(f"Excluding CatBoost model key: {k}")
            base_models.pop(k, None)
            
    model_A = joblib.load(os.path.join(MODELS_BASE, 'v5_model2_A.pkl'))
    meta_Ea = joblib.load(os.path.join(MODELS_BASE, 'v5_meta_model.pkl'))
    mlp_models = joblib.load(os.path.join(MODELS_BASE, 'v5_mlp_models.pkl'))
    qt_transformer = joblib.load(os.path.join(MODELS_BASE, 'v5_quantile_transformer.pkl'))
    
    MODELS_LOADED = True
    print("v5 IonCast Ensembles loaded successfully (CatBoost excluded, LightGBM/MLP active).")
except Exception as e:
    MODELS_LOADED = False
    print(f"WARNING: Could not load v5 models: {e}")

try:
    from m3gnet_features import add_m3gnet_features
    M3GNET_AVAILABLE = True
except ImportError:
    M3GNET_AVAILABLE = False

N_MANUAL_PYMATGEN_FEATURES = 14

@router.post("/predict")
async def predict_conductivity(
    file: UploadFile = File(...),
    temperature: float = Form(298.15)
):
    if not MODELS_LOADED:
        raise HTTPException(status_code=500, detail="Prediction models are not loaded on the server.")
    if not file.filename.endswith('.cif'):
        raise HTTPException(status_code=400, detail="Only .cif files are supported.")

    temp_path = f"temp_{file.filename}"
    try:
        content = await file.read()
        with open(temp_path, "wb") as f:
            f.write(content)

        st = Structure.from_file(temp_path)
        comp = st.composition
        feats = {}
        canonical = {}

        def add(name, value, aliases=None):
            canonical[name] = value
            feats[name] = value
            if aliases:
                for a in aliases:
                    feats[a] = value

        def add_with_variants(name, val):
            clean_space = name.replace('_', ' ')
            clean_underscore = name.replace(' ', '_')
            add(name, val, aliases=[clean_space, clean_underscore, 'magpie_' + clean_space, 'magpie_' + clean_underscore])

        add('comp_li_fraction', comp.get_atomic_fraction('Li'), aliases=['li_fraction'])
        add('comp_n_elements', len(comp.elements), aliases=['n_elements'])
        add('comp_n_sites_ratio', comp.num_atoms / max(len(comp.elements), 1), aliases=['n_sites_ratio'])

        try:
            from matminer.featurizers.composition import ElementProperty
            ep = ElementProperty.from_preset('magpie')
            for l, v in zip(ep.feature_labels(), ep.featurize(comp)):
                add_with_variants(l, v)
        except Exception:
            pass

        try:
            from matminer.featurizers.composition import Stoichiometry, ValenceOrbital, IonProperty
            st_feat = Stoichiometry()
            for l, v in zip(st_feat.feature_labels(), st_feat.featurize(comp)):
                add_with_variants(l, v)
            vo_feat = ValenceOrbital()
            for l, v in zip(vo_feat.feature_labels(), vo_feat.featurize(comp)):
                add_with_variants(l, v)
            ip_feat = IonProperty()
            for l, v in zip(ip_feat.feature_labels(), ip_feat.featurize(comp)):
                add_with_variants(l, v)
        except Exception:
            pass

        add('cif_lat_a', st.lattice.a, aliases=['lat_a'])
        add('cif_lat_b', st.lattice.b, aliases=['lat_b'])
        add('cif_lat_c', st.lattice.c, aliases=['lat_c'])
        add('cif_lat_alpha', st.lattice.alpha, aliases=['lat_alpha'])
        add('cif_lat_beta', st.lattice.beta, aliases=['lat_beta'])
        add('cif_lat_gamma', st.lattice.gamma, aliases=['lat_gamma'])
        add('cif_lat_vol', st.lattice.volume, aliases=['lat_vol'])

        add('vol_per_atom', st.lattice.volume / max(st.num_sites, 1))
        add('n_sites', st.num_sites)
        li_sites = sum(1 for site in st if site.specie.symbol == 'Li')
        add('n_li_sites', li_sites)
        add('li_site_frac', li_sites / max(st.num_sites, 1))

        try:
            from matminer.featurizers.structure import DensityFeatures, GlobalSymmetryFeatures
            df_feat = DensityFeatures()
            for name, val in zip(df_feat.feature_labels(), df_feat.featurize(st)):
                add_with_variants(name, val)
            gs = GlobalSymmetryFeatures()
            for name, val in zip(gs.feature_labels(), gs.featurize(st)):
                add_with_variants(name, val)
        except Exception:
            pass

        n_m3gnet_dims = 0
        if M3GNET_AVAILABLE:
            feats, n_m3gnet_dims = add_m3gnet_features(feats, st)

        def build_aligned_dataframe(feature_dict, expected_cols):
            df_aligned = pd.DataFrame(columns=expected_cols)
            for col in expected_cols:
                col_space = col.replace('_', ' ')
                col_underscore = col.replace(' ', '_')
                
                if col in feature_dict:
                    df_aligned.loc[0, col] = feature_dict[col]
                elif col_space in feature_dict:
                    df_aligned.loc[0, col] = feature_dict[col_space]
                elif col_underscore in feature_dict:
                    df_aligned.loc[0, col] = feature_dict[col_underscore]
                else:
                    df_aligned.loc[0, col] = 0.0
            return df_aligned.astype(float)

        first_key = list(base_models.keys())[0]
        expected_cols_base = list(base_models[first_key].feature_name_) if hasattr(base_models[first_key], 'feature_name_') else list(base_models[first_key].feature_names_in_)
        expected_cols_A = list(model_A.feature_name_) if hasattr(model_A, 'feature_name_') else list(model_A.feature_names_in_)

        df_base = build_aligned_dataframe(feats, expected_cols_base)
        df_A = build_aligned_dataframe(feats, expected_cols_A)

        pred_A = model_A.predict(df_A)[0]

        total_base_count = len(base_models) + len(mlp_models)
        base_preds = np.zeros((1, total_base_count))
        idx = 0

        for name, model in base_models.items():
            expected = list(model.feature_names_in_) if hasattr(model, 'feature_names_in_') else expected_cols_base
            df_curr = build_aligned_dataframe(feats, expected)
            single_pred = float(model.predict(df_curr)[0])
            base_preds[:, idx] = single_pred
            idx += 1

        qt_expected = list(qt_transformer.feature_names_in_) if hasattr(qt_transformer, 'feature_names_in_') else expected_cols_base
        df_qt = build_aligned_dataframe(feats, qt_expected)
        X_qt = qt_transformer.transform(df_qt)
        
        for name, model in mlp_models.items():
            single_pred = float(model.predict(X_qt)[0])
            base_preds[:, idx] = single_pred
            idx += 1

        log_pred = meta_Ea.predict(base_preds)[0]
        pred_Ea = float(np.clip(np.expm1(log_pred) / 10.0, 0.005, 5.0))

        k_B = 8.617333262145e-5
        exponent = -pred_Ea / (k_B * temperature)
        A_prefactor = 10 ** pred_A
        cond = A_prefactor * math.exp(exponent)

        if os.path.exists(temp_path):
            os.remove(temp_path)

        return {
            "status": "success",
            "formula": comp.reduced_formula,
            "space_group": st.get_space_group_info()[0] if st.get_space_group_info() else "Unknown",
            "volume": float(st.lattice.volume),
            "density": float(st.density),
            "ea": float(pred_Ea),
            "conductivity": float(cond),
            "temp": temperature
        }

    except Exception as e:
        if os.path.exists(temp_path):
            os.remove(temp_path)
        raise HTTPException(status_code=500, detail=str(e))