import express from 'express';
import fs from 'fs';
import path from 'path';
import authMiddleware from '../middleware/auth.js';
import upload from '../middleware/upload.js';
import Media from '../models/Media.js';

const router = express.Router();

// Upload endpoint (Admin only)
router.post('/upload', authMiddleware, upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded.' });
    }
    
    // Generate unique filename since memoryStorage doesn't provide it
    const fileExt = path.extname(req.file.originalname);
    const baseName = path.basename(req.file.originalname, fileExt)
      .replace(/[^a-zA-Z0-9]/g, '_')
      .toLowerCase();
    const filename = `${baseName}_${Date.now()}${fileExt}`;
    
    // Convert buffer to Base64 data string
    const base64Data = req.file.buffer.toString('base64');
    
    // Create new media document
    const media = new Media({
      fileName: filename,
      data: base64Data,
      mimeType: req.file.mimetype,
      size: req.file.size
    });
    await media.save();
    
    // Express serves static files from '/uploads' directory, so reference it relatively
    const fileUrl = `/uploads/${filename}`;
    
    return res.status(200).json({
      message: 'File uploaded successfully!',
      url: fileUrl,
      fileName: filename,
      originalName: req.file.originalname,
      mimeType: req.file.mimetype,
      size: req.file.size
    });
  } catch (error) {
    return res.status(500).json({ message: 'Upload failed', error: error.message });
  }
});

// List all uploaded files (Admin only)
router.get('/', authMiddleware, async (req, res) => {
  try {
    const mediaFiles = await Media.find({}).sort({ createdAt: -1 });
    const fileList = mediaFiles.map(file => {
      const ext = path.extname(file.fileName).toLowerCase();
      
      return {
        fileName: file.fileName,
        url: `/uploads/${file.fileName}`,
        size: file.size,
        createdAt: file.createdAt,
        isPDF: ext === '.pdf',
        isImage: ['.png', '.jpg', '.jpeg', '.webp'].includes(ext)
      };
    });

    return res.status(200).json(fileList);
  } catch (error) {
    return res.status(500).json({ message: 'Error scanning uploaded assets', error: error.message });
  }
});

// Delete an asset (Admin only)
router.delete('/:filename', authMiddleware, async (req, res) => {
  try {
    const { filename } = req.params;
    // Prevent directory traversal attacks
    const sanitizedFilename = path.basename(filename);

    const media = await Media.findOneAndDelete({ fileName: sanitizedFilename });
    if (!media) {
      // Try local fallbacks as a cleanup mechanism for older files
      const pathsToTry = [
        path.join('./uploads', sanitizedFilename),
        path.join('./backend/uploads', sanitizedFilename)
      ];
      let deletedLocal = false;
      for (const p of pathsToTry) {
        if (fs.existsSync(p)) {
          fs.unlinkSync(p);
          deletedLocal = true;
        }
      }
      if (deletedLocal) {
        return res.status(200).json({ message: 'Local file deleted successfully!' });
      }
      return res.status(404).json({ message: 'File not found on server or database.' });
    }

    return res.status(200).json({ message: 'File deleted successfully!' });
  } catch (error) {
    return res.status(500).json({ message: 'Error deleting asset file', error: error.message });
  }
});

export default router;
