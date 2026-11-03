"""Definitional property registry for the (unwired) prediction pipeline.

Role in the system
------------------
Defines ``PropertyDefinition`` (key, display name, category direct/transformer/ml,
embedding model, unit, description, enabled) and ``PropertyRegistry`` holding
the list of available properties. This is a *definitional* registry only — it
does not contain calculators. The actual calculators live in
``backend/properties/`` and ``backend/properties/property_registry`` (missing)
is referenced by tests. Used by the unwired ``/api/materials-prediction`` flow.
"""

from typing import Dict, Any, Optional  # type hints for property definitions

class PropertyDefinition:
    def __init__(
        self,
        key: str,
        display_name: str,
        category: str,  # "direct", "transformer", "ml"
        requires_embeddings: bool = False,
        embedding_model: Optional[str] = None,
        unit: str = "",
        description: str = "",
        enabled: bool = True
    ):
        self.key = key
        self.display_name = display_name
        self.category = category  # direct (pymatgen/matminer), transformer, or ml
        self.requires_embeddings = requires_embeddings
        self.embedding_model = embedding_model  # e.g., "chgnet" if transformer/V5 needs latent features
        self.unit = unit
        self.description = description
        self.enabled = enabled

    def to_dict(self) -> Dict[str, Any]:
        return {
            "key": self.key,
            "display_name": self.display_name,
            "category": self.category,
            "requires_embeddings": self.requires_embeddings,
            "embedding_model": self.embedding_model,
            "unit": self.unit,
            "description": self.description,
            "enabled": self.enabled
        }


# Central Registry Dictionary mapping property keys to their configuration
PROPERTY_REGISTRY: Dict[str, PropertyDefinition] = {
    # --- Category A: Direct / Deterministic (Pymatgen & Matminer) ---
    "density": PropertyDefinition(
        key="density",
        display_name="Mass Density",
        category="direct",
        requires_embeddings=False,
        unit="g/cm³",
        description="Calculated directly from crystal lattice volume and atomic mass via Pymatgen."
    ),
    "composition_features": PropertyDefinition(
        key="composition_features",
        display_name="Stoichiometric & Compositional Features",
        category="direct",
        requires_embeddings=False,
        unit="dimensionless",
        description="Extracted via Matminer composition attribute calculators."
    ),

    # --- Category B: Mechanical Properties (Bulk, Shear, Young's, Pugh's) ---
    "bulk_modulus": PropertyDefinition(
        key="bulk_modulus",
        display_name="Bulk Modulus (VRH)",
        category="transformer",  # Ready for your upcoming transformer; falls back to surrogate/matminer if needed
        requires_embeddings=True,
        embedding_model="chgnet",
        unit="GPa",
        description="Incompressibility modulus predicted via transformer/surrogate model."
    ),
    "shear_modulus": PropertyDefinition(
        key="shear_modulus",
        display_name="Shear Modulus (VRH)",
        category="transformer",
        requires_embeddings=True,
        embedding_model="chgnet",
        unit="GPa",
        description="Resistance to shear deformation."
    ),
    "youngs_modulus": PropertyDefinition(
        key="youngs_modulus",
        display_name="Young's Modulus",
        category="transformer",
        requires_embeddings=True,
        embedding_model="chgnet",
        unit="GPa",
        description="Stiffness and tensile elasticity."
    ),
    "pughs_ratio": PropertyDefinition(
        key="pughs_ratio",
        display_name="Pugh's Ratio (B/G)",
        category="transformer",
        requires_embeddings=True,
        embedding_model="chgnet",
        unit="ratio",
        description="Ductility vs brittleness indicator."
    ),

    # --- Category C: Thermodynamic & Electronic Properties ---
    "formation_energy": PropertyDefinition(
        key="formation_energy",
        display_name="Formation Energy per Atom",
        category="transformer",
        requires_embeddings=True,
        embedding_model="chgnet",
        unit="eV/atom",
        description="Thermodynamic stability predictor."
    ),
    "band_gap": PropertyDefinition(
        key="band_gap",
        display_name="Electronic Band Gap",
        category="transformer",
        requires_embeddings=True,
        embedding_model="chgnet",
        unit="eV",
        description="Energy difference between valence and conduction bands."
    ),

    # --- Category D: Transport & Electrochemical Properties ---
    "ionic_conductivity": PropertyDefinition(
        key="ionic_conductivity",
        display_name="Ionic Conductivity",
        category="transformer",  # Mapped to V5 / upcoming Transformer pipeline
        requires_embeddings=True,
        embedding_model="chgnet",
        unit="S/cm",
        description="Solid-state ionic mobility and diffusion property."
    ),
    "activation_energy": PropertyDefinition(
        key="activation_energy",
        display_name="Diffusion Activation Energy",
        category="transformer",
        requires_embeddings=True,
        embedding_model="chgnet",
        unit="eV",
        description="Energy barrier for ion hopping."
    ),
    "thermal_conductivity": PropertyDefinition(
        key="thermal_conductivity",
        display_name="Thermal Conductivity",
        category="transformer",
        requires_embeddings=True,
        embedding_model="chgnet",
        unit="W/m·K",
        description="Heat transfer efficiency."
    ),
    "voltage_window": PropertyDefinition(
        key="voltage_window",
        display_name="Electrochemical Voltage Window",
        category="transformer",
        requires_embeddings=True,
        embedding_model="chgnet",
        unit="V",
        description="Stable electrochemical operating range for solid electrolytes."
    ),
}


def get_property_definition(property_key: str) -> Optional[PropertyDefinition]:
    """Retrieve definition for a specific property key."""
    return PROPERTY_REGISTRY.get(property_key)


def list_available_properties() -> list:
    """Return a list of all enabled properties for frontend display and API validation."""
    return [prop.to_dict() for prop in PROPERTY_REGISTRY.values() if prop.enabled]


def group_properties_by_execution_method(requested_keys: list) -> Dict[str, list]:
    """
    Groups requested properties by their category/method so the orchestrator 
    can batch direct calculations separately from model-backed calculations.
    """
    grouped = {
        "direct": [],
        "transformer": [],
        "ml": [],
        "invalid": []
    }

    for key in requested_keys:
        prop_def = get_property_definition(key)
        if not prop_def or not prop_def.enabled:
            grouped["invalid"].append(key)
        else:
            grouped[prop_def.category].append(key)

    return grouped