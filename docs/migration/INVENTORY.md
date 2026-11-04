# INVENTORY (Phase 1)

## Scan scope
- Root scanned: repo root `C:\Users\saisu\OneDrive\Desktop\Final_ validation`
- Skipped: `.venv`, `backend/venv`, `venv`, `node_modules`, `.git` (manifest excludes them except .venv site-packages leaked via walk? manifest includes .venv site-packages zips due to os.walk; treat as outside scope)
- Outside repo: parent folder not provided by user; nothing outside repo referenced. Untracked count 58.

## Baseline counts
- .cif: 353
- .zip: 4
- weights (.pkl/.joblib/.pt/.pth/.h5/.onnx/.cbm): 132
- Top5 weight folders: pretrained_models 11; .venv/.../joblib/test/data 10; backend/venv/.../joblib/test/data 10; venv/.../joblib/test/data 10; backend/Surrogative_models 8

## 38510.csv copies
- datasets\38510.csv
- src\data\indianmatter\38510.csv
- sha256 identical: 8cd2cc47131e2de169986c9e1945978bc6889b5af790fb01903bfd4fe4fd539c (both)

## Scripts / notebooks
- train_*.py: 3
- notebooks: 2 (surrogate_model_v5_fixed.ipynb; backend/CrystalFormer/CrystalFormer/ssb_pipeline_v2 (2).ipynb)

## Model registry status
- M3GNet v? -> ACTIVE; loaded via backend (base_adapter.py M3GNet; calculator_router references). Version label UNKNOWN: no explicit version in weights folder name.
- Surrogate v5 -> ACTIVE; loaded via backend/calculator_router.py (electrical/thermal surrogate models).

## Untracked by extension
{'.py':20,'(none)':5,'.zip':1,'.ckpt':20,'.ipynb':1,'.md':4,'.ps1':3,'.txt':1,'.sh':3,'.js':1,'.css':1,'.csv':1}
