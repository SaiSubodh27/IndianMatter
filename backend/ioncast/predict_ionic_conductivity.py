"""
IonCast ionic-conductivity predictor  (schema-safe version, v7)

What changed vs. v6 (schema-safe) -- see missing_features_report.csv
  This update adds real feature computation for columns that were previously
  imputed with training medians, WITHOUT weakening any of v6's honesty guarantees
  (SchemaMismatchError, --diagnose, PROVISIONAL tagging all still work exactly as
  before -- a column that still can't be computed still gets imputed and still
  counts toward default_fraction, it just doesn't pretend to be something it isn't).

  Every new column below falls into one of four buckets. The bucket is stated
  explicitly in code comments and in missing_features_report.csv's `category`/
  `how_to_obtain` columns, because they carry very different reliability:

  (1) GENUINELY COMPUTED, exact -- cif_mean_bond_length/cif_std_bond_length,
      cif_mean_cn/cif_std_cn, cif_crystal_system, li_cn_*, li_bl_*, anion_*,
      short_bonds/long_bonds, li_wyckoff_mu/max (real spglib Wyckoff multiplicities).
      These are real computations from the structure, via CrystalNN /
      SpacegroupAnalyzer -- not fabricated. What's still uncertain is only whether
      they use the *exact same* cutoffs/conventions as the original (unavailable)
      training-notebook extractor.

  (2) GENUINELY COMPUTED, but the DEFINITION is inferred/approximate --
      li_dim/li_dim_1d/2d/3d (Li-percolation dimensionality via pymatgen's real
      Larsen-et-al. algorithm, applied to a Li-Li contact graph as a stand-in for
      a true migration-pathway graph), li_distortion_mu/max (bond-length
      coefficient-of-variation proxy). These use real, published algorithms but
      are NOT guaranteed to match the original column's exact definition -- treat
      them as informed estimates, flagged "computed*" in the report, same
      convention the v6 script already used for bl_min/li_bl_min/etc.

  (3) EXTERNAL DATABASE, optional -- band_gap, energy_above_hull,
      formation_energy_per_atom, is_stable, K_GPa, G_GPa (+ the elastic/thermo
      arithmetic combo features derived from them via real textbook formulas,
      e.g. E, nu from K & G). Only populated if you pass --mp-api-key (or set
      MP_API_KEY) AND have `pip install mp-api`. This is the only honest source
      for these columns -- they are DFT database values, not something a CIF-only
      extractor can compute. Silently skipped (falls back to median imputation,
      exactly like before) if no key / package / network / match.

  (4) STILL NOT COMPUTED, on purpose -- Model A's simulation-output columns
      (diffusion_coefficient_300K, li_transference_number, barriers, num_hops,
      ...) are NOT derivable from a CIF at all; they are literally the output of
      an MD/NEB/transport simulation this script does not and cannot run.
      diffusion_coefficient_300K alone carries ~82% of Model A's importance, so
      Model A's prefactor prediction should be treated as unreliable regardless
      of everything else here -- that is a structural limitation of Model A's
      training data, not something more feature engineering can fix. Likewise the
      group-relative columns (*_vs_form_mu, formula_count, thermal_stability, and
      any *_rank beyond what the quantile-transformer's own training distribution
      can approximate) need the original training table and are left MISSING.
      density_rank / energy_rank / hull_rank ARE computed, but via a legitimate
      shortcut: the fitted QuantileTransformer already stores each column's full
      training distribution, so we interpolate this material's real density /
      energy_per_atom_eV / energy_above_hull against that stored distribution to
      get its percentile -- no external ranking table needed.

Usage (unchanged, plus one new optional flag)
  # 1) find out exactly what is wrong (run this first)
  python predict_ionic_conductivity.py --diagnose path\\to\\any.cif

  # 2) single CIF
  python predict_ionic_conductivity.py --cif path\\to\\file.cif

  # 3) batch
  python predict_ionic_conductivity.py --csv batch.csv --cif-dir batch_cifs --match-col id

  # 4) optionally add real Materials Project data for band gap / hull / elastic columns
  python predict_ionic_conductivity.py --cif path\\to\\file.cif --mp-api-key YOUR_KEY
  #   (or: set the MP_API_KEY environment variable and omit --mp-api-key)
"""
from __future__ import annotations

import argparse
import csv
import difflib
import json
import math
import os
import re
import warnings
from dataclasses import dataclass
from pathlib import Path
from typing import Any

os.environ.setdefault("LOKY_MAX_CPU_COUNT", "1")

import sys
import warnings
warnings.filterwarnings("ignore", category=DeprecationWarning)
warnings.filterwarnings("ignore", category=UserWarning)

# Cross-version unpickling compatibility bridge for scikit-learn across Python 3.9 - 3.13
try:
    import sklearn._loss
    sys.modules.setdefault('_loss', sklearn._loss)
    for sub in ['loss', '_loss', 'link', 'distribution']:
        if hasattr(sklearn._loss, sub):
            sys.modules.setdefault(f'_loss.{sub}', getattr(sklearn._loss, sub))
        elif hasattr(sklearn._loss, '_loss'):
            sys.modules.setdefault(f'_loss.{sub}', getattr(sklearn._loss, '_loss'))
except Exception:
    pass

try:
    import sklearn.ensemble._hist_gradient_boosting._loss as _hgb_loss
    sys.modules.setdefault('_loss', _hgb_loss)
    sys.modules.setdefault('_loss.loss', _hgb_loss)
except Exception:
    pass

import joblib
import numpy as np
import pandas as pd
from pymatgen.core import Composition, Structure
try:
    from pymatgen.core.local_env import CrystalNN
except ImportError:
    from pymatgen.analysis.local_env import CrystalNN
from pymatgen.symmetry.analyzer import SpacegroupAnalyzer
from matminer.featurizers.composition import (
    ElementProperty,
    IonProperty,
    Stoichiometry,
    ValenceOrbital,
)
from matminer.featurizers.structure import DensityFeatures, GlobalSymmetryFeatures

try:
    from pymatgen.analysis.dimensionality import get_dimensionality_larsen
    from pymatgen.analysis.graphs import StructureGraph
    HAVE_DIMENSIONALITY = True
except Exception:
    HAVE_DIMENSIONALITY = False

warnings.filterwarnings("ignore")

ROOT = Path(__file__).resolve().parent
WORKSPACE = ROOT.parent
DEFAULT_TEMP_K = 298.15
K_B = 8.617333262145e-5


def _get_default_models_dir() -> Path:
    try:
        from backend.model_paths import resolve_pretrained_models_dir
        return Path(resolve_pretrained_models_dir("v5_base_models.pkl"))
    except Exception:
        try:
            from model_paths import resolve_pretrained_models_dir
            return Path(resolve_pretrained_models_dir("v5_base_models.pkl"))
        except Exception:
            candidates = [
                WORKSPACE / "pretrained_models",
                WORKSPACE.parent / "pretrained_models",
                WORKSPACE / "final_models" / "pretrained_models",
                WORKSPACE.parent / "final_models" / "pretrained_models",
                Path(r"C:\Users\saisu\Downloads\Surrogate_models\Surrogate_models\final_models\pretrained_models"),
            ]
            for c in candidates:
                if (c / "v5_base_models.pkl").exists():
                    return c
            return candidates[0]


MODELS_DIR = _get_default_models_dir()


NUMERIC = (int, float, np.integer, np.floating)
# v6 corrector columns use ep_/stoich_/vo_/ip_/dens_/sym_; v5 columns use magpie_/comp_form_/cif_
FEATURE_PREFIXES = ("ep_", "stoich_", "vo_", "ip_", "dens_", "sym_", "magpie_", "comp_form_", "cif_")


class SchemaMismatchError(RuntimeError):
    """Raised when the extracted features do not line up with what a model expects."""


@dataclass
class AlignOpts:
    strict: bool = True            # raise on bad alignment instead of predicting from zeros
    max_default_frac: float = 0.20  # max allowed fraction of zero-filled columns
    fuzzy: bool = False            # allow near-name matches (review them in the JSON!)
    fuzzy_cutoff: float = 0.93
    impute: str = "median"         # "median": fill uncomputed columns with TRAINING medians; "zero": old behaviour
    fill: dict | None = None       # {normalised column name: training median}, built from the quantile transformer


# --------------------------------------------------------------------------- #
# name helpers
# --------------------------------------------------------------------------- #
def norm_name(name: Any) -> str:
    """Spaces -> underscores."""
    return str(name).replace(" ", "_")


def canon_name(name: Any) -> str:
    """Canonical key: drop our own prefix, lower-case, collapse non-alphanumerics."""
    s = str(name)
    for p in FEATURE_PREFIXES:
        if s.startswith(p):
            s = s[len(p):]
            break
    return re.sub(r"[^a-z0-9]+", "_", s.lower()).strip("_")


def family_of(col: Any) -> str:
    s = canon_name(col)
    return s.split("_")[0] if s else "?"


def json_safe(value: Any) -> Any:
    if isinstance(value, np.bool_):
        return bool(value)
    if isinstance(value, np.integer):
        return int(value)
    if isinstance(value, np.floating):
        value = float(value)
    if isinstance(value, float):
        return value if math.isfinite(value) else None
    if isinstance(value, np.ndarray):
        return [json_safe(v) for v in value.tolist()]
    if isinstance(value, dict):
        return {str(k): json_safe(v) for k, v in value.items()}
    if isinstance(value, (list, tuple)):
        return [json_safe(v) for v in value]
    return value


def numeric_only(features: dict[str, Any]) -> dict[str, float]:
    out = {}
    for k, v in features.items():
        if isinstance(v, NUMERIC):
            fv = float(v)
            if math.isfinite(fv):
                out[k] = fv
    return out


# --------------------------------------------------------------------------- #
# models
# --------------------------------------------------------------------------- #
def load_models(models_dir: Path | str | None = None) -> dict[str, Any]:
    active_dir = Path(models_dir) if models_dir is not None else _get_default_models_dir()
    required = {
        "base_models": "v5_base_models.pkl",
        "model_A": "v5_model2_A.pkl",
        "meta_Ea": "v5_meta_model.pkl",
        "mlp_models": "v5_mlp_models.pkl",
        "qt_transformer": "v5_quantile_transformer.pkl",
    }
    missing = [name for name in required.values() if not (active_dir / name).exists()]
    if missing:
        raise FileNotFoundError(f"Missing model files in {active_dir}: {missing}")

    models = {key: joblib.load(active_dir / filename) for key, filename in required.items()}
    corrector_path = active_dir / "v6_corrector_model.pkl"
    models["corrector"] = joblib.load(corrector_path) if corrector_path.exists() else None
    models["train_ref"] = build_training_reference(models)
    models["train_range"] = build_training_range(models)
    models["percentile_curves"] = build_percentile_curves(models)
    return models



