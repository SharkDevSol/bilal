# 🎯 Deployment Steps - Visual Guide

## Your Setup
```
┌─────────────────────────────────────────┐
│  VPS IP:     76.13.48.245               │
│  Subdomain:  bilal.skoolific.com        │
│  SSH:        ssh root@76.13.48.245      │
│  Port:       5011 (backend, internal)   │
│  Database:   school_management10        │
└─────────────────────────────────────────┘
```

---

## 📊 Complete Flow

```
┌─────────────────────────────────────────────────────────────┐
│  STEP 1: CREATE SUBDOMAIN (5 min)                           │
│  ─────────────────────────────────────────────────────────  │
│  Hostinger → Domains → DNS → Add A Record                   │
│  Name: bilal  →  Points to: 76.13.48.245                    │
└─────────────────────────────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────┐
│  STEP 2: BUILD FRONTEND (2 min)                             │
│  ─────────────────────────────────────────────────────────  │
│  Double-click: DEPLOY_TO_VPS.bat                            │
│  Creates: app/dist/ folder                                  │
└─────────────────────────────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────┐
│  STEP 3: UPLOAD FILES (10 min)                              │
│  ─────────────────────────────────────────────────────────  │
│  WinSCP → Connect to 76.13.48.245                           │
│  Upload: backend/ and app/dist/ (rename to frontend)        │
└─────────────────────────────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────┐
│  STEP 4: INSTALL SOFTWARE (10 min)                          │
│  ─────────────────────────────────────────────────────────  │
│  SSH: ssh root@76.13.48.245                                 │
│  Install: Node.js, PostgreSQL, Nginx, PM2, Certbot          │
└─────────────────────────────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────┐
│  STEP 5: CREATE DATABASE (5 min)                            │
│  ─────────────────────────────────────────────────────────  │
│  CREATE DATABASE school_management10;                       │
│  ALTER USER postgres WITH PASSWORD 'xxx';                   │
└─────────────────────────────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────┐
│  STEP 6: CONFIGURE BACKEND (5 min)                          │
│  ─────────────────────────────────────────────────────────  │
│  cp .env.vps .env                                           │
│  nano .env → Update passwords                               │
│  npm install --production                                   │
│  node setup-report-card.js                                  │
└─────────────────────────────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────┐
│  STEP 7: GET SSL CERTIFICATE (5 min)                        │
│  ─────────────────────────────────────────────────────────  │
│  certbot certonly --standalone -d bilal.skoolific.com       │
└─────────────────────────────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────┐
│  STEP 8: CONFIGURE NGINX (5 min)                            │
│  ─────────────────────────────────────────────────────────  │
│  Create: /etc/nginx/sites-available/bilal-school            │
│  Enable site and reload Nginx                               │
└─────────────────────────────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────┐
│  STEP 9: START BACKEND (2 min)                              │
│  ─────────────────────────────────────────────────────────  │
│  pm2 start server.js --name bilal-backend                   │
│  pm2 save && pm2 startup                                    │
└─────────────────────────────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────┐
│  STEP 10: TEST (5 min)                                      │
│  ─────────────────────────────────────────────────────────  │
│  Visit: https://bilal.skoolific.com                         │
│  Check: Login, Classes, Report Cards                        │
└─────────────────────────────────────────────────────────────┘
                          │
                          ▼
                    ✅ SUCCESS!
```

---

## 🎯 Time Breakdown

```
┌────────────────────────────────────────┐
│  Task                    Time          │
├────────────────────────────────────────┤
│  Create subdomain        5 min         │
│  Build frontend          2 min         │
│  Upload files           10 min         │
│  Install software       10 min         │
│  Create database         5 min         │
│  Configure backend       5 min         │
│  Get SSL                 5 min         │
│  Configure Nginx         5 min         │
│  Start backend           2 min         │
│  Test                    5 min         │
├────────────────────────────────────────┤
│  TOTAL                  ~1 hour        │
└────────────────────────────────────────┘
```

---

## 🔐 Important Passwords to Prepare

```
┌────────────────────────────────────────┐
│  1. VPS Root Password                  │
│     (for SSH access)                   │
│                                        │
│  2. PostgreSQL Password                │
│     (for database)                     │
│     Minimum 16 characters              │
│                                        │
│  3. JWT Secret                         │
│     (generate with command)            │
│                                        │
│  4. Email Password (optional)          │
│     (for notifications)                │
└────────────────────────────────────────┘
```

---

## 📁 Files to Upload

