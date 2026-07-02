from fastapi import APIRouter, Depends, HTTPException
from datetime import datetime
from bson.objectid import ObjectId

from auth import get_current_user
from models import PredictionHistory, SavedMaterial, MaterialSaveRequest
from database import users_collection

router = APIRouter()

@router.get("/profile")
def get_profile(current_user: dict = Depends(get_current_user)):
    return {
        "id": current_user["_id"],
        "email": current_user.get("email"),
        "name": current_user.get("name"),
        "provider": current_user.get("provider"),
        "created_at": current_user.get("created_at"),
        "last_login": current_user.get("last_login")
    }

@router.get("/dashboard")
def get_dashboard(current_user: dict = Depends(get_current_user)):
    return {
        "user": {
            "id": current_user["_id"],
            "email": current_user.get("email"),
            "name": current_user.get("name")
        },
        "recent_predictions": current_user.get("prediction_history", [])[-5:], # Fetch the most recent 5 predictions
        "saved_materials": current_user.get("saved_materials", [])
    }

@router.post("/predict")
def make_prediction(material_data: dict, current_user: dict = Depends(get_current_user)):
    """Simulates a prediction and appends it to user's history."""
    material_name = material_data.get("material", "Unknown Material")
    
    # Mocking inference output 
    prediction = PredictionHistory(
        material=material_name,
        Ea=0.46,
        conductivity=1.3e-3,
        timestamp=datetime.utcnow()
    )
    
    users_collection.update_one(
        {"_id": ObjectId(current_user["_id"])},
        {"$push": {"prediction_history": prediction.model_dump()}}
    )
    
    return {"message": "Prediction successful", "prediction": prediction.model_dump()}

@router.post("/save-material")
def save_user_material(save_req: MaterialSaveRequest, current_user: dict = Depends(get_current_user)):
    
    material = SavedMaterial(
        material=save_req.material,
        notes=save_req.notes,
        saved_at=datetime.utcnow()
    )

    users_collection.update_one(
        {"_id": ObjectId(current_user["_id"])},
        {"$push": {"saved_materials": material.model_dump()}}
    )

    return {"message": f"Material '{save_req.material}' saved successfully."}
