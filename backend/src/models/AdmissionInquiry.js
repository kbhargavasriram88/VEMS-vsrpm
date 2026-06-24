const mongoose = require('mongoose');

const admissionInquirySchema = new mongoose.Schema({
  studentName: {
    type: String,
    required: true,
    trim: true
  },
  parentName: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    trim: true,
    lowercase: true
  },
  phone: {
    type: String,
    required: true,
    trim: true
  },
  gradeApplyingFor: {
    type: String,
    required: true,
    trim: true
  },
  dob: {
    type: Date,
    required: true
  },
  address: {
    type: String,
    required: true,
    trim: true
  },
  previousSchool: {
    type: String,
    trim: true
  },
  message: {
    type: String
  },
  status: {
    type: String,
    enum: ['New', 'Under Review', 'Approved', 'Rejected'],
    default: 'New'
  }
}, { timestamps: true });

module.exports = mongoose.model('AdmissionInquiry', admissionInquirySchema);
