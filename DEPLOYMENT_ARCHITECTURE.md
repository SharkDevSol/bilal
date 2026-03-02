# 🏗️ Bilal School System - Deployment Architecture

## 📊 System Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                    bilal.skoolific.com                          │
│                    (Your VPS Server)                            │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                         NGINX (Port 80/443)                     │
│                    - SSL/TLS Termination                        │
│                    - Reverse Proxy                              │
│                    - Static File Serving                        │
└─────────────────────────────────────────────────────────────────┘
                              │
                ┌─────────────┴─────────────┐
                ▼                           ▼
┌───────────────────────────┐   ┌───────────────────────────┐
│   Frontend (React)        │   │   Backend API (Node.js)   │
│   /var/www/.../frontend   │   │   /var/www/.../backend    │
│   - Serves HTML/CSS/JS    │   │   - Port 5011             │
│   - Report Cards          │   │   - Express Server        │
│   - Admin Panel           │   │   - REST API              │
└───────────────────────────┘   └───────────────────────────┘
                                              │
                                              ▼
                                ┌───────────────────────────┐
                                │   PostgreSQL Database     │
                                │   - Port 5432 (local)     │
                                │   - school_management10   │
                                │   - Student Activities    │
                                └───────────────────────────┘
```

---

## 🔄 Request Flow

### 1. User Visits Website
```
User Browser
    │
    ▼
https://bilal.skoolific.com
    │
    ▼
