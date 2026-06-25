import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaBars, FaTimes, FaSun, FaMoon } from 'react-icons/fa';
import api from '../services/api';

const Navbar = () => {
  const [schoolLogoUrl, setSchoolLogoUrl] = useState('https://res.cloudinary.com/dcsngtknz/image/upload/v1781580525/IMG-20260616-WA0000_ckiv3k.jpg');
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(() => {
    return localStorage.getItem('theme') !== 'light';
  });
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const { data } = await api.get('/general-settings');
        if (data && data.schoolLogoUrl) {
          setSchoolLogoUrl(data.schoolLogoUrl);
        }
      } catch (e) {
        console.error('Error fetching navbar settings:', e);
      }
    };
    fetchSettings();
    window.addEventListener('school-settings-updated', fetchSettings);
    return () => window.removeEventListener('school-settings-updated', fetchSettings);
  }, []);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDarkMode]);

  const links = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
    { name: 'Academics', path: '/academics' },
    { name: 'Admissions', path: '/admissions' },
    { name: 'Faculty', path: '/faculty' },
    { name: 'Gallery', path: '/gallery' },
    { name: 'News & Events', path: '/news-events' },
    { name: 'Contact', path: '/contact' },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <nav className={`sticky top-0 z-50 bg-darkBg/80 backdrop-blur-md border-b border-white/5 px-6 md:px-12 flex items-center justify-between transition-all duration-300 ${
      isScrolled ? 'py-4 shadow-md' : 'py-6'
    }`}>
      <Link to="/" className="flex items-center gap-2 sm:gap-3 font-bold text-lg sm:text-2xl tracking-tight text-white">
        <img src={schoolLogoUrl} alt="VEMS Logo" className={`w-auto object-contain rounded-full bg-white/10 p-1 transition-all duration-300 ${
          isScrolled ? 'h-10 sm:h-12' : 'h-12 sm:h-16'
        }`} />
        <span><span className="text-accentGold">Vivekananda</span> School</span>
      </Link>

      <div className="flex items-center gap-6">
        {/* Desktop Menu */}
        <div className="hidden lg:flex items-center gap-8">
          {links.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              className={`text-sm font-medium transition-colors duration-200 ${
                isActive(link.path)
                  ? 'text-accentGold font-semibold border-b-2 border-accentGold pb-1'
                  : 'text-textSecondary hover:text-white'
              }`}
            >
              {link.name}
            </Link>
          ))}
        </div>

        {/* Theme Toggle Button */}
        <button 
          onClick={() => setIsDarkMode(!isDarkMode)}
          className="text-textSecondary hover:text-accentGold transition-colors p-2 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center"
          aria-label="Toggle Theme"
        >
          {isDarkMode ? <FaSun size={18} /> : <FaMoon size={18} />}
        </button>

        {/* Mobile Menu Button */}
        <button 
          className="lg:hidden text-white focus:outline-none ml-2"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      {isOpen && (
        <div className="absolute top-full left-0 w-full bg-darkBg border-b border-white/10 flex flex-col p-4 gap-4 lg:hidden shadow-2xl">
          {links.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              onClick={() => setIsOpen(false)}
              className={`text-lg font-medium p-2 rounded ${
                isActive(link.path)
                  ? 'text-accentGold bg-white/5'
                  : 'text-textSecondary hover:text-white hover:bg-white/5'
              }`}
            >
              {link.name}
            </Link>
          ))}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
