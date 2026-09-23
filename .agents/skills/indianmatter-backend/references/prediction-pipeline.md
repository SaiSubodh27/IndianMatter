# Prediction Pipeline Guide

## IonCast v7 Physics-Informed Pipeline (Ionic Conductivity & Activation Energy)

### Full Pipeline Flow

```text
CIF file
  ↓
pymatgen.Structure.from_file(cif_path)
  ↓
extract_obliex_style_features(cif_path)
  → 260-330 physical, structural, coordination & compositional features
  ↓
Feature alignment with model schemas
  → training-median imputation for unavailable simulation/database columns
  → exact, normalized, canonical, and fuzzy name matching
  ↓
v5_quantile_transformer.transform(features)
  ↓
┌────────────────────────────────────────────────────────┐
│  v5_base_models (LightGBM, XGBoost, CatBoost, HGB, ET) │  ← Stacking ensemble
│  v5_mlp_models (Neural Network MLPs)                   │  ← MLP ensemble
└───────────────────────────┬────────────────────────────┘
                            ↓
                   Base prediction vector
                            ↓
v5_meta_model.predict(base_predictions)
  → Ea_raw (log1p-scaled)
                            ↓
Inverse transform: expm1(Ea_raw) / 10.0
  → Ea (eV), clipped to [0.005, 5.0]
                            ↓
v5_model2_A.predict(features)
  → log10(A) (Arrhenius prefactor)
                            ↓
Base single-crystal Arrhenius conductivity:
  σ_base = 10^(log10(A)) · exp(-Ea / (kB · T))
                            ↓
v6 OBLiEx Physics-Informed Residual Corrector:
  residual = corrector_model.predict(corr_features)
  σ_corrected(298K) = 10^(-3.5849668 + residual)
  Arrhenius temperature shift to target T:
  Δ_T = -(Ea / (kB · ln(10))) · (1/T - 1/298.15)
  σ_final(T) = 10^(log10(σ_corrected(298K)) + Δ_T)
                            ↓
Rich API Response (Ea, logA, Base Sigma, Final Sigma, HES score, Temperature Series)
```

### Key Constants & Anchors

```python
MODEL_VERSION = "IonCast-v7-OBLiEx-Physics-Informed"
TARGET_SCALE = 10.0
EA_CLIP_EV = (0.005, 5.0)
SUPPORTED_TEMPERATURE_RANGE_K = (250, 1000)
OBLIEX_BASE_ANCHOR = -3.5849667990023195  # 0.26 mS/cm training domain baseline at 298.15 K
```


### Temperature Handling

- Input: Kelvin (validated T > 0 K)
- Default: 298.15 K
- Boltzmann constant: kB = 8.617333e-5 eV/K
- Temperature series: can generate σ(T) across the supported range

### Arrhenius Equation

```
σ(T) = 10^(logA) · exp(-Ea / (kB · T))
```

Where:
- σ = ionic conductivity (S/cm)
- logA = log10 of the Arrhenius prefactor
- Ea = activation energy (eV)
- kB = Boltzmann constant (eV/K)
- T = temperature (K)

### LOG_A_MODEL_IS_CONSTANT Flag

`model_service.py` probes the log10(A) model during `load_models()`:
- Sends several synthetic inputs
- If all outputs are identical → sets `LOG_A_MODEL_IS_CONSTANT = True`
- This means the prefactor is effectively a constant, not a prediction

---

## CHGNet Surrogate Pipeline (Mechanical / Electrical / Thermal)

### Flow

```text
CIF file
  ↓
pymatgen.Structure
  ↓
AseAtomsAdaptor → ASE Atoms
  ↓
CHGNetCalculator (lazy-loaded)
  → energy, forces, stress
  ↓
21-feature vector (see feature-engineering.md)
  ↓
LightGBM surrogate model
  → log10(K), log10(G), band_gap, thermal_proxy
  ↓
Derived properties:
  K = 10^(log_K)                    # Bulk modulus (GPa)
  G = 10^(log_G)                    # Shear modulus (GPa)
  E = 9KG / (3K + G)               # Young's modulus (GPa)
  ν = (3K - 2G) / (2(3K + G))      # Poisson's ratio
```

### Endpoints (calculator_router.py)

| Endpoint | Method | Properties |
|---|---|---|
| `/api/calculations/predict-properties` | POST | Multi-property (dynamic) |
| `/api/calculations/analyze-mechanical` | POST | K, G, E, ν |
| `/api/calculations/analyze-electrical` | POST | Band gap, electronic nature |
| `/api/calculations/analyze-thermal` | POST | Phonon frequency proxy |
| `/api/calculations/analyze-ionic` | POST | Ionic conductivity (IonCast) |
| `/api/calculations/predict` | POST | Ionic conductivity (compact) |
| `/api/calculations/analyze-cif` | POST | Basic CIF analysis |
| `/api/calculations/analyze-cif-file` | POST | Structural metrics from CIF |
| `/api/calculations/calculate-metrics` | POST | Structural metrics from JSON |

### Partial Failure Support

The `predict-properties` endpoint handles each property independently:
- Success → `"status": "calculated"`
- Model unavailable → `"status": "unavailable"`
- Error → `"status": "failed"` with warnings

---

## Model Loading Sequence

### At server startup (`main.py` lifespan):

```python
load_models()  # Loads v5/v6 IonCast models into global state
```

### At import time (`calculator_router.py`):

```python
chgnet_model_K = joblib.load(...)   # if available
chgnet_model_G = joblib.load(...)
chgnet_model_bg = joblib.load(...)
chgnet_model_th = joblib.load(...)
```

### On first use (`chgnet_features.py`):

```python
_ensure_chgnet_calculator()  # Lazy CHGNet import + initialization
```

---

## Confidence and Uncertainty

The system provides:
- **Feature coverage**: percentage of expected descriptors successfully extracted
- **Validation status**: whether the prediction passed sanity checks
- **Confidence level**: based on feature coverage and descriptor quality
- **PredictionValidator**: `Surrogative_models/final_validation/` module

> [!WARNING]
> Do not use "confidence" unless its calculation is explicitly defined.
> Distinguish: confidence, uncertainty, prediction interval, model disagreement.
