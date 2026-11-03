# IndianMatter — BACKEND Flow Chart (Artifact)

> Scope: `E:\IndianMatter\backend\` — FastAPI server, routers, auth, prediction stack, service layers.
> Entry point: `backend/main.py`. Default port: **8000**.

---

## 1. High-Level Architecture Flow

```mermaid
flowchart TB
    subgraph CLIENT["🔌 Clients"]
        FE["React Frontend<br/>(Vite dev / build)"]
        CWD["backend/frontend/<br/>(vanilla HTML/JS UI)"]
        CURL["Tests / curl / scripts"]
    end

    subgraph APP["⚙️ FastAPI Application (main.py)"]
        LIFESPAN["lifespan() startup hook<br/>• banner print<br/>• model_service.load_models()<br/>• checks MP_API_KEY<br/>• checks OAuth env vars"]
        CORS["CORSMiddleware (allow *, credentials)"]
        SESSION["SessionMiddleware"]
        ROOT["GET / → status JSON"]
        DOCS["GET /docs → OpenAPI"]
    end

    subgraph ROUTERS["🛣️ Routers wired in main.py"]
        AUTH["/api/auth<br/>routes/auth_routes.py"]
        USERS["/api/users<br/>routes/user_routes.py"]
        CIFR["/api/cif<br/>routes/cif_routes.py"]
        MAT["/api/materials<br/>routes/materials_routes.py<br/>(Materials Project)"]
        OQMD["/api/oqmd<br/>routes/oqmd.py"]
        AFLOW["/api/aflow<br/>routes/aflow.py"]
        JARVIS["/api/jarvis<br/>routes/jarvis.py"]
        IMDB["/api/indianmatter<br/>routes/indianmatter.py"]
        DATASET["/api/dataset<br/>routes/database_routes.py"]
        CALC["/api/calculations<br/>api/calculator_router.py"]
        TRANS["/api/calculations<br/>routes/transport_router.py"]
        CIFSUB["/cif → MOUNTED SUB-APP<br/>webapp.py (CIF Generator)"]
    end

    FE --> CORS
    CWD --> CIFSUB
    CURL --> APP

    APP --> ROUTERS
```

---

## 2. Request Routing Map (file → endpoint → action)

| HTTP Route | File | What it does |
|---|---|---|
| `POST /api/auth/register` | `backend/routes/auth_routes.py` | bcrypt-hash password → insert Mongo user → issue JWT |
| `POST /api/auth/login` | `backend/routes/auth_routes.py` | verify email+bcrypt → update `last_login` → JWT |
| `GET /api/auth/google/login` | `backend/routes/auth_routes.py` | authlib `authorize_redirect` → Google |
| `GET /api/auth/google/callback` | `backend/routes/auth_routes.py` | fetch userinfo → create/link user → redirect `FRONTEND_URL/signin#token=JWT` |
| `GET /api/auth/github/login` / `callback` | `backend/routes/auth_routes.py` | GitHub OAuth, email via `user/emails` fallback |
| `GET /api/users/profile` | `backend/routes/user_routes.py` | `get_current_user` dep → public profile |
| `GET /api/users/dashboard` | `backend/routes/user_routes.py` | last 5 predictions + saved materials |
| `POST /api/users/predict` | `backend/routes/user_routes.py` | **MOCK** prediction (Ea=0.46, σ=1.3e-3) → history |
| `POST /api/users/save-material` | `backend/routes/user_routes.py` | push `SavedMaterial` to Mongo |
| `POST /api/cif/parse` | `backend/routes/cif_routes.py` | CifParser → lattice params, atoms, SG info |
| `GET /api/materials/explore` | `backend/routes/materials_routes.py` | MPRester query → normalized rows |
| `GET /api/oqmd/explore` | `backend/routes/oqmd.py` | OQMD REST `filter=` grammar → rows |
| `GET /api/aflow/explore` | `backend/routes/aflow.py` | AFLUX matchbook query → rows |
| `GET /api/jarvis/explore` | `backend/routes/jarvis.py` | OPTIMADE query + python post-filters |
| `GET /api/indianmatter/explore` | `backend/routes/indianmatter.py` | local CSV (38510 + matminer) filtering |
| `GET /api/indianmatter/structure/{id}` | `backend/routes/indianmatter.py` | serve `38510_CIFs/{id}.cif` |
| `GET /api/dataset/search` | `backend/routes/database_routes.py` | 38510.csv periodic-table/formula search + pagination |
| `POST /api/calculations/predict-properties` | `backend/api/calculator_router.py` | CIF → CHGNet feats → BFSY/thermal/bandgap/IonCast |
| `POST /api/calculations/analyze-cif` | `backend/api/calculator_router.py` | structure + SpacegroupAnalyzer + Magpie |
| `POST /api/calculations/batch-predict` | `background` job + `status/results/download` | background worker per CIF |
| `POST /api/calculations/batch-predict-bfsy` | `backend/api/calculator_router.py` | BFSY batch → CSV |
| `POST /api/calculations/ionic-conductivity` | `backend/routes/transport_router.py` | temp CIF → IonCast `predict_one` |
| `POST /cif/api/generate` etc. | `backend/webapp.py` | see CIF artifact |

