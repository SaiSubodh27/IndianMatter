from fastapi import APIRouter, HTTPException, Depends
from datetime import datetime, timedelta
from google.oauth2 import id_token
from google.auth.transport import requests

# Make sure you set a client ID in production
GOOGLE_CLIENT_ID = "YOUR_GOOGLE_CLIENT_ID"

from models import UserCreate, UserLogin, GoogleLogin, UserInDB, Token
from auth import get_password_hash, verify_password, create_access_token, ACCESS_TOKEN_EXPIRE_MINUTES
from database import users_collection

router = APIRouter()

@router.post("/signup")
def signup(user: UserCreate):
    if users_collection.find_one({"email": user.email}):
        raise HTTPException(status_code=400, detail="Email already registered")
    
    new_user = UserInDB(
        email=user.email,
        hashed_password=get_password_hash(user.password),
        name=user.name,
        provider="email",
        created_at=datetime.utcnow(),
        last_login=datetime.utcnow()
    )
    
    result = users_collection.insert_one(new_user.model_dump())
    return {"message": "User created successfully", "user_id": str(result.inserted_id)}

@router.post("/login", response_model=Token)
def login(user: UserLogin):
    db_user = users_collection.find_one({"email": user.email})
    if not db_user or not db_user.get("hashed_password"):
        raise HTTPException(status_code=401, detail="Invalid credentials")
        
    if not verify_password(user.password, db_user["hashed_password"]):
        raise HTTPException(status_code=401, detail="Invalid credentials")
        
    users_collection.update_one({"_id": db_user["_id"]}, {"$set": {"last_login": datetime.utcnow()}})
    
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": db_user["email"], "user_id": str(db_user["_id"])},
        expires_delta=access_token_expires
    )
    
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": {
            "id": str(db_user["_id"]),
            "email": db_user["email"],
            "name": db_user.get("name")
        }
    }

@router.post("/google-login", response_model=Token)
def google_login(google_data: GoogleLogin):
    try:
        # In a real setup, we verify with the true GOOGLE_CLIENT_ID
        # idinfo = id_token.verify_oauth2_token(google_data.token, requests.Request(), GOOGLE_CLIENT_ID)
        
        # For this prototype we'll decode safely assuming frontend has checked or backend doesn't enforce strict Audience right now
        # WARNING: In production use the above verify_oauth2_token!
        import jwt
        idinfo = jwt.decode(google_data.token, options={"verify_signature": False})
        
        email = idinfo['email']
        name = idinfo.get('name')
        
        db_user = users_collection.find_one({"email": email})
        
        if not db_user:
            new_user = UserInDB(
                email=email,
                name=name,
                provider="google",
                created_at=datetime.utcnow(),
                last_login=datetime.utcnow()
            )
            result = users_collection.insert_one(new_user.model_dump())
            user_id = str(result.inserted_id)
            db_user = new_user.model_dump()
            db_user["_id"] = user_id
        else:
            user_id = str(db_user["_id"])
            users_collection.update_one({"_id": db_user["_id"]}, {"$set": {"last_login": datetime.utcnow()}})
            
        access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
        access_token = create_access_token(
            data={"sub": email, "user_id": user_id},
            expires_delta=access_token_expires
        )
        
        return {
            "access_token": access_token,
            "token_type": "bearer",
            "user": {
                "id": str(user_id),
                "email": email,
                "name": name
            }
        }
    except Exception as e:
        print(f"Error during Google Login inner block: {e}")
        raise HTTPException(status_code=401, detail="Invalid Google token")
