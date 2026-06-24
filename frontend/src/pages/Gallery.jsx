import React, { useState, useEffect } from 'react';
import { 
  FaCamera, FaImage, FaCalendarAlt, FaTrophy, FaUsers, FaRegImage, FaSpinner 
} from 'react-icons/fa';
import api from '../services/api';

// High-quality placeholders
const heroBg = "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=1920&q=80"; // background school
const heroStudents = "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=800&q=80"; // school building right


const Gallery = () => {
  const [activeFilter, setActiveFilter] = useState("All");
  const [galleryItems, setGalleryItems] = useState([]);
  const [gallerySettings, setGallerySettings] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGallery = async () => {
      try {
        const [galleryRes, homeRes, settingsRes] = await Promise.all([
          api.get('/gallery'),
          api.get('/home-settings'),
          api.get('/gallery-settings')
        ]);
        
        setGallerySettings(settingsRes.data);

        if (galleryRes.data && galleryRes.data.length > 0) {
          setGalleryItems(galleryRes.data);
        } else if (homeRes.data && homeRes.data.facilities && homeRes.data.facilities.length > 0) {
          const fallbackItems = homeRes.data.facilities.map((fac, idx) => ({
            _id: `fallback-${idx}`,
            title: fac.title,
            category: 'Infrastructure',
            imageUrl: fac.imageUrl
          }));
          setGalleryItems(fallbackItems);
        } else {
          setGalleryItems([]);
        }
      } catch (err) {
        console.error('Failed to load gallery items:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchGallery();
  }, []);

  const categories = ["All", ...new Set(galleryItems.map(item => item.category))];

  const filteredItems = activeFilter === "All" 
    ? galleryItems 
    : galleryItems.filter(item => item.category === activeFilter);

  // Helper for tag colors
  const getCategoryColor = (category) => {
    switch (category) {
      case 'Events': return 'bg-purple-600';
      case 'Sports': return 'bg-green-600';
      case 'Academics': return 'bg-blue-600';
      case 'Infrastructure': return 'bg-orange-600';
      default: return 'bg-gray-600';
    }
  };

  return (
    <div className="flex flex-col bg-darkBg text-white w-full">
      
      {/* 1. Hero Section */}
      <section className="relative w-full min-h-[90vh] flex items-center pt-10 bg-darkCard border-b border-white/5 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img src={gallerySettings?.hero?.backgroundImage || heroBg} alt="School" className="w-full h-full object-cover opacity-35" />
          <div className="absolute inset-0 bg-gradient-to-r from-darkBg via-darkBg/90 to-transparent"></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-6 md:px-12 w-full flex flex-col-reverse md:flex-row items-center justify-between relative z-10 h-full">
          <div className="w-full md:w-1/2 flex flex-col items-start pt-16 md:pt-0">
            <span className="text-accentGold font-bold tracking-widest text-xs mb-4 uppercase flex items-center gap-2">
              <FaCamera /> OUR GALLERY
            </span>
            <h1 className="text-5xl md:text-7xl font-extrabold text-white leading-tight mb-6">
              School Memories
            </h1>
            <p className="text-textSecondary max-w-sm text-sm leading-relaxed mb-8">
              A glimpse of the beautiful moments, achievements and activities that make our school special.
            </p>
          </div>
          
          <div className="w-full md:w-1/2 h-full flex items-end justify-center md:justify-end">
            <img src={gallerySettings?.hero?.sideImage || heroStudents} alt="School Building" className="h-[90%] max-h-[500px] object-cover object-center mask-image-bottom drop-shadow-2xl" style={{ WebkitMaskImage: 'linear-gradient(to top, transparent, black 10%)' }} />
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <section className="py-16 bg-darkBg">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          
          {/* 2. Filter Tabs */}
          <div className="flex flex-wrap justify-center gap-4 mb-16">
            {categories.map((filter) => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`px-8 py-2.5 rounded-full text-lg font-bold transition-all duration-300 border ${
                  activeFilter === filter 
                    ? 'bg-accentGold text-darkBg border-accentGold' 
                    : 'bg-transparent text-textSecondary border-white/10 hover:border-white/30 hover:text-white'
                }`}
              >
                {filter}
              </button>
            ))}
          </div>

          {/* 3. Masonry Gallery Grid */}
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 text-textSecondary gap-4">
              <FaSpinner className="animate-spin text-4xl text-accentGold" />
              <p>Loading gallery items...</p>
            </div>
          ) : galleryItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-textSecondary gap-4 bg-darkCard border border-white/5 rounded-2xl">
              <FaRegImage className="text-6xl text-white/10" />
              <p className="text-lg">No photos in the gallery yet.</p>
            </div>
          ) : (
            <div className="columns-1 sm:columns-2 md:columns-3 gap-6 space-y-6">
              {filteredItems.map((item) => (
                <div 
                  key={item._id} 
                  className="break-inside-avoid relative group overflow-hidden rounded-2xl cursor-pointer"
                >
                  <div className="w-full bg-darkCard overflow-hidden">
                    <img 
                      src={item.imageUrl} 
                      alt={item.title} 
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      loading="lazy"
                    />
                  </div>
                  
                  {/* Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
                    <h3 className="text-white font-bold text-lg">{item.title}</h3>
                  </div>

                  {/* Category Tag */}
                  <div className={`absolute top-4 left-4 ${getCategoryColor(item.category)} text-white text-sm font-bold px-3 py-1 rounded-md shadow-lg z-10`}>
                    {item.category}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* 4. View Full Gallery Button */}
          {galleryItems.length > 0 && (
            <div className="flex justify-center mt-16 mb-20">
              <button className="bg-accentGold text-darkBg font-bold px-8 py-3 rounded-lg flex items-center justify-center gap-3 hover:bg-accentGoldDark transition-colors text-base shadow-[0_0_20px_rgba(251,191,36,0.3)]">
                View More Photos <FaRegImage size={16} />
              </button>
            </div>
          )}

          {/* 5. Stats Footer Banner */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 pt-10 border-t border-white/5">
            
            {/* Photos */}
            <div className="bg-darkCard border border-white/5 rounded-2xl p-8 flex items-center gap-6 hover:border-white/10 transition-colors">
              <div className="w-14 h-14 rounded-full bg-blue-900/30 border border-blue-500/20 flex items-center justify-center text-blue-500 flex-shrink-0">
                <FaImage size={24} />
              </div>
              <div>
                <h3 className="text-2xl font-extrabold text-white mb-1">1000+</h3>
                <p className="text-sm text-textSecondary uppercase tracking-wider">Photos</p>
              </div>
            </div>

            {/* Events */}
            <div className="bg-darkCard border border-white/5 rounded-2xl p-8 flex items-center gap-6 hover:border-white/10 transition-colors">
              <div className="w-14 h-14 rounded-full bg-green-900/30 border border-green-500/20 flex items-center justify-center text-green-500 flex-shrink-0">
                <FaCalendarAlt size={24} />
              </div>
              <div>
                <h3 className="text-2xl font-extrabold text-white mb-1">200+</h3>
                <p className="text-sm text-textSecondary uppercase tracking-wider">Events</p>
              </div>
            </div>

            {/* Competitions */}
            <div className="bg-darkCard border border-white/5 rounded-2xl p-8 flex items-center gap-6 hover:border-white/10 transition-colors">
              <div className="w-14 h-14 rounded-full bg-orange-900/30 border border-orange-500/20 flex items-center justify-center text-accentGold flex-shrink-0">
                <FaTrophy size={24} />
              </div>
              <div>
                <h3 className="text-2xl font-extrabold text-white mb-1">50+</h3>
                <p className="text-sm text-textSecondary uppercase tracking-wider">Competitions</p>
              </div>
            </div>

            {/* Celebrations */}
            <div className="bg-darkCard border border-white/5 rounded-2xl p-8 flex items-center gap-6 hover:border-white/10 transition-colors">
              <div className="w-14 h-14 rounded-full bg-purple-900/30 border border-purple-500/20 flex items-center justify-center text-purple-500 flex-shrink-0">
                <FaUsers size={24} />
              </div>
              <div>
                <h3 className="text-2xl font-extrabold text-white mb-1">25+</h3>
                <p className="text-sm text-textSecondary uppercase tracking-wider">Celebrations</p>
              </div>
            </div>

          </div>

        </div>
      </section>

    </div>
  );
};

export default Gallery;
