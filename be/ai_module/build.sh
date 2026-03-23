#!/bin/bash

# Exit on any failure
set -e

echo "Building AI module Docker image..."

# Ensure we're in the right directory
cd "$(dirname "$0")"

# Build image
docker build -t ai-module:latest .

echo "Build complete! Image: ai-module:latest"
