# IndianMatter — Master Architecture: Complete Flowchart & File Guide

> **Coverage**: Frontend (React/Vite) → Backend (FastAPI) → CIF Generator Pipeline → ML Models  
> **Entry Point**: `backend/main.py` on port **8000** | Frontend: `src/main.tsx` (Vite)

---

## Part 0: 30,000-Foot System View

```mermaid
flowchart TB
    subgraph USER["🧑‍🔬 Client Presentation Tier (frontend/src/)"]
        LP["<b>Activity:</b> Public Presentation<br/><b>File:</b> frontend/src/pages/LandingPage.tsx<br/><b>Route:</b> /"]
        DASH["<b>Activity:</b> Materials Science Dashboard<br/><b>File:</b> frontend/src/pages/DashboardPage.tsx<br/><b>Route:</b> /app"]
        CIF_UI["<b>Activity:</b> CIF Synthesis Studio<br/><b>File:</b> frontend/src/pages/cif/CIFGenerationPage.tsx<br/><b>Route:</b> /app/cif-gen"]
        PP_UI["<b>Activity:</b> Property Prediction Studio<br/><b>File:</b> frontend/src/pages/prediction/PropertyPredictionPage.tsx<br/><b>Route:</b> /app/predict"]
        BATCH_UI["<b>Activity:</b> High-Throughput Batch Queue<br/><b>File:</b> frontend/src/pages/batch/BatchPredictionPage.tsx<br/><b>Route:</b> /app/batch"]
        MAT_UI["<b>Activity:</b> Multi-Database Search Explorer<br/><b>File:</b> frontend/src/pages/materials/MaterialsSearchPage.tsx<br/><b>Route:</b> /app/materials"]
        VIZ_UI["<b>Activity:</b> 3D Crystallographic Visualizer<br/><b>File:</b> frontend/src/pages/structure/StructureVizPage.tsx<br/><b>Route:</b> /app/structure"]
        LIT_UI["<b>Activity:</b> AI Literature Synthesis<br/><b>File:</b> frontend/src/pages/LiteraturePage.tsx<br/><b>Route:</b> /app/literature"]
    end

    subgraph BACKEND["⚙️ FastAPI Gateway Tier (backend/main.py:8000)"]
        AUTH_R["<b>Activity:</b> User Auth & JWT Issuance<br/><b>File:</b> backend/routes/auth_routes.py<br/><b>Prefix:</b> /api/auth"]
        USERS_R["<b>Activity:</b> User Profiles & Saved Materials<br/><b>File:</b> backend/routes/user_routes.py<br/><b>Prefix:</b> /api/users"]
        CALC_R["<b>Activity:</b> Materials Calculations & Property Pipelines<br/><b>File:</b> backend/api/calculator_router.py<br/><b>Prefix:</b> /api/calculations"]
        DB_R["<b>Activity:</b> Curated Dataset Search & CIF Streaming<br/><b>Files:</b> backend/routes/database_routes.py & indianmatter.py<br/><b>Prefix:</b> /api/dataset | /api/indianmatter"]
        EXT_R["<b>Activity:</b> Remote Materials Database Federation<br/><b>Files:</b> backend/routes/materials_routes.py, oqmd.py, jarvis.py, aflow.py<br/><b>Prefix:</b> /api/materials | /api/oqmd | /api/jarvis | /api/aflow"]
        CIF_R_PARSE["<b>Activity:</b> Server-Side CIF Parser<br/><b>File:</b> backend/routes/cif_routes.py<br/><b>Prefix:</b> /api/cif"]
        CIF_SUB["<b>Activity:</b> Dedicated CIF Synthesis Sub-App<br/><b>File:</b> cif_generator/webapp.py<br/><b>Prefix:</b> /cif/*"]
    end

    subgraph PIPELINE["🔬 CIF Generator Pipeline (cif_generator/cif_pipeline/)"]
        ORCH["<b>Activity:</b> Master 6-Stage Pipeline Orchestration<br/><b>File:</b> cif_generator/cif_pipeline/orchestrator.py<br/><b>Function:</b> run_pipeline()"]
        GEN_AI["<b>Activity:</b> CrystaLLM Generative AI Loop<br/><b>File:</b> cif_generator/cif_pipeline/generate.py<br/><b>Function:</b> generate_cif_crystallm()"]
        DOPE_ENG["<b>Activity:</b> Solid-State Doping & Archetype Engines<br/><b>Files:</b> cif_generator/cif_pipeline/dopant_pipeline.py & general_doping.py<br/><b>Function:</b> generate_doped_cif()"]
        RELAX_ENG["<b>Activity:</b> DFT-Accuracy MACE Cell Relaxation<br/><b>File:</b> cif_generator/cif_pipeline/relax.py<br/><b>Function:</b> relax_with_mace()"]
    end

    subgraph MODELS["🤖 Machine Learning Model Tier (property_prediction_models/)"]
        CF_M["<b>Activity:</b> Space-Group Transformer Multitask Predictions<br/><b>File:</b> property_prediction_models/CrystalFormer/crystalformer_service.py<br/><b>Models:</b> 9x .ckpt weights (Ef, Eg, K, G, JARVIS)"]
        BFSY_M["<b>Activity:</b> Voigt-Reuss-Hill Elastic Moduli & Formation Energy<br/><b>File:</b> property_prediction_models/prediction/BFSY_pipeline.py<br/><b>Models:</b> chgnet_logK_model.pkl, chgnet_logG_model.pkl, chgnet_Ef_model.pkl"]
        IONCAST["<b>Activity:</b> Solid-State Fast-Ion Transport Stack (v5+v6)<br/><b>File:</b> backend/predict_ionic_conductivity.py<br/><b>Models:</b> v5_base_models, v5_meta, v6_corrector"]
        CHG_SURR["<b>Activity:</b> Electronic Band Gap & Phonon Proxies<br/><b>File:</b> backend/api/calculator_router.py<br/><b>Models:</b> chgnet_bandgap_model.pkl, chgnet_thermal_model.pkl"]
        CRYSTALLM["<b>Activity:</b> Autoregressive CIF Token Generation<br/><b>File:</b> cif_generator/cif_pipeline/generate.py<br/><b>Weight:</b> CrystaLLM ckpt.pt (nanoGPT)"]
        MACE["<b>Activity:</b> Equivariant Interatomic Potential<br/><b>File:</b> cif_generator/cif_pipeline/relax.py<br/><b>Model:</b> MACE-MP-0 (medium)"]
    end

    subgraph DATA["💾 Persistence & External Data Tier"]
        MONGO[("<b>Activity:</b> User Accounts & Prediction History<br/><b>File:</b> backend/database.py<br/><b>Database:</b> MongoDB IndianMaterialsAI")]
        LOCAL_CSV[("<b>Activity:</b> Curated Material Tables & CIF Files<br/><b>Files:</b> src/data/indianmatter/38510.csv & 38510_CIFs/<br/><b>Storage:</b> Local Disk CSV & Files")]
        MP_DB[("<b>Activity:</b> Materials Project Phase Diagrams<br/><b>Client:</b> mp_api.MPRester<br/><b>API:</b> api.materialsproject.org")]
        OQMD_DB[("<b>Activity:</b> Open Quantum Materials Database<br/><b>API:</b> api.oqmd.org/optimade")]
        COD_DB[("<b>Activity:</b> Crystallography Open Database<br/><b>API:</b> crystallography.net")]
        JARVIS_DB[("<b>Activity:</b> JARVIS-DFT OPTIMADE Gateway<br/><b>API:</b> jarvis.nist.gov")]
        SUPA_DB[("<b>Activity:</b> Research Publications & Literature<br/><b>Client:</b> @supabase/supabase-js<br/><b>Table:</b> papers")]
    end

    USER -->|"HTTP fetch()"| BACKEND
    CIF_UI -->|"POST /cif/api/generate"| CIF_SUB
    PP_UI -->|"POST /api/calculations/predict-properties"| CALC_R
    BATCH_UI -->|"POST /api/calculations/batch-predict"| CALC_R
    MAT_UI -->|"GET /api/indianmatter/explore"| DB_R
    MAT_UI -->|"GET /api/materials|oqmd|jarvis|aflow"| EXT_R
    LIT_UI -->|"Supabase client"| SUPA_DB

    CIF_SUB --> PIPELINE
    CALC_R --> MODELS
    PIPELINE --> MODELS
    PIPELINE --> MP_DB & OQMD_DB & COD_DB & JARVIS_DB
    DB_R --> LOCAL_CSV
    EXT_R --> MP_DB & OQMD_DB & JARVIS_DB
    AUTH_R --> MONGO
    USERS_R --> MONGO
```

---

## Part 1: Frontend in Detail

### 1.1 Boot & Route Tree

