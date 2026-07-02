import joblib
meta = joblib.load('backend/Surrogative_models/v5_meta_model.pkl')
try:
    print(meta.feature_names_in_)
except Exception as e:
    pass

print(meta.__dict__)
