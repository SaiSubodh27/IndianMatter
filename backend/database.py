import os
import logging
from pymongo import MongoClient

log = logging.getLogger("backend.database")

# Read MongoDB URL from environment, defaulting to standard local port
MONGO_URL = os.environ.get("MONGO_URL", "mongodb://localhost:27017/")

try:
    client = MongoClient(MONGO_URL, serverSelectionTimeoutMS=2000)
    db = client["IndianMaterialsAI"]
    users_collection = db["users"]
    predictions_collection = db["material_predictions"]
    MONGO_AVAILABLE = True
    print("[Database] Connected to MongoDB -> IndianMaterialsAI database successfully!")
except Exception as e:
    print(f"[Database] Warning: MongoDB connection failed: {e}")
    client = None
    db = None
    users_collection = None
    predictions_collection = None
    MONGO_AVAILABLE = False
