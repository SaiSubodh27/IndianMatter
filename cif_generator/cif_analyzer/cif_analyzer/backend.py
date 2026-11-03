"""
CIF Material Analyzer — FastAPI Backend
========================================
Plug your pretrained models into the sections marked  ← YOUR MODEL HERE

Run with:
    pip install -r requirements.txt
    uvicorn backend:app --reload --port 8000

Then in index.html, replace the processCIF() body with:
    const res = await fetch('/api/analyze', {
        method: 'POST',
        body: JSON.stringify({ filename, cif_text: text }),
        headers: { 'Content-Type': 'application/json' }
    });
    return await res.json();
"""

import io
import json
import re
import math
import traceback
from pathlib import Path
from typing import Optional

import numpy as np
import pandas as pd
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import HTMLResponse
from pydantic import BaseModel

# ── pymatgen (for real CIF parsing) ─────────────────────
try:
    from pymatgen.core import Structure
    from pymatgen.io.cif import CifParser
    PYMATGEN_AVAILABLE = True
except ImportError:
    PYMATGEN_AVAILABLE = False
    print("[WARN] pymatgen not installed. CIF parsing will use fallback regex parser.")

# ── matminer (for Magpie features) ──────────────────────
try:
    from matminer.featurizers.composition import ElementProperty
    from matminer.featurizers.structure import (
        DensityFeatures, GlobalSymmetryFeatures, RadialDistributionFunction
    )
    MATMINER_AVAILABLE = True
except ImportError:
    MATMINER_AVAILABLE = False
    print("[WARN] matminer not installed. Feature extraction will use mock values.")

# ── model imports ────────────────────────────────────────
# Replace these with your actual model loading code
try:
    import lightgbm as lgb
    import xgboost as xgb
    from catboost import CatBoostClassifier
    import joblib
    MODELS_AVAILABLE = True
except ImportError:
    MODELS_AVAILABLE = False
    print("[WARN] Model libraries not fully installed. Running in demo mode.")


