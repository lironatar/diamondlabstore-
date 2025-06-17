# Diamond Lab Store - Environment Configuration Guide

This document provides comprehensive information about all environment variables and configurations for the Diamond Lab Store project.

## Overview

The project supports multiple environments with dynamic configuration:
- **Development** (`dev`) - Local development with hot reload and debugging
- **Staging** (`staging`) - Production-like testing environment
- **Production** (`prod`) - Live production environment

## Environment Files Structure

```
project-root/
├── frontend/
│   ├── .env                 # Development configuration
│   ├── .env.local          # Local overrides (gitignored)
│   ├── .env.staging        # Staging environment
│   └── .env.production     # Production environment
├── backend/
│   ├── .env                # Development configuration
│   ├── .env.staging        # Staging environment
│   └── .env.production     # Production environment
└── Environment Scripts/
    ├── start.bat           # Development startup
    ├── start-staging.bat   # Staging startup
    └── start-production.bat # Production startup
```

## Frontend Environment Variables

All React environment variables must start with `REACT_APP_` to be accessible in the browser.

### API Configuration
```env
REACT_APP_API_BASE_URL=http://localhost:8001    # Backend API URL
REACT_APP_API_TIMEOUT=10000                     # Request timeout (ms)
REACT_APP_API_RETRY_ATTEMPTS=3                  # Max retry attempts
```

### Application Settings
```env
REACT_APP_NAME=Diamond Lab Store                # App display name
REACT_APP_VERSION=1.0.0                        # Version number
REACT_APP_ENVIRONMENT=development               # Environment name
REACT_APP_PORT=3001                            # Development server port
```

### Hebrew RTL Support
```env
REACT_APP_DEFAULT_LANGUAGE=he                  # Default language (Hebrew)
REACT_APP_RTL_ENABLED=true                     # Enable RTL layout
REACT_APP_SUPPORTED_LANGUAGES=he,en            # Supported languages
```

### Security & Authentication
```env
REACT_APP_SESSION_TIMEOUT=1800000              # Session timeout (30 min)
REACT_APP_JWT_REFRESH_THRESHOLD=300000         # Token refresh threshold (5 min)
REACT_APP_ENABLE_SSL=false                     # SSL enforcement
REACT_APP_COOKIE_SECURE=false                  # Secure cookies only
```

### UI/UX Configuration
```env
REACT_APP_THEME=light                          # UI theme
REACT_APP_ANIMATION_ENABLED=true               # Enable animations
REACT_APP_PAGE_TRANSITION_DURATION=300         # Transition duration (ms)
REACT_APP_TOAST_DURATION=5000                  # Toast notification duration (ms)
```

### File Upload Settings
```env
REACT_APP_MAX_FILE_SIZE=5242880                # Max file size (5MB)
REACT_APP_ALLOWED_FILE_TYPES=image/jpeg,image/png,image/gif,image/webp
REACT_APP_UPLOAD_CHUNK_SIZE=1048576            # Upload chunk size (1MB)
```

### Performance & Caching
```env
REACT_APP_ENABLE_SERVICE_WORKER=false          # Service worker (disabled in dev)
REACT_APP_CACHE_DURATION=300000                # Cache duration (5 min)
REACT_APP_IMAGE_LAZY_LOADING=true              # Lazy load images
```

### Third Party Services
```env
REACT_APP_GOOGLE_ANALYTICS_ID=                 # Google Analytics ID
REACT_APP_STRIPE_PUBLISHABLE_KEY=               # Stripe public key
REACT_APP_SENTRY_DSN=                          # Sentry error tracking
```

### Development Tools
```env
REACT_APP_ENABLE_DEBUG_COMPONENT=true          # Debug components
REACT_APP_ENABLE_REACT_SCAN=true               # React performance scan
REACT_APP_ENABLE_REDUX_DEVTOOLS=true           # Redux DevTools
REACT_APP_ENABLE_PROFILER=true                 # React Profiler
```

## Backend Environment Variables

FastAPI backend configuration using Pydantic Settings.

### Database Configuration
```env
DATABASE_URL=sqlite:///./diamond_store.db      # Database connection string
DATABASE_POOL_SIZE=5                           # Connection pool size
DATABASE_MAX_OVERFLOW=10                       # Max overflow connections
DATABASE_ECHO=true                             # Log SQL queries (dev only)
```

### Security Settings
```env
SECRET_KEY=your-secret-key-32-chars-long       # JWT secret key
ALGORITHM=HS256                                # JWT algorithm
ACCESS_TOKEN_EXPIRE_MINUTES=30                 # Access token lifetime
REFRESH_TOKEN_EXPIRE_DAYS=7                    # Refresh token lifetime
PASSWORD_HASH_ALGORITHM=bcrypt                 # Password hashing
```

### Server Configuration
```env
HOST=0.0.0.0                                  # Server host
PORT=8001                                      # Server port
RELOAD=true                                    # Auto-reload (dev only)
DEBUG=true                                     # Debug mode
LOG_LEVEL=debug                                # Logging level
```

### CORS Settings
```env
ALLOWED_ORIGINS=["http://localhost:3001"]      # Allowed origins (JSON array)
ALLOW_CREDENTIALS=true                         # Allow credentials
ALLOWED_METHODS=["GET","POST","PUT","DELETE"]  # Allowed HTTP methods
ALLOWED_HEADERS=["*"]                          # Allowed headers
```

