const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

const seedAdmin = async () => {
  try {
    const adminExists = await User.findOne({ role: 'admin' });
    if (!adminExists) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash('Admin@12345', salt);
      
      const admin = new User({
        name: 'Root Admin',
        email: 'admin@college.edu',
        password: hashedPassword,
        department: 'Administration',
        role: 'admin',
        isActive: true,
      });

      await admin.save();
      console.log('Root Admin account seeded: admin@college.edu / Admin@12345');
    } else {
      console.log('Admin account already exists.');
    }
  } catch (error) {
    console.error('Error seeding admin:', error);
  }
};

module.exports = seedAdmin;
