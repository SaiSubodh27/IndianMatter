FROM python:3.11-slim

WORKDIR /app

# Install OpenMP runtime library needed by LightGBM / XGBoost
RUN apt-get update && apt-get install -y --no-install-recommends \
    libgomp1 \
    && rm -rf /var/lib/apt/lists/*

# Upgrade pip and install core FastAPI dependencies with pre-compiled wheels
RUN pip install --no-cache-dir --upgrade pip && \
    pip install --no-cache-dir \
    fastapi \
    uvicorn[standard] \
    pymongo \
    pymatgen \
    mp-api \
    pydantic \
    python-multipart \
    itsdangerous \
    authlib \
    tenacity \
    numpy \
    pandas \
    scikit-learn \
    requests \
    aiohttp

# Copy requirements and install additional dependencies
COPY requirements.txt /app/requirements.txt
RUN pip install --no-cache-dir -r /app/requirements.txt || true

# Copy workspace application code
COPY . /app

ENV PYTHONUNBUFFERED=1
ENV PYTHONPATH="/app:/app/backend"
ENV MONGO_URL="mongodb://mongodb:27017/IndianMaterialsAI"
ENV PORT=8000

EXPOSE 8000

CMD ["python", "-m", "uvicorn", "backend.main:app", "--host", "0.0.0.0", "--port", "8000"]
