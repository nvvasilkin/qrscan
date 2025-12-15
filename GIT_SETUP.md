# Git Setup and Deployment Instructions

## Initial Git Setup

### 1. Initialize Git Repository (if not already done)

```bash
git init
git add .
git commit -m "Initial commit: Restaurant greetings page"
```

### 2. Add Remote Repository

```bash
git remote add origin <your-repository-url>
git branch -M main
git push -u origin main
```

## Deployment Steps

### On Production Server

1. **Clone repository:**
```bash
cd /var/www
git clone <your-repository-url> flintridgepizzakitchen-greetings
cd flintridgepizzakitchen-greetings
```

2. **Install dependencies:**
```bash
npm install
```

3. **Build application:**
```bash
npm run build
```

4. **Start with PM2:**
```bash
npm install -g pm2
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

5. **Configure Nginx:**
   
   **IMPORTANT:** Add location blocks to your **existing** nginx configuration, not create a new one!
   
   ```bash
   # Find your existing nginx config
   sudo nano /etc/nginx/sites-available/flintridgepizzakitchen.com
   # or
   sudo nano /etc/nginx/sites-enabled/flintridgepizzakitchen.com
   ```
   
   Add the location blocks from `nginx-greetings-location.conf` to your existing server block.
   
   Then test and reload:
   ```bash
   sudo nginx -t
   sudo systemctl reload nginx
   ```

## Updating Application

### On Local Machine

1. Make changes
2. Commit and push:
```bash
git add .
git commit -m "Your commit message"
git push origin main
```

### On Production Server

```bash
cd /var/www/flintridgepizzakitchen-greetings
./deploy.sh
```

Or manually:
```bash
git pull origin main
npm install
npm run build
pm2 restart qrscan-restaurant-message
# Note: Only reload nginx if you changed nginx config
# sudo nginx -t && sudo systemctl reload nginx
```

## Access URLs

- Production: https://flintridgepizzakitchen.com/greetings
- Development: http://localhost:3000/greetings

