# Builder stage
FROM python:3.13-slim AS builder
WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
RUN pip install --no-cache-dir gunicorn==23.0.0 # Explicitly install Gunicorn

# Final stage
FROM python:3.13-slim
WORKDIR /app
COPY --from=builder /usr/local/lib/python3.13/site-packages /usr/local/lib/python3.13/site-packages
COPY --from=builder /usr/local/bin/gunicorn /usr/local/bin/gunicorn # Copy Gunicorn executable
# ... rest of your Dockerfile
CMD ["gunicorn", "--bind", "0.0.0.0:5000", "app:create_app()"] # Or app:app