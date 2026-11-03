# IndianMatter — FRONTEND Flow Chart (Artifact)

> Scope: `E:\IndianMatter\src\`, `index.html`, `public/`, config files (vite/tailwind/tsconfig).
> Stack: React 18 + react-router-dom v6 + Vite 4 + Tailwind 3, framer-motion, lucide-react, three.js, 3Dmol.js (CDN), Supabase.

---

## 1. Boot Flow

```mermaid
flowchart TD
    HTML["index.html<br/>#root, favicon mi-icon-mark.png,<br/>Google Identity script (client ID hardcoded)"] --> MAIN["src/main.tsx"]
    MAIN --> WRAP["&lt;App/&gt; wrapped in<br/>ThemeProvider + BrowserRouter"]
    WRAP --> APP["src/App.tsx — full route tree"]
    APP --> GATE["ProtectedRoute guard"]
    GATE -- "no auth" --> SIGN["/signin?redirect=…"]
    GATE -- "auth ok" --> SHELL["MainLayout:<br/>Sidebar + TopHeader + Outlet"]
```

---

## 2. Route Tree (src/App.tsx)

```mermaid
flowchart LR
    ROOT["App.tsx routes"]

    ROOT --> PUB["PUBLIC — PublicLayout"]
    PUB --> L["/ LandingPage"]
    PUB --> RP["/research-papers ResearchPapersPage<br/>(Supabase papers)"]

    ROOT --> PROT["PROTECTED — ProtectedRoute → MainLayout"]
    PROT --> D["/app DashboardPage"]
    PROT --> MS["/app/materials MaterialsSearchPage"]
    PROT --> MD["/app/materials/:id MaterialDetailsPage (hardcoded<br/>LiCoO₂ 3D preview)"]
    PROT --> CIF["/app/cif CIFGenerationPage"]
    PROT --> PP["/app/predict PropertyPredictionPage"]
    PROT --> BP["/app/batch BatchPredictionPage"]
    PROT --> SV["/app/structure StructureVizPage"]
    PROT --> DFT["/app/dft DFTValidationPage (mock)"]
    PROT --> LIT["/app/literature LiteraturePage (mock)"]
    PROT --> SAV["/app/saved SavedResultsPage (mock)"]
    PROT --> SET["/app/settings SettingsPage (mock)"]
    PROT --> HLP["/app/help HelpPage (mock)"]
    PROT --> ADV["/app/advance-search AdvanceSearchPage<br/>(local state only)"]

    ROOT --> RED["Redirects:<br/>/predict → /app/predict<br/>canonical dupes: /dashboard, /materials-search,<br/>/materials/:id, /literature-diversity,<br/>/saved-results, /settings, /help-support<br/>* → /"]
```

---

## 3. Auth Flow (contexts/AuthContext.tsx)

```mermaid
flowchart TD
    subgraph LOCAL["Client-side only auth (no JWT verification)"]
        LS[("localStorage:<br/>userProfile + accessToken")]
        AC["AuthContext: signIn / signOut / isAuthenticated"]
        DEV["dev auto-fill user:<br/>'Dr. Subodh Kumar'"]
    end
    EMAIL["SignInPage: email submit"] --> FAKE["fake signIn() → LS"]
    subgraph OAUTH["Real OAuth via backend"]
        GB1["Google button"] --> BK1["GET backend /api/auth/google/login"]
        GB2["GitHub button"] --> BK2["GET backend /api/auth/github/login"]
        BK1 & BK2 --> CB["callback → redirect BACK with #token"]
        CB --> PH["parse token from URL hash"]
        PH --> PF["fetch /api/users/profile"]
        PF --> LS
    end
    LS --> RT["ProtectedRoute: restores redirect param"]
    TH["TopHeader user dropdown"] --> SO["signOut() → clear LS"]