```mermaid
flowchart TD
    HTML["<b>Activity:</b> Load HTML Shell & Google SDK<br/><b>File:</b> frontend/index.html<br/><b>Container:</b> #root container & favicon"]
    MAIN["<b>Activity:</b> Mount React Root & Providers<br/><b>File:</b> frontend/src/main.tsx<br/><b>Providers:</b> ThemeProvider + BrowserRouter"]
    APP["<b>Activity:</b> Render Route Tree & Layout Guards<br/><b>File:</b> frontend/src/App.tsx<br/><b>Component:</b> App()"]
    GUARD["<b>Activity:</b> Authenticate Route Access<br/><b>File:</b> frontend/src/contexts/ProtectedRoute.tsx<br/><b>Check:</b> AuthContext.isAuthenticated"]

    HTML --> MAIN --> APP --> GUARD

    GUARD -- "not auth" --> SIGNIN["<b>Activity:</b> Redirect to Sign In<br/><b>File:</b> frontend/src/pages/auth/SignInPage.tsx<br/><b>Route:</b> /signin"]
    GUARD -- "auth" --> MAIN_LAYOUT

    subgraph MAIN_LAYOUT["Main Application Shell (frontend/src/layouts/MainLayout.tsx)"]
        DASH_P["<b>Activity:</b> Research Dashboard<br/><b>File:</b> frontend/src/pages/DashboardPage.tsx<br/><b>Route:</b> /app"]
        MAT_P["<b>Activity:</b> Materials Database Search<br/><b>File:</b> frontend/src/pages/materials/MaterialsSearchPage.tsx<br/><b>Route:</b> /app/materials"]
        CIF_P["<b>Activity:</b> CIF Synthesis Studio<br/><b>File:</b> frontend/src/pages/cif/CIFGenerationPage.tsx<br/><b>Route:</b> /app/cif-gen"]
        PP_P["<b>Activity:</b> Property Prediction Studio<br/><b>File:</b> frontend/src/pages/prediction/PropertyPredictionPage.tsx<br/><b>Route:</b> /app/predict"]
        BATCH_P["<b>Activity:</b> High-Throughput Batch Queue<br/><b>File:</b> frontend/src/pages/batch/BatchPredictionPage.tsx<br/><b>Route:</b> /app/batch"]
        SV_P["<b>Activity:</b> 3D Structure Visualizer<br/><b>File:</b> frontend/src/pages/structure/StructureVizPage.tsx<br/><b>Route:</b> /app/structure"]
        LIT_P["<b>Activity:</b> Literature AI Browser<br/><b>File:</b> frontend/src/pages/LiteraturePage.tsx<br/><b>Route:</b> /app/literature"]
        DFT_P["<b>Activity:</b> DFT Validation View<br/><b>File:</b> frontend/src/pages/dft/DFTValidationPage.tsx<br/><b>Route:</b> /app/dft"]
        SAV_P["<b>Activity:</b> Saved Results Storage<br/><b>File:</b> frontend/src/pages/SavedResultsPage.tsx<br/><b>Route:</b> /app/saved"]
    end

    subgraph PUBLIC_LAYOUT["Public Presentation Shell (frontend/src/layouts/PublicLayout.tsx)"]
        LAND_P["<b>Activity:</b> Public Homepage<br/><b>File:</b> frontend/src/pages/LandingPage.tsx<br/><b>Route:</b> /"]
        PAPERS_P["<b>Activity:</b> Research Paper Library<br/><b>File:</b> frontend/src/pages/ResearchPapersPage.tsx<br/><b>Route:</b> /research-papers"]
    end
```

### 1.2 Auth Flow

| File | What it does |
|---|---|
| `src/contexts/AuthContext.tsx` | Holds `isAuthenticated`, `signIn()`, `signOut()`. Dev mode auto-fills 'Dr. Subodh Kumar'. Token stored in **localStorage** only — no server verification. |
| `src/contexts/ProtectedRoute.tsx` | Checks AuthContext. Remembers the attempted route in `?redirect=` and restores it after login. |
| `src/pages/auth/SignInPage.tsx` | Email input → fake `signIn()` OR real OAuth via backend. |
| `src/layouts/MainLayout.tsx` | App shell rendering Sidebar + TopHeader + page Outlet. |

```mermaid
flowchart LR
    EMAIL["<b>Activity:</b> Submit Credentials<br/><b>File:</b> frontend/src/pages/auth/SignInPage.tsx<br/><b>Input:</b> email + password"] --> FAKE["<b>Activity:</b> Dev Fast Sign-In<br/><b>File:</b> frontend/src/contexts/AuthContext.tsx<br/><b>Action:</b> signIn() -> localStorage"]
    GOOGLE["<b>Activity:</b> Click Google OAuth<br/><b>File:</b> frontend/src/pages/auth/SignInPage.tsx<br/><b>Button:</b> Google Auth"] --> BK_GOOGLE["<b>Activity:</b> Initiate Google Redirect<br/><b>File:</b> backend/routes/auth_routes.py<br/><b>Endpoint:</b> GET /api/auth/google/login"]
    GITHUB["<b>Activity:</b> Click GitHub OAuth<br/><b>File:</b> frontend/src/pages/auth/SignInPage.tsx<br/><b>Button:</b> GitHub Auth"] --> BK_GITHUB["<b>Activity:</b> Initiate GitHub Redirect<br/><b>File:</b> backend/routes/auth_routes.py<br/><b>Endpoint:</b> GET /api/auth/github/login"]
    BK_GOOGLE & BK_GITHUB --> OAUTH_CB["<b>Activity:</b> Handle OAuth Callback<br/><b>File:</b> backend/routes/auth_routes.py<br/><b>Function:</b> google_callback / github_callback"]
    OAUTH_CB --> PARSE_TOKEN["<b>Activity:</b> Extract JWT from Hash<br/><b>File:</b> frontend/src/pages/auth/SignInPage.tsx<br/><b>Action:</b> window.location.hash -> token"]
    PARSE_TOKEN --> PROFILE["<b>Activity:</b> Fetch User Profile<br/><b>File:</b> backend/routes/user_routes.py<br/><b>Endpoint:</b> GET /api/users/profile"]
    PROFILE --> LS_WRITE["<b>Activity:</b> Store Auth Session<br/><b>File:</b> frontend/src/contexts/AuthContext.tsx<br/><b>Storage:</b> localStorage['accessToken']"]
    FAKE & LS_WRITE --> PROTECTED["<b>Activity:</b> Authorize Route Navigation<br/><b>File:</b> frontend/src/contexts/ProtectedRoute.tsx<br/><b>Target:</b> /app"]
```

### 1.3 Frontend API Layer — `src/lib/*`

| File | Role | Backend Endpoint(s) |
|---|---|---|
| `src/lib/api.ts` | Base URL resolution (`VITE_API_BASE_URL \|\| localhost:8000`). `predictFromTrial()` — ⛔ **dead route** `/trial/predict` | ❌ no matching backend route |
| `src/lib/datasetapi.ts` | `searchDatasetMaterials()` for all 5 dataset tabs | `/api/indianmatter/explore`, `/api/materials/explore`, `/api/oqmd/explore`, `/api/jarvis/explore`, `/api/aflow/explore` |
| `src/lib/materialsPredictionApi.ts` | `predictFromCifFile()`, batch prediction helpers | `/api/calculations/predict-properties`, `batch-predict`, `batch-predict-bfsy` |
| `src/lib/cifApi.ts` | **Client-side** CIF parser — no server call. Reads `loop_` blocks, extracts fractional coords, lattice params | Internal → feeds 3D viewers |
| `src/lib/supabase.ts` | `getPublishedPapers()` | Supabase cloud table `papers` |

### 1.4 Key Page Files & Their Connections

```mermaid
flowchart TD
    subgraph PAGES["Active Pages with Backend Connections (frontend/src/pages/)"]
        CIF_GEN["<b>Activity:</b> CIF Synthesis Studio<br/><b>File:</b> frontend/src/pages/cif/CIFGenerationPage.tsx<br/><b>Route:</b> /app/cif-gen<br/><b>API:</b> POST /cif/api/generate via src/lib/cifApi.ts"]

        PROP["<b>Activity:</b> Property Prediction Studio<br/><b>File:</b> frontend/src/pages/prediction/PropertyPredictionPage.tsx<br/><b>Route:</b> /app/predict<br/><b>API:</b> POST /api/calculations/predict-properties via materialsPredictionApi.ts"]

        BATCH["<b>Activity:</b> Batch Prediction Queue<br/><b>File:</b> frontend/src/pages/batch/BatchPredictionPage.tsx<br/><b>Route:</b> /app/batch<br/><b>API:</b> POST /api/calculations/batch-predict + polling status & results"]

        MAT["<b>Activity:</b> Materials Database Explorer<br/><b>File:</b> frontend/src/pages/materials/MaterialsSearchPage.tsx<br/><b>Route:</b> /app/materials<br/><b>API:</b> GET /api/*/explore via src/lib/datasetapi.ts"]

        STRUC["<b>Activity:</b> 3D Crystal Visualizer<br/><b>File:</b> frontend/src/pages/structure/StructureVizPage.tsx<br/><b>Route:</b> /app/structure<br/><b>Components:</b> StructureViewer.tsx (3Dmol.js) & CrystalViewerCanvas.tsx (Three.js)"]

        LIT["<b>Activity:</b> Literature AI Synthesis<br/><b>File:</b> frontend/src/pages/LiteraturePage.tsx<br/><b>Route:</b> /app/literature<br/><b>API:</b> Supabase table query via src/lib/supabase.ts"]
    end

    CIF_GEN -->|"navigate(/app/predict, {state: {cifString}})"| PROP
    CIF_GEN -->|"navigate(/app/structure, {state: {cifData}})"| STRUC
    PROP -->|"POST predict-properties"| CALC_EP["<b>Activity:</b> Multi-Model Property Prediction<br/><b>File:</b> backend/api/calculator_router.py<br/><b>Endpoint:</b> /api/calculations/predict-properties"]
    BATCH -->|"POST batch-predict"| BATCH_EP["<b>Activity:</b> Background Multi-File Prediction Worker<br/><b>File:</b> backend/api/calculator_router.py<br/><b>Endpoint:</b> /api/calculations/batch-predict"]
    MAT -->|"GET explore"| DB_EP["<b>Activity:</b> Federated Materials Dataset Query<br/><b>Files:</b> backend/routes/indianmatter.py, materials_routes.py<br/><b>Endpoint:</b> /api/*/explore"]
```

### 1.5 Visualization Components

