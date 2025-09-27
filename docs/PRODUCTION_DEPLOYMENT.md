# Material Index API - Production Deployment Guide

This guide covers deploying the Material Index API to production environments, specifically for `api.material-index.com`.

## 🚀 Production Builds

### Frontend Build (React + Vite)
```bash
# Location: demo-app/
cd demo-app
npm install
npm run build

# Output: dist/ folder with optimized static files
# - index.html (0.99 kB)
# - assets/index-ce9df401.css (23.59 kB)
# - assets/index-e53c90d3.js (98.59 kB)
# - assets/vendor-4be45eb5.js (140.13 kB)
```

### Backend Build (Node.js + Express)
```bash
# Location: api-gateway/
cd api-gateway
npm install
npm run build

# Output: dist/ folder with compiled TypeScript
# - server.js (compiled from src/server.ts)
# - All route handlers and middleware
```

## 🌐 Production Configuration

### Environment Variables
```bash
# Production Environment (.env.production)
NODE_ENV=production
PORT=3001

# Supabase Configuration
SUPABASE_URL=https://likqvubiqoooqxrhvlsn.supabase.co
SUPABASE_ANON_KEY=your_production_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_production_service_role_key

# API Configuration
API_VERSION=v1
API_BASE_URL=https://api.material-index.com

# Security
JWT_SECRET=your_production_jwt_secret
API_KEY_SECRET=your_production_api_key_secret

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=1000

# CORS Configuration
CORS_ORIGIN=https://material-index.com,https://api.material-index.com

# Redis Configuration (Production)
REDIS_URL=redis://your-production-redis:6379
REDIS_PASSWORD=your_redis_password

# Monitoring
LOG_LEVEL=info
SENTRY_DSN=your_sentry_dsn
```

### Frontend Configuration
```bash
# Vite Environment Variables
VITE_API_URL=https://api.material-index.com/v1
VITE_APP_ENV=production
VITE_APP_VERSION=1.0.0
```

## 🏗️ Deployment Architecture

### One.com Webspace Deployment
```
api.material-index.com/
├── frontend/           # Static files (HTML, CSS, JS)
│   ├── index.html
│   ├── assets/
│   └── static/
├── backend/            # Node.js API server
│   ├── dist/
│   ├── node_modules/
│   ├── package.json
│   └── .env
└── nginx.conf          # Reverse proxy configuration
```

### Nginx Configuration
```nginx
server {
    listen 80;
    server_name api.material-index.com;
    
    # Frontend (Static Files)
    location / {
        root /path/to/frontend/dist;
        try_files $uri $uri/ /index.html;
        
        # Cache static assets
        location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
            expires 1y;
            add_header Cache-Control "public, immutable";
        }
    }
    
    # Backend API
    location /api/ {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
    
    # Health Check
    location /health {
        proxy_pass http://localhost:3001/health;
    }
}
```

## 🔧 Production Scripts

### Package.json Scripts
```json
{
  "scripts": {
    "build": "npm run build:frontend && npm run build:backend",
    "build:frontend": "cd demo-app && npm run build",
    "build:backend": "cd api-gateway && npm run build",
    "start": "cd api-gateway && npm start",
    "start:frontend": "cd demo-app && npm run preview",
    "start:backend": "cd api-gateway && npm run start:prod",
    "deploy": "npm run build && npm run start",
    "pm2:start": "pm2 start ecosystem.config.js",
    "pm2:stop": "pm2 stop ecosystem.config.js",
    "pm2:restart": "pm2 restart ecosystem.config.js"
  }
}
```

### PM2 Configuration (ecosystem.config.js)
```javascript
module.exports = {
  apps: [{
    name: 'material-index-api',
    script: './api-gateway/dist/server.js',
    instances: 'max',
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production',
      PORT: 3001
    },
    env_production: {
      NODE_ENV: 'production',
      PORT: 3001
    },
    error_file: './logs/err.log',
    out_file: './logs/out.log',
    log_file: './logs/combined.log',
    time: true
  }]
}
```

