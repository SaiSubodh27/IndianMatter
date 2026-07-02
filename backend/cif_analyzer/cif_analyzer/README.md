# CIF Material Analyzer

A web app for solid-state electrolyte analysis. Upload a `.cif` file →
the pipeline extracts features → your pretrained ensemble classifies
the material → results and CSV export.

---

## Files

```
cif_analyzer/
├── index.html        ← Full frontend (standalone, works without backend)
├── backend.py        ← FastAPI backend (plug your models in here)
├── requirements.txt  ← Python dependencies
└── README.md
```

---

## Quick start (frontend only)

Just open `index.html` in your browser. It runs entirely client-side
with a simulated pipeline — no server needed. Great for demos.

---

## Full stack (with your real models)

### 1. Install dependencies

```bash
pip install -r requirements.txt
```

### 2. Plug in your models

Open `backend.py` and search for `← YOUR MODEL HERE` comments.
There are 4 plug-in points:

| Function | What to replace |
|---|---|
| `load_models()` | Load your LGB/XGB/CatBoost/MLP/VGNN models |
| `extract_cif_features()` | Your cif_v1–v3 feature extractor |
| `extract_magpie_features()` | Your Magpie featurizer call |
| `run_ensemble()` | Your model `.predict_proba()` calls |
| `predict_properties()` | Your VGNN/regression model for Ea, σ, etc. |

### 3. Run the server

```bash
uvicorn backend:app --reload --port 8000
```

### 4. Connect the frontend

In `index.html`, find the `processCIF()` function and replace its body:

```javascript
async function processCIF(filename, text) {
    const res = await fetch('http://localhost:8000/api/analyze', {
        method: 'POST',
        body: JSON.stringify({ filename, cif_text: text }),
        headers: { 'Content-Type': 'application/json' }
    });
    if (!res.ok) throw new Error(await res.text());
    const data = await res.json();
    return {
        filename: data.filename,
        meta: {
            formula: data.formula,
            spaceGroup: data.space_group,
            ...data.lattice
        },
        classes: data.classes,
        features: data.features,
        elements: data.elements,
        timestamp: new Date().toLocaleString()
    };
}
```

---

## Pipeline stages

```
CIF file
  │
  ▼
CIF Parse          → formula, space group, lattice params (a,b,c,α,β,γ,V,Z)
  │
  ▼
cif_v1 / v2 / v3   → structural geometry + symmetry features
  │
  ▼
Magpie             → compositionally-averaged elemental property features
  │
  ▼
Composition        → manual composition flags (has_Li, is_oxide, etc.)
  │
  ▼
Ensemble           → LightGBM + XGBoost + CatBoost + MLP soft-voting
  │
  ▼
VGNN               → phonon scalars: Ea*, ZPE*, θD*, σ*
  │
  ▼
Classification     → 8-class: NASICON / Garnet / Perovskite / Argyrodite
                              Sulfide / Halide / Ceramic / Polymer
```

---

## Material classes

| Class | Example | Key features |
|---|---|---|
| NASICON | Na₃Zr₂Si₂PO₁₂ | Na, Zr, Si, P, O |
| Garnet | Li₇La₃Zr₂O₁₂ | Li, La, Zr, O (cubic) |
| Perovskite | Li₀.₅La₀.₅TiO₃ | La, Ti, O (layered) |
| Argyrodite | Li₆PS₅Cl | Li, P, S, halogen |
| Sulfide | Li₁₀GeP₂S₁₂ | S dominant, no O |
| Halide | Li₃InCl₆ | Cl/Br/I dominant |
| Ceramic | LiAlO₂ | Dense oxide |
| Polymer | PEO-LiTFSI | Organic + Li salt |

---

## API endpoints

| Method | Path | Description |
|---|---|---|
| POST | `/api/analyze` | Main analysis — body: `{filename, cif_text}` |
| GET | `/api/health` | Check model load status |
| GET | `/api/classes` | List all material classes |
| GET | `/` | Serve `index.html` |
