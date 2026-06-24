import React from 'react';
import * as Icons from 'react-icons/fa';

const FacilitiesSection = ({ currentSettings }) => {
  return (
    <section className="py-24 bg-darkCard border-y border-white/5">
      <div className="max-w-7xl mx-auto px-6 md:px-12 text-center">
        <h2 className="text-base font-bold text-textSecondary uppercase tracking-widest mb-16">Campus Facilities</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {currentSettings.facilities?.map((fac, index) => {
            const FacilityIcon = Icons[fac.icon] || Icons.FaDesktop;
            return (
              <div key={index} className="flex flex-col gap-4 group cursor-pointer">
                <div className="overflow-hidden rounded-xl border border-white/10 bg-black/10 dark:bg-white/5">
                   <img 
                     src={fac.imageUrl} 
                     alt={fac.title} 
                     loading="lazy"
                     className="w-full h-32 object-contain p-2 opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all duration-500"
                   />
                </div>
                <div className="flex justify-center items-center gap-2">
                  <FacilityIcon className="text-accentGold/50 group-hover:text-accentGold transition-colors" /> 
                  <span className="text-lg font-bold text-textSecondary group-hover:text-white transition-colors">{fac.title}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default FacilitiesSection;
