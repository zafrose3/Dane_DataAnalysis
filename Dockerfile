# Use exact Python and Debian versions
FROM python:3.10.13-slim-bookworm

# Verify Python version first
RUN python --version

# Install system dependencies
RUN apt-get update && \
    apt-get install -y --no-install-recommends gcc python3-dev && \
    rm -rf /var/lib/apt/lists/*

# Install compatible NumPy first, then pandas
RUN pip install --no-cache-dir numpy==1.23.5 && \
    pip install --no-cache-dir pandas==2.0.3

# Final verification
RUN python -c "import pandas, numpy; print(f'Pandas {pandas.__version__}, NumPy {numpy.__version__}')"