import React, { useState, useEffect } from 'react';
import { useAdmin } from '../context/AdminContext';
import { useNavigate } from 'react-router-dom';
import { contactAPI, analyticsAPI, mediaAPI } from '../utils/api';
import { 
  FaChartLine, FaEnvelopeOpenText, FaFolderOpen, FaSearch, 
  FaTrash, FaEnvelope, FaRegEnvelope, FaSpinner, FaUpload, 
  FaFilePdf, FaEye, FaCopy, FaCheck, FaInfoCircle, FaHdd 
} from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

const AdminDashboard = () => {
  const { isAdmin, loading } = useAdmin();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('analytics');

  // Message States
  const [messages, setMessages] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [messagesLoading, setMessagesLoading] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState(null);

  // Analytics States
  const [analytics, setAnalytics] = useState({
    visits: 0,
    resumeDownloads: 0,
    projectClicks: 0,
    contactSubmissions: 0
  });
  const [analyticsLoading, setAnalyticsLoading] = useState(false);

  // Media States
  const [mediaFiles, setMediaFiles] = useState([]);
  const [mediaLoading, setMediaLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState(null);

  useEffect(() => {
    if (!loading && !isAdmin) {
      navigate('/');
    }
  }, [isAdmin, loading, navigate]);

  useEffect(() => {
    if (!isAdmin) return;

    if (activeTab === 'analytics') {
      fetchAnalytics();
    } else if (activeTab === 'messages') {
      fetchMessages();
    } else if (activeTab === 'media') {
      fetchMedia();
    }
  }, [activeTab, isAdmin]);

  const fetchAnalytics = async () => {
    setAnalyticsLoading(true);
    try {
      const data = await analyticsAPI.get();
      setAnalytics(data);
    } catch (err) {
      console.error('Failed to load analytics:', err.message);
    } finally {
      setAnalyticsLoading(false);
    }
  };

  const fetchMessages = async () => {
    setMessagesLoading(true);
    try {
      const data = await contactAPI.getAll(searchQuery);
      setMessages(data);
    } catch (err) {
      console.error('Failed to load messages:', err.message);
    } finally {
      setMessagesLoading(false);
    }
  };

  useEffect(() => {
    if (!isAdmin || activeTab !== 'messages') return;
    const delayDebounce = setTimeout(() => {
      fetchMessages();
    }, 400);

    return () => clearTimeout(delayDebounce);
  }, [searchQuery]);

  const handleToggleRead = async (id) => {
    try {
      const response = await contactAPI.toggleRead(id);
      setMessages(prev => prev.map(m => m._id === id ? response.message : m));
      if (selectedMessage?._id === id) {
        setSelectedMessage(response.message);
      }
    } catch (err) {
      console.error(err.message);
    }
  };

  const handleDeleteMessage = async (id) => {
    if (!window.confirm('Delete message permanently?')) return;
    try {
      await contactAPI.delete(id);
      setMessages(prev => prev.filter(m => m._id !== id));
      if (selectedMessage?._id === id) setSelectedMessage(null);
    } catch (err) {
      console.error(err.message);
    }
  };

  const fetchMedia = async () => {
    setMediaLoading(true);
    try {
      const data = await mediaAPI.getAll();
      setMediaFiles(data);
    } catch (err) {
      console.error('Failed to load assets:', err.message);
    } finally {
      setMediaLoading(false);
    }
  };

  const handleMediaUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      await mediaAPI.upload(formData);
      fetchMedia();
    } catch (err) {
      alert('Upload failed.');
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteMedia = async (filename) => {
    if (!window.confirm(`Delete ${filename}?`)) return;
    try {
      await mediaAPI.delete(filename);
      setMediaFiles(prev => prev.filter(f => f.fileName !== filename));
    } catch (err) {
      alert('Delete failed.');
    }
  };

  const handleCopyLink = (url, index) => {
    const fullUrl = `${window.location.origin}${url}`;
    navigator.clipboard.writeText(fullUrl);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const formatSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  if (loading || !isAdmin) {
    return (
      <div className="min-h-screen bg-[#030712] flex flex-col justify-center items-center gap-3">
        <FaSpinner size={24} className="text-indigo-400 animate-spin" />
        <span className="text-xs text-slate-500 font-sans">Verifying permissions...</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-transparent pt-28 pb-16 relative overflow-hidden">
      {/* Absolute background decorations */}
      <div className="glow-orb top-10 right-10 animate-pulse-slow" />
      <div className="glow-orb-secondary bottom-10 left-10 animate-float" />
      
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-white/5 pb-8 mb-10">
          <div>
            <h1 className="text-2xl font-extrabold text-white font-display tracking-tight bg-gradient-to-r from-white via-slate-100 to-indigo-300 bg-clip-text text-transparent">CMS Console</h1>
            <p className="text-xs text-slate-500 mt-1 font-sans">Monitor metrics, manage static file assets, and view messages.</p>
          </div>
          
          {/* Tabs Pill row */}
          <div className="flex border border-white/5 bg-slate-900/60 p-1.5 rounded-2xl self-start backdrop-blur-md">
            <button
              onClick={() => setActiveTab('analytics')}
              className={`px-4 py-2 rounded-xl text-[10px] font-bold uppercase tracking-wider flex items-center gap-2 transition-all duration-200 ${
                activeTab === 'analytics' ? 'bg-slate-100 text-slate-950 shadow-md' : 'text-slate-500 hover:text-slate-300'
              }`}
            >
              <FaChartLine size={11} /> Analytics
            </button>
            <button
              onClick={() => setActiveTab('messages')}
              className={`px-4 py-2 rounded-xl text-[10px] font-bold uppercase tracking-wider flex items-center gap-2 transition-all duration-200 ${
                activeTab === 'messages' ? 'bg-slate-100 text-slate-950 shadow-md' : 'text-slate-500 hover:text-slate-300'
              }`}
            >
              <FaEnvelopeOpenText size={11} /> Messages
            </button>
            <button
              onClick={() => setActiveTab('media')}
              className={`px-4 py-2 rounded-xl text-[10px] font-bold uppercase tracking-wider flex items-center gap-2 transition-all duration-200 ${
                activeTab === 'media' ? 'bg-slate-100 text-slate-950 shadow-md' : 'text-slate-500 hover:text-slate-300'
              }`}
            >
              <FaFolderOpen size={11} /> Media
            </button>
          </div>
        </div>

        {/* ========================================================= */}
        {/* TAB 1: ANALYTICS */}
        {/* ========================================================= */}
        <AnimatePresence mode="wait">
          {activeTab === 'analytics' && (
            <motion.div 
              key="analytics"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
              className="space-y-8"
            >
              {analyticsLoading ? (
                <div className="py-20 flex justify-center"><FaSpinner className="animate-spin text-slate-500" size={20} /></div>
              ) : (
                <>
                  {/* Stats Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                    {/* Visits */}
                    <div className="premium-card p-5 border-white/5 bg-slate-900/30 shadow-lg relative overflow-hidden group">
                      <div className="absolute right-0 top-0 translate-x-3 -translate-y-3 w-16 h-16 bg-indigo-500/5 blur-lg rounded-full group-hover:bg-indigo-500/10 transition-colors" />
                      <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest font-display">Total Visits</span>
                      <h3 className="text-2xl font-extrabold text-white mt-1.5 font-display tracking-tight">{analytics.visits}</h3>
                      <div className="h-[2px] bg-slate-950 rounded-full overflow-hidden mt-4">
                        <div className="h-full bg-indigo-500 w-full" />
                      </div>
                    </div>

                    {/* CV Downloads */}
                    <div className="premium-card p-5 border-white/5 bg-slate-900/30 shadow-lg relative overflow-hidden group">
                      <div className="absolute right-0 top-0 translate-x-3 -translate-y-3 w-16 h-16 bg-indigo-500/5 blur-lg rounded-full group-hover:bg-indigo-500/10 transition-colors" />
                      <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest font-display">CV Downloads</span>
                      <h3 className="text-2xl font-extrabold text-white mt-1.5 font-display tracking-tight">{analytics.resumeDownloads}</h3>
                      <div className="h-[2px] bg-slate-950 rounded-full overflow-hidden mt-4">
                        <div className="h-full bg-indigo-500 w-1/3" />
                      </div>
                    </div>

                    {/* Project Clicks */}
                    <div className="premium-card p-5 border-white/5 bg-slate-900/30 shadow-lg relative overflow-hidden group">
                      <div className="absolute right-0 top-0 translate-x-3 -translate-y-3 w-16 h-16 bg-indigo-500/5 blur-lg rounded-full group-hover:bg-indigo-500/10 transition-colors" />
                      <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest font-display">Project Clicks</span>
                      <h3 className="text-2xl font-extrabold text-white mt-1.5 font-display tracking-tight">{analytics.projectClicks}</h3>
                      <div className="h-[2px] bg-slate-950 rounded-full overflow-hidden mt-4">
                        <div className="h-full bg-indigo-500 w-1/2" />
                      </div>
                    </div>

                    {/* Submissions */}
                    <div className="premium-card p-5 border-white/5 bg-slate-900/30 shadow-lg relative overflow-hidden group">
                      <div className="absolute right-0 top-0 translate-x-3 -translate-y-3 w-16 h-16 bg-indigo-500/5 blur-lg rounded-full group-hover:bg-indigo-500/10 transition-colors" />
                      <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest font-display">Inquiries</span>
                      <h3 className="text-2xl font-extrabold text-white mt-1.5 font-display tracking-tight">{analytics.contactSubmissions}</h3>
                      <div className="h-[2px] bg-slate-950 rounded-full overflow-hidden mt-4">
                        <div className="h-full bg-indigo-500 w-1/4" />
                      </div>
                    </div>
                  </div>

                  {/* Conversion Indicators */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="premium-card p-6 border-white/5 bg-slate-900/30 shadow-lg">
                      <h4 className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-6 font-display">Conversion Statistics</h4>
                      <div className="space-y-5">
                        <div>
                          <div className="flex justify-between text-[10px] font-semibold text-slate-500 mb-1.5 font-sans">
                            <span>Downloads to Visits Ratio</span>
                            <span className="text-slate-300">{analytics.visits > 0 ? ((analytics.resumeDownloads / analytics.visits) * 100).toFixed(1) : 0}%</span>
                          </div>
                          <div className="w-full h-1 bg-slate-950 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-indigo-500" 
                              style={{ width: `${analytics.visits > 0 ? Math.min((analytics.resumeDownloads / analytics.visits) * 100, 100) : 0}%` }}
                            />
                          </div>
                        </div>

                        <div>
                          <div className="flex justify-between text-[10px] font-semibold text-slate-500 mb-1.5 font-sans">
                            <span>Inquiries to Visits Ratio</span>
                            <span className="text-slate-300">{analytics.visits > 0 ? ((analytics.contactSubmissions / analytics.visits) * 100).toFixed(1) : 0}%</span>
                          </div>
                          <div className="w-full h-1 bg-slate-950 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-indigo-500" 
                              style={{ width: `${analytics.visits > 0 ? Math.min((analytics.contactSubmissions / analytics.visits) * 100, 100) : 0}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="premium-card p-6 border-white/5 bg-slate-900/30 shadow-lg flex items-center gap-4 hover:border-indigo-500/10 transition-colors duration-300">
                      <div className="w-11 h-11 rounded-xl bg-slate-950 flex items-center justify-center text-indigo-400 flex-shrink-0 border border-white/5">
                        <FaHdd size={16} />
                      </div>
                      <div className="space-y-1">
                        <h5 className="text-xs font-bold text-slate-300 font-display flex items-center gap-1.5">
                          <FaInfoCircle size={10} className="text-indigo-400" /> System Metrics
                        </h5>
                        <p className="text-[10px] text-slate-500 leading-normal font-sans">
                          Visits and events are updated dynamically from active API routing logs. Secret key sessions expire automatically.
                        </p>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </motion.div>
          )}

          {/* ========================================================= */}
          {/* TAB 2: MESSAGES */}
          {/* ========================================================= */}
          {activeTab === 'messages' && (
            <motion.div 
              key="messages"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
              className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start"
            >
              
              {/* Messages Listing */}
              <div className="lg:col-span-5 space-y-4">
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-500">
                    <FaSearch size={11} />
                  </span>
                  <input
                    type="text"
                    placeholder="Search sender or title..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="cyber-input py-2 pl-9.5 text-xs"
                  />
                </div>

                {messagesLoading ? (
                  <div className="py-10 flex justify-center"><FaSpinner className="animate-spin text-slate-500" size={16} /></div>
                ) : (
                  <div className="space-y-2.5 max-h-[60vh] overflow-y-auto pr-1">
                    {messages.map(msg => (
                      <div
                        key={msg._id}
                        onClick={() => setSelectedMessage(msg)}
                        className={`p-4 rounded-2xl border cursor-pointer transition-all duration-200 ${
                          selectedMessage?._id === msg._id
                            ? 'bg-slate-900/80 border-indigo-500/30'
                            : msg.isRead 
                              ? 'bg-slate-900/30 border-white/5 hover:border-white/10 hover:bg-slate-900/50'
                              : 'bg-slate-900/60 border-white/10 hover:border-indigo-500/20 hover:bg-slate-900/80'
                        }`}
                      >
                        <div className="flex items-center justify-between gap-3">
                          <span className={`font-bold text-[10px] font-display truncate ${msg.isRead ? 'text-slate-400' : 'text-indigo-400'}`}>{msg.name}</span>
                          <span className="text-[9px] text-slate-600 font-sans">
                            {new Date(msg.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        <h4 className="text-xs font-bold text-slate-300 mt-1 truncate font-display">{msg.subject}</h4>
                        <p className="text-[10px] text-slate-500 line-clamp-1 mt-1 font-sans">{msg.message}</p>
                      </div>
                    ))}

                    {messages.length === 0 && (
                      <div className="text-center py-10 text-slate-600 text-xs font-sans">
                        No contact requests cataloged.
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Message Viewer Details */}
              <div className="lg:col-span-7">
                {selectedMessage ? (
                  <div className="premium-card p-6 border-white/5 bg-slate-900/30 space-y-6 shadow-xl relative overflow-hidden">
                    <div className="absolute right-0 top-0 w-24 h-24 bg-indigo-500/5 blur-xl pointer-events-none rounded-full" />
                    
                    <div className="flex items-start justify-between border-b border-white/5 pb-4 gap-4 relative z-10">
                      <div className="flex gap-2.5">
                        <span className="text-slate-400 p-2.5 rounded-xl bg-slate-950 border border-white/5 h-9 w-9 flex items-center justify-center">
                          <FaEnvelope size={12} className="text-indigo-400" />
                        </span>
                        <div>
                          <h3 className="font-bold text-xs text-white font-display">{selectedMessage.name}</h3>
                          <p className="text-[10px] text-slate-500 font-sans mt-0.5">{selectedMessage.email}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleToggleRead(selectedMessage._id)}
                          className={`px-3 py-1.5 rounded-xl text-[9px] font-bold uppercase tracking-wider border flex items-center gap-1.5 transition-colors ${
                            selectedMessage.isRead
                              ? 'bg-slate-950 text-slate-400 border-white/5 hover:text-white hover:border-white/10'
                              : 'bg-slate-100 text-slate-950 border-transparent hover:bg-slate-200'
                          }`}
                        >
                          {selectedMessage.isRead ? (
                            <><FaRegEnvelope size={10} /> Unread</>
                          ) : (
                            <><FaEnvelopeOpenText size={10} /> Read</>
                          )}
                        </button>

                        <button
                          onClick={() => handleDeleteMessage(selectedMessage._id)}
                          className="p-2.5 bg-rose-955/10 text-rose-400 border border-rose-950/40 rounded-xl hover:bg-rose-950/20 hover:text-rose-350 transition-colors"
                          title="Delete Message"
                        >
                          <FaTrash size={11} />
                        </button>
                      </div>
                    </div>

                    <div className="space-y-4 relative z-10">
                      <div>
                        <h5 className="text-[9px] font-bold uppercase tracking-wider text-slate-550 font-display">Subject</h5>
                        <p className="text-xs font-bold text-slate-300 mt-1 font-sans">{selectedMessage.subject}</p>
                      </div>
                      <div>
                        <h5 className="text-[9px] font-bold uppercase tracking-wider text-slate-550 font-display">Content</h5>
                        <div className="text-xs text-slate-400 leading-relaxed bg-slate-950/50 p-4 border border-white/5 rounded-xl whitespace-pre-wrap font-sans mt-1">
                          {selectedMessage.message}
                        </div>
                      </div>
                      <div className="text-[9px] text-slate-500 flex items-center gap-1 font-sans justify-end pt-2">
                        <span>Received:</span>
                        <span>{new Date(selectedMessage.createdAt).toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="premium-card p-12 border-white/5 bg-slate-900/20 flex flex-col justify-center items-center text-center text-slate-550 shadow-md">
                    <FaEnvelopeOpenText size={32} className="text-slate-800 mb-3" />
                    <p className="text-[10px] font-sans">Select a message card from the left panel to inspect sender details.</p>
                  </div>
                )}
              </div>

            </motion.div>
          )}

          {/* ========================================================= */}
          {/* TAB 3: MEDIA */}
          {/* ========================================================= */}
          {activeTab === 'media' && (
            <motion.div 
              key="media"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
              className="space-y-8"
            >
              {/* Upload Box */}
              <div className="premium-card p-6 border-dashed border-2 border-white/5 bg-slate-900/20 flex flex-col items-center justify-center hover:border-indigo-500/20 hover:bg-slate-900/30 transition-all rounded-2xl">
                <label className="cursor-pointer flex flex-col items-center gap-2.5 p-6 max-w-sm w-full text-center select-none">
                  <FaUpload className="text-indigo-400 text-2xl mb-1" />
                  <span className="text-[10px] font-bold text-slate-300 font-display uppercase tracking-wider">
                    {uploading ? 'Uploading Asset...' : 'Click to Upload Asset File'}
                  </span>
                  <span className="text-[9px] text-slate-500 font-sans">
                    Supports PNG, JPG, JPEG, WEBP, PDF up to 10MB
                  </span>
                  
                  <input 
                    type="file" 
                    accept=".png,.jpg,.jpeg,.webp,.pdf"
                    onChange={handleMediaUpload}
                    disabled={uploading}
                    className="hidden" 
                  />
                </label>
              </div>

              {/* Media Grid */}
              {mediaLoading ? (
                <div className="py-10 flex justify-center"><FaSpinner className="animate-spin text-slate-500" size={20} /></div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                  {mediaFiles.map((file, idx) => (
                    <div 
                      key={file.fileName}
                      className="premium-card overflow-hidden bg-slate-900/30 border-white/5 flex flex-col h-full hover:border-indigo-500/20 hover:bg-slate-900/50 transition-all duration-300 rounded-2xl"
                    >
                      <div className="aspect-square bg-slate-950 flex items-center justify-center overflow-hidden border-b border-white/5 relative group p-2.5">
                        {file.isPDF ? (
                          <FaFilePdf className="text-rose-500/80 text-4xl" />
                        ) : (
                          <img 
                            src={file.url} 
                            alt={file.fileName}
                            className="w-full h-full object-contain rounded-lg transition-transform duration-500 group-hover:scale-105"
                          />
                        )}

                        {/* Tooling Overlay */}
                        <div className="absolute inset-0 bg-slate-950/80 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center gap-2">
                          <a 
                            href={file.url} 
                            target="_blank" 
                            rel="noreferrer"
                            className="p-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs border border-white/5"
                            title="Preview static asset"
                          >
                            <FaEye size={10} />
                          </a>
                          <button
                            onClick={() => handleCopyLink(file.url, idx)}
                            className="p-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs border border-white/5"
                            title="Copy link address"
                          >
                            {copiedIndex === idx ? <FaCheck size={10} className="text-emerald-400" /> : <FaCopy size={10} />}
                          </button>
                          <button
                            onClick={() => handleDeleteMedia(file.fileName)}
                            className="p-2 bg-rose-950/15 hover:bg-rose-600 text-rose-400 hover:text-white rounded-lg text-xs border border-rose-900/30"
                            title="Delete file"
                          >
                            <FaTrash size={10} />
                          </button>
                        </div>
                      </div>

                      <div className="p-3 space-y-0.5 mt-auto bg-slate-950/40">
                        <p className="text-[9px] text-slate-400 truncate font-semibold font-sans" title={file.fileName}>
                          {file.fileName}
                        </p>
                        <div className="flex justify-between text-[8px] text-slate-500 font-sans">
                          <span>{formatSize(file.size)}</span>
                          <span>{new Date(file.createdAt).toLocaleDateString()}</span>
                        </div>
                      </div>

                    </div>
                  ))}

                  {mediaFiles.length === 0 && (
                    <div className="col-span-full text-center py-12 text-slate-600 text-xs font-sans">
                      No static files in database directory.
                    </div>
                  )}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
};

export default AdminDashboard;
