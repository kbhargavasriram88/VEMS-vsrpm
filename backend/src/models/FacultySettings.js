const mongoose = require('mongoose');

const facultySettingsSchema = new mongoose.Schema({
  hero: {
    backgroundImage: { 
      type: String, 
      default: "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=1920&q=80" 
    },
    sideImage: {
      type: String,
      default: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=800&q=80"
    }
  }
}, { timestamps: true });

module.exports = mongoose.model('FacultySettings', facultySettingsSchema);
