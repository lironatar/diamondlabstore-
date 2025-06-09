#!/bin/bash

# DiamondLabStore Linux Setup Script (Public & Multi-App Ready)
# This script installs all dependencies and starts the server for public access

set -e  # Exit on any error

echo "🚀 DiamondLabStore Linux Setup Starting..."
echo "========================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Function to check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Get configuration from user
print_status "Configuration Setup"
echo "=================================="

# Get domain/subdomain for this app
read -p "Enter domain or subdomain for this app (e.g., diamond.yourdomain.com or localhost): " DOMAIN_NAME
if [ -z "$DOMAIN_NAME" ]; then
    DOMAIN_NAME="localhost"
    print_warning "Using localhost as default. App will only be accessible locally."
fi

# Get app port
read -p "Enter backend port for this app (default: 8000): " APP_PORT
if [ -z "$APP_PORT" ]; then
    APP_PORT="8000"
fi

# Get app path (for multiple apps on same domain)
read -p "Enter URL path for this app (e.g., /diamond for yourdomain.com/diamond, or leave empty for root): " APP_PATH

print_status "Configuration:"
print_status "Domain: $DOMAIN_NAME"
print_status "Backend Port: $APP_PORT"
print_status "URL Path: ${APP_PATH:-'/ (root)'}"
echo ""

# Check if running as root (not recommended)
if [ "$EUID" -eq 0 ]; then
    print_warning "Running as root is not recommended. Consider running as a regular user."
    read -p "Continue anyway? (y/N) " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
fi

# Update system packages and set English locale
print_status "Updating system packages and setting English locale..."
export DEBIAN_FRONTEND=noninteractive
export LANG=en_US.UTF-8
export LC_ALL=en_US.UTF-8

if command_exists apt-get; then
    sudo apt-get update
    sudo apt-get install -y curl wget git build-essential locales
    sudo locale-gen en_US.UTF-8
elif command_exists yum; then
    sudo yum update -y
    sudo yum install -y curl wget git gcc gcc-c++ make glibc-langpack-en
elif command_exists dnf; then
    sudo dnf update -y
    sudo dnf install -y curl wget git gcc gcc-c++ make glibc-langpack-en
else
    print_error "Unsupported package manager. Please install curl, wget, git, and build tools manually."
    exit 1
fi

# Set English locale
export LANG=en_US.UTF-8
export LC_ALL=en_US.UTF-8

# Install Python 3.9+ if not available
print_status "Checking Python installation..."
if command_exists python3; then
    PYTHON_VERSION=$(python3 -c 'import sys; print(".".join(map(str, sys.version_info[:2])))')
    print_status "Python $PYTHON_VERSION found"
    if python3 -c "import sys; exit(0 if sys.version_info >= (3, 9) else 1)" 2>/dev/null; then
        print_success "Python version is compatible"
    else
        print_error "Python 3.9+ is required. Please install a newer version."
        exit 1
    fi
else
    print_status "Installing Python 3..."
    if command_exists apt-get; then
        sudo apt-get install -y python3 python3-pip python3-venv
    elif command_exists yum; then
        sudo yum install -y python3 python3-pip
    elif command_exists dnf; then
        sudo dnf install -y python3 python3-pip
    fi
fi

# Install pip if not available
if ! command_exists pip3; then
    print_status "Installing pip..."
    curl https://bootstrap.pypa.io/get-pip.py -o get-pip.py
    python3 get-pip.py --user
    rm get-pip.py
fi

# Install Node.js 16+ if not available
print_status "Checking Node.js installation..."
if command_exists node; then
    NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
    if [ "$NODE_VERSION" -ge 16 ]; then
        print_success "Node.js $NODE_VERSION found"
    else
        print_warning "Node.js version is too old. Installing newer version..."
        INSTALL_NODE=true
    fi
else
    print_status "Node.js not found. Installing..."
    INSTALL_NODE=true
fi

