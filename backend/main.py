import os
import sys
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
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


@asynccontextmanager
async def lifespan(app: FastAPI):
    print("[startup] Loading global ML models...")
    load_models()
    
    mp_key = os.getenv("MP_API_KEY")
    print(f"[startup] MP_API_KEY {'present' if mp_key else 'MISSING — MP endpoints will return 500'}")
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


@app.get("/")
def read_root():
    return {
        "status": "online",
        "message": "Welcome to the IndianMaterialsAI Internal API",
        "documentation": "/docs"
    }
