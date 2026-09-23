# API Architecture Guide

## Backend Framework

- **Framework**: FastAPI
- **Entry point**: `backend/main.py`
- **Server**: Uvicorn with `--reload` for development
- **CORS**: Allows all origins (development mode)

## Router Registration (main.py)

```python
# Core & Authentication
app.include_router(auth_routes.router, prefix="/api/auth")
app.include_router(user_routes.router, prefix="/api/users")

# CIF Tools
app.include_router(cif_routes.router, prefix="/api/cif")

# External Databases
app.include_router(materials_routes.router, prefix="/api/materials")
app.include_router(oqmd.router, prefix="/api/oqmd")
app.include_router(aflow.router, prefix="/api/aflow")
app.include_router(jarvis.router, prefix="/api/jarvis")
app.include_router(database_routes.router, prefix="/api/dataset")
app.include_router(indianmatter.router, prefix="/api/indianmatter")

# Calculations (prediction pipeline)
app.include_router(calculator_router)  # prefix="/api/calculations"
```

## API Endpoints Summary

### Authentication (`/api/auth`)
| Method | Path | Description |
|---|---|---|
| POST | `/register` | User registration |
| POST | `/login` | User login |

### Calculations (`/api/calculations`)
| Method | Path | Input | Description |
|---|---|---|---|
| POST | `/predict-properties` | CIF + properties list | Multi-property prediction |
| POST | `/analyze-cif` | CIF | Basic structural analysis |
| POST | `/analyze-cif-file` | CIF | Structural metrics |
| POST | `/calculate-metrics` | JSON | Structural metrics from JSON |
| POST | `/analyze-mechanical` | CIF | K, G, E, ν |
| POST | `/analyze-electrical` | CIF | Band gap |
| POST | `/analyze-thermal` | CIF | Thermal proxy |
| POST | `/analyze-ionic` | CIF + temperature | Ionic conductivity |
| POST | `/ionic-conductivity` | CIF + temperature | Same as above (alias) |
| POST | `/predict` | CIF + temperature | Compact conductivity response |

### External Databases
| Prefix | Source |
|---|---|
| `/api/materials` | Materials Project |
| `/api/oqmd` | OQMD |
| `/api/aflow` | AFLOW |
| `/api/jarvis` | JARVIS |

## Frontend API Clients

| File | Purpose |
|---|---|
| `src/lib/api.ts` | Core API client (base URL, auth) |
| `src/lib/materialsPredictionApi.ts` | Property prediction API calls |
| `src/lib/cifApi.ts` | CIF generation/analysis API |
| `src/lib/datasetapi.ts` | Dataset management API |
| `src/lib/parseCIF.ts` | Client-side CIF parsing |

## Error Handling

Use appropriate HTTP status codes:

| Code | Usage |
|---|---|
| 400 | Invalid input (bad CIF, wrong format, missing fields) |
| 404 | Resource not found |
| 422 | Validation error (FastAPI automatic for Pydantic) |
| 500 | Server error (model failure, unexpected exception) |
| 503 | Model/dependency unavailable |

### Error Response Format

```json
{
  "detail": "Human-readable error message"
}
```

### Partial Failure Response

For multi-property predictions, return per-property status:
```json
{
  "status": "success",
  "properties": {
    "bulk_modulus": {"status": "calculated", "value": 123.4, "unit": "GPa"},
    "band_gap": {"status": "failed", "value": null, "warnings": ["Model not loaded"]},
    "thermal_conductivity": {"status": "unavailable", "value": null}
  }
}
```

## File Upload Pattern

All CIF endpoints accept `multipart/form-data`:

```python
@router.post("/analyze-mechanical")
async def analyze_mechanical(file: UploadFile = File(...)):
    if not file.filename.endswith('.cif'):
        raise HTTPException(status_code=400, detail="Only .cif files are supported.")
    content = await file.read()
    structure = Structure.from_str(content.decode("utf-8"), fmt="cif")
    ...
```

## Security Checklist

- [ ] Validate file extension before processing
- [ ] Limit upload file size
- [ ] Sanitize filenames (no path traversal)
- [ ] Never load user-uploaded pickle files
- [ ] Clean up temporary files in finally blocks
- [ ] Don't expose internal stack traces in production
- [ ] Don't log API keys or secrets

## Backward Compatibility

Before modifying any endpoint:

1. Check if the frontend calls it (search `src/lib/*.ts`)
2. Check if external consumers depend on it
3. Preserve existing request/response schemas
4. If breaking changes are needed, version the endpoint

## Database

- **MongoDB**: Connected via `database.py` using pymongo
- **Models**: `db_models.py` defines user/data schemas
- **Auth**: JWT-based (`python-jose`) with bcrypt password hashing
