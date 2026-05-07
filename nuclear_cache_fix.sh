#!/bin/bash

echo "🚀 NUCLEAR CACHE FIX - Starting..."

# Step 1: Add no-cache headers to Nginx config
echo "📝 Step 1: Updating Nginx configuration..."

# Backup current config
cp /etc/nginx/sites-available/iqrab3.skoolific.com /etc/nginx/sites-available/iqrab3.skoolific.com.backup

# Check if no-cache block already exists
if grep -q "add_header Cache-Control.*no-store" /etc/nginx/sites-available/iqrab3.skoolific.com; then
    echo "✓ No-cache headers already present"
else
    # Add no-cache block before the last closing brace of server block
    sed -i '/^[[:space:]]*}[[:space:]]*$/i \
    # Force no-cache for JS, CSS, HTML\
    location ~* \\.(js|css|html)$ {\
        add_header Cache-Control "no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0";\
        add_header Pragma "no-cache";\
        add_header Expires "0";\
        try_files $uri =404;\
    }' /etc/nginx/sites-available/iqrab3.skoolific.com
    echo "✓ No-cache headers added"
fi

# Step 2: Delete ALL old JavaScript files
echo "🗑️  Step 2: Removing old JavaScript files..."
cd /var/www/skoolific/iqrab3/APP/dist/assets/
rm -f index-4c0db611-*.js
rm -f index-51a6711f-*.js
rm -f index-bcebe178-*.js
echo "✓ Old files deleted"

# Step 3: Verify new file exists
echo "✅ Step 3: Verifying new file..."
if [ -f "index-3a564561-1777118829567.js" ]; then
    echo "✓ New file exists: index-3a564561-1777118829567.js"
    ls -lh index-3a564561-*.js
else
    echo "❌ ERROR: New file not found!"
    exit 1
fi

# Step 4: Test Nginx config
echo "🔍 Step 4: Testing Nginx configuration..."
nginx -t
if [ $? -eq 0 ]; then
    echo "✓ Nginx config is valid"
else
    echo "❌ ERROR: Nginx config has errors!"
    echo "Restoring backup..."
    cp /etc/nginx/sites-available/iqrab3.skoolific.com.backup /etc/nginx/sites-available/iqrab3.skoolific.com
    exit 1
fi

# Step 5: Reload Nginx
echo "🔄 Step 5: Reloading Nginx..."
systemctl reload nginx
echo "✓ Nginx reloaded"

# Step 6: Clear Nginx cache if it exists
echo "🧹 Step 6: Clearing Nginx cache..."
if [ -d "/var/cache/nginx" ]; then
    rm -rf /var/cache/nginx/*
    echo "✓ Nginx cache cleared"
else
    echo "ℹ️  No Nginx cache directory found"
fi

echo ""
echo "=========================================="
echo "✅ NUCLEAR CACHE FIX COMPLETE!"
echo "=========================================="
echo ""
echo "📋 User must now:"
echo "1. Close ALL browser tabs"
echo "2. Clear browser cache (Ctrl+Shift+Delete)"
echo "3. Close browser completely"
echo "4. Restart browser"
echo "5. Visit: https://iqrab3.skoolific.com"
echo ""
echo "🔍 Verify:"
echo "- Console should show: 📊 Students with existing marks:"
echo "- Network tab should show: index-3a564561-1777118829567.js"
echo "- Old files (4c0db611, 51a6711f) should NOT load"
echo ""
