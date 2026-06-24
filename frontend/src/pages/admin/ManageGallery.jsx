import React, { useState, useEffect } from 'react';
import { FaCloudUploadAlt, FaTimes, FaCamera, FaSpinner, FaImage, FaTrash } from 'react-icons/fa';
import api from '../../services/api';

const ManageGallery = () => {
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    category: 'Infrastructure',
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');

  const [gallerySettings, setGallerySettings] = useState({ hero: { backgroundImage: '', sideImage: '' } });
  const [settingsLoading, setSettingsLoading] = useState(false);
  const [bgUploading, setBgUploading] = useState(false);
  const [sideUploading, setSideUploading] = useState(false);

  useEffect(() => {
    fetchPhotos();
    fetchGallerySettings();
  }, []);

  const fetchGallerySettings = async () => {
    setSettingsLoading(true);
    try {
      const { data } = await api.get('/gallery-settings');
      setGallerySettings(data);
    } catch (error) {
      console.error('Failed to load gallery settings:', error);
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
      const { data } = await api.post('/gallery-settings/upload-image', uploadData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      const newSettings = { 
        ...gallerySettings, 
        hero: { 
          ...gallerySettings.hero, 
          [imageType]: data.imageUrl 
        } 
      };
      setGallerySettings(newSettings);
      
      // Save settings
      await api.put('/gallery-settings', newSettings);
      alert(`${imageType === 'backgroundImage' ? 'Background' : 'Side'} image updated successfully!`);
    } catch (err) {
      console.error(err);
      alert('Failed to upload image.');
    } finally {
      if (imageType === 'backgroundImage') setBgUploading(false);
      if (imageType === 'sideImage') setSideUploading(false);
    }
  };

  const fetchPhotos = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/gallery');
      setPhotos(data);
    } catch (error) {
      console.error('Failed to load gallery photos:', error);
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
    if (!imageFile) {
      alert('Please select an image to upload.');
      return;
    }

    setSubmitting(true);
    try {
      const data = new FormData();
      data.append('title', formData.title);
      data.append('category', formData.category);
      data.append('image', imageFile);

      const response = await api.post('/gallery', data, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setPhotos([response.data, ...photos]);
      setFormData({ title: '', category: 'Infrastructure' });
      setImageFile(null);
      setImagePreview('');
      alert('Image added to gallery successfully!');
    } catch (error) {
      console.error(error);
      alert('Failed to upload image: ' + (error.response?.data?.message || error.message));
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this photo from the gallery?')) {
      try {
        await api.delete(`/gallery/${id}`);
        setPhotos(photos.filter(photo => photo._id !== id));
      } catch (error) {
        console.error(error);
        alert('Failed to delete photo.');
      }
    }
  };

  const filteredPhotos = categoryFilter === 'All' 
    ? photos 
    : photos.filter(p => p.category === categoryFilter);

  return (
    <div className="flex flex-col gap-6 w-full pb-10 text-white">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white mb-1">Gallery Management</h1>
        <p className="text-xs text-textSecondary font-medium">Home / Gallery / Upload & List</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

        {/* Page Settings (Full Width) */}
        <div className="lg:col-span-12 bg-darkCard border border-white/5 rounded-xl p-6 flex flex-col gap-4">
          <div className="flex items-center gap-3 border-b border-white/5 pb-3">
            <h2 className="text-base font-bold">Gallery Page Settings</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-2">
            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold text-textSecondary uppercase">Hero Background Image</label>
              <div className="bg-[#0A1128] border border-white/10 rounded-lg p-3 flex items-center gap-4">
                <div className="w-24 h-16 rounded overflow-hidden bg-white/5 border border-white/10 flex items-center justify-center flex-shrink-0">
                  {gallerySettings.hero?.backgroundImage ? (
                    <img src={gallerySettings.hero.backgroundImage} alt="Hero Background Preview" className="w-full h-full object-cover" />
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
                    {gallerySettings.hero?.backgroundImage && (
                      <button 
                        type="button"
                        onClick={async () => {
                          const newSettings = { ...gallerySettings, hero: { ...gallerySettings.hero, backgroundImage: '' } };
                          setGallerySettings(newSettings);
                          await api.put('/gallery-settings', newSettings);
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
                  {gallerySettings.hero?.sideImage ? (
                    <img src={gallerySettings.hero.sideImage} alt="Hero Side Preview" className="w-full h-full object-cover" />
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
                    {gallerySettings.hero?.sideImage && (
                      <button 
                        type="button"
                        onClick={async () => {
                          const newSettings = { ...gallerySettings, hero: { ...gallerySettings.hero, sideImage: '' } };
                          setGallerySettings(newSettings);
                          await api.put('/gallery-settings', newSettings);
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

        {/* Upload Form */}
        <div className="lg:col-span-5 bg-darkCard border border-white/5 rounded-xl p-6 h-fit flex flex-col gap-4">
          <div className="flex items-center gap-3 border-b border-white/5 pb-3">
            <div className="p-2 rounded bg-green-500 text-white border border-green-600 dark:bg-green-950 dark:text-green-500 dark:border-green-500/10">
              <FaCloudUploadAlt size={14} />
            </div>
            <h2 className="text-base font-bold">Upload New Photo</h2>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold text-textSecondary uppercase">Title / Caption <span className="text-red-500">*</span></label>
              <input 
                type="text" 
                placeholder="e.g., Science Lab Renovation"
                required 
                className="bg-[#0A1128] border border-white/10 rounded-lg px-4 py-3 text-sm text-white focus:border-blue-600 outline-none transition-colors w-full" 
                value={formData.title} 
                onChange={e => setFormData({...formData, title: e.target.value})} 
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold text-textSecondary uppercase">Category <span className="text-red-500">*</span></label>
              <select 
                className="bg-[#0A1128] border border-white/10 rounded-lg px-4 py-3 text-sm text-white focus:border-blue-600 outline-none transition-colors w-full" 
                value={formData.category} 
                onChange={e => setFormData({...formData, category: e.target.value})} 
              >
                <option value="Infrastructure">Infrastructure</option>
                <option value="Events">Events</option>
                <option value="Academics">Academics</option>
                <option value="Sports">Sports</option>
                <option value="Other">Other</option>
              </select>
            </div>

            {/* Select Image */}
            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold text-textSecondary uppercase">Image File <span className="text-red-500">*</span></label>
              <div className="bg-[#0A1128] border border-white/10 rounded-lg p-4 flex items-center gap-4">
                <div className="w-20 h-20 rounded-md overflow-hidden bg-white/5 border border-white/10 flex items-center justify-center flex-shrink-0">
                  {imagePreview ? (
                    <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                  ) : (
                    <FaCamera className="text-white/20 text-lg" />
                  )}
                </div>
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-2">
                    <label className="border border-white/20 text-white px-4 py-1.5 rounded-lg text-xs font-bold hover:bg-white/5 transition-all w-fit cursor-pointer flex items-center gap-1.5">
                      <FaCamera /> Select File
                      <input type="file" className="hidden" accept="image/*" required={!imagePreview} onChange={handleImageChange} />
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
                  <p className="text-[10px] text-textSecondary">PNG, JPG, or WEBP. Max size 10MB</p>
                </div>
              </div>
            </div>

            <button 
              type="submit" 
              disabled={submitting}
              className="bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg text-sm font-bold transition-all w-full flex items-center justify-center gap-2 mt-2 shadow-lg shadow-blue-500/10"
            >
              {submitting ? (
                <>
                  <FaSpinner className="animate-spin" /> Uploading image...
                </>
              ) : (
                <>
                  <FaCloudUploadAlt /> Upload to Gallery
                </>
              )}
            </button>
          </form>
        </div>

        {/* Photos Grid */}
        <div className="lg:col-span-7 bg-darkCard border border-white/5 rounded-xl p-6 flex flex-col gap-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-white/5 pb-3 gap-3">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded bg-blue-500 text-white border border-blue-600 dark:bg-blue-950 dark:text-blue-500 dark:border-blue-600/10">
                <FaImage size={14} />
              </div>
              <h2 className="text-base font-bold">Uploaded Photos ({filteredPhotos.length})</h2>
            </div>
            
            {/* Category Filter Tab */}
            <select 
              value={categoryFilter} 
              onChange={e => setCategoryFilter(e.target.value)}
              className="bg-[#0A1128] border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white focus:border-blue-600 outline-none"
            >
              <option value="All">All Categories</option>
              <option value="Infrastructure">Infrastructure</option>
              <option value="Events">Events</option>
              <option value="Academics">Academics</option>
              <option value="Sports">Sports</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 max-h-[600px] overflow-y-auto pr-1 custom-scrollbar">
            {loading ? (
              <div className="col-span-full flex flex-col items-center justify-center py-20 text-textSecondary gap-2">
                <FaSpinner className="animate-spin text-xl text-blue-500" />
                <p className="text-sm">Loading gallery...</p>
              </div>
            ) : filteredPhotos.length === 0 ? (
              <div className="col-span-full text-center py-20 text-textSecondary">
                <FaImage size={32} className="mx-auto opacity-20 mb-4" />
                <p className="text-base font-bold text-white mb-1">No Photos Found</p>
                <p className="text-sm">Upload new photos in the left panel to populate the grid.</p>
              </div>
            ) : (
              filteredPhotos.map((photo) => (
                <div key={photo._id} className="relative rounded-lg overflow-hidden aspect-[4/3] bg-[#0A1128] border border-white/5 group hover:border-white/10 transition-all">
                  <img src={photo.imageUrl} alt={photo.title} className="w-full h-full object-cover" />
                  
                  {/* Overlay Category Badge */}
                  <span className="absolute top-2 left-2 text-[10px] font-bold bg-black/60 backdrop-blur-sm px-2 py-0.5 rounded text-white border border-white/10">
                    {photo.category}
                  </span>
 
                  {/* Caption & Delete Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-2.5">
                    <p className="text-xs font-semibold text-white truncate mb-1.5">{photo.title}</p>
                    <button 
                      onClick={() => handleDelete(photo._id)}
                      className="w-full py-1 rounded bg-red-500 hover:bg-red-600 text-white hover:text-white dark:bg-red-950/40 dark:text-red-500 dark:hover:bg-red-600 dark:border-red-500/10 transition-all text-xs font-bold flex items-center justify-center gap-1 border border-red-600"
                      title="Delete Image"
                    >
                      <FaTrash size={8} /> Delete Photo
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManageGallery;
