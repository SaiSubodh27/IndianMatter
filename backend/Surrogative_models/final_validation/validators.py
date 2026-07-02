"""
═══════════════════════════════════════════════════════════════════════════════════════════════
FINAL VALIDATION MODULE - Model Validation and Prediction Pipeline
═══════════════════════════════════════════════════════════════════════════════════════════════
This module validates predictions, ensures data quality, and provides proper error handling.
"""

import numpy as np
import pandas as pd
import warnings
warnings.filterwarnings('ignore')

class PredictionValidator:
    """Validate model predictions and input data"""
    
    @staticmethod
    def validate_features(features: pd.DataFrame) -> tuple[bool, str]:
        """
        Validate feature dataframe
        Returns: (is_valid, error_message)
        """
        if features is None or features.empty:
            return False, "Features dataframe is empty"
        
        if features.isnull().any().any():
            null_cols = features.columns[features.isnull().any()].tolist()
            return False, f"Null values in columns: {null_cols}"
        
        if features.shape[0] == 0:
            return False, "No feature rows"
        
        return True, ""
    
    @staticmethod
    def validate_ea(ea: float) -> tuple[bool, str]:
        """
        Validate activation energy (Ea)
        Expected range: 0.0 - 1.0 eV (typical for ion conductors)
        """
        if not isinstance(ea, (int, float)):
            return False, f"Ea must be numeric, got {type(ea)}"
        
        if np.isnan(ea) or np.isinf(ea):
            return False, f"Ea is NaN or Inf: {ea}"
        
        if ea < 0:
            return False, f"Ea cannot be negative: {ea}"
        
        if ea > 2.0:
            return False, f"Ea exceeds typical range (>2.0 eV): {ea}"
        
        return True, ""
    
    @staticmethod
    def validate_log_a(log_a: float) -> tuple[bool, str]:
        """
        Validate log10(A)
        Expected range: 2.0 - 8.0 (typical for ion conductors)
        """
        if not isinstance(log_a, (int, float)):
            return False, f"logA must be numeric, got {type(log_a)}"
        
        if np.isnan(log_a) or np.isinf(log_a):
            return False, f"logA is NaN or Inf: {log_a}"
        
        if log_a < 0:
            return False, f"logA cannot be negative: {log_a}"
        
        if log_a > 10.0:
            return False, f"logA exceeds typical range (>10.0): {log_a}"
        
        return True, ""
    
    @staticmethod
    def validate_conductivity(conductivity: float) -> tuple[bool, str]:
        """
        Validate ionic conductivity
        Expected range: 1e-10 to 1e-2 S/cm (typical for solid electrolytes)
        """
        if not isinstance(conductivity, (int, float)):
            return False, f"Conductivity must be numeric, got {type(conductivity)}"
        
        if np.isnan(conductivity) or np.isinf(conductivity):
            return False, f"Conductivity is NaN or Inf: {conductivity}"
        
        if conductivity < 0:
            return False, f"Conductivity cannot be negative: {conductivity}"
        
        if conductivity > 1.0:
            return False, f"Conductivity exceeds typical range (>1.0 S/cm): {conductivity}"
        
        return True, ""

