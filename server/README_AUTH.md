# Authentication & Session Management

## Overview

This backend implements a comprehensive authentication system with:
- ✅ **JWT tokens stored in httpOnly cookies** (secure, not accessible via JavaScript)
- ✅ **Magic Link authentication** via Supabase
- ✅ **OAuth authentication** (Google & Facebook) via Supabase
- ✅ **Redis session management** via Upstash
- ✅ **PostgreSQL user storage** via Neon

## Authentication Flow

### 1. Magic Link Authentication

**Send Magic Link:**
```bash
POST /api/magic-link/send
Content-Type: application/json

{
  "email": "user@example.com"
}
```

**Verify Magic Link:**
```bash
POST /api/magic-link/verify
Content-Type: application/json

{
  "token": "magic-link-token",
  "email": "user@example.com"
}
```

**Verify OTP (Supabase):**
```bash
POST /api/magic-link/verify-otp
Content-Type: application/json

{
  "email": "user@example.com",
  "token": "123456"
}
```

### 2. OAuth Authentication

**Google OAuth:**
```bash
# Initiate OAuth flow
GET /api/auth/google

# Callback (automatically handled)
GET /api/auth/oauth/callback
```

**Facebook OAuth:**
```bash
# Initiate OAuth flow
GET /api/auth/facebook

# Callback (automatically handled)
GET /api/auth/oauth/callback
```

### 3. Get Current User

```bash
GET /api/auth/me
Cookie: auth_token=<jwt-token>
```

### 4. Logout

```bash
POST /api/auth/logout
Cookie: auth_token=<jwt-token>
```

## Cookie-Based Authentication

### Why Cookies Over localStorage?

1. **Security**: httpOnly cookies cannot be accessed by JavaScript (XSS protection)
2. **CSRF Protection**: Use sameSite='lax' to prevent CSRF attacks
3. **Automatic**: Browser automatically sends cookies with requests

## Environment Variables

Required in `.env`:

```env
# JWT
JWT_SECRET=your-secret-key
JWT_EXPIRES_IN=7d

# Supabase (Magic Links & OAuth)
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key
G0OGLE_CALLBACK=https://your-project.supabase.co/auth/v1/callback
FACEBOOK_CALLBACK=https://your-project.supabase.co/auth/v1/callback

# Redis (Sessions)
UPSTASH_REDIS_REST_URL=https://your-redis.upstash.io
UPSTASH_REDIS_REST_TOKEN=your-token

# Database (User Storage)
DATABASE_URL=postgresql://user:pass@host:5432/db

# URLs
BACKEND_URL=http://localhost:5000
FRONTEND_URL=http://localhost:3000
```

## Security Features

1. **httpOnly Cookies**: Prevents XSS attacks
2. **CORS**: Only allows requests from FRONTEND_URL
3. **JWT Expiry**: Tokens expire after 7 days
4. **Redis Expiry**: Magic links expire after 15 minutes
5. **sameSite Cookie**: Prevents CSRF attacks
6. **Secure Flag**: HTTPS-only in production

## Database Schema

```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  avatar TEXT,
  provider VARCHAR(50) NOT NULL DEFAULT 'email',
  provider_id VARCHAR(255),
  is_verified BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(provider, provider_id)
);
```

## Testing

```bash
# Test magic link
curl -X POST http://localhost:5000/api/magic-link/send \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com"}'

# Test current user (with cookie)
curl http://localhost:5000/api/auth/me \
  -H "Cookie: auth_token=YOUR_JWT_TOKEN"

# Test logout
curl -X POST http://localhost:5000/api/auth/logout \
  -H "Cookie: auth_token=YOUR_JWT_TOKEN"
```

## Troubleshooting

### Magic links not sending?
- Verify Supabase credentials
- Check Supabase email templates configuration

### OAuth not working?
- Verify Supabase OAuth providers are configured
- Check that G0OGLE_CALLBACK and FACEBOOK_CALLBACK are set correctly
- Ensure the redirect URLs are whitelisted in Supabase dashboard