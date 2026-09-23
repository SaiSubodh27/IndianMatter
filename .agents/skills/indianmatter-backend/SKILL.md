---
name: indianmatter-backend
description: >-
  IndianMatter Materials Prediction & Computational Materials Backend Skill.
  Activate this skill when working on the IndianMatter project backend or frontend —
  including CIF parsing, crystal structure validation, feature extraction,
  ML model loading/inference, material property prediction (ionic conductivity,
  mechanical, electrical, thermal), doped material generation/screening,
  API development, model auditing, testing, or scientific validation.
  Also activate when debugging import errors, model loading failures,
  feature mismatches, or prediction pipeline issues in this project.
---

# IndianMatter Materials Prediction Backend

This skill provides the engineering and scientific intelligence layer for the
**IndianMatter** computational materials prediction platform.

> [!IMPORTANT]
> **Project-First Rule**: Before modifying ANY code, inspect the repository.
> Identify existing implementations, verify file paths, and understand current
> behavior. Never assume a file, model, endpoint, or artifact exists.

---

## When to Activate

Activate this skill when the task involves ANY of:

- CIF file parsing, validation, or generation
- Crystal structure analysis or feature extraction
- ML model loading, inference, or debugging
- Material property prediction (mechanical, electrical, thermal, ionic)
- Doping workflow / material screening pipeline
- Backend API route development or debugging
- Model artifact inspection or auditing
- Frontend-backend API contract work
- Import errors involving `chgnet`, `pymatgen`, `matminer`, `torch`, `ase`
- Scientific validation or model performance analysis

---

## Project Architecture Map

```text
IndianMatter/
├── backend/                          # FastAPI backend (entry: main.py)
│   ├── main.py                       # App entry point, lifespan, router registration
│   ├── model_service.py              # IonCast v5/v6 prediction pipeline (~836 lines)
│   ├── model_paths.py                # Model artifact path resolution
│   ├── cif_descriptors.py            # 135-feature descriptor extraction for IonCast
│   ├── api/
│   │   └── calculator_router.py      # Multi-property prediction endpoints
│   ├── routes/
│   │   ├── auth_routes.py            # Authentication
│   │   ├── user_routes.py            # User management
│   │   ├── cif_routes.py             # CIF generation/analysis
│   │   ├── materials_routes.py       # Materials Project integration
│   │   ├── indianmatter.py           # IndianMatter internal DB routes
│   │   ├── database_routes.py        # Dataset management
│   │   ├── oqmd.py / aflow.py / jarvis.py  # External database proxies
│   │   └── transport_router.py       # Transport property routes
│   ├── core/
│   │   ├── property_registry.py      # PROPERTY_REGISTRY definitions
│   │   ├── device_manager.py         # GPU/CPU detection
│   │   ├── config.py                 # App configuration
│   │   ├── exceptions.py             # Custom exceptions
│   │   └── job_manager.py            # Background job management
│   ├── models/                       # GNN model adapters
│   │   ├── base_adapter.py           # Abstract BaseModelAdapter
│   │   ├── chgnet_adapter.py         # CHGNet adapter
│   │   ├── m3gnet_adapter.py         # M3GNet adapter
│   │   ├── mace_adapter.py           # MACE adapter
│   │   └── model_registry.py         # ModelRegistry class
│   ├── properties/                   # Property calculators (ABC pattern)
│   │   ├── base_property.py          # PropertyResult + BasePropertyCalculator
│   │   ├── electrical_properties.py
│   │   ├── ionic_conductivity.py
│   │   ├── thermal_properties.py
│   │   ├── structural_properties.py
│   │   ├── composition_properties.py
│   │   └── direct_outputs.py
│   ├── utils/
│   │   ├── chgnet_features.py        # CHGNet 21-feature vector extraction
│   │   ├── feature_extractor.py      # General feature extraction
│   │   └── structural_analyzer.py    # Structural metrics
│   ├── services/
│   │   ├── prediction_service.py     # Prediction orchestration
│   │   ├── material_filter_service.py
│   │   └── ...
│   ├── calculations/                 # Compute-heavy modules
│   │   ├── descriptor_pipeline.py    # Descriptor computation
│   │   ├── m3gnet_properties.py
│   │   ├── alignn_properties.py
│   │   └── eos.py                    # Equation of state
│   ├── Surrogative_models/
│   │   ├── feature_extractor.py      # 65k-byte advanced feature extractor
│   │   └── final_validation/         # PredictionValidator
│   ├── prediction_models/            # Additional model adapters
│   ├── tests/
│   │   ├── test_api_routes.py
│   │   ├── test_dataset_validation.py
│   │   └── test_property_calculators.py
│   └── train_*.py                    # Training scripts (mechanical/electrical/thermal)
├── pretrained_models/                # Production model artifacts
│   ├── v5_base_models.pkl            # IonCast v5 base ensemble (~266 MB)
│   ├── v5_mlp_models.pkl             # MLP sub-models (~13 MB)
│   ├── v5_meta_model.pkl             # Meta-learner stacking model
│   ├── v5_model2_A.pkl               # log10(A) prefactor model
│   ├── v5_quantile_transformer.pkl   # Feature quantile transformer
│   ├── v6_corrector_model.pkl        # Residual correction model
│   ├── chgnet_logK_model.pkl         # Bulk modulus surrogate
│   ├── chgnet_logG_model.pkl         # Shear modulus surrogate
│   ├── chgnet_bandgap_model.pkl      # Band gap surrogate
│   └── chgnet_thermal_model.pkl      # Thermal surrogate
├── src/                              # React + Vite + TypeScript frontend
│   ├── App.tsx
│   ├── lib/
│   │   ├── api.ts                    # Core API client
│   │   ├── materialsPredictionApi.ts # Prediction API client
│   │   ├── cifApi.ts                 # CIF API client
│   │   └── parseCIF.ts               # Client-side CIF parser
│   └── pages/
│       ├── prediction/               # Property prediction UI
│       ├── cif/                       # CIF tools UI
│       ├── materials/                 # Materials explorer
│       ├── dashboard/                 # Dashboard
│       └── ...
└── configs/                          # Project configuration
```