```
Your Computer                    VPS Server
─────────────────               ─────────────────────────────────

backend/                    →   /var/www/bilal-school/backend/
├── server.js                   ├── server.js
├── .env.vps                    ├── .env (rename from .env.vps)
├── package.json                ├── package.json
├── routes/                     ├── routes/
└── ...                         └── ...

app/dist/                   →   /var/www/bilal-school/frontend/
├── index.html                  ├── index.html
├── assets/                     ├── assets/
└── ...                         └── ...
```

---

## 🌐 DNS Configuration

```
┌─────────────────────────────────────────┐
│  Hostinger DNS Settings                 │
│                                         │
│  Type:  A                               │
│  Name:  bilal                           │
│  Value: 76.13.48.245                    │
│  TTL:   3600                            │
│                                         │
│  Result: bilal.skoolific.com            │
│          → 76.13.48.245                 │
└─────────────────────────────────────────┘
```

**Check DNS:**
```bash
nslookup bilal.skoolific.com
# Should show: 76.13.48.245
```

---

## 🔧 VPS Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    bilal.skoolific.com                       │
│                    (76.13.48.245)                            │
└─────────────────────────────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────┐
│                    NGINX (Port 80/443)                       │
│                    - SSL/HTTPS                               │
│                    - Reverse Proxy                           │
└─────────────────────────────────────────────────────────────┘
                          │
            ┌─────────────┴─────────────┐
            ▼                           ▼
┌───────────────────────┐   ┌───────────────────────┐
│  Frontend (React)     │   │  Backend (Node.js)    │
│  /var/www/.../        │   │  Port 5011            │
│  frontend/            │   │  /var/www/.../        │
│                       │   │  backend/             │
└───────────────────────┘   └───────────────────────┘
                                        │
                                        ▼
                            ┌───────────────────────┐
                            │  PostgreSQL           │
                            │  Port 5432            │
                            │  school_management10  │
                            └───────────────────────┘
```

---

## ✅ Success Indicators

```
┌─────────────────────────────────────────┐
│  ✅ DNS resolves to 76.13.48.245        │
│  ✅ Files uploaded to VPS               │
│  ✅ Software installed                  │
│  ✅ Database created                    │
│  ✅ Backend configured                  │
│  ✅ SSL certificate obtained            │
│  ✅ Nginx configured                    │
│  ✅ Backend running (pm2 status)        │
│  ✅ Website loads (HTTPS)               │
│  ✅ Can login                           │
│  ✅ Report cards work                   │
└─────────────────────────────────────────┘
```

---

## 🆘 Quick Troubleshooting

```
Problem                  Solution
─────────────────────   ─────────────────────────────────
DNS not working         Wait 30 min, check nslookup

Can't SSH               Check IP, password, port 22

Upload fails            Create /var/www/bilal-school
                        chmod -R 755 /var/www/bilal-school

Backend won't start     pm2 logs bilal-backend
                        Check .env passwords

502 Bad Gateway         pm2 restart bilal-backend
                        systemctl restart nginx

Database error          Check PostgreSQL running
                        Verify password in .env

SSL error               certbot renew --force-renewal
```

---

## 📞 Essential Commands

### On Your Computer
```bash
# Build
cd app && npm run build

# Check DNS
nslookup bilal.skoolific.com

# Connect to VPS
ssh root@76.13.48.245
```

### On VPS
```bash
# Check status
pm2 status
systemctl status nginx
systemctl status postgresql

# View logs
pm2 logs bilal-backend
tail -f /var/log/nginx/error.log

# Restart services
pm2 restart bilal-backend
systemctl restart nginx
```

---

## 📚 Documentation Files

```
┌─────────────────────────────────────────┐
│  Quick Start:                           │
│  → HOSTINGER_QUICK_START.md             │
│                                         │
│  Complete Guide:                        │
│  → HOSTINGER_SUBDOMAIN_SETUP.md         │
│                                         │
│  Visual Guide:                          │
│  → DEPLOYMENT_STEPS_VISUAL.md (this)    │
│                                         │
│  Reference:                             │
│  → DEPLOYMENT_QUICK_REFERENCE.md        │
└─────────────────────────────────────────┘
```

---

## 🎉 Ready to Deploy!

```
1. Read: HOSTINGER_QUICK_START.md
2. Follow: HOSTINGER_SUBDOMAIN_SETUP.md
3. Test: https://bilal.skoolific.com
```

**Good luck! 🚀**

---

**VPS:** 76.13.48.245  
**Domain:** bilal.skoolific.com  
**Port:** 5011  
**Database:** school_management10
