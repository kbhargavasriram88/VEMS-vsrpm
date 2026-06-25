import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin, FaYoutube } from 'react-icons/fa';

import api from '../services/api';

const Footer = () => {
  const [socialLinks, setSocialLinks] = useState({
    facebook: '',
    twitter: '',
    instagram: '',
    linkedin: '',
    youtube: ''
  });

  const [general, setGeneral] = useState({
    address: '123 Education Lane, Knowledge City, ST 12345',
    phone: '+1 (555) 123-4567',
    email: 'info@vivekanandaschool.com',
    schoolLogoUrl: 'https://res.cloudinary.com/dcsngtknz/image/upload/v1781580525/IMG-20260616-WA0000_ckiv3k.jpg'
  });

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const { data } = await api.get('/general-settings');
        if (data) {
          if (data.socialLinks) {
            setSocialLinks(prev => ({ ...prev, ...data.socialLinks }));
          }
          setGeneral({
            address: data.address || general.address,
            phone: data.phone || general.phone,
            email: data.email || general.email,
            schoolLogoUrl: data.schoolLogoUrl || general.schoolLogoUrl
          });
        }
      } catch (e) {
        console.error('Error fetching general settings for footer:', e);
      }
    };
    
    loadSettings();
    window.addEventListener('school-settings-updated', loadSettings);
    return () => window.removeEventListener('school-settings-updated', loadSettings);
  }, []);

  return (
    <footer className="bg-darkCard border-t border-white/5 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-6 md:px-12 grid grid-cols-1 md:grid-cols-4 gap-12 text-sm text-textSecondary">
        
        <div>
          <Link to="/" className="flex items-center gap-3 font-bold text-xl tracking-tight text-white mb-4">
            <img src={general.schoolLogoUrl} alt="VEMS Logo" className="h-10 w-auto object-contain rounded-full bg-white/10 p-1" />
            <span><span className="text-accentGold">Vivekananda</span> School</span>
          </Link>
          <p className="mb-4 leading-relaxed">
            Empowering students to achieve excellence in education, character, and lifelong learning for over two decades.
          </p>
          <div className="flex items-center gap-4 text-white">
            {socialLinks.facebook && <a href={socialLinks.facebook} target="_blank" rel="noopener noreferrer" className="hover:text-accentGold transition-colors"><FaFacebook size={20} /></a>}
            {socialLinks.twitter && <a href={socialLinks.twitter} target="_blank" rel="noopener noreferrer" className="hover:text-accentGold transition-colors"><FaTwitter size={20} /></a>}
            {socialLinks.instagram && <a href={socialLinks.instagram} target="_blank" rel="noopener noreferrer" className="hover:text-accentGold transition-colors"><FaInstagram size={20} /></a>}
            {socialLinks.linkedin && <a href={socialLinks.linkedin} target="_blank" rel="noopener noreferrer" className="hover:text-accentGold transition-colors"><FaLinkedin size={20} /></a>}
            {socialLinks.youtube && <a href={socialLinks.youtube} target="_blank" rel="noopener noreferrer" className="hover:text-accentGold transition-colors"><FaYoutube size={20} /></a>}
          </div>
        </div>

        <div>
          <h4 className="text-white font-bold mb-4 tracking-wider uppercase text-xs">Quick Links</h4>
          <ul className="space-y-2">
            <li><Link to="/about" className="hover:text-accentGold transition-colors">About Us</Link></li>
            <li><Link to="/academics" className="hover:text-accentGold transition-colors">Academics</Link></li>
            <li><Link to="/admissions" className="hover:text-accentGold transition-colors">Admissions</Link></li>
            <li><Link to="/faculty" className="hover:text-accentGold transition-colors">Faculty</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-white font-bold mb-4 tracking-wider uppercase text-xs">Resources</h4>
          <ul className="space-y-2">
            <li><Link to="/news-events" className="hover:text-accentGold transition-colors">News & Events</Link></li>
            <li><Link to="/gallery" className="hover:text-accentGold transition-colors">Photo Gallery</Link></li>
            <li><Link to="/admin/login" className="hover:text-accentGold transition-colors">Admin Portal</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-white font-bold mb-4 tracking-wider uppercase text-xs">Contact Info</h4>
          <ul className="space-y-2">
            <li className="whitespace-pre-line">{general.address}</li>
            <li>Phone: {general.phone}</li>
            <li>Email: {general.email}</li>
          </ul>
        </div>

      </div>
      
      <div className="max-w-7xl mx-auto px-6 md:px-12 mt-12 pt-8 border-t border-white/5 text-center text-xs">
        &copy; {new Date().getFullYear()} Vivekananda E.M High School. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
