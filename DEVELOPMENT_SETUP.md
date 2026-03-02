# Development Setup Guide

## 🚀 Quick Start

### Option 1: Using Batch Scripts (Windows - Easiest)

1. **Start Backend Server**
   ```
   Double-click: START_BACKEND_DEV.bat
   ```
   - Backend will run on: http://localhost:5000

2. **Start Frontend Server** (in a new terminal)
   ```
   Double-click: START_FRONTEND_DEV.bat
   ```
   - Frontend will run on: http://localhost:5173

3. **Open Browser**
   ```
   http://localhost:5173
   ```

### Option 2: Manual Start

**Terminal 1 - Backend:**
```bash
cd backend
node server.js
```

**Terminal 2 - Frontend:**
```bash
cd app
npm run dev
```

---

## 🔧 Environment Configuration

### Development (Local)
- File: `app/.env.development`
- API URL: `http://localhost:5000/api`
- Used when: Running `npm run dev`

### Production (Live Server)
- File: `app/.env.production`
- API URL: `https://iqrab3.skoolific.com`
- Used when: Running `npm run build`

### Default Fallback
- File: `app/.env`
- API URL: `http://localhost:5000/api`
- Used when: No specific environment file found

---

## ✅ Verification Steps

### 1. Check Backend is Running
```bash
curl http://localhost:5000/api/health
```
Should return: `{"status":"ok"}`

### 2. Check Database Connection
```bash
node backend/check-classes-in-db.js
```
Should show list of classes

### 3. Check Frontend Environment
Open browser console and check:
```javascript
import.meta.env.VITE_API_URL
```
Should show: `http://localhost:5000/api`

---

## 🐛 Troubleshooting

### Issue: "CORS Error" or "Network Error"

**Cause:** Frontend is trying to connect to wrong API URL

**Solution:**
1. Check `app/.env.development` has: `VITE_API_URL=http://localhost:5000/api`
2. Stop frontend server (Ctrl + C)
3. Restart: `npm run dev`
4. Hard refresh browser (Ctrl + Shift + R)

### Issue: "No classes" in dropdown

**Cause:** Backend not running or database empty

**Solution:**
1. Check backend is running: `http://localhost:5000/api/health`
2. Check database has classes: `node backend/check-classes-in-db.js`
3. If no classes, register students first

### Issue: "Authentication required"

**Cause:** Not logged in

**Solution:**
1. Go to: `http://localhost:5173/login`
2. Login with admin credentials
3. Navigate back to report card

---

## 📁 Project Structure

```
project/
├── app/                          # Frontend (React + Vite)
│   ├── .env                      # Default environment
│   ├── .env.development          # Development config
│   ├── .env.production           # Production config
│   └── src/
│       └── utils/
│           └── api.js            # API configuration
├── backend/                      # Backend (Node.js + Express)
│   ├── .env                      # Backend config
│   ├── server.js                 # Main server file
│   └── routes/
│       ├── markListRoutes.js     # Classes endpoint
│       └── studentActivitiesRoutes.js  # Activities endpoint
├── START_BACKEND_DEV.bat         # Start backend (Windows)
├── START_FRONTEND_DEV.bat        # Start frontend (Windows)
└── DEVELOPMENT_SETUP.md          # This file
```

---

## 🔄 Switching Between Environments

### For Development (Local)
```bash
# Frontend automatically uses .env.development
cd app
npm run dev
```

### For Production Build
```bash
# Frontend automatically uses .env.production
cd app
npm run build
```

### Manual Override
```bash
# Force development mode
cd app
npm run dev -- --mode development

# Force production mode
cd app
npm run dev -- --mode production
```

---

## 📝 Important Notes

1. **Always run backend first** before starting frontend
2. **Backend port:** 5000 (default)
3. **Frontend port:** 5173 (Vite default)
4. **Database:** PostgreSQL on localhost:5432
5. **Environment files** are loaded automatically by Vite

---

## 🎯 Common Tasks

### Start Development
```bash
# Terminal 1
START_BACKEND_DEV.bat

# Terminal 2
START_FRONTEND_DEV.bat
```

### Check Everything is Working
```bash
# 1. Backend health
curl http://localhost:5000/api/health

# 2. Database classes
node backend/check-classes-in-db.js

# 3. Frontend (open browser)
http://localhost:5173
```

### Deploy to Production
```bash
# 1. Build frontend
cd app
npm run build

# 2. Copy dist/ folder to production server
# 3. Backend .env should have production database credentials
```

---

## 🆘 Getting Help

### Check Logs
- **Backend:** Check terminal running `server.js`
- **Frontend:** Check browser console (F12)
- **Database:** Check PostgreSQL logs

### Common Commands
```bash
# Check if ports are in use
netstat -ano | findstr :5000
netstat -ano | findstr :5173

# Kill process on port
taskkill /PID <process_id> /F

# Restart everything
# 1. Stop both servers (Ctrl + C)
# 2. Run START_BACKEND_DEV.bat
# 3. Run START_FRONTEND_DEV.bat
```

---

**Last Updated:** March 2026
**Status:** ✅ Ready for Development
