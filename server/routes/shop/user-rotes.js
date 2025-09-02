const express = require('express');
const router = express.Router();
const { upload } = require('../../helpers/cloudinary');
const authMiddleware = require('../../middleware/auth/auth-middleware');
const {
  uploadProfilePicture,
  updateProfilePicture,
  getUserProfile,
  updateUserProfile,
  removeProfilePicture
} = require('../../controllers/shop/user-controller');

// All routes require authentication
router.use(authMiddleware);

// Get user profile
router.get('/profile', getUserProfile);

// Update user profile (excluding password and image)
router.put('/profile', updateUserProfile);

// Upload profile picture (for users who don't have one)
router.post('/profile/picture', upload.single('image'), uploadProfilePicture);

// Update profile picture (replace existing one)
router.put('/profile/picture', upload.single('image'), updateProfilePicture);

// Remove profile picture
router.delete('/profile/picture', removeProfilePicture);

module.exports = router;

