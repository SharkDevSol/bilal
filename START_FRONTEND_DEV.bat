@echo off
echo ========================================
echo   Starting Frontend Development Server
echo ========================================
echo.
echo Environment: DEVELOPMENT
echo API URL: http://localhost:5000/api
echo.
echo Make sure the backend is running on port 5000!
echo.

cd app
npm run dev

pause
