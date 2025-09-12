const bcrypt = require("bcryptjs");
const User = require("../../models/User");
const jwt = require("jsonwebtoken");
const axios = require("axios");

// Auth0 user sync/create endpoint
const syncAuth0User = async (req, res) => {
  try {
    console.log('Sync Auth0 User - Request headers:', req.headers);
    console.log('Sync Auth0 User - Auth object:', req.auth);
    
    // Check if req.auth exists and has payload
    if (!req.auth || !req.auth.payload) {
      console.error('Auth object or payload missing');
      return res.status(401).json({
        success: false,
        message: "Authentication failed - invalid token"
      });
    }
    
    const { sub: auth0Id } = req.auth.payload;
    
    console.log('Auth0 payload:', req.auth.payload);
    
    // Validate required fields
    if (!auth0Id) {
      console.error('Auth0 ID missing from payload');
      return res.status(400).json({
        success: false,
        message: "Auth0 ID is required"
      });
    }

    // Get access token from Authorization header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: "Access token is required"
      });
    }
    
    const accessToken = authHeader.substring(7); // Remove 'Bearer ' prefix
    
    // Fetch user profile from Auth0 userinfo endpoint
    let userProfile;
    try {
      console.log('Fetching userinfo from Auth0 domain:', process.env.AUTH0_DOMAIN);
      const userinfoUrl = `https://${process.env.AUTH0_DOMAIN}/userinfo`;
      console.log('Userinfo URL:', userinfoUrl);
      
      const userinfoResponse = await axios.get(userinfoUrl, {
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      });
      userProfile = userinfoResponse.data;
      console.log('Auth0 userinfo response:', userProfile);
    } catch (userinfoError) {
      console.error('Error fetching userinfo:', {
        message: userinfoError.message,
        status: userinfoError.response?.status,
        data: userinfoError.response?.data,
        config: {
          url: userinfoError.config?.url,
          headers: userinfoError.config?.headers
        }
      });
      return res.status(500).json({
        success: false,
        message: "Failed to fetch user profile from Auth0",
        error: userinfoError.message
      });
    }

    // Extract user information from userinfo response
    const email = userProfile.email;
    const firstName = userProfile.given_name || userProfile.name?.split(" ")[0] || 'User';
    const lastName = userProfile.family_name || userProfile.name?.split(" ")[1] || 'Name';
    const userName = userProfile.nickname || userProfile.preferred_username;
    
    console.log('Extracted user data:', { email, firstName, lastName, userName });
    
    // Validate required fields
    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required but not found in user profile"
      });
    }
    
    if (!firstName || !lastName) {
      return res.status(400).json({
        success: false,
        message: "First name and last name are required but not found in user profile"
      });
    }
    
    // Check if user already exists by auth0Id
    let user = await User.findOne({ auth0Id });
    console.log('Existing user found:', user ? 'Yes' : 'No');
    
    if (user) {
      console.log('Updating existing user...');
      // Update existing user info if needed
      if (email) user.email = email;
      if (firstName) user.firstName = firstName;
      if (lastName) user.lastName = lastName;
      if (userName) user.userName = userName;
      await user.save();
      console.log('User updated successfully');
    } else {
      console.log('Creating new user...');
      // Check if user exists by email (for migration) - only if email exists
      if (email) {
        user = await User.findOne({ email });
        console.log('User found by email:', user ? 'Yes' : 'No');
        
        if (user) {
          console.log('Existing user data:', {
            id: user._id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            auth0Id: user.auth0Id
          });
          // Link existing user with Auth0
          user.auth0Id = auth0Id;
          // Update user info from Auth0
          user.firstName = firstName;
          user.lastName = lastName;
          if (userName) user.userName = userName;
          await user.save();
          console.log('User linked with Auth0 successfully');
        }
      }
      
      if (!user) {
        // Create new user with safe defaults
        const safeEmail = email || `${auth0Id}@auth0.local`;
        
        // Generate a unique username
        let safeUserName = userName || (email ? email.split('@')[0] : `user_${auth0Id.replace(/[^a-zA-Z0-9]/g, '').substring(0, 8)}`);
        
        // Check if username already exists and make it unique
        let counter = 1;
        let originalUserName = safeUserName;
        while (await User.findOne({ userName: safeUserName })) {
          safeUserName = `${originalUserName}${counter}`;
          counter++;
        }
        
        try {
          console.log('Creating user with data:', {
            auth0Id,
            firstName,
            lastName,
            userName: safeUserName,
            email,
            role: 'user'
          });
          user = new User({
            auth0Id,
            firstName: firstName,
            lastName: lastName,
            userName: safeUserName,
            email: email, // Use the actual email, not safeEmail
            role: 'user'
          });
          await user.save();
          console.log('User created successfully');
        } catch (error) {
          if (error.code === 11000) {
            // Handle duplicate key error - try to find existing user
            user = await User.findOne({ 
              $or: [
                { auth0Id: auth0Id },
                { email: safeEmail }
              ]
            });
            
            if (!user) {
              // If still no user found, generate a completely unique username
              const timestamp = Date.now();
              safeUserName = `user_${timestamp}`;
              user = new User({
                auth0Id,
                firstName: firstName,
                lastName: lastName,
                userName: safeUserName,
                email: email, // Use the actual email, not safeEmail
                role: 'user'
              });
              await user.save();
            }
          } else {
            throw error;
          }
        }
      }
    }

    console.log('Sending success response for user:', user._id);
    res.json({
      success: true,
      message: "User synced successfully",
      user: {
        id: user._id,
        email: user.email,
        role: user.role,
        userName: user.userName,
        firstName: user.firstName,
        lastName: user.lastName,
        image: user.image
      }
    });
  } catch (error) {
    console.error('Auth0 user sync error:', error);
    console.error('Error details:', {
      message: error.message,
      stack: error.stack,
      name: error.name
    });
    res.status(500).json({
      success: false,
      message: "Error syncing user",
      error: error.message
    });
  }
};

