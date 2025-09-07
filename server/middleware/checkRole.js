// Role checking middleware for Auth0
const checkRole = (requiredRole) => {
  return (req, res, next) => {
    try {
      // Get the user's roles from the Auth0 token
      // Roles can be in different places depending on your Auth0 setup
      const roles = req.auth?.payload?.['https://yourapp.com/roles'] || 
                   req.auth?.payload?.permissions || 
                   req.auth?.payload?.role || 
                   [];

      // Check if user has the required role
      const hasRole = Array.isArray(roles) 
        ? roles.includes(requiredRole)
        : roles === requiredRole;

      if (!hasRole) {
        return res.status(403).json({
          success: false,
          message: `Access denied. Required role: ${requiredRole}`
        });
      }

      // Add user info to request for easy access
      req.user = {
        sub: req.auth.payload.sub,
        email: req.auth.payload.email,
        roles: roles
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