def build_training_reference(models: dict[str, Any]) -> dict[str, float]:
    """
    The fitted QuantileTransformer stores the training distribution of all 343 columns.
    Return {normalised column name: training median} so uncomputed features can be filled
    with a typical training value instead of 0 (0 is far outside the distribution for
    columns like volume, density or band gap).
    """
    qt = models["qt_transformer"]
    names = [str(c) for c in getattr(qt, "feature_names_in_", [])]
    q, refs = qt.quantiles_, qt.references_
    return {norm_name(n): float(np.interp(0.5, refs, q[:, i])) for i, n in enumerate(names)}


def build_training_range(models: dict[str, Any]) -> dict[str, tuple[float, float]]:
    """(p01, p99) of every training column, from the quantile transformer. Used to sanity-check computed values."""
    qt = models["qt_transformer"]
    names = [str(c) for c in getattr(qt, "feature_names_in_", [])]
    q, refs = qt.quantiles_, qt.references_
    return {norm_name(n): (float(np.interp(0.01, refs, q[:, i])), float(np.interp(0.99, refs, q[:, i])))
            for i, n in enumerate(names)}


def build_percentile_curves(models: dict[str, Any]) -> dict[str, tuple[np.ndarray, np.ndarray]]:
    """
    {normalised column name: (training_quantile_values, percentile_references)} for
    every column the quantile transformer was fit on. Used by compute_relative_features()
    to turn a real computed value (e.g. this material's density) into its percentile
    within the ACTUAL training distribution -- a legitimate way to get *_rank columns
    without needing the original training table.
    """
    qt = models["qt_transformer"]
    names = [str(c) for c in getattr(qt, "feature_names_in_", [])]
    return {norm_name(n): (qt.quantiles_[:, i].copy(), qt.references_.copy()) for i, n in enumerate(names)}


def compute_relative_features(numeric_features: dict[str, float], models: dict[str, Any]) -> dict[str, float]:
    """
    density_rank / energy_rank / hull_rank: percentile (0-1) of this material's real,
    computed density / energy_per_atom_eV / energy_above_hull within the TRAINING
    distribution of that same column (read from the fitted quantile transformer).
    Only emitted when the source value is actually available (density always is;
    energy_per_atom_eV needs --mlip; energy_above_hull needs --mp-api-key) -- no
    fabrication, this just skips when the input it needs wasn't computed.
    """
    curves = models.get("percentile_curves", {})
    mapping = {"density_rank": "density", "energy_rank": "energy_per_atom_eV", "hull_rank": "energy_above_hull"}
    out: dict[str, float] = {}
    for target_col, source_col in mapping.items():
        key = norm_name(source_col)
        if key in curves and source_col in numeric_features:
            quants, refs = curves[key]
            try:
                out[target_col] = float(np.interp(numeric_features[source_col], quants, refs))
            except Exception:
                pass
    return out


def expected_columns(model: Any, fallback: list[str] | None = None) -> list[str]:
    """Which feature columns (in order) does this fitted model expect?"""
    if hasattr(model, "feature_names_in_"):
        return [str(c) for c in model.feature_names_in_]
    if hasattr(model, "feature_name_"):
        return [str(c) for c in model.feature_name_]
    if hasattr(model, "feature_names_"):
        return [str(c) for c in model.feature_names_]
    if hasattr(model, "get_booster"):
        try:
            names = model.get_booster().feature_names
            if names:
                return [str(c) for c in names]
        except Exception:
            pass
    return list(fallback or [])


# --------------------------------------------------------------------------- #
# feature extraction
# --------------------------------------------------------------------------- #
def ordered_approximation(structure: Structure) -> Structure:
    """
    Majority-species ordered copy of a disordered structure.
    Used ONLY for descriptors that refuse disordered input; composition-based
    features and density are always computed from the real structure.
    """
    species, coords = [], []
    for site in structure:
        sp = max(site.species.items(), key=lambda kv: kv[1])[0]
        species.append(sp)
        coords.append(site.frac_coords)
    return Structure(structure.lattice, species, coords)


def featurize_structure(f: Any, structure: Structure, notes: list[str], label: str) -> tuple[Any, bool]:
    """Run a structure featurizer; fall back to an ordered approximation if needed."""
    try:
        return f.featurize(structure), False
    except Exception:
        if structure.is_ordered:
            raise
        notes.append(f"{label}: computed on majority-species ordered approximation (disordered CIF)")
        return f.featurize(ordered_approximation(structure)), True


MLIP_RUNNER: tuple[str, Any, Path | None] | None = None   # set by configure_mlip()
MP_API_KEY: str | None = None                              # set by configure_mp()


def configure_mlip(name: str, emb_dir: Path | None) -> None:
    """
    Optional machine-learned-potential backend. It supplies the ENERGY columns
    (energy_eV, energy_per_atom_eV, energy_per_volume) and saves the structure embedding
    of every material to  <emb_dir>/<id>_<backend>_embedding.npy .
    NOTE: the v5 models contain no embedding columns, so embeddings are saved for
    the next model version (retraining) and are NOT fed into the current predictors.
    """
    global MLIP_RUNNER
    if name == "none":
        MLIP_RUNNER = None
        return
    if emb_dir is not None:
        emb_dir.mkdir(parents=True, exist_ok=True)

    if name == "chgnet":
        from chgnet.model import CHGNet
        model = CHGNet.load()

        def run(structure: Structure) -> tuple[float, np.ndarray | None]:
            pred = model.predict_structure(structure, return_crystal_feas=True)
            return float(pred["e"]), np.asarray(pred["crystal_fea"], dtype=float).reshape(-1)

    elif name == "m3gnet":
        import matgl
        from matgl.ext.ase import PESCalculator
        from pymatgen.io.ase import AseAtomsAdaptor
        pot = matgl.load_model("M3GNet-MP-2021.2.8-PES")
        calc = PESCalculator(pot)
        captured: dict[str, Any] = {}
        head = getattr(pot.model, "final_layer", None)     # input of the final MLP = pooled structure vector
        if head is not None:
            head.register_forward_hook(lambda mod, inp, out: captured.__setitem__("emb", inp[0].detach().cpu().numpy()))

        def run(structure: Structure) -> tuple[float, np.ndarray | None]:
            atoms = AseAtomsAdaptor.get_atoms(structure)
            atoms.calc = calc
            e_total = float(atoms.get_potential_energy())
            emb = captured.get("emb")
            return e_total / len(atoms), (None if emb is None else np.asarray(emb, dtype=float).reshape(-1))
    else:
        raise ValueError(f"Unknown --mlip backend: {name}")

    MLIP_RUNNER = (name, run, emb_dir)


def configure_mp(api_key: str | None) -> None:
    """Optional Materials Project backend for DFT-database columns (see bucket (3) in the module docstring)."""
    global MP_API_KEY
    MP_API_KEY = api_key or os.environ.get("MP_API_KEY") or None


def fetch_mp_features(structure: Structure, formula: str) -> dict[str, float]:
    """
    OPTIONAL: pulls band gap / hull energy / formation energy / elastic moduli for the
    best-matching entry on the Materials Project, if MP_API_KEY is set AND the `mp-api`
    package is installed (`pip install mp-api`). This is the only honest source for these
    columns; they are DFT database values a CIF-only extractor cannot compute. Silently
    returns {} on any failure (no key, no package, no network, no match) so the caller
    falls back to training-median imputation exactly as before -- nothing is fabricated.
    """
    if not MP_API_KEY:
        return {}
    try:
        from mp_api.client import MPRester
    except Exception:
        print("[MaterialsProject] --mp-api-key was given but the 'mp-api' package is not installed "
              "(pip install mp-api). Skipping; band_gap/hull/elastic columns will be median-imputed.")
        return {}

    out: dict[str, float] = {}
    try:
        with MPRester(MP_API_KEY) as mpr:
            docs = mpr.materials.summary.search(
                formula=formula,
                fields=["material_id", "band_gap", "energy_above_hull", "formation_energy_per_atom",
                        "is_stable", "bulk_modulus", "shear_modulus", "density"],
            )
        if not docs:
            return {}
        target_density = float(structure.density)
        best = min(docs, key=lambda d: abs((getattr(d, "density", None) or target_density) - target_density))
        if getattr(best, "band_gap", None) is not None:
            out["band_gap"] = float(best.band_gap)
        if getattr(best, "energy_above_hull", None) is not None:
            out["energy_above_hull"] = float(best.energy_above_hull)
        if getattr(best, "formation_energy_per_atom", None) is not None:
            out["formation_energy_per_atom"] = float(best.formation_energy_per_atom)
        if getattr(best, "is_stable", None) is not None:
            out["is_stable"] = float(bool(best.is_stable))
        bulk = getattr(best, "bulk_modulus", None)
        if isinstance(bulk, dict) and bulk.get("vrh") is not None:
            out["K_GPa"] = float(bulk["vrh"])
        shear = getattr(best, "shear_modulus", None)
        if isinstance(shear, dict) and shear.get("vrh") is not None:
            out["G_GPa"] = float(shear["vrh"])
    except Exception as exc:
        print(f"[MaterialsProject] lookup failed for {formula}: {type(exc).__name__}: {exc}")
        return {}
    return out


