import os
import sys
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from starlette.middleware.sessions import SessionMiddleware
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

# Compatibility shim for newer ASE versions where ExpCellFilter moved to ase.filters
try:
    import ase.filters
    import ase.constraints
    if not hasattr(ase.constraints, "ExpCellFilter") and hasattr(ase.filters, "ExpCellFilter"):
        ase.constraints.ExpCellFilter = ase.filters.ExpCellFilter
except Exception:
    pass

from api.calculator_router import router as calculator_router

# Ensure the backend directory is in the system path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

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
)
from model_service import load_models

# CIF Generator pipeline (integrated from the CIF-generator project).
# Exposes POST /cif/api/generate, /cif/api/doped-cif, /cif/api/parse-formula, ...
# and serves its web UI at /cif/.
try:
    from webapp import app as cif_generator_app
    _CIF_APP_AVAILABLE = True
except Exception as _cif_import_error:  # keep main API up even if heavy ML deps are missing
    cif_generator_app = None
    _CIF_APP_AVAILABLE = False
    print(f"[startup] CIF generator disabled: {_cif_import_error}")


@asynccontextmanager
async def lifespan(app: FastAPI):
    print("[startup] Loading global ML models...")
    load_models()
    
    mp_key = os.getenv("MP_API_KEY")
    print(f"[startup] MP_API_KEY {'present' if mp_key else 'MISSING — MP endpoints will return 500'}")
    
    google_id = os.getenv("GOOGLE_CLIENT_ID")
    google_secret = os.getenv("GOOGLE_CLIENT_SECRET")
    if not google_id or not google_secret:
        print("\n" + "="*60)
        print("ERROR: GOOGLE_CLIENT_ID or GOOGLE_CLIENT_SECRET is missing or empty!")
        print("Please fill them in the backend/.env file to enable Google Sign-In.")
        print("="*60 + "\n")
        
    github_id = os.getenv("GITHUB_CLIENT_ID")
    github_secret = os.getenv("GITHUB_CLIENT_SECRET")
    if not github_id or not github_secret:
        print("\n" + "="*60)
        print("ERROR: GITHUB_CLIENT_ID or GITHUB_CLIENT_SECRET is missing or empty!")
        print("Please fill them in the backend/.env file to enable GitHub Sign-In.")
        print("="*60 + "\n")

    yield
    print("[shutdown] Cleaning up resources...")


app = FastAPI(
    title="Indian Materials AI Backend",
    description="Authentication, User Management, and Property Prediction Platform",
    lifespan=lifespan
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
    secret_key=session_secret
)

# Core & Authentication Routes
app.include_router(auth_routes.router, prefix="/api/auth", tags=["Auth"])
app.include_router(user_routes.router, prefix="/api/users", tags=["Users"])

# Prediction & Inference Pipeline Routes
app.include_router(cif_routes.router, prefix="/api/cif", tags=["CIF Generator & Analyzer"])

# External Databases & Internal Datasets
app.include_router(materials_routes.router, prefix="/api/materials", tags=["Materials Project"])
app.include_router(oqmd.router, prefix="/api/oqmd", tags=["OQMD"])
app.include_router(aflow.router, prefix="/api/aflow", tags=["AFLOW"])
app.include_router(jarvis.router, prefix="/api/jarvis", tags=["JARVIS"])
app.include_router(database_routes.router, prefix="/api/dataset", tags=["Dataset"])
app.include_router(indianmatter.router, prefix="/api/indianmatter", tags=["IndianMatter DB"])

# ---------------------------------------------------------
# CALCULATIONS ROUTER
# ---------------------------------------------------------
app.include_router(calculator_router)
app.include_router(transport_router.router, prefix="/api/calculations")

# Mount the integrated CIF generator app (UI at /cif/, API at /cif/api/...)
if _CIF_APP_AVAILABLE:
    app.mount("/cif", cif_generator_app)


@app.get("/")
def read_root():
    return {
        "status": "online",
        "message": "Welcome to the IndianMaterialsAI Internal API",
        "documentation": "/docs"
    }