| Component | Technology | Input |
|---|---|---|
| `StructureViewer.tsx` | **3Dmol.js** injected via CDN `<script>` at runtime | CIF text string |
| `CrystalViewerCanvas.tsx` | **three.js** bundled WebGL — custom sphere/bond renderer | Parsed `ParsedStructure` from cifApi.ts |
| `PeriodicTable.tsx` | Pure React interactive element grid | Fires element selection callbacks → MaterialsSearchPage filters |
| `ChemicalFormula.tsx` | Renders subscript-formatted formulas (e.g. Li₇La₃Zr₂O₁₂) | Formula string prop |

---

## Part 2: Backend in Detail

### 2.1 Application Startup Flow

```mermaid
flowchart TD
    START(["<b>Activity:</b> Start ASGI Web Server<br/><b>File:</b> backend/main.py<br/><b>Command:</b> uvicorn backend.main:app --port 8000"])
    ENV["<b>Activity:</b> Load Environment Variables<br/><b>File:</b> backend/main.py<br/><b>Function:</b> dotenv.load_dotenv()"]
    SHIM["<b>Activity:</b> Inject ASE Filter Compatibility Shim<br/><b>File:</b> backend/main.py<br/><b>Action:</b> ExpCellFilter ase.filters -> ase.constraints"]
    LIFE["<b>Activity:</b> Execute Startup Lifespan Hook<br/><b>File:</b> backend/main.py<br/><b>Function:</b> async def lifespan(app: FastAPI)"]
    MS["<b>Activity:</b> Preload Machine Learning Weights<br/><b>File:</b> backend/routes/transport_router.py<br/><b>Function:</b> load_models() -> v5_base_models, v5_meta, v6_corrector"]
    CHK_MP{"<b>Activity:</b> Check MP_API_KEY Presence<br/><b>File:</b> backend/main.py<br/><b>Check:</b> 'MP_API_KEY' in os.environ"}
    CHK_OA{"<b>Activity:</b> Check OAuth Credentials<br/><b>File:</b> backend/main.py<br/><b>Check:</b> GOOGLE_CLIENT_ID & GITHUB_CLIENT_ID"}
    READY["<b>Activity:</b> Transition to Live Request Ready State<br/><b>File:</b> backend/main.py<br/><b>Status:</b> All 11 routers + /cif mounted on :8000"]

    START --> ENV --> SHIM --> LIFE --> MS
    MS --> CHK_MP
    CHK_MP -- "yes" --> OK1["<b>Activity:</b> Enable External DB Resters<br/><b>Files:</b> backend/routes/materials_routes.py, oqmd.py"]
    CHK_MP -- "no" --> WARN1["<b>Activity:</b> Log External Rester Warning<br/><b>File:</b> backend/main.py<br/><b>Warning:</b> External DB queries will return 500"]
    LIFE --> CHK_OA
    CHK_OA -- "missing" --> WARN2["<b>Activity:</b> Log Social Auth Warning<br/><b>File:</b> backend/main.py<br/><b>Warning:</b> OAuth disabled; email/password active"]
    MS & OK1 & WARN1 & WARN2 --> READY
```

### 2.2 Router Mount Map (`backend/main.py`)

| Mount Prefix | Router File | What it Does |
|---|---|---|
| `/api/auth` | `routes/auth_routes.py` | Register, login, Google OAuth, GitHub OAuth, JWT issuance |
| `/api/users` | `routes/user_routes.py` | Profile, dashboard, mock predict, save-material |
| `/api/cif` | `routes/cif_routes.py` | Server-side pymatgen CIF parse → JSON |
| `/api/materials` | `routes/materials_routes.py` | MPRester explore query |
| `/api/oqmd` | `routes/oqmd.py` | OQMD REST filter= query |
| `/api/aflow` | `routes/aflow.py` | AFLUX matchbook query |
| `/api/jarvis` | `routes/jarvis.py` | OPTIMADE query + Python post-filters |
| `/api/indianmatter` | `routes/indianmatter.py` | Cached 38510.csv + pymatgen_matminer.csv; CIF serve |
| `/api/dataset` | `routes/database_routes.py` | Paginated 38510.csv periodic-table search |
| `/api/calculations` | `api/calculator_router.py` | CIF → CHGNet feats → BFSY/thermal/bandgap/IonCast |
| `/api/calculations` | `routes/transport_router.py` | Ionic conductivity predict (IonCast stack) |
| `/cif` | `webapp.py` (mounted sub-app) | Full CIF generator pipeline |

### 2.3 Auth System

```mermaid
flowchart LR
    subgraph FILES["Authentication Subsystem Files"]
        AR["<b>Activity:</b> Auth HTTP Handlers<br/><b>File:</b> backend/routes/auth_routes.py<br/><b>Endpoints:</b> register, login, OAuth callbacks"]
        AU["<b>Activity:</b> Password Hashing & JWT Minting<br/><b>File:</b> backend/auth.py<br/><b>Methods:</b> bcrypt hash, verify_password, create_access_token"]
        DBMOD["<b>Activity:</b> Auth Data Contracts<br/><b>File:</b> backend/db_models.py<br/><b>Schemas:</b> UserCreate, UserLogin, Token"]
        DB["<b>Activity:</b> Database Client & Collections<br/><b>File:</b> backend/database.py<br/><b>Client:</b> MongoDB IndianMaterialsAI.users"]
        UR["<b>Activity:</b> Authenticated User Features<br/><b>File:</b> backend/routes/user_routes.py<br/><b>Endpoints:</b> get_profile, save_material"]
    end

    REG["<b>Activity:</b> Submit Registration<br/><b>Endpoint:</b> POST /api/auth/register"] --> AR --> BCRYPT["<b>Activity:</b> Hash Password with Bcrypt<br/><b>File:</b> backend/auth.py<br/><b>Function:</b> get_password_hash()"]
    BCRYPT --> MONGO[("<b>Activity:</b> Persist User Document<br/><b>File:</b> backend/database.py<br/><b>Collection:</b> users_collection.insert_one()")]
    AR --> JWT["<b>Activity:</b> Mint 24h HS256 Token<br/><b>File:</b> backend/auth.py<br/><b>Function:</b> create_access_token({'sub': email})"]
    JWT --> RESP["<b>Activity:</b> Return Token Schema<br/><b>File:</b> backend/db_models.py<br/><b>Model:</b> Token{access_token, user}"]

    GOOGLE["<b>Activity:</b> Initiate Google Login<br/><b>Endpoint:</b> GET /api/auth/google/login"] --> REDIR["<b>Activity:</b> Redirect to Google OAuth<br/><b>File:</b> backend/routes/auth_routes.py<br/><b>Call:</b> oauth.google.authorize_redirect()"]
    CB["<b>Activity:</b> Handle OAuth Code Exchange<br/><b>Endpoint:</b> GET /api/auth/google/callback"] --> VERIFY["<b>Activity:</b> Require Verified Email<br/><b>File:</b> backend/routes/auth_routes.py<br/><b>Check:</b> token['userinfo']['email_verified']"]
    VERIFY --> UPSERT{"<b>Activity:</b> Check User Existence<br/><b>File:</b> backend/database.py<br/><b>Method:</b> users_collection.find_one({'email': email})"}
    UPSERT -- "no" --> CREATE_U["<b>Activity:</b> Insert New OAuth User<br/><b>File:</b> backend/database.py<br/><b>Doc:</b> {'provider': 'google', 'google_id': sub}"]
    UPSERT -- "yes" --> ATTACH["<b>Activity:</b> Link Provider Identity<br/><b>File:</b> backend/database.py<br/><b>Method:</b> update_one({'$addToSet': {'providers': 'google'}}))"]
    CREATE_U & ATTACH --> JWT
    JWT --> REDIR2["<b>Activity:</b> Redirect with URL Hash Token<br/><b>File:</b> backend/routes/auth_routes.py<br/><b>Response:</b> RedirectResponse(FRONTEND_URL/signin#token=JWT)"]

    PROT["<b>Activity:</b> Protected Endpoint Access<br/><b>Header:</b> Authorization: Bearer &lt;token&gt;"] --> BEARER["<b>Activity:</b> Extract Bearer Credentials<br/><b>File:</b> backend/auth.py<br/><b>Object:</b> OAuth2PasswordBearer"]
    BEARER --> DECODE["<b>Activity:</b> Decode & Validate JWT Token<br/><b>File:</b> backend/auth.py<br/><b>Function:</b> jwt.decode(token, SECRET_KEY, ['HS256'])"]
    DECODE --> LOAD_U["<b>Activity:</b> Ingest Current User Context<br/><b>File:</b> backend/auth.py<br/><b>Function:</b> get_current_user()"]
```

### 2.4 Property Prediction Flow (`calculator_router.py`)

