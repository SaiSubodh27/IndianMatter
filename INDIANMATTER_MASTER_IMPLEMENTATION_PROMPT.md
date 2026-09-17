# MASTER IMPLEMENTATION PROMPT — IndianMatter Property Prediction + Runtime Property Selection

You are working inside the existing **IndianMatter / Final_ validation** project. Your task is to implement a production-quality, end-to-end property prediction workflow without unnecessarily redesigning the application or creating new frontend pages.

## 0. PRIMARY OBJECTIVE

Upgrade the existing CIF prediction workflow so that:

1. A user uploads/provides one or more CIF files through the **existing prediction UI**.
2. When the user clicks **Run Prediction**, do NOT navigate to a new property-selection page.
3. Instead, immediately open a compact **property-selection card/modal/popover in the existing prediction flow**.
4. The user selects exactly which properties they want predicted.
5. The backend dynamically routes each requested property to the appropriate existing prediction/model pipeline.
6. Use the existing **M3GNet, CHGNet, and MACE adapters/models** wherever they are appropriate and already supported by the repository.
7. Use the existing **v5_base_model / V5 surrogate pipeline** for **ionic conductivity**, but first inspect the repository to identify the actual model artifact, expected feature schema, preprocessing, target definition, and inference code. NEVER invent the V5 input schema.
8. Execute independent property predictions in **parallel**, while respecting GPU/CPU resource constraints.
9. Return a unified prediction response to the frontend.
10. Display results in the existing UI without creating unnecessary new pages.
11. Preserve all existing working functionality, APIs, routes, authentication, database behavior, styling, and existing prediction capabilities unless a change is genuinely required.
12. Reuse existing abstractions instead of creating duplicate model/prediction systems.

The implementation must be based on the actual repository contents. Inspect the code first, understand the existing architecture, then modify it.

---

# 1. EXISTING PROJECT STRUCTURE

The project currently has this structure:

