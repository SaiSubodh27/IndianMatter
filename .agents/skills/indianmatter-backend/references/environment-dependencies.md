# Environment & Dependencies Guide

## Python Dependencies

### Core Backend Requirements

```text
fastapi, uvicorn, pymongo, passlib[bcrypt], bcrypt, PyJWT
google-auth, pydantic-settings, email-validator, python-multipart
```

### Scientific Computing

```text
numpy, pandas, scipy, scikit-learn, joblib, tqdm, pydantic, spglib, psutil
pymatgen, matminer, ase, monty
```

### ML Frameworks

```text
torch (CPU or CUDA)
```

### Optional GNN Models (environment-dependent)

```text
chgnet       # CHGNet universal potential
matgl        # M3GNet via MatGL
dgl          # Deep Graph Library (M3GNet dependency)
```

> [!NOTE]
> The user controls `requirements.txt`. Do not modify it without explicit permission.
> The minimal requirements intentionally exclude heavy GNN packages.

## Cross-Platform Compatibility

The backend must work on:

| Environment | Python | GPU | Notes |
|---|---|---|---|
| Local Windows | 3.10+ | Optional | Development |
| Linux server | 3.10+ | CUDA | Production |
| JupyterHub | 3.13 | CUDA possible | User's primary env |
| Docker | 3.10+ | Optional | Deployment |
| macOS | 3.10+ | No CUDA | Development |

## Lazy Import Pattern

Heavy dependencies that may not be installed everywhere must use lazy imports:

```python
# WRONG — crashes at import time if missing
from chgnet.model.dynamics import CHGNetCalculator

# CORRECT — lazy load on first use
def _ensure_calculator():
    global _calculator, _init_attempted
    if _init_attempted:
        return _calculator
    _init_attempted = True
    try:
        from chgnet.model.dynamics import CHGNetCalculator
        _calculator = CHGNetCalculator()
    except ImportError:
        print("WARNING: chgnet not installed")
        _calculator = None
    return _calculator
```

Libraries requiring lazy imports:
- `chgnet`
- `matgl` / `dgl`
- `torch` (in modules not always imported)
- `mace` (if used)

## GPU / CPU Detection

`backend/core/device_manager.py` handles device detection:

```python
import torch
device = "cuda" if torch.cuda.is_available() else "cpu"
```

### Verification hierarchy

```text
1. Package installed?           pip list | grep chgnet
2. Model weights downloaded?    ls pretrained_models/
3. Model loads successfully?    joblib.load(path)
4. GPU available?               torch.cuda.is_available()
5. Model runs on GPU?           Check model.device / calculator.device
```

## Virtual Environment

The project uses a venv at `IndianMatter/venv/`:

```bash
# Activate
source venv/bin/activate  # Linux/Mac
.\venv\Scripts\activate   # Windows

# Install dependencies
pip install -r backend/requirements.txt
```

> [!WARNING]
> System conda packages may NOT be visible to the venv.
> If `chgnet` is installed in conda but the venv can't find it,
> the lazy import pattern prevents the server from crashing.

## Frontend Dependencies

```bash
npm install  # from project root
```

Key frontend dependencies (from `package.json`):
- React + TypeScript
- Vite (build tool)
- Tailwind CSS
- Additional UI libraries

## Environment Variables

Required (see `.env.example`):
```text
MONGO_URI=mongodb://...
SECRET_KEY=...
MP_API_KEY=...          # Materials Project API key
```

## Model Download Scripts

```text
download_all_models.py      # Download all pretrained models
download_m3gnet.py          # M3GNet weights
download_m3gnet_hf.py       # M3GNet from HuggingFace
download_m3gnet_manual.py   # M3GNet manual download
redownload_m3gnet.py        # Re-download M3GNet
```

## Performance Considerations

- **Model loading**: Load once at startup, reuse globally
- **CHGNet calculator**: Singleton, initialized on first use
- **Temporary files**: Always clean up in `finally` blocks
- **Feature caching**: Avoid recomputing features for the same structure
- **Async**: Use `async def` for I/O-bound route handlers
- **Batch inference**: When screening many candidates, batch feature extraction