def _derive_db_combo_features(db: dict[str, float], struct_feats: dict[str, float]) -> dict[str, float]:
    """
    Arithmetic combination features built ONLY from real Materials Project values
    (never from imputed/defaulted ones). The elastic relations (E, nu from K & G) are
    exact isotropic-elasticity textbook formulas, not guesses. estimated_voltage_window_eV
    and the *_x_* cross-terms are explicitly flagged INFERRED -- reasonable engineered
    proxies, not a reproduction of the original (unknown) training definition.
    """
    out: dict[str, float] = {}
    bg = db.get("band_gap")
    hull = db.get("energy_above_hull")
    fe = db.get("formation_energy_per_atom")
    dens = struct_feats.get("density")
    n = struct_feats.get("n_atoms")

    if bg is not None:
        out["bandgap_sq"] = bg ** 2
        out["log_bandgap"] = math.log1p(max(bg, 0.0))
        out["estimated_voltage_window_eV"] = bg  # INFERRED heuristic proxy, see docstring
        if hull is not None:
            out["bandgap_x_hull"] = bg * hull
        if dens is not None:
            out["bandgap_x_density"] = bg * dens
    if hull is not None:
        out["hull_sq"] = hull ** 2
    if fe is not None:
        out["form_energy_sq"] = fe ** 2
        if hull is not None:
            out["formation_x_hull"] = fe * hull
            out["energy_stability"] = fe - hull

    K, G = db.get("K_GPa"), db.get("G_GPa")
    if K is not None and G is not None and G != 0 and (3 * K + G) != 0:
        out["KG_ratio"] = K / G
        out["pugh_ratio"] = K / G
        out["K_G_diff"] = K - G
        out["K_times_G"] = K * G
        out["K_G_ratio_sq"] = (K / G) ** 2
        out["ductile_brittle"] = 1.0 if (K / G) > 1.75 else 0.0
        out["poisson_ratio"] = (3 * K - 2 * G) / (2 * (3 * K + G))
        out["E_GPa"] = 9 * K * G / (3 * K + G)
    if K is not None:
        out["sqrt_K"] = math.sqrt(max(K, 0.0))
        if dens:
            out["K_over_density"] = K / dens
        if n:
            out["K_per_atom"] = K / n
    if G is not None:
        out["sqrt_G"] = math.sqrt(max(G, 0.0))
        if dens:
            out["G_over_density"] = G / dens
            out["debye_proxy"] = math.sqrt(max(G, 0.0) / dens)  # INFERRED: shear-wave-speed-like scaling, not a real Debye temperature
        if n:
            out["G_per_atom"] = G / n

    return {k: v for k, v in out.items() if isinstance(v, (int, float)) and math.isfinite(float(v))}


# Static, public-domain reference tables (NOT per-material fitted data; approximate,
# order-of-magnitude only). Only used when every element in the composition is covered,
# so a missing element degrades to normal median imputation instead of a wrong partial average.
_ELEMENT_ABUNDANCE_PPM = {
    "H": 1400, "B": 10, "C": 200, "N": 19, "O": 461000, "F": 585, "Na": 23000, "Mg": 23000,
    "Al": 82000, "Si": 282000, "P": 1050, "S": 350, "Cl": 145, "K": 21000, "Ca": 41000,
    "Sc": 22, "Ti": 5600, "V": 120, "Cr": 102, "Mn": 950, "Fe": 56300, "Co": 25, "Ni": 84,
    "Cu": 60, "Zn": 70, "Ga": 19, "Ge": 1.5, "As": 1.8, "Se": 0.05, "Br": 2.4, "Rb": 90,
    "Sr": 370, "Y": 33, "Zr": 165, "Nb": 20, "Mo": 1.2, "Ag": 0.075, "Cd": 0.15, "In": 0.25,
    "Sn": 2.3, "Sb": 0.2, "I": 0.45, "Cs": 3, "Ba": 425, "La": 39, "Ce": 66.5, "Nd": 41.5,
    "Sm": 7.05, "Eu": 2, "Gd": 6.2, "Ta": 2, "W": 1.25, "Bi": 0.0085, "Th": 9.6, "U": 2.7,
    "Li": 20, "Pb": 14, "Hf": 3,
}
_ELEMENT_TOXICITY_1TO5 = {
    "H": 1, "B": 2, "C": 1, "N": 1, "O": 1, "F": 3, "Na": 1, "Mg": 1, "Al": 1, "Si": 1,
    "P": 2, "S": 1, "Cl": 2, "K": 1, "Ca": 1, "Ti": 1, "V": 3, "Cr": 3, "Mn": 2, "Fe": 1,
    "Co": 3, "Ni": 3, "Cu": 2, "Zn": 2, "As": 5, "Se": 3, "Br": 2, "Y": 2, "Zr": 1, "Nb": 1,
    "Ag": 3, "Cd": 5, "In": 2, "Sn": 2, "Sb": 4, "I": 2, "Ba": 3, "La": 2, "Ce": 2, "Nd": 2,
    "Ta": 1, "W": 2, "Bi": 2, "Pb": 5, "Li": 2,
}


def _element_reference_features(comp: Composition) -> dict[str, float]:
    els = list(comp.element_composition.elements)
    syms = [el.symbol for el in els]
    amounts = [float(comp.element_composition[el]) for el in els]
    out: dict[str, float] = {}
    if all(s in _ELEMENT_ABUNDANCE_PPM for s in syms):
        out["mean_element_abundance"] = float(np.average([_ELEMENT_ABUNDANCE_PPM[s] for s in syms], weights=amounts))
    if all(s in _ELEMENT_TOXICITY_1TO5 for s in syms):
        out["mean_element_toxicity"] = float(np.average([_ELEMENT_TOXICITY_1TO5[s] for s in syms], weights=amounts))
    return out


def _wstats(values: list[float], weights: list[float]) -> tuple[float, float]:
    v, w = np.array(values, float), np.array(weights, float)
    ok = np.isfinite(v)
    if not ok.any():
        return float("nan"), float("nan")
    v, w = v[ok], w[ok] / w[ok].sum()
    m = float((v * w).sum())
    return m, float(np.sqrt((w * (v - m) ** 2).sum()))


def _neighbor_distance_features(structure: Structure) -> dict[str, float]:
    """
    Nearest-neighbour distances (cutoff-independent as long as the cutoff is generous).
    INFERRED definitions (original code not available):
      bl_min          shortest interatomic distance in the structure
      li_bl_min       shortest Li -> any-atom distance
      li_anion_bl_min shortest Li -> anion-like (X >= 2.0, not H) distance
      li_dmin         shortest Li-Li distance within 7 A (0 if none)
    """
    if not structure.is_ordered:
        return {}
    is_li = [site.specie.symbol == "Li" for site in structure]
    bl_min = li_bl = li_an = li_d = math.inf
    for i, nbs in enumerate(structure.get_all_neighbors(7.0)):
        for nb in nbs:
            d = float(nb.nn_distance)
            bl_min = min(bl_min, d)
            if not is_li[i]:
                continue
            li_bl = min(li_bl, d)
            sp = nb.specie
            if sp.symbol == "Li":
                li_d = min(li_d, d)
            elif sp.symbol != "H" and sp.X == sp.X and sp.X >= 2.0:
                li_an = min(li_an, d)
    out: dict[str, float] = {}
    if bl_min < math.inf:
        out["bl_min"] = bl_min
    if any(is_li):
        if li_bl < math.inf:
            out["li_bl_min"] = li_bl
        if li_an < math.inf:
            out["li_anion_bl_min"] = li_an
        out["li_dmin"] = li_d if li_d < math.inf else 0.0
    return out


def _bond_geometry_stats(structure: Structure, angle_site_cap: int = 60, anion_pair_cap: int = 200) -> dict[str, float]:
    """
    GENUINE computation (bucket (1) in the module docstring): coordination numbers,
    bond-length statistics and simple geometric counts, via pymatgen's CrystalNN (a
    real, published near-neighbour algorithm) with a fixed-radius fallback. Not
    guaranteed to reproduce the exact cutoff/algorithm choices of the original
    (unavailable) training-notebook extractor, but every number here is a real
    computation on the real structure, not a fabricated value.
    Skips the O(k^2) bond-angle pass on very high-coordination sites, and the
    O(n_anion^2) anion-anion pass on very anion-rich cells, to keep runtime bounded;
    in that case the corresponding columns are simply omitted (imputed later).
    """
    if not structure.is_ordered:
        return {}
    try:
        cnn = CrystalNN()
    except Exception:
        cnn = None

    is_li = [site.specie.symbol == "Li" for site in structure]

    def is_anion_site(site) -> bool:
        sp = site.specie
        x = getattr(sp, "X", float("nan"))
        return sp.symbol not in ("Li", "H") and x == x and x >= 2.0

    all_cn, all_bl, li_cn, li_bl, li_anion_bl, angle_devs = [], [], [], [], [], []
    n_short = n_long = 0
    SHORT_FACTOR, LONG_CUTOFF = 0.6, 3.5

    for i, site in enumerate(structure):
        nbs = None
        if cnn is not None:
            try:
                nbs = cnn.get_nn_info(structure, i)
            except Exception:
                nbs = None
        if not nbs:
            try:
                nbs = [{"site": nb} for nb in structure.get_neighbors(site, 3.5)]
            except Exception:
                continue
        cn = len(nbs)
        if cn == 0:
            continue
        all_cn.append(cn)
        for nb in nbs:
            nb_site = nb["site"]
            d = float(np.linalg.norm(np.array(site.coords) - np.array(nb_site.coords)))
            all_bl.append(d)
            r1 = getattr(site.specie, "atomic_radius", None) or 1.0
            r2 = getattr(nb_site.specie, "atomic_radius", None) or 1.0
            if d < SHORT_FACTOR * (r1 + r2):
                n_short += 1
            if d > LONG_CUTOFF:
                n_long += 1
            if is_li[i]:
                li_bl.append(d)
                x = getattr(nb_site.specie, "X", float("nan"))
                if nb_site.specie.symbol not in ("Li", "H") and x == x and x >= 2.0:
                    li_anion_bl.append(d)
        if is_li[i]:
            li_cn.append(cn)
        if 2 <= cn <= angle_site_cap:
            ideal = 109.47 if cn == 4 else (90.0 if cn in (6, 8) else 120.0)
            for a in range(len(nbs)):
                for b in range(a + 1, len(nbs)):
                    try:
                        v1 = np.array(nbs[a]["site"].coords) - np.array(site.coords)
                        v2 = np.array(nbs[b]["site"].coords) - np.array(site.coords)
                        cosang = np.dot(v1, v2) / (np.linalg.norm(v1) * np.linalg.norm(v2) + 1e-12)
                        angle_devs.append(abs(math.degrees(math.acos(np.clip(cosang, -1.0, 1.0))) - ideal))
                    except Exception:
                        continue

    def mu_sd(vals):
        if not vals:
            return float("nan"), float("nan")
        a = np.array(vals, float)
        return float(a.mean()), float(a.std())

    out: dict[str, float] = {}
    cn_mu, cn_sd = mu_sd(all_cn)
    bl_mu, bl_sd = mu_sd(all_bl)
    ang_mu, _ = mu_sd(angle_devs)
    out.update({"cn_mu": cn_mu, "cn_sd": cn_sd, "bl_mu": bl_mu, "bl_sd": bl_sd,
                "short_bonds": float(n_short), "long_bonds": float(n_long)})
    if angle_devs:
        out["angle_dev"] = ang_mu
    if li_cn:
        lm, ls = mu_sd(li_cn)
        out.update({"li_cn_mu": lm, "li_cn_sd": ls, "li_cn_min": float(min(li_cn))})
    if li_bl:
        lbm, lbs = mu_sd(li_bl)
        out.update({"li_bl_mu": lbm, "li_bl_sd": lbs})
        if lbm:
            out["li_distortion_mu"] = lbs / lbm
            out["li_distortion_max"] = (max(li_bl) - lbm) / lbm
    if li_anion_bl:
        lam, las = mu_sd(li_anion_bl)
        out.update({"li_anion_bl_mu": lam, "li_anion_bl_sd": las})

    anion_idx = [i for i, s in enumerate(structure) if is_anion_site(s)]
    n_anions = len(anion_idx)
    out["n_anions"] = float(n_anions)
    out["anion_frac"] = n_anions / max(structure.num_sites, 1)
    if 0 < n_anions <= anion_pair_cap:
        anion_d = []
        for a in range(len(anion_idx)):
            for b in range(a + 1, len(anion_idx)):
                try:
                    d = float(structure.get_distance(anion_idx[a], anion_idx[b]))
                except Exception:
                    continue
                if d < 4.0:
                    anion_d.append(d)
        out["n_anion_bonds"] = float(len(anion_d))
        if anion_d:
            adm, ads = mu_sd(anion_d)
            out.update({"anion_dmu": adm, "anion_dsd": ads, "anion_dmin": float(min(anion_d))})

    return {k: v for k, v in out.items() if isinstance(v, (int, float)) and math.isfinite(float(v))}


