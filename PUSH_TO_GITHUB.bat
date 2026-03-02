@echo off
echo ========================================
echo   Push to GitHub
echo ========================================
echo.

echo Repository: https://github.com/SharkDevSol/bilal.git
echo.

echo Step 1: Checking Git status...
git status
echo.

echo Step 2: Adding files...
git add .
echo.

echo Step 3: Committing...
set /p commit_message="Enter commit message (or press Enter for default): "
if "%commit_message%"=="" set commit_message=Update Bilal School System

git commit -m "%commit_message%"
echo.

echo Step 4: Pushing to GitHub...
git push origin main
echo.

if errorlevel 1 (
    echo.
    echo ========================================
    echo   Push Failed - Trying to setup remote
    echo ========================================
    echo.
    
    echo Setting up remote...
    git remote add origin https://github.com/SharkDevSol/bilal.git
    
    echo Trying push again...
    git push -u origin main
)

echo.
echo ========================================
echo   Push Complete!
echo ========================================
echo.
echo Next steps:
echo 1. SSH to VPS: ssh root@76.13.48.245
echo 2. Clone repo: git clone https://github.com/SharkDevSol/bilal.git bilal-school
echo 3. Follow: GITHUB_TO_VPS_DEPLOYMENT.md
echo.

pause
