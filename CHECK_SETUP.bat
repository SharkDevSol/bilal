@echo off
echo ========================================
echo   Checking Development Setup
echo ========================================
echo.

echo [1/4] Checking Backend Configuration...
if exist "backend\.env" (
    echo   ✓ backend\.env exists
) else (
    echo   ✗ backend\.env NOT FOUND!
    echo   Please create backend\.env file
)
echo.

echo [2/4] Checking Frontend Configuration...
if exist "app\.env.development" (
    echo   ✓ app\.env.development exists
) else (
    echo   ✗ app\.env.development NOT FOUND!
)
if exist "app\.env.production" (
    echo   ✓ app\.env.production exists
) else (
    echo   ✗ app\.env.production NOT FOUND!
)
echo.

echo [3/4] Checking Database Connection...
node backend\check-classes-in-db.js
echo.

echo [4/4] Setup Summary
echo ========================================
echo   Backend: http://localhost:5000
echo   Frontend: http://localhost:5173
echo   Database: PostgreSQL (localhost:5432)
echo.
echo To start development:
echo   1. Run: START_BACKEND_DEV.bat
echo   2. Run: START_FRONTEND_DEV.bat
echo   3. Open: http://localhost:5173
echo ========================================
echo.

pause
