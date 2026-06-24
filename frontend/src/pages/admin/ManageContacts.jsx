import React, { useState, useEffect } from 'react';
import { FaEnvelope, FaTrash, FaSearch, FaSpinner, FaUser, FaPhoneAlt, FaRegCalendarAlt, FaEnvelopeOpen, FaImage } from 'react-icons/fa';
import api from '../../services/api';

const ManageContacts = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMessage, setSelectedMessage] = useState(null);

  const [contactSettings, setContactSettings] = useState({ hero: { backgroundImage: '', sideImage: '' } });
  const [settingsLoading, setSettingsLoading] = useState(false);
  const [bgUploading, setBgUploading] = useState(false);
  const [sideUploading, setSideUploading] = useState(false);

  useEffect(() => {
    fetchMessages();
    fetchContactSettings();
  }, []);

  const fetchContactSettings = async () => {
    setSettingsLoading(true);
    try {
      const { data } = await api.get('/contact-settings');
      setContactSettings(data);
    } catch (error) {
      console.error('Failed to load contact settings:', error);
    } finally {
      setSettingsLoading(false);
    }
  };

  const handleHeroImageUpload = async (e, imageType) => {
    const file = e.target.files[0];
    if (!file) return;

    const uploadData = new FormData();
    uploadData.append('image', file);
    
    if (imageType === 'backgroundImage') setBgUploading(true);
    if (imageType === 'sideImage') setSideUploading(true);
    
    try {
      const { data } = await api.post('/contact-settings/upload-image', uploadData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      const newSettings = { 
        ...contactSettings, 
        hero: { 
          ...contactSettings.hero, 
          [imageType]: data.imageUrl 
        } 
      };
      setContactSettings(newSettings);
      
      // Save settings
      await api.put('/contact-settings', newSettings);
      alert(`${imageType === 'backgroundImage' ? 'Background' : 'Side'} image updated successfully!`);
    } catch (err) {
      console.error(err);
      alert('Failed to upload image.');
    } finally {
      if (imageType === 'backgroundImage') setBgUploading(false);
      if (imageType === 'sideImage') setSideUploading(false);
    }
  };

  const fetchMessages = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/contact');
      setMessages(data);
    } catch (error) {
      console.error('Failed to fetch messages:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this message? This action cannot be undone.')) {
      try {
        await api.delete(`/contact/${id}`);
        setMessages(messages.filter(msg => msg._id !== id));
        if (selectedMessage && selectedMessage._id === id) {
          setSelectedMessage(null);
        }
      } catch (error) {
        console.error('Failed to delete message:', error);
        alert('Failed to delete message.');
      }
    }
  };

  const filteredMessages = messages.filter(msg => {
    const query = searchQuery.toLowerCase();
    return (
      (msg.name || '').toLowerCase().includes(query) ||
      (msg.email || '').toLowerCase().includes(query) ||
      (msg.phone || '').toLowerCase().includes(query) ||
      (msg.subject || '').toLowerCase().includes(query) ||
      (msg.message || '').toLowerCase().includes(query)
    );
  });

  return (
    <div className="flex flex-col gap-6 w-full pb-10 text-white">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white mb-1">Manage Messages</h1>
          <p className="text-xs text-textSecondary font-medium">Home / Messages / List</p>
        </div>
        
        {/* Search */}
        <div className="relative max-w-md w-full sm:w-72">
          <input
            type="text"
            placeholder="Search messages..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-[#0A1128] border border-white/10 rounded-lg pl-10 pr-4 py-2 text-sm text-white focus:border-blue-600 outline-none transition-colors w-full"
          />
          <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-textSecondary text-sm pointer-events-none" />
        </div>
      </div>

      {/* Contact Page Settings Panel */}
      <div className="bg-darkCard border border-white/5 rounded-xl p-6 flex flex-col gap-4 mb-2">
        <div className="flex items-center gap-3 border-b border-white/5 pb-3">
          <div className="p-2 rounded bg-yellow-500 text-darkBg">
            <FaImage size={14} />
          </div>
          <h2 className="text-base font-bold text-white">Contact Page Settings</h2>
        </div>
        
        {settingsLoading ? (
          <div className="py-8 flex justify-center"><FaSpinner className="animate-spin text-xl text-yellow-500" /></div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
            {/* Hero Background */}
            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold text-textSecondary uppercase">Hero Background Image</label>
              <div className="border border-white/10 rounded-lg p-3 bg-[#0A1128] flex flex-col gap-3">
                <div className="h-32 w-full bg-white/5 rounded border border-white/10 overflow-hidden relative">
                  {contactSettings.hero?.backgroundImage ? (
                    <img src={contactSettings.hero.backgroundImage} alt="Hero Background Preview" className="w-full h-full object-cover" />
                  ) : (
                    <div className="flex items-center justify-center w-full h-full text-white/20">
                      <FaImage size={24} />
                    </div>
                  )}
                </div>
                <div className="flex justify-between items-center">
                  <p className="text-[10px] text-textSecondary">1920x1080px recommended. Dark/blue overlay is applied automatically.</p>
                  <div className="flex items-center gap-2">
                    <label className="bg-white/10 hover:bg-white/20 text-white px-3 py-1.5 rounded text-xs font-bold transition-all cursor-pointer flex items-center gap-2">
                      {bgUploading ? <FaSpinner className="animate-spin" /> : 'Change Photo'}
                      <input 
                        type="file" 
                        className="hidden" 
                        accept="image/*" 
                        onChange={(e) => handleHeroImageUpload(e, 'backgroundImage')} 
                        disabled={bgUploading}
                      />
                    </label>
                    {contactSettings.hero?.backgroundImage && (
                      <button 
                        type="button"
                        onClick={async () => {
                          const newSettings = { ...contactSettings, hero: { ...contactSettings.hero, backgroundImage: '' } };
                          setContactSettings(newSettings);
                          await api.put('/contact-settings', newSettings);
                        }}
                        className="bg-red-500/20 hover:bg-red-500/40 text-red-500 px-3 py-1.5 rounded text-xs font-bold transition-all flex items-center gap-1.5"
                      >
                        <FaTrash /> Remove
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Hero Side Image */}
            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold text-textSecondary uppercase">Hero Side/Foreground Image</label>
              <div className="border border-white/10 rounded-lg p-3 bg-[#0A1128] flex flex-col gap-3">
                <div className="h-32 w-full bg-white/5 rounded border border-white/10 overflow-hidden relative">
                  {contactSettings.hero?.sideImage ? (
                    <img src={contactSettings.hero.sideImage} alt="Hero Side Preview" className="w-full h-full object-contain" />
                  ) : (
                    <div className="flex items-center justify-center w-full h-full text-white/20">
                      <FaImage size={24} />
                    </div>
                  )}
                </div>
                <div className="flex justify-between items-center">
                  <p className="text-[10px] text-textSecondary">800x800px recommended. Shows on the right side of the hero section.</p>
                  <div className="flex items-center gap-2">
                    <label className="bg-white/10 hover:bg-white/20 text-white px-3 py-1.5 rounded text-xs font-bold transition-all cursor-pointer flex items-center gap-2">
                      {sideUploading ? <FaSpinner className="animate-spin" /> : 'Change Photo'}
                      <input 
                        type="file" 
                        className="hidden" 
                        accept="image/*" 
                        onChange={(e) => handleHeroImageUpload(e, 'sideImage')} 
                        disabled={sideUploading}
                      />
                    </label>
                    {contactSettings.hero?.sideImage && (
                      <button 
                        type="button"
                        onClick={async () => {
                          const newSettings = { ...contactSettings, hero: { ...contactSettings.hero, sideImage: '' } };
                          setContactSettings(newSettings);
                          await api.put('/contact-settings', newSettings);
                        }}
                        className="bg-red-500/20 hover:bg-red-500/40 text-red-500 px-3 py-1.5 rounded text-xs font-bold transition-all flex items-center gap-1.5"
                      >
                        <FaTrash /> Remove
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Messages List Panel */}
        <div className="lg:col-span-6 bg-darkCard border border-white/5 rounded-xl p-6 flex flex-col gap-4">
          <div className="flex items-center justify-between border-b border-white/5 pb-3">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded bg-blue-500 text-white border border-blue-600 dark:bg-blue-950/40 dark:text-blue-500 dark:border-blue-600/10">
                <FaEnvelope size={14} />
              </div>
              <h2 className="text-base font-bold">Inbox ({filteredMessages.length})</h2>
            </div>
            {messages.length > 0 && searchQuery && (
              <span className="text-xs text-textSecondary bg-white/5 px-2.5 py-1 rounded-full border border-white/5">
                Filtered
              </span>
            )}
          </div>

          <div className="flex flex-col gap-3 max-h-[600px] overflow-y-auto pr-1 custom-scrollbar">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-20 text-textSecondary gap-2">
                <FaSpinner className="animate-spin text-xl text-blue-500" />
                <p className="text-sm">Loading messages...</p>
              </div>
            ) : filteredMessages.length === 0 ? (
              <div className="text-center py-20 text-textSecondary">
                <FaEnvelopeOpen size={32} className="mx-auto opacity-20 mb-4" />
                <p className="text-base font-bold text-white mb-1">No Messages Found</p>
                <p className="text-sm">
                  {searchQuery ? 'Try adjusting your search query.' : 'Incoming messages from contact form will appear here.'}
                </p>
              </div>
            ) : (
              filteredMessages.map((msg) => (
                <div
                  key={msg._id}
                  onClick={() => setSelectedMessage(msg)}
                  className={`border p-4 rounded-xl cursor-pointer transition-all flex flex-col gap-2 relative group text-left ${
                    selectedMessage && selectedMessage._id === msg._id
                      ? 'bg-blue-500 border-blue-600 dark:bg-blue-950/20 dark:border-blue-600/40'
                      : 'bg-[#0A1128] border-white/5 hover:border-white/10'
                  }`}
                >
                  <div className="flex justify-between items-start gap-4">
                    <h4 className="font-bold text-sm text-white truncate max-w-[70%]">
                      {msg.subject || 'No Subject'}
                    </h4>
                    <span className="text-xs text-textSecondary flex items-center gap-1 flex-shrink-0">
                      <FaRegCalendarAlt size={10} />
                      {new Date(msg.createdAt).toLocaleDateString([], { day: 'numeric', month: 'short' })}
                    </span>
                  </div>
                  
                  <p className="text-xs text-blue-400 font-semibold truncate">
                    {msg.name}
                  </p>
                  
                  <p className="text-sm text-textSecondary line-clamp-2 leading-relaxed">
                    {msg.message}
                  </p>

                  <div className="flex justify-end gap-2 mt-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(msg._id);
                      }}
                      className="p-1.5 rounded bg-red-500 text-white hover:bg-red-600 hover:text-white dark:bg-red-950/20 dark:text-red-500 dark:hover:bg-red-500 dark:hover:text-white transition-all"
                      title="Delete Message"
                    >
                      <FaTrash size={10} />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Message Content Viewer Panel */}
        <div className="lg:col-span-6 bg-darkCard border border-white/5 rounded-xl p-6 h-fit min-h-[400px] flex flex-col">
          {selectedMessage ? (
            <div className="flex flex-col gap-6 h-full text-left">
              {/* Header Details */}
              <div className="flex justify-between items-start border-b border-white/5 pb-4 gap-4">
                <div className="flex-grow min-w-0">
                  <span className="text-xs text-blue-400 font-bold tracking-wider uppercase bg-blue-500/10 px-2 py-0.5 rounded border border-blue-600/20">
                    Contact Message
                  </span>
                  <h2 className="text-lg font-bold text-white mt-2 mb-1 leading-snug">
                    {selectedMessage.subject || '(No Subject)'}
                  </h2>
                  <p className="text-xs text-textSecondary flex items-center gap-1">
                    <FaRegCalendarAlt />
                    Received: {new Date(selectedMessage.createdAt).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}
                  </p>
                </div>
                
                <button
                  onClick={() => handleDelete(selectedMessage._id)}
                  className="p-2 rounded-lg bg-red-500 text-white hover:bg-red-600 hover:text-white dark:bg-red-950/20 dark:text-red-500 dark:hover:bg-red-500 dark:hover:text-white transition-all flex-shrink-0"
                  title="Delete Message"
                >
                  <FaTrash size={12} />
                </button>
              </div>

              {/* Sender Details */}
              <div className="bg-[#0A1128] border border-white/5 rounded-xl p-4 flex flex-col gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-blue-500 text-white dark:bg-blue-950 dark:text-blue-400 flex items-center justify-center font-bold text-sm border border-blue-600 dark:border-blue-600/10">
                    <FaUser size={12} />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-white leading-tight">{selectedMessage.name}</p>
                    <p className="text-xs text-textSecondary mt-0.5">{selectedMessage.email}</p>
                  </div>
                </div>
                
                {selectedMessage.phone && (
                  <div className="flex items-center gap-2 text-xs text-textSecondary border-t border-white/5 pt-2 mt-1">
                    <FaPhoneAlt size={10} className="text-blue-400" />
                    <span>Phone: <strong>{selectedMessage.phone}</strong></span>
                  </div>
                )}
              </div>

              {/* Message Body */}
              <div className="flex-grow">
                <h3 className="text-xs font-bold text-textSecondary uppercase mb-2">Message Body</h3>
                <div className="bg-[#0A1128] border border-white/5 rounded-xl p-4 text-sm text-textSecondary leading-relaxed whitespace-pre-wrap max-h-[300px] overflow-y-auto custom-scrollbar">
                  {selectedMessage.message}
                </div>
              </div>

              {/* Action reply note */}
              <div className="mt-auto border-t border-white/5 pt-4 text-xs text-textSecondary flex justify-between items-center">
                <span>To reply, send an email to <a href={`mailto:${selectedMessage.email}`} className="text-blue-400 hover:underline font-bold">{selectedMessage.email}</a></span>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center flex-grow py-24 text-textSecondary">
              <FaEnvelopeOpen size={48} className="opacity-10 mb-4" />
              <p className="text-base font-bold text-white mb-1">Select a Message</p>
              <p className="text-sm">Click on any message in the inbox to view its complete details here.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ManageContacts;

