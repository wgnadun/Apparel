const { imageUploadUtil } = require("../../helpers/cloudinary");
const User = require("../../models/User");

// Helper function to get user ID from Auth0 token
const getUserIdFromAuth0 = (req) => {
  return req.auth.payload.sub;
};

// Upload profile picture
const uploadProfilePicture = async (req, res) => {
  try {
    console.log('Profile picture upload request received');
    console.log('File details:', {
      originalname: req.file?.originalname,
      mimetype: req.file?.mimetype,
      size: req.file?.size
    });
    
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No image file provided"
      });
    }

    const b64 = Buffer.from(req.file.buffer).toString("base64");
    const url = "data:" + req.file.mimetype + ";base64," + b64;
    
    console.log('Calling Cloudinary upload...');
    const result = await imageUploadUtil(url);

    console.log('Upload successful, updating user profile');
    
    // Get user by Auth0 ID
    const auth0Id = getUserIdFromAuth0(req);
    const user = await User.findOne({ auth0Id });
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    // Update user's profile picture
    const updatedUser = await User.findByIdAndUpdate(
      user._id,
      { image: result.secure_url },
      { new: true, select: '-password' }
    );

    res.json({
      success: true,
      message: "Profile picture uploaded successfully",
      data: {
        image: result.secure_url,
        user: updatedUser
      }
    });
  } catch (error) {
    console.error('Profile picture upload error:', error);
    res.status(500).json({
      success: false,
      message: "Error occurred during profile picture upload",
      error: error.message
    });
  }
};

// Update profile picture (replace existing one)
const updateProfilePicture = async (req, res) => {
  try {
    console.log('Profile picture update request received');
    
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No image file provided"
      });
    }

    const b64 = Buffer.from(req.file.buffer).toString("base64");
    const url = "data:" + req.file.mimetype + ";base64," + b64;
    
    console.log('Calling Cloudinary upload for update...');
    const result = await imageUploadUtil(url);

    console.log('Upload successful, updating user profile picture');
    
    // Get user by Auth0 ID
    const auth0Id = getUserIdFromAuth0(req);
    const user = await User.findOne({ auth0Id });
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    // Update user's profile picture
    const updatedUser = await User.findByIdAndUpdate(
      user._id,
      { image: result.secure_url },
      { new: true, select: '-password' }
    );

    res.json({
      success: true,
      message: "Profile picture updated successfully",
      data: {
        image: result.secure_url,
        user: updatedUser
      }
    });
  } catch (error) {
    console.error('Profile picture update error:', error);
    res.status(500).json({
      success: false,
      message: "Error occurred during profile picture update",
      error: error.message
    });
  }
};

// Get user profile
const getUserProfile = async (req, res) => {
  try {
    const auth0Id = getUserIdFromAuth0(req);
    console.log('Getting user profile for Auth0 ID:', auth0Id);
    
    const user = await User.findOne({ auth0Id }).select('-password');
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    res.json({
      success: true,
      data: user
    });
  } catch (error) {
    console.error('Get user profile error:', error);
    res.status(500).json({
      success: false,
      message: "Error occurred while fetching user profile",
      error: error.message
    });
  }
};

// Update user profile (excluding password and image)
const updateUserProfile = async (req, res) => {
  try {
    const auth0Id = getUserIdFromAuth0(req);
    console.log('Updating user profile for Auth0 ID:', auth0Id);
    
    const { firstName, lastName, userName, email, phone, country } = req.body;
    
    const updateData = {};
    if (firstName) updateData.firstName = firstName;
    if (lastName) updateData.lastName = lastName;
    if (userName) updateData.userName = userName;
    if (email) updateData.email = email;
    if (phone) updateData.phone = phone;
    if (country) updateData.country = country;

    // Get user by Auth0 ID first
    const user = await User.findOne({ auth0Id });
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    const updatedUser = await User.findByIdAndUpdate(
      user._id,
      updateData,
      { new: true, select: '-password' }
    );

    res.json({
      success: true,
      message: "Profile updated successfully",
      data: updatedUser
    });
  } catch (error) {
    console.error('Update user profile error:', error);
    res.status(500).json({
      success: false,
      message: "Error occurred while updating user profile",
      error: error.message
    });
  }
};

// Remove profile picture
const removeProfilePicture = async (req, res) => {
  try {
    const auth0Id = getUserIdFromAuth0(req);
    console.log('Removing profile picture for Auth0 ID:', auth0Id);
    
    // Get user by Auth0 ID first
    const user = await User.findOne({ auth0Id });
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    const updatedUser = await User.findByIdAndUpdate(
      user._id,
      { image: null },
      { new: true, select: '-password' }
    );

    res.json({
      success: true,
      message: "Profile picture removed successfully",
      data: updatedUser
    });
  } catch (error) {
    console.error('Remove profile picture error:', error);
    res.status(500).json({
      success: false,
      message: "Error occurred while removing profile picture",
      error: error.message
    });
  }
};

module.exports = {
  uploadProfilePicture,
  updateProfilePicture,
  getUserProfile,
  updateUserProfile,
  removeProfilePicture
};

