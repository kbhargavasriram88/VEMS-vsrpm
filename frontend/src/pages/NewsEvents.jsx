import React, { useState, useEffect } from 'react';
import { 
  FaBell, FaSearch, FaMapMarkerAlt, FaRegCalendarAlt, FaRegNewspaper, FaArrowRight, FaSpinner
} from 'react-icons/fa';
import { Link } from 'react-router-dom';
import api from '../services/api';

// Placeholders
const heroBg = "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=1920&q=80"; // background school
const heroStudents = "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=800&q=80"; // school building right

const NewsEvents = () => {
  const [activeTab, setActiveTab] = useState("All Updates");
  const [news, setNews] = useState([]);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState(null);
  const [newsSettings, setNewsSettings] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [newsRes, eventsRes, settingsRes] = await Promise.all([
          api.get('/news'),
          api.get('/events'),
          api.get('/news-settings')
        ]);
        setNews(newsRes.data);
        setEvents(eventsRes.data);
        setNewsSettings(settingsRes.data);
      } catch (err) {
        console.error('Failed to load news or events:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const formatDate = (dateString) => {
    const d = new Date(dateString);
    const date = d.getDate().toString().padStart(2, '0');
    const month = d.toLocaleString('en-US', { month: 'short' }).toUpperCase();
    const time = d.toLocaleString('en-US', { hour: '2-digit', minute: '2-digit' });
    return { date, month, time };
  };

  return (
    <div className="flex flex-col bg-darkBg text-white w-full">
      
      {/* 1. Hero Section */}
      <section className="relative w-full min-h-[90vh] flex items-center pt-10 bg-darkCard border-b border-white/5 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img src={newsSettings?.hero?.backgroundImage || heroBg} alt="School" className="w-full h-full object-cover opacity-35" />
          <div className="absolute inset-0 bg-gradient-to-r from-darkBg via-darkBg/90 to-transparent"></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-6 md:px-12 w-full flex flex-col-reverse md:flex-row items-center justify-between relative z-10 h-full">
          <div className="w-full md:w-1/2 flex flex-col items-start pt-16 md:pt-0">
            <span className="text-accentGold font-bold tracking-widest text-xs mb-4 uppercase flex items-center gap-2">
              <FaBell size={12} /> LATEST UPDATES
            </span>
            <h1 className="text-5xl md:text-7xl font-extrabold text-white leading-tight mb-6">
              News & Events
            </h1>
            <p className="text-textSecondary max-w-sm text-sm leading-relaxed mb-8">
              Stay informed with our latest news, announcements and upcoming events.
            </p>
          </div>
          
          <div className="w-full md:w-1/2 h-full flex items-end justify-center md:justify-end">
            <img src={newsSettings?.hero?.sideImage || heroStudents} alt="School Building" className="h-[90%] max-h-[500px] object-cover object-center mask-image-bottom drop-shadow-2xl" style={{ WebkitMaskImage: 'linear-gradient(to top, transparent, black 10%)' }} />
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <section className="py-16 bg-darkBg">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          
          {/* 2. Action Bar */}
          <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-16 border-b border-white/5 pb-8">
            <div className="flex bg-darkCard p-1 rounded-lg border border-white/10">
              {['All Updates', 'News', 'Events'].map(tab => (
                <button 
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-6 py-2.5 rounded-md text-base font-bold transition-colors ${
                    activeTab === tab 
                      ? 'bg-accentGold text-darkBg' 
                      : 'text-textSecondary hover:text-white'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
            
            <div className="flex items-center bg-darkCard border border-white/10 rounded-lg px-4 py-3 w-full md:w-80 focus-within:border-accentGold transition-colors">
              <input 
                type="text" 
                placeholder="Search news or events..." 
                className="bg-transparent border-none outline-none text-white text-base w-full placeholder-textSecondary"
              />
              <FaSearch className="text-textSecondary ml-2" />
            </div>
          </div>

          <div className="flex flex-col lg:flex-row gap-12">
            
            {/* Left Column: Latest News */}
            <div className={`w-full flex flex-col ${activeTab === 'Events' ? 'hidden' : activeTab === 'News' ? 'lg:w-full' : 'lg:w-[65%]'}`}>
              <div className="flex justify-between items-end mb-8">
                <h2 className="text-xl font-bold text-white">Latest News</h2>
                <button onClick={() => alert('No older news available')} className="text-accentGold text-base font-bold hover:text-white transition-colors flex items-center gap-1 cursor-pointer">
                  View All News <FaArrowRight size={10} />
                </button>
              </div>
 
              {/* 3. Latest News Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
                {loading ? (
                  <div className="col-span-1 md:col-span-2 flex justify-center items-center py-10">
                    <FaSpinner className="animate-spin text-accentGold text-3xl" />
                  </div>
                ) : news.length === 0 ? (
                  <div className="col-span-1 md:col-span-2 text-textSecondary text-center py-10">No news available at the moment.</div>
                ) : (
                  news.map(item => {
                    const { date, month } = formatDate(item.createdAt);
                    return (
                    <div key={item._id} className="bg-darkCard border border-white/5 rounded-2xl overflow-hidden hover:border-white/20 transition-all duration-300 group">
                      <div className="relative h-48 w-full overflow-hidden">
                        <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                        
                        {/* Date Badge */}
                        <div className="absolute top-4 left-4 bg-darkCard rounded-xl p-2 flex flex-col items-center justify-center min-w-[50px] border border-white/10 shadow-lg">
                          <span className={`text-lg font-bold text-accentGold leading-none`}>{date}</span>
                          <span className="text-sm text-textSecondary font-bold tracking-widest uppercase mt-1">{month}</span>
                        </div>
                      </div>
                      
                      <div className="p-6 flex flex-col h-auto">
                        <h3 className="font-bold text-white text-lg mb-3 leading-snug group-hover:text-accentGold transition-colors line-clamp-2">{item.title}</h3>
                        <p className="text-base text-textSecondary leading-relaxed mb-6 line-clamp-3">{item.content}</p>
                        
                        <div className="flex items-center justify-between mt-auto pt-4 border-t border-white/5">
                          <div className="flex items-center gap-2 text-sm text-textSecondary font-bold uppercase tracking-wider">
                            <FaRegNewspaper className="text-accentGold" /> News
                          </div>
                          <button onClick={(e) => { e.preventDefault(); setSelectedItem(item); }} className="text-accentGold text-sm font-bold hover:text-white transition-colors flex items-center gap-1 cursor-pointer">
                            Read More <FaArrowRight size={10} />
                          </button>
                        </div>
                      </div>
                    </div>
                  )})
                )}
              </div>

              {/* 5. Newsletter Subscribe Banner */}
              <div className="bg-darkCard border border-white/5 rounded-2xl p-8 flex flex-col md:flex-row items-center justify-between gap-6 hover:border-accentGold/20 transition-colors mt-auto">
                <div className="flex items-center gap-4 w-full md:w-auto">
                  <div className="w-12 h-12 rounded-full bg-accentGold/10 flex items-center justify-center text-accentGold text-xl flex-shrink-0">
                    <FaBell />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white mb-1">Never Miss an Update!</h3>
                    <p className="text-sm text-textSecondary">Subscribe to get the latest news and event updates.</p>
                  </div>
                </div>
                
                <div className="flex items-center w-full md:w-auto bg-darkBg rounded-lg p-1 border border-white/10 focus-within:border-accentGold transition-colors">
                  <input type="email" placeholder="Enter your email" className="bg-transparent border-none outline-none text-base text-white px-4 py-2 w-full md:w-48" />
                  <button onClick={() => alert('Successfully Subscribed to Newsletter!')} className="bg-accentGold text-darkBg px-6 py-2 rounded-md text-base font-bold hover:bg-accentGoldDark transition-colors">
                    Subscribe
                  </button>
                </div>
              </div>

            </div>

            {/* Right Column: Upcoming Events Timeline */}
            <div className={`w-full flex flex-col ${activeTab === 'News' ? 'hidden' : activeTab === 'Events' ? 'lg:w-full' : 'lg:w-[35%]'}`}>
              <div className="flex justify-between items-end mb-8">
                <h2 className="text-xl font-bold text-white">Upcoming Events</h2>
                <Link to="/academics" className="border border-white/20 text-textSecondary px-4 py-1.5 rounded-md text-sm font-bold hover:border-accentGold hover:text-accentGold transition-colors flex items-center gap-2">
                  <FaRegCalendarAlt /> View Calendar
                </Link>
              </div>

              {/* 4. Timeline */}
              <div className="relative border-l border-white/10 ml-6 pl-8 flex flex-col gap-8 pb-8">
                {loading ? (
                  <div className="flex justify-center items-center py-10">
                    <FaSpinner className="animate-spin text-accentGold text-2xl" />
                  </div>
                ) : events.length === 0 ? (
                  <div className="text-textSecondary text-center py-10">No upcoming events.</div>
                ) : (
                  events.map((event, index) => {
                    const { date, month, time } = formatDate(event.startDate);
                    const color = index % 2 === 0 ? 'text-accentGold' : 'text-blue-500';
                    const borderColor = index % 2 === 0 ? 'border-accentGold' : 'border-blue-500';
                    return (
                    <div key={event._id} className="relative flex flex-col group cursor-pointer">
                      
                      {/* Date Badge Indicator */}
                      <div className="absolute -left-[61px] top-0 bg-darkBg border border-white/10 rounded-xl p-2 flex flex-col items-center justify-center min-w-[50px] shadow-lg group-hover:border-white/30 transition-colors z-10">
                        <span className={`text-lg font-bold ${color} leading-none`}>{date}</span>
                        <span className="text-sm text-textSecondary font-bold tracking-widest uppercase mt-1">{month}</span>
                      </div>

                      {/* Content Card */}
                      <div className={`bg-darkBg border ${borderColor} rounded-xl p-5 hover:bg-darkCard transition-colors`}>
                        <div className="text-sm text-textSecondary mb-2 font-bold flex items-center gap-1.5">
                          <FaRegCalendarAlt /> {time}
                        </div>
                        <h3 className="font-bold text-white text-base mb-2 group-hover:text-accentGold transition-colors">{event.title}</h3>
                        <p className="text-base text-textSecondary mb-4 leading-relaxed">{event.description}</p>
                        {event.location && (
                          <div className="flex items-center gap-1.5 text-sm text-textSecondary font-bold">
                            <FaMapMarkerAlt className={color} /> {event.location}
                          </div>
                        )}
                      </div>
                      
                    </div>
                  )})
                )}
              </div>

              <button onClick={() => alert('No more upcoming events')} className="w-full bg-accentGold text-darkBg py-3.5 rounded-lg text-base font-bold hover:bg-accentGoldDark transition-colors flex items-center justify-center gap-2 mt-4 shadow-lg">
                View All Events <FaArrowRight />
              </button>

            </div>

          </div>
        </div>
      </section>

      {/* Article Modal */}
      {selectedItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm" onClick={() => setSelectedItem(null)}>
          <div className="bg-darkCard border border-white/10 rounded-2xl w-full max-w-3xl max-h-[90vh] flex flex-col overflow-hidden shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="relative flex-shrink-0">
              {selectedItem.imageUrl ? (
                <img src={selectedItem.imageUrl} alt={selectedItem.title} className="w-full h-64 object-cover" />
              ) : (
                <div className="w-full h-20 bg-darkBg"></div>
              )}
              <button onClick={() => setSelectedItem(null)} className="absolute top-4 right-4 bg-black/50 text-white w-10 h-10 rounded-full flex items-center justify-center hover:bg-black transition-colors border border-white/20">
                ✕
              </button>
            </div>
            <div className="p-8 overflow-y-auto">
              <h2 className="text-3xl font-bold text-white mb-6">{selectedItem.title}</h2>
              <div className="text-base text-textSecondary whitespace-pre-wrap leading-relaxed">
                {selectedItem.content || selectedItem.description}
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default NewsEvents;
