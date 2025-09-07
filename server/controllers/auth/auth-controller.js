const bcrypt = require("bcryptjs");
const User = require("../../models/User");
const jwt = require("jsonwebtoken")

// Auth0 user sync/create endpoint
const syncAuth0User = async (req, res) => {
  try {
    const { sub: auth0Id, email, given_name: firstName, family_name: lastName, nickname: userName } = req.auth.payload;
    
    console.log('Auth0 payload:', req.auth.payload);
    
    // Validate required fields
    if (!auth0Id) {
      return res.status(400).json({
        success: false,
        message: "Auth0 ID is required"
      });
    }
    
    // Check if user already exists by auth0Id
    let user = await User.findOne({ auth0Id });
    
    if (user) {
      // Update existing user info if needed
      if (email) user.email = email;
      if (firstName) user.firstName = firstName;
      if (lastName) user.lastName = lastName;
      if (userName) user.userName = userName;
      await user.save();
    } else {
      // Check if user exists by email (for migration) - only if email exists
      if (email) {
        user = await User.findOne({ email });
        
        if (user) {
          // Link existing user with Auth0
          user.auth0Id = auth0Id;
          await user.save();
        }
      }
      
      if (!user) {
        // Create new user with safe defaults
        const safeEmail = email || `${auth0Id}@auth0.local`;
        const safeUserName = userName || (email ? email.split('@')[0] : `user_${auth0Id.substring(0, 8)}`);
        
        user = new User({
          auth0Id,
          firstName: firstName || 'User',
          lastName: lastName || 'Name',
          userName: safeUserName,
          email: safeEmail,
          role: 'user'
        });
        await user.save();
      }
    }

    res.json({
      success: true,
      message: "User synced successfully",
      user: {
        id: user._id,
        email: user.email,
        role: user.role,
        userName: user.userName,
        firstName: user.firstName,
        lastName: user.lastName
      }
    });
  } catch (error) {
    console.error('Auth0 user sync error:', error);
    res.status(500).json({
      success: false,
      message: "Error syncing user"
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