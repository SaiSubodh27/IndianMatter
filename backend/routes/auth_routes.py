from datetime import datetime, timedelta
from fastapi import APIRouter, HTTPException, status

from auth import (
    verify_password,
    get_password_hash,
    create_access_token,
    ACCESS_TOKEN_EXPIRE_MINUTES,
)
from db_models import UserCreate, UserLogin, GoogleLogin, Token
from database import users_collection

router = APIRouter()


def _user_public_dict(user: dict) -> dict:
    """Strip sensitive fields before returning a user object to the client."""
    return {
        "id": str(user.get("_id")),
        "email": user.get("email"),
        "name": user.get("name"),
        "provider": user.get("provider", "email"),
        "created_at": user.get("created_at"),
        "last_login": user.get("last_login"),
    }


@router.post("/register", response_model=Token)
def register(payload: UserCreate):
    existing = users_collection.find_one({"email": payload.email})
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="An account with this email already exists."
        )

    now = datetime.utcnow()
    user_doc = {
        "email": payload.email,
        "hashed_password": get_password_hash(payload.password),
        "name": payload.name,
        "provider": "email",
        "created_at": now,
        "last_login": now,
        "saved_materials": [],
        "prediction_history": [],
    }
    result = users_collection.insert_one(user_doc)
    user_doc["_id"] = result.inserted_id

    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": payload.email}, expires_delta=access_token_expires
    )

    return Token(
        access_token=access_token,
        token_type="bearer",
        user=_user_public_dict(user_doc),
    )


@router.post("/login", response_model=Token)
def login(payload: UserLogin):
    user = users_collection.find_one({"email": payload.email})
    if not user or not user.get("hashed_password"):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password.",
        )

    if not verify_password(payload.password, user["hashed_password"]):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password.",
        )

    users_collection.update_one(
        {"_id": user["_id"]},
        {"$set": {"last_login": datetime.utcnow()}}
    )
    user["last_login"] = datetime.utcnow()

    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": payload.email}, expires_delta=access_token_expires
    )

    return Token(
        access_token=access_token,
        token_type="bearer",
        user=_user_public_dict(user),
    )


@router.post("/google-login", response_model=Token)
def google_login(payload: GoogleLogin):
    """
    Verifies a Google ID token and logs in / auto-registers the user.
    Requires the `google-auth` package and a GOOGLE_CLIENT_ID configured.
    """
    try:
        from google.oauth2 import id_token
        from google.auth.transport import requests as google_requests
        from core.config import settings

        idinfo = id_token.verify_oauth2_token(
            payload.token, google_requests.Request(), settings.GOOGLE_CLIENT_ID
        )
        email = idinfo.get("email")
        name = idinfo.get("name")
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=f"Invalid Google token: {str(e)}",
        )

    if not email:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Google token did not contain an email address.",
        )

    user = users_collection.find_one({"email": email})
    now = datetime.utcnow()

    if not user:
        user_doc = {
            "email": email,
            "hashed_password": None,
            "name": name,
            "provider": "google",
            "created_at": now,
            "last_login": now,
            "saved_materials": [],
            "prediction_history": [],
        }
        result = users_collection.insert_one(user_doc)
        user_doc["_id"] = result.inserted_id
        user = user_doc
    else:
        users_collection.update_one(
            {"_id": user["_id"]},
            {"$set": {"last_login": now}}
        )
        user["last_login"] = now

    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": email}, expires_delta=access_token_expires
    )

    return Token(
        access_token=access_token,
        token_type="bearer",
        user=_user_public_dict(user),
    )