def _wyckoff_stats(structure: Structure) -> dict[str, float]:
    """
    GENUINE computation: Wyckoff-position multiplicities for Li sites, read directly
    from spglib's symmetry dataset via SpacegroupAnalyzer. The multiplicity number
    itself is exact; what's uncertain is only whether "li_wyckoff_mu/max" in the
    original training table meant multiplicity specifically (a reasonable reading)
    or something else -- flagged "computed*" in missing_features_report.csv.
    """
    if not structure.is_ordered:
        return {}
    try:
        sga = SpacegroupAnalyzer(structure, symprec=0.1)
        dataset = sga.get_symmetry_dataset()
        equiv = dataset.equivalent_atoms if hasattr(dataset, "equivalent_atoms") else dataset["equivalent_atoms"]
    except Exception:
        return {}
    mult: dict[int, int] = {}
    for eq in equiv:
        mult[int(eq)] = mult.get(int(eq), 0) + 1
    li_mults = [float(mult[int(equiv[i])]) for i, site in enumerate(structure) if site.specie.symbol == "Li"]
    if not li_mults:
        return {}
    return {"li_wyckoff_mu": float(np.mean(li_mults)), "li_wyckoff_max": float(max(li_mults))}


def _li_dimensionality(structure: Structure, cutoff: float = 4.0) -> dict[str, float]:
    """
    Dimensionality (0-3) of the Li percolation network, via pymatgen's real
    implementation of the Larsen et al. bonded-structure dimensionality algorithm --
    the same method used in the solid-electrolyte literature to classify 1D/2D/3D
    Li-ion conduction pathways. Bonding here is a simple Li-Li distance cutoff, used
    as a stand-in for a true migration-pathway graph (which would need NEB/bond-
    valence pathway data we don't have) -- so this is bucket (2): a real algorithm,
    an inferred graph definition. Flagged "computed*" in the report.
    """
    if not HAVE_DIMENSIONALITY or not structure.is_ordered:
        return {}
    li_indices = [i for i, s in enumerate(structure) if s.specie.symbol == "Li"]
    if len(li_indices) < 2:
        return {}
    try:
        sub = Structure.from_sites([structure[i] for i in li_indices])
        sg = StructureGraph.from_empty_graph(sub, name="li-net")
        for i in range(len(sub)):
            for nb in sub.get_neighbors(sub[i], cutoff):
                j = nb.index
                if j <= i:
                    continue
                sg.add_edge(i, j, to_jimage=nb.image, warn_duplicates=False)
        dim = int(get_dimensionality_larsen(sg))
    except Exception:
        return {}
    dim = max(0, min(3, dim))
    return {"li_dim": float(dim), "li_dim_1d": float(dim == 1),
            "li_dim_2d": float(dim == 2), "li_dim_3d": float(dim == 3)}


def extract_extra_features(structure: Structure, features: dict[str, Any]) -> dict[str, float]:
    """
    Columns the v5 models were trained on that can be computed directly.
    Every definition below was checked against the training distribution stored in the
    quantile transformer (e.g. log_* are natural logs, volume_per_atom = volume / n_atoms,
    vol_density = volume * density, cif_mean_en == comp_form_mean_en).

    STILL MISSING (need the original training code or an external simulation/database,
    see missing_features_report.csv and the module docstring buckets (3)/(4)):
      * the deepest Li-environment geometry (Voronoi facets/bottleneck radii/site
        energy) -- best-effort proxies are NOT included here because they'd carry real
        feature-importance weight while being too speculative to trust; genuine
        Voronoi/CN stats and Wyckoff/dimensionality ARE included (see below)
      * database / DFT columns needing the training table itself: *_vs_form_mu,
        formula_count, thermal_stability
      * Model A only: diffusion_coefficient_300K, li_transference_number, barriers, ...
        (literally simulation output; not derivable from a CIF, see module docstring)
    """
    comp = structure.composition
    n = float(comp.num_atoms)
    vol = float(structure.volume)
    dens = float(structure.density)
    vpa = vol / n

    out: dict[str, float] = {
        "density": dens, "volume": vol, "n_atoms": n, "volume_per_atom": vpa,
        "log_density": math.log(dens), "log_volume": math.log(vol), "log_n_atoms": math.log(n),
        "vol_per_atom_sq": vpa ** 2, "vol_density": vol * dens,
        "cif_lat_volume": vol,
    }
    if "sym_spacegroup_num" in features:
        out["cif_spacegroup"] = float(features["sym_spacegroup_num"])

    els = list(comp.element_composition.items())
    amounts = [float(a) for _, a in els]
    en = [float(el.X) if el.X == el.X else float("nan") for el, _ in els]
    mass = [float(el.atomic_mass) for el, _ in els]
    rad = [float(el.atomic_radius) if el.atomic_radius is not None else float("nan") for el, _ in els]
    mean_en, std_en = _wstats(en, amounts)
    mean_m, std_m = _wstats(mass, amounts)
    mean_r, std_r = _wstats(rad, amounts)
    n_li = float(comp.element_composition.get("Li", 0))
    out.update({
        "cif_mean_en": mean_en, "cif_std_en": std_en,
        "cif_mean_mass": mean_m, "cif_std_mass": std_m,
        "cif_mean_radius": mean_r, "cif_std_radius": std_r,
        "cif_li_count": n_li,
        "comp_form_num_elements": float(len(els)),
        "comp_form_mean_en": mean_en, "comp_form_max_en": float(np.nanmax(en)), "comp_form_min_en": float(np.nanmin(en)),
        "comp_form_mean_mass": mean_m, "comp_form_max_mass": max(mass), "comp_form_min_mass": min(mass),
        "comp_form_li_fraction": n_li / n,
    })

    # comp_form_mean_valence -- INFERRED: the original definition of "valence" here is
    # unknown, so this uses each element's mean common oxidation state (weighted by
    # composition) as a physically reasonable proxy. Flagged "computed*" in the report.
    try:
        ox_vals, ox_weights = [], []
        for el, amt in els:
            states = el.common_oxidation_states or el.oxidation_states
            if states:
                ox_vals.append(float(np.mean(states)))
                ox_weights.append(float(amt))
        if ox_vals:
            cmv, _ = _wstats(ox_vals, ox_weights)
            out["comp_form_mean_valence"] = cmv
    except Exception:
        pass

    out.update(_element_reference_features(comp))

    # cif_v3_c3_* / cif_v2_c2_* : the "basic" members of these families are the same quantities as the
    # plain cif_* columns (training medians agree), so they are computed here. Li-environment features
    # (coordination, dimensionality, Voronoi, bottleneck, site energy, ...) are NOT: they need the original code.
    lat = structure.lattice
    zs = [float(el.Z) for el, _ in els]
    mean_z, std_z = _wstats(zs, amounts)
    ratio = lambda x, y: max(x, y) / min(x, y)
    basic = {
        "a": lat.a, "b": lat.b, "c": lat.c, "al": lat.alpha, "be": lat.beta, "ga": lat.gamma,
        "vol": vol, "dens": dens, "n": n, "vpa": vpa,
        "ani_ab": ratio(lat.a, lat.b), "ani_ac": ratio(lat.a, lat.c), "ani_bc": ratio(lat.b, lat.c),
        "en_mu": mean_en, "en_sd": std_en, "en_max": float(np.nanmax(en)), "en_min": float(np.nanmin(en)),
        "en_rng": float(np.nanmax(en) - np.nanmin(en)),
        "ar_mu": mean_r, "ar_sd": std_r, "am_mu": mean_m, "am_sd": std_m,
        "Z_mu": mean_z, "Z_sd": std_z, "Z_max": max(zs),
        "n_elem": float(len(els)), "n_li": n_li, "li_frac": n_li / n, "li_pvol": n_li / vol,
    }
    if "dens_packing fraction" in features:
        basic["pack"] = float(features["dens_packing fraction"])
    try:
        basic.update(_neighbor_distance_features(structure))
    except Exception as exc:
        print(f"[geometry] neighbour-distance features failed: {type(exc).__name__}: {exc}")
    try:
        basic.update(_bond_geometry_stats(structure))
    except Exception as exc:
        print(f"[geometry] bond/coordination stats failed: {type(exc).__name__}: {exc}")
    try:
        basic.update(_wyckoff_stats(structure))
    except Exception as exc:
        print(f"[geometry] Wyckoff stats failed: {type(exc).__name__}: {exc}")
    try:
        basic.update(_li_dimensionality(structure))
    except Exception as exc:
        print(f"[geometry] Li-dimensionality failed: {type(exc).__name__}: {exc}")

    # Bare (non cif_v3_c3_/cif_v2_c2_ prefixed) aliases some models expect directly.
    if "bl_mu" in basic:
        out["cif_mean_bond_length"] = basic["bl_mu"]
    if "bl_sd" in basic:
        out["cif_std_bond_length"] = basic["bl_sd"]
    if "cn_mu" in basic:
        out["cif_mean_cn"] = basic["cn_mu"]
    if "cn_sd" in basic:
        out["cif_std_cn"] = basic["cn_sd"]
    if "sym_crystal_system_int" in features:
        out["cif_crystal_system"] = float(features["sym_crystal_system_int"])

    for prefix in ("cif_v3_c3_", "cif_v2_c2_"):
        out.update({prefix + k: v for k, v in basic.items()})

    if MLIP_RUNNER is not None:
        name, run, emb_dir = MLIP_RUNNER
        sid = features.get("mv_id", "structure")
        if not structure.is_ordered:
            print(f"[MLIP] {sid}: skipped, disordered structure (energies would be meaningless)")
        else:
            try:
                e_atom, emb = run(structure)
                out["energy_per_atom_eV"] = e_atom
                out["energy_eV"] = e_atom * n
                out["energy_per_volume"] = e_atom * n / vol
                if emb is not None and emb_dir is not None:
                    np.save(emb_dir / f"{sid}_{name}_embedding.npy", emb)
            except Exception as exc:
                print(f"[MLIP] {sid}: {name} failed: {type(exc).__name__}: {exc}")

    return {k: float(v) for k, v in out.items() if isinstance(v, (int, float, np.floating)) and math.isfinite(float(v))}


