import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  FaPlayCircle, FaArrowRight, FaBookOpen, FaCheckCircle, 
  FaUserGraduate, FaChalkboardTeacher, FaUsers, FaLightbulb,
  FaFileDownload, FaChevronRight, FaGraduationCap, FaRegCalendarAlt
} from 'react-icons/fa';

import api from '../services/api';

const Academics = () => {
  const [activeTab, setActiveTab] = useState('primary');
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const { data } = await api.get('/academics-settings');
        setSettings(data);
      } catch (error) {
        console.error('Failed to load academics settings:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, []);

  const calendarPdfUrl = settings?.calendarPdfUrl || '';

  if (loading) {
    return <div className="min-h-screen bg-darkBg flex items-center justify-center text-accentGold">Loading...</div>;
  }

  // Use dynamic settings or fallbacks
  const heroData = settings?.hero || { title: 'Academic Excellence', description: 'Our academic programs are designed to cultivate curiosity, critical thinking, and a lifelong love for learning.', imageUrl: 'https://images.unsplash.com/photo-1532012197267-da84d127e765?auto=format&fit=crop&w=1200&q=80' };
  const programsData = (settings?.programs && settings.programs.primary?.features?.length > 0) ? settings.programs : {
    primary: {
      title: 'Primary School', subtitle: 'Classes I - V',
      description: 'Building strong foundations with joy, creativity and conceptual learning.',
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
      title: 'Secondary School', subtitle: 'Classes VI - X',
      description: 'Focused on skill development, critical thinking and academic growth.',
      imageUrl: "https://images.unsplash.com/photo-1577896851231-70ef18881754?auto=format&fit=crop&w=800&q=80",
      features: [
        "Focused on concept clarity, logical analysis and critical thinking",
        "Advanced science laboratory experiments and computer classes",
        "Preparation for standard board examinations and external talent tests",
        "Active participation in sports leagues, debate clubs, and performing arts",
        "Core values, leadership training, and foundation for higher study streams"
      ]
    }
  };
  const methodologiesData = settings?.methodologies?.length > 0 ? settings.methodologies : [
    { icon: "FaUsers", title: "Student-Centered <br/> Learning", description: "Engaging students through participation and collaboration." },
    { icon: "FaChalkboardTeacher", title: "Interactive Classroom <br/> Sessions", description: "Technology-enabled classrooms for better understanding." },
    { icon: "FaLightbulb", title: "Experiential <br/> Learning", description: "Learning by doing through activities and projects." },
    { icon: "FaCheckCircle", title: "Holistic <br/> Development", description: "Focus on academic, emotional, social and physical growth." }
  ];
  const examinationProcessData = settings?.examinationProcess?.length > 0 ? settings.examinationProcess : [
    { title: "Preparation", description: "Syllabus planning, study material and doubt clearing sessions." },
    { title: "Internal Assessments", description: "Regular tests, assignments and practical evaluations." },
    { title: "Term Examinations", description: "Periodic exams to assess concept understanding." },
    { title: "Result Analysis", description: "Performance analysis and progress reports." },
    { title: "Parent Interaction", description: "Meetings and feedback for overall development." }
  ];

  // Dynamic icon map
  const IconMap = {
    FaUserGraduate, FaBookOpen, FaChalkboardTeacher, FaUsers, FaLightbulb, FaCheckCircle
  };

  const PrimaryIcon = IconMap[programsData.primary?.icon] || FaUserGraduate;
  const SecondaryIcon = IconMap[programsData.secondary?.icon] || FaBookOpen;

  return (
    <div className="flex flex-col bg-darkBg text-white w-full">
      
      {/* 1. Hero Section */}
      <section className="relative w-full min-h-[90vh] flex items-center pt-10 bg-darkCard border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 md:px-12 w-full flex flex-col-reverse md:flex-row items-center justify-between gap-12">
          <div className="w-full md:w-1/2 flex flex-col items-start z-10 pt-16 md:pt-0">
            <span className="text-accentGold font-bold tracking-widest text-xs mb-4 uppercase">© Nurturing Minds, Building Futures</span>
            <h1 className="text-5xl md:text-6xl font-extrabold text-white leading-tight mb-6" dangerouslySetInnerHTML={{ __html: heroData.title }}></h1>
            <p className="text-textSecondary max-w-md text-sm mb-8 leading-relaxed">
              {heroData.description}
            </p>
            <a href="#programs" className="bg-accentGold text-darkBg font-bold px-8 py-3 rounded hover:bg-accentGoldDark transition-colors flex items-center gap-2 w-fit">
              Explore Programs <FaPlayCircle />
            </a>
          </div>
          
          <div className="w-full md:w-1/2 h-full flex items-end justify-end relative">
            {/* Dark gradient fade for the image edge */}
            <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-darkCard to-transparent z-10 hidden md:block"></div>
            <img src={heroData.imageUrl} alt={heroData.title.replace(/<[^>]+>/g, '')} className="w-full max-w-lg object-cover rounded-xl shadow-2xl relative z-0 opacity-80" />
          </div>
        </div>
      </section>
      {/* 2. Academic Programs */}
      <section id="programs" className="py-24 bg-darkBg border-b border-white/5 scroll-mt-20">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <h2 className="text-base font-bold text-textSecondary uppercase tracking-widest mb-12">Academic Programs</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
            
            {/* Primary School */}
            <div className="bg-darkCard border border-white/5 p-8 rounded-2xl flex gap-6 hover:border-blue-500/30 transition-colors group cursor-pointer" onClick={() => setActiveTab('primary')}>
              <div className="w-16 h-16 rounded-full bg-blue-900/20 flex items-center justify-center text-blue-500 text-2xl flex-shrink-0 group-hover:scale-110 transition-transform">
                <PrimaryIcon />
              </div>
              <div className="flex flex-col">
                <h3 className="text-blue-500 font-bold text-lg mb-1">{programsData.primary?.title}</h3>
                <p className="text-base text-textSecondary font-bold mb-4">{programsData.primary?.subtitle}</p>
                <p className="text-base text-textSecondary leading-relaxed mb-6 flex-grow">
                  {programsData.primary?.description}
                </p>
                <span className="text-blue-500 text-base font-bold flex items-center gap-1 hover:underline mt-auto cursor-pointer">
                  View Curriculum <FaArrowRight size={10}/>
                </span>
              </div>
            </div>
 
            {/* Secondary School */}
            <div className="bg-darkCard border border-white/5 p-8 rounded-2xl flex gap-6 hover:border-green-500/30 transition-colors group cursor-pointer" onClick={() => setActiveTab('secondary')}>
              <div className="w-16 h-16 rounded-full bg-green-900/20 flex items-center justify-center text-green-500 text-2xl flex-shrink-0 group-hover:scale-110 transition-transform">
                <SecondaryIcon />
              </div>
              <div className="flex flex-col">
                <h3 className="text-green-500 font-bold text-lg mb-1">{programsData.secondary?.title}</h3>
                <p className="text-base text-textSecondary font-bold mb-4">{programsData.secondary?.subtitle}</p>
                <p className="text-base text-textSecondary leading-relaxed mb-6 flex-grow">
                  {programsData.secondary?.description}
                </p>
                <span className="text-green-500 text-base font-bold flex items-center gap-1 hover:underline mt-auto cursor-pointer">
                  View Curriculum <FaArrowRight size={10}/>
                </span>
              </div>
            </div>

          </div>
        </div>
      </section>
      {/* 3. Curriculum Tabs */}
      <section className="py-24 bg-darkBg border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <h2 className="text-base font-bold text-textSecondary uppercase tracking-widest mb-10">Curriculum</h2>
          
          {/* Tabs Navigation */}
          <div className="flex justify-center mb-10">
            <div className="bg-darkCard rounded-full border border-white/10 p-1 flex items-center justify-center max-w-lg w-full">
              <button 
                onClick={() => setActiveTab('primary')}
                className={`flex-1 py-3 text-base font-bold rounded-full transition-colors ${activeTab === 'primary' ? 'bg-accentGold text-darkBg' : 'text-textSecondary hover:text-white'}`}
              >
                Primary (I - V)
              </button>
              <button 
                onClick={() => setActiveTab('secondary')}
                className={`flex-1 py-3 text-base font-bold rounded-full transition-colors ${activeTab === 'secondary' ? 'bg-accentGold text-darkBg' : 'text-textSecondary hover:text-white'}`}
              >
                Secondary (VI - X)
              </button>
            </div>
          </div>
 
          {/* Tab Content Area */}
          <div className="bg-darkCard border border-white/5 rounded-3xl p-10 md:p-16 flex flex-col md:flex-row items-center gap-16">
            <div className="w-full md:w-2/5 flex justify-center">
              <div className="relative">
                <div className="absolute inset-0 bg-accentGold/20 blur-xl rounded-full"></div>
                <img 
                  key={activeTab}
                  src={programsData[activeTab]?.imageUrl || "https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=800&q=80"} 
                  alt={`${activeTab} Curriculum`} 
                  className="relative z-10 w-full max-w-xs object-cover rounded-2xl transition-all duration-500 shadow-xl border border-white/10" 
                />
              </div>
            </div>
            <div className="w-full md:w-3/5">
              <ul key={activeTab} className="flex flex-col gap-5 mb-8">
                {(programsData[activeTab]?.features || []).map((feat, idx) => (
                  <li key={idx} className="flex items-start gap-4 animate-fadeIn">
                    <FaCheckCircle className="text-accentGold text-lg flex-shrink-0 mt-0.5" />
                    <span className="text-base text-white">{feat}</span>
                  </li>
                ))}
              </ul>

              {programsData[activeTab]?.curriculumPdfUrl && (
                <a 
                  href={programsData[activeTab].curriculumPdfUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-white/10 hover:bg-white/20 text-white font-bold px-6 py-3 rounded-lg text-base w-fit flex items-center gap-2 transition-colors border border-white/10"
                >
                  Download Curriculum PDF <FaFileDownload />
                </a>
              )}
            </div>
          </div>

        </div>
      </section>
      {/* 4. Teaching Methodology & Academic Calendar */}
      <section className="py-24 bg-darkBg border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 md:px-12 flex flex-col lg:flex-row gap-16">
          
          {/* Teaching Methodology (Left) */}
          <div className="w-full lg:w-2/3">
            <h2 className="text-base font-bold text-textSecondary uppercase tracking-widest mb-10">Teaching Methodology</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              
              {methodologiesData.map((item, index) => {
                const IconComponent = IconMap[item.icon] || FaLightbulb;
                return (
                  <div key={index} className="bg-darkCard border border-white/5 p-6 rounded-2xl flex gap-5 hover:border-white/10 transition-colors">
                    <div className="w-12 h-12 rounded-full bg-blue-900/20 flex items-center justify-center text-blue-500 text-xl flex-shrink-0">
                      <IconComponent />
                    </div>
                    <div>
                      <h4 className="font-bold text-white text-lg mb-2" dangerouslySetInnerHTML={{ __html: item.title }}></h4>
                      <p className="text-base text-textSecondary leading-relaxed">{item.description}</p>
                    </div>
                  </div>
                );
              })}

            </div>
          </div>
 
          {/* Academic Calendar (Right) */}
          <div className="w-full lg:w-1/3 flex flex-col">
            <h2 className="text-base font-bold text-textSecondary uppercase tracking-widest mb-10">Academic Calendar</h2>
            <div className="bg-darkCard border border-white/5 p-8 rounded-2xl flex flex-col items-center text-center h-full justify-between hover:border-accentGold/30 transition-colors relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-accentGold/5 blur-xl rounded-full"></div>
              <div className="w-full h-40 bg-accentGold/10 rounded-xl mb-6 flex flex-col items-center justify-center text-accentGold border border-accentGold/20 relative overflow-hidden group">
                <div className="absolute inset-0 bg-accentGold/5 group-hover:bg-accentGold/10 transition-colors"></div>
                <FaRegCalendarAlt className="text-6xl mb-3 relative z-10 drop-shadow-md opacity-90" />
                <span className="font-bold text-sm tracking-widest uppercase relative z-10 opacity-90">Current Year</span>
              </div>
              <p className="text-base text-textSecondary leading-relaxed mb-6 font-medium relative z-10">
                Stay updated with important dates, exams, holidays and events throughout the year.
              </p>
              
              {calendarPdfUrl ? (
                <a 
                  href={calendarPdfUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-accentGold text-darkBg font-bold px-6 py-3 rounded-lg text-base w-full flex justify-center items-center gap-2 hover:bg-accentGoldDark transition-colors relative z-10"
                >
                  Download Calendar PDF <FaFileDownload />
                </a>
              ) : (
                <button 
                  onClick={() => alert("The academic calendar is currently not uploaded. Please contact the school administration.")}
                  className="bg-accentGold/60 text-darkBg/60 font-bold px-6 py-3 rounded-lg text-base w-full flex justify-center items-center gap-2 cursor-not-allowed relative z-10"
                >
                  Download Calendar PDF <FaFileDownload />
                </button>
              )}
            </div>
          </div>

        </div>
      </section>
      {/* 5. Examination Process */}
      <section className="py-24 bg-darkBg">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <h2 className="text-base font-bold text-textSecondary uppercase tracking-widest mb-16">Examination Process</h2>
          
          <div className="flex flex-col md:flex-row items-center justify-between w-full gap-4 md:gap-2 relative">
            
            {examinationProcessData.map((step, index) => (
              <React.Fragment key={index}>
                <div className="flex flex-col items-center flex-1 bg-darkCard border border-white/5 rounded-2xl p-8 text-center w-full z-10 hover:border-accentGold/30 transition-colors">
                  <div className="w-14 h-14 rounded-full border border-accentGold/30 text-accentGold flex items-center justify-center font-bold text-lg mb-6">
                    {`0${index + 1}`}
                  </div>
                  <h4 className="font-bold text-white text-lg mb-3">{step.title}</h4>
                  <p className="text-sm text-textSecondary leading-relaxed px-2">{step.description}</p>
                </div>
                
                {index < examinationProcessData.length - 1 && (
                  <div className="hidden md:block text-accentGold/30 z-0">
                    <FaChevronRight size={16} />
                  </div>
                )}
              </React.Fragment>
            ))}

          </div>
        </div>
      </section>

    </div>
  );
};

export default Academics;
