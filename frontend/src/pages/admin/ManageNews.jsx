import React, { useState, useEffect } from 'react';
import { FaRegCalendarAlt, FaTrash, FaPlus, FaCamera, FaSpinner, FaNewspaper, FaImage } from 'react-icons/fa';
import api from '../../services/api';

const ManageNews = () => {
  const [news, setNews] = useState([]);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [newsSettings, setNewsSettings] = useState({ hero: { backgroundImage: '', sideImage: '' } });
  const [settingsLoading, setSettingsLoading] = useState(false);
  const [bgUploading, setBgUploading] = useState(false);
  const [sideUploading, setSideUploading] = useState(false);

  useEffect(() => {
    fetchNews();
    fetchNewsSettings();
  }, []);

  const fetchNewsSettings = async () => {
    setSettingsLoading(true);
    try {
      const { data } = await api.get('/news-settings');
      setNewsSettings(data);
    } catch (error) {
      console.error('Failed to load news settings:', error);
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
      const { data } = await api.post('/news-settings/upload-image', uploadData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      const newSettings = { 
        ...newsSettings, 
        hero: { 
          ...newsSettings.hero, 
          [imageType]: data.imageUrl 
        } 
      };
      setNewsSettings(newSettings);
      
      // Save settings
      await api.put('/news-settings', newSettings);
      alert(`${imageType === 'backgroundImage' ? 'Background' : 'Side'} image updated successfully!`);
    } catch (err) {
      console.error(err);
      alert('Failed to upload image.');
    } finally {
      if (imageType === 'backgroundImage') setBgUploading(false);
      if (imageType === 'sideImage') setSideUploading(false);
    }
  };

  const fetchNews = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/news');
      setNews(data);
    } catch (error) {
      console.error('Failed to load news:', error);
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
      data.append('title', formData.title);
      data.append('content', formData.content);
      if (imageFile) {
        data.append('image', imageFile);
      }

      await api.post('/news', data, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setFormData({ title: '', content: '' });
      setImageFile(null);
      setImagePreview('');
      fetchNews();
      alert('News article published successfully!');
    } catch (error) {
      console.error(error);
      alert('Failed to publish news: ' + (error.response?.data?.message || error.message));
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this news article? This action cannot be undone.')) {
      try {
        await api.delete(`/news/${id}`);
        setNews(news.filter(item => item._id !== id));
      } catch (error) {
        console.error(error);
        alert('Failed to delete news article.');
      }
    }
  };

  return (
    <div className="flex flex-col gap-6 w-full pb-10 text-white">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white mb-1">News & Announcements</h1>
        <p className="text-xs text-textSecondary font-medium">Home / News / Manage</p>
      </div>

      {/* News Page Settings Panel */}
      <div className="bg-darkCard border border-white/5 rounded-xl p-6 flex flex-col gap-4 mb-2">
        <div className="flex items-center gap-3 border-b border-white/5 pb-3">
          <div className="p-2 rounded bg-yellow-500 text-darkBg">
            <FaImage size={14} />
          </div>
          <h2 className="text-base font-bold text-white">News Page Settings</h2>
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
                  {newsSettings.hero?.backgroundImage ? (
                    <img src={newsSettings.hero.backgroundImage} alt="Hero Background Preview" className="w-full h-full object-cover" />
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
                    {newsSettings.hero?.backgroundImage && (
                      <button 
                        type="button"
                        onClick={async () => {
                          const newSettings = { ...newsSettings, hero: { ...newsSettings.hero, backgroundImage: '' } };
                          setNewsSettings(newSettings);
                          await api.put('/news-settings', newSettings);
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
                  {newsSettings.hero?.sideImage ? (
                    <img src={newsSettings.hero.sideImage} alt="Hero Side Preview" className="w-full h-full object-contain" />
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
                    {newsSettings.hero?.sideImage && (
                      <button 
                        type="button"
                        onClick={async () => {
                          const newSettings = { ...newsSettings, hero: { ...newsSettings.hero, sideImage: '' } };
                          setNewsSettings(newSettings);
                          await api.put('/news-settings', newSettings);
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
        {/* Creator Form */}
        <div className="lg:col-span-5 bg-darkCard border border-white/5 rounded-xl p-6 h-fit flex flex-col gap-4">
          <div className="flex items-center gap-3 border-b border-white/5 pb-3">
            <div className="p-2 rounded bg-green-500 text-white border border-green-600 dark:bg-green-950 dark:text-green-500 dark:border-green-500/10">
              <FaPlus size={14} />
            </div>
            <h2 className="text-base font-bold">Write News Article</h2>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold text-textSecondary uppercase">Article Title <span className="text-red-500">*</span></label>
              <input 
                type="text" 
                placeholder="e.g., Vivekananda School Ranks #1 in District"
                required 
                className="bg-[#0A1128] border border-white/10 rounded-lg px-4 py-3 text-sm text-white focus:border-blue-600 outline-none transition-colors w-full" 
                value={formData.title} 
                onChange={e => setFormData({...formData, title: e.target.value})} 
              />
            </div>

            {/* Image Upload */}
            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold text-textSecondary uppercase">Featured Image</label>
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
                  <p className="text-[10px] text-textSecondary">PNG, JPG, or WEBP. Max size 5MB</p>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold text-textSecondary uppercase">Article Body <span className="text-red-500">*</span></label>
              <textarea 
                placeholder="Write the full content of the announcement here..."
                required 
                rows="6" 
                className="bg-[#0A1128] border border-white/10 rounded-lg px-4 py-3 text-sm text-white focus:border-blue-600 outline-none transition-colors w-full resize-none" 
                value={formData.content} 
                onChange={e => setFormData({...formData, content: e.target.value})}
              ></textarea>
            </div>

            <button 
              type="submit" 
              disabled={submitting}
              className="bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg text-sm font-bold transition-all w-full flex items-center justify-center gap-2 mt-2 shadow-lg shadow-blue-500/10"
            >
              {submitting ? (
                <>
                  <FaSpinner className="animate-spin" /> Publishing...
                </>
              ) : (
                <>
                  <FaPlus /> Publish News
                </>
              )}
            </button>
          </form>
        </div>

        {/* List of News */}
        <div className="lg:col-span-7 bg-darkCard border border-white/5 rounded-xl p-6 flex flex-col gap-4">
          <div className="flex items-center gap-3 border-b border-white/5 pb-3">
            <div className="p-2 rounded bg-blue-500 text-white border border-blue-600 dark:bg-blue-950 dark:text-blue-500 dark:border-blue-600/10">
              <FaNewspaper size={14} />
            </div>
            <h2 className="text-base font-bold">Published Articles ({news.length})</h2>
          </div>

          <div className="flex flex-col gap-4 max-h-[600px] overflow-y-auto pr-1 custom-scrollbar">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-20 text-textSecondary gap-2">
                <FaSpinner className="animate-spin text-xl text-blue-500" />
                <p className="text-sm">Loading news...</p>
              </div>
            ) : news.length === 0 ? (
              <div className="text-center py-20 text-textSecondary">
                <FaNewspaper size={32} className="mx-auto opacity-20 mb-4" />
                <p className="text-base font-bold text-white mb-1">No News Articles</p>
                <p className="text-sm">Add a new news article in the left panel to populate the list.</p>
              </div>
            ) : (
              news.map((item) => (
                <div key={item._id} className="bg-[#0A1128] border border-white/5 p-4 rounded-xl flex flex-col sm:flex-row items-start sm:items-center gap-4 hover:border-white/10 transition-all group">
                  {item.imageUrl && (
                    <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-800 flex-shrink-0">
                      <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover" />
                    </div>
                  )}
                  <div className="flex-grow min-w-0 text-left">
                    <h4 className="font-bold text-base text-white group-hover:text-blue-400 transition-colors truncate">{item.title}</h4>
                    <p className="text-xs text-textSecondary flex items-center gap-1.5 mt-1">
                      <FaRegCalendarAlt size={10} />
                      {new Date(item.publishedDate).toLocaleDateString([], { day: 'numeric', month: 'short', year: 'numeric' })}
                    </p>
                    <p className="text-xs text-textSecondary mt-2 leading-relaxed line-clamp-2">{item.content}</p>
                  </div>
                  <button 
                    onClick={() => handleDelete(item._id)} 
                    className="p-2.5 rounded-lg bg-red-500 text-white hover:bg-red-600 hover:text-white dark:bg-red-950/20 dark:text-red-500 dark:hover:bg-red-500 dark:hover:text-white transition-all self-end sm:self-center flex-shrink-0"
                    title="Delete News Article"
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

export default ManageNews;
