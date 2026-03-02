# 🚀 Hostinger VPS - Quick Start Guide

## Your VPS Details
```
IP Address: 76.13.48.245
Subdomain:  bilal.skoolific.com
SSH:        ssh root@76.13.48.245
```

---

## 📋 3 SIMPLE STEPS

### STEP 1: Create Subdomain (5 minutes)

```
1. Login to Hostinger
   → https://hpanel.hostinger.com/

2. Go to Domains → skoolific.com → DNS

3. Add A Record:
   Name:      bilal
   Points to: 76.13.48.245
   TTL:       3600

4. Save and wait 5-30 minutes
```

### STEP 2: Build & Upload (15 minutes)

```
1. Build frontend:
   → Double-click: DEPLOY_TO_VPS.bat

2. Download WinSCP:
   → https://winscp.net/

3. Connect to VPS:
   Host: 76.13.48.245
   User: root
   Port: 22

4. Upload:
   backend/ → /var/www/bilal-school/backend
   app/dist/ → /var/www/bilal-school/frontend
```

### STEP 3: Deploy on VPS (40 minutes)

```
1. SSH to VPS:
   ssh root@76.13.48.245

2. Follow: HOSTINGER_SUBDOMAIN_SETUP.md
   (Steps 7-14)

3. Test:
   https://bilal.skoolific.com
```

---

## 🎯 Quick Commands

### On Your Computer
```bash
# Build frontend
cd app
npm run build

# Check DNS
nslookup bilal.skoolific.com
# Should show: 76.13.48.245

# Connect to VPS
ssh root@76.13.48.245
```

### On VPS (After SSH)
```bash
# Quick setup script
apt update && apt upgrade -y
curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
apt install -y nodejs postgresql postgresql-contrib nginx certbot python3-certbot-nginx
npm install -g pm2

# Create database
sudo -u postgres psql -c "CREATE DATABASE school_management10;"
sudo -u postgres psql -c "ALTER USER postgres WITH PASSWORD 'YOUR_PASSWORD';"

# Configure backend
cd /var/www/bilal-school/backend
cp .env.vps .env
nano .env  # Update passwords
npm install --production
node setup-report-card.js

# Get SSL
certbot certonly --standalone -d bilal.skoolific.com

# Start backend
pm2 start server.js --name bilal-backend
pm2 save
pm2 startup
```

---

## ✅ Checklist

```
□ Create subdomain in Hostinger
□ Wait for DNS propagation (check with nslookup)
□ Build frontend (DEPLOY_TO_VPS.bat)
□ Upload files via WinSCP
□ SSH to VPS
□ Install software (Node.js, PostgreSQL, Nginx, PM2)
□ Create database
□ Configure backend (.env file)
□ Get SSL certificate
□ Configure Nginx
□ Start backend with PM2
□ Test website
```

---

## 🆘 Quick Fixes

### DNS not working?
```bash
# Wait 30 minutes, then check:
nslookup bilal.skoolific.com
```

### Can't upload files?
```bash
# On VPS, create directory:
mkdir -p /var/www/bilal-school
chmod -R 755 /var/www/bilal-school
```

### Backend won't start?
```bash
# Check logs:
pm2 logs bilal-backend --lines 50

# Common fix: Update .env passwords
nano /var/www/bilal-school/backend/.env
pm2 restart bilal-backend
```

### 502 Error?
```bash
# Restart everything:
pm2 restart bilal-backend
systemctl restart nginx
```

---

## 📚 Full Documentation

- **HOSTINGER_SUBDOMAIN_SETUP.md** - Complete step-by-step guide
- **VPS_DEPLOYMENT_GUIDE.md** - Detailed deployment instructions
- **DEPLOYMENT_QUICK_REFERENCE.md** - Commands reference

---

## 🎉 Success!

When you see:
- ✅ https://bilal.skoolific.com loads
- ✅ Green padlock (SSL)
- ✅ Can login
- ✅ Report cards work

**You're done! 🎊**

---

**VPS:** 76.13.48.245  
**Domain:** bilal.skoolific.com  
**Port:** 5011 (internal)
