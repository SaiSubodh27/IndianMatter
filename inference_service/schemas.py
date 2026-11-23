"""
schemas.py
==========
Pydantic V2 Request and Response models for the standalone Inference Service.
Enforces explicit typing, input validation, and clear error payloads.
"""

from typing import Dict, List, Optional, Any, Union
from pydantic import BaseModel, Field, field_validator


class PropertyResult(BaseModel):
    property_key: str
    value: Optional[Union[float, int, str, bool]] = None
    unit: str = ""
    status: str = "calculated"
    model: Optional[str] = None
    warnings: Optional[List[str]] = None


class MaterialMetadata(BaseModel):
    formula: str
    volume_A3: Optional[float] = None
    density_g_cm3: Optional[float] = None
    num_sites: Optional[int] = None
    space_group: Optional[str] = None
    crystal_system: Optional[str] = None


class PropertyPredictionRequest(BaseModel):
    cif_text: str = Field(..., description="Valid CIF file content string")
    properties: List[str] = Field(default_factory=lambda: ["band_gap", "formation_energy"], description="Requested property keys")
    temperature: float = Field(default=298.15, ge=0.0, le=5000.0, description="Temperature in Kelvin")
    formula: Optional[str] = None

    @field_validator("cif_text")
    @classmethod
    def validate_cif_text(cls, v: str) -> str:
        if not v or not v.strip():
            raise ValueError("cif_text must not be empty")
        return v.strip()


class PropertyPredictionResponse(BaseModel):
    status: str = "success"
    material_metadata: Dict[str, Any] = Field(default_factory=dict)
    model_used: str = "CrystalFormer-IonCast-Unified"
    base_outputs: Dict[str, Any] = Field(default_factory=dict)
    properties: Dict[str, PropertyResult] = Field(default_factory=dict)


class IonicTransportRequest(BaseModel):
    cif_text: str = Field(..., description="Valid CIF file content string")
    temperature: float = Field(default=298.15, ge=0.0, le=2000.0, description="Temperature in Kelvin")

    @field_validator("cif_text")
    @classmethod
    def validate_cif(cls, v: str) -> str:
        if not v or not v.strip():
            raise ValueError("cif_text must not be empty")
        return v.strip()


class IonicTransportResponse(BaseModel):
    status: str = "calculated"
    conductivity_s_cm: Optional[float] = None
    activation_energy_ev: Optional[float] = None
    temperature_k: float = 298.15
    model_version: str = "IonCast v5/v6 Ensemble"
    details: Dict[str, Any] = Field(default_factory=dict)


class CifGenerationRequest(BaseModel):
    formula: str = Field(..., description="Chemical formula (e.g. Li7La3Zr2O12 or LiFePO4)")
    max_iterations: int = Field(default=1, ge=1, le=5)
    samples_per_iteration: int = Field(default=2, ge=1, le=10)

    @field_validator("formula")
    @classmethod
    def validate_formula(cls, v: str) -> str:
        if not v or not v.strip():
            raise ValueError("formula must not be empty")
        return v.strip()


class CifGenerationResponse(BaseModel):
    success: bool
    formula: str
    cif_string: Optional[str] = None
    space_group: Optional[str] = None
    generator_source: str = "CrystalFormer-CIF-Pipeline"
    metadata: Dict[str, Any] = Field(default_factory=dict)


class StructureAnalysisRequest(BaseModel):
    cif_text: str = Field(..., description="Valid CIF file content string")

    @field_validator("cif_text")
    @classmethod
    def validate_cif(cls, v: str) -> str:
        if not v or not v.strip():
            raise ValueError("cif_text must not be empty")
        return v.strip()


class StructureAnalysisResponse(BaseModel):
    status: str = "success"
    formula: str
    reduced_formula: str
    density: float
    volume: float
    num_sites: int
    space_group: str
    crystal_system: str
    lattice_a: float
    lattice_b: float
    lattice_c: float
    lattice_alpha: float
    lattice_beta: float
    lattice_gamma: float


class CrystalFormerPredictionRequest(BaseModel):
    cif_text: str = Field(..., description="Valid CIF file content string")
    temperature_k: float = Field(default=298.15, ge=0.0, le=5000.0)
    compute_ehull: bool = True

    @field_validator("cif_text")
    @classmethod
    def validate_cif(cls, v: str) -> str:
        if not v or not v.strip():
            raise ValueError("cif_text must not be empty")
        return v.strip()


class CrystalFormerPredictionResponse(BaseModel):
    status: str = "success"
    formula: Optional[str] = None
    core_properties: Dict[str, Any] = Field(default_factory=dict)
    derived_properties: Dict[str, Any] = Field(default_factory=dict)
    auxiliary_metrics: Dict[str, Any] = Field(default_factory=dict)
    stability: Dict[str, Any] = Field(default_factory=dict)
    model_provenance: Dict[str, str] = Field(default_factory=dict)
