# Bulk Upload Credentials Fix

## Problem
When uploading staff via Excel, the system showed "Successfully imported X staff" and displayed username/password, but staff couldn't login with those credentials.

## Root Cause
The bulk-import route was saving plain passwords to `password_hash` column instead of hashing them with bcrypt. When staff tried to login, bcrypt.compare() failed.

## Solution
Changed bulk-import to use `createStaffUser()` function which:
- Generates random secure username (e.g., khalid123)
- Generates random secure password (e.g., aB3$xY9!)
- Hashes password with bcrypt
- Saves both hashed and plain password to database

## Deploy to VPS

```bash
# Upload fixed file
scp backend/routes/staffRoutes.js root@76.13.48.245:/var/www/skoolific/iqrab3/backend/routes/

# SSH and restart
ssh root@76.13.48.245
pm2 restart skoolific-backend
pm2 logs skoolific-backend --lines 20
```

## Testing

1. Upload Excel file with staff
2. System will show credentials like:
   - Username: khalid123 (random)
   - Password: aB3$xY9! (random secure password)
3. Staff can now login at https://iqrab3.skoolific.com/app/staff-login with those credentials
4. Credentials will work correctly (hashed in database)

## Important Notes
- Usernames are now RANDOM (e.g., khalid123) not predictable
- Passwords are now RANDOM and SECURE (e.g., aB3$xY9!) not simple patterns
- This matches how individual registration works
- Staff MUST save the credentials shown after upload