```text
Final_ validation/
├── backend
│   ├── calculations
│   │   ├── descriptor_pipeline.py
│   │   ├── eos.py
│   │   └── strain_response.py
│   ├── cif_analyzer
│   │   └── cif_analyzer
│   │       ├── backend.py
│   │       ├── index.html
│   │       ├── README.md
│   │       └── requirements.txt
│   ├── core
│   │   ├── config.py
│   │   ├── device_manager.py
│   │   ├── exceptions.py
│   │   └── job_manager.py
│   ├── models
│   │   ├── base_adapter.py
│   │   ├── chgnet_adapter.py
│   │   ├── m3gnet_adapter.py
│   │   ├── mace_adapter.py
│   │   └── model_registry.py
│   ├── parsing
│   │   ├── csv_parser.py
│   │   ├── feature_validator.py
│   │   └── structure_parser.py
│   ├── prediction_models
│   │   ├── base_adapter.py
│   │   ├── chgnet_adapter.py
│   │   ├── m3gnet_adapter.py
│   │   ├── mace_adapter.py
│   │   └── model_registry.py
│   ├── prediction_results
│   ├── properties
│   │   ├── base_property.py
│   │   ├── composition_properties.py
│   │   ├── direct_outputs.py
│   │   ├── electrical_properties.py
│   │   ├── mechanical_properties.py
│   │   ├── property_registry.py
│   │   ├── structural_properties.py
│   │   └── thermal_properties.py
│   ├── routes
│   │   ├── aflow.py
│   │   ├── auth_routes.py
│   │   ├── cif_routes.py
│   │   ├── database_routes.py
│   │   ├── indianmatter.py
│   │   ├── jarvis.py
│   │   ├── materials_routes.py
│   │   ├── oqmd.py
│   │   ├── predict_routes.py
│   │   ├── prediction_pipeline_routes.py
│   │   └── user_routes.py
│   ├── services
│   │   ├── cif_electrical_features.py
│   │   ├── cif_m3gnet_embeddings.py
│   │   ├── download_service.py
│   │   ├── m3gnet_structure_service.py
│   │   ├── material_filter_service.py
│   │   ├── materials
│   │   ├── prediction_service.py
│   │   └── visualization_service.py
│   ├── Surrogative_models
│   │   ├── final_validation
│   │   │   ├── __init__.py
│   │   │   └── validators.py
│   │   └── feature_extractor.py
│   ├── temp_files
│   ├── tests
│   │   ├── test_api_routes.py
│   │   ├── test_dataset_validation.py
│   │   └── test_property_calculators.py
│   ├── utils
│   │   └── feature_extractor.py
│   ├── workers
│   │   └── prediction_worker.py
│   ├── auth.py
│   ├── cif_analyzer.zip
│   ├── cif_descriptors.py
│   ├── database.py
│   ├── main.py
│   ├── model_service.py
│   ├── models.py
│   ├── requirements.txt
│   └── test_trial_pipeline.py
├── configs
│   ├── config.json
│   ├── paths.json
│   └── temp_required_cols.json
├── dist
│   ├── assets
│   │   ├── about_crystal_scene.png
│   │   ├── about_lattice_clean.png
│   │   ├── about_lattice.png
│   │   ├── about_quartz.png
│   │   ├── contact_crystal.png
│   │   ├── dash_c1_crystal.png
│   │   ├── dash_c2_crystal.png
│   │   ├── dash_mountains.png
│   │   ├── dash_sidebar_crystal.png
│   │   ├── db_aflow.png
│   │   ├── db_jarvis.png
│   │   ├── db_mp.png
│   │   ├── db_nomad.png
│   │   ├── db_oqmd.png
│   │   ├── hero_molecule_clean.png
│   │   ├── hero_molecule.png
│   │   ├── mineral_lfp.png
│   │   ├── mineral_licoo2.png
│   │   ├── mineral_lmo.png
│   │   ├── mineral_nca.png
│   │   ├── mineral_nmc.png
│   │   ├── res_molecule.png
│   │   ├── signin_crystal_clean.png
│   │   ├── signin_crystal.png
│   │   ├── spec_cover_preview.png
│   │   ├── index-3459c647.js
│   │   └── index-be8dc4fa.css
│   ├── index.html
│   ├── mi-icon-mark.png
│   └── mi-icon-mark1.png
├── extracted_screens
│   ├── contact_us.html
│   ├── doping_simulator.html
│   ├── landing_page___indian_materials_ai.html
│   ├── main_dashboard.html
│   ├── materials_explorer.html
│   ├── property_prediction_tool.html
│   ├── saved_materials.html
│   ├── sign_in.html
│   └── trial_experience.html
├── final_models
├── public
│   ├── assets
│   └── mi-icon-mark.png
│   └── mi-icon-mark1.png
├── ranking_results
│   ├── accuracy_report_20260502_220241.csv
│   ├── DRF_accepted_materials_20260503_075519.csv
│   ├── DRF_results_ranked_20260503_075519.csv
│   ├── DRF_statistics_20260503_075519.csv
│   ├── FINAL_HES_DRF_COMPOSITE_RANKING_20260504_115930.csv
│   ├── final_integrated_ranking_v5_enhanced_20260504_115034.csv
│   ├── integrated_HES_DRF_ionic_20260503_075519.csv
│   ├── integrated_HES_DRF_ionic_diagnostics_20260503_075519.json
│   ├── integrated_HES_DRF_ionic_enhanced_final_20260504_114920.csv
│   ├── integrated_HES_DRF_ionic_v5_enhanced_20260504_114844.csv
│   ├── integrated_HES_DRF_ionic_v5_surrogate_20260504_114026.csv
│   ├── integrated_HES_DRF_ionic_v5_surrogate_20260504_114740.csv
│   ├── m3gnet_li_finite_displacement_features_20260503_135433.csv
│   ├── m3gnet_li_finite_displacement_features_20260503_135433.json
│   ├── m3gnet_li_finite_displacement_features_20260503_135531.csv
│   ├── m3gnet_li_finite_displacement_features_20260503_135531.json
│   ├── m3gnet_li_finite_displacement_features_20260503_135804.csv
│   ├── m3gnet_li_finite_displacement_features_20260503_135804.json
│   ├── MAE_COMPARISON_OUR_BASELINE.txt
│   ├── material_summary_20260502_220241.csv
│   ├── materials_fair_20260502_221308.csv
│   ├── ranking_results_20260502_221308.csv
│   ├── ranking_results_full_20260502_221308.csv
│   ├── ranking_results_full_20260502_222014.csv
│   ├── ranking_results_full_20260503_075519_with_DRF.csv
│   ├── ranking_results_full_20260503_075519.csv
│   ├── ranking_summary_20260502_221308.csv
│   ├── ranking_summary_20260502_222014.csv
│   ├── ranking_summary_20260503_075519_with_DRF.csv
│   ├── statistics_20260502_221308.csv
│   ├── statistics_20260502_221308.json
│   ├── statistics_20260503_075519.csv
│   └── unified_m3gnet_343features_ranking_20260504_115731.csv
├── scripts
│   ├── build_v5_dataset.py
│   ├── check_dependencies.py
│   ├── check_deps_init.py
│   ├── check_gpu.py
│   ├── check_models.py
│   ├── run_backend_tests.py
│   ├── run_inference_cif.py
│   └── run_prediction_example.py
├── src
│   ├── components
│   │   ├── DashboardFeaturePanels.tsx
│   │   ├── FeaturedCarousel.tsx
│   │   ├── MaterialCard.tsx
│   │   ├── PeriodicTable.tsx
│   │   ├── Sidebar.tsx
│   │   └── TopHeader.tsx
│   ├── contexts
│   │   └── ThemeProvider.tsx
│   ├── data
│   │   ├── indianmatter
│   │   │   ├── 38510.csv
│   │   │   ├── chgnet_128_embeddings.csv
│   │   │   ├── m3gnet_embeddings.csv
│   │   │   └── pymatgen_matminer.csv
│   │   └── researchPapers.ts
│   ├── layouts
│   │   ├── MainLayout.tsx
│   │   └── PublicLayout.tsx
│   ├── lib
│   │   ├── api.ts
│   │   ├── cifApi.ts
│   │   ├── datasetapi.ts
│   │   ├── materialsPredictionApi.ts
│   │   ├── parseCIF.ts
│   │   └── topath.ts
│   ├── pages
│   │   ├── cif
│   │   │   └── CIFGenerationPage.tsx
│   │   ├── dashboard
│   │   │   └── DashboardPage.tsx
│   │   ├── dft
│   │   │   └── DFTValidationPage.tsx
│   │   ├── help
│   │   │   └── HelpPage.tsx
│   │   ├── literature
│   │   │   └── LiteraturePage.tsx
│   │   ├── materials
│   │   │   ├── AdvancedSearchPage.tsx
│   │   │   ├── MaterialDetailsPage.tsx
│   │   │   └── MaterialsSearchPage.tsx
│   │   ├── prediction
│   │   │   ├── BatchPredictionPage.tsx
│   │   │   └── PropertyPredictionPage.tsx
│   │   ├── public
│   │   │   ├── LandingPage.tsx
│   │   │   └── SignInPage.tsx
│   │   ├── results
│   │   │   └── SavedResultsPage.tsx
│   │   ├── settings
│   │   │   └── SettingsPage.tsx
│   │   └── structure
│   │       └── StructureVizPage.tsx
│   ├── App.tsx
│   ├── Home.tsx
│   ├── index.css
│   └── main.tsx
├── trial_results
├── website
├── add_motion.js
├── eslint.config.js
├── package-lock.json
├── package.json
├── postcss.config.js
├── safely_animate.cjs
├── tailwind.config.js
├── tsconfig.json
└── vite.config.ts
```

