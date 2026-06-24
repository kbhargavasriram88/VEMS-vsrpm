const mongoose = require('mongoose');

const academicsSettingsSchema = new mongoose.Schema({
  calendarPdfUrl: { type: String, default: "" },
  hero: {
    title: { type: String, default: "Academic Excellence" },
    description: { type: String, default: "Our academic programs are designed to cultivate curiosity, critical thinking, and a lifelong love for learning." },
    imageUrl: { type: String, default: "https://images.unsplash.com/photo-1532012197267-da84d127e765?auto=format&fit=crop&w=1200&q=80" }
  },
  programs: {
    primary: {
      icon: { type: String, default: "FaUserGraduate" },
      title: { type: String, default: "Primary School" },
      subtitle: { type: String, default: "Classes I - V" },
      description: { type: String, default: "Building strong foundations with joy, creativity and conceptual learning." },
      imageUrl: { type: String, default: "https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=800&q=80" },
      features: [{ type: String }],
      curriculumPdfUrl: { type: String, default: "" }
    },
    secondary: {
      icon: { type: String, default: "FaBookOpen" },
      title: { type: String, default: "Secondary School" },
      subtitle: { type: String, default: "Classes VI - X" },
      description: { type: String, default: "Focused on skill development, critical thinking and academic growth." },
      imageUrl: { type: String, default: "https://images.unsplash.com/photo-1577896851231-70ef18881754?auto=format&fit=crop&w=800&q=80" },
      features: [{ type: String }],
      curriculumPdfUrl: { type: String, default: "" }
    }
  },
  methodologies: [
    {
      icon: { type: String },
      title: { type: String },
      description: { type: String }
    }
  ],
  examinationProcess: [
    {
      title: { type: String },
      description: { type: String }
    }
  ]
}, { timestamps: true });

module.exports = mongoose.model('AcademicsSettings', academicsSettingsSchema);
