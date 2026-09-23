# Prediction Pipeline Guide

## IonCast v5/v6 Pipeline (Ionic Conductivity)

### Full Pipeline Flow

```text
CIF file
  ↓
pymatgen.Structure.from_str(cif_text, fmt="cif")
  ↓
cif_descriptors.compute_descriptors(structure)
  → ~135 compositional + structural features
  ↓
Feature normalization (_normalize_feature_name)
  ↓
Feature alignment with canonical_cols
  → missing features imputed/reconstructed
  → extra features dropped
  ↓
v5_quantile_transformer.transform(features)
  ↓
┌────────────────────────────────────┐
│  v5_base_models.predict(features)  │  ← Stacking ensemble
│  v5_mlp_models.predict(features)   │  ← MLP ensemble
└────────────┬───────────────────────┘
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
  → logA (Arrhenius prefactor)
             ↓
v6_corrector_model.predict(features)
  → residual correction (Δlog10σ)
             ↓
Arrhenius equation:
  σ(T) = 10^(logA) · exp(-Ea / (kB · T))
  σ_corrected = σ_base · 10^(Δlog10σ)
             ↓
API Response
```

### Key Constants

```python
MODEL_VERSION = "IonCast-v5-stacking-Ea+A + v6-residual-corrector"
TARGET_SCALE = 10.0
EA_CLIP_EV = (0.005, 5.0)
SUPPORTED_TEMPERATURE_RANGE_K = (250, 1000)
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
