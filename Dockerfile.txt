# Explicitly use Python 3.10
FROM python:3.10-slim

# Verify Python version immediately
RUN python --version && pip --version

# Install system dependencies (including build tools if needed)
RUN apt-get update && \
    apt-get install -y --no-install-recommends gcc python3-dev && \
    rm -rf /var/lib/apt/lists/*

# Create and use a virtual environment (optional but recommended)
ENV VIRTUAL_ENV=/opt/venv
RUN python -m venv $VIRTUAL_ENV
ENV PATH="$VIRTUAL_ENV/bin:$PATH"

# Install pandas with explicit version pinning
RUN pip install --no-cache-dir pandas==2.0.3  # Use a version known to have wheels for 3.10

# Verify installation
RUN python -c "import pandas; print(f'Pandas version: {pandas.__version__}')"