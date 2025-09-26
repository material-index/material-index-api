# Deployment Guide

## 🚀 Deployment Overview

This guide covers the deployment strategy for the Material Index API Gateway, including infrastructure setup, CI/CD pipeline, and production deployment.

## 🏗️ Infrastructure Architecture

### Production Environment
```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   SSH Server    │    │   SSH Server    │    │   Supabase      │
│   (Frontend)    │    │   (API Gateway) │    │   (Database)    │
│   /api folder   │    │   /api folder   │    │                 │
│ • Vite App      │    │ • Express API   │    │ • PostgreSQL    │
│ • Static Assets │    │ • Rate Limiting │    │ • Auth          │
│ • Static Serving│    │ • Caching       │    │ • Storage       │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         └───────────────────────┼───────────────────────┘
                                 │
                    ┌─────────────────┐
                    │   Redis Cloud   │
                    │   (Caching)     │
                    └─────────────────┘
```

### Staging Environment
```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Vercel        │    │   Railway       │    │   Supabase      │
│   (Staging)     │    │   (Staging)     │    │   (Staging)     │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## 🔧 Environment Configuration

### Environment Variables

#### Frontend (Vite)
```bash
# .env
VITE_API_URL=https://api.material-index.com/v1
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key_here
VITE_APP_ENV=production
```

#### Backend (API Gateway)
```bash
# .env
NODE_ENV=production
PORT=8000

# Supabase
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key_here
SUPABASE_ANON_KEY=your_supabase_anon_key_here

# Redis
REDIS_URL=redis://your-redis-url:6379
REDIS_PASSWORD=your-redis-password

# API Configuration
API_RATE_LIMIT_WINDOW_MS=3600000
API_RATE_LIMIT_MAX_REQUESTS=1000
API_CACHE_TTL=300000

# Security
JWT_SECRET=your-jwt-secret
CORS_ORIGIN=https://material-index.com

# Monitoring
SENTRY_DSN=your-sentry-dsn
LOG_LEVEL=info
```

#### Staging Environment
```bash
# .env.staging
NODE_ENV=staging
SUPABASE_URL=your-staging-supabase-url
REDIS_URL=redis://your-staging-redis-url:6379
API_RATE_LIMIT_MAX_REQUESTS=100
```

## 🚀 Deployment Platforms

### Frontend: SSH Server Deployment

#### SSH Server Configuration
```bash
# Server details
Host: ssh.material-index.com
Port: 22
Username: (your-username)
Password: @tCEi$7%6!NV8Vy&
Directory: /api
```

#### Vite Build Configuration
```typescript
// vite.config.ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/api/',
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false,
    minify: 'terser'
  },
  server: {
    port: 3000,
    host: true
  }
})
```

#### Deployment Commands
```bash
# Build the application
npm run build

# Deploy to SSH server
rsync -avz --delete dist/ user@ssh.material-index.com:/api/

