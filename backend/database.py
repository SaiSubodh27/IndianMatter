from pymongo import MongoClient

# In a real environment, you would use an environment variable for connection URL
MONGO_URL = "mongodb://localhost:27017/"

client = MongoClient(MONGO_URL)
db = client["IndianMaterialsAI"]
users_collection = db["users"]

print("Connected to MongoDB -> IndianMaterialsAI database successfully!")