```

---

## 4. Frontend ↔ Backend API Layer (src/lib/*)

```mermaid
flowchart LR
    subgraph LIB["src/lib"]
        api["api.ts<br/>BASE = VITE_API_BASE_URL<br/>|| VITE_TOPATH_URL<br/>|| http://localhost:8000<br/>predictFromTrial → POST /trial/predict<br/>(Bearer from localStorage)"]
        dapi["datasetapi.ts<br/>searchDatasetMaterials"]
        mpapi["materialsPredictionApi.ts"]
        cifapi["cifApi.ts (client-side<br/>CIF parsing: atoms/lattice)"]
        supa["supabase.ts<br/>getPublishedPapers"]
    end

    subgraph BACKEND["Backend endpoints"]
        E1["/trial/predict ⛔ (dead route)"]
        E2["/api/indianmatter/explore ✔"]
        E3["/api/materials/explore ✔"]
        E4["/api/oqmd/explore ✔"]
        E5["/api/jarvis/explore ✔"]
        E6["/api/aflow/explore ✔"]
        E7["/api/calculations/predict-properties ✔"]
        E8["/api/calculations/batch-predict ✔"]
        E9["/api/calculations/batch-predict-bfsy ✔"]
        E10["/api/predict/cif-string"]
        E11["/api/materials-prediction/* ⛔ (unwired on backend)"]
        E12["/cif/api/generate ✔ (mounted sub-app)"]
    end

    api --> E1
    dapi --> E2 & E3 & E4 & E5 & E6
    mpapi --> E7 & E8 & E9 & E10 & E11
    cifpage["pages/cif/CIFGenerationPage.tsx"] --> E12
    supa --> SB[("Supabase: papers table")]
```

---

## 5. Primary User Flow (end-to-end)

```mermaid
flowchart TD
    LP["LandingPage (/)<br/>hero, exploreMaterials carousel,<br/>database cards, contact form (local state)"]
    LP --> GATE1{"CTA click"}
    GATE1 -- unauth --> SIGNIN["SignInPage (/signin)"]
    GATE1 -- auth --> DASH

    SIGNIN --> AUTH["email dev-sign-in OR<br/>OAuth redirect to backend"]
    AUTH --> DASH["Dashboard (/app):<br/>cinematic scroll carousel +<br/>5 feature cards → navigate"]

    DASH --> FLOW_A & FLOW_B & FLOW_C & FLOW_D

    subgraph A["A — Materials Search"]
        MS["enter q / click PeriodicTable<br/>elements → state"] --> SEARCH["searchDatasetMaterials<br/>(per dataset)"] --> TBL["table + column filters + sort<br/>+ CSV export (client blob)<br/>+ pagination"]
        TBL --> MD["MaterialDetailsPage"]
    end

    subgraph B["B — CIF → Predict pipeline"]
        CIFY["CIFGenerationPage form"] --> GEN["POST /cif/api/generate"] --> CIFRES["state: cifString"]
        CIFRES --> CPD["Copy / Download buttons"]
        CIFRES --> NAV["navigate('/app/predict',<br/>state {cifString, formula})"]
        NAV --> PP2["PropertyPredictionPage"]
        PP2 --> SEL["PropertyChecklist:<br/>select props of ALL_PROPERTIES"]
        SEL --> PR["handlePredict →<br/>predictFromCifFile (POST<br/>/api/calculations/predict-properties)"]
        PR --> RES["DedicatedResultsPage<br/>getPropertyValue extraction"]
    end

    subgraph C["C — Batch Prediction"]
        BP2["drag & drop .cif/.zip"] --> PRE["presets reduce input set"]
        PRE --> START["startBatchCifPrediction"]
        START --> POLL["1s getBatchJobStatus polling"]
        POLL -- done --> RES2["getBatchJobResults →<br/>summary metrics + CSV download"]
    end

    subgraph D["D — Structure Viz"]
        SV2["3 presets (LiCoO2, LiFePO4, LLZO<br/>via presetToCif) OR upload"]
        SV2 --> PARS["parseCifFile"] --> VIEW["StructureViewer / CrystalViewerCanvas"]
    end

    DFTM["DFTValidationPage:<br/>setInterval fake progress,<br/>hardcoded results"] -.mock.-> DASH
```

---

## 6. Visualization Components Flow

```mermaid
flowchart LR
    subgraph VIEWERS
        SV3["StructureViewer.tsx<br/>injects 3Dmol.js from CDN at runtime<br/>renders CIF string into a div"]
        CV["CrystalViewerCanvas.tsx<br/>bundled three.js WebGL renderer<br/>elementConfig → atom colors"]
    end
    SRC1["CIF text state"] --> SV3
    SRC2["presetToCif presets"] --> SV3
    SRC3["uploaded CIF (parseCifFile)"] --> PARSER["cifApi.ts parser<br/>(lattice params + atom sites)"]
    PARSER --> SV3
    PARSER --> CV
    UV["PeriodicTable.tsx<br/>interactive element selector"] --> MSELP["MaterialsSearchPage filters"]
    DC["MaterialCard.tsx /<br/>FeaturedCarousel.tsx /<br/>DashboardFeaturePanels.tsx"] --> NAV2["navigate to feature routes"]
    SB["Sidebar.tsx — primaryNav + utilityNav<br/>highlighted by current path"] --> ROUTES
    THV["TopHeader.tsx — search box<br/>→ /app/materials?q=…"] --> ROUTES
