import os
import logging
from typing import Dict, Any, List, Optional
from pymongo import MongoClient

log = logging.getLogger("backend.database")

# Read MongoDB URL from environment, defaulting to standard local port
MONGO_URL = os.environ.get("MONGO_URL", "mongodb://localhost:27017/")

try:
    client = MongoClient(MONGO_URL, serverSelectionTimeoutMS=2000)
    db = client["IndianMaterialsAI"]

    # Platform & User Management
    users_collection = db["users"]
    predictions_collection = db["material_predictions"]
    literature_collection = db["literature_papers"]

    # Unified Materials Catalog (Fast multi-database indexed search)
    materials_catalog_collection = db["materials_catalog"]

    # Dedicated Database Stores for external & internal material repositories
    materials_project_collection = db["materials_project"]
    oqmd_collection = db["oqmd"]
    aflow_collection = db["aflow"]
    jarvis_collection = db["jarvis"]
    indianmatter_collection = db["indianmatter"]
    obliex_collection = db["obliex_dataset"]

    MONGO_AVAILABLE = True
    print("[Database] Connected to MongoDB -> IndianMaterialsAI database successfully!")
except Exception as e:
    print(f"[Database] Warning: MongoDB connection failed: {e}")
    client = None
    db = None
    users_collection = None
    predictions_collection = None
    literature_collection = None
    materials_catalog_collection = None
    materials_project_collection = None
    oqmd_collection = None
    aflow_collection = None
    jarvis_collection = None
    indianmatter_collection = None
    obliex_collection = None
    MONGO_AVAILABLE = False


def get_collection(name: str):
    """Retrieve any collection by database or entity name safely."""
    if db is None:
        return None
    return db[name]


def store_materials(database_name: str, materials: List[Dict[str, Any]]) -> int:
    """
    Stores materials from any database (Materials Project, OQMD, AFLOW, JARVIS, IndianMatter, Obliex)
    into MongoDB with persistent indexing:
    1. Into the dedicated collection: db[database_name]
    2. Into the unified searchable index: db['materials_catalog']
    """
    try:
        from materials_catalog_service import upsert_materials
    except ImportError:
        try:
            from backend.materials_catalog_service import upsert_materials
        except ImportError:
            return 0
    return upsert_materials(database_name, materials)


def get_materials_database_stats() -> Dict[str, Any]:
    """Returns the total number of materials currently stored in MongoDB across all databases."""
    if db is None:
        return {"status": "mongodb_unavailable", "counts": {}}

    catalog_counts = {}
    try:
        for doc in db["materials_catalog"].aggregate([
            {"$group": {"_id": "$database", "count": {"$sum": 1}}}
        ]):
            catalog_counts[doc["_id"]] = doc["count"]
    except Exception:
        pass

    return {
        "status": "connected",
        "database": "IndianMaterialsAI",
        "collections": {
            "materials_catalog_total": db["materials_catalog"].count_documents({}) if "materials_catalog" in db.list_collection_names() else 0,
            "materials_project": db["materials_project"].count_documents({}) if "materials_project" in db.list_collection_names() else 0,
            "oqmd": db["oqmd"].count_documents({}) if "oqmd" in db.list_collection_names() else 0,
            "aflow": db["aflow"].count_documents({}) if "aflow" in db.list_collection_names() else 0,
            "jarvis": db["jarvis"].count_documents({}) if "jarvis" in db.list_collection_names() else 0,
            "indianmatter": db["indianmatter"].count_documents({}) if "indianmatter" in db.list_collection_names() else 0,
            "obliex_dataset": db["obliex_dataset"].count_documents({}) if "obliex_dataset" in db.list_collection_names() else 0,
            "material_predictions": db["material_predictions"].count_documents({}) if "material_predictions" in db.list_collection_names() else 0,
            "literature_papers": db["literature_papers"].count_documents({}) if "literature_papers" in db.list_collection_names() else 0,
        },
        "by_catalog_source": catalog_counts
    }
