#!/bin/bash

# Deployment script for Next.js application
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
fi

# Note: Nginx reload is commented out because config is in main site config
# Uncomment if you need to reload nginx after deployment
# if command -v nginx &> /dev/null; then
#     echo "🔄 Reloading nginx..."
#     sudo nginx -t && sudo systemctl reload nginx
# else
#     echo "⚠️  Nginx not found. Please reload nginx configuration manually."
# fi

echo "✅ Deployment completed successfully!"
echo "📝 Note: If you modified nginx config, reload it manually: sudo nginx -t && sudo systemctl reload nginx"

