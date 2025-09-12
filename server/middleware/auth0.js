const { auth } = require('express-oauth2-jwt-bearer');
const auth0Config = require('../config/auth0');

console.log('Auth0 Config:', auth0Config);

// Middleware to verify Auth0 JWT tokens
const checkJwt = auth({
  audience: auth0Config.audience,
  issuerBaseURL: `https://${auth0Config.domain}`,
  tokenSigningAlg: 'RS256'
});

// Wrap the middleware to add better error handling
const checkJwtWithErrorHandling = (req, res, next) => {
  console.log('Auth0 JWT verification - Request URL:', req.url);
  console.log('Auth0 JWT verification - Authorization header:', req.headers.authorization ? 'Present' : 'Missing');
  
  checkJwt(req, res, (err) => {
    if (err) {
      console.error('Auth0 JWT verification error:', {
        message: err.message,
        name: err.name,
        statusCode: err.statusCode,
        error: err.error,
        errorDescription: err.errorDescription,
        headers: req.headers
      });
      return res.status(401).json({
        success: false,
        message: 'Authentication failed',
        error: err.message
      });
    }
    console.log('Auth0 JWT verification successful for:', req.auth?.payload?.sub);
    next();
  });
};

module.exports = { checkJwt: checkJwtWithErrorHandling };
