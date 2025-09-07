const express = require('express');
const { checkJwt } = require('../../middleware/auth0');
const { checkAdmin } = require('../../middleware/checkRole');
const { validationRules } = require('../../middleware/validation');
const { fileUploadSecurity } = require('../../middleware/security');

const { upload, imageUploadUtil } = require('../../helpers/cloudinary');
const { handleImageUpload, addProduct, fetchAllProducts, editProduct, deleteProduct } = require('../../controllers/admin/products-controller');

const router = express.Router();

// All admin routes require authentication and admin role
router.post('/upload-image', checkJwt, checkAdmin, upload.single('my_image_file'), fileUploadSecurity, handleImageUpload);
router.post('/add-product', checkJwt, checkAdmin, validationRules.createProduct, addProduct);
router.get('/fetch-all-products', checkJwt, checkAdmin, validationRules.pagination, fetchAllProducts);
router.put('/edit-product/:id', checkJwt, checkAdmin, validationRules.updateProduct, editProduct);
router.delete('/delete-product/:id', checkJwt, checkAdmin, validationRules.getById, deleteProduct);

module.exports = router;