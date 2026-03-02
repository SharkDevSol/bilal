# API URL Double /api Fix

## Problem
Frontend was making requests to URLs with double `/api`:
- `https://iqrab3.skoolific.com/api/api/hr/attendance/time-settings` ❌
- Should be: `https://iqrab3.skoolific.com/api/hr/attendance/time-settings` ✅

## Root Cause
The `api.js` utility was adding `/api` to the base URL:
```javascript
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
```

But components were already including `/api` in their paths:
```javascript
axios.get('/api/hr/attendance/time-settings')
```

Result: `https://iqrab3.skoolific.com/api` + `/api/hr/...` = `/api/api/hr/...` ❌

## Solution
Changed `api.js` to NOT add `/api` automatically:
```javascript
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
```

Now: `https://iqrab3.skoolific.com` + `/api/hr/...` = `/api/hr/...` ✅

## Files Changed
1. `APP/src/utils/api.js` - Removed `/api` from default base URL
2. `APP/.env.production` - Confirmed it's `https://iqrab3.skoolific.com` (without `/api`)

## Deploy to VPS

```bash
# Upload fixed files
scp APP/src/utils/api.js root@76.13.48.245:/var/www/skoolific/iqrab3/APP/src/utils/
scp APP/.env.production root@76.13.48.245:/var/www/skoolific/iqrab3/APP/

# SSH and rebuild frontend
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

No more 404 errors!
