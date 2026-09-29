import os
from datetime import datetime, timedelta
from fastapi import APIRouter, HTTPException, status, Request
from fastapi.responses import RedirectResponse
from starlette.config import Config
from authlib.integrations.starlette_client import OAuth, OAuthError
from dotenv import load_dotenv

# Ensure environment variables are loaded *before* initializing OAuth,
# because auth_routes.py is imported before main.py executes load_dotenv().
env_path = os.path.join(os.path.dirname(__file__), "..", ".env")
load_dotenv(env_path)

print(f"[startup] auth_routes.py: GOOGLE_CLIENT_ID is {'SET' if os.getenv('GOOGLE_CLIENT_ID') else 'NOT SET'}")
print(f"[startup] auth_routes.py: GOOGLE_CLIENT_SECRET is {'SET' if os.getenv('GOOGLE_CLIENT_SECRET') else 'NOT SET'}")
print(f"[startup] auth_routes.py: GITHUB_CLIENT_ID is {'SET' if os.getenv('GITHUB_CLIENT_ID') else 'NOT SET'}")
print(f"[startup] auth_routes.py: GITHUB_CLIENT_SECRET is {'SET' if os.getenv('GITHUB_CLIENT_SECRET') else 'NOT SET'}")

from auth import (
    verify_password,
    get_password_hash,
    create_access_token,
    ACCESS_TOKEN_EXPIRE_MINUTES,
)
from db_models import UserCreate, UserLogin, GoogleLogin, Token
from database import users_collection

router = APIRouter()

config = Config(environ=os.environ)
oauth = OAuth(config)
oauth.register(
    name='google',
    server_metadata_url='https://accounts.google.com/.well-known/openid-configuration',
    client_kwargs={
        'scope': 'openid email profile'
    }
)
oauth.register(
    name='github',
    client_id=os.getenv("GITHUB_CLIENT_ID"),
    client_secret=os.getenv("GITHUB_CLIENT_SECRET"),
    access_token_url='https://github.com/login/oauth/access_token',
    access_token_params=None,
    authorize_url='https://github.com/login/oauth/authorize',
    authorize_params=None,
    api_base_url='https://api.github.com/',
    client_kwargs={'scope': 'read:user user:email'},
)


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


@router.get("/google/login")
async def google_login(request: Request):
    """Redirects the user to Google's OAuth 2.0 consent screen."""
    redirect_uri = os.getenv("GOOGLE_REDIRECT_URI", "http://localhost:8000/api/auth/google/callback")
    return await oauth.google.authorize_redirect(request, redirect_uri)


@router.get("/google/callback")
async def google_callback(request: Request):
    """Handles the callback from Google, verifies the user, and links accounts."""
    frontend_url = os.getenv("FRONTEND_URL", "http://localhost:5173")
    try:
        token = await oauth.google.authorize_access_token(request)
    except OAuthError as error:
        return RedirectResponse(f"{frontend_url}/signin?error=oauth_error")
        
    user_info = token.get('userinfo')
    if not user_info:
        return RedirectResponse(f"{frontend_url}/signin?error=missing_user_info")
        
    email = user_info.get("email")
    email_verified = user_info.get("email_verified", False)
    name = user_info.get("name")
    google_id = user_info.get("sub")
    
    if not email or not email_verified:
        return RedirectResponse(f"{frontend_url}/signin?error=unverified_email")
        
    user = users_collection.find_one({"email": email})
    now = datetime.utcnow()
    
    if not user:
        user_doc = {
            "email": email,
            "hashed_password": None,
            "name": name,
            "provider": "google",
            "providers": ["google"],
            "google_id": google_id,
            "created_at": now,
            "last_login": now,
            "saved_materials": [],
            "prediction_history": [],
        }
        result = users_collection.insert_one(user_doc)
        user_doc["_id"] = result.inserted_id
        user = user_doc
    else:
        update_fields = {"last_login": now}
        
        providers = user.get("providers", [user.get("provider", "email")])
        if "google" not in providers:
            providers.append("google")
            update_fields["providers"] = providers
            
        if not user.get("google_id"):
            update_fields["google_id"] = google_id
            
        users_collection.update_one(
            {"_id": user["_id"]},
            {"$set": update_fields}
        )
        user["last_login"] = now
        user["providers"] = update_fields.get("providers", providers)
        user["google_id"] = update_fields.get("google_id", google_id)

    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": email}, expires_delta=access_token_expires
    )
    
    # Redirect to frontend with token in fragment
    return RedirectResponse(f"{frontend_url}/signin#token={access_token}")


@router.get("/github/login")
async def github_login(request: Request):
    """Redirects the user to GitHub's OAuth 2.0 consent screen."""
    redirect_uri = os.getenv("GITHUB_REDIRECT_URI", "http://localhost:8000/api/auth/github/callback")
    return await oauth.github.authorize_redirect(request, redirect_uri)


@router.get("/github/callback")
async def github_callback(request: Request):
    """Handles the callback from GitHub, verifies the user, and links accounts."""
    frontend_url = os.getenv("FRONTEND_URL", "http://localhost:5173")
    try:
        token = await oauth.github.authorize_access_token(request)
    except OAuthError as error:
        return RedirectResponse(f"{frontend_url}/signin?error=oauth_error")
        
    resp = await oauth.github.get('user', token=token)
    if resp.status_code != 200:
        return RedirectResponse(f"{frontend_url}/signin?error=github_user_api_failure")
        
    user_info = resp.json()
    github_id = str(user_info.get("id"))
    name = user_info.get("name") or user_info.get("login")
    email = user_info.get("email")
    
    # If email is not in the primary profile response, fetch it from the emails API
    if not email:
        email_resp = await oauth.github.get('user/emails', token=token)
        if email_resp.status_code == 200:
            emails = email_resp.json()
            primary_email = next((e for e in emails if e.get("primary") and e.get("verified")), None)
            if not primary_email:
                primary_email = next((e for e in emails if e.get("verified")), None)
            if primary_email:
                email = primary_email.get("email")
                
    if not email:
        return RedirectResponse(f"{frontend_url}/signin?error=unverified_email")
        
    user = users_collection.find_one({"email": email})
    now = datetime.utcnow()
    
    if not user:
        user_doc = {
            "email": email,
            "hashed_password": None,
            "name": name,
            "provider": "github",
            "providers": ["github"],
            "github_id": github_id,
            "created_at": now,
            "last_login": now,
            "saved_materials": [],
            "prediction_history": [],
        }
        result = users_collection.insert_one(user_doc)
        user_doc["_id"] = result.inserted_id
        user = user_doc
    else:
        update_fields = {"last_login": now}
        
        providers = user.get("providers", [user.get("provider", "email")])
        if "github" not in providers:
            providers.append("github")
            update_fields["providers"] = providers
            
        if not user.get("github_id"):
            update_fields["github_id"] = github_id
            
        users_collection.update_one(
            {"_id": user["_id"]},
            {"$set": update_fields}
        )
        user["last_login"] = now
        user["providers"] = update_fields.get("providers", providers)
        user["github_id"] = update_fields.get("github_id", github_id)

    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": email}, expires_delta=access_token_expires
    )
    
    # Redirect to frontend with token in fragment
    return RedirectResponse(f"{frontend_url}/signin#token={access_token}")