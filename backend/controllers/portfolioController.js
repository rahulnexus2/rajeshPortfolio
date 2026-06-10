import PortfolioSettings from '../models/PortfolioSettings.js';
import Analytics from '../models/Analytics.js';

// Get settings and track visit
export const getPortfolio = async (req, res) => {
  try {
    let settings = await PortfolioSettings.findOne();
    if (!settings) {
      // Seed default data
      settings = await PortfolioSettings.create({
        name: 'Rajesh Rautela',
        title: 'Full Stack Developer',
        tagline: 'Building scalable web applications using MERN Stack and Artificial Intelligence.',
        profileImage: '',
        resumeUrl: '',
        aboutHeading: 'Full Stack AI Developer',
        aboutDescription: 'Full Stack AI Developer interested in MERN Stack and Artificial Intelligence. Specialized in developing robust, scalable backends alongside interactive, animated frontend applications.',
        careerObjective: 'To leverage modern technologies, AI integrations, and dynamic architectures to build next-generation web platforms that solve real-world problems.',
        location: 'New Delhi, India',
        email: 'rajesh@example.com',
        phone: '+91 9876543210',
        github: 'https://github.com',
        linkedin: 'https://linkedin.com'
      });
    }

    // Increment visit analytics
    // Use upsert to create key if it doesn't exist
    await Analytics.findOneAndUpdate(
      { key: 'global_stats' },
      { $inc: { visits: 1 } },
      { upsert: true, new: true }
    );

    return res.status(200).json(settings);
  } catch (error) {
    return res.status(500).json({ message: 'Error retrieving portfolio data', error: error.message });
  }
};

// Update settings (Admin only)
export const updatePortfolio = async (req, res) => {
  try {
    let settings = await PortfolioSettings.findOne();
    if (!settings) {
      settings = new PortfolioSettings(req.body);
    } else {
      Object.assign(settings, req.body);
    }
    
    await settings.save();
    return res.status(200).json({
      message: 'Portfolio settings updated successfully!',
      settings
    });
  } catch (error) {
    return res.status(500).json({ message: 'Error updating portfolio data', error: error.message });
  }
};