def extract_obliex_style_features(cif_path: Path) -> tuple[Structure, dict[str, Any], dict[str, Any]]:
    structure = Structure.from_file(str(cif_path))
    comp = Composition(structure.composition.reduced_formula)

    features: dict[str, Any] = {
        "formula": structure.composition.reduced_formula,
        "mv_id": cif_path.stem,
    }
    failures: list[dict[str, str]] = []
    notes: list[str] = []
    groups: dict[str, int] = {}

    def add_group(group: str, values: dict[str, Any]) -> None:
        features.update(values)
        groups[group] = groups.get(group, 0) + len(values)

    def fail(stage: str, exc: Exception) -> None:
        failures.append({"stage": stage, "error": f"{type(exc).__name__}: {exc}"})

    def comp_group(group: str, prefix: str, featurizer: Any) -> None:
        try:
            vals = dict(zip(
                (f"{prefix}{lab}" for lab in featurizer.feature_labels()),
                featurizer.featurize(comp),
            ))
            add_group(group, vals)
        except Exception as exc:
            fail(group, exc)

    comp_group("stoichiometry", "stoich_", Stoichiometry())
    comp_group("magpie", "ep_", ElementProperty.from_preset("magpie"))
    comp_group("valence_orbital", "vo_", ValenceOrbital())
    comp_group("ion_property", "ip_", IonProperty())

    add_group("manual_composition", {
        "li_fraction": comp.get_atomic_fraction("Li"),
        "n_elements": len(comp.elements),
        "n_sites_ratio": comp.num_atoms / max(len(comp.elements), 1),
    })

    try:
        f = DensityFeatures()
        raw, approx = featurize_structure(f, structure, notes, "density")
        vals = {f"dens_{n}": v for n, v in zip(f.feature_labels(), raw)}
        if approx:  # density / vpa are exact even for disordered structures
            vals["dens_density"] = float(structure.density)
            vals["dens_vpa"] = float(structure.volume / structure.composition.num_atoms)
        add_group("density", vals)
    except Exception as exc:
        fail("density", exc)

    try:
        f = GlobalSymmetryFeatures()
        raw, _ = featurize_structure(f, structure, notes, "symmetry")
        add_group("symmetry", {f"sym_{n}": v for n, v in zip(f.feature_labels(), raw)})
    except Exception as exc:
        fail("symmetry", exc)

    lat = structure.lattice
    add_group("lattice", {
        "lat_a": lat.a, "lat_b": lat.b, "lat_c": lat.c,
        "lat_alpha": lat.alpha, "lat_beta": lat.beta, "lat_gamma": lat.gamma,
        "lat_vol": lat.volume,
        "vol_per_atom": lat.volume / max(structure.num_sites, 1),
    })

    li_sites = sum(site.species.element_composition.get("Li", 0) for site in structure)
    add_group("li_site_descriptors", {
        "n_li_sites": li_sites,
        "li_site_frac": li_sites / max(structure.num_sites, 1),
        "n_sites": structure.num_sites,
    })

    try:
        extra = extract_extra_features(structure, features)
        if extra:
            add_group("extra", extra)
    except Exception as exc:
        fail("extra_features", exc)

    try:
        db_feats = fetch_mp_features(structure, comp.reduced_formula)
        if db_feats:
            add_group("materials_project", db_feats)
            combo = _derive_db_combo_features(db_feats, features)
            if combo:
                add_group("db_derived", combo)
        elif MP_API_KEY:
            notes.append("Materials Project lookup returned no match or failed; "
                          "band_gap/hull/elastic columns will be training-median imputed.")
    except Exception as exc:
        fail("materials_project", exc)

    numeric = numeric_only(features)
    report = {
        "source_counts": groups,
        "failures": failures,
        "notes": notes,
        "n_total_features": len(features),
        "n_numeric_features": len(numeric),
    }
    return structure, features, report


# --------------------------------------------------------------------------- #
# alignment (the part that was silently broken)
# --------------------------------------------------------------------------- #
def align_features(numeric: dict[str, float], expected: list[str], opts: AlignOpts | None = None
                   ) -> tuple[pd.DataFrame, dict[str, Any]]:
    opts = opts or AlignOpts()
    if not expected:
        raise SchemaMismatchError("Could not read the expected feature names from this model.")

    normalized = {norm_name(k): v for k, v in numeric.items()}
    canonical: dict[str, float] = {}
    for k, v in numeric.items():
        canonical.setdefault(canon_name(k), v)
    canon_keys = list(canonical)

    row: dict[str, float] = {}
    by = {"exact": [], "normalized": [], "canonical": [], "fuzzy": []}
    defaulted: list[str] = []
    fuzzy_map: dict[str, str] = {}
    fill = opts.fill or {}
    n_median = 0

    for col in expected:
        if col in numeric:
            row[col] = numeric[col]; by["exact"].append(col)
        elif col in normalized:
            row[col] = normalized[col]; by["normalized"].append(col)
        elif canon_name(col) in canonical:
            row[col] = canonical[canon_name(col)]; by["canonical"].append(col)
        else:
            hit = difflib.get_close_matches(canon_name(col), canon_keys, n=1, cutoff=opts.fuzzy_cutoff) if opts.fuzzy else []
            if hit:
                row[col] = canonical[hit[0]]; by["fuzzy"].append(col); fuzzy_map[col] = hit[0]
            else:
                fv = fill.get(norm_name(col)) if opts.impute == "median" else None
                row[col] = float(fv) if fv is not None else 0.0
                defaulted.append(col)
                if fv is not None:
                    n_median += 1

    diag = {
        "expected": len(expected),
        "matched_exact": len(by["exact"]),
        "matched_normalized": len(by["normalized"]),
        "matched_canonical": len(by["canonical"]),
        "matched_fuzzy": len(by["fuzzy"]),
        "defaulted_to_zero": len(defaulted),          # = columns NOT computed (name kept for compatibility)
        "filled_with_training_median": n_median,
        "default_fraction": len(defaulted) / len(expected),
        "defaulted_features": defaulted,
        "fuzzy_matches": fuzzy_map,
        "fed_values": row,
    }
    return pd.DataFrame([row], columns=expected), diag


def n_matched(diag: dict[str, Any]) -> int:
    return diag["expected"] - diag["defaulted_to_zero"]


def check_alignment(diag: dict[str, Any], label: str, opts: AlignOpts) -> bool:
    """Refuse to predict from mostly-zero input. Returns True if the limit was exceeded
    (only reachable with --allow-mismatch; the caller then tags the result PROVISIONAL)."""
    if diag["default_fraction"] <= opts.max_default_frac:
        return False
    msg = (
        f"{label}: {diag['defaulted_to_zero']}/{diag['expected']} features not computed by this extractor "
        f"({diag['default_fraction']:.0%}, limit {opts.max_default_frac:.0%}). "
        f"Feature-schema mismatch. Run:  python {Path(__file__).name} --diagnose <file.cif>  "
        f"(or pass --allow-mismatch for a PROVISIONAL run)"
    )
    if opts.strict:
        raise SchemaMismatchError(msg)
    return True


def top_importances(model: Any, top_n: int = 12) -> list[dict[str, Any]]:
    if not hasattr(model, "feature_importances_"):
        return []
    names = expected_columns(model)
    pairs = sorted(zip(names, model.feature_importances_), key=lambda item: -float(item[1]))
    return [{"feature": n, "importance": float(v)} for n, v in pairs[:top_n]]