---

## 3. Startup / Lifespan Flow

```mermaid
flowchart TD
    START[("uvicorn main:app")] --> ENV["load .env (dotenv)"]
    ENV --> SHIM["ASE compatibility shims<br/>(ExpCellFilter: ase.constraints → ase.filters)"]
    SHIM --> L["lifespan()"]
    L --> MS["model_service.load_models()"]
    MS --> M1["v5_base_models.pkl<br/>v5_mlp_models.pkl<br/>v5_meta_model.pkl<br/>v5_quantile_transformer.pkl<br/>v5_model2_A.pkl"]
    MS --> M2["v6_corrector_model.pkl (optional)"]
    L --> CHK{"MP_API_KEY set?"}
    CHK -- no --> WARN["external DB endpoints disabled"]
    CHK -- yes --> OK["Materials/OQMD/AFLOW/JARVIS live"]
    L --> OAUTH{"Google/GitHub creds?"}
    M1 --> READY["APP READY — CORS + Session middleware,<br/>routers mounted, /cif sub-app mounted"]
```

---

## 4. Auth Flow (JWT + OAuth + MongoDB)

```mermaid
flowchart TD
    subgraph FILES
        AR["routes/auth_routes.py"]
        AU["auth.py"]
        DBMOD["db_models.py"]
        DB["database.py"]
        UR["routes/user_routes.py"]
    end
    subgraph STORE
        MONGO[("MongoDB localhost:27017<br/>db: IndianMaterialsAI<br/>coll: users")]
    end

    REQ["register/login request"] --> AR
    AR --> DBMOD["Pydantic: UserCreate/UserLogin/Token"]
    AR --> BCRYPT["bcrypt hash/verify (auth.py CryptContext)"]
    BCRYPT --> MONGO
    AR --> JWT["auth.create_access_token<br/>HS256, 1440 min, hardcoded SECRET_KEY"]
    JWT --> RESP["Token {access_token, user}"]

    GO["GET /api/auth/google/login"] --> RDIR["authlib authorize_redirect"]
    CB["callback"] --> VAL["verified email required"]
    VAL --> LINK{"user exists?"}
    LINK -- no --> CREATE["create doc w/ providers list"]
    LINK -- yes --> ATTACH["attach google_id/github_id"]
    CREATE --> JWT
    ATTACH --> JWT
    JWT --> RED["RedirectResponse<br/>FRONTEND_URL/signin#token=JWT"]

    PROTECTED["protected endpoint"] --> OAUTH2["OAuth2PasswordBearer"]
    OAUTH2 --> DECODE["decode JWT"]
    DECODE --> LOAD["load user from Mongo<br/>ObjectId → str"]
    LOAD --> CTX["current user in context"]

    UR --> DASH["GET /profile, /dashboard<br/>POST /predict (mock), /save-material"]
    UR --> MONGO
```

---

## 5. Property Prediction Flow (`/api/calculations/*`)