```mermaid
flowchart TD
    REQ["<b>Activity:</b> Receive Property Prediction Request<br/><b>File:</b> backend/api/calculator_router.py<br/><b>Endpoint:</b> POST /api/calculations/predict-properties<br/><b>Payload:</b> CIF file, selected properties, temperature=298.15"]

    subgraph LOAD_AT_STARTUP["Module-Level Preloaded Artifacts (backend/api/calculator_router.py)"]
        BFSY_P["<b>Activity:</b> Preload BFSY Elastic Regressors<br/><b>File:</b> property_prediction_models/prediction/BFSY_pipeline.py<br/><b>Models:</b> chgnet_logK_model.pkl, chgnet_logG_model.pkl, chgnet_Ef_model.pkl"]
        BG_M["<b>Activity:</b> Preload Band Gap Surrogate<br/><b>File:</b> property_prediction_models/pretrained_models/chgnet_bandgap_model.pkl"]
        TH_M["<b>Activity:</b> Preload Thermal Proxy Surrogate<br/><b>File:</b> property_prediction_models/pretrained_models/chgnet_thermal_model.pkl"]
        IC_M["<b>Activity:</b> Preload IonCast Transport Stack<br/><b>File:</b> backend/predict_ionic_conductivity.py<br/><b>Models:</b> v5 Stacking Ensemble + v6 Corrector"]
    end

    REQ --> PARSE_S["<b>Activity:</b> Parse Crystal Structure<br/><b>File:</b> backend/api/calculator_router.py<br/><b>Function:</b> pymatgen.core.structure.Structure.from_str(cif_text)"]
    PARSE_S --> CHGFEAT["<b>Activity:</b> Extract 21-Dim Hamiltonian Features<br/><b>File:</b> backend/utils/chgnet_features.py<br/><b>Function:</b> CHGNetCalculator.extract_features(structure)<br/><b>Model:</b> chgnet_model.pt"]

    CHGFEAT --> MECH["<b>Activity:</b> Infer VRH Elastic Moduli & Ef<br/><b>File:</b> property_prediction_models/prediction/BFSY_pipeline.py<br/><b>Function:</b> predict_properties_from_chgnet()<br/><b>Formulas:</b> K=10^logK, G=10^logG, E=9KG/(3K+G), nu, Pugh, compressibility"]
    CHGFEAT --> THERM["<b>Activity:</b> Infer Phonon Frequency & Lattice Thermal Proxy<br/><b>File:</b> backend/api/calculator_router.py<br/><b>Model:</b> chgnet_thermal_model.pkl<br/><b>Target:</b> omega_ph cm^-1 -> Debye T & kappa_lat"]
    CHGFEAT --> ELEC["<b>Activity:</b> Infer Band Gap & Conduction State<br/><b>File:</b> backend/api/calculator_router.py<br/><b>Model:</b> chgnet_bandgap_model.pkl<br/><b>Target:</b> Eg (eV) -> Metal / Semiconductor / Insulator"]
    PARSE_S --> IONIC["<b>Activity:</b> Infer Solid-State Fast-Ion Transport<br/><b>File:</b> backend/properties/ionic_conductivity.py<br/><b>Class/Method:</b> IonicConductivityCalculator.predict_one()<br/><b>Target:</b> Arrhenius sigma(T) S/cm & Ea eV"]

    MECH & THERM & ELEC & IONIC --> RESP["<b>Activity:</b> Format Unified Materials Prediction JSON<br/><b>File:</b> backend/api/calculator_router.py<br/><b>Output:</b> {material_metadata, properties: {bulk_modulus, shear_modulus, band_gap, ...}}"]
```

### 2.5 Batch Prediction System

```mermaid
flowchart LR
    UPLOAD["<b>Activity:</b> Receive Batch Upload Payload<br/><b>File:</b> backend/api/calculator_router.py<br/><b>Endpoint:</b> POST /api/calculations/batch-predict<br/><b>Payload:</b> .cif files or .zip archive + property list"]
    UPLOAD --> EXTRACT["<b>Activity:</b> Decompress & Extract CIF Files<br/><b>File:</b> backend/api/calculator_router.py<br/><b>Function:</b> _extract_cif_items_from_uploads(files)"]
    EXTRACT --> JOB_CREATE["<b>Activity:</b> Register Asynchronous Job State<br/><b>File:</b> backend/api/calculator_router.py<br/><b>Data Structure:</b> BATCH_JOBS[uuid] = {status: 'processing', total, results: []}"]
    JOB_CREATE --> BG_TASK["<b>Activity:</b> Dispatch Background Worker Task<br/><b>File:</b> backend/api/calculator_router.py<br/><b>Function:</b> BackgroundTasks.add_task(run_batch_prediction_worker)"]
    JOB_CREATE --> ACK["<b>Activity:</b> Acknowledge Job Submission<br/><b>File:</b> backend/api/calculator_router.py<br/><b>Response:</b> HTTP 202 Accepted {job_id, total, status}"]

    BG_TASK --> LOOP{"<b>Activity:</b> Iterate Through Structure Items<br/><b>File:</b> backend/api/calculator_router.py<br/><b>Loop:</b> for (filename, cif_text) in cif_items"}
    LOOP --> ROW["<b>Activity:</b> Execute Model Inference Per Structure<br/><b>File:</b> backend/api/calculator_router.py<br/><b>Function:</b> process_single_cif_record()<br/><b>Models:</b> SpacegroupAnalyzer + BFSY + Bandgap + Thermal + IonCast"]
    ROW --> UPDATE["<b>Activity:</b> Append Result & Update Progress<br/><b>File:</b> backend/api/calculator_router.py<br/><b>Action:</b> BATCH_JOBS[id]['results'].append(row)"]
    UPDATE --> LOOP

    POLL["<b>Activity:</b> Poll Job Progress<br/><b>File:</b> backend/api/calculator_router.py<br/><b>Endpoint:</b> GET /batch-predict/status/{id}"] --> STATUS_R["<b>Activity:</b> Return Progress Telemetry<br/><b>Payload:</b> {progress, completed, total, current_file}"]
    RESULTS["<b>Activity:</b> Fetch Completed Predictions<br/><b>File:</b> backend/api/calculator_router.py<br/><b>Endpoint:</b> GET /batch-predict/results/{id}"] --> RES_R["<b>Activity:</b> Return Predictions Array<br/><b>Payload:</b> {results: [...rows], summary}"]
    DOWNLOAD["<b>Activity:</b> Download Batch Results CSV<br/><b>File:</b> backend/api/calculator_router.py<br/><b>Endpoint:</b> GET /batch-predict/download/{id}"] --> CSV_R["<b>Activity:</b> Stream Generated CSV File<br/><b>File:</b> backend/api/calculator_router.py<br/><b>Function:</b> generate_csv_string(records) -> StreamingResponse"]
```

### 2.6 IonCast Ionic Conductivity Predictor

**File**: `backend/predict_ionic_conductivity.py`

```mermaid
flowchart TD
    CIF_IN["<b>Activity:</b> Ingest CIF Crystal Structure<br/><b>File:</b> backend/predict_ionic_conductivity.py<br/><b>Function:</b> IonConductivityPredictor.predict_one(cif_path)"] --> FEAT["<b>Activity:</b> Multi-Descriptor Feature Extraction<br/><b>File:</b> backend/predict_ionic_conductivity.py<br/><b>Function:</b> extract_obliex_style_features(structure)"]

    subgraph FEAT_GROUP["Feature Engineering Modules (backend/predict_ionic_conductivity.py)"]
        F1["<b>Activity:</b> MAGPIE Compositional Descriptors<br/><b>Class:</b> matminer.featurizers.composition.ElementProperty"]
        F2["<b>Activity:</b> Density & Volume Metrics<br/><b>Class:</b> matminer.featurizers.structure.DensityFeatures"]
        F3["<b>Activity:</b> Global Symmetry Features<br/><b>Class:</b> matminer.featurizers.structure.GlobalSymmetryFeatures"]
        F4["<b>Activity:</b> CrystalNN Coordination Numbers<br/><b>Class:</b> pymatgen.analysis.local_env.CrystalNN"]
        F5["<b>Activity:</b> Li Wyckoff Multiplicities & Site Topology<br/><b>Function:</b> compute_li_geometry()"]
        F6["<b>Activity:</b> Percolation Connectivity Dimensionality<br/><b>Function:</b> estimate_percolation_dim()"]
        F7["<b>Activity:</b> Materials Project DFT Properties<br/><b>Service:</b> MPRester.get_entry() (if MP_API_KEY present)"]
    end

    FEAT --> FEAT_GROUP --> ALIGN["<b>Activity:</b> Align Feature Schema & Impute<br/><b>File:</b> backend/predict_ionic_conductivity.py<br/><b>Function:</b> align_features(raw_features, expected_cols)"]

    ALIGN --> QT["<b>Activity:</b> Quantile Normalization to Gaussian<br/><b>File:</b> property_prediction_models/pretrained_models/v5_quantile_transformer.pkl<br/><b>Class:</b> sklearn.preprocessing.QuantileTransformer"]
    QT --> MA["<b>Activity:</b> Infer Arrhenius Prefactor log10(A)<br/><b>File:</b> property_prediction_models/pretrained_models/v5_model2_A.pkl<br/><b>Model:</b> GradientBoostingRegressor (Model A)"]
    QT --> BASE_ENS["<b>Activity:</b> Infer Base Regressor Layer<br/><b>File:</b> property_prediction_models/pretrained_models/v5_base_models.pkl<br/><b>Models:</b> XGBoost + LightGBM + ExtraTrees Ensemble"]
    QT --> MLP_ENS["<b>Activity:</b> Infer Deep Neural Layer<br/><b>File:</b> property_prediction_models/pretrained_models/v5_mlp_models.pkl<br/><b>Models:</b> 3-Layer MLP Regressor Ensemble"]

    BASE_ENS & MLP_ENS --> META["<b>Activity:</b> Execute Stacking Meta-Learner<br/><b>File:</b> property_prediction_models/pretrained_models/v5_meta_model.pkl<br/><b>Model:</b> Ridge Stacking Regressor"]
    META --> LOG_PRED["<b>Activity:</b> Predict Scaled Conduction Target<br/><b>Target:</b> log(sigma + 1)"]
    LOG_PRED --> EA_CALC["<b>Activity:</b> Calculate Activation Energy (Ea)<br/><b>File:</b> backend/predict_ionic_conductivity.py<br/><b>Formula:</b> Ea = clip(expm1(log_pred)/10, 0.005, 5.0 eV)"]
    EA_CALC --> ARR["<b>Activity:</b> Calculate Arrhenius Conduction<br/><b>File:</b> backend/predict_ionic_conductivity.py<br/><b>Formula:</b> sigma(T) = (A / T) * exp(-Ea / (k_B * T))"]

    ARR --> CORR{"<b>Activity:</b> Check Corrector Model Availability<br/><b>File:</b> backend/predict_ionic_conductivity.py<br/><b>Condition:</b> v6_corrector_model is not None"}
    CORR -- "yes" --> V6["<b>Activity:</b> Apply Experimental Residual Shift<br/><b>File:</b> property_prediction_models/pretrained_models/v6_corrector_model.pkl<br/><b>Model:</b> LightGBM Residual anchored at -3.585 log10(S/cm)"]
    CORR -- "no" --> FLAG
    V6 --> FLAG["<b>Activity:</b> Evaluate Honesty & Reliability Flag<br/><b>File:</b> backend/predict_ionic_conductivity.py<br/><b>Flags:</b> OK vs PROVISIONAL based on imputation"]
    FLAG --> FINAL["<b>Activity:</b> Synthesize Final Output Payload<br/><b>File:</b> backend/predict_ionic_conductivity.py<br/><b>Output:</b> {log10_sigma_s_cm, Ea_eV, log10_A, reliability_flag, corrector_applied}"]
```

