#!/bin/bash

# Full update script for Next.js greetings application
# Usage: ./update.sh
# Make sure to run: chmod +x update.sh

set -e

echo "🚀 Starting full project update..."
echo ""

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo -e "${RED}❌ Error: package.json not found. Please run this script from the project root directory.${NC}"
    exit 1
fi

# Step 1: Pull latest changes from git
echo -e "${YELLOW}📥 Step 1: Pulling latest changes from git...${NC}"
if git pull origin main; then
    echo -e "${GREEN}✅ Git pull successful${NC}"
else
    echo -e "${RED}❌ Git pull failed. Please check your git repository.${NC}"
    exit 1
fi
echo ""

# Step 2: Install/update dependencies
echo -e "${YELLOW}📦 Step 2: Installing/updating dependencies...${NC}"
if npm install; then
    echo -e "${GREEN}✅ Dependencies installed successfully${NC}"
else
    echo -e "${RED}❌ Failed to install dependencies${NC}"
    exit 1
fi
echo ""

# Step 3: Build the application
echo -e "${YELLOW}🔨 Step 3: Building application...${NC}"
if npm run build; then
    echo -e "${GREEN}✅ Build completed successfully${NC}"
else
    echo -e "${RED}❌ Build failed. Please check the errors above.${NC}"
    exit 1
fi
echo ""

# Step 4: Restart PM2 process
echo -e "${YELLOW}🔄 Step 4: Restarting PM2 process...${NC}"
if command -v pm2 &> /dev/null; then
    if pm2 restart qrscan-restaurant-message; then
        echo -e "${GREEN}✅ PM2 process restarted successfully${NC}"
    else
        echo -e "${YELLOW}⚠️  PM2 process not found, starting new process...${NC}"
        pm2 start ecosystem.config.js
        pm2 save
        echo -e "${GREEN}✅ PM2 process started${NC}"
    fi
else
    echo -e "${RED}❌ PM2 not found. Please install PM2: npm install -g pm2${NC}"
    exit 1
fi
echo ""

# Step 5: Check PM2 status
echo -e "${YELLOW}📊 Step 5: Checking PM2 status...${NC}"
pm2 status qrscan-restaurant-message
echo ""

# Step 6: Test the application
echo -e "${YELLOW}🧪 Step 6: Testing application...${NC}"
sleep 2
if curl -f http://localhost:3000/greetings > /dev/null 2>&1; then
    echo -e "${GREEN}✅ Application is responding on http://localhost:3000/greetings${NC}"
else
    echo -e "${YELLOW}⚠️  Application might not be ready yet. Check logs: pm2 logs qrscan-restaurant-message${NC}"
fi
echo ""

# Step 7: Show recent logs
echo -e "${YELLOW}📋 Step 7: Recent application logs (last 20 lines):${NC}"
pm2 logs qrscan-restaurant-message --lines 20 --nostream
echo ""

echo -e "${GREEN}✅ Update completed successfully!${NC}"
echo ""
echo "📝 Next steps:"
echo "   - Check application: https://flintridgepizzakitchen.com/greetings"
echo "   - View logs: pm2 logs qrscan-restaurant-message"
echo "   - Check status: pm2 status"
echo ""
echo "⚠️  Note: If you modified nginx config, reload it manually:"
echo "   sudo nginx -t && sudo systemctl reload nginx"

