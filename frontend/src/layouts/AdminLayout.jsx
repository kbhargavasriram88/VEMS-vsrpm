import React, { useEffect, useState } from 'react';
import { NavLink, Outlet, useLocation, useNavigate, Link } from 'react-router-dom';
import { 
  FaTachometerAlt, FaUserGraduate, FaUsers, FaImages, FaRegNewspaper, 
  FaCalendarAlt, FaEnvelope, FaCog, FaAngleDown, FaSignOutAlt, FaSun, FaMoon, FaHome, FaInfoCircle, FaBook
} from 'react-icons/fa';
import api from '../services/api';

const AdminLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isDarkMode, setIsDarkMode] = useState(() => {
    return localStorage.getItem('theme') !== 'light';
  });
  const [profile, setProfile] = useState({
    username: 'Admin User',
    email: '',
    avatarUrl: ''
  });

  const fetchProfile = async () => {
    try {
      const { data } = await api.get(`/auth/me?t=${Date.now()}`);
      setProfile({
        username: data.username || 'Admin User',
        email: data.email || '',
        avatarUrl: data.avatarUrl || ''
      });
    } catch (error) {
      console.error('Failed to fetch admin profile in layout:', error);
      // Even if fetch fails, keep the default profile
      setProfile({
        username: 'Bypass Admin',
        email: 'admin@vivekananda.com',
        avatarUrl: ''
      });
    }
  };

  useEffect(() => {
    fetchProfile();

    const handleProfileUpdate = () => {
      fetchProfile();
    };

    window.addEventListener('admin-profile-updated', handleProfileUpdate);
    return () => {
      window.removeEventListener('admin-profile-updated', handleProfileUpdate);
    };
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

  useEffect(() => {
    const token = sessionStorage.getItem('adminToken');
    if (!token) {
      navigate('/admin/login');
    }
  }, [navigate]);

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to log out?')) {
      sessionStorage.removeItem('adminToken');
      sessionStorage.removeItem('adminUserEmail');
      navigate('/admin/login');
    }
  };

  const navItems = [
    { name: 'Dashboard', path: '/admin', icon: <FaTachometerAlt />, exact: true },
    { name: 'Admissions Inquiries', path: '/admin/admissions', icon: <FaUserGraduate /> },
    { name: 'Faculty', path: '/admin/faculty', icon: <FaUsers /> },
    { name: 'Gallery', path: '/admin/gallery', icon: <FaImages /> },
    { name: 'News', path: '/admin/news', icon: <FaRegNewspaper /> },
    { name: 'Events', path: '/admin/events', icon: <FaCalendarAlt /> },
    { name: 'Messages', path: '/admin/contact', icon: <FaEnvelope /> },
    { name: 'Manage Admissions', path: '/admin/manage-admissions', icon: <FaUserGraduate /> },
    { name: 'Manage Home', path: '/admin/home', icon: <FaHome /> },
    { name: 'Manage About', path: '/admin/about', icon: <FaInfoCircle /> },
    { name: 'Manage Academics', path: '/admin/academics', icon: <FaBook /> },
    { name: 'Settings', path: '/admin/settings', icon: <FaCog /> },
  ];

  return (
    <div className="flex h-screen bg-[#0A1128] text-white font-sans overflow-hidden">
      
      {/* Sidebar */}
      <aside className="w-64 bg-[#0A1128] border-r border-white/5 flex flex-col flex-shrink-0">
        
        {/* Brand */}
        <div className="h-20 flex items-center px-6 border-b border-white/5 py-4">
          <Link to="/" className="flex items-center gap-3 font-bold tracking-tight text-white" title="Go to Website">
            <img 
              src="https://res.cloudinary.com/dcsngtknz/image/upload/v1781580525/IMG-20260616-WA0000_ckiv3k.jpg" 
              alt="VEMS Logo" 
              className="h-12 w-auto object-contain rounded-full bg-white/10 p-1 transition-all" 
            />
            <div className="flex flex-col">
              <span className="text-sm font-bold leading-tight"><span className="text-accentGold">Vivekananda</span> School</span>
              <span className="text-[10px] text-textSecondary font-bold tracking-widest uppercase mt-0.5">Admin Portal</span>
            </div>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-6 px-4 flex flex-col gap-1 custom-scrollbar">
          {navItems.map((item) => {
            const isActive = item.exact 
              ? location.pathname === item.path 
              : location.pathname.startsWith(item.path);

            return (
              <NavLink
                key={item.name}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                  isActive 
                    ? 'bg-blue-600 text-white' 
                    : 'text-textSecondary hover:text-white hover:bg-white/5'
                }`}
              >
                <span className="text-lg">{item.icon}</span>
                {item.name}
              </NavLink>
            );
          })}
        </nav>

        {/* Admin User Profile & Theme Toggle */}
        <div className="p-4 border-t border-white/5 flex flex-col gap-3">
          <div className="flex items-center justify-between px-2 text-[10px] text-textSecondary font-bold uppercase tracking-wider">
            <span>Theme Mode</span>
            <button 
              onClick={() => setIsDarkMode(!isDarkMode)}
              className="text-textSecondary hover:text-accentGold transition-colors p-1.5 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center animate-pulse-subtle"
              aria-label="Toggle Theme"
            >
              {isDarkMode ? <FaSun size={12} /> : <FaMoon size={12} />}
            </button>
          </div>
          
          <div 
            onClick={handleLogout}
            className="flex items-center justify-between hover:bg-red-100/50 dark:hover:bg-red-900/20 p-2 rounded-lg cursor-pointer transition-colors group"
            title="Click to Logout"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gray-600 overflow-hidden flex items-center justify-center flex-shrink-0 border border-white/10">
                <img 
                  src={profile.avatarUrl || "https://i.pravatar.cc/150?u=admin"} 
                  alt="Admin Avatar" 
                  className="w-full h-full object-cover" 
                />
              </div>
              <div className="text-left">
                <p className="text-xs font-bold truncate max-w-[120px] text-white group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors">{profile.username}</p>
                <p className="text-[10px] text-textSecondary group-hover:text-red-600/80 dark:group-hover:text-red-400/80 transition-colors">Click to Logout</p>
              </div>
            </div>
            <FaSignOutAlt className="text-textSecondary group-hover:text-red-600 dark:group-hover:text-red-400 text-xs transition-colors" />
          </div>
        </div>

      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden bg-[#0A1128]">
        <div className="flex-1 overflow-y-auto custom-scrollbar p-6">
          <Outlet />
        </div>
      </main>

    </div>
  );
};

export default AdminLayout;