# --------------------------------------------------------------------------- #
# prediction
# --------------------------------------------------------------------------- #
def predict_one(cif_path: Path, temperature: float, models: dict[str, Any],
                apply_corrector: bool = True, opts: AlignOpts | None = None) -> dict[str, Any]:
    opts = opts or AlignOpts()
    structure, features, extraction_report = extract_obliex_style_features(cif_path)
    numeric_features = numeric_only(features)
    numeric_features.update(compute_relative_features(numeric_features, models))

    base_models = models["base_models"]
    mlp_models = models["mlp_models"]
    meta_Ea = models["meta_Ea"]
    model_A = models["model_A"]
    qt = models["qt_transformer"]

    fallback = expected_columns(base_models["lgb"] if "lgb" in base_models else next(iter(base_models.values())))

    align_report: dict[str, float] = {}
    exceeded_any = False

    def chk(diag: dict[str, Any], label: str) -> None:
        nonlocal exceeded_any
        align_report[label] = round(diag["default_fraction"], 4)
        if check_alignment(diag, label, opts):
            exceeded_any = True

    # ---- prefactor model A
    df_A, diag_A = align_features(numeric_features, expected_columns(model_A), opts)
    chk(diag_A, "Model A (log10 prefactor)")
    pred_log10_A = float(model_A.predict(df_A)[0])
    A_prefactor = 10 ** pred_log10_A

    # ---- Ea base models
    base_model_predictions: dict[str, float] = {}
    base_model_alignment: dict[str, Any] = {}
    ensemble_input = np.zeros((1, len(base_models) + len(mlp_models)))
    idx = 0
    for name, model in base_models.items():
        df_model, diag = align_features(numeric_features, expected_columns(model, fallback), opts)
        chk(diag, f"Ea base model '{name}'")
        pred = float(model.predict(df_model)[0])
        ensemble_input[:, idx] = pred
        base_model_predictions[name] = pred
        base_model_alignment[name] = {k: v for k, v in diag.items() if k != "fed_values"}
        idx += 1

    # ---- MLPs (through the quantile transformer)
    df_qt, diag_qt = align_features(numeric_features, expected_columns(qt, fallback), opts)
    chk(diag_qt, "Quantile transformer / MLP input")
    X_qt = qt.transform(df_qt)

    mlp_predictions: dict[str, float] = {}
    for name, model in mlp_models.items():
        pred = float(model.predict(X_qt)[0])
        ensemble_input[:, idx] = pred
        mlp_predictions[name] = pred
        idx += 1

    # ---- meta learner -> Ea -> sigma
    meta_log_pred = float(meta_Ea.predict(ensemble_input)[0])
    Ea_eV = float(np.clip(np.expm1(meta_log_pred) / 10.0, 0.005, 5.0))
    exponent = -Ea_eV / (K_B * temperature)
    base_sigma = float(A_prefactor * math.exp(exponent))
    base_log_sigma = float(np.log10(base_sigma + 1e-20))

    # ---- optional OBLiEx residual corrector
    corrected = None
    corrector = models.get("corrector")
    if apply_corrector and corrector is not None:
        df_corr, diag_corr = align_features(numeric_features, expected_columns(corrector), opts)
        chk(diag_corr, "v6 corrector")
        predicted_residual = float(corrector.predict(df_corr)[0])
        # The v6 LightGBM corrector was trained on: residual = log10(sigma_true) - (-3.5849667990023195)
        # where -3.5849668 is the training domain baseline anchor (0.26 mS/cm at 298.15 K).
        OBLIEX_BASE_ANCHOR = -3.5849667990023195
        corrected_log_sigma_298 = OBLIEX_BASE_ANCHOR + predicted_residual
        # Arrhenius temperature scaling from 298.15 K to target temperature
        temp_shift = -(Ea_eV / (K_B * math.log(10))) * ((1.0 / temperature) - (1.0 / DEFAULT_TEMP_K))
        corrected_log_sigma = corrected_log_sigma_298 + temp_shift
        corrected = {
            "method": "v6 OBLiEx residual corrector",
            "predicted_residual_log10_S_per_cm": predicted_residual,
            "corrected_log10_conductivity": corrected_log_sigma,
            "corrected_conductivity_S_per_cm": float(10 ** corrected_log_sigma),
            "feature_alignment": diag_corr,
            "warning": (
                "This corrector was trained on OBLiEx experimental residuals. "
                "For unrelated datasets, treat it as domain-adaptation guidance, not a guaranteed MAE."
            ),
        }

    individual_ea = {
        name: float(np.clip(np.expm1(pred) / 10.0, 0.005, 5.0))
        for name, pred in {**base_model_predictions, **mlp_predictions}.items()
    }
    ea_values = np.array(list(individual_ea.values()))
    ea_std = float(np.std(ea_values)) if len(ea_values) > 1 else 0.0

    model_a_missing_sim = sorted(set(diag_A["defaulted_features"]) & SIM_A_COLS)

    return json_safe({
        "input_cif": str(cif_path),
        "material": {
            "id": cif_path.stem,
            "formula": structure.composition.reduced_formula,
            "space_group": structure.get_space_group_info()[0],
            "volume_A3": float(structure.lattice.volume),
            "density_g_cm3": float(structure.density),
            "n_sites": int(structure.num_sites),
            "is_ordered": bool(structure.is_ordered),
        },
        "reliability": {
            "status": "PROVISIONAL" if exceeded_any else "OK",
            "note": (
                "PROVISIONAL: one or more models received many features that were NOT computed "
                "(imputed with training medians or zeros; training feature schema not fully reproduced). "
                "Demo use only; not a validated prediction."
                if exceeded_any else "Feature alignment within limits."
            ),
            "default_fraction_by_component": align_report,
            "model_A_simulation_columns_missing": model_a_missing_sim,
            "model_A_caveat": (
                "Model A's log10-prefactor prediction relies heavily on simulation-only columns "
                "(diffusion_coefficient_300K alone carries ~82% of its LightGBM importance). These "
                "cannot be computed from a CIF and are training-median imputed here regardless of "
                "reliability status -- treat A_prefactor / base_conductivity as a rough order-of-magnitude "
                "estimate, not a validated value, whenever model_A_simulation_columns_missing is non-empty."
                if model_a_missing_sim else "No Model-A simulation-only columns were missing."
            ),
        },
        "descriptor_extraction": {**extraction_report, "extracted_numeric_features": numeric_features},
        "features_fed_to_models": {
            "model_A_log10_prefactor": diag_A,
            "base_models_Ea": base_model_alignment,
            "mlp_quantile_transformer_input": {k: v for k, v in diag_qt.items() if k != "fed_values"},
        },
        "model_outputs": {
            "log10_A": pred_log10_A,
            "A_prefactor": A_prefactor,
            "base_model_predictions_log_Ea_space": base_model_predictions,
            "mlp_predictions_log_Ea_space": mlp_predictions,
            "meta_Ea_log_prediction": meta_log_pred,
            "Ea_eV": Ea_eV,
            "individual_model_Ea_eV": individual_ea,
            "Ea_ensemble_std_eV": ea_std,
            "meta_learner_weights": [
                {"model": n, "weight": float(w)}
                for n, w in zip(list(base_model_predictions) + list(mlp_predictions), getattr(meta_Ea, "coef_", []))
            ],
            "top_model_A_feature_importances": top_importances(model_A),
        },
        "conductivity": {
            "temperature_K": temperature,
            "formula": "sigma = A * exp(-Ea / (k_B * T))",
            "base_conductivity_S_per_cm": base_sigma,
            "base_log10_conductivity": base_log_sigma,
            "corrected": corrected,
        },
    })


def print_report(result: dict[str, Any]) -> None:
    mat = result["material"]
    cond = result["conductivity"]
    corrected = cond.get("corrected")
    ext = result["descriptor_extraction"]
    print("=" * 78)
    print(f"{mat['id']} | {mat['formula']} | space group {mat['space_group']}")
    print("=" * 78)
    print(f"Volume: {mat['volume_A3']:.3f} A^3 | Density: {mat['density_g_cm3']:.4f} g/cm3 | ordered: {mat['is_ordered']}")
    rel = result.get("reliability", {})
    if rel.get("status") == "PROVISIONAL":
        worst = max(rel["default_fraction_by_component"].items(), key=lambda kv: kv[1])
        print(f"*** PROVISIONAL RESULT: feature schema not fully reproduced "
              f"(worst: {worst[0]}, {worst[1]:.0%} of inputs not computed -> imputed). Demo only. ***")
    if rel.get("model_A_simulation_columns_missing"):
        print(f"*** Model A caveat: {rel['model_A_caveat']} ***")
    print(f"Extracted numeric features: {ext['n_numeric_features']}")
    print(f"Feature groups: {ext['source_counts']}")
    if ext.get("failures"):
        print(f"Extractor warnings: {ext['failures']}")
    for note in ext.get("notes", []):
        print(f"Note: {note}")
    for stage, d in result["features_fed_to_models"]["base_models_Ea"].items():
        print(f"Ea model {stage}: matched {n_matched(d)}/{d['expected']}, defaulted {d['defaulted_to_zero']}")
    a = result["features_fed_to_models"]["model_A_log10_prefactor"]
    print(f"Model A: matched {n_matched(a)}/{a['expected']}, defaulted {a['defaulted_to_zero']}")
    print("-" * 78)
    print(f"Ea: {result['model_outputs']['Ea_eV']:.5f} eV  (ensemble std {result['model_outputs']['Ea_ensemble_std_eV']:.4f})")
    print(f"log10(A): {result['model_outputs']['log10_A']:.5f}")
    print(f"Base sigma @ {cond['temperature_K']} K: {cond['base_conductivity_S_per_cm']:.6e} S/cm")
    if corrected:
        c = corrected["feature_alignment"]
        print(f"Corrector: matched {n_matched(c)}/{c['expected']}, defaulted {c['defaulted_to_zero']}")
        print(f"Corrector residual: {corrected['predicted_residual_log10_S_per_cm']:+.5f} log10 S/cm")
        print(f"Corrected sigma: {corrected['corrected_conductivity_S_per_cm']:.6e} S/cm")
    print("=" * 78)


# --------------------------------------------------------------------------- #
# diagnose mode
# --------------------------------------------------------------------------- #
SIM_A_COLS = {"byproduct_risk_score", "critical_element_fraction", "diffusion_coefficient_300K", "li_transference_number",
              "max_barrier", "mean_barrier", "num_hops", "recycling_complexity", "time_seconds"}
MLIP_COLS = {"energy_eV", "energy_per_atom_eV", "energy_per_volume"}
STRUCT_COLS = {"density", "volume", "n_atoms", "volume_per_atom", "log_density", "log_volume", "log_n_atoms",
               "vol_per_atom_sq", "vol_density"}
ELECTRONIC_COLS = {"band_gap", "electronic_conductivity_category", "bandgap_sq", "bandgap_x_hull",
                   "bandgap_x_density", "log_bandgap", "bg_vs_form_mu"}
THERMO_COLS = {"energy_above_hull", "is_stable", "formation_energy_per_atom", "formation_x_hull", "hull_sq",
               "form_energy_sq", "energy_stability", "hull_vs_form_min", "density_vs_form_mu", "vol_vs_form_mu",
               "energy_vs_form_mu", "K_vs_form_mu", "density_rank", "energy_rank", "hull_rank",
               "thermal_stability", "formula_count"}
ELASTIC_COLS = {"K_GPa", "G_GPa", "E_GPa", "poisson_ratio", "KG_ratio", "ductile_brittle", "pugh_ratio",
                "debye_proxy", "K_over_density", "G_over_density", "K_times_G", "sqrt_K", "sqrt_G", "K_G_diff",
                "K_per_atom", "G_per_atom", "K_G_ratio_sq"}
OTHER_DB_COLS = {"volume_change_pct", "mean_element_abundance", "mean_element_toxicity", "estimated_voltage_window_eV"}
INFERRED_GEOMETRY = {"ani_ab", "ani_ac", "ani_bc", "en_max", "en_min", "en_rng", "Z_mu", "Z_sd", "Z_max", "pack",
                     "li_pvol", "bl_min", "li_bl_min", "li_anion_bl_min", "li_dmin",
                     "li_dim", "li_dim_1d", "li_dim_2d", "li_dim_3d", "li_distortion_mu", "li_distortion_max",
                     "li_wyckoff_mu", "li_wyckoff_max", "comp_form_mean_valence"}

