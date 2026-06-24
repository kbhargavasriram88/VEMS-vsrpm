import React, { useState } from 'react';
import { 
  FaMapMarkerAlt, FaPhoneAlt, FaEnvelope, FaClock, FaPaperPlane, FaArrowRight 
} from 'react-icons/fa';
import api from '../services/api';

// High-quality placeholders
const heroBg = "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=1920&q=80"; // background school
const heroStudents = "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=800&q=80"; // school building right
const mapDark = "https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&w=1600&q=80"; // dark map placeholder

const Contact = () => {
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', subject: '', message: '' });
  const [submitting, setSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [error, setError] = useState('');
  
  const [contactSettings, setContactSettings] = useState(null);
  const [generalSettings, setGeneralSettings] = useState({
    schoolName: 'Vivekananda E.M High School',
    phone: '+91 866 123 4567\n+91 866 765 4321',
    email: 'info@vemhs.edu.in\nadmissions@vemhs.edu.in',
    address: 'VIVEKANANDA E M PRIMARY & HIGH SCHOOL\nVisweswaraya Puram, Gudimellanka, Viswesarayapuram\nAndhra Pradesh 533253, India',
    hours: 'Monday - Saturday\n8:30 AM - 4:30 PM',
    mapUrl: 'https://maps.google.com/maps?q=VIVEKANANDA%20E%20M%20PRIMARY%20%26%20HIGH%20SCHOOL%20Visweswaraya%20Puram,%20Gudimellanka,%20Viswesarayapuram,%20Andhra%20Pradesh%20533253,%20India&t=&z=13&ie=UTF8&iwloc=&output=embed'
  });

  React.useEffect(() => {
    fetchContactSettings();
    const fetchGeneralSettings = async () => {
      try {
        const { data } = await api.get('/general-settings');
        if (data) {
          setGeneralSettings(prev => ({ ...prev, ...data }));
        }
      } catch (e) {
        console.error('Failed to load general settings', e);
      }
    };
    fetchGeneralSettings();

    window.addEventListener('school-settings-updated', fetchGeneralSettings);
    return () => window.removeEventListener('school-settings-updated', fetchGeneralSettings);
  }, []);

  const fetchContactSettings = async () => {
    try {
      const { data } = await api.get('/contact-settings');
      setContactSettings(data);
    } catch (error) {
      console.error('Failed to load contact settings:', error);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    try {
      await api.post('/contact', formData);
      setSubmitSuccess(true);
      setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
      setTimeout(() => setSubmitSuccess(false), 5000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send message. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  // Extract src if user accidentally pastes the entire iframe HTML
  const getMapUrl = (urlStr) => {
    if (!urlStr) return '';
    if (urlStr.includes('<iframe') && urlStr.includes('src="')) {
      const match = urlStr.match(/src="([^"]+)"/);
      if (match && match[1]) {
        return match[1];
      }
    }
    return urlStr;
  };

  return (
    <div className="flex flex-col bg-darkBg text-white w-full">
      
      {/* 1. Hero Section */}
      <section className="relative w-full min-h-[90vh] flex items-center pt-10 bg-darkCard border-b border-white/5 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img src={contactSettings?.hero?.backgroundImage || heroBg} alt="School" className="w-full h-full object-cover opacity-35" />
          <div className="absolute inset-0 bg-gradient-to-r from-darkBg via-darkBg/90 to-transparent"></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-6 md:px-12 w-full flex flex-col-reverse md:flex-row items-center justify-between relative z-10 h-full">
          <div className="w-full md:w-1/2 flex flex-col items-start pt-16 md:pt-0">
            <span className="text-accentGold font-bold tracking-widest text-xs mb-4 uppercase flex items-center gap-2">
              <FaArrowRight size={10} className="text-accentGold" /> CONTACT US
            </span>
            <h1 className="text-5xl md:text-7xl font-extrabold text-white leading-tight mb-6">
              Get In Touch
            </h1>
            <p className="text-textSecondary max-w-sm text-sm leading-relaxed">
              We'd love to hear from you! Reach out to us for admissions, inquiries or any assistance.
            </p>
          </div>
          
          <div className="w-full md:w-1/2 h-full flex items-end justify-center md:justify-end">
            <img src={contactSettings?.hero?.sideImage || heroStudents} alt="School Building" className="h-[90%] max-h-[500px] object-cover object-center mask-image-bottom drop-shadow-2xl" style={{ WebkitMaskImage: 'linear-gradient(to top, transparent, black 10%)' }} />
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <section className="py-20 bg-darkBg">
        <div className="max-w-7xl mx-auto px-6 md:px-12 flex flex-col lg:flex-row gap-8">
          
          {/* 2. Contact Information Cards */}
          <div className="w-full lg:w-[35%] flex flex-col">
            <h2 className="text-lg font-bold text-white mb-6">Contact Information</h2>
            
            <div className="flex flex-col gap-4">
              {/* Address */}
              <div className="bg-darkCard border border-white/5 rounded-2xl p-6 flex items-start gap-5 hover:border-white/10 transition-colors">
                <div className="w-12 h-12 rounded-xl bg-blue-900/30 flex items-center justify-center text-blue-500 flex-shrink-0">
                  <FaMapMarkerAlt size={18} />
                </div>
                <div className="flex flex-col pt-1">
                  <h3 className="font-bold text-white text-lg mb-2">Address</h3>
                  <p className="text-base text-textSecondary leading-relaxed whitespace-pre-line">
                    {generalSettings.address}
                  </p>
                </div>
              </div>
 
              {/* Phone */}
              <div className="bg-darkCard border border-white/5 rounded-2xl p-6 flex items-start gap-5 hover:border-white/10 transition-colors">
                <div className="w-12 h-12 rounded-xl bg-green-900/30 flex items-center justify-center text-green-500 flex-shrink-0">
                  <FaPhoneAlt size={18} />
                </div>
                <div className="flex flex-col pt-1">
                  <h3 className="font-bold text-white text-lg mb-2">Phone</h3>
                  <p className="text-base text-textSecondary leading-relaxed whitespace-pre-line">
                    {generalSettings.phone}
                  </p>
                </div>
              </div>
 
              {/* Email */}
              <div className="bg-darkCard border border-white/5 rounded-2xl p-6 flex items-start gap-5 hover:border-white/10 transition-colors">
                <div className="w-12 h-12 rounded-xl bg-orange-900/30 flex items-center justify-center text-accentGold flex-shrink-0">
                  <FaEnvelope size={18} />
                </div>
                <div className="flex flex-col pt-1">
                  <h3 className="font-bold text-white text-lg mb-2">Email</h3>
                  <p className="text-base text-textSecondary leading-relaxed whitespace-pre-line">
                    {generalSettings.email}
                  </p>
                </div>
              </div>
 
              {/* Office Hours */}
              <div className="bg-darkCard border border-white/5 rounded-2xl p-6 flex items-start gap-5 hover:border-white/10 transition-colors">
                <div className="w-12 h-12 rounded-xl bg-purple-900/30 flex items-center justify-center text-purple-500 flex-shrink-0">
                  <FaClock size={18} />
                </div>
                <div className="flex flex-col pt-1">
                  <h3 className="font-bold text-white text-lg mb-2">Office Hours</h3>
                  <p className="text-base text-textSecondary leading-relaxed whitespace-pre-line">
                    {generalSettings.hours}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* 3. Send Us a Message Form */}
          <div className="w-full lg:w-[65%] flex flex-col">
            <h2 className="text-lg font-bold text-white mb-6">Send Us a Message</h2>
            
            <div className="bg-darkCard border border-white/5 rounded-2xl p-8 md:p-10 flex-grow hover:border-white/10 transition-colors">
              {error && (
                <div className="bg-red-900/30 border border-red-500/30 text-red-400 p-4 rounded-xl text-center font-bold text-base leading-relaxed mb-6">
                  {error}
                </div>
              )}
              {submitSuccess && (
                <div className="bg-green-950/40 border border-green-500/20 text-green-400 p-4 rounded-xl text-center font-bold text-base leading-relaxed mb-6">
                  Message sent successfully! We will get back to you shortly.
                </div>
              )}
              <form onSubmit={handleSubmit} className="flex flex-col gap-6 h-full">
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex flex-col gap-2">
                    <label className="text-base font-bold text-white">Your Name <span className="text-red-500">*</span></label>
                    <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Enter your full name" className="w-full bg-darkBg border border-white/10 rounded-lg px-4 py-3 text-base text-white placeholder-textSecondary focus:border-accentGold outline-none transition-colors" />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-base font-bold text-white">Email Address <span className="text-red-500">*</span></label>
                    <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Enter your email address" className="w-full bg-darkBg border border-white/10 rounded-lg px-4 py-3 text-base text-white placeholder-textSecondary focus:border-accentGold outline-none transition-colors" />
                  </div>
                </div>
 
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex flex-col gap-2">
                    <label className="text-base font-bold text-white">Phone Number <span className="text-red-500">*</span></label>
                    <input type="tel" name="phone" value={formData.phone} onChange={handleChange} placeholder="Enter your phone number" className="w-full bg-darkBg border border-white/10 rounded-lg px-4 py-3 text-base text-white placeholder-textSecondary focus:border-accentGold outline-none transition-colors" />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-base font-bold text-white">Subject</label>
                    <input type="text" name="subject" value={formData.subject} onChange={handleChange} placeholder="Enter subject" className="w-full bg-darkBg border border-white/10 rounded-lg px-4 py-3 text-base text-white placeholder-textSecondary focus:border-accentGold outline-none transition-colors" />
                  </div>
                </div>
 
                <div className="flex flex-col gap-2 flex-grow">
                  <label className="text-base font-bold text-white">Message <span className="text-red-500">*</span></label>
                  <textarea name="message" value={formData.message} onChange={handleChange} placeholder="Type your message here..." className="w-full bg-darkBg border border-white/10 rounded-lg px-4 py-3 text-base text-white placeholder-textSecondary focus:border-accentGold outline-none transition-colors resize-none flex-grow min-h-[150px]"></textarea>
                </div>

                <button type="submit" disabled={submitting} className="bg-accentGold text-darkBg font-bold px-8 py-3.5 rounded-lg flex items-center justify-center gap-2 hover:bg-accentGoldDark transition-colors text-base w-full mt-2 disabled:opacity-50 disabled:pointer-events-none">
                  <FaPaperPlane /> {submitting ? 'Sending...' : 'Send Message'}
                </button>
              </form>
            </div>
          </div>

        </div>
      </section>

      {/* 4. Interactive Map Section */}
      <section className="pb-20 bg-darkBg">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="w-full h-96 rounded-2xl overflow-hidden border border-white/10 relative group bg-darkCard">
            <iframe 
              src={getMapUrl(generalSettings.mapUrl)}
              width="100%" 
              height="100%" 
              style={{ border: 0 }} 
              allowFullScreen="" 
              loading="lazy" 
              referrerPolicy="no-referrer-when-downgrade"
              title="School Location Map"
              className="w-full h-full object-cover"
            ></iframe>
          </div>
        </div>
      </section>

    </div>
  );
};

export default Contact;
