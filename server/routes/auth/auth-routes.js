const express = require('express');
const { registerUser, loginUser, logoutUser, syncAuth0User } = require('../../controllers/auth/auth-controller');
const authMiddleware = require('../../middleware/auth/auth-middleware');
const { checkJwt } = require('../../middleware/auth0');
const router = express.Router();

// Auth0 routes
router.post('/auth0/sync', checkJwt, syncAuth0User);

// Legacy routes (for non-Auth0 users)
router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/logout', logoutUser);
router.get('/check-auth', authMiddleware, (req, res) => {
    const user = req.user;
    res.status(200).json({
        success: true,
        message: 'Authenticated user !',
        user 
    })
});

module.exports = router;