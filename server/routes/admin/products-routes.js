const express = require('express');

const { upload, imageUploadUtil } = require('../../helpers/cloudinary');
const { handleImageUpload } = require('../../controllers/admin/products-controller');


const router = express.Router();

router.post('/upload-image', upload.single('my_image_file'), handleImageUpload);

module.exports = router;