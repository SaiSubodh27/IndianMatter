# ==============================================================================
# IndianMatter Model Store Container
# Packages all verified local ML/DL weights (or fetches from Hugging Face Hub)
# into /opt/models and populates the shared Docker volume /models so every
# version-isolated runtime container reads from a single immutable model store.
# ==============================================================================
FROM python:3.11-slim

ARG FETCH_FROM_HF=false
ARG HF_MODEL_REPO_ID=SaiSubodh/indianmatter-models
ARG HF_TOKEN=

WORKDIR /opt/models

RUN pip install --no-cache-dir huggingface_hub

# Copy bundled model directories from build staging (if populated locally)
COPY docker/model-store/models /opt/models

# Optional fallback: pull any missing artifacts directly from Hugging Face Hub
RUN if [ "$FETCH_FROM_HF" = "true" ]; then \
      python -c "import os; from huggingface_hub import snapshot_download; snapshot_download(repo_id=os.environ['HF_MODEL_REPO_ID'], local_dir='/opt/models', token=os.environ.get('HF_TOKEN') or None)"; \
    fi

COPY docker/model-store/entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

VOLUME ["/models"]

ENTRYPOINT ["/entrypoint.sh"]
