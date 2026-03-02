# 🌐 Hostinger Subdomain Setup Guide

## VPS Information
- **IP Address:** 76.13.48.245
- **Subdomain:** bilal.skoolific.com
- **SSH Access:** `ssh root@76.13.48.245`

---

## STEP 1: Create Subdomain in Hostinger (5 minutes)

### Option A: Using Hostinger Control Panel (hPanel)

1. **Login to Hostinger**
   - Go to: https://hpanel.hostinger.com/
   - Login with your credentials

2. **Navigate to DNS Settings**
   - Click on "Domains" in the left sidebar
   - Find and click on "skoolific.com"
   - Click on "DNS / Name Servers" or "DNS Zone"

3. **Add A Record for Subdomain**
   - Click "Add Record" or "Add New Record"
   - Select record type: **A**
   - Fill in:
     ```
     Name/Host: bilal
     Points to/Value: 76.13.48.245
     TTL: 3600 (or leave default)
     ```
   - Click "Add Record" or "Save"

4. **Verify DNS Record**
   - You should see:
     ```
     Type: A
     Name: bilal
     Points to: 76.13.48.245
     TTL: 3600
     ```

5. **Wait for DNS Propagation**
   - Usually takes 5-30 minutes
   - Can take up to 24 hours in rare cases

### Option B: Using Hostinger VPS Control Panel

1. **Login to Hostinger VPS Panel**
   - Go to: https://hpanel.hostinger.com/
   - Navigate to "VPS" section
   - Select your VPS

2. **Access DNS Management**
   - Look for "DNS" or "Domain Management"
   - Add A record as described above

---

## STEP 2: Verify DNS Propagation (2 minutes)

### Check if subdomain is working:

**On your computer (Windows PowerShell):**
```powershell
# Check DNS resolution
nslookup bilal.skoolific.com

# Should show:
# Name:    bilal.skoolific.com
# Address: 76.13.48.245
```

**Or use online tool:**
- Visit: https://dnschecker.org/
- Enter: bilal.skoolific.com
- Check if it resolves to 76.13.48.245

---

## STEP 3: Build Frontend (2 minutes)

**On your computer:**

```bash
# Double-click this file:
DEPLOY_TO_VPS.bat

# Or run manually:
cd app
npm run build
cd ..
```

This creates the `app/dist` folder.

---

## STEP 4: Connect to VPS (1 minute)

**Open PowerShell or Git Bash:**

```bash
ssh root@76.13.48.245
```

**If asked "Are you sure you want to continue connecting?"**
- Type: `yes`
- Press Enter

**Enter your VPS root password when prompted**

---

## STEP 5: Prepare VPS Directory (2 minutes)

**On VPS (after SSH connection):**

```bash
# Create project directory
mkdir -p /var/www/bilal-school
cd /var/www/bilal-school

# Set permissions
chown -R $USER:$USER /var/www/bilal-school
chmod -R 755 /var/www/bilal-school

# Verify
pwd
# Should show: /var/www/bilal-school
```

---

## STEP 6: Upload Files to VPS (10 minutes)

### Option A: Using WinSCP (Recommended for Windows)

1. **Download WinSCP**
   - Visit: https://winscp.net/eng/download.php
   - Download and install

2. **Connect to VPS**
   - Open WinSCP
   - File protocol: **SFTP**
   - Host name: **76.13.48.245**
   - Port number: **22**
   - User name: **root**
   - Password: Your VPS password
   - Click "Login"

3. **Upload Files**
   - Left side: Your computer
   - Right side: VPS server
   
   **Navigate on VPS to:** `/var/www/bilal-school/`
   
   **Upload these folders:**
   - Drag `backend` folder → `/var/www/bilal-school/backend`
   - Drag `app/dist` folder → `/var/www/bilal-school/` (rename to `frontend`)

4. **Rename dist to frontend**
   - Right-click on `dist` folder on VPS
   - Select "Rename"
   - Change to: `frontend`

### Option B: Using FileZilla

1. **Download FileZilla**
   - Visit: https://filezilla-project.org/
   - Download and install

