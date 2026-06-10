import express from 'express';
import fs from 'fs';
import path from 'path';
import authMiddleware from '../middleware/auth.js';
import upload from '../middleware/upload.js';

const router = express.Router();
const uploadDir = './uploads';

// Upload endpoint (Admin only)
router.post('/upload', authMiddleware, upload.single('file'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded.' });
    }
    
    // Express serves static files from '/uploads' directory, so reference it relatively
    const fileUrl = `/uploads/${req.file.filename}`;
    
    return res.status(200).json({
      message: 'File uploaded successfully!',
      url: fileUrl,
      fileName: req.file.filename,
      originalName: req.file.originalname,
      mimeType: req.file.mimetype,
      size: req.file.size
    });
  } catch (error) {
    return res.status(500).json({ message: 'Upload failed', error: error.message });
  }
});

// List all uploaded files (Admin only)
router.get('/', authMiddleware, (req, res) => {
  try {
    if (!fs.existsSync(uploadDir)) {
      return res.status(200).json([]);
    }

    const files = fs.readdirSync(uploadDir);
    const fileList = files.map(file => {
      const filePath = path.join(uploadDir, file);
      const stat = fs.statSync(filePath);
      const ext = path.extname(file).toLowerCase();
      
      return {
        fileName: file,
        url: `/uploads/${file}`,
        size: stat.size,
        createdAt: stat.birthtime || stat.mtime,
        isPDF: ext === '.pdf',
        isImage: ['.png', '.jpg', '.jpeg', '.webp'].includes(ext)
      };
    });

    // Sort by creation date descending
    fileList.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    return res.status(200).json(fileList);
  } catch (error) {
    return res.status(500).json({ message: 'Error scanning uploaded assets', error: error.message });
  }
});

// Delete an asset (Admin only)
router.delete('/:filename', authMiddleware, (req, res) => {
  try {
    const { filename } = req.params;
    // Prevent directory traversal attacks
    const sanitizedFilename = path.basename(filename);
    const filePath = path.join(uploadDir, sanitizedFilename);

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ message: 'File not found on server.' });
    }

    fs.unlinkSync(filePath);
    return res.status(200).json({ message: 'File deleted successfully!' });
  } catch (error) {
    return res.status(500).json({ message: 'Error deleting asset file', error: error.message });
  }
});

export default router;
