# IndianMatter × CIF Generator — Integration Report

Date: 2026-10-08
Branch: `cif-generator-integration`
Repos involved:
- IndianMatter: https://github.com/SaiSubodh27/IndianMatter.git
- CIF generator: https://github.com/indra2215/CIF.git (cloned locally at `E:\CIF-generator`)

---

## 1. What we started with

### IndianMatter (working app)
- **Backend** (`backend/`): FastAPI app (`main.py`) with routes for auth, users, OQMD/AFLOW/JARVIS/Materials-Project search, internal dataset queries, and property prediction (`/api/calculations/*`).
- **Frontend** (`src/`): React 18 + Vite + Tailwind app. Key pages: dashboard, materials, prediction (`PropertyPredictionPage`, `BatchPredictionPage`), structure viewer, and `CIFGenerationPage`.
- **`CIFGenerationPage`** previously used a **hardcoded sample CIF** (Na3Zr2Si2PO12) — the "Synthesize" button never called any backend.
- **`PropertyPredictionPage`** required the user to upload a `.cif` file even immediately after generating one ("CIF Structure File — Choose a .cif file").

### CIF generator (`E:\CIF-generator`)
- FastAPI app in `webapp.py` built on the `cif_pipeline` package (formula recognition → internal/external database search → CrystaLLM/doping generation → validation → formatting).
- Exposes `POST /api/generate`, `POST /api/doped-cif`, `POST /api/parse-formula`, `POST /api/batch-process`, `GET /api/health`, `GET /api/data-files`, etc., plus a static frontend in `frontend/`.
- Runs standalone with its own `requirements.txt` (pymatgen, mp-api, ase, mace-torch, jarvis-tools, FastAPI/uvicorn).

---

## 2. Integration performed

### 2.1 Files copied into IndianMatter
| Source | Destination | Contents |
|---|---|---|
| `cif_pipeline/` | `IndianMatter/backend/cif_pipeline/` | Full CIF generation pipeline package (~40 modules: `orchestrator`, `classify`, `intent`, `dopant_pipeline`, `generate`, `relax`, `mlip`, …) |
| `webapp.py` | `IndianMatter/backend/webapp.py` | The CIF generator FastAPI app |
| `frontend/` | `IndianMatter/backend/frontend/` | CIF generator web UI (index.html, app.js, style.css, batch/manual pages) |
| `data/` | `IndianMatter/backend/data/` | `.dat` benchmark/case files used by the pipeline |

(`__pycache__` excluded; a duplicate `frontend_cif/` copy was removed to avoid confusion.)

### 2.2 Backend wiring — `backend/main.py`
- Added a guarded import of the CIF app:
```python
try:
    from webapp import app as cif_generator_app
    _CIF_APP_AVAILABLE = True
except Exception as _cif_import_error:
    cif_generator_app = None
    _CIF_APP_AVAILABLE = False
    print(f"[startup] CIF generator disabled: {_cif_import_error}")
```
- Mounted it on the main app:
```python
if _CIF_APP_AVAILABLE:
    app.mount("/cif", cif_generator_app)
```
- Resulting endpoints:
  - CIF UI: `http://localhost:8000/cif/`
  - `POST /cif/api/generate` → run full pipeline for a formula (supports doping specs)
  - `POST /cif/api/doped-cif` → dedicated doped-compound pipeline
  - `POST /cif/api/parse-formula`, `POST /cif/api/batch-process`, `GET /cif/api/health`, `GET /cif/api/data-files`, …
- `backend/requirements.txt`: appended `mace-torch>=0.3.0` and `jarvis-tools>=2024.1.1`.

### 2.3 Frontend wiring — generation page
`src/pages/cif/CIFGenerationPage.tsx`:
- Removed the hardcoded sample CIF; state now `cifString`, `spaceGroup`, `totalTime`, `loading`, `error`, `generated=false`.
- "Synthesize" now calls the real backend:
```ts
const res = await fetch(`${API_BASE_URL}/cif/api/generate`, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ formula, host_formula: formula, dopant_element, dopant_fraction }),
});
```
- Response fields used: `success`, `cif_string`, `final_space_group`, `total_elapsed_seconds`.
- Copy-to-clipboard and Download-.cif buttons operate on the real generated CIF.
- "Predict Properties for Structure" navigates with the generated CIF attached:
```ts
navigate("/app/predict", { state: { cifString, formula } })
```

### 2.4 Frontend wiring — prediction page
`src/pages/prediction/PropertyPredictionPage.tsx`:
- Added a `useLocation()` effect that converts router state `{ cifString, formula }` into a `File` object:
```ts
const generatedFile = new File([st.cifString], `${formula}.cif`, { type: "chemical/x-cif" });
setFile(generatedFile);
```
- This reuses all existing machinery: `useCifText(file)` → 3Dmol.js structure viewer, and `predictFromCifFile(file, selectedKeys)` → `POST /api/calculations/predict-properties`.
- So after generating a CIF the user lands on the prediction page with the structure already loaded; the manual file picker remains as a fallback for direct visits.

