import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../services/api';
import { 
  FaRegCalendarAlt, FaRegClock, FaMapMarkerAlt, FaUserTie, 
  FaChevronRight, FaSpinner
} from 'react-icons/fa';

const EventDetails = () => {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const response = await api.get(`/events/${id}`);
        setEvent(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch event details.');
        setLoading(false);
      }
    };
    fetchEvent();
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-darkBg text-white">
        <FaSpinner className="animate-spin text-4xl text-accentGold" />
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="flex justify-center items-center h-screen bg-darkBg text-white">
        <p className="text-xl font-bold text-red-500">{error || 'Event not found'}</p>
      </div>
    );
  }

  // Format date correctly
  const eventDate = new Date(event.startDate);
  const day = eventDate.getDate();
  const monthStr = eventDate.toLocaleString('default', { month: 'short' }).toUpperCase();
  const fullDateStr = eventDate.toLocaleDateString('default', { day: 'numeric', month: 'short', year: 'numeric' });
  const endDateStr = event.endDate ? new Date(event.endDate).toLocaleDateString('default', { day: 'numeric', month: 'short', year: 'numeric' }) : null;

  return (
    <div className="flex flex-col bg-darkBg text-white w-full pb-20">
      
      {/* Breadcrumbs */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 w-full pt-8 pb-4">
        <div className="flex items-center gap-2 text-sm font-bold text-textSecondary uppercase tracking-wider">
          <Link to="/" className="hover:text-accentGold transition-colors">Home</Link>
          <FaChevronRight size={8} />
          <Link to="/news-events" className="hover:text-accentGold transition-colors">News & Events</Link>
          <FaChevronRight size={8} />
          <span className="text-white">{event.title}</span>
        </div>
      </div>

      {/* Hero Banner */}
      <section className="max-w-7xl mx-auto px-6 md:px-12 w-full mb-12">
        <div className="w-full h-80 md:h-[400px] rounded-2xl overflow-hidden relative border border-white/5 bg-darkCard flex items-center justify-center">
          {event.imageUrl ? (
            <img src={event.imageUrl} alt={event.title} className="w-full h-full object-cover" />
          ) : (
            <span className="text-textSecondary/50 font-bold text-2xl uppercase">No Image Available</span>
          )}
          
          {/* Date Badge */}
          <div className="absolute top-6 left-6 bg-darkBg border border-white/10 rounded-xl p-3 flex flex-col items-center justify-center min-w-[60px] shadow-2xl backdrop-blur-sm">
            <span className="text-2xl font-bold text-blue-500 leading-none">{day}</span>
            <span className="text-xs text-textSecondary font-bold tracking-widest uppercase mt-1">{monthStr}</span>
          </div>
        </div>

        <div className="mt-8">
          <h1 className="text-4xl md:text-5xl font-extrabold text-white leading-tight mb-4">
            {event.title}
          </h1>
          <div className="flex flex-wrap items-center gap-6 text-base text-textSecondary font-bold">
            <div className="flex items-center gap-2">
              <FaRegCalendarAlt className="text-accentGold" /> {fullDateStr} {endDateStr && ` - ${endDateStr}`}
            </div>
            <div className="flex items-center gap-2">
              <FaRegClock className="text-accentGold" /> {event.time}
            </div>
            <div className="flex items-center gap-2">
              <FaMapMarkerAlt className="text-accentGold" /> {event.location}
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <section className="max-w-7xl mx-auto px-6 md:px-12 w-full flex flex-col lg:flex-row gap-12">
        
        {/* Left Column */}
        <div className="w-full lg:w-[65%] flex flex-col gap-10">
          
          {/* About */}
          <div>
            <h2 className="text-lg font-bold text-white mb-4">About the Event</h2>
            <div className="text-base text-textSecondary leading-loose space-y-4 whitespace-pre-wrap">
              {event.description}
            </div>
          </div>

        </div>

        {/* Right Column (Sidebar) */}
        <div className="w-full lg:w-[35%]">
          <div className="bg-darkCard border border-white/5 rounded-2xl p-8 sticky top-24">
            <h2 className="text-lg font-bold text-white mb-6">Event Details</h2>
            
            <div className="flex flex-col gap-6 mb-8">
              <div className="flex items-start gap-4">
                <div className="text-textSecondary mt-1"><FaRegCalendarAlt size={14} /></div>
                <div>
                  <p className="text-sm font-bold text-textSecondary mb-1">Date</p>
                  <p className="text-base font-bold text-white">{fullDateStr} {endDateStr && ` - ${endDateStr}`}</p>
                </div>
              </div>
 
              <div className="flex items-start gap-4">
                <div className="text-textSecondary mt-1"><FaRegClock size={14} /></div>
                <div>
                  <p className="text-sm font-bold text-textSecondary mb-1">Time</p>
                  <p className="text-base font-bold text-white">{event.time}</p>
                </div>
              </div>
 
              <div className="flex items-start gap-4">
                <div className="text-textSecondary mt-1"><FaMapMarkerAlt size={14} /></div>
                <div>
                  <p className="text-sm font-bold text-textSecondary mb-1">Venue</p>
                  <p className="text-base font-bold text-white">{event.location}</p>
                </div>
              </div>
 
              <div className="flex items-start gap-4">
                <div className="text-textSecondary mt-1"><FaUserTie size={14} /></div>
                <div>
                  <p className="text-sm font-bold text-textSecondary mb-1">Organized By</p>
                  <p className="text-base font-bold text-white">{event.organizer}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

      </section>

    </div>
  );
};

export default EventDetails;
