"""
security.py
===========
Security verification for internal service communication.
Protects inference execution endpoints from unauthorized direct access.
"""

from fastapi import Security, HTTPException, status
from fastapi.security.api_key import APIKeyHeader
from inference_service.config import INTERNAL_SERVICE_KEY

api_key_header = APIKeyHeader(name="X-Internal-Service-Key", auto_error=False)


async def verify_internal_service_key(api_key: str = Security(api_key_header)):
    """
    Validates that the caller holds the authorized internal service key.
    If INTERNAL_SERVICE_KEY is unset or default in development, requests are allowed
    with a warning log, but in production, matching is strictly enforced.
    """
    if not api_key:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Missing required X-Internal-Service-Key header for internal inference service",
        )
    if api_key != INTERNAL_SERVICE_KEY:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Invalid internal service key",
        )
    return api_key
