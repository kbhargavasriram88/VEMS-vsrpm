import React, { useState, useEffect } from 'react';
import { 
  FaUser, FaEnvelope, FaLock, FaSave, FaSchool, 
  FaPhone, FaMapMarkerAlt, FaClock, FaGlobe, FaCheck, FaEye, FaEyeSlash 
} from 'react-icons/fa';
import api from '../../services/api';

const ManageSettings = () => {
  const [profile, setProfile] = useState({
    username: '',
    email: '',
    avatarUrl: '',
  });

  const [security, setSecurity] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [general, setGeneral] = useState({
    schoolName: 'Vivekananda E.M High School',
    phone: '+91 866 123 4567',
    email: 'info@vemhs.edu.in',
    address: '# 12-3-45, Moghalrajapuram, Vijayawada, AP - 520010',
    hours: 'Monday - Saturday, 8:30 AM - 4:30 PM',
    admissionsOpen: true,
    maintenanceMode: false,
    calendarPdfUrl: '',
    socialLinks: {
      facebook: '',
      twitter: '',
      instagram: '',
      instagram: '',
      linkedin: '',
      youtube: ''
    },
    mapUrl: 'https://maps.google.com/maps?q=VIVEKANANDA%20E%20M%20PRIMARY%20%26%20HIGH%20SCHOOL%20Visweswaraya%20Puram,%20Gudimellanka,%20Viswesarayapuram,%20Andhra%20Pradesh%20533253,%20India&t=&z=13&ie=UTF8&iwloc=&output=embed'
  });

  const [uploadingCalendar, setUploadingCalendar] = useState(false);

  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [profileSaveSuccess, setProfileSaveSuccess] = useState(false);
  const [securitySaveSuccess, setSecuritySaveSuccess] = useState(false);
  const [generalSaveSuccess, setGeneralSaveSuccess] = useState(false);

  useEffect(() => {
    fetchProfile();
    fetchGeneralSettings();
  }, []);

  const fetchGeneralSettings = async () => {
    try {
      const { data } = await api.get('/general-settings');
      if (data) {
        setGeneral(data);
      }
    } catch (error) {
      console.error('Failed to fetch general settings:', error);
    }
  };

  const fetchProfile = async () => {
    try {
      const { data } = await api.get(`/auth/me?t=${Date.now()}`);
      setProfile({
        username: data.username || '',
        email: data.email || '',
        avatarUrl: data.avatarUrl || '',
      });
    } catch (error) {
      console.error('Failed to load profile details:', error);
      setErrorMsg('Failed to load profile details from backend.');
    }
  };

  const handleProfileChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleSecurityChange = (e) => {
    setSecurity({ ...security, [e.target.name]: e.target.value });
  };

  const handleGeneralChange = (e) => {
    const { name, value, type, checked } = e.target;
    setGeneral({
      ...general,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleSocialChange = (e) => {
    const { name, value } = e.target;
    setGeneral({
      ...general,
      socialLinks: {
        ...(general.socialLinks || {}),
        [name]: value
      }
    });
  };

  const handleAvatarUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const uploadData = new FormData();
    uploadData.append('image', file);
    
    setUploading(true);
    setErrorMsg('');
    setSuccessMsg('');
    try {
      const { data } = await api.post('/home-settings/upload-image', uploadData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setProfile(prev => ({
        ...prev,
        avatarUrl: data.imageUrl
      }));
      setSuccessMsg('Avatar photo uploaded successfully! Click save to apply.');
    } catch (err) {
      console.error(err);
      setErrorMsg('Failed to upload avatar.');
    } finally {
      setUploading(false);
    }
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccessMsg('');
    setErrorMsg('');

    try {
      const { data } = await api.put('/auth/profile', {
        username: profile.username,
        email: profile.email,
        avatarUrl: profile.avatarUrl,
      });
      setProfile({
        username: data.username || '',
        email: data.email || '',
        avatarUrl: data.avatarUrl || '',
      });
      if (data.token) {
        sessionStorage.setItem('adminToken', data.token);
      }
      setSuccessMsg('Account profile details updated successfully!');
      setProfileSaveSuccess(true);
      setTimeout(() => setProfileSaveSuccess(false), 3000);
      sessionStorage.setItem('adminUserEmail', profile.email);
      window.dispatchEvent(new Event('admin-profile-updated'));
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (error) {
      console.error(error);
      setErrorMsg(error.response?.data?.message || 'Error updating account profile.');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } finally {
      setLoading(false);
    }
  };

  const handleSaveSecurity = async (e) => {
    e.preventDefault();
    if (security.newPassword !== security.confirmPassword) {
      setErrorMsg('New passwords do not match.');
      return;
    }
    if (!security.currentPassword) {
      setErrorMsg('Please enter your current password to proceed.');
      return;
    }

    setLoading(true);
    setSuccessMsg('');
    setErrorMsg('');

    try {
      // First verify credentials by attempting a re-login validation or verification
      const savedEmail = sessionStorage.getItem('adminUserEmail') || profile.email;
      
      // Attempt validation
      try {
        await api.post('/auth/login', {
          email: savedEmail,
          password: security.currentPassword,
        });
      } catch (loginErr) {
        setErrorMsg('Invalid current password. Security block triggered.');
        setLoading(false);
        return;
      }

      const { data } = await api.put('/auth/profile', {
        password: security.newPassword,
      });

      if (data.token) {
        sessionStorage.setItem('adminToken', data.token);
      }

      setSuccessMsg('Password updated successfully!');
      setSecuritySaveSuccess(true);
      setTimeout(() => setSecuritySaveSuccess(false), 3000);
      setSecurity({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (error) {
      console.error(error);
      setErrorMsg(error.response?.data?.message || 'Error updating password.');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } finally {
      setLoading(false);
    }
  };

  const handleCalendarUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.type !== 'application/pdf') {
      setErrorMsg('Please select a valid PDF file.');
      return;
    }

    const uploadData = new FormData();
    uploadData.append('doc', file);
    
    setUploadingCalendar(true);
    setErrorMsg('');
    setSuccessMsg('');
    try {
      const { data } = await api.post('/home-settings/upload-doc', uploadData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setGeneral(prev => ({
        ...prev,
        calendarPdfUrl: data.imageUrl
      }));
      setSuccessMsg('Academic Calendar PDF uploaded successfully! Remember to save changes.');
    } catch (err) {
      console.error(err);
      setErrorMsg('Failed to upload Academic Calendar PDF.');
    } finally {
      setUploadingCalendar(false);
    }
  };

  const handleSaveGeneral = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');
    setSuccessMsg('');
    try {
      await api.put('/general-settings', general);
      setSuccessMsg('General website configuration saved globally!');
      setGeneralSaveSuccess(true);
      setTimeout(() => setGeneralSaveSuccess(false), 3000);
      
      // Simulate updating contact and academics pages
      window.dispatchEvent(new Event('school-settings-updated'));
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (error) {
      console.error(error);
      setErrorMsg(error.response?.data?.message || 'Failed to update general settings');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-6 w-full pb-10 text-white">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white mb-1">System Settings</h1>
        <p className="text-xs text-textSecondary font-medium">Home / Settings</p>
      </div>

      {/* Alert Notices */}
      {successMsg && (
        <div className="bg-green-900/30 border border-green-500/30 text-green-400 p-4 rounded-lg text-sm font-semibold">
          {successMsg}
        </div>
      )}
      {errorMsg && (
        <div className="bg-red-900/30 border border-red-500/30 text-red-400 p-4 rounded-lg text-sm font-semibold">
          {errorMsg}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Account Profile Card */}
        <div className="bg-darkCard border border-white/5 rounded-xl p-6 flex flex-col gap-4">
          <div className="flex items-center gap-3 border-b border-white/5 pb-3">
            <FaUser className="text-blue-500 text-lg" />
            <h2 className="text-base font-bold">Account Profile</h2>
          </div>

          <form onSubmit={handleSaveProfile} className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold text-textSecondary uppercase">Username</label>
              <div className="relative">
                <input 
                  type="text" 
                  name="username"
                  value={profile.username}
                  onChange={handleProfileChange}
                  required
                  className="w-full bg-[#0A1128] border border-white/10 rounded-lg pl-10 pr-4 py-3 text-sm text-white focus:border-blue-500 outline-none transition-colors" 
                />
                <FaUser className="absolute left-4 top-1/2 transform -translate-y-1/2 text-textSecondary text-sm" />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold text-textSecondary uppercase">Email Address</label>
              <div className="relative">
                <input 
                  type="email" 
                  name="email"
                  value={profile.email}
                  onChange={handleProfileChange}
                  required
                  className="w-full bg-[#0A1128] border border-white/10 rounded-lg pl-10 pr-4 py-3 text-sm text-white focus:border-blue-500 outline-none transition-colors" 
                />
                <FaEnvelope className="absolute left-4 top-1/2 transform -translate-y-1/2 text-textSecondary text-sm" />
              </div>
            </div>

            {/* Avatar Upload */}
            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold text-textSecondary uppercase">Profile Photo</label>
              <div className="bg-[#0A1128] border border-white/10 rounded-lg p-3 flex items-center gap-4">
                <div className="w-16 h-16 rounded-full overflow-hidden bg-white/5 border border-white/10 flex items-center justify-center flex-shrink-0">
                  {profile.avatarUrl ? (
                    <img src={profile.avatarUrl} alt="Admin Avatar" className="w-full h-full object-cover" />
                  ) : (
                    <FaUser className="text-white/20 text-lg" />
                  )}
                </div>
                <div className="flex flex-col gap-2">
                  <label className="border border-white/20 text-white px-3 py-1.5 rounded-lg text-[10px] font-bold hover:bg-white/5 transition-all w-fit cursor-pointer flex items-center gap-1.5">
                    {uploading ? 'Uploading...' : 'Change Photo'}
                    <input 
                      type="file" 
                      className="hidden" 
                      accept="image/*" 
                      onChange={handleAvatarUpload} 
                      disabled={uploading}
                    />
                  </label>
                  <p className="text-[10px] text-textSecondary">PNG, JPG or WEBP. Max size 2MB</p>
                </div>
              </div>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className={`${profileSaveSuccess ? 'bg-green-600 hover:bg-green-700 shadow-green-500/10' : 'bg-blue-600 hover:bg-blue-700 shadow-blue-500/10'} text-white px-6 py-2.5 rounded-lg text-sm font-bold transition-colors w-fit flex items-center gap-2 mt-2 shadow-lg`}
            >
              {profileSaveSuccess ? <><FaCheck /> Saved!</> : <><FaSave /> Save Account Info</>}
            </button>
          </form>
        </div>

        {/* Security Settings Card */}
        <div className="bg-darkCard border border-white/5 rounded-xl p-6 flex flex-col gap-4">
          <div className="flex items-center gap-3 border-b border-white/5 pb-3">
            <FaLock className="text-red-500 text-lg" />
            <h2 className="text-base font-bold">Security Settings</h2>
          </div>

          <form onSubmit={handleSaveSecurity} className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold text-textSecondary uppercase">Current Password</label>
              <div className="relative">
                <input 
                  type={showCurrentPassword ? "text" : "password"} 
                  name="currentPassword"
                  value={security.currentPassword}
                  onChange={handleSecurityChange}
                  required
                  placeholder="Enter current password"
                  className="w-full bg-[#0A1128] border border-white/10 rounded-lg pl-10 pr-12 py-3 text-sm text-white placeholder-textSecondary focus:border-blue-500 outline-none transition-colors" 
                />
                <FaLock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-textSecondary text-sm" />
                <button 
                  type="button" 
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white/40 hover:text-white transition-colors"
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  aria-label={showCurrentPassword ? "Hide password" : "Show password"}
                >
                  {showCurrentPassword ? <FaEyeSlash size={16} /> : <FaEye size={16} />}
                </button>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold text-textSecondary uppercase">New Password</label>
              <div className="relative">
                <input 
                  type={showNewPassword ? "text" : "password"} 
                  name="newPassword"
                  value={security.newPassword}
                  onChange={handleSecurityChange}
                  required
                  placeholder="Enter new password"
                  className="w-full bg-[#0A1128] border border-white/10 rounded-lg pl-10 pr-12 py-3 text-sm text-white placeholder-textSecondary focus:border-blue-500 outline-none transition-colors" 
                />
                <FaLock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-textSecondary text-sm" />
                <button 
                  type="button" 
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white/40 hover:text-white transition-colors"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  aria-label={showNewPassword ? "Hide password" : "Show password"}
                >
                  {showNewPassword ? <FaEyeSlash size={16} /> : <FaEye size={16} />}
                </button>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold text-textSecondary uppercase">Confirm New Password</label>
              <div className="relative">
                <input 
                  type={showConfirmPassword ? "text" : "password"} 
                  name="confirmPassword"
                  value={security.confirmPassword}
                  onChange={handleSecurityChange}
                  required
                  placeholder="Confirm new password"
                  className="w-full bg-[#0A1128] border border-white/10 rounded-lg pl-10 pr-12 py-3 text-sm text-white placeholder-textSecondary focus:border-blue-500 outline-none transition-colors" 
                />
                <FaLock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-textSecondary text-sm" />
                <button 
                  type="button" 
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white/40 hover:text-white transition-colors"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                >
                  {showConfirmPassword ? <FaEyeSlash size={16} /> : <FaEye size={16} />}
                </button>
              </div>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className={`${securitySaveSuccess ? 'bg-green-600 hover:bg-green-700 shadow-green-500/10' : 'bg-red-600 hover:bg-red-700 shadow-red-500/10'} text-white px-6 py-2.5 rounded-lg text-sm font-bold transition-colors w-fit flex items-center gap-2 mt-2 shadow-lg`}
            >
              {securitySaveSuccess ? <><FaCheck /> Updated!</> : <><FaSave /> Update Password</>}
            </button>
          </form>
        </div>

        {/* School Website Metadata Card */}
        <div className="bg-darkCard border border-white/5 rounded-xl p-6 flex flex-col gap-4 md:col-span-2">
          <div className="flex items-center gap-3 border-b border-white/5 pb-3">
            <FaSchool className="text-yellow-500 text-lg" />
            <h2 className="text-base font-bold">General Website Settings</h2>
          </div>

          <form onSubmit={handleSaveGeneral} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold text-textSecondary uppercase">School Name</label>
              <div className="relative">
                <input 
                  type="text" 
                  name="schoolName"
                  value={general.schoolName}
                  onChange={handleGeneralChange}
                  required
                  className="w-full bg-[#0A1128] border border-white/10 rounded-lg pl-10 pr-4 py-3 text-sm text-white focus:border-blue-500 outline-none transition-colors" 
                />
                <FaSchool className="absolute left-4 top-1/2 transform -translate-y-1/2 text-textSecondary text-sm" />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold text-textSecondary uppercase">Contact Phone</label>
              <div className="relative">
                <input 
                  type="text" 
                  name="phone"
                  value={general.phone}
                  onChange={handleGeneralChange}
                  required
                  className="w-full bg-[#0A1128] border border-white/10 rounded-lg pl-10 pr-4 py-3 text-sm text-white focus:border-blue-500 outline-none transition-colors" 
                />
                <FaPhone className="absolute left-4 top-1/2 transform -translate-y-1/2 text-textSecondary text-sm" />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold text-textSecondary uppercase">Contact Email</label>
              <div className="relative">
                <input 
                  type="email" 
                  name="email"
                  value={general.email}
                  onChange={handleGeneralChange}
                  required
                  className="w-full bg-[#0A1128] border border-white/10 rounded-lg pl-10 pr-4 py-3 text-sm text-white focus:border-blue-500 outline-none transition-colors" 
                />
                <FaEnvelope className="absolute left-4 top-1/2 transform -translate-y-1/2 text-textSecondary text-sm" />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold text-textSecondary uppercase">Working Hours</label>
              <div className="relative">
                <input 
                  type="text" 
                  name="hours"
                  value={general.hours}
                  onChange={handleGeneralChange}
                  required
                  className="w-full bg-[#0A1128] border border-white/10 rounded-lg pl-10 pr-4 py-3 text-sm text-white focus:border-blue-500 outline-none transition-colors" 
                />
                <FaClock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-textSecondary text-sm" />
              </div>
            </div>

            <div className="flex flex-col gap-2 sm:col-span-2">
              <label className="text-xs font-bold text-textSecondary uppercase">School Address</label>
              <div className="relative">
                <input 
                  type="text" 
                  name="address"
                  value={general.address}
                  onChange={handleGeneralChange}
                  required
                  className="w-full bg-[#0A1128] border border-white/10 rounded-lg pl-10 pr-4 py-3 text-sm text-white focus:border-blue-500 outline-none transition-colors" 
                />
                <FaMapMarkerAlt className="absolute left-4 top-1/2 transform -translate-y-1/2 text-textSecondary text-sm" />
              </div>
            </div>

            <div className="flex flex-col gap-2 sm:col-span-2">
              <label className="text-xs font-bold text-textSecondary uppercase">Google Maps Embed URL</label>
              <div className="relative">
                <input 
                  type="text" 
                  name="mapUrl"
                  value={general.mapUrl || ''}
                  onChange={handleGeneralChange}
                  required
                  placeholder="Paste the src URL from Google Maps embed code"
                  className="w-full bg-[#0A1128] border border-white/10 rounded-lg pl-10 pr-4 py-3 text-sm text-white focus:border-blue-500 outline-none transition-colors" 
                />
                <FaMapMarkerAlt className="absolute left-4 top-1/2 transform -translate-y-1/2 text-textSecondary text-sm" />
              </div>
            </div>

            {/* Academic Calendar Upload */}
            <div className="flex flex-col gap-2 sm:col-span-2">
              <label className="text-xs font-bold text-textSecondary uppercase">Academic Calendar PDF</label>
              <div className="bg-[#0A1128] border border-white/10 rounded-lg p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex flex-col gap-1">
                  {general.calendarPdfUrl ? (
                    <a 
                      href={general.calendarPdfUrl} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="text-sm text-blue-400 font-bold hover:underline"
                    >
                      View Current Calendar PDF
                    </a>
                  ) : (
                    <span className="text-sm text-textSecondary">No calendar PDF uploaded. Using default template.</span>
                  )}
                  <p className="text-[10px] text-textSecondary">PDF format. Max size 5MB</p>
                </div>
                <label className="border border-white/20 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-white/5 transition-all cursor-pointer flex items-center gap-1.5 self-start sm:self-auto">
                  {uploadingCalendar ? 'Uploading...' : 'Upload PDF'}
                  <input 
                    type="file" 
                    className="hidden" 
                    accept=".pdf" 
                    onChange={handleCalendarUpload} 
                    disabled={uploadingCalendar}
                  />
                </label>
              </div>
            </div>

            <div className="flex items-center justify-between border border-white/10 p-4 rounded-lg bg-[#0A1128]">
              <div className="flex flex-col">
                <span className="text-sm font-bold">Online Admissions</span>
                <span className="text-xs text-textSecondary">Accept online admissions requests</span>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  name="admissionsOpen" 
                  checked={general.admissionsOpen}
                  onChange={handleGeneralChange}
                  className="sr-only peer" 
                />
                <div className="w-11 h-6 bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>

            <div className="flex items-center justify-between border border-white/10 p-4 rounded-lg bg-[#0A1128]">
              <div className="flex flex-col">
                <span className="text-sm font-bold">Maintenance Mode</span>
                <span className="text-xs text-textSecondary">Put the website under temporary lock</span>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  name="maintenanceMode" 
                  checked={general.maintenanceMode}
                  onChange={handleGeneralChange}
                  className="sr-only peer" 
                />
                <div className="w-11 h-6 bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-500"></div>
              </label>
            </div>

            {/* Social Media Links */}
            <div className="flex flex-col gap-4 sm:col-span-2 border-t border-white/10 pt-4 mt-2">
              <h3 className="text-sm font-bold uppercase text-white">Social Media Links</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-bold text-textSecondary uppercase">Facebook</label>
                  <input type="url" name="facebook" value={general.socialLinks?.facebook || ''} onChange={handleSocialChange} placeholder="https://facebook.com/..." className="w-full bg-[#0A1128] border border-white/10 rounded-lg px-4 py-3 text-sm text-white focus:border-blue-500 outline-none" />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-bold text-textSecondary uppercase">Twitter</label>
                  <input type="url" name="twitter" value={general.socialLinks?.twitter || ''} onChange={handleSocialChange} placeholder="https://twitter.com/..." className="w-full bg-[#0A1128] border border-white/10 rounded-lg px-4 py-3 text-sm text-white focus:border-blue-500 outline-none" />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-bold text-textSecondary uppercase">Instagram</label>
                  <input type="url" name="instagram" value={general.socialLinks?.instagram || ''} onChange={handleSocialChange} placeholder="https://instagram.com/..." className="w-full bg-[#0A1128] border border-white/10 rounded-lg px-4 py-3 text-sm text-white focus:border-blue-500 outline-none" />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-bold text-textSecondary uppercase">LinkedIn</label>
                  <input type="url" name="linkedin" value={general.socialLinks?.linkedin || ''} onChange={handleSocialChange} placeholder="https://linkedin.com/..." className="w-full bg-[#0A1128] border border-white/10 rounded-lg px-4 py-3 text-sm text-white focus:border-blue-500 outline-none" />
                </div>
                <div className="flex flex-col gap-2 sm:col-span-2">
                  <label className="text-xs font-bold text-textSecondary uppercase">YouTube</label>
                  <input type="url" name="youtube" value={general.socialLinks?.youtube || ''} onChange={handleSocialChange} placeholder="https://youtube.com/..." className="w-full bg-[#0A1128] border border-white/10 rounded-lg px-4 py-3 text-sm text-white focus:border-blue-500 outline-none" />
                </div>
              </div>
            </div>

            <button 
              type="submit" 
              className={`${generalSaveSuccess ? 'bg-green-600 hover:bg-green-700 text-white shadow-green-500/10' : 'bg-yellow-500 hover:bg-yellow-600 text-darkBg shadow-yellow-500/10'} px-6 py-2.5 rounded-lg text-sm font-bold transition-colors w-fit mx-auto sm:col-span-2 flex items-center justify-center gap-2 mt-2 shadow-lg`}
            >
              {generalSaveSuccess ? <><FaCheck /> Configuration Saved Successfully!</> : <><FaSave /> Save Website Configuration</>}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ManageSettings;
