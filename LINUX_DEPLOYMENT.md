# Diamond Lab Store - Linux Production Deployment

This guide will help you deploy your Diamond Lab Store to a Linux server in production mode with just one script.

## 🚀 Quick Start

### Prerequisites
- Fresh Linux server (Ubuntu 20.04+, CentOS 8+, or similar)
- User account with sudo privileges
- Domain name pointing to your server's IP
- Basic terminal knowledge

### Installation

1. **Upload your project to the server:**
   ```bash
   # Option 1: Clone from git
   git clone your-repo-url
   cd DiamondLabStore
   
   # Option 2: Upload via SCP
   scp -r /path/to/DiamondLabStore user@your-server:/home/user/
   ```

2. **Make the script executable:**
   ```bash
   chmod +x deploy-linux-production.sh
   ```

3. **Run the deployment script:**
   ```bash
   ./deploy-linux-production.sh
   ```

4. **Follow the prompts:**
   - Enter your domain name (e.g., `yourstore.com`)
   - Choose whether to install SSL certificate
   - Create admin user when prompted

## 📋 What the Script Does

### ✅ System Setup
- Detects your Linux distribution automatically
- Updates system packages
- Installs Python 3.9+ and Node.js 18+
- Installs Nginx web server
- Configures firewall

### ✅ Application Setup
- Creates dedicated user (`diamond`) for security
- Sets up virtual environment for Python
- Installs all Python dependencies from `requirements.txt`
- Installs Node.js dependencies and builds React app
- Sets up SQLite database with sample jewelry data
- Creates admin user for store management

### ✅ Production Configuration
- Creates systemd service for auto-start
- Configures Nginx reverse proxy
- Sets up SSL certificate with Let's Encrypt
- Configures security headers and gzip compression
- Sets up log rotation and monitoring

### ✅ Management Tools
Creates helper scripts in `/opt/diamond-store/`:
- `start.sh` - Start the store
- `stop.sh` - Stop the store  
- `restart.sh` - Restart the store
- `status.sh` - Check service status
- `update.sh` - Update from git repository

## 🌐 Directory Structure

After installation:
```
/opt/diamond-store/
├── source/           # Your application code
├── data/            # SQLite database
├── uploads/         # User uploaded images
├── logs/           # Application logs
├── ssl/            # SSL certificates (if applicable)
└── *.sh            # Management scripts
```

## 🔧 Management Commands

### Service Management
```bash
# Start services
sudo systemctl start diamond-store
sudo systemctl start nginx

# Stop services
sudo systemctl stop diamond-store

# Restart services
sudo systemctl restart diamond-store
sudo systemctl reload nginx

# Check status
sudo systemctl status diamond-store
sudo systemctl status nginx
```

### Using Helper Scripts
```bash
# Start everything
/opt/diamond-store/start.sh

# Stop the store
/opt/diamond-store/stop.sh

# Restart everything
/opt/diamond-store/restart.sh

# Check status and logs
/opt/diamond-store/status.sh

# Update from git
/opt/diamond-store/update.sh
```

### View Logs
```bash
# Application logs
sudo tail -f /opt/diamond-store/logs/error.log
sudo tail -f /opt/diamond-store/logs/access.log

# Service logs
sudo journalctl -u diamond-store -f
sudo journalctl -u nginx -f
```

## 🔒 Security Features

### Automatic Security Setup
- Dedicated non-root user for the application
- Firewall configuration (UFW/firewalld)
- Security headers in Nginx
- SSL/TLS encryption with Let's Encrypt
- Automatic certificate renewal

### File Permissions
- Application files owned by `diamond` user
- Restricted database access
- Secure upload directory

## 🗄️ Database Management

### SQLite Database Location
```bash
/opt/diamond-store/data/diamond_store_production.db
```

