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
    enum: ['Infrastructure', 'Events', 'Academics', 'Sports', 'Other']
  },
  imageUrl: {
    type: String,
    required: true
  },
  publicId: {
    type: String,
    required: true // used to delete from Cloudinary
  }
}, { timestamps: true });

module.exports = mongoose.model('Gallery', gallerySchema);
