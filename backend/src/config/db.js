const mongoose = require('mongoose');
const Admin = require('../models/Admin');
const bcrypt = require('bcryptjs');

const seedAdmin = async () => {
  try {
    const adminCount = await Admin.countDocuments();
    if (adminCount === 0) {
      console.log('No admin users found. Seeding default admin user...');
      const hashedPassword = await bcrypt.hash('admin123', 10);
      await Admin.create({
        username: 'admin',
        email: 'admin@gmail.com',
        password: hashedPassword,
        role: 'admin'
      });
      console.log('Default admin seeded successfully! (admin@gmail.com / admin123)');
    }
  } catch (err) {
    console.error('Failed to seed admin user:', err);
  }
};

const connectDB = async () => {
  const primaryURI = process.env.MONGO_URI;
  const fallbackURI = 'mongodb://localhost:27017/vivekananda';
  
  try {
    console.log('Attempting to connect to primary MongoDB database...');
    const conn = await mongoose.connect(primaryURI, {
      serverSelectionTimeoutMS: 5000
    });
    console.log(`MongoDB Connected (Primary): ${conn.connection.host}`);
    await seedAdmin();
  } catch (error) {
    console.error(`Primary MongoDB connection failed: ${error.message}`);
    console.log('Attempting fallback to local MongoDB database...');
    try {
      const conn = await mongoose.connect(fallbackURI, {
        serverSelectionTimeoutMS: 5000
      });
      console.log(`MongoDB Connected (Fallback/Local): ${conn.connection.host}`);
      await seedAdmin();
    } catch (fallbackError) {
      console.error(`Local MongoDB fallback connection also failed: ${fallbackError.message}`);
      // Disable mongoose buffering so queries fail immediately rather than hanging
      mongoose.set('bufferCommands', false);
      console.warn('\n================================================================');
      console.warn('WARNING: Database is offline. The server will run in OFFLINE mode.');
      console.warn('Database operations will return an service offline error.');
      console.warn('To resolve this:');
      console.warn('1. Whitelist your IP in MongoDB Atlas (https://www.mongodb.com/docs/atlas/security-whitelist/)');
      console.warn('2. Or start your local MongoDB service.');
      console.warn('================================================================\n');
    }
  }
};

module.exports = connectDB;
