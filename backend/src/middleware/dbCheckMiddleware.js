const mongoose = require('mongoose');

const dbCheck = (req, res, next) => {
  // Allow login even if DB is offline (we will handle offline auth in controller)
  if (req.originalUrl.includes('/auth/login')) {
    return next();
  }

  if (mongoose.connection.readyState !== 1) {
    return res.status(503).json({
      message: "Database is offline. Please whitelist your IP in MongoDB Atlas or start your local MongoDB service."
    });
  }
  next();
};

module.exports = dbCheck;
