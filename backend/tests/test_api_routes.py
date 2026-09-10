import unittest
from fastapi.testclient import TestClient
from main import app

class TestApiRoutes(unittest.TestCase):
    def setUp(self):
        self.client = TestClient(app)

    def test_get_system_devices(self):
        response = self.client.get("/api/materials-prediction/system/devices")
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertIn("selected_device", data)
        self.assertIn("gpu_available", data)

    def test_list_properties(self):
        response = self.client.get("/api/materials-prediction/properties")
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertIsInstance(data, list)
        keys = [p["key"] for p in data]
        self.assertIn("total_energy", keys)
        self.assertIn("bulk_modulus", keys)
        self.assertIn("ionic_conductivity", keys)

    def test_get_model_capabilities(self):
        response = self.client.get("/api/materials-prediction/models/capabilities")
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertIn("models", data)
        self.assertIn("m3gnet", data["models"])
        self.assertIn("chgnet", data["models"])
        self.assertIn("mace", data["models"])

    def test_excluded_property_creation_reject(self):
        response = self.client.post(
            "/api/materials-prediction/predictions",
            json={
                "dataset_id": "non_existent",
                "selected_models": ["m3gnet"],
                "selected_properties": ["ionic_conductivity"]
            }
        )
        self.assertIn(response.status_code, (400, 404))

if __name__ == "__main__":
    unittest.main()
