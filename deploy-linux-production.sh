#!/bin/bash

# Diamond Lab Store - Complete Linux Production Deployment Script
# This script will set up everything needed to run the store on a Linux server

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
APP_NAME="diamond-store"
APP_USER="diamond"
APP_DIR="/opt/diamond-store"
SERVICE_NAME="diamond-store"
DOMAIN="your-domain.com"  # Change this to your domain
PORT="8001"

echo -e "${BLUE}======================================="
echo "Diamond Lab Store - Linux Production Setup"
echo "=======================================${NC}"
echo
echo "This script will:"
echo "✅ Install all required dependencies"
echo "✅ Set up Python virtual environment"
echo "✅ Install Node.js and npm packages"
echo "✅ Set up SQLite database with sample data"
echo "✅ Build React frontend for production"
echo "✅ Configure systemd service"
echo "✅ Set up Nginx reverse proxy"
echo "✅ Configure SSL with Let's Encrypt (optional)"
echo

# Check if running as root
if [[ $EUID -eq 0 ]]; then
   echo -e "${RED}❌ This script should not be run as root!${NC}"
   echo "Please run as a regular user with sudo privileges."
   exit 1
fi

# Function to print status
print_status() {
    echo -e "${GREEN}[$(date +'%H:%M:%S')] $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

# Function to check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Detect Linux distribution
detect_os() {
    if [ -f /etc/os-release ]; then
        . /etc/os-release
        OS=$NAME
        VER=$VERSION_ID
    else
        print_error "Cannot detect Linux distribution"
        exit 1
    fi
    print_status "Detected OS: $OS $VER"
}

# Update system packages
update_system() {
    print_status "Updating system packages..."
    
    if command_exists apt; then
        sudo apt update && sudo apt upgrade -y
        sudo apt install -y curl wget git build-essential software-properties-common
    elif command_exists yum; then
        sudo yum update -y
        sudo yum install -y curl wget git gcc gcc-c++ make
    elif command_exists pacman; then
        sudo pacman -Sy --noconfirm
        sudo pacman -S --noconfirm curl wget git base-devel
    else
        print_error "Unsupported package manager"
        exit 1
    fi
}

# Install Python 3.9+
install_python() {
    print_status "Installing Python 3.9+..."
    
    if command_exists python3.9; then
        print_status "Python 3.9+ already installed"
        return
    fi
    
    if command_exists apt; then
        sudo apt install -y python3.9 python3.9-venv python3.9-dev python3-pip
    elif command_exists yum; then
        sudo yum install -y python39 python39-devel python39-pip
    else
        # Install from source if needed
        print_warning "Installing Python from source..."
        wget https://www.python.org/ftp/python/3.9.18/Python-3.9.18.tgz
        tar xzf Python-3.9.18.tgz
        cd Python-3.9.18
        ./configure --enable-optimizations
        make -j 8
        sudo make altinstall
        cd ..
        rm -rf Python-3.9.18*
    fi
    
    # Set python3 alias
    if ! command_exists python3; then
        sudo ln -sf /usr/bin/python3.9 /usr/bin/python3
    fi
}

# Install Node.js 18+
install_nodejs() {
    print_status "Installing Node.js 18+..."
    
    if command_exists node && [[ $(node -v | cut -d'v' -f2 | cut -d'.' -f1) -ge 18 ]]; then
        print_status "Node.js 18+ already installed"
        return
    fi
    
    # Install Node.js using NodeSource repository
    curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
    if command_exists apt; then
        sudo apt-get install -y nodejs
    elif command_exists yum; then
        sudo yum install -y nodejs npm
    fi
    
    # Verify installation
    node_version=$(node -v)
    npm_version=$(npm -v)
    print_status "Node.js $node_version and npm $npm_version installed"
}

# Install Nginx
install_nginx() {
    print_status "Installing Nginx..."
    
    if command_exists nginx; then
        print_status "Nginx already installed"
        return
    fi
    
    if command_exists apt; then
        sudo apt install -y nginx
    elif command_exists yum; then
        sudo yum install -y nginx
    fi
    
    sudo systemctl enable nginx
    sudo systemctl start nginx
}

# Create application user
create_app_user() {
    print_status "Creating application user: $APP_USER..."
    
    if id "$APP_USER" &>/dev/null; then
        print_status "User $APP_USER already exists"
    else
        sudo useradd -r -s /bin/false -d $APP_DIR $APP_USER
    fi
}

# Set up application directory
setup_app_directory() {
    print_status "Setting up application directory: $APP_DIR..."
    
    # Create directory structure
    sudo mkdir -p $APP_DIR
    sudo mkdir -p $APP_DIR/logs
    sudo mkdir -p $APP_DIR/ssl
    
    # Copy application files
    print_status "Copying application files..."
    sudo cp -r . $APP_DIR/source/
    
    # Set permissions
    sudo chown -R $APP_USER:$APP_USER $APP_DIR
    sudo chmod -R 755 $APP_DIR
}

# Set up Python backend
setup_python_backend() {
    print_status "Setting up Python backend..."
    
    cd $APP_DIR/source/backend
    
    # Create virtual environment
    sudo -u $APP_USER python3 -m venv venv
    
    # Activate virtual environment and install requirements
    sudo -u $APP_USER bash -c "
        source venv/bin/activate
        pip install --upgrade pip
        pip install -r ../requirements.txt
        pip install gunicorn uvicorn[standard]
    "
    
    # Create production environment file
    sudo -u $APP_USER cat > .env.production << EOF
# Production Environment Configuration
DATABASE_URL=sqlite:///$APP_DIR/data/diamond_store_production.db
SECRET_KEY=$(openssl rand -hex 32)
CORS_ORIGINS=["https://$DOMAIN","https://www.$DOMAIN","http://localhost:3001"]
DEBUG=False
ENVIRONMENT=production

# File Upload
MAX_FILE_SIZE=5242880
ALLOWED_FILE_TYPES=image/jpeg,image/png,image/gif,image/webp
UPLOAD_DIR=$APP_DIR/uploads

# Security
ACCESS_TOKEN_EXPIRE_MINUTES=60
ALGORITHM=HS256
EOF

    # Create uploads directory
    sudo mkdir -p $APP_DIR/uploads
    sudo mkdir -p $APP_DIR/data
    sudo chown -R $APP_USER:$APP_USER $APP_DIR/uploads
    sudo chown -R $APP_USER:$APP_USER $APP_DIR/data
    
    # Set up database
    print_status "Setting up database..."
    sudo -u $APP_USER bash -c "
        source venv/bin/activate
        export DATABASE_URL=sqlite:///$APP_DIR/data/diamond_store_production.db
        alembic upgrade head
        python add_dummy_jewelry.py
    "
    
    print_status "Creating admin user..."
    sudo -u $APP_USER bash -c "
        source venv/bin/activate
        export DATABASE_URL=sqlite:///$APP_DIR/data/diamond_store_production.db
        python create_simple_admin.py
    "
}

# Set up React frontend
setup_react_frontend() {
    print_status "Setting up React frontend..."
    
    cd $APP_DIR/source/frontend
    
    # Install npm dependencies
    sudo -u $APP_USER npm install
    
    # Build for production
    print_status "Building React app for production..."
    sudo -u $APP_USER bash -c "
        export REACT_APP_API_URL=https://$DOMAIN/api
        npm run build
    "
    
    # Copy build to backend static directory
    sudo -u $APP_USER mkdir -p ../backend/static
    sudo -u $APP_USER cp -r build/* ../backend/static/
}

# Create systemd service
create_systemd_service() {
    print_status "Creating systemd service..."
    
    sudo cat > /etc/systemd/system/$SERVICE_NAME.service << EOF
[Unit]
Description=Diamond Lab Store Production Server
After=network.target

[Service]
Type=exec
User=$APP_USER
Group=$APP_USER
WorkingDirectory=$APP_DIR/source/backend
Environment=PATH=$APP_DIR/source/backend/venv/bin
Environment=DATABASE_URL=sqlite:///$APP_DIR/data/diamond_store_production.db
EnvironmentFile=$APP_DIR/source/backend/.env.production
ExecStart=$APP_DIR/source/backend/venv/bin/gunicorn main:app --bind 127.0.0.1:$PORT --workers 4 --worker-class uvicorn.workers.UvicornWorker --access-logfile $APP_DIR/logs/access.log --error-logfile $APP_DIR/logs/error.log --log-level info
ExecReload=/bin/kill -s HUP \$MAINPID
Restart=always
RestartSec=3

[Install]
WantedBy=multi-user.target
EOF

    # Enable and start service
    sudo systemctl daemon-reload
    sudo systemctl enable $SERVICE_NAME
    sudo systemctl start $SERVICE_NAME
    
    print_status "Service $SERVICE_NAME created and started"
}

# Configure Nginx
configure_nginx() {
    print_status "Configuring Nginx..."
    
    sudo cat > /etc/nginx/sites-available/$APP_NAME << EOF
server {
    listen 80;
    server_name $DOMAIN www.$DOMAIN;
    
    # Redirect to HTTPS
    return 301 https://\$server_name\$request_uri;
}

server {
    listen 443 ssl http2;
    server_name $DOMAIN www.$DOMAIN;
    
    # SSL Configuration (will be configured by certbot)
    ssl_certificate /etc/letsencrypt/live/$DOMAIN/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/$DOMAIN/privkey.pem;
    include /etc/letsencrypt/options-ssl-nginx.conf;
    ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem;
    
    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header Referrer-Policy "no-referrer-when-downgrade" always;
    add_header Content-Security-Policy "default-src 'self' http: https: data: blob: 'unsafe-inline'" always;
    
    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_proxied expired no-cache no-store private must-revalidate;
    gzip_types text/plain text/css text/xml text/javascript application/x-javascript application/xml+rss application/javascript;
    
    # Frontend static files
    location / {
        root $APP_DIR/source/backend/static;
        try_files \$uri \$uri/ /index.html;
        
        # Cache static assets
        location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
            expires 1y;
            add_header Cache-Control "public, immutable";
        }
    }
    
    # API requests
    location /api/ {
        proxy_pass http://127.0.0.1:$PORT;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_read_timeout 300;
        proxy_connect_timeout 300;
        proxy_send_timeout 300;
    }
    
    # Uploads
    location /uploads/ {
        alias $APP_DIR/uploads/;
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
    
    # Admin panel
    location /admin {
        root $APP_DIR/source/backend/static;
        try_files \$uri \$uri/ /index.html;
    }
}
EOF

    # Enable site
    sudo ln -sf /etc/nginx/sites-available/$APP_NAME /etc/nginx/sites-enabled/
    
    # Remove default site
    sudo rm -f /etc/nginx/sites-enabled/default
    
    # Test nginx configuration
    sudo nginx -t
    
    # Reload nginx
    sudo systemctl reload nginx
}

# Install SSL certificate
install_ssl() {
    print_status "Installing SSL certificate..."
    
    # Install certbot
    if command_exists apt; then
        sudo apt install -y certbot python3-certbot-nginx
    elif command_exists yum; then
        sudo yum install -y certbot python3-certbot-nginx
    fi
    
    # Get SSL certificate
    print_warning "About to request SSL certificate for $DOMAIN"
    print_warning "Make sure your domain points to this server's IP address!"
    read -p "Continue? (y/N): " -n 1 -r
    echo
    
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        sudo certbot --nginx -d $DOMAIN -d www.$DOMAIN --non-interactive --agree-tos --email admin@$DOMAIN
        
        # Set up auto-renewal
        (crontab -l 2>/dev/null; echo "0 12 * * * /usr/bin/certbot renew --quiet") | crontab -
        
        print_status "SSL certificate installed and auto-renewal configured"
    else
        print_warning "Skipping SSL installation. You can run 'sudo certbot --nginx' later."
    fi
}

# Create management scripts
create_management_scripts() {
    print_status "Creating management scripts..."
    
    # Start script
    sudo cat > $APP_DIR/start.sh << 'EOF'
#!/bin/bash
sudo systemctl start diamond-store
sudo systemctl start nginx
echo "Diamond Lab Store started"
EOF
    
    # Stop script
    sudo cat > $APP_DIR/stop.sh << 'EOF'
#!/bin/bash
sudo systemctl stop diamond-store
echo "Diamond Lab Store stopped"
EOF
    
    # Restart script
    sudo cat > $APP_DIR/restart.sh << 'EOF'
#!/bin/bash
sudo systemctl restart diamond-store
sudo systemctl reload nginx
echo "Diamond Lab Store restarted"
EOF
    
    # Status script
    sudo cat > $APP_DIR/status.sh << 'EOF'
#!/bin/bash
echo "=== Diamond Lab Store Status ==="
echo
echo "Application Service:"
sudo systemctl status diamond-store --no-pager
echo
echo "Nginx Service:"
sudo systemctl status nginx --no-pager
echo
echo "Recent Logs:"
sudo tail -20 /opt/diamond-store/logs/error.log
EOF
    
    # Update script
    sudo cat > $APP_DIR/update.sh << 'EOF'
#!/bin/bash
cd /opt/diamond-store/source
git pull
cd backend
source venv/bin/activate
pip install -r ../requirements.txt
alembic upgrade head
cd ../frontend
npm install
npm run build
sudo cp -r build/* ../backend/static/
sudo systemctl restart diamond-store
sudo systemctl reload nginx
echo "Diamond Lab Store updated"
EOF
    
    # Make scripts executable
    sudo chmod +x $APP_DIR/*.sh
    sudo chown $APP_USER:$APP_USER $APP_DIR/*.sh
}

# Configure firewall
configure_firewall() {
    print_status "Configuring firewall..."
    
    if command_exists ufw; then
        sudo ufw allow ssh
        sudo ufw allow 'Nginx Full'
        sudo ufw --force enable
        print_status "UFW firewall configured"
    elif command_exists firewall-cmd; then
        sudo firewall-cmd --permanent --add-service=ssh
        sudo firewall-cmd --permanent --add-service=http
        sudo firewall-cmd --permanent --add-service=https
        sudo firewall-cmd --reload
        print_status "Firewalld configured"
    fi
}

# Main installation function
main() {
    print_status "Starting Diamond Lab Store production installation..."
    
    # Get domain from user
    echo
    read -p "Enter your domain name (e.g., yourdomain.com): " user_domain
    if [[ -n "$user_domain" ]]; then
        DOMAIN="$user_domain"
    fi
    
    echo
    print_status "Installing for domain: $DOMAIN"
    sleep 2
    
    # Run installation steps
    detect_os
    update_system
    install_python
    install_nodejs
    install_nginx
    create_app_user
    setup_app_directory
    setup_python_backend
    setup_react_frontend
    create_systemd_service
    configure_nginx
    create_management_scripts
    configure_firewall
    
    # Optional SSL installation
    echo
    read -p "Install SSL certificate with Let's Encrypt? (y/N): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        install_ssl
    fi
    
    # Final status
    echo
    echo -e "${GREEN}======================================="
    echo "🎉 Diamond Lab Store Installation Complete!"
    echo "=======================================${NC}"
    echo
    echo "✅ Application installed at: $APP_DIR"
    echo "✅ Service name: $SERVICE_NAME"
    echo "✅ Database: $APP_DIR/data/diamond_store_production.db"
    echo "✅ Logs: $APP_DIR/logs/"
    echo
    echo "🌐 Your store is available at:"
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        echo "   https://$DOMAIN"
        echo "   https://www.$DOMAIN"
    else
        echo "   http://$DOMAIN"
        echo "   (SSL not configured - use HTTPS for production!)"
    fi
    echo
    echo "🔧 Management commands:"
    echo "   Start:   $APP_DIR/start.sh"
    echo "   Stop:    $APP_DIR/stop.sh"
    echo "   Restart: $APP_DIR/restart.sh"
    echo "   Status:  $APP_DIR/status.sh"
    echo "   Update:  $APP_DIR/update.sh"
    echo
    echo "📊 Service status:"
    sudo systemctl status $SERVICE_NAME --no-pager -l
    echo
    echo "🎯 Next steps:"
    echo "1. Update your domain's DNS to point to this server"
    echo "2. Test your store at https://$DOMAIN"
    echo "3. Login to admin panel at https://$DOMAIN/admin"
    echo "4. Customize your products and categories"
    echo
    print_status "Installation completed successfully!"
}

# Run main function
main "$@" 