### 2.7 Dataset Explorer Flow

```mermaid
flowchart LR
    subgraph LOCAL_DATA["Local Curated Repositories (src/data/indianmatter/)"]
        CSV1[("<b>Activity:</b> Primary Materials Table (38,510 items)<br/><b>File:</b> src/data/indianmatter/38510.csv<br/><b>Fields:</b> mv_id, Formula, nsites, Ef, Eg, K, G")]
        CSV2[("<b>Activity:</b> Matminer Structural Features (59.8 MB)<br/><b>File:</b> src/data/indianmatter/pymatgen_matminer.csv<br/><b>Fields:</b> 152 crystallographic descriptors")]
        EMBEDS[("<b>Activity:</b> Precomputed GNN Embeddings<br/><b>Files:</b> chgnet_128_embeddings.csv & m3gnet_embeddings.csv")]
        CIF_DIR[("<b>Activity:</b> Exact Crystallographic CIF Directory<br/><b>Directory:</b> src/data/indianmatter/38510_CIFs/<br/><b>Count:</b> 38,510 files")]
    end
    subgraph REMOTE_DATA["Remote Materials Databases (External APIs)"]
        MP_API[("<b>Activity:</b> Materials Project Phase Diagram API<br/><b>Client:</b> mp_api.client.MPRester<br/><b>Auth:</b> MP_API_KEY")]
        OQMD_API[("<b>Activity:</b> Open Quantum Materials Database<br/><b>API:</b> api.oqmd.org/optimade<br/><b>Protocol:</b> OPTIMADE filter grammar")]
        AFLOW_API[("<b>Activity:</b> AFLOW Materials Repository<br/><b>API:</b> aflowlib.duke.edu<br/><b>Protocol:</b> AFLUX matchbook query")]
        JAR_API[("<b>Activity:</b> NIST JARVIS-DFT Repository<br/><b>API:</b> jarvis.nist.gov<br/><b>Protocol:</b> OPTIMADE v1 REST")]
    end

    IM_R["<b>Activity:</b> Route IndianMatter Explorer & CIF Streaming<br/><b>File:</b> backend/routes/indianmatter.py<br/><b>Endpoints:</b> GET /api/indianmatter/explore & /structure/{id}"] --> CSV1 & CSV2
    IM_R --> CIF_DIR
    DB_R["<b>Activity:</b> Route Periodic Table Dataset Search<br/><b>File:</b> backend/routes/database_routes.py<br/><b>Endpoint:</b> GET /api/dataset/search"] --> CSV1
    MAT_R["<b>Activity:</b> Route Materials Project Explorer<br/><b>File:</b> backend/routes/materials_routes.py<br/><b>Endpoint:</b> GET /api/materials/explore"] --> MP_API
    OQMD_R["<b>Activity:</b> Route OQMD Database Explorer<br/><b>File:</b> backend/routes/oqmd.py<br/><b>Endpoint:</b> GET /api/oqmd/explore"] --> OQMD_API
    AFL_R["<b>Activity:</b> Route AFLOW Database Explorer<br/><b>File:</b> backend/routes/aflow.py<br/><b>Endpoint:</b> GET /api/aflow/explore"] --> AFLOW_API
    JAR_R["<b>Activity:</b> Route JARVIS-DFT Database Explorer<br/><b>File:</b> backend/routes/jarvis.py<br/><b>Endpoint:</b> GET /api/jarvis/explore"] --> JAR_API
```

---

## Part 3: CIF Generator Pipeline in Detail

### 3.1 Overview — What `webapp.py` Exposes

| Endpoint | Handler | Purpose |
|---|---|---|
| `POST /cif/api/generate` | `orchestrator.run_pipeline()` | Full 6-stage pipeline: recognize → classify → search → generate/dope → relax → return CIF |
| `POST /cif/api/parse-formula` | inline | Fast, no-generation: recognition + composition breakdown + doping classification + site recommendations |
| `POST /cif/api/doped-cif` | `dopant_pipeline.generate_doped_cif()` | Dedicated structure-aware doping engine |
| `POST /cif/api/resolve-disambiguation` | `user_interaction.pick_option_index` | User picks a polymorph from candidates list |
| `POST /cif/api/symmetry-matrix` | `symmetry_matrix.compute_symmetry_matrix` | Returns optimal supercell transformation matrix |
| `POST /cif/api/mesp-check` | `mesp_check.check_mesp_and_relaxation` | Electrostatic plausibility check of given CIF |
| `POST /cif/api/batch-process` | `batch_processor.run_batch_pipeline(cases)` | Bulk pipeline over list of test cases |
| `GET /cif/api/health` | inline | Reports CrystaLLM ready, MACE device, MP key status |

> **Design rule**: `_web_ask_handler` always returns `None` — pipeline never silently guesses on ambiguity. Unresolved polymorphs are surfaced as `source='ambiguous_polymorphs'` for the UI to present a picker.

### 3.2 Master Generation Flow

