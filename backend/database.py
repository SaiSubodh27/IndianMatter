"""MongoDB connection setup for the IndianMaterialsAI backend.

Role in the system
------------------
Single shared connection used by ``backend/auth.py`` (user register/login,
OAuth account linking) and ``backend/routes/user_routes.py`` (profile,
dashboard, mock prediction history, saved materials). It is imported as a
module-level singleton, so the MongoClient is created once at import time.

Inputs  : MONGO_URL (hardcoded to localhost:27017 in this file — override via
          env in production; see the gap notes in the backend artifact).
Outputs : ``client`` (MongoClient), ``db`` (Database "IndianMaterialsAI"),
          ``users_collection`` (Collection "users").

NOTE: there is no connection pooling config or retry logic here; pymongo's
default pool applies. If MongoDB is down at startup, the import still
succeeds and failures surface at request time.
"""

# pymongo's MongoClient; defaults to a local mongod on port 27017.
from pymongo import MongoClient

# Hardcoded connection URL — should be read from env in production.
# Default assumes a locally running MongoDB instance.
MONGO_URL = "mongodb://localhost:27017/"

# Create the client (lazy; no network I/O until a collection is touched).
client = MongoClient(MONGO_URL)
# Select (or implicitly create) the application database.
db = client["IndianMaterialsAI"]
# The only collection used by the auth/user stack.
users_collection = db["users"]

# Startup banner so operators can confirm the DB target at boot.
print("Connected to MongoDB -> IndianMaterialsAI database successfully!")
