import React, { useState, useEffect } from 'react';
import { 
  FaSearch, FaFilter, FaTimes, FaEnvelope, FaPhoneAlt,
  FaShapes, FaBook, FaFlask, FaVial, FaGlobeAmericas,
  FaLeaf, FaLaptopCode, FaRunning, FaGraduationCap, FaChevronLeft, FaChevronRight, FaAngleDown, FaArrowRight, FaSpinner
} from 'react-icons/fa';
import * as Icons from 'react-icons/fa';
import { Link } from 'react-router-dom';
import api from '../services/api';

// High-quality placeholders
const heroBg = "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=1920&q=80"; // background school
const heroTeacher = "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=800&q=80"; // teacher

const getDepartmentStyle = (deptName) => {
  const name = (deptName || '').toLowerCase();
  if (name.includes('math')) {
    return {
      icon: <Icons.FaShapes />,
      colorClass: 'text-accentGold',
      bgClass: 'bg-accentGold',
    };
  } else if (name.includes('english')) {
    return {
      icon: <Icons.FaBook />,
      colorClass: 'text-orange-400',
      bgClass: 'bg-orange-400',
    };
  } else if (name.includes('physic') || name.includes('science') || name.includes('chem') || name.includes('bio')) {
    if (name.includes('physic')) {
      return {
        icon: <Icons.FaFlask />,
        colorClass: 'text-blue-400',
        bgClass: 'bg-blue-400',
      };
    } else if (name.includes('chem')) {
      return {
        icon: <Icons.FaVial />,
        colorClass: 'text-yellow-500',
        bgClass: 'bg-yellow-500',
      };
    } else if (name.includes('bio') || name.includes('natural')) {
      return {
        icon: <Icons.FaLeaf />,
        colorClass: 'text-green-400',
        bgClass: 'bg-green-400',
      };
    } else {
      return {
        icon: <Icons.FaFlask />,
        colorClass: 'text-cyan-400',
        bgClass: 'bg-cyan-400',
      };
    }
  } else if (name.includes('social') || name.includes('history') || name.includes('geography')) {
    return {
      icon: <Icons.FaGlobeAmericas />,
      colorClass: 'text-red-400',
      bgClass: 'bg-red-400',
    };
  } else if (name.includes('computer') || name.includes('it')) {
    return {
      icon: <Icons.FaLaptopCode />,
      colorClass: 'text-indigo-400',
      bgClass: 'bg-indigo-400',
    };
  } else if (name.includes('phys') || name.includes('sport') || name.includes('pe')) {
    return {
      icon: <Icons.FaRunning />,
      colorClass: 'text-purple-400',
      bgClass: 'bg-purple-400',
    };
  } else if (name.includes('manage') || name.includes('admin') || name.includes('director') || name.includes('principal')) {
    return {
      icon: <Icons.FaUserTie />,
      colorClass: 'text-accentGold',
      bgClass: 'bg-accentGold',
    };
  }
  
  return {
    icon: <Icons.FaGraduationCap />,
    colorClass: 'text-blue-400',
    bgClass: 'bg-blue-400',
  };
};

