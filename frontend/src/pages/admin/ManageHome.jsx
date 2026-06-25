import React, { useState, useEffect } from 'react';
import { 
  FaHome, FaRegCalendarAlt, FaChalkboardTeacher, FaGraduationCap, 
  FaBuilding, FaGlobe, FaDesktop, FaLaptopCode, FaFlask, FaBookOpen, 
  FaTrophy, FaBusAlt, FaPlus, FaTrash, FaSave, FaCamera, FaSpinner, 
  FaQuoteLeft, FaImage, FaEdit
} from 'react-icons/fa';
import api from '../../services/api';

const iconOptions = [
  { value: 'FaGraduationCap', label: 'Graduation Cap' },
  { value: 'FaChalkboardTeacher', label: 'Chalkboard Teacher' },
  { value: 'FaBuilding', label: 'School Building' },
  { value: 'FaGlobe', label: 'Globe' },
  { value: 'FaDesktop', label: 'Desktop screen' },
  { value: 'FaLaptopCode', label: 'Laptop Code' },
  { value: 'FaFlask', label: 'Science Flask' },
  { value: 'FaBookOpen', label: 'Open Book' },
  { value: 'FaTrophy', label: 'Trophy' },
  { value: 'FaBusAlt', label: 'School Bus' }
];

const ManageHome = () => {
  const [activeTab, setActiveTab] = useState('stats');
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  
  const [formData, setFormData] = useState({
    heroBackgroundImage: '',
    heroContent: { eyebrow: '', heading: '', subtitle: '' },
    heroStats: { studentsCount: '', staffCount: '', yearsExcellence: '' },
    achievements: { students: '', teachers: '', classrooms: '', awards: '' },
    principalMessage: { name: '', designation: '', text1: '', text2: '', signature: '', imageUrl: '' },
    highlights: [],
    facilities: [],
    testimonials: [],
    newsSection: { isActive: true, title: '', subtitle: '' },
    eventsSection: { isActive: true, title: '', subtitle: '' },
    gallerySection: { isActive: true, title: '', subtitle: '' },
    welcomeModal: { isActive: true, announcements: [] }
  });

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/home-settings');
      setFormData(data);
    } catch (err) {
      console.error('Failed to load homepage settings:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleTextChange = (section, field, value) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  const handleToggleChange = (section, value) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        isActive: value
      }
    }));
  };

  const handleImageUpload = async (e, callback) => {
    const file = e.target.files[0];
    if (!file) return;

    const uploadData = new FormData();
    uploadData.append('image', file);
    
    setUploading(true);
    try {
      const { data } = await api.post('/home-settings/upload-image', uploadData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      callback(data.imageUrl);
      alert('Asset uploaded successfully!');
    } catch (err) {
      console.error(err);
      alert('Failed to upload image.');
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const { data } = await api.put('/home-settings', formData);
      setFormData(data);
      alert('Homepage settings updated successfully!');
    } catch (err) {
      console.error(err);
      alert('Failed to save settings: ' + (err.response?.data?.message || err.message));
    } finally {
      setSaving(false);
    }
  };

  // Highlights handlers
  const handleHighlightChange = (index, field, value) => {
    const newHighlights = [...formData.highlights];
    newHighlights[index][field] = value;
    setFormData({ ...formData, highlights: newHighlights });
  };

  const addHighlight = () => {
    if (formData.highlights.length >= 6) {
      alert('Maximum 6 highlights allowed.');
      return;
    }
    setFormData({
      ...formData,
      highlights: [...formData.highlights, { icon: 'FaGraduationCap', title: 'New Highlight', description: 'Description here...' }]
    });
  };

  const removeHighlight = (index) => {
    const newHighlights = formData.highlights.filter((_, i) => i !== index);
    setFormData({ ...formData, highlights: newHighlights });
  };

  // Facilities handlers
  const handleFacilityChange = (index, field, value) => {
    const newFacilities = [...formData.facilities];
    newFacilities[index][field] = value;
    setFormData({ ...formData, facilities: newFacilities });
  };

  const addFacility = () => {
    setFormData({
      ...formData,
      facilities: [...formData.facilities, { icon: 'FaDesktop', title: 'New Facility', imageUrl: '' }]
    });
  };

  const removeFacility = (index) => {
    const newFacilities = formData.facilities.filter((_, i) => i !== index);
    setFormData({ ...formData, facilities: newFacilities });
  };

  // Testimonials handlers
  const handleTestimonialChange = (index, field, value) => {
    const newTestimonials = [...formData.testimonials];
    newTestimonials[index][field] = value;
    setFormData({ ...formData, testimonials: newTestimonials });
  };

  const addTestimonial = () => {
    setFormData({
      ...formData,
      testimonials: [...formData.testimonials, { quote: '', author: '', role: 'Parent', imageUrl: '' }]
    });
  };

  const removeTestimonial = (index) => {
    const newTestimonials = formData.testimonials.filter((_, i) => i !== index);
    setFormData({ ...formData, testimonials: newTestimonials });
  };

  // Welcome Modal handlers
  const handleAnnouncementChange = (index, field, value) => {
    const newAnnouncements = [...formData.welcomeModal.announcements];
    newAnnouncements[index][field] = value;
    setFormData({
      ...formData,
      welcomeModal: { ...formData.welcomeModal, announcements: newAnnouncements }
    });
  };

  const addAnnouncement = () => {
    setFormData({
      ...formData,
      welcomeModal: {
        ...formData.welcomeModal,
        announcements: [...formData.welcomeModal.announcements, { title: '', description: '', imageUrl: '' }]
      }
    });
  };

  const removeAnnouncement = (index) => {
    const newAnnouncements = formData.welcomeModal.announcements.filter((_, i) => i !== index);
    setFormData({
      ...formData,
      welcomeModal: { ...formData.welcomeModal, announcements: newAnnouncements }
    });
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-40 text-textSecondary gap-2">
        <FaSpinner className="animate-spin text-3xl text-blue-500" />
        <p className="text-sm">Loading settings dashboard...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 w-full pb-10 text-white">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white mb-1">Manage Homepage Sections</h1>
        <p className="text-xs text-textSecondary font-medium">Home / Homepage Configuration</p>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-white/5 gap-2 pb-px overflow-x-auto">
        <button 
          onClick={() => setActiveTab('stats')}
          className={`px-4 py-2 text-xs font-bold transition-all border-b-2 whitespace-nowrap ${
            activeTab === 'stats' ? 'border-accentGold text-accentGold' : 'border-transparent text-textSecondary hover:text-white'
          }`}
        >
          Sizing & Stats
        </button>
        <button 
          onClick={() => setActiveTab('principal')}
          className={`px-4 py-2 text-xs font-bold transition-all border-b-2 whitespace-nowrap ${
            activeTab === 'principal' ? 'border-accentGold text-accentGold' : 'border-transparent text-textSecondary hover:text-white'
          }`}
        >
          Principal Message
        </button>
        <button 
          onClick={() => setActiveTab('highlights')}
          className={`px-4 py-2 text-xs font-bold transition-all border-b-2 whitespace-nowrap ${
            activeTab === 'highlights' ? 'border-accentGold text-accentGold' : 'border-transparent text-textSecondary hover:text-white'
          }`}
        >
          Highlights
        </button>
        <button 
          onClick={() => setActiveTab('facilities')}
          className={`px-4 py-2 text-xs font-bold transition-all border-b-2 whitespace-nowrap ${
            activeTab === 'facilities' ? 'border-accentGold text-accentGold' : 'border-transparent text-textSecondary hover:text-white'
          }`}
        >
          Facilities Grid
        </button>
        <button 
          onClick={() => setActiveTab('testimonials')}
          className={`px-4 py-2 text-xs font-bold transition-all border-b-2 whitespace-nowrap ${
            activeTab === 'testimonials' ? 'border-accentGold text-accentGold' : 'border-transparent text-textSecondary hover:text-white'
          }`}
        >
          Testimonials
        </button>
        <button 
          onClick={() => setActiveTab('sections')}
          className={`px-4 py-2 text-xs font-bold transition-all border-b-2 whitespace-nowrap ${
            activeTab === 'sections' ? 'border-accentGold text-accentGold' : 'border-transparent text-textSecondary hover:text-white'
          }`}
        >
          Dynamic Sections
        </button>
        <button 
          onClick={() => setActiveTab('welcomeModal')}
          className={`px-4 py-2 text-xs font-bold transition-all border-b-2 whitespace-nowrap ${
            activeTab === 'welcomeModal' ? 'border-accentGold text-accentGold' : 'border-transparent text-textSecondary hover:text-white'
          }`}
        >
          Welcome Modal
        </button>
      </div>

      <form onSubmit={handleSave} className="flex flex-col gap-6">
        
        {/* TAB 1: Stats */}
        {activeTab === 'stats' && (
          <div className="flex flex-col gap-6">
            <div className="bg-darkCard border border-white/5 rounded-xl p-6 flex flex-col gap-4">
              <h2 className="text-base font-bold text-white border-b border-white/5 pb-2">Hero Section Settings</h2>
              
              <div className="flex flex-col gap-2 mb-2">
                <label className="text-xs font-bold text-textSecondary uppercase">Hero Background Image</label>
                <div className="bg-[#0A1128] border border-white/10 rounded-lg p-3 flex items-center gap-4">
                  <div className="w-32 h-16 rounded overflow-hidden bg-white/5 border border-white/10 flex items-center justify-center flex-shrink-0">
                    {formData.heroBackgroundImage ? (
                      <img src={formData.heroBackgroundImage} alt="Hero Background Preview" className="w-full h-full object-cover" />
                    ) : (
                      <FaCamera className="text-white/20 text-lg" />
                    )}
                  </div>
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-2">
                      <label className="border border-white/20 text-white px-3 py-1.5 rounded-lg text-[10px] font-bold hover:bg-white/5 transition-all w-fit cursor-pointer flex items-center gap-1.5">
                        <FaCamera /> Change Background
                        <input 
                          type="file" 
                          className="hidden" 
                          accept="image/*" 
                          onChange={e => handleImageUpload(e, (url) => {
                            setFormData(prev => ({
                              ...prev,
                              heroBackgroundImage: url
                            }));
                          })} 
                        />
                      </label>
                      {formData.heroBackgroundImage && (
                        <button 
                          type="button"
                          onClick={() => setFormData(prev => ({ ...prev, heroBackgroundImage: '' }))}
                          className="bg-red-500/20 hover:bg-red-500/40 text-red-500 px-3 py-1.5 rounded-lg text-[10px] font-bold transition-all flex items-center gap-1.5"
                        >
                          <FaTrash />
                        </button>
                      )}
                    </div>
                    <p className="text-[10px] text-textSecondary">PNG, JPG or WEBP. Max size 2MB (1920x1080 recommended)</p>
                  </div>
                </div>
              </div>

              <h2 className="text-base font-bold text-white border-b border-white/5 pb-2 mt-4">Hero Text Content</h2>
              <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-bold text-textSecondary uppercase">Eyebrow Text</label>
                  <input 
                    type="text" 
                    value={formData.heroContent?.eyebrow || ''} 
                    onChange={e => handleTextChange('heroContent', 'eyebrow', e.target.value)}
                    placeholder="e.g. © Nurturing Minds, Building Futures"
                    className="bg-[#0A1128] border border-white/10 rounded-lg px-4 py-3 text-sm text-white focus:border-blue-600 outline-none transition-colors w-full"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-bold text-textSecondary uppercase">Main Heading (Use &lt;br/&gt; for new lines)</label>
                  <input 
                    type="text" 
                    value={formData.heroContent?.heading || ''} 
                    onChange={e => handleTextChange('heroContent', 'heading', e.target.value)}
                    placeholder="e.g. Welcome to <br/> Vivekananda <br/> High School"
                    className="bg-[#0A1128] border border-white/10 rounded-lg px-4 py-3 text-sm text-white focus:border-blue-600 outline-none transition-colors w-full"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-bold text-textSecondary uppercase">Subtitle</label>
                  <textarea 
                    rows="2"
                    value={formData.heroContent?.subtitle || ''} 
                    onChange={e => handleTextChange('heroContent', 'subtitle', e.target.value)}
                    placeholder="e.g. Empowering students with quality education..."
                    className="bg-[#0A1128] border border-white/10 rounded-lg px-4 py-3 text-sm text-white focus:border-blue-600 outline-none transition-colors w-full resize-none"
                  />
                </div>
              </div>

              <h2 className="text-base font-bold text-white border-b border-white/5 pb-2 mt-4">Hero Floating Stats</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-bold text-textSecondary uppercase">Students Count (e.g. 1500+)</label>
                  <input 
                    type="text" 
                    value={formData.heroStats?.studentsCount || ''} 
                    onChange={e => handleTextChange('heroStats', 'studentsCount', e.target.value)}
                    className="bg-[#0A1128] border border-white/10 rounded-lg px-4 py-3 text-sm text-white focus:border-blue-600 outline-none transition-colors w-full"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-bold text-textSecondary uppercase">Staff Count (e.g. 100+)</label>
                  <input 
                    type="text" 
                    value={formData.heroStats?.staffCount || ''} 
                    onChange={e => handleTextChange('heroStats', 'staffCount', e.target.value)}
                    className="bg-[#0A1128] border border-white/10 rounded-lg px-4 py-3 text-sm text-white focus:border-blue-600 outline-none transition-colors w-full"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-bold text-textSecondary uppercase">Years of Excellence (e.g. 25+)</label>
                  <input 
                    type="text" 
                    value={formData.heroStats?.yearsExcellence || ''} 
                    onChange={e => handleTextChange('heroStats', 'yearsExcellence', e.target.value)}
                    className="bg-[#0A1128] border border-white/10 rounded-lg px-4 py-3 text-sm text-white focus:border-blue-600 outline-none transition-colors w-full"
                  />
                </div>
              </div>
            </div>

            <div className="bg-darkCard border border-white/5 rounded-xl p-6 flex flex-col gap-4">
              <h2 className="text-base font-bold text-white border-b border-white/5 pb-2">Achievements Sizing Grid</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-bold text-textSecondary uppercase">Total Students</label>
                  <input 
                    type="text" 
                    value={formData.achievements?.students || ''} 
                    onChange={e => handleTextChange('achievements', 'students', e.target.value)}
                    className="bg-[#0A1128] border border-white/10 rounded-lg px-4 py-3 text-sm text-white focus:border-blue-600 outline-none transition-colors w-full"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-bold text-textSecondary uppercase">Total Teachers</label>
                  <input 
                    type="text" 
                    value={formData.achievements?.teachers || ''} 
                    onChange={e => handleTextChange('achievements', 'teachers', e.target.value)}
                    className="bg-[#0A1128] border border-white/10 rounded-lg px-4 py-3 text-sm text-white focus:border-blue-600 outline-none transition-colors w-full"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-bold text-textSecondary uppercase">Total Classrooms</label>
                  <input 
                    type="text" 
                    value={formData.achievements?.classrooms || ''} 
                    onChange={e => handleTextChange('achievements', 'classrooms', e.target.value)}
                    className="bg-[#0A1128] border border-white/10 rounded-lg px-4 py-3 text-sm text-white focus:border-blue-600 outline-none transition-colors w-full"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-bold text-textSecondary uppercase">Awards Won</label>
                  <input 
                    type="text" 
                    value={formData.achievements?.awards || ''} 
                    onChange={e => handleTextChange('achievements', 'awards', e.target.value)}
                    className="bg-[#0A1128] border border-white/10 rounded-lg px-4 py-3 text-sm text-white focus:border-blue-600 outline-none transition-colors w-full"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: Principal Message */}
        {activeTab === 'principal' && (
          <div className="bg-darkCard border border-white/5 rounded-xl p-6 flex flex-col gap-4">
            <h2 className="text-base font-bold text-white border-b border-white/5 pb-2">Principal Message settings</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold text-textSecondary uppercase">Principal Name</label>
                <input 
                  type="text" 
                  value={formData.principalMessage?.name || ''} 
                  onChange={e => handleTextChange('principalMessage', 'name', e.target.value)}
                  className="bg-[#0A1128] border border-white/10 rounded-lg px-4 py-3 text-sm text-white focus:border-blue-600 outline-none transition-colors w-full"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold text-textSecondary uppercase">Designation</label>
                <input 
                  type="text" 
                  value={formData.principalMessage?.designation || ''} 
                  onChange={e => handleTextChange('principalMessage', 'designation', e.target.value)}
                  className="bg-[#0A1128] border border-white/10 rounded-lg px-4 py-3 text-sm text-white focus:border-blue-600 outline-none transition-colors w-full"
                />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold text-textSecondary uppercase">Principal Greeting (Paragraph 1)</label>
              <textarea 
                rows="4"
                value={formData.principalMessage?.text1 || ''} 
                onChange={e => handleTextChange('principalMessage', 'text1', e.target.value)}
                className="bg-[#0A1128] border border-white/10 rounded-lg px-4 py-3 text-sm text-white focus:border-blue-600 outline-none transition-colors w-full resize-none"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold text-textSecondary uppercase">Closing Message (Paragraph 2)</label>
              <textarea 
                rows="3"
                value={formData.principalMessage?.text2 || ''} 
                onChange={e => handleTextChange('principalMessage', 'text2', e.target.value)}
                className="bg-[#0A1128] border border-white/10 rounded-lg px-4 py-3 text-sm text-white focus:border-blue-600 outline-none transition-colors w-full resize-none"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-end">
              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold text-textSecondary uppercase">Signature text (Italic signature)</label>
                <input 
                  type="text" 
                  value={formData.principalMessage?.signature || ''} 
                  onChange={e => handleTextChange('principalMessage', 'signature', e.target.value)}
                  className="bg-[#0A1128] border border-white/10 rounded-lg px-4 py-3 text-sm text-white focus:border-blue-600 outline-none transition-colors w-full"
                />
              </div>

              {/* Photo Upload */}
              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold text-textSecondary uppercase">Principal Photo</label>
                <div className="bg-[#0A1128] border border-white/10 rounded-lg p-3 flex items-center gap-4">
                  <div className="w-16 h-16 rounded overflow-hidden bg-white/5 border border-white/10 flex items-center justify-center flex-shrink-0">
                    {formData.principalMessage?.imageUrl ? (
                      <img src={formData.principalMessage.imageUrl} alt="Principal Preview" className="w-full h-full object-cover" />
                    ) : (
                      <FaCamera className="text-white/20 text-lg" />
                    )}
                  </div>
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-2">
                      <label className="border border-white/20 text-white px-3 py-1.5 rounded-lg text-[10px] font-bold hover:bg-white/5 transition-all w-fit cursor-pointer flex items-center gap-1.5">
                        <FaCamera /> Change Photo
                        <input 
                          type="file" 
                          className="hidden" 
                          accept="image/*" 
                          onChange={e => handleImageUpload(e, (url) => {
                            setFormData(prev => ({
                              ...prev,
                              principalMessage: { ...prev.principalMessage, imageUrl: url }
                            }));
                          })} 
                        />
                      </label>
                      {formData.principalMessage?.imageUrl && (
                        <button 
                          type="button"
                          onClick={() => setFormData(prev => ({ ...prev, principalMessage: { ...prev.principalMessage, imageUrl: '' } }))}
                          className="bg-red-500/20 hover:bg-red-500/40 text-red-500 px-3 py-1.5 rounded-lg text-[10px] font-bold transition-all flex items-center gap-1.5"
                        >
                          <FaTrash />
                        </button>
                      )}
                    </div>
                    <p className="text-[10px] text-textSecondary">PNG, JPG or WEBP. Max size 2MB</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: Highlights */}
        {activeTab === 'highlights' && (
          <div className="bg-darkCard border border-white/5 rounded-xl p-6 flex flex-col gap-4">
            <div className="flex justify-between items-center border-b border-white/5 pb-2">
              <h2 className="text-base font-bold text-white">Homepage Highlights ({formData.highlights?.length || 0})</h2>
              <button 
                type="button" 
                onClick={addHighlight}
                className="bg-green-600 hover:bg-green-700 text-white px-3 py-1.5 rounded text-xs font-bold flex items-center gap-1"
              >
                <FaPlus size={10} /> Add Card
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {formData.highlights?.map((highlight, index) => (
                <div key={index} className="bg-[#0A1128] border border-white/5 p-4 rounded-xl flex flex-col gap-3 relative group">
                  <button 
                    type="button" 
                    onClick={() => removeHighlight(index)}
                    className="absolute top-3 right-3 text-red-500 hover:bg-red-500/10 p-1.5 rounded-md transition-colors"
                  >
                    <FaTrash size={12} />
                  </button>

                  <div className="grid grid-cols-3 gap-2">
                    <div className="col-span-1 flex flex-col gap-1.5">
                      <label className="text-[10px] font-bold text-textSecondary uppercase">Icon</label>
                      <select 
                        value={highlight.icon}
                        onChange={e => handleHighlightChange(index, 'icon', e.target.value)}
                        className="bg-[#0A1128] border border-white/10 rounded-lg px-2 py-2 text-xs text-white outline-none w-full"
                      >
                        {iconOptions.map(opt => (
                          <option key={opt.value} value={opt.value}>{opt.label}</option>
                        ))}
                      </select>
                    </div>

                    <div className="col-span-2 flex flex-col gap-1.5">
                      <label className="text-[10px] font-bold text-textSecondary uppercase">Card Title</label>
                      <input 
                        type="text" 
                        value={highlight.title}
                        onChange={e => handleHighlightChange(index, 'title', e.target.value)}
                        className="bg-[#0A1128] border border-white/10 rounded-lg px-3 py-2 text-xs text-white outline-none w-full"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold text-textSecondary uppercase">Short Description</label>
                    <textarea 
                      rows="2"
                      value={highlight.description}
                      onChange={e => handleHighlightChange(index, 'description', e.target.value)}
                      className="bg-[#0A1128] border border-white/10 rounded-lg px-3 py-2 text-xs text-white outline-none w-full resize-none"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: Facilities Grid */}
        {activeTab === 'facilities' && (
          <div className="bg-darkCard border border-white/5 rounded-xl p-6 flex flex-col gap-4">
            <div className="flex justify-between items-center border-b border-white/5 pb-2">
              <h2 className="text-base font-bold text-white">Campus Facilities ({formData.facilities?.length || 0})</h2>
              <button 
                type="button" 
                onClick={addFacility}
                className="bg-green-600 hover:bg-green-700 text-white px-3 py-1.5 rounded text-xs font-bold flex items-center gap-1"
              >
                <FaPlus size={10} /> Add Facility
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {formData.facilities?.map((facility, index) => (
                <div key={index} className="bg-[#0A1128] border border-white/5 p-4 rounded-xl flex flex-col gap-3 relative">
                  <button 
                    type="button" 
                    onClick={() => removeFacility(index)}
                    className="absolute top-3 right-3 text-red-500 hover:bg-red-500/10 p-1.5 rounded-md transition-colors"
                  >
                    <FaTrash size={12} />
                  </button>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-3">
                      <div className="flex flex-col gap-1.5">
                        <label className="text-[10px] font-bold text-textSecondary uppercase">Title</label>
                        <input 
                          type="text" 
                          value={facility.title}
                          onChange={e => handleFacilityChange(index, 'title', e.target.value)}
                          className="bg-[#0A1128] border border-white/10 rounded-lg px-3 py-2 text-xs text-white outline-none w-full"
                        />
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <label className="text-[10px] font-bold text-textSecondary uppercase">Icon Link</label>
                        <select 
                          value={facility.icon}
                          onChange={e => handleFacilityChange(index, 'icon', e.target.value)}
                          className="bg-[#0A1128] border border-white/10 rounded-lg px-2 py-2 text-xs text-white outline-none w-full"
                        >
                          {iconOptions.map(opt => (
                            <option key={opt.value} value={opt.value}>{opt.label}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] font-bold text-textSecondary uppercase">Illustration Image</label>
                      <div className="bg-[#0A1128] border border-white/10 rounded-lg p-2 flex items-center gap-3 h-full">
                        <div className="w-14 h-14 rounded bg-white/5 border border-white/10 flex items-center justify-center overflow-hidden flex-shrink-0">
                          {facility.imageUrl ? (
                            <img src={facility.imageUrl} alt="Facility Preview" className="w-full h-full object-cover" />
                          ) : (
                            <FaImage className="text-white/20 text-lg" />
                          )}
                        </div>
                        <div className="flex flex-col gap-2">
                          <label className="border border-white/20 text-white px-2 py-1 rounded text-[9px] font-bold hover:bg-white/5 transition-all cursor-pointer flex items-center justify-center gap-1">
                            <FaCamera /> Select
                            <input 
                              type="file" 
                              className="hidden" 
                              accept="image/*" 
                              onChange={e => handleImageUpload(e, (url) => {
                                handleFacilityChange(index, 'imageUrl', url);
                              })}
                            />
                          </label>
                          {facility.imageUrl && (
                            <button 
                              type="button"
                              onClick={() => handleFacilityChange(index, 'imageUrl', '')}
                              className="bg-red-500/20 hover:bg-red-500/40 text-red-500 px-2 py-1 rounded text-[9px] font-bold transition-all flex items-center justify-center gap-1"
                            >
                              <FaTrash /> Remove
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 5: Testimonials */}
        {activeTab === 'testimonials' && (
          <div className="bg-darkCard border border-white/5 rounded-xl p-6 flex flex-col gap-4">
            <div className="flex justify-between items-center border-b border-white/5 pb-2">
              <h2 className="text-base font-bold text-white">Homepage Testimonials ({formData.testimonials?.length || 0})</h2>
              <button 
                type="button" 
                onClick={addTestimonial}
                className="bg-green-600 hover:bg-green-700 text-white px-3 py-1.5 rounded text-xs font-bold flex items-center gap-1"
              >
                <FaPlus size={10} /> Add Testimonial
              </button>
            </div>

            <div className="flex flex-col gap-4">
              {formData.testimonials?.map((test, index) => (
                <div key={index} className="bg-[#0A1128] border border-white/5 p-4 rounded-xl flex flex-col md:flex-row gap-4 relative">
                  <button 
                    type="button" 
                    onClick={() => removeTestimonial(index)}
                    className="absolute top-3 right-3 text-red-500 hover:bg-red-500/10 p-1.5 rounded-md transition-colors"
                  >
                    <FaTrash size={12} />
                  </button>

                  {/* Avatar upload */}
                  <div className="flex flex-col items-center justify-center p-2 border border-white/5 rounded-lg bg-[#080E24] w-full md:w-40 flex-shrink-0">
                    <div className="w-16 h-16 rounded-full overflow-hidden bg-white/5 border border-white/10 mb-3 flex items-center justify-center">
                      {test.imageUrl ? (
                        <img src={test.imageUrl} alt="Avatar" className="w-full h-full object-cover" />
                      ) : (
                        <FaQuoteLeft className="text-white/20 text-lg" />
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <label className="border border-white/20 text-white px-2 py-1 rounded text-[9px] font-bold hover:bg-white/5 transition-all cursor-pointer flex items-center justify-center gap-1">
                        <FaCamera /> Avatar
                        <input 
                          type="file" 
                          className="hidden" 
                          accept="image/*" 
                          onChange={e => handleImageUpload(e, (url) => {
                            handleTestimonialChange(index, 'imageUrl', url);
                          })}
                        />
                      </label>
                      {test.imageUrl && (
                        <button 
                          type="button"
                          onClick={() => handleTestimonialChange(index, 'imageUrl', '')}
                          className="bg-red-500/20 hover:bg-red-500/40 text-red-500 px-2 py-1 rounded text-[9px] font-bold transition-all flex items-center justify-center gap-1"
                        >
                          <FaTrash /> Remove
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="flex-grow flex flex-col gap-3">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="flex flex-col gap-1">
                        <label className="text-[10px] font-bold text-textSecondary uppercase">Author Name</label>
                        <input 
                          type="text" 
                          value={test.author}
                          onChange={e => handleTestimonialChange(index, 'author', e.target.value)}
                          className="bg-[#0A1128] border border-white/10 rounded-lg px-3 py-2 text-xs text-white outline-none"
                        />
                      </div>
                      <div className="flex flex-col gap-1">
                        <label className="text-[10px] font-bold text-textSecondary uppercase">Role (e.g. Parent, Alumni)</label>
                        <input 
                          type="text" 
                          value={test.role}
                          onChange={e => handleTestimonialChange(index, 'role', e.target.value)}
                          className="bg-[#0A1128] border border-white/10 rounded-lg px-3 py-2 text-xs text-white outline-none"
                        />
                      </div>
                    </div>

                    <div className="flex flex-col gap-1">
                      <label className="text-[10px] font-bold text-textSecondary uppercase">Quote / Feedback</label>
                      <textarea 
                        rows="3"
                        value={test.quote}
                        onChange={e => handleTestimonialChange(index, 'quote', e.target.value)}
                        className="bg-[#0A1128] border border-white/10 rounded-lg px-3 py-2 text-xs text-white outline-none resize-none"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 6: Dynamic Sections */}
        {activeTab === 'sections' && (
          <div className="bg-darkCard border border-white/5 rounded-xl p-6 flex flex-col gap-6">
            
            {/* News Section */}
            <div className="flex flex-col gap-4 border border-white/10 rounded-xl p-5 bg-[#0A1128]">
              <div className="flex justify-between items-center border-b border-white/5 pb-3">
                <h2 className="text-base font-bold text-white">Latest News Section</h2>
                <label className="flex items-center gap-2 cursor-pointer">
                  <span className="text-xs font-bold text-textSecondary uppercase">Show Section</span>
                  <div className="relative inline-block w-10 h-5">
                    <input 
                      type="checkbox" 
                      className="sr-only peer"
                      checked={formData.newsSection?.isActive !== false}
                      onChange={e => handleToggleChange('newsSection', e.target.checked)}
                    />
                    <div className="w-10 h-5 bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-green-500"></div>
                  </div>
                </label>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-bold text-textSecondary uppercase">Section Title</label>
                  <input 
                    type="text" 
                    value={formData.newsSection?.title || ''} 
                    onChange={e => handleTextChange('newsSection', 'title', e.target.value)}
                    className="bg-[#0A1128] border border-white/10 rounded-lg px-4 py-3 text-sm text-white focus:border-blue-600 outline-none w-full"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-bold text-textSecondary uppercase">Section Subtitle</label>
                  <input 
                    type="text" 
                    value={formData.newsSection?.subtitle || ''} 
                    onChange={e => handleTextChange('newsSection', 'subtitle', e.target.value)}
                    className="bg-[#0A1128] border border-white/10 rounded-lg px-4 py-3 text-sm text-white focus:border-blue-600 outline-none w-full"
                  />
                </div>
              </div>
            </div>

            {/* Events Section */}
            <div className="flex flex-col gap-4 border border-white/10 rounded-xl p-5 bg-[#0A1128]">
              <div className="flex justify-between items-center border-b border-white/5 pb-3">
                <h2 className="text-base font-bold text-white">Upcoming Events Section</h2>
                <label className="flex items-center gap-2 cursor-pointer">
                  <span className="text-xs font-bold text-textSecondary uppercase">Show Section</span>
                  <div className="relative inline-block w-10 h-5">
                    <input 
                      type="checkbox" 
                      className="sr-only peer"
                      checked={formData.eventsSection?.isActive !== false}
                      onChange={e => handleToggleChange('eventsSection', e.target.checked)}
                    />
                    <div className="w-10 h-5 bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-green-500"></div>
                  </div>
                </label>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-bold text-textSecondary uppercase">Section Title</label>
                  <input 
                    type="text" 
                    value={formData.eventsSection?.title || ''} 
                    onChange={e => handleTextChange('eventsSection', 'title', e.target.value)}
                    className="bg-[#0A1128] border border-white/10 rounded-lg px-4 py-3 text-sm text-white focus:border-blue-600 outline-none w-full"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-bold text-textSecondary uppercase">Section Subtitle</label>
                  <input 
                    type="text" 
                    value={formData.eventsSection?.subtitle || ''} 
                    onChange={e => handleTextChange('eventsSection', 'subtitle', e.target.value)}
                    className="bg-[#0A1128] border border-white/10 rounded-lg px-4 py-3 text-sm text-white focus:border-blue-600 outline-none w-full"
                  />
                </div>
              </div>
            </div>

            {/* Gallery Section */}
            <div className="flex flex-col gap-4 border border-white/10 rounded-xl p-5 bg-[#0A1128]">
              <div className="flex justify-between items-center border-b border-white/5 pb-3">
                <h2 className="text-base font-bold text-white">Gallery Preview Section</h2>
                <label className="flex items-center gap-2 cursor-pointer">
                  <span className="text-xs font-bold text-textSecondary uppercase">Show Section</span>
                  <div className="relative inline-block w-10 h-5">
                    <input 
                      type="checkbox" 
                      className="sr-only peer"
                      checked={formData.gallerySection?.isActive !== false}
                      onChange={e => handleToggleChange('gallerySection', e.target.checked)}
                    />
                    <div className="w-10 h-5 bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-green-500"></div>
                  </div>
                </label>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-bold text-textSecondary uppercase">Section Title</label>
                  <input 
                    type="text" 
                    value={formData.gallerySection?.title || ''} 
                    onChange={e => handleTextChange('gallerySection', 'title', e.target.value)}
                    className="bg-[#0A1128] border border-white/10 rounded-lg px-4 py-3 text-sm text-white focus:border-blue-600 outline-none w-full"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-bold text-textSecondary uppercase">Section Subtitle</label>
                  <input 
                    type="text" 
                    value={formData.gallerySection?.subtitle || ''} 
                    onChange={e => handleTextChange('gallerySection', 'subtitle', e.target.value)}
                    className="bg-[#0A1128] border border-white/10 rounded-lg px-4 py-3 text-sm text-white focus:border-blue-600 outline-none w-full"
                  />
                </div>
              </div>
            </div>

          </div>
        )}

        {/* TAB 7: Welcome Modal */}
        {activeTab === 'welcomeModal' && (
          <div className="bg-darkCard border border-white/5 rounded-xl p-6 flex flex-col gap-6">
            <div className="flex justify-between items-center border-b border-white/5 pb-3">
              <div>
                <h2 className="text-base font-bold text-white">Welcome Modal Settings</h2>
                <p className="text-xs text-textSecondary mt-1">Configure the popup that appears when visitors open the website.</p>
              </div>
              <label className="flex items-center gap-2 cursor-pointer">
                <span className="text-xs font-bold text-textSecondary uppercase">Enable Modal</span>
                <div className="relative inline-block w-10 h-5">
                  <input 
                    type="checkbox" 
                    className="sr-only peer"
                    checked={formData.welcomeModal?.isActive !== false}
                    onChange={e => handleToggleChange('welcomeModal', e.target.checked)}
                  />
                  <div className="w-10 h-5 bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-green-500"></div>
                </div>
              </label>
            </div>

            <div className="flex justify-between items-center">
              <h3 className="text-sm font-bold text-white">Announcements / Slides ({formData.welcomeModal?.announcements?.length || 0})</h3>
              <button 
                type="button" 
                onClick={addAnnouncement}
                className="bg-green-600 hover:bg-green-700 text-white px-3 py-1.5 rounded text-xs font-bold flex items-center gap-1"
              >
                <FaPlus size={10} /> Add Slide
              </button>
            </div>

            <div className="flex flex-col gap-4">
              {formData.welcomeModal?.announcements?.map((announce, index) => (
                <div key={index} className="bg-[#0A1128] border border-white/5 p-4 rounded-xl flex flex-col md:flex-row gap-4 relative">
                  <button 
                    type="button" 
                    onClick={() => removeAnnouncement(index)}
                    className="absolute top-3 right-3 text-red-500 hover:bg-red-500/10 p-1.5 rounded-md transition-colors"
                  >
                    <FaTrash size={12} />
                  </button>

                  <div className="flex flex-col items-center justify-center p-2 border border-white/5 rounded-lg bg-[#080E24] w-full md:w-48 flex-shrink-0">
                    <div className="w-32 h-20 rounded overflow-hidden bg-white/5 border border-white/10 mb-3 flex items-center justify-center">
                      {announce.imageUrl ? (
                        <img src={announce.imageUrl} alt="Slide Preview" className="w-full h-full object-cover" />
                      ) : (
                        <FaImage className="text-white/20 text-lg" />
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <label className="border border-white/20 text-white px-2 py-1 rounded text-[9px] font-bold hover:bg-white/5 transition-all cursor-pointer flex items-center justify-center gap-1">
                        <FaCamera /> Upload
                        <input 
                          type="file" 
                          className="hidden" 
                          accept="image/*" 
                          onChange={e => handleImageUpload(e, (url) => {
                            handleAnnouncementChange(index, 'imageUrl', url);
                          })}
                        />
                      </label>
                      {announce.imageUrl && (
                        <button 
                          type="button"
                          onClick={() => handleAnnouncementChange(index, 'imageUrl', '')}
                          className="bg-red-500/20 hover:bg-red-500/40 text-red-500 px-2 py-1 rounded text-[9px] font-bold transition-all flex items-center justify-center gap-1"
                        >
                          <FaTrash />
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="flex-grow flex flex-col gap-3">
                    <div className="flex flex-col gap-1">
                      <label className="text-[10px] font-bold text-textSecondary uppercase">Heading / Title</label>
                      <input 
                        type="text" 
                        value={announce.title}
                        onChange={e => handleAnnouncementChange(index, 'title', e.target.value)}
                        className="bg-[#0A1128] border border-white/10 rounded-lg px-3 py-2 text-xs text-white outline-none w-full"
                      />
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="text-[10px] font-bold text-textSecondary uppercase">Description</label>
                      <textarea 
                        rows="3"
                        value={announce.description}
                        onChange={e => handleAnnouncementChange(index, 'description', e.target.value)}
                        className="bg-[#0A1128] border border-white/10 rounded-lg px-3 py-2 text-xs text-white outline-none resize-none w-full"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Global Save Button */}
        <button 
          type="submit" 
          disabled={saving || uploading}
          className="bg-blue-600 hover:bg-blue-700 text-white py-2.5 px-8 rounded-lg text-sm font-bold transition-all w-fit mx-auto flex items-center justify-center gap-2 mt-2 shadow-lg shadow-blue-500/10 cursor-pointer disabled:opacity-50"
        >
          {saving ? (
            <>
              <FaSpinner className="animate-spin" /> Saving Homepage Configuration...
            </>
          ) : uploading ? (
            <>
              <FaSpinner className="animate-spin" /> Asset Uploading in Progress...
            </>
          ) : (
            <>
              <FaSave /> Save Changes & Publish
            </>
          )}
        </button>

      </form>
    </div>
  );
};

export default ManageHome;
