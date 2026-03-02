# How to Check 500 Errors on VPS

## The Problem
Frontend is getting 500 Internal Server Error:
- `GET https://iqrab3.skoolific.com/api/hr/shift-settings 500`
- `POST https://iqrab3.skoolific.com/api/hr/attendance/time-settings 500`

This means the backend routes exist but are crashing when called.

## Step 1: Check Backend Logs

```bash
# SSH into VPS
ssh root@76.13.48.245

# Check backend logs
pm2 logs skoolific-backend --lines 100
```

Look for error messages like:
- `❌ Error fetching shift settings:`
- `❌ Error saving settings:`
- Database connection errors
- Missing table errors
- Permission errors

## Step 2: Check if Backend is Running

```bash
pm2 status
```

Should show:
```
┌─────┬──────────────────────┬─────────┬─────────┐
│ id  │ name                 │ status  │ restart │
├─────┼──────────────────────┼─────────┼─────────┤
│ 0   │ skoolific-backend    │ online  │ 0       │
└─────┴──────────────────────┴─────────┴─────────┘
```

If status is "errored" or "stopped":
```bash
pm2 restart skoolific-backend
pm2 logs skoolific-backend --lines 50
```

## Step 3: Check Database Connection

```bash
# Test database connection
sudo -u postgres psql -d school_management2 -c "SELECT NOW();"
```

Should show current timestamp. If error, database is down.

## Step 4: Check if Tables Exist

```bash
# Check if hr_attendance_time_settings table exists
sudo -u postgres psql -d school_management2 -c "\dt hr_attendance_time_settings"

# Check if shift_time_settings table exists
sudo -u postgres psql -d school_management2 -c "\dt shift_time_settings"
```

If tables don't exist, they should be auto-created by the routes.

## Step 5: Test Routes Directly

```bash
# Test shift settings route
curl -X GET http://localhost:5000/api/hr/shift-settings

# Test attendance time settings route
curl -X GET http://localhost:5000/api/hr/attendance/time-settings \
  -H "Authorization: Bearer YOUR_TOKEN"
```

## Common Issues and Fixes

### Issue 1: Database Connection Error
**Symptoms**: Logs show "connection refused" or "ECONNREFUSED"

**Fix**:
```bash
# Check if PostgreSQL is running
sudo systemctl status postgresql

# If not running, start it
sudo systemctl start postgresql
```

### Issue 2: Missing gen_random_uuid() Function
**Symptoms**: Error: "function gen_random_uuid() does not exist"

**Fix**:
```bash
sudo -u postgres psql -d school_management2 -c "CREATE EXTENSION IF NOT EXISTS pgcrypto;"
```

### Issue 3: Permission Denied
**Symptoms**: Error: "permission denied for table"

**Fix**:
```bash
# Grant permissions to skoolific_user
sudo -u postgres psql -d school_management2 -c "GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO skoolific_user;"
sudo -u postgres psql -d school_management2 -c "GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO skoolific_user;"
```

### Issue 4: Routes Not Registered
**Symptoms**: 404 errors instead of 500

**Fix**: Check if routes are registered in server.js (already done - they are registered)

## Step 6: After Fixing

```bash
# Restart backend
pm2 restart skoolific-backend

# Check logs
pm2 logs skoolific-backend --lines 20

# Test in browser
# Go to https://iqrab3.skoolific.com and check if errors are gone
```

## What to Send Me

If you still have issues, send me:
1. Output of `pm2 logs skoolific-backend --lines 100`
2. Any error messages you see
3. Output of `pm2 status`

I'll help you fix it!
