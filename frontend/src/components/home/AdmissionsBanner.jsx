import React from 'react';
import { Link } from 'react-router-dom';
import { FaArrowRight } from 'react-icons/fa';

const AdmissionsBanner = ({ admissionsSettings }) => {
  if (admissionsSettings?.admissionBanner?.isActive === false) return null;

  return (
    <section className="py-20 bg-darkBg">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="bg-accentGold rounded-2xl p-10 md:p-14 flex flex-col md:flex-row items-center justify-between text-darkBg shadow-2xl relative overflow-hidden">
          <div className="absolute right-0 top-0 w-64 h-64 bg-white/10 rounded-full blur-[30px]"></div>
          <div className="relative z-10 text-center md:text-left mb-6 md:mb-0">
            <h2 className="text-3xl font-black mb-2 tracking-tight">
              {admissionsSettings?.admissionBanner?.title || "ADMISSIONS OPEN FOR 2025-26"}
            </h2>
            <p className="text-sm font-bold opacity-80">
              {admissionsSettings?.admissionBanner?.subtitle || "Give your child the best start for a bright future."}
            </p>
          </div>
          <Link to="/admissions" className="relative z-10 bg-darkBg text-white px-10 py-4 rounded-xl font-bold flex items-center gap-3 hover:bg-black transition-colors">
            Apply Now <FaArrowRight />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default AdmissionsBanner;
