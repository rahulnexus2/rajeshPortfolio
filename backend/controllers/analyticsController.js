import Analytics from '../models/Analytics.js';
import ContactMessage from '../models/ContactMessage.js';

// Retrieve analytics details (Admin only)
export const getAnalytics = async (req, res) => {
  try {
    let stats = await Analytics.findOne({ key: 'global_stats' });
    if (!stats) {
      stats = await Analytics.create({ key: 'global_stats' });
    }

    // Query messages count to ensure sync, or use the counter
    const messageCount = await ContactMessage.countDocuments();

    return res.status(200).json({
      visits: stats.visits,
      resumeDownloads: stats.resumeDownloads,
      projectClicks: stats.projectClicks,
      contactSubmissions: messageCount // Use actual database count for exact sync
    });
  } catch (error) {
    return res.status(500).json({ message: 'Error retrieving analytics data', error: error.message });
  }
};

// Track specific event (Public)
export const trackEvent = async (req, res) => {
  const { eventType } = req.body;
  if (!eventType) {
    return res.status(400).json({ message: 'eventType is required' });
  }

  try {
    let updateOp = {};
    if (eventType === 'download') {
      updateOp = { $inc: { resumeDownloads: 1 } };
    } else if (eventType === 'project_click') {
      updateOp = { $inc: { projectClicks: 1 } };
    } else {
      return res.status(400).json({ message: 'Invalid eventType' });
    }

    const stats = await Analytics.findOneAndUpdate(
      { key: 'global_stats' },
      updateOp,
      { upsert: true, new: true }
    );

    return res.status(200).json({ message: 'Event tracked successfully!', stats });
  } catch (error) {
    return res.status(500).json({ message: 'Error tracking event', error: error.message });
  }
};
