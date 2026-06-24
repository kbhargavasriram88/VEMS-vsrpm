import React from 'react';
import * as Icons from 'react-icons/fa';

const HighlightsSection = ({ currentSettings }) => {
  return (
    <section className="py-24 bg-darkBg relative z-30">
      <div className="max-w-7xl mx-auto px-6 md:px-12 text-center">
        <h2 className="text-base font-bold text-textSecondary uppercase tracking-widest mb-12">School Highlights</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {currentSettings.highlights?.map((hl, index) => {
            const HighlightIcon = Icons[hl.icon] || Icons.FaGraduationCap;
            return (
              <div key={index} className="bg-darkCard p-8 border border-white/5 rounded-2xl text-left hover:border-accentGold/50 transition-colors">
                <div className="w-12 h-12 rounded-lg bg-accentGold/10 flex items-center justify-center text-accentGold text-xl mb-6">
                  <HighlightIcon />
                </div>
                <h3 className="text-lg font-bold mb-3 text-white">{hl.title}</h3>
                <p className="text-base text-textSecondary leading-relaxed">{hl.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default HighlightsSection;
