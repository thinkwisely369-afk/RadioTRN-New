import express, { Response } from 'express';
import multer from 'multer';
import sharp from 'sharp';
import path from 'path';
import fs from 'fs';
import { authenticateToken, requireAdmin, AuthRequest } from '../middleware/auth';

const router = express.Router();

// Configure multer for memory storage
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only JPEG, PNG and WebP are allowed.'));
    }
  },
});

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, '../../uploads/logos');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Upload and process station logo
router.post('/logo', authenticateToken, requireAdmin, upload.single('logo'), async (req: AuthRequest, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    // Get crop parameters from request body
    const { cropX = 0, cropY = 0, cropWidth, cropHeight } = req.body;

    // Generate unique filename
    const filename = `logo-${Date.now()}-${Math.random().toString(36).substring(7)}.png`;
    const filepath = path.join(uploadsDir, filename);

    // Process image with sharp
    let image = sharp(req.file.buffer);

    // Apply cropping if parameters provided
    if (cropWidth && cropHeight) {
      image = image.extract({
        left: parseInt(cropX),
        top: parseInt(cropY),
        width: parseInt(cropWidth),
        height: parseInt(cropHeight),
      });
    }

    // Resize to 500x500 (square) and save
    await image
      .resize(500, 500, {
        fit: 'cover',
        position: 'center',
      })
      .png({ quality: 90 })
      .toFile(filepath);

    // Return the URL to access the file
    const logoUrl = `/uploads/logos/${filename}`;

    res.json({
      success: true,
      logoUrl,
      filename,
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ error: 'Failed to upload and process image' });
  }
});

// Sanitize filename to prevent path traversal attacks
const sanitizeFilename = (filename: string): string => {
  // Remove any path separators and normalize
  const sanitized = path.basename(filename);
  // Only allow alphanumeric, dots, hyphens, and underscores
  return sanitized.replace(/[^a-zA-Z0-9._-]/g, '');
};

// Delete logo file
router.delete('/logo/:filename', authenticateToken, requireAdmin, async (req: AuthRequest, res: Response) => {
  try {
    const { filename } = req.params;
    
    // Sanitize filename to prevent path traversal
    const sanitizedFilename = sanitizeFilename(filename);
    
    // Validate that filename starts with 'logo-' for security
    if (!sanitizedFilename.startsWith('logo-')) {
      return res.status(400).json({ error: 'Invalid filename format' });
    }
    
    const filepath = path.join(uploadsDir, sanitizedFilename);
    
    // Additional security: ensure the resolved path is within uploadsDir
    const resolvedPath = path.resolve(filepath);
    const resolvedUploadsDir = path.resolve(uploadsDir);
    
    if (!resolvedPath.startsWith(resolvedUploadsDir)) {
      return res.status(400).json({ error: 'Invalid file path' });
    }

    if (fs.existsSync(filepath)) {
      fs.unlinkSync(filepath);
      res.json({ success: true, message: 'Logo deleted successfully' });
    } else {
      res.status(404).json({ error: 'Logo file not found' });
    }
  } catch (error) {
    console.error('Delete error:', error);
    res.status(500).json({ error: 'Failed to delete logo' });
  }
});

export default router;
