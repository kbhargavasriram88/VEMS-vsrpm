const mongoose = require('mongoose');

const admissionsSettingsSchema = new mongoose.Schema({
  hero: {
    badgeText: { type: String, default: "ADMISSIONS OPEN 2025-26" },
    titleLine1: { type: String, default: "Join Our" },
    titleLine2: { type: String, default: "Learning Community" },
    description: { type: String, default: "At Vivekananda E.M High School, we nurture young minds to become confident, responsible and future-ready citizens." },
    bgImageUrl: { type: String, default: "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=1920&q=80" },
    studentsImageUrl: { type: String, default: "https://images.unsplash.com/photo-1529390079861-591de354faf5?auto=format&fit=crop&w=800&q=80" }
  },
  process: [
    {
      icon: { type: String },
      title: { type: String },
      description: { type: String }
    }
  ],
  criteria: [
    {
      icon: { type: String },
      title: { type: String },
      description: { type: String }
    }
  ],
  faqs: [
    {
      question: { type: String },
      answer: { type: String }
    }
  ],
  alerts: [
    {
      text: { type: String },
      isActive: { type: Boolean, default: true }
    }
  ],
  admissionBanner: {
    title: { type: String, default: "ADMISSIONS OPEN FOR 2025-26" },
    subtitle: { type: String, default: "Give your child the best start for a bright future." },
    isActive: { type: Boolean, default: true }
  }
}, { timestamps: true });

module.exports = mongoose.model('AdmissionsSettings', admissionsSettingsSchema);
