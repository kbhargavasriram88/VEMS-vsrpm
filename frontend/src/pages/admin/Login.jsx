import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaEnvelope, FaLock, FaSignInAlt, FaSpinner, FaSchool, FaEye, FaEyeSlash } from 'react-icons/fa';
import api from '../../services/api';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [schoolLogoUrl, setSchoolLogoUrl] = useState('https://res.cloudinary.com/dcsngtknz/image/upload/v1781580525/IMG-20260616-WA0000_ckiv3k.jpg');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const { data } = await api.get('/general-settings');
        if (data && data.schoolLogoUrl) {
          setSchoolLogoUrl(data.schoolLogoUrl);
        }
      } catch (e) {
        console.error('Error fetching login layout settings:', e);
      }
    };
    fetchSettings();
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    
    try {
      const { data } = await api.post('/auth/login', { email, password });
      sessionStorage.setItem('adminToken', data.token);
      sessionStorage.setItem('adminUserEmail', data.email);
      navigate('/admin');
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Invalid email or password');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0A1128] text-white p-6 relative overflow-hidden select-none">
      
      {/* Decorative Blur Orbs */}
      <div className="absolute w-96 h-96 bg-blue-600/10 rounded-full blur-[35px] -top-20 -left-20 pointer-events-none"></div>
      <div className="absolute w-96 h-96 bg-yellow-500/5 rounded-full blur-[40px] -bottom-20 -right-20 pointer-events-none"></div>

      <div className="bg-[#111A36] border border-white/10 p-8 sm:p-10 rounded-2xl w-full max-w-md relative z-10 flex flex-col gap-6 shadow-[0_0_60px_rgba(37,99,235,0.4)] hover:shadow-[0_0_100px_rgba(37,99,235,0.6)] transition-shadow duration-500">
        
        {/* Brand Header */}
        <div className="flex flex-col items-center gap-2.5 text-center">
          <div className="w-16 h-16 rounded-full overflow-hidden bg-white/10 p-1 mb-1 shadow-lg border border-white/5">
            <img src={schoolLogoUrl} alt="VEMS Logo" className="w-full h-full object-contain rounded-full" />
          </div>
          <div>
            <h2 className="text-lg font-black tracking-wide uppercase text-white">VIVEKANANDA</h2>
            <p className="text-sm text-yellow-500 font-bold tracking-widest uppercase mt-0.5">Admin Portal</p>
          </div>
        </div>

        {/* Error Notice */}
        {error && (
          <div className="bg-red-900/30 border border-red-500/30 text-red-400 p-3.5 rounded-lg text-base font-semibold text-center leading-relaxed">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleLogin} className="flex flex-col gap-4">
          
          {/* Email Input */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-bold text-textSecondary uppercase tracking-wider">Email Address</label>
            <div className="relative">
              <input 
                type="email" 
                placeholder="Enter admin email"
                required
                className="w-full bg-[#0A1128] border border-white/10 rounded-lg pl-10 pr-4 py-3.5 text-base text-white focus:border-blue-400 focus:shadow-[0_0_25px_rgba(59,130,246,0.8)] placeholder-white/20 outline-none transition-all duration-300" 
                value={email} 
                onChange={e => setEmail(e.target.value)} 
              />
              <FaEnvelope className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/30 text-base" />
            </div>
          </div>
 
          {/* Password Input */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-bold text-textSecondary uppercase tracking-wider">Password</label>
            <div className="relative">
              <input 
                type={showPassword ? "text" : "password"} 
                placeholder="••••••••"
                required
                className="w-full bg-[#0A1128] border border-white/10 rounded-lg pl-10 pr-12 py-3.5 text-base text-white focus:border-blue-400 focus:shadow-[0_0_25px_rgba(59,130,246,0.8)] placeholder-white/20 outline-none transition-all duration-300" 
                value={password} 
                onChange={e => setPassword(e.target.value)} 
              />
              <FaLock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/30 text-base" />
              <button 
                type="button" 
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white/70 hover:text-white transition-colors cursor-pointer"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button 
            type="submit" 
            disabled={submitting}
            className="bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-bold py-3.5 rounded-lg text-base transition-all duration-300 w-full flex items-center justify-center gap-2 mt-2 shadow-[0_0_20px_rgba(37,99,235,0.6)] hover:shadow-[0_0_35px_rgba(59,130,246,0.9)] cursor-pointer"
          >
            {submitting ? (
              <>
                <FaSpinner className="animate-spin" /> Authenticating...
              </>
            ) : (
              <>
                <FaSignInAlt /> Login to Dashboard
              </>
            )}
          </button>
        </form>

        {/* Access info block */}


      </div>
    </div>
  );
};

export default Login;
