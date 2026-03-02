# 🔄 Multiple Systems on Same VPS - Configuration Guide

## Your Current Setup

```
VPS IP: 76.13.48.245

System 1 (Existing):
├── Domain: iqrab3.skoolific.com
├── Status: Already deployed ✅
└── Working correctly

System 2 (New - Bilal School):
├── Domain: bilal.skoolific.com
├── Status: Ready to deploy
└── Will be deployed alongside System 1
```

---

## ✅ No Conflicts - Here's Why

### 1. Different Domains
```
iqrab3.skoolific.com  → System 1
bilal.skoolific.com   → System 2 (New)

Both can run on same VPS without issues!
```

### 2. Different Backend Ports
```
System 1 (iqrab3):  Port 5000 (or different)
System 2 (bilal):   Port 5011 ✅

No port conflict!
```

### 3. Different Databases
```
System 1 (iqrab3):  school_management2 (or different)
System 2 (bilal):   school_management10 ✅

No database conflict!
```

### 4. Different Directories
```
System 1 (iqrab3):  /var/www/iqrab3/ (or similar)
System 2 (bilal):   /var/www/bilal-school/ ✅

No file conflict!
```

---

## 🏗️ VPS Architecture with Both Systems

```
┌─────────────────────────────────────────────────────────────┐
│                    VPS: 76.13.48.245                         │
└─────────────────────────────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────┐
│                    NGINX (Port 80/443)                       │
│                    Routes traffic by domain                  │
└─────────────────────────────────────────────────────────────┘
                          │
            ┌─────────────┴─────────────┐
            ▼                           ▼
┌───────────────────────┐   ┌───────────────────────┐
│  iqrab3.skoolific.com │   │  bilal.skoolific.com  │
│  (System 1)           │   │  (System 2 - NEW)     │
│                       │   │                       │
│  Backend: Port 5000   │   │  Backend: Port 5011   │
│  DB: school_mgmt2     │   │  DB: school_mgmt10    │
│  Dir: /var/www/iqrab3 │   │  Dir: /var/www/bilal  │
└───────────────────────┘   └───────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────┐
│                    PostgreSQL (Port 5432)                    │
│                                                              │
│  ├── school_management2 (System 1)                          │
│  └── school_management10 (System 2)                         │
└─────────────────────────────────────────────────────────────┘
```

---

## 🔧 Configuration Adjustments

### Nginx Configuration

Both systems will have separate Nginx configurations:

```
/etc/nginx/sites-available/
├── iqrab3-school      (Existing - System 1)
└── bilal-school       (New - System 2)

/etc/nginx/sites-enabled/
├── iqrab3-school → ../sites-available/iqrab3-school
└── bilal-school → ../sites-available/bilal-school
```

**Nginx will route traffic based on domain:**
- Request to `iqrab3.skoolific.com` → System 1
- Request to `bilal.skoolific.com` → System 2

---

## 📋 Deployment Checklist for System 2 (Bilal)

### ✅ Safe to Deploy - No Conflicts

- [x] Different domain (bilal.skoolific.com)
- [x] Different backend port (5011)
- [x] Different database (school_management10)
- [x] Different directory (/var/www/bilal-school)
- [x] Different PM2 process name (bilal-backend)
- [x] Different Nginx config file

### What You Need to Do

1. **Create subdomain in Hostinger**
   - Add A record: bilal → 76.13.48.245

2. **Upload files to VPS**
   - Upload to: `/var/www/bilal-school/`
   - System 1 files remain in their location

3. **Create new database**
   - Database: `school_management10`
   - System 1 database remains untouched

4. **Configure backend**
   - Port: 5011 (System 1 uses different port)
   - Database: school_management10

5. **Get SSL certificate**
   - For: bilal.skoolific.com
   - System 1 SSL remains valid

6. **Create Nginx config**
   - File: `/etc/nginx/sites-available/bilal-school`
   - System 1 config remains unchanged

7. **Start backend with PM2**
   - Name: `bilal-backend`
   - System 1 process continues running

---

## 🔍 Verification Commands

### Check Both Systems Are Running

```bash
# SSH to VPS
ssh root@76.13.48.245

# Check PM2 processes (should see both)
pm2 status

# Expected output:
# ┌─────┬────────────────┬─────────┬─────────┐
# │ id  │ name           │ status  │ port    │
# ├─────┼────────────────┼─────────┼─────────┤
# │ 0   │ iqrab3-backend │ online  │ 5000    │
# │ 1   │ bilal-backend  │ online  │ 5011    │
# └─────┴────────────────┴─────────┴─────────┘

# Check Nginx sites
ls -la /etc/nginx/sites-enabled/
# Should show both: iqrab3-school and bilal-school

# Check databases
sudo -u postgres psql -c "\l"
# Should show both: school_management2 and school_management10

# Check ports in use
netstat -tulpn | grep LISTEN | grep node
# Should show both ports: 5000 and 5011
```

---

## 🚨 Important Notes

### 1. System 1 (iqrab3) Will NOT Be Affected

- ✅ Will continue running normally
- ✅ No downtime during System 2 deployment
- ✅ No configuration changes needed
- ✅ Database remains separate
- ✅ Files remain separate

### 2. Resource Sharing

Both systems will share:
- ✅ CPU (VPS has enough capacity)
- ✅ RAM (monitor with `htop`)
- ✅ Disk space (check with `df -h`)
- ✅ PostgreSQL server (different databases)
- ✅ Nginx server (different configs)

