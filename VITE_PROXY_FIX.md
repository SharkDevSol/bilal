# Vite Proxy Configuration Fix

## Issue
The frontend was making API calls that resulted in an infinite loop and 500 errors:
```
POST http://localhost:5052/api/v2/branches/validate 500 (Internal Server Error)
Proxying: POST /api/v2/branches/validate → http://localhost:5052/api/v2/branches/validate
```

The error showed:
- API calls were going to `http://localhost:5052` (frontend) instead of `http://localhost:3000` (backend)
- Vite proxy was forwarding requests to itself, creating an infinite loop
- Error: `ENOBUFS` - No buffer space available (too many requests)

## Root Cause
The Vite proxy configuration in `APP/vite.config.js` was incorrectly set:

```javascript
proxy: {
  '/api': {
    target: 'http://localhost:5052',  // ❌ WRONG - This is the frontend itself!
    changeOrigin: true,
  }
}
```

This caused:
1. Frontend makes request to `/api/v2/branches/validate`
2. Vite proxy forwards to `http://localhost:5052/api/v2/branches/validate` (itself)
3. Vite proxy forwards again to `http://localhost:5052/api/v2/branches/validate` (itself)
4. Infinite loop → Buffer overflow → 500 error

## Solution
Updated the proxy target to point to the backend server:

```javascript
proxy: {
  '/api': {
    target: 'http://localhost:3000',  // ✅ CORRECT - Backend server
    changeOrigin: true,
  }
}
```

## How It Works Now
1. Frontend makes request to `/api/v2/branches/validate`
2. Vite proxy forwards to `http://localhost:3000/api/v2/branches/validate` (backend)
3. Backend processes the request and returns response
4. Frontend receives the response

## Files Modified
- `APP/vite.config.js` - Changed proxy target from `5052` to `3000`

## Testing
The page should automatically reload (Vite HMR). Then:

1. **Refresh the page** (F5)
2. **Enter branch code**: `MAI`
3. **Check console**: Should see `Proxying: POST /api/v2/branches/validate → http://localhost:3000/api/v2/branches/validate`
4. **Branch validation should succeed**

## Verification
After the fix, you should see in the console:
```
✅ Proxying: POST /api/v2/branches/validate → http://localhost:3000/api/v2/branches/validate
✅ 200 OK response
✅ No more infinite loop errors
```

## Why This Happened
The Vite config was likely copied from a different setup or had a typo. The proxy target should always point to the backend server, not the frontend itself.

## Related Configuration
Make sure these are consistent:
- **Backend port**: `3000` (in `backend/.env`)
- **Frontend port**: `5052` (in `APP/vite.config.js`)
- **Vite proxy target**: `http://localhost:3000` (in `APP/vite.config.js`)
- **Axios baseURL**: `http://localhost:3000` (in `APP/.env.development`)

---

**Status**: ✅ Fixed - Vite proxy now correctly forwards to backend
