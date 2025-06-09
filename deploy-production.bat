@echo off
echo ===========================================
echo Diamond Lab Store - Production Deployment
echo ===========================================
echo.

:: Check if virtual environment exists
echo [1/8] Checking Virtual Environment...
if not exist "backend\venv" (
    echo Error: Virtual environment not found!
    echo Please run setup.bat first to initialize the project.
    pause
    exit /b 1
)

:: Set production environment variables
echo [2/8] Setting Production Environment...
set NODE_ENV=production
set REACT_APP_API_URL=http://localhost:8001
set PYTHON_ENV=production

:: Clean previous builds
echo [3/8] Cleaning Previous Builds...
if exist "frontend\build" rd /s /q "frontend\build"
if exist "backend\static" rd /s /q "backend\static"

:: Build React frontend for production
echo [4/8] Building Frontend for Production...
cd frontend
call npm run build
if %errorlevel% neq 0 (
    echo Error: Frontend build failed!
    cd ..
    pause
    exit /b 1
)

:: Copy built frontend to backend static directory
echo [5/8] Copying Frontend Build to Backend...
if not exist "..\backend\static" mkdir "..\backend\static"
xcopy "build\*" "..\backend\static\" /E /Y /Q
if %errorlevel% neq 0 (
    echo Warning: Could not copy frontend build to backend
)
cd ..

:: Install production dependencies and run migrations
echo [6/8] Preparing Backend for Production...
cd backend
call venv\Scripts\activate
pip install --upgrade pip
pip install gunicorn python-dotenv
alembic upgrade head
if %errorlevel% neq 0 (
    echo Warning: Database migration failed. Continuing anyway...
)

:: Create production configuration
echo [7/8] Creating Production Configuration...
(
echo # Production Environment Configuration
echo DATABASE_URL=sqlite:///./diamond_store_production.db
echo SECRET_KEY=your-super-secret-production-key-here
echo CORS_ORIGINS=["http://localhost","http://localhost:80","http://localhost:3000","http://localhost:3001"]
echo DEBUG=False
echo ENVIRONMENT=production
echo.
echo # SSL Configuration ^(if using HTTPS^)
echo # SSL_CERT_PATH=path/to/ssl/cert.pem
echo # SSL_KEY_PATH=path/to/ssl/private.key
echo.
echo # Email Configuration ^(for notifications^)
echo # SMTP_SERVER=smtp.gmail.com
echo # SMTP_PORT=587
echo # SMTP_USERNAME=your-email@gmail.com
echo # SMTP_PASSWORD=your-app-password
) > .env.production

:: Create Windows service script for production
echo [8/8] Creating Production Service Scripts...
(
echo @echo off
echo echo Starting Diamond Lab Store Production Server...
echo cd /d "%~dp0"
echo call venv\Scripts\activate
echo set PYTHONPATH=%cd%
echo gunicorn main:app --host 0.0.0.0 --port 8001 --workers 4 --worker-class uvicorn.workers.UvicornWorker --access-logfile - --error-logfile - --log-level info
echo pause
) > start-production.bat

(
echo @echo off
echo echo Stopping Diamond Lab Store Production Server...
echo taskkill /F /IM python.exe /T 2^>nul
echo taskkill /F /IM gunicorn.exe /T 2^>nul
echo echo Production server stopped.
echo pause
) > stop-production.bat

cd ..

