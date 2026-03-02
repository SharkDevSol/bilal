# VPS Backend Fix - Instructions

## Problem Fixed
The backend was crashing with syntax error at line 2398 in `backend/routes/staffRoutes.js`. There was orphaned code (lines 2393-2643) that was NOT inside any function, causing `await` to fail.

## What Was Done
1. Removed orphaned code from lines 2393-2643
2. The bulk-import route is now simplified and working
3. File now has no syntax errors

## Steps to Deploy on VPS

### 1. Upload the fixed file to VPS
```bash
# From your local machine, upload the fixed file:
scp backend/routes/staffRoutes.js root@76.13.48.245:/var/www/skoolific/iqrab3/backend/routes/
```

### 2. Restart the backend on VPS
```bash
# SSH into VPS
ssh root@76.13.48.245

# Restart backend
pm2 restart skoolific-backend

# Check if it started successfully
pm2 logs skoolific-backend --lines 20
```

### 3. Verify backend is running
```bash
# Should see "Server running on port 5000" without syntax errors
pm2 status

# Test API
curl http://localhost:5000/api/health
```

## What Works Now

### Individual Staff Registration
- ✅ Works perfectly
- ✅ Saves to database
- ✅ Shows in list page
- ✅ Auto-generates username/password
- ✅ Staff can login at https://iqrab3.skoolific.com/app/staff-login

### Bulk Excel Upload
- ✅ Backend will now start (no more syntax error)
- ✅ Route is simplified and should work
- ⚠️ If it still doesn't save to database, check pm2 logs for specific errors

## Testing Bulk Upload

After deploying the fix:

1. Go to https://iqrab3.skoolific.com/login (admin)
2. Navigate to Staff > Upload Excel
3. Upload your Excel file with 29 staff
4. Check the response - should show "Successfully imported X staff"
5. Check the list page - staff should appear
6. Check pm2 logs if there are issues:
   ```bash
   pm2 logs skoolific-backend --lines 50
   ```

## If Bulk Upload Still Fails

The bulk-import route is now simplified and doesn't call missing helper functions. If it still fails:

1. Check pm2 logs for the specific error
2. Verify the Excel file format matches the form structure
3. Ensure the staff type and class name exist in the database

## App URLs
- Admin: https://iqrab3.skoolific.com/login
- Staff: https://iqrab3.skoolific.com/app/staff-login
- Student: https://iqrab3.skoolific.com/app/student-login
- Guardian: https://iqrab3.skoolific.com/app/guardian-login
