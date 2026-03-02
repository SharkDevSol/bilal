# VPS Deployment Guide - bilal.skoolific.com

## 📋 Pre-Deployment Checklist

- [ ] VPS server ready (Ubuntu 20.04+ recommended)
- [ ] Domain: bilal.skoolific.com pointing to VPS IP
- [ ] SSH access to VPS
- [ ] Root or sudo access

---

## 🚀 Step-by-Step Deployment (A-Z)

### Step 1: Prepare Local Files

#### 1.1 Build Frontend
```bash
cd app
npm run build
```
This creates a `dist` folder with production files.

#### 1.2 Update Backend Environment
Edit `backend/.env.vps` and set:
- `DB_PASSWORD` - Your PostgreSQL password
- `JWT_SECRET` - Generate new: `node -e "console.log(require('crypto').randomBytes(48).toString('base64').replace(/[^a-zA-Z0-9]/g, ''))"`
- `SMTP_USER` and `SMTP_PASS` - Your email credentials

#### 1.3 Create Deployment Package
```bash
# Create a zip file with necessary files
# (Do this from project root)
```

---

### Step 2: Connect to VPS

```bash
ssh root@YOUR_VPS_IP
# or
ssh your_username@YOUR_VPS_IP
```

---

### Step 3: Install Required Software on VPS

#### 3.1 Update System
```bash
sudo apt update
sudo apt upgrade -y
```

#### 3.2 Install Node.js (v18 or higher)
```bash
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs
node --version  # Should show v18.x or higher
npm --version
```

#### 3.3 Install PostgreSQL
```bash
sudo apt install -y postgresql postgresql-contrib
sudo systemctl start postgresql
sudo systemctl enable postgresql
```

#### 3.4 Install Nginx (Web Server)
```bash
sudo apt install -y nginx
sudo systemctl start nginx
sudo systemctl enable nginx
```

#### 3.5 Install PM2 (Process Manager)
```bash
sudo npm install -g pm2
```

#### 3.6 Install Certbot (SSL Certificates)
```bash
sudo apt install -y certbot python3-certbot-nginx
```

---

### Step 4: Setup PostgreSQL Database

#### 4.1 Create Database and User
```bash
sudo -u postgres psql
```

In PostgreSQL prompt:
```sql
-- Create database
CREATE DATABASE school_management10;

-- Set password for postgres user (use a strong password!)
ALTER USER postgres WITH PASSWORD 'YOUR_STRONG_PASSWORD';

-- Exit
\q
```

#### 4.2 Configure PostgreSQL for Local Connections
```bash
sudo nano /etc/postgresql/*/main/pg_hba.conf
```

Find the line:
```
local   all             postgres                                peer
```

Change to:
```
local   all             postgres                                md5
```

Restart PostgreSQL:
```bash
sudo systemctl restart postgresql
```

---

### Step 5: Upload Project Files to VPS

#### 5.1 Create Project Directory
```bash
sudo mkdir -p /var/www/bilal-school
sudo chown -R $USER:$USER /var/www/bilal-school
cd /var/www/bilal-school
```

#### 5.2 Upload Files (From Your Local Machine)

**Option A: Using SCP**
```bash
# From your local machine (Windows)
# Upload backend
scp -r backend root@YOUR_VPS_IP:/var/www/bilal-school/

# Upload frontend build
scp -r app/dist root@YOUR_VPS_IP:/var/www/bilal-school/frontend
```

**Option B: Using Git**
```bash
# On VPS
cd /var/www/bilal-school
git clone YOUR_REPOSITORY_URL .
```

**Option C: Using FileZilla/WinSCP**
- Connect to VPS using SFTP
- Upload `backend` folder to `/var/www/bilal-school/backend`
- Upload `app/dist` folder to `/var/www/bilal-school/frontend`

---

### Step 6: Setup Backend

#### 6.1 Install Dependencies
```bash
cd /var/www/bilal-school/backend
npm install --production
```

#### 6.2 Configure Environment
```bash
# Copy the VPS environment file
cp .env.vps .env

# Edit with your actual values
nano .env
```

Update these values:
- `DB_PASSWORD` - Your PostgreSQL password
- `JWT_SECRET` - Generate new secret
- `SMTP_USER` and `SMTP_PASS` - Your email credentials

#### 6.3 Initialize Database
```bash
# Create student_activities table
node setup-report-card.js

# Check database connection
node check-classes-in-db.js
```

#### 6.4 Test Backend
```bash
# Test run
node server.js
# Press Ctrl+C to stop after verifying it starts
```

---

### Step 7: Setup SSL Certificate

```bash
# Get SSL certificate for bilal.skoolific.com
sudo certbot --nginx -d bilal.skoolific.com

# Follow the prompts:
# - Enter email address
# - Agree to terms
# - Choose to redirect HTTP to HTTPS (option 2)
```

---

### Step 8: Configure Nginx

#### 8.1 Create Nginx Configuration
```bash
sudo nano /etc/nginx/sites-available/bilal-school
```

Paste this configuration:
```nginx
# Backend API Server
upstream backend {
    server localhost:5011;
}

# Main Server Block
server {
    listen 80;
    server_name bilal.skoolific.com;
    
    # Redirect HTTP to HTTPS
    return 301 https://$server_name$request_uri;
}

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

    # WebSocket for AI06 Device (Port 7788)
    location /ws/ {
        proxy_pass http://localhost:7788/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_read_timeout 86400;
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
    add_header Referrer-Policy "no-referrer-when-downgrade" always;

    # Max Upload Size
    client_max_body_size 50M;
}
```

