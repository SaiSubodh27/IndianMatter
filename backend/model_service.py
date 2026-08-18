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

try:
    from Surrogative_models.final_validation import PredictionValidator
except ImportError:
    PredictionValidator = None

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

MODEL_VERSION = "v5_stacking_Ea + v2_model_A"
SUPPORTED_TEMPERATURE_RANGE_K = (250, 1000)


def load_models():
    """Load all v5 models for Ea and v2 model for A on server startup."""
    global v5_base_models, v5_mlp_models, v5_meta_model, v5_model2_A
    global expected_cols_base, expected_cols_a

    base_dir = os.path.dirname(os.path.abspath(__file__))
    candidate_dirs = [
        os.path.join(base_dir, "..", "final_models", "pretrained_models"),
        os.path.join(base_dir, "..", "pretrained_models"),
        os.path.join(base_dir, "pretrained_models"),
        os.path.join(base_dir, "Surrogative_models"),
    ]

    models_dir = None
    for c_dir in candidate_dirs:
        norm_dir = os.path.abspath(c_dir)
        if os.path.exists(os.path.join(norm_dir, "v5_base_models.pkl")):
            models_dir = norm_dir
            break

    if not models_dir:
        models_dir = os.path.abspath(candidate_dirs[0])

    print(f"Loading ML models from: {models_dir}")

    try:
        # ── Load v5 stacking models for Ea ──
        v5_base_models = joblib.load(os.path.join(models_dir, "v5_base_models.pkl"))
        print(f"  OK v5_base_models loaded  ({len(v5_base_models)} base learners: {list(v5_base_models.keys())})")

        v5_mlp_models = joblib.load(os.path.join(models_dir, "v5_mlp_models.pkl"))
        print(f"  OK v5_mlp_models loaded   ({len(v5_mlp_models)} MLP models: {list(v5_mlp_models.keys())})")

        v5_meta_model = joblib.load(os.path.join(models_dir, "v5_meta_model.pkl"))
        print(f"  OK v5_meta_model loaded   (meta-stacking model for Ea)")

        # ── Load v2 model for log10(A) ──
        v5_model2_A = joblib.load(os.path.join(models_dir, "v5_model2_A.pkl"))
        print(f"  OK v5_model2_A loaded     (model for log10(A))")

        # ── Load expected feature columns from trained artifacts ──
        expected_cols_base = getattr(v5_base_models.get("lgb"), "feature_name_", None)
        if expected_cols_base is None and os.path.exists(os.path.join(models_dir, 'base_cols.pkl')):
            with open(os.path.join(models_dir, 'base_cols.pkl'), 'rb') as f:
                expected_cols_base = pickle.load(f)

        expected_cols_a = getattr(v5_model2_A, "feature_name_", None)
        if expected_cols_a is None:
            expected_cols_a = getattr(v5_model2_A, "feature_names_in_", None)
        if expected_cols_a is None and os.path.exists(os.path.join(models_dir, 'a_cols.pkl')):
            with open(os.path.join(models_dir, 'a_cols.pkl'), 'rb') as f:
                expected_cols_a = pickle.load(f)

        if expected_cols_base is not None:
            expected_cols_base = list(expected_cols_base)
        if expected_cols_a is not None:
            expected_cols_a = list(expected_cols_a)
        print(f"  OK Feature columns loaded (base: {len(expected_cols_base) if expected_cols_base else 'N/A'}, A: {len(expected_cols_a) if expected_cols_a else 'N/A'})")

        print("\nAll models loaded successfully!\n")

    except Exception as e:
        print(f"\nERROR loading models: {str(e)}")


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
    for col in list(df.columns):
        safe_col = col.replace(" ", "_")
        if safe_col not in df.columns:
            df[safe_col] = df[col]
    return df, structure


def _feature_columns_for_model(model, fallback_cols):
    columns = getattr(model, "feature_names_in_", None)
    if columns is not None:
        return list(columns)

    columns = getattr(model, "feature_name_", None)
    if columns is not None:
        return list(columns)

    booster = getattr(model, "get_booster", None)
    if booster is not None:
        try:
            columns = booster().feature_names
            if columns:
                return list(columns)
        except Exception:
            pass

    columns = getattr(model, "feature_names_", None)
    if columns is not None:
        return list(columns)

    return list(fallback_cols)