HOW_TO_OBTAIN = {
    "custom CIF geometry (cif_v3_c3)": "Original CIF-geometry extractor (Li-site bond lengths, coordination, dimensionality, Voronoi/bottleneck). NOT derivable from M3GNet/CHGNet embeddings; port from the training notebook.",
    "custom CIF geometry (cif_v2_c2)": "Same as cif_v3_c3 (older feature version); needs the original extractor.",
    "simulation output (Model A only)": "Output of an MD/NEB/transport simulation. Not derivable from a CIF; Model A cannot run without it (retrain A on CIF-derivable features).",
    "ML-potential energy": "Computed with --mlip chgnet|m3gnet.",
    "electronic (band gap)": "Computed with --mp-api-key (Materials Project lookup) if available; otherwise a band-gap surrogate model.",
    "thermodynamic / DB-relative": "Computed with --mp-api-key where possible (hull, formation energy, and the *_rank columns via the quantile transformer's own training distribution); *_vs_form_mu and formula_count still need the original training table.",
    "elastic": "Computed with --mp-api-key (Materials Project elastic data) if available; otherwise an ML-potential elastic tensor.",
    "other DB fields": "mean_element_abundance/toxicity computed from a static reference table; estimated_voltage_window_eV computed (INFERRED heuristic) from --mp-api-key band gap; volume_change_pct needs a second (e.g. delithiated) structure to compare against, not derivable from one CIF.",
    "Magpie composition stats": "Computed (matminer).",
    "structure / composition basics": "Computed here (CrystalNN coordination/bond-length stats, spglib Wyckoff multiplicities, crystal-system code); comp_form_mean_valence is an INFERRED proxy (mean common oxidation state).",
}


def categorize(col: str) -> str:
    c = norm_name(col)
    if c.startswith("cif_v3_c3_"):
        return "custom CIF geometry (cif_v3_c3)"
    if c.startswith("cif_v2_c2_"):
        return "custom CIF geometry (cif_v2_c2)"
    if c in SIM_A_COLS:
        return "simulation output (Model A only)"
    if c in MLIP_COLS:
        return "ML-potential energy"
    if c.startswith("magpie_"):
        return "Magpie composition stats"
    if c in ELECTRONIC_COLS:
        return "electronic (band gap)"
    if c in THERMO_COLS:
        return "thermodynamic / DB-relative"
    if c in ELASTIC_COLS:
        return "elastic"
    if c in OTHER_DB_COLS:
        return "other DB fields"
    return "structure / composition basics"


def write_missing_report(models: dict[str, Any], numeric: dict[str, float], out_dir: Path) -> None:
    """One row per column any model expects: computed or MISSING, what it is, how to get it, importance."""
    base = models["base_models"]
    lgb = base["lgb"] if "lgb" in base else next(iter(base.values()))
    lists = {"Ea_ensemble": expected_columns(lgb), "Model_A": expected_columns(models["model_A"])}
    if models.get("corrector") is not None:
        lists["corrector"] = expected_columns(models["corrector"])

    gains: dict[str, dict[str, float]] = {}
    for label, model in (("Ea_gain_pct", lgb), ("ModelA_gain_pct", models["model_A"])):
        try:
            names = expected_columns(model)
            imp = np.array(model.booster_.feature_importance("gain"), float)
            imp = imp / imp.sum()
            gains[label] = {norm_name(n): float(v) * 100 for n, v in zip(names, imp)}
        except Exception:
            gains[label] = {}

    numeric_by_norm = {norm_name(k): v for k, v in numeric.items()}
    rows: dict[str, dict[str, Any]] = {}
    for label, cols in lists.items():
        _, diag = align_features(numeric, cols, AlignOpts(strict=False))
        missing = {norm_name(c) for c in diag["defaulted_features"]}
        for c in cols:
            k = norm_name(c)
            r = rows.setdefault(k, {"column": k, "expected_by": [], "computed": True})
            r["expected_by"].append(label)
            if k in missing:
                r["computed"] = False

    fill = models.get("train_ref", {})
    rng = models.get("train_range", {})
    out = []
    for k, r in rows.items():
        cat = categorize(k)
        status = "computed" if r["computed"] else "MISSING"
        how = HOW_TO_OBTAIN[cat]
        stem = k.split("_", 3)[-1] if k.startswith(("cif_v3_c3_", "cif_v2_c2_")) else k
        if status == "computed" and stem in INFERRED_GEOMETRY:
            status, how = "computed*", "Definition INFERRED from the column name and training distribution (original code not available); verify."
        if status.startswith("computed") and k in numeric_by_norm and k in rng:
            lo, hi = rng[k]
            v = numeric_by_norm[k]
            if not (lo - 0.05 * abs(hi - lo) <= v <= hi + 0.05 * abs(hi - lo)):
                how += f"  [value {v:.4g} outside training p01-p99 = {lo:.4g}..{hi:.4g}]"
        out.append({
            "column": k, "expected_by": "+".join(r["expected_by"]),
            "status": status,
            "category": cat, "how_to_obtain": how,
            "training_median": fill.get(k, ""),
            "Ea_gain_pct": round(gains["Ea_gain_pct"].get(k, 0.0), 3),
            "ModelA_gain_pct": round(gains["ModelA_gain_pct"].get(k, 0.0), 3),
        })
    df = pd.DataFrame(out).sort_values(["status", "Ea_gain_pct"], ascending=[True, False])
    df.to_csv(out_dir / "missing_features_report.csv", index=False)

    ea = df[df["expected_by"].str.contains("Ea_ensemble")]
    summ = (ea.groupby("category")
              .agg(columns=("column", "count"),
                   missing=("status", lambda x: int((x == "MISSING").sum())),
                   inferred=("status", lambda x: int((x == "computed*").sum())),
                   Ea_gain_pct=("Ea_gain_pct", "sum"))
              .sort_values("Ea_gain_pct", ascending=False))
    print("\nEa ensemble: what is computed vs missing, by family (gain = share of LightGBM importance)")
    print("-" * 78)
    for cat, r in summ.iterrows():
        print(f"{cat:36s} cols {int(r['columns']):3d} | missing {int(r['missing']):3d} | inferred* {int(r['inferred']):2d} | gain {r['Ea_gain_pct']:5.1f}%")
    a = df[df["expected_by"].str.contains("Model_A")]
    a_missing_gain = a.loc[a["status"] == "MISSING", "ModelA_gain_pct"].sum()
    print(f"\nModel A: {int((a['status'] == 'MISSING').sum())}/{len(a)} columns missing, "
          f"carrying {a_missing_gain:.1f}% of its importance")
    print(f"Full per-column report: {out_dir / 'missing_features_report.csv'}")


def diagnose(cif_path: Path, models: dict[str, Any], out_dir: Path) -> None:
    out_dir.mkdir(parents=True, exist_ok=True)
    _, features, report = extract_obliex_style_features(cif_path)
    numeric = numeric_only(features)
    canon_keys = sorted({canon_name(k) for k in numeric})

    print("=" * 78)
    print(f"SCHEMA DIAGNOSIS for {cif_path.name}")
    print("=" * 78)
    print(f"Extractor produced {len(numeric)} numeric features "
          f"({len(canon_keys)} unique after canonicalising names)")
    print(f"Groups: {report['source_counts']}")
    if report["failures"]:
        print(f"Extractor failures: {report['failures']}")
    for note in report["notes"]:
        print(f"Note: {note}")

    base_models = models["base_models"]
    fallback = expected_columns(base_models["lgb"] if "lgb" in base_models else next(iter(base_models.values())))

    targets: dict[str, list[str]] = {"model_A": expected_columns(models["model_A"])}
    for name, m in base_models.items():
        targets[f"base_{name}"] = expected_columns(m, fallback)
    targets["quantile_transformer"] = expected_columns(models["qt_transformer"], fallback)
    if models.get("corrector") is not None:
        targets["corrector"] = expected_columns(models["corrector"])

    detail = {"model_A", f"base_{next(iter(base_models))}", "corrector"}
    full_report: dict[str, Any] = {}

    print("\nPer-model match summary")
    print("-" * 78)
    for label, expected in targets.items():
        if not expected:
            print(f"{label:22s} could not read expected columns")
            continue
        _, diag = align_features(numeric, expected, AlignOpts(strict=False))
        matched = n_matched(diag)
        print(f"{label:22s} expects {len(expected):4d} | found {matched:4d} | "
              f"would be zero-filled {diag['defaulted_to_zero']:4d} ({diag['default_fraction']:.0%})")

        suggestions = {}
        for col in diag["defaulted_features"]:
            hit = difflib.get_close_matches(canon_name(col), canon_keys, n=1, cutoff=0.6)
            suggestions[col] = hit[0] if hit else None

        (out_dir / f"expected_columns_{label}.txt").write_text("\n".join(expected), encoding="utf-8")
        full_report[label] = {
            "expected": len(expected),
            "found": matched,
            "defaulted": diag["defaulted_features"],
            "closest_extracted_name": suggestions,
        }

        if label in detail:
            fam_total: dict[str, int] = {}
            fam_hit: dict[str, int] = {}
            missing = set(diag["defaulted_features"])
            for col in expected:
                fam = family_of(col)
                fam_total[fam] = fam_total.get(fam, 0) + 1
                if col not in missing:
                    fam_hit[fam] = fam_hit.get(fam, 0) + 1
            print(f"   feature families for {label} (found/expected):")
            for fam, tot in sorted(fam_total.items(), key=lambda kv: -kv[1])[:15]:
                print(f"     {fam:22s} {fam_hit.get(fam, 0):4d}/{tot:<4d}")
            print(f"   first 25 missing columns -> closest extracted name:")
            for col in diag["defaulted_features"][:25]:
                print(f"     {col!r:55s} -> {suggestions[col]!r}")

    (out_dir / "schema_report.json").write_text(json.dumps(json_safe(full_report), indent=2), encoding="utf-8")
    write_missing_report(models, numeric, out_dir)

    print("\nHow to read this")
    print("  * A family with 0 found is not computed by the extractor. It must come from")
    print("    the same code that built the v5 training table -> implement it in")
    print("    extract_extra_features(), or supply --mp-api-key for the DB-only columns.")
    print("  * A missing column with a close suggestion is a pure naming problem; either")
    print("    rename in the extractor or re-run with --fuzzy (check schema_report.json).")
    print(f"\nFull lists written to: {out_dir}")


# --------------------------------------------------------------------------- #
# batch / CLI
# --------------------------------------------------------------------------- #
def find_cif(cif_dir: Path, key: str) -> Path | None:
    exact = cif_dir / f"{key}.cif"
    if exact.exists():
        return exact
    key_lower = key.lower()
    for path in cif_dir.glob("*.cif"):
        if path.stem.lower() == key_lower:
            return path
    return None


