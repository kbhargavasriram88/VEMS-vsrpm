import React, { useState, useEffect } from 'react';
import { FaCalendarAlt, FaMapMarkerAlt, FaTrash, FaPlus, FaCamera, FaSpinner, FaClock } from 'react-icons/fa';
import api from '../../services/api';

const ManageEvents = () => {
  const [events, setEvents] = useState([]);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    startDate: '',
    location: '',
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/events');
      setEvents(data);
    } catch (error) {
      console.error('Failed to load events:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      // Use FormData to allow image upload
      const data = new FormData();
      data.append('title', formData.title);
      data.append('description', formData.description);
      data.append('startDate', formData.startDate);
      data.append('location', formData.location);
      if (imageFile) {
        data.append('image', imageFile);
      }

      await api.post('/events', data, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setFormData({ title: '', description: '', startDate: '', location: '' });
      setImageFile(null);
      setImagePreview('');
      fetchEvents();
      alert('Event published successfully!');
    } catch (error) {
      console.error(error);
      alert('Failed to publish event: ' + (error.response?.data?.message || error.message));
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this event? This action cannot be undone.')) {
      try {
        await api.delete(`/events/${id}`);
        setEvents(events.filter(ev => ev._id !== id));
      } catch (error) {
        console.error(error);
        alert('Failed to delete event.');
      }
    }
  };

  return (
    <div className="flex flex-col gap-6 w-full pb-10 text-white">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white mb-1">Manage Events</h1>
        <p className="text-xs text-textSecondary font-medium">Home / Events / List</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Creator Form */}
        <div className="lg:col-span-5 bg-darkCard border border-white/5 rounded-xl p-6 h-fit flex flex-col gap-4">
          <div className="flex items-center gap-3 border-b border-white/5 pb-3">
            <div className="p-2 rounded bg-green-500 text-white border border-green-600 dark:bg-green-950 dark:text-green-500 dark:border-green-500/10">
              <FaPlus size={14} />
            </div>
            <h2 className="text-base font-bold">Create New Event</h2>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold text-textSecondary uppercase">Event Title <span className="text-red-500">*</span></label>
              <input 
                type="text" 
                placeholder="e.g., Annual Sports Meet 2026"
                required 
                className="bg-[#0A1128] border border-white/10 rounded-lg px-4 py-3 text-sm text-white focus:border-blue-600 outline-none transition-colors w-full" 
                value={formData.title} 
                onChange={e => setFormData({...formData, title: e.target.value})} 
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold text-textSecondary uppercase">Date <span className="text-red-500">*</span></label>
                <div className="relative">
                  <input 
                    type="date" 
                    required 
                    className="bg-[#0A1128] border border-white/10 rounded-lg pl-10 pr-4 py-3 text-sm text-white focus:border-blue-600 outline-none transition-colors w-full" 
                    value={formData.startDate} 
                    onChange={e => setFormData({...formData, startDate: e.target.value})} 
                  />
                  <FaCalendarAlt className="absolute left-4 top-1/2 transform -translate-y-1/2 text-textSecondary text-sm pointer-events-none" />
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold text-textSecondary uppercase">Location</label>
                <div className="relative">
                  <input 
                    type="text" 
                    placeholder="e.g., School Grounds"
                    className="bg-[#0A1128] border border-white/10 rounded-lg pl-10 pr-4 py-3 text-sm text-white focus:border-blue-600 outline-none transition-colors w-full" 
                    value={formData.location} 
                    onChange={e => setFormData({...formData, location: e.target.value})} 
                  />
                  <FaMapMarkerAlt className="absolute left-4 top-1/2 transform -translate-y-1/2 text-textSecondary text-sm pointer-events-none" />
                </div>
              </div>
            </div>

            {/* Featured Event Image */}
            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold text-textSecondary uppercase">Cover Image</label>
              <div className="bg-[#0A1128] border border-white/10 rounded-lg p-4 flex items-center gap-4">
                <div className="w-20 h-20 rounded-md overflow-hidden bg-white/5 border border-white/10 flex items-center justify-center flex-shrink-0">
                  {imagePreview ? (
                    <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                  ) : (
                    <FaCamera className="text-white/20 text-lg" />
                  )}
                </div>
                <div className="flex flex-col gap-2">
                  <label className="border border-white/20 text-white px-4 py-1.5 rounded-lg text-xs font-bold hover:bg-white/5 transition-all w-fit cursor-pointer flex items-center gap-1.5">
                    <FaCamera /> Select File
                    <input type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
                  </label>
                  <p className="text-[10px] text-textSecondary">PNG, JPG, or WEBP. Max size 5MB</p>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold text-textSecondary uppercase">Description <span className="text-red-500">*</span></label>
              <textarea 
                placeholder="Details about the event program, activities, and timings..."
                required 
                rows="4" 
                className="bg-[#0A1128] border border-white/10 rounded-lg px-4 py-3 text-sm text-white focus:border-blue-600 outline-none transition-colors w-full resize-none" 
                value={formData.description} 
                onChange={e => setFormData({...formData, description: e.target.value})}
              ></textarea>
            </div>

            <button 
              type="submit" 
              disabled={submitting}
              className="bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg text-sm font-bold transition-all w-full flex items-center justify-center gap-2 mt-2 shadow-lg shadow-blue-500/10"
            >
              {submitting ? (
                <>
                  <FaSpinner className="animate-spin" /> Publishing Event...
                </>
              ) : (
                <>
                  <FaPlus /> Add Event
                </>
              )}
            </button>
          </form>
        </div>

        {/* List of Events */}
        <div className="lg:col-span-7 bg-darkCard border border-white/5 rounded-xl p-6 flex flex-col gap-4">
          <div className="flex items-center gap-3 border-b border-white/5 pb-3">
            <div className="p-2 rounded bg-blue-500 text-white border border-blue-600 dark:bg-blue-950 dark:text-blue-500 dark:border-blue-600/10">
              <FaCalendarAlt size={14} />
            </div>
            <h2 className="text-base font-bold">Upcoming Events ({events.length})</h2>
          </div>

          <div className="flex flex-col gap-4 max-h-[600px] overflow-y-auto pr-1 custom-scrollbar">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-20 text-textSecondary gap-2">
                <FaSpinner className="animate-spin text-xl text-blue-500" />
                <p className="text-sm">Loading event timeline...</p>
              </div>
            ) : events.length === 0 ? (
              <div className="text-center py-20 text-textSecondary">
                <FaCalendarAlt size={32} className="mx-auto opacity-20 mb-4" />
                <p className="text-base font-bold text-white mb-1">No Events Found</p>
                <p className="text-sm">Add a new event in the left panel to populate the list.</p>
              </div>
            ) : (
              events.map((ev) => (
                <div key={ev._id} className="bg-[#0A1128] border border-white/5 p-4 rounded-xl flex flex-col sm:flex-row items-start sm:items-center gap-4 hover:border-white/10 transition-all group">
                  {ev.imageUrl && (
                    <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-800 flex-shrink-0">
                      <img src={ev.imageUrl} alt={ev.title} className="w-full h-full object-cover" />
                    </div>
                  )}
                  <div className="flex-grow min-w-0">
                    <h4 className="font-bold text-base text-white group-hover:text-blue-400 transition-colors truncate">{ev.title}</h4>
                    <p className="text-xs text-textSecondary flex items-center gap-4 mt-1">
                      <span className="flex items-center gap-1.5"><FaCalendarAlt /> {new Date(ev.startDate).toLocaleDateString([], { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                      {ev.location && <span className="flex items-center gap-1.5"><FaMapMarkerAlt /> {ev.location}</span>}
                    </p>
                    <p className="text-xs text-textSecondary mt-2 leading-relaxed line-clamp-2">{ev.description}</p>
                  </div>
                  <button 
                    onClick={() => handleDelete(ev._id)} 
                    className="p-2.5 rounded-lg bg-red-500 text-white hover:bg-red-600 hover:text-white dark:bg-red-950/20 dark:text-red-500 dark:hover:bg-red-500 dark:hover:text-white transition-all self-end sm:self-center flex-shrink-0"
                    title="Delete Event"
                  >
                    <FaTrash size={12} />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManageEvents;