def _align_features(df_raw: pd.DataFrame, columns: list[str]) -> pd.DataFrame:
    df = df_raw.copy()
    for col in columns:
        if col not in df.columns:
            df[col] = 0.0
    return df[columns]


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

        # ── 2. Align features to each trained artifact's expected columns ──
        df_base = _align_features(df_raw, expected_cols_base)
        df_a = _align_features(df_raw, expected_cols_a)

        if PredictionValidator is not None:
            valid_base, base_msg = PredictionValidator.validate_features(df_base)
            valid_a, a_msg = PredictionValidator.validate_features(df_a)
            if not valid_base:
                raise ValueError(f"Missing or invalid descriptors for Ea model: {base_msg}")
            if not valid_a:
                raise ValueError(f"Missing or invalid descriptors for logA model: {a_msg}")

        # ── 3. Predict log10(A) using v2 model ──
        pred_A = float(v5_model2_A.predict(df_a)[0])

        # ── 4. Predict Ea using v5 stacking ensemble ──
        X_meta = pd.DataFrame()
        for name, model in v5_base_models.items():
            model_cols = _feature_columns_for_model(model, expected_cols_base)
            X_meta[name] = model.predict(_align_features(df_raw, model_cols))
        for name, model in v5_mlp_models.items():
            model_cols = _feature_columns_for_model(model, expected_cols_base)
            X_meta[name] = model.predict(_align_features(df_raw, model_cols))

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

        normalized_hes = hes / 100.0
        validation_status = "validated" if hes >= 25 else "low_confidence"
        confidence = "High" if hes >= 75 else "Medium" if hes >= 50 else "Low"
        prediction_quality = "Excellent" if hes >= 75 else "Good" if hes >= 50 else "Screening Only"

        warnings_out = []
        if PredictionValidator is not None:
            for label, value, validator in [
                ("Ea", pred_Ea, PredictionValidator.validate_ea),
                ("logA", pred_A, PredictionValidator.validate_log_a),
                ("conductivity", conductivity, PredictionValidator.validate_conductivity),
            ]:
                is_valid, message = validator(value)
                if not is_valid:
                    warnings_out.append(f"{label} validation warning: {message}")

        temp_min, temp_max = SUPPORTED_TEMPERATURE_RANGE_K
        temperatures = list(range(temp_min, temp_max + 1, 50))
        temperature_series = [
            {
                "temperature_k": temp,
                "conductivity_s_cm": float(f"{(10 ** pred_A) * math.exp(-pred_Ea / (k_B * temp)):.4e}"),
            }
            for temp in temperatures
        ]

        return {
            "status": "success",
            "Ea": round(pred_Ea, 4),
            "logA": round(pred_A, 4),
            "conductivity": float(f"{conductivity:.4e}"),
            "temperature_k": temperature,
            "composition": composition,
            "classification": crystal_type,
            "classification_detailed": classification_info,
            "detailed_structure": detailed_structure,
            "hes_score": round(hes, 2),
            "normalized_hes": round(normalized_hes, 4),
            "hes_rating": rating,
            "hes_validation": {
                "components": {
                    "conductivity": round(cond_score, 2),
                    "activation_energy": round(ea_score, 2),
                },
                "total_score": round(hes, 2),
                "normalized_score": round(normalized_hes, 4),
                "validation_status": validation_status,
                "confidence_level": confidence,
                "prediction_quality": prediction_quality,
            },
            "confidence": confidence,
            "validation_status": validation_status,
            "prediction_quality": prediction_quality,
            "temperature_series": temperature_series,
            "warnings": warnings_out,
            "model_version": MODEL_VERSION,
            "source": MODEL_VERSION
        }

    except Exception as e:
        print(f"Prediction pipeline error: {str(e)}")
        return {
            "status": "prediction_failed",
            "error": str(e),
            "Ea": 0.0, "logA": 0.0, "conductivity": 0.0,
            "composition": "Unknown", "classification": "Unknown"
        }