if [ "$INSTALL_NODE" = true ]; then
    # Install Node.js using NodeSource repository
    curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash - 2>/dev/null || {
        # Fallback: download and install Node.js manually
        print_status "Using alternative Node.js installation method..."
        wget -qO- https://nodejs.org/dist/v18.17.0/node-v18.17.0-linux-x64.tar.xz | sudo tar -xJ -C /opt/
        sudo ln -sf /opt/node-v18.17.0-linux-x64/bin/node /usr/local/bin/node
        sudo ln -sf /opt/node-v18.17.0-linux-x64/bin/npm /usr/local/bin/npm
        sudo ln -sf /opt/node-v18.17.0-linux-x64/bin/npx /usr/local/bin/npx
    }
    
    if command_exists apt-get; then
        sudo apt-get install -y nodejs
    fi
fi

# Verify installations
print_status "Verifying installations..."
node --version || { print_error "Node.js installation failed"; exit 1; }
npm --version || { print_error "npm installation failed"; exit 1; }
python3 --version || { print_error "Python installation failed"; exit 1; }
pip3 --version || { print_error "pip installation failed"; exit 1; }

# Create project directory structure
print_status "Setting up project structure..."
mkdir -p backend/uploads backend/static/images
mkdir -p logs

# Create uploads .gitkeep file
touch backend/uploads/.gitkeep

# Setup Python virtual environment
print_status "Creating Python virtual environment..."
cd backend
if [ ! -d "venv" ]; then
    python3 -m venv venv
fi

# Activate virtual environment
source venv/bin/activate

# Upgrade pip in virtual environment
pip install --upgrade pip

# Install Python dependencies
print_status "Installing Python dependencies..."
if [ -f "../requirements.txt" ]; then
    pip install -r ../requirements.txt
else
    # Install common dependencies if requirements.txt doesn't exist
    pip install fastapi uvicorn sqlalchemy alembic python-multipart python-jose bcrypt passlib
fi

# Install additional dependencies for production
pip install gunicorn

# Create .env file if it doesn't exist
if [ ! -f ".env" ]; then
    print_status "Creating .env file..."
    cat > .env << EOL
DATABASE_URL=sqlite:///./diamond_store.db
SECRET_KEY=$(openssl rand -base64 32)
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
UPLOAD_FOLDER=./uploads
MAX_UPLOAD_SIZE=10485760
ALLOWED_EXTENSIONS=jpg,jpeg,png,gif,webp
CORS_ORIGINS=http://$DOMAIN_NAME,https://$DOMAIN_NAME
DEBUG=False
ENVIRONMENT=production
EOL
    print_success "Created .env file with secure SECRET_KEY"
fi

# Run database migrations
print_status "Setting up database..."
if [ -f "alembic.ini" ]; then
    LANG=en_US.UTF-8 alembic upgrade head
else
    # Create database tables if alembic is not set up
    LANG=en_US.UTF-8 python3 -c "
from database import engine
from models import Base
Base.metadata.create_all(bind=engine)
print('Database tables created successfully')
"
fi

# Create English-only admin user creation script
print_status "Creating English admin user setup script..."
cat > create_admin_english.py << 'EOF'
#!/usr/bin/env python3
"""
Script to create an admin user for the Diamond Lab Store (English version)
Usage: python create_admin_english.py
"""

import sys
import os
from sqlalchemy.orm import Session
from database import SessionLocal, engine
import models
from auth import get_password_hash

# Create tables if they don't exist
models.Base.metadata.create_all(bind=engine)

