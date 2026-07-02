import joblib
import pandas as pd
import numpy as np

# Load
base_models = joblib.load('backend/Surrogative_models/v5_base_models.pkl')
meta_model = joblib.load('backend/Surrogative_models/v5_meta_model.pkl')
mlp_models = joblib.load('backend/Surrogative_models/v5_mlp_models.pkl')

print("Loaded tools.")
print("Meta:", meta_model)

try:
    print(meta_model.coef_)
except:
    pass

