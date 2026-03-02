#!/bin/bash

# Diagnostic script for branding icon upload issue
# Run this on your VPS: bash diagnose-branding-upload.sh

echo "========================================="
echo "Branding Icon Upload Diagnostics"
echo "========================================="
echo ""

echo "1. PM2 Process Status:"
pm2 status | grep skoolific-backend
echo ""

echo "2. Backend Process Owner:"
ps aux | grep "node.*server.js" | grep -v grep | awk '{print "User: " $1 ", PID: " $2}'
echo ""

echo "3. Upload Directory Permissions:"
ls -ld /var/www/skoolific/iqrab3/backend/uploads/branding/
echo ""

echo "4. Files in Branding Directory:"
ls -lh /var/www/skoolific/iqrab3/backend/uploads/branding/
echo ""

echo "5. Database Branding Settings:"
sudo -u postgres psql -d school_management2 -t -c "SELECT 'ID: ' || id || ', Icon: ' || COALESCE(website_icon, 'NULL') || ', Logo: ' || COALESCE(school_logo, 'NULL') || ', Updated: ' || updated_at FROM branding_settings;"
echo ""

echo "6. Recent Upload Errors in PM2 Logs:"
pm2 logs skoolific-backend --lines 100 --nostream 2>/dev/null | grep -i "upload\|branding\|icon\|error" | tail -20
echo ""

echo "7. Nginx Upload Location Test:"
TEST_FILE="/var/www/skoolific/iqrab3/backend/uploads/branding/test-$(date +%s).txt"
echo "test" > "$TEST_FILE"
chmod 644 "$TEST_FILE"
TEST_FILENAME=$(basename "$TEST_FILE")
echo "Created test file: $TEST_FILENAME"
HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" "https://iqrab3.skoolific.com/uploads/branding/$TEST_FILENAME")
echo "HTTP Response Code: $HTTP_CODE"
if [ "$HTTP_CODE" = "200" ]; then
    echo "✓ Nginx can serve files from uploads/branding/"
else
    echo "✗ Nginx cannot serve files (HTTP $HTTP_CODE)"
fi
rm "$TEST_FILE"
echo ""

echo "8. Disk Space:"
df -h /var/www/skoolific/iqrab3/backend/uploads/
echo ""

echo "========================================="
echo "Diagnostics Complete"
echo "========================================="
echo ""
echo "Next Steps:"
echo "1. If permissions are wrong, run: sudo chown -R \$USER:\$USER /var/www/skoolific/iqrab3/backend/uploads/"
echo "2. If Nginx test failed, check /etc/nginx/sites-available/skoolific"
echo "3. If database is empty, run the initialization SQL from FIX_BRANDING_ICON_UPLOAD.md"
echo "4. Try uploading an icon and immediately run: ls -lh /var/www/skoolific/iqrab3/backend/uploads/branding/ | tail -5"
