# IndianMatter Version-Isolated Docker Model Architecture

This directory isolates every model family in its own pinned Python container while storing all **29 model checkpoints (781.80 MB)** inside a single immutable **`indianmatter-model-store`** container (`indianmatter_models` volume mounted at `/models`).

## Why Isolated Containers?

The IndianMatter models require mutually incompatible library versions:
- **CrystaLLM (`cif-generator`, port `8002`)**: Requires `numpy==1.26.4`, `pandas==2.2.3`, `pymatgen<2025.2`, `smact`, `omegaconf`, `mace-torch`, and the `crystallm` package.
- **CrystalFormer (`crystalformer`, port `8003`)**: Requires `torch==2.1.2`, `pytorch-lightning==2.1.3`, and `numpy==1.26.4`.
- **IonCast + CHGNet + M3GNet (`atomistic-surrogate`, port `8001`)**: Requires `torch==2.5.1`, `matgl>=2.1.1,<3.0.0` (compatible with `M3GNet-MP-2021.2.8-PES`), `chgnet`, `lightgbm`, `xgboost`, `catboost`, and `scikit-learn`.

Running them in separate containers eliminates package conflicts across versions while sharing `/models:ro` from `indianmatter-model-store`.

## Usage

```bash
# 1. Stage local weights (uses NTFS hardlinks on Windows for 0 extra disk space)
python scripts/stage_docker_models.py

# 2. Build and start the model-store + all isolated inference containers
docker compose -f docker-compose.models.yml up -d --build

# 3. Check container health
docker compose -f docker-compose.models.yml ps
```

To build `model-store` from Hugging Face Hub (`SaiSubodh/indianmatter-models`) on a fresh machine without local weights:

```bash
FETCH_FROM_HF=true HF_TOKEN=your_token docker compose -f docker-compose.models.yml build model-store
```
