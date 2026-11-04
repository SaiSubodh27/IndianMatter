# IndianMatter — Master Architectural Documentation Suite

Welcome to the comprehensive technical documentation and system architecture guide for **IndianMatter**.

This documentation suite is divided into **four dedicated, standalone architectural blueprints**, each detailing the complete node-by-node execution flow, file responsibilities, Mermaid flowcharts, and dependency matrices for its respective domain.

---

## 📚 Documentation Index

```
IndianMatter Architecture Suite/
│
├── 00_Master_Architecture_Index.md       (Index of all architecture suites)
├── EXECUTION_ORDER.md                    (Complete chronological setup & execution guide)
├── IndianMatter_Master_Architecture.md   (All-in-One 30,000-ft System Orchestration & Unified Flowcharts)
├── 01_Backend_Architecture.md            (FastAPI, Lifespan, Routers, Auth, Predictions)
├── 02_Frontend_Architecture.md           (React 18, Vite, Route Tree, Viewers, API SDKs)
├── 03_CIF_Generator_Architecture.md      (40-Module CIF Pipeline, CrystaLLM, MACE-MP-0)
├── 04_Models_Architecture.md             (CHGNet, BFSY, IonCast v5/v6, Surrogates, MLIPs)
│
├── guides/                               (Implementation prompts & integration specifications)
│   ├── INDIANMATTER_MASTER_IMPLEMENTATION_PROMPT.md
│   ├── INTEGRATIONS.md
│   └── notebooklm_project_presentation_and_routing_guide.md
│
├── migration/                            (Codebase reorganization logs, registries & split data)
│   ├── ENV_SPLIT_REPORT.md, env_split.csv
│   ├── REORG_PLAN.md, STATE.md, MOVE_LOG.csv, plan_2a.csv
│   └── MODEL_REGISTRY.csv, MODEL_REGISTRY.md, INVENTORY.md, manifests/
│
└── verification/                         (Test suite runs & endpoint reports)
    └── endpoint_verification_results.json
```

---

### 0. [00 — Master Architecture & Unified Flowchart Suite](file:///e:/IndianMatter/docs/IndianMatter_Master_Architecture.md)
* **Scope**: Full-stack end-to-end orchestration across Frontend, Backend, CIF Generator, and Machine Learning models.
* **Core Topics**:
  * **30,000-Foot System View**: High-level topological flowchart connecting React UI routes to FastAPI routers, CIF generator subroutines, ML inference engines, and persistence stores.
  * **Complete Node-Level Responsibilities**: Every Mermaid flowchart node explicitly declared with its execution activity, responsible file path, and underlying function/class.
  * **Cross-Domain Data Contracts**: Data propagation from formula parsing through database federation, CrystaLLM sampling, MACE relaxation, and multi-model property evaluation.

---

### 1. [01 — Backend Architecture & File Guide](file:///e:/IndianMatter/docs/01_Backend_Architecture.md)
* **Scope**: `backend/` directory, FastAPI gateway, ASGI lifecycle, and database connectors.
* **Core Topics**:
  * **Application Startup & Lifespan**: Step-by-step trace of `main.py`'s `lifespan()` hook, environment variable validation, and model preloading.
  * **Router Mount Table**: Comprehensive directory of all 11 HTTP prefixes (`/api/auth`, `/api/users`, `/api/calculations`, `/api/materials`, `/api/dataset`, `/cif`, etc.).
  * **Authentication Pipeline**: Bcrypt password hashing, MongoDB asynchronous persistence via Motor, JWT generation, and Google/GitHub OAuth callback handling.
  * **Property Prediction Gateways**: Single-structure analysis and background multi-threaded batch prediction workers with polling endpoints.
  * **Dataset Routers**: Query dispatchers for Materials Project, OQMD, JARVIS-DFT, AFLOW, and cached internal CSV repositories.
  * **Known Gaps & Dead Code**: Detailed inventory of unwired routes and technical debt.

---

### 2. [02 — Frontend Architecture & File Guide](file:///C:/Users/Indra/.gemini/antigravity/brain/e7104ef0-f6f5-49b7-953d-608d97d651f6/02_Frontend_Architecture.md)
* **Scope**: `src/` directory, React 18, Vite bundling, and user experience flows.
* **Core Topics**:
  * **Tech Stack & Build Setup**: Package inventory (React Router v6, Tailwind CSS, framer-motion, Three.js, Lucide).
  * **Full Route Tree**: Complete map of public views (`/`, `/research-papers`) and protected views (`/app`, `/app/cif-gen`, `/app/predict`, `/app/batch`, `/app/structure`, `/app/literature`).
  * **Auth & Session Management**: Dual-mode authentication (Developer local storage simulation vs. Backend OAuth redirection).
  * **API Client Layer (`src/lib/`)**: Detailed specifications for `api.ts`, `datasetapi.ts`, `materialsPredictionApi.ts`, `cifApi.ts`, and `supabase.ts`.
  * **Crystallographic Visualizers**: Interactive 3Dmol.js CDN viewer and custom Three.js WebGL rendering engines.
  * **Inter-Page Data Flow**: Route state passing from CIF synthesis directly into the multi-property prediction checklist.

---

