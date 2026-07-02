import joblib
b = joblib.load("backend/Surrogative_models/v5_base_models.pkl")
cols_base = b['lgb'].feature_name_
with open('backend/Surrogative_models/base_cols.pkl', 'wb') as f:
    import pickle
    pickle.dump(cols_base, f)
