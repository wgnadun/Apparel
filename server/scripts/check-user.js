const mongoose = require('mongoose');
const User = require('../models/User');

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb+srv://wgnadundananjaya:SpkTnNzPrjb8mBYT@apperal.np1uklx.mongodb.net/')
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

async function checkUser(email) {
  try {
    console.log(`Checking user with email: ${email}`);
    
    const user = await User.findOne({ email: email });
    
    if (!user) {
      console.log(`❌ User with email ${email} not found in database`);
      console.log('\nAll users in database:');
      const allUsers = await User.find({}, 'email firstName lastName role auth0Id');
      allUsers.forEach(u => console.log(`- ${u.email} (${u.firstName} ${u.lastName}) - Role: ${u.role} - Auth0Id: ${u.auth0Id || 'None'}`));
    } else {
      console.log(`✅ User found:`);
      console.log({
        id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        userName: user.userName,
        role: user.role,
        auth0Id: user.auth0Id || 'None',
        createdAt: user.createdAt
      });
    }
  } catch (error) {
    console.error('Error checking user:', error);
  } finally {
    mongoose.connection.close();
  }
}

// Get email from command line arguments
const email = process.argv[2] || 'wgkokilahansini1234@gmail.com';
checkUser(email);
