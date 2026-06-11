import PortfolioSettings from '../models/PortfolioSettings.js';
import Analytics from '../models/Analytics.js';
import cloudinary from '../config/cloudinary.js';
import streamifier from 'streamifier';

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

// Upload Profile Image to Cloudinary and update PortfolioSettings
export const uploadProfileImage = async (req, res) => {
  try {
    let settings = await PortfolioSettings.findOne();
    if (!settings) {
      settings = new PortfolioSettings();
    }

    // 1. Delete old profile image if it exists in Cloudinary
    if (settings.profileImagePublicId) {
      try {
        await cloudinary.uploader.destroy(settings.profileImagePublicId);
      } catch (err) {
        console.error('Error deleting old image from Cloudinary:', err);
      }
    }

    // 2. Stream new file buffer to Cloudinary
    const uploadStream = () => {
      return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          {
            folder: 'portfolio/profile',
            transformation: [
              { width: 500, height: 500, crop: 'fill', quality: 'auto' }
            ]
          },
          (error, result) => {
            if (error) return reject(error);
            resolve(result);
          }
        );
        streamifier.createReadStream(req.file.buffer).pipe(stream);
      });
    };

    const uploadResult = await uploadStream();

    // 3. Update database fields
    settings.profileImage = uploadResult.secure_url;
    settings.profileImagePublicId = uploadResult.public_id;
    await settings.save();

    return res.status(200).json({
      message: 'Profile image uploaded successfully!',
      url: settings.profileImage,
      settings
    });
  } catch (error) {
    return res.status(500).json({ message: 'Error uploading profile image', error: error.message });
  }
};

// Upload Resume to Cloudinary and update PortfolioSettings
export const uploadResume = async (req, res) => {
  try {
    let settings = await PortfolioSettings.findOne();
    if (!settings) {
      settings = new PortfolioSettings();
    }

    // 1. Delete old resume if it exists in Cloudinary
    if (settings.resumePublicId) {
      try {
        await cloudinary.uploader.destroy(settings.resumePublicId, { resource_type: 'raw' });
      } catch (err) {
        console.error('Error deleting old resume from Cloudinary:', err);
      }
    }

    // 2. Stream new file buffer to Cloudinary
    const uploadStream = () => {
      return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          {
            folder: 'portfolio/resume',
            public_id: 'resume',
            resource_type: 'raw'
          },
          (error, result) => {
            if (error) return reject(error);
            resolve(result);
          }
        );
        streamifier.createReadStream(req.file.buffer).pipe(stream);
      });
    };

    const uploadResult = await uploadStream();

    // 3. Update database fields
    settings.resumeUrl = uploadResult.secure_url;
    settings.resumePublicId = uploadResult.public_id;
    await settings.save();

    return res.status(200).json({
      message: 'Resume PDF uploaded successfully!',
      url: settings.resumeUrl,
      settings
    });
  } catch (error) {
    return res.status(500).json({ message: 'Error uploading resume PDF', error: error.message });
  }
};
