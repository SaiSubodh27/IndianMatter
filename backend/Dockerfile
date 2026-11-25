FROM python:3.11-slim

WORKDIR /app

# Install minimal system dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Install lightweight dependencies
COPY backend/requirements_main.txt /app/requirements_main.txt
RUN pip install --no-cache-dir --upgrade pip && \
    pip install --no-cache-dir -r /app/requirements_main.txt

# Copy backend application code only
COPY backend /app/backend

ENV PYTHONUNBUFFERED=1
ENV PYTHONPATH="/app:/app/backend"
ENV MONGO_URL="mongodb://mongodb:27017/IndianMaterialsAI"
ENV INFERENCE_BASE_URL="http://inference:8001"
ENV INTERNAL_SERVICE_SECRET="indianmatter-internal-secret-token"
ENV PORT=8000

EXPOSE 8000

HEALTHCHECK --interval=15s --timeout=5s --start-period=10s --retries=3 \
    CMD curl -f http://localhost:8000/health || exit 1

CMD ["python", "-m", "uvicorn", "backend.main:app", "--host", "0.0.0.0", "--port", "8000"]
