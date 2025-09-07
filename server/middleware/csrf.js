const csrf = require('csrf');
const crypto = require('crypto');

// Create CSRF instance with custom secret
const tokens = csrf();

// Generate a secure secret for CSRF tokens
const generateSecret = () => {
    return crypto.randomBytes(32).toString('hex');
};

// Store secrets in memory (in production, consider using Redis or database)
const secrets = new Map();

// CSRF middleware factory
const createCSRFMiddleware = (options = {}) => {
    const {
        ignoreMethods = ['GET', 'HEAD', 'OPTIONS'],
        ignorePaths = [],
        cookieName = '_csrf',
        headerName = 'x-csrf-token',
        bodyName = '_csrf',
        secretLength = 18,
        saltLength = 8
    } = options;

    return (req, res, next) => {
        // Skip CSRF for ignored methods
        if (ignoreMethods.includes(req.method)) {
            return next();
        }

        // Skip CSRF for ignored paths
        if (ignorePaths.some(path => req.path.startsWith(path))) {
            return next();
        }

        // Get or create secret for this session
        const sessionId = req.sessionID || req.ip || 'anonymous';
        let secret = secrets.get(sessionId);
        
        if (!secret) {
            secret = generateSecret();
            secrets.set(sessionId, secret);
        }

        // Generate CSRF token
        const token = tokens.create(secret);

        // Store token in response locals for use in templates
        res.locals.csrfToken = token;

        // Set CSRF token in cookie
        res.cookie(cookieName, token, {
            httpOnly: false, // Allow client-side access
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 24 * 60 * 60 * 1000 // 24 hours
        });

        // Verify CSRF token for state-changing requests
        if (['POST', 'PUT', 'PATCH', 'DELETE'].includes(req.method)) {
            const tokenFromRequest = 
                req.headers[headerName.toLowerCase()] || 
                req.body[bodyName] || 
                req.query[bodyName];

            if (!tokenFromRequest) {
                return res.status(403).json({
                    success: false,
                    message: 'CSRF token missing',
                    error: 'MISSING_CSRF_TOKEN'
                });
            }

            if (!tokens.verify(secret, tokenFromRequest)) {
                return res.status(403).json({
                    success: false,
                    message: 'Invalid CSRF token',
                    error: 'INVALID_CSRF_TOKEN'
                });
            }
        }

        next();
    };
};

// CSRF token generation endpoint middleware
const generateCSRFToken = (req, res, next) => {
    try {
        const sessionId = req.sessionID || req.ip || 'anonymous';
        let secret = secrets.get(sessionId);
        
        if (!secret) {
            secret = generateSecret();
            secrets.set(sessionId, secret);
        }

        const token = tokens.create(secret);
        
        res.json({
            success: true,
            csrfToken: token
        });
    } catch (error) {
        console.error('Error generating CSRF token:', error);
        res.status(500).json({
            success: false,
            message: 'Error generating CSRF token'
        });
    }
};

// Clean up old secrets periodically (optional)
const cleanupSecrets = () => {
    // In a real application, you might want to implement a more sophisticated
    // cleanup mechanism based on session expiration
    const maxAge = 24 * 60 * 60 * 1000; // 24 hours
    const now = Date.now();
    
    for (const [sessionId, secret] of secrets.entries()) {
        // This is a simplified cleanup - in production, track creation time
        // and remove expired secrets
        if (Math.random() < 0.01) { // 1% chance to clean up
            secrets.delete(sessionId);
        }
    }
};

// Run cleanup every hour
setInterval(cleanupSecrets, 60 * 60 * 1000);

module.exports = {
    createCSRFMiddleware,
    generateCSRFToken,
    tokens
};