### Application Settings
```env
APP_NAME=Diamond Lab Store API                 # API name
APP_VERSION=1.0.0                             # API version
ENVIRONMENT=development                        # Environment name
API_V1_STR=/api/v1                            # API prefix
```

### File Upload Settings
```env
UPLOAD_DIR=./uploads                           # Upload directory
ALLOWED_FILE_TYPES=image/jpeg,image/png        # Allowed file types
MAX_FILE_SIZE=5242880                          # Max file size (5MB)
MAX_FILES_PER_REQUEST=10                       # Max files per request
```

### Email Configuration
```env
SMTP_SERVER=smtp.gmail.com                    # SMTP server
SMTP_PORT=587                                  # SMTP port
SMTP_USERNAME=your-email@gmail.com             # SMTP username
SMTP_PASSWORD=your-app-password                # SMTP password
SMTP_TLS=true                                  # Enable TLS
EMAIL_FROM=noreply@diamondlabstore.com         # From email address
```

### Redis Configuration (Optional)
```env
REDIS_URL=redis://localhost:6379/0             # Redis connection string
REDIS_ENABLED=false                            # Enable Redis (disabled in dev)
```

### Rate Limiting
```env
RATE_LIMIT_ENABLED=true                        # Enable rate limiting
RATE_LIMIT_REQUESTS=100                        # Requests per period
RATE_LIMIT_PERIOD=60                           # Period in seconds
```

### Localization
```env
DEFAULT_LANGUAGE=he                            # Default language (Hebrew)
SUPPORTED_LANGUAGES=he,en                      # Supported languages
```

### Third Party Services
```env
STRIPE_SECRET_KEY=sk_test_xxxxx                # Stripe secret key
STRIPE_WEBHOOK_SECRET=whsec_xxxxx              # Stripe webhook secret
SENTRY_DSN=https://xxxxx@sentry.io/xxxxx       # Sentry error tracking
```

### Monitoring & Analytics
```env
ENABLE_METRICS=true                            # Enable metrics collection
METRICS_PORT=9090                              # Metrics server port
HEALTH_CHECK_ENABLED=true                      # Enable health checks
```

## Environment-Specific Configurations

### Development Environment
- Hot reload enabled
- Debug features active
- SQLite database
- Loose CORS policy
- All development tools enabled

### Staging Environment
- Production-like setup
- Test third-party services
- PostgreSQL database
- SSL enabled
- Debug features for testing

### Production Environment
- Optimized for performance
- Real third-party services
- PostgreSQL/MySQL database
- Strict security settings
- Debug features disabled

## Usage Examples

### Starting Different Environments

```bash
# Development
./start.bat
npm run start:dev

# Staging
./start-staging.bat
npm run start:staging

# Production
./start-production.bat
npm run start:production
```

### Building for Different Environments

```bash
# Development build
npm run build:dev

# Staging build
npm run build:staging

# Production build
npm run build:production
```

### Environment Variable Overrides

Create `.env.local` files for local development overrides:

```env
# frontend/.env.local
REACT_APP_API_BASE_URL=http://192.168.1.100:8001  # For mobile testing
REACT_APP_DEBUG_API=true                           # Force debug mode
```

## Security Considerations

### Development
- Use test/dummy keys for third-party services
- Enable debug features for development convenience
- Use HTTP for local development

### Production
- Use strong, unique secret keys (minimum 32 characters)
- Enable SSL/HTTPS everywhere
- Disable debug features and API documentation
- Use environment-specific database credentials
- Enable rate limiting and security headers

## Environment Variable Loading Order

FastAPI (Pydantic Settings) loads variables in this order:
1. Environment variables
2. `.env` file
3. Default values in code

React loads environment variables in this order:
1. `.env.local` (local overrides)
2. `.env.{NODE_ENV}` (environment-specific)
3. `.env` (default)

## Troubleshooting

### Common Issues

1. **Frontend can't access environment variables**
   - Ensure variables start with `REACT_APP_`
   - Restart development server after changing .env files

2. **Backend configuration not loading**
   - Check .env file exists in backend directory
   - Verify Pydantic Settings class is properly configured

3. **CORS errors in development**
   - Update `ALLOWED_ORIGINS` in backend .env
   - Ensure frontend URL matches allowed origins

4. **File upload failures**
   - Check `MAX_FILE_SIZE` and `ALLOWED_FILE_TYPES`
   - Verify upload directory exists and has write permissions

### Validation Scripts

Run configuration validation:
```bash
# Frontend configuration test
npm run test-config

# Backend configuration test
python backend/check_config.py
```

## Environment Templates

Use the provided .env files as templates:
- Copy and modify for your specific needs
- Never commit real production credentials to version control
- Use environment variable injection in CI/CD pipelines

## References

- [FastAPI Settings Documentation](https://fastapi.tiangolo.com/advanced/settings/)
- [Create React App Environment Variables](https://create-react-app.dev/docs/adding-custom-environment-variables/)
- [Pydantic Settings](https://pydantic-docs.helpmanual.io/usage/settings/) 