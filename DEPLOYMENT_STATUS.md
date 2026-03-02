# 🚀 Bilal School System - Deployment Status

## ✅ COMPLETED TASKS

### 1. Report Card Design Replacement
- ✅ New Bilal School design (blue theme) implemented
- ✅ 3-page layout with multilingual support (Arabic, Oromo, Amharic, English)
- ✅ Student activities tracking integrated
- ✅ Enhanced print/PDF functionality

### 2. Backend Integration
- ✅ Student activities API routes created
- ✅ Database table `student_activities` created
- ✅ API endpoints working:
  - GET `/api/student-activities/activities/:className/:studentName`
  - GET `/api/student-activities/activities/:className/all`
  - POST `/api/student-activities/activities`

### 3. Development Environment
- ✅ Frontend running on http://localhost:5174
- ✅ Backend running on http://localhost:5000
- ✅ Database connection verified (17 classes found)
- ✅ Environment files configured:
  - `app/.env.development` → localhost:5000
  - `app/.env.production` → bilal.skoolific.com

### 4. VPS Production Configuration
- ✅ Port changed to 5011
- ✅ Database name changed to school_management10
- ✅ Domain set to bilal.skoolific.com
- ✅ Production environment file created: `backend/.env.vps`
- ✅ Comprehensive deployment guide created

---

## 📦 READY FOR VPS DEPLOYMENT

### Current Configuration

**Development (Local):**
- Backend Port: 5000
- Database: school_management2
- Frontend: http://localhost:5174
- Backend: http://localhost:5000

