# Security Guide

## 🔒 Security Overview

This document outlines the security measures, best practices, and considerations for the Material Index API Gateway to ensure data protection, user privacy, and system integrity.

## 🛡️ Security Architecture

### Defense in Depth Strategy
```
┌─────────────────────────────────────────────────────────────┐
│                    Client Applications                      │
├─────────────────────────────────────────────────────────────┤
│  HTTPS/TLS 1.3  │  API Key Auth  │  Input Validation      │
├─────────────────────────────────────────────────────────────┤
│                    API Gateway Layer                        │
├─────────────────────────────────────────────────────────────┤
│  Rate Limiting  │  CORS Policy   │  Security Headers      │
├─────────────────────────────────────────────────────────────┤
│                    Application Layer                        │
├─────────────────────────────────────────────────────────────┤
│  JWT Validation │  RLS Policies  │  Input Sanitization    │
├─────────────────────────────────────────────────────────────┤
│                    Database Layer                           │
├─────────────────────────────────────────────────────────────┤
│  Connection Pool│  Query Params  │  Access Controls       │
└─────────────────────────────────────────────────────────────┘
```

## 🔐 Authentication & Authorization

### OAuth 2.0 & OpenID Connect (OIDC)
```typescript
// OAuth 2.0 and OIDC implementation
import { OAuth2Client } from 'google-auth-library';
import jwt from 'jsonwebtoken';

// OAuth 2.0 client configuration
const oauth2Client = new OAuth2Client(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URI
);

// OAuth 2.0 authorization endpoint
export const initiateOAuth = (req: Request, res: Response) => {
  const authUrl = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: ['openid', 'email', 'profile'],
    state: req.query.redirect_uri || '/dashboard'
  });
  
  res.redirect(authUrl);
};

// OAuth 2.0 callback handler
export const handleOAuthCallback = async (req: Request, res: Response) => {
  const { code, state } = req.query;
  
  try {
    const { tokens } = await oauth2Client.getToken(code as string);
    oauth2Client.setCredentials(tokens);
    
    // Get user info from Google
    const ticket = await oauth2Client.verifyIdToken({
      idToken: tokens.id_token!,
      audience: process.env.GOOGLE_CLIENT_ID
    });
    
    const payload = ticket.getPayload();
    
    // Create or update user in database
    const { data: user, error } = await supabase
      .from('users')
      .upsert({
        email: payload?.email,
        name: payload?.name,
        picture: payload?.picture,
        google_id: payload?.sub,
        last_login: new Date().toISOString()
      })
      .select()
      .single();
    
    if (error) throw error;
    
    // Generate JWT token
    const jwtToken = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET!,
      { expiresIn: '24h' }
    );
    
    res.json({
      token: jwtToken,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        picture: user.picture
      }
    });
  } catch (error) {
    logger.error('OAuth callback error:', error);
    res.status(500).json({
      error: {
        code: 'OAUTH_ERROR',
        message: 'OAuth authentication failed'
      }
    });
  }
};
```

### Multi-Factor Authentication (MFA)
```typescript
import speakeasy from 'speakeasy';
import QRCode from 'qrcode';

// Generate MFA secret for user
export const generateMFASecret = async (userId: string) => {
  const secret = speakeasy.generateSecret({
    name: 'Material Index API',
    issuer: 'Material Index',
    length: 32
  });
  
  // Store secret in database (encrypted)
  const encryptedSecret = encrypt(secret.base32);
  
  await supabase
    .from('user_mfa')
    .upsert({
      user_id: userId,
      secret: encryptedSecret,
      backup_codes: generateBackupCodes(),
      is_enabled: false
    });
  
  return {
    secret: secret.base32,
    qr_code: await QRCode.toDataURL(secret.otpauth_url!)
  };
};

// Verify MFA token
export const verifyMFAToken = async (userId: string, token: string): Promise<boolean> => {
  const { data: mfaData } = await supabase
    .from('user_mfa')
    .select('secret, backup_codes')
    .eq('user_id', userId)
    .eq('is_enabled', true)
    .single();
  
  if (!mfaData) return false;
  
  const decryptedSecret = decrypt(mfaData.secret);
  
  // Verify TOTP token
  const verified = speakeasy.totp.verify({
    secret: decryptedSecret,
    encoding: 'base32',
    token: token,
    window: 2
  });
  
  if (verified) return true;
  
  // Check backup codes
  const backupCodes = JSON.parse(mfaData.backup_codes);
  const codeIndex = backupCodes.indexOf(token);
  
  if (codeIndex !== -1) {
    // Remove used backup code
    backupCodes.splice(codeIndex, 1);
    await supabase
      .from('user_mfa')
      .update({ backup_codes: JSON.stringify(backupCodes) })
      .eq('user_id', userId);
    return true;
  }
  
  return false;
};

// Generate backup codes
const generateBackupCodes = (): string => {
  const codes = [];
  for (let i = 0; i < 10; i++) {
    codes.push(Math.random().toString(36).substring(2, 10).toUpperCase());
  }
  return JSON.stringify(codes);
};
```

