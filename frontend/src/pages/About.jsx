import React, { useState, useEffect } from 'react';
import { 
  FaBuilding, FaUsers, FaBook, FaTrophy, FaEye, FaBullseye, 
  FaShieldAlt, FaStar, FaUserTie, FaLightbulb, 
  FaChevronLeft, FaChevronRight, FaChevronDown, FaChevronUp
} from 'react-icons/fa';
import * as Icons from 'react-icons/fa';
import api from '../services/api';

// High-quality fallback placeholders
const heroBg = "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=1920&q=80";
const chairman = "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=300&q=80";
const viceChair = "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80";
const correspondent = "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=300&q=80";
const adminOff = "https://images.unsplash.com/photo-1556157382-97eda2d62296?auto=format&fit=crop&w=300&q=80";
const acaDirector = "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=300&q=80";
const principal = "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=600&q=80";

const facSmart = "https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=600&q=80";
const facComputer = "https://images.unsplash.com/photo-1516321497487-e288fb19713f?auto=format&fit=crop&w=600&q=80";
const facScience = "https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&w=600&q=80";
const facLibrary = "https://images.unsplash.com/photo-1507842217343-583bb7270b66?auto=format&fit=crop&w=600&q=80";
const facSports = "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&w=600&q=80";

const About = () => {
  const [settings, setSettings] = useState(null);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const { data } = await api.get('/about-settings');
        setSettings(data);
      } catch (err) {
        console.error('Failed to load about page settings:', err);
      }
    };
    fetchSettings();
  }, []);

  const fallbackSettings = {
    hero: {
      title: "About Our School",
      description: "Nurturing young minds with values, knowledge and a vision for a better tomorrow."
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
      { name: "Sri K. Raghava Rao", designation: "Chairman", imageUrl: chairman },
      { name: "Smt. L. Padmaja", designation: "Vice Chairperson", imageUrl: viceChair },
      { name: "Sri M. Suresh Babu", designation: "Correspondent", imageUrl: correspondent },
      { name: "Sri P. Anand", designation: "Administrative Officer", imageUrl: adminOff },
      { name: "Smt. R. Kavitha", designation: "Academic Director", imageUrl: acaDirector }
    ],
    principalMessage: {
      name: "Mr. R. Krishnamurthy",
      designation: "Principal",
      text: "At Vivekananda E.M High School, we believe education is not just about learning subjects, but about building character, confidence and compassion. Our dedicated faculty and holistic approach ensure every child discovers their potential and steps into the future with courage and responsibility.",
      signature: "R. Krishnamurthy",
      imageUrl: principal
    },
    infrastructure: [
      { title: "Smart Classrooms", imageUrl: facSmart },
      { title: "Science Laboratories", imageUrl: facScience },
      { title: "Library", imageUrl: facLibrary },
      { title: "Sports Complex", imageUrl: facSports },
      { title: "Auditorium", imageUrl: facComputer }
    ]
  };

  const currentSettings = settings || fallbackSettings;

  return (
    <div className="flex flex-col bg-darkBg text-white w-full">
      
      {/* 1. Hero Section */}
      <section className="relative w-full min-h-[90vh] flex items-center pt-10">
        <div className="absolute inset-0 z-0">
          <img src={currentSettings.hero?.backgroundImage || heroBg} alt="School Building" className="w-full h-full object-cover opacity-45" />
          <div className="absolute inset-0 bg-gradient-to-r from-darkBg via-darkBg/90 to-transparent"></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-6 md:px-12 w-full relative z-10 flex flex-col items-start mt-10">
          <span className="text-accentGold font-bold tracking-widest text-xs mb-4 uppercase">© About Our School</span>
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold text-white leading-tight mb-6">
            {currentSettings.hero?.title}
          </h1>
          <p className="text-textSecondary max-w-2xl text-lg md:text-xl leading-relaxed">
            {currentSettings.hero?.description}
          </p>
        </div>
      </section>

      {/* 2. Our History */}
      <section className="py-24 bg-darkBg border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6 md:px-12 grid grid-cols-1 lg:grid-cols-12 gap-16">
          <div className="lg:col-span-4">
            <span className="text-base uppercase tracking-widest text-accentGold font-bold mb-2 block">Our History</span>
            <h2 className="text-3xl font-extrabold text-white mb-6">{currentSettings.history?.title}</h2>
            <p className="text-lg text-textSecondary leading-relaxed">
              {currentSettings.history?.description}
            </p>
          </div>
          
          <div className="lg:col-span-8 relative flex flex-col justify-center">
            {/* Timeline Line */}
            {currentSettings.history?.timeline && currentSettings.history.timeline.length > 1 && (
              <div className="hidden md:block absolute top-6 left-12 right-12 h-px bg-white/10 z-0"></div>
            )}
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              {currentSettings.history?.timeline?.map((item, index) => {
                const TimelineIcon = 
                  index === 0 ? Icons.FaBuilding :
                  index === 1 ? Icons.FaUsers :
                  index === 2 ? Icons.FaBook :
                  Icons.FaTrophy;
                
                return (
                  <div key={index} className="relative z-10 flex flex-col items-start">
                    <div className="w-12 h-12 rounded-full bg-darkBg border border-white/10 flex items-center justify-center text-accentGold mb-6">
                      <TimelineIcon size={20} />
                    </div>
                    <h3 className="font-bold text-white text-xl mb-1">{item.year}</h3>
                    <h4 className="text-lg font-bold text-white mb-2">{item.title}</h4>
                    <p className="text-base text-textSecondary leading-relaxed">{item.description}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* 3. Vision & Mission */}
      <section className="pb-24 bg-darkBg">
        <div className="max-w-7xl mx-auto px-6 md:px-12 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-darkCard border border-white/5 rounded-2xl p-10 flex gap-6 hover:border-accentGold/30 transition-colors">
            <div className="w-16 h-16 rounded-full bg-blue-900/20 border border-blue-500/20 flex items-center justify-center text-blue-500 text-3xl flex-shrink-0">
              <FaEye />
            </div>
            <div>
              <h3 className="text-base uppercase tracking-widest text-blue-500 font-bold mb-4">Our Vision</h3>
              <p className="text-lg text-textSecondary leading-relaxed">
                {currentSettings.visionMission?.vision}
              </p>
            </div>
          </div>
          
          <div className="bg-darkCard border border-white/5 rounded-2xl p-10 flex gap-6 hover:border-accentGold/30 transition-colors">
            <div className="w-16 h-16 rounded-full bg-accentGold/10 border border-accentGold/20 flex items-center justify-center text-accentGold text-3xl flex-shrink-0">
              <FaBullseye />
            </div>
            <div>
              <h3 className="text-base uppercase tracking-widest text-accentGold font-bold mb-4">Our Mission</h3>
              <p className="text-lg text-textSecondary leading-relaxed">
                {currentSettings.visionMission?.mission}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Our Core Values */}
      <section className="py-20 bg-darkCard border-y border-white/5">
        <div className="max-w-7xl mx-auto px-6 md:px-12 text-center">
          <h2 className="text-base font-bold text-textSecondary uppercase tracking-widest mb-12">Our Core Values</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {currentSettings.values?.map((val, index) => {
              const ValueIcon = Icons[val.icon] || Icons.FaStar;
              return (
                <div key={index} className="flex flex-col items-center p-8 bg-darkBg rounded-xl border border-white/5 hover:border-white/10 transition-colors">
                  <div className="w-12 h-12 rounded-lg bg-white/5 flex items-center justify-center text-accentGold text-xl mb-6">
                    <ValueIcon />
                  </div>
                  <h3 className="font-bold text-lg text-white mb-3">{val.title}</h3>
                  <p className="text-base text-textSecondary leading-relaxed">{val.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 5. Our Management Team */}
      <section className="py-24 bg-darkBg">
        <div className="max-w-7xl mx-auto px-6 md:px-12 text-center">
          <h2 className="text-base font-bold text-textSecondary uppercase tracking-widest mb-12">Our Management Team</h2>
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-6">
            {currentSettings.management?.map((member, index) => (
              <div key={index} className="bg-darkCard border border-white/5 rounded-xl overflow-hidden hover:border-accentGold/30 transition-colors flex flex-col">
                <img src={member.imageUrl} className="w-full h-48 object-cover transition-all duration-500" alt={member.name} />
                <div className="p-5 flex flex-col flex-grow justify-center">
                  <h3 className="font-bold text-lg text-white">{member.name}</h3>
                  <p className="text-sm text-textSecondary uppercase tracking-widest mt-1">{member.designation}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. Principal's Message */}
      <section className="py-24 bg-darkCard border-y border-white/5">
        <div className="max-w-7xl mx-auto px-6 md:px-12 grid grid-cols-1 md:grid-cols-12 gap-16 items-center">
          <div className="md:col-span-4">
            <img src={currentSettings.principalMessage?.imageUrl} alt="Principal" className="w-full rounded-2xl shadow-2xl border border-white/10 transition-all duration-500" />
          </div>
          <div className="md:col-span-8 flex flex-col items-start relative">
            <div className="text-accentGold text-8xl font-serif leading-none absolute -top-10 -left-6 opacity-20">"</div>
            <p className="text-xl text-white mb-6 leading-relaxed relative z-10 max-w-2xl font-medium italic">
              {currentSettings.principalMessage?.text}
            </p>
            
            <div className="border-b border-accentGold/50 pb-4 mb-4 mt-6">
              <span className="font-serif italic text-accentGold text-3xl">{currentSettings.principalMessage?.signature}</span>
            </div>
            <p className="font-bold text-white text-xl">Mr. {currentSettings.principalMessage?.name}</p>
            <p className="text-base text-textSecondary tracking-widest uppercase mt-1">{currentSettings.principalMessage?.designation}</p>
          </div>
        </div>
      </section>

      {/* 7. Our Infrastructure */}
      <section className="py-24 bg-darkBg">
        <div className="max-w-7xl mx-auto px-6 md:px-12 text-center">
          <h2 className="text-base font-bold text-textSecondary uppercase tracking-widest mb-12">Our Infrastructure</h2>
          
          <div className="flex items-center gap-6">
            <button className="w-12 h-12 flex-shrink-0 rounded-full bg-darkCard border border-white/10 flex items-center justify-center text-accentGold hover:bg-white/5 transition-colors">
              <FaChevronLeft />
            </button>
            
            <div className="flex-1 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 overflow-hidden">
              {currentSettings.infrastructure?.map((item, index) => (
                <div key={index} className={`text-center group cursor-pointer ${index === 2 || index === 3 ? 'hidden md:block' : ''} ${index >= 4 ? 'hidden lg:block' : ''}`}>
                  <div className="overflow-hidden rounded-lg mb-4 border border-white/10 bg-black/10 dark:bg-white/5">
                     <img src={item.imageUrl} className="w-full h-32 object-contain opacity-70 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500 p-2" alt={item.title} />
                  </div>
                  <span className="text-base font-bold text-textSecondary group-hover:text-white transition-colors">{item.title}</span>
                </div>
              ))}
            </div>

            <button className="w-12 h-12 flex-shrink-0 rounded-full bg-darkCard border border-white/10 flex items-center justify-center text-accentGold hover:bg-white/5 transition-colors">
              <FaChevronRight />
            </button>
          </div>

        </div>
      </section>

    </div>
  );
};

export default About;
