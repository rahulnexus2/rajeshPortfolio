import mongoose from 'mongoose';

const PortfolioSettingsSchema = new mongoose.Schema({
  name: { type: String, default: 'Rajesh Rautela' },
  title: { type: String, default: 'Full Stack Developer' },
  tagline: { type: String, default: 'Building scalable web applications using MERN Stack and Artificial Intelligence.' },
  profileImage: { type: String, default: '' },
  resumeUrl: { type: String, default: '' },
  aboutHeading: { type: String, default: 'Full Stack AI Developer' },
  aboutDescription: { type: String, default: '' },
  careerObjective: { type: String, default: '' },
  location: { type: String, default: '' },
  email: { type: String, default: '' },
  phone: { type: String, default: '' },
  github: { type: String, default: '' },
  linkedin: { type: String, default: '' }
}, { timestamps: true });

export default mongoose.model('PortfolioSettings', PortfolioSettingsSchema);
