import React from 'react';
import { Link } from 'react-router-dom';
import { FaPlayCircle, FaUsers, FaChalkboardTeacher, FaTrophy } from 'react-icons/fa';

const heroBg = "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=1920&q=80";

const HeroSection = ({ currentSettings }) => {
  return (
    <section className="relative w-full min-h-[90vh] flex items-center pt-10">
      <div className="absolute inset-0 z-0">
        <img src={currentSettings?.heroBackgroundImage || heroBg} alt="School Building" className="w-full h-full object-cover opacity-35" />
        <div className="absolute inset-0 bg-gradient-to-r from-darkBg via-darkBg/90 to-transparent"></div>
      </div>
      
      <div className="max-w-7xl mx-auto px-6 md:px-12 w-full relative z-10 flex flex-col items-start mt-10">
        <span className="text-accentGold font-bold tracking-widest text-xs mb-4 uppercase">
          {currentSettings?.heroContent?.eyebrow || "© Nurturing Minds, Building Futures"}
        </span>
        <h1 
          className="text-4xl sm:text-5xl md:text-7xl font-extrabold text-white leading-tight mb-6 max-w-2xl"
          dangerouslySetInnerHTML={{ __html: currentSettings?.heroContent?.heading || "Welcome to <br /> Vivekananda <br /> E.M High School" }}
        />
        <p className="text-textSecondary max-w-xl text-lg mb-10 leading-relaxed">
          {currentSettings?.heroContent?.subtitle || "Empowering students with quality education, values, and leadership skills to excel in a dynamic world."}
        </p>
        <div className="flex flex-wrap gap-4">
          <Link to="/admissions" className="bg-accentGold text-darkBg font-bold px-8 py-3 rounded hover:bg-accentGoldDark transition-colors">
            Apply for Admission
          </Link>
          <Link to="/about" className="border border-white/30 text-white font-bold px-8 py-3 rounded hover:bg-white/10 transition-colors flex items-center gap-2">
            Explore Campus <FaPlayCircle />
          </Link>
        </div>
      </div>

      {/* Floating Stats */}
      <div className="hidden lg:flex absolute bottom-0 right-12 bg-darkCard border-t border-l border-r border-white/10 rounded-t-3xl p-8 gap-12 z-20 shadow-2xl">
        <div className="flex flex-col items-center text-center">
          <FaUsers className="text-accentGold text-3xl mb-3" />
          <span className="text-3xl font-black">{currentSettings.heroStats?.studentsCount}</span>
          <span className="text-sm text-textSecondary uppercase tracking-wider mt-1">Students</span>
        </div>
        <div className="w-px bg-white/10"></div>
        <div className="flex flex-col items-center text-center">
          <FaChalkboardTeacher className="text-accentGold text-3xl mb-3" />
          <span className="text-3xl font-black">{currentSettings.heroStats?.staffCount}</span>
          <span className="text-sm text-textSecondary uppercase tracking-wider mt-1">Staff</span>
        </div>
        <div className="w-px bg-white/10"></div>
        <div className="flex flex-col items-center text-center">
          <FaTrophy className="text-accentGold text-3xl mb-3" />
          <span className="text-3xl font-black">{currentSettings.heroStats?.yearsExcellence}</span>
          <span className="text-sm text-textSecondary uppercase tracking-wider mt-1">Years<br/>Excellence</span>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
