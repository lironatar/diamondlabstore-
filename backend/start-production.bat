@echo off
echo Starting Diamond Lab Store Production Server...
cd /d "C:\Users\liron\OneDrive\????? ??????\New folder\claude4\DiamondLabStore\"
call venv\Scripts\activate
set PYTHONPATH=C:\Users\liron\OneDrive\????? ??????\New folder\claude4\DiamondLabStore\backend
gunicorn main:app --host 0.0.0.0 --port 8001 --workers 4 --worker-class uvicorn.workers.UvicornWorker --access-logfile - --error-logfile - --log-level info
pause
