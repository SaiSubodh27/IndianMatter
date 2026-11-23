"""
inference_client.py
===================
Robust, asynchronous and synchronous HTTPX client for communication between
Main API (Port 8000) and standalone Inference Service (Port 8001).

Responsibilities:
- Service discovery via INFERENCE_BASE_URL (never hardcoded in production)
- Secret key verification via X-Internal-Service-Key header
- Connection and read timeouts with graceful degradation
- Strongly-typed exception mapping (503 Service Unavailable, 504 Timeout)
"""

import os
import logging
from typing import Dict, Any, List, Optional, Union
import httpx

log = logging.getLogger("inference_client")

# Environment configuration
INFERENCE_BASE_URL = os.getenv("INFERENCE_BASE_URL", "http://127.0.0.1:8001").rstrip("/")
INTERNAL_SERVICE_SECRET = os.getenv("INTERNAL_SERVICE_SECRET", "indianmatter-internal-secret-token")
CONNECT_TIMEOUT = float(os.getenv("INFERENCE_CONNECT_TIMEOUT", "5.0"))
READ_TIMEOUT = float(os.getenv("INFERENCE_READ_TIMEOUT", "60.0"))


class InferenceError(Exception):
    """Base exception for inference communication failures."""
    def __init__(self, message: str, status_code: int = 502, details: Optional[Dict[str, Any]] = None):
        super().__init__(message)
        self.message = message
        self.status_code = status_code
        self.details = details or {}


class InferenceUnavailableError(InferenceError):
    """Raised when the inference service cannot be reached (offline/refused)."""
    def __init__(self, message: str = "Inference service is currently offline or unreachable."):
        super().__init__(message, status_code=503)


class InferenceTimeoutError(InferenceError):
    """Raised when the inference service times out during execution."""
    def __init__(self, message: str = "Inference service request timed out."):
        super().__init__(message, status_code=504)