### API Key Authentication
```typescript
// API Key validation middleware
export const validateApiKey = async (req: Request, res: Response, next: NextFunction) => {
  const apiKey = req.headers.authorization?.replace('Bearer ', '');
  
  if (!apiKey) {
    return res.status(401).json({
      error: {
        code: 'MISSING_API_KEY',
        message: 'API key is required'
      }
    });
  }

  try {
    // Validate API key against database
    const { data: keyData, error } = await supabase
      .from('api_keys')
      .select('*')
      .eq('key', apiKey)
      .eq('is_active', true)
      .single();

    if (error || !keyData) {
      return res.status(401).json({
        error: {
          code: 'INVALID_API_KEY',
          message: 'Invalid or expired API key'
        }
      });
    }

    // Check rate limits
    const rateLimit = await checkRateLimit(apiKey);
    if (!rateLimit.allowed) {
      return res.status(429).json({
        error: {
          code: 'RATE_LIMIT_EXCEEDED',
          message: 'Rate limit exceeded',
          retry_after: rateLimit.retryAfter
        }
      });
    }

    req.apiKey = keyData;
    next();
  } catch (error) {
    logger.error('API key validation error:', error);
    return res.status(500).json({
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Internal server error'
      }
    });
  }
};
```

### Supabase JWT Authentication
```typescript
// JWT validation middleware
export const validateJWT = async (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.replace('Bearer ', '');
  
  if (!token) {
    return res.status(401).json({
      error: {
        code: 'MISSING_TOKEN',
        message: 'JWT token is required'
      }
    });
  }

  try {
    const { data: { user }, error } = await supabase.auth.getUser(token);
    
    if (error || !user) {
      return res.status(401).json({
        error: {
          code: 'INVALID_TOKEN',
          message: 'Invalid or expired token'
        }
      });
    }

    req.user = user;
    next();
  } catch (error) {
    logger.error('JWT validation error:', error);
    return res.status(500).json({
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Internal server error'
      }
    });
  }
};
```

## 🚦 Rate Limiting & Throttling

### Redis-based Rate Limiting
```typescript
// Rate limiting implementation
export const rateLimitMiddleware = (windowMs: number, maxRequests: number) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const identifier = req.apiKey?.id || req.ip;
    const key = `rate_limit:${identifier}`;
    
    try {
      const current = await redis.incr(key);
      
      if (current === 1) {
        await redis.expire(key, Math.ceil(windowMs / 1000));
      }
      
      if (current > maxRequests) {
        return res.status(429).json({
          error: {
            code: 'RATE_LIMIT_EXCEEDED',
            message: 'Too many requests',
            retry_after: await redis.ttl(key)
          }
        });
      }
      
      // Add rate limit headers
      res.set({
        'X-RateLimit-Limit': maxRequests.toString(),
        'X-RateLimit-Remaining': Math.max(0, maxRequests - current).toString(),
        'X-RateLimit-Reset': new Date(Date.now() + windowMs).toISOString()
      });
      
      next();
    } catch (error) {
      logger.error('Rate limiting error:', error);
      // Continue without rate limiting if Redis is down
      next();
    }
  };
};
```

