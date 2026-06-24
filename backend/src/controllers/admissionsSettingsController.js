const AdmissionsSettings = require('../models/AdmissionsSettings');

const getAdmissionsSettings = async (req, res) => {
  try {
    let settings = await AdmissionsSettings.findOne({});
    if (!settings) {
      settings = await AdmissionsSettings.create({
        hero: {
          badgeText: "ADMISSIONS OPEN 2025-26",
          titleLine1: "Join Our",
          titleLine2: "Learning Community",
          description: "At Vivekananda E.M High School, we nurture young minds to become confident, responsible and future-ready citizens.",
          bgImageUrl: "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=1920&q=80",
          studentsImageUrl: "https://images.unsplash.com/photo-1529390079861-591de354faf5?auto=format&fit=crop&w=800&q=80"
        },
        process: [
          { icon: "FaClipboardList", title: "Apply", description: "Fill out the online admission application form with required details." },
          { icon: "FaSearch", title: "Review", description: "Our admission team will review your application and documents." },
          { icon: "FaUsers", title: "Interview", description: "Shortlisted candidates will be called for an interaction/interview." },
          { icon: "FaMedal", title: "Admission", description: "Successful candidates will receive the admission confirmation." }
        ],
        criteria: [
          { 
            icon: "FaUserGraduate", 
            title: "Eligibility Criteria", 
            description: "Age criteria as per the class applied\nPrevious academic records\nGood conduct & discipline\nBased on seat availability" 
          },
          { 
            icon: "FaFileAlt", 
            title: "Required Documents", 
            description: "Birth Certificate (Student)\nAadhaar Card (Student)\nPrevious School Report Card\nTransfer Certificate (if applicable)\nPassport Size Photographs (2)\nAddress Proof\nParent/Guardian ID Proof" 
          },
          { 
            icon: "FaBell", 
            title: "Important Notes", 
            description: "Incomplete applications will not be processed.\nAdmission is subject to seat availability.\nManagement decision will be final." 
          }
        ],
        faqs: [
          { question: "What is the age criteria for admission?", answer: "The age criteria vary by class. Generally, a child should be 5+ years old for Class I." },
          { question: "How can I apply for admission?", answer: "You can apply online through this admission form or visit the school office." },
          { question: "Is there an entrance test?", answer: "Yes, for classes VI and above, a basic proficiency test is conducted." },
          { question: "What are the school timings?", answer: "The regular school timings are from 8:00 AM to 3:00 PM, Monday to Saturday." },
          { question: "What documents are required?", answer: "Birth certificate, previous school records, Aadhaar card, and passport-size photographs." }
        ],
        alerts: [
          { text: "Admissions for academic year 2025-26 are now open. Apply before limited seats fill up!", isActive: true }
        ],
        admissionBanner: {
          title: "ADMISSIONS OPEN FOR 2025-26",
          subtitle: "Give your child the best start for a bright future.",
          isActive: true
        }
      });
    }
    res.json(settings);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

const updateAdmissionsSettings = async (req, res) => {
  try {
    let settings = await AdmissionsSettings.findOne({});
    if (!settings) {
      settings = new AdmissionsSettings(req.body);
    } else {
      settings.hero = req.body.hero || settings.hero;
      settings.process = req.body.process || settings.process;
      settings.criteria = req.body.criteria || settings.criteria;
      settings.faqs = req.body.faqs || settings.faqs;
      settings.alerts = req.body.alerts || settings.alerts;
      settings.admissionBanner = req.body.admissionBanner || settings.admissionBanner;
    }
    await settings.save();
    res.json(settings);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

module.exports = { getAdmissionsSettings, updateAdmissionsSettings };