```mermaid
flowchart TD
    REQ["<b>Activity:</b> Ingest Synthesis Request<br/><b>File:</b> cif_generator/webapp.py<br/><b>Endpoint:</b> POST /cif/api/generate<br/><b>Model:</b> GenerationRequest(formula, doping_spec)"]
    REQ --> EMPTY{"<b>Activity:</b> Validate Non-Empty Input<br/><b>File:</b> cif_generator/cif_pipeline/orchestrator.py<br/><b>Check:</b> formula.strip() != ''"}
    EMPTY -- "yes" --> FAIL1["<b>Activity:</b> Abort Pipeline Run<br/><b>File:</b> cif_generator/cif_pipeline/orchestrator.py<br/><b>Output:</b> PipelineResult(source='failed', message='Empty formula')"]
    EMPTY -- "no" --> S0

    S0["<b>Activity:</b> Stage 0 Recognition Gateway<br/><b>File:</b> cif_generator/cif_pipeline/recognition.py<br/><b>Function:</b> recognize_compound_formula()"]
    subgraph RECOG_STEPS["Recognition Sub-Steps (cif_generator/cif_pipeline/recognition.py)"]
        R1["<b>Activity:</b> Clean Text Noise<br/><b>Function:</b> clean_formula_text()"]
        R2["<b>Activity:</b> Fictitious Element Filter<br/><b>Function:</b> reject_pseudo_elements()"]
        R3["<b>Activity:</b> Extract Formula Candidates<br/><b>Function:</b> extract_formula_candidates()"]
        R4["<b>Activity:</b> Resolve Algebraic x-Notation<br/><b>Function:</b> resolve_x_notation()"]
        R5["<b>Activity:</b> Expand Chemical Acronyms<br/><b>Function:</b> lookup_abbreviation()"]
        R6["<b>Activity:</b> Mineral Common Name Lookup<br/><b>Function:</b> lookup_common_name()"]
        R7["<b>Activity:</b> Case Normalization<br/><b>Function:</b> _try_case_normalization()"]
    end
    S0 --> RECOG_STEPS --> RR["<b>Activity:</b> Return Recognition Result<br/><b>File:</b> cif_generator/cif_pipeline/models.py<br/><b>Schema:</b> RecognitionResult(resolved_formula)"]

    RR --> S1["<b>Activity:</b> Stage 1 Doping Classification<br/><b>File:</b> cif_generator/cif_pipeline/classify.py<br/><b>Function:</b> classify_compound()"]
    subgraph CLASS_STEPS["Classification Hierarchy (cif_generator/cif_pipeline/classify.py)"]
        C1["<b>Activity:</b> Inspect Request Doping Hints<br/><b>Check:</b> is_doped_hint in payload"]
        C2["<b>Activity:</b> NLP Doping Phrasing Match<br/><b>Match:</b> 'doped with', 'substituted by'"]
        C3["<b>Activity:</b> Parse Fractional Stoichiometry<br/><b>Check:</b> Non-integer atomic counts"]
        C4["<b>Activity:</b> Site Substitution Analysis<br/><b>Check:</b> Isovalent / Aliovalent replacement"]
        C5["<b>Activity:</b> Disambiguation Surfacing<br/><b>Action:</b> Returns None in web mode -> polymorph picker"]
        C6["<b>Activity:</b> Spinel Sublattice Construction<br/><b>Files:</b> site_preference.py & intent.py"]
    end
    S1 --> CLASS_STEPS --> DS["<b>Activity:</b> Produce Doping Specification<br/><b>File:</b> cif_generator/cif_pipeline/models.py<br/><b>Result:</b> (is_doped: bool, DopingSpec)"]

    DS --> S2["<b>Activity:</b> Stage 2 Stoichiometric Normalization<br/><b>File:</b> cif_generator/cif_pipeline/matching.py<br/><b>Function:</b> normalize_formula_with_trace() -> NormalizationTrace"]

    S2 --> S3["<b>Activity:</b> Stage 3 External Database Retrieval<br/><b>File:</b> cif_generator/cif_pipeline/search_external.py<br/><b>Function:</b> search_external_databases()"]
    subgraph EXT_QUERIES["Concurrent Multi-Database Queries (cif_generator/cif_pipeline/search_external.py)"]
        E1["<b>Activity:</b> Query Materials Project API<br/><b>Client:</b> mp_api.MPRester.materials.summary.search()"]
        E2["<b>Activity:</b> Query OQMD REST Gateway<br/><b>API:</b> api.oqmd.org/static REST"]
        E3["<b>Activity:</b> Query JARVIS-DFT Repository<br/><b>API:</b> jarvis.nist.gov OPTIMADE"]
        E4["<b>Activity:</b> Query Crystallography Open Database<br/><b>API:</b> crystallography.net HTTP + CSV"]
    end
    S3 --> EXT_QUERIES --> MATCH_R{"<b>Activity:</b> Evaluate Database Hits<br/><b>File:</b> cif_generator/cif_pipeline/orchestrator.py<br/><b>Check:</b> len(matches) > 0"}

    MATCH_R -- "undoped exact" --> POLY["<b>Activity:</b> Collect Distinct Polymorphs<br/><b>File:</b> cif_generator/cif_pipeline/matching.py<br/><b>Function:</b> disambiguate_polymorphs()"]
    POLY -- "one" --> CIFDB["<b>Activity:</b> Return Discovered Experimental CIF<br/><b>File:</b> cif_generator/cif_pipeline/models.py<br/><b>Status:</b> source='existing_DB', relaxation_status='EXPERIMENTAL'"]
    POLY -- "multiple" --> AMB["<b>Activity:</b> Surface Polymorph Disambiguation<br/><b>File:</b> cif_generator/webapp.py<br/><b>Status:</b> source='ambiguous_polymorphs' -> UI Dialog"]

    MATCH_R -- "doped hit" --> DFILT["<b>Activity:</b> Match Doped Stoichiometry<br/><b>File:</b> cif_generator/cif_pipeline/matching.py<br/><b>Function:</b> doped_formulas_match(tol=0.03)"]
    DFILT -- "match" --> CIFDB

    MATCH_R -- "none" --> S4["<b>Activity:</b> Stage 4 Internal DB Lookup<br/><b>File:</b> cif_generator/cif_pipeline/search_internal.py<br/><b>Function:</b> _query_internal_db()"]
    S4 -- "none" --> BRANCH

    DS -- "UNDOPED" --> BRANCH
    DS -- "DOPED" --> BRANCH
    BRANCH{"<b>Activity:</b> Route Synthesis Strategy<br/><b>File:</b> cif_generator/cif_pipeline/orchestrator.py<br/><b>Check:</b> is_doped?"}
    BRANCH -- "undoped" --> GEN_PATH["<b>Activity:</b> Stage 5a CrystaLLM Generative AI Loop<br/><b>File:</b> cif_generator/cif_pipeline/generate.py<br/><b>Function:</b> generate_cif_crystallm()"]
    BRANCH -- "doped" --> DOPE_PATH["<b>Activity:</b> Stage 5b Solid-State Doping Engine<br/><b>File:</b> cif_generator/cif_pipeline/doping.py<br/><b>Function:</b> apply_doping()"]

    GEN_PATH & DOPE_PATH & CIFDB --> FINAL["<b>Activity:</b> Format IUCr-Compliant Wyckoff CIF<br/><b>File:</b> cif_generator/cif_pipeline/export.py<br/><b>Function:</b> structure_to_cif(symprec=0.1)"]

    FINAL --> RESP_FINAL["<b>Activity:</b> Dispatch Comprehensive Synthesis Payload<br/><b>File:</b> cif_generator/webapp.py<br/><b>Response:</b> PipelineResult(cif_string, space_group, energy, diagnostics)"]
```

### 3.3 Undoped Generation — CrystaLLM Feedback Loop (`generate.py`)

```mermaid
flowchart TD
    COMP["<b>Activity:</b> Receive Normalized Formula String<br/><b>File:</b> cif_generator/cif_pipeline/generate.py<br/><b>Input:</b> Electronegativity-sorted formula or space-group prompt"]
    COMP --> PROMPT["<b>Activity:</b> Construct Conditioning Prompt<br/><b>File:</b> cif_generator/cif_pipeline/generate.py<br/><b>Function:</b> build_prompt(formula, space_group)"]

    PROMPT --> LLM["<b>Activity:</b> Execute Autoregressive nanoGPT Inference<br/><b>File:</b> cif_generator/cif_pipeline/generate.py<br/><b>Model:</b> CrystaLLM ckpt.pt (GPT-2 nanoGPT architecture)<br/><b>Device:</b> CUDA bfloat16 or CPU"]

    LLM --> SAMPLE["<b>Activity:</b> Sample Candidate CIF Token Streams<br/><b>File:</b> cif_generator/cif_pipeline/generate.py<br/><b>Function:</b> model.generate(temperature=0.7..1.5, top_k=10)"]

    SAMPLE --> PARSE_CIF["<b>Activity:</b> Parse Candidate CIF Text to Structure<br/><b>File:</b> pymatgen/core/structure.py<br/><b>Function:</b> Structure.from_str(cif_text)"]

    PARSE_CIF --> FILT["<b>Activity:</b> Evaluate Physical Plausibility Filters<br/><b>File:</b> cif_generator/cif_pipeline/filter_rules.py<br/><b>Checks:</b> Bond lengths, coordination polyhedra, charge balance"]

    FILT --> RELAX_STEP["<b>Activity:</b> Relax Atomic Coordinates & Cell Vectors<br/><b>File:</b> cif_generator/cif_pipeline/relax.py<br/><b>Model/Optimizer:</b> MACE-MP-0 (medium) + FIRE optimizer (fmax &lt; 0.05 eV/Å)"]

    RELAX_STEP --> CONV{"<b>Activity:</b> Check Relaxation Convergence<br/><b>File:</b> cif_generator/cif_pipeline/relax.py<br/><b>Guard:</b> Check finite energies and forces"}
    CONV -- "NaN/inf" --> REJECT["<b>Activity:</b> Discard Unstable Candidate<br/><b>File:</b> cif_generator/cif_pipeline/generate.py<br/><b>Action:</b> Reject sample"]
    CONV -- "bond fail dominant" --> TEMP_UP["<b>Activity:</b> Escalate Sampling Temperature<br/><b>File:</b> cif_generator/cif_pipeline/generate.py<br/><b>Action:</b> T = min(T + 0.15, 1.5)"]
    CONV -- "ok" --> SG_COMP["<b>Activity:</b> Recompute Post-Relaxation Space Group<br/><b>File:</b> pymatgen/symmetry/analyzer.py<br/><b>Class:</b> SpacegroupAnalyzer(symprec=0.1)"]

    REJECT & TEMP_UP --> DIAG["<b>Activity:</b> Log Iteration Diagnostics<br/><b>File:</b> cif_generator/cif_pipeline/models.py<br/><b>Class:</b> GenerationDiagnostics"]
    DIAG --> ITER_LOOP(["<b>Activity:</b> Evaluate Retry Loop Condition<br/><b>File:</b> cif_generator/cif_pipeline/generate.py<br/><b>Loop:</b> until max_iterations reached"])
    ITER_LOOP --> SAMPLE

    SG_COMP --> PICK["<b>Activity:</b> Select Lowest Ground-State Energy Candidate<br/><b>File:</b> cif_generator/cif_pipeline/generate.py<br/><b>Action:</b> Sort candidates by MACE final energy"]
    SG_MULT{"<b>Activity:</b> Check for Competing Distinct SGs<br/><b>File:</b> cif_generator/cif_pipeline/generate.py<br/><b>Check:</b> Multiple space groups in top 5?"}
    PICK --> SG_MULT
    SG_MULT -- "yes" --> ASK_U["<b>Activity:</b> Surface Disambiguation Picker<br/><b>File:</b> cif_generator/webapp.py<br/><b>Status:</b> source='ambiguous_polymorphs'"]
    SG_MULT -- "no" --> RESULT["<b>Activity:</b> Package Successful Synthesis Result<br/><b>File:</b> cif_generator/cif_pipeline/models.py<br/><b>Output:</b> PipelineResult(source='generated_undoped')"]
    ASK_U --> RESV["<b>Activity:</b> User Resolves Polymorph<br/><b>File:</b> cif_generator/webapp.py<br/><b>Endpoint:</b> POST /cif/api/resolve-disambiguation"] --> RESULT
```

### 3.4 Doped Path — Two Sub-Engines

#### Path A — `doping.py` (standard orchestrator path)

