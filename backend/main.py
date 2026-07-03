from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from routes import auth_routes, user_routes, predict_routes
from model_service import load_models

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Load ML models on startup
    load_models()
    yield
    # Cleanup code goes here if needed

# Initialize FastAPI app
app = FastAPI(title="Indian Materials AI Backend", description="Authentication, User Management, and Inference Platform", lifespan=lifespan)

# Enable CORS so your React frontend can communicate with this backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with your frontend URL, e.g., ["http://localhost:5173"]
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_routes.router, prefix="/api/auth", tags=["Authentication"])
app.include_router(user_routes.router, prefix="/api/users", tags=["Users"])
app.include_router(predict_routes.router, prefix="/api/ml", tags=["Predictions (Trial)"])
app.include_router(predict_routes.router, prefix="/trial", tags=["Trial Mode"])

@app.get("/")
def read_root():
    return {"message": "Welcome to the IndianMaterialsAI Internal API"}