NGINX (Port 443)
    │
    ├─→ Static Files (HTML/CSS/JS) → Frontend
    │
    └─→ API Requests (/api/*) → Backend (Port 5011)
            │
            ▼
        PostgreSQL Database
```

### 2. API Request Example
```
GET https://bilal.skoolific.com/api/mark-list/classes
    │
    ▼
NGINX receives request
    │
    ▼
NGINX proxies to → http://localhost:5011/api/mark-list/classes
    │
    ▼
Backend processes request
    │
    ▼
Query PostgreSQL database
    │
    ▼
Return JSON response
    │
    ▼
NGINX forwards to user
```

---

## 📁 File Structure on VPS

```
/var/www/bilal-school/
│
├── backend/
│   ├── server.js                    # Main server file
│   ├── .env                         # Environment config (PORT=5011)
│   ├── package.json
│   ├── node_modules/
│   ├── config/
│   │   └── db.js                    # Database connection
│   ├── routes/
│   │   ├── studentActivitiesRoutes.js
│   │   ├── markListRoutes.js
│   │   └── ...
│   ├── uploads/                     # User uploads
│   └── ...
│
└── frontend/
    ├── index.html                   # Main HTML file
    ├── assets/
    │   ├── index-[hash].js         # React app bundle
    │   └── index-[hash].css        # Styles
    └── ...
```

---

## 🔐 Security Layers

```
┌─────────────────────────────────────────────────────────────────┐
│  1. Firewall (UFW)                                              │
│     - Only ports 22, 80, 443 open to internet                  │
│     - Port 5011 only accessible from localhost                 │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│  2. SSL/TLS (Let's Encrypt)                                     │
│     - HTTPS encryption                                          │
│     - Auto-renewal                                              │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│  3. NGINX Security Headers                                      │
│     - X-Frame-Options                                           │
│     - X-Content-Type-Options                                    │
│     - X-XSS-Protection                                          │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│  4. Backend Security                                            │
│     - JWT Authentication                                        │
│     - Rate Limiting                                             │
│     - Input Sanitization                                        │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│  5. Database Security                                           │
│     - Local connections only                                    │
│     - Password authentication                                   │
│     - Regular backups                                           │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🔌 Port Configuration

| Service       | Port  | Access        | Purpose                    |
|---------------|-------|---------------|----------------------------|
| HTTP          | 80    | Public        | Redirect to HTTPS          |
| HTTPS         | 443   | Public        | Main website access        |
| SSH           | 22    | Public        | Server administration      |
| Backend       | 5011  | Localhost     | API server                 |
| PostgreSQL    | 5432  | Localhost     | Database                   |
| AI06 WebSocket| 7788  | Public/Local  | Biometric device (optional)|

---

## 🔄 Process Management

```
┌─────────────────────────────────────────────────────────────────┐
│                         PM2 Process Manager                     │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  bilal-backend                                          │   │
│  │  - Runs: node server.js                                 │   │
│  │  - Auto-restart on crash                                │   │
│  │  - Auto-start on server reboot                          │   │
│  │  - Log management                                       │   │
│  │  - Resource monitoring                                  │   │
│  └─────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
```

**PM2 Commands:**
```bash
pm2 start server.js --name bilal-backend   # Start
pm2 restart bilal-backend                  # Restart
pm2 stop bilal-backend                     # Stop
pm2 logs bilal-backend                     # View logs
pm2 monit                                  # Monitor resources
pm2 status                                 # Check status
```

---

## 🗄️ Database Schema

```
PostgreSQL Database: school_management10
│
├── students                    # Student information
├── staff                       # Staff information
├── classes                     # Class information
├── attendance                  # Attendance records
├── marks                       # Student marks
├── student_activities          # NEW: Report card activities
│   ├── id
│   ├── class_name
│   ├── student_name
│   ├── term_number
│   ├── personal_hygiene
│   ├── learning_materials_care
│   ├── time_management
│   ├── work_independently
│   ├── obeys_rules
│   ├── overall_responsibility
│   └── social_relation
└── ...
```

---

## 🌐 URL Routing

| URL Pattern                              | Handled By | Purpose                    |
|------------------------------------------|------------|----------------------------|
| `/`                                      | Frontend   | Home page                  |
| `/login`                                 | Frontend   | Login page                 |
| `/report-card`                           | Frontend   | Report card page           |
| `/api/health`                            | Backend    | Health check               |
| `/api/mark-list/classes`                 | Backend    | Get classes list           |
| `/api/student-activities/activities/*`   | Backend    | Student activities         |
| `/uploads/*`                             | NGINX      | Static file serving        |

---

## 📊 Environment Configuration

### Development (.env)
```env
PORT=5000
DB_NAME=school_management2
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
```

### Production (.env.vps → .env)
```env
PORT=5011
DB_NAME=school_management10
NODE_ENV=production
FRONTEND_URL=https://bilal.skoolific.com
```

---

## 🔄 Deployment Workflow

```
┌─────────────────────────────────────────────────────────────────┐
│  1. LOCAL DEVELOPMENT                                           │
│     - Code changes                                              │
│     - Test on localhost:5173                                    │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│  2. BUILD                                                       │
│     - Run: npm run build                                        │
│     - Creates: app/dist/                                        │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│  3. UPLOAD TO VPS                                               │
│     - Upload backend/ folder                                    │
│     - Upload app/dist/ → frontend/                              │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│  4. CONFIGURE                                                   │
│     - Update .env file                                          │
│     - npm install --production                                  │
│     - node setup-report-card.js                                 │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│  5. START                                                       │
│     - pm2 restart bilal-backend                                 │
│     - sudo systemctl reload nginx                               │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│  6. VERIFY                                                      │
│     - Test: https://bilal.skoolific.com                         │
│     - Check: pm2 logs bilal-backend                             │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🔧 Monitoring & Maintenance

### Health Checks
```bash
# Backend health
curl https://bilal.skoolific.com/api/health

# PM2 status
pm2 status

# Nginx status
sudo systemctl status nginx

# Database status
sudo systemctl status postgresql
```

### Log Locations
```
Backend Logs:     ~/.pm2/logs/bilal-backend-out.log
                  ~/.pm2/logs/bilal-backend-error.log
Nginx Access:     /var/log/nginx/access.log
Nginx Error:      /var/log/nginx/error.log
PostgreSQL:       /var/log/postgresql/
```

### Backup Strategy
```
Daily:    Database backup (automated via cron)
Weekly:   Full system backup
Monthly:  Offsite backup copy
```

---

## 🚀 Performance Optimization

1. **NGINX Caching**
   - Static files cached for 30 days
   - Gzip compression enabled

2. **Database Optimization**
   - Indexed columns for fast queries
   - Connection pooling

3. **PM2 Clustering**
   - Can run multiple instances
   - Load balancing

4. **CDN (Future)**
   - Serve static assets from CDN
   - Reduce server load

---

## 📈 Scalability Path

```
Current Setup (Single Server)
    │
    ▼
Add Database Replication
    │
    ▼
Add Load Balancer
    │
    ▼
Multiple Backend Servers
    │
    ▼
Separate Database Server
    │
    ▼
CDN for Static Assets
```

---

**System:** Bilal School Management System  
**Domain:** bilal.skoolific.com  
**Backend Port:** 5011  
**Database:** school_management10  
**Last Updated:** March 2, 2026
