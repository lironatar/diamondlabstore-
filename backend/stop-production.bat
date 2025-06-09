@echo off
echo Stopping Diamond Lab Store Production Server...
taskkill /F /IM python.exe /T 2>nul
taskkill /F /IM gunicorn.exe /T 2>nul
echo Production server stopped.
pause
