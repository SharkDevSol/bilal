@echo off
echo ========================================
echo   Preparing Deployment Package
echo ========================================
echo.

echo Step 1: Building Frontend...
cd app
call npm run build
if errorlevel 1 (
    echo ERROR: Frontend build failed!
    pause
    exit /b 1
)
cd ..
echo ✓ Frontend built successfully
echo.

echo Step 2: Creating deployment package...
echo.
echo Files ready for deployment:
echo   - backend/ folder
echo   - app/dist/ folder (rename to 'frontend' on VPS)
echo   - backend/.env.vps (rename to .env on VPS)
echo.

echo ========================================
echo   Next Steps:
echo ========================================
echo.
echo 1. Upload to VPS:
echo    - Upload 'backend' folder to /var/www/bilal-school/backend
echo    - Upload 'app/dist' folder to /var/www/bilal-school/frontend
echo.
echo 2. On VPS, run:
echo    cd /var/www/bilal-school/backend
echo    cp .env.vps .env
echo    nano .env  (update passwords and secrets)
echo    npm install --production
echo    node setup-report-card.js
echo    pm2 start server.js --name bilal-backend
echo.
echo 3. Configure Nginx (see VPS_DEPLOYMENT_GUIDE.md)
echo.
echo Full guide: VPS_DEPLOYMENT_GUIDE.md
echo.

pause
