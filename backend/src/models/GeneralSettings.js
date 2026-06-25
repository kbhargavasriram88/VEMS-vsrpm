const mongoose = require('mongoose');

const generalSettingsSchema = new mongoose.Schema({
  schoolName: { type: String, default: 'Vivekananda E.M High School' },
  schoolLogoUrl: { type: String, default: 'https://res.cloudinary.com/dcsngtknz/image/upload/v1781580525/IMG-20260616-WA0000_ckiv3k.jpg' },
  phone: { type: String, default: '+91 866 123 4567' },
  email: { type: String, default: 'info@vemhs.edu.in' },
  address: { type: String, default: '# 12-3-45, Moghalrajapuram, Vijayawada, AP - 520010' },
  hours: { type: String, default: 'Monday - Saturday, 8:30 AM - 4:30 PM' },
  admissionsOpen: { type: Boolean, default: true },
  maintenanceMode: { type: Boolean, default: false },
  calendarPdfUrl: { type: String, default: '' },
  whatsappNumber: { type: String, default: '1234567890' },
  socialLinks: {
    facebook: { type: String, default: '' },
    twitter: { type: String, default: '' },
    instagram: { type: String, default: '' },
    linkedin: { type: String, default: '' },
    youtube: { type: String, default: '' }
  },
  mapUrl: { type: String, default: 'https://maps.google.com/maps?q=VIVEKANANDA%20E%20M%20PRIMARY%20%26%20HIGH%20SCHOOL%20Visweswaraya%20Puram,%20Gudimellanka,%20Viswesarayapuram,%20Andhra%20Pradesh%20533253,%20India&t=&z=13&ie=UTF8&iwloc=&output=embed' }
}, { timestamps: true });

module.exports = mongoose.model('GeneralSettings', generalSettingsSchema);
