import os

from model_service import load_models, extract_features, predict_from_cif


def test_feature_alignment_matches_model_contract():
    load_models()
    cif_path = os.path.join("cif_files", "mp-1001069.cif")
    df, _ = extract_features(cif_path)

    # Import lazily to avoid namespace pollution during fixture setup.
    from model_service import expected_cols_base

    assert expected_cols_base is not None
    missing = [col for col in expected_cols_base if col not in df.columns]
    assert not missing, f"Missing base features: {missing[:10]}"


def test_prediction_response_includes_structured_trial_fields():
    result = predict_from_cif(os.path.join("cif_files", "mp-1001069.cif"), temperature=298.0)

    assert result["status"] == "success", result
    assert "features" in result
    assert isinstance(result["features"], list) and result["features"]
    assert "prediction" in result
    assert isinstance(result["prediction"], dict)
    assert "value" in result["prediction"]
    assert "unit" in result["prediction"]
    assert "Ea" in result and "conductivity" in result