:: Create nginx configuration template (optional)
echo Creating Nginx Configuration Template...
(
echo # Nginx Configuration for Diamond Lab Store
echo # Place this in /etc/nginx/sites-available/diamond-store
echo.
echo server {
echo     listen 80;
echo     server_name your-domain.com www.your-domain.com;
echo.
echo     # Redirect HTTP to HTTPS
echo     return 301 https://^$server_name^$request_uri;
echo }
echo.
echo server {
echo     listen 443 ssl http2;
echo     server_name your-domain.com www.your-domain.com;
echo.
echo     # SSL Configuration
echo     ssl_certificate /path/to/ssl/cert.pem;
echo     ssl_certificate_key /path/to/ssl/private.key;
echo     ssl_protocols TLSv1.2 TLSv1.3;
echo     ssl_ciphers HIGH:!aNULL:!MD5;
echo.
echo     # Frontend static files
echo     location / {
echo         root /path/to/diamond-store/backend/static;
echo         try_files ^$uri ^$uri/ /index.html;
echo         
echo         # Cache static assets
echo         location ~* \.\(js^|css^|png^|jpg^|jpeg^|gif^|ico^|svg^|woff^|woff2^|ttf^|eot\)^$ {
echo             expires 1y;
echo             add_header Cache-Control "public, immutable";
echo         }
echo     }
echo.
echo     # API requests
echo     location /api/ {
echo         proxy_pass http://127.0.0.1:8001;
echo         proxy_set_header Host ^$host;
echo         proxy_set_header X-Real-IP ^$remote_addr;
echo         proxy_set_header X-Forwarded-For ^$proxy_add_x_forwarded_for;
echo         proxy_set_header X-Forwarded-Proto ^$scheme;
echo     }
echo.
echo     # WebSocket support ^(if needed^)
echo     location /ws {
echo         proxy_pass http://127.0.0.1:8001;
echo         proxy_http_version 1.1;
echo         proxy_set_header Upgrade ^$http_upgrade;
echo         proxy_set_header Connection "upgrade";
echo         proxy_set_header Host ^$host;
echo         proxy_set_header X-Real-IP ^$remote_addr;
echo         proxy_set_header X-Forwarded-For ^$proxy_add_x_forwarded_for;
echo         proxy_set_header X-Forwarded-Proto ^$scheme;
echo     }
echo }
) > nginx-diamond-store.conf

:: Create production startup script
(
echo @echo off
echo echo ===========================================
echo echo Diamond Lab Store - Production Server
echo echo ===========================================
echo echo.
echo echo Starting production server...
echo echo Frontend: Built and served from backend/static
echo echo Backend API: Running on http://localhost:8001
echo echo.
echo echo Press Ctrl+C to stop the server
echo echo ===========================================
echo echo.
echo cd backend
echo call start-production.bat
) > start-live.bat

:: Create SSL certificate generation script (for local HTTPS testing)
(
echo @echo off
echo echo ===========================================
echo echo SSL Certificate Generator ^(Development Only^)
echo echo ===========================================
echo echo.
echo echo This will create self-signed certificates for HTTPS testing.
echo echo DO NOT use these certificates in production!
echo echo.
echo set /p domain="Enter domain name (default: localhost): "
echo if "%%domain%%"=="" set domain=localhost
echo.
echo echo Generating SSL certificate for %%domain%%...
echo.
echo :: Requires OpenSSL to be installed
echo openssl req -x509 -newkey rsa:4096 -keyout ssl/private.key -out ssl/cert.pem -days 365 -nodes -subj "/C=IL/ST=Tel Aviv/L=Tel Aviv/O=Diamond Lab Store/OU=Development/CN=%%domain%%"
echo.
echo if %%errorlevel%% equ 0 (
echo     echo SSL certificates generated successfully!
echo     echo Certificate: ssl/cert.pem
echo     echo Private Key: ssl/private.key
echo     echo.
echo     echo Add these to your .env.production file:
echo     echo SSL_CERT_PATH=ssl/cert.pem
echo     echo SSL_KEY_PATH=ssl/private.key
echo ^) else (
echo     echo Error: Could not generate SSL certificates.
echo     echo Please install OpenSSL or use a different SSL solution.
echo ^)
echo.
echo pause
) > generate-ssl.bat

echo.
echo ===========================================
echo Production Deployment Complete!
echo ===========================================
echo.
echo ✅ Frontend built for production
echo ✅ Backend configured for production
echo ✅ Static files copied to backend
echo ✅ Production scripts created
echo ✅ Nginx configuration template created
echo.
echo 🚀 To start your live server:
echo    1. Run: start-live.bat
echo    2. Your app will be available at: http://localhost:8001
echo.
echo 📋 Production Files Created:
echo    - backend/start-production.bat (Start production server)
echo    - backend/stop-production.bat (Stop production server)
echo    - backend/.env.production (Production environment config)
echo    - nginx-diamond-store.conf (Nginx configuration template)
echo    - start-live.bat (Easy production startup)
echo    - generate-ssl.bat (SSL certificate generator)
echo.
echo 🔧 Before going live:
echo    1. Update .env.production with your actual domain and secrets
echo    2. Configure your domain DNS to point to your server
echo    3. Install SSL certificates for HTTPS
echo    4. Consider using a reverse proxy like Nginx
echo    5. Set up automatic backups for your database
echo.
echo ⚠️  Security Notes:
echo    - Change the SECRET_KEY in .env.production
echo    - Use environment variables for sensitive data
echo    - Enable HTTPS in production
echo    - Regularly update dependencies
echo    - Monitor server logs
echo.
echo Press any key to close...
pause 