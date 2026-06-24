import React from 'react';

const PrincipalMessage = ({ currentSettings }) => {
  return (
    <section className="py-24 bg-darkCard border-y border-white/5">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <h2 className="text-base font-bold text-textSecondary uppercase tracking-widest mb-16 text-center">Principal's Message</h2>
        <div className="flex flex-col md:flex-row gap-16 items-center">
          <div className="w-full md:w-5/12">
            <img 
              src={currentSettings.principalMessage?.imageUrl} 
              alt="Principal" 
              loading="lazy"
              className="w-full rounded-2xl shadow-2xl border border-white/10" 
            />
          </div>
          <div className="w-full md:w-7/12 flex flex-col items-start">
            <div className="text-accentGold text-7xl font-serif leading-none mb-4 opacity-50">"</div>
            <p className="text-xl text-white mb-6 leading-relaxed max-w-2xl">
              {currentSettings.principalMessage?.text1}
            </p>
            {currentSettings.principalMessage?.text2 && (
              <p className="text-xl text-white mb-10 leading-relaxed max-w-2xl">
                {currentSettings.principalMessage?.text2}
              </p>
            )}
            
            {/* Fake Signature */}
            <div className="border-b border-accentGold/50 pb-4 mb-4">
              <span className="font-serif italic text-accentGold text-3xl">{currentSettings.principalMessage?.signature}</span>
            </div>
            <p className="font-bold text-white text-xl">Mr. {currentSettings.principalMessage?.name}</p>
            <p className="text-base text-textSecondary tracking-widest uppercase mt-1">{currentSettings.principalMessage?.designation}</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PrincipalMessage;
