# Content Security Policy (CSP) Fix

## Issue
The frontend was blocking API calls to the backend with this error:
```
Connecting to 'http://localhost:3000/api/admin/branding' violates the following 
Content Security Policy directive: "connect-src 'self' https: wss:".
```

## Root Cause
The Content Security Policy in `APP/index.html` only allowed:
- `'self'` (same origin - http://localhost:5052)
- `https:` (secure connections)
- `wss:` (secure WebSocket)

But it **blocked** `http://localhost:3000` (the backend API).

## Solution
Updated the CSP `connect-src` directive in `APP/index.html` to allow local development:

### Before:
```html
connect-src 'self' https: wss:;
```

### After:
```html
connect-src 'self' http://localhost:3000 http://localhost:* http://127.0.0.1:* https: wss: ws://localhost:*;
```

## What This Allows
- ✅ `'self'` - Same origin (frontend)
- ✅ `http://localhost:3000` - Backend API (explicit)
- ✅ `http://localhost:*` - Any localhost port (development)
- ✅ `http://127.0.0.1:*` - Localhost IP (alternative)
- ✅ `https:` - All HTTPS connections (production)
- ✅ `wss:` - Secure WebSocket (production)
- ✅ `ws://localhost:*` - Local WebSocket (development)

## Testing
1. The page should automatically reload (Vite HMR)
2. If not, manually refresh the page (Ctrl+R or F5)
3. Check browser console - the CSP error should be gone
4. The branding API call should succeed

## Production Note
For production deployment, you should:
1. Remove the `http://localhost:*` entries
2. Add your production domain explicitly
3. Keep only `https:` and `wss:` for secure connections

Example production CSP:
```html
connect-src 'self' https://api.yourschool.com https: wss:;
```

## Verification
After the fix, you should see in the console:
- ✅ `🌐 Axios configured with baseURL: http://localhost:3000`
- ✅ No CSP violation errors
- ✅ API calls to backend succeed

## Files Modified
- `APP/index.html` - Updated CSP meta tag

---

**Status**: ✅ Fixed - Frontend can now communicate with backend
