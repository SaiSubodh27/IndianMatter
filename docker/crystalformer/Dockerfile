# ==============================================================================
# Isolated Runtime Container 2: CrystalFormer
# Pinned strictly to torch==2.1.2 + pytorch-lightning==2.1.3 + numpy==1.26.4
# so modern torch/lightning/matgl versions never break CrystalFormer checkpoints.
# ==============================================================================
FROM python:3.11-slim

ARG TORCH_INDEX_URL=https://download.pytorch.org/whl/cpu

WORKDIR /app

RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    curl \
    libgomp1 \
    && rm -rf /var/lib/apt/lists/*

COPY docker/crystalformer/requirements.txt /tmp/requirements.txt

RUN pip install --no-cache-dir --upgrade pip && \
    pip install --no-cache-dir --index-url ${TORCH_INDEX_URL} torch==2.1.2 && \
    pip install --no-cache-dir -r /tmp/requirements.txt

COPY property_prediction_models/CrystalFormer /app/property_prediction_models/CrystalFormer
COPY property_prediction_models/__init__.py /app/property_prediction_models/__init__.py
COPY property_prediction_models/core /app/property_prediction_models/core
COPY property_prediction_models/prediction /app/property_prediction_models/prediction
COPY docker/crystalformer/server.py /app/server.py

ENV PYTHONUNBUFFERED=1
ENV PYTHONPATH="/app:/app/property_prediction_models:/app/property_prediction_models/CrystalFormer"
ENV CRYSTALFORMER_WEIGHTS_DIR=/models/crystalformer

EXPOSE 8003

HEALTHCHECK --interval=20s --timeout=5s --start-period=20s --retries=3 \
    CMD curl -f http://localhost:8003/health || exit 1

CMD ["python", "-m", "uvicorn", "server:app", "--host", "0.0.0.0", "--port", "8003"]