def run_batch(args: argparse.Namespace, models: dict[str, Any], opts: AlignOpts) -> None:
    csv_path = Path(args.csv)
    cif_dir = Path(args.cif_dir)
    out_csv = Path(args.out)
    details_dir = Path(args.details_dir)
    details_dir.mkdir(parents=True, exist_ok=True)

    rows = []
    with csv_path.open(newline="", encoding="utf-8") as handle:
        reader = csv.DictReader(handle)
        if not reader.fieldnames or args.match_col not in reader.fieldnames:
            raise ValueError(f"CSV must contain column '{args.match_col}'. Found: {reader.fieldnames}")
        for row in reader:
            key = row[args.match_col].strip()
            cif_path = find_cif(cif_dir, key)
            if cif_path is None:
                rows.append({**row, "status": "cif_not_found", "cif_path": ""})
                print(f"[MISS] {key}: CIF not found")
                continue
            try:
                result = predict_one(cif_path, args.temp, models, not args.no_corrector, opts)
                (details_dir / f"{key}_details.json").write_text(json.dumps(result, indent=2), encoding="utf-8")
                corrected = result["conductivity"].get("corrected")
                rows.append({
                    **row,
                    "status": "ok",
                    "reliability": result["reliability"]["status"],
                    "worst_default_fraction": max(result["reliability"]["default_fraction_by_component"].values()),
                    "formula": result["material"]["formula"],
                    "Ea_eV": result["model_outputs"]["Ea_eV"],
                    "log10_A": result["model_outputs"]["log10_A"],
                    "base_sigma_S_cm": result["conductivity"]["base_conductivity_S_per_cm"],
                    "corrected_sigma_S_cm": "" if not corrected else corrected["corrected_conductivity_S_per_cm"],
                    "base_features_defaulted": next(iter(result["features_fed_to_models"]["base_models_Ea"].values()))["defaulted_to_zero"],
                    "model_A_features_defaulted": result["features_fed_to_models"]["model_A_log10_prefactor"]["defaulted_to_zero"],
                    "details_json": str(details_dir / f"{key}_details.json"),
                })
                print_report(result)
            except Exception as exc:
                rows.append({**row, "status": "failed", "error": f"{type(exc).__name__}: {exc}"})
                print(f"[FAIL] {key}: {exc}")

    df = pd.DataFrame(rows)
    df.to_csv(out_csv, index=False)

    ok = df[df["status"] == "ok"] if "status" in df else df.iloc[0:0]
    if len(ok) > 1 and ok["Ea_eV"].round(6).nunique() == 1:
        print("\n[WARN] Every material got the identical Ea. The models are not seeing real features.")

    print(f"\nBatch results written to: {out_csv}")
    print(f"Detailed JSON reports written to: {details_dir}")


def main() -> None:
    p = argparse.ArgumentParser(description="Predict ionic conductivity from CIF files (IonCast, schema-safe).")
    p.add_argument("--cif", help="Single CIF file to predict.")
    p.add_argument("--csv", help="Batch CSV with an ID column.")
    p.add_argument("--cif-dir", help="Folder containing batch CIF files named {ID}.cif.")
    p.add_argument("--match-col", default="id", help="CSV column used to match CIF filenames.")
    p.add_argument("--temp", type=float, default=DEFAULT_TEMP_K, help="Temperature in K.")
    p.add_argument("--out", default=str(ROOT / "prediction_results.csv"), help="Output CSV summary path.")
    p.add_argument("--details-json", default=str(ROOT / "prediction_details.json"), help="Single-CIF details JSON path.")
    p.add_argument("--details-dir", default=str(ROOT / "prediction_details"), help="Batch details JSON directory.")
    p.add_argument("--no-corrector", action="store_true", help="Disable v6 OBLiEx residual correction.")
    p.add_argument("--corrector", action="store_true", default=True, help="Enable v6 OBLiEx residual correction (enabled by default).")
    p.add_argument("--diagnose", metavar="CIF", help="Diagnose feature/schema mismatch using this CIF, then exit.")
    p.add_argument("--diag-dir", default=str(ROOT / "schema_diagnostics"), help="Where --diagnose writes its reports.")
    p.add_argument("--max-default-frac", type=float, default=0.45,
                   help="Max fraction of zero-filled model features before refusing to predict.")
    p.add_argument("--allow-mismatch", action="store_true", default=True,
                   help="Only warn (do not stop) on schema mismatch.")
    p.add_argument("--impute", choices=["median", "zero"], default="median",
                   help="How to fill features that could not be computed: training median (default) or 0.")
    p.add_argument("--mlip", choices=["none", "chgnet", "m3gnet"], default="none",
                   help="Optional ML-potential backend for the energy columns + structure embeddings.")
    p.add_argument("--embeddings-dir", default=str(ROOT / "embeddings"),
                   help="Where --mlip saves <id>_<backend>_embedding.npy files.")
    p.add_argument("--mp-api-key", default=None,
                   help="Optional Materials Project API key (or set env MP_API_KEY) for band_gap/hull/"
                        "formation-energy/elastic columns. Requires `pip install mp-api`. Skipped silently if absent.")
    p.add_argument("--fuzzy", action="store_true", help="Allow near-name column matching (review results!).")
    p.add_argument("--fuzzy-cutoff", type=float, default=0.93)
    args = p.parse_args()

    if not args.diagnose and not args.cif and not args.cif_dir and not args.csv:
        p.error("Specify --cif for one material, or --cif-dir for a folder of CIFs, or --csv plus --cif-dir for batch.")

    opts = AlignOpts(
        strict=not args.allow_mismatch,
        max_default_frac=args.max_default_frac,
        fuzzy=args.fuzzy,
        fuzzy_cutoff=args.fuzzy_cutoff,
        impute=args.impute,
    )

    models = load_models()
    opts.fill = models["train_ref"]
    configure_mlip(args.mlip, Path(args.embeddings_dir))
    configure_mp(args.mp_api_key)

    if args.diagnose:
        diagnose(Path(args.diagnose), models, Path(args.diag_dir))
        return

    out_csv = Path(args.out)
    out_csv.parent.mkdir(parents=True, exist_ok=True)

    if args.cif:
        cif_path = Path(args.cif)
        result = predict_one(cif_path, args.temp, models, not args.no_corrector, opts)
        Path(args.details_json).parent.mkdir(parents=True, exist_ok=True)
        Path(args.details_json).write_text(json.dumps(result, indent=2), encoding="utf-8")
        print_report(result)
        
        # Output clean single-row CSV summary
        mat = result["material"]
        m_out = result["model_outputs"]
        cond = result["conductivity"]
        corr = cond.get("corrected") or {}
        row = {
            "ID": cif_path.stem,
            "Formula": mat.get("formula", ""),
            "SpaceGroup": mat.get("space_group", ""),
            "Density_g_cm3": round(mat.get("density_g_cm3", 0), 4),
            "Volume_A3": round(mat.get("volume_A3", 0), 3),
            "Temperature_K": args.temp,
            "Ea_eV": round(m_out.get("Ea_eV", 0), 5),
            "log10_A": round(m_out.get("log10_A", 0), 4),
            "Base_Sigma_S_per_cm": cond.get("base_conductivity_S_per_cm", 0),
            "Base_Log10_Cond": cond.get("base_log10_conductivity", 0),
            "Corrected_Sigma_S_per_cm": corr.get("corrected_conductivity_S_per_cm", cond.get("base_conductivity_S_per_cm", 0)),
            "Corrected_Log10_Cond": corr.get("corrected_log10_conductivity", cond.get("base_log10_conductivity", 0)),
            "Reliability_Status": result.get("reliability", {}).get("status", "OK"),
            "Details_JSON": str(args.details_json)
        }
        df_single = pd.DataFrame([row])
        df_single.to_csv(out_csv, index=False)
        print(f"Summary CSV written to               : {out_csv}")
        print(f"Detailed feature/model audit written to: {args.details_json}")
        return

    if args.cif_dir and not args.csv:
        cif_dir = Path(args.cif_dir)
        cif_files = sorted(cif_dir.glob("*.cif"))
        if not cif_files:
            raise FileNotFoundError(f"No .cif files found in directory: {cif_dir}")
        print(f"Discovered {len(cif_files)} CIF files in {cif_dir}. Running batch inference...")
        details_dir = Path(args.details_dir)
        details_dir.mkdir(parents=True, exist_ok=True)
        rows = []
        for p_cif in cif_files:
            try:
                res = predict_one(p_cif, args.temp, models, not args.no_corrector, opts)
                (details_dir / f"{p_cif.stem}_details.json").write_text(json.dumps(res, indent=2), encoding="utf-8")
                mat = res["material"]
                m_out = res["model_outputs"]
                cond = res["conductivity"]
                corr = cond.get("corrected") or {}
                rows.append({
                    "ID": p_cif.stem,
                    "Formula": mat.get("formula", ""),
                    "SpaceGroup": mat.get("space_group", ""),
                    "Density_g_cm3": round(mat.get("density_g_cm3", 0), 4),
                    "Volume_A3": round(mat.get("volume_A3", 0), 3),
                    "Temperature_K": args.temp,
                    "Ea_eV": round(m_out.get("Ea_eV", 0), 5),
                    "log10_A": round(m_out.get("log10_A", 0), 4),
                    "Base_Sigma_S_per_cm": cond.get("base_conductivity_S_per_cm", 0),
                    "Base_Log10_Cond": cond.get("base_log10_conductivity", 0),
                    "Corrected_Sigma_S_per_cm": corr.get("corrected_conductivity_S_per_cm", cond.get("base_conductivity_S_per_cm", 0)),
                    "Corrected_Log10_Cond": corr.get("corrected_log10_conductivity", cond.get("base_log10_conductivity", 0)),
                    "Reliability_Status": res.get("reliability", {}).get("status", "OK"),
                    "Details_JSON": str(details_dir / f"{p_cif.stem}_details.json")
                })
                print(f"[OK] {p_cif.stem:25s} | Formula: {mat.get('formula',''):15s} | Ea: {m_out.get('Ea_eV',0):.4f} eV | Corrected: {corr.get('corrected_conductivity_S_per_cm', cond.get('base_conductivity_S_per_cm',0)):.3e} S/cm")
            except Exception as exc:
                print(f"[FAIL] {p_cif.stem}: {exc}")
                rows.append({"ID": p_cif.stem, "Status": "FAILED", "Error": str(exc)})
        df_batch = pd.DataFrame(rows)
        df_batch.to_csv(out_csv, index=False)
        print(f"\nBatch summary CSV written to        : {out_csv}")
        print(f"Detailed JSON reports written to    : {details_dir}")
        return

    if args.csv and args.cif_dir:
        run_batch(args, models, opts)


if __name__ == "__main__":
    main()