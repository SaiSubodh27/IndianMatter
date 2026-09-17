import os
import pickle
import re
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

try:
    from cif_descriptors import compute_descriptors
except ImportError:
    try:
        from .cif_descriptors import compute_descriptors
    except ImportError:
        compute_descriptors = None

# ═══════════════════════════════════════════════════════════════════════════════
# GLOBAL MODEL STATE
# ═══════════════════════════════════════════════════════════════════════════════

v5_base_models = None

expected_cols_base = None
canonical_cols = []

# Set by _probe_log_a_model() during load_models(). True when the bundled log10(A)
# model returns the same value regardless of input, which makes the Arrhenius
# prefactor a constant rather than a prediction.
LOG_A_MODEL_IS_CONSTANT = False

# Inverse of the training target transform. Cell 4 of surrogate_model_v5_fixed.ipynb
# trains on log1p(min_barrier * 10); Cell 10 inverts with expm1(pred)/10 and clips to
# the barrier range the training set actually covered.
TARGET_SCALE = 10.0
EA_CLIP_EV = (0.005, 5.0)

MODEL_VERSION = "v5_stacking_Ea + v2_model_A"
SUPPORTED_TEMPERATURE_RANGE_K = (250, 1000)


def _normalize_feature_name(name: object) -> str:
    text = str(name).strip().lower()
    text = text.replace(" ", "_").replace("-", "_").replace("/", "_")
    text = re.sub(r"[^a-z0-9_]+", "_", text)
    text = re.sub(r"_+", "_", text).strip("_")
    return text


def _format_float_for_payload(value, *, scientific_threshold: float = 1e-3):
    if value is None:
        return "nan"
    try:
        numeric = float(value)
    except (TypeError, ValueError):
        return str(value)
    if not np.isfinite(numeric):
        return "nan" if np.isnan(numeric) else ("inf" if numeric > 0 else "-inf")
    if abs(numeric) < scientific_threshold and numeric != 0.0:
        return f"{numeric:.12e}"
    return f"{numeric:.12g}"


def _feature_value_for_model(df_raw: pd.DataFrame, expected_col: str):
    if expected_col in df_raw.columns:
        return df_raw[expected_col].iloc[0]
    normalized = _normalize_feature_name(expected_col)
    for col in df_raw.columns:
        if _normalize_feature_name(col) == normalized:
            return df_raw[col].iloc[0]
    return 0.0


def _validate_expected_feature_set(df_raw: pd.DataFrame, expected_cols, label: str):
    if not expected_cols:
        return []
    missing = []
    seen = {_normalize_feature_name(c) for c in df_raw.columns}
    for col in expected_cols:
        if _normalize_feature_name(col) not in seen:
            missing.append(col)
    return missing


def _serialize_model_features(df_raw: pd.DataFrame, expected_cols):
    features = []
    for col in expected_cols:
        value = _feature_value_for_model(df_raw, col)
        features.append({
            "name": str(col),
            "value": _format_float_for_payload(value),
            "unit": "dimensionless",
        })
    return features


def _probe_log_a_model(model, columns) -> bool:
    """Check whether the log10(A) model actually responds to its input.

    Feeds two very different descriptor vectors and compares the outputs. A model
    that answers identically is not predicting anything, and the API should not
    present its output as a per-material result.
    """
    if model is None or not columns:
        return False
    try:
        zeros = pd.DataFrame([{c: 0.0 for c in columns}], columns=columns)
        rng = np.random.default_rng(0)
        spread = pd.DataFrame(
            [dict(zip(columns, rng.normal(loc=1.0, scale=10.0, size=len(columns))))],
            columns=columns,
        )
        a = float(model.predict(zeros)[0])
        b = float(model.predict(spread)[0])
        return abs(a - b) < 1e-4
    except Exception as probe_e:
        print(f"  WARN could not probe log10(A) model: {probe_e}")
        return False


