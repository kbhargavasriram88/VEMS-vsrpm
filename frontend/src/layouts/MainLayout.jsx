import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { FaWhatsapp, FaTools } from 'react-icons/fa';
import api from '../services/api';
import WelcomeModal from '../components/home/WelcomeModal';

const MainLayout = () => {
  const [isMaintenance, setIsMaintenance] = useState(false);
  const [welcomeModalSettings, setWelcomeModalSettings] = useState(null);
  const [whatsappNumber, setWhatsappNumber] = useState('1234567890');

  useEffect(() => {
    const checkSettings = async () => {
      try {
        const [genRes, homeRes] = await Promise.all([
          api.get('/general-settings').catch(() => ({ data: {} })),
          api.get('/home-settings').catch(() => ({ data: {} }))
        ]);
        
        if (genRes.data) {
          if (genRes.data.maintenanceMode !== undefined) {
            setIsMaintenance(genRes.data.maintenanceMode);
          }
          if (genRes.data.whatsappNumber) {
            setWhatsappNumber(genRes.data.whatsappNumber);
          }
          if (genRes.data.schoolLogoUrl) {
            const favicon = document.querySelector('link[rel="icon"]');
            const appleIcon = document.querySelector('link[rel="apple-touch-icon"]');
            if (favicon) favicon.href = genRes.data.schoolLogoUrl;
            if (appleIcon) appleIcon.href = genRes.data.schoolLogoUrl;
          }
        }

        if (homeRes.data && homeRes.data.welcomeModal) {
          setWelcomeModalSettings(homeRes.data.welcomeModal);
        }
      } catch (e) {
        console.error('Failed to fetch settings', e);
      }
    };
    
    checkSettings();
    window.addEventListener('school-settings-updated', checkSettings);
    
    return () => {
      window.removeEventListener('school-settings-updated', checkSettings);
    };
  }, []);

  if (isMaintenance) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-darkBg text-white p-6 text-center relative overflow-hidden">
        {/* Glow Backgrounds */}
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-blue-900/10 blur-[40px] pointer-events-none z-0"></div>
        <div className="absolute top-[20%] right-[-10%] w-[600px] h-[600px] rounded-full bg-amber-500/5 blur-[50px] pointer-events-none z-0"></div>
        
        <div className="relative z-10 flex flex-col items-center gap-6 max-w-lg">
          <div className="w-24 h-24 bg-darkCard border border-white/10 rounded-full flex items-center justify-center text-4xl text-accentGold mb-4 shadow-lg">
            <FaTools />
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-white">Under Maintenance</h1>
          <p className="text-textSecondary text-lg leading-relaxed">
            We are currently upgrading our systems to provide you with a better experience. 
            Please check back soon.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-darkBg text-white relative overflow-clip">
      
      {/* Decorative Glow Backgrounds */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-blue-900/10 blur-[40px] pointer-events-none z-0"></div>
      <div className="absolute top-[20%] right-[-10%] w-[600px] h-[600px] rounded-full bg-amber-500/5 blur-[50px] pointer-events-none z-0"></div>

      <div className="relative z-10 flex flex-col min-h-screen">
        <Navbar />
        {welcomeModalSettings && <WelcomeModal settings={welcomeModalSettings} />}
        <main className="flex-grow">
          <Outlet />
        </main>
        <Footer />
      </div>

      {/* Floating WhatsApp Widget */}
      <a 
        href={`https://wa.me/${whatsappNumber.replace(/[^0-9]/g, '')}`} 
        target="_blank" 
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 sm:bottom-8 sm:right-8 z-50 bg-whatsappGreen text-white p-3 sm:p-4 rounded-full shadow-greenGlow hover:scale-110 transition-transform duration-300 cursor-pointer"
        aria-label="Chat with us on WhatsApp"
      >
        <FaWhatsapp className="text-2xl sm:text-[28px]" />
      </a>
    </div>
  );
};

export default MainLayout;
