FROM python:3.11-slim

WORKDIR /app

# Install system utilities & build tools for C-extensions/scientific dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    curl \
    git \
    && rm -rf /var/lib/apt/lists/*

# Copy and install core Python requirements first for efficient layer caching
COPY requirements.txt /app/requirements.txt
COPY backend/requirements.txt /app/backend/requirements.txt

RUN pip install --no-cache-dir --upgrade pip && \
    pip install --no-cache-dir fastapi uvicorn pymongo pymatgen mp-api pydantic python-multipart itsdangerous && \
    pip install --no-cache-dir -r /app/requirements.txt || true

# Copy workspace application code
COPY . /app

ENV PYTHONUNBUFFERED=1
ENV PYTHONPATH="/app:/app/backend"
ENV MONGO_URL="mongodb://mongodb:27017/IndianMaterialsAI"
ENV PORT=8000

EXPOSE 8000

CMD ["python", "-m", "uvicorn", "backend.main:app", "--host", "0.0.0.0", "--port", "8000"]
