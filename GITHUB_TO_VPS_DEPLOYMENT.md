# 🚀 GitHub to VPS Deployment Guide

## Repository Information
- **GitHub URL:** https://github.com/SharkDevSol/bilal.git
- **VPS IP:** 76.13.48.245
- **Domain:** bilal.skoolific.com

---

## STEP 1: Push to GitHub (5 minutes)

### 1.1 Initialize Git (if not already done)

**On your computer (PowerShell or Git Bash):**

```bash
# Navigate to project root
cd C:\Users\hp\Desktop\bilal\SCHOOLS

# Check if git is initialized
git status

# If not initialized, run:
git init
```

### 1.2 Add Remote Repository

```bash
# Add GitHub remote
git remote add origin https://github.com/SharkDevSol/bilal.git

# Or if already exists, update it:
git remote set-url origin https://github.com/SharkDevSol/bilal.git

# Verify remote
git remote -v
```

### 1.3 Create .gitignore (Important!)

**Make sure you have a .gitignore file to exclude sensitive files:**

```bash
# Check if .gitignore exists
cat .gitignore
```

**Your .gitignore should include:**
```
# Dependencies
node_modules/
app/node_modules/
backend/node_modules/

# Environment files (IMPORTANT - Don't upload passwords!)
.env
backend/.env
app/.env

# Build files
app/dist/
app/build/

# Logs
*.log
npm-debug.log*
logs/

# OS files
.DS_Store
Thumbs.db

# IDE
.vscode/
.idea/

# Uploads (user data)
backend/Uploads/
backend/uploads/

# PM2
.pm2/

# Database backups
*.sql
*.dump
```

### 1.4 Stage and Commit Files

```bash
# Add all files (respecting .gitignore)
git add .

# Check what will be committed
git status

# Commit
git commit -m "Initial commit - Bilal School Management System"
```

### 1.5 Push to GitHub

```bash
# Push to GitHub (main branch)
git branch -M main
git push -u origin main

# If asked for credentials:
# Username: SharkDevSol
# Password: Your GitHub Personal Access Token
```

**If you need a Personal Access Token:**
1. Go to: https://github.com/settings/tokens
2. Click "Generate new token (classic)"
3. Select scopes: `repo` (full control)
4. Copy the token and use it as password

---

## STEP 2: Deploy to VPS from GitHub (15 minutes)

### 2.1 Connect to VPS

```bash
ssh root@76.13.48.245
```

### 2.2 Install Git on VPS (if not installed)

```bash
# Check if git is installed
git --version

# If not installed:
apt update
apt install -y git
```

### 2.3 Clone Repository to VPS

```bash
# Navigate to web directory
cd /var/www

# Clone repository
git clone https://github.com/SharkDevSol/bilal.git bilal-school

# Navigate to project
cd bilal-school

# Verify files
ls -la
```

### 2.4 Install Dependencies

**Backend:**
```bash
cd /var/www/bilal-school/backend

# Install Node.js dependencies
npm install --production

# Verify installation
ls node_modules/
```

**Frontend:**
```bash
cd /var/www/bilal-school/app

# Install dependencies
npm install

# Build frontend
npm run build

# Verify dist folder created
ls -la dist/
```

### 2.5 Setup Environment Files

**Backend environment:**
```bash
cd /var/www/bilal-school/backend

# Copy production template
cp .env.vps .env

# Edit environment file
nano .env
```

**Update these values:**
```env
# Database
DB_PASSWORD=YOUR_STRONG_PASSWORD
DB_NAME=school_management10

# JWT Secret (generate new)
JWT_SECRET=YOUR_GENERATED_SECRET

# Server
PORT=5011
FRONTEND_URL=https://bilal.skoolific.com

# Email (optional)
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
```

**Generate JWT Secret:**
```bash
node -e "console.log(require('crypto').randomBytes(48).toString('base64').replace(/[^a-zA-Z0-9]/g, ''))"
```

**Save and exit:**
- Press `Ctrl + X`
- Press `Y`
- Press `Enter`

### 2.6 Setup Database

```bash
# Create database
sudo -u postgres psql -c "CREATE DATABASE school_management10;"
sudo -u postgres psql -c "ALTER USER postgres WITH PASSWORD 'YOUR_PASSWORD';"

# Initialize tables
cd /var/www/bilal-school/backend
node setup-report-card.js
```

### 2.7 Get SSL Certificate

```bash
# Stop Nginx temporarily if running
systemctl stop nginx

# Get certificate
certbot certonly --standalone -d bilal.skoolific.com

# Start Nginx
systemctl start nginx
```

### 2.8 Configure Nginx

```bash
# Create Nginx config
nano /etc/nginx/sites-available/bilal-school
```

