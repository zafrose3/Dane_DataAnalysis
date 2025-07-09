# Use SPECIFIC Python 3.10 image with Debian bullseye
FROM python:3.10.12-slim-bullseye

# Verify Python version immediately
RUN python --version  # Must show 3.10.12

# Install system dependencies
RUN apt-get update && \
    apt-get install -y --no-install-recommends gcc python3-dev && \
    rm -rf /var/lib/apt/lists/*

# FIRST install numpy with exact version, THEN pandas
RUN pip install --no-cache-dir numpy==1.23.5 && \
    pip install --no-cache-dir pandas==1.5.3  # Older stable version

# Final verification
RUN python -c "import pandas; print(f'Pandas {pandas.__version__} working!')"