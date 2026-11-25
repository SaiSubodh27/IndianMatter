# ==============================================================================
# Isolated Runtime Container 3: Atomistic & IonCast Surrogate Service
# Isolates IonCast (LightGBM/XGBoost/CatBoost/MLP) + CHGNet + M3GNet (matgl 2.x)
# + BFSY from CrystalFormer (torch 2.1) and CrystaLLM (numpy 1.24 / pymatgen 2023).
# ==============================================================================
FROM python:3.11-slim

ARG TORCH_INDEX_URL=https://download.pytorch.org/whl/cpu

WORKDIR /app

RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    curl \
    libgomp1 \
    && rm -rf /var/lib/apt/lists/*

COPY docker/atomistic-surrogate/requirements.txt /tmp/requirements.txt

RUN pip install --no-cache-dir --upgrade pip && \
    pip install --no-cache-dir --index-url ${TORCH_INDEX_URL} torch==2.5.1 && \
    pip install --no-cache-dir -r /tmp/requirements.txt

COPY backend/model_paths.py /app/backend/model_paths.py
COPY backend/model_service.py /app/backend/model_service.py
COPY backend/predict_ionic_conductivity.py /app/backend/predict_ionic_conductivity.py
COPY cif_generator/cif_descriptors.py /app/cif_generator/cif_descriptors.py
COPY property_prediction_models/__init__.py /app/property_prediction_models/__init__.py
COPY property_prediction_models/core /app/property_prediction_models/core
COPY property_prediction_models/models /app/property_prediction_models/models
COPY property_prediction_models/prediction_models /app/property_prediction_models/prediction_models
COPY property_prediction_models/calculations /app/property_prediction_models/calculations
COPY property_prediction_models/prediction /app/property_prediction_models/prediction
COPY property_prediction_models/Surrogative_models /app/property_prediction_models/Surrogative_models
COPY docker/atomistic-surrogate/server.py /app/server.py

ENV PYTHONUNBUFFERED=1
ENV PYTHONPATH="/app:/app/backend:/app/property_prediction_models:/app/cif_generator"
ENV PRETRAINED_MODELS_DIR=/models/ioncast
ENV CHGNET_MODEL_PATH=/models/chgnet/chgnet_0.3.0_e29f68s314m37.pth.tar
ENV M3GNET_WEIGHTS_DIR=/models/m3gnet
ENV MACE_SMALL_MODEL_PATH=/models/mace/2023-12-10-mace-128-L0_energy_epoch-249.model

EXPOSE 8001

HEALTHCHECK --interval=20s --timeout=5s --start-period=25s --retries=3 \
    CMD curl -f http://localhost:8001/health || exit 1

CMD ["python", "-m", "uvicorn", "server:app", "--host", "0.0.0.0", "--port", "8001"]
