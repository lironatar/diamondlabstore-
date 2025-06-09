# Multi-App Server Setup Guide

## 🎯 Running Multiple Apps on Same Server

This guide shows you how to run multiple applications on the same Linux server with different URLs/domains.

## 📋 Setup Options

### Option 1: Different Subdomains (Recommended)
- `diamond.yourdomain.com` - DiamondLab Store
- `shop.yourdomain.com` - Another e-commerce app
- `blog.yourdomain.com` - Blog application

### Option 2: Different Paths on Same Domain
- `yourdomain.com/diamond` - DiamondLab Store
- `yourdomain.com/shop` - Another e-commerce app
- `yourdomain.com/blog` - Blog application

### Option 3: Different Domains
- `diamondstore.com` - DiamondLab Store
- `myshop.com` - Another e-commerce app
- `myblog.com` - Blog application

## 🚀 Step-by-Step Setup

### 1. Deploy DiamondLab Store (First App)

```bash
# Clone and setup first app
git clone https://github.com/lironatar/diamondlabstore-.git
cd diamondlabstore-
chmod +x setup-linux-public.sh
./setup-linux-public.sh

# During setup, enter:
# Domain: diamond.yourdomain.com (or yourdomain.com)
# Port: 8000
# Path: (empty for subdomain, /diamond for path-based)
```

### 2. Deploy Second App (Example)

```bash
# Clone second app to different directory
cd /home/user
git clone https://github.com/user/second-app.git
cd second-app
chmod +x setup-linux-public.sh
./setup-linux-public.sh

# During setup, enter:
# Domain: shop.yourdomain.com (or yourdomain.com)
# Port: 8001
# Path: (empty for subdomain, /shop for path-based)
```

### 3. Deploy Third App (Example)

```bash
# Clone third app to different directory
cd /home/user
git clone https://github.com/user/third-app.git
cd third-app
chmod +x setup-linux-public.sh
./setup-linux-public.sh

# During setup, enter:
# Domain: blog.yourdomain.com (or yourdomain.com)
# Port: 8002
# Path: (empty for subdomain, /blog for path-based)
```

## 🌐 DNS Configuration

### For Subdomains:
Add these DNS A records in your domain provider:

```
diamond.yourdomain.com  →  YOUR_SERVER_IP
shop.yourdomain.com     →  YOUR_SERVER_IP
blog.yourdomain.com     →  YOUR_SERVER_IP
```

### For Path-based (Single Domain):
Add one DNS A record:

```
yourdomain.com  →  YOUR_SERVER_IP
```

## 📁 Directory Structure Example

```
/home/user/
├── diamondlabstore-/          # App 1 (Port 8000)
│   ├── backend/
│   ├── frontend/
│   ├── start-server.sh
│   └── setup-linux-public.sh
├── second-app/                # App 2 (Port 8001)
│   ├── backend/
│   ├── frontend/
│   ├── start-server.sh
│   └── setup-linux-public.sh
└── third-app/                 # App 3 (Port 8002)
    ├── backend/
    ├── frontend/
    ├── start-server.sh
    └── setup-linux-public.sh
```

## ⚙️ Nginx Configuration Examples

The `setup-linux-public.sh` script automatically creates these configurations:

### Subdomain Configuration:
```nginx
# /etc/nginx/sites-available/diamondlab-store-8000
server {
    listen 80;
    server_name diamond.yourdomain.com;
    # ... app configuration
}

# /etc/nginx/sites-available/second-app-8001
server {
    listen 80;
    server_name shop.yourdomain.com;
    # ... app configuration
}
```

### Path-based Configuration:
```nginx
# /etc/nginx/sites-available/yourdomain-apps
server {
    listen 80;
    server_name yourdomain.com;
    
    # DiamondLab Store
    location /diamond {
        alias /home/user/diamondlabstore-/frontend/build;
        try_files $uri $uri/ /diamond/index.html;
    }
    
    location /diamond/api/ {
        proxy_pass http://127.0.0.1:8000/;
        # ... proxy headers
    }
    
    # Second App
    location /shop {
        alias /home/user/second-app/frontend/build;
        try_files $uri $uri/ /shop/index.html;
    }
    
    location /shop/api/ {
        proxy_pass http://127.0.0.1:8001/;
        # ... proxy headers
    }
}
```

