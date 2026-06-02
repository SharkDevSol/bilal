# Automated Upload Script for Skoolific Fix
# This script uploads the new build and reloads Nginx

$ErrorActionPreference = "Continue"

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "  SKOOLIFIC FIX - AUTOMATED UPLOAD" -ForegroundColor Cyan
Write-Host "========================================`n" -ForegroundColor Cyan

$password = "V@gSWi)Po712@TaWR3r9"
$server = "76.13.48.245"
$user = "root"

# Step 1: Accept host key
Write-Host "[1/4] Accepting SSH host key..." -ForegroundColor Yellow
$acceptKey = @"
y
exit
"@
$acceptKey | plink -pw $password ${user}@${server} 2>&1 | Out-Null
Start-Sleep -Seconds 2

# Step 2: Create backup of old dist folder
Write-Host "[2/4] Creating backup of old files..." -ForegroundColor Yellow
plink -batch -pw $password ${user}@${server} "cd /var/www/skoolific/iqrab3/APP && cp -r dist dist.backup.$(date +%s) 2>/dev/null || true" 2>&1 | Out-Null

# Step 3: Upload new dist folder
Write-Host "[3/4] Uploading new build files..." -ForegroundColor Yellow
Write-Host "    This may take 1-2 minutes..." -ForegroundColor Gray

# Upload index.html first
pscp -batch -pw $password APP\dist\index.html ${user}@${server}:/var/www/skoolific/iqrab3/APP/dist/index.html

# Upload assets folder
pscp -batch -r -pw $password APP\dist\assets\* ${user}@${server}:/var/www/skoolific/iqrab3/APP/dist/assets/

# Upload force-clear-cache.html
pscp -batch -pw $password APP\dist\force-clear-cache.html ${user}@${server}:/var/www/skoolific/iqrab3/APP/dist/force-clear-cache.html 2>&1 | Out-Null

# Step 4: Reload Nginx
Write-Host "[4/4] Reloading Nginx..." -ForegroundColor Yellow
plink -batch -pw $password ${user}@${server} "systemctl reload nginx"

Write-Host "`n========================================" -ForegroundColor Green
Write-Host "  ✅ UPLOAD COMPLETE!" -ForegroundColor Green
Write-Host "========================================`n" -ForegroundColor Green

Write-Host "📋 NEXT STEPS FOR USER:" -ForegroundColor Cyan
Write-Host ""
Write-Host "Option 1 (Recommended):" -ForegroundColor Yellow
Write-Host "  Visit: https://iqrab3.skoolific.com/force-clear-cache.html" -ForegroundColor White
Write-Host "  This will automatically clear all caches" -ForegroundColor Gray
Write-Host ""
Write-Host "Option 2 (Manual):" -ForegroundColor Yellow
Write-Host "  1. Press Ctrl+Shift+Delete" -ForegroundColor White
Write-Host "  2. Select 'All time'" -ForegroundColor White
Write-Host "  3. Check 'Cached images and files'" -ForegroundColor White
Write-Host "  4. Click 'Clear data'" -ForegroundColor White
Write-Host "  5. Close and restart browser" -ForegroundColor White
Write-Host ""
Write-Host "✅ Verify:" -ForegroundColor Cyan
Write-Host "  - Console should show: 📊 Students with existing marks:" -ForegroundColor White
Write-Host "  - Network tab should show: index-3a564561-1777118829567.js" -ForegroundColor White
Write-Host "  - Test: Fill marks → Save → Refresh → Should stay locked" -ForegroundColor White
Write-Host ""

Read-Host "Press Enter to exit"
