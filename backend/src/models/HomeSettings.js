const mongoose = require('mongoose');

const homeSettingsSchema = new mongoose.Schema({
  heroBackgroundImage: { type: String, default: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=1920&q=80' },
  heroContent: {
    eyebrow: { type: String, default: "© Nurturing Minds, Building Futures" },
    heading: { type: String, default: "Welcome to <br /> Vivekananda <br /> E.M High School" },
    subtitle: { type: String, default: "Empowering students with quality education, values, and leadership skills to excel in a dynamic world." }
  },
  heroStats: {
    studentsCount: { type: String, default: "1500+" },
    staffCount: { type: String, default: "100+" },
    yearsExcellence: { type: String, default: "25+" }
  },
  achievements: {
    students: { type: String, default: "1500+" },
    teachers: { type: String, default: "85+" },
    classrooms: { type: String, default: "60+" },
    awards: { type: String, default: "200+" }
  },
  principalMessage: {
    name: { type: String, default: "Mr. R. Krishnamurthy" },
    designation: { type: String, default: "Principal" },
    text1: { type: String, default: "At Vivekananda E.M High School, we believe in nurturing not just academic excellence, but also values, discipline, and compassion. Our goal is to prepare students to be responsible global citizens and lifelong learners." },
    text2: { type: String, default: "Together, let us inspire young minds to dream, achieve and succeed." },
    signature: { type: String, default: "R. Krishnamurthy" },
    imageUrl: { type: String, default: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=800&q=80" }
  },
  highlights: [
    {
      icon: { type: String },
      title: { type: String },
      description: { type: String }
    }
  ],
  facilities: [
    {
      icon: { type: String },
      title: { type: String },
      imageUrl: { type: String }
    }
  ],
  testimonials: [
    {
      quote: { type: String },
      author: { type: String },
      role: { type: String },
      imageUrl: { type: String }
    }
  ],
  newsSection: {
    isActive: { type: Boolean, default: true },
    title: { type: String, default: "Latest News" },
    subtitle: { type: String, default: "Stay updated with the latest happenings at our school." }
  },
  eventsSection: {
    isActive: { type: Boolean, default: true },
    title: { type: String, default: "Upcoming Events" },
    subtitle: { type: String, default: "Don't miss out on our upcoming school events and activities." }
  },
  gallerySection: {
    isActive: { type: Boolean, default: true },
    title: { type: String, default: "Gallery Preview" },
    subtitle: { type: String, default: "Glimpses of life at Vivekananda E.M High School." }
  },
  welcomeModal: {
    isActive: { type: Boolean, default: true },
    announcements: [
      {
        title: { type: String },
        description: { type: String },
        imageUrl: { type: String }
      }
    ]
  }
}, { timestamps: true });

module.exports = mongoose.model('HomeSettings', homeSettingsSchema);