The above is the known project structure. Do not assume that every file still contains the exact implementation implied by its filename. Inspect the real contents.

---

# 2. MANDATORY FIRST STEP — AUDIT THE EXISTING CODE

Before modifying anything:

### Backend audit

Inspect at minimum:

```text
backend/main.py
backend/model_service.py
backend/routes/predict_routes.py
backend/routes/prediction_pipeline_routes.py
backend/routes/indianmatter.py

backend/models/base_adapter.py
backend/models/chgnet_adapter.py
backend/models/m3gnet_adapter.py
backend/models/mace_adapter.py
backend/models/model_registry.py

backend/prediction_models/base_adapter.py
backend/prediction_models/chgnet_adapter.py
backend/prediction_models/m3gnet_adapter.py
backend/prediction_models/mace_adapter.py
backend/prediction_models/model_registry.py

backend/properties/base_property.py
backend/properties/composition_properties.py
backend/properties/direct_outputs.py
backend/properties/electrical_properties.py
backend/properties/mechanical_properties.py
backend/properties/structural_properties.py
backend/properties/thermal_properties.py
backend/properties/property_registry.py

backend/services/prediction_service.py
backend/services/cif_electrical_features.py
backend/services/cif_m3gnet_embeddings.py
backend/services/m3gnet_structure_service.py
backend/workers/prediction_worker.py
backend/core/device_manager.py
backend/core/job_manager.py

backend/cif_descriptors.py
backend/Surrogative_models/feature_extractor.py
backend/Surrogative_models/final_validation/validators.py

scripts/build_v5_dataset.py
scripts/run_inference_cif.py
scripts/run_prediction_example.py
scripts/check_models.py
```

Also inspect:

```text
final_models/
ranking_results/
trial_results/
configs/
```

especially anything related to:

- V5
- v5_base_model
- ionic conductivity
- surrogate
- ionic
- DRF
- finite displacement
- M3GNet features
- CHGNet embeddings
- feature extraction
- model checkpoints
- scalers
- encoders
- preprocessing
- target transforms

### Frontend audit

Inspect:

```text
src/pages/prediction/PropertyPredictionPage.tsx
src/pages/prediction/BatchPredictionPage.tsx
src/lib/materialsPredictionApi.ts
src/lib/cifApi.ts
src/lib/parseCIF.ts
src/App.tsx
src/index.css
```

Also inspect any components currently used by the prediction pages.

### Do not begin implementation until you understand:

1. Current CIF upload flow.
2. Current Run Prediction flow.
3. Existing API endpoints.
4. Existing prediction request/response schemas.
5. Existing model registry.
6. Existing property registry.
7. Existing M3GNet/CHGNet/MACE adapters.
8. Existing job/background worker system.
9. Existing device/GPU management.
10. Existing V5 ionic-conductivity implementation.
11. Existing frontend result rendering.
12. Existing tests.

---

# 3. IMPORTANT — DO NOT INVENT MODEL CAPABILITIES

This is a scientific materials-prediction application.

Do NOT make claims such as:

- "MACE predicts band gap"
- "CHGNet predicts conductivity"
- "M3GNet directly predicts every material property"

unless the repository's actual implementation/model checkpoint supports that property.

Instead:

### M3GNet / CHGNet / MACE

Use these models for properties that the existing project already supports through their adapters, or for feature/embedding generation that is actually required by an existing property model.