```mermaid
flowchart TD
    REQ["POST /api/calculations/predict-properties<br/>CIF file + properties CSV + temperature"]

    subgraph LOADS["⬇️ Imported at module load (calculator_router.py)"]
        BFSY["BFSYPipeline<br/>(prediction/BFSY_pipeline.py)"]
        BG["chgnet_bandgap_model.pkl"]
        TH["chgnet_thermal_model.pkl"]
        IC["predict_ionic_conductivity.load_models()<br/>(v5_* + optional v6_corrector)"]
    end

    REQ --> PARSE["Structure.from_str (pymatgen)<br/>metadata: formula/volume/density/sites"]
    PARSE --> CHG["utils/chgnet_features.py<br/>global CHGNetCalculator → 21-dim feature vector"]

    CHG --> S1["1️⃣ BFSY (mechanical)<br/>logK, logG → K,G<br/>E = 9KG/(3K+G), ν = (3K−2G)/(6K+2G)<br/>Pugh = K/G, compressibility = 1/K"]
    CHG --> S2["2️⃣ Thermal surrogate<br/>chgnet_thermal_model.predict"]
    CHG --> S3["3️⃣ Band-gap surrogate<br/>chgnet_bandgap_model.predict"]
    PARSE --> S4["4️⃣ Ionic conductivity<br/>properties/ionic_conductivity.py<br/>→ write temp CIF → predict_one<br/>→ v6 corrector applied"]

    S1 & S2 & S3 & S4 --> RESP["JSON: model_used='BFSYPipeline-Unified'<br/>each key → {value, unit, status}"]

    subgraph BATCH["📦 Batch endpoints"]
        UP["POST batch-predict<br/>.cif/.zip upload"] --> EX["_extract_cif_items_from_uploads"]
        EX --> JOB["BATCH_JOBS dict + background worker<br/>run_batch_prediction_worker"]
        JOB --> W["process_single_cif_record:<br/>SpacegroupAnalyzer, BFSY, bandgap,<br/>thermal proxies, IonicConductivityCalculator"]
        W --> ST["GET /batch-predict/status/{job_id}"]
        W --> RES["GET /batch-predict/results/{job_id}"]
        RES --> CSV["GET /.../download/{job_id}<br/>generate_csv_string"]
    end

    TR["routes/transport_router.py<br/>POST /predict | /analyze-ionic | /ionic-conductivity"] --> TEMP["write temp CIF"]
    TEMP --> PONE["predict_ionic_conductivity.predict_one(path, T,<br/>IONIC_MODELS, apply_corrector=True,<br/>AlignOpts(strict=False))"]
    PONE --> OUT2["formula / SG / volume / density /<br/>Ea / corrected σ"]
```

---

## 6. IonCast Ionic-Conductivity Predictor Flow (`backend/predict_ionic_conductivity.py`)

```mermaid
flowchart LR
    CIF["CIF file"] --> FEAT["extract_obliex_style_features"]
    subgraph FEATGROUP["Feature engineering"]
        F1["MAGPIE/stoichiometry/valence/ion props (matminer)"]
        F2["DensityFeatures"]
        F3["GlobalSymmetryFeatures"]
        F4["CrystalNN bond lengths + coordination numbers"]
        F5["Li-site geometry + Wyckoff multiplicities"]
        F6["Li percolation dimensionality"]
        F7["optional MP DFT fields (if API key)"]
    end
    FEAT --> FEATGROUP
    FEATGROUP --> ALIGN["align_features — schema-safe alignment,<br/>per-model default-fraction diagnostics"]
    ALIGN --> M2A["Model A: log10 prefactor"]
    ALIGN --> BASE["LightGBM/XGB base models"]
    ALIGN --> QTF["QuantileTransformer → MLPs"]
    BASE & QTF --> META["meta learner"]
    META --> EA["Ea = clip(expm1(log_pred)/10, 0.005–5.0 eV)"]
    EA --> ARR["σ = A·exp(−Ea/kT)"]
    ARR --> CORR{"v6 OBLiEx<br/>corrector?"}
    CORR -- yes --> RESCORR["LightGBM residual<br/>anchored −3.585 log10(S/cm)@298.15<br/>+ temperature shift"]
    CORR -- no --> OUT
    RESCORR --> OUT["final log10 σ(S/cm) + reliability<br/>(PROVISIONAL if imputation > AlignOpts limit)"]
```

---

## 7. M3GNet-like Service Flow (`backend/model_service.py`)

```mermaid
flowchart TD
    LOAD["load_models() @ startup"] --> PK["joblib pickles:<br/>v5_base / v5_mlp / v5_meta /<br/>v5_quantile_transformer / v5_model2_A / v6"]
    REQ["predict_from_cif(cif, T)"] --> DESC["cif_descriptors.computed_descriptors(structure)<br/>lattice geometry, per-site stats (ddof=1),<br/>SG number → aliases cif_v2_c2_*/cif_v3_c3_*/comp_form_*"]
    DESC --> ALIAS["extract_features() — column alias mapping"]
    ALIAS --> PRED["predict → Ea, logA, σ (base + corrected)"]
    PRED --> HES["HES = cond_score*0.6 + ea_score*0.4"]
    PRED --> COV["feature_coverage:<br/>DFT-only vs dataset-relative vs structural missing"]
    PRED --> TS["temperature series 250–1000 K"]
    PRED --> TS2["trial_results block + honesty warnings<br/>(incl. LOG_A_MODEL_IS_CONSTANT probe)"]
    VAL["Surrogative_models/final_validation/validators.py<br/>PredictionValidator: features/ea/log_a/σ ranges"] --> PRED
```

---

## 8. Dataset Exploration Data Flow

