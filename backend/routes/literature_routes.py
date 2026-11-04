import os
import json
import logging
import urllib.request
from typing import List, Dict, Any, Optional
from fastapi import APIRouter, HTTPException
from pymongo import UpdateOne

try:
    from database import db, MONGO_AVAILABLE
except ImportError:
    from backend.database import db, MONGO_AVAILABLE

logger = logging.getLogger("backend.literature")

router = APIRouter()

DEFAULT_SUPABASE_URL = "https://oyqjwtkaivigwwgiqxco.supabase.co"
DEFAULT_SUPABASE_ANON_KEY = (
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9."
    "eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im95cWp3dGthaXZpZ3d3Z2lxeGNvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTE0MzE0NDQsImV4cCI6MjEwNzAwNzQ0NH0."
    "w8ocUueTKZdTNoMy93_kztACxlCDvFSIBCbroX-LfyA"
)

SUPABASE_URL = os.getenv("VITE_SUPABASE_URL", DEFAULT_SUPABASE_URL)
SUPABASE_KEY = os.getenv("VITE_SUPABASE_ANON_KEY", DEFAULT_SUPABASE_ANON_KEY)


def _init_indexes():
    if db is not None:
        try:
            coll = db["literature_papers"]
            coll.create_index("id", unique=True)
            coll.create_index("publication_date")
        except Exception as e:
            logger.warning(f"Error creating indexes on literature_papers: {e}")


_init_indexes()


def fetch_from_supabase(timeout: int = 5) -> List[Dict[str, Any]]:
    """Fetch published literature papers directly from Supabase REST endpoint."""
    url = f"{SUPABASE_URL}/rest/v1/papers?select=*&order=publication_date.desc"
    headers = {
        "apikey": SUPABASE_KEY,
        "Authorization": f"Bearer {SUPABASE_KEY}",
        "Content-Type": "application/json",
    }
    req = urllib.request.Request(url, headers=headers)
    with urllib.request.urlopen(req, timeout=timeout) as resp:
        if resp.status == 200:
            return json.loads(resp.read().decode("utf-8"))
    return []


def upsert_to_mongo(papers: List[Dict[str, Any]]) -> int:
    """Cache papers into MongoDB literature_papers collection."""
    if not papers or db is None:
        return 0
    coll = db["literature_papers"]
    ops = []
    for p in papers:
        pid = p.get("id")
        if pid is not None:
            doc = {k: v for k, v in p.items() if k != "_id"}
            ops.append(UpdateOne({"id": pid}, {"$set": doc}, upsert=True))
    if ops:
        res = coll.bulk_write(ops, ordered=False)
        return (res.upserted_count or 0) + (res.modified_count or 0)
    return 0


def get_papers_from_mongo() -> List[Dict[str, Any]]:
    """Retrieve papers from MongoDB cache."""
    if db is None:
        return []
    coll = db["literature_papers"]
    cursor = coll.find({}, {"_id": 0}).sort("publication_date", -1)
    return list(cursor)


@router.get("/papers")
def list_published_papers():
    """
    Returns published research papers.
    Attempts live fetch from Supabase with auto-cache to MongoDB;
    falls back cleanly to MongoDB cache if Supabase is unreachable.
    """
    papers = []
    source = "supabase"
    
    try:
        papers = fetch_from_supabase(timeout=4)
        if papers and db is not None:
            try:
                upsert_to_mongo(papers)
            except Exception as e:
                logger.warning(f"MongoDB caching failed: {e}")
    except Exception as e:
        logger.info(f"Supabase fetch failed ({e}); falling back to MongoDB cache.")
        source = "mongodb_cache"
        papers = get_papers_from_mongo()

    # If both failed or empty, fallback to cached mongo
    if not papers:
        papers = get_papers_from_mongo()
        source = "mongodb_cache"

    return {
        "success": True,
        "source": source,
        "count": len(papers),
        "data": papers,
    }


@router.post("/sync")
def sync_published_papers():
    """Force re-synchronization of research papers from Supabase to MongoDB."""
    try:
        papers = fetch_from_supabase(timeout=10)
        upserted = upsert_to_mongo(papers)
        return {
            "success": True,
            "message": f"Successfully synced {len(papers)} papers ({upserted} records updated) to MongoDB.",
            "count": len(papers),
        }
    except Exception as e:
        raise HTTPException(status_code=502, detail=f"Failed to sync from Supabase: {str(e)}")

