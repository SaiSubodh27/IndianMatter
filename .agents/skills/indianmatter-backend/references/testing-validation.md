# Testing & Validation Guide

## Existing Tests

| File | Scope |
|---|---|
| `backend/tests/test_api_routes.py` | API endpoint integration tests |
| `backend/tests/test_dataset_validation.py` | Dataset validation |
| `backend/tests/test_property_calculators.py` | Property calculator unit tests |
| `test_ionic.py` (root) | Ionic conductivity end-to-end |
| `test_thermal.py` (root) | Thermal prediction end-to-end |
| `test_strain.py` (root) | Strain/mechanical tests |
| `test_trial_mode.py` (root) | Trial pipeline integration |
| `verify_mechanical.py` (root) | Mechanical model verification |
| `verify_models.py` (root) | General model verification |

## Test Categories

### Unit Tests

Test individual functions in isolation:

```python
# CIF parsing
def test_parse_valid_cif():
    structure = Structure.from_str(cif_text, fmt="cif")
    assert structure is not None
    assert len(structure) > 0

# Feature extraction
def test_chgnet_feature_vector_length():
    features = extract_mechanical_features(structure)
    assert len(features["feature_vector"]) == 21

# Model loading
def test_model_loads():
    model = joblib.load("pretrained_models/chgnet_logK_model.pkl")
    assert hasattr(model, "predict")

# Feature consistency
def test_feature_order_matches_training():
    features = compute_descriptors(structure)
    assert list(features.columns) == canonical_cols
```

### Integration Tests

Test API endpoints end-to-end:

```python
from fastapi.testclient import TestClient

client = TestClient(app)

def test_analyze_cif():
    with open("test_licl.cif", "rb") as f:
        response = client.post("/api/calculations/analyze-cif", files={"file": f})
    assert response.status_code == 200
    assert response.json()["status"] == "success"

def test_predict_properties():
    with open("test_licl.cif", "rb") as f:
        response = client.post(
            "/api/calculations/predict-properties",
            files={"file": f},
            data={"properties": "bulk_modulus,band_gap"}
        )
    assert response.status_code == 200

def test_invalid_cif_rejected():
    response = client.post(
        "/api/calculations/analyze-cif",
        files={"file": ("test.txt", b"not a cif", "text/plain")}
    )
    assert response.status_code == 400
```

### Regression Tests

Ensure existing functionality is preserved after changes:

```python
def test_mechanical_prediction_reproducible():
    result_1 = predict_mechanical("test_licl.cif")
    result_2 = predict_mechanical("test_licl.cif")
    assert result_1["bulk_modulus"] == result_2["bulk_modulus"]
```

## Scientific Validation vs Software Validation

> [!IMPORTANT]
> A passing test does NOT prove scientific accuracy.

### Software Validation

- ✅ API returns 200
- ✅ Model loads without error
- ✅ Feature vector has correct length
- ✅ Output schema is correct
- ✅ No NaN/Inf in predictions

### Scientific Validation (requires separate analysis)

- Model performance metrics (MAE, RMSE, R²)
- External validation on held-out data
- Comparison with DFT/experimental values
- Distribution shift detection
- Data leakage audit
- Uncertainty calibration

## Model Performance Metrics

When evaluating, calculate:

```python
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score

mae = mean_absolute_error(y_true, y_pred)
rmse = np.sqrt(mean_squared_error(y_true, y_pred))
r2 = r2_score(y_true, y_pred)
mape = np.mean(np.abs((y_true - y_pred) / y_true)) * 100
median_ae = np.median(np.abs(y_true - y_pred))
```

For log-transformed targets, report metrics in both log and original scale.

## Running Tests

```bash
cd backend
python -m pytest tests/ -v

# Root-level integration tests
cd ..
python test_ionic.py
python test_thermal.py
python verify_models.py
```

## Test Data

- `backend/test_licl.cif` — LiCl reference structure for testing
- Any CIF in the project can be used for smoke tests

## Data Leakage Checklist

Before claiming model performance:

- [ ] Verify no train/test structure overlap
- [ ] Verify no train/test composition overlap
- [ ] Verify preprocessing is fit on training data only
- [ ] Verify no target-derived features in input
- [ ] Verify cross-validation uses composition-level splits
- [ ] Verify no information leakage from temporal ordering