**Production (VPS):**
- Backend Port: 5011
- Database: school_management10
- Domain: https://bilal.skoolific.com
- SSL: Required (Let's Encrypt)

---

## 🎯 DEPLOYMENT STEPS (A-Z)

### Step 1: Build Frontend (On Your Computer)
```bash
# Run the deployment script
DEPLOY_TO_VPS.bat
```

This will:
- Build the frontend (creates `app/dist` folder)
- Show you what files to upload

### Step 2: Upload Files to VPS

**Files to Upload:**
1. `backend/` folder → `/var/www/bilal-school/backend`
2. `app/dist/` folder → `/var/www/bilal-school/frontend`

**Upload Methods:**
- **Option A:** Use FileZilla/WinSCP (SFTP)
- **Option B:** Use SCP command
- **Option C:** Use Git (if you have a repository)

### Step 3: On VPS - Install Software
```bash
# Connect to VPS
ssh root@YOUR_VPS_IP

# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js 18
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Install PostgreSQL
sudo apt install -y postgresql postgresql-contrib

# Install Nginx
sudo apt install -y nginx

# Install PM2
sudo npm install -g pm2

# Install Certbot (SSL)
sudo apt install -y certbot python3-certbot-nginx
```

### Step 4: Setup PostgreSQL Database
```bash
# Access PostgreSQL
sudo -u postgres psql

# In PostgreSQL prompt:
CREATE DATABASE school_management10;
ALTER USER postgres WITH PASSWORD 'YOUR_STRONG_PASSWORD';
\q

# Configure authentication
sudo nano /etc/postgresql/*/main/pg_hba.conf
# Change: local all postgres peer → local all postgres md5

# Restart PostgreSQL
sudo systemctl restart postgresql
```

### Step 5: Configure Backend
```bash
cd /var/www/bilal-school/backend

# Install dependencies
npm install --production

# Setup environment
cp .env.vps .env
nano .env
```

**IMPORTANT: Update these values in .env:**
- `DB_PASSWORD` - Your PostgreSQL password
- `JWT_SECRET` - Generate new: `node -e "console.log(require('crypto').randomBytes(48).toString('base64').replace(/[^a-zA-Z0-9]/g, ''))"`
- `SMTP_USER` and `SMTP_PASS` - Your email credentials

```bash
# Initialize database
node setup-report-card.js

# Test backend
node server.js
# Press Ctrl+C after verifying it starts
```

### Step 6: Get SSL Certificate
```bash
sudo certbot --nginx -d bilal.skoolific.com
```

### Step 7: Configure Nginx
```bash
sudo nano /etc/nginx/sites-available/bilal-school
```

Copy the Nginx configuration from `VPS_DEPLOYMENT_GUIDE.md` (Step 8.1)

```bash
# Enable site
sudo ln -s /etc/nginx/sites-available/bilal-school /etc/nginx/sites-enabled/
sudo rm /etc/nginx/sites-enabled/default

# Test and reload
sudo nginx -t
sudo systemctl reload nginx
```

### Step 8: Start Backend with PM2
```bash
cd /var/www/bilal-school/backend
pm2 start server.js --name bilal-backend
pm2 save
pm2 startup
# Run the command it gives you
```

### Step 9: Configure Firewall
```bash
sudo ufw allow 22/tcp
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw enable
```

### Step 10: Test Deployment
```bash
# Check services
pm2 status
sudo systemctl status nginx
sudo systemctl status postgresql

# Test in browser
https://bilal.skoolific.com
```

---

## 📋 PRE-DEPLOYMENT CHECKLIST

Before starting deployment:
- [ ] VPS server ready (Ubuntu 20.04+)
- [ ] Domain `bilal.skoolific.com` pointing to VPS IP
- [ ] SSH access to VPS
- [ ] Root or sudo access
- [ ] Strong passwords prepared for:
  - [ ] PostgreSQL database
  - [ ] JWT secret
  - [ ] Email SMTP (if using)

---

## 📁 IMPORTANT FILES

### Configuration Files
- `backend/.env.vps` - Production environment (UPDATE PASSWORDS!)
- `app/.env.production` - Frontend production config
- `VPS_DEPLOYMENT_GUIDE.md` - Complete A-Z guide
- `DEPLOYMENT_QUICK_REFERENCE.md` - Quick commands

### Deployment Scripts
- `DEPLOY_TO_VPS.bat` - Build frontend for deployment
- `backend/setup-report-card.js` - Initialize student activities table

### Report Card Files
- `app/src/PAGE/CreateMarklist/ReportCard/ReportCard.jsx`
- `app/src/PAGE/CreateMarklist/ReportCard/ReportCard.module.css`
- `backend/routes/studentActivitiesRoutes.js`

---

## 🔐 SECURITY REMINDERS

**BEFORE DEPLOYMENT:**
1. Update `DB_PASSWORD` in `backend/.env.vps`
2. Generate new `JWT_SECRET`
3. Update `SMTP_USER` and `SMTP_PASS` if using email
4. Never commit `.env` files to Git
5. Use strong passwords (minimum 16 characters)

**AFTER DEPLOYMENT:**
1. Set `.env` file permissions: `chmod 600 /var/www/bilal-school/backend/.env`
2. Enable firewall
3. Setup automatic backups
4. Monitor logs regularly

---

## 🆘 TROUBLESHOOTING

### Backend Not Starting
```bash
pm2 logs bilal-backend --lines 100
```

### Database Connection Error
```bash
psql -U postgres -d school_management10
# Check credentials in .env
```

### Nginx Errors
```bash
sudo tail -f /var/log/nginx/error.log
sudo nginx -t
```

### SSL Certificate Issues
```bash
sudo certbot certificates
sudo certbot renew --force-renewal
```

---

## 📞 QUICK COMMANDS

```bash
# Restart everything
pm2 restart bilal-backend
sudo systemctl restart nginx

# View logs
pm2 logs bilal-backend
sudo tail -f /var/log/nginx/error.log

# Check status
pm2 status
sudo systemctl status nginx
sudo systemctl status postgresql
```

---

## ✅ DEPLOYMENT COMPLETE WHEN:

- [ ] Frontend loads at https://bilal.skoolific.com
- [ ] Backend API responds at https://bilal.skoolific.com/api/health
- [ ] Can login to admin panel
- [ ] Can view classes and students
- [ ] Report cards display correctly
- [ ] SSL certificate is active (green padlock)
- [ ] PM2 shows backend running
- [ ] Nginx is running without errors

---

**Last Updated:** March 2, 2026
**System:** Bilal School Management System
**Domain:** bilal.skoolific.com
**Backend Port:** 5011
**Database:** school_management10
