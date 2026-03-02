@echo off
echo ========================================
echo Database Schema Sync to VPS
echo ========================================
echo.

echo Step 1: Exporting local database schema...
pg_dump -U postgres -h localhost -d school_management2 --schema-only -f schema.sql
if errorlevel 1 (
    echo ERROR: Failed to export database schema
    pause
    exit /b 1
)
echo ✓ Schema exported successfully

echo.
echo Step 2: Uploading to VPS...
scp schema.sql root@76.13.48.245:/tmp/
if errorlevel 1 (
    echo ERROR: Failed to upload to VPS
    pause
    exit /b 1
)
echo ✓ Uploaded successfully

echo.
echo Step 3: Now run these commands on your VPS:
echo.
echo sudo -u postgres psql -d school_management2 -f /tmp/schema.sql
echo pm2 restart skoolific-backend
echo.
echo ========================================
pause
