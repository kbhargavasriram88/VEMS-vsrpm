const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');

const protect = async (req, res, next) => {
  try {
    let admin = await Admin.findOne();
    if (!admin) {
      admin = {
        _id: 'mock_admin_id',
        username: 'Bypass Admin',
        email: 'admin@vivekananda.com',
        role: 'admin',
        avatarUrl: ''
      };
    }
    req.admin = admin;
    next();
  } catch (error) {
    console.error("Auth bypass error:", error);
    next();
  }
};

module.exports = { protect };
