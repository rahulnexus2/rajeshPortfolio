import React, { useState } from 'react';
import { useAdmin } from '../context/AdminContext';
import { projectsAPI, mediaAPI, analyticsAPI } from '../utils/api';
import { FaGithub, FaExternalLinkAlt, FaStar, FaEdit, FaTrash, FaTimes, FaCheck, FaCamera } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

const FeaturedSpotlight = ({ projectsList, onUpdate }) => {
  const { editMode } = useAdmin();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProjectId, setSelectedProjectId] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    image: '',
    technologies: '',
    githubUrl: '',
    liveUrl: '',
    featured: true
  });

  const featuredProjects = projectsList.filter(p => p.featured);

  if (featuredProjects.length === 0 && !editMode) return null;

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const uploadFormData = new FormData();
    uploadFormData.append('file', file);

    try {
      const response = await mediaAPI.upload(uploadFormData);
      setFormData(prev => ({ ...prev, image: response.url }));
    } catch (error) {
      alert('Upload failed.');
    }
  };

  const openEditModal = (project) => {
    setSelectedProjectId(project._id);
    setFormData({
      title: project.title,
      description: project.description,
      image: project.image || '',
      technologies: (project.technologies || []).join(', '),
      githubUrl: project.githubUrl || '',
      liveUrl: project.liveUrl || '',
      featured: !!project.featured
    });
    setIsModalOpen(true);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const techArray = formData.technologies
      .split(',')
      .map(t => t.trim())
      .filter(t => t.length > 0);

    const payload = { ...formData, technologies: techArray };

    try {
      const response = await projectsAPI.update(selectedProjectId, payload);
      // Update parent list in App.jsx
      onUpdate(projectsList.map(p => p._id === selectedProjectId ? response.project : p));
      setIsModalOpen(false);
    } catch (error) {
      alert('Save failed.');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete project?')) return;
    try {
      await projectsAPI.delete(id);
      onUpdate(projectsList.filter(p => p._id !== id));
    } catch (error) {
      alert('Delete failed.');
    }
  };

  const handleProjectClick = () => {
    analyticsAPI.track('project_click');
  };

  return (
    <section className="py-28 relative bg-transparent border-t border-white/5">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <motion.div 
          className="text-left mb-20"
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <span className="text-[10px] font-bold uppercase tracking-widest text-indigo-400 font-display">Featured Spotlight</span>
          <h2 className="section-heading mt-1 font-display tracking-tight text-white flex items-center gap-2">
            Case Studies
          </h2>
          <div className="h-[1px] w-full bg-white/5 mt-4" />
        </motion.div>

        {/* Dynamic Showcase */}
        <div className="space-y-28">
          {featuredProjects.map((project, index) => (
            <motion.div
              key={project._id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-100px' }}
              transition={{ duration: 0.6, delay: 0.05 }}
              className="grid grid-cols-1 md:grid-cols-12 gap-10 items-center"
            >
              {/* Left/Right Thumbnail Preview based on Alternating Index */}
              <div 
                className={`md:col-span-7 group relative overflow-hidden rounded-2xl border border-white/5 bg-slate-900/40 p-1.5 shadow-xl hover:border-indigo-500/25 transition-all duration-300 ${
                  index % 2 === 0 ? 'md:order-1' : 'md:order-2'
                }`}
              >
                <div className="relative w-full aspect-video rounded-xl overflow-hidden bg-slate-950">
                  {project.image ? (
                    <motion.img 
                      src={project.image} 
                      alt={project.title} 
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                    />
                  ) : (
                    <div className="w-full aspect-video flex items-center justify-center text-slate-500 font-semibold text-xs">
                      No cover image uploaded
                    </div>
                  )}

                  {/* Highlight overlay border */}
                  <div className="absolute inset-0 border border-white/5 pointer-events-none rounded-xl" />
                </div>
                
                {editMode && (
                  <div className="absolute top-4 right-4 flex gap-2 z-20">
                    <button
                      onClick={() => openEditModal(project)}
                      className="p-2.5 bg-slate-950/80 backdrop-blur-md border border-white/5 text-slate-400 hover:text-white rounded-xl transition-all shadow-lg hover:border-indigo-500/35"
                      title="Edit Case Study"
                    >
                      <FaEdit size={12} />
                    </button>
                    <button
                      onClick={() => handleDelete(project._id)}
                      className="p-2.5 bg-rose-950/30 backdrop-blur-md border border-rose-900/40 text-rose-400 hover:text-rose-300 rounded-xl transition-all shadow-lg"
                      title="Delete Project"
                    >
                      <FaTrash size={12} />
                    </button>
                  </div>
                )}
              </div>

              {/* Details (Reversing Grid layout matching Thumbnail alignment) */}
              <div 
                className={`md:col-span-5 flex flex-col space-y-4 ${
                  index % 2 === 0 ? 'md:order-2' : 'md:order-1'
                }`}
              >
                <span className="text-[9px] font-bold text-indigo-400 uppercase tracking-widest font-display flex items-center gap-1.5">
                  <FaStar className="animate-pulse" size={10} /> Case Study
                </span>
                
                <h3 className="sub-heading text-white font-display font-bold text-xl sm:text-2xl leading-snug">
                  {project.title}
                </h3>

                <p className="body-text text-slate-300">
                  {project.description}
                </p>

                <div className="flex flex-wrap gap-2 pt-2">
                  {project.technologies.map(tech => (
                    <span key={tech} className="cyber-badge bg-slate-900/60 border-white/5 text-slate-400">
                      {tech}
                    </span>
                  ))}
                </div>

                <div className="flex items-center gap-4 pt-4 border-t border-white/5 mt-4">
                  {project.githubUrl && (
                    <motion.a
                      href={project.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={handleProjectClick}
                      className="text-slate-400 hover:text-white transition-colors flex items-center gap-2 text-xs font-bold font-display"
                      whileHover={{ x: 3 }}
                    >
                      <FaGithub size={15} /> Code Repository
                    </motion.a>
                  )}
                  {project.liveUrl && (
                    <motion.a
                      href={project.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={handleProjectClick}
                      className="btn-primary flex items-center gap-2 text-xs py-2.5 px-4 ml-auto"
                      whileHover={{ scale: 1.02, boxShadow: '0 0 15px rgba(255, 255, 255, 0.15)' }}
                      whileTap={{ scale: 0.98 }}
                    >
                      Launch Project <FaExternalLinkAlt size={10} />
                    </motion.a>
                  )}
                </div>
              </div>

            </motion.div>
          ))}

          {featuredProjects.length === 0 && editMode && (
            <div className="text-center py-12 text-slate-500 text-xs font-sans border border-dashed border-white/5 rounded-2xl bg-slate-950/30">
              No featured project selected. Turn on Edit Mode and mark projects as featured in the Projects grid below.
            </div>
          )}
        </div>

      </div>

      {/* Case Study CMS Edit Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm" 
              onClick={() => setIsModalOpen(false)} 
            />
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="relative w-full max-w-lg p-6 glass-panel rounded-2xl shadow-2xl max-h-[85vh] overflow-y-auto"
            >
              <button 
                onClick={() => setIsModalOpen(false)}
                className="absolute top-4 right-4 text-slate-500 hover:text-white transition-colors"
              >
                <FaTimes size={14} />
              </button>

              <h3 className="text-[10px] font-bold text-slate-200 border-b border-white/5 pb-2.5 mb-6 font-display uppercase tracking-wider">
                Edit Case Study Detail
              </h3>

              <form onSubmit={handleFormSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[9px] font-bold uppercase tracking-wider text-slate-500 mb-1">Project Title</label>
                    <input
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      className="cyber-input py-2 text-xs"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-[9px] font-bold uppercase tracking-wider text-slate-500 mb-1">Tech Stack (Comma split)</label>
                    <input
                      type="text"
                      name="technologies"
                      value={formData.technologies}
                      onChange={handleInputChange}
                      className="cyber-input py-2 text-xs"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[9px] font-bold uppercase tracking-wider text-slate-500 mb-1">Description</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows="3"
                    className="cyber-input py-2 text-xs resize-none"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[9px] font-bold uppercase tracking-wider text-slate-500 mb-1">GitHub Link</label>
                    <input
                      type="url"
                      name="githubUrl"
                      value={formData.githubUrl}
                      onChange={handleInputChange}
                      className="cyber-input py-2 text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-[9px] font-bold uppercase tracking-wider text-slate-500 mb-1">Live URL</label>
                    <input
                      type="url"
                      name="liveUrl"
                      value={formData.liveUrl}
                      onChange={handleInputChange}
                      className="cyber-input py-2 text-xs"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[9px] font-bold uppercase tracking-wider text-slate-500 mb-1">Cover Image</label>
                  <div className="flex items-center gap-3">
                    <input
                      type="text"
                      name="image"
                      value={formData.image}
                      onChange={handleInputChange}
                      className="cyber-input py-2 text-xs flex-1"
                    />
                    <label className="cursor-pointer bg-slate-950 hover:bg-slate-900 text-slate-200 border border-white/5 px-3 py-2 rounded-xl text-[10px] font-semibold flex items-center gap-1.5 transition-colors">
                      <FaCamera /> Upload
                      <input 
                        type="file" 
                        accept="image/*"
                        onChange={handleFileUpload}
                        className="hidden" 
                      />
                    </label>
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-2">
                  <input
                    type="checkbox"
                    id="featured"
                    name="featured"
                    checked={formData.featured}
                    onChange={handleInputChange}
                    className="w-3.5 h-3.5 bg-slate-950 border-white/5 rounded accent-indigo-500"
                  />
                  <label htmlFor="featured" className="text-[10px] font-semibold text-slate-400 select-none">
                    Feature this project on top (Spotlight)
                  </label>
                </div>

                <div className="flex items-center gap-3 pt-4 border-t border-white/5">
                  <button type="submit" className="btn-success text-[10px] px-4 py-2 font-semibold">
                    <FaCheck size={9} /> Save Changes
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="btn-secondary text-[10px] px-4 py-2 font-semibold"
                  >
                    <FaTimes size={9} /> Close
                  </button>
                </div>

              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default FeaturedSpotlight;
