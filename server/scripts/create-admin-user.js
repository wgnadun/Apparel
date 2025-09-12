const mongoose = require('mongoose');
const User = require('../models/User');

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb+srv://wgnadundananjaya:SpkTnNzPrjb8mBYT@apperal.np1uklx.mongodb.net/')
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

async function createAdminUser() {
  try {
    // Check if admin user already exists
    const existingAdmin = await User.findOne({ email: 'admin@example.com' });
    
    if (existingAdmin) {
      console.log('Admin user already exists:', existingAdmin.email);
      // Update role to admin if not already
      if (existingAdmin.role !== 'admin') {
        existingAdmin.role = 'admin';
        await existingAdmin.save();
        console.log('Updated existing user to admin role');
      }
      return;
    }

    // Create new admin user
    const adminUser = new User({
      firstName: 'Admin',
      lastName: 'User',
      userName: 'admin',
      email: 'admin@example.com',
      role: 'admin',
      auth0Id: 'admin-auth0-id' // You can set this to null if not using Auth0
    });

    await adminUser.save();
    console.log('Admin user created successfully:', adminUser.email);
  } catch (error) {
    console.error('Error creating admin user:', error);
  } finally {
    mongoose.connection.close();
  }
}

createAdminUser();
