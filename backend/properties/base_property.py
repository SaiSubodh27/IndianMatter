"""Base property result schema and calculator ABC.

Role in the system
------------------
Defines ``PropertyResult`` (key, name, category, value, unit, source_model,
calculation_method, status, inputs, warnings, limitations, raw_details) and
``BasePropertyCalculator`` (abstract). Used by the (unwired)
``/api/materials-prediction`` property pipeline.
"""

from abc import ABC, abstractmethod  # abstract base for property calculators
from typing import Dict, Any, List, Optional

class PropertyResult:
    """
    Standardized result wrapper for every calculated materials property.
    Enforces required scientific metadata schema.
    """
    def __init__(
        self,
        property_key: str,
        property_name: str,
        category: str,
        value: Any,
        unit: str,
        source_model: str,
        calculation_method: str,
        status: str = "calculated",  # 'calculated', 'derived', 'estimated', 'unsupported', 'failed', 'unavailable'
        inputs_used: Optional[List[str]] = None,
        warnings: Optional[List[str]] = None,
        limitations: Optional[str] = None,
        raw_details: Optional[dict] = None
    ):
        self.property_key = property_key
        self.property_name = property_name
        self.category = category
        self.value = value
        self.unit = unit
        self.source_model = source_model
        self.calculation_method = calculation_method
        self.status = status
        self.inputs_used = inputs_used or []
        self.warnings = warnings or []
        self.limitations = limitations or "Computational estimate; accuracy depends on model and structural quality."
        self.raw_details = raw_details or {}

    def to_dict(self) -> dict:
        return {
            "property_key": self.property_key,
            "property_name": self.property_name,
            "category": self.category,
            "value": self.value,
            "unit": self.unit,
            "source_model": self.source_model,
            "calculation_method": self.calculation_method,
            "status": self.status,
            "inputs_used": self.inputs_used,
            "warnings": self.warnings,
            "limitations": self.limitations,
            "raw_details": self.raw_details,
        }

class BasePropertyCalculator(ABC):
    """
    Abstract calculator for individual material properties.
    """
    def __init__(self, key: str, name: str, category: str, unit: str, description: str):
        self.key = key
        self.name = name
        self.category = category
        self.unit = unit
        self.description = description

    @abstractmethod
    def calculate(self, structure: Any, model_adapter: Optional[Any] = None, settings: Optional[dict] = None) -> PropertyResult:
        pass
