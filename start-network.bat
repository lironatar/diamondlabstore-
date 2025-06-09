@echo off
echo ===========================================
echo Diamond Lab Store - Network Access Mode
echo ===========================================
echo.
echo 🌐 Enabling Network Access - Other devices can connect!
echo.

echo [1/5] Getting your IP address...
for /f "tokens=2 delims=:" %%i in ('ipconfig ^| findstr /C:"IPv4"') do set IP=%%i
for /f "tokens=1" %%i in ("%IP%") do set IP=%%i

if "%IP%"=="" (
    echo Warning: Could not detect IP address automatically
    set /p IP="Please enter your IP address: "
)

echo Your IP Address: %IP%
echo.

echo [2/5] Checking Virtual Environment...
if not exist "backend\venv" (
    echo Error: Virtual environment not found!
    echo Please run setup.bat first to initialize the project.
    pause
    exit /b 1
)

echo [3/5] Running Database Migrations...
cd backend
call venv\Scripts\activate
alembic upgrade head
if %errorlevel% neq 0 (
    echo Warning: Database migration failed. Continuing anyway...
)
cd ..

echo.
echo [4/5] Starting Backend Server (Network Mode)...
start "Diamond Store Backend (NETWORK)" cmd /k "cd backend && call venv\Scripts\activate && set CORS_ORIGINS=* && uvicorn main:app --host 0.0.0.0 --port 8001 --reload"

echo Waiting for backend to start...
timeout /t 5 /nobreak > nul

echo.
echo [5/5] Starting Frontend Server (Network Mode)...
start "Diamond Store Frontend (NETWORK)" cmd /k "cd frontend && set REACT_APP_API_URL=http://%IP%:8001/api && npm start"

echo.
echo ===========================================
echo Network Servers Started Successfully!
echo ===========================================
echo.
echo 🖥️  Your computer can access:
echo    Frontend: http://localhost:3001
echo    Backend API: http://localhost:8001
echo    Admin Panel: http://localhost:3001/admin
echo.
echo 🌐 Other devices on your network can access:
echo    Frontend: http://%IP%:3001
echo    Backend API: http://%IP%:8001
echo    Admin Panel: http://%IP%:3001/admin
echo.
echo 📱 On mobile/other laptops, open browser and go to:
echo    http://%IP%:3001
echo.
echo 🔥 Important Notes:
echo    - Make sure Windows Firewall allows these connections
echo    - All devices must be on the same WiFi network
echo    - The database is shared from this computer
echo    - All data, categories, and products will be visible
echo.
echo Press any key to close this window...
echo (The servers will continue running in separate windows)
pause 