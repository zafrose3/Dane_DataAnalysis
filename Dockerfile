# Use SPECIFIC Python 3.10 image with Debian bullseye
FROM python:3.10.12-slim-bullseye

# Verify Python version immediately
RUN python --version

# Install system dependencies
RUN apt-get update && \
    apt-get install -y --no-install-recommends build-essential && \
    rm -rf /var/lib/apt/lists/*

# Install pre-built pandas wheel (no compilation)
RUN pip install --no-cache-dir --only-binary :all: \
    numpy==1.23.5 \
    pandas==1.5.3

# Final verification
RUN python -c "import pandas; print(f'Success! Pandas {pandas.__version__}')"