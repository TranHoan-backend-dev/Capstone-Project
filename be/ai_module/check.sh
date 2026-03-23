#!/bin/bash

# Exit on any failure
set -e

echo "Running checks for AI module..."

# Ensure we're in the right directory
cd "$(dirname "$0")"

# Activate virtualenv if it exists
if [ -d "venv" ]; then
    source venv/bin/activate || source venv/Scripts/activate
fi

# Install requirements
pip install -r requirements.txt

echo "Linting with flake8..."
flake8 . --count --select=E9,F63,F7,F82 --show-source --statistics
flake8 . --count --exit-zero --max-complexity=10 --max-line-length=127 --statistics

echo "Running tests with pytest..."
if [ -d "tests" ]; then
    pytest
else
    echo "No tests/ directory found, skipping pytest."
fi

echo "All checks passed!"
