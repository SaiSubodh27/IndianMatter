# Property Registry Guide

## Overview

The property registry (`backend/core/property_registry.py`) is the central
source of truth for all material properties the system can predict.

## PropertyDefinition Class

```python
class PropertyDefinition:
    key: str              # Unique identifier (e.g., "bulk_modulus")
    display_name: str     # Human-readable name
    category: str         # "direct", "transformer", or "ml"
    requires_embeddings: bool   # Whether GNN embeddings are needed
    embedding_model: str  # Which GNN model (e.g., "chgnet")
    unit: str             # Physical unit
    description: str      # Scientific description
    enabled: bool         # Whether currently active
```

## Registered Properties

### Category A: Direct / Deterministic

| Key | Display Name | Unit | Source |
|---|---|---|---|
| `density` | Mass Density | g/cm³ | Pymatgen (lattice + mass) |
| `composition_features` | Compositional Features | dimensionless | Matminer |

### Category B: Mechanical (CHGNet + LightGBM Surrogate)

| Key | Display Name | Unit | Embedding Model |
|---|---|---|---|
| `bulk_modulus` | Bulk Modulus (VRH) | GPa | chgnet |
| `shear_modulus` | Shear Modulus (VRH) | GPa | chgnet |
| `youngs_modulus` | Young's Modulus | GPa | chgnet |
| `pughs_ratio` | Pugh's Ratio (B/G) | ratio | chgnet |

### Category C: Thermodynamic & Electronic

| Key | Display Name | Unit | Embedding Model |
|---|---|---|---|
| `formation_energy` | Formation Energy per Atom | eV/atom | chgnet |
| `band_gap` | Electronic Band Gap | eV | chgnet |

### Category D: Transport & Electrochemical

| Key | Display Name | Unit | Embedding Model |
|---|---|---|---|
| `ionic_conductivity` | Ionic Conductivity | S/cm | chgnet |
| `activation_energy` | Diffusion Activation Energy | eV | chgnet |
| `thermal_conductivity` | Thermal Conductivity | W/m·K | chgnet |
| `voltage_window` | Electrochemical Voltage Window | V | chgnet |

## PropertyResult Class

```python
class PropertyResult:
    property_key: str
    property_name: str
    category: str
    value: Any
    unit: str
    source_model: str
    calculation_method: str
    status: str  # "calculated", "derived", "estimated", "unsupported", "failed", "unavailable"
    inputs_used: List[str]
    warnings: List[str]
    limitations: str
    raw_details: dict
```

## BasePropertyCalculator (ABC)

All property calculators inherit from:
```python
class BasePropertyCalculator(ABC):
    def calculate(self, structure, model_adapter=None, settings=None) -> PropertyResult:
        ...
```

### Implemented Calculators

| File | Properties |
|---|---|
| `properties/electrical_properties.py` | Band gap, electronic nature |
| `properties/thermal_properties.py` | Thermal conductivity, Debye temp |
| `properties/ionic_conductivity.py` | σ, Ea, logA |
| `properties/structural_properties.py` | Lattice, volume, density |
| `properties/composition_properties.py` | Elemental fractions, Magpie features |
| `properties/direct_outputs.py` | Direct pymatgen/matminer outputs |

## Utility Functions

```python
get_property_definition(key) -> PropertyDefinition    # Lookup by key
list_available_properties() -> list                    # All enabled properties
group_properties_by_execution_method(keys) -> dict     # Group by category
```

## Adding a New Property

1. Add `PropertyDefinition` to `PROPERTY_REGISTRY` in `property_registry.py`
2. Create a calculator class inheriting `BasePropertyCalculator`
3. Register the calculator in the prediction service
4. Add the property key to the frontend API client
5. Write tests
