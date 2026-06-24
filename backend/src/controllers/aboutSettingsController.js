const AboutSettings = require('../models/AboutSettings');

const getAboutSettings = async (req, res) => {
  try {
    let settings = await AboutSettings.findOne({});
    if (!settings) {
      // Create default settings matching the about page static mockup design
      settings = await AboutSettings.create({
        hero: {
          title: "About Our School",
          description: "Nurturing young minds with values, knowledge and a vision for a better tomorrow.",
          backgroundImage: "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=1920&q=80"
        },
        history: {
          title: "Our Journey of Excellence",
          description: "For over two decades, Vivekananda E.M High School has been a pillar of quality education, shaping future leaders with strong values and academic excellence.",
          timeline: [
            { year: "1998", title: "Established", description: "School was founded with a vision to provide quality education." },
            { year: "2005", title: "Expansion", description: "Added new facilities, more classrooms and advanced labs." },
            { year: "2012", title: "Growth", description: "Introduced modern teaching methods and digital learning." },
            { year: "2020", title: "Excellence", description: "Recognized for academic excellence and holistic development." }
          ]
        },
        visionMission: {
          vision: "To be a leading institution that empowers students to achieve academic excellence, embrace values, and become responsible global citizens.",
          mission: "To provide quality education in a safe and inclusive environment, fostering creativity, critical thinking, and a lifelong love for learning."
        },
        values: [
          { icon: "FaShieldAlt", title: "Integrity", description: "We uphold honesty, transparency and strong moral values in all our actions." },
          { icon: "FaStar", title: "Excellence", description: "We strive for the highest standards in academics and co-curricular activities." },
          { icon: "FaUserTie", title: "Discipline", description: "We encourage self-discipline, punctuality and respect for oneself and others." },
          { icon: "FaLightbulb", title: "Innovation", description: "We embrace creativity and innovation to prepare students for the future." }
        ],
        management: [
          { name: "Sri K. Raghava Rao", designation: "Chairman", imageUrl: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=300&q=80" },
          { name: "Smt. L. Padmaja", designation: "Vice Chairperson", imageUrl: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80" },
          { name: "Sri M. Suresh Babu", designation: "Correspondent", imageUrl: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=300&q=80" },
          { name: "Sri P. Anand", designation: "Administrative Officer", imageUrl: "https://images.unsplash.com/photo-1556157382-97eda2d62296?auto=format&fit=crop&w=300&q=80" },
          { name: "Smt. R. Kavitha", designation: "Academic Director", imageUrl: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=300&q=80" }
        ],
        principalMessage: {
          name: "Mr. R. Krishnamurthy",
          designation: "Principal",
          text: "At Vivekananda E.M High School, we believe education is not just about learning subjects, but about building character, confidence and compassion. Our dedicated faculty and holistic approach ensure every child discovers their potential and steps into the future with courage and responsibility.",
          signature: "R. Krishnamurthy",
          imageUrl: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=600&q=80"
        },
        infrastructure: [
          { title: "Smart Classrooms", imageUrl: "https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=600&q=80" },
          { title: "Science Laboratories", imageUrl: "https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&w=600&q=80" },
          { title: "Library", imageUrl: "https://images.unsplash.com/photo-1507842217343-583bb7270b66?auto=format&fit=crop&w=600&q=80" },
          { title: "Sports Complex", imageUrl: "https://images.unsplash.com/photo-1526676037777-05a232554f77?auto=format&fit=crop&w=600&q=80" },
          { title: "Auditorium", imageUrl: "https://images.unsplash.com/photo-1516321497487-e288fb19713f?auto=format&fit=crop&w=600&q=80" }
        ]
      });
    }
    res.json(settings);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

const updateAboutSettings = async (req, res) => {
  try {
    let settings = await AboutSettings.findOne({});
    if (!settings) {
      settings = new AboutSettings(req.body);
    } else {
      settings.hero = req.body.hero || settings.hero;
      settings.history = req.body.history || settings.history;
      settings.visionMission = req.body.visionMission || settings.visionMission;
      settings.values = req.body.values || settings.values;
      settings.management = req.body.management || settings.management;
      settings.principalMessage = req.body.principalMessage || settings.principalMessage;
      settings.infrastructure = req.body.infrastructure || settings.infrastructure;
    }
    await settings.save();
    res.json(settings);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

const uploadAboutImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }
    res.json({ imageUrl: req.file.path });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

module.exports = { getAboutSettings, updateAboutSettings, uploadAboutImage };
