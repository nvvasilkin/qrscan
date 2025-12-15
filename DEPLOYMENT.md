# Deployment Guide

## Prerequisites

- Node.js 18+ installed
- PM2 installed globally (`npm install -g pm2`)
- Nginx installed and configured
- Existing website running on flintridgepizzakitchen.com
- Git repository set up

## Initial Setup

### 1. Clone Repository

```bash
cd /var/www
git clone <your-repo-url> flintridgepizzakitchen-greetings
cd flintridgepizzakitchen-greetings
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Build Application

```bash
npm run build
```

### 4. Start with PM2

```bash
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

### 5. Configure Nginx

**Important:** You need to add the location blocks to your **existing** nginx configuration file.

1. Find your existing nginx config:
```bash
sudo nano /etc/nginx/sites-available/flintridgepizzakitchen.com
# or
sudo nano /etc/nginx/sites-enabled/flintridgepizzakitchen.com
```

2. Add the location blocks from `nginx-greetings-location.conf` to your existing server block (inside the `server { ... }` block, after your existing location blocks).

3. Test and reload nginx:
```bash
sudo nginx -t
sudo systemctl reload nginx
```

**Example of how it should look:**

```nginx
server {
    listen 443 ssl http2;
    server_name flintridgepizzakitchen.com www.flintridgepizzakitchen.com;
    
    # Your existing SSL and other configurations...
    
    # Your existing location blocks...
    location / {
        # existing configuration
    }
    
    # ADD THESE BLOCKS FOR /greetings ROUTE:
    location /greetings {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }
    
    location /greetings/_next/static {
        proxy_pass http://localhost:3000;
        proxy_cache_valid 200 60m;
        add_header Cache-Control "public, immutable";
        expires 1y;
    }
    
    location /greetings/_next {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

## Deployment Process

### Using Deployment Script

```bash
chmod +x deploy.sh
./deploy.sh
```

### Manual Deployment

```bash
# Pull latest changes
git pull origin main

# Install dependencies
npm install

# Build application
npm run build

# Restart PM2
pm2 restart qrscan-restaurant-message

# Reload nginx (if config changed)
sudo nginx -t && sudo systemctl reload nginx
```

## Application URLs

- Production: https://flintridgepizzakitchen.com/greetings
- Local development: http://localhost:3000/greetings

## Troubleshooting

### Check PM2 Status
```bash
pm2 status
pm2 logs qrscan-restaurant-message
```

### Check Nginx Status
```bash
sudo systemctl status nginx
sudo nginx -t
```

### Check Application Logs
```bash
pm2 logs qrscan-restaurant-message --lines 100
```

### Verify Next.js is Running
```bash
curl http://localhost:3000/greetings
```

### Restart Services
```bash
pm2 restart qrscan-restaurant-message
sudo systemctl restart nginx
```

## Environment Variables

If needed, create `.env.production` file:

```env
NODE_ENV=production
PORT=3000
```

## Important Notes

- The Next.js app runs on port 3000 (configurable in ecosystem.config.js)
- Make sure port 3000 is not blocked by firewall
- The `/greetings` route is proxied to the Next.js server
- Your existing website at `/` continues to work normally
