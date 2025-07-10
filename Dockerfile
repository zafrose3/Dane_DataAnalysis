# Use official Python base image
FROM python:3.11-slim

# Set working directory
WORKDIR /app

# Copy requirements first (for better caching)
COPY requirements.txt .

# Install dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy the rest of your app
COPY . .

# Expose the port Flask/Gunicorn will run on
EXPOSE 5000

# Run the app using Gunicorn
# Replace "app:app" if your main file or app object is different
CMD ["gunicorn", "--bind", "0.0.0.0:5000", "app:app"]
