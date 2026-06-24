const mongoose = require('mongoose');

const facultySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  designation: {
    type: String,
    required: true,
    trim: true
  },
  department: {
    type: String,
    required: true,
    trim: true
  },
  qualifications: [{
    type: String
  }],
  experience: {
    type: String,
    trim: true
  },
  imageUrl: {
    type: String
  },
  email: {
    type: String,
    trim: true,
    lowercase: true
  }
}, { timestamps: true });

module.exports = mongoose.model('Faculty', facultySchema);
