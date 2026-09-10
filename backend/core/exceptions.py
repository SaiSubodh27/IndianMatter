class PredictionPipelineError(Exception):
    """Base exception for prediction pipeline errors."""
    def __init__(self, message: str, status_code: int = 400, details: dict = None):
        super().__init__(message)
        self.message = message
        self.status_code = status_code
        self.details = details or {}

class DatasetValidationError(PredictionPipelineError):
    """Raised when CSV or structure dataset fails validation."""
    pass

class ModelUnavailableError(PredictionPipelineError):
    """Raised when requested model is not installed or available."""
    pass

class PropertyUnsupportedError(PredictionPipelineError):
    """Raised when a requested property is explicitly excluded or unsupported."""
    pass

class CalculationFailedError(PredictionPipelineError):
    """Raised when a specific structure or property calculation fails."""
    pass
