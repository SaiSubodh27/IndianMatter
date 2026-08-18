import json
import math
import sys
import warnings
from pathlib import Path

import joblib
import numpy as np
import pandas as pd

warnings.filterwarnings("ignore")

from pymatgen.core import Structure

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT))

with open(ROOT / "configs" / "paths.json", encoding="utf-8") as handle:
    CONFIG = json.load(handle)

try:
    from matminer.featurizers.composition import ElementProperty
    from matminer.featurizers.structure import DensityFeatures, GlobalSymmetryFeatures
except ImportError:
    ElementProperty = None
    DensityFeatures = None
    GlobalSymmetryFeatures = None

MODELS_DIR = (ROOT / CONFIG["models_dir"]).resolve()
TARGET_CIF = (ROOT / CONFIG["target_cif"]).resolve()


def resolve_cif_path(cif_path):
    path = Path(cif_path)
    if path.is_absolute():
        return path if path.exists() else None
    candidates = [
        ROOT / path,
        ROOT / "cifs" / path.name,
        ROOT / "cif_files" / path.name,
        ROOT / "datasets" / path.name,
        path,
    ]
    for candidate in candidates:
        if candidate.exists():
            return candidate.resolve()
    return None


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

def align_and_predict(cif_path):
    resolved_path = resolve_cif_path(cif_path)
    if resolved_path is None:
        raise FileNotFoundError(f"Could not locate CIF input: {cif_path}")

    st, comp, feats = extract_all_features_from_cif(str(resolved_path))

    try:
        base_models = joblib.load(MODELS_DIR / "v5_base_models.pkl")
        model_A = joblib.load(MODELS_DIR / "v5_model2_A.pkl")
        meta_Ea = joblib.load(MODELS_DIR / "v5_meta_model.pkl")
        mlp_models = joblib.load(MODELS_DIR / "v5_mlp_models.pkl")
        qt_transformer = joblib.load(MODELS_DIR / "v5_quantile_transformer.pkl")

        expected_cols_base = base_models["lgb"].feature_name_
        expected_cols_A = model_A.feature_name_

        df_base = build_aligned_dataframe(feats, expected_cols_base)
        df_A = build_aligned_dataframe(feats, expected_cols_A)

        pred_A = model_A.predict(df_A)[0]

        base_preds = np.zeros((1, len(base_models) + len(mlp_models)))
        idx = 0
        for _name, model in base_models.items():
            if hasattr(model, "feature_names_in_"): expected = list(model.feature_names_in_)
            elif hasattr(model, "get_booster"): expected = list(model.get_booster().feature_names)
            elif hasattr(model, "feature_names_"): expected = list(model.feature_names_)
            elif hasattr(model, "feature_name_"): expected = list(model.feature_name_)
            else: expected = list(expected_cols_base)

            df_curr = build_aligned_dataframe(feats, expected)
            base_preds[:, idx] = model.predict(df_curr)[0]
            idx += 1

        qt_expected = list(qt_transformer.feature_names_in_) if hasattr(qt_transformer, "feature_names_in_") else list(expected_cols_base)
        df_qt = build_aligned_dataframe(feats, qt_expected)

        X_qt = qt_transformer.transform(df_qt)
        for _name, model in mlp_models.items():
            base_preds[:, idx] = model.predict(X_qt)[0]
            idx += 1

        log_pred = meta_Ea.predict(base_preds)[0]
        pred_Ea = np.clip(np.expm1(log_pred) / 10.0, 0.005, 5.0)

        print(f"Predicted log10(A): {pred_A:.4f}")
        print(f"Predicted Ea: {pred_Ea:.4f} eV")

        k_B = 8.617333262145e-5
        temp = 298.15
        cond = (10 ** pred_A) * math.exp(-pred_Ea / (k_B * temp))

        return {
            "formula": comp.reduced_formula,
            "log10_A": float(pred_A),
            "Ea_eV": float(pred_Ea),
            "conductivity_S_cm": float(cond),
            "conductivity_mS_cm": float(cond * 1000.0),
            "temperature_K": temp,
        }

    except Exception:
        import traceback
        traceback.print_exc()


if __name__ == "__main__":
    initial_target = resolve_cif_path(TARGET_CIF) or resolve_cif_path("target_material.cif")
    if initial_target is None:
        raise FileNotFoundError("No valid CIF input was found in the repository.")
    res = align_and_predict(initial_target)
    if res:
        print(f"Baseline Ionic Conductivity (298.15 K): {res['conductivity_S_cm']:.4e} S/cm ({res['conductivity_mS_cm']:.4f} mS/cm)")
