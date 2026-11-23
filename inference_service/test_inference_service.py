"""
test_inference_service.py
=========================
Independent unit and integration test suite for Standalone Inference Service.
"""

import sys
from pathlib import Path
SERVICE_DIR = Path(__file__).resolve().parent
PROJECT_ROOT = SERVICE_DIR.parent
for p in [PROJECT_ROOT, PROJECT_ROOT / "property_prediction_models", PROJECT_ROOT / "cif_generator", PROJECT_ROOT / "backend"]:
    if str(p) not in sys.path:
        sys.path.insert(0, str(p))

import pytest
from fastapi.testclient import TestClient
from inference_service.main import app

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

AUTH_HEADERS = {"X-Internal-Service-Key": "indianmatter-internal-secret-token"}


def test_health_check():
    client = TestClient(app)
    resp = client.get("/health")
    assert resp.status_code == 200
    data = resp.json()
    assert data["status"] == "healthy"
    assert data["port"] == 8001


def test_readiness_probe():
    client = TestClient(app)
    resp = client.get("/ready")
    assert resp.status_code == 200
    data = resp.json()
    assert "ready" in data
    assert "components" in data


def test_unauthorized_access_rejected():
    client = TestClient(app)
    # No auth header
    resp = client.post("/internal/v1/analyze-structure", json={"cif_text": CIF_SAMPLE})
    assert resp.status_code == 401

    # Wrong auth header
    resp_wrong = client.post(
        "/internal/v1/analyze-structure",
        json={"cif_text": CIF_SAMPLE},
        headers={"X-Internal-Service-Key": "invalid-token"},
    )
    assert resp_wrong.status_code == 403


def test_structure_analysis():
    client = TestClient(app)
    resp = client.post(
        "/internal/v1/analyze-structure",
        json={"cif_text": CIF_SAMPLE},
        headers=AUTH_HEADERS,
    )
    assert resp.status_code == 200
    data = resp.json()
    assert data["reduced_formula"] == "Li2O"
    assert data["density"] > 0.0
    assert "m" in data["space_group"].lower() or "f" in data["space_group"].lower()
    assert data["crystal_system"].lower() == "cubic"


def test_invalid_cif_rejected():
    client = TestClient(app)
    resp = client.post(
        "/internal/v1/analyze-structure",
        json={"cif_text": "NOT_A_VALID_CIF_FILE_CONTENT"},
        headers=AUTH_HEADERS,
    )
    assert resp.status_code in (400, 422)


def test_property_prediction_endpoint():
    client = TestClient(app)
    resp = client.post(
        "/internal/v1/predict-properties",
        json={
            "cif_text": CIF_SAMPLE,
            "properties": ["band_gap", "formation_energy", "bulk_modulus", "ehull"],
            "temperature": 298.15,
        },
        headers=AUTH_HEADERS,
    )
    assert resp.status_code == 200
    data = resp.json()
    assert data["status"] == "success"
    assert "material_metadata" in data
    assert "properties" in data
    assert "band_gap" in data["properties"]
    assert "formation_energy" in data["properties"]


def test_cif_generation_endpoint():
    client = TestClient(app)
    resp = client.post(
        "/internal/v1/generate-cif",
        json={
            "formula": "TiO2",
            "max_iterations": 1,
            "samples_per_iteration": 1,
        },
        headers=AUTH_HEADERS,
    )
    assert resp.status_code == 200
    data = resp.json()
    assert "formula" in data
    assert "generator_source" in data


if __name__ == "__main__":
    test_health_check()
    print("[OK] test_health_check passed")
    test_readiness_probe()
    print("[OK] test_readiness_probe passed")
    test_unauthorized_access_rejected()
    print("[OK] test_unauthorized_access_rejected passed")
    test_structure_analysis()
    print("[OK] test_structure_analysis passed")
    test_invalid_cif_rejected()
    print("[OK] test_invalid_cif_rejected passed")
    test_property_prediction_endpoint()
    print("[OK] test_property_prediction_endpoint passed")
    test_cif_generation_endpoint()
    print("[OK] test_cif_generation_endpoint passed")
    print("\nALL INFERENCE SERVICE TESTS PASSED SUCCESSFULLY!")
