import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const GalleryTestimonials = ({ currentSettings, showGallery, galleryImages }) => {
  const [activeTestimonial, setActiveTestimonial] = useState(0);

  useEffect(() => {
    if (currentSettings.testimonials && currentSettings.testimonials.length > 1) {
      const interval = setInterval(() => {
        setActiveTestimonial(prev => (prev + 1) % currentSettings.testimonials.length);
      }, 6000);
      return () => clearInterval(interval);
    }
  }, [currentSettings.testimonials]);

  return (
    <section className="py-24 bg-darkCard border-t border-white/5">
      <div className={`max-w-7xl mx-auto px-6 md:px-12 grid grid-cols-1 ${showGallery ? 'lg:grid-cols-2' : 'lg:grid-cols-1'} gap-16`}>
        
        {/* Gallery Preview */}
        {showGallery && (
        <div>
          <div className="text-center mb-10">
            <h2 className="text-base font-bold uppercase tracking-widest text-textSecondary">{currentSettings.gallerySection?.title || 'Gallery Preview'}</h2>
            <p className="text-sm text-textSecondary mt-1">{currentSettings.gallerySection?.subtitle || 'Glimpses of life at Vivekananda E.M High School.'}</p>
          </div>
          <div className="grid grid-cols-3 gap-3 mb-8">
            {galleryImages && galleryImages.length > 0 ? (
              galleryImages.map((img, i) => (
                <div key={i} className="bg-black/10 dark:bg-white/5 rounded-lg border border-white/5 overflow-hidden">
                  <img 
                    src={img.imageUrl} 
                    loading="lazy"
                    className="w-full h-28 object-cover p-2 hover:p-0 transition-all hover:scale-105 cursor-pointer" 
                    alt={img.title || "Gallery image"}
                  />
                </div>
              ))
            ) : (
              <div className="col-span-3 text-center text-textSecondary text-sm py-4">No recent photos found in gallery.</div>
            )}
          </div>
          <div className="flex justify-center">
            <Link to="/gallery" className="bg-accentGold text-darkBg px-8 py-3 rounded hover:bg-accentGoldDark font-bold text-base transition-colors">View Full Gallery</Link>
          </div>
        </div>
        )}

        {/* Testimonials */}
        <div>
          <h2 className="text-base font-bold uppercase tracking-widest text-textSecondary mb-10 text-center">Testimonials</h2>
          <div className="bg-darkBg border border-white/5 p-12 rounded-2xl h-[calc(100%-60px)] flex flex-col justify-center relative">
            <div className="text-accentGold text-6xl font-serif absolute top-8 left-8 opacity-20">"</div>
            {currentSettings.testimonials && currentSettings.testimonials.length > 0 ? (
              <div className="flex flex-col justify-center h-full transition-all duration-500">
                <p className="text-xl text-white font-medium italic mb-10 relative z-10 leading-relaxed min-h-[80px]">
                  {currentSettings.testimonials[activeTestimonial]?.quote}
                </p>
                <div className="flex items-center gap-4 relative z-10">
                  {currentSettings.testimonials[activeTestimonial]?.imageUrl && (
                    <img 
                      src={currentSettings.testimonials[activeTestimonial]?.imageUrl} 
                      alt="Avatar" 
                      loading="lazy"
                      className="w-14 h-14 rounded-full object-cover border-2 border-accentGold/50" 
                    />
                  )}
                  <div>
                    <h4 className="font-bold text-white text-lg">{currentSettings.testimonials[activeTestimonial]?.author}</h4>
                    <p className="text-base text-textSecondary">{currentSettings.testimonials[activeTestimonial]?.role}</p>
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-base text-textSecondary italic text-center">No testimonials added yet.</p>
            )}

            {/* Dots */}
            {currentSettings.testimonials && currentSettings.testimonials.length > 1 && (
              <div className="flex justify-center gap-2 mt-8 absolute bottom-8 left-0 right-0">
                {currentSettings.testimonials.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveTestimonial(i)}
                    className={`w-2 h-2 rounded-full transition-all duration-300 ${
                      activeTestimonial === i ? 'bg-accentGold w-4' : 'bg-white/20 hover:bg-white/40'
                    }`}
                    aria-label={`Go to testimonial ${i + 1}`}
                    aria-current={activeTestimonial === i ? "true" : "false"}
                  />
                ))}
              </div>
            )}
          </div>
        </div>

      </div>
    </section>
  );
};

export default GalleryTestimonials;
