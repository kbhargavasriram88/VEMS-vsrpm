import React, { useState, useEffect } from 'react';
import { FaTimes, FaChevronLeft, FaChevronRight } from 'react-icons/fa';

const WelcomeModal = ({ settings }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  const announcements = settings?.announcements || [];
  const isActive = settings?.isActive !== false;

  useEffect(() => {
    // Show modal shortly after component mounts if active and has content
    if (isActive && announcements.length > 0) {
      const timer = setTimeout(() => {
        setIsOpen(true);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [isActive, announcements.length]);

  if (!isOpen || !isActive || announcements.length === 0) return null;

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev === announcements.length - 1 ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev === 0 ? announcements.length - 1 : prev - 1));
  };

  const currentAnnounce = announcements[currentIndex];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8 bg-black/80 backdrop-blur-md transition-opacity duration-300">
      <div className="bg-darkBg border border-white/10 rounded-2xl overflow-hidden w-full max-w-4xl relative shadow-2xl flex flex-col animate-[fadeIn_0.5s_ease-out] max-h-[90vh]">
        
        {/* Close button */}
        <button 
          onClick={() => setIsOpen(false)}
          className="absolute top-4 right-4 z-10 w-10 h-10 flex items-center justify-center bg-black/60 text-white rounded-full hover:bg-red-500 transition-colors shadow-lg"
        >
          <FaTimes size={18} />
        </button>

        {/* Image Section */}
        <div className="w-full h-64 md:h-[50vh] bg-black relative overflow-hidden flex-shrink-0">
          <img 
            src={currentAnnounce?.imageUrl || currentAnnounce?.image} 
            alt={currentAnnounce?.title} 
            className="w-full h-full object-contain transition-transform duration-700 hover:scale-105"
          />
        </div>

        {/* Content Section */}
        <div className="w-full p-6 md:p-8 flex flex-col items-center justify-center relative bg-darkCard overflow-y-auto text-center">
          
          {currentAnnounce?.title && (
            <h2 className="font-bold text-white leading-tight text-2xl md:text-3xl mb-4">
              {currentAnnounce.title}
            </h2>
          )}
          
          {currentAnnounce?.description && currentAnnounce.description.trim() !== '' && (
            <p className="text-textSecondary text-lg md:text-xl leading-relaxed mb-8">
              {currentAnnounce.description}
            </p>
          )}
          
          {/* Controls */}
          {announcements.length > 1 && (
            <div className="flex items-center justify-between w-full mt-auto pt-4 border-t border-white/5">
              <div className="flex gap-3">
                <button onClick={prevSlide} className="w-10 h-10 md:w-12 md:h-12 flex items-center justify-center rounded-full border border-white/20 text-white hover:bg-white/10 hover:border-white/40 transition-all">
                  <FaChevronLeft size={16} />
                </button>
                <button onClick={nextSlide} className="w-10 h-10 md:w-12 md:h-12 flex items-center justify-center rounded-full border border-white/20 text-white hover:bg-white/10 hover:border-white/40 transition-all">
                  <FaChevronRight size={16} />
                </button>
              </div>
              <div className="flex gap-2">
                {announcements.map((_, idx) => (
                  <div 
                    key={idx} 
                    className={`w-2.5 h-2.5 rounded-full transition-all ${idx === currentIndex ? 'bg-accentGold w-8' : 'bg-white/20'}`}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default WelcomeModal;
