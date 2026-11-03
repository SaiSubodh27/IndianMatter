"""User-facing endpoints under ``/api/users``.

Role in the system
------------------
Mounted in main.py at ``/api/users``. All endpoints here are protected by
``Depends(get_current_user)`` (HS256 JWT bearer). They read/write the Mongo
``users`` collection (profile, dashboard summary, mock prediction history,
saved materials).

Endpoints
---------
GET  /api/users/profile       — public profile fields (no password hash)
GET  /api/users/dashboard     — profile + last 5 predictions + saved materials
POST /api/users/predict       — MOCK prediction (Ea=0.46, σ=1.3e-3) pushed into
                                the user's prediction_history (NOT a real model)
POST /api/users/save-material  — push a SavedMaterial into saved_materials

Gotcha: /predict is a placeholder that returns fixed numbers; the real ionic-
conductivity prediction lives in /api/calculations/ionic-conductivity (IonCast).
"""

from fastapi import APIRouter, Depends, HTTPException  # router + dependency injection + errors
from datetime import datetime  # timestamps for history/saved entries
from bson.objectid import ObjectId  # convert the stored string _id back to Mongo ObjectId for updates

from auth import get_current_user  # JWT bearer dependency -> user document
from db_models import PredictionHistory, SavedMaterial, MaterialSaveRequest  # pydantic shapes
from database import users_collection  # Mongo users collection

# Router instance; main.py mounts it at /api/users.
router = APIRouter()


@router.get("/profile")
def get_profile(current_user: dict = Depends(get_current_user)):
    """Return the authenticated user's public profile (no password hash)."""
    return {
        "id": current_user["_id"],  # already cast to str by get_current_user
        "email": current_user.get("email"),
        "name": current_user.get("name"),
        "provider": current_user.get("provider"),  # primary provider (email/google/github)
        "providers": current_user.get("providers", [current_user.get("provider")]),  # all linked providers
        "github_id": current_user.get("github_id"),  # None unless GitHub linked
        "created_at": current_user.get("created_at"),
        "last_login": current_user.get("last_login"),
    }


@router.get("/dashboard")
def get_dashboard(current_user: dict = Depends(get_current_user)):
    """Return profile + the 5 most recent predictions + all saved materials."""
    return {
        "user": {
            "id": current_user["_id"],
            "email": current_user.get("email"),
            "name": current_user.get("name"),
        },
        "recent_predictions": current_user.get("prediction_history", [])[-5:],  # last 5 entries
        "saved_materials": current_user.get("saved_materials", []),
    }


@router.post("/predict")
def make_prediction(material_data: dict, current_user: dict = Depends(get_current_user)):
    """MOCK prediction endpoint: records a fixed Ea=0.46 / σ=1.3e-3 entry.

    This is NOT a real model call — it exists to exercise the prediction-history
    flow. The real ionic-conductivity prediction is served by
    /api/calculations/ionic-conductivity (IonCast v5/v6).
    """
    material_name = material_data.get("material", "Unknown Material")

    # Mocked inference output (fixed values; not from any model).
    prediction = PredictionHistory(
        material=material_name,
        Ea=0.46,  # eV (mock)
        conductivity=1.3e-3,  # S/cm (mock)
        timestamp=datetime.utcnow(),
    )

    # Append the mock prediction to the user's history in Mongo.
    users_collection.update_one(
        {"_id": ObjectId(current_user["_id"])},  # str -> ObjectId for the query
        {"$push": {"prediction_history": prediction.model_dump()}},
    )

    return {"message": "Prediction successful", "prediction": prediction.model_dump()}


@router.post("/save-material")
def save_user_material(save_req: MaterialSaveRequest, current_user: dict = Depends(get_current_user)):
    """Push a SavedMaterial entry into the user's saved_materials list."""
    # Build the saved-material document with a server-side timestamp.
    material = SavedMaterial(
        material=save_req.material,
        notes=save_req.notes,
        saved_at=datetime.utcnow(),
    )

    # Append to the user's saved_materials array in Mongo.
    users_collection.update_one(
        {"_id": ObjectId(current_user["_id"])},
        {"$push": {"saved_materials": material.model_dump()}},
    )

    return {"message": f"Material '{save_req.material}' saved successfully."}
