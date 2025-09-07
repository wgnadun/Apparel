const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss');

// Rate limiting configurations
const createRateLimit = (windowMs, max, message) => {
    return rateLimit({
        windowMs,
        max,
        message: {
            success: false,
            message: message || 'Too many requests, please try again later.'
        },
        standardHeaders: true,
        legacyHeaders: false,
    });
};

// Different rate limits for different endpoints
const rateLimits = {
    // General API rate limit
    general: createRateLimit(15 * 60 * 1000, 200, 'Too many requests from this IP, please try again later.'), // 200 requests per 15 minutes
    
    // Auth endpoints - more reasonable for development and normal usage
    auth: createRateLimit(15 * 60 * 1000, 50, 'Too many authentication attempts, please try again later.'), // 50 attempts per 15 minutes
    
    // Password reset - very restrictive
    passwordReset: createRateLimit(60 * 60 * 1000, 5, 'Too many password reset attempts, please try again in an hour.'), // 5 attempts per hour
    
    // File upload - moderate limit
    upload: createRateLimit(60 * 60 * 1000, 30, 'Too many file uploads, please try again later.'), // 30 uploads per hour
    
    // Search - moderate limit
    search: createRateLimit(60 * 1000, 50, 'Too many search requests, please slow down.'), // 50 searches per minute
};

// Security headers middleware
const securityHeaders = helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
            fontSrc: ["'self'", "https://fonts.gstatic.com"],
            imgSrc: ["'self'", "data:", "https:", "http:"],
            scriptSrc: ["'self'"],
            connectSrc: ["'self'"],
            frameSrc: ["'none'"],
            objectSrc: ["'none'"],
            upgradeInsecureRequests: [],
        },
    },
    crossOriginEmbedderPolicy: false,
    hsts: {
        maxAge: 31536000,
        includeSubDomains: true,
        preload: true
    }
});

// MongoDB injection protection - simplified version
const mongoSanitization = (req, res, next) => {
    try {
        // Sanitize req.body
        if (req.body && typeof req.body === 'object') {
            req.body = sanitizeObject(req.body);
        }
        
        // Sanitize req.query - be more permissive for valid query parameters
        if (req.query && typeof req.query === 'object') {
            const sanitizedQuery = {};
            for (const [key, value] of Object.entries(req.query)) {
                // Only remove dangerous MongoDB operators, allow normal query params
                if (!key.startsWith('$') && !key.includes('__proto__') && !key.includes('constructor')) {
                    sanitizedQuery[key] = value;
                }
            }
            // Only replace if we actually sanitized something
            if (Object.keys(sanitizedQuery).length !== Object.keys(req.query).length) {
                req.query = sanitizedQuery;
            }
        }
        
        // Sanitize req.params
        if (req.params && typeof req.params === 'object') {
            req.params = sanitizeObject(req.params);
        }
        
        next();
    } catch (error) {
        console.error('MongoDB sanitization error:', error);
        next();
    }
};

// XSS protection
const xssProtection = (req, res, next) => {
    if (req.body) {
        req.body = sanitizeObject(req.body);
    }
    if (req.query) {
        req.query = sanitizeObject(req.query);
    }
    if (req.params) {
        req.params = sanitizeObject(req.params);
    }
    next();
};

// Recursively sanitize objects
const sanitizeObject = (obj) => {
    if (typeof obj === 'string') {
        return xss(obj, {
            whiteList: {},
            stripIgnoreTag: true,
            stripIgnoreTagBody: ['script']
        });
    }
    
    if (Array.isArray(obj)) {
        return obj.map(sanitizeObject);
    }
    
    if (obj && typeof obj === 'object') {
        const sanitized = {};
        for (const key in obj) {
            if (Object.prototype.hasOwnProperty.call(obj, key)) {
                sanitized[key] = sanitizeObject(obj[key]);
            }
        }
        return sanitized;
    }
    
    return obj;
};

// Input validation and sanitization middleware
const inputSanitization = (req, res, next) => {
    // Remove any potential HTML/script tags from string inputs
    const sanitizeString = (str) => {
        if (typeof str !== 'string') return str;
        return str
            .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
            .replace(/<[^>]*>/g, '')
            .replace(/javascript:/gi, '')
            .replace(/on\w+\s*=/gi, '')
            .trim();
    };

    // Recursively sanitize request data
    const sanitizeData = (data) => {
        if (typeof data === 'string') {
            return sanitizeString(data);
        }
        if (Array.isArray(data)) {
            return data.map(sanitizeData);
        }
        if (data && typeof data === 'object') {
            const sanitized = {};
            for (const key in data) {
                if (Object.prototype.hasOwnProperty.call(data, key)) {
                    sanitized[key] = sanitizeData(data[key]);
                }
            }
            return sanitized;
        }
        return data;
    };

    if (req.body) {
        req.body = sanitizeData(req.body);
    }
    if (req.query) {
        req.query = sanitizeData(req.query);
    }
    if (req.params) {
        req.params = sanitizeData(req.params);
    }

    next();
};

// File upload security middleware
const fileUploadSecurity = (req, res, next) => {
    if (req.file) {
        // Check file type
        const allowedMimeTypes = [
            'image/jpeg',
            'image/jpg', 
            'image/png',
            'image/gif',
            'image/webp'
        ];
        
        if (!allowedMimeTypes.includes(req.file.mimetype)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid file type. Only images are allowed.'
            });
        }
        
        // Check file size (5MB limit)
        const maxSize = 5 * 1024 * 1024; // 5MB
        if (req.file.size > maxSize) {
            return res.status(400).json({
                success: false,
                message: 'File size too large. Maximum size is 5MB.'
            });
        }
        
        // Check for malicious file names
        const maliciousPatterns = [
            /\.\./,  // Directory traversal
            /<script/i,  // Script tags
            /javascript:/i,  // JavaScript protocol
            /vbscript:/i,  // VBScript protocol
            /data:/i  // Data URLs
        ];
        
        if (maliciousPatterns.some(pattern => pattern.test(req.file.originalname))) {
            return res.status(400).json({
                success: false,
                message: 'Invalid file name.'
            });
        }
    }
    
    next();
};

// Request logging middleware for security monitoring
const securityLogging = (req, res, next) => {
    const startTime = Date.now();
    
    // Log suspicious activities
    const suspiciousPatterns = [
        /script/i,
        /javascript/i,
        /vbscript/i,
        /onload/i,
        /onerror/i,
        /eval/i,
        /expression/i,
        /url\(/i,
        /@import/i
    ];
    
    const checkForSuspiciousContent = (data) => {
        if (typeof data === 'string') {
            return suspiciousPatterns.some(pattern => pattern.test(data));
        }
        if (Array.isArray(data)) {
            return data.some(checkForSuspiciousContent);
        }
        if (data && typeof data === 'object') {
            return Object.values(data).some(checkForSuspiciousContent);
        }
        return false;
    };
    
    if (checkForSuspiciousContent(req.body) || 
        checkForSuspiciousContent(req.query) || 
        checkForSuspiciousContent(req.params)) {
        console.warn(`Suspicious activity detected from IP: ${req.ip}`, {
            method: req.method,
            url: req.url,
            userAgent: req.get('User-Agent'),
            timestamp: new Date().toISOString()
        });
    }
    
    next();
};

module.exports = {
    rateLimits,
    securityHeaders,
    mongoSanitization,
    xssProtection,
    inputSanitization,
    fileUploadSecurity,
    securityLogging
};
