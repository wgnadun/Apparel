const express = require('express');
const { validationRules } = require('../../middleware/validation');
const { fileUploadSecurity } = require('../../middleware/security');
const { addAddress, fetchAllAddress, editAddress, deleteAddress } = require('../../controllers/shop/address-controller');

const router = express.Router();

// Address routes with validation
router.post('/add', validationRules.createAddress, addAddress);
router.get('/fetch/:userId', validationRules.getCartByUserId, fetchAllAddress);
router.put('/edit/:userId/:addressId', validationRules.editAddress, editAddress);
router.delete('/delete/:userId/:addressId', validationRules.deleteAddress, deleteAddress);

module.exports = router;