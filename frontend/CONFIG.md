# Diamond Lab Store - Configuration Guide

## Environment Configuration

The application uses environment variables for configuration to make it portable and robust across different environments.

### Environment Files

1. **`.env`** - Default configuration for all environments
2. **`.env.local`** - Local developer overrides (gitignored)
3. **`.env.production`** - Production-specific settings

### Available Configuration Variables

#### API Configuration
| Variable | Default | Description |
|----------|---------|-------------|
| `REACT_APP_API_BASE_URL` | `http://localhost:8001` | Backend API base URL |
| `REACT_APP_API_TIMEOUT` | `10000` | API request timeout in milliseconds |

#### Development Settings
| Variable | Default | Description |
|----------|---------|-------------|
| `REACT_APP_ENVIRONMENT` | `development` | Current environment |
| `REACT_APP_DEBUG_API` | `true` | Enable detailed API logging |

#### Feature Flags
| Variable | Default | Description |
|----------|---------|-------------|
| `REACT_APP_ENABLE_DEBUG_COMPONENT` | `true` | Show debug component in product pages |

### Changing the API Port

To change the backend API port:

1. **For development:** Edit `.env.local`:
   ```env
   REACT_APP_API_BASE_URL=http://localhost:9000
   ```

2. **For production:** Edit `.env.production`:
   ```env
   REACT_APP_API_BASE_URL=https://api.yourdomain.com
   ```

3. **Temporary override:** Set environment variable:
   ```bash
   REACT_APP_API_BASE_URL=http://localhost:9000 npm start
   ```

### Environment Priority

React loads environment files in this order (later files override earlier ones):

1. `.env`
2. `.env.local` (ignored in production)
3. `.env.development` / `.env.production`
4. `.env.development.local` / `.env.production.local`

### Important Notes

- ⚠️ **All React environment variables must start with `REACT_APP_`**
- 🔄 **Restart the development server after changing environment variables**
- 🔒 **Never commit sensitive data to `.env` files**
- 📝 **Use `.env.local` for personal/sensitive overrides**

### Examples

#### Scenario 1: Change Backend Port
If your backend runs on port 9000:

```env
# .env.local
REACT_APP_API_BASE_URL=http://localhost:9000
```

#### Scenario 2: Disable Debug Features
For cleaner development:

```env
# .env.local
REACT_APP_DEBUG_API=false
REACT_APP_ENABLE_DEBUG_COMPONENT=false
```

#### Scenario 3: Remote Backend
For testing against a remote API:

```env
# .env.local
REACT_APP_API_BASE_URL=https://staging-api.diamondlabstore.com
REACT_APP_API_TIMEOUT=20000
```

### Troubleshooting

1. **Changes not taking effect?**
   - Restart the development server (`npm start`)
   - Check variable names start with `REACT_APP_`

2. **API calls failing?**
   - Check console for API configuration logs
   - Verify backend is running on the configured port
   - Check CORS settings if using a different domain

3. **Environment not loading?**
   - Check file naming (`.env`, not `env.txt`)
   - Ensure file is in the `frontend/` directory
   - Check for syntax errors in environment files 