2. **Connect to VPS**
   - Host: **sftp://76.13.48.245**
   - Username: **root**
   - Password: Your VPS password
   - Port: **22**
   - Click "Quickconnect"

3. **Upload Files** (same as WinSCP above)

### Option C: Using SCP Command (Advanced)

**From your computer (PowerShell or Git Bash):**

```bash
# Upload backend
scp -r backend root@76.13.48.245:/var/www/bilal-school/

# Upload frontend
scp -r app/dist root@76.13.48.245:/var/www/bilal-school/frontend
```

---

## STEP 7: Install Required Software on VPS (10 minutes)

**On VPS (via SSH):**

```bash
# Update system
apt update && apt upgrade -y

# Install Node.js 18
curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
apt install -y nodejs

# Verify Node.js
node --version  # Should show v18.x or higher
npm --version

# Install PostgreSQL
apt install -y postgresql postgresql-contrib

# Install Nginx
apt install -y nginx

# Install PM2 (Process Manager)
npm install -g pm2

# Install Certbot (SSL)
apt install -y certbot python3-certbot-nginx

# Check all services
systemctl status postgresql
systemctl status nginx
```

---

## STEP 8: Setup PostgreSQL Database (5 minutes)

**On VPS:**

```bash
# Access PostgreSQL
sudo -u postgres psql
```

**In PostgreSQL prompt:**
```sql
-- Create database
CREATE DATABASE school_management10;

-- Set password for postgres user
ALTER USER postgres WITH PASSWORD 'YOUR_STRONG_PASSWORD';

-- List databases to verify
\l

-- Exit
\q
```

**Configure PostgreSQL authentication:**
```bash
# Edit pg_hba.conf
nano /etc/postgresql/*/main/pg_hba.conf
```

**Find this line:**
```
local   all             postgres                                peer
```

**Change to:**
```
local   all             postgres                                md5
```

**Save and exit:**
- Press `Ctrl + X`
- Press `Y`
- Press `Enter`

**Restart PostgreSQL:**
```bash
systemctl restart postgresql
```

---

## STEP 9: Configure Backend (5 minutes)

**On VPS:**

```bash
cd /var/www/bilal-school/backend

# Copy production environment
cp .env.vps .env

# Edit environment file
nano .env
```

**Update these values in .env:**

```env
# Database Configuration
DB_PASSWORD=YOUR_STRONG_PASSWORD  # ← Change this!
DB_NAME=school_management10
DB_HOST=localhost
DB_PORT=5432

# JWT Secret - Generate new one
JWT_SECRET=GENERATE_NEW_SECRET_HERE  # ← Change this!

# Server Configuration
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
Copy the output and paste it as JWT_SECRET in .env

**Save and exit:**
- Press `Ctrl + X`
- Press `Y`
- Press `Enter`

**Install dependencies:**
```bash
npm install --production
```

**Initialize database:**
```bash
node setup-report-card.js
```

**Test backend:**
```bash
node server.js
# Should see: "Server running on 0.0.0.0:5011"
# Press Ctrl+C to stop
```

---

## STEP 10: Get SSL Certificate (5 minutes)

**On VPS:**

```bash
# Get SSL certificate for bilal.skoolific.com
certbot certonly --standalone -d bilal.skoolific.com

# Follow prompts:
# 1. Enter email address
# 2. Agree to terms (Y)
# 3. Share email? (N or Y, your choice)

# Certificate will be saved at:
# /etc/letsencrypt/live/bilal.skoolific.com/fullchain.pem
# /etc/letsencrypt/live/bilal.skoolific.com/privkey.pem
```

**If port 80 is in use:**
```bash
# Stop Nginx temporarily
systemctl stop nginx

# Try certbot again
certbot certonly --standalone -d bilal.skoolific.com

# Start Nginx
systemctl start nginx
```

---

## STEP 11: Configure Nginx (5 minutes)

**On VPS:**

```bash
# Create Nginx configuration
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
    root /var/www/bilal-school/frontend;
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

**Save and exit:**
- Press `Ctrl + X`
- Press `Y`
- Press `Enter`

