# Fix 500 Errors - Summary

## Current Status
✅ URLs are now correct (no more `/api/api`)
❌ Getting 500 Internal Server Error on HR routes

## Errors
- `GET https://iqrab3.skoolific.com/api/hr/shift-settings 500`
- `POST https://iqrab3.skoolific.com/api/hr/attendance/time-settings 500`

## What 500 Means
The routes exist and are registered correctly, but the backend is crashing when processing the request. This is usually due to:
1. Database connection issues
2. Missing database tables
3. Missing database extensions (like `pgcrypto` for UUID generation)
4. Permission issues

## Quick Fix (Run on VPS)

### Option 1: Automated Fix Script
```bash
# Upload the fix script
scp fix-database-500-errors.sql root@76.13.48.245:~/

# SSH into VPS
ssh root@76.13.48.245

# Run the fix script
sudo -u postgres psql -d school_management2 -f fix-database-500-errors.sql

# Restart backend
pm2 restart skoolific-backend

# Check logs
pm2 logs skoolific-backend --lines 20
```

### Option 2: Manual Fix
```bash
# SSH into VPS
ssh root@76.13.48.245

# Enable required extensions
sudo -u postgres psql -d school_management2 -c "CREATE EXTENSION IF NOT EXISTS pgcrypto;"

# Grant permissions
sudo -u postgres psql -d school_management2 -c "GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO skoolific_user;"
sudo -u postgres psql -d school_management2 -c "GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO skoolific_user;"

# Restart backend
pm2 restart skoolific-backend
```

## Check Backend Logs
```bash
pm2 logs skoolific-backend --lines 100
```

Look for specific error messages that will tell us exactly what's wrong.

## Files Created
1. `CHECK_500_ERRORS.md` - Detailed troubleshooting guide
2. `fix-database-500-errors.sql` - Automated fix script
3. `FIX_500_ERRORS_SUMMARY.md` - This file

## Next Steps
1. Run the fix script on VPS
2. Check backend logs for any remaining errors
3. Test the HR pages in browser
4. If still having issues, send me the backend logs

The routes are correctly configured in the code, so this is just a database setup issue that should be quick to fix!