**Paste this configuration:**
```nginx
# Backend API Server
upstream backend {
    server localhost:5011;
}

# HTTP - Redirect to HTTPS
server {
    listen 80;
    server_name bilal.skoolific.com;
    return 301 https://$server_name$request_uri;
}

# HTTPS - Main Server
server {
    listen 443 ssl http2;
    server_name bilal.skoolific.com;

    # SSL Configuration
    ssl_certificate /etc/letsencrypt/live/bilal.skoolific.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/bilal.skoolific.com/privkey.pem;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;

    # Frontend - Serve React App
    root /var/www/bilal-school/app/dist;
    index index.html;

    # Gzip Compression
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;

    # Frontend Routes
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Backend API
    location /api/ {
        proxy_pass http://backend/api/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        proxy_read_timeout 300s;
        proxy_connect_timeout 75s;
    }

    # Uploads Directory
    location /uploads/ {
        alias /var/www/bilal-school/backend/uploads/;
        expires 30d;
        add_header Cache-Control "public, immutable";
    }

    # Security Headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;

    # Max Upload Size
    client_max_body_size 50M;
}
```

**Enable site:**
```bash
# Create symbolic link
ln -s /etc/nginx/sites-available/bilal-school /etc/nginx/sites-enabled/

# Test configuration
nginx -t

# Reload Nginx
systemctl reload nginx
```

### 2.9 Start Backend with PM2

```bash
cd /var/www/bilal-school/backend

# Start backend
pm2 start server.js --name bilal-backend

# Save PM2 configuration
pm2 save

# Setup auto-start on boot
pm2 startup
# Run the command it gives you

# Check status
pm2 status
```

### 2.10 Configure Firewall

```bash
# Allow necessary ports
ufw allow 22/tcp
ufw allow 80/tcp
ufw allow 443/tcp

# Enable firewall
ufw enable

# Check status
ufw status
```

---

## STEP 3: Test Deployment (5 minutes)

### On VPS:
```bash
# Check backend
pm2 status
pm2 logs bilal-backend --lines 20

# Check Nginx
systemctl status nginx

# Test API locally
curl http://localhost:5011/api/health
```

### On Your Computer:
```bash
# Test DNS
nslookup bilal.skoolific.com

# Open browser
https://bilal.skoolific.com
```

---

## 🔄 Future Updates Workflow

When you make changes and want to update VPS:

### On Your Computer:
```bash
# Make changes to code
# ...

# Commit and push
git add .
git commit -m "Description of changes"
git push origin main
```

### On VPS:
```bash
# Connect to VPS
ssh root@76.13.48.245

# Navigate to project
cd /var/www/bilal-school

# Pull latest changes
git pull origin main

# If backend changes:
cd backend
npm install --production
pm2 restart bilal-backend

# If frontend changes:
cd ../app
npm install
npm run build
# No restart needed for frontend

# Check status
pm2 status
```

---

## 📋 Complete Deployment Checklist

### On Your Computer:
- [ ] Create/verify .gitignore file
- [ ] Initialize git repository
- [ ] Add GitHub remote
- [ ] Commit all files
- [ ] Push to GitHub

### On VPS:
- [ ] Install git
- [ ] Clone repository
- [ ] Install Node.js, PostgreSQL, Nginx, PM2, Certbot
- [ ] Install backend dependencies
- [ ] Install frontend dependencies
- [ ] Build frontend
- [ ] Create .env file with passwords
- [ ] Create database
- [ ] Initialize database tables
- [ ] Get SSL certificate
- [ ] Configure Nginx
- [ ] Start backend with PM2
- [ ] Configure firewall
- [ ] Test website

---

## 🆘 Troubleshooting

### Git Push Fails
```bash
# Check remote
git remote -v

# Update remote if needed
git remote set-url origin https://github.com/SharkDevSol/bilal.git

# Try push again
git push -u origin main
```

### Authentication Failed
```bash
# Use Personal Access Token instead of password
# Generate at: https://github.com/settings/tokens
```

### Git Clone Fails on VPS
```bash
# Check if git is installed
git --version

# Install if needed
apt install -y git
```

### Backend Won't Start
```bash
# Check logs
pm2 logs bilal-backend --lines 50

# Check .env file
cat /var/www/bilal-school/backend/.env

# Verify database connection
psql -U postgres -d school_management10
```

---

## 📞 Quick Commands

### Git Commands (Your Computer)
```bash
# Check status
git status

# Add files
git add .

# Commit
git commit -m "Your message"

# Push
git push origin main

# Pull latest
git pull origin main
```

### VPS Commands
```bash
# Connect
ssh root@76.13.48.245

# Update from GitHub
cd /var/www/bilal-school
git pull origin main

# Restart backend
pm2 restart bilal-backend

# Check status
pm2 status

# View logs
pm2 logs bilal-backend
```

---

## ✅ Success Indicators

- [ ] Code pushed to GitHub successfully
- [ ] Repository cloned to VPS
- [ ] Dependencies installed
- [ ] Frontend built
- [ ] Backend configured
- [ ] Database created
- [ ] SSL certificate obtained
- [ ] Nginx configured
- [ ] Backend running (pm2 status)
- [ ] Website loads at https://bilal.skoolific.com
- [ ] Can login and use system

---

## 🎉 Deployment Complete!

Your system is now:
- ✅ Backed up on GitHub
- ✅ Deployed on VPS
- ✅ Accessible at https://bilal.skoolific.com
- ✅ Easy to update in the future

---

**GitHub:** https://github.com/SharkDevSol/bilal.git  
**VPS:** 76.13.48.245  
**Domain:** bilal.skoolific.com  
**Port:** 5011  
**Database:** school_management10