Inspect their adapters and checkpoints first.

### Ionic conductivity

Ionic conductivity MUST use the existing **v5_base_model / V5 surrogate workflow** found in the repository.

Do not replace it with a generic M3GNet/CHGNet/MACE prediction.

Do not train a new model unless explicitly required because the existing V5 model is missing/broken.

Do not invent feature columns.

Determine the V5 pipeline from the actual repository artifacts/code, including:

- model file
- feature extractor
- feature order
- preprocessing
- scaling
- categorical encoding
- missing-value handling
- target transformation
- target units
- inverse transformation
- validation logic

If multiple V5 artifacts exist, identify which one is the production/current model and explain why using repository evidence.

---

# 4. TARGET USER EXPERIENCE

The desired flow is:

```text
User opens existing Property Prediction page
            ↓
Uploads CIF
            ↓
CIF is parsed/validated
            ↓
User clicks "Run Prediction"
            ↓
A PROPERTY SELECTION CARD opens
            ↓
User selects desired properties
            ↓
User clicks "Predict Selected Properties"
            ↓
Frontend sends:
    CIF + selected property IDs
            ↓
Backend validates request
            ↓
Property router determines required models/features
            ↓
Shared features are computed once
            ↓
Independent prediction jobs execute in parallel
            ↓
Results are aggregated
            ↓
Unified response returned
            ↓
Existing results UI displays only selected properties
```

There must NOT be a new property-selection route/page.

Use a modal/card/drawer/popover in the existing prediction page.

---

# 5. PROPERTY SELECTION CARD

Implement a reusable React/TypeScript property selection component if one does not already exist.

Prefer a component such as:

```text
src/components/PropertySelectionCard.tsx
```

ONLY if a reusable component is genuinely needed.

Do not create a new page.

The card should appear at runtime after the user has supplied a valid CIF and clicked Run Prediction.

The card should show grouped properties, for example:

### Structural
- Crystal system
- Space group
- Lattice parameters
- Unit-cell volume
- Density
- Formation/structure-related outputs only if already supported

### Composition
- Formula
- Elemental fractions
- Composition descriptors
- Average atomic mass
- Other existing composition features

### Mechanical
Show only properties actually supported by the current project/models, such as:
- Bulk modulus
- Shear modulus
- Young's modulus
- Poisson ratio
- Elastic-related outputs

Do not fabricate unsupported predictions.

### Thermal
Show only currently supported outputs.

### Electrical
Show currently supported outputs.

### Ionic
- Ionic conductivity

Ionic conductivity must clearly indicate that it uses the V5 ionic-conductivity model/pipeline.

### Model-derived / direct outputs
Expose appropriate M3GNet/CHGNet/MACE outputs only if the backend actually supports them.

---

# 6. PROPERTY IDs MUST BE STABLE

Define stable machine-readable property IDs.

Example:

```text
ionic_conductivity
density
bulk_modulus
shear_modulus
youngs_modulus
poisson_ratio
band_gap
formation_energy
energy_above_hull
```

BUT do not blindly use this list.

Build the final list from the repository's actual supported properties.

Every property should have metadata such as:

```typescript
{
  id: "ionic_conductivity",
  label: "Ionic Conductivity",
  category: "Ionic",
  unit: "...",
  description: "...",
  model: "v5_base_model",
  requires: [...]
}
```

The unit MUST come from the existing V5 implementation/model definition. Do not guess.

---

# 7. BACKEND PROPERTY ROUTER

Create or improve a centralized property-routing layer.

Prefer reusing:

```text
backend/properties/property_registry.py
backend/models/model_registry.py
backend/prediction_models/model_registry.py
backend/services/prediction_service.py
```

Do not create another competing registry if an existing registry can be extended cleanly.

The router should conceptually map:

```text
property_id
    ↓
property definition
    ↓
required feature pipeline
    ↓
model adapter
    ↓
prediction function
    ↓
result formatter
```

Example conceptual mapping:

```python
PROPERTY_ROUTES = {
    "ionic_conductivity": {
        "engine": "v5_base_model",
        "feature_pipeline": "existing_v5_pipeline",
        "output_type": "scalar"
    }
}
```

For M3GNet/CHGNet/MACE properties, use the project's existing adapter/registry architecture.

Do not duplicate model-loading code.

---

# 8. SHARED FEATURE COMPUTATION

A major performance requirement:

If the user selects multiple properties that share features, compute the shared features ONCE.

For example:

```text
CIF
 ↓
Structure parsing
 ↓
normalized Structure object
 ├── composition features
 ├── structural features
 ├── M3GNet embeddings/features
 ├── CHGNet embeddings/features
 ├── MACE features/outputs
 └── V5-required features
```

The property router should know dependencies.

Example conceptual dependency graph:

```text
ionic_conductivity
    ↓
V5 feature extractor
    ↓
required CIF + derived features

property_A
    ↓
M3GNet
    ↓
M3GNet features

property_B
    ↓
M3GNet
    ↓
same M3GNet features
```

