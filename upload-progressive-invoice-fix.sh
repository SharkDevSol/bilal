#!/bin/bash

# Upload script for financeProgressiveInvoiceRoutes.js
# This script uploads the fixed file to the VPS and restarts the backend

VPS_IP="76.13.48.245"
VPS_USER="root"
LOCAL_FILE="backend/routes/financeProgressiveInvoiceRoutes.js"
REMOTE_PATH="/var/www/skoolific/iqrab3/backend/routes/"

echo "📤 Uploading financeProgressiveInvoiceRoutes.js to VPS..."

# Upload the file
scp "$LOCAL_FILE" "$VPS_USER@$VPS_IP:$REMOTE_PATH"

if [ $? -eq 0 ]; then
    echo "✅ File uploaded successfully!"
    
    echo "🔄 Restarting backend..."
    
    # Restart the backend
    ssh "$VPS_USER@$VPS_IP" "cd /var/www/skoolific/iqrab3/backend && pm2 restart skoolific-backend"
    
    if [ $? -eq 0 ]; then
        echo "✅ Backend restarted successfully!"
        echo ""
        echo "🎉 Update complete! Try generating invoices again."
    else
        echo "❌ Failed to restart backend"
        exit 1
    fi
else
    echo "❌ Failed to upload file"
    exit 1
fi
