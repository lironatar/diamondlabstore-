# DiamondLabStore Deployment Options

## 🎯 Choose Your Deployment Method

We have **3 different setup scripts** for different scenarios:

## 📋 Comparison Table

| Feature | `setup-linux.sh` | `setup-linux-public.sh` | `setup-linux-ip-only.sh` |
|---------|-------------------|--------------------------|---------------------------|
| **Access Type** | Local only | Domain-based public | IP-based public |
| **URL Format** | `http://localhost` | `http://yourdomain.com` | `http://YOUR_IP:8000` |
| **Domain Required** | ❌ No | ✅ Yes | ❌ No |
| **Nginx Setup** | ✅ Port 80 | ✅ Port 80 | ❌ Direct app port |
| **SSL/HTTPS Ready** | ❌ No | ✅ Yes | ❌ Manual setup |
| **Multi-app Support** | ❌ Basic | ✅ Full | ⚠️ Manual |
| **Firewall Config** | ❌ No | ✅ Yes | ✅ Yes |
| **Best For** | Development | Production with domain | Quick public testing |

## 🚀 When to Use Each Script

### 1. `setup-linux.sh` (Original)
**Use when:**
- Testing locally on server
- Development environment
- No external access needed
- Learning/experimenting

**Access:** `http://localhost` (server only)

### 2. `setup-linux-public.sh` (Domain-based)
**Use when:**
- You have a domain name
- Production deployment
- Professional setup
- Multiple apps on same server
- SSL/HTTPS needed

**Access:** `http://yourdomain.com` or `https://yourdomain.com`

### 3. `setup-linux-ip-only.sh` (IP-based) ⭐ **NEW**
**Use when:**
- No domain name yet
- Quick public testing
- Temporary deployments
- Showing demos to clients
- Cost-effective testing

**Access:** `http://YOUR_SERVER_IP:8000`

## 📝 Step-by-Step Instructions

### Option A: IP-Only Public Access (Simplest)

```bash
# Clone repository
git clone https://github.com/lironatar/diamondlabstore-.git
cd diamondlabstore-

# Make script executable
chmod +x setup-linux-ip-only.sh

# Run setup
./setup-linux-ip-only.sh

# During setup:
# - Confirm your server IP
# - Choose port (default: 8000)
# - Setup admin user

# Start the server
./start-server.sh
```

**Result:** App accessible at `http://YOUR_SERVER_IP:8000`

### Option B: Domain-Based Public Access (Professional)

```bash
# Clone repository
git clone https://github.com/lironatar/diamondlabstore-.git
cd diamondlabstore-

# Make script executable
chmod +x setup-linux-public.sh

# Run setup
./setup-linux-public.sh

# During setup:
# - Enter your domain: yourdomain.com
# - Choose port: 8000
# - Leave path empty for root domain

# Start the server
./start-server.sh
```

**Result:** App accessible at `http://yourdomain.com`

### Option C: Local Development (Server Only)

```bash
# Clone repository
git clone https://github.com/lironatar/diamondlabstore-.git
cd diamondlabstore-

# Make script executable
chmod +x setup-linux.sh

# Run setup
./setup-linux.sh

# Start the server
./start-server.sh
```

**Result:** App accessible at `http://localhost` (server only)

## 🌍 Public Access Examples

### IP-Only Access:
- ✅ `http://143.198.123.45:8000`
- ✅ `http://143.198.123.45:8000/admin`
- ✅ `http://143.198.123.45:8000/docs`

### Domain Access:
- ✅ `http://diamondstore.com`
- ✅ `http://diamondstore.com/admin`
- ✅ `https://diamondstore.com` (with SSL)

### Local Access:
- ✅ `http://localhost` (from server only)
- ❌ Not accessible from internet

## 🔒 Security Considerations

### IP-Only Deployment:
- ⚠️ **Exposed to internet** - use strong passwords
- ⚠️ **No SSL by default** - consider nginx setup for HTTPS
- ✅ **Firewall configured** - only necessary ports open
- ✅ **Strong SECRET_KEY** - auto-generated

### Domain Deployment:
- ✅ **SSL/HTTPS ready** - easy certbot setup
- ✅ **Professional URLs** - better for production
- ✅ **Better SEO** - search engine friendly
- ✅ **Custom domains** - branded experience

## 🛠️ Migration Between Options

### From IP-Only to Domain:
1. Get a domain name
2. Point domain to your server IP
3. Run: `./setup-linux-public.sh` in new directory
4. Copy database and uploads from old installation

### From Local to Public:
1. Choose IP-only or Domain option
2. Run appropriate script
3. Configure firewall and security

## 🎯 Recommendations

### For Beginners:
**Start with IP-Only** → Get domain later → Migrate to Domain-based

### For Production:
**Use Domain-based** from the start with SSL certificates

### For Development:
**Use Local** for development → **IP-Only** for testing → **Domain-based** for production

## 📞 Support

Each script includes:
- ✅ **English-only interface**
- ✅ **Automatic dependency installation**
- ✅ **Admin user creation**
- ✅ **Service management scripts**
- ✅ **Comprehensive logging**
- ✅ **Error handling**

Choose the option that best fits your needs! 🚀 