## 📊 Production Monitoring

### Health Checks
```bash
# API Health
curl https://api.material-index.com/health

# Expected Response:
{
  "status": "ok",
  "timestamp": "2025-01-01T12:00:00Z",
  "version": "1.0.0"
}
```

### Performance Monitoring
- **Response Time**: < 200ms average
- **Uptime**: 99.9% target
- **Error Rate**: < 0.1%
- **Memory Usage**: < 512MB per instance

### Logging
```javascript
// Production logging configuration
const winston = require('winston');

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
    new winston.transports.File({ filename: 'logs/combined.log' }),
    new winston.transports.Console({
      format: winston.format.simple()
    })
  ]
});
```

## 🔐 Security Configuration

### SSL/TLS
```bash
# SSL Certificate (Let's Encrypt)
certbot --nginx -d api.material-index.com

# Force HTTPS
server {
    listen 443 ssl http2;
    server_name api.material-index.com;
    
    ssl_certificate /etc/letsencrypt/live/api.material-index.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/api.material-index.com/privkey.pem;
    
    # Security headers
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
    add_header X-Frame-Options DENY always;
    add_header X-Content-Type-Options nosniff always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;
}
```

### Rate Limiting
```javascript
// Production rate limiting
const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 1000, // limit each IP to 1000 requests per windowMs
  message: {
    error: 'Too many requests',
    message: 'Rate limit exceeded. Please try again later.'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

app.use('/api/', limiter);
```

## 🚀 Deployment Checklist

### Pre-Deployment
- [ ] Environment variables configured
- [ ] SSL certificates installed
- [ ] Database connections tested
- [ ] Build artifacts generated
- [ ] Security headers configured
- [ ] Rate limiting configured

### Deployment
- [ ] Frontend files uploaded to webspace
- [ ] Backend deployed with PM2
- [ ] Nginx configuration updated
- [ ] DNS records configured
- [ ] Health checks passing

### Post-Deployment
- [ ] API endpoints responding
- [ ] Frontend loading correctly
- [ ] Database queries working
- [ ] Authentication functioning
- [ ] Rate limiting active
- [ ] Monitoring configured
- [ ] Logs being collected

## 📈 Performance Optimization

### Frontend Optimization
- **Code Splitting**: Implemented with Vite
- **Tree Shaking**: Automatic with Vite
- **Minification**: Terser for JavaScript
- **Compression**: Gzip/Brotli enabled
- **Caching**: Long-term caching for assets

### Backend Optimization
- **Clustering**: PM2 cluster mode
- **Compression**: Gzip middleware
- **Caching**: Redis for API responses
- **Database**: Optimized queries and indexes
- **Connection Pooling**: Supabase connection pooling

## 🔄 CI/CD Pipeline

### GitHub Actions (Optional)
```yaml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
      - name: Install dependencies
        run: npm install
      - name: Build application
        run: npm run build
      - name: Deploy to One.com
        run: |
          # Deploy frontend
          rsync -avz demo-app/dist/ user@api.material-index.com:/path/to/frontend/
          # Deploy backend
          rsync -avz api-gateway/dist/ user@api.material-index.com:/path/to/backend/
```

## 🆘 Troubleshooting

### Common Issues
1. **Build Failures**: Check TypeScript errors and dependencies
2. **Runtime Errors**: Verify environment variables and database connections
3. **Performance Issues**: Check PM2 logs and system resources
4. **SSL Issues**: Verify certificate installation and renewal

### Support
- **Documentation**: [docs.material-index.com](https://docs.material-index.com)
- **Status Page**: [status.material-index.com](https://status.material-index.com)
- **Email**: [info@material-index.com](mailto:info@material-index.com)

---

**Production Deployment** - Ready for `api.material-index.com` 🚀
