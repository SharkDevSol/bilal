# Quick Fix for 500 Errors

## The Problem
The database tables have wrong column types:
- `late_threshold` column is missing or wrong type
- Trying to insert TIME values (like "08:15") into INTEGER columns

## The Fix (Run on VPS)

```bash
# 1. Upload the fix script
scp fix-all-time-settings.sql root@76.13.48.245:~/

# 2. SSH into VPS
ssh root@76.13.48.245

# 3. Run the fix script
sudo -u postgres psql -d school_management2 -f fix-all-time-settings.sql

# 4. Restart backend
pm2 restart skoolific-backend

# 5. Check logs (should see no more errors)
pm2 logs skoolific-backend --lines 20
```

## What the Script com (admin login)
- Navigate to HR > Attendance Settings
- Should load without 500 errors!
r type integer: 08:15" errors
- HR pages should work correctly
- Student attendance should work correctly

## Test
After restarting, go to:
- https://iqrab3.skoolific.l tables
5. Grants proper permissions

## After Running
- No more "column late_threshold does not exist" errors
- No more "invalid input syntax fonce_time_settings` with correct TIME columns
4. Inserts default settings for ales `shift_time_settings` with correct TIME columns
3. Drops and recreates `hr_attendaemic_student_attendance_settings` with correct TIME columns
2. Drops and recreatDoes
1. Drops and recreates `acad