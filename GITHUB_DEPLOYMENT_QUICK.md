# 🚀 GitHub to VPS - Quick Guide

## 📊 Deployment Flow

```
Your Computer                GitHub                    VPS
─────────────               ────────                  ─────────────────

1. Push Code        →       Repository        →       2. Clone & Deploy
   (PUSH_TO_GITHUB.bat)     SharkDevSol/bilal         (SSH commands)
```

---

## STEP 1: Push to GitHub (Your Computer)

### Option A: Use the Script (Easy)
```bash
# Double-click this file:
PUSH_TO_GITHUB.bat
```

### Option B: Manual Commands
```bash
# Initialize git (if needed)
git init

# Add remote
git remote add origin https://github.com/SharkDevSol/bilal.git

# Add files
git add .

# Commit
git commit -m "Initial commit - Bilal School System"

# Push
git branch -M main
git push -u origin main
```

**If asked for credentials:**
- Username: `SharkDevSol`
- Password: Your GitHub Personal Access Token
  (Generate at: https://github.com/settings/tokens)

---

## STEP 2: Deploy to VPS

### 2.1 Connect to VPS
```bash
ssh root@76.13.48.245
```

### 2.2 Quick Setup Script

**Copy and paste this entire block:**

```bash
# Install git if needed
apt update && apt install -y git

# Clone repository
cd /var/www
git clone https://github.com/SharkDevSol/bilal.git bilal-school
cd bilal-school

# Install backend dependencies
cd backend
npm install --production

# Install frontend dependencies and build
cd ../app
npm install
npm run build

# Setup environment
cd ../backend
cp .env.vps .env
echo "Now edit .env file with your passwords!"
```

### 2.3 Edit Environment File
```bash
nano /var/www/bilal-school/backend/.env
```

**Update these:**
- `DB_PASSWORD=YOUR_PASSWORD`
- `JWT_SECRET=GENERATE_NEW_SECRET`

**Generate JWT Secret:**
```bash
node -e "console.log(require('crypto').randomBytes(48).toString('base64').replace(/[^a-zA-Z0-9]/g, ''))"
```

### 2.4 Create Database
```bash
sudo -u postgres psql -c "CREATE DATABASE school_management10;"
sudo -u postgres psql -c "ALTER USER postgres WITH PASSWORD 'YOUR_PASSWORD';"

# Initialize tables
cd /var/www/bilal-school/backend
node setup-report-card.js
```

### 2.5 Get SSL & Configure Nginx
```bash
# Get SSL
systemctl stop nginx
certbot certonly --standalone -d bilal.skoolific.com
systemctl start nginx

# Create Nginx config (see GITHUB_TO_VPS_DEPLOYMENT.md for full config)
nano /etc/nginx/sites-available/bilal-school

# Enable site
ln -s /etc/nginx/sites-available/bilal-school /etc/nginx/sites-enabled/
nginx -t
systemctl reload nginx
```

### 2.6 Start Backend
```bash
cd /var/www/bilal-school/backend
pm2 start server.js --name bilal-backend
pm2 save
pm2 startup
```

---

## ✅ Verification

```bash
# Check backend
pm2 status

# Check logs
pm2 logs bilal-backend --lines 20

# Test API
curl http://localhost:5011/api/health

# Test website
# Open browser: https://bilal.skoolific.com
```

---

## 🔄 Future Updates

### On Your Computer:
```bash
# Make changes
# ...

# Push to GitHub
git add .
git commit -m "Your changes"
git push origin main
```

### On VPS:
```bash
ssh root@76.13.48.245
cd /var/www/bilal-school
git pull origin main

# If backend changed:
cd backend
npm install --production
pm2 restart bilal-backend

# If frontend changed:
cd app
npm install
npm run build
```

---

## 📚 Full Documentation

- **GITHUB_TO_VPS_DEPLOYMENT.md** - Complete detailed guide
- **GITHUB_DEPLOYMENT_QUICK.md** - This quick reference
- **PUSH_TO_GITHUB.bat** - Automated push script

---

## 🆘 Quick Fixes

### Git push fails
```bash
git remote set-url origin https://github.com/SharkDevSol/bilal.git
git push -u origin main
```

### Clone fails on VPS
```bash
apt install -y git
```

### Backend won't start
```bash
pm2 logs bilal-backend --lines 50
nano /var/www/bilal-school/backend/.env
pm2 restart bilal-backend
```

---

**GitHub:** https://github.com/SharkDevSol/bilal.git  
**VPS:** 76.13.48.245  
**Domain:** bilal.skoolific.com
