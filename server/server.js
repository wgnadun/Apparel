const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const authRouter =require('./routes/auth/auth-routes')
const adminProductsRouter = require('./routes/admin/products-routes');
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
     app.use('/api/admin/products',adminProductsRouter);

     app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
     });        