import React, { useState, useEffect } from 'react';
import { useAdmin } from '../context/AdminContext';
import { projectsAPI, mediaAPI, analyticsAPI } from '../utils/api';
import { 
  FaGithub, FaExternalLinkAlt, FaPlus, FaTrash, 
  FaEdit, FaCheck, FaTimes, FaSearch, FaStar, FaGripLines, FaCamera 
} from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

const Projects = ({ projectsList, onUpdate }) => {
  const { editMode } = useAdmin();
  const [projects, setProjects] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');
  
  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState('add');
  const [selectedProjectId, setSelectedProjectId] = useState(null);
  const [draggedIndex, setDraggedIndex] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    image: '',
    technologies: '',
    githubUrl: '',
    liveUrl: '',
    featured: false
  });

  useEffect(() => {
    if (projectsList) {
      setProjects(projectsList);
    }
  }, [projectsList]);

  // Tech stack list for filtering
  const allTechnologies = ['All', ...new Set(
    projects.flatMap(p => p.technologies || [])
  )];

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

  const openAddModal = () => {
    setFormData({
      title: '',
      description: '',
      image: '',
      technologies: '',
      githubUrl: '',
      liveUrl: '',
      featured: false
    });
    setModalType('add');
    setIsModalOpen(true);
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
    setModalType('edit');
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
      if (modalType === 'add') {
        const response = await projectsAPI.create(payload);
        onUpdate([...projects, response.project]);
      } else {
        const response = await projectsAPI.update(selectedProjectId, payload);
        onUpdate(projects.map(p => p._id === selectedProjectId ? response.project : p));
      }
      setIsModalOpen(false);
    } catch (error) {
      alert('Save failed.');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete project?')) return;
    try {
      await projectsAPI.delete(id);
      onUpdate(projects.filter(p => p._id !== id));
    } catch (error) {
      alert('Delete failed.');
    }
  };

  const handleProjectClick = () => {
    analyticsAPI.track('project_click');
  };

  // HTML5 Drag and Drop
  const handleDragStart = (e, index) => {
    if (!editMode) return;
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = 'move';
    const img = new Image();
    img.src = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';
    e.dataTransfer.setDragImage(img, 0, 0);
  };

  const handleDragEnter = (e, index) => {
    if (draggedIndex === null || draggedIndex === index) return;
    
    const updatedProjects = [...projects];
    const draggedItem = updatedProjects[draggedIndex];
    updatedProjects.splice(draggedIndex, 1);
    updatedProjects.splice(index, 0, draggedItem);
    
    setDraggedIndex(index);
    setProjects(updatedProjects);
  };

  const handleDragEnd = async () => {
    setDraggedIndex(null);
    if (!editMode) return;
    try {
      await projectsAPI.reorder(projects.map(p => p._id));
    } catch (error) {
      console.error('Failed to save order:', error.message);
    }
  };

  // Search & Filter list
  const filteredProjects = projects.filter(project => {
    const matchesSearch = 
      project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.description.toLowerCase().includes(searchTerm.toLowerCase());
      
    if (activeFilter === 'All') return matchesSearch;
    return matchesSearch && (project.technologies || []).includes(activeFilter);
  });

  return (
    <section id="projects" className="py-28 relative bg-transparent border-t border-white/5">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <motion.div 
          className="text-left mb-16"
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <span className="text-[10px] font-bold uppercase tracking-widest text-indigo-400 font-display">03 / Projects</span>
          <h2 className="section-heading mt-1 font-display tracking-tight text-white">Project Grid</h2>
          <div className="h-[1px] w-full bg-white/5 mt-4" />
        </motion.div>

        {/* CMS Control Add button */}
        {editMode && (
          <div className="flex justify-end mb-8">
            <button
              onClick={openAddModal}
              className="px-3.5 py-2 rounded-xl text-[10px] font-bold uppercase tracking-wider bg-slate-900/60 text-slate-400 border border-white/5 hover:border-white/10 hover:text-white flex items-center gap-1.5 transition-colors shadow-sm"
            >
              <FaPlus size={8} className="text-indigo-400" /> Add New Project
            </button>
          </div>
        )}

        {/* Search bar + filter pills */}
        <div className="flex flex-col md:flex-row gap-5 justify-between items-start md:items-center mb-12">
          <div className="relative w-full md:max-w-xs">
            <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-500">
              <FaSearch size={12} />
            </span>
            <input
              type="text"
              placeholder="Search keyword..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="cyber-input py-2.5 pl-9.5 text-xs"
            />
          </div>

          <div className="flex flex-wrap gap-2 justify-start max-w-xl">
            {allTechnologies.map(tech => (
              <button
                key={tech}
                onClick={() => setActiveFilter(tech)}
                className={`px-3 py-1.5 rounded-xl text-[10px] font-bold tracking-wider uppercase border transition-all duration-200 ${
                  activeFilter === tech
                    ? 'bg-slate-100 text-[#030712] border-slate-100 shadow-glow-sm'
                    : 'bg-slate-900/40 text-slate-500 border-white/5 hover:border-white/10 hover:text-slate-300'
                }`}
              >
                {tech}
              </button>
            ))}
          </div>
        </div>

        {/* Grid Showcase */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence mode="popLayout">
            {filteredProjects.map((project, index) => {
              const globalIndex = projects.findIndex(p => p._id === project._id);
              
              return (
                <motion.div
                  layout
                  key={project._id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  whileHover={{ y: -6, transition: { duration: 0.2 } }}
                  transition={{ duration: 0.3 }}
                  draggable={editMode}
                  onDragStart={(e) => handleDragStart(e, globalIndex)}
                  onDragEnter={(e) => handleDragEnter(e, globalIndex)}
                  onDragEnd={handleDragEnd}
                  className={`group relative premium-card bg-slate-900/40 border-white/5 flex flex-col h-full overflow-hidden transition-all duration-300 hover:border-indigo-500/20 hover:shadow-[0_12px_30px_-10px_rgba(99,102,241,0.12)] ${
                    draggedIndex === globalIndex ? 'opacity-40 scale-[0.98]' : ''
                  } ${editMode ? 'cursor-move' : ''}`}
                >
                  {/* Image Cover */}
                  <div className="relative aspect-video w-full overflow-hidden bg-slate-950 border-b border-white/5">
                    {project.image ? (
                      <motion.img 
                        src={project.image} 
                        alt={project.title} 
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-slate-600 bg-slate-950">
                        <FaCamera size={18} />
                      </div>
                    )}
                    
                    {project.featured && (
                      <span className="absolute top-2.5 right-2.5 bg-slate-950/85 backdrop-blur-md border border-white/10 text-indigo-400 px-2.5 py-0.5 rounded-lg text-[8px] font-bold uppercase tracking-wider flex items-center gap-1 font-display">
                        <FaStar size={8} className="text-indigo-400" /> Spotlight
                      </span>
                    )}

                    {editMode && (
                      <div className="absolute top-2.5 left-2.5 bg-slate-950/85 backdrop-blur-md text-slate-500 p-1.5 rounded-xl border border-white/10">
                        <FaGripLines size={10} />
                      </div>
                    )}
                  </div>

                  {/* Body Content */}
                  <div className="p-5 flex flex-col flex-1 space-y-4">
                    <div className="flex items-start justify-between gap-3">
                      <h4 className="text-sm font-bold text-white font-display truncate" title={project.title}>
                        {project.title}
                      </h4>
                      
                      {editMode && (
                        <div className="flex gap-1.5 flex-shrink-0">
                          <button
                            onClick={() => openEditModal(project)}
                            className="text-slate-400 hover:text-white p-1.5 rounded-xl bg-slate-950 border border-white/5 transition-colors"
                            title="Edit details"
                          >
                            <FaEdit size={10} />
                          </button>
                          <button
                            onClick={() => handleDelete(project._id)}
                            className="text-slate-400 hover:text-rose-400 p-1.5 rounded-xl bg-slate-950 border border-white/5 transition-colors"
                            title="Delete project"
                          >
                            <FaTrash size={10} />
                          </button>
                        </div>
                      )}
                    </div>

                    <p className="text-[12px] text-slate-400 leading-relaxed font-sans line-clamp-3">
                      {project.description}
                    </p>

                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {project.technologies.slice(0, 3).map(tech => (
                        <span key={tech} className="cyber-badge bg-slate-950/50 border-white/5 text-slate-400">
                          {tech}
                        </span>
                      ))}
                      {project.technologies.length > 3 && (
                        <span className="text-[8px] font-bold text-slate-500 bg-slate-950/50 px-2 py-0.5 rounded-md border border-white/5 font-sans">
                          +{project.technologies.length - 3}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-3 pt-3 border-t border-white/5 mt-auto">
                      {project.githubUrl && (
                        <motion.a
                          href={project.githubUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={handleProjectClick}
                          className="text-slate-400 hover:text-white transition-colors flex items-center gap-1.5 text-[10px] font-bold font-display"
                          whileHover={{ x: 2 }}
                        >
                          <FaGithub size={13} /> Source Code
                        </motion.a>
                      )}
                      {project.liveUrl && (
                        <motion.a
                          href={project.liveUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={handleProjectClick}
                          className="text-slate-300 hover:text-white transition-colors flex items-center gap-1.5 text-[10px] font-bold font-display ml-auto"
                          whileHover={{ x: 2 }}
                        >
                          Launch Demo <FaExternalLinkAlt size={8} />
                        </motion.a>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

        {/* Empty state */}
        {filteredProjects.length === 0 && (
          <div className="text-center py-16 text-slate-500 text-xs font-sans">
            No projects matched search criteria.
          </div>
        )}
      </div>

      {/* CRUD dialog modal */}
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
                {modalType === 'add' ? 'Add Showcase Project' : 'Edit Showcase Project'}
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
                      placeholder="e.g. Supabase Driver"
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
                      placeholder="React, Express, MongoDB"
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
                    placeholder="Describe your showcase application..."
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
                      placeholder="https://github.com/..."
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
                      placeholder="https://live-build.com"
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
                      placeholder="/uploads/project.png"
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
                    id="featured-project"
                    name="featured"
                    checked={formData.featured}
                    onChange={handleInputChange}
                    className="w-3.5 h-3.5 bg-slate-950 border-white/5 rounded accent-indigo-500"
                  />
                  <label htmlFor="featured-project" className="text-[10px] font-semibold text-slate-400 select-none">
                    Feature this project on top (Spotlight)
                  </label>
                </div>

                <div className="flex items-center gap-3 pt-4 border-t border-white/5">
                  <button type="submit" className="btn-success text-[10px] px-4 py-2 font-semibold">
                    <FaCheck size={9} /> {modalType === 'add' ? 'Create' : 'Save Changes'}
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

export default Projects;
