# Use Python 3.11 with full system tools (not slim)
FROM python:3.11

# Set working directory
WORKDIR /app

# Install system dependencies for pandas/numpy
RUN apt-get update && \
    apt-get install -y \
    build-essential \
    python3-dev \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements first (for layer caching)
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy application code
COPY . .

# Set environment variables (adjust for your app)
ENV FLASK_APP=app.py
ENV FLASK_ENV=production

# Expose port (default Flask port)
EXPOSE 5000

# Run with Gunicorn (adjust workers as needed)
CMD ["gunicorn", "--bind", "0.0.0.0:5000", "--workers", "4", "app:app"]