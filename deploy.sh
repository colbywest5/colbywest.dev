#!/bin/bash
echo "🚀 Starting Deployment..."

# Pull latest changes
echo "⬇️ Pulling latest code..."
git pull origin main

# Prepare Persistence Directory
echo "📁 Setting up data persistence..."
mkdir -p data
# Ensure container (UID 1001) can write to it. 
# Using 777 is the simplest robust fix for Docker bind mounts without complex UID mapping.
chmod 777 data

# Rebuild and restart containers
echo "🔄 Rebuilding containers..."
docker compose up -d --build

# Prune unused images
echo "🧹 Cleaning up..."
docker image prune -f

echo "✅ Deployment Complete!"
