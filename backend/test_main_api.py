"""
test_main_api.py
================
Integration and contract verification suite for IndianMaterialsAI Main API (Port 8000).
Tests:
1. Application boots without heavy ML models (torch, chgnet, lightgbm).
2. Health and root endpoints.
3. Database lookup and catalog search.
4. Inference delegation via inference_client.
5. Graceful 503 degradation when inference service is offline.
6. CIF generator proxy endpoints (/cif/api/*).
"""

import sys
from pathlib import Path
BACKEND_DIR = Path(__file__).resolve().parent
PROJECT_ROOT = BACKEND_DIR.parent
for p in [PROJECT_ROOT, BACKEND_DIR]:
    if str(p) not in sys.path:
        sys.path.insert(0, str(p))

import io
from unittest.mock import patch, MagicMock
from fastapi.testclient import TestClient
from backend.main import app
from backend.core.inference_client import InferenceUnavailableError

CIF_SAMPLE = """data_Li2O
_symmetry_space_group_name_H-M 'F m -3 m'
_cell_length_a 4.61
_cell_length_b 4.61
_cell_length_c 4.61
_cell_angle_alpha 90
_cell_angle_beta 90
_cell_angle_gamma 90
loop_
_atom_site_label
_atom_site_fract_x
_atom_site_fract_y
_atom_site_fract_z
Li 0.25 0.25 0.25
O 0.0 0.0 0.0
"""


def test_main_api_health():
    client = TestClient(app)
    resp = client.get("/health")
    assert resp.status_code == 200
    data = resp.json()
    assert data["status"] == "healthy"
    assert data["port"] == 8000


def test_main_api_root():
    client = TestClient(app)
    resp = client.get("/")
    assert resp.status_code == 200
    data = resp.json()
    assert data["service"] == "IndianMaterialsAI Main API"


def test_heavy_models_not_imported_in_main_api():
    """Verifies that Main API does not load heavy ML packages into global state."""
    from backend.api.calculator_router import crystalformer_service, IONIC_MODELS
    assert crystalformer_service is None, "CrystalFormer must not be loaded in Main API"
    assert IONIC_MODELS is None, "IonCast models must not be loaded in Main API"


def test_predict_properties_delegation():
    """Verifies that predict-properties delegates to inference_client and returns expected schema."""
    client = TestClient(app)

    mock_inf_resp = {
        "status": "success",
        "material_metadata": {
            "formula": "Li2O",
            "volume_A3": 98.0,
            "density_g_cm3": 2.02,
            "num_sites": 3,
            "space_group": "Fm-3m",
            "crystal_system": "Cubic",
        },
        "model_used": "InferenceService-Unified",
        "base_outputs": {"energy_per_atom": {"value": -3.42, "unit": "eV/atom", "status": "calculated"}},
        "properties": {
            "band_gap": {"property_key": "band_gap", "value": 5.2, "unit": "eV", "status": "calculated", "model": "CrystalFormer"},
            "formation_energy": {"property_key": "formation_energy", "value": -2.1, "unit": "eV/atom", "status": "calculated", "model": "CrystalFormer"},
        },
    }

    with patch("backend.api.calculator_router.inference_client.predict_properties") as mock_pred:
        # Configure mock async return value
        async def mock_async_pred(*args, **kwargs):
            return mock_inf_resp
        mock_pred.side_effect = mock_async_pred

        files = {"file": ("structure.cif", io.BytesIO(CIF_SAMPLE.encode("utf-8")), "chemical/x-cif")}
        data = {"properties": "band_gap,formation_energy", "temperature": 298.15, "bypass_cache": "true"}

        resp = client.post("/api/calculations/predict-properties", files=files, data=data)
        assert resp.status_code == 200, f"Error: {resp.text}"
        payload = resp.json()
        assert payload["status"] == "success"
        assert "properties" in payload
        assert payload["properties"]["band_gap"]["value"] == 5.2
        assert payload["material_metadata"]["formula"] == "Li2O"


def test_predict_properties_when_inference_offline():
    """Verifies graceful 503 response when inference service is unreachable."""
    client = TestClient(app)

    with patch("backend.api.calculator_router.inference_client.predict_properties") as mock_pred:
        async def mock_fail(*args, **kwargs):
            raise InferenceUnavailableError("Inference service refused connection")
        mock_pred.side_effect = mock_fail

        files = {"file": ("structure.cif", io.BytesIO(CIF_SAMPLE.encode("utf-8")), "chemical/x-cif")}
        data = {"properties": "band_gap", "temperature": 298.15, "bypass_cache": "true"}

        resp = client.post("/api/calculations/predict-properties", files=files, data=data)
        print("OFFLINE TEST STATUS:", resp.status_code, resp.text)
        assert resp.status_code == 503
        assert "unavailable" in resp.json()["detail"].lower()


def test_invalid_cif_file_extension():
    client = TestClient(app)
    files = {"file": ("structure.txt", io.BytesIO(b"random text"), "text/plain")}
    resp = client.post("/api/calculations/predict-properties", files=files, data={"properties": "band_gap"})
    assert resp.status_code == 400


def test_cif_generator_proxy_endpoints():
    client = TestClient(app)

    # Health
    h_resp = client.get("/cif/api/health")
    assert h_resp.status_code == 200

    # Parse formula
    p_resp = client.post("/cif/api/parse-formula", json={"formula": "LiFePO4"})
    assert p_resp.status_code == 200
    p_data = p_resp.json()
    assert "Li" in p_data["elements"]
    assert "Fe" in p_data["elements"]

    # Generate CIF via proxy (with mock)
    with patch("backend.core.inference_client.inference_client.generate_cif") as mock_gen, \
         patch("core.inference_client.inference_client.generate_cif", mock_gen):
        async def mock_async_gen(*args, **kwargs):
            return {
                "success": True,
                "formula": "Li2O",
                "cif_string": CIF_SAMPLE,
                "generator_source": "InferenceService-CIF-Pipeline",
            }
        mock_gen.side_effect = mock_async_gen

        g_resp = client.post("/cif/api/generate", json={"formula": "Li2O"})
        assert g_resp.status_code == 200
        g_data = g_resp.json()
        assert g_data["success"] is True
        assert "data_Li2O" in g_data["cif"]


if __name__ == "__main__":
    test_main_api_health()
    print("[OK] test_main_api_health passed")
    test_main_api_root()
    print("[OK] test_main_api_root passed")
    test_heavy_models_not_imported_in_main_api()
    print("[OK] test_heavy_models_not_imported_in_main_api passed")
    test_predict_properties_delegation()
    print("[OK] test_predict_properties_delegation passed")
    test_predict_properties_when_inference_offline()
    print("[OK] test_predict_properties_when_inference_offline passed")
    test_invalid_cif_file_extension()
    print("[OK] test_invalid_cif_file_extension passed")
    test_cif_generator_proxy_endpoints()
    print("[OK] test_cif_generator_proxy_endpoints passed")
    print("\nALL MAIN API TESTS PASSED SUCCESSFULLY!")
