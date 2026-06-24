import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  FaArrowRight, FaClipboardList, FaSearch, FaUsers, FaMedal,
  FaCheckCircle, FaUserGraduate, FaFileAlt, FaBell,
  FaChevronDown, FaPaperPlane, FaGraduationCap, FaPhoneAlt, FaSpinner, FaLock
} from 'react-icons/fa';
import api from '../services/api';

const Admissions = () => {
  const [settings, setSettings] = useState(null);
  const [loadingSettings, setLoadingSettings] = useState(true);
  const [admissionsOpen, setAdmissionsOpen] = useState(true);
  const [openFaq, setOpenFaq] = useState(null);
  const [studentName, setStudentName] = useState('');
  const [parentName, setParentName] = useState('');
  const [gradeApplyingFor, setGradeApplyingFor] = useState('');
  const [dob, setDob] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const checkSettings = async () => {
      try {
        const { data } = await api.get('/general-settings');
        if (data && data.admissionsOpen !== undefined) {
          setAdmissionsOpen(data.admissionsOpen);
        }
      } catch (e) {
        console.error('Failed to fetch admissionsOpen status', e);
      }
    };
    checkSettings();
    window.addEventListener('school-settings-updated', checkSettings);

    const fetchSettings = async () => {
      try {
        const { data } = await api.get('/admissions-settings');
        setSettings(data);
      } catch (err) {
        console.error('Failed to load admissions settings:', err);
      } finally {
        setLoadingSettings(false);
      }
    };
    fetchSettings();

    return () => {
      window.removeEventListener('school-settings-updated', checkSettings);
      window.removeEventListener('storage', checkSettings);
    };
  }, []);

  const heroData = settings?.hero || {
    badgeText: "ADMISSIONS OPEN 2025-26",
    titleLine1: "Join Our",
    titleLine2: "Learning Community",
    description: "At Vivekananda E.M High School, we nurture young minds to become confident, responsible and future-ready citizens.",
    bgImageUrl: "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=1920&q=80",
    studentsImageUrl: "https://images.unsplash.com/photo-1529390079861-591de354faf5?auto=format&fit=crop&w=800&q=80"
  };

  const processData = settings?.process?.length > 0 ? settings.process : [
    { icon: "FaClipboardList", title: "Apply", description: "Fill out the online admission application form with required details." },
    { icon: "FaSearch", title: "Review", description: "Our admission team will review your application and documents." },
    { icon: "FaUsers", title: "Interview", description: "A brief interaction with the student and parents will be scheduled." },
    { icon: "FaMedal", title: "Admission", description: "Selected candidates will receive the admission offer." }
  ];

  const criteriaData = settings?.criteria?.length > 0 ? settings.criteria : [
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
  ];

  const faqsData = settings?.faqs?.length > 0 ? settings.faqs : [
    { question: "What is the age criteria for admission?", answer: "The age criteria vary by class. Generally, a child should be 5+ years old for Class I." },
    { question: "How can I apply for admission?", answer: "You can apply online through this admission form or visit the school office." },
    { question: "Is there an entrance test?", answer: "Yes, for classes VI and above, a basic proficiency test is conducted." },
    { question: "What are the school timings?", answer: "The regular school timings are from 8:00 AM to 3:00 PM, Monday to Saturday." },
    { question: "What documents are required?", answer: "Birth certificate, previous school records, Aadhaar card, and passport-size photographs." }
  ];

  const IconMap = {
    FaClipboardList, FaSearch, FaUsers, FaMedal, FaUserGraduate, FaFileAlt, FaCheckCircle, FaBell
  };

  const activeAlerts = settings?.alerts?.filter(a => a.isActive) || [];

  const toggleFaq = (index) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!studentName || !parentName || !gradeApplyingFor || gradeApplyingFor === 'Select Class' || !dob || !phone || !email || !address) {
      setError('Please fill in all required fields.');
      return;
    }
    setError('');
    setSubmitting(true);
    try {
      const payload = {
        studentName,
        parentName,
        gradeApplyingFor,
        email,
        phone,
        dob,
        address,
        message: `Date of Birth: ${dob} | Address: ${address}`
      };
      await api.post('/admissions', payload);
      setSubmitSuccess(true);
      setError('');
      // Reset form
      setStudentName('');
      setParentName('');
      setGradeApplyingFor('');
      setDob('');
      setPhone('');
      setEmail('');
      setAddress('');
      setTimeout(() => setSubmitSuccess(false), 5000);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Failed to submit application. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col bg-darkBg text-white w-full">
      
      {/* Active Alerts */}
      {admissionsOpen && activeAlerts.length > 0 && (
        <div className="w-full bg-accentGold text-darkBg py-3 px-6 text-center font-bold text-sm shadow-md z-20 relative">
          <div className="max-w-7xl mx-auto flex flex-col gap-2">
            {activeAlerts.map((alert, index) => (
              <div key={index} className="flex items-center justify-center gap-2">
                <FaBell className="shrink-0" />
                <span>{alert.text}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 1. Hero Section */}
      <section className="relative w-full min-h-[90vh] flex items-center pt-10 bg-darkCard border-b border-white/5 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img src={heroData.bgImageUrl} alt="School" className="w-full h-full object-cover opacity-35" />
          <div className="absolute inset-0 bg-gradient-to-r from-darkBg via-darkBg/90 to-transparent"></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-6 md:px-12 w-full flex flex-col-reverse md:flex-row items-center justify-between relative z-10 h-full">
          <div className="w-full md:w-1/2 flex flex-col items-start pt-16 md:pt-0">
            <span className="text-accentGold font-bold tracking-widest text-xs mb-4 uppercase flex items-center gap-2">
              <FaCheckCircle size={10} /> {heroData.badgeText}
            </span>
            <h1 className="text-5xl md:text-6xl font-extrabold text-accentGold leading-tight mb-2">
              {heroData.titleLine1}
            </h1>
            <h1 className="text-5xl md:text-6xl font-extrabold text-white leading-tight mb-6">
              {heroData.titleLine2}
            </h1>
            <p className="text-textSecondary max-w-sm text-sm leading-relaxed mb-8">
              {heroData.description}
            </p>
            <a href="#admission-form" className="bg-accentGold text-darkBg font-bold px-8 py-3 rounded-lg hover:bg-accentGoldDark transition-colors flex items-center gap-2 text-sm w-fit">
              Apply for Admission <FaArrowRight />
            </a>
          </div>
          
          <div className="w-full md:w-1/2 h-full flex items-end justify-center md:justify-end">
            <img src={heroData.studentsImageUrl} alt="Students" className="h-[90%] max-h-[500px] object-cover object-top mask-image-bottom drop-shadow-2xl" style={{ WebkitMaskImage: 'linear-gradient(to top, transparent, black 10%)' }} />
          </div>
        </div>
      </section>

      {/* 2. Admission Process Flowchart */}
      <section className="py-20 bg-darkBg border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 md:px-12 flex flex-col items-center">
          <h2 className="text-base font-bold text-textSecondary uppercase tracking-widest mb-16">Admission Process</h2>
          
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between w-full relative max-w-5xl">
            
            {/* Dotted Line Background */}
            <div className="hidden md:block absolute top-12 left-16 right-16 border-t border-dashed border-white/20 z-0"></div>

            {processData.map((step, index) => {
              const Icon = IconMap[step.icon] || FaCheckCircle;
              return (
                <div key={index} className={`flex flex-col items-center relative z-10 w-full md:w-1/4 px-4 text-center ${index > 0 ? 'mt-12 md:mt-0' : ''} group`}>
                  <div className="w-24 h-24 rounded-full border border-white/10 bg-darkCard flex items-center justify-center text-3xl text-white mb-6 group-hover:border-accentGold/50 transition-colors">
                    <Icon />
                  </div>
                  <div className="w-8 h-8 rounded-full bg-accentGold text-darkBg flex items-center justify-center font-bold text-sm absolute top-[72px] shadow-lg">
                    {String(index + 1).padStart(2, '0')}
                  </div>
                  <h4 className="text-lg font-bold text-white mb-2">{step.title}</h4>
                  <p className="text-base text-textSecondary leading-relaxed">{step.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 3. 3-Column Info Grid */}
      <section className="py-20 bg-darkBg">
        <div className="max-w-7xl mx-auto px-6 md:px-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {criteriaData.map((item, index) => {
            const Icon = IconMap[item.icon] || FaCheckCircle;
            const colors = [
              { border: "hover:border-accentGold/50", text: "text-accentGold", iconColor: "text-accentGold" },
              { border: "hover:border-green-500/50", text: "text-green-500", iconColor: "text-green-500" },
              { border: "hover:border-blue-500/50", text: "text-blue-500", iconColor: "text-blue-500" },
            ];
            const color = colors[index % colors.length];

            // Splitting criteria description by newline to form lists
            const points = item.description.split('\n').filter(p => p.trim() !== '');

            return (
              <div key={index} className={`bg-darkBg border border-white/5 p-8 rounded-2xl flex flex-col ${color.border} transition-colors`}>
                <div className="flex items-center gap-3 mb-8 border-b border-white/5 pb-4">
                  <Icon className={`${color.text} text-xl`} />
                  <h3 className="text-lg font-bold tracking-widest text-white uppercase">{item.title}</h3>
                </div>
                <ul className="flex flex-col gap-4">
                  {points.map((pt, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <FaCheckCircle className={`${color.icon} text-base flex-shrink-0 mt-0.5`} />
                      <span className="text-base text-textSecondary">{pt.trim()}</span>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}

        </div>
      </section>

      {/* 4. Form & FAQ Section */}
      <section id="admission-form" className="py-20 bg-darkBg scroll-mt-20">
        <div className="max-w-7xl mx-auto px-6 md:px-12 flex flex-col lg:flex-row gap-8">
          
          {/* Admission Form */}
          <div className="w-full lg:w-[65%] bg-darkCard border border-white/5 rounded-2xl p-8 md:p-10">
            <h2 className="text-lg font-bold text-white uppercase tracking-widest mb-8 border-b border-white/10 pb-4 text-center">Admission Form</h2>
            
            {error && (
              <div className="bg-red-900/30 border border-red-500/30 text-red-400 p-4 rounded-xl text-center font-bold text-base leading-relaxed mb-6">
                {error}
              </div>
            )}

            {submitSuccess && (
              <div className="bg-green-950/40 border border-green-500/20 text-green-400 p-4 rounded-xl text-center font-bold text-base leading-relaxed mb-6">
                Application submitted successfully! Our team will contact you shortly.
              </div>
            )}

            {!admissionsOpen ? (
              <div className="bg-darkBg border border-white/5 rounded-2xl p-10 flex flex-col items-center justify-center text-center gap-4">
                <FaLock className="text-5xl text-accentGold mb-2" />
                <h3 className="text-2xl font-bold text-white">Admissions are Closed</h3>
                <p className="text-textSecondary text-base max-w-md">
                  We are not currently accepting online admission requests for this academic year. 
                  Please contact the school administration office for further details.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-bold text-white">Student Name <span className="text-red-500">*</span></label>
                  <input 
                    type="text" 
                    placeholder="Enter student full name" 
                    value={studentName}
                    onChange={e => setStudentName(e.target.value)}
                    className="w-full bg-darkBg border border-white/10 rounded-lg px-4 py-3 text-base text-white placeholder-textSecondary focus:border-accentGold outline-none transition-colors"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-bold text-white">Parent / Guardian Name <span className="text-red-500">*</span></label>
                  <input 
                    type="text" 
                    placeholder="Enter parent/guardian name" 
                    value={parentName}
                    onChange={e => setParentName(e.target.value)}
                    className="w-full bg-darkBg border border-white/10 rounded-lg px-4 py-3 text-base text-white placeholder-textSecondary focus:border-accentGold outline-none transition-colors"
                  />
                </div>
              </div>
 
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-bold text-white">Class Applying For <span className="text-red-500">*</span></label>
                  <select 
                    value={gradeApplyingFor}
                    onChange={e => setGradeApplyingFor(e.target.value)}
                    className="w-full bg-darkBg border border-white/10 rounded-lg px-4 py-3 text-base text-textSecondary focus:border-accentGold outline-none transition-colors appearance-none cursor-pointer"
                  >
                    <option value="">Select Class</option>
                    <option value="Class I">Class I</option>
                    <option value="Class II">Class II</option>
                    <option value="Class III">Class III</option>
                    <option value="Class IV">Class IV</option>
                    <option value="Class V">Class V</option>
                    <option value="Class VI">Class VI</option>
                    <option value="Class VII">Class VII</option>
                    <option value="Class VIII">Class VIII</option>
                    <option value="Class IX">Class IX</option>
                    <option value="Class X">Class X</option>
                  </select>
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-bold text-white">Date of Birth <span className="text-red-500">*</span></label>
                  <input 
                    type="date" 
                    value={dob}
                    onChange={e => setDob(e.target.value)}
                    className="w-full bg-darkBg border border-white/10 rounded-lg px-4 py-3 text-base text-textSecondary focus:border-accentGold outline-none transition-colors"
                  />
                </div>
              </div>
 
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-bold text-white">Mobile Number <span className="text-red-500">*</span></label>
                  <input 
                    type="tel" 
                    placeholder="Enter mobile number" 
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    className="w-full bg-darkBg border border-white/10 rounded-lg px-4 py-3 text-base text-white placeholder-textSecondary focus:border-accentGold outline-none transition-colors"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-bold text-white">Email Address <span className="text-red-500">*</span></label>
                  <input 
                    type="email" 
                    placeholder="Enter email address" 
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className="w-full bg-darkBg border border-white/10 rounded-lg px-4 py-3 text-base text-white placeholder-textSecondary focus:border-accentGold outline-none transition-colors"
                  />
                </div>
              </div>
 
              <div className="flex flex-col gap-2">
                <label className="text-sm font-bold text-white">Address <span className="text-red-500">*</span></label>
                <textarea 
                  rows="3" 
                  placeholder="Enter complete address" 
                  value={address}
                  onChange={e => setAddress(e.target.value)}
                  className="w-full bg-darkBg border border-white/10 rounded-lg px-4 py-3 text-base text-white placeholder-textSecondary focus:border-accentGold outline-none transition-colors resize-none"
                ></textarea>
              </div>
 
              <button 
                type="submit" 
                disabled={submitting}
                className="w-full bg-accentGold text-darkBg font-bold px-8 py-3.5 rounded-lg flex items-center justify-center gap-2 hover:bg-accentGoldDark transition-colors text-base mt-2 disabled:opacity-50 disabled:pointer-events-none"
              >
                {submitting ? 'Submitting Application...' : 'Submit Application'} <FaPaperPlane />
              </button>
            </form>
            )}
          </div>
 
          {/* FAQs & Contact */}
          <div className="w-full lg:w-[35%] flex flex-col gap-6">
            <div className="bg-darkBg border border-white/5 rounded-2xl p-8 flex flex-col">
              <h2 className="text-lg font-bold text-white uppercase tracking-widest mb-8 border-b border-white/10 pb-4 text-center">Frequently Asked Questions</h2>
              
              <div className="flex flex-col gap-2">
                {faqsData.map((faq, index) => (
                  <div key={index} className="border-b border-white/5 pb-2">
                    <button 
                      onClick={() => toggleFaq(index)}
                      className="w-full flex items-center justify-between py-4 text-left hover:text-accentGold transition-colors"
                    >
                      <span className="text-base font-bold text-white">{faq.question}</span>
                      <FaChevronDown className={`text-textSecondary text-base transition-transform ${openFaq === index ? 'rotate-180 text-accentGold' : ''}`} />
                    </button>
                    <div className={`overflow-hidden transition-all duration-300 ${openFaq === index ? 'max-h-40 opacity-100 mb-4' : 'max-h-0 opacity-0'}`}>
                      <p className="text-base text-textSecondary leading-relaxed">{faq.answer}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
 
            <div className="bg-darkCard border border-white/5 rounded-2xl p-8 flex flex-col md:flex-row items-center justify-between gap-6 hover:border-accentGold/30 transition-colors mt-auto">
              <div>
                <h3 className="text-lg font-bold text-white mb-1">Still have questions?</h3>
                <p className="text-base text-textSecondary">We're here to help you.</p>
              </div>
              <Link to="/contact" className="border border-accentGold text-accentGold px-6 py-2 rounded-lg text-base font-bold hover:bg-accentGold hover:text-darkBg transition-colors whitespace-nowrap inline-block">
                Contact Us <FaPhoneAlt className="inline ml-1 mb-0.5" />
              </Link>
            </div>
          </div>
 
        </div>
      </section>

      {/* 5. Bottom Banner */}
      {settings?.admissionBanner?.isActive !== false && (
        <section className="py-20 bg-darkBg">
          <div className="max-w-7xl mx-auto px-6 md:px-12">
            <div className="bg-accentGold rounded-2xl p-10 md:p-14 flex flex-col md:flex-row items-center justify-between text-darkBg shadow-2xl relative overflow-hidden">
              <div className="absolute right-0 top-0 w-64 h-64 bg-white/10 rounded-full blur-[30px]"></div>
              <div className="relative z-10 flex items-center gap-6 mb-6 md:mb-0">
                <div className="w-16 h-16 rounded-full border border-darkBg/20 flex items-center justify-center text-darkBg text-3xl opacity-80">
                  <FaGraduationCap />
                </div>
                <div className="text-center md:text-left">
                  <h2 className="text-3xl font-black mb-2 tracking-tight">{settings?.admissionBanner?.title || "ADMISSIONS OPEN FOR 2025-26"}</h2>
                  <p className="text-sm font-bold opacity-80">{settings?.admissionBanner?.subtitle || "Give your child the best start for a bright future."}</p>
                </div>
              </div>
              <a href="#admission-form" className="relative z-10 bg-darkBg text-white px-10 py-4 rounded-xl font-bold flex items-center gap-3 hover:bg-black transition-colors w-full md:w-auto justify-center">
                Apply Now <FaArrowRight />
              </a>
            </div>
          </div>
        </section>
      )}

    </div>
  );
};

export default Admissions;
