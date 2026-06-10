import React, { useState, useEffect } from 'react';
import { useAdmin } from '../context/AdminContext';
import { skillsAPI } from '../utils/api';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaReact, FaNodeJs, FaHtml5, FaCss3Alt, FaJs, FaDatabase, 
  FaCode, FaPlus, FaTrash, FaEdit, FaCheck, FaTimes, FaGripLines, FaJava 
} from 'react-icons/fa';
import { SiMysql, SiPython, SiExpress } from 'react-icons/si';

const iconMap = {
  FaReact: <FaReact />,
  FaNodeJs: <FaNodeJs />,
  FaHtml5: <FaHtml5 />,
  FaCss3Alt: <FaCss3Alt />,
  FaJs: <FaJs />,
  FaDatabase: <FaDatabase />,
  FaCode: <FaCode />,
  SiMysql: <SiMysql />,
  SiPython: <SiPython />,
  SiJava: <FaJava />,
  SiExpress: <SiExpress />
};

const iconList = Object.keys(iconMap);

const Skills = ({ skillsList, onUpdate }) => {
  const { editMode } = useAdmin();
  const [skills, setSkills] = useState([]);
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [draggedIndex, setDraggedIndex] = useState(null);

  const [formData, setFormData] = useState({
    skillName: '',
    icon: 'FaCode',
    category: 'Frontend',
    proficiency: 80 // Maintain for DB compatibility
  });

  useEffect(() => {
    if (skillsList) {
      setSkills(skillsList);
    }
  }, [skillsList]);

  // Categories aligned to modern SaaS grouping
  const categories = ['Frontend', 'Backend', 'Database', 'Programming Languages', 'Other'];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ 
      ...prev, 
      [name]: name === 'proficiency' ? parseInt(value) || 0 : value 
    }));
  };

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    if (!formData.skillName.trim()) return;

    try {
      const response = await skillsAPI.create(formData);
      onUpdate([...skills, response.skill]);
      setIsAdding(false);
      resetForm();
    } catch (error) {
      alert('Save failed.');
    }
  };

  const handleEditSubmit = async (e, id) => {
    e.preventDefault();
    try {
      const response = await skillsAPI.update(id, formData);
      onUpdate(skills.map(s => s._id === id ? response.skill : s));
      setEditingId(null);
      resetForm();
    } catch (error) {
      alert('Save failed.');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete skill?')) return;
    try {
      await skillsAPI.delete(id);
      onUpdate(skills.filter(s => s._id !== id));
    } catch (error) {
      alert('Delete failed.');
    }
  };

  const startEdit = (skill) => {
    setEditingId(skill._id);
    setFormData({
      skillName: skill.skillName,
      icon: skill.icon || 'FaCode',
      category: skill.category || 'Frontend',
      proficiency: skill.proficiency || 80
    });
    setIsAdding(false);
  };

  const resetForm = () => {
    setFormData({
      skillName: '',
      icon: 'FaCode',
      category: 'Frontend',
      proficiency: 80
    });
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
    
    const updatedSkills = [...skills];
    const draggedItem = updatedSkills[draggedIndex];
    updatedSkills.splice(draggedIndex, 1);
    updatedSkills.splice(index, 0, draggedItem);
    
    setDraggedIndex(index);
    setSkills(updatedSkills);
  };

  const handleDragEnd = async () => {
    setDraggedIndex(null);
    if (!editMode) return;
    try {
      await skillsAPI.reorder(skills.map(s => s._id));
    } catch (error) {
      console.error('Failed to save order:', error.message);
    }
  };

  // Helpers to map incoming categories to database models compatibility
  const getSkillsByCategory = (category) => {
    return skills.filter(s => {
      if (category === 'Programming Languages') {
        return s.category === 'Programming Languages' || s.category === 'Languages';
      }
      return s.category === category;
    });
  };

  return (
    <section id="skills" className="py-28 relative bg-transparent border-t border-white/5">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <motion.div 
          className="text-left mb-16"
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <span className="text-[10px] font-bold uppercase tracking-widest text-indigo-400 font-display">04 / Stack</span>
          <h2 className="section-heading mt-1 font-display tracking-tight text-white">Technical Core</h2>
          <div className="h-[1px] w-full bg-white/5 mt-4" />
        </motion.div>

        {/* CMS Add Skills controls */}
        {editMode && !isAdding && !editingId && (
          <div className="flex justify-end mb-8">
            <button
              onClick={() => { resetForm(); setIsAdding(true); }}
              className="px-3.5 py-2 rounded-xl text-[10px] font-bold uppercase tracking-wider bg-slate-900/60 text-slate-400 border border-white/5 hover:border-white/10 hover:text-white flex items-center gap-1.5 transition-colors shadow-sm"
            >
              <FaPlus size={8} className="text-indigo-400" /> Add New Skill
            </button>
          </div>
        )}

        {/* Skill CRUD Form */}
        <AnimatePresence>
          {(isAdding || editingId) && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="max-w-md mx-auto glass-panel p-6 rounded-2xl mb-10 shadow-xl shadow-black/20 overflow-hidden"
            >
              <h3 className="text-[10px] font-bold text-slate-200 border-b border-white/5 pb-2.5 mb-4 font-display uppercase tracking-wider">
                {isAdding ? 'Create Skill Item' : 'Edit Skill Details'}
              </h3>
              
              <form onSubmit={isAdding ? handleAddSubmit : (e) => handleEditSubmit(e, editingId)} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[9px] font-bold uppercase tracking-wider text-slate-500 mb-1">Skill Name</label>
                    <input
                      type="text"
                      name="skillName"
                      value={formData.skillName}
                      onChange={handleInputChange}
                      className="cyber-input py-2 text-xs"
                      placeholder="e.g. React"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-[9px] font-bold uppercase tracking-wider text-slate-500 mb-1">Category</label>
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleInputChange}
                      className="cyber-input py-2 text-xs bg-slate-950 text-slate-200 border-white/5"
                    >
                      {categories.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[9px] font-bold uppercase tracking-wider text-slate-500 mb-1">Select Icon</label>
                    <select
                      name="icon"
                      value={formData.icon}
                      onChange={handleInputChange}
                      className="cyber-input py-2 text-xs bg-slate-950 text-slate-200 border-white/5"
                    >
                      {iconList.map(ico => (
                        <option key={ico} value={ico}>{ico}</option>
                      ))}
                    </select>
                  </div>

                  <div className="hidden">
                    <input
                      type="number"
                      name="proficiency"
                      value={formData.proficiency}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>

                <div className="flex items-center gap-3 pt-4 border-t border-white/5">
                  <button type="submit" className="btn-success text-[10px] px-4 py-2">
                    <FaCheck size={8} /> {isAdding ? 'Create' : 'Save Changes'}
                  </button>
                  <button
                    type="button"
                    onClick={() => { setIsAdding(false); setEditingId(null); resetForm(); }}
                    className="btn-secondary text-[10px] px-4 py-2"
                  >
                    <FaTimes size={8} /> Cancel
                  </button>
                </div>
              </form>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Categorized Skills (Technology Tags display) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {categories.map((category) => {
            const categorySkills = getSkillsByCategory(category);
            if (categorySkills.length === 0 && !editMode) return null;

            return (
              <motion.div 
                key={category} 
                className="premium-card p-6 border-white/5 bg-slate-900/40 flex flex-col h-full shadow-lg rounded-2xl"
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
              >
                {/* Category Header */}
                <h3 className="text-[10px] font-bold text-white mb-6 border-b border-white/5 pb-3 flex items-center justify-between font-display uppercase tracking-wider">
                  <span className="bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">{category}</span>
                  <span className="text-[9px] text-slate-500 font-sans tracking-wide">
                    {categorySkills.length} items
                  </span>
                </h3>

                {/* Tags Flex Container */}
                <div className="flex flex-wrap gap-2.5">
                  {categorySkills.map((skill) => {
                    const globalIndex = skills.findIndex(s => s._id === skill._id);
                    
                    return (
                      <motion.div
                        key={skill._id}
                        draggable={editMode}
                        onDragStart={(e) => handleDragStart(e, globalIndex)}
                        onDragEnter={(e) => handleDragEnter(e, globalIndex)}
                        onDragEnd={handleDragEnd}
                        className={`group/skill flex items-center gap-2 px-3 py-2 rounded-xl border border-white/5 bg-slate-950/60 transition-all duration-350 ${
                          draggedIndex === globalIndex 
                            ? 'opacity-40 scale-[0.98]' 
                            : editMode 
                              ? 'cursor-move hover:border-indigo-500/25' 
                              : 'hover:border-indigo-500/20 hover:text-white'
                        }`}
                        whileHover={!editMode ? { scale: 1.03, y: -1 } : {}}
                      >
                        {editMode && (
                          <span className="text-slate-500 cursor-grab active:cursor-grabbing mr-0.5">
                            <FaGripLines size={10} />
                          </span>
                        )}
                        <span className="text-slate-400 group-hover/skill:text-indigo-400 transition-colors text-xs">
                          {iconMap[skill.icon] || <FaCode />}
                        </span>
                        <span className="text-xs font-semibold text-slate-300 font-sans group-hover/skill:text-white transition-colors">
                          {skill.skillName}
                        </span>

                        {editMode && (
                          <div className="flex items-center gap-1.5 ml-1.5 pl-1.5 border-l border-white/5">
                            <button
                              onClick={() => startEdit(skill)}
                              className="text-slate-500 hover:text-white p-0.5 transition-colors"
                              title="Edit Skill"
                            >
                              <FaEdit size={10} />
                            </button>
                            <button
                              onClick={() => handleDelete(skill._id)}
                              className="text-slate-500 hover:text-rose-400 p-0.5 transition-colors"
                              title="Delete Skill"
                            >
                              <FaTrash size={10} />
                            </button>
                          </div>
                        )}
                      </motion.div>
                    );
                  })}
                </div>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
};

export default Skills;
