# 📤 Upload to VPS - Quick Checklist

## 🎯 WHAT YOU NEED TO DO NOW

### Step 1: Build the Frontend (On Your Computer)
```bash
# Double-click this file:
DEPLOY_TO_VPS.bat

# Or run manually:
cd app
npm run build
cd ..
```

This creates the `app/dist` folder with production files.

---

## 📦 FILES TO UPLOAD TO VPS

### Upload These Folders:

1. **Backend Folder**
   - Source: `backend/` (entire folder)
   - Destination on VPS: `/var/www/bilal-school/backend`
   - Size: ~50-100 MB

2. **Frontend Build**
   - Source: `app/dist/` (entire folder)
   - Destination on VPS: `/var/www/bilal-school/frontend`
   - Size: ~5-10 MB

---

## 🔧 UPLOAD METHODS

### Option A: FileZilla (Recommended for Windows)

1. Download FileZilla: https://filezilla-project.org/
2. Connect to VPS:
   - Host: `sftp://YOUR_VPS_IP`
   - Username: `root` (or your username)
   - Password: Your VPS password
   - Port: `22`
3. Navigate to `/var/www/bilal-school/`
4. Drag and drop:
   - `backend` folder
   - `app/dist` folder (rename to `frontend` after upload)

### Option B: WinSCP

1. Download WinSCP: https://winscp.net/
2. Connect using SFTP
3. Upload folders to `/var/www/bilal-school/`

### Option C: Command Line (SCP)

```bash
# From your project folder (Windows PowerShell or Git Bash)

# Upload backend
scp -r backend root@YOUR_VPS_IP:/var/www/bilal-school/

# Upload frontend
scp -r app/dist root@YOUR_VPS_IP:/var/www/bilal-school/frontend
```

---

## ⚙️ AFTER UPLOAD - ON VPS

### 1. Connect to VPS
```bash
ssh root@YOUR_VPS_IP
```

### 2. Verify Files
```bash
ls -la /var/www/bilal-school/
# Should see: backend/ and frontend/
```

### 3. Setup Backend Environment
```bash
cd /var/www/bilal-school/backend

# Copy production environment
cp .env.vps .env

# Edit with your passwords
nano .env
```

**CRITICAL: Update these in .env:**
- Line 6: `DB_PASSWORD=YOUR_STRONG_PASSWORD`
- Line 15: `JWT_SECRET=GENERATE_NEW_SECRET`
- Line 35-36: `SMTP_USER` and `SMTP_PASS` (if using email)

**Generate JWT Secret:**
```bash
node -e "console.log(require('crypto').randomBytes(48).toString('base64').replace(/[^a-zA-Z0-9]/g, ''))"
```

### 4. Install Dependencies
```bash
npm install --production
```

### 5. Initialize Database
```bash
# Create student_activities table
node setup-report-card.js
```

### 6. Test Backend
```bash
# Quick test
node server.js
# Should see: "Server running on 0.0.0.0:5011"
# Press Ctrl+C to stop
```

---

## 📋 COMPLETE DEPLOYMENT GUIDE

For full A-Z deployment instructions, see:
- **VPS_DEPLOYMENT_GUIDE.md** - Complete step-by-step guide
- **DEPLOYMENT_STATUS.md** - Current status and overview

---

## 🔐 IMPORTANT SECURITY NOTES

1. **Never upload .env files directly** - Always use .env.vps and rename on server
2. **Update all passwords** before starting the backend
3. **Generate new JWT_SECRET** - Don't use the development one
4. **Set file permissions** after upload:
   ```bash
   chmod 600 /var/www/bilal-school/backend/.env
   ```

---

## ✅ VERIFICATION CHECKLIST

After upload, verify:
- [ ] Backend folder exists at `/var/www/bilal-school/backend`
- [ ] Frontend folder exists at `/var/www/bilal-school/frontend`
- [ ] `.env` file created from `.env.vps`
- [ ] Passwords updated in `.env`
- [ ] `npm install` completed successfully
- [ ] `node setup-report-card.js` ran successfully
- [ ] Backend starts without errors

---

## 🆘 COMMON ISSUES

### "Permission Denied" when uploading
```bash
# On VPS, create directory first:
sudo mkdir -p /var/www/bilal-school
sudo chown -R $USER:$USER /var/www/bilal-school
```

### "Cannot find module" errors
```bash
# Make sure you ran npm install:
cd /var/www/bilal-school/backend
npm install --production
```

### Database connection errors
```bash
# Check PostgreSQL is running:
sudo systemctl status postgresql

# Test connection:
psql -U postgres -d school_management10
```

---

## 📞 NEXT STEPS AFTER UPLOAD

1. Follow **VPS_DEPLOYMENT_GUIDE.md** from Step 3 onwards
2. Install required software (Node.js, PostgreSQL, Nginx, PM2)
3. Setup SSL certificate
4. Configure Nginx
5. Start backend with PM2
6. Test at https://bilal.skoolific.com

---

**Quick Start Command:**
```bash
# After upload, run this on VPS:
cd /var/www/bilal-school/backend && \
cp .env.vps .env && \
nano .env && \
npm install --production && \
node setup-report-card.js
```

---

**Domain:** bilal.skoolific.com  
**Backend Port:** 5011  
**Database:** school_management10
