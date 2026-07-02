import os
import pickle
import joblib
import pandas as pd
import numpy as np
import math
import warnings
warnings.filterwarnings('ignore')

try:
    from pymatgen.core import Structure
    from pymatgen.symmetry.analyzer import SpacegroupAnalyzer
    PYMATGEN_AVAILABLE = True
except ImportError:
    PYMATGEN_AVAILABLE = False

try:
    from matminer.featurizers.structure import DensityFeatures, GlobalSymmetryFeatures
    from matminer.featurizers.composition import ElementProperty
    MATMINER_AVAILABLE = True
except ImportError:
    MATMINER_AVAILABLE = False

# ═══════════════════════════════════════════════════════════════════════════════
# GLOBAL MODEL STATE
# ═══════════════════════════════════════════════════════════════════════════════

# v5 stacking ensemble for Ea
v5_base_models = None
v5_mlp_models = None
v5_meta_model = None

# v2 model for log10(A)
v5_model2_A = None

# Expected feature columns (saved during training)
expected_cols_base = None
expected_cols_a = None


def load_models():
    """Load all v5 models for Ea and v2 model for A on server startup."""
    global v5_base_models, v5_mlp_models, v5_meta_model, v5_model2_A
    global expected_cols_base, expected_cols_a

    base_dir = os.path.dirname(os.path.abspath(__file__))
    models_dir = os.path.join(base_dir, "Surrogative_models")

    try:
        # ── Load v5 stacking models for Ea ──
        v5_base_models = joblib.load(os.path.join(models_dir, "v5_base_models.pkl"))
        print(f"  ✓ v5_base_models loaded  ({len(v5_base_models)} base learners: {list(v5_base_models.keys())})")

        v5_mlp_models = joblib.load(os.path.join(models_dir, "v5_mlp_models.pkl"))
        print(f"  ✓ v5_mlp_models loaded   ({len(v5_mlp_models)} MLP models: {list(v5_mlp_models.keys())})")

        v5_meta_model = joblib.load(os.path.join(models_dir, "v5_meta_model.pkl"))
        print(f"  ✓ v5_meta_model loaded   (meta-stacking model for Ea)")

        # ── Load v2 model for log10(A) ──
        v5_model2_A = joblib.load(os.path.join(models_dir, "v5_model2_A.pkl"))
        print(f"  ✓ v5_model2_A loaded     (model for log10(A))")

        # ── Load expected feature columns ──
        with open(os.path.join(models_dir, 'base_cols.pkl'), 'rb') as f:
            expected_cols_base = pickle.load(f)
        with open(os.path.join(models_dir, 'a_cols.pkl'), 'rb') as f:
            expected_cols_a = pickle.load(f)
        print(f"  ✓ Feature columns loaded (base: {len(expected_cols_base)}, A: {len(expected_cols_a)})")

        print("\n══ All models loaded successfully! ══\n")

    except Exception as e:
        print(f"\n✗ Error loading models: {str(e)}")
        import traceback
        traceback.print_exc()


# ═══════════════════════════════════════════════════════════════════════════════
# FEATURE EXTRACTION  (mirrors interactive_predict.py)
# ═══════════════════════════════════════════════════════════════════════════════

