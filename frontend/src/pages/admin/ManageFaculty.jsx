import React, { useState, useEffect } from 'react';
import { FaUser, FaUsers, FaEnvelope, FaTrash, FaPlus, FaCamera, FaSpinner, FaBriefcase, FaGraduationCap, FaEdit } from 'react-icons/fa';
import api from '../../services/api';

const ManageFaculty = () => {
  const [faculty, setFaculty] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    designation: '',
    department: '',
    qualifications: '',
    experience: '',
    email: '',
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [facultySettings, setFacultySettings] = useState({ hero: { backgroundImage: '', sideImage: '' } });
  const [settingsLoading, setSettingsLoading] = useState(false);
  const [bgUploading, setBgUploading] = useState(false);
  const [sideUploading, setSideUploading] = useState(false);

  useEffect(() => {
    fetchFaculty();
    fetchFacultySettings();
  }, []);

  const fetchFacultySettings = async () => {
    setSettingsLoading(true);
    try {
      const { data } = await api.get('/faculty-settings');
      setFacultySettings(data);
    } catch (error) {
      console.error('Failed to load faculty settings:', error);
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
      const { data } = await api.post('/faculty-settings/upload-image', uploadData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      const newSettings = { 
        ...facultySettings, 
        hero: { 
          ...facultySettings.hero, 
          [imageType]: data.imageUrl 
        } 
      };
      setFacultySettings(newSettings);
      
      // Save settings
      await api.put('/faculty-settings', newSettings);
      alert(`${imageType === 'backgroundImage' ? 'Background' : 'Side'} image updated successfully!`);
    } catch (err) {
      console.error(err);
      alert('Failed to upload image.');
    } finally {
      if (imageType === 'backgroundImage') setBgUploading(false);
      if (imageType === 'sideImage') setSideUploading(false);
    }
  };

  const fetchFaculty = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/faculty');
      setFaculty(data);
    } catch (error) {
      console.error('Failed to load faculty:', error);
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
      const data = new FormData();
      data.append('name', formData.name);
      data.append('designation', formData.designation);
      data.append('department', formData.department);
      data.append('qualifications', formData.qualifications);
      data.append('experience', formData.experience);
      data.append('email', formData.email);
      if (imageFile) {
        data.append('image', imageFile);
      }

      if (editingId) {
        await api.put(`/faculty/${editingId}`, data, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        alert('Faculty member updated successfully!');
      } else {
        await api.post('/faculty', data, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        alert('Faculty member added successfully!');
      }

      setFormData({ name: '', designation: '', department: '', qualifications: '', experience: '', email: '' });
      setImageFile(null);
      setImagePreview('');
      setEditingId(null);
      fetchFaculty();
    } catch (error) {
      console.error(error);
      alert('Failed to save faculty member: ' + (error.response?.data?.message || error.message));
    } finally {
      setSubmitting(false);
    }
  };

  const handleEditClick = (f) => {
    setEditingId(f._id);
    setFormData({
      name: f.name || '',
      designation: f.designation || '',
      department: f.department || '',
      qualifications: f.qualifications ? f.qualifications.join(', ') : '',
      experience: f.experience || '',
      email: f.email || '',
    });
    setImagePreview(f.imageUrl || '');
    setImageFile(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setFormData({ name: '', designation: '', department: '', qualifications: '', experience: '', email: '' });
    setImageFile(null);
    setImagePreview('');
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this faculty member? This action cannot be undone.')) {
      try {
        await api.delete(`/faculty/${id}`);
        setFaculty(faculty.filter(f => f._id !== id));
        if (editingId === id) {
          handleCancelEdit();
        }
      } catch (error) {
        console.error(error);
        alert('Failed to delete faculty member.');
      }
    }
  };

  return (
    <div className="flex flex-col gap-6 w-full pb-10 text-white">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white mb-1">Manage Faculty</h1>
        <p className="text-xs text-textSecondary font-medium">Home / Faculty / Roster</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Page Settings (Full Width or Left Column) */}
        <div className="lg:col-span-12 bg-darkCard border border-white/5 rounded-xl p-6 flex flex-col gap-4">
          <div className="flex items-center gap-3 border-b border-white/5 pb-3">
            <h2 className="text-base font-bold">Faculty Page Settings</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-2">
            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold text-textSecondary uppercase">Hero Background Image</label>
              <div className="bg-[#0A1128] border border-white/10 rounded-lg p-3 flex items-center gap-4">
                <div className="w-24 h-16 rounded overflow-hidden bg-white/5 border border-white/10 flex items-center justify-center flex-shrink-0">
                  {facultySettings.hero?.backgroundImage ? (
                    <img src={facultySettings.hero.backgroundImage} alt="Hero Background Preview" className="w-full h-full object-cover" />
                  ) : (
                    <FaCamera className="text-white/20 text-lg" />
                  )}
                </div>
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-2">
                    <label className="border border-white/20 text-white px-3 py-1.5 rounded-lg text-[10px] font-bold hover:bg-white/5 transition-all w-fit cursor-pointer flex items-center gap-1.5">
                      {bgUploading ? <FaSpinner className="animate-spin" /> : <FaCamera />} 
                      {bgUploading ? 'Uploading...' : 'Change Background'}
                      <input 
                        type="file" 
                        className="hidden" 
                        accept="image/*" 
                        onChange={(e) => handleHeroImageUpload(e, 'backgroundImage')} 
                        disabled={bgUploading}
                      />
                    </label>
                    {facultySettings.hero?.backgroundImage && (
                      <button 
                        type="button"
                        onClick={async () => {
                          const newSettings = { ...facultySettings, hero: { ...facultySettings.hero, backgroundImage: '' } };
                          setFacultySettings(newSettings);
                          await api.put('/faculty-settings', newSettings);
                        }}
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

            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold text-textSecondary uppercase">Hero Side Image</label>
              <div className="bg-[#0A1128] border border-white/10 rounded-lg p-3 flex items-center gap-4">
                <div className="w-16 h-16 rounded overflow-hidden bg-white/5 border border-white/10 flex items-center justify-center flex-shrink-0">
                  {facultySettings.hero?.sideImage ? (
                    <img src={facultySettings.hero.sideImage} alt="Hero Side Preview" className="w-full h-full object-cover" />
                  ) : (
                    <FaCamera className="text-white/20 text-lg" />
                  )}
                </div>
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-2">
                    <label className="border border-white/20 text-white px-3 py-1.5 rounded-lg text-[10px] font-bold hover:bg-white/5 transition-all w-fit cursor-pointer flex items-center gap-1.5">
                      {sideUploading ? <FaSpinner className="animate-spin" /> : <FaCamera />} 
                      {sideUploading ? 'Uploading...' : 'Change Side Image'}
                      <input 
                        type="file" 
                        className="hidden" 
                        accept="image/*" 
                        onChange={(e) => handleHeroImageUpload(e, 'sideImage')} 
                        disabled={sideUploading}
                      />
                    </label>
                    {facultySettings.hero?.sideImage && (
                      <button 
                        type="button"
                        onClick={async () => {
                          const newSettings = { ...facultySettings, hero: { ...facultySettings.hero, sideImage: '' } };
                          setFacultySettings(newSettings);
                          await api.put('/faculty-settings', newSettings);
                        }}
                        className="bg-red-500/20 hover:bg-red-500/40 text-red-500 px-3 py-1.5 rounded-lg text-[10px] font-bold transition-all flex items-center gap-1.5"
                      >
                        <FaTrash /> Remove
                      </button>
                    )}
                  </div>
                  <p className="text-[10px] text-textSecondary">PNG, JPG or WEBP. Transparent background recommended.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Creator Form */}
        <div className="lg:col-span-5 bg-darkCard border border-white/5 rounded-xl p-6 h-fit flex flex-col gap-4">
          <div className="flex items-center gap-3 border-b border-white/5 pb-3">
            <div className={`p-2 rounded border ${
              editingId 
                ? 'bg-blue-500 text-white border-blue-600 dark:bg-blue-950 dark:text-blue-400 dark:border-blue-600/10' 
                : 'bg-green-500 text-white border-green-600 dark:bg-green-950 dark:text-green-500 dark:border-green-500/10'
            }`}>
              {editingId ? <FaEdit size={14} /> : <FaPlus size={14} />}
            </div>
            <h2 className="text-base font-bold">{editingId ? 'Edit Faculty Profile' : 'Add New Faculty'}</h2>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold text-textSecondary uppercase">Faculty Name <span className="text-red-500">*</span></label>
              <div className="relative">
                <input 
                  type="text" 
                  placeholder="e.g., Dr. Rajesh Kumar"
                  required 
                  className="bg-[#0A1128] border border-white/10 rounded-lg pl-10 pr-4 py-3 text-sm text-white focus:border-blue-600 outline-none transition-colors w-full" 
                  value={formData.name} 
                  onChange={e => setFormData({...formData, name: e.target.value})} 
                />
                <FaUser className="absolute left-4 top-1/2 transform -translate-y-1/2 text-textSecondary text-sm pointer-events-none" />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold text-textSecondary uppercase">Designation <span className="text-red-500">*</span></label>
                <div className="relative">
                  <input 
                    type="text" 
                    placeholder="e.g., Head of Department"
                    required 
                    className="bg-[#0A1128] border border-white/10 rounded-lg pl-10 pr-4 py-3 text-sm text-white focus:border-blue-600 outline-none transition-colors w-full" 
                    value={formData.designation} 
                    onChange={e => setFormData({...formData, designation: e.target.value})} 
                  />
                  <FaBriefcase className="absolute left-4 top-1/2 transform -translate-y-1/2 text-textSecondary text-sm pointer-events-none" />
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold text-textSecondary uppercase">Department <span className="text-red-500">*</span></label>
                <input 
                  type="text" 
                  placeholder="e.g., Mathematics"
                  required 
                  className="bg-[#0A1128] border border-white/10 rounded-lg px-4 py-3 text-sm text-white focus:border-blue-600 outline-none transition-colors w-full" 
                  value={formData.department} 
                  onChange={e => setFormData({...formData, department: e.target.value})} 
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold text-textSecondary uppercase">Email Address</label>
                <div className="relative">
                  <input 
                    type="email" 
                    placeholder="e.g., rajesh@vemhs.edu.in"
                    className="bg-[#0A1128] border border-white/10 rounded-lg pl-10 pr-4 py-3 text-sm text-white focus:border-blue-600 outline-none transition-colors w-full" 
                    value={formData.email} 
                    onChange={e => setFormData({...formData, email: e.target.value})} 
                  />
                  <FaEnvelope className="absolute left-4 top-1/2 transform -translate-y-1/2 text-textSecondary text-sm pointer-events-none" />
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold text-textSecondary uppercase">Experience</label>
                <input 
                  type="text" 
                  placeholder="e.g., 10 Years"
                  className="bg-[#0A1128] border border-white/10 rounded-lg px-4 py-3 text-sm text-white focus:border-blue-600 outline-none transition-colors w-full" 
                  value={formData.experience} 
                  onChange={e => setFormData({...formData, experience: e.target.value})} 
                />
              </div>
            </div>

            {/* Profile Avatar Upload */}
            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold text-textSecondary uppercase">Profile Photo</label>
              <div className="bg-[#0A1128] border border-white/10 rounded-lg p-4 flex items-center gap-4">
                <div className="w-16 h-16 rounded-full overflow-hidden bg-white/5 border border-white/10 flex items-center justify-center flex-shrink-0">
                  {imagePreview ? (
                    <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                  ) : (
                    <FaUser className="text-white/20 text-lg" />
                  )}
                </div>
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-2">
                    <label className="border border-white/20 text-white px-4 py-1.5 rounded-lg text-xs font-bold hover:bg-white/5 transition-all w-fit cursor-pointer flex items-center gap-1.5">
                      <FaCamera /> Select Photo
                      <input type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
                    </label>
                    {(imagePreview || imageFile) && (
                      <button 
                        type="button"
                        onClick={() => {
                          setImagePreview('');
                          setImageFile(null);
                        }}
                        className="bg-red-500/20 hover:bg-red-500/40 text-red-500 px-4 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5"
                      >
                        <FaTrash /> Remove
                      </button>
                    )}
                  </div>
                  <p className="text-[10px] text-textSecondary">JPG, PNG, or WEBP. Max size 2MB</p>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold text-textSecondary uppercase">Qualifications (Comma separated)</label>
              <div className="relative">
                <input 
                  type="text" 
                  placeholder="e.g., M.Sc, B.Ed, M.Phil"
                  className="bg-[#0A1128] border border-white/10 rounded-lg pl-10 pr-4 py-3 text-sm text-white focus:border-blue-600 outline-none transition-colors w-full" 
                  value={formData.qualifications} 
                  onChange={e => setFormData({...formData, qualifications: e.target.value})} 
                />
                <FaGraduationCap className="absolute left-4 top-1/2 transform -translate-y-1/2 text-textSecondary text-sm pointer-events-none" />
              </div>
            </div>

            <div className="flex flex-col gap-2 mt-2">
              <button 
                type="submit" 
                disabled={submitting}
                className="bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg text-sm font-bold transition-all w-full flex items-center justify-center gap-2 shadow-lg shadow-blue-500/10"
              >
                {submitting ? (
                  <>
                    <FaSpinner className="animate-spin" /> {editingId ? 'Updating Faculty...' : 'Adding Faculty...'}
                  </>
                ) : (
                  <>
                    {editingId ? <FaEdit /> : <FaPlus />} {editingId ? 'Update Faculty Member' : 'Add Faculty'}
                  </>
                )}
              </button>
              {editingId && (
                <button 
                  type="button" 
                  onClick={handleCancelEdit}
                  className="border border-white/20 hover:bg-white/5 text-white py-3 rounded-lg text-sm font-bold transition-all w-full"
                >
                  Cancel Edit
                </button>
              )}
            </div>
          </form>
        </div>

        {/* List of Faculty */}
        <div className="lg:col-span-7 bg-darkCard border border-white/5 rounded-xl p-6 flex flex-col gap-4 overflow-hidden">
          <div className="flex items-center gap-3 border-b border-white/5 pb-3">
            <div className="p-2 rounded bg-blue-500 text-white border border-blue-600 dark:bg-blue-950 dark:text-blue-500 dark:border-blue-600/10">
              <FaUsers size={14} />
            </div>
            <h2 className="text-base font-bold">Faculty Roster ({faculty.length})</h2>
          </div>

          <div className="overflow-x-auto custom-scrollbar">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-20 text-textSecondary gap-2">
                <FaSpinner className="animate-spin text-xl text-blue-500" />
                <p className="text-sm">Loading faculty roster...</p>
              </div>
            ) : faculty.length === 0 ? (
              <div className="text-center py-20 text-textSecondary">
                <FaUsers size={32} className="mx-auto opacity-20 mb-4" />
                <p className="text-base font-bold text-white mb-1">No Faculty Members Found</p>
                <p className="text-sm">Add a new faculty member on the left to build the school roster.</p>
              </div>
            ) : (
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-white/5 border-b border-white/5">
                    <th className="py-3 px-4 text-xs font-bold text-textSecondary uppercase">Faculty</th>
                    <th className="py-3 px-4 text-xs font-bold text-textSecondary uppercase">Role & Department</th>
                    <th className="py-3 px-4 text-xs font-bold text-textSecondary uppercase">Qualifications</th>
                    <th className="py-3 px-4 text-xs font-bold text-textSecondary uppercase">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {faculty.map((f) => (
                    <tr key={f._id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full overflow-hidden bg-white/5 border border-white/10 flex items-center justify-center flex-shrink-0">
                            {f.imageUrl ? (
                              <img src={f.imageUrl} alt={f.name} className="w-full h-full object-cover" />
                            ) : (
                              <FaUser className="text-white/20 text-sm" />
                            )}
                          </div>
                          <div className="flex flex-col">
                            <span className="text-sm font-bold text-white leading-tight">{f.name}</span>
                            {f.email && <span className="text-xs text-textSecondary">{f.email}</span>}
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex flex-col">
                          <span className="text-sm text-white font-medium leading-tight">{f.designation}</span>
                          <span className="text-xs text-textSecondary">{f.department}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex flex-wrap gap-1">
                          {f.qualifications && f.qualifications.length > 0 ? (
                            f.qualifications.map((q, qIdx) => (
                              <span key={qIdx} className="bg-blue-500 text-white border border-blue-600 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-600/10 px-2 py-0.5 rounded text-xs font-bold uppercase">
                                {q}
                              </span>
                            ))
                          ) : (
                            <span className="text-xs text-textSecondary italic">Not listed</span>
                          )}
                          {f.experience && (
                            <span className="bg-orange-500 text-white border border-orange-600 dark:bg-orange-950 dark:text-orange-400 dark:border-orange-500/10 px-2 py-0.5 rounded text-xs font-bold">
                              {f.experience} exp
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-1">
                          <button 
                            onClick={() => handleEditClick(f)} 
                            className="p-2 text-blue-600 hover:bg-blue-500 dark:text-blue-400 dark:hover:bg-blue-500/10 rounded-lg transition-all"
                            title="Edit Faculty"
                          >
                            <FaEdit size={12} />
                          </button>
                          <button 
                            onClick={() => handleDelete(f._id)} 
                            className="p-2 text-white hover:bg-red-500 dark:text-red-500 dark:hover:bg-red-500/10 rounded-lg transition-all"
                            title="Delete Faculty"
                          >
                            <FaTrash size={12} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManageFaculty;
