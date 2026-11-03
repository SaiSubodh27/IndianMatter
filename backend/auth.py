"""Authentication primitives for the IndianMaterialsAI backend.

Role in the system
------------------
Shared by ``backend/routes/auth_routes.py`` (register/login/OAuth callbacks)
and ``backend/routes/user_routes.py`` (protected endpoints via
``Depends(get_current_user)``). Handles password hashing/verification,
HS256 JWT issuance/validation, and the OAuth2 bearer scheme used to extract
the token from the ``Authorization: Bearer <token>`` header.

Inputs  : plaintext passwords, JWT payloads (dict with ``sub`` = email).
Outputs : bcrypt hashes, signed JWT strings, the current user's Mongo document.

Gotchas
-------
- ``SECRET_KEY`` is hardcoded here — must be moved to env for production.
- Token expiry defaults to 15 minutes when no delta is passed, but
  ``auth_routes`` overrides this with 1440 minutes (24 h).
- ``get_current_user`` converts the Mongo ``ObjectId`` to a string so the
  returned dict is JSON-serializable.
"""

import jwt  # PyJWT: encode/decode HS256 tokens
from datetime import datetime, timedelta  # token expiry math
from passlib.context import CryptContext  # bcrypt password hashing
from fastapi import Depends, HTTPException, status  # dependency injection + HTTP errors
from fastapi.security import OAuth2PasswordBearer  # extracts Bearer token from header
from database import users_collection  # Mongo users collection

# Hardcoded signing key — MUST be replaced with an env-backed secret in prod.
SECRET_KEY = "indian-materials-ai-secret-key-change-it-in-prod"
# Signing algorithm used for all issued tokens.
ALGORITHM = "HS256"
# Default lifetime when callers do not pass an explicit delta (24 h).
ACCESS_TOKEN_EXPIRE_MINUTES = 1440  # 24 hours

# bcrypt context; "deprecated=auto" re-hashes legacy schemes on verify.
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
# OAuth2 scheme pointing at the login endpoint for Swagger's "Authorize" button.
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="api/auth/login")


def verify_password(plain_password, hashed_password):
    """Compare a plaintext password against a stored bcrypt hash (constant-time)."""
    return pwd_context.verify(plain_password, hashed_password)


def get_password_hash(password):
    """Hash a plaintext password with bcrypt for storage in Mongo."""
    return pwd_context.hash(password)


def create_access_token(data: dict, expires_delta: timedelta | None = None):
    """Mint an HS256 JWT carrying ``data`` plus an ``exp`` claim.

    Args:
        data: payload dict (typically ``{"sub": email}``).
        expires_delta: optional explicit lifetime; falls back to 15 minutes when
            None (note: auth_routes passes 1440 minutes instead).
    Returns:
        The signed JWT string.
    """
    # Work on a copy so the caller's dict is not mutated.
    to_encode = data.copy()
    # Compute the expiry timestamp.
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=15)
    # Add the standard ``exp`` claim.
    to_encode.update({"exp": expire})
    # Sign with the hardcoded secret + HS256.
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt


async def get_current_user(token: str = Depends(oauth2_scheme)):
    """FastAPI dependency: decode the Bearer token and load the user from Mongo.

    Raises:
        HTTPException 401 if the token is invalid/expired or the user no
        longer exists. On success returns the user document with ``_id``
        cast to a string for JSON serialization.
    """
    # Standard 401 response shape for invalid credentials.
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        # Decode + verify signature and expiry.
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        # The subject claim holds the user's email.
        email: str = payload.get("sub")
        if email is None:
            raise credentials_exception
    except jwt.PyJWTError:
        # Any decode error (bad signature, expired, malformed) -> 401.
        raise credentials_exception

    # Look the user up by email.
    user = users_collection.find_one({"email": email})
    if user is None:
        raise credentials_exception

    # Cast MongoDB ObjectId to string so the dict is JSON-compliant.
    user["_id"] = str(user["_id"])
    return user
