import React, { useState, useEffect } from 'react';
import { 
  FaUserGraduate, FaPhoneAlt, FaEnvelope, FaRegCalendarAlt, FaTrash, FaCheck, FaTimes, 
  FaSearch, FaSpinner, FaEdit, FaSave, FaPlus, FaInfoCircle, FaClipboardList, FaMedal, FaUsers, FaFileAlt, FaQuestionCircle, FaBell
} from 'react-icons/fa';
import api from '../../services/api';

const iconOptions = [
  { value: 'FaClipboardList', label: 'Clipboard' },
  { value: 'FaSearch', label: 'Search' },
  { value: 'FaUsers', label: 'Users' },
  { value: 'FaMedal', label: 'Medal' },
  { value: 'FaUserGraduate', label: 'Graduate' },
  { value: 'FaFileAlt', label: 'File' },
  { value: 'FaCheckCircle', label: 'Check Circle' }
];

const ManageAdmissionsContent = () => {
  
  const [activeContentTab, setActiveContentTab] = useState('hero'); // 'hero' | 'process' | 'criteria' | 'faqs'
  
  // INQUIRIES STATE
  

  // CONTENT STATE
  const [loadingContent, setLoadingContent] = useState(false);
  const [savingContent, setSavingContent] = useState(false);
  const [formData, setFormData] = useState({
    hero: { badgeText: '', titleLine1: '', titleLine2: '', description: '', bgImageUrl: '', studentsImageUrl: '' },
    process: [],
    criteria: [],
    faqs: [],
    alerts: [],
    admissionBanner: { title: '', subtitle: '', isActive: true }
  });

  useEffect(() => {
    
    fetchContentSettings();
  }, []);

  const fetchContentSettings = async () => {
    setLoadingContent(true);
    try {
      const { data } = await api.get('/admissions-settings');
      if (data && data.hero) {
        setFormData(data);
      } else {
        throw new Error('Data empty');
      }
    } catch (err) {
      console.error('Failed to load admissions settings, using defaults:', err);
      setFormData({
        hero: {
          badgeText: "ADMISSIONS OPEN 2025-26",
          titleLine1: "Join Our",
          titleLine2: "Learning Community",
          description: "At Vivekananda E.M High School, we nurture young minds to become confident, responsible and future-ready citizens.",
          bgImageUrl: "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=1920&q=80",
          studentsImageUrl: "https://images.unsplash.com/photo-1529390079861-591de354faf5?auto=format&fit=crop&w=800&q=80"
        },
        process: [
          { icon: "FaClipboardList", title: "Apply", description: "Fill out the online admission application form with required details." },
          { icon: "FaSearch", title: "Review", description: "Our admission team will review your application and documents." },
          { icon: "FaUsers", title: "Interview", description: "A brief interaction with the student and parents will be scheduled." },
          { icon: "FaMedal", title: "Admission", description: "Selected candidates will receive the admission offer." }
        ],
        criteria: [
          { 
            icon: "FaUserGraduate", 
            title: "Eligibility Criteria", 
            description: "Age criteria as per the class applied\nPrevious academic records\nGood conduct & discipline\nBased on seat availability" 
          },
          { 
            icon: "FaFileAlt", 
            title: "Required Documents", 
            description: "Birth Certificate (Student)\nAadhaar Card (Student)\nPrevious School Report Card\nTransfer Certificate (if applicable)\nPassport Size Photographs (2)\nAddress Proof\nParent/Guardian ID Proof" 
          },
          { 
            icon: "FaBell", 
            title: "Important Notes", 
            description: "Incomplete applications will not be processed.\nAdmission is subject to seat availability.\nManagement decision will be final." 
          }
        ],
        faqs: [
          { question: "What is the age criteria for admission?", answer: "The age criteria vary by class. Generally, a child should be 5+ years old for Class I." },
          { question: "How can I apply for admission?", answer: "You can apply online through this admission form or visit the school office." },
          { question: "Is there an entrance test?", answer: "Yes, for classes VI and above, a basic proficiency test is conducted." },
          { question: "What are the school timings?", answer: "The regular school timings are from 8:00 AM to 3:00 PM, Monday to Saturday." },
          { question: "What documents are required?", answer: "Birth certificate, previous school records, Aadhaar card, and passport-size photographs." }
        ],
        alerts: [
          { text: "Admissions for academic year 2025-26 are now open. Apply before limited seats fill up!", isActive: true }
        ],
        admissionBanner: {
          title: "ADMISSIONS OPEN FOR 2025-26",
          subtitle: "Give your child the best start for a bright future.",
          isActive: true
        }
      });
    } finally {
      setLoadingContent(false);
    }
  };

  const handleSaveContent = async () => {
    setSavingContent(true);
    try {
      await api.put('/admissions-settings', formData);
      alert('Admissions settings updated successfully!');
    } catch (err) {
      console.error('Failed to update admissions settings:', err);
      alert('Failed to update settings. Check console.');
    } finally {
      setSavingContent(false);
    }
  };

  const updateHero = (field, value) => setFormData({ ...formData, hero: { ...formData.hero, [field]: value } });
  
  const updateAdmissionBanner = (field, value) => setFormData({ ...formData, admissionBanner: { ...formData.admissionBanner, [field]: value } });

  const updateArray = (arrayName, index, field, value) => {
    const newArr = [...formData[arrayName]];
    newArr[index][field] = value;
    setFormData({ ...formData, [arrayName]: newArr });
  };
  
  const removeFromArray = (arrayName, index) => {
    const newArr = [...formData[arrayName]];
    newArr.splice(index, 1);
    setFormData({ ...formData, [arrayName]: newArr });
  };
  
  const addToArray = (arrayName, defaultObj) => {
    setFormData({ ...formData, [arrayName]: [...formData[arrayName], defaultObj] });
  };




  return (
    <div className="flex flex-col gap-6 w-full pb-10 text-white">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Manage Admissions</h1>
          <p className="text-sm text-textSecondary font-medium">Home / Admissions / Management</p>
        </div>

        
          <button 
            onClick={handleSaveContent} 
            disabled={savingContent}
            className="bg-accentGold text-darkBg px-6 py-2 rounded font-bold hover:bg-accentGoldDark transition-colors flex items-center gap-2 h-fit"
          >
            {savingContent ? <FaSpinner className="animate-spin" /> : <FaSave />}
            {savingContent ? 'Saving...' : 'Save Content'}
          </button>
      </div>
      
      
        <div className="bg-darkCard rounded-xl border border-white/10 overflow-hidden">
          {/* Sub Tabs */}
          <div className="flex border-b border-white/10 overflow-x-auto custom-scrollbar">
            <button onClick={() => setActiveContentTab('hero')} className={`px-6 py-4 font-bold flex items-center gap-2 whitespace-nowrap ${activeContentTab === 'hero' ? 'border-b-2 border-accentGold text-accentGold bg-white/5' : 'text-textSecondary hover:text-white'}`}>
              <FaEdit /> Hero Section
            </button>
            <button onClick={() => setActiveContentTab('process')} className={`px-6 py-4 font-bold flex items-center gap-2 whitespace-nowrap ${activeContentTab === 'process' ? 'border-b-2 border-accentGold text-accentGold bg-white/5' : 'text-textSecondary hover:text-white'}`}>
              <FaClipboardList /> Process Steps
            </button>
            <button onClick={() => setActiveContentTab('criteria')} className={`px-6 py-4 font-bold flex items-center gap-2 whitespace-nowrap ${activeContentTab === 'criteria' ? 'border-b-2 border-accentGold text-accentGold bg-white/5' : 'text-textSecondary hover:text-white'}`}>
              <FaInfoCircle /> Criteria Cards
            </button>
            <button onClick={() => setActiveContentTab('faqs')} className={`px-6 py-4 font-bold flex items-center gap-2 whitespace-nowrap ${activeContentTab === 'faqs' ? 'border-b-2 border-accentGold text-accentGold bg-white/5' : 'text-textSecondary hover:text-white'}`}>
              <FaQuestionCircle /> FAQs
            </button>
            <button onClick={() => setActiveContentTab('alerts')} className={`px-6 py-4 font-bold flex items-center gap-2 whitespace-nowrap ${activeContentTab === 'alerts' ? 'border-b-2 border-accentGold text-accentGold bg-white/5' : 'text-textSecondary hover:text-white'}`}>
              <FaBell /> Alerts & Notifications
            </button>
          </div>

          <div className="p-6">
            {loadingContent ? (
              <div className="flex justify-center py-20 text-accentGold"><FaSpinner className="animate-spin text-4xl" /></div>
            ) : (
              <>
                {/* HERO SECTION */}
                {activeContentTab === 'hero' && (
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-bold text-textSecondary mb-2">Badge Text</label>
                      <input type="text" value={formData.hero?.badgeText || ''} onChange={(e) => updateHero('badgeText', e.target.value)} className="w-full bg-darkBg border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-accentGold" />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-bold text-textSecondary mb-2">Title Line 1</label>
                        <input type="text" value={formData.hero?.titleLine1 || ''} onChange={(e) => updateHero('titleLine1', e.target.value)} className="w-full bg-darkBg border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-accentGold" />
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-textSecondary mb-2">Title Line 2</label>
                        <input type="text" value={formData.hero?.titleLine2 || ''} onChange={(e) => updateHero('titleLine2', e.target.value)} className="w-full bg-darkBg border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-accentGold" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-textSecondary mb-2">Description</label>
                      <textarea rows="3" value={formData.hero?.description || ''} onChange={(e) => updateHero('description', e.target.value)} className="w-full bg-darkBg border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-accentGold"></textarea>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-bold text-textSecondary mb-2">Background Image URL</label>
                        <input type="text" value={formData.hero?.bgImageUrl || ''} onChange={(e) => updateHero('bgImageUrl', e.target.value)} className="w-full bg-darkBg border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-accentGold" />
                        {formData.hero?.bgImageUrl && <img src={formData.hero.bgImageUrl} alt="Bg Preview" className="mt-4 h-24 rounded object-cover border border-white/10" />}
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-textSecondary mb-2">Students Image URL</label>
                        <input type="text" value={formData.hero?.studentsImageUrl || ''} onChange={(e) => updateHero('studentsImageUrl', e.target.value)} className="w-full bg-darkBg border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-accentGold" />
                        {formData.hero?.studentsImageUrl && <img src={formData.hero.studentsImageUrl} alt="Students Preview" className="mt-4 h-24 rounded object-cover border border-white/10 bg-white/5" />}
                      </div>
                    </div>
                  </div>
                )}

                {/* PROCESS STEPS */}
                {activeContentTab === 'process' && (
                  <div>
                    <div className="flex justify-end mb-4">
                      <button onClick={() => addToArray('process', { icon: 'FaCheckCircle', title: 'New Step', description: 'Description' })} className="bg-white/10 text-white px-4 py-2 rounded flex items-center gap-2 hover:bg-white/20 transition-colors text-sm font-bold">
                        <FaPlus /> Add Step
                      </button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {formData.process?.map((item, index) => (
                        <div key={index} className="bg-darkBg p-4 rounded-lg border border-white/5 relative">
                          <button onClick={() => removeFromArray('process', index)} className="absolute top-2 right-2 text-red-500 hover:bg-red-500/20 p-1.5 rounded text-sm transition-colors">
                            <FaTrash />
                          </button>
                          <div className="space-y-3 mt-2">
                            <div>
                              <label className="block text-xs font-bold text-textSecondary mb-1">Icon</label>
                              <select value={item.icon || ''} onChange={(e) => updateArray('process', index, 'icon', e.target.value)} className="w-full bg-darkCard border border-white/10 rounded px-3 py-2 text-white text-sm focus:outline-none focus:border-accentGold">
                                {iconOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                              </select>
                            </div>
                            <div>
                              <label className="block text-xs font-bold text-textSecondary mb-1">Title</label>
                              <input type="text" value={item.title || ''} onChange={(e) => updateArray('process', index, 'title', e.target.value)} className="w-full bg-darkCard border border-white/10 rounded px-3 py-2 text-white text-sm focus:outline-none focus:border-accentGold" />
                            </div>
                            <div>
                              <label className="block text-xs font-bold text-textSecondary mb-1">Description</label>
                              <textarea rows="2" value={item.description || ''} onChange={(e) => updateArray('process', index, 'description', e.target.value)} className="w-full bg-darkCard border border-white/10 rounded px-3 py-2 text-white text-sm focus:outline-none focus:border-accentGold"></textarea>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* CRITERIA */}
                {activeContentTab === 'criteria' && (
                  <div>
                    <div className="flex justify-end mb-4">
                      <button onClick={() => addToArray('criteria', { icon: 'FaCheckCircle', title: 'New Criteria', description: 'Description' })} className="bg-white/10 text-white px-4 py-2 rounded flex items-center gap-2 hover:bg-white/20 transition-colors text-sm font-bold">
                        <FaPlus /> Add Criteria
                      </button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {formData.criteria?.map((item, index) => (
                        <div key={index} className="bg-darkBg p-4 rounded-lg border border-white/5 relative">
                          <button onClick={() => removeFromArray('criteria', index)} className="absolute top-2 right-2 text-red-500 hover:bg-red-500/20 p-1.5 rounded text-sm transition-colors">
                            <FaTrash />
                          </button>
                          <div className="space-y-3 mt-2">
                            <div>
                              <label className="block text-xs font-bold text-textSecondary mb-1">Icon</label>
                              <select value={item.icon || ''} onChange={(e) => updateArray('criteria', index, 'icon', e.target.value)} className="w-full bg-darkCard border border-white/10 rounded px-3 py-2 text-white text-sm focus:outline-none focus:border-accentGold">
                                {iconOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                              </select>
                            </div>
                            <div>
                              <label className="block text-xs font-bold text-textSecondary mb-1">Title</label>
                              <input type="text" value={item.title || ''} onChange={(e) => updateArray('criteria', index, 'title', e.target.value)} className="w-full bg-darkCard border border-white/10 rounded px-3 py-2 text-white text-sm focus:outline-none focus:border-accentGold" />
                            </div>
                            <div>
                              <label className="block text-xs font-bold text-textSecondary mb-1">Description</label>
                              <textarea rows="2" value={item.description || ''} onChange={(e) => updateArray('criteria', index, 'description', e.target.value)} className="w-full bg-darkCard border border-white/10 rounded px-3 py-2 text-white text-sm focus:outline-none focus:border-accentGold"></textarea>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* FAQS */}
                {activeContentTab === 'faqs' && (
                  <div>
                    <div className="flex justify-end mb-4">
                      <button onClick={() => addToArray('faqs', { question: 'New Question?', answer: 'Answer' })} className="bg-white/10 text-white px-4 py-2 rounded flex items-center gap-2 hover:bg-white/20 transition-colors text-sm font-bold">
                        <FaPlus /> Add FAQ
                      </button>
                    </div>
                    <div className="space-y-4">
                      {formData.faqs?.map((item, index) => (
                        <div key={index} className="bg-darkBg p-4 rounded-lg border border-white/5 relative flex gap-4">
                          <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-xs font-bold text-textSecondary mb-1">Question</label>
                              <input type="text" value={item.question || ''} onChange={(e) => updateArray('faqs', index, 'question', e.target.value)} className="w-full bg-darkCard border border-white/10 rounded px-3 py-2 text-white text-sm focus:outline-none focus:border-accentGold" />
                            </div>
                            <div>
                              <label className="block text-xs font-bold text-textSecondary mb-1">Answer</label>
                              <textarea rows="2" value={item.answer || ''} onChange={(e) => updateArray('faqs', index, 'answer', e.target.value)} className="w-full bg-darkCard border border-white/10 rounded px-3 py-2 text-white text-sm focus:outline-none focus:border-accentGold"></textarea>
                            </div>
                          </div>
                          <button onClick={() => removeFromArray('faqs', index)} className="text-red-500 hover:bg-red-500/20 p-2 rounded h-fit">
                            <FaTrash />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* ALERTS */}
                {activeContentTab === 'alerts' && (
                  <div className="space-y-12">
                    
                    {/* Main Admission Banner */}
                    <div className="bg-darkBg p-6 rounded-xl border border-white/10">
                      <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2"><FaBell className="text-accentGold" /> Main Admission Banner</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                          <label className="block text-xs font-bold text-textSecondary mb-1">Banner Title</label>
                          <input type="text" value={formData.admissionBanner?.title || ''} onChange={(e) => updateAdmissionBanner('title', e.target.value)} className="w-full bg-darkCard border border-white/10 rounded px-3 py-2 text-white text-sm focus:outline-none focus:border-accentGold" />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-textSecondary mb-1">Banner Subtitle</label>
                          <input type="text" value={formData.admissionBanner?.subtitle || ''} onChange={(e) => updateAdmissionBanner('subtitle', e.target.value)} className="w-full bg-darkCard border border-white/10 rounded px-3 py-2 text-white text-sm focus:outline-none focus:border-accentGold" />
                        </div>
                      </div>
                      <div className="flex items-center justify-between border border-white/10 p-3 rounded bg-darkCard w-fit min-w-[200px]">
                        <span className="text-sm font-bold text-white">Show Banner</span>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input type="checkbox" checked={formData.admissionBanner?.isActive} onChange={(e) => updateAdmissionBanner('isActive', e.target.checked)} className="sr-only peer" />
                          <div className="w-11 h-6 bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-500"></div>
                        </label>
                      </div>
                    </div>

                    <div className="border-t border-white/10 pt-8">
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-bold text-white flex items-center gap-2"><FaInfoCircle className="text-accentGold" /> Additional Alerts</h3>
                        <button onClick={() => addToArray('alerts', { text: 'New Alert Message', isActive: true })} className="bg-white/10 text-white px-4 py-2 rounded flex items-center gap-2 hover:bg-white/20 transition-colors text-sm font-bold">
                          <FaPlus /> Add Alert
                        </button>
                      </div>
                    <div className="space-y-4">
                      {formData.alerts?.map((item, index) => (
                        <div key={index} className="bg-darkBg p-4 rounded-lg border border-white/5 relative flex gap-4">
                          <div className="flex-1 flex flex-col gap-4">
                            <div>
                              <label className="block text-xs font-bold text-textSecondary mb-1">Alert Text</label>
                              <input type="text" value={item.text || ''} onChange={(e) => updateArray('alerts', index, 'text', e.target.value)} className="w-full bg-darkCard border border-white/10 rounded px-3 py-2 text-white text-sm focus:outline-none focus:border-accentGold" />
                            </div>
                            <div className="flex items-center justify-between border border-white/10 p-3 rounded bg-darkCard w-fit min-w-[200px]">
                              <span className="text-sm font-bold text-white">Active</span>
                              <label className="relative inline-flex items-center cursor-pointer">
                                <input type="checkbox" checked={item.isActive} onChange={(e) => updateArray('alerts', index, 'isActive', e.target.checked)} className="sr-only peer" />
                                <div className="w-11 h-6 bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-500"></div>
                              </label>
                            </div>
                          </div>
                          <button onClick={() => removeFromArray('alerts', index)} className="text-red-500 hover:bg-red-500/20 p-2 rounded h-fit">
                            <FaTrash />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                 </div>
                )}
              </>
            )}
          </div>
        </div>
    </div>
  );
};

export default ManageAdmissionsContent;