def load_models():
    """Load only the v5 base learners on server startup."""
    global v5_base_models, expected_cols_base

    base_dir = os.path.dirname(os.path.abspath(__file__))
    candidate_dirs = [
        os.path.join(base_dir, "pretrained_models"),
        os.path.join(base_dir, "IonCastBackup", "pretrained_models"),
        os.path.join(base_dir, "..", "final_models", "pretrained_models"),
        os.path.join(base_dir, "..", "pretrained_models"),
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

    print(f"\n[model_service] Loading ML models from: {models_dir}")

    try:
        v5_base_models = joblib.load(os.path.join(models_dir, "v5_base_models.pkl"))
        print(f"  OK v5_base_models loaded  ({len(v5_base_models)} base learners: {list(v5_base_models.keys())})")

        # Load expected feature columns from trained artifacts.
        # The quantile transformer was fitted on the training DataFrame, so its
        # feature_names_in_ is the authoritative name list *and* column order;
        # LightGBM stores the same list with spaces rewritten to underscores.
        expected_cols_base = getattr(v5_base_models.get("lgb"), "feature_name_", None)
        if expected_cols_base is None and os.path.exists(os.path.join(models_dir, 'base_cols.pkl')):
            with open(os.path.join(models_dir, 'base_cols.pkl'), 'rb') as f:
                expected_cols_base = pickle.load(f)

        if expected_cols_base is not None:
            expected_cols_base = list(expected_cols_base)
        global canonical_cols
        canonical_cols = list(expected_cols_base or [])

        print(f"  OK Feature columns loaded (base: {len(expected_cols_base) if expected_cols_base else 'N/A'})")
        print("[model_service SUCCESS] All models loaded successfully!\n")

    except Exception as e:
        print(f"\n[model_service ERROR] Failed loading models: {str(e)}\n")


def extract_features(cif_path: str) -> pd.DataFrame:
    structure = Structure.from_file(cif_path)
    comp = structure.composition

    feats = {}

    # Composition basics
    try:
        li_fraction = comp.get_atomic_fraction('Li')
        n_elements = len(comp.elements)
        n_sites_ratio = comp.num_atoms / max(len(comp.elements), 1)
        feats['comp_li_fraction'] = li_fraction
        feats['comp_n_elements'] = n_elements
        feats['comp_n_sites_ratio'] = n_sites_ratio
        feats['li_fraction'] = li_fraction
        feats['n_elements'] = n_elements
        feats['n_sites_ratio'] = n_sites_ratio
    except Exception as e:
        print(f"  Composition feature warning: {e}")

    # MAGPIE features (many of the model's expected names are built from these)
    try:
        ep = ElementProperty.from_preset('magpie')
        for label, value in zip(ep.feature_labels(), ep.featurize(comp)):
            feats['magpie_' + label] = value
            feats['ep_MagpieData_' + label] = value
            feats['MagpieData ' + label] = value
            feats[label] = value
    except Exception as e:
        print(f"  MAGPIE featurization warning: {e}")

    try:
        from matminer.featurizers.composition import Stoichiometry, ValenceOrbital, IonProperty
        for name, featurizer in [
            ('stoich', Stoichiometry()),
            ('valence', ValenceOrbital()),
            ('ion', IonProperty()),
        ]:
            for label, value in zip(featurizer.feature_labels(), featurizer.featurize(comp)):
                feats[label] = value
                feats[f'{name}_{label}'] = value
    except Exception as e:
        print(f"  Additional composition feature warning: {e}")

    # Lattice properties and common aliases used by the training schema.
    lattice = structure.lattice
    feats['cif_lat_a'] = lattice.a
    feats['cif_lat_b'] = lattice.b
    feats['cif_lat_c'] = lattice.c
    feats['cif_lat_alpha'] = lattice.alpha
    feats['cif_lat_beta'] = lattice.beta
    feats['cif_lat_gamma'] = lattice.gamma
    feats['cif_lat_vol'] = lattice.volume
    feats['lat_a'] = lattice.a
    feats['lat_b'] = lattice.b
    feats['lat_c'] = lattice.c
    feats['lat_alpha'] = lattice.alpha
    feats['lat_beta'] = lattice.beta
    feats['lat_gamma'] = lattice.gamma
    feats['lat_vol'] = lattice.volume
    feats['volume'] = float(lattice.volume)
    feats['n_atoms'] = float(len(structure))
    feats['density'] = float(structure.density)
    feats['vol_per_atom'] = lattice.volume / max(len(structure), 1)
    feats['volume_per_atom'] = lattice.volume / max(len(structure), 1)
    feats['log_volume'] = math.log(lattice.volume + 1e-8)
    feats['log_density'] = math.log(structure.density + 1e-8)
    feats['log_n_atoms'] = math.log(len(structure) + 1e-8)
    feats['vol_density'] = lattice.volume * structure.density
    feats['n_sites'] = len(structure)
    li_sites = sum(1 for site in structure if site.species_string == 'Li')
    feats['n_li_sites'] = li_sites
    feats['li_site_frac'] = li_sites / max(len(structure), 1)

    # Structural calculations from matminer.
    try:
        df_feat = DensityFeatures()
        for name, value in zip(df_feat.feature_labels(), df_feat.featurize(structure)):
            feats['cif_dens_' + name] = value
            feats['dens_' + name] = value
            feats[name] = value
    except Exception as e:
        print(f"  Density feature warning: {e}")

    try:
        gs_feat = GlobalSymmetryFeatures()
        for name, value in zip(gs_feat.feature_labels(), gs_feat.featurize(structure)):
            feats['cif_sym_' + name] = value
            feats['sym_' + name] = value
            feats[name] = value
    except Exception as e:
        print(f"  Symmetry feature warning: {e}")

    # Descriptors reconstructed under the names the v5 training matrix used.
    reconstructed = {}
    if compute_descriptors is not None:
        try:
            reconstructed = compute_descriptors(structure, packing_fraction=feats.get("cif_dens_packing fraction"))
            for key, value in reconstructed.items():
                feats.setdefault(key, value)
        except Exception as e:
            print(f"  Descriptor reconstruction warning: {e}")
            reconstructed = {}

    # Common alias names expected by the model but absent from pure-CIF extraction.
    feats.setdefault('band_gap', 0.0)
    feats.setdefault('energy_above_hull', 0.0)
    feats.setdefault('is_stable', 0.0)
    feats.setdefault('thermal_stability', 0.0)
    feats.setdefault('electronic_conductivity_category', 0.0)
    feats.setdefault('estimated_voltage_window_eV', 0.0)
    feats.setdefault('formation_energy_per_atom', 0.0)
    feats.setdefault('energy_eV', 0.0)
    feats.setdefault('energy_per_atom_eV', 0.0)
    feats.setdefault('volume_change_pct', 0.0)
    feats.setdefault('mean_barrier', 0.0)
    feats.setdefault('diffusion_coefficient_300K', 0.0)
    feats.setdefault('transference_category', 0.0)
    feats.setdefault('max_barrier', 0.0)
    feats.setdefault('num_hops', 0.0)
    feats.setdefault('time_seconds', 0.0)

    df = pd.DataFrame([feats])
    for col in list(df.columns):
        safe_col = col.replace(" ", "_")
        if safe_col not in df.columns:
            df[safe_col] = df[col]
    df.attrs["reconstructed_columns"] = sorted(reconstructed)
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

    return list(fallback_cols) if fallback_cols else []


def _align_features(df_raw: pd.DataFrame, columns: list) -> pd.DataFrame:
    df = df_raw.copy()
    if not columns:
        return df
    for col in columns:
        if col not in df.columns:
            df[col] = 0.0
    return df[columns]


# Descriptors the v5 training matrix took from Materials Project DFT entries.
# A bare CIF carries geometry and composition only, so these cannot be derived
# from an upload -- they are either looked up or left unavailable.
DFT_ONLY_FEATURES = frozenset({
    "band_gap", "energy_above_hull", "is_stable", "formation_energy_per_atom",
    "energy_eV", "energy_per_atom_eV", "K_GPa", "G_GPa", "E_GPa", "poisson_ratio",
    "KG_ratio", "ductile_brittle", "thermal_stability", "volume_change_pct",
    "electronic_conductivity_category", "estimated_voltage_window_eV",
    "mean_element_abundance", "mean_element_toxicity",
    # products of the above (notebook Cell 4)
    "pugh_ratio", "debye_proxy", "energy_per_volume", "K_over_density",
    "G_over_density", "K_times_G", "sqrt_K", "sqrt_G", "formation_x_hull",
    "energy_stability", "hull_sq", "form_energy_sq", "K_G_diff", "K_per_atom",
    "G_per_atom", "K_G_ratio_sq", "bandgap_sq", "bandgap_x_hull",
    "bandgap_x_density", "log_bandgap",
})

# Statistics computed across the training corpus (per-formula group means and
# whole-dataset percentile ranks). They are undefined for a single structure
# evaluated on its own -- no lookup can supply them.
DATASET_RELATIVE_FEATURES = frozenset({
    "formula_count", "density_vs_form_mu", "vol_vs_form_mu", "energy_vs_form_mu",
    "hull_vs_form_min", "K_vs_form_mu", "bg_vs_form_mu",
    "density_rank", "energy_rank", "hull_rank",
})


def _feature_coverage(df_raw: pd.DataFrame, columns: list) -> dict:
    """Report how much of the model's expected input was genuinely computed.

    Columns absent from df_raw are zero-filled by _align_features. Zero is not a
    neutral value -- for most of these descriptors it lies outside the range the
    model ever saw -- so the caller needs to know how much of the input is real.
    """
    if not columns:
        return {
            "expected": 0, "computed": 0, "computed_directly": 0,
            "reconstructed": 0, "imputed": 0, "coverage_pct": 0.0,
            "coverage_level": "unknown", "missing_dft": 0,
            "missing_dataset_relative": 0, "missing_structural": 0,
        }

    missing = [c for c in columns if c not in df_raw.columns]
    computed = len(columns) - len(missing)
    pct = 100.0 * computed / len(columns)

    # Columns filled by cif_descriptors are real physical quantities, but they are
    # recomputed from the descriptor name rather than read from the original
    # generator, so they are counted separately from the ones matminer and
    # pymatgen supply directly under their training names.
    reconstructed = set(df_raw.attrs.get("reconstructed_columns", []))
    n_reconstructed = sum(1 for c in columns if c in reconstructed)

    if pct >= 90.0:
        level = "high"
    elif pct >= 60.0:
        level = "partial"
    else:
        level = "low"

    return {
        "expected": len(columns),
        "computed": computed,
        "computed_directly": computed - n_reconstructed,
        "reconstructed": n_reconstructed,
        "imputed": len(missing),
        "coverage_pct": round(pct, 1),
        "coverage_level": level,
        "missing_dft": sum(1 for c in missing if c in DFT_ONLY_FEATURES),
        "missing_dataset_relative": sum(1 for c in missing if c in DATASET_RELATIVE_FEATURES),
        "missing_structural": sum(
            1 for c in missing
            if c not in DFT_ONLY_FEATURES and c not in DATASET_RELATIVE_FEATURES
        ),
    }


def get_crystal_type(structure) -> str:
    if not PYMATGEN_AVAILABLE:
        return "Unknown"
    try:
        sga = SpacegroupAnalyzer(structure)
        return sga.get_crystal_system().title()
    except:
        return "Unknown"


def classify_material(composition: str, structure=None) -> dict:
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
    if v5_base_models is None:
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

    # Arrhenius is evaluated at the requested temperature, so an out-of-range
    # request still returns a number -- 50 K yields ~1e-41 S/cm. That number is
    # an extrapolation far outside the range this model was fitted over, so it is
    # rejected rather than served as a prediction.
    temp_min, temp_max = SUPPORTED_TEMPERATURE_RANGE_K
    try:
        temperature = float(temperature)
    except (TypeError, ValueError):
        return {
            "status": "invalid_temperature",
            "error": f"Temperature must be a number in Kelvin between {temp_min} and {temp_max}.",
            "Ea": 0.0, "logA": 0.0, "conductivity": 0.0,
            "composition": "Unknown", "classification": "Unknown"
        }
    if not (temp_min <= temperature <= temp_max):
        return {
            "status": "invalid_temperature",
            "error": (f"Temperature {temperature:g} K is outside the supported range "
                      f"{temp_min}-{temp_max} K. Outside that range the Arrhenius "
                      f"extrapolation is not supported by this model."),
            "Ea": 0.0, "logA": 0.0, "conductivity": 0.0,
            "composition": "Unknown", "classification": "Unknown"
        }

    # Parse the structure first: a malformed upload is the caller's problem
    # (HTTP 400), which must not be conflated with a pipeline fault (HTTP 500).
    try:
        Structure.from_file(file_path)
    except Exception as parse_e:
        return {
            "status": "invalid_cif",
            "error": f"Could not parse this file as a CIF structure: {parse_e}",
            "Ea": 0.0, "logA": 0.0, "conductivity": 0.0,
            "composition": "Unknown", "classification": "Unknown"
        }

    try:
        df_raw, structure = extract_features(file_path)

        composition = str(structure.composition.reduced_formula)
        crystal_type = get_crystal_type(structure)
        classification_info = classify_material(composition, structure)

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

        df_base = _align_features(df_raw, expected_cols_base)

        if PredictionValidator is not None:
            valid_base, base_msg = PredictionValidator.validate_features(df_base)
            if not valid_base:
                raise ValueError(f"Missing or invalid descriptors for Ea model: {base_msg}")

        missing_base = _validate_expected_feature_set(df_raw, expected_cols_base, "Ea model")
        if missing_base:
            print(f"  WARN Ea model missing {len(missing_base)} feature(s); zero-filling to satisfy model contract: {missing_base[:10]}")

        base_predictions = []
        for model in v5_base_models.values():
            model_cols = _feature_columns_for_model(model, expected_cols_base)
            base_predictions.append(float(model.predict(_align_features(df_raw, model_cols))[0]))

        if not base_predictions:
            raise ValueError("v5_base_models contains no predictors")

        pred_log_target = float(np.mean(base_predictions))
        pred_Ea = float(np.clip(np.expm1(pred_log_target) / TARGET_SCALE,
                                EA_CLIP_EV[0], EA_CLIP_EV[1]))

        k_B = 8.617333262145e-5
        pred_A = 0.0
        A_real = 10 ** pred_A
        conductivity = A_real * math.exp(-pred_Ea / (k_B * temperature))

        log_cond = math.log10(conductivity) if conductivity > 0 else -10
        cond_score = max(0, min(100, (log_cond + 8) * 12.5))
        ea_score = max(0, min(100, (0.5 - pred_Ea) * 100))
        hes = (cond_score * 0.6 + ea_score * 0.4)

        rating = "Low"
        if hes >= 75: rating = "Excellent"
        elif hes >= 50: rating = "Good"
        elif hes >= 25: rating = "Moderate"

        normalized_hes = hes / 100.0

        # Confidence describes how much of the model's input was real, not how
        # favourably the material scored. Deriving it from HES (as this once did)
        # reported "High confidence" for any good-looking result regardless of
        # how much of the descriptor vector had been zero-filled.
        coverage = _feature_coverage(df_raw, canonical_cols)
        confidence = {"high": "High", "partial": "Medium",
                      "low": "Low"}.get(coverage["coverage_level"], "Unknown")
        prediction_quality = ("Screening Only" if coverage["coverage_level"] != "high"
                              else "Good")
        validation_status = ("validated" if coverage["coverage_level"] == "high"
                             else "reduced_features")

        warnings_out = []

        if coverage["imputed"]:
            warnings_out.append(
                f"base_model_v5 was run in CIF-only screening mode: {coverage['computed']} of "
                f"{coverage['expected']} descriptors ({coverage['coverage_pct']}%) were available, "
                f"and the remaining {coverage['imputed']} were set to zero to keep the model input "
                f"shape compatible with the trained stack. This is a screening estimate, not a DFT-quality prediction."
            )
        if coverage["reconstructed"]:
            warnings_out.append(
                f"{coverage['reconstructed']} descriptors were reconstructed from structural/compositional "
                f"definitions to match the v5 schema. They are consistent with the model contract, "
                f"but they are not byte-identical to the original training-generation output."
            )
        if coverage["missing_dft"]:
            warnings_out.append(
                f"{coverage['missing_dft']} descriptors are DFT-style fields (for example band gap, elastic moduli, "
                f"and energy above hull) that a plain CIF does not encode, so the v5 stack treats them as zero-filled inputs."
            )
        if coverage["missing_dataset_relative"]:
            warnings_out.append(
                f"{coverage['missing_dataset_relative']} descriptors depend on corpus-level statistics (formula means, "
                f"percentile ranks) and are undefined for a single uploaded structure; they are therefore carried at the training-compatible default value."
            )

        # The repo's bundled log10(A) model is input-invariant, so an absolute conductivity
        # result from this stack should be treated as a prefactor-based screening estimate.
        if LOG_A_MODEL_IS_CONSTANT:
            warnings_out.append(
                f"The bundled log10(A) branch is constant at {pred_A:.2f} for this v5 stack, so the absolute conductivity "
                f"value is a fixed-prefactor screening estimate. Use Ea as the primary material comparison metric."
            )
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

        feature_payload = _serialize_model_features(df_raw, canonical_cols or expected_cols_base or [])
        prediction_payload = {
            "name": "ionic_conductivity",
            "value": _format_float_for_payload(conductivity),
            "unit": "S/cm",
        }

        return {
            "success": True,
            "status": "success",
            "Ea": float(pred_Ea),
            "logA": float(pred_A),
            "conductivity": float(f"{conductivity:.12e}"),
            "temperature_k": temperature,
            "composition": composition,
            "classification": crystal_type,
            "classification_detailed": classification_info,
            "detailed_structure": detailed_structure,
            "hes_score": float(hes),
            "normalized_hes": float(normalized_hes),
            "hes_rating": rating,
            "hes_validation": {
                "components": {
                    "conductivity": float(cond_score),
                    "activation_energy": float(ea_score),
                },
                "total_score": float(hes),
                "normalized_score": float(normalized_hes),
                "validation_status": validation_status,
                "confidence_level": confidence,
                "prediction_quality": prediction_quality,
            },
            "confidence": confidence,
            "validation_status": validation_status,
            "prediction_quality": prediction_quality,
            "feature_coverage": coverage,
            "supported_temperature_range_k": list(SUPPORTED_TEMPERATURE_RANGE_K),
            "log_a_is_constant": LOG_A_MODEL_IS_CONSTANT,
            "temperature_series": temperature_series,
            "warnings": warnings_out,
            "model_version": MODEL_VERSION,
            "source": MODEL_VERSION,
            "features": feature_payload,
            "prediction": prediction_payload,
            "trial_results": {
                "activation_energy_eV": {
                    "value": _format_float_for_payload(pred_Ea),
                    "unit": "eV",
                },
                "log_a": {
                    "value": _format_float_for_payload(pred_A),
                    "unit": "log10(A)",
                },
                "conductivity_s_cm": {
                    "value": _format_float_for_payload(conductivity),
                    "unit": "S/cm",
                },
            },
        }

    except Exception as e:
        print(f"Prediction pipeline error: {str(e)}")
        return {
            "status": "prediction_failed",
            "error": str(e),
            "Ea": 0.0, "logA": 0.0, "conductivity": 0.0,
            "composition": "Unknown", "classification": "Unknown"
        }
