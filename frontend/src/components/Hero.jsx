import React, { useState, useEffect } from 'react';
import { useAdmin } from '../context/AdminContext';
import { portfolioAPI, mediaAPI, analyticsAPI } from '../utils/api';
import { FaDownload, FaEnvelope, FaEdit, FaCheck, FaTimes, FaCamera, FaFilePdf } from 'react-icons/fa';
import { motion } from 'framer-motion';

const Hero = ({ data, onUpdate }) => {
  const { editMode } = useAdmin();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    title: '',
    tagline: '',
    profileImage: '',
    resumeUrl: ''
  });

  useEffect(() => {
    if (data) {
      setFormData({
        name: data.name || '',
        title: data.title || '',
        tagline: data.tagline || '',
        profileImage: data.profileImage || '',
        resumeUrl: data.resumeUrl || ''
      });
    }
  }, [data]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileUpload = async (e, type) => {
    const file = e.target.files[0];
    if (!file) return;

    const uploadFormData = new FormData();
    uploadFormData.append('file', file);

    try {
      const response = await mediaAPI.upload(uploadFormData);
      setFormData(prev => ({ ...prev, [type]: response.url }));
    } catch (error) {
      alert('Upload failed.');
    }
  };

  const handleSave = async () => {
    try {
      const response = await portfolioAPI.update(formData);
      onUpdate(response.settings);
      setIsEditing(false);
    } catch (error) {
      alert('Save failed.');
    }
  };

  const handleCancel = () => {
    if (data) {
      setFormData({
        name: data.name || '',
        title: data.title || '',
        tagline: data.tagline || '',
        profileImage: data.profileImage || '',
        resumeUrl: data.resumeUrl || ''
      });
    }
    setIsEditing(false);
  };

  const handleDownloadResume = () => {
    analyticsAPI.track('download');
  };

  return (
    <section 
      id="home" 
      className="relative min-h-screen flex items-center justify-center pt-28 pb-12 bg-transparent overflow-hidden"
    >
      {/* Background Glowing Orbs */}
      <div className="glow-orb top-20 left-10 animate-pulse-slow" />
      <div className="glow-orb-secondary bottom-10 right-10 animate-float" />
      
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 w-full relative z-10 grid grid-cols-1 md:grid-cols-12 gap-12 items-center py-12">
        
        {/* Left Side: Developer Info */}
        <div className="md:col-span-7 flex flex-col space-y-6 text-left">
          {editMode && !isEditing && (
            <button
              onClick={() => setIsEditing(true)}
              className="self-start px-3.5 py-2 rounded-xl text-[10px] font-bold uppercase tracking-wider bg-slate-900/60 text-slate-400 border border-white/5 hover:border-white/10 hover:text-white flex items-center gap-1.5 transition-colors shadow-sm"
            >
              <FaEdit className="text-indigo-400" /> Edit Hero Section
            </button>
          )}

          {isEditing ? (
            <div className="space-y-4 glass-panel p-6 rounded-2xl shadow-xl shadow-black/30">
              <h4 className="text-[10px] font-bold text-slate-200 border-b border-white/5 pb-2.5 font-display uppercase tracking-wider">Configure Hero Settings</h4>
              
              <div>
                <label className="block text-[9px] font-bold uppercase tracking-wider text-slate-500 mb-1">Full Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="cyber-input py-2 text-xs"
                  placeholder="e.g. Rajesh Rautela"
                />
              </div>

              <div>
                <label className="block text-[9px] font-bold uppercase tracking-wider text-slate-500 mb-1">Professional Title</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  className="cyber-input py-2 text-xs"
                  placeholder="e.g. Full Stack Developer"
                />
              </div>

              <div>
                <label className="block text-[9px] font-bold uppercase tracking-wider text-slate-500 mb-1">Tagline</label>
                <textarea
                  name="tagline"
                  value={formData.tagline}
                  onChange={handleInputChange}
                  rows="3"
                  className="cyber-input py-2 text-xs resize-none"
                  placeholder="Tell recruiters what you do..."
                />
              </div>

              <div>
                <label className="block text-[9px] font-bold uppercase tracking-wider text-slate-500 mb-1">Resume File (PDF)</label>
                <div className="flex items-center gap-3">
                  <input
                    type="text"
                    name="resumeUrl"
                    value={formData.resumeUrl}
                    onChange={handleInputChange}
                    className="cyber-input py-2 text-xs flex-1"
                    placeholder="/uploads/resume.pdf"
                  />
                  <label className="cursor-pointer bg-slate-950 hover:bg-slate-900 text-slate-200 border border-white/5 px-3 py-2 rounded-xl text-[10px] font-semibold flex items-center gap-1.5 transition-colors">
                    <FaFilePdf className="text-rose-500" /> Upload
                    <input 
                      type="file" 
                      accept=".pdf"
                      onChange={(e) => handleFileUpload(e, 'resumeUrl')}
                      className="hidden" 
                    />
                  </label>
                </div>
              </div>

              <div className="flex items-center gap-3 pt-2.5 border-t border-white/5">
                <button
                  onClick={handleSave}
                  className="btn-success text-[10px] px-4 py-2"
                >
                  <FaCheck size={9} /> Save Details
                </button>
                <button
                  onClick={handleCancel}
                  className="btn-secondary text-[10px] px-4 py-2"
                >
                  <FaTimes size={9} /> Cancel
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Availability tag */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900/60 border border-white/5 text-[9px] font-bold uppercase tracking-wider text-slate-400 font-sans shadow-glow-sm">
                  <span className="availability-dot">
                    <span className="availability-dot-ping" />
                    <span className="availability-dot-core" />
                  </span>
                  Available for Opportunities
                </span>
              </motion.div>

              {/* Massive Name with Gradient Text */}
              <motion.h1 
                className="text-slate-100 font-display font-extrabold tracking-tight hero-name bg-gradient-to-r from-white via-slate-100 to-indigo-300 bg-clip-text text-transparent"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
              >
                {data?.name || 'Rajesh Rautela'}
              </motion.h1>

              {/* Dynamic Tagline */}
              <motion.p 
                className="text-sm sm:text-base text-slate-400 font-normal leading-relaxed max-w-xl"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                {data?.tagline || 'Building scalable web applications using MERN Stack and Artificial Intelligence.'}
              </motion.p>

              {/* Action Buttons */}
              <motion.div 
                className="flex items-center gap-4 pt-4"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                {data?.resumeUrl && (
                  <motion.a
                    href={data.resumeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={handleDownloadResume}
                    className="btn-primary gap-2"
                    whileHover={{ scale: 1.02, boxShadow: '0 0 15px rgba(255, 255, 255, 0.15)' }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <FaDownload size={10} /> Download Resume
                  </motion.a>
                )}
                
                <motion.button
                  onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
                  className="btn-secondary flex items-center gap-2"
                  whileHover={{ scale: 1.02, borderColor: 'rgba(99, 102, 241, 0.4)', boxShadow: '0 0 15px rgba(99, 102, 241, 0.1)' }}
                  whileTap={{ scale: 0.98 }}
                >
                  <FaEnvelope size={11} /> Contact Me
                </motion.button>
              </motion.div>
            </div>
          )}
        </div>

        {/* Right Side: Profile Photo with pulsing mesh gradient behind */}
        <div className="md:col-span-5 flex justify-center items-center">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="relative"
          >
            {/* Floating glowing background behind card */}
            <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500/20 to-violet-500/20 rounded-2xl blur-xl opacity-60 animate-pulse-slow" />
            
            <motion.div 
              animate={{ y: [0, -6, 0] }}
              transition={{ duration: 5, repeat: Infinity, repeatType: 'reverse', ease: "easeInOut" }}
              className="relative w-64 h-64 sm:w-72 sm:h-72 rounded-2xl overflow-hidden border border-white/5 bg-slate-900/60 p-1.5 shadow-2xl hover:border-indigo-500/30 transition-colors duration-300"
            >
              <div className="relative w-full h-full rounded-xl overflow-hidden bg-slate-950">
                {formData.profileImage ? (
                  <motion.img 
                    src={formData.profileImage} 
                    alt={data?.name || "Rajesh Rautela"} 
                    className="w-full h-full object-cover transition-all duration-300"
                    whileHover={{ scale: 1.03 }}
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center text-slate-500 bg-slate-900/40">
                    <div className="text-3xl font-bold font-display tracking-wider">RR</div>
                    <span className="text-[9px] mt-1 uppercase tracking-widest font-semibold font-sans">Profile Image</span>
                  </div>
                )}

                {/* Upload Overlay */}
                {isEditing && (
                  <label className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm flex flex-col items-center justify-center gap-1.5 cursor-pointer opacity-0 hover:opacity-100 transition-opacity duration-150 text-slate-300">
                    <FaCamera size={18} className="text-indigo-400 animate-bounce" />
                    <span className="text-[9px] font-bold uppercase tracking-wider font-sans">Upload Photo</span>
                    <input 
                      type="file" 
                      accept="image/*"
                      onChange={(e) => handleFileUpload(e, 'profileImage')}
                      className="hidden" 
                    />
                  </label>
                )}
              </div>
            </motion.div>
          </motion.div>
        </div>

      </div>
    </section>
  );
};

export default Hero;
