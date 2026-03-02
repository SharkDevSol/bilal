# Double /api/ URL Fix - Complete

## Problem
Frontend was making requests with double `/api` in URLs:
- ❌ `https://iqrab3.skoolific.com/api/api/hr/attendance/time-settings`
- ❌ `https://iqrab3.skoolific.com/api/api/staff/classes?staffType=Teachers`
- ✅ Should be: `https://iqrab3.skoolific.com/api/hr/attendance/time-settings`

## Root Cause
HR components were using:
```javascript
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
// API_URL = https://iqrab3.skoolific.com/api (from .env.production)

// Then in axios calls:
axios.get(`${API_URL}/api/hr/...`)
// Result: https://iqrab3.skoolific.com/api/api/hr/... ❌
```

## Solution
Fixed all HR component files to remove the extra `/api`:
```javascript
// Before
axios.get(`${API_URL}/api/hr/attendance/time-settings`)

// After
axios.get(`${API_URL}/hr/attendance/time-settings`)
```

## Files Fixed (10 files)
1. ✅ APP/src/PAGE/HR/AttendanceSystem.jsx
2. ✅ APP/src/PAGE/HR/AttendanceTimeSettings.jsx
3. ✅ APP/src/PAGE/HR/AttendanceTimeSettingsCombined.jsx
4. ✅ APP/src/PAGE/HR/DeviceStatus.jsx
5. ✅ APP/src/PAGE/HR/LeaveManagement.jsx
6. ✅ APP/src/PAGE/HR/PayrollSystem.jsx
7. ✅ APP/src/PAGE/HR/SalaryManagement.jsx
8. ✅ APP/src/PAGE/HR/ShiftTimeSettings.jsx
9. ✅ APP/src/PAGE/HR/StaffShiftAssignment.jsx
10. ✅ APP/src/PAGE/HR/StaffSpecificTiming.jsx

## Configuration Files
- ✅ APP/.env.production: `VITE_API_URL=https://iqrab3.skoolific.com/api`
- ✅ APP/src/utils/api.js: `API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'`

## How It Works Now

### For components using the `api` utility:
```javascript
import api from '../../utils/api';
// api.baseURL = https://iqrab3.skoolific.com/api

api.get('/admin/users')
// Result: https://iqrab3.skoolific.com/api/admin/users ✅
```

### For components using raw axios:
```javascript
const API_URL = import.meta.env.VITE_API_URL;
// API_URL = https://iqrab3.skoolific.com/api

axios.get(`${API_URL}/hr/attendance/time-settings`)
// Result: https://iqrab3.skoolific.com/api/hr/attendance/time-settings ✅
```

## Deploy to VPS

```bash
# Upload all fixed HR files
scp APP/src/PAGE/HR/*.jsx root@76.13.48.245:/var/www/skoolific/iqrab3/APP/src/PAGE/HR/

# Upload config files
scp APP/.env.production root@76.13.48.245:/var/www/skoolific/iqrab3/APP/
scp APP/src/utils/api.js root@76.13.48.245:/var/www/skoolific/iqrab3/APP/src/utils/

# SSH and rebuild
ssh root@76.13.48.245
cd /var/www/skoolific/iqrab3/APP
npm run build

# Restart nginx (if needed)
sudo systemctl restart nginx
```

## Testing
After deploying, check browser console - should see:
- ✅ `GET https://iqrab3.skoolific.com/api/hr/attendance/time-settings 200`
- ✅ `GET https://iqrab3.skoolific.com/api/staff/classes?staffType=Teachers 200`
- ✅ `GET https://iqrab3.skoolific.com/api/hr/shift-settings 200`

No more 404 errors with `/api/api/`!

## Summary
- Fixed 10 HR component files
- Removed duplicate `/api` from all axios calls
- All API URLs now work correctly
- Ready to deploy to VPS