# Or using SFTP
sftp user@ssh.material-index.com
put -r dist/* /api/
```

### Backend: SSH Server Deployment

#### SSH Server Configuration
```bash
# Server details
Host: ssh.material-index.com
Port: 22
Username: (your-username)
Password: @tCEi$7%6!NV8Vy&
Directory: /api/backend
```

#### PM2 Configuration
```javascript
// ecosystem.config.js
module.exports = {
  apps: [{
    name: 'material-index-api',
    script: 'dist/index.js',
    instances: 'max',
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production',
      PORT: 8000
    },
    error_file: './logs/err.log',
    out_file: './logs/out.log',
    log_file: './logs/combined.log',
    time: true
  }]
}
```

#### Deployment Commands
```bash
# Build the backend
npm run build

# Deploy to SSH server
rsync -avz --delete dist/ user@ssh.material-index.com:/api/backend/

# SSH into server and restart
ssh user@ssh.material-index.com
cd /api/backend
pm2 restart material-index-api
```

### Database: Supabase

#### Supabase Project Setup
```sql
-- Enable Row Level Security
ALTER TABLE public.materials ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.material_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.material_properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.property_categories ENABLE ROW LEVEL SECURITY;

-- Create public access policies
CREATE POLICY "Public read access to materials" ON public.materials
  FOR SELECT USING (true);

CREATE POLICY "Public read access to material_categories" ON public.material_categories
  FOR SELECT USING (true);

CREATE POLICY "Public read access to material_properties" ON public.material_properties
  FOR SELECT USING (true);

CREATE POLICY "Public read access to properties" ON public.properties
  FOR SELECT USING (true);

CREATE POLICY "Public read access to property_categories" ON public.property_categories
  FOR SELECT USING (true);
```

#### Database Indexes
```sql
-- Performance indexes
CREATE INDEX idx_materials_name ON public.materials USING gin(to_tsvector('english', name));
CREATE INDEX idx_materials_category ON public.materials(material_category_id);
CREATE INDEX idx_materials_verified ON public.materials(is_verified);
CREATE INDEX idx_material_properties_material ON public.material_properties(material_id);
CREATE INDEX idx_material_properties_property ON public.material_properties(property_id);
```

### Caching: Redis Cloud

#### Redis Configuration
```bash
# Redis Cloud setup
redis-cli -h your-redis-host -p 6379 -a your-password

# Test connection
PING

# Set up basic configuration
CONFIG SET maxmemory 100mb
CONFIG SET maxmemory-policy allkeys-lru
```

## 🔄 CI/CD Pipeline

### GitHub Actions Workflow

#### Frontend Deployment
```yaml
# .github/workflows/frontend-deploy.yml
name: Deploy Frontend

on:
  push:
    branches: [main]
    paths: ['frontend/**']
  pull_request:
    branches: [main]
    paths: ['frontend/**']

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
          cache-dependency-path: frontend/package-lock.json
      
      - name: Install dependencies
        run: |
          cd frontend
          npm ci
      
      - name: Run tests
        run: |
          cd frontend
          npm test
      
      - name: Run linting
        run: |
          cd frontend
          npm run lint
      
      - name: Build application
        run: |
          cd frontend
          npm run build

  deploy:
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
          cache-dependency-path: frontend/package-lock.json
      
      - name: Install Vercel CLI
        run: npm install -g vercel
      
      - name: Deploy to Vercel
        run: |
          cd frontend
          vercel --prod --token ${{ secrets.VERCEL_TOKEN }}
        env:
          VERCEL_TOKEN: ${{ secrets.VERCEL_TOKEN }}
```

#### Backend Deployment
```yaml
# .github/workflows/backend-deploy.yml
name: Deploy Backend

on:
  push:
    branches: [main]
    paths: ['backend/**']
  pull_request:
    branches: [main]
    paths: ['backend/**']

jobs:
  test:
    runs-on: ubuntu-latest
    services:
      redis:
        image: redis:7-alpine
        ports:
          - 6379:6379
        options: >-
          --health-cmd "redis-cli ping"
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5
    
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
          cache-dependency-path: backend/package-lock.json
      
      - name: Install dependencies
        run: |
          cd backend
          npm ci
      
      - name: Run tests
        run: |
          cd backend
          npm test
        env:
          REDIS_URL: redis://localhost:6379
          SUPABASE_URL: ${{ secrets.SUPABASE_URL }}
          SUPABASE_ANON_KEY: ${{ secrets.SUPABASE_ANON_KEY }}
      
      - name: Run linting
        run: |
          cd backend
          npm run lint

  deploy:
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
          cache-dependency-path: backend/package-lock.json
      
      - name: Install Railway CLI
        run: npm install -g @railway/cli
      
      - name: Deploy to Railway
        run: |
          cd backend
          railway up --service api-gateway
        env:
          RAILWAY_TOKEN: ${{ secrets.RAILWAY_TOKEN }}
```

### Staging Deployment
```yaml
# .github/workflows/staging-deploy.yml
name: Deploy to Staging

on:
  push:
    branches: [develop]

jobs:
  deploy-staging:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Deploy Frontend to Staging
        run: |
          cd frontend
          vercel --target staging --token ${{ secrets.VERCEL_TOKEN }}
      
      - name: Deploy Backend to Staging
        run: |
          cd backend
          railway up --service api-gateway-staging
        env:
          RAILWAY_TOKEN: ${{ secrets.RAILWAY_TOKEN }}
```

## 📊 Monitoring and Logging

### Application Monitoring

#### Sentry Integration
```typescript
// backend/src/monitoring/sentry.ts
import * as Sentry from '@sentry/node';
import { nodeProfilingIntegration } from '@sentry/profiling-node';

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  integrations: [
    nodeProfilingIntegration(),
  ],
  tracesSampleRate: 1.0,
  profilesSampleRate: 1.0,
});
```

#### Winston Logging
```typescript
// backend/src/monitoring/logger.ts
import winston from 'winston';

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' }),
  ],
});

if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.simple()
  }));
}

export default logger;
```

### Health Checks

#### API Health Check
```typescript
// backend/src/routes/health.ts
import express from 'express';
import { createClient } from '@supabase/supabase-js';
import Redis from 'ioredis';

const router = express.Router();
const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_ANON_KEY!);
const redis = new Redis(process.env.REDIS_URL!);

router.get('/health', async (req, res) => {
  const health = {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    services: {
      database: 'unknown',
      cache: 'unknown',
      api: 'healthy'
    }
  };

  try {
    // Check database
    await supabase.from('materials').select('id').limit(1);
    health.services.database = 'healthy';
  } catch (error) {
    health.services.database = 'unhealthy';
    health.status = 'unhealthy';
  }

  try {
    // Check Redis
    await redis.ping();
    health.services.cache = 'healthy';
  } catch (error) {
    health.services.cache = 'unhealthy';
    health.status = 'unhealthy';
  }

  const statusCode = health.status === 'healthy' ? 200 : 503;
  res.status(statusCode).json(health);
});

export default router;
```

### Uptime Monitoring

#### UptimeRobot Configuration
```bash
# Monitor endpoints
https://api.material-index.com/v1/health
https://material-index.com

# Alert settings
- Email notifications
- Slack webhook
- SMS for critical issues
```

## 🔒 Security Configuration

### SSL/TLS Certificates
```bash
# Vercel automatically handles SSL
# Railway automatically handles SSL
# Supabase automatically handles SSL
```

### Security Headers
```typescript
// backend/src/middleware/security.ts
import helmet from 'helmet';

export const securityMiddleware = helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true
  }
});
```

### CORS Configuration
```typescript
// backend/src/middleware/cors.ts
import cors from 'cors';

export const corsOptions = {
  origin: process.env.CORS_ORIGIN?.split(',') || ['https://material-index.com'],
  credentials: true,
  optionsSuccessStatus: 200,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
};
```

## 📈 Performance Optimization

### CDN Configuration
```bash
# Vercel Edge Network
# Automatic global CDN
# Image optimization
# Static asset caching
```

### Database Optimization
```sql
-- Connection pooling
-- Query optimization
-- Index optimization
-- Caching strategies
```

### Caching Strategy
```typescript
// backend/src/middleware/cache.ts
import Redis from 'ioredis';

const redis = new Redis(process.env.REDIS_URL!);

export const cacheMiddleware = (ttl: number = 300) => {
  return async (req: any, res: any, next: any) => {
    const key = `cache:${req.originalUrl}`;
    
    try {
      const cached = await redis.get(key);
      if (cached) {
        return res.json(JSON.parse(cached));
      }
    } catch (error) {
      // Continue without cache
    }
    
    // Store original res.json
    const originalJson = res.json;
    res.json = function(data: any) {
      // Cache the response
      redis.setex(key, ttl, JSON.stringify(data));
      return originalJson.call(this, data);
    };
    
    next();
  };
};
```

## 🔄 Backup and Recovery

### Database Backups
```bash
# Supabase automatic backups
# Daily backups retained for 7 days
# Weekly backups retained for 4 weeks
# Monthly backups retained for 12 months
```

### Application Backups
```bash
# Code repository (GitHub)
# Environment variables (encrypted)
# Configuration files
# Documentation
```

### Recovery Procedures
```bash
# Database recovery
# Application rollback
# Environment restoration
# Monitoring restoration
```

## 🚨 Disaster Recovery

### Incident Response Plan
1. **Detection**: Automated monitoring alerts
2. **Assessment**: Determine severity and impact
3. **Response**: Execute recovery procedures
4. **Communication**: Notify stakeholders
5. **Recovery**: Restore services
6. **Post-mortem**: Analyze and improve

### Recovery Time Objectives (RTO)
- **Critical Services**: 15 minutes
- **API Gateway**: 30 minutes
- **Frontend**: 5 minutes
- **Database**: 1 hour

### Recovery Point Objectives (RPO)
- **Database**: 1 hour
- **Application State**: 15 minutes
- **User Data**: 1 hour
- **Configuration**: 24 hours
