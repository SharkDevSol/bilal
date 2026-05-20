# Nginx Branding Images Fix - Summary

## Issue
Branding images were not displaying on iqrab3 and bilal because Nginx was returning 404 errors for files in the `/uploads/branding/` directory.

## Root Cause
The issue was caused by **Nginx location matching priority**:

1. **Regex locations** (like `location ~* \.(png|jpg|...)$`) have **higher priority** than regular prefix locations
2. The regex location was matching PNG/JPG files and trying to serve them from the `root` directory
3. The `/uploads/` location block (which uses `alias` to point to the backend uploads directory) was being bypassed

### Example of the Problem:
```
Request: /uploads/branding/icon-123.png

Without ^~ modifier:
1. Nginx checks regex: ~* \.(png|jpg|...)$ ✓ MATCHES
2. Tries to serve from: /var/www/iqrab3.skoolific.com/uploads/branding/icon-123.png
3. File not found → 404

With ^~ modifier:
1. Nginx checks: ^~ /uploads/ ✓ MATCHES (prefix modifier gives priority)
2. Uses alias: /var/www/skoolific/iqrab3/backend/uploads/
3. Serves: /var/www/skoolific/iqrab3/backend/uploads/branding/icon-123.png
4. File found → 200 OK
```

## Solution
Added the `^~` modifier to the `/uploads/` location blocks to give them **priority over regex locations**.

The `^~` modifier means: "If this prefix matches, stop searching and use this location block (don't check regex locations)."

---

## Changes Made

### 1. IQRAB3 Fix

**File:** `/etc/nginx/sites-available/skoolific`

**Change:**
```nginx
# BEFORE
location /uploads/ {
    alias /var/www/skoolific/iqrab3/backend/uploads/;
    ...
}

# AFTER
location ^~ /uploads/ {
    alias /var/www/skoolific/iqrab3/backend/uploads/;
    ...
}
```

**Commands:**
```bash
sed -i 's|location /uploads/|location ^~ /uploads/|' /etc/nginx/sites-available/skoolific
nginx -t
systemctl reload nginx
```

**Test:**
```bash
curl -I https://iqrab3.skoolific.com/uploads/branding/icon-1776490976687.png
# Result: HTTP/2 200 ✓
```

---

### 2. BILAL Fix

**File:** `/etc/nginx/sites-available/bilal-school`

**Problem:** The bilal configuration didn't have an `/uploads/` location block at all!

**Solution:** Added two location blocks with `^~` modifier:

```nginx
# Uploads location - MUST come before regex location to have priority
location ^~ /uploads/ {
    alias /var/www/bilal-school/backend/uploads/;
    try_files $uri $uri/ =404;
    add_header Cache-Control "public, max-age=31536000";
    autoindex off;
}

# Uploads with capital U (for compatibility)
location ^~ /Uploads/ {
    alias /var/www/bilal-school/backend/Uploads/;
    try_files $uri $uri/ =404;
    add_header Cache-Control "public, max-age=31536000";
    autoindex off;
}
```

**Placement:** These blocks were added **before** the regex location block to ensure proper priority.

**Commands:**
```bash
# Backup
cp /etc/nginx/sites-available/bilal-school /etc/nginx/sites-available/bilal-school.backup2

# Upload new config
scp nginx-bilal-updated.conf root@76.13.48.245:/etc/nginx/sites-available/bilal-school

# Test and reload
nginx -t
systemctl reload nginx
```

**Test:**
```bash
curl -I https://bilal.skoolific.com/uploads/branding/icon-1774634546529.png
# Result: HTTP/2 200 ✓
```

---

## Technical Details

### Nginx Location Matching Priority (from highest to lowest):

1. **Exact match:** `location = /path`
2. **Prefix with ^~ modifier:** `location ^~ /path` ← **Our fix uses this**
3. **Regex (case-sensitive):** `location ~ pattern`
4. **Regex (case-insensitive):** `location ~* pattern`
5. **Regular prefix:** `location /path`

### Why ^~ Works:
- When Nginx finds a match with `^~`, it **stops searching** and uses that location
- This prevents regex locations from being checked
- Perfect for serving static files from specific directories

---

## Verification

### IQRAB3
- ✅ Branding images now load correctly
- ✅ URL: https://iqrab3.skoolific.com/uploads/branding/icon-*.png
- ✅ Backend path: /var/www/skoolific/iqrab3/backend/uploads/branding/

### BILAL
- ✅ Branding images now load correctly
- ✅ URL: https://bilal.skoolific.com/uploads/branding/icon-*.png
- ✅ Backend path: /var/www/bilal-school/backend/uploads/branding/

---

## Files Modified

1. `/etc/nginx/sites-available/skoolific` (iqrab3 config)
2. `/etc/nginx/sites-available/bilal-school` (bilal config)

## Backups Created

1. `/etc/nginx/sites-available/bilal-school.backup2`

---

## Lessons Learned

1. **Always use `^~` for upload directories** when you have regex locations for static files
2. **Location order matters** - prefix locations should come before regex locations in the config
3. **Test with curl** - Use `curl -I` to quickly test if files are accessible
4. **Check Nginx logs** - Access and error logs show exactly what's happening

---

## Apply This Fix to Other Sites

If other sites (darul-ulum, almarkaz, etc.) have the same issue, apply the same fix:

```nginx
# Add this BEFORE any regex location blocks
location ^~ /uploads/ {
    alias /path/to/backend/uploads/;
    try_files $uri $uri/ =404;
    add_header Cache-Control "public, max-age=31536000";
    autoindex off;
}
```

Then:
```bash
nginx -t && systemctl reload nginx
```

---

## Status: ✅ COMPLETE

Both iqrab3 and bilal branding images are now working correctly!
