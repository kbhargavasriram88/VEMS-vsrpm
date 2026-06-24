import React, { useState, useEffect } from 'react';
import { 
  FaUserGraduate, FaPhoneAlt, FaEnvelope, FaRegCalendarAlt, FaTrash, FaCheck, FaTimes, 
  FaSearch, FaSpinner, FaEdit, FaSave, FaPlus, FaInfoCircle, FaClipboardList, FaMedal, FaUsers, FaFileAlt, FaQuestionCircle 
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

const ManageAdmissions = () => {
  // INQUIRIES STATE
  const [inquiries, setInquiries] = useState([]);
  const [loadingInquiries, setLoadingInquiries] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  useEffect(() => {
    fetchInquiries();
  }, []);

  const fetchInquiries = async () => {
    setLoadingInquiries(true);
    try {
      const { data } = await api.get('/admissions');
      setInquiries(data);
    } catch (error) {
      console.error('Failed to load inquiries:', error);
    } finally {
      setLoadingInquiries(false);
    }
  };

  const handleUpdateStatus = async (id, status) => {
    try {
      await api.put(`/admissions/${id}/status`, { status });
      setInquiries(inquiries.map(inq => inq._id === id ? { ...inq, status } : inq));
    } catch (error) {
      console.error(error);
      alert('Failed to update inquiry status.');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this inquiry? This action cannot be undone.')) {
      try {
        await api.delete(`/admissions/${id}`);
        setInquiries(inquiries.filter(inq => inq._id !== id));
      } catch (error) {
        console.error(error);
        alert('Failed to delete inquiry.');
      }
    }
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'Approved':
        return 'bg-green-500 text-white border border-green-600 dark:bg-green-900/30 dark:text-green-400 dark:border-green-500/20';
      case 'Rejected':
        return 'bg-red-500 text-white border border-red-600 dark:bg-red-900/30 dark:text-red-400 dark:border-red-500/20';
      case 'Under Review':
        return 'bg-orange-500 text-white border border-orange-600 dark:bg-orange-900/30 dark:text-orange-400 dark:border-orange-500/20';
      case 'New':
      default:
        return 'bg-blue-500 text-white border border-blue-600 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-600/20';
    }
  };

  // Filter & Search Logic
  const filteredInquiries = inquiries.filter(inq => {
    const matchesSearch = 
      inq.studentName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inq.parentName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inq.phone?.includes(searchQuery);

    const matchesStatus = statusFilter === 'All' || inq.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="flex flex-col gap-6 w-full pb-10 text-white">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Admissions Inquiries</h1>
          <p className="text-sm text-textSecondary font-medium">Home / Admissions / Requests</p>
        </div>
      </div>

      {/* Filters and Search */}
        <div className="flex flex-wrap justify-end items-center gap-3">
          {/* Search */}
          <div className="relative">
            <input 
              type="text" 
              placeholder="Search name or phone..." 
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="bg-darkCard border border-white/10 rounded-lg pl-10 pr-4 py-2.5 text-sm text-white placeholder-textSecondary focus:border-blue-600 outline-none transition-colors w-full sm:w-60"
            />
            <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-textSecondary text-sm" />
          </div>

          {/* Status Filter */}
          <select 
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className="bg-darkCard border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white focus:border-blue-600 outline-none transition-colors"
          >
            <option value="All">All Statuses</option>
            <option value="New">New</option>
            <option value="Under Review">Under Review</option>
            <option value="Approved">Approved</option>
            <option value="Rejected">Rejected</option>
          </select>
        </div>

      {/* Main Table Container */}
      <div className="bg-darkCard border border-white/5 rounded-xl overflow-hidden mt-2">
        <div className="px-6 py-5 border-b border-white/5 flex justify-between items-center">
          <h2 className="text-base font-bold text-white">Admissions inquiries list</h2>
          <span className="text-xs bg-blue-500 text-white border border-blue-600 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-600/10 px-3 py-1 rounded-full font-bold">
            {filteredInquiries.length} requests found
          </span>
        </div>

        <div className="overflow-x-auto custom-scrollbar">
          {loadingInquiries ? (
            <div className="flex flex-col items-center justify-center py-20 text-textSecondary gap-2">
              <FaSpinner className="animate-spin text-xl text-blue-500" />
              <p className="text-sm">Loading requests...</p>
            </div>
          ) : filteredInquiries.length === 0 ? (
            <div className="text-center py-20 text-textSecondary">
              <FaUserGraduate size={32} className="mx-auto opacity-20 mb-4" />
              <p className="text-base font-bold text-white mb-1">No Inquiries Found</p>
              <p className="text-sm">No admission inquiries match the selected filters or search queries.</p>
            </div>
          ) : (
            <table className="w-full text-left border-collapse whitespace-nowrap">
              <thead>
                <tr className="bg-white/5 border-b border-white/5">
                  <th className="py-3 px-6 text-xs font-bold text-textSecondary uppercase">Submission Date</th>
                  <th className="py-3 px-6 text-xs font-bold text-textSecondary uppercase">Student details</th>
                  <th className="py-3 px-6 text-xs font-bold text-textSecondary uppercase">Parent Info</th>
                  <th className="py-3 px-6 text-xs font-bold text-textSecondary uppercase">Contact Details</th>
                  <th className="py-3 px-6 text-xs font-bold text-textSecondary uppercase">Status</th>
                  <th className="py-3 px-6 text-xs font-bold text-textSecondary uppercase">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredInquiries.map((inq) => (
                  <tr key={inq._id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                    <td className="py-4 px-6 text-sm text-textSecondary">
                      <div className="flex items-center gap-2">
                        <FaRegCalendarAlt className="text-textSecondary" />
                        {new Date(inq.createdAt).toLocaleDateString([], { day: 'numeric', month: 'short', year: 'numeric' })}
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex flex-col">
                        <span className="text-sm font-bold text-white leading-tight">{inq.studentName}</span>
                        <span className="text-xs text-blue-400 mt-1 uppercase font-extrabold tracking-wider">
                          Grade: {inq.gradeApplyingFor || 'N/A'}
                        </span>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <span className="text-sm font-medium text-white">{inq.parentName}</span>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex flex-col gap-1">
                        <span className="text-sm text-white flex items-center gap-1.5"><FaPhoneAlt size={10} className="text-textSecondary" /> {inq.phone}</span>
                        {inq.email && <span className="text-xs text-textSecondary flex items-center gap-1.5"><FaEnvelope size={10} className="text-textSecondary" /> {inq.email}</span>}
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <span className={`text-xs font-black uppercase px-2.5 py-1 rounded-md ${getStatusBadgeClass(inq.status)}`}>
                        {inq.status || 'New'}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-2">
                        {/* Approve */}
                        <button 
                          onClick={() => handleUpdateStatus(inq._id, 'Approved')} 
                          className="p-1.5 rounded bg-green-500 text-green-600 border border-green-600 hover:bg-green-600 hover:text-white dark:bg-green-900/30 dark:text-green-500 dark:border-green-500/20 dark:hover:bg-green-500 dark:hover:text-white transition-all"
                          title="Approve Inquiry"
                        >
                          <FaCheck size={10} />
                        </button>
                        
                        {/* Under Review */}
                        <button 
                          onClick={() => handleUpdateStatus(inq._id, 'Under Review')} 
                          className="p-1.5 rounded bg-orange-500 text-orange-600 border border-orange-600 hover:bg-orange-600 hover:text-white dark:bg-orange-900/30 dark:text-orange-400 dark:border-orange-500/20 dark:hover:bg-orange-500 dark:hover:text-white transition-all"
                          title="Mark Under Review"
                        >
                          <FaRegCalendarAlt size={10} />
                        </button>

                        {/* Reject */}
                        <button 
                          onClick={() => handleUpdateStatus(inq._id, 'Rejected')} 
                          className="p-1.5 rounded bg-red-500 text-white border border-red-600 hover:bg-red-600 hover:text-white dark:bg-red-900/30 dark:text-red-500 dark:border-red-500/20 dark:hover:bg-red-500 dark:hover:text-white transition-all"
                          title="Reject Inquiry"
                        >
                          <FaTimes size={10} />
                        </button>

                        <div className="h-4 w-[1px] bg-gray-200 dark:bg-white/10 mx-1"></div>

                        {/* Delete */}
                        <button 
                          onClick={() => handleDelete(inq._id)} 
                          className="p-1.5 rounded bg-gray-100 text-gray-500 border border-gray-200 hover:bg-red-600 hover:text-white dark:bg-white/5 dark:text-textSecondary dark:border-transparent dark:hover:bg-red-500 dark:hover:text-white transition-all"
                          title="Delete Inquiry"
                        >
                          <FaTrash size={10} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      
    </div>
  );
};

export default ManageAdmissions;