## 🔧 Service Management

Each app gets its own systemd service:

```bash
# DiamondLab Store
sudo systemctl start diamondlab-store-8000
sudo systemctl status diamondlab-store-8000
sudo systemctl stop diamondlab-store-8000

# Second App
sudo systemctl start second-app-8001
sudo systemctl status second-app-8001
sudo systemctl stop second-app-8001

# Third App
sudo systemctl start third-app-8002
sudo systemctl status third-app-8002
sudo systemctl stop third-app-8002

# Nginx (serves all apps)
sudo systemctl restart nginx
sudo systemctl status nginx
```

## 🔐 SSL/HTTPS Setup

Install SSL certificates for all domains:

```bash
# Install certbot
sudo apt install certbot python3-certbot-nginx

# Get certificates for all subdomains
sudo certbot --nginx -d diamond.yourdomain.com
sudo certbot --nginx -d shop.yourdomain.com
sudo certbot --nginx -d blog.yourdomain.com

# Or for single domain with multiple paths
sudo certbot --nginx -d yourdomain.com
```

## 📊 Resource Usage

### Typical Resource Usage per App:
- **RAM**: 200-500MB per app
- **CPU**: Low (unless heavy traffic)
- **Disk**: 100-500MB per app
- **Ports**: 1 unique port per app

### Server Requirements:
- **Minimum**: 2GB RAM, 2 CPU cores
- **Recommended**: 4GB RAM, 4 CPU cores
- **For 5+ apps**: 8GB RAM, 4+ CPU cores

## 🔍 Monitoring and Logs

### View logs for specific app:
```bash
# DiamondLab Store logs
sudo journalctl -u diamondlab-store-8000 -f

# Second app logs
sudo journalctl -u second-app-8001 -f

# Nginx logs
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log
```

### Check all running services:
```bash
sudo systemctl list-units --type=service | grep diamondlab
sudo systemctl list-units --type=service | grep -E "(8000|8001|8002)"
```

## 🚨 Troubleshooting

### Common Issues:

1. **Port Conflicts**:
   ```bash
   # Check what's using a port
   sudo netstat -tulpn | grep :8000
   
   # Change port in service file
   sudo nano /etc/systemd/system/diamondlab-store-8000.service
   sudo systemctl daemon-reload
   sudo systemctl restart diamondlab-store-8000
   ```

2. **Nginx Configuration Errors**:
   ```bash
   # Test nginx config
   sudo nginx -t
   
   # Check which sites are enabled
   ls -la /etc/nginx/sites-enabled/
   ```

3. **Database Conflicts**:
   - Each app should use separate database files
   - Check `backend/.env` file for database paths

4. **File Permissions**:
   ```bash
   # Fix permissions for all apps
   sudo chown -R $USER:$USER /home/user/*/backend/uploads
   sudo chmod -R 755 /home/user/*/backend/uploads
   ```

## 🎯 Quick Commands Reference

```bash
# Start all apps
cd /home/user/diamondlabstore- && ./start-server.sh
cd /home/user/second-app && ./start-server.sh
cd /home/user/third-app && ./start-server.sh

# Stop all apps
sudo systemctl stop diamondlab-store-8000 second-app-8001 third-app-8002

# Restart nginx
sudo systemctl restart nginx

# Check all app statuses
sudo systemctl status diamondlab-store-8000 second-app-8001 third-app-8002 nginx
```

## 🔄 Updates and Maintenance

### Update DiamondLab Store:
```bash
cd /home/user/diamondlabstore-
git pull origin main
cd backend && source venv/bin/activate && pip install -r ../requirements.txt
cd ../frontend && npm install && npm run build
sudo systemctl restart diamondlab-store-8000
```

### Update System:
```bash
sudo apt update && sudo apt upgrade -y
sudo systemctl restart nginx
```

---

This setup allows you to run multiple applications efficiently on the same server while keeping them isolated and manageable! 🚀 