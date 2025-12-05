#!/bin/bash
set -e

# Download NLTK data if not already present
python -c "import nltk; nltk.download('punkt', quiet=True); nltk.download('stopwords', quiet=True)" || true

# Start the application
exec uvicorn app.main:app --host 0.0.0.0 --port ${PORT:-8000}
