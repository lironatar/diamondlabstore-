#!/bin/bash

# DiamondLabStore Linux Setup Script
# This script installs all dependencies and starts the server

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

# Get app port
read -p "Enter backend port for the application (default: 8000): " APP_PORT
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
print_status "Backend Port: $APP_PORT"
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

# Update system packages
print_status "Updating system packages..."
if command_exists apt-get; then
    sudo apt-get update
    sudo apt-get install -y curl wget git build-essential net-tools
elif command_exists yum; then
    sudo yum update -y
    sudo yum install -y curl wget git gcc gcc-c++ make net-tools
elif command_exists dnf; then
    sudo dnf update -y
    sudo dnf install -y curl wget git gcc gcc-c++ make net-tools
else
    print_error "Unsupported package manager. Please install curl, wget, git, and build tools manually."
    exit 1
fi

# Install Python 3.9+ if not available
print_status "Checking Python installation..."
if command_exists python3; then
    PYTHON_VERSION=$(python3 -c 'import sys; print(".".join(map(str, sys.version_info[:2])))')
    print_status "Python $PYTHON_VERSION found"
    if [ "$(echo "$PYTHON_VERSION >= 3.9" | bc -l 2>/dev/null || echo "0")" -eq 1 ] || python3 -c "import sys; exit(0 if sys.version_info >= (3, 9) else 1)" 2>/dev/null; then
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
    pip install fastapi uvicorn sqlalchemy sqlite3 alembic python-multipart python-jose bcrypt passlib
fi

# Install additional dependencies for production
pip install gunicorn

# Create .env file if it doesn't exist
if [ ! -f ".env" ]; then
    print_status "Creating .env file..."
    cat > .env << EOL
DATABASE_URL=sqlite:///./diamond_store.db
SECRET_KEY=your-secret-key-change-this-in-production
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
UPLOAD_FOLDER=./uploads
MAX_UPLOAD_SIZE=10485760
ALLOWED_EXTENSIONS=jpg,jpeg,png,gif,webp
CORS_ORIGINS=http://localhost,http://127.0.0.1
DEBUG=False
ENVIRONMENT=production
EOL
    print_warning "Created .env file with default values. Please update the SECRET_KEY and other settings!"
fi

# Run database migrations
print_status "Setting up database..."
if [ -f "alembic.ini" ]; then
    alembic upgrade head
else
    # Create database tables if alembic is not set up
    python3 -c "
from database import engine
from models import Base
Base.metadata.create_all(bind=engine)
print('Database tables created')
"
fi

# Create admin user if needed
if [ -f "create_admin.py" ]; then
    print_status "Setting up admin user..."
    python3 create_admin.py || print_warning "Admin user creation failed or already exists"
fi

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
sudo tee $NGINX_CONF > /dev/null << EOL
server {
    listen 80;
    server_name localhost;
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
sudo rm -f /etc/nginx/sites-enabled/default

# Test nginx configuration
sudo nginx -t

# Create startup script
print_status "Creating startup script..."
cat > start-server.sh << 'EOL'
#!/bin/bash

echo "🚀 Starting DiamondLab Store..."

# Start the backend service
sudo systemctl start $SERVICE_NAME
sudo systemctl enable $SERVICE_NAME

# Start nginx
sudo systemctl start nginx
sudo systemctl enable nginx

echo "✅ DiamondLab Store is running!"
echo "Frontend: http://localhost"
echo "API: http://localhost/api"
echo "Backend Port: $APP_PORT"
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
cat > stop-server.sh << 'EOL'
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
echo "To start the server:"
echo "  ./start-server.sh"
echo ""
echo "To stop the server:"
echo "  ./stop-server.sh"
echo ""
echo "Access the application:"
echo "  Frontend: http://localhost"
echo "  API: http://localhost/api"
echo ""
echo "View logs:"
echo "  sudo journalctl -u diamondlab-store -f"
echo ""
echo "Service management:"
echo "  sudo systemctl status $SERVICE_NAME"
echo "  sudo systemctl restart $SERVICE_NAME"
echo ""
print_warning "⚠️  Important: Update the SECRET_KEY in backend/.env before production use!"
print_warning "⚠️  Configure your domain name in nginx config if not using localhost"
echo "" 