#### 8.2 Enable Site
```bash
# Create symbolic link
sudo ln -s /etc/nginx/sites-available/bilal-school /etc/nginx/sites-enabled/

# Remove default site
sudo rm /etc/nginx/sites-enabled/default

# Test configuration
sudo nginx -t

# Reload Nginx
sudo systemctl reload nginx
```

---

### Step 9: Start Backend with PM2

#### 9.1 Start Application
```bash
cd /var/www/bilal-school/backend

# Start with PM2
pm2 start server.js --name bilal-backend

# Save PM2 configuration
pm2 save

# Setup PM2 to start on boot
pm2 startup
# Follow the command it gives you (copy and run it)
```

#### 9.2 Verify Backend is Running
```bash
pm2 status
pm2 logs bilal-backend
```

---

### Step 10: Configure Firewall

```bash
# Allow SSH
sudo ufw allow 22/tcp

# Allow HTTP and HTTPS
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp

# Allow backend port (only from localhost)
sudo ufw allow from 127.0.0.1 to any port 5011

# Allow AI06 WebSocket port (if needed externally)
sudo ufw allow 7788/tcp

# Enable firewall
sudo ufw enable
sudo ufw status
```

---

### Step 11: Test Deployment

#### 11.1 Check Services
```bash
# Check Nginx
sudo systemctl status nginx

# Check PostgreSQL
sudo systemctl status postgresql

# Check Backend
pm2 status
pm2 logs bilal-backend --lines 50
```

#### 11.2 Test URLs
```bash
# Test backend API
curl https://bilal.skoolific.com/api/health

# Should return: {"status":"ok"}
```

#### 11.3 Open in Browser
```
https://bilal.skoolific.com
```

---

### Step 12: Import Existing Data (If Needed)

#### 12.1 Export from Old Server
```bash
# On old server
pg_dump -U postgres school_management2 > backup.sql
```

#### 12.2 Import to New Server
```bash
# Upload backup.sql to VPS
scp backup.sql root@YOUR_VPS_IP:/tmp/

# On VPS
psql -U postgres -d school_management10 < /tmp/backup.sql
```

---

## 🔧 Post-Deployment Tasks

### Monitor Application
```bash
# View logs
pm2 logs bilal-backend

# Monitor resources
pm2 monit

# Restart if needed
pm2 restart bilal-backend
```

### Setup Automatic Backups
```bash
# Create backup script
sudo nano /usr/local/bin/backup-school-db.sh
```

Paste:
```bash
#!/bin/bash
BACKUP_DIR="/var/backups/school"
DATE=$(date +%Y%m%d_%H%M%S)
mkdir -p $BACKUP_DIR
pg_dump -U postgres school_management10 > $BACKUP_DIR/backup_$DATE.sql
# Keep only last 7 days
find $BACKUP_DIR -name "backup_*.sql" -mtime +7 -delete
```

Make executable and schedule:
```bash
sudo chmod +x /usr/local/bin/backup-school-db.sh
sudo crontab -e
# Add: 0 2 * * * /usr/local/bin/backup-school-db.sh
```

### SSL Certificate Auto-Renewal
```bash
# Test renewal
sudo certbot renew --dry-run

# Certbot automatically sets up auto-renewal
# Verify with:
sudo systemctl status certbot.timer
```

---

## 📝 Important Files Locations

```
/var/www/bilal-school/
├── backend/
│   ├── server.js
│   ├── .env (KEEP SECURE!)
│   ├── uploads/
│   └── ...
├── frontend/
│   ├── index.html
│   ├── assets/
│   └── ...
└── logs/
```

---

## 🐛 Troubleshooting

### Backend Not Starting
```bash
# Check logs
pm2 logs bilal-backend --lines 100

# Check if port is in use
sudo netstat -tulpn | grep 5011

# Restart
pm2 restart bilal-backend
```

### Database Connection Error
```bash
# Test connection
psql -U postgres -d school_management10

# Check PostgreSQL is running
sudo systemctl status postgresql

# Check .env file has correct credentials
cat /var/www/bilal-school/backend/.env | grep DB_
```

### Nginx Errors
```bash
# Check error logs
sudo tail -f /var/log/nginx/error.log

# Test configuration
sudo nginx -t

# Restart Nginx
sudo systemctl restart nginx
```

### SSL Certificate Issues
```bash
# Renew certificate
sudo certbot renew --force-renewal

# Check certificate
sudo certbot certificates
```

---

## 🔐 Security Checklist

- [ ] Strong database password set
- [ ] JWT_SECRET is unique and strong
- [ ] Firewall configured (ufw)
- [ ] SSL certificate installed
- [ ] .env file permissions: `chmod 600 .env`
- [ ] Regular backups scheduled
- [ ] PM2 configured to restart on reboot
- [ ] Nginx security headers configured
- [ ] PostgreSQL only accepts local connections

---

## 📞 Quick Commands Reference

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

# Update application
cd /var/www/bilal-school/backend
git pull
npm install
pm2 restart bilal-backend
```

---

## ✅ Deployment Complete!

Your application should now be live at:
- **Frontend:** https://bilal.skoolific.com
- **Backend API:** https://bilal.skoolific.com/api
- **Health Check:** https://bilal.skoolific.com/api/health

---

**Last Updated:** March 2026
**Domain:** bilal.skoolific.com
**Backend Port:** 5011
**Database:** school_management10
