"""Pydantic request/response models for the auth + user stack.

Role in the system
------------------
Shared by ``backend/routes/auth_routes.py`` (register/login/OAuth callbacks)
and ``backend/routes/user_routes.py`` (profile, dashboard, mock predict,
save-material). Defining them here keeps the API contract in one place.

Models
------
UserCreate           — register body (email + password + optional name)
UserLogin            — login body (email + password)
GoogleLogin          — (legacy) body carrying a Google token string
PredictionHistory    — one entry pushed into a user's prediction_history
                       (material, Ea, conductivity, timestamp)
SavedMaterial        — one entry pushed into saved_materials (material, notes, saved_at)
UserInDB             — full Mongo user document shape (password hash optional,
                       provider tracking, OAuth ids, history/materials lists)
Token                — login response (access_token + token_type + user dict)
MaterialSaveRequest  — body for POST /api/users/save-material
"""

from pydantic import BaseModel, EmailStr  # validated request/response shapes
from typing import List, Optional  # container + optional-field typing
from datetime import datetime  # timestamps stored on history/saved entries


class UserCreate(BaseModel):
    email: EmailStr  # validated email address
    password: str  # plaintext on the wire; hashed with bcrypt before storage
    name: Optional[str] = None  # display name, optional


class UserLogin(BaseModel):
    email: EmailStr  # account lookup key
    password: str  # verified against the stored bcrypt hash


class GoogleLogin(BaseModel):
    # Legacy body shape for a Google-token-based login (not currently used by
    # the OAuth redirect flow, which goes through /api/auth/google/callback).
    token: str


class PredictionHistory(BaseModel):
    material: str  # free-text material label
    Ea: float  # activation energy (eV) — from the (mock) prediction
    conductivity: float  # ionic conductivity (S/cm) — from the (mock) prediction
    timestamp: datetime  # when the prediction was recorded


class SavedMaterial(BaseModel):
    material: str  # free-text material label
    notes: Optional[str] = None  # user notes
    saved_at: datetime  # when it was saved


class UserInDB(BaseModel):
    email: EmailStr  # account lookup key
    hashed_password: Optional[str] = None  # bcrypt hash; None for OAuth-only users
    name: Optional[str] = None  # display name
    provider: str = "email"  # primary provider ("email" / "google" / "github")
    providers: List[str] = ["email"]  # all linked providers
    google_id: Optional[str] = None  # Google "sub" id when linked
    github_id: Optional[str] = None  # GitHub user id when linked
    created_at: datetime  # account creation timestamp
    last_login: datetime  # updated on every successful login
    saved_materials: List[SavedMaterial] = []  # user's saved materials
    prediction_history: List[PredictionHistory] = []  # user's prediction log


class Token(BaseModel):
    access_token: str  # HS256 JWT issued by auth.create_access_token
    token_type: str  # always "bearer"
    user: dict  # public user dict (no password hash)


class MaterialSaveRequest(BaseModel):
    material: str  # free-text material label to save
    notes: Optional[str] = None  # optional user notes
