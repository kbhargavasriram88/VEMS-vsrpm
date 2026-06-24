import React from 'react';
import { FaGraduationCap, FaChalkboardTeacher, FaBuilding, FaTrophy } from 'react-icons/fa';

const AchievementsSection = ({ currentSettings }) => {
  return (
    <section className="py-20 bg-darkBg">
      <div className="max-w-7xl mx-auto px-6 md:px-12 text-center">
        <h2 className="text-base font-bold text-textSecondary uppercase tracking-widest mb-16">Our Achievements</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 divide-x divide-white/5">
          <div className="flex flex-col items-center">
            <FaGraduationCap className="text-accentGold text-5xl mb-6 opacity-80" />
            <span className="text-4xl font-black text-white mb-2">{currentSettings.achievements?.students}</span>
            <span className="text-base text-textSecondary uppercase tracking-wider">Students</span>
          </div>
          <div className="flex flex-col items-center">
            <FaChalkboardTeacher className="text-accentGold text-5xl mb-6 opacity-80" />
            <span className="text-4xl font-black text-white mb-2">{currentSettings.achievements?.teachers}</span>
            <span className="text-base text-textSecondary uppercase tracking-wider">Teachers</span>
          </div>
          <div className="flex flex-col items-center">
            <FaBuilding className="text-accentGold text-5xl mb-6 opacity-80" />
            <span className="text-4xl font-black text-white mb-2">{currentSettings.achievements?.classrooms}</span>
            <span className="text-base text-textSecondary uppercase tracking-wider">Classrooms</span>
          </div>
          <div className="flex flex-col items-center">
            <FaTrophy className="text-accentGold text-5xl mb-6 opacity-80" />
            <span className="text-4xl font-black text-white mb-2">{currentSettings.achievements?.awards}</span>
            <span className="text-base text-textSecondary uppercase tracking-wider">Awards Won</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AchievementsSection;
