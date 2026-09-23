# Model Artifacts Guide

## Pretrained Models Directory

All production model artifacts live in `pretrained_models/` at the project root.

### IonCast v5/v6 Models (Ionic Conductivity)

| Artifact | Size | Type | Purpose | Target | Loading |
|---|---|---|---|---|---|
| `v5_base_models.pkl` | ~266 MB | Ensemble (LightGBM, XGBoost, CatBoost, etc.) | Base Ea prediction | Activation energy (Ea) | `joblib.load()` |
| `v5_model2_A.pkl` | ~2.5 MB | Regressor | log10(A) prefactor prediction | Arrhenius prefactor | `joblib.load()` |
| `v5_meta_model.pkl` | ~674 B | Meta-learner (RidgeCV/linear) | Stacking ensemble combiner | Final Ea from base predictions | `joblib.load()` |
| `v5_mlp_models.pkl` | ~13.6 MB | MLP ensemble | Additional base predictions | Ea (MLP pathway) | `joblib.load()` |
| `v5_quantile_transformer.pkl` | ~1.4 MB | QuantileTransformer | Feature preprocessing | N/A (transforms input features) | `joblib.load()` |
| `v6_corrector_model.pkl` | ~64 KB | Residual correction model | Post-prediction residual correction | log10(σ) correction delta | `joblib.load()` |

### CHGNet Surrogate Models (Mechanical / Electrical / Thermal)

| Artifact | Size | Type | Purpose | Target | Input |
|---|---|---|---|---|---|
| `chgnet_logK_model.pkl` | ~436 KB | LightGBM | Bulk modulus prediction | log10(K_VRH) | 21-dim CHGNet feature vector |
| `chgnet_logG_model.pkl` | ~447 KB | LightGBM | Shear modulus prediction | log10(G_VRH) | 21-dim CHGNet feature vector |
| `chgnet_bandgap_model.pkl` | ~436 KB | LightGBM | Band gap prediction | Band gap (eV) | 21-dim CHGNet feature vector |
| `chgnet_thermal_model.pkl` | ~413 KB | LightGBM | Thermal/phonon proxy prediction | Phonon frequency proxy (cm⁻¹) | 21-dim CHGNet feature vector |

### GNN Weight Directories (in `final_models/`)

```text
final_models/
├── chgnet_weights/    # CHGNet pretrained weights
├── m3gnet_weights/    # M3GNet pretrained weights
└── mace_weights/      # MACE pretrained weights
```

## Model Loading Locations

| Model Set | Loaded In | Loaded By |
|---|---|---|
| v5/v6 IonCast | `model_service.py` → `load_models()` | `main.py` lifespan |
| CHGNet surrogates | `calculator_router.py` (module-level) | Import time |
| GNN adapters | `models/model_registry.py` → `ModelRegistry` | On-demand |

## Verification Checklist

For every model artifact, verify:

1. **Existence**: Does the file exist at the expected path?
2. **Loading**: Is it loaded by `load_models()` or at import time?
3. **Usage**: Is the loaded object actually called during inference?
4. **Input match**: Do its expected features match what's generated?
5. **Version**: Is this the artifact the training notebook produced?

### Detecting "Trained but Not Used" Artifacts

```python
# Check: artifact exists in pretrained_models/
# Check: artifact is loaded into a global variable
# Check: that variable is referenced in a predict() code path
# If any check fails → TRAINED BUT NOT USED DURING INFERENCE
```

## Target Transformations

### IonCast Ea (Activation Energy)

Training target transform (from `surrogate_model_v5_fixed.ipynb` Cell 4):
```python
y_train = np.log1p(min_barrier * TARGET_SCALE)  # TARGET_SCALE = 10.0
```

Inference inverse transform:
```python
ea_raw = np.expm1(prediction) / TARGET_SCALE
ea_clipped = np.clip(ea_raw, EA_CLIP_EV[0], EA_CLIP_EV[1])  # (0.005, 5.0) eV
```

### CHGNet Surrogates (Mechanical)

Trained on `log10(K_VRH)` and `log10(G_VRH)`:
```python
K = 10 ** model_K.predict(features)
G = 10 ** model_G.predict(features)
E = (9 * K * G) / ((3 * K) + G)       # Young's modulus
nu = (3 * K - 2 * G) / (2 * (3 * K + G))  # Poisson's ratio
```

## Security

> [!CAUTION]
> NEVER load user-uploaded `.pkl` files with `joblib.load()` or `pickle.load()`.
> Only load known, trusted model artifacts from the `pretrained_models/` directory.
> Pickle deserialization can execute arbitrary code.
