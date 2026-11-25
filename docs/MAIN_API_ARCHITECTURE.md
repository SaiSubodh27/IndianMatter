# IndianMaterialsAI — Service 1: Main API Gateway

**Port:** 8000  
**Git Branch:** `service/main-api`

## Overview
The Main API service serves as the central gateway and orchestration engine for the IndianMaterialsAI platform. It manages user authentication, authorization, session states, MongoDB catalog indexing and querying, caching, and frontend communication. Heavy scientific AI/ML inference is delegated over HTTP to the Standalone Inference Service.

## Architecture & Responsibilities
- **Application Gateway:** Main FastAPI application listening on port 8000.
- **User Management & Security:** User registration, password hashing (bcrypt), login, OTP verification, Google & GitHub OAuth via Starlette Session Middleware.
- **MongoDB Persistence:** Direct connection to `IndianMaterialsAI` MongoDB collections (`users`, `materials_catalog`, `material_predictions`, `generated_cifs`, `literature_papers`, etc.) via PyMongo.
- **Material Catalog Engine:** Sub-millisecond querying, filtering, and indexing across 38,000+ materials.
- **Inference Client Orchestration:** Communicates with the Standalone Inference API (`INFERENCE_BASE_URL`, default `http://127.0.0.1:8001`) using `backend/core/inference_client.py` via HTTPX with connection/read timeouts and `X-Internal-Service-Key` header authentication.
- **Graceful Fault Tolerance:** When the Inference Service is offline or busy, the Main API continues serving catalog searches, user authentication, and literature lookups, returning HTTP 503 for uncached inference requests without crashing.
- **Frontend Compatibility:** Directly serves the React frontend requests on port 8000 with identical schemas.

## Configuration & Environment Variables
| Variable | Default | Purpose |
|---|---|---|
| `PORT` | `8000` | Main API listening port |
| `MONGO_URL` | `mongodb://localhost:27017/IndianMaterialsAI` | Primary MongoDB database URI |
| `INFERENCE_BASE_URL` | `http://127.0.0.1:8001` | HTTP address of Standalone Inference Service |
| `INTERNAL_SERVICE_SECRET` | `indianmatter-internal-secret-token` | Pre-shared key for internal service authorization |
| `INFERENCE_CONNECT_TIMEOUT`| `5.0` | Connection timeout in seconds |
| `INFERENCE_READ_TIMEOUT` | `60.0` | Read timeout for complex calculations |
| `SESSION_SECRET` | `fallback-secret-change-me` | Key for signing session cookies |

## Quick Start (Local Development)
```bash
# 1. Install lightweight dependencies (NO PyTorch/CUDA required)
pip install -r backend/requirements_main.txt

# 2. Run the Main API with hot reload
uvicorn backend.main:app --host 127.0.0.1 --port 8000 --reload
```

## Running Tests
```bash
python backend/test_main_api.py
```

## Health Checks
- Liveness: `GET http://127.0.0.1:8000/health`
- Root Info: `GET http://127.0.0.1:8000/`
- Documentation: `GET http://127.0.0.1:8000/docs`
