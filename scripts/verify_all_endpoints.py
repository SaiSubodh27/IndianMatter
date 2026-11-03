import json
import sys
from pathlib import Path

# Add roots to sys.path
ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT))
sys.path.insert(0, str(ROOT / "backend"))
sys.path.insert(0, str(ROOT / "cif_generator"))
sys.path.insert(0, str(ROOT / "property_prediction_models"))

from starlette.testclient import TestClient
from backend.main import app

client = TestClient(app, raise_server_exceptions=False)

SAMPLE_CIF = """data_Li2O
_symmetry_space_group_name_H-M   'F m -3 m'
_cell_length_a                   4.61
_cell_length_b                   4.61
_cell_length_c                   4.61
_cell_angle_alpha                90
_cell_angle_beta                 90
_cell_angle_gamma                90
loop_
_atom_site_label
_atom_site_type_symbol
_atom_site_fract_x
_atom_site_fract_y
_atom_site_fract_z
_atom_site_occupancy
Li1 Li 0.25 0.25 0.25 1.0
O1  O  0.0  0.0  0.0  1.0
"""

results = []

def test_endpoint(name: str, method: str, path: str, expected_codes=(200, 302, 502), **kwargs):
    try:
        if method.upper() == "GET":
            res = client.get(path, **kwargs)
        elif method.upper() == "POST":
            res = client.post(path, **kwargs)
        else:
            res = client.request(method, path, **kwargs)
        
        status = res.status_code
        ok = status in expected_codes or (200 <= status < 400)
        preview = ""
        try:
            data = res.json()
            if isinstance(data, dict):
                preview = ", ".join(f"{k}: {str(v)[:25]}" for k, v in list(data.items())[:3])
            elif isinstance(data, list):
                preview = f"List of {len(data)} items"
        except Exception:
            preview = res.text[:60]
            
        results.append({
            "name": name,
            "method": method,
            "path": path,
            "status": status,
            "ok": ok,
            "preview": preview,
        })
        print(f"[{'PASS' if ok else 'FAIL'}] {method} {path} -> {status} ({preview[:50]})")
    except Exception as e:
        results.append({
            "name": name,
            "method": method,
            "path": path,
            "status": "ERROR",
            "ok": False,
            "preview": str(e)[:60],
        })
        print(f"[ERROR] {method} {path} -> {e}")

print("=== VERIFYING ALL BACKEND ENDPOINTS ===\n")

# 1. Core Server & Documentation
test_endpoint("Root Status", "GET", "/")
test_endpoint("OpenAPI Spec", "GET", "/openapi.json")
test_endpoint("Swagger Documentation", "GET", "/docs")

# 2. CIF Upload & Parser
test_endpoint("CIF Upload Parser", "POST", "/api/cif/parse", 
              files={"file": ("Li2O.cif", SAMPLE_CIF.encode("utf-8"), "text/plain")})

# 3. Calculation & Scientific Prediction Endpoints
test_endpoint("Database Overview", "GET", "/api/calculations/database/overview")
test_endpoint("Batch Properties Catalogue", "GET", "/api/calculations/batch-properties")
test_endpoint("Batch Sample CIFs", "GET", "/api/calculations/batch-sample-cifs")
test_endpoint("Predict Properties (File)", "POST", "/api/calculations/predict-properties", 
              files={"file": ("Li2O.cif", SAMPLE_CIF.encode("utf-8"), "text/plain")},
              data={"properties": "bulk_modulus,shear_modulus,band_gap,formation_energy", "temperature": "298.15"})
test_endpoint("Analyze CIF Properties", "POST", "/api/calculations/analyze-cif", 
              files={"file": ("Li2O.cif", SAMPLE_CIF.encode("utf-8"), "text/plain")})
test_endpoint("Analyze CrystalFormer Properties", "POST", "/api/calculations/crystalformer/predict", 
              files={"file": ("Li2O.cif", SAMPLE_CIF.encode("utf-8"), "text/plain")})
test_endpoint("Ionic Transport Prediction", "POST", "/api/calculations/ionic-conductivity", 
              files={"file": ("Li2O.cif", SAMPLE_CIF.encode("utf-8"), "text/plain")},
              data={"temperature": "298.15"})

# 4. Multi-Database Federation Endpoints
test_endpoint("Materials Project Explorer", "GET", "/api/materials/explore?limit=5")
test_endpoint("OQMD Database Explorer", "GET", "/api/oqmd/explore?limit=5")
test_endpoint("AFLOW Database Explorer", "GET", "/api/aflow/explore?limit=5")
test_endpoint("JARVIS Database Explorer", "GET", "/api/jarvis/explore?limit=5")
test_endpoint("Dataset Search Service", "GET", "/api/dataset/search?query=Li")
test_endpoint("IndianMatter Internal DB", "GET", "/api/indianmatter/explore?limit=5")

# 5. Integrated CIF Generator App (Mounted at /cif)
test_endpoint("CIF Generator Health", "GET", "/cif/api/health")
test_endpoint("CIF Formula Resolver", "POST", "/cif/api/parse-formula", 
              json={"formula": "Li2O"})

# 6. Auth & User Management
test_endpoint("Google OAuth Login Redirect", "GET", "/api/auth/google/login", follow_redirects=False, expected_codes=(302,))
test_endpoint("GitHub OAuth Login Redirect", "GET", "/api/auth/github/login", follow_redirects=False, expected_codes=(302,))
test_endpoint("User Auth Protection Check", "GET", "/api/users/profile", expected_codes=(401,))

print("\n=== ENDPOINT VERIFICATION SUMMARY ===")
total = len(results)
passed = sum(1 for r in results if r["ok"])
print(f"Total endpoints tested: {total}")
print(f"Passed successfully: {passed}")
print(f"Failed: {total - passed}")

with open("endpoint_verification_results.json", "w") as f:
    json.dump(results, f, indent=2)
print("Detailed results stored in endpoint_verification_results.json")