### Tiered Rate Limiting
```typescript
// Different rate limits for different tiers
export const getRateLimitConfig = (apiKey: any) => {
  const tier = apiKey.tier || 'free';
  
  const configs = {
    free: { windowMs: 3600000, maxRequests: 1000 },      // 1000/hour
    pro: { windowMs: 3600000, maxRequests: 10000 },      // 10000/hour
    enterprise: { windowMs: 3600000, maxRequests: 100000 } // 100000/hour
  };
  
  return configs[tier] || configs.free;
};
```

### Request Throttling
```typescript
// Throttling implementation (slows down requests instead of dropping them)
export const throttlingMiddleware = (delayMs: number) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const identifier = req.apiKey?.id || req.ip;
    const throttleKey = `throttle:${identifier}`;
    
    try {
      const lastRequest = await redis.get(throttleKey);
      const now = Date.now();
      
      if (lastRequest) {
        const timeSinceLastRequest = now - parseInt(lastRequest);
        if (timeSinceLastRequest < delayMs) {
          const waitTime = delayMs - timeSinceLastRequest;
          await new Promise(resolve => setTimeout(resolve, waitTime));
        }
      }
      
      await redis.set(throttleKey, now.toString(), 'EX', 60); // Expire after 1 minute
      next();
    } catch (error) {
      logger.error('Throttling error:', error);
      // Continue without throttling if Redis is down
      next();
    }
  };
};

// Adaptive throttling based on server load
export const adaptiveThrottlingMiddleware = () => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const serverLoad = await getServerLoad(); // Implement server load monitoring
    const baseDelay = 100; // Base delay in ms
    const adaptiveDelay = baseDelay * (1 + serverLoad); // Scale delay with load
    
    await throttlingMiddleware(adaptiveDelay)(req, res, next);
  };
};

// Queue-based throttling for high-volume endpoints
export const queueThrottlingMiddleware = (maxConcurrent: number) => {
  const requestQueue: Array<() => void> = [];
  let activeRequests = 0;
  
  return async (req: Request, res: Response, next: NextFunction) => {
    if (activeRequests >= maxConcurrent) {
      // Add to queue
      await new Promise<void>((resolve) => {
        requestQueue.push(resolve);
      });
    }
    
    activeRequests++;
    
    try {
      await next();
    } finally {
      activeRequests--;
      
      // Process next request in queue
      if (requestQueue.length > 0) {
        const nextRequest = requestQueue.shift();
        if (nextRequest) nextRequest();
      }
    }
  };
};
```

## 🛡️ Input Validation & Sanitization

### Request Validation
```typescript
import Joi from 'joi';

// Material search validation
const materialSearchSchema = Joi.object({
  page: Joi.number().integer().min(1).max(1000).default(1),
  limit: Joi.number().integer().min(1).max(100).default(20),
  category_id: Joi.number().integer().positive().optional(),
  search: Joi.string().max(255).optional(),
  verified: Joi.boolean().optional(),
  sort: Joi.string().valid('name', 'created_at', 'updated_at').default('name'),
  order: Joi.string().valid('asc', 'desc').default('asc')
});

export const validateMaterialSearch = (req: Request, res: Response, next: NextFunction) => {
  const { error, value } = materialSearchSchema.validate(req.query);
  
  if (error) {
    return res.status(400).json({
      error: {
        code: 'VALIDATION_ERROR',
        message: 'Invalid request parameters',
        details: error.details.map(d => ({
          field: d.path.join('.'),
          message: d.message
        }))
      }
    });
  }
  
  req.query = value;
  next();
};
```

### SQL Injection Prevention
```typescript
// Always use parameterized queries
export const getMaterials = async (filters: any) => {
  let query = supabase
    .from('materials')
    .select(`
      *,
      category:material_categories(*),
      properties:material_properties(
        *,
        property:properties(*)
      )
    `);
  
  // Apply filters safely
  if (filters.category_id) {
    query = query.eq('material_category_id', filters.category_id);
  }
  
  if (filters.verified !== undefined) {
    query = query.eq('is_verified', filters.verified);
  }
  
  if (filters.search) {
    query = query.or(`name.ilike.%${filters.search}%,description.ilike.%${filters.search}%`);
  }
  
  // Apply pagination
  const offset = (filters.page - 1) * filters.limit;
  query = query.range(offset, offset + filters.limit - 1);
  
  // Apply sorting
  query = query.order(filters.sort, { ascending: filters.order === 'asc' });
  
  return await query;
};
```

