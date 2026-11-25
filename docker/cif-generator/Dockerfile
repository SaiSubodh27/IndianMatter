# ==============================================================================
# Isolated Runtime Container 1: CIF Generator (CrystaLLM + MACE-MP-0)
# Pinned environment to avoid NumPy 2.x / PyTorch / MatGL version conflicts.
# ==============================================================================
FROM python:3.11-slim

ARG TORCH_INDEX_URL=https://download.pytorch.org/whl/cpu

WORKDIR /app

RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    git \
    curl \
    libgomp1 \
    && rm -rf /var/lib/apt/lists/*

COPY docker/cif-generator/requirements.txt /tmp/requirements.txt

RUN pip install --no-cache-dir --upgrade pip && \
    pip install --no-cache-dir --index-url ${TORCH_INDEX_URL} torch==2.4.1 && \
    pip install --no-cache-dir -r /tmp/requirements.txt

# Copy cif_generator + cloned crystallm_repo and install crystallm in isolated env
COPY cif_generator /app/cif_generator
RUN if [ -d /app/cif_generator/crystallm_repo ]; then \
      pip install --no-cache-dir --no-deps -e /app/cif_generator/crystallm_repo; \
    fi

ENV PYTHONUNBUFFERED=1
ENV PYTHONPATH="/app:/app/cif_generator"
ENV CRYSTALLM_CHECKPOINT_PATH=/models/crystallm/crystallm_v1_small
ENV MACE_MODEL=/models/mace/20231203mace128L1_epoch199model
ENV MACE_DEVICE=cpu

EXPOSE 8002

HEALTHCHECK --interval=20s --timeout=5s --start-period=20s --retries=3 \
    CMD curl -f http://localhost:8002/api/health || exit 1

CMD ["python", "-m", "uvicorn", "cif_generator.webapp:app", "--host", "0.0.0.0", "--port", "8002"]