```mermaid
flowchart LR
    subgraph REMOTE
        MP[(Materials Project<br/>mp-api)]
        OQMDDB[(OQMD REST)]
        AFLOWDB[(AFLOW AFLUX)]
        JV[(JARVIS OPTIMADE)]
    end
    subgraph LOCAL
        CSV1[("src/data/indianmatter<br/>38510.csv 2.68MB")]
        CSV2[("pymatgen_matminer.csv 59.8MB<br/>(usecols: filename, lattice… )")]
        CIFD[("38510_CIFs/")]
    end
    MR["materials_routes.py<br/>/api/materials/explore"] --> MP
    OR["oqmd.py"] --> OQMDDB
    AR2["aflow.py"] --> AFLOWDB
    JR["jarvis.py"] --> JV
    IMR["indianmatter.py<br/>cached module-global DataFrame"] --> CSV1
    IMR --> CSV2
    IMR --> HEUR["FILTER_COLUMNS (17 range pairs)<br/>stability: E_hull ≤ 0.025 eV/atom<br/>crystal_system: lattice-metric heuristic"]
    IMR --> CIFD
    DR["database_routes.py<br/>/api/dataset/search<br/>pagination + element modes"] --> CSV1
    CSVOUT["CSV download endpoints"] --> IMR
```

---

## 9. Unwired / Legacy Pipeline (present, NOT routed)

```mermaid
flowchart TD
    subgraph UNWIRED["⛔ Not included in main.py — dead code paths"]
        PR["services/prediction_service.py"]
        PW["workers/prediction_worker.py<br/>(optional Celery/Redis execution)"]
        MR2["prediction_models/model_registry.py<br/>(m3gnet, chgnet, mace adapters)"]
        EOS["calculations/eos.py<br/>±8% volume scan + Murnaghan fit"]
        ALN["calculations/alignn_properties.py<br/>PLACEHOLDER (returns −2.35 eV)"]
    end
    T1["tests/test_api_routes.py expects<br/>/api/materials-prediction/system|devices|properties|models/capabilities|predictions"]
    T1 -.missing router & missing modules.->
        MISS["❌ imports missing:<br/>properties.property_registry<br/>calculations.strain_response"]
    PW --> JM["core/job_manager.py<br/>JobState + JobManager"]
    PW --> DL["services/download_service<br/>CSV/JSON/report/ZIP package"]
    CORE["core/: config.py (PREDICTION_ env),<br/>exceptions.py, device_manager.py"] --> PW
```

---

## 10. File-to-File Connection Matrix

```
backend/main.py
 ├─→ routes/auth_routes.py ──→ auth.py ──→ database.py ──→ MongoDB
 │                        └──→ db_models.py
 ├─→ routes/user_routes.py ──→ auth.py, database.py
 ├─→ routes/cif_routes.py (pymatgen CifParser)
 ├─→ routes/materials_routes.py (mp_api.MPRester)
 ├─→ routes/oqmd.py, aflow.py, jarvis.py (remote REST)
 ├─→ routes/indianmatter.py, database_routes.py (local CSVs)
 ├─→ api/calculator_router.py
 │     ├─→ prediction/BFSY_pipeline.py (chgnet_logK/logG/Ef .pkl)
 │     ├─→ chgnet_bandgap_model.pkl, chgnet_thermal_model.pkl
 │     ├─→ predict_ionic_conductivity.load_models() (v5_*.pkl, v6_*.pkl)
 │     ├─→ utils/chgnet_features.py (global CHGNetCalculator)
 │     └─→ properties/ionic_conductivity.py
 ├─→ routes/transport_router.py ──→ predict_ionic_conductivity.predict_one
 └─→ webapp.py (mounted sub-app) ──→ cif_pipeline/* — see CIF artifact

Support modules:
 • model_paths.py — resolves pretrained_models dir (used by calculator_router, transport_router, model_service)
 • megnet_patch.py — pymatgen local_env NN-class shims so MEGNet imports work
 • train_mechanical.py / train_electrical.py / train_thermal.py — offline trainers → chgnet_*.pkl in pretrained_models/
 • cif_analyzer/cif_analyzer/backend.py — standalone demo backend, NOT mounted
 • scripts/check_models.py, run_inference_cif.py — exercise prediction paths
```

---

## 11. Known Gaps / Notes

| # | Gap |
|---|---|
| 1 | `/api/materials-prediction/*` router exists in tests but **not included** in `main.py`; backing modules import missing `properties.property_registry`, `calculations.strain_response` |
| 2 | `/trial/predict` route doesn't exist — frontend `src/lib/api.ts` calls a dead endpoint |
| 3 | `auth.py` SECRET_KEY & Mongo URL hardcoded (should be env) |
| 4 | OQMD/AFLOW/JARVIS structure+CIF download endpoints are 501 stubs |
| 5 | `indianmatter.py` crystal-system detection is a lattice-metric heuristic, not real symmetry analysis |