def extract_features(cif_path: str) -> pd.DataFrame:
    """
    Extract MAGPIE + structural features from a CIF file.
    Returns a single-row DataFrame with all features needed by v5/v2 models.
    """
    structure = Structure.from_file(cif_path)
    comp = structure.composition

    feats = {}

    # 1. MAGPIE compositional features
    try:
        ep = ElementProperty.from_preset('magpie')
        for label, value in zip(ep.feature_labels(), ep.featurize(comp)):
            feats['magpie_' + label] = value
    except Exception as e:
        print(f"  MAGPIE featurization warning: {e}")

    # 2. Composition-level features
    try:
        feats['comp_li_fraction'] = comp.get_atomic_fraction('Li')
        feats['comp_n_elements'] = len(comp.elements)
        feats['comp_n_sites_ratio'] = comp.num_atoms / max(len(comp.elements), 1)
    except Exception as e:
        print(f"  Composition feature warning: {e}")

    # 3. Lattice / CIF structural features
    feats['cif_lat_a'] = structure.lattice.a
    feats['cif_lat_b'] = structure.lattice.b
    feats['cif_lat_c'] = structure.lattice.c
    feats['cif_lat_alpha'] = structure.lattice.alpha
    feats['cif_lat_beta'] = structure.lattice.beta
    feats['cif_lat_gamma'] = structure.lattice.gamma
    feats['cif_lat_vol'] = structure.lattice.volume

    # 4. Density features
    try:
        df_feat = DensityFeatures()
        for name, value in zip(df_feat.feature_labels(), df_feat.featurize(structure)):
            feats['cif_dens_' + name] = value
    except Exception as e:
        print(f"  Density feature warning: {e}")

    # 5. Global symmetry features
    try:
        gs_feat = GlobalSymmetryFeatures()
        for name, value in zip(gs_feat.feature_labels(), gs_feat.featurize(structure)):
            feats['cif_sym_' + name] = value
    except Exception as e:
        print(f"  Symmetry feature warning: {e}")

    df = pd.DataFrame([feats])
    return df, structure


# ═══════════════════════════════════════════════════════════════════════════════
# PREDICTION PIPELINE
# ═══════════════════════════════════════════════════════════════════════════════

def get_crystal_type(structure) -> str:
    if not PYMATGEN_AVAILABLE:
        return "Unknown"
    try:
        sga = SpacegroupAnalyzer(structure)
        crystal_sys = sga.get_crystal_system().title()
        return crystal_sys
    except:
        return "Unknown"

def classify_material(composition: str, structure=None) -> dict:
    """Classify material based on composition and structure"""
    classification = {
        "crystal_system": "Unknown",
        "material_type": "Unknown",
        "ion_conductor_type": "Unknown"
    }

    try:
        if structure and PYMATGEN_AVAILABLE:
            sga = SpacegroupAnalyzer(structure)
            classification["crystal_system"] = sga.get_crystal_system().title()
    except:
        pass

    composition_upper = composition.upper()

    if "LI" in composition_upper:
        classification["material_type"] = "Lithium-based"

        if "GARNET" in composition_upper or ("ZR" in composition_upper and "LA" in composition_upper):
            classification["ion_conductor_type"] = "Garnet-type (Li7La3Zr2O12)"
        elif "LGPS" in composition_upper or ("GE" in composition_upper and "P" in composition_upper and "S" in composition_upper):
            classification["ion_conductor_type"] = "LGPS-type (Li10GeP2S12)"
        elif "NASICON" in composition_upper or ("TI" in composition_upper and "AL" in composition_upper):
            classification["ion_conductor_type"] = "NASICON-type (Li1.3Al0.3Ti1.7(PO4)3)"
        elif "PEROVSKITE" in composition_upper or ("TI" in composition_upper and "LA" in composition_upper):
            classification["ion_conductor_type"] = "Perovskite (Li0.33La0.56TiO3)"
        elif "HALIDE" in composition_upper or "CL" in composition_upper or "BR" in composition_upper:
            classification["ion_conductor_type"] = "Halide (Li3YCl6)"
        elif "ARGYRODITE" in composition_upper or ("S" in composition_upper and "CL" in composition_upper):
            classification["ion_conductor_type"] = "Argyrodite (Li6PS5Cl)"
        else:
            classification["ion_conductor_type"] = "Lithium Solid Electrolyte"
    elif "NA" in composition_upper:
        classification["material_type"] = "Sodium-based"
        classification["ion_conductor_type"] = "Sodium Ion Conductor"
    else:
        classification["material_type"] = "Other"

    return classification