```mermaid
flowchart LR
    DSPEC["<b>Activity:</b> Ingest Standard Doping Specification<br/><b>File:</b> cif_generator/cif_pipeline/models.py<br/><b>Object:</b> DopingSpec(host, dopant, site, fraction)"]
    DSPEC --> PARENT["<b>Activity:</b> Retrieve Undoped Host Structure<br/><b>File:</b> cif_generator/cif_pipeline/doping.py<br/><b>Function:</b> resolve_parent_structure() (DB search or CrystaLLM)"]
    PARENT --> SITES["<b>Activity:</b> Identify & Rank Candidate Sites<br/><b>File:</b> cif_generator/cif_pipeline/site_preference.py<br/><b>Functions:</b> CrystalNN + recommend_site_for_dopant() (Shannon radii & CFSE)"]
    SITES --> CHG["<b>Activity:</b> Assess Charge Neutrality & Compensation<br/><b>File:</b> cif_generator/cif_pipeline/doping.py<br/><b>Function:</b> _check_charge_compensation()"]
    CHG --> SUB["<b>Activity:</b> Execute Site Substitution<br/><b>File:</b> cif_generator/cif_pipeline/doping.py<br/><b>Function:</b> apply_doping()"]
    SUB --> DISORD{"<b>Activity:</b> Check Disordered / Fractional Occupancy<br/><b>File:</b> cif_generator/cif_pipeline/doping.py<br/><b>Check:</b> Is structure fractional VCA?"}
    DISORD -- "yes" --> SKIP["<b>Activity:</b> Deliberately Bypass MACE Relaxation<br/><b>File:</b> cif_generator/cif_pipeline/doping.py<br/><b>Action:</b> Preserve fractional occupancies as-is"]
    DISORD -- "no" --> MACE_D["<b>Activity:</b> Relax Doped Supercell with MACE-MP-0<br/><b>File:</b> cif_generator/cif_pipeline/relax.py<br/><b>Function:</b> relax_with_mace()"]
    MACE_D --> VAL["<b>Activity:</b> Validate Interatomic Distances & Charges<br/><b>File:</b> cif_generator/cif_pipeline/filter_rules.py<br/><b>Function:</b> validate_doped_structure()"]
    SKIP --> VAL
    VAL --> OUT["<b>Activity:</b> Export Validated Doped CIF<br/><b>File:</b> cif_generator/cif_pipeline/export.py<br/><b>Output:</b> CIF string + DopedStructureValidation report"]
```

#### Path B — `dopant_pipeline.py` (`POST /cif/api/doped-cif`)

```mermaid
flowchart TD
    DRQ["<b>Activity:</b> Ingest Dedicated Doping Request<br/><b>File:</b> cif_generator/webapp.py<br/><b>Endpoint:</b> POST /cif/api/doped-cif<br/><b>Model:</b> DopantRequest(host, dopant, fraction, family, technique)"]
    DRQ --> FAM["<b>Activity:</b> Classify Crystal Archetype Family<br/><b>File:</b> cif_generator/cif_pipeline/family.py<br/><b>Function:</b> classify_family() (Spinel, Perovskite, Garnet, NASICON)"]
    FAM --> REG["<b>Activity:</b> Calculate Inversion & Jahn-Teller Regime<br/><b>File:</b> cif_generator/cif_pipeline/regime.py<br/><b>Calculations:</b> Inversion lambda parameter & orbital degeneracy"]
    REG --> FRN["<b>Activity:</b> Discretize Continuous Fraction into Supercell<br/><b>File:</b> cif_generator/cif_pipeline/fractions.py<br/><b>Function:</b> resolve_neat_fraction(x_target) -> (x_real, supercell_multiplier)"]
    FRN --> REP["<b>Activity:</b> Select Supercell Representation Strategy<br/><b>File:</b> cif_generator/cif_pipeline/representation.py<br/><b>Options:</b> VCA, Ordered Supercell, SQS, Enumeration"]
    REP --> APPLY["<b>Activity:</b> Assign Oxidation States & Sublattice Species<br/><b>File:</b> cif_generator/cif_pipeline/dopant_pipeline.py<br/><b>Function:</b> _apply_substitution()"]
    APPLY --> ORD["<b>Activity:</b> Ground-State Monte Carlo Ordering<br/><b>File:</b> cif_generator/cif_pipeline/ordering.py<br/><b>Energy:</b> Ewald pair-Coulomb potential + MACE single-point evaluation (mlip.py)"]
    ORD --> RT["<b>Activity:</b> Stoichiometry Roundtrip Verification<br/><b>File:</b> cif_generator/cif_pipeline/dopant_pipeline.py<br/><b>Function:</b> _roundtrip_ok()"]
    RT --> ROPT{"<b>Activity:</b> Check Relaxation Request Flag<br/><b>File:</b> cif_generator/cif_pipeline/dopant_pipeline.py<br/><b>Check:</b> relax=True in payload?"}
    ROPT -- "yes" --> RELAX_D["<b>Activity:</b> DFT-Accuracy Supercell Relaxation<br/><b>File:</b> cif_generator/cif_pipeline/relax.py<br/><b>Model:</b> MACE-MP-0 (medium) + FIRE optimizer"]
    ROPT -- "no" --> CHECKS
    RELAX_D --> CHECKS
    CHECKS["<b>Activity:</b> Execute Multi-Check Validation<br/><b>File:</b> cif_generator/cif_pipeline/filter_rules.py<br/><b>Checks:</b> Charge balance, minimum bond lengths, space group verified"]
    CHECKS --> RESP2["<b>Activity:</b> Return Doped Structure Result<br/><b>File:</b> cif_generator/webapp.py<br/><b>Output:</b> DopedCifResult(family, regime, representations, provenance)"]

    subgraph SPINEL_SPEC["Spinel-Specific Specialized Subsystem"]
        SB["<b>Activity:</b> Populate Spinel Sublattices<br/><b>File:</b> cif_generator/cif_pipeline/spinel_build.py<br/><b>Sites:</b> Tetrahedral 8a, Octahedral 16d, Anion 32e"]
        SC["<b>Activity:</b> Format Spinel Wyckoff CIF<br/><b>File:</b> cif_generator/cif_pipeline/spinel_cif.py<br/><b>Function:</b> write_spinel_cif()"]
        GD["<b>Activity:</b> 11-Stage Universal Non-Spinel Engine<br/><b>File:</b> cif_generator/cif_pipeline/general_doping.py<br/><b>Capabilities:</b> Wyckoff orbits, electrostatic ranking, neutral vacancies"]
    end
    FAM -.->|"spinel family"| SPINEL_SPEC
```

### 3.5 Guard Rails & Failure Modes

| Guard | Where | Effect |
|---|---|---|
| Empty/blank input | `orchestrator.py` start | `source='failed'` immediately |
| `@` endohedral syntax | `webapp.py parse-formula` | Clean error, no pipeline run |
| `wt%` weight percent | `webapp.py parse-formula` | Clean error — out of scope |
| Fictitious elements | `recognition.py` | Rejected before classify |
| COD CIF mismatch | `search_external.py` | Mandatory composition re-verification |
| NaN/inf in MACE output | `generate.py` | Sample rejected, count logged |
| No convergence after N iterations | `generate.py` | `is_reliable=False` flagged |
| Distinct final SGs | `generate.py` | Never auto-picked → `ambiguous_polymorphs` |
| Disordered occupancy | `doping.py` | MACE relaxation deliberately skipped |
| SG from generated sample | `generate.py` | NEVER trusted — always recomputed post-relax |

---

## Part 4: ML Models in Detail

### 4.1 Model Artifact Inventory

| Artifact | Size | Used By | What It Does |
|---|---|---|---|
| `pretrained_models/v5_base_models.pkl` | 266 MB | `model_service.py`, `predict_ionic_conductivity.py` | XGB + LightGBM + Extra Trees ensemble for ionic conductivity |
| `pretrained_models/v5_mlp_models.pkl` | 13.7 MB | same | MLP members of the v5 stack |
| `pretrained_models/v5_meta_model.pkl` | 674 B | same | Stacking meta-learner |
| `pretrained_models/v5_quantile_transformer.pkl` | 1.4 MB | same | Feature scaler |
| `pretrained_models/v5_model2_A.pkl` | 2.5 MB | same | "Model A" log10 prefactor predictor |
| `pretrained_models/v6_corrector_model.pkl` | 64 KB | same | LightGBM residual corrector |
| `pretrained_models/chgnet_logK_model.pkl` | ~448 KB | `calculator_router.py` | Predicts log10(K_VRH) from 21-dim CHGNet vector |
| `pretrained_models/chgnet_logG_model.pkl` | ~448 KB | `calculator_router.py` | Predicts log10(G_VRH) |
| `pretrained_models/chgnet_Ef_model.pkl` | ~413 KB | `BFSY_pipeline.py` | Predicts formation energy per atom |
| `pretrained_models/chgnet_thermal_model.pkl` | ~413 KB | `calculator_router.py` | Phonon frequency proxy |
| `pretrained_models/chgnet_bandgap_model.pkl` | 436 KB | `calculator_router.py` | Electronic band gap |
| `final_models/chgnet_weights/chgnet_model.pt` | 1.74 MB | `utils/chgnet_features.py` | Full CHGNet universal IaP (feature extraction only) |
| `final_models/mace_weights/20231203mace128L1...` | 44.4 MB | `cif_pipeline/relax.py` | MACE-MP-0 medium MLIP (structure relaxation) |
| `final_models/m3gnet_weights/` | ~5 MB total | adapters | M3GNet-MP PES (via matgl cache) |

> **Key rule**: `model_paths.resolve_pretrained_models_dir()` searches `root/pretrained_models/` first, then `backend/pretrained_models/`, then legacy paths. MACE and M3GNet are loaded via library cache names, NOT from `final_models/`.

### 4.2 BFSY (Mechanical) Surrogate Stack