Do not calculate M3GNet embeddings twice for two selected properties.

Cache per-request intermediate results.

---

# 9. PARALLEL PROCESSING

Predictions for independent selected properties must execute in parallel.

Use the project's existing worker/job system if it already supports this:

```text
backend/workers/prediction_worker.py
backend/core/job_manager.py
backend/core/device_manager.py
```

Do not create uncontrolled threads/processes that can exhaust GPU memory.

The implementation must distinguish:

### CPU-bound work
May use an appropriate executor/process pool if safe.

### GPU-bound work
Must respect the existing device manager/resource controls.

### Same-model batching
If multiple CIFs require the same model and batching is supported, prefer batching.

### Different models
Allow independent model tasks to run concurrently only when GPU/resource constraints permit it.

The goal is parallel execution without causing:

- CUDA OOM
- duplicate model loading
- race conditions
- corrupted model state
- excessive RAM use

---

# 10. MODEL LOADING

Models should not be loaded repeatedly for every property.

Use the existing model registry/cache/service architecture.

Desired conceptual behavior:

```text
first request
    ↓
load required model(s)
    ↓
cache model
    ↓
run inference

later request
    ↓
reuse loaded model
```

However, follow the actual architecture already implemented in the repository.

For each model, verify:

- checkpoint path
- device
- dtype
- initialization
- thread/process safety
- model evaluation mode
- preprocessing
- postprocessing

Do not silently download huge models at runtime.

If a model is missing, return a clear actionable backend error.

---

# 11. V5 IONIC CONDUCTIVITY PIPELINE

This is a critical requirement.

Find the existing V5 base model implementation and trace it from:

```text
CIF
→ feature extraction
→ preprocessing
→ v5_base_model
→ prediction
→ inverse transform
→ ionic conductivity result
```

Search the whole repository for:

```text
v5_base_model
V5
ionic_conductivity
ionic conductivity
surrogate
ionic
build_v5_dataset
```

Inspect:

```text
ranking_results/
scripts/build_v5_dataset.py
surrogate_model_v5_fixed.ipynb
backend/Surrogative_models/
backend/services/cif_electrical_features.py
backend/services/cif_m3gnet_embeddings.py
backend/utils/feature_extractor.py
backend/Surrogative_models/feature_extractor.py
```

Use the actual production artifacts.

If the V5 model expects M3GNet/CHGNet/other embeddings, compute those through the existing feature pipeline.

If it expects specific columns, preserve exact feature order.

If it expects a scaler, load the matching scaler.

If it expects log-transformed conductivity, correctly apply the inverse transform.

If the model returns a transformed target, do not display the transformed value as raw conductivity.

Always include:

```json
{
  "property": "ionic_conductivity",
  "value": ...,
  "unit": "...",
  "model": "v5_base_model",
  "status": "success"
}
```

plus confidence/uncertainty metadata ONLY if the existing model provides a valid uncertainty estimate.

Do not invent confidence values.

---

# 12. CIF VALIDATION

Before prediction:

1. Validate that the CIF exists.
2. Parse using the project's existing structure parser.
3. Validate required crystallographic information.
4. Normalize the structure using existing logic.
5. Return a clear validation error if parsing fails.

Do not duplicate CIF parsing logic if:

```text
backend/parsing/structure_parser.py
```

already provides it.

Do not silently "repair" invalid CIF data in a way that changes the material without telling the user.

---

# 13. API DESIGN

Inspect the current prediction endpoints first.

If an existing endpoint can be extended safely, extend it rather than creating redundant endpoints.

The request should conceptually support:

```json
{
  "cif": "...",
  "properties": [
    "ionic_conductivity",
    "density",
    "bulk_modulus"
  ]
}
```

For uploaded files, preserve the existing multipart/form-data mechanism if that is what the current API uses.

The backend response should conceptually be:

```json
{
  "status": "success",
  "material": {
    "formula": "...",
    "space_group": "..."
  },
  "requested_properties": [
    "ionic_conductivity",
    "density"
  ],
  "results": {
    "ionic_conductivity": {
      "value": 0,
      "unit": "...",
      "model": "v5_base_model",
      "status": "success"
    },
    "density": {
      "value": 0,
      "unit": "...",
      "model": "...",
      "status": "success"
    }
  },
  "errors": []
}
```

These are examples only. Adapt the schema to the project's existing API conventions.

The response MUST support partial success.

Example:

```text
ionic conductivity → success
density → success
mechanical property → failed
```

Do not fail the entire request if one independent property fails.

Return per-property errors.

---

# 14. FRONTEND API CLIENT

Update the existing API client:

```text
src/lib/materialsPredictionApi.ts
```

or the appropriate existing client.

Do not create multiple competing API clients.

The frontend should send:

```text
CIF
+
selected property IDs
```

and receive the unified results.

Handle:

- loading
- success
- partial success
- complete failure
- cancellation if supported
- validation errors
- backend/model errors

---

# 15. FRONTEND PROPERTY CARD BEHAVIOR

When Run Prediction is clicked:

### Step 1

