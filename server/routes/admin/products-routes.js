const express = require('express');

const { upload, imageUploadUtil } = require('../../helpers/cloudinary');
const { handleImageUpload,addProduct,fetchAllProducts,editProduct,deleteProduct } = require('../../controllers/admin/products-controller');


const router = express.Router();

router.post('/upload-image', upload.single('my_image_file'), handleImageUpload);
router.post('/add-product', addProduct);
router.get('/fetch-all-products', fetchAllProducts);
router.put('/edit-product/:id', editProduct);
router.delete('/delete-product/:id', deleteProduct);

module.exports = router;