---

## 3. Environment / installation fixes

Issues found and resolved while getting everything running:

| Problem | Fix |
|---|---|
| `IndianMatter/v/` venv referenced a non-existent Python at `C:\Users\saisu\...` | Ignored; used working interpreter at `%LOCALAPPDATA%\Programs\Python\Python313\python.exe` (3.13.2) |
| `ModuleNotFoundError: matminer` (calculator_router) | `pip install matminer` (was already satisfied — transient path issue, then confirmed) |
| `ModuleNotFoundError: authlib` (auth routes) | `pip install authlib` |
| IonCast models not loaded: `No module named 'catboost'` | `pip install catboost lightgbm` |
| `ImportError: email-validator` | `pip install email-validator` |
| Duplicate uvicorn on port 8000 (`uvicorn app.api:app` and stale `uvicorn webapp:app` from Oct 7) stealing requests and returning 404s | Killed stale processes; single backend (`uvicorn main:app`) now owns port 8000 |
| Frontend `npm install` blocked esbuild's postinstall | `npm approve-scripts esbuild` + `npm rebuild esbuild` |

---

## 4. Runtime status (verified)

- Backend: `uvicorn main:app --host 0.0.0.0 --port 8000` → `http://localhost:8000/` 200 OK
- Frontend: `npm run dev` (Vite) → `http://localhost:5173/` (use `/index.html`; bare `/` 404s on this setup — known Vite quirk to revisit)
- CIF pipeline health: `GET /cif/api/health` → `{"status":"healthy", …, "crystallm_ready":true, "has_mp_api_key":true}`
- Generation: browser call to `POST /cif/api/generate` returned **200 OK** (seen in server log)
- Prediction models (smoke-tested with `backend/test.cif`):
  - `POST /api/calculations/predict-properties` → 200, bulk_modulus 63.73 GPa, shear_modulus 20.05 GPa, energy −1.85 eV/atom
  - `POST /api/calculations/analyze-electrical` → 200, band_gap 0.03 eV, CHGNet features present
  - `POST /api/calculations/analyze-thermal` → 200, phonon proxy 530.09 cm⁻¹, CHGNet features present
- TypeScript: no new type errors in the two edited pages (only pre-existing unused-symbol warnings elsewhere).

---

## 5. What is DONE ✅

1. CIF generator pipeline code physically inside the IndianMatter backend (`backend/cif_pipeline/`, `webapp.py`, `frontend/`, `data/`).
2. Backend mount of the CIF API/UI at `/cif` with graceful fallback if ML deps are missing.
3. Generation page wired to the real `/cif/api/generate` endpoint (no more hardcoded CIF).
4. Generated CIF automatically handed to the prediction page (router state → `File`), removing the second upload step.
5. All required Python deps installed; backend starts cleanly; models load (BFSY, electrical, thermal, CHGNet).
6. End-to-end smoke tests pass for generation + properties.
7. Everything committed and pushed to branch `cif-generator-integration`.

## 6. What is NOT done / known gaps ⚠️

1. **Doping from the UI**: the generation page passes `dopant_element`/`dopant_fraction` but not `host_site_species` in all cases; for fully explicit doped compounds the stricter `/cif/api/doped-cif` endpoint should be used — frontend does not call it yet.
2. **CIF structure visualization in prediction page** currently depends on 3Dmol.js CDN; if offline it won't render.
3. **Frontend `/` returns 404** (must open `/index.html`) — needs a Vite base/config tweak.
4. **Repeated `GET /health` 404s** in the backend log — some frontend health-check ping still targets `/health` instead of `/cif/api/health` (cosmetic; locate and fix the caller, likely `src/lib/api.ts`).
5. **Deprecated `IndianMatter/v` venv folder** (broken, references another user's machine) — should be deleted from the repo.
6. **No automated tests run yet** for the new flow — worth adding an integration test that generates a CIF and then predicts properties on it.
7. **`package.json`/`package-lock.json`** changes from `npm approve-scripts` were reverted; on fresh clones the esbuild approve step may need to be re-run or documented in README setup.
8. **The standalone `E:\CIF-generator` repo** stays as-is (all committed/pushed to its `main`). No test branch was created there yet.
9. **MongoDB/auth env**: backend depends on `.env` (MP_API_KEY, GOOGLE/GITHUB OAuth, SESSION_SECRET, MongoDB URI); fresh deployments must copy `backend/.env.example`.

---

## 7. How to run

```powershell
# Backend
cd E:\CIF-generator\IndianMatter\backend
& "$env:LOCALAPPDATA\Programs\Python\Python313\python.exe" -m uvicorn main:app --host 0.0.0.0 --port 8000

# Frontend
cd E:\CIF-generator\IndianMatter
npm run dev   # open http://localhost:5173/index.html
```

Flow: open the CIF Generation page → enter formula (+ optional dopant) → Synthesize → generated CIF appears → "Predict Properties for Structure" → properties predicted directly from the generated CIF.
