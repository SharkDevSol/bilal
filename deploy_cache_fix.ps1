# Deploy cache-busted index.html to iqrab3 VPS
Write-Host "🚀 Deploying cache-busted index.html to iqrab3..." -ForegroundColor Green

$password = 'V@gSWi)Po712@TaWR3r9'
$server = '76.13.48.245'
$user = 'root'

# Create a secure string for the password
$securePassword = ConvertTo-SecureString $password -AsPlainText -Force
$credential = New-Object System.Management.Automation.PSCredential ($user, $securePassword)

# Upload the updated index.html using SCP
Write-Host "📤 Uploading index.html..." -ForegroundColor Yellow
scp -o StrictHostKeyChecking=no APP/dist/index.html ${user}@${server}:/var/www/skoolific/iqrab3/APP/dist/

# Reload Nginx to clear server-side cache
Write-Host "🔄 Reloading Nginx..." -ForegroundColor Yellow
ssh -o StrictHostKeyChecking=no ${user}@${server} "systemctl reload nginx"

Write-Host "✅ Deployment complete!" -ForegroundColor Green
Write-Host ""
Write-Host "📋 Next steps for the user:" -ForegroundColor Cyan
Write-Host "1. Clear browser cache completely (Ctrl+Shift+Delete)" -ForegroundColor White
Write-Host "2. Close ALL browser tabs for iqrab3.skoolific.com" -ForegroundColor White
Write-Host "3. Restart the browser completely" -ForegroundColor White
Write-Host "4. Open iqrab3.skoolific.com in a fresh tab" -ForegroundColor White
Write-Host "5. Check browser console - should see: 📊 Students with existing marks:" -ForegroundColor White
Write-Host "6. Test: Fill marks, save, refresh - marks should stay locked" -ForegroundColor White