```mermaid
flowchart LR
    STRUCT["<b>Activity:</b> Ingest Pymatgen Structure<br/><b>File:</b> pymatgen/core/structure.py<br/><b>Object:</b> Structure(lattice, species, coords)"] --> CHG21["<b>Activity:</b> Extract Universal 21-Dim Hamiltonian Vector<br/><b>File:</b> backend/utils/chgnet_features.py<br/><b>Function:</b> CHGNetCalculator.extract_features(structure)<br/><b>Model:</b> chgnet_model.pt (preloaded instance)"]
    CHG21 --> LK["<b>Activity:</b> Infer Bulk Modulus (K)<br/><b>File:</b> property_prediction_models/pretrained_models/chgnet_logK_model.pkl<br/><b>Model:</b> LightGBM Regressor (log10 K_VRH)"]
    CHG21 --> LG["<b>Activity:</b> Infer Shear Modulus (G)<br/><b>File:</b> property_prediction_models/pretrained_models/chgnet_logG_model.pkl<br/><b>Model:</b> LightGBM Regressor (log10 G_VRH)"]
    CHG21 --> EF["<b>Activity:</b> Infer Formation Energy (Ef)<br/><b>File:</b> property_prediction_models/pretrained_models/chgnet_Ef_model.pkl<br/><b>Model:</b> LightGBM Regressor (eV/atom)"]
    CHG21 --> LT["<b>Activity:</b> Infer Thermal Phonon Proxy<br/><b>File:</b> property_prediction_models/pretrained_models/chgnet_thermal_model.pkl<br/><b>Model:</b> LightGBM Regressor (omega_ph in cm^-1)"]
    CHG21 --> BG2["<b>Activity:</b> Infer Electronic Band Gap (Eg)<br/><b>File:</b> property_prediction_models/pretrained_models/chgnet_bandgap_model.pkl<br/><b>Model:</b> LightGBM Regressor (eV)"]

    LK --> K_VRH["<b>Activity:</b> Exponentiate Modulus<br/><b>Formula:</b> K_VRH = 10^logK (GPa)"]
    LG --> G_VRH["<b>Activity:</b> Exponentiate Modulus<br/><b>Formula:</b> G_VRH = 10^logG (GPa)"]
    K_VRH & G_VRH --> DERIVED["<b>Activity:</b> Derive Isotropic Mechanical Properties<br/><b>File:</b> property_prediction_models/prediction/BFSY_pipeline.py<br/><b>Calculations:</b> E = 9KG/(3K+G), nu = (3K-2G)/(6K+2G), Pugh = K/G, beta = 1/K"]
    EF --> EF_OUT["<b>Activity:</b> Output Formation Energy<br/><b>Target:</b> Ef (eV/atom)"]
    LT --> THERM_OUT["<b>Activity:</b> Estimate Lattice Heat Transport<br/><b>Formulas:</b> Debye T = |omega| * 1.5 K, kappa_lat = |omega| * 0.05 W/mK"]
    BG2 --> BG_OUT["<b>Activity:</b> Classify Conduction Nature<br/><b>States:</b> Metal (&lt;0.05 eV) / Semi (0.05-2 eV) / Insulator (&gt;2 eV)"]
```

### 4.3 Model Path Resolution

```mermaid
flowchart LR
    MP["<b>Activity:</b> Resolve Pretrained Weights Directory<br/><b>File:</b> backend/model_paths.py<br/><b>Function:</b> resolve_pretrained_models_dir(filename)"]
    MP --> TRY1["<b>Activity:</b> Priority 1 Check<br/><b>Path:</b> PROJECT_ROOT / 'pretrained_models'"]
    MP --> TRY2["<b>Activity:</b> Priority 2 Check<br/><b>Path:</b> BACKEND_DIR / 'pretrained_models'"]
    MP --> TRY3["<b>Activity:</b> Priority 3 Check<br/><b>Path:</b> PROJECT_ROOT / 'final_models' / 'pretrained_models'"]
    MP --> TRY4["<b>Activity:</b> Priority 4 Check<br/><b>Path:</b> PROJECT_ROOT / 'IonCastBackup' / 'pretrained_models'"]
    TRY1 -- "file exists" --> FOUND["<b>Activity:</b> Return Verified Path<br/><b>Return:</b> Discovered weights directory"]
    TRY2 -- "file exists" --> FOUND
    TRY3 -- "file exists" --> FOUND
    TRY4 -- "file exists" --> FOUND
    TRY4 -- "not found anywhere" --> ERR["<b>Activity:</b> Halt Execution with Diagnostics<br/><b>Exception:</b> raise FileNotFoundError(searched_candidates)"]
```

### 4.4 Surrogate Training Origins

```mermaid
flowchart TD
    subgraph TRAINING["Offline Training & Research Pipelines (offline_training_and_research/)"]
        NB["<b>Activity:</b> Train Solid-State Fast-Ion Transport Models<br/><b>File:</b> offline_training_and_research/surrogate_model_v5_fixed.ipynb<br/><b>Artifacts Produced:</b> v5_base_models, v5_mlp_models, v5_meta_model, v5_model2_A, v5_quantile_transformer, v6_corrector"]

        TM["<b>Activity:</b> Train CHGNet Elastic Moduli Regressors<br/><b>File:</b> backend/train_mechanical.py<br/><b>Artifacts Produced:</b> chgnet_logK_model.pkl, chgnet_logG_model.pkl"]
        TE["<b>Activity:</b> Train Electronic Band Gap Regressor<br/><b>File:</b> backend/train_electrical.py<br/><b>Artifact Produced:</b> chgnet_bandgap_model.pkl"]
        TTH["<b>Activity:</b> Train Phonon Thermal Proxy Regressor<br/><b>File:</b> backend/train_thermal.py<br/><b>Artifact Produced:</b> chgnet_thermal_model.pkl"]
    end

    subgraph INFERENCE["Runtime Production Inference Gateways"]
        INF1["<b>Activity:</b> Startup Model Preloading<br/><b>File:</b> backend/routes/transport_router.py<br/><b>Function:</b> load_models()"]
        INF2["<b>Activity:</b> Multi-Model Property Prediction Gateway<br/><b>File:</b> backend/api/calculator_router.py<br/><b>Function:</b> predict_properties()"]
        INF3["<b>Activity:</b> Fast-Ion Conduction Screening<br/><b>File:</b> backend/predict_ionic_conductivity.py<br/><b>Method:</b> IonConductivityPredictor.predict_one()"]
    end

    NB -->|"serializes .pkl"| INF1 & INF3
    TM & TE & TTH -->|"serializes .pkl"| INF2
```

### 4.5 CrystaLLM Model (`generate.py`)

```mermaid
flowchart LR
    CKPT["<b>Activity:</b> Ingest Pretrained Language Model Checkpoint<br/><b>File:</b> cif_generator/cif_pipeline/generate.py<br/><b>Weight:</b> CRYSTALLM_CHECKPOINT_PATH/ckpt.pt (nanoGPT)"]
    CKPT --> LOAD["<b>Activity:</b> Instantiate Transformer Config & Tokenizer<br/><b>File:</b> cif_generator/cif_pipeline/generate.py<br/><b>Classes:</b> GPTConfig, GPT, CIFTokenizer"]
    LOAD --> GEN["<b>Activity:</b> Autoregressively Sample CIF Tokens<br/><b>File:</b> cif_generator/cif_pipeline/generate.py<br/><b>Function:</b> model.generate(temperature=0.7..1.5, top_k=10)"]
    GEN --> RAW["<b>Activity:</b> Decode Crystallographic Tokens to ASCII<br/><b>File:</b> cif_generator/cif_pipeline/generate.py<br/><b>Function:</b> decode_cif_tokens()"]
    RAW --> STRUCT["<b>Activity:</b> Physics Filtering & MACE Relaxation<br/><b>Files:</b> cif_generator/cif_pipeline/filter_rules.py & relax.py<br/><b>Function:</b> relax_with_mace() -> Validated Structure"]
```

---

## Part 5: Known Gaps & Dead Code

### Backend Gaps

| # | Issue | File(s) |
|---|---|---|
| 1 | `/api/materials-prediction/*` router **missing** from `main.py` | `tests/test_api_routes.py` expects it |
| 2 | `/trial/predict` route **does not exist** on backend | `src/lib/api.ts` calls it |
| 3 | `auth.py` `SECRET_KEY` **hardcoded** string (not from env) | `auth.py` |
| 4 | OQMD/AFLOW/JARVIS structure+CIF download endpoints are **501 stubs** | `routes/oqmd.py` etc. |
| 5 | `indianmatter.py` crystal-system is **lattice-metric heuristic** not real symmetry | `routes/indianmatter.py` |
| 6 | `services/prediction_service.py` + `workers/prediction_worker.py` — **not routed** | legacy code |

### Frontend Gaps

| # | Issue |
|---|---|
| 1 | `src/lib/topath.ts` — `askToPath()` **never imported** anywhere |
| 2 | `src/data/researchPapers.ts` — static array **never used** (Supabase replaced it) |
| 3 | `src/pages/structure/MaterialsDetailsPage.tsx` — **hardcoded LiCoO₂ only** |
| 4 | OAuth Google Client ID **hardcoded** in `index.html` |
| 5 | DFT Validation page — **fake setInterval progress bar**, hardcoded results |
| 6 | `src/Home.tsx` — legacy home component, **unreachable** from any route |

### Model/Config Gaps

| # | Issue |
|---|---|
| 1 | `configs/paths.json` → `final_models/pretrained_models/` — **STALE**, real path is root `pretrained_models/` |
| 2 | HF model name `M3GNet-MP-2021.2.8-PES` — **no longer on HuggingFace** |
| 3 | `final_models/alignn_weights/` — **referenced but absent** on disk (ALIGNN returns placeholder −2.35 eV) |
| 4 | Model A `diffusion_coefficient_300K` feature ~82% importance — **simulation-only**, honesty warning hardcoded |
