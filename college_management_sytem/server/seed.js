// seed.js
const mongoose = require('mongoose');
const User = require('./models/User');

async function seedAdmin() {
  try {
    await mongoose.connect('mongodb://127.0.0.1:27017/college_management');
    console.log('Connected to MongoDB...');

    await User.create({
      name: 'Admin',
      email: 'admin@example.com',
      phone: '9999999999',
      password: 'password123',
      role: 'admin'
    });

    console.log('Document inserted successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error inserting document:', error);
    process.exit(1);
  }
}

seedAdmin();