Validate CIF locally if existing functionality supports it.

### Step 2

Open the property-selection card.

### Step 3

User selects properties.

Use checkboxes or selectable cards.

### Step 4

Show:

```text
X properties selected
```

### Step 5

Button:

```text
Predict Selected Properties
```

### Step 6

On submit:

```text
card closes or transitions to prediction progress state
```

No page navigation.

### Step 7

Show progress.

For example:

```text
Preparing structure...
✓ CIF parsed

Computing shared features...
✓ Structure features

Running predictions...
✓ Density
⟳ Ionic conductivity
⟳ Mechanical properties

Finalizing results...
```

Do not claim a property is complete until the backend actually reports completion.

---

# 16. RESULTS DISPLAY

Use the existing prediction/results UI.

Do not create a new results page unless the current architecture absolutely requires it.

The UI should display only the requested properties.

Group results:

```text
Structural
Composition
Mechanical
Thermal
Electrical
Ionic
```

Each result should show:

- property name
- value
- unit
- model/source
- status
- optional uncertainty if actually available
- optional explanation/details if already supported

For ionic conductivity specifically:

```text
Ionic Conductivity
[value] [unit]
Model: V5 Base Model
```

Do not display a generic M3GNet/CHGNet label for the V5 ionic-conductivity result.

---

# 17. MODEL TRANSPARENCY

Every prediction result should identify the actual model/pipeline used.

Examples:

```text
M3GNet
CHGNet
MACE
V5 Base Model
Direct/CIF-derived
```

Do not mislabel a surrogate prediction as the underlying feature model.

If a V5 model consumes M3GNet features, report:

```text
Prediction model: V5 Base Model
Features: M3GNet-derived + ...
```

only if verified from the actual implementation.

---

# 18. PROPERTY AVAILABILITY

The frontend property list must be generated from a backend-supported property definition or a shared source of truth whenever practical.

Avoid hard-coding a property as available when its model/checkpoint is missing.

Each property should have:

```text
supported: true/false
model
requirements
unit
```

If a model is unavailable, either:

- hide the property, or
- show it disabled with a useful explanation.

Prefer consistency with the existing application design.

---

# 19. ERROR HANDLING

Implement robust errors.

Examples:

### CIF error

```text
Invalid CIF: unable to parse crystal structure.
```

### Missing model

```text
Ionic conductivity model is unavailable on this installation.
```

### Missing V5 feature

```text
Unable to generate required V5 feature: <feature>.
```

### Model runtime error

```text
MACE prediction failed: <safe technical message>.
```

Do not expose secrets, filesystem credentials, API keys, or unnecessary internal stack traces to users.

Keep detailed errors in backend logs.

---

# 20. PERFORMANCE

Avoid repeated work.

Bad:

```text
property 1 → parse CIF
property 2 → parse CIF
property 3 → parse CIF
```

Good:

```text
parse CIF once
     ↓
normalized structure
     ↓
shared feature cache
     ↓
parallel property predictions
```

Likewise:

```text
M3GNet embedding requested by 3 properties
```

must ideally mean:

```text
compute M3GNet embedding once
reuse it 3 times
```

---

# 21. BATCH CIF SUPPORT

Inspect the existing:

```text
BatchPredictionPage.tsx
```

and backend batch mechanisms.

Do not break them.

If batch prediction already exists, extend the same property-selection concept so the user can choose properties for the batch.

Desired conceptual flow:

```text
Upload multiple CIFs
        ↓
Run Prediction
        ↓
Property Selection Card
        ↓
Select properties
        ↓
Submit
        ↓
CIF jobs × property jobs
        ↓
parallel scheduling
        ↓
aggregated batch results
```

Respect model batching and GPU memory.

Do not spawn one heavyweight model instance per CIF.

---

# 22. JOB/WORKER ARCHITECTURE

If the project already has:

```text
job_manager.py
prediction_worker.py
```

use them.

Do not create a second job system.

A useful conceptual job structure is:

```text
PredictionRequest
 ├── CIF
 ├── selected_properties
 ├── request_id
 └── options

PredictionPlan
 ├── shared_features
 ├── model_tasks
 └── property_tasks

PredictionResult
 ├── property_id
 ├── value
 ├── unit
 ├── model
 ├── status
 └── error
```

Adapt these to existing classes rather than blindly adding duplicates.

---

# 23. DEVICE MANAGEMENT

Inspect:

```text
backend/core/device_manager.py
```

and existing GPU handling.

Use the current device abstraction.

The implementation must work correctly for:

```text
CPU-only
CUDA GPU
```

if the project already supports both.

Never assume CUDA exists.

Never hard-code:

```python
device = "cuda"
```

unless the existing device manager determines it.

---

# 24. TESTING

Add/update tests.

At minimum test:

### Property selection

```text
no properties selected → validation error
one property → valid
multiple properties → valid
unsupported property → rejected
duplicate property IDs → handled
```

### API

```text
valid CIF + selected properties
invalid CIF
missing property list
unsupported property
partial model failure
```

### Routing