def predict_from_cif(file_path: str, temperature: float = 298.0) -> dict:
    """
    PREDICTION PIPELINE using:
      - v5 stacking ensemble (base + MLP + meta) for Ea
      - v2 model (v5_model2_A) for log10(A)
      - Arrhenius equation for conductivity
    """
    # Guard: models must be loaded
    if v5_base_models is None or v5_meta_model is None or v5_model2_A is None:
        return {
            "status": "model_not_loaded",
            "error": "Models not loaded. Check server startup logs.",
            "Ea": 0.0, "logA": 0.0, "conductivity": 0.0,
            "composition": "Unknown", "classification": "Unknown"
        }

    if not MATMINER_AVAILABLE:
        return {
            "status": "dependency_missing",
            "error": "matminer is required but not installed.",
            "Ea": 0.0, "logA": 0.0, "conductivity": 0.0,
            "composition": "Unknown", "classification": "Unknown"
        }

    try:
        # ── 1. Extract features ──
        df_raw, structure = extract_features(file_path)

        composition = str(structure.composition.reduced_formula)
        crystal_type = get_crystal_type(structure)
        classification_info = classify_material(composition, structure)

        # Build structural details for the response
        detailed_structure = {
            "space_group": "Unknown",
            "density": 0.0,
            "volume": 0.0,
            "elements": [],
            "lattice": {
                "a": 0.0, "b": 0.0, "c": 0.0,
                "alpha": 0.0, "beta": 0.0, "gamma": 0.0
            }
        }
        try:
            sga = SpacegroupAnalyzer(structure)
            sg_symbol = sga.get_space_group_symbol()
            sg_number = sga.get_space_group_number()
            detailed_structure["space_group"] = f"{sg_symbol} (#{sg_number})"
            detailed_structure["density"] = float(structure.density)
            detailed_structure["volume"] = float(structure.volume)
            detailed_structure["elements"] = [str(el) for el in structure.composition.elements]

            lat = structure.lattice
            detailed_structure["lattice"] = {
                "a": round(lat.a, 5),
                "b": round(lat.b, 5),
                "c": round(lat.c, 5),
                "alpha": round(lat.alpha, 4),
                "beta": round(lat.beta, 4),
                "gamma": round(lat.gamma, 4)
            }
        except Exception as struct_e:
            print(f"  Detailed structure parsing warning: {struct_e}")

        # ── 2. Align features to expected columns ──
        # Fill missing columns with 0.0 (features the CIF didn't produce)
        for col in expected_cols_base:
            if col not in df_raw.columns:
                df_raw[col] = 0.0
        for col in expected_cols_a:
            if col not in df_raw.columns:
                df_raw[col] = 0.0

        df_base = df_raw[expected_cols_base]
        df_a = df_raw[expected_cols_a]

        # ── 3. Predict log10(A) using v2 model ──
        pred_A = float(v5_model2_A.predict(df_a)[0])

        # ── 4. Predict Ea using v5 stacking ensemble ──
        X_meta = pd.DataFrame()
        for name, model in v5_base_models.items():
            X_meta[name] = model.predict(df_base)
        for name, model in v5_mlp_models.items():
            X_meta[name] = model.predict(df_base)

        pred_Ea = float(v5_meta_model.predict(X_meta)[0])

        # ── 5. Calculate conductivity via Arrhenius ──
        k_B = 8.617333262145e-5  # eV/K
        A_real = 10 ** pred_A
        conductivity = A_real * math.exp(-pred_Ea / (k_B * temperature))

        # ── 6. HES Score ──
        log_cond = math.log10(conductivity) if conductivity > 0 else -10
        cond_score = max(0, min(100, (log_cond + 8) * 12.5))
        ea_score = max(0, min(100, (0.5 - pred_Ea) * 100))
        hes = (cond_score * 0.6 + ea_score * 0.4)

        rating = "Low"
        if hes >= 75: rating = "Excellent"
        elif hes >= 50: rating = "Good"
        elif hes >= 25: rating = "Moderate"

        return {
            "status": "success",
            "Ea": round(pred_Ea, 4),
            "logA": round(pred_A, 4),
            "conductivity": float(f"{conductivity:.4e}"),
            "composition": composition,
            "classification": crystal_type,
            "classification_detailed": classification_info,
            "detailed_structure": detailed_structure,
            "hes_score": round(hes, 2),
            "hes_rating": rating,
            "source": "v5_stacking_Ea + v2_model_A"
        }

    except Exception as e:
        print(f"Prediction pipeline error: {str(e)}")
        import traceback
        traceback.print_exc()
        return {
            "status": "prediction_failed",
            "error": str(e),
            "Ea": 0.0, "logA": 0.0, "conductivity": 0.0,
            "composition": "Unknown", "classification": "Unknown"
        }