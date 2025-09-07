const { auth } = require('express-oauth2-jwt-bearer');
const auth0Config = require('../config/auth0');

// Middleware to verify Auth0 JWT tokens
const checkJwt = auth({
  audience: auth0Config.audience,
  issuerBaseURL: `https://${auth0Config.domain}`,
  tokenSigningAlg: 'RS256'
});

module.exports = { checkJwt };
