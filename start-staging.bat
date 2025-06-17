@echo off
REM Diamond Lab Store - Staging Startup Script
REM This script starts both frontend and backend in staging mode for testing

echo.
echo =====================================
echo    Diamond Lab Store - Staging
echo =====================================
echo.

REM Set environment variables
set NODE_ENV=staging
set REACT_APP_ENV=staging

REM Check if staging .env files exist
if not exist "frontend\.env.staging" (
    echo ERROR: frontend\.env.staging file not found!
    echo Please configure your staging environment variables
    pause
    exit /b 1
)

if not exist "backend\.env.staging" (
    echo ERROR: backend\.env.staging file not found!
    echo Please configure your staging environment variables
    pause
    exit /b 1
)

echo Starting Diamond Lab Store in Staging Mode...
echo.

REM Build frontend for staging
echo Building frontend for staging...
cd frontend
call npm run build:staging
if %errorlevel% neq 0 (
    echo ERROR: Frontend build failed!
    pause
    exit /b 1
)
cd ..

REM Start backend with staging settings
echo Starting Backend (Staging)...
start "Diamond Store Backend (STAGING)" cmd /k "cd /d backend && set ENVIRONMENT=staging && python -m uvicorn main:app --host 0.0.0.0 --port 8001 --env-file .env.staging"

REM Wait for backend to start
timeout /t 5 /nobreak >nul

REM Start frontend staging server
echo Starting Frontend (Staging)...
cd frontend
call npm run serve:staging

echo.
echo Staging services should now be running:
echo - Frontend: http://localhost:3000
echo - Backend API: http://localhost:8001
echo - API Docs: http://localhost:8001/docs
echo.
echo This is a staging environment for testing production-like behavior.
echo Debug features are enabled for testing purposes.
echo.
pause 