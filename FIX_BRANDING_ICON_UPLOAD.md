# Fix Branding Icon Upload Issue

## Problem
Icons upload successfully but return 404 when accessed. The file `icon-1771769538161.png` doesn't exist in the directory even though the upload appeared to succeed.

## Root Cause Analysis
From the logs and code review:
1. File uploads to `/var/www/skoolific/iqrab3/backend/uploads/branding/`
2. Database gets updated with the new filename
3. Old icon deletion code may be running incorrectly
4. File permissions or ownership issues

## Solution Steps

### Step 1: Check Current State
```bash
# Check PM2 logs for upload errors
pm2 logs skoolific-backend --lines 100 --nostream | grep -i "upload\|branding\|icon"

# Check directory permissions
ls -ld /var/www/skoolific/iqrab3/backend/uploads/branding/
ls -la /var/www/skoolific/iqrab3/backend/uploads/branding/

# Check process owner
ps aux | grep "node.*server.js"
```

### Step 2: Fix Permissions
```bash
# Ensure the Node.js process can write to uploads directory
cd /var/www/skoolific/iqrab3/backend
sudo chown -R $USER:$USER uploads/
sudo chmod -R 755 uploads/
```

### Step 3: Check Database
```bash
# Check branding_settings table
sudo -u postgres psql -d school_management2 -c "SELECT * FROM branding_settings;"

# If table doesn't exist or is empty, initialize it
sudo -u postgres psql -d school_management2 -c "
CREATE TABLE IF NOT EXISTS branding_settings (
  id SERIAL PRIMARY KEY,
  website_icon VARCHAR(255),
  school_logo VARCHAR(255),
  school_name VARCHAR(255) DEFAULT 'School Management System',
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO branding_settings (id, school_name) 
VALUES (1, 'School Management System')
ON CONFLICT (id) DO NOTHING;
"
```

### Step 4: Test Upload with Monitoring
```bash
# Terminal 1: Monitor file creation
watch -n 1 'ls -lht /var/www/skoolific/iqrab3/backend/uploads/branding/ | head -10'

# Terminal 2: Monitor PM2 logs
pm2 logs skoolific-backend --lines 0

# Then upload an icon through the UI and watch both terminals
```

### Step 5: Verify Nginx Configuration
```bash
# Check Nginx uploads location block
sudo cat /etc/nginx/sites-available/skoolific | grep -A 10 "location /uploads"

# Test file serving
echo "test" > /var/www/skoolific/iqrab3/backend/uploads/branding/test.txt
curl -I https://iqrab3.skoolific.com/uploads/branding/test.txt
# Should return 200 OK

# Clean up test file
rm /var/www/skoolific/iqrab3/backend/uploads/branding/test.txt
```

### Step 6: Check for Race Conditions
The code deletes old icons after uploading new ones. If there's a bug, it might delete the newly uploaded file.

```bash
# Check the adminRoutes.js for the deletion logic
grep -A 10 "Delete old icon" /var/www/skoolific/iqrab3/backend/routes/adminRoutes.js
```

## Quick Fix: Use Existing Icon
One of the existing icons should work. Try updating the database directly:

```bash
# Use an existing icon file
sudo -u postgres psql -d school_management2 -c "
UPDATE branding_settings 
SET website_icon = 'icon-1771682296195.png', 
    updated_at = CURRENT_TIMESTAMP 
WHERE id = 1;
"

# Verify it's accessible
curl -I https://iqrab3.skoolific.com/uploads/branding/icon-1771682296195.png
```

## Debugging Output to Collect
Run these and share the output:

```bash
echo "=== PM2 Status ==="
pm2 status

echo "=== Directory Permissions ==="
ls -ld /var/www/skoolific/iqrab3/backend/uploads/branding/

echo "=== Files in Directory ==="
ls -lh /var/www/skoolific/iqrab3/backend/uploads/branding/

echo "=== Database Content ==="
sudo -u postgres psql -d school_management2 -c "SELECT * FROM branding_settings;"

echo "=== Process Owner ==="
ps aux | grep "node.*server.js" | grep -v grep

echo "=== Recent PM2 Logs ==="
pm2 logs skoolific-backend --lines 50 --nostream | tail -30
```

## Expected Behavior
After fixing:
1. Upload icon through UI
2. File should persist in `/var/www/skoolific/iqrab3/backend/uploads/branding/`
3. Database should update with new filename
4. Icon should be accessible at `https://iqrab3.skoolific.com/uploads/branding/[filename]`
5. Old icon should be deleted (if it exists)