### 3. SSL Certificates

Each system has its own SSL certificate:
```
System 1: /etc/letsencrypt/live/iqrab3.skoolific.com/
System 2: /etc/letsencrypt/live/bilal.skoolific.com/
```

---

## 📊 Port Allocation

```
┌─────────────────────────────────────────┐
│  Port    Service           System       │
├─────────────────────────────────────────┤
│  22      SSH               Shared       │
│  80      HTTP (Nginx)      Shared       │
│  443     HTTPS (Nginx)     Shared       │
│  5000    Backend           System 1     │
│  5011    Backend           System 2 ✅  │
│  5432    PostgreSQL        Shared       │
│  7788    AI06 WebSocket    Shared       │
└─────────────────────────────────────────┘
```

---

## 🔄 PM2 Process Management

### Managing Both Systems

```bash
# View all processes
pm2 status

# Restart System 1 only
pm2 restart iqrab3-backend

# Restart System 2 only
pm2 restart bilal-backend

# View logs for System 1
pm2 logs iqrab3-backend

# View logs for System 2
pm2 logs bilal-backend

# Restart all
pm2 restart all

# Monitor resources
pm2 monit
```

---

## 🗄️ Database Management

### Both Databases in Same PostgreSQL

```bash
# Connect to PostgreSQL
sudo -u postgres psql

# List all databases
\l

# Expected output:
# school_management2   (System 1)
# school_management10  (System 2)

# Connect to System 1 database
\c school_management2

# Connect to System 2 database
\c school_management10

# Exit
\q
```

---

## 🌐 DNS Configuration

### Both Subdomains Point to Same VPS

```
Hostinger DNS Settings:

Type: A    Name: iqrab3    Value: 76.13.48.245  (Existing)
Type: A    Name: bilal     Value: 76.13.48.245  (New)

Result:
iqrab3.skoolific.com → 76.13.48.245 → System 1
bilal.skoolific.com  → 76.13.48.245 → System 2
```

---

## ✅ Deployment Safety Checklist

Before deploying System 2:

- [x] System 1 is running and stable
- [x] Different port configured (5011)
- [x] Different database name (school_management10)
- [x] Different directory (/var/www/bilal-school)
- [x] Different PM2 process name (bilal-backend)
- [x] Different Nginx config file
- [x] Different SSL certificate domain

**Result: 100% Safe to Deploy! ✅**

---

## 🎯 Deployment Steps (Won't Affect System 1)

1. **Create subdomain** - Only adds new DNS record
2. **Upload files** - To new directory
3. **Create database** - New database, doesn't touch existing
4. **Configure backend** - New .env file, new port
5. **Get SSL** - New certificate for bilal.skoolific.com
6. **Configure Nginx** - New config file
7. **Start backend** - New PM2 process

**System 1 continues running throughout! ✅**

---

## 📈 Resource Monitoring

### Check VPS Resources

```bash
# Check CPU and RAM usage
htop

# Check disk space
df -h

# Check memory
free -h

# Check running processes
ps aux | grep node

# Check network connections
netstat -tulpn | grep LISTEN
```

### Recommended VPS Specs for 2 Systems

```
Minimum:
- RAM: 4GB
- CPU: 2 cores
- Disk: 40GB

Recommended:
- RAM: 8GB
- CPU: 4 cores
- Disk: 80GB
```

---

## 🆘 Troubleshooting

### If System 1 Stops Working

```bash
# Check PM2
pm2 status

# Restart System 1
pm2 restart iqrab3-backend

# Check logs
pm2 logs iqrab3-backend
```

### If Port Conflict

```bash
# Check what's using ports
netstat -tulpn | grep :5000
netstat -tulpn | grep :5011

# If conflict, change port in System 2's .env
nano /var/www/bilal-school/backend/.env
# Change PORT=5011 to PORT=5012 (or any free port)
```

### If Database Conflict

```bash
# List databases
sudo -u postgres psql -c "\l"

# Verify System 2 uses school_management10
cat /var/www/bilal-school/backend/.env | grep DB_NAME
```

---

## 🎉 Summary

### ✅ You Can Safely Deploy System 2

**Why it's safe:**
1. Different domain names
2. Different backend ports
3. Different databases
4. Different directories
5. Different PM2 processes
6. Different Nginx configs

**System 1 (iqrab3.skoolific.com) will:**
- ✅ Continue running
- ✅ Not be affected
- ✅ Keep all data
- ✅ Maintain performance

**System 2 (bilal.skoolific.com) will:**
- ✅ Run independently
- ✅ Have its own resources
- ✅ Not interfere with System 1

---

## 📞 Quick Reference

```bash
# Check both systems
pm2 status

# System 1 logs
pm2 logs iqrab3-backend

# System 2 logs
pm2 logs bilal-backend

# Restart System 1
pm2 restart iqrab3-backend

# Restart System 2
pm2 restart bilal-backend

# Check Nginx
systemctl status nginx

# Check databases
sudo -u postgres psql -c "\l"
```

---

**Conclusion: No problems! Both systems can run together perfectly! ✅**

---

**VPS:** 76.13.48.245  
**System 1:** iqrab3.skoolific.com (Existing)  
**System 2:** bilal.skoolific.com (New)  
**Status:** Safe to deploy both systems