class MaterialClassifier:
    """Classify materials based on composition and structure"""
    
    MATERIAL_CLASSES = {
        "Garnet-type": {
            "formula_pattern": r"Li.*La.*Zr.*O",
            "typical_conductivity": 1e-4,
            "description": "Li7La3Zr2O12 - Garnet-type oxide electrolyte"
        },
        "LGPS-type": {
            "formula_pattern": r"Li.*Ge.*P.*S",
            "typical_conductivity": 1e-3,
            "description": "Li10GeP2S12 - Sulfide-based fast ion conductor"
        },
        "Perovskite": {
            "formula_pattern": r"Li.*Ti.*O",
            "typical_conductivity": 1e-6,
            "description": "Li0.33La0.56TiO3 - Perovskite oxide electrolyte"
        },
        "NASICON-type": {
            "formula_pattern": r"Li.*Al.*Ti.*PO4",
            "typical_conductivity": 1e-5,
            "description": "Li1.3Al0.3Ti1.7(PO4)3 - NASICON framework"
        },
        "Halide": {
            "formula_pattern": r"Li.*Y.*Cl",
            "typical_conductivity": 1e-4,
            "description": "Li3YCl6 - Halide perovskite electrolyte"
        },
        "Argyrodite": {
            "formula_pattern": r"Li.*S.*Cl",
            "typical_conductivity": 1e-3,
            "description": "Li6PS5Cl - Argyrodite-type sulfide"
        }
    }
    
    @staticmethod
    def classify_material(composition: str = "Unknown") -> str:
        """
        Classify material type based on composition
        Returns material class name
        """
        import re
        
        if not composition or composition == "Unknown":
            return "Unknown"
        
        composition_upper = composition.upper()
        
        for material_class, info in MaterialClassifier.MATERIAL_CLASSES.items():
            pattern = info["formula_pattern"]
            if re.search(pattern, composition_upper):
                return material_class
        
        return "Unknown"

class TemperatureCorrector:
    """Apply temperature-dependent corrections to predictions"""
    
    BOLTZMANN_CONSTANT = 8.617333262145e-5  # eV/K (Boltzmann constant)
    
    @staticmethod
    def calculate_conductivity(log_a: float, ea: float, temperature: float = 298.0) -> float:
        """
        Calculate ionic conductivity using Arrhenius equation:
        σ = A * exp(-Ea / (k_B * T))
        
        Args:
            log_a: log10(A) - pre-exponential factor
            ea: Activation energy in eV
            temperature: Temperature in Kelvin
        
        Returns:
            Conductivity in S/cm
        """
        try:
            if temperature <= 0:
                raise ValueError(f"Temperature must be positive: {temperature}")
            
            A_real = 10 ** log_a
            exponent = -ea / (TemperatureCorrector.BOLTZMANN_CONSTANT * temperature)
            
            # Prevent numerical overflow
            if exponent < -700:
                conductivity = A_real * np.exp(-700)
            else:
                conductivity = A_real * np.exp(exponent)
            
            return float(conductivity)
        except Exception as e:
            raise ValueError(f"Conductivity calculation failed: {str(e)}")
    
    @staticmethod
    def get_temperature_corrected_ea(ea_base: float, temperature: float = 298.0) -> float:
        """
        Apply temperature-dependent correction to activation energy
        """
        # Simple temperature scaling (can be enhanced with more complex models)
        temp_factor = 1.0 + 0.0001 * (temperature - 298.0)
        return ea_base * temp_factor


class RangeValidator:
    """Validate predictions are within expected ranges and apply corrections"""
    
    @staticmethod
    def apply_range_validation(predictions: dict) -> dict:
        """
        Validate all predictions and apply corrections if needed
        """
        validator = PredictionValidator()
        results = predictions.copy()
        
        # Validate Ea
        is_valid_ea, ea_msg = validator.validate_ea(predictions['Ea'])
        if not is_valid_ea:
            results['Ea_valid'] = False
            results['Ea_warning'] = ea_msg
            # Apply default correction
            results['Ea'] = np.clip(predictions['Ea'], 0.0, 1.0)
        else:
            results['Ea_valid'] = True
        
        # Validate logA
        is_valid_log_a, log_a_msg = validator.validate_log_a(predictions['logA'])
        if not is_valid_log_a:
            results['logA_valid'] = False
            results['logA_warning'] = log_a_msg
            results['logA'] = np.clip(predictions['logA'], 2.0, 8.0)
        else:
            results['logA_valid'] = True
        
        # Validate conductivity
        is_valid_cond, cond_msg = validator.validate_conductivity(predictions['conductivity'])
        if not is_valid_cond:
            results['conductivity_valid'] = False
            results['conductivity_warning'] = cond_msg
        else:
            results['conductivity_valid'] = True
        
        # Add material classification
        results['classification_valid'] = True
        
        return results
