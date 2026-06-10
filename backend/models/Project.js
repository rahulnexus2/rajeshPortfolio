import mongoose from 'mongoose';

const ProjectSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  image: { type: String, default: '' },
  technologies: { type: [String], default: [] },
  githubUrl: { type: String, default: '' },
  liveUrl: { type: String, default: '' },
  featured: { type: Boolean, default: false },
  displayOrder: { type: Number, default: 0 }
}, { timestamps: true });

export default mongoose.model('Project', ProjectSchema);
