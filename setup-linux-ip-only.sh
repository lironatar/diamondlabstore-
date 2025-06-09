#!/bin/bash

# DiamondLabStore Linux Setup Script (IP-Only Public Access)
# This script sets up the app for public access using just server IP and port

set -e  # Exit on any error

echo "🚀 DiamondLabStore Linux Setup (IP-Only Access) Starting..."
echo "============================================================"

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

# Get server IP
SERVER_IP=$(curl -s ifconfig.me 2>/dev/null || curl -s ipinfo.io/ip 2>/dev/null || echo "Unable to detect")
print_status "Detected server public IP: $SERVER_IP"

read -p "Confirm your server's public IP address [$SERVER_IP]: " INPUT_IP
if [ ! -z "$INPUT_IP" ]; then
    SERVER_IP="$INPUT_IP"
fi

# Get app port
read -p "Enter port for public access (default: 8000): " APP_PORT
if [ -z "$APP_PORT" ]; then
    APP_PORT="8000"
fi

# Validate port range
if ! [[ "$APP_PORT" =~ ^[0-9]+$ ]] || [ "$APP_PORT" -lt 1024 ] || [ "$APP_PORT" -gt 65535 ]; then
    print_warning "Invalid port. Using default port 8000."
    APP_PORT="8000"
fi

# Check if port is available
if netstat -tuln 2>/dev/null | grep -q ":$APP_PORT "; then
    print_warning "Port $APP_PORT is already in use!"
    read -p "Continue anyway? (y/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
fi

print_status "Configuration:"
print_status "Server IP: $SERVER_IP"
print_status "Public Port: $APP_PORT"
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
    sudo apt-get install -y curl wget git build-essential locales net-tools
    sudo locale-gen en_US.UTF-8
elif command_exists yum; then
    sudo yum update -y
    sudo yum install -y curl wget git gcc gcc-c++ make glibc-langpack-en net-tools
elif command_exists dnf; then
    sudo dnf update -y
    sudo dnf install -y curl wget git gcc gcc-c++ make glibc-langpack-en net-tools
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
CORS_ORIGINS=http://$SERVER_IP:$APP_PORT,http://localhost:$APP_PORT
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
Description=DiamondLab Store API (IP Access - Port $APP_PORT)
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

# Configure firewall for public access
print_status "Configuring firewall for public access..."
if command_exists ufw; then
    sudo ufw allow 22/tcp
    sudo ufw allow $APP_PORT/tcp
    echo "y" | sudo ufw enable 2>/dev/null || true
    print_success "UFW firewall configured: SSH (22) and App ($APP_PORT) ports opened"
elif command_exists firewall-cmd; then
    sudo firewall-cmd --permanent --add-service=ssh
    sudo firewall-cmd --permanent --add-port=$APP_PORT/tcp
    sudo firewall-cmd --reload
    print_success "FirewallD configured: SSH and App ($APP_PORT) ports opened"
else
    print_warning "No firewall detected. Manual firewall configuration may be needed."
fi

# Create nginx configuration (optional, for future domain setup)
print_status "Creating optional nginx configuration (for future domain setup)..."
NGINX_CONF="/etc/nginx/sites-available/diamondlab-store-ip"

# Install nginx (but don't enable it for IP-only setup)
if ! command_exists nginx; then
    print_status "Installing nginx (for future use)..."
    if command_exists apt-get; then
        sudo apt-get install -y nginx
    elif command_exists yum; then
        sudo yum install -y nginx
    elif command_exists dnf; then
        sudo dnf install -y nginx
    fi
fi

# Create nginx config but don't enable it
if command_exists nginx; then
    sudo tee $NGINX_CONF > /dev/null << EOL
# Optional nginx configuration for DiamondLab Store
# To enable: sudo ln -sf $NGINX_CONF /etc/nginx/sites-enabled/
# Then: sudo systemctl restart nginx

