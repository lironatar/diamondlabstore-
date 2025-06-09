# DiamondLabStore - Git & Linux Deployment Guide

## Quick Start Guide

### 1. Git Setup (Windows)

To initialize git repository on Windows:

```bash
# If git is not installed, install it first:
# Download from: https://git-scm.com/download/win

# Run the git initialization script
bash git-init.sh
```

If you don't have bash on Windows, run these commands in PowerShell/Command Prompt:
```cmd
git init
git add .
git commit -m "Initial commit: DiamondLabStore project"
```

### 2. Push to Remote Repository

1. Create a new repository on GitHub/GitLab/Bitbucket
2. Add the remote origin:
```bash
git remote add origin https://github.com/yourusername/diamondlabstore.git
git branch -M main
git push -u origin main
```

### 3. Linux Server Deployment

After pushing to your git repository, deploy on Linux server:

```bash
# Clone the repository
git clone https://github.com/yourusername/diamondlabstore.git
cd diamondlabstore

# Make setup script executable
chmod +x setup-linux.sh

# Run the automated setup
./setup-linux.sh
```

The setup script will:
- ✅ Install Python 3.9+, Node.js 18+, and all dependencies
- ✅ Create Python virtual environment
- ✅ Install all Python packages from requirements.txt
- ✅ Install all Node.js packages and build React app
- ✅ Set up database and run migrations
- ✅ Create admin user
- ✅ Configure nginx as reverse proxy
- ✅ Create systemd service for auto-start
- ✅ Set up proper file permissions

### 4. Starting/Stopping the Server

After setup completion:

```bash
# Start the server
./start-server.sh

# Stop the server
./stop-server.sh

# View logs
sudo journalctl -u diamondlab-store -f
```

### 5. Access Your Application

- **Frontend**: http://your-server-ip (or http://localhost if local)
- **API**: http://your-server-ip/api
- **Admin Panel**: Login with created admin credentials

## Project Structure

```
DiamondLabStore/
├── backend/              # Python FastAPI backend
│   ├── main.py          # Main application file
│   ├── models.py        # Database models
│   ├── crud.py          # Database operations
│   ├── auth.py          # Authentication
│   ├── routes/          # API routes
│   ├── static/          # Static files
│   ├── uploads/         # User uploads
│   └── alembic/         # Database migrations
├── frontend/            # React frontend
│   ├── src/
│   ├── public/
│   └── build/           # Production build
├── setup-linux.sh       # Linux deployment script
├── start-server.sh      # Server start script
├── stop-server.sh       # Server stop script
├── git-init.sh          # Git initialization script
└── requirements.txt     # Python dependencies
```

## System Requirements

### Minimum Requirements:
- **OS**: Ubuntu 18.04+, CentOS 7+, or any Linux with systemd
- **Python**: 3.9+
- **Node.js**: 16+
- **RAM**: 1GB minimum, 2GB recommended
- **Storage**: 5GB available space
- **Network**: Internet connection for package installation

### Supported Linux Distributions:
- Ubuntu 18.04, 20.04, 22.04
- Debian 9, 10, 11
- CentOS 7, 8
- RHEL 7, 8
- Fedora 30+

## Environment Configuration

The setup script creates a `.env` file in the backend directory. **Important settings to update**:

```env
# Change this secret key for production!
SECRET_KEY=your-secret-key-change-this-in-production

# Database configuration
DATABASE_URL=sqlite:///./diamond_store.db

# File upload settings
UPLOAD_FOLDER=./uploads
MAX_UPLOAD_SIZE=10485760

# CORS settings (update with your domain)
CORS_ORIGINS=http://localhost:3000,http://your-domain.com
```

## Troubleshooting

### Common Issues:

1. **Permission Denied**: Make sure scripts are executable
   ```bash
   chmod +x setup-linux.sh start-server.sh stop-server.sh
   ```

2. **Port 80 in use**: Change nginx configuration to use different port
   ```bash
   sudo nano /etc/nginx/sites-available/diamondlab-store
   ```

3. **Database issues**: Reset database
   ```bash
   cd backend
   rm diamond_store.db
   source venv/bin/activate
   alembic upgrade head
   python3 create_admin.py
   ```

4. **Service won't start**: Check logs
   ```bash
   sudo journalctl -u diamondlab-store -n 50
   ```

### Getting Support:
1. Check the logs: `sudo journalctl -u diamondlab-store -f`
2. Verify service status: `sudo systemctl status diamondlab-store`
3. Test nginx config: `sudo nginx -t`
4. Check if ports are open: `sudo netstat -tulpn | grep :80`

## Security Notes

⚠️ **Important for Production**:

1. Change the `SECRET_KEY` in backend/.env
2. Set up proper firewall rules
3. Use HTTPS (SSL/TLS certificates)
4. Regularly update the system and dependencies
5. Backup your database regularly
6. Use strong passwords for admin accounts

## Updates and Maintenance

To update the application:

```bash
# Pull latest changes
git pull origin main

# Update backend dependencies
cd backend
source venv/bin/activate
pip install -r ../requirements.txt

# Update frontend
cd ../frontend
npm install
npm run build

# Restart services
sudo systemctl restart diamondlab-store
sudo systemctl restart nginx
```

---

**Happy Coding!** 🚀💎 