```

---

## 7. File-by-File Responsibility Matrix

| File | Role | Connects to |
|---|---|---|
| `src/main.tsx` | React root, ThemeProvider, BrowserRouter, Google script | `App.tsx` |
| `src/App.tsx` | Entire route map + layouts | all pages, ProtectedRoute, layouts |
| `src/contexts/AuthContext.tsx` | localStorage auth (dev) | pages, ProtectedRoute |
| `src/contexts/ThemeProvider.tsx` | theme state | MainLayout |
| `src/contexts/ProtectedRoute.tsx` | auth gate + redirect memory | auth context, router |
| `src/layouts/MainLayout.tsx` | `/app` shell | Sidebar, TopHeader, Outlet |
| `src/layouts/PublicLayout.tsx` | public header/footer | LandingPage, ResearchPapersPage |
| `src/lib/api.ts` | base URL + `/trial/predict` (dead) | backend |
| `src/lib/datasetapi.ts` | 5 explore endpoints | backend datasets |
| `src/lib/materialsPredictionApi.ts` | predictions + batch | calculator_router, materials-prediction |
| `src/lib/cifApi.ts` | client CIF parsing | viewers |
| `src/lib/topath.ts` | `askToPath` — ⛔ **UNUSED** | — |
| `src/lib/supabase.ts` | published papers | Supabase |
| `src/pages/cif/CIFGenerationPage.tsx` | generate/download CIF + state handoff | `/cif/api/generate`, `/app/predict` |
| `src/pages/prediction/PropertyPredictionPage.tsx` | CIF upload/props → dedicated results | `predict-properties` |
| `src/pages/prediction/BatchPredictionPage.tsx` | batch upload + polling | `batch-predict/*` |
| `src/pages/materials/MaterialsSearchPage.tsx` | q/periodic-table-driven search + CSV | datasetapi |
| `src/pages/structure/StructureVizPage.tsx` | presets/upload → 3D | StructureViewer |
| `src/pages/auth/SignInPage.tsx` | email + OAuth entry | AuthContext, backend auth |
| `src/pages/public/LandingPage.tsx` | hero/cards/contact + auth gating | navigate, auth |
| `src/pages/public/ResearchPapersPage.tsx` | Supabase papers + filters | supabase.ts |
| `src/components/StructureViewer.tsx` | 3Dmol.js CDN viewer | CIF state |
| `src/components/CrystalViewerCanvas.tsx` | three.js renderer | CIF state |
| `src/components/PeriodicTable.tsx` | element selector | search page |
| `src/pages/dft/*, literature/*, saved/*, settings/*, help/*, advance-search/*` | static/mock, alert-based | none |
| `src/pages/structure/MaterialsDetailsPage.tsx` | ⛔ unused | — |
| `src/data/researchPapers.ts` | ⛔ unused static data | — |
| `src/data/indianmatter/*.csv` | backend-consumed datasets (not built by frontend) | backend routes |
| `public/` | `assets/`, `videos/`, favicon | pages |

---

## 8. Dead/Unused Code & Risks

```mermaid
flowchart TD
    DEAD1["⛔ src/lib/topath.ts (askToPath)"]
    DEAD2["⛔ src/data/researchPapers.ts"]
    DEAD3["⛔ src/pages/structure/MaterialsDetailsPage.tsx"]
    DEAD4["⛔ src/Home.tsx (legacy home)"]
    RISK1["⚠️ /trial/predict — backend has no route"]
    RISK2["⚠️ /api/materials-prediction/* — backend router unwired"]
    RISK3["⚠️ OAuth client ID hardcoded in main.tsx"]
    RISK4["⚠️ localStorage token w/o server verification"]
    RISK5["⚠️ MaterialDetailsPage hardcoded LiCoO₂ preview"]
```
