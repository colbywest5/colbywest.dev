#!/bin/bash
echo "🚀 Starting Deployment..."

# Pull latest changes
echo "⬇️ Pulling latest code..."
git pull origin main

# Rebuild and restart containers
echo "🔄 Rebuilding containers..."
docker compose up -d --build

# Prune unused images
echo "🧹 Cleaning up..."
docker image prune -f

echo "✅ Deployment Complete!"
