# PowerShell upload script for financeProgressiveInvoiceRoutes.js
# This script uploads the fixed file to the VPS and restarts the backend

$VPS_IP = "76.13.48.245"
$VPS_USER = "root"
$LOCAL_FILE = "backend/routes/financeProgressiveInvoiceRoutes.js"
$REMOTE_PATH = "/var/www/skoolific/iqrab3/backend/routes/"

Write-Host "📤 Uploading financeProgressiveInvoiceRoutes.js to VPS..." -ForegroundColor Cyan

# Upload the file using SCP
scp $LOCAL_FILE "${VPS_USER}@${VPS_IP}:${REMOTE_PATH}"

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ File uploaded successfully!" -ForegroundColor Green
    
    Write-Host "🔄 Restarting backend..." -ForegroundColor Cyan
    
    # Restart the backend
    ssh "${VPS_USER}@${VPS_IP}" "cd /var/www/skoolific/iqrab3/backend && pm2 restart skoolific-backend"
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Backend restarted successfully!" -ForegroundColor Green
        Write-Host ""
        Write-Host "🎉 Update complete! Try generating invoices again." -ForegroundColor Green
    } else {
        Write-Host "❌ Failed to restart backend" -ForegroundColor Red
        exit 1
    }
} else {
    Write-Host "❌ Failed to upload file" -ForegroundColor Red
    exit 1
}
