const express = require('express');
const {getFilteredProducts,getProductDetails } = require('../../controllers/shop/products-controller');
const { validationRules } = require('../../middleware/validation');

const router = express.Router();

// Add query parameter validation for products
const validateProductQuery = (req, res, next) => {
    const { sortBy, category, brand } = req.query;
    
    // Validate sortBy parameter
    if (sortBy && !['price-lowtohigh', 'price-hightolow', 'title-atoz', 'title-ztoa'].includes(sortBy)) {
        return res.status(400).json({
            success: false,
            message: 'Invalid sortBy parameter'
        });
    }
    
    // Validate category parameter (if provided)
    if (category && typeof category !== 'string') {
        return res.status(400).json({
            success: false,
            message: 'Invalid category parameter'
        });
    }
    
    // Validate brand parameter (if provided)
    if (brand && typeof brand !== 'string') {
        return res.status(400).json({
            success: false,
            message: 'Invalid brand parameter'
        });
    }
    
    next();
};

router.get('/fetch-all-products', validateProductQuery, getFilteredProducts);
router.get('/fetch-all-products/:id', validationRules.getById, getProductDetails);

module.exports = router;