Verify:

```text
ionic_conductivity → V5 base model
```

and verify actual mappings for M3GNet/CHGNet/MACE-supported properties.

### Parallel execution

Verify that independent properties are scheduled concurrently or through the project's worker mechanism.

Do not use fragile timing-only tests.

### Feature reuse

Verify shared feature extraction is not redundantly performed.

### Regression

Run the existing test suite.

---

# 25. SCIENTIFIC CORRECTNESS REQUIREMENTS

This is not just a UI task.

For every predicted property verify:

1. Correct input structure.
2. Correct preprocessing.
3. Correct model.
4. Correct feature order.
5. Correct target transform.
6. Correct inverse transform.
7. Correct unit.
8. Correct postprocessing.
9. Correct handling of missing features.
10. Correct model checkpoint.

Do not "make the output look reasonable."

A numerically plausible but scientifically incorrect result is a failure.

---

# 26. DO NOT REWRITE THE WHOLE PROJECT

This is critical.

Do NOT:

- replace the backend framework
- replace React/Vite
- replace model adapters
- rewrite the entire prediction system
- create a second prediction API
- create a second model registry
- create a second CIF parser
- create a new prediction page
- remove existing functionality
- modify unrelated pages
- modify generated `dist` assets unless the project explicitly requires a production build
- delete existing models/checkpoints/results
- change working routes unnecessarily

Make the **smallest coherent architectural changes** needed.

---

# 27. FILES TO PREFER FOR CHANGES

Likely backend changes should be concentrated around:

```text
backend/properties/
backend/services/prediction_service.py
backend/routes/predict_routes.py
backend/routes/prediction_pipeline_routes.py
backend/workers/prediction_worker.py
backend/core/job_manager.py
backend/core/device_manager.py
backend/models/
backend/prediction_models/
```

Likely frontend changes:

```text
src/pages/prediction/PropertyPredictionPage.tsx
src/pages/prediction/BatchPredictionPage.tsx
src/components/
src/lib/materialsPredictionApi.ts
```

But these are NOT mandates. First inspect the actual implementation.

---

# 28. CONFIGURATION

Inspect:

```text
configs/config.json
configs/paths.json
```

and existing environment configuration.

Do not hard-code model paths such as:

```text
C:\...
```

Use existing configuration/environment conventions.

Model paths should be configurable.

For example, conceptually:

```text
V5_MODEL_PATH
M3GNET_MODEL_PATH
CHGNET_MODEL_PATH
MACE_MODEL_PATH
```

only if that matches the project's current configuration architecture.

Do not introduce environment variables unnecessarily.

---

# 29. SECURITY

Do not expose:

- API keys
- secrets
- credentials
- internal filesystem paths
- stack traces
- database credentials

Do not allow a frontend request to arbitrarily execute a model or Python file.

Property IDs must be validated against an allowlisted registry.

---

# 30. LOGGING

Backend logs should clearly show:

```text
prediction request received
CIF parsed
selected properties
prediction plan
required features
models selected
tasks started
tasks completed
task failures
total duration
```

Example:

```text
Prediction request abc123
Properties: ionic_conductivity,density
V5 features: started
M3GNet features: started
V5 prediction: started
Density prediction: started
...
```

Do not log sensitive information.

---

# 31. IMPLEMENTATION STRATEGY

Follow this exact development sequence:

## Phase A — Understand

Inspect the entire relevant code path.

Trace:

```text
frontend button
→ frontend API
→ backend route
→ service
→ model registry
→ adapter
→ model
→ response
→ frontend result
```

## Phase B — Map properties

Create a verified property/model dependency table based on actual code.

Example format:

```text
Property
Model
Feature pipeline
Units
Checkpoint
Status
```

Do not guess.

## Phase C — V5 audit

Trace ionic conductivity end-to-end.

Document internally:

```text
V5 checkpoint
features
feature order
preprocessing
target
units
postprocessing
```

## Phase D — Backend routing

Implement/extend centralized property routing.

## Phase E — Shared feature caching

Ensure features are computed once per request where possible.

## Phase F — Parallel execution

Use existing workers/job manager/device manager.

## Phase G — API

Extend existing prediction endpoint(s).

## Phase H — Frontend

Add runtime property-selection card to the existing page.

No new page.

## Phase I — Results

Render selected properties in existing UI.

## Phase J — Tests

Run tests and fix regressions.

## Phase K — Final verification

Run a real CIF through the complete flow.

---

# 32. REAL CIF END-TO-END TEST

Use an existing test CIF from the project if available.

Do not invent fake scientific output.

Test:

```text
CIF upload
→ property card
→ select ionic conductivity
→ submit
→ V5 feature extraction
→ V5 model
→ result
```

Then test:

```text
CIF
→ select 2–5 supported properties
→ shared feature generation
→ parallel predictions
→ unified response
→ UI rendering
```

Then test batch mode if it exists.

---

# 33. ACCEPTANCE CRITERIA

The task is complete only when ALL are true:

### UX

