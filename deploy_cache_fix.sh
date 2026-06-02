#!/bin/bash

# Deploy cache-busted index.html to iqrab3 VPS
echo "🚀 Deploying cache-busted index.html to iqrab3..."

# Upload the updated index.html
sshpass -p 'V@gSWi)Po712@TaWR3r9' scp APP/dist/index.html root@76.13.48.245:/var/www/skoolific/iqrab3/APP/dist/

# Reload Nginx to clear server-side cache
echo "🔄 Reloading Nginx..."
sshpass -p 'V@gSWi)Po712@TaWR3r9' ssh root@76.13.48.245 "systemctl reload nginx"

echo "✅ Deployment complete!"
echo ""
echo "📋 Next steps for the user:"
echo "1. Clear browser cache completely (Ctrl+Shift+Delete)"
echo "2. Close ALL browser tabs for iqrab3.skoolific.com"
echo "3. Restart the browser completely"
echo "4. Open iqrab3.skoolific.com in a fresh tab"
echo "5. Check browser console - should see: 📊 Students with existing marks:"
echo "6. Test: Fill marks, save, refresh - marks should stay locked"