---

## Core Prediction Pipelines

### Pipeline 1: CHGNet Surrogate Properties (Mechanical / Electrical / Thermal)

```text
CIF → pymatgen.Structure → AseAtomsAdaptor → CHGNet inference
  → 21-feature vector (energy, forces, stress)
  → LightGBM surrogate → property prediction (K, G, band gap, thermal)
```

- **Feature source**: [chgnet_features.py](file:///backend/utils/chgnet_features.py)
- **Surrogate models**: `chgnet_logK_model.pkl`, `chgnet_logG_model.pkl`, etc.
- **Router**: [calculator_router.py](file:///backend/api/calculator_router.py)
- **CHGNet is lazy-loaded** — server starts without it

### Pipeline 2: IonCast v5/v6 Ionic Conductivity

```text
CIF → pymatgen.Structure → 135 descriptors (cif_descriptors.py)
  → feature normalization + alignment with canonical columns
  → v5 base models (stacking ensemble)
  → v5 meta model
  → v6 residual corrector
  → Arrhenius equation → σ(T) = 10^(logA) · exp(-Ea / kB·T)
```

- **Feature source**: [cif_descriptors.py](file:///backend/cif_descriptors.py)
- **Pipeline**: [model_service.py](file:///backend/model_service.py)
- **Model version**: `IonCast-v5-stacking-Ea+A + v6-residual-corrector`
- **Target transform**: `log1p(min_barrier * 10)` → inverted via `expm1(pred)/10`
- **Ea clipping**: 0.005–5.0 eV
- **Temperature range**: 250–1000 K

---

## Critical Rules

### 1. Feature / Training Consistency

```text
Training feature order == Inference feature order
Training preprocessing == Inference preprocessing
```

Always verify: missing features, extra features, reordered features,
different normalization, NaN/Inf values, dtype mismatches.

### 2. Model Artifact Verification

For every `.pkl` artifact, verify:
- It is actually loaded by the inference code
- It is actually used during prediction
- Its expected input features match what's being generated

If an artifact exists but isn't used: report `TRAINED BUT NOT USED DURING INFERENCE`.

### 3. Lazy Import Pattern

Heavy ML dependencies (`chgnet`, `torch`, `ase`, `dgl`) must use lazy imports.
See [chgnet_features.py](file:///backend/utils/chgnet_features.py) for the pattern.

### 4. No-Guess Rule

Never guess file paths, model names, architecture, API contracts, feature names,
or scientific properties. If unknown: `UNKNOWN — NEED TO INSPECT`.

### 5. Modification Workflow

```text
READ → UNDERSTAND → PLAN → MODIFY → TEST → VERIFY
```

Prefer minimal targeted modifications. Preserve working functionality.

---

## Reference Guides

Detailed documentation for specific domains is in the `references/` directory:

- [Model Artifacts Guide](./references/model-artifacts.md) — All pkl/model files, contents, loading
- [Feature Engineering Guide](./references/feature-engineering.md) — Feature pipelines, consistency checks
- [Property Registry Guide](./references/property-registry.md) — PROPERTY_REGISTRY, property calculators
- [Prediction Pipeline Guide](./references/prediction-pipeline.md) — IonCast v5/v6, CHGNet surrogates
- [Doping & Screening Guide](./references/doping-screening.md) — Material doping, candidate generation
- [API Architecture Guide](./references/api-architecture.md) — Routes, error handling, API contracts
- [Testing & Validation Guide](./references/testing-validation.md) — Unit/integration tests, scientific validation
- [Environment & Dependencies Guide](./references/environment-dependencies.md) — Cross-platform setup, GPU/CPU

---

## Change Report Format

After modifying code, always report:

```text
FILES CHANGED
─────────────
file.py

WHAT CHANGED
────────────
...

WHY
───
...

PIPELINE IMPACT
───────────────
CIF → features → model → prediction: [affected / not affected]

TESTS
─────
...

RESULT
──────
PASS / FAIL

REMAINING RISKS
───────────────
...
```

---

## Priority Order

When requirements conflict:

1. Scientific correctness
2. Existing project architecture
3. Data/model integrity
4. Reproducibility
5. API correctness
6. Backward compatibility
7. Performance
8. Code simplicity
