import React, { useState, useEffect } from 'react';
import { 
  FaInfoCircle, FaRegCalendarAlt, FaStar, FaEye, FaBullseye, 
  FaUserTie, FaBuilding, FaPlus, FaTrash, FaSave, FaCamera, 
  FaSpinner, FaImage, FaEdit, FaShieldAlt, FaLightbulb, FaBriefcase, FaGraduationCap
} from 'react-icons/fa';
import api from '../../services/api';

const valueIconOptions = [
  { value: 'FaShieldAlt', label: 'Shield (Integrity)' },
  { value: 'FaStar', label: 'Star (Excellence)' },
  { value: 'FaUserTie', label: 'User Tie (Discipline)' },
  { value: 'FaLightbulb', label: 'Lightbulb (Innovation)' },
  { value: 'FaGraduationCap', label: 'Graduation Cap' },
  { value: 'FaBuilding', label: 'School Building' },
  { value: 'FaRegCalendarAlt', label: 'Calendar' }
];

const ManageAbout = () => {
  const [activeTab, setActiveTab] = useState('hero-mission');
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  
  const [formData, setFormData] = useState({
    hero: { title: '', description: '', backgroundImage: '' },
    history: { title: '', description: '', timeline: [] },
    visionMission: { vision: '', mission: '' },
    values: [],
    management: [],
    principalMessage: { name: '', designation: '', text: '', signature: '', imageUrl: '' },
    infrastructure: []
  });

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/about-settings');
      setFormData(data);
    } catch (err) {
      console.error('Failed to load about settings:', err);
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

  const handleImageUpload = async (e, callback) => {
    const file = e.target.files[0];
    if (!file) return;

    const uploadData = new FormData();
    uploadData.append('image', file);
    
    setUploading(true);
    try {
      const { data } = await api.post('/about-settings/upload-image', uploadData, {
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
      const { data } = await api.put('/about-settings', formData);
      setFormData(data);
      alert('About page settings updated successfully!');
    } catch (err) {
      console.error(err);
      alert('Failed to save settings: ' + (err.response?.data?.message || err.message));
    } finally {
      setSaving(false);
    }
  };

  // Timeline handlers
  const handleTimelineChange = (index, field, value) => {
    const newTimeline = [...formData.history.timeline];
    newTimeline[index][field] = value;
    setFormData(prev => ({
      ...prev,
      history: {
        ...prev.history,
        timeline: newTimeline
      }
    }));
  };

  const addTimelineItem = () => {
    setFormData(prev => ({
      ...prev,
      history: {
        ...prev.history,
        timeline: [...prev.history.timeline, { year: '', title: '', description: '' }]
      }
    }));
  };

  const removeTimelineItem = (index) => {
    const newTimeline = formData.history.timeline.filter((_, i) => i !== index);
    setFormData(prev => ({
      ...prev,
      history: {
        ...prev.history,
        timeline: newTimeline
      }
    }));
  };

  // Values handlers
  const handleValueChange = (index, field, value) => {
    const newValues = [...formData.values];
    newValues[index][field] = value;
    setFormData({ ...formData, values: newValues });
  };

  const addValue = () => {
    if (formData.values.length >= 4) {
      alert('Maximum 4 core values allowed.');
      return;
    }
    setFormData({
      ...formData,
      values: [...formData.values, { icon: 'FaShieldAlt', title: 'New Core Value', description: '' }]
    });
  };

  const removeValue = (index) => {
    const newValues = formData.values.filter((_, i) => i !== index);
    setFormData({ ...formData, values: newValues });
  };

  // Management Team handlers
  const handleManagementChange = (index, field, value) => {
    const newManagement = [...formData.management];
    newManagement[index][field] = value;
    setFormData({ ...formData, management: newManagement });
  };

  const addManagementMember = () => {
    setFormData({
      ...formData,
      management: [...formData.management, { name: '', designation: '', imageUrl: '' }]
    });
  };

  const removeManagementMember = (index) => {
    const newManagement = formData.management.filter((_, i) => i !== index);
    setFormData({ ...formData, management: newManagement });
  };

  // Infrastructure handlers
  const handleInfrastructureChange = (index, field, value) => {
    const newInfrastructure = [...formData.infrastructure];
    newInfrastructure[index][field] = value;
    setFormData({ ...formData, infrastructure: newInfrastructure });
  };

  const addInfrastructureItem = () => {
    setFormData({
      ...formData,
      infrastructure: [...formData.infrastructure, { title: '', imageUrl: '' }]
    });
  };

  const removeInfrastructureItem = (index) => {
    const newInfrastructure = formData.infrastructure.filter((_, i) => i !== index);
    setFormData({ ...formData, infrastructure: newInfrastructure });
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-40 text-textSecondary gap-2">
        <FaSpinner className="animate-spin text-3xl text-blue-500" />
        <p className="text-sm">Loading about settings dashboard...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 w-full pb-10 text-white">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white mb-1">Manage About Page</h1>
        <p className="text-xs text-textSecondary font-medium">Home / About Page Configuration</p>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-white/5 gap-2 pb-px overflow-x-auto">
        <button 
          type="button"
          onClick={() => setActiveTab('hero-mission')}
          className={`px-4 py-2 text-xs font-bold transition-all border-b-2 whitespace-nowrap ${
            activeTab === 'hero-mission' ? 'border-accentGold text-accentGold' : 'border-transparent text-textSecondary hover:text-white'
          }`}
        >
          Hero & Vision/Mission
        </button>
        <button 
          type="button"
          onClick={() => setActiveTab('history')}
          className={`px-4 py-2 text-xs font-bold transition-all border-b-2 whitespace-nowrap ${
            activeTab === 'history' ? 'border-accentGold text-accentGold' : 'border-transparent text-textSecondary hover:text-white'
          }`}
        >
          Journey & Timeline
        </button>
        <button 
          type="button"
          onClick={() => setActiveTab('values')}
          className={`px-4 py-2 text-xs font-bold transition-all border-b-2 whitespace-nowrap ${
            activeTab === 'values' ? 'border-accentGold text-accentGold' : 'border-transparent text-textSecondary hover:text-white'
          }`}
        >
          Core Values
        </button>
        <button 
          type="button"
          onClick={() => setActiveTab('management')}
          className={`px-4 py-2 text-xs font-bold transition-all border-b-2 whitespace-nowrap ${
            activeTab === 'management' ? 'border-accentGold text-accentGold' : 'border-transparent text-textSecondary hover:text-white'
          }`}
        >
          Management Team
        </button>
        <button 
          type="button"
          onClick={() => setActiveTab('principal')}
          className={`px-4 py-2 text-xs font-bold transition-all border-b-2 whitespace-nowrap ${
            activeTab === 'principal' ? 'border-accentGold text-accentGold' : 'border-transparent text-textSecondary hover:text-white'
          }`}
        >
          Principal Message
        </button>
        <button 
          type="button"
          onClick={() => setActiveTab('infrastructure')}
          className={`px-4 py-2 text-xs font-bold transition-all border-b-2 whitespace-nowrap ${
            activeTab === 'infrastructure' ? 'border-accentGold text-accentGold' : 'border-transparent text-textSecondary hover:text-white'
          }`}
        >
          Infrastructure Gallery
        </button>
      </div>

      <form onSubmit={handleSave} className="flex flex-col gap-6">
        
        {/* TAB 1: Hero & Vision/Mission */}
        {activeTab === 'hero-mission' && (
          <div className="flex flex-col gap-6">
            <div className="bg-darkCard border border-white/5 rounded-xl p-6 flex flex-col gap-4">
              <h2 className="text-base font-bold text-white border-b border-white/5 pb-2">Hero Section Headers</h2>
              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold text-textSecondary uppercase">Hero Section Title</label>
                <input 
                  type="text" 
                  value={formData.hero?.title || ''} 
                  onChange={e => handleTextChange('hero', 'title', e.target.value)}
                  className="bg-[#0A1128] border border-white/10 rounded-lg px-4 py-3 text-sm text-white focus:border-blue-600 outline-none transition-colors w-full"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold text-textSecondary uppercase">Hero Description Text</label>
                <textarea 
                  rows="3"
                  value={formData.hero?.description || ''} 
                  onChange={e => handleTextChange('hero', 'description', e.target.value)}
                  className="bg-[#0A1128] border border-white/10 rounded-lg px-4 py-3 text-sm text-white focus:border-blue-600 outline-none transition-colors w-full resize-none"
                />
              </div>

              <div className="flex flex-col gap-2 mt-2">
                <label className="text-xs font-bold text-textSecondary uppercase">Hero Background Image</label>
                <div className="bg-[#0A1128] border border-white/10 rounded-lg p-3 flex items-center gap-4">
                  <div className="w-32 h-16 rounded overflow-hidden bg-white/5 border border-white/10 flex items-center justify-center flex-shrink-0">
                    {formData.hero?.backgroundImage ? (
                      <img src={formData.hero.backgroundImage} alt="Hero Background Preview" className="w-full h-full object-cover" />
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
                              hero: { ...prev.hero, backgroundImage: url }
                            }));
                          })} 
                        />
                      </label>
                      {formData.hero?.backgroundImage && (
                        <button 
                          type="button"
                          onClick={() => setFormData(prev => ({ ...prev, hero: { ...prev.hero, backgroundImage: '' } }))}
                          className="bg-red-500/20 hover:bg-red-500/40 text-red-500 px-3 py-1.5 rounded-lg text-[10px] font-bold transition-all flex items-center gap-1.5"
                        >
                          <FaTrash /> Remove
                        </button>
                      )}
                    </div>
                    <p className="text-[10px] text-textSecondary">PNG, JPG or WEBP. Max size 2MB (1920x1080 recommended)</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-darkCard border border-white/5 rounded-xl p-6 flex flex-col gap-4">
              <h2 className="text-base font-bold text-white border-b border-white/5 pb-2">Vision & Mission Statements</h2>
              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold text-textSecondary uppercase">Our Vision Statement</label>
                <textarea 
                  rows="3"
                  value={formData.visionMission?.vision || ''} 
                  onChange={e => handleTextChange('visionMission', 'vision', e.target.value)}
                  className="bg-[#0A1128] border border-white/10 rounded-lg px-4 py-3 text-sm text-white focus:border-blue-600 outline-none transition-colors w-full resize-none"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold text-textSecondary uppercase">Our Mission Statement</label>
                <textarea 
                  rows="3"
                  value={formData.visionMission?.mission || ''} 
                  onChange={e => handleTextChange('visionMission', 'mission', e.target.value)}
                  className="bg-[#0A1128] border border-white/10 rounded-lg px-4 py-3 text-sm text-white focus:border-blue-600 outline-none transition-colors w-full resize-none"
                />
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: Journey & Timeline */}
        {activeTab === 'history' && (
          <div className="bg-darkCard border border-white/5 rounded-xl p-6 flex flex-col gap-4">
            <div className="flex justify-between items-center border-b border-white/5 pb-2">
              <h2 className="text-base font-bold text-white">Journey History & Timeline Items</h2>
              <button 
                type="button" 
                onClick={addTimelineItem}
                className="bg-green-600 hover:bg-green-700 text-white px-3 py-1.5 rounded text-xs font-bold flex items-center gap-1"
              >
                <FaPlus size={10} /> Add Timeline Item
              </button>
            </div>

            <div className="grid grid-cols-1 gap-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-[#0A1128] p-4 rounded-xl border border-white/5">
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-bold text-textSecondary uppercase">Journey Section Title</label>
                  <input 
                    type="text" 
                    value={formData.history?.title || ''} 
                    onChange={e => handleTextChange('history', 'title', e.target.value)}
                    className="bg-[#0A1128] border border-white/10 rounded-lg px-4 py-3 text-sm text-white focus:border-blue-600 outline-none transition-colors w-full"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-bold text-textSecondary uppercase">Journey Section Description</label>
                  <textarea 
                    rows="2"
                    value={formData.history?.description || ''} 
                    onChange={e => handleTextChange('history', 'description', e.target.value)}
                    className="bg-[#0A1128] border border-white/10 rounded-lg px-4 py-3 text-sm text-white focus:border-blue-600 outline-none transition-colors w-full resize-none"
                  />
                </div>
              </div>

              {formData.history?.timeline?.map((item, index) => (
                <div key={index} className="bg-[#0A1128] border border-white/5 p-4 rounded-xl flex flex-col gap-3 relative">
                  <button 
                    type="button" 
                    onClick={() => removeTimelineItem(index)}
                    className="absolute top-3 right-3 text-red-500 hover:bg-red-500/10 p-1.5 rounded-md transition-colors"
                  >
                    <FaTrash size={12} />
                  </button>

                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="flex flex-col gap-1.5 col-span-1">
                      <label className="text-[10px] font-bold text-textSecondary uppercase">Year (e.g. 1998)</label>
                      <input 
                        type="text" 
                        value={item.year}
                        onChange={e => handleTimelineChange(index, 'year', e.target.value)}
                        className="bg-[#0A1128] border border-white/10 rounded-lg px-3 py-2 text-xs text-white outline-none w-full"
                      />
                    </div>
                    <div className="flex flex-col gap-1.5 col-span-1 md:col-span-3">
                      <label className="text-[10px] font-bold text-textSecondary uppercase">Timeline Title (e.g. Established)</label>
                      <input 
                        type="text" 
                        value={item.title}
                        onChange={e => handleTimelineChange(index, 'title', e.target.value)}
                        className="bg-[#0A1128] border border-white/10 rounded-lg px-3 py-2 text-xs text-white outline-none w-full"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold text-textSecondary uppercase">Short Description</label>
                    <textarea 
                      rows="2"
                      value={item.description}
                      onChange={e => handleTimelineChange(index, 'description', e.target.value)}
                      className="bg-[#0A1128] border border-white/10 rounded-lg px-3 py-2 text-xs text-white outline-none w-full resize-none"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: Core Values */}
        {activeTab === 'values' && (
          <div className="bg-darkCard border border-white/5 rounded-xl p-6 flex flex-col gap-4">
            <div className="flex justify-between items-center border-b border-white/5 pb-2">
              <h2 className="text-base font-bold text-white">Core Values ({formData.values?.length || 0})</h2>
              <button 
                type="button" 
                onClick={addValue}
                className="bg-green-600 hover:bg-green-700 text-white px-3 py-1.5 rounded text-xs font-bold flex items-center gap-1"
              >
                <FaPlus size={10} /> Add Value
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {formData.values?.map((val, index) => (
                <div key={index} className="bg-[#0A1128] border border-white/5 p-4 rounded-xl flex flex-col gap-3 relative">
                  <button 
                    type="button" 
                    onClick={() => removeValue(index)}
                    className="absolute top-3 right-3 text-red-500 hover:bg-red-500/10 p-1.5 rounded-md transition-colors"
                  >
                    <FaTrash size={12} />
                  </button>

                  <div className="grid grid-cols-3 gap-2">
                    <div className="col-span-1 flex flex-col gap-1.5">
                      <label className="text-[10px] font-bold text-textSecondary uppercase">Icon</label>
                      <select 
                        value={val.icon}
                        onChange={e => handleValueChange(index, 'icon', e.target.value)}
                        className="bg-[#0A1128] border border-white/10 rounded-lg px-2 py-2 text-xs text-white outline-none w-full cursor-pointer"
                      >
                        {valueIconOptions.map(opt => (
                          <option key={opt.value} value={opt.value}>{opt.label}</option>
                        ))}
                      </select>
                    </div>

                    <div className="col-span-2 flex flex-col gap-1.5">
                      <label className="text-[10px] font-bold text-textSecondary uppercase">Value Title</label>
                      <input 
                        type="text" 
                        value={val.title}
                        onChange={e => handleValueChange(index, 'title', e.target.value)}
                        className="bg-[#0A1128] border border-white/10 rounded-lg px-3 py-2 text-xs text-white outline-none w-full"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold text-textSecondary uppercase">Description</label>
                    <textarea 
                      rows="2"
                      value={val.description}
                      onChange={e => handleValueChange(index, 'description', e.target.value)}
                      className="bg-[#0A1128] border border-white/10 rounded-lg px-3 py-2 text-xs text-white outline-none w-full resize-none"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: Management Team */}
        {activeTab === 'management' && (
          <div className="bg-darkCard border border-white/5 rounded-xl p-6 flex flex-col gap-4">
            <div className="flex justify-between items-center border-b border-white/5 pb-2">
              <h2 className="text-base font-bold text-white">Management Members ({formData.management?.length || 0})</h2>
              <button 
                type="button" 
                onClick={addManagementMember}
                className="bg-green-600 hover:bg-green-700 text-white px-3 py-1.5 rounded text-xs font-bold flex items-center gap-1"
              >
                <FaPlus size={10} /> Add Member
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {formData.management?.map((member, index) => (
                <div key={index} className="bg-[#0A1128] border border-white/5 p-4 rounded-xl flex flex-col sm:flex-row gap-4 relative">
                  <button 
                    type="button" 
                    onClick={() => removeManagementMember(index)}
                    className="absolute top-3 right-3 text-red-500 hover:bg-red-500/10 p-1.5 rounded-md transition-colors"
                  >
                    <FaTrash size={12} />
                  </button>

                  {/* Picture upload */}
                  <div className="flex flex-col items-center justify-center p-2 border border-white/5 rounded-lg bg-[#080E24] w-full sm:w-36 flex-shrink-0">
                    <div className="w-16 h-20 overflow-hidden bg-white/5 border border-white/10 mb-2.5 flex items-center justify-center">
                      {member.imageUrl ? (
                        <img src={member.imageUrl} alt="Avatar" className="w-full h-full object-cover" />
                      ) : (
                        <FaImage className="text-white/20 text-lg" />
                      )}
                    </div>
                    <div className="flex flex-col gap-2">
                      <label className="border border-white/20 text-white px-2 py-1 rounded text-[9px] font-bold hover:bg-white/5 transition-all cursor-pointer flex items-center justify-center gap-1">
                        <FaCamera /> Photo
                        <input 
                          type="file" 
                          className="hidden" 
                          accept="image/*" 
                          onChange={e => handleImageUpload(e, (url) => {
                            handleManagementChange(index, 'imageUrl', url);
                          })}
                        />
                      </label>
                      {member.imageUrl && (
                        <button 
                          type="button"
                          onClick={() => handleManagementChange(index, 'imageUrl', '')}
                          className="bg-red-500/20 hover:bg-red-500/40 text-red-500 px-2 py-1 rounded text-[9px] font-bold transition-all flex items-center justify-center gap-1"
                        >
                          <FaTrash /> Remove
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="flex-grow flex flex-col gap-2">
                    <div className="flex flex-col gap-1">
                      <label className="text-[10px] font-bold text-textSecondary uppercase">Member Name</label>
                      <input 
                        type="text" 
                        value={member.name}
                        onChange={e => handleManagementChange(index, 'name', e.target.value)}
                        className="bg-[#0A1128] border border-white/10 rounded-lg px-3 py-2 text-xs text-white outline-none w-full"
                      />
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="text-[10px] font-bold text-textSecondary uppercase">Designation (e.g. Chairman)</label>
                      <input 
                        type="text" 
                        value={member.designation}
                        onChange={e => handleManagementChange(index, 'designation', e.target.value)}
                        className="bg-[#0A1128] border border-white/10 rounded-lg px-3 py-2 text-xs text-white outline-none w-full"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 5: Principal Message */}
        {activeTab === 'principal' && (
          <div className="bg-darkCard border border-white/5 rounded-xl p-6 flex flex-col gap-4">
            <h2 className="text-base font-bold text-white border-b border-white/5 pb-2">Principal Message Section</h2>
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
              <label className="text-xs font-bold text-textSecondary uppercase">Message Body Text</label>
              <textarea 
                rows="6"
                value={formData.principalMessage?.text || ''} 
                onChange={e => handleTextChange('principalMessage', 'text', e.target.value)}
                className="bg-[#0A1128] border border-white/10 rounded-lg px-4 py-3 text-sm text-white focus:border-blue-600 outline-none transition-colors w-full resize-none"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-end">
              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold text-textSecondary uppercase">Signature Text</label>
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
                          <FaTrash /> Remove
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

        {/* TAB 6: Infrastructure Gallery */}
        {activeTab === 'infrastructure' && (
          <div className="bg-darkCard border border-white/5 rounded-xl p-6 flex flex-col gap-4">
            <div className="flex justify-between items-center border-b border-white/5 pb-2">
              <h2 className="text-base font-bold text-white">Campus Infrastructure ({formData.infrastructure?.length || 0})</h2>
              <button 
                type="button" 
                onClick={addInfrastructureItem}
                className="bg-green-600 hover:bg-green-700 text-white px-3 py-1.5 rounded text-xs font-bold flex items-center gap-1"
              >
                <FaPlus size={10} /> Add Item
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {formData.infrastructure?.map((item, index) => (
                <div key={index} className="bg-[#0A1128] border border-white/5 p-4 rounded-xl flex flex-col gap-3 relative">
                  <button 
                    type="button" 
                    onClick={() => removeInfrastructureItem(index)}
                    className="absolute top-3 right-3 text-red-500 hover:bg-red-500/10 p-1.5 rounded-md transition-colors"
                  >
                    <FaTrash size={12} />
                  </button>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1.5 justify-center">
                      <label className="text-[10px] font-bold text-textSecondary uppercase">Infrastructure Title</label>
                      <input 
                        type="text" 
                        value={item.title}
                        onChange={e => handleInfrastructureChange(index, 'title', e.target.value)}
                        className="bg-[#0A1128] border border-white/10 rounded-lg px-3 py-2 text-xs text-white outline-none w-full"
                        placeholder="e.g. Smart Classrooms"
                      />
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] font-bold text-textSecondary uppercase">Infrastructure Photo</label>
                      <div className="bg-[#0A1128] border border-white/10 rounded-lg p-2 flex items-center gap-3 h-full">
                        <div className="w-14 h-14 rounded bg-white/5 border border-white/10 flex items-center justify-center overflow-hidden flex-shrink-0">
                          {item.imageUrl ? (
                            <img src={item.imageUrl} alt="Infrastructure Preview" className="w-full h-full object-cover" />
                          ) : (
                            <FaImage className="text-white/20 text-lg" />
                          )}
                        </div>
                        <div className="flex flex-col gap-2">
                          <label className="border border-white/20 text-white px-2 py-1 rounded text-[9px] font-bold hover:bg-white/5 transition-all cursor-pointer flex items-center justify-center gap-1">
                            <FaCamera /> Photo
                            <input 
                              type="file" 
                              className="hidden" 
                              accept="image/*" 
                              onChange={e => handleImageUpload(e, (url) => {
                                handleInfrastructureChange(index, 'imageUrl', url);
                              })}
                            />
                          </label>
                          {item.imageUrl && (
                            <button 
                              type="button"
                              onClick={() => handleInfrastructureChange(index, 'imageUrl', '')}
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

        {/* Global Save Button */}
        <button 
          type="submit" 
          disabled={saving || uploading}
          className="bg-blue-600 hover:bg-blue-700 text-white py-2.5 px-8 rounded-lg text-sm font-bold transition-all w-fit mx-auto flex items-center justify-center gap-2 mt-2 shadow-lg shadow-blue-500/10 cursor-pointer disabled:opacity-50"
        >
          {saving ? (
            <>
              <FaSpinner className="animate-spin" /> Saving About Configuration...
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

export default ManageAbout;
