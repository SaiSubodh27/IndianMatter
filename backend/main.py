import os
import sys
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from routes import (
    auth_routes, user_routes, predict_routes, oqmd, aflow, 
    materials_routes, jarvis, database_routes, indianmatter, prediction_pipeline_routes, cif_routes
)
from model_service import load_models

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Load ML models on startup
    load_models()
    mp_key = os.getenv("MP_API_KEY")
    print(f"[startup] MP_API_KEY {'present' if mp_key else 'MISSING — MP endpoints will return 500'}")
    yield

app = FastAPI(
    title="Indian Materials AI Backend",
    description="Authentication, User Management, and Inference Platform",
    lifespan=lifespan
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(materials_routes.router, prefix="/api/materials", tags=["Materials Project"])
app.include_router(oqmd.router, prefix="/api/oqmd", tags=["OQMD"])
app.include_router(aflow.router, prefix="/api/aflow", tags=["AFLOW"])
app.include_router(jarvis.router, prefix="/api/jarvis", tags=["JARVIS"])
app.include_router(database_routes.router, prefix="/api/dataset", tags=["Dataset"])
app.include_router(indianmatter.router, tags=["IndianMatter DB"])
app.include_router(prediction_pipeline_routes.router)
app.include_router(cif_routes.router, prefix="/api/cif", tags=["CIF"])
app.include_router(auth_routes.router, prefix="/api/auth", tags=["Authentication"])
app.include_router(user_routes.router, prefix="/api/users", tags=["Users"])
app.include_router(predict_routes.router, prefix="/api/ml", tags=["Predictions (Trial)"])
app.include_router(predict_routes.router, prefix="/trial", tags=["Trial Mode"])

@app.get("/")
def read_root():
    return {"message": "Welcome to the IndianMaterialsAI Internal API"}
