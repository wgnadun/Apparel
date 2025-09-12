const User = require('../models/User');

// Role checking middleware for Auth0
const checkRole = (requiredRole) => {
  return async (req, res, next) => {
    try {
      // Get the Auth0 ID from the JWT payload
      const auth0Id = req.auth?.payload?.sub;
      
      if (!auth0Id) {
        return res.status(401).json({
          success: false,
          message: 'Authentication failed - no Auth0 ID found'
        });
      }

      // Fetch user from database to get their role
      const user = await User.findOne({ auth0Id: auth0Id });
      
      if (!user) {
        return res.status(403).json({
          success: false,
          message: 'User not found in database'
        });
      }

      // Check if user has the required role
      if (user.role !== requiredRole) {
        console.log(`Access denied for user ${auth0Id}. Required role: ${requiredRole}, User role: ${user.role}`);
        return res.status(403).json({
          success: false,
          message: `Access denied. Required role: ${requiredRole}`
        });
      }

      // Add user info to request for easy access
      req.user = {
        id: user._id,
        auth0Id: user.auth0Id,
        email: user.email,
        role: user.role,
        firstName: user.firstName,
        lastName: user.lastName
      };

      next();
    } catch (error) {
      console.error('Role check error:', error);
      return res.status(500).json({
        success: false,
        message: 'Error checking user role'
      });
    }
  };
};

// Specific role checkers
const checkAdmin = checkRole('admin');
const checkUser = checkRole('user');

module.exports = {
  checkRole,
  checkAdmin,
  checkUser
};
