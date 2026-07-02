from backend.model_service import load_models, predict_from_cif
load_models()
res1 = predict_from_cif("backend/test_mat.cif", 298.15)
print(res1)