## 🔒 Row Level Security (RLS)

### Database Security Policies
```sql
-- Enable RLS on all tables
ALTER TABLE public.materials ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.material_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.material_properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.property_categories ENABLE ROW LEVEL SECURITY;

-- Public read access policies
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

-- Future: Admin write access
CREATE POLICY "Admin write access to materials" ON public.materials
  FOR ALL USING (
    auth.role() = 'authenticated' AND 
    EXISTS (
      SELECT 1 FROM user_roles 
      WHERE user_id = auth.uid() 
      AND role = 'admin'
    )
  );
```

### API Key Management
```sql
-- API keys table
CREATE TABLE public.api_keys (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  key_hash text NOT NULL UNIQUE,
  name text NOT NULL,
  tier text NOT NULL DEFAULT 'free' CHECK (tier IN ('free', 'pro', 'enterprise')),
  is_active boolean DEFAULT true,
  created_by uuid REFERENCES auth.users(id),
  created_at timestamp with time zone DEFAULT now(),
  expires_at timestamp with time zone,
  last_used_at timestamp with time zone,
  usage_count bigint DEFAULT 0
);

-- RLS for API keys
ALTER TABLE public.api_keys ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own API keys" ON public.api_keys
  FOR ALL USING (auth.uid() = created_by);
```

## 🌐 Network Security

### CORS Configuration
```typescript
import cors from 'cors';

const corsOptions = {
  origin: (origin: string | undefined, callback: Function) => {
    const allowedOrigins = process.env.CORS_ORIGIN?.split(',') || [
      'https://material-index.com',
      'https://www.material-index.com'
    ];
    
    // Allow requests with no origin (mobile apps, Postman, etc.)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  optionsSuccessStatus: 200,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: [
    'Content-Type',
    'Authorization',
    'X-Requested-With',
    'X-API-Key'
  ]
};

export const corsMiddleware = cors(corsOptions);
```

### Security Headers
```typescript
import helmet from 'helmet';

export const securityHeaders = helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: ["'self'", "https://api.material-index.com"],
      frameSrc: ["'none'"],
      objectSrc: ["'none'"],
      baseUri: ["'self'"],
      formAction: ["'self'"]
    }
  },
  crossOriginEmbedderPolicy: false,
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true
  },
  noSniff: true,
  xssFilter: true,
  referrerPolicy: { policy: 'strict-origin-when-cross-origin' }
});
```

## 🔍 Logging & Monitoring

### Security Event Logging
```typescript
// Security event logger
export const logSecurityEvent = (event: string, details: any, req: Request) => {
  const logEntry = {
    timestamp: new Date().toISOString(),
    event,
    details,
    ip: req.ip,
    userAgent: req.get('User-Agent'),
    apiKey: req.apiKey?.id,
    userId: req.user?.id,
    requestId: req.id
  };
  
  logger.warn('Security Event', logEntry);
  
  // Send to security monitoring service
  if (process.env.SECURITY_WEBHOOK_URL) {
    fetch(process.env.SECURITY_WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(logEntry)
    }).catch(error => {
      logger.error('Failed to send security event:', error);
    });
  }
};

// Usage in middleware
export const securityMiddleware = (req: Request, res: Response, next: NextFunction) => {
  // Log suspicious activity
  if (req.headers['user-agent']?.includes('bot') && !req.headers['user-agent']?.includes('Googlebot')) {
    logSecurityEvent('SUSPICIOUS_USER_AGENT', { userAgent: req.headers['user-agent'] }, req);
  }
  
  // Log high request volume
  if (req.apiKey?.usage_count > 10000) {
    logSecurityEvent('HIGH_USAGE', { usageCount: req.apiKey.usage_count }, req);
  }
  
  next();
};
```

