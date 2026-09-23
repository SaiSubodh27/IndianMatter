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

### Pipeline 2: IonCast 135-Descriptor Set

**Source**: `backend/cif_descriptors.py`
**Used by**: IonCast v5/v6 models (ionic conductivity)

Extracts ~135 structural and compositional descriptors from a CIF file using
pymatgen and matminer:

- **Compositional**: elemental fractions, atomic properties (mass, radius,
  electronegativity), statistical aggregations (mean, std, min, max, range)
- **Structural**: lattice parameters, volume, density, space group, number of
  sites, coordination statistics
- **Matminer Magpie**: Element property statistics from the Magpie preset

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
