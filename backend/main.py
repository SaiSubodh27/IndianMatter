from pathlib import Path
import os
import sys
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from starlette.middleware.sessions import SessionMiddleware
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

# Ensure backend is in sys.path
BACKEND_DIR = Path(__file__).resolve().parent
PROJECT_ROOT = BACKEND_DIR.parent

for p in [PROJECT_ROOT, BACKEND_DIR]:
    p_str = str(p)
    if p_str not in sys.path:
        sys.path.insert(0, p_str)

from api.calculator_router import router as calculator_router

from routes import (
    auth_routes,
    user_routes,
    oqmd,
    aflow,
    jarvis,
    database_routes,
    indianmatter,
    cif_routes,
    materials_routes,
    transport_router,
    literature_routes,
    lithium_routes,
)
from core.inference_client import inference_client


@asynccontextmanager
async def lifespan(app: FastAPI):
    print("=" * 65)
    print(" IndianMaterialsAI — Main API Gateway (Port 8000)")
    print("=" * 65)

    # Check connection to Standalone Inference Service
    try:
        probe = inference_client.check_health_sync()
        status_label = probe.get("status", "unknown")
        print(f"[startup] Inference API probe ({inference_client.base_url}): {status_label}")
    except Exception as inf_err:
        print(f"[startup] Inference API probe warning: {inf_err}")

    mp_key = os.getenv("MP_API_KEY")
    print(f"[startup] MP_API_KEY {'present' if mp_key else 'MISSING — MP endpoints will return 500'}")

    google_id = os.getenv("GOOGLE_CLIENT_ID")
    google_secret = os.getenv("GOOGLE_CLIENT_SECRET")
    if not google_id or not google_secret:
        print("[startup] Notice: GOOGLE_CLIENT_ID / SECRET not configured.")

    github_id = os.getenv("GITHUB_CLIENT_ID")
    github_secret = os.getenv("GITHUB_CLIENT_SECRET")
    if not github_id or not github_secret:
        print("[startup] Notice: GITHUB_CLIENT_ID / SECRET not configured.")

    print("=" * 65)
    yield
    print("[shutdown] Main API shutting down...")


app = FastAPI(
    title="Indian Materials AI — Main API",
    description="Authentication, User Management, Database Catalog, and Gateway API",
    lifespan=lifespan,
)

# CORS Middleware Setup
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Session Middleware for OAuth state
session_secret = os.getenv("SESSION_SECRET", "fallback-secret-change-me")
app.add_middleware(
    SessionMiddleware,
    secret_key=session_secret,
)

# Core & Authentication Routes
app.include_router(auth_routes.router, prefix="/api/auth", tags=["Auth"])
app.include_router(user_routes.router, prefix="/api/users", tags=["Users"])

# Prediction & Inference Pipeline Routes
app.include_router(cif_routes.router, prefix="/api/cif", tags=["CIF Generator & Analyzer"])
app.include_router(cif_routes.cif_api_router)  # Mounted at /cif for complete frontend compatibility

# External Databases & Internal Datasets
app.include_router(materials_routes.router, prefix="/api/materials", tags=["Materials Project"])
app.include_router(oqmd.router, prefix="/api/oqmd", tags=["OQMD"])
app.include_router(aflow.router, prefix="/api/aflow", tags=["AFLOW"])
app.include_router(jarvis.router, prefix="/api/jarvis", tags=["JARVIS"])
app.include_router(database_routes.router, prefix="/api/dataset", tags=["Dataset"])
app.include_router(indianmatter.router, prefix="/api/indianmatter", tags=["IndianMatter DB"])
app.include_router(literature_routes.router, prefix="/api/literature", tags=["Literature"])
app.include_router(lithium_routes.router, prefix="/api/lithium", tags=["Lithium & Battery Materials"])

# Calculations & Property Prediction Routers
app.include_router(calculator_router)
app.include_router(transport_router.router, prefix="/api/calculations")


@app.get("/")
def read_root():
    return {
        "status": "online",
        "service": "IndianMaterialsAI Main API",
        "port": 8000,
        "inference_service_url": inference_client.base_url,
        "documentation": "/docs",
    }


@app.get("/health")
def health():
    return {
        "status": "healthy",
        "service": "IndianMaterialsAI Main API",
        "port": 8000,
        "version": "1.0.0",
    }