### Error Handling
```typescript
// Secure error handling
export const errorHandler = (error: Error, req: Request, res: Response, next: NextFunction) => {
  // Log error details
  logger.error('API Error', {
    error: error.message,
    stack: error.stack,
    url: req.url,
    method: req.method,
    ip: req.ip,
    userAgent: req.get('User-Agent'),
    apiKey: req.apiKey?.id,
    userId: req.user?.id
  });
  
  // Don't expose internal errors
  if (error instanceof ValidationError) {
    return res.status(400).json({
      error: {
        code: 'VALIDATION_ERROR',
        message: 'Invalid request parameters',
        details: error.details
      }
    });
  }
  
  if (error instanceof AuthenticationError) {
    return res.status(401).json({
      error: {
        code: 'AUTHENTICATION_ERROR',
        message: 'Authentication failed'
      }
    });
  }
  
  if (error instanceof AuthorizationError) {
    return res.status(403).json({
      error: {
        code: 'AUTHORIZATION_ERROR',
        message: 'Access denied'
      }
    });
  }
  
  // Generic error response
  res.status(500).json({
    error: {
      code: 'INTERNAL_ERROR',
      message: 'An internal error occurred'
    }
  });
};
```

## 🔐 Data Protection

### Data Encryption
```typescript
// Encrypt sensitive data
import crypto from 'crypto';

const algorithm = 'aes-256-gcm';
const secretKey = process.env.ENCRYPTION_KEY!;

export const encrypt = (text: string): string => {
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipher(algorithm, secretKey);
  
  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  
  const authTag = cipher.getAuthTag();
  
  return iv.toString('hex') + ':' + authTag.toString('hex') + ':' + encrypted;
};

export const decrypt = (encryptedText: string): string => {
  const [ivHex, authTagHex, encrypted] = encryptedText.split(':');
  
  const iv = Buffer.from(ivHex, 'hex');
  const authTag = Buffer.from(authTagHex, 'hex');
  
  const decipher = crypto.createDecipher(algorithm, secretKey);
  decipher.setAuthTag(authTag);
  
  let decrypted = decipher.update(encrypted, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  
  return decrypted;
};
```

### PII Protection
```typescript
// Remove PII from logs
export const sanitizeLogData = (data: any): any => {
  const sensitiveFields = ['email', 'phone', 'ssn', 'credit_card', 'password'];
  
  const sanitize = (obj: any): any => {
    if (typeof obj !== 'object' || obj === null) return obj;
    
    if (Array.isArray(obj)) {
      return obj.map(sanitize);
    }
    
    const sanitized: any = {};
    for (const [key, value] of Object.entries(obj)) {
      if (sensitiveFields.some(field => key.toLowerCase().includes(field))) {
        sanitized[key] = '[REDACTED]';
      } else {
        sanitized[key] = sanitize(value);
      }
    }
    
    return sanitized;
  };
  
  return sanitize(data);
};
```

## 🚨 Incident Response

### Security Incident Response Plan
```typescript
// Security incident detection
export const detectSecurityIncident = (req: Request, res: Response, next: NextFunction) => {
  const suspiciousPatterns = [
    /\.\.\//,  // Directory traversal
    /<script/i,  // XSS attempts
    /union.*select/i,  // SQL injection
    /eval\(/i,  // Code injection
    /javascript:/i  // JavaScript injection
  ];
  
  const requestString = JSON.stringify({
    url: req.url,
    body: req.body,
    query: req.query,
    headers: req.headers
  });
  
  for (const pattern of suspiciousPatterns) {
    if (pattern.test(requestString)) {
      logSecurityEvent('SUSPICIOUS_REQUEST', {
        pattern: pattern.toString(),
        request: requestString
      }, req);
      
      return res.status(400).json({
        error: {
          code: 'SUSPICIOUS_REQUEST',
          message: 'Request blocked for security reasons'
        }
      });
    }
  }
  
  next();
};
```

### Automated Response
```typescript
// Automatic IP blocking
export const autoBlockSuspiciousIPs = async (ip: string, reason: string) => {
  try {
    await redis.setex(`blocked_ip:${ip}`, 3600, reason); // Block for 1 hour
    logger.warn(`IP ${ip} automatically blocked: ${reason}`);
  } catch (error) {
    logger.error('Failed to block IP:', error);
  }
};

// Check if IP is blocked
export const isIPBlocked = async (ip: string): Promise<boolean> => {
  try {
    const blocked = await redis.get(`blocked_ip:${ip}`);
    return !!blocked;
  } catch (error) {
    logger.error('Failed to check IP block status:', error);
    return false;
  }
};
```

## 📋 Security Checklist

