# Feature Engineering Guide

## Feature Pipelines Overview

IndianMatter has two distinct feature extraction pipelines:

### Pipeline 1: CHGNet 21-Feature Vector

**Source**: `backend/utils/chgnet_features.py`
**Used by**: CHGNet surrogate models (mechanical, electrical, thermal)

Performs a single unrelaxed ML inference pass via CHGNet on an ASE Atoms object
and extracts 21 numerical features:

| # | Feature Name | Unit | Source |
|---|---|---|---|
| 1 | `energy_eV` | eV | Total potential energy |
| 2 | `energy_per_atom_eV` | eV | Energy / num_atoms |
| 3 | `force_mean_eV_ang` | eV/Å | Mean of force magnitudes |
| 4 | `force_max_eV_ang` | eV/Å | Max force magnitude |
| 5 | `force_min_eV_ang` | eV/Å | Min force magnitude |
| 6 | `force_std_eV_ang` | eV/Å | Std dev of force magnitudes |
| 7 | `force_rms_eV_ang` | eV/Å | RMS of force magnitudes |
| 8 | `force_p25_eV_ang` | eV/Å | 25th percentile |
| 9 | `force_median_eV_ang` | eV/Å | Median force magnitude |
| 10 | `force_p75_eV_ang` | eV/Å | 75th percentile |
| 11 | `force_p95_eV_ang` | eV/Å | 95th percentile |
| 12 | `stress_xx_GPa` | GPa | Voigt stress component |
| 13 | `stress_yy_GPa` | GPa | Voigt stress component |
| 14 | `stress_zz_GPa` | GPa | Voigt stress component |
| 15 | `stress_xy_GPa` | GPa | Voigt stress component |
| 16 | `stress_yz_GPa` | GPa | Voigt stress component |
| 17 | `stress_xz_GPa` | GPa | Voigt stress component |
| 18 | `hydrostatic_stress_GPa` | GPa | Mean of diagonal stresses |
| 19 | `stress_std_GPa` | GPa | Std dev of all 6 components |
| 20 | `max_abs_stress_GPa` | GPa | Max absolute stress |
| 21 | `von_mises_stress_GPa` | GPa | Von Mises equivalent stress |

**Lazy loading**: CHGNet is imported on first use, not at module load time.

### Pipeline 2: IonCast v7 280+ Physics-Informed Descriptor Set

**Source**: `backend/ioncast/predict_ionic_conductivity.py` (`extract_obliex_style_features`)
**Used by**: IonCast v5/v6/v7 models (ionic conductivity & activation energy)

Computes 260–330 real physical, structural, and compositional descriptors per CIF file:

1. **Stoichiometry & Composition**: Matminer `Stoichiometry`, `ElementProperty` (Magpie preset), `ValenceOrbital`, `IonProperty`, element abundance/toxicity tables.
2. **Local Coordination & Near-Neighbors**: Pymatgen `CrystalNN` coordination numbers (`cn_mu`, `cn_sd`), bond lengths (`bl_mu`, `bl_sd`, `short_bonds`, `long_bonds`).
3. **Li-Ion Sublattice Environment**: Li-site coordination (`li_cn_mu`, `li_cn_min`), Li-anion bond lengths (`li_anion_bl_mu`), distortion indices (`li_distortion_mu`, `li_distortion_max`), and shortest Li–Li jump distance (`li_dmin`).
4. **Li Percolation Dimensionality (Larsen Algorithm)**: Pymatgen 3D structure graph analysis to determine 0D/1D/2D/3D interconnected ion transport channels (`li_dim`, `li_dim_1d/2d/3d`).
5. **Crystallographic Symmetry & Wyckoff Statistics**: Spglib spacegroup datasets, spacegroup numbers (`cif_spacegroup`, `sg`), and Wyckoff site multiplicities (`li_wyckoff_mu`, `li_wyckoff_max`).
6. **Lattice & Packing Geometry**: Density features, packing fractions, anisotropy ratios (`ani_ab`, `ani_ac`, `ani_bc`), volume per atom (`vpa`, `vol_per_atom_sq`), angle deviations.
7. **Training-Median Imputation & Quantile Normalization**: Uncomputable database/simulation features are filled using empirical training-distribution medians extracted from `v5_quantile_transformer.pkl` instead of zero-filling, maintaining numerical stability.


## Feature Consistency Rules

> [!CAUTION]
> Prediction-time features MUST exactly match training-time features.
> This is the #1 source of silent prediction errors.

### Checks to Perform

1. **Column order**: Features must be in the same order as training
2. **Column names**: After normalization (lowercase, underscore-separated)
3. **Missing features**: Imputed or reconstructed — verify the method
4. **Extra features**: Dropped silently — verify this is intentional
5. **Preprocessing**: Same scaler/transformer as training
6. **NaN/Inf**: Must be detected and handled before model input
7. **Dtype**: All features must be numeric (float64)

### Feature Name Normalization

`model_service.py` normalizes column names via `_normalize_feature_name()`:
```python
def _normalize_feature_name(name):
    text = str(name).strip().lower()
    text = text.replace(" ", "_").replace("-", "_").replace("/", "_")
    text = re.sub(r"[^a-z0-9_]+", "_", text)
    text = re.sub(r"_+", "_", text).strip("_")
    return text
```

### Feature Alignment in model_service.py

The IonCast pipeline aligns features using `canonical_cols` — the column order
extracted from the trained base models at load time. Missing columns are
imputed; extra columns are dropped.

## Structural Feature Extraction

**Source**: `backend/utils/structural_analyzer.py`

Calculates structural metrics from parsed CIF data:
- Lattice parameter ratios
- Angular deviations from ideal
- Volume per atom
- Packing fraction estimates

## Composition Feature Extraction

**Source**: `backend/utils/feature_extractor.py`

General-purpose feature extraction utilities for composition-based descriptors.

## Matminer Integration

Used in multiple places:
- `calculator_router.py`: `ElementProperty.from_preset("magpie")`
- `cif_descriptors.py`: comprehensive descriptor computation
- `Surrogative_models/feature_extractor.py`: advanced 65KB feature extractor

## Data Leakage Checks

When evaluating model performance, verify:
- No train/test overlap (duplicate structures or compositions)
- Preprocessing fitted on training data only, applied to test
- No target-derived features in input
- Cross-validation done at composition level, not random split