**Enable site:**
```bash
# Create symbolic link
ln -s /etc/nginx/sites-available/bilal-school /etc/nginx/sites-enabled/

# Remove default site
rm /etc/nginx/sites-enabled/default

# Test configuration
nginx -t

# Should show: "syntax is ok" and "test is successful"

# Reload Nginx
systemctl reload nginx
```

---

## STEP 12: Start Backend with PM2 (2 minutes)

**On VPS:**

```bash
cd /var/www/bilal-school/backend

# Start backend
pm2 start server.js --name bilal-backend

# Save PM2 configuration
pm2 save

# Setup PM2 to start on boot
pm2 startup
# Copy and run the command it gives you

# Check status
pm2 status

# View logs
pm2 logs bilal-backend --lines 20
```

---

## STEP 13: Configure Firewall (2 minutes)

**On VPS:**

```bash
# Allow SSH
ufw allow 22/tcp

# Allow HTTP and HTTPS
ufw allow 80/tcp
ufw allow 443/tcp

# Enable firewall
ufw enable

# Check status
ufw status
```

---

## STEP 14: Test Deployment (5 minutes)

### Check Services

**On VPS:**
```bash
# Check backend
pm2 status
pm2 logs bilal-backend --lines 50

# Check Nginx
systemctl status nginx

# Check PostgreSQL
systemctl status postgresql

# Test API
curl http://localhost:5011/api/health
# Should return: {"status":"ok"}
```

### Test in Browser

**On your computer:**

1. **Open browser and visit:**
   ```
   https://bilal.skoolific.com
   ```

2. **Check for:**
   - ✅ Website loads
   - ✅ Green padlock (SSL working)
   - ✅ Can see login page

3. **Test API:**
   ```
   https://bilal.skoolific.com/api/health
   ```
   Should show: `{"status":"ok"}`

4. **Login and test:**
   - Login to admin panel
   - View classes
   - Check report cards

---

## ✅ Success Checklist

- [ ] Subdomain created in Hostinger
- [ ] DNS resolves to 76.13.48.245
- [ ] Files uploaded to VPS
- [ ] Node.js, PostgreSQL, Nginx installed
- [ ] Database created
- [ ] Backend configured (.env updated)
- [ ] SSL certificate obtained
- [ ] Nginx configured
- [ ] Backend running (pm2 status shows "online")
- [ ] Firewall configured
- [ ] Website loads at https://bilal.skoolific.com
- [ ] Can login to admin panel
- [ ] Report cards work

---

## 🆘 Troubleshooting

### DNS not resolving
```bash
# Wait 15-30 minutes for propagation
# Check: nslookup bilal.skoolific.com
```

### Can't connect via SSH
```bash
# Check IP: ping 76.13.48.245
# Check SSH: ssh -v root@76.13.48.245
```

### Backend won't start
```bash
pm2 logs bilal-backend --lines 100
# Check .env file has correct passwords
nano /var/www/bilal-school/backend/.env
```

### 502 Bad Gateway
```bash
# Check backend is running
pm2 status
pm2 restart bilal-backend

# Check Nginx
systemctl status nginx
systemctl restart nginx
```

### Database connection error
```bash
# Check PostgreSQL
systemctl status postgresql

# Test connection
psql -U postgres -d school_management10

# Check password in .env
cat /var/www/bilal-school/backend/.env | grep DB_PASSWORD
```

### SSL certificate error
```bash
# Check certificate
certbot certificates

# Renew if needed
certbot renew --force-renewal
```

---

## 📞 Quick Commands

```bash
# Connect to VPS
ssh root@76.13.48.245

# Check backend
pm2 status
pm2 logs bilal-backend

# Restart backend
pm2 restart bilal-backend

# Restart Nginx
systemctl restart nginx

# Check database
psql -U postgres -d school_management10

# View Nginx logs
tail -f /var/log/nginx/error.log
```

---

## 🎉 Deployment Complete!

Your application should now be live at:
- **Website:** https://bilal.skoolific.com
- **API:** https://bilal.skoolific.com/api
- **Health Check:** https://bilal.skoolific.com/api/health

---

**VPS IP:** 76.13.48.245  
**Subdomain:** bilal.skoolific.com  
**Backend Port:** 5011  
**Database:** school_management10  
**Last Updated:** March 2, 2026