### Pre-deployment Security Checklist
- [ ] All environment variables are properly configured
- [ ] API keys are securely generated and stored
- [ ] OAuth 2.0 and OIDC authentication is implemented
- [ ] Multi-Factor Authentication (MFA) is configured
- [ ] Rate limiting and throttling are properly configured
- [ ] CORS policies are restrictive
- [ ] Security headers are implemented
- [ ] Input validation is comprehensive
- [ ] SQL injection prevention is in place
- [ ] Error handling doesn't expose sensitive information
- [ ] Logging is configured and secure
- [ ] RLS policies are properly set up
- [ ] SSL/TLS certificates are valid
- [ ] Dependencies are up to date and vulnerability-free
- [ ] Security scanning is configured
- [ ] Fuzz testing is implemented
- [ ] Security audit procedures are in place
- [ ] Backup and recovery procedures are tested

### Ongoing Security Maintenance
- [ ] Regular security audits
- [ ] Dependency updates
- [ ] Security patch management
- [ ] Log monitoring and analysis
- [ ] Incident response testing
- [ ] Penetration testing
- [ ] Security training for team
- [ ] Compliance monitoring
- [ ] Backup verification
- [ ] Access review and cleanup

## 📦 Dependency Management

### Vulnerability Tracking
```typescript
// Dependency vulnerability scanning
import { execSync } from 'child_process';
import fs from 'fs';

// Automated dependency audit
export const auditDependencies = async () => {
  try {
    // Run npm audit
    const auditResult = execSync('npm audit --json', { encoding: 'utf8' });
    const auditData = JSON.parse(auditResult);
    
    // Check for high/critical vulnerabilities
    const vulnerabilities = auditData.vulnerabilities || {};
    const criticalVulns = Object.values(vulnerabilities).filter(
      (vuln: any) => vuln.severity === 'critical' || vuln.severity === 'high'
    );
    
    if (criticalVulns.length > 0) {
      logger.warn('Critical vulnerabilities found:', criticalVulns);
      
      // Send alert to security team
      await sendSecurityAlert({
        type: 'DEPENDENCY_VULNERABILITY',
        severity: 'HIGH',
        details: criticalVulns,
        timestamp: new Date().toISOString()
      });
    }
    
    return auditData;
  } catch (error) {
    logger.error('Dependency audit failed:', error);
    throw error;
  }
};

// Automated dependency updates
export const updateDependencies = async () => {
  try {
    // Update dependencies
    execSync('npm update', { stdio: 'inherit' });
    
    // Run audit after update
    await auditDependencies();
    
    logger.info('Dependencies updated successfully');
  } catch (error) {
    logger.error('Dependency update failed:', error);
    throw error;
  }
};

// Check for outdated packages
export const checkOutdatedPackages = async () => {
  try {
    const outdatedResult = execSync('npm outdated --json', { encoding: 'utf8' });
    const outdatedData = JSON.parse(outdatedResult);
    
    const outdatedPackages = Object.keys(outdatedData);
    
    if (outdatedPackages.length > 0) {
      logger.info('Outdated packages found:', outdatedPackages);
      
      // Generate report
      const report = {
        timestamp: new Date().toISOString(),
        outdated_packages: outdatedData,
        recommendations: generateUpdateRecommendations(outdatedData)
      };
      
      fs.writeFileSync('dependency-report.json', JSON.stringify(report, null, 2));
    }
    
    return outdatedData;
  } catch (error) {
    logger.error('Outdated package check failed:', error);
    return {};
  }
};

// Generate update recommendations
const generateUpdateRecommendations = (outdatedData: any) => {
  const recommendations = [];
  
  for (const [packageName, info] of Object.entries(outdatedData)) {
    const pkg = info as any;
    if (pkg.current !== pkg.latest) {
      recommendations.push({
        package: packageName,
        current: pkg.current,
        latest: pkg.latest,
        type: pkg.type,
        homepage: pkg.homepage,
        priority: pkg.latest.includes('beta') || pkg.latest.includes('alpha') ? 'low' : 'high'
      });
    }
  }
  
  return recommendations;
};
```