- [ ] User uploads CIF using existing UI.
- [ ] User clicks Run Prediction.
- [ ] Property-selection card appears in the existing page.
- [ ] No new property-selection page is created.
- [ ] User can select multiple properties.
- [ ] User can cancel/close selection.
- [ ] User can submit selected properties.
- [ ] Loading/progress state is visible.
- [ ] Results show only requested properties.

### Backend

- [ ] Selected property IDs are validated.
- [ ] Central routing maps properties to verified prediction pipelines.
- [ ] Existing M3GNet adapter is reused where appropriate.
- [ ] Existing CHGNet adapter is reused where appropriate.
- [ ] Existing MACE adapter is reused where appropriate.
- [ ] Ionic conductivity uses the verified V5 base model.
- [ ] V5 preprocessing is correct.
- [ ] V5 feature ordering is correct.
- [ ] V5 target inverse transformation is correct.
- [ ] Units are correct.
- [ ] Shared features are reused.
- [ ] Independent predictions execute in parallel where safe.
- [ ] GPU/resource limits are respected.
- [ ] Partial failures are supported.
- [ ] Errors are useful and safe.

### Frontend

- [ ] No unnecessary new pages.
- [ ] Existing prediction page remains the primary flow.
- [ ] Property-selection card is clean and responsive.
- [ ] API request contains selected properties.
- [ ] API response is correctly rendered.
- [ ] Partial failures are displayed per property.
- [ ] Existing design language is preserved.

### Quality

- [ ] Existing tests pass.
- [ ] New routing tests pass.
- [ ] V5 ionic conductivity path is tested.
- [ ] API tests pass.
- [ ] Frontend build/type-check passes.
- [ ] No unrelated functionality is broken.
- [ ] No duplicate prediction architecture has been introduced.

---

# 34. IMPORTANT RULE FOR AMBIGUITY

If you encounter an unclear implementation detail:

DO NOT guess.

Inspect:

- imports
- callers
- tests
- notebooks
- model files
- configuration
- CSV headers
- JSON metadata
- existing inference scripts

Use repository evidence.

If something is genuinely impossible to determine, stop and clearly report:

```text
UNKNOWN:
<what is missing>

EVIDENCE CHECKED:
<files inspected>

REQUIRED:
<what must be provided>
```

Do not fabricate a scientific model interface.

---

# 35. CODE QUALITY

Write maintainable code.

Prefer:

```python
type hints
dataclasses / typed schemas where appropriate
small functions
clear names
centralized registries
structured errors
logging
tests
```

Avoid:

```python
huge functions
copy/paste model code
magic strings everywhere
global mutable state without justification
silent exception swallowing
fake fallback predictions
```

---

# 36. FINAL RESPONSE AFTER IMPLEMENTATION

After making changes, report:

## Changed files

List every file modified.

## Architecture

Explain:

```text
CIF
→ property selection
→ prediction planner
→ shared feature extraction
→ model routing
→ parallel inference
→ aggregation
→ UI
```

## Property/model map

Provide the verified final mapping.

## Ionic conductivity

State exactly:

- V5 model artifact used
- feature pipeline
- target
- units
- preprocessing/postprocessing

ONLY based on repository evidence.

## Tests

List commands executed and results.

## Known limitations

List any genuine limitations.

Do not claim success if tests were not actually run.

---

# 37. MOST IMPORTANT INSTRUCTION

You are an implementation agent working on an existing scientific application.

**DO NOT START BY WRITING NEW CODE.**

First inspect the repository and trace the current implementation.

Then make minimal, coherent modifications.

The final system should behave like:

```text
                 ┌──────────────────────────┐
                 │ Existing CIF Prediction   │
                 │          Page             │
                 └────────────┬─────────────┘
                              │
                       Upload / CIF
                              │
                       Run Prediction
                              │
                              ▼
                 ┌──────────────────────────┐
                 │ Property Selection Card  │
                 │                          │
                 │ ☑ Ionic Conductivity     │
                 │ ☑ Structural properties  │
                 │ ☑ Mechanical properties  │
                 │ ☑ Thermal properties     │
                 │ ☑ Electrical properties  │
                 │                          │
                 │ [Predict Selected]       │
                 └────────────┬─────────────┘
                              │
                              ▼
                    Prediction Planner
                              │
             ┌────────────────┼────────────────┐
             │                │                │
             ▼                ▼                ▼
        M3GNet path       CHGNet/MACE      V5 path
             │                │                │
             │                │        Ionic Conductivity
             │                │                │
             └────────────────┼────────────────┘
                              │
                     Shared feature cache
                              │
                    Parallel safe inference
                              │
                              ▼
                    Result Aggregator
                              │
                              ▼
                    Existing Results UI
```

The central principle is:

**User chooses properties at runtime → backend dynamically routes only those properties to the correct verified models → shared features are reused → independent predictions run safely in parallel → results return to the existing UI.**

Do not create a new property-selection page. Do not replace the existing model architecture. Do not invent model capabilities or scientific values. Reuse what already exists, verify everything against the repository, and implement the smallest robust change that achieves this workflow.