class InferenceClient:
    """HTTP client communicating with the independent Inference Service on port 8001."""

    def __init__(
        self,
        base_url: Optional[str] = None,
        secret_key: Optional[str] = None,
        timeout: Optional[float] = None,
    ):
        self.base_url = (base_url or INFERENCE_BASE_URL).rstrip("/")
        self.secret_key = secret_key or INTERNAL_SERVICE_SECRET
        self.timeout = httpx.Timeout(timeout or READ_TIMEOUT, connect=CONNECT_TIMEOUT)
        self._headers = {
            "X-Internal-Service-Key": self.secret_key,
            "Accept": "application/json",
        }

    # -------------------------------------------------------------------------
    # Health and Readiness Probes
    # -------------------------------------------------------------------------
    async def check_health(self) -> Dict[str, Any]:
        """Check whether the inference service is responsive."""
        try:
            async with httpx.AsyncClient(timeout=self.timeout) as client:
                resp = await client.get(f"{self.base_url}/health", headers=self._headers)
                resp.raise_for_status()
                return resp.json()
        except httpx.ConnectError:
            return {"status": "unreachable", "error": "Connection refused"}
        except Exception as e:
            return {"status": "error", "error": str(e)}

    def check_health_sync(self) -> Dict[str, Any]:
        """Synchronous health check for startup probes."""
        try:
            with httpx.Client(timeout=self.timeout) as client:
                resp = client.get(f"{self.base_url}/health", headers=self._headers)
                resp.raise_for_status()
                return resp.json()
        except httpx.ConnectError:
            return {"status": "unreachable", "error": "Connection refused"}
        except Exception as e:
            return {"status": "error", "error": str(e)}

    async def check_readiness(self) -> Dict[str, Any]:
        """Check whether model checkpoints are loaded and ready."""
        try:
            async with httpx.AsyncClient(timeout=self.timeout) as client:
                resp = await client.get(f"{self.base_url}/ready", headers=self._headers)
                resp.raise_for_status()
                return resp.json()
        except httpx.ConnectError:
            return {"ready": False, "error": "Connection refused"}
        except Exception as e:
            return {"ready": False, "error": str(e)}

    # -------------------------------------------------------------------------
    # Property Prediction (Multi-Property Unified Engine)
    # -------------------------------------------------------------------------
    async def predict_properties(
        self,
        cif_text: str,
        properties: Union[List[str], str],
        temperature: float = 298.15,
        formula: Optional[str] = None,
    ) -> Dict[str, Any]:
        """
        Request property prediction (CrystalFormer, CHGNet, IonCast, Geometric).
        """
        if isinstance(properties, str):
            prop_list = [p.strip() for p in properties.split(",") if p.strip()]
        else:
            prop_list = list(properties)

        payload = {
            "cif_text": cif_text,
            "properties": prop_list,
            "temperature": float(temperature),
            "formula": formula,
        }

        try:
            async with httpx.AsyncClient(timeout=self.timeout) as client:
                resp = await client.post(
                    f"{self.base_url}/internal/v1/predict-properties",
                    json=payload,
                    headers=self._headers,
                )
                if resp.status_code == 200:
                    return resp.json()
                elif resp.status_code == 422:
                    raise InferenceError(f"Validation error from inference service: {resp.text}", status_code=400)
                else:
                    raise InferenceError(
                        f"Inference service failed with HTTP {resp.status_code}: {resp.text}",
                        status_code=resp.status_code,
                    )
        except httpx.ConnectError as ce:
            log.warning(f"Inference service unreachable at {self.base_url}: {ce}")
            raise InferenceUnavailableError() from ce
        except httpx.TimeoutException as te:
            log.warning(f"Inference request timed out at {self.base_url}: {te}")
            raise InferenceTimeoutError() from te

    def predict_properties_sync(
        self,
        cif_text: str,
        properties: Union[List[str], str],
        temperature: float = 298.15,
        formula: Optional[str] = None,
    ) -> Dict[str, Any]:
        """Synchronous version for non-async worker execution."""
        if isinstance(properties, str):
            prop_list = [p.strip() for p in properties.split(",") if p.strip()]
        else:
            prop_list = list(properties)

        payload = {
            "cif_text": cif_text,
            "properties": prop_list,
            "temperature": float(temperature),
            "formula": formula,
        }

        try:
            with httpx.Client(timeout=self.timeout) as client:
                resp = client.post(
                    f"{self.base_url}/internal/v1/predict-properties",
                    json=payload,
                    headers=self._headers,
                )
                if resp.status_code == 200:
                    return resp.json()
                elif resp.status_code == 422:
                    raise InferenceError(f"Validation error from inference service: {resp.text}", status_code=400)
                else:
                    raise InferenceError(
                        f"Inference service failed with HTTP {resp.status_code}: {resp.text}",
                        status_code=resp.status_code,
                    )
        except httpx.ConnectError as ce:
            log.warning(f"Inference service unreachable at {self.base_url}: {ce}")
            raise InferenceUnavailableError() from ce
        except httpx.TimeoutException as te:
            log.warning(f"Inference request timed out at {self.base_url}: {te}")
            raise InferenceTimeoutError() from te

    # -------------------------------------------------------------------------
    # CrystalFormer Specific Prediction
    # -------------------------------------------------------------------------
    async def predict_crystalformer(
        self,
        cif_text: str,
        temperature: float = 298.15,
        compute_ehull: bool = True,
    ) -> Dict[str, Any]:
        """Request dedicated CrystalFormer prediction."""
        payload = {
            "cif_text": cif_text,
            "temperature_k": float(temperature),
            "compute_ehull": compute_ehull,
        }
        try:
            async with httpx.AsyncClient(timeout=self.timeout) as client:
                resp = await client.post(
                    f"{self.base_url}/internal/v1/predict-crystalformer",
                    json=payload,
                    headers=self._headers,
                )
                if resp.status_code == 200:
                    return resp.json()
                raise InferenceError(
                    f"CrystalFormer inference returned HTTP {resp.status_code}: {resp.text}",
                    status_code=resp.status_code,
                )
        except httpx.ConnectError as ce:
            raise InferenceUnavailableError() from ce
        except httpx.TimeoutException as te:
            raise InferenceTimeoutError() from te

    # -------------------------------------------------------------------------
    # Ionic Transport (IonCast)
    # -------------------------------------------------------------------------
    async def predict_ionic_transport(
        self,
        cif_text: str,
        temperature: float = 298.15,
    ) -> Dict[str, Any]:
        """Request IonCast ionic conductivity and activation energy."""
        payload = {
            "cif_text": cif_text,
            "temperature": float(temperature),
        }
        try:
            async with httpx.AsyncClient(timeout=self.timeout) as client:
                resp = await client.post(
                    f"{self.base_url}/internal/v1/predict-ionic-transport",
                    json=payload,
                    headers=self._headers,
                )
                if resp.status_code == 200:
                    return resp.json()
                raise InferenceError(
                    f"IonCast inference returned HTTP {resp.status_code}: {resp.text}",
                    status_code=resp.status_code,
                )
        except httpx.ConnectError as ce:
            raise InferenceUnavailableError() from ce
        except httpx.TimeoutException as te:
            raise InferenceTimeoutError() from te

    # -------------------------------------------------------------------------
    # Structure Synthesis & CIF Generation
    # -------------------------------------------------------------------------
    async def generate_cif(
        self,
        formula: str,
        max_iterations: int = 1,
        samples_per_iteration: int = 2,
    ) -> Dict[str, Any]:
        """Request generative crystal structure synthesis from formula."""
        payload = {
            "formula": formula,
            "max_iterations": max_iterations,
            "samples_per_iteration": samples_per_iteration,
        }
        try:
            # CIF generation may take slightly longer; allow extended read timeout
            gen_timeout = httpx.Timeout(max(self.timeout.read, 90.0), connect=CONNECT_TIMEOUT)
            async with httpx.AsyncClient(timeout=gen_timeout) as client:
                resp = await client.post(
                    f"{self.base_url}/internal/v1/generate-cif",
                    json=payload,
                    headers=self._headers,
                )
                if resp.status_code == 200:
                    return resp.json()
                raise InferenceError(
                    f"CIF generation returned HTTP {resp.status_code}: {resp.text}",
                    status_code=resp.status_code,
                )
        except httpx.ConnectError as ce:
            raise InferenceUnavailableError() from ce
        except httpx.TimeoutException as te:
            raise InferenceTimeoutError() from te

    def generate_cif_sync(
        self,
        formula: str,
        max_iterations: int = 1,
        samples_per_iteration: int = 2,
    ) -> Dict[str, Any]:
        """Synchronous CIF generation for catalog infilling."""
        payload = {
            "formula": formula,
            "max_iterations": max_iterations,
            "samples_per_iteration": samples_per_iteration,
        }
        try:
            gen_timeout = httpx.Timeout(max(self.timeout.read, 90.0), connect=CONNECT_TIMEOUT)
            with httpx.Client(timeout=gen_timeout) as client:
                resp = client.post(
                    f"{self.base_url}/internal/v1/generate-cif",
                    json=payload,
                    headers=self._headers,
                )
                if resp.status_code == 200:
                    return resp.json()
                raise InferenceError(
                    f"CIF generation returned HTTP {resp.status_code}: {resp.text}",
                    status_code=resp.status_code,
                )
        except httpx.ConnectError as ce:
            raise InferenceUnavailableError() from ce
        except httpx.TimeoutException as te:
            raise InferenceTimeoutError() from te

    # -------------------------------------------------------------------------
    # Structure Analysis (Pymatgen / Symmetry / Geometry)
    # -------------------------------------------------------------------------
    async def analyze_structure(self, cif_text: str) -> Dict[str, Any]:
        """Request scientific structure parsing, space group and geometry metrics."""
        payload = {"cif_text": cif_text}
        try:
            async with httpx.AsyncClient(timeout=self.timeout) as client:
                resp = await client.post(
                    f"{self.base_url}/internal/v1/analyze-structure",
                    json=payload,
                    headers=self._headers,
                )
                if resp.status_code == 200:
                    return resp.json()
                raise InferenceError(
                    f"Structure analysis returned HTTP {resp.status_code}: {resp.text}",
                    status_code=resp.status_code,
                )
        except httpx.ConnectError as ce:
            raise InferenceUnavailableError() from ce
        except httpx.TimeoutException as te:
            raise InferenceTimeoutError() from te


# Singleton instance for import across Main API
inference_client = InferenceClient()
