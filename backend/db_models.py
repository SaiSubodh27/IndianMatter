from pydantic import BaseModel, EmailStr
from typing import List, Optional
from datetime import datetime


class UserCreate(BaseModel):
    email: EmailStr
    password: str
    name: Optional[str] = None


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class GoogleLogin(BaseModel):
    token: str


class PredictionHistory(BaseModel):
    material: str
    Ea: float
    conductivity: float
    timestamp: datetime


class SavedMaterial(BaseModel):
    material: str
    notes: Optional[str] = None
    saved_at: datetime


class UserInDB(BaseModel):
    email: EmailStr
    hashed_password: Optional[str] = None
    name: Optional[str] = None
    provider: str = "email"
    providers: List[str] = ["email"]
    google_id: Optional[str] = None
    created_at: datetime
    last_login: datetime
    saved_materials: List[SavedMaterial] = []
    prediction_history: List[PredictionHistory] = []


class Token(BaseModel):
    access_token: str
    token_type: str
    user: dict


class MaterialSaveRequest(BaseModel):
    material: str
    notes: Optional[str] = None