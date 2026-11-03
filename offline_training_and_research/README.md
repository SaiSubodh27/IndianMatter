# 🧪 Offline Training, Research & Development Archives

> [!WARNING]
> **DO NOT DEPLOY THIS FOLDER TO PRODUCTION.**
> This directory is strictly for offline research, model training, feature extraction, and development maintenance. 
> The active production backend (`backend/main.py`) and frontend (`src/`) perform **runtime inference only** using pre-serialized weights in `pretrained_models/` and `final_models/`. 
> 
> **You can safely delete or exclude this entire folder (`offline_training_and_research/`) during Docker builds, cloud hosting, or Vercel/Railway/Render deployments.**

---

## 📂 Directory Contents & Architecture

### 1. `training_pipelines/`
Contains the offline model training scripts used to train surrogate models and extract physical descriptors:
- **`train_mechanical.py`**: Reads crystal structures from MatMiner/MP, extracts 21 CHGNet structural features, and trains LightGBM regressors for Bulk Modulus ($K$) and Shear Modulus ($G$). Saves outputs to `chgnet_logK_model.pkl` and `chgnet_logG_model.pkl`.
- **`train_electrical.py`**: Featurizes crystal structures and fits models for electronic band gaps and conductivity surrogates.
- **`train_thermal.py`**: Extracts phonon/vibrational features and trains surrogate models for thermal conductivity ($\kappa$) and Debye temperatures.
- **`m3gnet_finite_displacement_features.py`**: Standalone CLI tool that uses M3GNet potential forces on ordered CIF structures to compute finite-displacement vibrational spring constants ($k_i$) and frequencies.
- **`thermal_features.npz`**: Cached intermediate NumPy array of extracted thermal feature vectors.
- **`thermal_failures.csv`**: Log of crystal structures that failed featurization during thermal model training.

### 2. `notebooks/`
Interactive research and experiment notebooks:
- **`surrogate_model_v5_fixed.ipynb`**: Complete Jupyter notebook demonstrating data cleaning, feature engineering, and ensemble training of the v5 IonCast ionic conductivity surrogate model stack.

### 3. `test_and_scratch_files/`
Scratch scripts and local test files used during initial validation:
- **`test_trial_pipeline.py`**: Standalone verification script for checking end-to-end inference flow on a test CIF.
- **`test_licl.cif` & `test.cif`**: Minimal sample CIF structures used for quick syntax and geometry parsing checks.
- **`cif_analyzer.zip`**: Archived snapshot of the legacy standalone CIF analyzer utility.

### 4. `maintenance_tools/`
Development maintenance scripts used for past code reorganizations and manifest verification:
- `build_registry.py`, `check_mentions.py`, `find_refs.py`, `make_manifest_v2.py`, `make_manifest_v3.py`, `make_manifest.py`, `phase1f.py`, `reorg.py`, `test_undo.py`, `undo_moves.py`, `verify_manifest.py`.

---

## 🚀 Deployment Exclusion Guide

To ensure minimal deployment build times and image sizes, exclude this directory in your deployment ignore files:

### `.dockerignore`
```dockerignore
offline_training_and_research/
datasets/raw_archives/
.venv/
venv/
__pycache__/
*.pyc
.git
node_modules/
```

### `.vercelignore`
```vercelignore
offline_training_and_research/
datasets/raw_archives/
backend/venv/
.venv/
pretrained_models/*.pkl
```
*(The FastAPI backend is typically hosted on Docker / Railway / Render / AWS EC2 with GPU or CPU, while the React frontend is hosted on Vercel / Netlify / Cloudflare Pages).*