### Backup Database
```bash
# Create backup
sudo cp /opt/diamond-store/data/diamond_store_production.db \
        /opt/diamond-store/data/backup_$(date +%Y%m%d_%H%M%S).db

# Restore from backup
sudo systemctl stop diamond-store
sudo cp /opt/diamond-store/data/backup_YYYYMMDD_HHMMSS.db \
        /opt/diamond-store/data/diamond_store_production.db
sudo systemctl start diamond-store
```

### Migration to PostgreSQL (Optional)
For high-traffic sites, consider migrating to PostgreSQL:

1. Install PostgreSQL
2. Update `DATABASE_URL` in `.env.production`
3. Run migrations: `alembic upgrade head`

## 🌍 Domain & DNS Setup

### DNS Configuration
Point your domain to your server:
```
A     yourstore.com      → YOUR_SERVER_IP
A     www.yourstore.com  → YOUR_SERVER_IP
```

### SSL Certificate
The script can automatically install Let's Encrypt SSL:
- Free SSL certificate
- Auto-renewal setup
- HTTPS redirect configuration

## 📊 Monitoring & Maintenance

### Check Service Health
```bash
# Service status
/opt/diamond-store/status.sh

# Disk usage
df -h /opt/diamond-store

# Memory usage
free -h

# Check nginx configuration
sudo nginx -t
```

### Log Monitoring
```bash
# Recent errors
sudo tail -50 /opt/diamond-store/logs/error.log

# Access logs
sudo tail -50 /opt/diamond-store/logs/access.log

# System journal
sudo journalctl -u diamond-store --since "1 hour ago"
```

## 🔄 Updates & Deployment

### Automatic Updates
Use the provided update script:
```bash
/opt/diamond-store/update.sh
```

This will:
1. Pull latest code from git
2. Install new dependencies
3. Run database migrations
4. Rebuild frontend
5. Restart services

### Manual Updates
```bash
cd /opt/diamond-store/source
sudo -u diamond git pull
sudo -u diamond bash -c "
    cd backend
    source venv/bin/activate
    pip install -r ../requirements.txt
    alembic upgrade head
"
sudo -u diamond bash -c "
    cd frontend
    npm install
    npm run build
    cp -r build/* ../backend/static/
"
sudo systemctl restart diamond-store
```

## 🆘 Troubleshooting

### Common Issues

#### Service Won't Start
```bash
# Check service status
sudo systemctl status diamond-store

# Check logs
sudo journalctl -u diamond-store -n 50

# Check configuration
sudo nginx -t
```

#### Database Issues
```bash
# Check database file
ls -la /opt/diamond-store/data/
sqlite3 /opt/diamond-store/data/diamond_store_production.db ".tables"
```

#### Permission Issues
```bash
# Fix ownership
sudo chown -R diamond:diamond /opt/diamond-store
sudo chmod -R 755 /opt/diamond-store
```

#### SSL Certificate Issues
```bash
# Check certificate status
sudo certbot certificates

# Renew certificate
sudo certbot renew

# Test renewal
sudo certbot renew --dry-run
```

### Performance Optimization

#### For High Traffic
1. Increase Gunicorn workers in systemd service
2. Enable nginx caching
3. Consider using PostgreSQL instead of SQLite
4. Set up Redis for session storage

#### Memory Optimization
```bash
# Monitor memory usage
htop

# Adjust worker count in systemd service
sudo systemctl edit diamond-store
```

## 📞 Support

### Log Collection for Support
```bash
# Collect all relevant logs
sudo tar -czf diamond-store-logs.tar.gz \
    /opt/diamond-store/logs/ \
    /var/log/nginx/error.log \
    /var/log/nginx/access.log

# System information
uname -a > system-info.txt
sudo systemctl status diamond-store >> system-info.txt
sudo systemctl status nginx >> system-info.txt
```

### Configuration Files
- Nginx: `/etc/nginx/sites-available/diamond-store`
- Systemd: `/etc/systemd/system/diamond-store.service`
- Environment: `/opt/diamond-store/source/backend/.env.production`

---

**🎉 Your Diamond Lab Store is now running in production!**

Access your store at: `https://yourdomain.com`
Admin panel: `https://yourdomain.com/admin` 