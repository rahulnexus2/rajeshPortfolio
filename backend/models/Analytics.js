import mongoose from 'mongoose';

const AnalyticsSchema = new mongoose.Schema({
  key: { type: String, default: 'global_stats', unique: true },
  visits: { type: Number, default: 0 },
  resumeDownloads: { type: Number, default: 0 },
  projectClicks: { type: Number, default: 0 },
  contactSubmissions: { type: Number, default: 0 }
}, { timestamps: true });

export default mongoose.model('Analytics', AnalyticsSchema);