server {
    listen 80 default_server;
    server_name _;
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
    print_status "Nginx config created at $NGINX_CONF (not enabled)"
fi

# Create startup script
print_status "Creating startup script..."
cat > start-server.sh << EOL
#!/bin/bash

echo "🚀 Starting DiamondLab Store (IP Access)..."

# Start the backend service
sudo systemctl start $SERVICE_NAME
sudo systemctl enable $SERVICE_NAME

echo "✅ DiamondLab Store is running!"
echo "Access your application at:"
echo "  🌐 Full App: http://$SERVER_IP:$APP_PORT"
echo "  👤 Admin Panel: http://$SERVER_IP:$APP_PORT/admin"
echo "  📊 API Docs: http://$SERVER_IP:$APP_PORT/docs"
echo ""
echo "To stop the server:"
echo "  sudo systemctl stop $SERVICE_NAME"
echo ""
echo "To view logs:"
echo "  sudo journalctl -u $SERVICE_NAME -f"
EOL

chmod +x start-server.sh

# Create stop script
cat > stop-server.sh << EOL
#!/bin/bash

echo "🛑 Stopping DiamondLab Store..."

# Stop service
sudo systemctl stop $SERVICE_NAME

echo "✅ DiamondLab Store stopped."
EOL

chmod +x stop-server.sh

# Create nginx enable script (for future use)
cat > enable-nginx.sh << EOL
#!/bin/bash

echo "🌐 Enabling nginx for port 80 access..."

# Enable nginx site
sudo ln -sf $NGINX_CONF /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default

# Test and start nginx
sudo nginx -t
sudo systemctl start nginx
sudo systemctl enable nginx

# Open port 80 in firewall
if command -v ufw >/dev/null 2>&1; then
    sudo ufw allow 80/tcp
elif command -v firewall-cmd >/dev/null 2>&1; then
    sudo firewall-cmd --permanent --add-service=http
    sudo firewall-cmd --reload
fi

echo "✅ Nginx enabled!"
echo "Your app is now accessible at:"
echo "  http://$SERVER_IP (port 80)"
echo "  http://$SERVER_IP:$APP_PORT (direct backend)"
EOL

chmod +x enable-nginx.sh

# Make final adjustments
print_status "Final setup adjustments..."

# Set proper permissions
chmod -R 755 backend/uploads
chmod -R 755 backend/static
chmod -R 755 frontend/build

# Create log directory
sudo mkdir -p /var/log/diamondlab-store
sudo chown $USER:$USER /var/log/diamondlab-store

print_success "🎉 IP-Only setup completed successfully!"
echo ""
echo "================================================================"
echo "🚀 DiamondLab Store Setup Complete (IP-Only Access)!"
echo "================================================================"
echo ""
echo "Configuration:"
echo "  Server IP: $SERVER_IP"
echo "  Public Port: $APP_PORT"
echo "  Access URL: http://$SERVER_IP:$APP_PORT"
echo ""
echo "To start the server:"
echo "  ./start-server.sh"
echo ""
echo "To stop the server:"
echo "  ./stop-server.sh"
echo ""
echo "Access your application:"
echo "  🌐 Full App: http://$SERVER_IP:$APP_PORT"
echo "  👤 Admin Panel: http://$SERVER_IP:$APP_PORT/admin"
echo "  📊 API Docs: http://$SERVER_IP:$APP_PORT/docs"
echo ""
echo "View logs:"
echo "  sudo journalctl -u $SERVICE_NAME -f"
echo ""
echo "Service management:"
echo "  sudo systemctl status $SERVICE_NAME"
echo "  sudo systemctl restart $SERVICE_NAME"
echo ""
print_warning "🔥 IMPORTANT: Your app will be accessible from the internet!"
print_warning "   Make sure to use strong admin passwords and keep the system updated."
echo ""
print_status "💡 Optional: To enable port 80 access (http://$SERVER_IP), run:"
print_status "   ./enable-nginx.sh"
echo "" 