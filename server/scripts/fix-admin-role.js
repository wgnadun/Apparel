const mongoose = require('mongoose');
const User = require('../models/User');

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb+srv://wgnadundananjaya:SpkTnNzPrjb8mBYT@apperal.np1uklx.mongodb.net/')
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

async function fixAdminRole() {
  try {
    const email = 'wgkokilahansini1234@gmail.com';
    
    console.log(`🔍 Looking for user with email: ${email}`);
    
    // First, check if user exists
    let user = await User.findOne({ email: email });
    
    if (!user) {
      console.log(`❌ User not found. Creating new admin user...`);
      user = new User({
        email: email,
        firstName: 'Wgkokila',
        lastName: 'Hansini',
        userName: 'wgkokilahansini1234',
        role: 'admin',
        auth0Id: 'google-oauth2|114006811253530792497'
      });
      await user.save();
      console.log(`✅ New admin user created!`);
    } else {
      console.log(`👤 User found: ${user.firstName} ${user.lastName}`);
      console.log(`📧 Email: ${user.email}`);
      console.log(`🎭 Current role: ${user.role}`);
      
      // Update role to admin
      user.role = 'admin';
      await user.save();
      console.log(`✅ Role updated to admin!`);
    }
    
    console.log('\n🎯 Final user details:');
    console.log({
      id: user._id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      userName: user.userName,
      role: user.role,
      auth0Id: user.auth0Id
    });
    
    console.log('\n✅ Admin role setup complete! Now test login.');
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    mongoose.connection.close();
  }
}

fixAdminRole();
