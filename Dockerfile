# Use Python 3.10.13 to match render.yaml and runtime.txt
FROM python:3.10.13

# Set working directory
WORKDIR /app

# Install system dependencies for pandas/numpy/matplotlib
RUN apt-get update && \
    apt-get install -y --no-install-recommends \
    build-essential \
    python3-dev \
    libpq-dev \
    && apt-get clean && \
    rm -rf /var/lib/apt/lists/*

# Copy requirements first for layer caching
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy application code
COPY . .

# Set environment variables
ENV FLASK_ENV=production
ENV PYTHONUNBUFFERED=1
ENV PORT=5000

# Expose port
EXPOSE 5000

# Healthcheck
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:5000/health || exit 1

# Run with Gunicorn
CMD exec gunicorn --bind 0.0.0.0:$PORT --workers 4 --threads 2 --timeout 120 app:app