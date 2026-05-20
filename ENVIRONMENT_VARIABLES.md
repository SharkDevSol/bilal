# Environment Variables Documentation

This document describes all environment variables used across the Skoolific V2 system.

## Table of Contents

- [Backend Environment Variables](#backend-environment-variables)
- [Frontend Environment Variables](#frontend-environment-variables)
- [Desktop App Environment Variables](#desktop-app-environment-variables)
- [Mobile Apps Environment Variables](#mobile-apps-environment-variables)
- [Setup Instructions](#setup-instructions)

---

## Backend Environment Variables

Location: `backend/.env`

### Database Configuration

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `DATABASE_URL` | Yes | - | Full PostgreSQL connection string with schema and timezone |
| `DB_NAME` | Yes | - | Database name |
| `DB_USER` | Yes | - | Database username |
| `DB_PASSWORD` | Yes | - | Database password |
| `DB_HOST` | Yes | `localhost` | Database host address |
| `DB_PORT` | Yes | `5432` | Database port |

**Example:**
```env
DATABASE_URL="postgresql://postgres:password@localhost:5432/skoolific?schema=school_comms&timezone=Africa/Addis_Ababa"
DB_NAME=skoolific
DB_USER=postgres
DB_PASSWORD=your_password
DB_HOST=localhost
DB_PORT=5432
```

### JWT Configuration

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `JWT_SECRET` | Yes | - | Secret key for JWT token signing (min 32 characters) |
| `JWT_EXPIRES_IN` | No | `24h` | JWT token expiration time |

**Security Note:** Generate a strong random secret for production:
```bash
node -e "console.log(require('crypto').randomBytes(48).toString('base64').replace(/[^a-zA-Z0-9]/g, ''))"
```

**Example:**
```env
JWT_SECRET=GerZURN8DsVG7dkhrGfisCxP6UnDbD3RDB8vcJp2KSRFdBofcsqRiOoZU51f43
JWT_EXPIRES_IN=24h
```

### Server Configuration

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `PORT` | No | `5052` | Backend server port |
| `FRONTEND_URL` | Yes | - | Frontend application URL (for CORS) |
| `NODE_ENV` | No | `development` | Environment mode (`development`, `production`, `test`) |
| `HTTPS_ENABLED` | No | `false` | Enable HTTPS server |

**Example:**
```env
PORT=5052
FRONTEND_URL=http://localhost:5173
NODE_ENV=development
HTTPS_ENABLED=false
```

### AI06 Biometric Device Configuration

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `AI06_WEBSOCKET_ENABLED` | No | `false` | Enable AI06 biometric device integration |
| `AI06_WEBSOCKET_PORT` | No | `7700` | WebSocket port for AI06 device |
| `AI06_DEVICE_IP` | No | - | IP address of AI06 device |
| `AI06_DEVICE_PORT` | No | `80` | Port of AI06 device |

**Example:**
```env
AI06_WEBSOCKET_ENABLED=true
AI06_WEBSOCKET_PORT=7700
AI06_DEVICE_IP=192.168.1.2
AI06_DEVICE_PORT=80
```

### Email Configuration

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `SMTP_HOST` | No | - | SMTP server host |
| `SMTP_PORT` | No | `587` | SMTP server port |
| `SMTP_USER` | No | - | SMTP username/email |
| `SMTP_PASS` | No | - | SMTP password/app password |

**Example:**
```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
```

### Google Gemini API Configuration

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `GEMINI_API_KEY` | Yes (for AI features) | - | Google Gemini API key for AI test generation |

**Get API Key:** https://makersuite.google.com/app/apikey

**Example:**
```env
GEMINI_API_KEY=AIzaSyD...your-key-here
```

### Telegram Bot Configuration

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `TELEGRAM_BOT_TOKEN` | No | - | Telegram bot token for notifications |
| `TELEGRAM_CHAT_ID` | No | - | Default Telegram chat ID |

**Example:**
```env
TELEGRAM_BOT_TOKEN=123456789:ABCdefGHIjklMNOpqrsTUVwxyz
TELEGRAM_CHAT_ID=987654321
```

### SMS Gateway Configuration

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `SMS_API_KEY` | No | - | SMS gateway API key |
| `SMS_API_URL` | No | - | SMS gateway API endpoint |

**Example:**
```env
SMS_API_KEY=your-sms-api-key
SMS_API_URL=https://sms-gateway.example.com/api
```

### File Upload Configuration

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `MAX_FILE_SIZE` | No | `10485760` | Maximum file upload size in bytes (10MB default) |
| `UPLOAD_DIR` | No | `./uploads` | Directory for uploaded files |

**Example:**
```env
MAX_FILE_SIZE=10485760
UPLOAD_DIR=./uploads
```

### Rate Limiting

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `RATE_LIMIT_WINDOW_MS` | No | `900000` | Rate limit window in milliseconds (15 minutes) |
| `RATE_LIMIT_MAX_REQUESTS` | No | `100` | Maximum requests per window |

**Example:**
```env
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

### Logging

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `LOG_LEVEL` | No | `info` | Logging level (`error`, `warn`, `info`, `debug`) |
| `LOG_FILE` | No | `./logs/app.log` | Log file path |

**Example:**
```env
LOG_LEVEL=info
LOG_FILE=./logs/app.log
```

---

## Frontend Environment Variables

Location: `APP/.env`

### API Configuration

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `VITE_API_URL` | Yes | - | Backend API base URL |

**Example:**
```env
VITE_API_URL=http://localhost:5052
```

### Application Configuration

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `VITE_APP_NAME` | No | `Skoolific V2` | Application name |
| `VITE_APP_VERSION` | No | `2.0.0` | Application version |

**Example:**
```env
VITE_APP_NAME=Skoolific V2
VITE_APP_VERSION=2.0.0
```

### Feature Flags

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `VITE_ENABLE_OFFLINE_MODE` | No | `true` | Enable offline mode functionality |
| `VITE_ENABLE_AI_TESTS` | No | `true` | Enable AI-powered test generation |
| `VITE_ENABLE_ETHIOPIAN_CALENDAR` | No | `true` | Enable Ethiopian calendar integration |

**Example:**
```env
VITE_ENABLE_OFFLINE_MODE=true
VITE_ENABLE_AI_TESTS=true
VITE_ENABLE_ETHIOPIAN_CALENDAR=true
```

---

## Desktop App Environment Variables

Location: `packages/desktop/.env`

Desktop apps (Tauri) use the same frontend environment variables as above, plus:

### Tauri-Specific Configuration

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `TAURI_PRIVATE_KEY` | Yes (for updates) | - | Private key for app updates |
| `TAURI_KEY_PASSWORD` | Yes (for updates) | - | Password for private key |

**Example:**
```env
VITE_API_URL=http://localhost:5052
TAURI_PRIVATE_KEY=path/to/private.key
TAURI_KEY_PASSWORD=your-key-password
```

---

## Mobile Apps Environment Variables

Location: `packages/mobile-*/.env`

Mobile apps (Capacitor) use the same frontend environment variables, plus:

### Capacitor-Specific Configuration

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `CAPACITOR_APP_ID` | Yes | - | Unique app identifier (e.g., `com.skoolific.staff`) |
| `CAPACITOR_APP_NAME` | Yes | - | App display name |

**Example:**
```env
VITE_API_URL=https://api.skoolific.com
CAPACITOR_APP_ID=com.skoolific.staff
CAPACITOR_APP_NAME=Skoolific Staff
```

---

## Setup Instructions

### 1. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Copy example file
cp .env.example .env

# Edit .env with your values
nano .env  # or use your preferred editor

# Generate JWT secret
node -e "console.log(require('crypto').randomBytes(48).toString('base64').replace(/[^a-zA-Z0-9]/g, ''))"

# Update JWT_SECRET in .env with generated value
```

### 2. Frontend Setup

```bash
# Navigate to frontend directory
cd APP

# Copy example file
cp .env.example .env

# Edit .env with your backend URL
nano .env
```

### 3. Desktop App Setup

```bash
# Navigate to desktop directory
cd packages/desktop

# Copy example file
cp .env.example .env

# Edit .env with your configuration
nano .env
```

### 4. Mobile Apps Setup

```bash
# For each mobile app (staff, student, guardian, super-admin)
cd packages/mobile-staff  # or mobile-student, mobile-guardian, mobile-super-admin

# Copy example file
cp .env.example .env

# Edit .env with your configuration
nano .env
```

### 5. Verify Configuration

```bash
# Backend validation
cd backend
npm run validate

# Frontend build test
cd APP
npm run build

# Check for missing variables
grep -r "process.env" backend/ | grep -v node_modules
grep -r "import.meta.env" APP/src/ | grep -v node_modules
```

---

## Security Best Practices

### 1. Never Commit .env Files

Ensure `.env` files are in `.gitignore`:
```gitignore
.env
.env.local
.env.production
*/.env
*/.env.local
*/.env.production
```

### 2. Use Strong Secrets

- **JWT_SECRET**: Minimum 32 characters, random alphanumeric
- **DB_PASSWORD**: Strong password with mixed characters
- **API Keys**: Never share or commit to version control

### 3. Environment-Specific Configuration

- **Development**: Use `localhost` and test credentials
- **Production**: Use production URLs and strong credentials
- **Staging**: Use separate staging environment

### 4. Rotate Secrets Regularly

- Change JWT secrets periodically
- Rotate API keys every 90 days
- Update database passwords quarterly

### 5. Use Environment Variable Management Tools

For production deployments, consider:
- **Docker Secrets** (for containerized deployments)
- **Kubernetes Secrets** (for K8s deployments)
- **AWS Secrets Manager** (for AWS deployments)
- **Azure Key Vault** (for Azure deployments)

---

## Troubleshooting

### Backend Not Connecting to Database

1. Check `DATABASE_URL` format
2. Verify database is running: `pg_isready -h localhost -p 5432`
3. Test connection: `psql -h localhost -U postgres -d skoolific`

### Frontend Cannot Reach Backend

1. Verify `VITE_API_URL` matches backend `PORT`
2. Check CORS configuration in backend
3. Ensure backend is running: `curl http://localhost:5052/health`

### JWT Authentication Failing

1. Verify `JWT_SECRET` is set and matches across services
2. Check token expiration: `JWT_EXPIRES_IN`
3. Ensure secret is at least 32 characters

### Gemini API Not Working

1. Verify `GEMINI_API_KEY` is valid
2. Check API quota: https://makersuite.google.com/app/apikey
3. Test API key: `curl -H "x-goog-api-key: YOUR_KEY" https://generativelanguage.googleapis.com/v1/models`

---

## Additional Resources

- [Backend README](backend/README.md)
- [Frontend README](APP/README.md)
- [Deployment Guide](DEPLOYMENT.md)
- [Security Guidelines](SECURITY.md)

---

**Last Updated:** 2025  
**Maintained by:** Skoolific Development Team
