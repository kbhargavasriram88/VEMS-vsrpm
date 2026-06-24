require('dotenv').config();
const mongoose = require('mongoose');
const Admin = require('./src/models/Admin');
const bcrypt = require('bcryptjs');

const resetAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to DB');

    let admin = await Admin.findOne({ email: 'admin@gmail.com' });
    if (!admin) {
      console.log('admin@gmail.com not found. Looking for any admin...');
      admin = await Admin.findOne();
    }

    if (admin) {
      console.log(`Found admin: ${admin.email}. Resetting password to admin123...`);
      const salt = await bcrypt.genSalt(10);
      admin.password = await bcrypt.hash('admin123', salt);
      // Ensure email is admin@gmail.com for testing
      admin.email = 'admin@gmail.com';
      await admin.save();
      console.log('Password reset successfully to admin123 for admin@gmail.com');
    } else {
      console.log('No admins found in DB. Creating one...');
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash('admin123', salt);
      await Admin.create({
        username: 'Admin',
        email: 'admin@gmail.com',
        password: hashedPassword,
        role: 'admin'
      });
      console.log('Created admin@gmail.com with password admin123');
    }
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

resetAdmin();
