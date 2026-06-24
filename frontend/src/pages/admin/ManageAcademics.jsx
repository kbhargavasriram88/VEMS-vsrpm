import React, { useState, useEffect } from 'react';
import { 
  FaInfoCircle, FaImage, FaEdit, FaSave, FaSpinner, FaPlus, FaTrash,
  FaBookOpen, FaUserGraduate, FaChalkboardTeacher, FaUsers, FaLightbulb, FaCheckCircle
} from 'react-icons/fa';
import api from '../../services/api';

const iconOptions = [
  { value: 'FaUsers', label: 'Users' },
  { value: 'FaChalkboardTeacher', label: 'Teacher' },
  { value: 'FaLightbulb', label: 'Lightbulb' },
  { value: 'FaCheckCircle', label: 'Check Circle' },
  { value: 'FaBookOpen', label: 'Book' },
  { value: 'FaUserGraduate', label: 'Graduate' }
];

const ManageAcademics = () => {
  const [activeTab, setActiveTab] = useState('hero');
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  
  const [formData, setFormData] = useState({
    hero: { title: '', description: '', imageUrl: '' },
    programs: {
      primary: { title: '', subtitle: '', description: '', imageUrl: '', features: [] },
      secondary: { title: '', subtitle: '', description: '', imageUrl: '', features: [] }
    },
    methodologies: [],
    examinationProcess: []
  });

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/academics-settings');
      if (data && data.hero) {
        setFormData(data);
      } else {
        throw new Error('Data empty');
      }
    } catch (err) {
      console.error('Failed to load academics settings, using defaults:', err);
      // Use defaults if backend fails
      setFormData({
        hero: {
          title: "Academic <br/> Excellence",
          description: "Our academic programs are designed to cultivate curiosity, critical thinking, and a lifelong love for learning.",
          imageUrl: "https://images.unsplash.com/photo-1532012197267-da84d127e765?auto=format&fit=crop&w=1200&q=80"
        },
        programs: {
          primary: {
            icon: 'FaUserGraduate',
            title: 'Primary School', subtitle: 'Classes I - V',
            description: 'Building strong foundations with joy, creativity and conceptual learning.',
            imageUrl: "https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=800&q=80",
            features: [
              "Focus on foundational literacy and numeracy",
              "Activity-based and experiential learning",
              "Moral values and basic life skills",
              "Co-curricular and art integration",
              "Safe, inclusive and joyful environment"
            ]
          },
          secondary: {
            icon: 'FaBookOpen',
            title: 'Secondary School', subtitle: 'Classes VI - X',
            description: 'Focused on skill development, critical thinking and academic growth.',
            imageUrl: "https://images.unsplash.com/photo-1577896851231-70ef18881754?auto=format&fit=crop&w=800&q=80",
            features: [
              "Focused on concept clarity, logical analysis and critical thinking",
              "Advanced science laboratory experiments and computer classes",
              "Preparation for standard board examinations and external talent tests",
              "Active participation in sports leagues, debate clubs, and performing arts",
              "Core values, leadership training, and foundation for higher study streams"
            ]
          }
        },
        methodologies: [
          { icon: "FaUsers", title: "Student-Centered <br/> Learning", description: "Engaging students through participation and collaboration." },
          { icon: "FaChalkboardTeacher", title: "Interactive Classroom <br/> Sessions", description: "Technology-enabled classrooms for better understanding." },
          { icon: "FaLightbulb", title: "Experiential <br/> Learning", description: "Learning by doing through activities and projects." },
          { icon: "FaCheckCircle", title: "Holistic <br/> Development", description: "Focus on academic, emotional, social and physical growth." }
        ],
        examinationProcess: [
          { title: "Preparation", description: "Syllabus planning, study material and doubt clearing sessions." },
          { title: "Internal Assessments", description: "Regular tests, assignments and practical evaluations." },
          { title: "Term Examinations", description: "Periodic exams to assess concept understanding." },
          { title: "Result Analysis", description: "Performance analysis and progress reports." },
          { title: "Parent Interaction", description: "Meetings and feedback for overall development." }
        ]
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await api.put('/academics-settings', formData);
      alert('Academics settings updated successfully!');
    } catch (err) {
      console.error('Failed to update academics settings:', err);
      alert('Failed to update settings. Check console.');
    } finally {
      setSaving(false);
    }
  };

  const updateHero = (field, value) => {
    setFormData({ ...formData, hero: { ...formData.hero, [field]: value } });
  };

  const updateProgram = (level, field, value) => {
    setFormData({
      ...formData,
      programs: {
        ...formData.programs,
        [level]: { ...formData.programs[level], [field]: value }
      }
    });
  };

  const updateProgramFeature = (level, index, value) => {
    const updatedFeatures = [...formData.programs[level].features];
    updatedFeatures[index] = value;
    updateProgram(level, 'features', updatedFeatures);
  };

  const addProgramFeature = (level) => {
    const updatedFeatures = [...formData.programs[level].features, 'New Feature'];
    updateProgram(level, 'features', updatedFeatures);
  };

  const removeProgramFeature = (level, index) => {
    const updatedFeatures = [...formData.programs[level].features];
    updatedFeatures.splice(index, 1);
    updateProgram(level, 'features', updatedFeatures);
  };

  const addMethodology = () => {
    setFormData({
      ...formData,
      methodologies: [...formData.methodologies, { icon: 'FaLightbulb', title: 'New Method', description: 'Description' }]
    });
  };

  const updateMethodology = (index, field, value) => {
    const newMethods = [...formData.methodologies];
    newMethods[index][field] = value;
    setFormData({ ...formData, methodologies: newMethods });
  };

  const removeMethodology = (index) => {
    const newMethods = [...formData.methodologies];
    newMethods.splice(index, 1);
    setFormData({ ...formData, methodologies: newMethods });
  };

  const addExamStep = () => {
    setFormData({
      ...formData,
      examinationProcess: [...formData.examinationProcess, { title: 'New Step', description: 'Description' }]
    });
  };

  const updateExamStep = (index, field, value) => {
    const newSteps = [...formData.examinationProcess];
    newSteps[index][field] = value;
    setFormData({ ...formData, examinationProcess: newSteps });
  };

  const removeExamStep = (index) => {
    const newSteps = [...formData.examinationProcess];
    newSteps.splice(index, 1);
    setFormData({ ...formData, examinationProcess: newSteps });
  };

  if (loading) return <div className="flex justify-center py-20 text-accentGold"><FaSpinner className="animate-spin text-4xl" /></div>;

  return (
    <div className="bg-darkBg min-h-screen text-white">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Manage Academics Page</h1>
          <p className="text-textSecondary">Update content for the Academics page.</p>
        </div>
        <button 
          onClick={handleSave} 
          disabled={saving}
          className="bg-accentGold text-darkBg px-6 py-2 rounded font-bold hover:bg-accentGoldDark transition-colors flex items-center gap-2"
        >
          {saving ? <FaSpinner className="animate-spin" /> : <FaSave />}
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>

      <div className="bg-darkCard rounded-xl border border-white/10 overflow-hidden mb-8">
        <div className="flex border-b border-white/10">
          <button onClick={() => setActiveTab('hero')} className={`px-6 py-4 font-bold flex items-center gap-2 ${activeTab === 'hero' ? 'border-b-2 border-accentGold text-accentGold bg-white/5' : 'text-textSecondary hover:text-white'}`}>
            <FaEdit /> Hero Section
          </button>
          <button onClick={() => setActiveTab('programs')} className={`px-6 py-4 font-bold flex items-center gap-2 ${activeTab === 'programs' ? 'border-b-2 border-accentGold text-accentGold bg-white/5' : 'text-textSecondary hover:text-white'}`}>
            <FaInfoCircle /> Programs & Curriculum
          </button>
          <button onClick={() => setActiveTab('methodologies')} className={`px-6 py-4 font-bold flex items-center gap-2 ${activeTab === 'methodologies' ? 'border-b-2 border-accentGold text-accentGold bg-white/5' : 'text-textSecondary hover:text-white'}`}>
            <FaChalkboardTeacher /> Methodologies
          </button>
          <button onClick={() => setActiveTab('examination')} className={`px-6 py-4 font-bold flex items-center gap-2 ${activeTab === 'examination' ? 'border-b-2 border-accentGold text-accentGold bg-white/5' : 'text-textSecondary hover:text-white'}`}>
            <FaCheckCircle /> Examination Process
          </button>
        </div>

        <div className="p-6">
          {/* HERO SECTION */}
          {activeTab === 'hero' && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-bold text-textSecondary mb-2">Title</label>
                <input type="text" value={formData.hero?.title || ''} onChange={(e) => updateHero('title', e.target.value)} className="w-full bg-darkBg border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-accentGold" />
              </div>
              <div>
                <label className="block text-sm font-bold text-textSecondary mb-2">Description</label>
                <textarea rows="4" value={formData.hero?.description || ''} onChange={(e) => updateHero('description', e.target.value)} className="w-full bg-darkBg border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-accentGold"></textarea>
              </div>
              <div>
                <label className="block text-sm font-bold text-textSecondary mb-2">Hero Image URL</label>
                <input type="text" value={formData.hero?.imageUrl || ''} onChange={(e) => updateHero('imageUrl', e.target.value)} className="w-full bg-darkBg border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-accentGold" />
                {formData.hero?.imageUrl && <img src={formData.hero.imageUrl} alt="Hero Preview" className="mt-4 h-32 rounded object-cover border border-white/10" />}
              </div>
            </div>
          )}

          {/* PROGRAMS & CURRICULUM */}
          {activeTab === 'programs' && (
            <div className="space-y-12">
              {/* Academic Calendar */}
              <div className="bg-darkBg p-6 rounded-lg border border-white/5">
                <h3 className="text-xl font-bold text-white mb-4 border-b border-white/10 pb-2">Academic Calendar</h3>
                <div>
                  <label className="block text-sm font-bold text-textSecondary mb-2">Calendar PDF URL</label>
                  <input type="text" value={formData.calendarPdfUrl || ''} onChange={(e) => setFormData({ ...formData, calendarPdfUrl: e.target.value })} className="w-full bg-darkCard border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-accentGold" placeholder="Optional URL for the full academic calendar PDF" />
                </div>
              </div>

              {/* Primary */}
              <div className="bg-darkBg p-6 rounded-lg border border-white/5">
                <h3 className="text-xl font-bold text-white mb-4 border-b border-white/10 pb-2">Primary School (I - V)</h3>
                <div className="mb-6">
                  <label className="block text-sm font-bold text-textSecondary mb-2">Program Icon</label>
                  <select value={formData.programs?.primary?.icon || 'FaUserGraduate'} onChange={(e) => updateProgram('primary', 'icon', e.target.value)} className="w-full bg-darkCard border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-accentGold">
                    {iconOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                  </select>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <label className="block text-sm font-bold text-textSecondary mb-2">Title</label>
                    <input type="text" value={formData.programs?.primary?.title || ''} onChange={(e) => updateProgram('primary', 'title', e.target.value)} className="w-full bg-darkCard border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-accentGold" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-textSecondary mb-2">Subtitle</label>
                    <input type="text" value={formData.programs?.primary?.subtitle || ''} onChange={(e) => updateProgram('primary', 'subtitle', e.target.value)} className="w-full bg-darkCard border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-accentGold" />
                  </div>
                </div>
                <div className="mb-6">
                  <label className="block text-sm font-bold text-textSecondary mb-2">Description</label>
                  <textarea rows="2" value={formData.programs?.primary?.description || ''} onChange={(e) => updateProgram('primary', 'description', e.target.value)} className="w-full bg-darkCard border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-accentGold"></textarea>
                </div>
                <div className="mb-6">
                  <label className="block text-sm font-bold text-textSecondary mb-2">Image URL</label>
                  <input type="text" value={formData.programs?.primary?.imageUrl || ''} onChange={(e) => updateProgram('primary', 'imageUrl', e.target.value)} className="w-full bg-darkCard border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-accentGold" />
                </div>
                <div className="mb-6">
                  <label className="block text-sm font-bold text-textSecondary mb-2">Curriculum PDF URL</label>
                  <input type="text" value={formData.programs?.primary?.curriculumPdfUrl || ''} onChange={(e) => updateProgram('primary', 'curriculumPdfUrl', e.target.value)} className="w-full bg-darkCard border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-accentGold" placeholder="Optional URL for the primary curriculum PDF" />
                </div>
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-sm font-bold text-textSecondary">Curriculum Features</label>
                    <button onClick={() => addProgramFeature('primary')} className="text-accentGold text-sm flex items-center gap-1 hover:underline"><FaPlus /> Add Feature</button>
                  </div>
                  <div className="space-y-2">
                    {(formData.programs?.primary?.features || []).map((feat, idx) => (
                      <div key={idx} className="flex gap-2">
                        <input type="text" value={feat} onChange={(e) => updateProgramFeature('primary', idx, e.target.value)} className="flex-1 bg-darkCard border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-accentGold" />
                        <button onClick={() => removeProgramFeature('primary', idx)} className="text-red-500 hover:bg-red-500/20 p-2 rounded"><FaTrash /></button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Secondary */}
              <div className="bg-darkBg p-6 rounded-lg border border-white/5">
                <h3 className="text-xl font-bold text-white mb-4 border-b border-white/10 pb-2">Secondary School (VI - X)</h3>
                <div className="mb-6">
                  <label className="block text-sm font-bold text-textSecondary mb-2">Program Icon</label>
                  <select value={formData.programs?.secondary?.icon || 'FaBookOpen'} onChange={(e) => updateProgram('secondary', 'icon', e.target.value)} className="w-full bg-darkCard border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-accentGold">
                    {iconOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                  </select>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <label className="block text-sm font-bold text-textSecondary mb-2">Title</label>
                    <input type="text" value={formData.programs?.secondary?.title || ''} onChange={(e) => updateProgram('secondary', 'title', e.target.value)} className="w-full bg-darkCard border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-accentGold" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-textSecondary mb-2">Subtitle</label>
                    <input type="text" value={formData.programs?.secondary?.subtitle || ''} onChange={(e) => updateProgram('secondary', 'subtitle', e.target.value)} className="w-full bg-darkCard border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-accentGold" />
                  </div>
                </div>
                <div className="mb-6">
                  <label className="block text-sm font-bold text-textSecondary mb-2">Description</label>
                  <textarea rows="2" value={formData.programs?.secondary?.description || ''} onChange={(e) => updateProgram('secondary', 'description', e.target.value)} className="w-full bg-darkCard border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-accentGold"></textarea>
                </div>
                <div className="mb-6">
                  <label className="block text-sm font-bold text-textSecondary mb-2">Image URL</label>
                  <input type="text" value={formData.programs?.secondary?.imageUrl || ''} onChange={(e) => updateProgram('secondary', 'imageUrl', e.target.value)} className="w-full bg-darkCard border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-accentGold" />
                </div>
                <div className="mb-6">
                  <label className="block text-sm font-bold text-textSecondary mb-2">Curriculum PDF URL</label>
                  <input type="text" value={formData.programs?.secondary?.curriculumPdfUrl || ''} onChange={(e) => updateProgram('secondary', 'curriculumPdfUrl', e.target.value)} className="w-full bg-darkCard border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-accentGold" placeholder="Optional URL for the secondary curriculum PDF" />
                </div>
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-sm font-bold text-textSecondary">Curriculum Features</label>
                    <button onClick={() => addProgramFeature('secondary')} className="text-accentGold text-sm flex items-center gap-1 hover:underline"><FaPlus /> Add Feature</button>
                  </div>
                  <div className="space-y-2">
                    {(formData.programs?.secondary?.features || []).map((feat, idx) => (
                      <div key={idx} className="flex gap-2">
                        <input type="text" value={feat} onChange={(e) => updateProgramFeature('secondary', idx, e.target.value)} className="flex-1 bg-darkCard border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-accentGold" />
                        <button onClick={() => removeProgramFeature('secondary', idx)} className="text-red-500 hover:bg-red-500/20 p-2 rounded"><FaTrash /></button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* METHODOLOGIES */}
          {activeTab === 'methodologies' && (
            <div>
              <div className="flex justify-end mb-4">
                <button onClick={addMethodology} className="bg-white/10 text-white px-4 py-2 rounded flex items-center gap-2 hover:bg-white/20 transition-colors text-sm font-bold">
                  <FaPlus /> Add Methodology
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {formData.methodologies?.map((item, index) => (
                  <div key={index} className="bg-darkBg p-4 rounded-lg border border-white/5 relative">
                    <button onClick={() => removeMethodology(index)} className="absolute top-2 right-2 text-red-500 hover:bg-red-500/20 p-1.5 rounded text-sm transition-colors">
                      <FaTrash />
                    </button>
                    <div className="space-y-3 mt-2">
                      <div>
                        <label className="block text-xs font-bold text-textSecondary mb-1">Icon</label>
                        <select value={item.icon || ''} onChange={(e) => updateMethodology(index, 'icon', e.target.value)} className="w-full bg-darkCard border border-white/10 rounded px-3 py-2 text-white text-sm focus:outline-none focus:border-accentGold">
                          {iconOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-textSecondary mb-1">Title</label>
                        <input type="text" value={item.title || ''} onChange={(e) => updateMethodology(index, 'title', e.target.value)} className="w-full bg-darkCard border border-white/10 rounded px-3 py-2 text-white text-sm focus:outline-none focus:border-accentGold" />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-textSecondary mb-1">Description</label>
                        <textarea rows="2" value={item.description || ''} onChange={(e) => updateMethodology(index, 'description', e.target.value)} className="w-full bg-darkCard border border-white/10 rounded px-3 py-2 text-white text-sm focus:outline-none focus:border-accentGold"></textarea>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* EXAMINATION PROCESS */}
          {activeTab === 'examination' && (
            <div>
              <div className="flex justify-end mb-4">
                <button onClick={addExamStep} className="bg-white/10 text-white px-4 py-2 rounded flex items-center gap-2 hover:bg-white/20 transition-colors text-sm font-bold">
                  <FaPlus /> Add Step
                </button>
              </div>
              <div className="space-y-4">
                {formData.examinationProcess?.map((step, index) => (
                  <div key={index} className="bg-darkBg p-4 rounded-lg border border-white/5 relative flex gap-4">
                    <div className="flex-shrink-0 w-10 h-10 rounded-full border border-accentGold/30 text-accentGold flex items-center justify-center font-bold">
                      {index + 1}
                    </div>
                    <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-textSecondary mb-1">Step Title</label>
                        <input type="text" value={step.title || ''} onChange={(e) => updateExamStep(index, 'title', e.target.value)} className="w-full bg-darkCard border border-white/10 rounded px-3 py-2 text-white text-sm focus:outline-none focus:border-accentGold" />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-textSecondary mb-1">Description</label>
                        <input type="text" value={step.description || ''} onChange={(e) => updateExamStep(index, 'description', e.target.value)} className="w-full bg-darkCard border border-white/10 rounded px-3 py-2 text-white text-sm focus:outline-none focus:border-accentGold" />
                      </div>
                    </div>
                    <button onClick={() => removeExamStep(index)} className="text-red-500 hover:bg-red-500/20 p-2 rounded h-fit">
                      <FaTrash />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default ManageAcademics;
