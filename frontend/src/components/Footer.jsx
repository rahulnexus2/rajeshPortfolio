import React, { useState, useEffect } from 'react';
import { useAdmin } from '../context/AdminContext';
import { portfolioAPI } from '../utils/api';
import { 
  FaMapMarkerAlt, FaEnvelope, FaPhone, FaGithub, 
  FaLinkedin, FaEdit, FaCheck, FaTimes, FaKey 
} from 'react-icons/fa';
import { motion } from 'framer-motion';

const Footer = ({ data, onUpdate, onOpenLogin }) => {
  const { editMode } = useAdmin();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    location: '',
    email: '',
    phone: '',
    github: '',
    linkedin: ''
  });

  useEffect(() => {
    if (data) {
      setFormData({
        location: data.location || '',
        email: data.email || '',
        phone: data.phone || '',
        github: data.github || '',
        linkedin: data.linkedin || ''
      });
    }
  }, [data]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
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
        location: data.location || '',
        email: data.email || '',
        phone: data.phone || '',
        github: data.github || '',
        linkedin: data.linkedin || ''
      });
    }
    setIsEditing(false);
  };

  return (
    <footer className="border-t border-white/5 bg-[#030712] py-16 relative overflow-hidden">
      {/* Absolute subtle background glow */}
      <div className="absolute left-1/2 bottom-0 -translate-x-1/2 w-80 h-40 bg-indigo-500/5 blur-3xl pointer-events-none rounded-full" />
      
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 pb-8 border-b border-white/5">
          
          {/* Brand Logo & Location */}
          <div className="space-y-2">
            <span className="text-sm font-bold tracking-widest text-white font-display flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-indigo-500 to-violet-500" />
              R. Rautela
            </span>
            <p className="text-[11px] text-slate-500 font-sans">
              Full Stack Engineer &amp; AI Integrations Developer.
            </p>
          </div>

          {/* Quick Contact rows (Static text, minimal) */}
          <div className="flex flex-wrap gap-x-8 gap-y-2.5 text-[11px] text-slate-400 font-sans">
            <span className="flex items-center gap-2 hover:text-slate-200 transition-colors">
              <FaMapMarkerAlt className="text-slate-500" size={10} />
              {data?.location || 'India'}
            </span>
            <a 
              href={`mailto:${data?.email || 'rajesh@example.com'}`}
              className="flex items-center gap-2 hover:text-indigo-400 transition-colors"
            >
              <FaEnvelope className="text-slate-500" size={10} />
              {data?.email || 'rajesh@example.com'}
            </a>
            <span className="flex items-center gap-2 hover:text-slate-200 transition-colors">
              <FaPhone className="text-slate-500" size={10} />
              {data?.phone || '+91 9876543210'}
            </span>
          </div>

          {/* CMS Config Button */}
          {editMode && !isEditing && (
            <button
              onClick={() => setIsEditing(true)}
              className="px-3.5 py-2 rounded-xl text-[9px] font-bold uppercase tracking-wider bg-slate-900/60 text-slate-400 border border-white/5 hover:border-white/10 hover:text-white flex items-center gap-1 transition-all"
            >
              <FaEdit className="text-indigo-400" size={9} /> Edit Footer Links
            </button>
          )}
        </div>

        {/* Inline Footer Configuration form (CMS) */}
        {isEditing && (
          <div className="mt-8 glass-panel p-6 rounded-2xl max-w-xl mx-auto shadow-2xl">
            <h4 className="text-[10px] font-bold text-slate-200 border-b border-white/5 pb-2 mb-4 font-display uppercase tracking-wider">Configure Footer Information</h4>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[9px] font-bold uppercase tracking-wider text-slate-500 mb-1">Location</label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  className="cyber-input py-1.5 text-xs"
                />
              </div>
              <div>
                <label className="block text-[9px] font-bold uppercase tracking-wider text-slate-500 mb-1">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="cyber-input py-1.5 text-xs"
                />
              </div>
              <div>
                <label className="block text-[9px] font-bold uppercase tracking-wider text-slate-500 mb-1">Phone</label>
                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="cyber-input py-1.5 text-xs"
                />
              </div>
              <div>
                <label className="block text-[9px] font-bold uppercase tracking-wider text-slate-500 mb-1">GitHub Link</label>
                <input
                  type="url"
                  name="github"
                  value={formData.github}
                  onChange={handleInputChange}
                  className="cyber-input py-1.5 text-xs"
                />
              </div>
              <div className="col-span-2">
                <label className="block text-[9px] font-bold uppercase tracking-wider text-slate-500 mb-1">LinkedIn Link</label>
                <input
                  type="url"
                  name="linkedin"
                  value={formData.linkedin}
                  onChange={handleInputChange}
                  className="cyber-input py-1.5 text-xs"
                />
              </div>
              
              <div className="col-span-2 flex items-center gap-2 pt-3 border-t border-white/5">
                <button onClick={handleSave} className="btn-success text-[9px] px-3.5 py-2">
                  <FaCheck size={7} /> Save Details
                </button>
                <button onClick={handleCancel} className="btn-secondary text-[9px] px-3.5 py-2">
                  <FaTimes size={7} /> Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Bottom copyright / socials / Easter Egg trigger */}
        <div className="flex flex-col sm:flex-row items-center justify-between pt-8 gap-4">
          <p 
            onDoubleClick={onOpenLogin}
            className="text-[10px] text-slate-600 font-sans cursor-pointer hover:text-indigo-400 select-none transition-colors flex items-center gap-2 group"
            title="Double-click to verify admin access key"
          >
            <span>© {new Date().getFullYear()} Rajesh Rautela. All rights reserved.</span>
            <FaKey size={8} className="opacity-0 group-hover:opacity-100 text-indigo-400 transition-opacity duration-300" />
          </p>

          {/* Minimal Social Buttons */}
          <div className="flex items-center gap-3">
            <motion.a
              href={data?.github || "https://github.com"}
              target="_blank"
              rel="noopener noreferrer"
              className="w-9 h-9 rounded-xl bg-slate-900/40 border border-white/5 flex items-center justify-center text-slate-500 hover:text-white hover:border-indigo-500/20 transition-all shadow-sm"
              title="GitHub Profile"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              <FaGithub size={15} />
            </motion.a>
            <motion.a
              href={data?.linkedin || "https://linkedin.com"}
              target="_blank"
              rel="noopener noreferrer"
              className="w-9 h-9 rounded-xl bg-slate-900/40 border border-white/5 flex items-center justify-center text-slate-500 hover:text-white hover:border-indigo-500/20 transition-all shadow-sm"
              title="LinkedIn Profile"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              <FaLinkedin size={15} />
            </motion.a>
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;
