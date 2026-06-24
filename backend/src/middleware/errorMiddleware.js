const mongoose = require('mongoose');

const errorHandler = (err, req, res, next) => {
  let statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  let message = err.message;

  if (mongoose.connection.readyState !== 1) {
    statusCode = 503; // Service Unavailable
    message = "Database is offline. Please whitelist your IP in MongoDB Atlas or start your local MongoDB service.";
  }

  res.status(statusCode);
  res.json({
    message,
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
};

module.exports = { errorHandler };
