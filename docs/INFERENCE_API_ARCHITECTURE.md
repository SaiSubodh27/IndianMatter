# IndianMaterialsAI — Service 2: Standalone Inference API

**Port:** 8001  
**Git Branch:** `service/inference-api`

## Overview
The Standalone Inference API is the dedicated AI/ML and scientific computation engine for the IndianMaterialsAI platform. It isolates all heavy deep learning frameworks (PyTorch, CHGNet, CrystalFormer, MACE, M3GNet) and gradient boosting ensembles (IonCast LightGBM, XGBoost, CatBoost) from the main API.

## Architecture & Responsibilities
- **Isolated ML Runtime:** Standalone FastAPI application listening on port 8001.
- **Model Lifecycle & Warm-up:** FastAPI lifespan manager loads neural weights and checkpoint models once per worker process during startup.
- **Hardware Acceleration:** Automatically detects and leverages CUDA GPU acceleration when available, falling back cleanly to CPU execution.
- **Internal API Protection:** All prediction endpoints (`/internal/v1/*`) are protected by `X-Internal-Service-Key` header authentication.
- **Pydantic V2 Type Safety:** Explicit request and response models enforce strict input validation on CIF strings, temperatures, and property lists.
- **Model Readiness Probes:** Provides `/ready` probe detailing the load status of CrystalFormer, CHGNet, IonCast, and Atomistic adapters.

## Endpoints
- `GET /health`: Liveness probe.
- `GET /ready`: Component readiness probe.
- `POST /internal/v1/predict-properties`: Evaluates 15+ physical, electronic, thermodynamic, and mechanical properties.
- `POST /internal/v1/predict-ionic-transport`: Predicts ionic conductivity ($\sigma$) and activation energy ($E_a$).
- `POST /internal/v1/predict-crystalformer`: Dedicated graph neural network crystal property prediction.
- `POST /internal/v1/generate-cif`: Generative AI crystal structure synthesis from formula.
- `POST /internal/v1/analyze-structure`: Pymatgen-based space group, crystal system, and lattice metric analysis.

## Configuration & Environment Variables
| Variable | Default | Purpose |
|---|---|---|
| `INFERENCE_PORT` | `8001` | Inference API listening port |
| `INFERENCE_HOST` | `0.0.0.0` | Bind host address |
| `INTERNAL_SERVICE_SECRET` | `indianmatter-internal-secret-token` | Required shared authentication key |
| `COMPUTE_DEVICE` | `auto` | Device selection (`auto`, `cuda`, `cpu`) |

## Quick Start (Local Development)
```bash
# 1. Install ML and scientific dependencies
pip install -r inference_service/requirements.txt

# 2. Run the Inference API
uvicorn inference_service.main:app --host 127.0.0.1 --port 8001
```

## Running Tests
```bash
python inference_service/test_inference_service.py
```

## Health Checks
- Liveness: `GET http://127.0.0.1:8001/health`
- Readiness: `GET http://127.0.0.1:8001/ready`
- Documentation: `GET http://127.0.0.1:8001/docs`
