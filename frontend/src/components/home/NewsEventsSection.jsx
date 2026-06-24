import React from 'react';
import { Link } from 'react-router-dom';
import { FaArrowRight } from 'react-icons/fa';

const NewsEventsSection = ({ currentSettings, newsList, eventList, showNews, showEvents }) => {
  
  const formatDate = (dateString) => {
    const d = new Date(dateString);
    const date = d.getDate().toString().padStart(2, '0');
    const month = d.toLocaleString('en-US', { month: 'short' }).toUpperCase();
    const time = d.toLocaleString('en-US', { hour: '2-digit', minute: '2-digit' });
    return { date, month, time };
  };

  if (!showNews && !showEvents) return null;

  return (
    <section className="py-24 bg-darkBg">
      <div className={`max-w-7xl mx-auto px-6 md:px-12 grid grid-cols-1 ${showNews && showEvents ? 'lg:grid-cols-2' : 'lg:grid-cols-1'} gap-16`}>
        
        {/* Latest News */}
        {showNews && (
        <div>
          <div className="flex justify-between items-end mb-8 border-b border-white/10 pb-4">
            <div>
              <h2 className="text-lg font-bold uppercase tracking-widest text-white">{currentSettings.newsSection?.title || 'Latest News'}</h2>
              <p className="text-sm text-textSecondary mt-1">{currentSettings.newsSection?.subtitle || 'Stay updated with the latest happenings at our school.'}</p>
            </div>
            <Link to="/news-events" className="text-accentGold text-base font-bold flex items-center gap-1 hover:underline whitespace-nowrap">View All <FaArrowRight size={10}/></Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
             {newsList.length === 0 ? (
               <div className="col-span-3 text-textSecondary py-4">No recent news available.</div>
             ) : (
               newsList.map(item => {
                 const { date, month } = formatDate(item.createdAt);
                 return (
                 <Link to="/news-events" key={item._id} className="flex flex-col group cursor-pointer">
                   <div className="overflow-hidden rounded-lg mb-4">
                     <img 
                       src={item.imageUrl} 
                       loading="lazy"
                       className="w-full h-32 object-cover group-hover:scale-110 transition-transform duration-500" 
                       alt={item.title} 
                     />
                   </div>
                   <span className="text-base text-textSecondary mb-2 font-medium">{date} {month} {new Date(item.createdAt).getFullYear()}</span>
                   <h4 className="font-bold text-lg text-white mb-2 group-hover:text-accentGold transition-colors line-clamp-2">{item.title}</h4>
                   <p className="text-base text-textSecondary mb-4 line-clamp-2">{item.content}</p>
                   <span className="text-accentGold text-base font-bold flex items-center gap-1 mt-auto hover:text-white transition-colors">Read More <FaArrowRight size={10}/></span>
                 </Link>
               )})
             )}
          </div>
        </div>
        )}

        {/* Upcoming Events */}
        {showEvents && (
        <div>
          <div className="flex justify-between items-end mb-8 border-b border-white/10 pb-4">
            <div>
              <h2 className="text-lg font-bold uppercase tracking-widest text-white">{currentSettings.eventsSection?.title || 'Upcoming Events'}</h2>
              <p className="text-sm text-textSecondary mt-1">{currentSettings.eventsSection?.subtitle || "Don't miss out on our upcoming school events and activities."}</p>
            </div>
            <Link to="/news-events" className="text-accentGold text-base font-bold flex items-center gap-1 hover:underline whitespace-nowrap">View All <FaArrowRight size={10}/></Link>
          </div>
          <div className="flex flex-col gap-4">
             {eventList.length === 0 ? (
               <div className="text-textSecondary py-4">No upcoming events.</div>
             ) : (
               eventList.map(item => {
                 const { date, month, time } = formatDate(item.startDate);
                 return (
                 <Link to="/news-events" key={item._id} className="flex gap-6 p-5 border border-white/5 rounded-xl hover:border-accentGold/30 transition-colors dark:bg-darkCard/50 items-center block">
                   <div className="bg-accentGold p-3 rounded-lg text-darkBg text-center min-w-[70px]">
                     <span className="block font-black text-2xl">{date}</span>
                     <span className="block text-sm font-bold uppercase tracking-wider">{month}</span>
                   </div>
                   <div>
                     <h4 className="font-bold text-white mb-1 text-lg group-hover:text-accentGold transition-colors line-clamp-1">{item.title}</h4>
                     <p className="text-base text-textSecondary">{item.location && `${item.location} `}<br/>{time}</p>
                   </div>
                 </Link>
               )})
             )}
          </div>
        </div>
        )}

      </div>
    </section>
  );
};

export default NewsEventsSection;