# ─────────────────────────────────────────────────────────
# App setup
# ─────────────────────────────────────────────────────────
app = FastAPI(title="CIF Material Analyzer", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Serve the frontend
if Path("index.html").exists():
    @app.get("/", response_class=HTMLResponse)
    def serve_frontend():
        return Path("index.html").read_text()


# ─────────────────────────────────────────────────────────
# Pydantic models
# ─────────────────────────────────────────────────────────
class CIFRequest(BaseModel):
    filename: str
    cif_text: str

class ClassResult(BaseModel):
    name: str
    prob: float
    hint: str
    color: str
    icon: str

class AnalysisResponse(BaseModel):
    filename: str
    formula: str
    space_group: str
    lattice: dict
    elements: list[str]
    classes: list[ClassResult]
    features: dict
    feature_sets_used: list[str]


# ─────────────────────────────────────────────────────────
# Model loading — ← YOUR MODEL HERE
# ─────────────────────────────────────────────────────────

MATERIAL_CLASSES = [
    {"name": "NASICON",    "hint": "Na₃Zr₂Si₂PO₁₂ phosphate framework", "color": "blue",   "icon": "ti-circles-relation"},
    {"name": "Garnet",     "hint": "Li₇La₃Zr₂O₁₂ cubic oxide",          "color": "purple", "icon": "ti-diamond"},
    {"name": "Perovskite", "hint": "ABO₃ layered oxide conductor",        "color": "amber",  "icon": "ti-layers-intersect"},
    {"name": "Argyrodite", "hint": "Li₆PS₅X thio-phosphate",             "color": "pink",   "icon": "ti-hexagon"},
    {"name": "Sulfide",    "hint": "Crystalline / glassy sulfide SSE",    "color": "amber",  "icon": "ti-atom-2"},
    {"name": "Halide",     "hint": "Li₃MX₆ halide-type ionic conductor",  "color": "teal",   "icon": "ti-focus"},
    {"name": "Ceramic",    "hint": "Dense sintered oxide electrolyte",    "color": "green",  "icon": "ti-cylinder"},
    {"name": "Polymer",    "hint": "Polymer-ceramic composite SSE",       "color": "gray",   "icon": "ti-link"},
]

CLASS_NAMES = [c["name"] for c in MATERIAL_CLASSES]


def load_models():
    """
    ← YOUR MODEL HERE
    Load your pretrained ensemble models.
    Return a dict of { model_name: model_object }
    """
    models = {}

    if not MODELS_AVAILABLE:
        return models

    # Example:
    # models["lgb"]      = lgb.Booster(model_file="models/lgb_classifier.txt")
    # models["xgb"]      = xgb.XGBClassifier(); models["xgb"].load_model("models/xgb_classifier.ubj")
    # models["catboost"] = CatBoostClassifier(); models["catboost"].load_model("models/catboost_classifier.cbm")
    # models["mlp"]      = joblib.load("models/mlp_classifier.pkl")
    # models["vgnn"]     = joblib.load("models/vgnn_encoder.pkl")  # your VGNN model

    return models

MODELS = load_models()


# ─────────────────────────────────────────────────────────
# CIF parsing
# ─────────────────────────────────────────────────────────

def parse_cif_pymatgen(cif_text: str) -> dict:
    """Parse CIF using pymatgen for full structural data."""
    parser = CifParser(io.StringIO(cif_text))
    structures = parser.get_structures(primitive=False)
    if not structures:
        raise ValueError("No structures found in CIF")
    struct = structures[0]

    lat = struct.lattice
    formula = struct.composition.formula
    elements = [str(el) for el in struct.composition.elements]
    sg = struct.get_space_group_info()

    return {
        "structure": struct,
        "formula": formula,
        "space_group": f"{sg[0]} (#{sg[1]})",
        "elements": elements,
        "lattice": {
            "a": round(lat.a, 5),
            "b": round(lat.b, 5),
            "c": round(lat.c, 5),
            "alpha": round(lat.alpha, 4),
            "beta":  round(lat.beta, 4),
            "gamma": round(lat.gamma, 4),
            "volume": round(lat.volume, 4),
            "Z": struct.composition.num_atoms,
        }
    }


def parse_cif_regex(cif_text: str, filename: str) -> dict:
    """Fallback CIF parser using regex (no pymatgen required)."""

    def get(keys):
        for key in keys:
            m = re.search(rf"{key}\s+['\"]?([^'\"\n]+)['\"]?", cif_text, re.IGNORECASE)
            if m:
                return m.group(1).strip()
        return None

    def getf(keys, fallback):
        v = get(keys)
        try:
            return float(re.sub(r'\(.*\)', '', v)) if v else fallback
        except:
            return fallback

    formula = get([
        r'_chemical_formula_sum', r'_chemical_formula_structural',
        r'_chemical_formula_moiety'
    ]) or _guess_formula(filename)

    sg = get([
        r'_symmetry_space_group_name_H-M', r'_space_group_name_H-M_alt',
        r'_symmetry_space_group_name_Hall'
    ]) or "P1"

    a = getf([r'_cell_length_a'], 7.0)
    b = getf([r'_cell_length_b'], 7.0)
    c = getf([r'_cell_length_c'], 10.0)
    alpha = getf([r'_cell_angle_alpha'], 90.0)
    beta  = getf([r'_cell_angle_beta'],  90.0)
    gamma = getf([r'_cell_angle_gamma'], 90.0)
    vol   = getf([r'_cell_volume'], round(a * b * c * 0.95, 3))
    Z     = int(getf([r'_cell_formula_units_Z'], 4))

    elements = list(dict.fromkeys(re.findall(r'[A-Z][a-z]?', formula)))

    return {
        "structure": None,
        "formula": formula,
        "space_group": sg,
        "elements": elements,
        "lattice": {
            "a": round(a, 5), "b": round(b, 5), "c": round(c, 5),
            "alpha": round(alpha, 4), "beta": round(beta, 4), "gamma": round(gamma, 4),
            "volume": round(vol, 4), "Z": Z,
        }
    }


def _guess_formula(filename: str) -> str:
    fn = filename.replace(".cif", "").lower()
    if "llzo" in fn or ("li" in fn and "la" in fn and "zr" in fn): return "Li7 La3 Zr2 O12"
    if "lgps" in fn or ("ge" in fn and "p" in fn and "s" in fn):   return "Li10 Ge P2 S12"
    if "lpscl" in fn or ("li" in fn and "ps" in fn and "cl" in fn): return "Li6 P S5 Cl"
    if "nasicon" in fn or ("na" in fn and "zr" in fn):              return "Na3 Zr2 Si2 P O12"
    if "latp" in fn or ("la" in fn and "ti" in fn and "p" in fn):  return "Li1.3 Al0.3 Ti1.7 P3 O12"
    return "Li6 P S5 Cl"


def parse_cif(cif_text: str, filename: str) -> dict:
    if PYMATGEN_AVAILABLE:
        try:
            return parse_cif_pymatgen(cif_text)
        except Exception as e:
            print(f"[WARN] pymatgen parse failed: {e}. Falling back to regex parser.")
    return parse_cif_regex(cif_text, filename)


# ─────────────────────────────────────────────────────────
# Feature extraction
# ─────────────────────────────────────────────────────────

def extract_cif_features(parsed: dict) -> dict:
    """
    Extract cif_v1, cif_v2, cif_v3 structural features.
    ← YOUR MODEL HERE: replace with your actual feature extractors
    """
    lat = parsed["lattice"]

    # cif_v1: basic lattice
    cif_v1 = {
        "a": lat["a"], "b": lat["b"], "c": lat["c"],
        "alpha": lat["alpha"], "beta": lat["beta"], "gamma": lat["gamma"],
        "volume": lat["volume"], "Z": lat["Z"],
        "a_b_ratio": round(lat["a"] / max(lat["b"], 1e-6), 5),
        "c_a_ratio":  round(lat["c"] / max(lat["a"], 1e-6), 5),
    }

    # cif_v2: derived structural
    cif_v2 = {
        "vol_per_Z": round(lat["volume"] / max(lat["Z"], 1), 4),
        "is_cubic": int(
            abs(lat["alpha"] - 90) < 0.5 and
            abs(lat["beta"]  - 90) < 0.5 and
            abs(lat["gamma"] - 90) < 0.5 and
            abs(lat["a"] - lat["b"]) < 0.1
        ),
        "is_hexagonal": int(abs(lat["gamma"] - 120) < 2.0),
        "aspect_ratio": round(lat["c"] / max(lat["a"], 1e-6), 4),
    }

    # cif_v3: symmetry-derived (real: use pymatgen structure)
    struct = parsed.get("structure")
    if struct is not None and MATMINER_AVAILABLE:
        try:
            dens_feat = DensityFeatures().featurize(struct)
            cif_v3 = {
                "density": round(dens_feat[0], 5),
                "vpa":     round(dens_feat[1], 5),
                "packing_fraction": round(dens_feat[2], 5),
            }
        except:
            cif_v3 = {"density": 3.5, "vpa": 8.0, "packing_fraction": 0.68}
    else:
        # mock values if pymatgen/matminer not available
        n_elem = max(len(parsed["elements"]), 1)
        cif_v3 = {
            "density": round(2.8 + n_elem * 0.3 + lat["volume"] * 0.0005, 4),
            "vpa":     round(lat["volume"] / max(lat["Z"] * n_elem, 1), 4),
            "packing_fraction": round(0.60 + 0.05 * (n_elem % 3), 4),
        }

    return {"cif_v1": cif_v1, "cif_v2": cif_v2, "cif_v3": cif_v3}


def extract_magpie_features(parsed: dict) -> dict:
    """
    Extract Magpie compositional features using matminer.
    ← YOUR MODEL HERE: replace with your actual Magpie featurizer
    """
    if MATMINER_AVAILABLE and parsed.get("structure"):
        try:
            from pymatgen.core import Composition
            comp = Composition(parsed["formula"])
            ep = ElementProperty.from_preset("magpie")
            features = ep.featurize(comp)
            labels   = ep.feature_labels()
            return dict(zip(labels, features))
        except Exception as e:
            print(f"[WARN] Magpie extraction failed: {e}")

    # fallback: rough mock values
    elems = parsed["elements"]
    n = len(elems)
    return {
        "MagpieData mean AtomicWeight":       round(20 + n * 8.5, 3),
        "MagpieData mean MeltingT":            round(800 + n * 120, 2),
        "MagpieData mean Electronegativity":   round(1.8 + n * 0.05, 4),
        "MagpieData mean NValance":            round(3.0 + n * 0.2, 3),
        "MagpieData range AtomicRadius":       round(0.4 + n * 0.08, 4),
    }


def extract_composition_features(parsed: dict) -> dict:
    """
    Manual composition-level features.
    ← YOUR MODEL HERE: extend with your composition feature logic
    """
    f = parsed["formula"].upper()
    has = lambda el: el.upper() in f

    return {
        "n_elements":    len(parsed["elements"]),
        "has_Li":        int(has("LI")),
        "has_Na":        int(has("NA")),
        "has_S":         int(has("S")),
        "has_O":         int(has("O")),
        "has_P":         int(has("P")),
        "has_halogen":   int(has("CL") or has("BR") or has("I") or has("F")),
        "has_La":        int(has("LA")),
        "has_Zr":        int(has("ZR")),
        "is_oxide":      int(has("O") and not has("S")),
        "is_sulfide":    int(has("S") and not has("O")),
        "is_mixed_anion": int(has("S") and has("O")),
    }


def build_feature_vector(cif_feats: dict, magpie: dict, comp: dict) -> np.ndarray:
    """
    Flatten all feature dicts into a 1D numpy array for model input.
    ← YOUR MODEL HERE: match the feature order your models were trained on
    """
    parts = []
    for d in [cif_feats["cif_v1"], cif_feats["cif_v2"], cif_feats["cif_v3"], magpie, comp]:
        for v in d.values():
            try:
                parts.append(float(v))
            except:
                parts.append(0.0)
    return np.array(parts, dtype=np.float32)


# ─────────────────────────────────────────────────────────
# Classification
# ─────────────────────────────────────────────────────────

def run_ensemble(feature_vec: np.ndarray, parsed: dict) -> list[dict]:
    """
    Run the ensemble model and return class probabilities.
    ← YOUR MODEL HERE: replace with your actual model inference

    Expected output: list of {name, prob, hint, color, icon}
    sorted by descending probability.
    """

    if MODELS_AVAILABLE and MODELS:
        # ── Real inference ────────────────────────────────
        X = feature_vec.reshape(1, -1)

        probs_list = []

        if "lgb" in MODELS:
            p = MODELS["lgb"].predict(X)
            probs_list.append(p[0] if p.ndim == 2 else _one_hot_to_probs(p[0], len(CLASS_NAMES)))

        if "xgb" in MODELS:
            p = MODELS["xgb"].predict_proba(X)
            probs_list.append(p[0])

        if "catboost" in MODELS:
            p = MODELS["catboost"].predict_proba(X)
            probs_list.append(p[0])

        if "mlp" in MODELS:
            p = MODELS["mlp"].predict_proba(X)
            probs_list.append(p[0])

        if probs_list:
            avg_probs = np.mean(probs_list, axis=0)
            avg_probs /= avg_probs.sum()
        else:
            avg_probs = np.ones(len(CLASS_NAMES)) / len(CLASS_NAMES)

        results = []
        for i, cls in enumerate(MATERIAL_CLASSES):
            results.append({**cls, "prob": float(avg_probs[i])})
        return sorted(results, key=lambda x: x["prob"], reverse=True)

    # ── Demo / heuristic fallback ─────────────────────────
    f = parsed["formula"].upper()
    has = lambda el: el.upper() in f

    raw_scores = [0.1] * len(MATERIAL_CLASSES)  # baseline noise
    if has("LA") and has("ZR") and has("O"):       raw_scores[1] += 0.72  # Garnet
    elif has("NA") and has("ZR") and has("SI"):    raw_scores[0] += 0.74  # NASICON
    elif has("S") and has("CL") and has("P"):      raw_scores[3] += 0.70  # Argyrodite
    elif has("S") and has("GE") and has("P"):      raw_scores[4] += 0.65  # Sulfide LGPS
    elif has("S") and not has("O"):                raw_scores[4] += 0.58  # Sulfide
    elif has("CL") or has("BR") or has("I"):       raw_scores[5] += 0.62  # Halide
    elif has("LA") and has("TI") and has("O"):     raw_scores[2] += 0.60  # Perovskite
    elif has("O") and (has("AL") or has("NB")):    raw_scores[6] += 0.55  # Ceramic
    else:                                           raw_scores[7] += 0.45  # Polymer

    total = sum(raw_scores)
    normalized = [s / total for s in raw_scores]

    results = []
    for cls, prob in zip(MATERIAL_CLASSES, normalized):
        results.append({**cls, "prob": round(prob, 5)})
    return sorted(results, key=lambda x: x["prob"], reverse=True)


def predict_properties(feature_vec: np.ndarray, parsed: dict, top_class: str) -> dict:
    """
    Predict scalar material properties.
    ← YOUR MODEL HERE: use your regression models for Ea, σ, etc.
    """

    if MODELS_AVAILABLE and "vgnn" in MODELS:
        # Real VGNN / regression model inference
        X = feature_vec.reshape(1, -1)
        # vgnn_out = MODELS["vgnn"].predict(X)
        # return {
        #     "Ea (eV)":       round(float(vgnn_out[0]), 4),
        #     "log(σ)":        round(float(vgnn_out[1]), 4),
        #     ...
        # }
        pass

    # ── Demo values ───────────────────────────────────────
    rng = np.random.default_rng(hash(parsed["formula"]) % 2**32)

    # class-informed property ranges
    class_ea = {
        "NASICON": (0.20, 0.35), "Garnet": (0.25, 0.45), "Argyrodite": (0.15, 0.28),
        "Sulfide": (0.18, 0.32), "Halide": (0.20, 0.38), "Perovskite": (0.35, 0.55),
        "Ceramic": (0.45, 0.65), "Polymer": (0.40, 0.70),
    }
    ea_min, ea_max = class_ea.get(top_class, (0.20, 0.55))
    Ea = round(float(rng.uniform(ea_min, ea_max)), 4)

    return {
        "Ea (eV)":        Ea,
        "log(σ)":         round(float(-1.5 - Ea * 7.5 + rng.uniform(-0.3, 0.3)), 4),
        "Density g/cm³":  round(float(rng.uniform(2.1, 5.8)), 4),
        "Band Gap eV":    round(float(rng.uniform(2.5, 6.5)), 4),
        "Coord #":        round(float(rng.uniform(4.0, 8.0)), 2),
        "ZPE* (eV)":      round(float(rng.uniform(0.02, 0.18)), 5),
        "θD* (K)":        int(rng.uniform(150, 650)),
        "Ea* VGNN (eV)":  round(float(rng.uniform(0.15, 0.60)), 4),
    }


def _one_hot_to_probs(pred, n_classes):
    idx = int(pred)
    probs = [0.05 / (n_classes - 1)] * n_classes
    probs[idx] = 0.95
    return probs


# ─────────────────────────────────────────────────────────
# API endpoints
# ─────────────────────────────────────────────────────────

@app.post("/api/analyze", response_model=AnalysisResponse)
def analyze_cif(req: CIFRequest):
    """
    Main analysis endpoint.
    Accepts: { filename: str, cif_text: str }
    Returns: full analysis result as JSON
    """
    try:
        # 1. Parse CIF
        parsed = parse_cif(req.cif_text, req.filename)

        # 2. Extract features
        cif_feats  = extract_cif_features(parsed)
        magpie     = extract_magpie_features(parsed)
        comp_feats = extract_composition_features(parsed)

        # 3. Build feature vector
        feat_vec = build_feature_vector(cif_feats, magpie, comp_feats)

        # 4. Classify
        class_results = run_ensemble(feat_vec, parsed)

        # 5. Predict properties
        top_class = class_results[0]["name"]
        properties = predict_properties(feat_vec, parsed, top_class)

        return AnalysisResponse(
            filename=req.filename,
            formula=parsed["formula"],
            space_group=parsed["space_group"],
            lattice=parsed["lattice"],
            elements=parsed["elements"],
            classes=class_results,
            features=properties,
            feature_sets_used=["cif_v1", "cif_v2", "cif_v3", "Magpie", "Composition"],
        )

    except Exception as e:
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/api/health")
def health():
    return {
        "status": "ok",
        "pymatgen": PYMATGEN_AVAILABLE,
        "matminer": MATMINER_AVAILABLE,
        "models_loaded": list(MODELS.keys()),
        "demo_mode": len(MODELS) == 0,
    }


@app.get("/api/classes")
def get_classes():
    return {"classes": MATERIAL_CLASSES}


# ─────────────────────────────────────────────────────────
if __name__ == "__main__":
    import uvicorn
    uvicorn.run("backend:app", host="0.0.0.0", port=8000, reload=True)
