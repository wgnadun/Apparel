require('dotenv').config(); // Load environment variables
const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const cors = require('cors');

// Import security middleware
const { 
    rateLimits, 
    securityHeaders, 
    mongoSanitization, 
    xssProtection, 
    inputSanitization, 
    fileUploadSecurity
} = require('./middleware/security');

// Import CSRF middleware
const { createCSRFMiddleware, generateCSRFToken } = require('./middleware/csrf');

// Import routes
const authRouter = require('./routes/auth/auth-routes');
const auth0Router = require('./routes/auth0/auth0'); // Add Auth0 routes
const adminProductsRouter = require('./routes/admin/products-routes');
const adminOrderRouter = require('./routes/admin/order-routes');

const shopProductsRouter = require('./routes/shop/products-routes');
const shopCartRouter = require('./routes/shop/cart-routes');
const shopAddressRouter = require('./routes/shop/address-routes');
const shopOrderRouter = require('./routes/shop/order-routes');
const shopSearchRouter = require('./routes/shop/search-routes');
const shopReviewRouter = require('./routes/shop/review-routes');
const shopUserRouter = require('./routes/shop/user-rotes');

const commonFeatureRouter = require('./routes/common/feature-routes');

mongoose
     .connect(
        "mongodb+srv://wgnadundananjaya:SpkTnNzPrjb8mBYT@apperal.np1uklx.mongodb.net/"
     ).then(() =>console.log('MongoDB connected')).catch(error => console.log(error));


     const app = express('');
     const PORT = process.env.PORT || 5000;

     // CORS must be applied before other middleware
     app.use(
        cors({
            origin: process.env.CLIENT_URL || 'http://localhost:5173',
            methods : ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
            allowedHeaders : [
                'Content-Type',
                'Authorization',
                'Cache-Control',
                'Expires',
                'Pragma',
                'X-Requested-With',
                'X-CSRF-Token'
            ],
            credentials: true,
            preflightContinue: false,
            optionsSuccessStatus: 200
        })
     );

     // Security middleware (order matters!)
     app.use(securityHeaders);
     app.use(mongoSanitization);
     app.use(xssProtection);
     app.use(inputSanitization);
     
     // Rate limiting
     app.use('/api/auth', rateLimits.auth);
     app.use('/api/auth0', rateLimits.auth);
     app.use('/api/shop/search', rateLimits.search);
     app.use(rateLimits.general);

     app.use(express.json({ limit: '10mb' }));
     app.use(express.urlencoded({ extended: true, limit: '10mb' }));
     app.use(cookieParser());

     // CSRF token endpoint for client-side requests (must be before CSRF middleware)
     app.get('/api/csrf-token', generateCSRFToken);
     
     // Test endpoint to verify server is working
     app.get('/api/test', (req, res) => {
         res.json({ success: true, message: 'Server is working' });
     });

     // CSRF protection middleware
     const csrfMiddleware = createCSRFMiddleware({
         ignoreMethods: ['GET', 'HEAD', 'OPTIONS'],
         ignorePaths: ['/api/auth0', '/api/csrf-token'], // Skip CSRF for Auth0 routes and CSRF token endpoint
         cookieName: '_csrf',
         headerName: 'x-csrf-token',
         bodyName: '_csrf'
     });
     
     // Apply CSRF protection to all routes
     app.use(csrfMiddleware);

     app.use('/api/auth',authRouter);
     app.use('/api/auth0', auth0Router); // Add Auth0 routes
     app.use('/api/admin/products',adminProductsRouter);
     app.use('/api/admin/orders',adminOrderRouter);

     app.use('/api/shop/products',shopProductsRouter);
     app.use('/api/shop/cart',shopCartRouter);
     app.use('/api/shop/address',shopAddressRouter);
     app.use('/api/shop/order',shopOrderRouter);
     app.use('/api/shop/search',shopSearchRouter);
     app.use('/api/shop/review',shopReviewRouter);
     app.use('/api/shop/user',shopUserRouter);

     app.use('/api/common/feature',commonFeatureRouter);

     app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
     });        