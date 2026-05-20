# How to Start Skoolific V2 Servers

## ✅ Current Status
Both servers are running successfully!

- **Backend**: http://localhost:3000 ✅
- **Frontend**: http://localhost:5052 ✅

## 🚀 Starting the Servers

### Backend Server
```bash
cd backend
npm run dev
```
**Port**: 3000  
**Auto-reload**: Enabled (nodemon)

### Frontend Server
```bash
cd APP
npm run dev
```
**Port**: 5052  
**Auto-reload**: Enabled (Vite HMR)

## 🛑 Stopping the Servers

### If you see "port already in use" error:

**Option 1: Stop from terminal**
- Press `Ctrl+C` in the terminal running the server

**Option 2: Kill the process**
```bash
# Find process using port 3000 (backend)
netstat -ano | findstr ":3000"

# Find process using port 7700 (WebSocket)
netstat -ano | findstr ":7700"

# Kill the process (replace PID with actual process ID)
taskkill /PID <PID> /F
```

## 🧪 Testing the Application

**Open browser**: http://localhost:5052

### Login Credentials

| Portal | URL | Username | Password |
|--------|-----|----------|----------|
| Admin | http://localhost:5052/admin-login | `admin` | `admin123` |
| Staff | http://localhost:5052/staff-login | `teacher1` | `teacher123` |
| Student | http://localhost:5052/student-login | `student1` | `student123` |
| Guardian | http://localhost:5052/guardian-login | `guardian1` | `guardian123` |

## 📝 Important Notes

### Backend Warnings (Non-Critical)
You may see these warnings during startup - they're expected:
- ❌ `relation "user_machine_mapping" does not exist`
- ❌ `column "date" does not exist`

These tables will be created automatically when you use the features.

### Port Configuration
- **Backend**: 3000 (main API)
- **Frontend**: 5052 (web interface)
- **WebSocket**: 7700 or 7788 (AI06 biometric devices)

### Development Mode Features
- ✅ **Auto-reload**: Both servers reload automatically when you edit files
- ✅ **Hot Module Replacement (HMR)**: Frontend updates instantly
- ✅ **Error reporting**: Detailed error messages in console

## 🔍 Troubleshooting

### Backend won't start
1. Check if port 3000 is in use: `netstat -ano | findstr ":3000"`
2. Kill any process using the port
3. Wait 2-3 seconds and try again

### Frontend won't start
1. Check if port 5052 is in use: `netstat -ano | findstr ":5052"`
2. Kill any process using the port
3. Clear node_modules and reinstall: `rm -rf node_modules && npm install`

### API calls failing
1. Verify backend is running: http://localhost:3000/api/health
2. Check browser console for errors (F12)
3. Verify `.env.development` has correct backend URL

### Database errors
1. Check PostgreSQL is running
2. Verify database credentials in `backend/.env`
3. Check database exists: `skoolific`

## 📚 Additional Resources

- **BACKEND_FIX_SUMMARY.md** - Details about fixes applied
- **QUICK_TEST_GUIDE.md** - Comprehensive testing guide
- **APP/e2e/fixtures/test-data.js** - All test credentials

## 🎯 Quick Health Check

Run these commands to verify everything is working:

```bash
# Check backend
curl http://localhost:3000/api/health

# Check frontend (should return HTML)
curl http://localhost:5052
```

Expected responses:
- Backend: `{"status":"OK","message":"Server is running"}`
- Frontend: HTML content

---

**Everything is ready! Start testing Skoolific V2!** 🎉
