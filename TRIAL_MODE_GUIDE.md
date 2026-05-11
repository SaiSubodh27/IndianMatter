# Trial Mode - Complete Guide

## Overview

Trial mode is a production-ready backend service for your React frontend that allows users to upload CIF (Crystallographic Information File) files and get complete materials analysis including:

- ✅ **343 Feature Extraction** (M3GNet + MAGPIE)
- ✅ **Activation Energy (EA) Prediction**
- ✅ **Pre-exponential Factor (A) Calculation**
- ✅ **Ionic Conductivity Computation**
- ✅ **Crystal Type Classification**
- ✅ **HES Score Calculation**
- ✅ **Comprehensive Error Handling**

---

## Setup & Installation

### 1. Install Python Dependencies

```bash
# Activate your virtual environment
cd "C:\Users\saisu\OneDrive\Desktop\Final_ validation"
.venv\Scripts\activate

# Install trial mode dependencies
pip install -r trial_mode_requirements.txt
```

### 2. Verify Pretrained Models

Ensure these files exist in `pretrained_models/`:

- `v5_base_models.pkl` ✓
- `v5_meta_model.pkl` ✓
- `v5_model2_A.pkl` ✓
- `v5_quantile_transformer.pkl` ✓

Verify MAGPIE features in `datasets/`:

- `v5_300plus_features_cache.csv` ✓
- `v5_merged_training_dataset.csv` ✓

### 3. Start Backend

```bash
python run_trial_mode.py
```

You should see:

```
[STARTUP] Trial Mode Backend - 2026-05-05T...
[INIT] Loading pretrained models...
  ✓ base_models: loaded
  ✓ meta_model: loaded
  ...
[STARTUP] Starting Flask server...
  URL: http://localhost:5000
```

---

## API Endpoints

### POST /analyze-cif

Upload a CIF file and get complete analysis.

**Request:**

```
POST http://localhost:5000/analyze-cif
Content-Type: multipart/form-data

Parameters:
  - file: (required) CIF file
  - material_id: (optional) Custom material ID
```

**Response:**

```json
{
  "status": "success",
  "material_id": "Li2O",
  "timestamp": "2026-05-05T12:00:00.000000",
  "results": {
    "features": {
      "count": 343,
      "status": "success",
      "extraction_time": 2.45
    },
    "ea": {
      "ea_ev": 0.45,
      "ea_kcal_mol": 10.36,
      "status": "success",
      "method": "EA_model"
    },
    "pre_exponential": {
      "value": 1.8e15,
      "log10_value": 15.26,
      "method": "structure_based_estimation"
    },
    "conductivity": {
      "sigma_s_cm": 1.23e-5,
      "sigma_log10": -4.91,
      "status": "success"
    },
    "crystal_type": {
      "crystal_type": "cubic",
      "confidence": 0.95,
      "space_group": "Fm-3m",
      "point_group": "m-3m"
    },
    "hes_score": {
      "hes_score": 22.5,
      "hes_normalized": 0.225,
      "stability_rating": "moderate",
      "status": "success"
    }
  },
  "errors": [],
  "warnings": ["Note: Some features had to be estimated"]
}
```

### GET /health

Check backend status.

```bash
curl http://localhost:5000/health
```

### GET /last-result

Get the last analysis result.

```bash
curl http://localhost:5000/last-result
```

### GET /error-log

Get all errors from current session.

```bash
curl http://localhost:5000/error-log
```

### POST /clear-uploads

Clear the uploads folder.

```bash
curl -X POST http://localhost:5000/clear-uploads
```

---

## React Integration

### 1. Use the Custom Hook

```javascript
import { useTrialModeAPI } from "./api/useTrialModeAPI";

function TrialModeUpload() {
  const { analyzeCif, loading, result, error, progress } = useTrialModeAPI();
  const [file, setFile] = useState(null);

  const handleUpload = async () => {
    if (file) {
      const data = await analyzeCif(file, "MyMaterial");
      console.log(data.results);
    }
  };

  return (
    <div>
      <input
        type="file"
        accept=".cif"
        onChange={(e) => setFile(e.target.files?.[0])}
        disabled={loading}
      />
      <button onClick={handleUpload} disabled={loading}>
        {loading ? `Analyzing... ${progress}` : "Analyze CIF"}
      </button>

      {error && <div style={{ color: "red" }}>{error}</div>}

      {result && (
        <div>
          <h3>Results</h3>
          <p>EA: {result.results.ea.ea_ev} eV</p>
          <p>σ: {result.results.conductivity.sigma_s_cm} S/cm</p>
          <p>HES: {result.results.hes_score.hes_score}/100</p>
        </div>
      )}
    </div>
  );
}
```

