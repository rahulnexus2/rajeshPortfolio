import mongoose from 'mongoose';

const SkillSchema = new mongoose.Schema({
  skillName: { type: String, required: true },
  icon: { type: String, default: 'FaCode' }, // Default react icon name
  category: { type: String, required: true, default: 'Frontend' }, // E.g., Frontend, Backend, Database, Tools
  proficiency: { type: Number, required: true, min: 0, max: 100, default: 80 },
  displayOrder: { type: Number, default: 0 }
}, { timestamps: true });

export default mongoose.model('Skill', SkillSchema);