### 3. [03 — CIF Generator Pipeline: Complete Architecture & File Guide](file:///C:/Users/Indra/.gemini/antigravity/brain/e7104ef0-f6f5-49b7-953d-608d97d651f6/03_CIF_Generator_Architecture.md)
* **Scope**: `backend/webapp.py` and the 40-module `backend/cif_pipeline/` package.
* **Core Topics**:
  * **HTTP Translation Layer (`webapp.py`)**: Request/response contracts, health telemetry, and non-blocking clarification handlers.
  * **Core Data Contracts**: Data classes (`CompoundQuery`, `DopingSpec`, `SearchMatch`, `PipelineResult`, `GenerationDiagnostics`).
  * **Stage 0 (Recognition)**: Natural language filtering, chemical acronym expansion (LLZO, LGPS, NASICON), and algebraic $x$-notation parsing.
  * **Stage 1 & 2 (Classification & Matching)**: Undoped vs. Doped evaluation, canonical formula normalization, and polymorph collection.
  * **Stage 3 (Database Retrieval)**: Concurrent queries across Materials Project, OQMD, JARVIS, and COD.
  * **Stage 4a (CrystaLLM Generative Loop)**: Autoregressive language modeling (GPT-2 nanoGPT) with adaptive temperature retry loops.
  * **Stage 4b (Solid-State Doping Engine)**: Crystal family archetypes, Shannon ionic radii, CFSE tables, Wyckoff site preferences, Hermite Normal Form (HNF) supercell searches, and Monte Carlo ground-state ordering.
  * **Stage 5 & 6 (Relaxation & Export)**: MACE-MP-0 forcefield relaxation with FIRE optimizer, 2-decimal reporting rules, and IUCr Wyckoff CIF generation.

---

### 4. [04 — ML Models: Complete Architecture & File Guide](file:///C:/Users/Indra/.gemini/antigravity/brain/e7104ef0-f6f5-49b7-953d-608d97d651f6/04_Models_Architecture.md)
* **Scope**: Model weights, feature extraction pipelines, interatomic potentials, and offline training scripts.
* **Core Topics**:
  * **Artifact Inventory**: Verified file sizes and directory locations across `pretrained_models/`, `final_models/`, and CSV embedding caches.
  * **Universal Physical Featurizer**: CHGNet Hamiltonian graph neural network extracting 21-dimensional stress, force, and energy representations.
  * **BFSY Mechanical Surrogates**: Machine learning inference of Bulk Modulus ($K$), Shear Modulus ($G$), Formation Energy ($E_f$), and derived Young's Modulus ($E$), Poisson's ratio ($\nu$), and Pugh's ratio.
  * **Electronic & Thermal Models**: Band gap predictor (Metal/Semiconductor/Insulator) and phonon frequency proxy.
  * **IonCast Stack (v5 + v6 Corrector)**: Full 277-descriptor feature engineering, QuantileTransformer scaling, Model A pre-exponential factor, stacking meta-model, Arrhenius transport calculations, and residual LightGBM correction.
  * **Interatomic Potentials & LLMs**: MACE-MP-0 equivariant graph neural networks and CrystaLLM crystal language tokenizers.
  * **Offline Training Workflows**: Code trace for `train_mechanical.py`, `train_electrical.py`, `train_thermal.py`, and `surrogate_model_v5_fixed.ipynb`.

---

## 💾 Local File Locations

All architectural artifacts are stored both in your workspace `docs/` folder and in your session artifact directory:

| Architecture Blueprint | Workspace Path | Artifact File Path |
|---|---|---|
| **Execution Order & Workflow** | [`docs/EXECUTION_ORDER.md`](file:///e:/IndianMatter/docs/EXECUTION_ORDER.md) | `C:\Users\Indra\.gemini\antigravity\brain\e7104ef0-f6f5-49b7-953d-608d97d651f6\EXECUTION_ORDER.md` |
| **00 — Master Architecture Suite** | [`docs/IndianMatter_Master_Architecture.md`](file:///e:/IndianMatter/docs/IndianMatter_Master_Architecture.md) | `C:\Users\Indra\.gemini\antigravity\brain\e7104ef0-f6f5-49b7-953d-608d97d651f6\IndianMatter_Master_Architecture.md` |
| **01 — Backend Architecture** | `docs/01_Backend_Architecture.md` | `C:\Users\Indra\.gemini\antigravity\brain\e7104ef0-f6f5-49b7-953d-608d97d651f6\01_Backend_Architecture.md` |
| **02 — Frontend Architecture** | `docs/02_Frontend_Architecture.md` | `C:\Users\Indra\.gemini\antigravity\brain\e7104ef0-f6f5-49b7-953d-608d97d651f6\02_Frontend_Architecture.md` |
| **03 — CIF Generator Architecture** | `docs/03_CIF_Generator_Architecture.md` | `C:\Users\Indra\.gemini\antigravity\brain\e7104ef0-f6f5-49b7-953d-608d97d651f6\03_CIF_Generator_Architecture.md` |
| **04 — ML Models Architecture** | `docs/04_Models_Architecture.md` | `C:\Users\Indra\.gemini\antigravity\brain\e7104ef0-f6f5-49b7-953d-608d97d651f6\04_Models_Architecture.md` |
