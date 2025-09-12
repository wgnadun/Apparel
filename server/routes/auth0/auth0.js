const express = require('express');
const jwt = require("jsonwebtoken");
const axios = require("axios");
const router = express.Router();

const User = require("../../models/User");

const AUTH0_DOMAIN = process.env.AUTH0_DOMAIN;        
const AUTH0_CLIENT_ID = process.env.AUTH0_CLIENT_ID;
const AUTH0_REDIRECT_URI = "http://localhost:5000/api/auth0/callback"; 
const AUTH0_SCOPE = "openid profile email";
const AUTH0_RESPONSE_TYPE = "code";
const AUTH0_CLIENT_SECRET = process.env.AUTH0_CLIENT_SECRET;

// Auth0 login redirect
router.get("/login", async (req, res) => {
    const returnTo = req.query.redirect || 'http://localhost:5173';
    const state = encodeURIComponent(JSON.stringify({ returnTo }));
    
    const redir_url = `https://${AUTH0_DOMAIN}/authorize?` +
      `response_type=${encodeURIComponent(AUTH0_RESPONSE_TYPE)}` +
      `&client_id=${encodeURIComponent(AUTH0_CLIENT_ID)}` +
      `&redirect_uri=${encodeURIComponent(AUTH0_REDIRECT_URI)}` +
      `&scope=${encodeURIComponent(AUTH0_SCOPE)}` +
      `&state=${state}` +
      `&prompt=login`;

    res.redirect(redir_url);
});

// Auth0 callback handler
router.get("/callback", async (req, res) => {
    const code = req.query.code;
    const state = req.query.state;

    try {
        // Parse the state to get return URL
        let returnTo = 'http://localhost:5173';
        if (state) {
            try {
                const stateData = JSON.parse(decodeURIComponent(state));
                returnTo = stateData.returnTo || 'http://localhost:5173';
            } catch (e) {
                console.log("Error parsing state:", e);
            }
        }

        const tokenResponse = await axios.post(`https://${AUTH0_DOMAIN}/oauth/token`, {
            grant_type: "authorization_code",
            client_id: AUTH0_CLIENT_ID,
            client_secret: AUTH0_CLIENT_SECRET,
            code: code,
            redirect_uri: AUTH0_REDIRECT_URI
        }, {
            headers: { "Content-Type": "application/json" }
        });

        const { id_token } = tokenResponse.data;
        
        // Validate id_token exists
        if (!id_token) {
            throw new Error("No ID token received from Auth0");
        }
        
        // Decode JWT token with error handling
        let decoded;
        try {
            decoded = jwt.decode(id_token);
            if (!decoded) {
                throw new Error("Failed to decode ID token");
            }
        } catch (decodeError) {
            console.error("JWT decode error:", decodeError);
            throw new Error("Invalid ID token format");
        }

        // Get userinfo from Auth0 to get complete profile data
        let userProfile;
        try {
            const userinfoResponse = await axios.get(`https://${AUTH0_DOMAIN}/userinfo`, {
                headers: {
                    'Authorization': `Bearer ${tokenResponse.data.access_token}`
                }
            });
            userProfile = userinfoResponse.data;
            console.log('Auth0 userinfo response:', userProfile);
        } catch (userinfoError) {
            console.error('Error fetching userinfo:', userinfoError.response?.data || userinfoError.message);
            // Fallback to decoded token data
            userProfile = decoded;
        }

        // Extract user information from userinfo response
        const email = userProfile.email;
        const firstName = userProfile.given_name || userProfile.name?.split(" ")[0] || 'User';
        const lastName = userProfile.family_name || userProfile.name?.split(" ")[1] || '';
        const userName = userProfile.nickname || userProfile.preferred_username || userProfile.sub;
        const auth0Id = userProfile.sub;
        
        console.log('Extracted user data:', {
            email,
            firstName,
            lastName,
            userName
        });
        
        // Validate required fields
        if (!auth0Id) {
            throw new Error("Auth0 ID not found in userinfo");
        }
        if (!email) {
            throw new Error("Email not found in userinfo");
        }

        // Check database for existing user by email
        let user = await User.findOne({ email: email });
        console.log('🔍 Database user found:', user ? 'Yes' : 'No');
        
        if (!user) {
            // Create new user with default 'user' role
            console.log('👤 Creating new user with default role...');
            user = await User.create({
                auth0Id: auth0Id,
                firstName: firstName,
                lastName: lastName,
                email: email,
                userName: userName,
                role: 'user' // Default role for new users
            });
            console.log('✅ New user created with role:', user.role);
        } else {
            // Update existing user's Auth0 ID if not set
            if (!user.auth0Id) {
                user.auth0Id = auth0Id;
                await user.save();
            }
            console.log('👤 Existing user found:');
            console.log('  - Name:', user.firstName, user.lastName);
            console.log('  - Email:', user.email);
            console.log('  - Role:', user.role);
            console.log('  - Auth0Id:', user.auth0Id);
        }
        
        // Use the role from database (this is the key part!)
        const userRole = user.role;
        console.log('🎯 Final user role from database:', userRole);
        console.log('🎯 Will redirect to:', userRole === 'admin' ? 'ADMIN DASHBOARD' : 'USER HOME PAGE');
        
        const token = jwt.sign(
            {
                id: user._id,
                role: userRole,
                email: user.email,
                userName: user.userName,
                firstName: user.firstName,
                lastName: user.lastName,
            },
            "CLIENT_SECRET_KEY",
            { expiresIn: "60m" }
        );

        const id = user._id;
        const role = userRole; // Use role from database
        const email_ = user.email;
        const fName = user.firstName;
        const Lname = user.lastName;
        const usrname = user.userName;

        // Set cookie for Auth0 users
        res.cookie("token", token, {
            httpOnly: true,
            secure: false, // Set to true in production with HTTPS
            sameSite: "lax",
            maxAge: 60 * 60 * 1000, // 1 hour
        });

        // Redirect to the frontend login page with token parameters
        // The frontend will handle the redirect to the original returnTo URL after processing the token
        const redirectUrl = `http://localhost:5173/auth/login?token=${token}&id=${id}&role=${role}&email=${email_}&firstName=${fName}&lastName=${Lname}&username=${usrname}&returnTo=${encodeURIComponent(returnTo)}`;
        res.redirect(redirectUrl);
    } catch (err) {
        console.error("Callback error:", err.response?.data || err.message);
        res.status(500).send("Authentication failed");
    }
});

// Auth0 logout
router.get("/logout", (req, res) => {
    try {
        // Clear the session
        req.session = null; 
        
        // Clear the authentication cookie
        res.clearCookie('token', {
            httpOnly: true,
            secure: false, // Set to true in production with HTTPS
            sameSite: "lax",
        });
        
        // Redirect to Auth0 logout with return URL and federated logout
        const returnTo = encodeURIComponent('http://localhost:5173'); 
        const clientId = AUTH0_CLIENT_ID;
        const logoutURL = `https://${AUTH0_DOMAIN}/v2/logout?client_id=${clientId}&returnTo=${returnTo}&federated`;
        res.redirect(logoutURL);
    } catch (e) {
        console.log("Auth0 logout error:", e);
        // Even if there's an error, try to redirect to home page
        res.redirect('http://localhost:5173');
    }
});

module.exports = router;