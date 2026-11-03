"""Entry point for the IndianMaterialsAI FastAPI backend.

Role in the system
------------------
This module constructs the top-level FastAPI app, wires every router under
its prefix, applies CORS + session middleware, runs the ML-model load in the
lifespan hook, and mounts the CIF Generator sub-app at /cif. Run with
``uvicorn main:app`` from inside ``backend/`` (default port 8000).

Wiring (see the router block below):
  /api/auth           — auth_routes (register/login/OAuth)
  /api/users          — user_routes (profile/dashboard/mock predict/save)
  /api/cif            — cif_routes (CIF parsing)
  /api/materials      — materials_routes (Materials Project explore)
  /api/oqmd           — oqmd
  /api/aflow          — aflow
  /api/jarvis         — jarvis
  /api/dataset        — database_routes (local CSV search)
  /api/indianmatter   — indianmatter (local CSV explore + CIF download)
  /api/calculations   — calculator_router + transport_router (property prediction)
  /cif (mounted sub-app) — webapp (CIF generation pipeline)

Inputs  : environment variables from backend/.env (MP_API_KEY, GOOGLE_*,
          GITHUB_*, SESSION_SECRET, FRONTEND_URL, MACE_*, CRYSTALLM_*).
Outputs : the running FastAPI application object ``app``.

Gotchas
-------
- The CIF sub-app import is wrapped in try/except so heavy ML import failures
  do NOT take down the main API.
- The ASE ExpCellFilter shim (below) MUST run before any optimizer code.
- Auth/user routers are the only ones depending on MongoDB at request time.
"""

import os  # env vars + path helpers
import sys  # sys.path manipulation so backend/ is importable
from contextlib import asynccontextmanager  # lifespan hook (startup/shutdown)
from fastapi import FastAPI  # app factory
from fastapi.middleware.cors import CORSMiddleware  # cross-origin requests from the React dev server
from starlette.middleware.sessions import SessionMiddleware  # OAuth state storage
from dotenv import load_dotenv  # load backend/.env into os.environ

# Load environment variables from backend/.env before anything else reads them.
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
