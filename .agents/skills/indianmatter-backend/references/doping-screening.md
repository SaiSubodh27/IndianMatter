# Doping & Material Screening Guide

## Doping Workflow

```text
Target Material (e.g., Li7La3Zr2O12)
        ↓
Dopant Selection (e.g., Al, Ta, Nb)
        ↓
Host Site Selection (e.g., Zr-site, La-site)
        ↓
Doping Concentration (x = 0.05, 0.10, 0.25, ...)
        ↓
Doped Composition Generation
        ↓
Structural / Chemical Validation
        ↓
CIF Generation (optional)
        ↓
Feature Extraction
        ↓
Property Prediction
        ↓
Screening Against Criteria
        ↓
Ranked Candidate List
```

## Dopant Validation Rules

> [!IMPORTANT]
> Never treat every substitution as physically valid.

Check, where computationally possible:

1. **Element compatibility**: Is the dopant chemically reasonable at this site?
2. **Oxidation state**: Does the dopant's common oxidation state match the host?
3. **Charge balance**: Is the total charge preserved or compensated?
4. **Ionic radius**: Is the dopant's ionic radius within ~15% of the host?
5. **Stoichiometry**: Does the resulting composition have valid fractions?
6. **Site availability**: Is there a crystallographic site to substitute into?
7. **Concentration limits**: Is x within a solubility limit?

If a constraint cannot be verified computationally, mark it:
```text
NOT VERIFIED — requires experimental validation
```

## Composition Generation

For substitutional doping at a single site:

```python
# Example: Li7La3Zr_{2-x}Al_xO12
base_formula = "Li7La3Zr2O12"
dopant = "Al"
site = "Zr"
concentrations = [0.05, 0.10, 0.25, 0.50]

for x in concentrations:
    doped = f"Li7La3Zr{2-x}Al{x}O12"
    # Validate composition
    # Generate structure
    # Extract features
    # Predict properties
```

## Screening Pipeline

```text
Candidate Generation (N candidates)
        ↓
Validity Filtering
  - charge balance
  - composition validity
  - structural validity
        ↓
Feature Extraction
  - per-candidate CIF → features
        ↓
Property Prediction
  - batch prediction for efficiency
        ↓
Constraint Filtering
  - σ ≥ threshold_conductivity
  - Ea ≤ threshold_activation
  - band_gap ≥ threshold_gap
  - stability criteria
        ↓
Ranking
  - by target property or composite score
        ↓
Shortlist (M candidates, M << N)
```

## Screening Result Format

```json
{
  "candidate_id": "LLZO-Al-Zr-0.25",
  "parent_material": "Li7La3Zr2O12",
  "dopant": "Al",
  "dopant_site": "Zr",
  "concentration": 0.25,
  "generated_formula": "Li7La3Zr1.75Al0.25O12",
  "validation": {
    "charge_balance": "PASSED",
    "composition_valid": true,
    "ionic_radius_check": "NOT VERIFIED"
  },
  "predicted_properties": {
    "ionic_conductivity_S_cm": 1.2e-3,
    "activation_energy_eV": 0.32,
    "band_gap_eV": 5.1
  },
  "screening_status": "PASSED",
  "rank": 3
}
```

## CIF Generation for Doped Materials

Before writing a doped CIF:

1. Validate composition (all elements, stoichiometry)
2. Validate lattice parameters (must be physically reasonable)
3. Validate atomic positions (no overlapping atoms)
4. Validate occupancies (fractional if site mixing)
5. Write CIF using pymatgen `CifWriter`
6. **Round-trip test**: re-read the generated CIF and compare

```python
from pymatgen.io.cif import CifWriter

writer = CifWriter(structure)
writer.write_file("doped.cif")

# Round-trip validation
roundtrip = Structure.from_file("doped.cif")
assert len(roundtrip) == len(structure)
```

## Thresholds

> [!WARNING]
> Do not invent scientific thresholds.
> All screening thresholds must come from user configuration or established
> literature values. Always cite the source.

Common reference values (must be confirmed by user):

| Property | Typical threshold | Source |
|---|---|---|
| Ionic conductivity | ≥ 10⁻⁴ S/cm at 300K | Solid electrolyte target |
| Activation energy | ≤ 0.5 eV | Fast-ion conductor target |
| Band gap | ≥ 4.0 eV | Electronic insulator requirement |
| Electrochemical window | ≥ 5 V | Li-metal battery compatibility |
