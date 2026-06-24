const mongoose = require('mongoose');

const aboutSettingsSchema = new mongoose.Schema({
  hero: {
    title: { type: String, default: "About Our School" },
    description: { type: String, default: "Nurturing young minds with values, knowledge and a vision for a better tomorrow." },
    backgroundImage: { type: String, default: "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=1920&q=80" }
  },
  history: {
    title: { type: String, default: "Our Journey of Excellence" },
    description: { type: String, default: "For over two decades, Vivekananda E.M High School has been a pillar of quality education, shaping future leaders with strong values and academic excellence." },
    timeline: [
      {
        year: { type: String },
        title: { type: String },
        description: { type: String }
      }
    ]
  },
  visionMission: {
    vision: { type: String, default: "To be a leading institution that empowers students to achieve academic excellence, embrace values, and become responsible global citizens." },
    mission: { type: String, default: "To provide quality education in a safe and inclusive environment, fostering creativity, critical thinking, and a lifelong love for learning." }
  },
  values: [
    {
      icon: { type: String },
      title: { type: String },
      description: { type: String }
    }
  ],
  management: [
    {
      name: { type: String },
      designation: { type: String },
      imageUrl: { type: String }
    }
  ],
  principalMessage: {
    name: { type: String, default: "Mr. R. Krishnamurthy" },
    designation: { type: String, default: "Principal" },
    text: { type: String, default: "At Vivekananda E.M High School, we believe education is not just about learning subjects, but about building character, confidence and compassion. Our dedicated faculty and holistic approach ensure every child discovers their potential and steps into the future with courage and responsibility." },
    signature: { type: String, default: "R. Krishnamurthy" },
    imageUrl: { type: String, default: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=600&q=80" }
  },
  infrastructure: [
    {
      title: { type: String },
      imageUrl: { type: String }
    }
  ]
}, { timestamps: true });

module.exports = mongoose.model('AboutSettings', aboutSettingsSchema);
