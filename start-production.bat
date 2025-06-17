@echo off
REM Diamond Lab Store - Production Startup Script
REM This script starts both frontend and backend in production mode

echo.
echo ======================================
echo    Diamond Lab Store - Production
echo ======================================
echo.

REM Set environment variables
set NODE_ENV=production
set REACT_APP_ENV=production

REM Check if production .env files exist
if not exist "frontend\.env.production" (
    echo ERROR: frontend\.env.production file not found!
    echo Please configure your production environment variables
    pause
    exit /b 1
)

if not exist "backend\.env.production" (
    echo ERROR: backend\.env.production file not found!
    echo Please configure your production environment variables
    pause
    exit /b 1
)

echo Starting Diamond Lab Store in Production Mode...
echo.

REM Check if production build exists
if not exist "frontend\build" (
    echo Building frontend for production...
    cd frontend
    call npm run build:production
    if %errorlevel% neq 0 (
        echo ERROR: Frontend build failed!
        pause
        exit /b 1
    )
    cd ..
)

REM Start backend with production settings
echo Starting Backend (Production)...
start "Diamond Store Backend (PROD)" cmd /k "cd /d backend && set ENVIRONMENT=production && python -m uvicorn main:app --host 0.0.0.0 --port 8000 --env-file .env.production"

REM Wait for backend to start
timeout /t 5 /nobreak >nul

REM Start frontend production server
echo Starting Frontend (Production)...
cd frontend
call npm run serve

echo.
echo Production services should now be running:
echo - Frontend: http://localhost:3000
echo - Backend API: http://localhost:8000
echo - API Docs: DISABLED in production
echo.
echo WARNING: This is a production environment!
echo Make sure all security settings are properly configured.
echo.
pause 