//register (legacy - for non-Auth0 users)
const registerUser = async (req, res) => {
  const { firstName, lastName, userName, email, password, phone, country } = req.body;

  try {
    const checkUser = await User.findOne({ email });
    if (checkUser)
      return res.json({
        success: false,
        message: "User Already exists with the same email! Please try again",
      });

    const checkUserName = await User.findOne({ userName });
    if (checkUserName)
      return res.json({
        success: false,
        message: "Username already exists! Please choose a different username",
      });

    const hashPassword = await bcrypt.hash(password, 12); //hash password
    const newUser = new User({
      firstName,
      lastName,
      userName,
      email,
      password: hashPassword,
      phone,
      country,
    });

    await newUser.save(); //save user in DB
    res.status(200).json({
      success: true,
      message: "Registration successful",
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Some error occured",
    });
  }
};

//login
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const checkUser = await User.findOne({ email });
    if (!checkUser)
      return res.json({
        success: false,
        message: "User doesn't exists! Please register first",
      });

    const checkPasswordMatch = await bcrypt.compare(
      password,
      checkUser.password
    );
    if (!checkPasswordMatch)
      return res.json({
        success: false,
        message: "Incorrect password! Please try again",
      });

    const token = jwt.sign(
      {
        id: checkUser._id,
        role: checkUser.role,
        email: checkUser.email,
        userName: checkUser.userName,
      },
      "CLIENT_SECRET_KEY",
      { expiresIn: "60m" }
    );

    res.cookie("token", token, { httpOnly: true, secure: false }).json({
      success: true,
      message: "Logged in successfully",
      user: {
        email: checkUser.email,
        role: checkUser.role,
        id: checkUser._id,
        userName: checkUser.userName,
      },
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Some error occured",
    });
  }
};

//logout

const logoutUser = (req, res) => {
  res.clearCookie("token").json({
    success: true,
    message: "Logged out successfully!",
  });
};



module.exports = { registerUser, loginUser, logoutUser, syncAuth0User };