const Faculty = () => {
  const [facultyList, setFacultyList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDept, setSelectedDept] = useState('All Departments');
  const [selectedTeacher, setSelectedTeacher] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [admissionsSettings, setAdmissionsSettings] = useState(null);
  const [facultySettings, setFacultySettings] = useState(null);

  useEffect(() => {
    const fetchFacultyAndSettings = async () => {
      try {
        const [facultyRes, adminRes, aboutRes, facultySettingsRes] = await Promise.all([
          api.get('/faculty'),
          api.get('/admissions-settings'),
          api.get('/about-settings'),
          api.get('/faculty-settings')
        ]);
        
        setAdmissionsSettings(adminRes.data);
        setFacultySettings(facultySettingsRes.data);
        const data = facultyRes.data;
        if (data && data.length > 0) {
          const mapped = data.map(f => {
            const styles = getDepartmentStyle(f.department);
            return {
              id: f._id,
              name: f.name,
              title: f.designation,
              department: f.department,
              qualifications: f.qualifications || [],
              experience: f.experience || '',
              email: f.email || '',
              img: f.imageUrl || '',
              ...styles
            };
          });
          setFacultyList(mapped);
        } else {
          // Fallback to management team from about settings
          const management = aboutRes.data?.management || [];
          if (management.length > 0) {
            const mappedManagement = management.map((m, index) => {
              const styles = getDepartmentStyle('Management');
              return {
                id: `mgmt-${index}`,
                name: m.name,
                title: m.designation,
                department: 'Management',
                qualifications: [],
                experience: '',
                email: '',
                img: m.imageUrl || '',
                ...styles
              };
            });
            setFacultyList(mappedManagement);
          } else {
            setFacultyList([]);
          }
        }
      } catch (err) {
        setFacultyList(formattedFallback);
      } finally {
        setLoading(false);
      }
    };
    fetchFacultyAndSettings();
  }, []);

  const departments = ['All Departments', ...new Set(facultyList.map(f => f.department))];

  const filteredFaculty = facultyList.filter(teacher => {
    const search = searchTerm.toLowerCase();
    const matchesSearch = 
      teacher.name.toLowerCase().includes(search) ||
      teacher.title.toLowerCase().includes(search) ||
      teacher.department.toLowerCase().includes(search);
      
    const matchesDept = 
      selectedDept === 'All Departments' || 
      teacher.department === selectedDept;
      
    return matchesSearch && matchesDept;
  });

  const itemsPerPage = 8;
  const totalPages = Math.ceil(filteredFaculty.length / itemsPerPage);
  const paginatedFaculty = filteredFaculty.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  // Automatically reset selected teacher if it's no longer in the filtered list
  useEffect(() => {
    if (selectedTeacher && !filteredFaculty.find(t => t.id === selectedTeacher?.id)) {
      setSelectedTeacher(null);
    }
    setCurrentPage(1);
  }, [searchTerm, selectedDept, facultyList]);


  return (
    <div className="flex flex-col bg-darkBg text-white w-full">
      
      {/* 1. Hero Section */}
      <section className="relative w-full min-h-[90vh] flex items-center pt-10 bg-darkCard border-b border-white/5 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img src={facultySettings?.hero?.backgroundImage || heroBg} alt="School" className="w-full h-full object-cover opacity-35" />
          <div className="absolute inset-0 bg-gradient-to-r from-darkBg via-darkBg/90 to-transparent"></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-6 md:px-12 w-full flex flex-col-reverse md:flex-row items-center justify-between relative z-10 h-full">
          <div className="w-full md:w-1/2 flex flex-col items-start pt-16 md:pt-0">
            <span className="text-accentGold font-bold tracking-widest text-xs mb-4 uppercase flex items-center gap-2">
              <FaGraduationCap /> OUR TEACHERS
            </span>
            <h1 className="text-5xl md:text-7xl font-extrabold text-white leading-tight mb-6">
              Meet Our Faculty
            </h1>
            <p className="text-textSecondary max-w-sm text-sm leading-relaxed">
              Our dedicated faculty members are passionate educators committed to nurturing young minds and inspiring excellence every day.
            </p>
          </div>
          
          <div className="w-full md:w-1/2 h-full flex items-end justify-center md:justify-end">
            <img src={facultySettings?.hero?.sideImage || heroTeacher} alt="Teacher" className="h-[90%] max-h-[500px] object-cover object-top mask-image-bottom drop-shadow-2xl" style={{ WebkitMaskImage: 'linear-gradient(to top, transparent, black 10%)' }} />
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <section className="py-16 bg-darkBg">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          
          {/* 2. Search & Filter Bar */}
          <div className="flex flex-col md:flex-row gap-4 mb-12">
            <div className="flex-grow flex items-center bg-darkCard border border-white/5 rounded-lg px-4 py-3 hover:border-white/10 transition-colors">
              <FaSearch className="text-textSecondary mr-3" />
              <input 
                type="text" 
                placeholder="Search teachers by name, department or subject..." 
                className="bg-transparent border-none outline-none text-white text-lg w-full placeholder-textSecondary"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
              />
            </div>
            <select
              value={selectedDept}
              onChange={e => setSelectedDept(e.target.value)}
              className="bg-[#0A1128] border border-white/10 rounded-lg px-4 py-3 min-w-[200px] text-white text-lg outline-none cursor-pointer hover:border-white/20 transition-colors"
            >
              {departments.map(dept => (
                <option key={dept} value={dept} className="bg-darkCard text-white">{dept}</option>
              ))}
            </select>
            <button className="bg-accentGold text-darkBg px-6 py-3 rounded-lg flex items-center justify-center hover:bg-accentGoldDark transition-colors">
              <FaFilter />
            </button>
          </div>

          {/* Grid Header */}
          <div className="flex justify-between items-end border-b border-white/10 pb-4 mb-8">
            <h2 className="text-xl font-bold text-white">Our Faculty Members</h2>
            <span className="text-base font-bold text-textSecondary">Total Teachers: <span className="text-accentGold">{filteredFaculty.length}</span></span>
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 text-textSecondary gap-2">
              <FaSpinner className="animate-spin text-xl text-accentGold" />
              <p className="text-sm">Loading faculty roster...</p>
            </div>
          ) : paginatedFaculty.length === 0 ? (
            <div className="text-center py-20 text-textSecondary">
              <p className="text-lg font-bold text-white mb-1">No Faculty Members Found</p>
              <p className="text-sm">Try adjusting your search query or department filter.</p>
            </div>
          ) : (
            <>
              {/* 3. Faculty Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mb-12">
                {paginatedFaculty.map((teacher) => (
                  <div 
                    key={teacher.id} 
                    onClick={() => setSelectedTeacher(teacher)}
                    className={`bg-darkCard border rounded-2xl p-5 flex flex-col items-center text-center cursor-pointer transition-all duration-300 hover:-translate-y-1 ${selectedTeacher?.id === teacher.id ? 'border-accentGold/50 shadow-[0_0_15px_rgba(251,191,36,0.15)]' : 'border-white/5 hover:border-white/20'}`}
                  >
                    <div className="w-full h-40 overflow-hidden rounded-xl mb-4 bg-darkBg flex items-center justify-center">
                      {teacher.img ? (
                        <img src={teacher.img} alt={teacher.name} className="w-full h-full object-contain object-center transition-all duration-500" />
                      ) : (
                        <FaGraduationCap className="text-white/20 text-4xl" />
                      )}
                    </div>
                    <h3 className="font-bold text-white text-lg mb-1 leading-tight">{teacher.name}</h3>
                    <h4 className={`${teacher.colorClass} text-sm font-bold mb-3`}>{teacher.title}</h4>
                    <div className="flex items-center gap-2 text-sm text-textSecondary border-t border-white/5 pt-3 w-full justify-center">
                      <span className={teacher.colorClass}>{teacher.icon}</span> {teacher.department}
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

          {/* 4. Interactive Modal Profile View */}
          {selectedTeacher && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn" onClick={() => setSelectedTeacher(null)}>
              <div 
                className="bg-darkCard border border-white/10 rounded-2xl p-6 md:p-8 flex flex-col md:flex-row gap-8 relative w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl"
                onClick={e => e.stopPropagation()}
              >
                <button 
                  onClick={() => setSelectedTeacher(null)}
                  className="absolute top-4 right-4 text-textSecondary hover:text-white transition-colors p-2 bg-white/5 hover:bg-white/10 rounded-full"
                >
                  <FaTimes size={20} />
                </button>
                
                <div className="w-full md:w-64 h-64 rounded-xl overflow-hidden flex-shrink-0 bg-darkBg flex items-center justify-center border border-white/10">
                  {selectedTeacher.img ? (
                    <img src={selectedTeacher.img} alt={selectedTeacher.name} className="w-full h-full object-contain object-center" />
                  ) : (
                    <FaGraduationCap className="text-white/20 text-6xl" />
                  )}
                </div>
                
                <div className="flex flex-col justify-center flex-grow">
                  <h2 className="text-3xl font-bold text-white mb-2">{selectedTeacher.name}</h2>
                  <h4 className={`${selectedTeacher.colorClass} text-xl font-bold mb-4`}>{selectedTeacher.title}</h4>
                  <div className="flex items-center gap-2 text-base text-textSecondary mb-6 border-b border-white/5 pb-6">
                    <span className={selectedTeacher.colorClass}>{selectedTeacher.icon}</span> {selectedTeacher.department}
                  </div>
                  
                  <p className="text-lg text-textSecondary leading-relaxed mb-6 max-w-2xl">
                    {selectedTeacher.experience ? `With ${selectedTeacher.experience} of dedicated teaching experience, ` : 'As a dedicated educator, '} 
                    {selectedTeacher.name} is passionate about making learning engaging and easy to understand for students.
                  </p>

                  {selectedTeacher.qualifications && selectedTeacher.qualifications.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-8 items-center">
                      <span className="text-sm text-textSecondary font-bold">Qualifications:</span>
                      {selectedTeacher.qualifications.map((qual, idx) => (
                        <span key={idx} className="bg-white/5 border border-white/10 px-3 py-1 rounded text-xs font-bold text-accentGold uppercase">
                          {qual}
                        </span>
                      ))}
                    </div>
                  )}
                  
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mt-auto gap-4">
                    <div className="flex flex-col sm:flex-row gap-6">
                      {selectedTeacher.email && (
                        <div className="flex items-center gap-2 text-base text-textSecondary hover:text-white cursor-pointer transition-colors">
                          <FaEnvelope className={selectedTeacher.colorClass} /> {selectedTeacher.email}
                        </div>
                      )}
                      <div className="flex items-center gap-2 text-base text-textSecondary hover:text-white cursor-pointer transition-colors">
                        <FaPhoneAlt className={selectedTeacher.colorClass} /> +91 98765 43210
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 5. Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-2 mb-16">
              <button 
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center text-textSecondary hover:text-white hover:border-white/30 transition-colors disabled:opacity-30 disabled:pointer-events-none"
              >
                <FaChevronLeft size={10} />
              </button>
              
              {Array.from({ length: totalPages }).map((_, i) => (
                <button 
                  key={i}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`w-8 h-8 rounded-full font-bold text-base transition-colors ${
                    currentPage === i + 1 ? 'bg-accentGold text-darkBg' : 'border border-transparent text-textSecondary hover:text-white'
                  }`}
                >
                  {i + 1}
                </button>
              ))}

              <button 
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center text-textSecondary hover:text-white hover:border-white/30 transition-colors disabled:opacity-30 disabled:pointer-events-none"
              >
                <FaChevronRight size={10} />
              </button>
            </div>
          )}

          {/* 6. Join Our Learning Community Banner */}
          {admissionsSettings?.admissionBanner?.isActive !== false && (
            <div className="bg-accentGold rounded-2xl p-10 md:p-14 flex flex-col md:flex-row items-center justify-between text-darkBg shadow-2xl relative overflow-hidden mt-10">
              <div className="absolute right-0 top-0 w-64 h-64 bg-white/10 rounded-full blur-[30px]"></div>
              <div className="relative z-10 flex items-center gap-6 mb-6 md:mb-0">
                <div className="w-16 h-16 rounded-full border border-darkBg/20 flex items-center justify-center text-darkBg text-3xl opacity-80">
                  <FaGraduationCap />
                </div>
                <div className="text-center md:text-left">
                  <h2 className="text-3xl font-black mb-2 tracking-tight">{admissionsSettings?.admissionBanner?.title || "ADMISSIONS OPEN FOR 2025-26"}</h2>
                  <p className="text-sm font-bold opacity-80">{admissionsSettings?.admissionBanner?.subtitle || "Give your child the best start for a bright future."}</p>
                </div>
              </div>
              <Link to="/admissions" className="relative z-10 bg-darkBg text-white px-10 py-4 rounded-xl font-bold flex items-center gap-3 hover:bg-black transition-colors w-full md:w-auto justify-center">
                Apply Now <FaArrowRight />
              </Link>
            </div>
          )}

        </div>
      </section>

    </div>
  );
};

export default Faculty;
