const HomeSettings = require('../models/HomeSettings');

const getHomeSettings = async (req, res) => {
  try {
    let settings = await HomeSettings.findOne({});
    if (!settings) {
      // Create defaults matching the homepage static design
      settings = await HomeSettings.create({
        heroBackgroundImage: "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=1920&q=80",
        heroStats: {
          studentsCount: "1500+",
          staffCount: "100+",
          yearsExcellence: "25+"
        },
        achievements: {
          students: "1500+",
          teachers: "85+",
          classrooms: "60+",
          awards: "200+"
        },
        principalMessage: {
          name: "Mr. R. Krishnamurthy",
          designation: "Principal",
          text1: "At Vivekananda E.M High School, we believe in nurturing not just academic excellence, but also values, discipline, and compassion. Our goal is to prepare students to be responsible global citizens and lifelong learners.",
          text2: "Together, let us inspire young minds to dream, achieve and succeed.",
          signature: "R. Krishnamurthy",
          imageUrl: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=800&q=80"
        },
        highlights: [
          { icon: "FaGraduationCap", title: "Academic Excellence", description: "Quality education with innovative teaching methodologies." },
          { icon: "FaChalkboardTeacher", title: "Qualified Faculty", description: "Experienced and dedicated teachers committed to student success." },
          { icon: "FaBuilding", title: "Modern Infrastructure", description: "State-of-the-art facilities for a safe and inspiring learning environment." },
          { icon: "FaGlobe", title: "Co-Curricular Activities", description: "Encouraging talents through sports, arts, clubs and competitions." }
        ],
        facilities: [
          { icon: "FaDesktop", title: "Smart Classrooms", imageUrl: "https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=600&q=80" },
          { icon: "FaLaptopCode", title: "Computer Lab", imageUrl: "https://images.unsplash.com/photo-1516321497487-e288fb19713f?auto=format&fit=crop&w=600&q=80" },
          { icon: "FaFlask", title: "Science Lab", imageUrl: "https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&w=600&q=80" },
          { icon: "FaBookOpen", title: "Library", imageUrl: "https://images.unsplash.com/photo-1507842217343-583bb7270b66?auto=format&fit=crop&w=600&q=80" },
          { icon: "FaTrophy", title: "Sports Complex", imageUrl: "https://images.unsplash.com/photo-1526676037777-05a232554f77?auto=format&fit=crop&w=600&q=80" },
          { icon: "FaBusAlt", title: "Transportation", imageUrl: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=600&q=80" }
        ],
        testimonials: [
          { quote: "Vivekananda E.M High School has given my child the perfect blend of education and values. We are proud to be a part of this wonderful institution.", author: "Mrs. Kavitha Reddy", role: "Parent", imageUrl: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80" }
        ],
        welcomeModal: {
          isActive: true,
          announcements: [
            {
              title: "Admissions Open 2025-26",
              description: "Admissions are now open for the upcoming academic year. Apply now to secure your child's future.",
              imageUrl: "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=800&q=80"
            },
            {
              title: "State-of-the-Art Facilities",
              description: "Experience our newly upgraded smart classrooms and modern infrastructure.",
              imageUrl: "https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=800&q=80"
            },
            {
              title: "Annual Sports Meet",
              description: "Join us for the annual sports meet featuring track, field, and team events.",
              imageUrl: "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&w=800&q=80"
            }
          ]
        }
      });
    }
    res.json(settings);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

const updateHomeSettings = async (req, res) => {
  try {
    let settings = await HomeSettings.findOne({});
    if (!settings) {
      settings = new HomeSettings(req.body);
    } else {
      settings.heroBackgroundImage = req.body.heroBackgroundImage || settings.heroBackgroundImage;
      settings.heroContent = req.body.heroContent || settings.heroContent;
      settings.heroStats = req.body.heroStats || settings.heroStats;
      settings.achievements = req.body.achievements || settings.achievements;
      settings.principalMessage = req.body.principalMessage || settings.principalMessage;
      settings.highlights = req.body.highlights || settings.highlights;
      settings.facilities = req.body.facilities || settings.facilities;
      settings.testimonials = req.body.testimonials || settings.testimonials;
      settings.newsSection = req.body.newsSection || settings.newsSection;
      settings.eventsSection = req.body.eventsSection || settings.eventsSection;
      settings.gallerySection = req.body.gallerySection || settings.gallerySection;
      settings.welcomeModal = req.body.welcomeModal || settings.welcomeModal;
    }
    await settings.save();
    res.json(settings);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

const uploadHomeImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }
    res.json({ imageUrl: req.file.path });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

module.exports = { getHomeSettings, updateHomeSettings, uploadHomeImage };
