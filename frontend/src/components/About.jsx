import React, { useState, useEffect } from 'react';
import { useAdmin } from '../context/AdminContext';
import { portfolioAPI } from '../utils/api';
import { FaUser, FaCompass, FaEdit, FaCheck, FaTimes, FaGraduationCap, FaMapMarkerAlt, FaEnvelope } from 'react-icons/fa';
import { motion } from 'framer-motion';

const About = ({ data, onUpdate }) => {
  const { editMode } = useAdmin();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    aboutHeading: '',
    aboutDescription: '',
    careerObjective: ''
  });

  useEffect(() => {
    if (data) {
      setFormData({
        aboutHeading: data.aboutHeading || '',
        aboutDescription: data.aboutDescription || '',
        careerObjective: data.careerObjective || ''
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
        aboutHeading: data.aboutHeading || '',
        aboutDescription: data.aboutDescription || '',
        careerObjective: data.careerObjective || ''
      });
    }
    setIsEditing(false);
  };

  return (
    <section id="about" className="py-28 relative overflow-hidden bg-transparent border-t border-white/5">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <motion.div 
          className="text-left mb-16"
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <span className="text-[10px] font-bold uppercase tracking-widest text-indigo-400 font-display">02 / About</span>
          <h2 className="section-heading mt-1 font-display tracking-tight text-white">Biography</h2>
          <div className="h-[1px] w-full bg-white/5 mt-4" />
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Left: Biography Text Block */}
          <motion.div 
            className="lg:col-span-7 space-y-6"
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            {editMode && !isEditing && (
              <button
                onClick={() => setIsEditing(true)}
                className="px-3.5 py-2 rounded-xl text-[10px] font-bold uppercase tracking-wider bg-slate-900/60 text-slate-400 border border-white/5 hover:border-white/10 hover:text-white flex items-center gap-1.5 transition-colors self-start shadow-sm"
              >
                <FaEdit className="text-indigo-400" /> Edit About
              </button>
            )}

            {isEditing ? (
              <div className="space-y-4 glass-panel p-6 rounded-2xl shadow-xl shadow-black/30">
                <h4 className="text-[10px] font-bold text-slate-200 border-b border-white/5 pb-2 font-display uppercase tracking-wider">Configure Bio Details</h4>
                
                <div>
                  <label className="block text-[9px] font-bold uppercase tracking-wider text-slate-500 mb-1">Heading</label>
                  <input
                    type="text"
                    name="aboutHeading"
                    value={formData.aboutHeading}
                    onChange={handleInputChange}
                    className="cyber-input py-2 text-xs"
                    placeholder="e.g. Full Stack AI Developer"
                  />
                </div>

                <div>
                  <label className="block text-[9px] font-bold uppercase tracking-wider text-slate-500 mb-1">Biography</label>
                  <textarea
                    name="aboutDescription"
                    value={formData.aboutDescription}
                    onChange={handleInputChange}
                    rows="6"
                    className="cyber-input py-2 text-xs resize-none"
                    placeholder="Describe your background..."
                  />
                </div>

                <div>
                  <label className="block text-[9px] font-bold uppercase tracking-wider text-slate-500 mb-1">Career Goal (Objective)</label>
                  <textarea
                    name="careerObjective"
                    value={formData.careerObjective}
                    onChange={handleInputChange}
                    rows="3"
                    className="cyber-input py-2 text-xs resize-none"
                    placeholder="What is your focus goal?"
                  />
                </div>

                <div className="flex items-center gap-3 pt-2.5 border-t border-white/5">
                  <button onClick={handleSave} className="btn-success text-[10px] px-4 py-2">
                    <FaCheck size={9} /> Save
                  </button>
                  <button onClick={handleCancel} className="btn-secondary text-[10px] px-4 py-2">
                    <FaTimes size={9} /> Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                <h3 className="text-xl sm:text-2xl font-bold text-white font-display tracking-tight bg-gradient-to-r from-white via-slate-100 to-indigo-200 bg-clip-text text-transparent">
                  {data?.aboutHeading || 'Full Stack AI Developer'}
                </h3>
                <p className="body-text text-slate-300">
                  {data?.aboutDescription || 'Full Stack AI Developer interested in MERN Stack and Artificial Intelligence. Specialized in developing robust, scalable backends alongside interactive, animated frontend applications.'}
                </p>

                {data?.careerObjective && (
                  <div className="relative border-l-2 border-indigo-500/50 pl-4 py-1.5 text-slate-400 text-sm font-sans italic mt-6 bg-indigo-950/5 rounded-r-xl pr-3">
                    "{data.careerObjective}"
                  </div>
                )}
              </div>
            )}
          </motion.div>

          {/* Right: Quick Facts Card */}
          <motion.div 
            className="lg:col-span-5 w-full"
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="premium-card p-6 border-white/5 bg-slate-900/40 space-y-6 shadow-xl relative overflow-hidden group hover:border-indigo-500/10 transition-colors duration-300 rounded-2xl">
              {/* Internal absolute background glow */}
              <div className="absolute -right-20 -top-20 w-40 h-40 rounded-full bg-indigo-500/5 blur-xl group-hover:bg-indigo-500/10 transition-colors duration-500" />
              
              <h4 className="text-[10px] font-bold uppercase tracking-wider text-slate-500 font-display pb-3 border-b border-white/5 flex items-center gap-1.5">
                <FaUser className="text-indigo-400" size={10} /> Quick Facts
              </h4>
              
              <div className="space-y-5">
                {/* Location */}
                <div className="flex items-start gap-3.5">
                  <div className="w-8 h-8 rounded-xl bg-slate-950 border border-white/5 flex items-center justify-center text-slate-400 flex-shrink-0 group-hover:border-indigo-500/20 transition-colors duration-300">
                    <FaMapMarkerAlt size={12} className="text-indigo-400" />
                  </div>
                  <div>
                    <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wider font-display">Location</span>
                    <p className="text-xs font-semibold text-slate-200 mt-0.5">{data?.location || 'India'}</p>
                  </div>
                </div>

                {/* Tech Focus */}
                <div className="flex items-start gap-3.5">
                  <div className="w-8 h-8 rounded-xl bg-slate-950 border border-white/5 flex items-center justify-center text-slate-400 flex-shrink-0 group-hover:border-indigo-500/20 transition-colors duration-300">
                    <FaCompass size={12} className="text-indigo-400" />
                  </div>
                  <div>
                    <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wider font-display">Tech Focus</span>
                    <p className="text-xs font-semibold text-slate-200 mt-0.5">{data?.title || 'MERN Stack & AI'}</p>
                  </div>
                </div>

                {/* Career Goals */}
                <div className="flex items-start gap-3.5">
                  <div className="w-8 h-8 rounded-xl bg-slate-950 border border-white/5 flex items-center justify-center text-slate-400 flex-shrink-0 group-hover:border-indigo-500/20 transition-colors duration-300">
                    <FaGraduationCap size={12} className="text-indigo-400" />
                  </div>
                  <div>
                    <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wider font-display">Interests</span>
                    <p className="text-xs font-semibold text-slate-200 mt-0.5">SaaS Products & AI Integrations</p>
                  </div>
                </div>

                {/* Contact Email */}
                <div className="flex items-start gap-3.5">
                  <div className="w-8 h-8 rounded-xl bg-slate-950 border border-white/5 flex items-center justify-center text-slate-400 flex-shrink-0 group-hover:border-indigo-500/20 transition-colors duration-300">
                    <FaEnvelope size={12} className="text-indigo-400" />
                  </div>
                  <div>
                    <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wider font-display">Contact Email</span>
                    <p className="text-xs font-semibold text-indigo-400 mt-0.5">
                      <a href={`mailto:${data?.email || 'rajesh@example.com'}`} className="hover:underline transition-colors hover:text-indigo-300">
                        {data?.email || 'rajesh@example.com'}
                      </a>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

      </div>
    </section>
  );
};

export default About;