### Security Audit & Fuzz Testing
```typescript
// Comprehensive security audit
export const performSecurityAudit = async () => {
  const auditResults = {
    timestamp: new Date().toISOString(),
    dependencies: await auditDependencies(),
    outdated: await checkOutdatedPackages(),
    fuzz_tests: await runFuzzTests(),
    penetration_tests: await runPenetrationTests(),
    configuration_scan: await scanConfiguration()
  };
  
  // Generate security report
  const report = generateSecurityReport(auditResults);
  
  // Store report
  fs.writeFileSync('security-audit-report.json', JSON.stringify(report, null, 2));
  
  return report;
};

// Fuzz testing for API endpoints
export const runFuzzTests = async () => {
  const fuzzResults = [];
  const endpoints = [
    '/api/materials',
    '/api/materials/search',
    '/api/categories',
    '/api/properties'
  ];
  
  for (const endpoint of endpoints) {
    const fuzzData = generateFuzzData();
    
    for (const testCase of fuzzData) {
      try {
        const response = await fetch(`${process.env.API_BASE_URL}${endpoint}`, {
          method: 'GET',
          headers: { 'Authorization': `Bearer ${testCase.token}` },
          body: testCase.body
        });
        
        fuzzResults.push({
          endpoint,
          test_case: testCase.name,
          status: response.status,
          response_time: response.headers.get('x-response-time'),
          vulnerabilities: analyzeResponse(response, testCase)
        });
      } catch (error) {
        fuzzResults.push({
          endpoint,
          test_case: testCase.name,
          error: error.message,
          status: 'ERROR'
        });
      }
    }
  }
  
  return fuzzResults;
};

// Generate fuzz test data
const generateFuzzData = () => {
  return [
    { name: 'SQL Injection', token: "'; DROP TABLE users; --", body: null },
    { name: 'XSS Attack', token: '<script>alert("xss")</script>', body: null },
    { name: 'Path Traversal', token: '../../../etc/passwd', body: null },
    { name: 'Buffer Overflow', token: 'A'.repeat(10000), body: null },
    { name: 'Null Byte', token: 'test\x00', body: null },
    { name: 'Unicode Attack', token: 'test\u0000', body: null },
    { name: 'Command Injection', token: 'test; rm -rf /', body: null },
    { name: 'LDAP Injection', token: 'test)(&(password=*))', body: null }
  ];
};

// Penetration testing
export const runPenetrationTests = async () => {
  const penTests = [];
  
  // Test authentication bypass
  penTests.push(await testAuthBypass());
  
  // Test privilege escalation
  penTests.push(await testPrivilegeEscalation());
  
  // Test session management
  penTests.push(await testSessionManagement());
  
  // Test input validation
  penTests.push(await testInputValidation());
  
  return penTests;
};

// Configuration security scan
export const scanConfiguration = async () => {
  const configIssues = [];
  
  // Check for hardcoded secrets
  const secrets = await scanForSecrets();
  if (secrets.length > 0) {
    configIssues.push({
      type: 'HARDCODED_SECRETS',
      severity: 'HIGH',
      details: secrets
    });
  }
  
  // Check CORS configuration
  const corsIssues = await checkCORSConfiguration();
  if (corsIssues.length > 0) {
    configIssues.push({
      type: 'CORS_MISCONFIGURATION',
      severity: 'MEDIUM',
      details: corsIssues
    });
  }
  
  // Check security headers
  const headerIssues = await checkSecurityHeaders();
  if (headerIssues.length > 0) {
    configIssues.push({
      type: 'MISSING_SECURITY_HEADERS',
      severity: 'MEDIUM',
      details: headerIssues
    });
  }
  
  return configIssues;
};
```

## 🔍 Security Testing

### Automated Security Testing
```bash
# OWASP ZAP security scanning
docker run -t owasp/zap2docker-stable zap-baseline.py -t https://api.material-index.com

# Dependency vulnerability scanning
npm audit
npm audit fix

# Code security scanning
npm install -g snyk
snyk test
snyk monitor
```

### Manual Security Testing
- [ ] API endpoint testing
- [ ] Authentication bypass attempts
- [ ] Input validation testing
- [ ] Rate limiting verification
- [ ] CORS policy testing
- [ ] Error message analysis
- [ ] Session management testing
- [ ] File upload security
- [ ] SQL injection testing
- [ ] XSS vulnerability testing
