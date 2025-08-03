const express = require('express') ;

const {addAddress,fetchAllAddress,editAddress,deleteAddress} = require('../../controllers/shop/address-controller')

const router = express.Router();

router.post('/add',addAddress);
router.get('/fetch/:userId',fetchAllAddress);
router.put('/edit/:userId/:addressId',editAddress);
router.delete('/delete/:userId/:addressId',deleteAddress);

module.exports = router;