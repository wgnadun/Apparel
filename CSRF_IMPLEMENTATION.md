# CSRF Protection Implementation

This document describes the CSRF (Cross-Site Request Forgery) protection implementation for the Apparel project.

## Overview

CSRF protection has been implemented using a modern approach with the `csrf` package, providing protection against cross-site request forgery attacks while maintaining a good user experience.

## Server-Side Implementation

### 1. CSRF Middleware (`server/middleware/csrf.js`)

The CSRF middleware provides:
- Token generation and validation
- Session-based secret management
- Configurable options for different environments
- Automatic cleanup of expired secrets

**Key Features:**
- Uses cryptographically secure random tokens
- Supports both header and form-based token submission
- Configurable ignore methods and paths
- Memory-based secret storage (can be extended to Redis/database)

### 2. Server Configuration (`server/server.js`)

**CSRF Middleware Setup:**
```javascript
const csrfMiddleware = createCSRFMiddleware({
    ignoreMethods: ['GET', 'HEAD', 'OPTIONS'],
    ignorePaths: ['/api/auth0'], // Skip CSRF for Auth0 routes
    cookieName: '_csrf',
    headerName: 'x-csrf-token',
    bodyName: '_csrf'
});
```

**CORS Configuration:**
- Added `X-CSRF-Token` to allowed headers
- Maintains credentials support for cookie-based tokens

**CSRF Token Endpoint:**
- `GET /api/csrf-token` - Returns a new CSRF token for client-side requests

## Client-Side Implementation

### 1. CSRF Service (`client/src/services/csrfService.js`)

**Features:**
- Singleton pattern for token management
- Automatic token fetching and caching
- Support for both header and form-based tokens
- Error handling and token refresh capabilities

**Usage:**
```javascript
import csrfService from '../services/csrfService';

// Get token for headers
const headers = await csrfService.getTokenForHeaders();

// Get token for form data
const formData = await csrfService.getTokenForForm();
```

### 2. API Integration (`client/src/services/api.js`)

**Automatic CSRF Token Inclusion:**
- Request interceptors automatically add CSRF tokens to state-changing requests
- Works with both authenticated and non-authenticated API calls
- Graceful error handling if token fetch fails

### 3. React Hook (`client/src/hooks/useCSRF.js`)

**Features:**
- React hook for CSRF token management
- Loading states and error handling
- Token refresh capabilities
- Auto-fetch on component mount

**Usage:**
```javascript
import { useCSRF } from '../hooks/useCSRF';

const MyComponent = () => {
  const { token, loading, error, refreshToken } = useCSRF();
  
  // Use token in your component
};
```

### 4. CSRF Token Component (`client/src/components/common/csrf-token.jsx`)

**Features:**
- React component for form integration
- Automatically includes CSRF token in forms
- Handles loading and error states gracefully

**Usage:**
```javascript
import CSRFToken from '../components/common/csrf-token';

const MyForm = () => (
  <form>
    <CSRFToken />
    {/* Other form fields */}
  </form>
);
```

## Security Features

### 1. Token Generation
- Uses cryptographically secure random tokens
- 32-byte secrets with 18-character tokens
- Unique tokens per session/IP

### 2. Token Validation
- Validates tokens on all state-changing requests (POST, PUT, PATCH, DELETE)
- Supports both header (`X-CSRF-Token`) and form field (`_csrf`) submission
- Secure token comparison to prevent timing attacks

### 3. Session Management
- Session-based secret storage
- Automatic cleanup of expired secrets
- IP-based fallback for anonymous users

### 4. Error Handling
- Clear error messages for missing/invalid tokens
- Graceful degradation when CSRF service is unavailable
- Comprehensive logging for security monitoring

## Configuration Options

### Server-Side Options
```javascript
{
    ignoreMethods: ['GET', 'HEAD', 'OPTIONS'], // Methods to skip CSRF
    ignorePaths: ['/api/auth0'], // Paths to skip CSRF
    cookieName: '_csrf', // Cookie name for token
    headerName: 'x-csrf-token', // Header name for token
    bodyName: '_csrf', // Form field name for token
    secretLength: 18, // Token length
    saltLength: 8 // Salt length
}
```

### Environment Variables
- `NODE_ENV` - Controls secure cookie settings
- `CLIENT_URL` - CORS origin configuration

## Testing CSRF Protection

### 1. Valid Requests
```javascript
// With header
fetch('/api/shop/cart', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'X-CSRF-Token': 'your-csrf-token'
  },
  credentials: 'include',
  body: JSON.stringify(data)
});

// With form data
const formData = new FormData();
formData.append('_csrf', 'your-csrf-token');
formData.append('other', 'data');

fetch('/api/shop/cart', {
  method: 'POST',
  credentials: 'include',
  body: formData
});
```

### 2. Invalid Requests (Should Fail)
```javascript
// Missing token
fetch('/api/shop/cart', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  credentials: 'include',
  body: JSON.stringify(data)
});

// Invalid token
fetch('/api/shop/cart', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'X-CSRF-Token': 'invalid-token'
  },
  credentials: 'include',
  body: JSON.stringify(data)
});
```

## Production Considerations

### 1. Secret Storage
- Current implementation uses in-memory storage
- For production, consider Redis or database storage
- Implement proper session management

### 2. Token Expiration
- Current tokens don't expire automatically
- Consider implementing token expiration for enhanced security
- Implement proper cleanup mechanisms

### 3. Monitoring
- Monitor CSRF token failures
- Log suspicious activities
- Set up alerts for repeated failures

### 4. Performance
- Token generation is fast but consider caching
- Monitor memory usage for secret storage
- Consider token pooling for high-traffic applications

## Troubleshooting

### Common Issues

1. **CSRF Token Missing Error**
   - Ensure client is fetching tokens before making requests
   - Check CORS configuration includes `X-CSRF-Token` header
   - Verify cookies are being sent with requests

2. **Invalid CSRF Token Error**
   - Check if token is being corrupted during transmission
   - Verify token format and length
   - Ensure same session is being used for token generation and validation

3. **CORS Issues**
   - Ensure `X-CSRF-Token` is in allowed headers
   - Verify credentials are enabled
   - Check origin configuration

### Debug Mode
Enable debug logging by setting:
```javascript
process.env.DEBUG = 'csrf:*';
```

## Future Enhancements

1. **Redis Integration** - Move secret storage to Redis for scalability
2. **Token Expiration** - Implement automatic token expiration
3. **Rate Limiting** - Add rate limiting for token generation
4. **Analytics** - Add CSRF protection analytics and monitoring
5. **Mobile Support** - Enhanced mobile app CSRF protection

## References

- [OWASP CSRF Prevention Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Cross-Site_Request_Forgery_Prevention_Cheat_Sheet.html)
- [Express.js Security Best Practices](https://expressjs.com/en/advanced/best-practice-security.html)
- [CSRF Package Documentation](https://www.npmjs.com/package/csrf)
