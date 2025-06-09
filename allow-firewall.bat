@echo off
echo ===========================================
echo Diamond Lab Store - Windows Firewall Setup
echo ===========================================
echo.
echo This script will configure Windows Firewall to allow
echo network access to your Diamond Lab Store servers.
echo.

REM Check if running as administrator
net session >nul 2>&1
if %errorLevel% == 0 (
    echo ✅ Running as Administrator - Good!
    echo.
) else (
    echo ❌ This script needs to run as Administrator!
    echo.
    echo Please:
    echo 1. Right-click on this file
    echo 2. Select "Run as administrator"
    echo 3. Try again
    echo.
    pause
    exit /b 1
)

echo Adding firewall rules for Diamond Lab Store...
echo.

echo [1/4] Adding rule for Backend API (Port 8001)...
netsh advfirewall firewall add rule name="Diamond Lab Store - Backend API" dir=in action=allow protocol=TCP localport=8001
if %errorlevel% == 0 (
    echo ✅ Backend API rule added successfully
) else (
    echo ❌ Failed to add Backend API rule
)

echo.
echo [2/4] Adding rule for Frontend (Port 3001)...
netsh advfirewall firewall add rule name="Diamond Lab Store - Frontend" dir=in action=allow protocol=TCP localport=3001
if %errorlevel% == 0 (
    echo ✅ Frontend rule added successfully
) else (
    echo ❌ Failed to add Frontend rule
)

echo.
echo [3/4] Adding rule for Production Server (Port 8001 - if using production)...
netsh advfirewall firewall add rule name="Diamond Lab Store - Production" dir=in action=allow protocol=TCP localport=8001
if %errorlevel% == 0 (
    echo ✅ Production rule added successfully
) else (
    echo ❌ Failed to add Production rule
)

echo.
echo [4/4] Verifying firewall rules...
netsh advfirewall firewall show rule name="Diamond Lab Store - Backend API"
netsh advfirewall firewall show rule name="Diamond Lab Store - Frontend"

echo.
echo ===========================================
echo Firewall Configuration Complete!
echo ===========================================
echo.
echo ✅ Your Diamond Lab Store should now be accessible from other devices
echo    on your network using your IP address.
echo.
echo 🚀 Next steps:
echo    1. Run: start-network.bat
echo    2. Note your IP address from the output
echo    3. On other devices, go to: http://YOUR-IP:3001
echo.
echo 🔧 To remove these rules later, run this script with /remove parameter
echo    or use Windows Firewall settings manually.
echo.

if "%1"=="/remove" goto :remove
goto :end

:remove
echo Removing Diamond Lab Store firewall rules...
netsh advfirewall firewall delete rule name="Diamond Lab Store - Backend API"
netsh advfirewall firewall delete rule name="Diamond Lab Store - Frontend"
netsh advfirewall firewall delete rule name="Diamond Lab Store - Production"
echo ✅ Firewall rules removed
goto :end

:end
pause 