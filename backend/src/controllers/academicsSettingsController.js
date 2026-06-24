const AcademicsSettings = require('../models/AcademicsSettings');

const getAcademicsSettings = async (req, res) => {
  try {
    let settings = await AcademicsSettings.findOne({});
    if (!settings) {
      settings = await AcademicsSettings.create({
        hero: {
          title: "Academic <br/> Excellence",
          description: "Our academic programs are designed to cultivate curiosity, critical thinking, and a lifelong love for learning.",
          imageUrl: "https://images.unsplash.com/photo-1532012197267-da84d127e765?auto=format&fit=crop&w=1200&q=80"
        },
        programs: {
          primary: {
            title: "Primary School",
            subtitle: "Classes I - V",
            description: "Building strong foundations with joy, creativity and conceptual learning.",
            imageUrl: "https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=800&q=80",
            features: [
              "Focus on foundational literacy and numeracy",
              "Activity-based and experiential learning",
              "Moral values and basic life skills",
              "Co-curricular and art integration",
              "Safe, inclusive and joyful environment"
            ]
          },
          secondary: {
            title: "Secondary School",
            subtitle: "Classes VI - X",
            description: "Focused on skill development, critical thinking and academic growth.",
            imageUrl: "https://images.unsplash.com/photo-1577896851231-70ef18881754?auto=format&fit=crop&w=800&q=80",
            features: [
              "Focused on concept clarity, logical analysis and critical thinking",
              "Advanced science laboratory experiments and computer classes",
              "Preparation for standard board examinations and external talent tests",
              "Active participation in sports leagues, debate clubs, and performing arts",
              "Core values, leadership training, and foundation for higher study streams"
            ]
          }
        },
        methodologies: [
          { icon: "FaUsers", title: "Student-Centered <br/> Learning", description: "Engaging students through participation and collaboration." },
          { icon: "FaChalkboardTeacher", title: "Interactive Classroom <br/> Sessions", description: "Technology-enabled classrooms for better understanding." },
          { icon: "FaLightbulb", title: "Experiential <br/> Learning", description: "Learning by doing through activities and projects." },
          { icon: "FaCheckCircle", title: "Holistic <br/> Development", description: "Focus on academic, emotional, social and physical growth." }
        ],
        examinationProcess: [
          { title: "Preparation", description: "Syllabus planning, study material and doubt clearing sessions." },
          { title: "Internal Assessments", description: "Regular tests, assignments and practical evaluations." },
          { title: "Term Examinations", description: "Periodic exams to assess concept understanding." },
          { title: "Result Analysis", description: "Performance analysis and progress reports." },
          { title: "Parent Interaction", description: "Meetings and feedback for overall development." }
        ]
      });
    }
    res.json(settings);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

const updateAcademicsSettings = async (req, res) => {
  try {
    let settings = await AcademicsSettings.findOne({});
    if (!settings) {
      settings = new AcademicsSettings(req.body);
    } else {
      if (req.body.calendarPdfUrl !== undefined) settings.calendarPdfUrl = req.body.calendarPdfUrl;
      if (req.body.hero) settings.hero = req.body.hero;
      if (req.body.programs) settings.programs = req.body.programs;
      if (req.body.methodologies) settings.methodologies = req.body.methodologies;
      if (req.body.examinationProcess) settings.examinationProcess = req.body.examinationProcess;
      
      settings.markModified('programs');
    }
    await settings.save();
    res.json(settings);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

const uploadAcademicsImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }
    res.json({ imageUrl: req.file.path });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

module.exports = { getAcademicsSettings, updateAcademicsSettings, uploadAcademicsImage };
