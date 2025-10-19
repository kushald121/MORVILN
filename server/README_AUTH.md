# Authentication & Session Management

## Overview

This backend implements a comprehensive authentication system with:
- ✅ **JWT tokens stored in httpOnly cookies** (secure, not accessible via JavaScript)
- ✅ **Magic Link authentication** via Supabase
- ✅ **OAuth authentication** (Google & Instagram)
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
GET /api/auth/google/callback
```

**Instagram OAuth:**
```bash
# Initiate OAuth flow
GET /api/auth/instagram

# Callback (automatically handled)
GET /api/auth/instagram/callback
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

### Cookie Configuration

```typescript
res.cookie('auth_token', token, {
  httpOnly: true,              // Cannot be accessed via JavaScript
  secure: NODE_ENV === 'production',  // HTTPS only in production
  sameSite: 'lax',            // CSRF protection
  maxAge: 7 * 24 * 60 * 60 * 1000  // 7 days
});
```

### Frontend Usage

No need to manually handle tokens! The browser automatically sends the cookie:

```javascript
// Frontend request example
fetch('http://localhost:5000/api/auth/me', {
  method: 'GET',
  credentials: 'include'  // Important: include cookies
})
```

## Redis Session Management

Redis is used for:
- Magic link token storage (15 min expiry)
- Guest cart data
- Temporary session data

### Redis Operations

```typescript
import { redis } from './config/redis';

// Set with expiry
await redis.setex('key', 900, 'value');  // 15 minutes

// Get
const value = await redis.get('key');

// Delete
await redis.del('key');
```

## Environment Variables

Required in `.env`:

```env
# JWT
JWT_SECRET=your-secret-key
JWT_EXPIRES_IN=7d

# Supabase (Magic Links)
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key

# Redis (Sessions)
UPSTASH_REDIS_REST_URL=https://your-redis.upstash.io
UPSTASH_REDIS_REST_TOKEN=your-token

# Database (User Storage)
DATABASE_URL=postgresql://user:pass@host:5432/db

# OAuth
GOOGLE_CLIENT_ID=your-client-id
GOOGLE_CLIENT_SECRET=your-secret
INSTAGRAM_OAUTH_ID=your-oauth-id
INSTAGRAM_APP_SECRET=your-secret

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

## Migration from localStorage

If you were previously using localStorage:

**Before:**
```javascript
// Save token
localStorage.setItem('token', response.token);

// Use token
fetch('/api/auth/me', {
  headers: {
    'Authorization': `Bearer ${localStorage.getItem('token')}`
  }
});
```

**After:**
```javascript
// No need to save - cookie is automatic!

// Use with credentials
fetch('http://localhost:5000/api/auth/me', {
  credentials: 'include'  // Just add this!
});
```

## Troubleshooting

### Cookies not being set?
- Check CORS credentials are enabled
- Verify FRONTEND_URL matches your frontend origin
- Ensure `credentials: 'include'` in fetch requests

### Redis not working?
- Verify UPSTASH credentials in `.env`
- Check Redis connection in server logs

### Magic links not sending?
- Verify Supabase credentials
- Check Supabase email templates configuration
