const mongoose = require('mongoose');

const gallerySchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  category: {
    type: String,
    required: true,
    enum: [
      'Academic Excellence',
      'School Achievements',
      'Awards & Recognition',
      'Science & Innovation',
      'Competitions',
      'Cultural Activities',
      'Annual Day Celebrations',
      'Sports Events',
      'Environmental Activities',
      'Educational Tours',
      'Seminars & Workshops',
      'Community Service',
      'Media Coverage',
      'Guest Visits',
      'Campus Life',
      'Infrastructure',
      'Admissions',
      'Faculty & Staff',
      'Student Activities',
      'Special Events'
    ]
  },
  imageUrl: {
    type: String,
    required: true
  },
  publicId: {
    type: String,
    required: true // used to delete from Cloudinary
  },
  sortOrder: {
    type: Number,
    default: 0
  }
}, { timestamps: true });

module.exports = mongoose.model('Gallery', gallerySchema);
