require('dotenv').config(); // Load environment variables
const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const authRouter =require('./routes/auth/auth-routes')
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

     app.use(
        cors({
            origin: 'http://localhost:5173',
            methods : ['GET', 'POST', 'PUT', 'DELETE'],
            allowedHeaders : [
                'Content-Type',
                'Authorization',
                'Cache-Control',
                'Expires',
                'Pragma'
            ],
            credentials: true
        })
     );

     app.use(express.json());
     app.use(cookieParser());

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