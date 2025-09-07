const express = require('express');
const router = express.Router();
const { upload } = require('../../helpers/cloudinary');
const { checkJwt } = require('../../middleware/auth0');
const { validationRules } = require('../../middleware/validation');
const { fileUploadSecurity } = require('../../middleware/security');
const {
  uploadProfilePicture,
  updateProfilePicture,
  getUserProfile,
  updateUserProfile,
  removeProfilePicture
} = require('../../controllers/shop/user-controller');

// All routes require Auth0 authentication
router.use(checkJwt);

// Get user profile
router.get('/profile', getUserProfile);

// Update user profile (excluding password and image)
router.put('/profile', validationRules.updateProfile, updateUserProfile);

// Upload profile picture (for users who don't have one)
router.post('/profile/picture', upload.single('image'), fileUploadSecurity, uploadProfilePicture);

// Update profile picture (replace existing one)
router.put('/profile/picture', upload.single('image'), fileUploadSecurity, updateProfilePicture);

// Remove profile picture
router.delete('/profile/picture', removeProfilePicture);

module.exports = router;