def create_admin_user():
    db = SessionLocal()
    try:
        # Check if admin already exists
        existing_admin = db.query(models.User).filter(models.User.is_admin == True).first()
        if existing_admin:
            print(f"Admin already exists in the system: {existing_admin.email}")
            choice = input("Do you want to create another admin? (y/N): ").lower()
            if choice != 'y':
                print("Admin creation cancelled.")
                return

        print("=== Creating Admin User ===")
        print()
        
        # Get admin details
        email = input("Admin email: ").strip()
        if not email:
            print("Error: Email is required")
            return
            
        # Check if email already exists
        existing_user = db.query(models.User).filter(models.User.email == email).first()
        if existing_user:
            print(f"Error: User with email {email} already exists")
            return
            
        username = input("Username: ").strip()
        if not username:
            print("Error: Username is required")
            return
            
        # Check if username already exists
        existing_username = db.query(models.User).filter(models.User.username == username).first()
        if existing_username:
            print(f"Error: Username {username} already exists")
            return
            
        full_name = input("Full name: ").strip()
        if not full_name:
            print("Error: Full name is required")
            return
            
        phone = input("Phone (optional): ").strip() or None
        
        # Get password
        import getpass
        password = getpass.getpass("Password: ")
        if len(password) < 6:
            print("Error: Password must be at least 6 characters long")
            return
            
        password_confirm = getpass.getpass("Confirm password: ")
        if password != password_confirm:
            print("Error: Passwords do not match")
            return
        
        # Create admin user
        hashed_password = get_password_hash(password)
        admin_user = models.User(
            email=email,
            username=username,
            full_name=full_name,
            phone=phone,
            hashed_password=hashed_password,
            is_admin=True,
            is_active=True
        )
        
        db.add(admin_user)
        db.commit()
        db.refresh(admin_user)
        
        print()
        print("✅ Admin user created successfully!")
        print(f"Email: {admin_user.email}")
        print(f"Username: {admin_user.username}")
        print(f"Full name: {admin_user.full_name}")
        print(f"ID: {admin_user.id}")
        print()
        print("You can now login to the admin panel")
        
    except Exception as e:
        print(f"Error creating admin: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    create_admin_user()
EOF

# Create admin user
print_status "Setting up admin user..."
LANG=en_US.UTF-8 python3 create_admin_english.py || print_warning "Admin user creation failed or already exists"

# Go back to root directory
cd ..

# Setup React frontend
print_status "Setting up React frontend..."
cd frontend

# Install Node.js dependencies
print_status "Installing Node.js dependencies..."
npm install

# Build React app for production
print_status "Building React application..."
npm run build

# Go back to root directory
cd ..

# Create systemd service file
print_status "Creating systemd service file..."
SERVICE_NAME="diamondlab-store-$APP_PORT"
SERVICE_FILE="/etc/systemd/system/$SERVICE_NAME.service"
sudo tee $SERVICE_FILE > /dev/null << EOL
[Unit]
Description=DiamondLab Store API (Port $APP_PORT)
After=network.target

[Service]
Type=simple
User=$USER
WorkingDirectory=$(pwd)/backend
Environment=PATH=$(pwd)/backend/venv/bin
Environment=LANG=en_US.UTF-8
Environment=LC_ALL=en_US.UTF-8
ExecStart=$(pwd)/backend/venv/bin/gunicorn main:app -w 4 -k uvicorn.workers.UvicornWorker -b 0.0.0.0:$APP_PORT
Restart=always
RestartSec=10

[Install]
WantedBy=multi-user.target
EOL

# Reload systemd
sudo systemctl daemon-reload

# Create nginx configuration
print_status "Creating nginx configuration..."
NGINX_CONF="/etc/nginx/sites-available/diamondlab-store-$APP_PORT"

if [ -z "$APP_PATH" ]; then
    # Root domain configuration
    sudo tee $NGINX_CONF > /dev/null << EOL
server {
    listen 80;
    server_name $DOMAIN_NAME;
    client_max_body_size 10M;

    # React frontend
    location / {
        root $(pwd)/frontend/build;
        index index.html index.htm;
        try_files \$uri \$uri/ /index.html;
    }

    # API backend
    location /api/ {
        proxy_pass http://127.0.0.1:$APP_PORT/;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
    }

    # Static files
    location /static/ {
        alias $(pwd)/backend/static/;
    }

    # Uploads
    location /uploads/ {
        alias $(pwd)/backend/uploads/;
    }
}
EOL
else
    # Subdirectory configuration
    sudo tee $NGINX_CONF > /dev/null << EOL
# Configuration for $DOMAIN_NAME$APP_PATH
server {
    listen 80;
    server_name $DOMAIN_NAME;
    client_max_body_size 10M;

    # React frontend for this app
    location $APP_PATH {
        alias $(pwd)/frontend/build;
        index index.html index.htm;
        try_files \$uri \$uri/ $APP_PATH/index.html;
    }

    # API backend for this app
    location $APP_PATH/api/ {
        rewrite ^$APP_PATH/api/(.*) /\$1 break;
        proxy_pass http://127.0.0.1:$APP_PORT/;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
    }

    # Static files for this app
    location $APP_PATH/static/ {
        alias $(pwd)/backend/static/;
    }

    # Uploads for this app
    location $APP_PATH/uploads/ {
        alias $(pwd)/backend/uploads/;
    }
}
EOL
fi

# Install and configure nginx if not installed
if ! command_exists nginx; then
    print_status "Installing nginx..."
    if command_exists apt-get; then
        sudo apt-get install -y nginx
    elif command_exists yum; then
        sudo yum install -y nginx
    elif command_exists dnf; then
        sudo dnf install -y nginx
    fi
fi

# Enable nginx site
sudo ln -sf $NGINX_CONF /etc/nginx/sites-enabled/

# Test nginx configuration
sudo nginx -t

# Configure firewall for public access
print_status "Configuring firewall for public access..."
if command_exists ufw; then
    sudo ufw allow 22/tcp
    sudo ufw allow 80/tcp
    sudo ufw allow 443/tcp
    echo "y" | sudo ufw enable 2>/dev/null || true
elif command_exists firewall-cmd; then
    sudo firewall-cmd --permanent --add-service=http
    sudo firewall-cmd --permanent --add-service=https
    sudo firewall-cmd --permanent --add-service=ssh
    sudo firewall-cmd --reload
fi

# Create startup script
print_status "Creating startup script..."
cat > start-server.sh << EOL
#!/bin/bash

echo "🚀 Starting DiamondLab Store..."

# Start the backend service
sudo systemctl start $SERVICE_NAME
sudo systemctl enable $SERVICE_NAME

# Start nginx
sudo systemctl start nginx
sudo systemctl enable nginx

echo "✅ DiamondLab Store is running!"
if [ -z "$APP_PATH" ]; then
    echo "Frontend: http://$DOMAIN_NAME"
    echo "API: http://$DOMAIN_NAME/api"
else
    echo "Frontend: http://$DOMAIN_NAME$APP_PATH"
    echo "API: http://$DOMAIN_NAME$APP_PATH/api"
fi
echo ""
echo "To stop the server:"
echo "sudo systemctl stop $SERVICE_NAME"
echo "sudo systemctl stop nginx"
echo ""
echo "To view logs:"
echo "sudo journalctl -u $SERVICE_NAME -f"
EOL

chmod +x start-server.sh

# Create stop script
cat > stop-server.sh << EOL
#!/bin/bash

echo "🛑 Stopping DiamondLab Store..."

# Stop services
sudo systemctl stop $SERVICE_NAME
sudo systemctl stop nginx

echo "✅ DiamondLab Store stopped."
EOL

chmod +x stop-server.sh

# Make final adjustments
print_status "Final setup adjustments..."

# Set proper permissions
chmod -R 755 backend/uploads
chmod -R 755 backend/static
chmod -R 755 frontend/build

# Create log directory
sudo mkdir -p /var/log/diamondlab-store
sudo chown $USER:$USER /var/log/diamondlab-store

print_success "🎉 Setup completed successfully!"
echo ""
echo "========================================="
echo "🚀 DiamondLab Store Setup Complete!"
echo "========================================="
echo ""
echo "Configuration:"
echo "  Domain: $DOMAIN_NAME"
echo "  Backend Port: $APP_PORT"
echo "  URL Path: ${APP_PATH:-'/ (root)'}"
echo ""
echo "To start the server:"
echo "  ./start-server.sh"
echo ""
echo "To stop the server:"
echo "  ./stop-server.sh"
echo ""
echo "Access the application:"
if [ -z "$APP_PATH" ]; then
    echo "  Frontend: http://$DOMAIN_NAME"
    echo "  API: http://$DOMAIN_NAME/api"
else
    echo "  Frontend: http://$DOMAIN_NAME$APP_PATH"
    echo "  API: http://$DOMAIN_NAME$APP_PATH/api"
fi
echo ""
echo "View logs:"
echo "  sudo journalctl -u $SERVICE_NAME -f"
echo ""
echo "Service management:"
echo "  sudo systemctl status $SERVICE_NAME"
echo "  sudo systemctl restart $SERVICE_NAME"
echo ""
if [ "$DOMAIN_NAME" != "localhost" ]; then
    print_warning "⚠️  For HTTPS, install SSL certificate using certbot:"
    print_warning "   sudo apt install certbot python3-certbot-nginx"
    print_warning "   sudo certbot --nginx -d $DOMAIN_NAME"
fi
echo "" 