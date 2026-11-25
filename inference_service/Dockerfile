FROM python:3.11-slim

WORKDIR /app

# Install system dependencies: OpenMP (LightGBM/XGBoost) and build tools
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    libgomp1 \
    git \
    curl \
    && rm -rf /var/lib/apt/lists/*

COPY inference_service/requirements.txt /app/inference_requirements.txt
RUN pip install --no-cache-dir --upgrade pip && \
    pip install --no-cache-dir -r /app/inference_requirements.txt

# Copy necessary application modules for inference
COPY inference_service /app/inference_service
COPY property_prediction_models /app/property_prediction_models
COPY cif_generator /app/cif_generator
COPY backend/model_service.py /app/backend/model_service.py
COPY backend/predict_ionic_conductivity.py /app/backend/predict_ionic_conductivity.py
COPY backend/model_paths.py /app/backend/model_paths.py

ENV PYTHONUNBUFFERED=1
ENV PYTHONPATH="/app:/app/inference_service:/app/property_prediction_models:/app/cif_generator:/app/backend"
ENV INFERENCE_PORT=8001
ENV INFERENCE_HOST=0.0.0.0
ENV INTERNAL_SERVICE_SECRET="indianmatter-internal-secret-token"

EXPOSE 8001

HEALTHCHECK --interval=15s --timeout=5s --start-period=30s --retries=3 \
    CMD curl -f http://localhost:8001/health || exit 1

CMD ["python", "-m", "uvicorn", "inference_service.main:app", "--host", "0.0.0.0", "--port", "8001"]
