const express = require('express');
const {getFilteredProducts,getProductDetails } = require('../../controllers/shop/products-controller');


const router = express.Router();


router.get('/fetch-all-products', getFilteredProducts);
router.get('/fetch-all-products/:id', getProductDetails);

module.exports = router;