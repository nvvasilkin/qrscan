#!/bin/bash

# Quick deployment script for Next.js application
# Usage: ./deploy.sh
# For full update with checks, use: ./update.sh
# Make sure to run: chmod +x deploy.sh

set -e

echo "🚀 Starting deployment..."

# Pull latest changes from git
echo "📥 Pulling latest changes..."
git pull origin main

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Build the application
echo "🔨 Building application..."
npm run build

# Restart PM2 process (if using PM2)
if command -v pm2 &> /dev/null; then
    echo "🔄 Restarting PM2 process..."
    pm2 restart qrscan-restaurant-message || pm2 start ecosystem.config.js
else
    echo "⚠️  PM2 not found. Please restart your Node.js process manually."
    exit 1
fi

echo "✅ Deployment completed successfully!"
echo "📝 Note: If you modified nginx config, reload it manually: sudo nginx -t && sudo systemctl reload nginx"
echo "📝 For detailed update with checks, use: ./update.sh"

