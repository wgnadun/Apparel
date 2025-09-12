const mongoose = require('mongoose');
const User = require('../models/User');

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb+srv://wgnadundananjaya:SpkTnNzPrjb8mBYT@apperal.np1uklx.mongodb.net/')
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

async function setAdminRole(email) {
  try {
    if (!email) {
      console.log('Usage: node set-admin-role.js <email>');
      console.log('Example: node set-admin-role.js wgkokilahansini1234@gmail.com');
      return;
    }

    console.log(`Looking for user with email: ${email}`);
    const user = await User.findOne({ email: email });
    
    if (!user) {
      console.log(`❌ User with email ${email} not found in database`);
      console.log('Available users in database:');
      const allUsers = await User.find({}, 'email firstName lastName role');
      allUsers.forEach(u => console.log(`- ${u.email} (${u.firstName} ${u.lastName}) - Role: ${u.role}`));
      return;
    }

    console.log(`Found user: ${user.firstName} ${user.lastName} (${user.email})`);
    console.log(`Current role: ${user.role}`);
    
    user.role = 'admin';
    await user.save();
    
    console.log(`✅ User ${email} role updated to admin successfully`);
    console.log('Updated user details:', {
      id: user._id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
      auth0Id: user.auth0Id
    });
  } catch (error) {
    console.error('Error updating user role:', error);
  } finally {
    mongoose.connection.close();
  }
}

// Get email from command line arguments
const email = process.argv[2];
setAdminRole(email);
