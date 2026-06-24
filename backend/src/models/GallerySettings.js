const mongoose = require('mongoose');

const gallerySettingsSchema = new mongoose.Schema({
  hero: {
    backgroundImage: { 
      type: String, 
      default: "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=1920&q=80" 
    },
    sideImage: {
      type: String,
      default: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=800&q=80"
    }
  }
}, { timestamps: true });

module.exports = mongoose.model('GallerySettings', gallerySettingsSchema);
