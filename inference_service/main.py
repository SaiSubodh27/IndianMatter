"""
main.py
=======
Standalone FastAPI Inference Service for IndianMaterialsAI.
Runs on Port 8001.

Responsibilities:
- Lifespan management for ML models (CrystalFormer, IonCast, CHGNet, MACE, M3GNet)
- Internal prediction endpoints (/internal/v1/*)
- CIF generation and structural analysis
- Health and readiness probes
"""

import sys
import os
from pathlib import Path
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import uvicorn

# Setup paths
SERVICE_DIR = Path(__file__).resolve().parent
PROJECT_ROOT = SERVICE_DIR.parent
for p in [PROJECT_ROOT, PROJECT_ROOT / "property_prediction_models", PROJECT_ROOT / "cif_generator", PROJECT_ROOT / "backend"]:
    p_str = str(p)
    if p_str not in sys.path:
        sys.path.insert(0, p_str)

from inference_service.model_manager import model_manager
from inference_service.routers import health, internal_prediction
from inference_service.config import HOST, PORT


@asynccontextmanager
async def lifespan(app: FastAPI):
    print("=" * 65)
    print(" IndianMaterialsAI — Standalone Inference Service (Port 8001)")
    print("=" * 65)
    print("[startup] Initializing scientific model checkpoints & runtime...")
    model_manager.initialize()
    status = model_manager.get_readiness_status()
    print(f"[startup] Hardware device selected: {status['device']}")
    print(f"[startup] Inference service ready: {status['ready']}")
    print("=" * 65)
    yield
    print("[shutdown] Unloading inference resources...")


app = FastAPI(
    title="IndianMaterialsAI Inference Service",
    description="Dedicated Internal AI/ML Inference and CIF Generation Engine",
    version="1.0.0",
    lifespan=lifespan,
)

# CORS Middleware (permits local orchestration and main API)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include Routers
app.include_router(health.router)
app.include_router(internal_prediction.router)


@app.get("/")
def read_root():
    return {
        "service": "IndianMaterialsAI Inference Service",
        "port": PORT,
        "status": "online",
        "documentation": "/docs",
    }


if __name__ == "__main__":
    uvicorn.run("inference_service.main:app", host=HOST, port=PORT, reload=False)