### 2. Environment Variable

In your React `.env`:

```
REACT_APP_API_URL=http://localhost:5000
```

---

## Troubleshooting

### Issue: "Not all 343 features extracting"

**Cause:** Some feature calculations fail due to structure issues.

**Solution:**

1. Check the `warnings` array in response
2. Verify CIF file is valid (no disorder)
3. Check if all atoms have proper occupancies (should be 1.0)

### Issue: "Same CIF file reused"

**Cause:** Backend keeps uploads in memory.

**Solution:**

```bash
# Clear uploads manually
curl -X POST http://localhost:5000/clear-uploads

# Or restart backend
python run_trial_mode.py
```

### Issue: "Miscalculation in ionic conductivity"

**Cause:** Invalid EA or pre-exponential factor.

**Check:**

```json
{
  "status": "error",
  "errors": [
    "Invalid EA: -0.5. Must be non-negative and finite.",
    "Check EA=0.45 eV, A=1.8e15"
  ]
}
```

**Solution:**

- Verify EA model predictions are in valid range (0-2.0 eV)
- Ensure pre-exponential factor is positive and finite

### Issue: "Backend won't start"

```bash
# 1. Check Python path
python --version

# 2. Verify dependencies
pip list | findstr "flask numpy pandas"

# 3. Check port 5000 is available
netstat -ano | findstr ":5000"

# 4. Try different port
# Edit trial_mode_backend.py: app.run(port=5001)
```

---

## Common Workflow

### Trial Mode Flow Chart

```
User Upload CIF
       ↓
[1] Parse CIF
    ├─ Check file exists
    ├─ Check not empty
    ├─ Parse with Pymatgen
    └─ Validate structure

       ↓
[2] Extract 343 Features
    ├─ MAGPIE descriptors (elemental)
    ├─ M3GNet features (structural)
    ├─ Li-specific features
    └─ Validate count = 343

       ↓
[3] Predict EA (Activation Energy)
    ├─ Load EA model
    ├─ Make prediction
    └─ Validate range (0-2.0 eV)

       ↓
[4] Calculate A (Pre-exponential)
    ├─ Structure-based estimation
    └─ Validate > 0

       ↓
[5] Calculate Conductivity
    ├─ σ = A × exp(-EA/kT)
    └─ Validate > 0

       ↓
[6] Classify Crystal Type
    ├─ Analyze symmetry
    ├─ Get space group
    └─ Classify (cubic/hex/tet/etc)

       ↓
[7] Compute HES Score
    ├─ EA → normalized score
    └─ Rate stability

       ↓
Return Full JSON + Errors/Warnings
```

---

## Data Location

```
Final_ validation/
├── trial_mode_backend.py          # Main backend
├── run_trial_mode.py               # Startup script
├── trial_mode_requirements.txt      # Dependencies
├── useTrialModeAPI.js              # React hook
├── TRIAL_MODE_GUIDE.md             # This file
│
├── trial_uploads/                  # Uploaded CIF files
│   └── material_id/
│       └── file.cif
│
└── trial_results/                  # Analysis results JSON
    └── material_id_result.json
```

---

## Next Steps

1. ✅ **Backend running** → Test with `/health` endpoint
2. ✅ **Upload a test CIF** → `POST /analyze-cif`
3. ✅ **Integrate React** → Import `useTrialModeAPI` hook
4. ✅ **Handle errors** → Check `errors` & `warnings` arrays
5. ✅ **Deploy** → Use Docker or cloud platform

---

## Example Test CIF

You can test with any CIF from the `Obliex_cifs/all_randomized_cifs/` folder:

```bash
# List available CIFs
ls Obliex_cifs/all_randomized_cifs/ | head -5

# Use one for testing
# e.g., 00x.cif
```

---

## Support

For issues or modifications:

1. Check error log: `curl http://localhost:5000/error-log`
2. Review response `errors` and `warnings` arrays
3. Check backend console output
4. Verify all model files are present

---

**Last Updated:** 2026-05-05  
**Status:** Production Ready ✓
