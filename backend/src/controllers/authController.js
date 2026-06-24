const Admin = require('../models/Admin');
const generateToken = require('../utils/generateToken');
const bcrypt = require('bcryptjs');

// @desc    Auth admin & get token
// @route   POST /api/auth/login
// @access  Public
const authAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Check if DB is offline
    const mongoose = require('mongoose');
    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({ message: 'Database is offline. Please start MongoDB.' });
    }

    // Auto-seed admin if no admins exist in DB
    const adminCount = await Admin.countDocuments();
    if (adminCount === 0 && email === 'admin@gmail.com' && password === 'admin123') {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash('admin123', salt);
      const newAdmin = await Admin.create({
        username: 'Admin',
        email: 'admin@gmail.com',
        password: hashedPassword,
        role: 'admin'
      });
      return res.json({
        _id: newAdmin._id,
        username: newAdmin.username,
        email: newAdmin.email,
        role: newAdmin.role,
        avatarUrl: newAdmin.avatarUrl,
        token: generateToken(newAdmin._id),
      });
    }

    const admin = await Admin.findOne({ email });

    if (admin && (await bcrypt.compare(password, admin.password))) {
      res.json({
        _id: admin._id,
        username: admin.username,
        email: admin.email,
        role: admin.role,
        avatarUrl: admin.avatarUrl,
        token: generateToken(admin._id),
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// @desc    Get admin profile
// @route   GET /api/auth/me
// @access  Private
const getAdminProfile = async (req, res) => {
  try {
    const admin = await Admin.findById(req.admin._id).select('-password');
    if (admin) {
      res.json(admin);
    } else {
      res.status(404).json({ message: 'Admin not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// @desc    Update admin profile
// @route   PUT /api/auth/profile
// @access  Private
const updateAdminProfile = async (req, res) => {
  try {
    const admin = await Admin.findById(req.admin._id);

    if (admin) {
      admin.username = req.body.username || admin.username;
      admin.email = req.body.email || admin.email;
      admin.avatarUrl = req.body.avatarUrl !== undefined ? req.body.avatarUrl : admin.avatarUrl;
      
      if (req.body.password) {
        const salt = await bcrypt.genSalt(10);
        admin.password = await bcrypt.hash(req.body.password, salt);
      }

      const updatedAdmin = await admin.save();
      res.json({
        _id: updatedAdmin._id,
        username: updatedAdmin.username,
        email: updatedAdmin.email,
        role: updatedAdmin.role,
        avatarUrl: updatedAdmin.avatarUrl,
        token: generateToken(updatedAdmin._id),
      });
    } else {
      res.status(404).json({ message: 'Admin not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

module.exports = { authAdmin, getAdminProfile, updateAdminProfile };
