@echo off
echo ========================================
echo   Bilal School Report Card Setup
echo ========================================
echo.

echo Step 1: Checking Node.js installation...
node --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Node.js is not installed!
    echo Please install Node.js from https://nodejs.org/
    pause
    exit /b 1
)
echo OK: Node.js is installed
echo.

echo Step 2: Running setup script...
cd backend
node setup-report-card.js
if errorlevel 1 (
    echo.
    echo ERROR: Setup failed!
    echo Please check the error messages above.
    pause
    exit /b 1
)
echo.

echo ========================================
echo   Setup Complete!
echo ========================================
echo.
echo Next steps:
echo   1. Start the server: cd backend ^&^& node server.js
echo   2. Open browser: http://localhost:3000
echo   3. Navigate to: Mark List -^> Report Card
echo.
echo For more information, see REPORT_CARD_QUICK_START.md
echo.
pause
