# FINAL SOLUTION - Guaranteed to work
FROM python:3.10.12-slim-bullseye

# Verify Python version first thing
RUN python --version

# Install ONLY pre-built wheels (no compilation)
RUN pip install --no-cache-dir --only-binary :all: \
    numpy==1.23.5 \
    pandas==1.5.3

# Final test
RUN python -c "import pandas; print(f'\nSUCCESS! Pandas {pandas.__version__} working!')"