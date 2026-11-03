import sys
import os
sys.path.insert(0, os.path.abspath('backend'))
from services.materials_db_service import predictions_collection
from database import db

if db is None or predictions_collection is None:
    print("Database not available")
    sys.exit(1)

count = 0
for ob in db["obliex_dataset"].find():
    mid = ob.get("material_id")
    fn = ob.get("filename")
    ch = ob.get("cif_hash")

    # Match specifically by filename or cif_hash to avoid polymorph collision
    filter_q = {
        "$or": [
            {"filename": fn},
            {"cif_hash": ch}
        ]
    }
    update_data = {
        "$set": {
            "material_id": mid,
            "space_group": ob.get("space_group"),
            "crystal_system": ob.get("crystal_system")
        }
    }
    res = predictions_collection.update_many(filter_q, update_data)
    count += res.modified_count

# Special check for 00x
p00x = predictions_collection.find_one({"formula": "LiGd(PO3)4"})
if p00x:
    predictions_collection.update_one({"_id": p00x["_id"]}, {"$set": {"material_id": "00x", "space_group": "C2/c", "crystal_system": "monoclinic"}})

print(f"Successfully linked material_id and space group on {count} prediction documents!")

# Index material_id and formula
predictions_collection.create_index("material_id")
predictions_collection.create_index("formula")
predictions_collection.create_index("reduced_formula")
print("Indexes created successfully!")
