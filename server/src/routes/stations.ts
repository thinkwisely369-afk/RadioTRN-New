import express, { Response } from 'express';
import pool from '../config/database';
import { authenticateToken, requireAdmin, AuthRequest } from '../middleware/auth';
import { validateStation } from '../middleware/validation';
import { RowDataPacket, ResultSetHeader } from 'mysql2';

const router = express.Router();

interface Station extends RowDataPacket {
  id: number;
  name: string;
  tagline: string;
  genre: string;
  stream_url: string;
  color: string;
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
}

// Get all active stations (public endpoint)
router.get('/', async (req, res: Response) => {
  try {
    const [rows] = await pool.query<Station[]>(
      'SELECT id, name, slug, tagline, genre, stream_url as streamUrl, color, logo_url as logoUrl, is_active as isActive FROM stations WHERE is_active = TRUE ORDER BY name'
    );
    res.json(rows);
  } catch (error) {
    console.error('Error fetching stations:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get all stations including inactive (admin only)
router.get('/all', authenticateToken, requireAdmin, async (req: AuthRequest, res: Response) => {
  try {
    const [rows] = await pool.query<Station[]>(
      'SELECT id, name, slug, tagline, genre, stream_url as streamUrl, color, logo_url as logoUrl, is_active as isActive, created_at as createdAt, updated_at as updatedAt FROM stations ORDER BY name'
    );
    res.json(rows);
  } catch (error) {
    console.error('Error fetching all stations:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get single station by slug
router.get('/slug/:slug', async (req, res: Response) => {
  try {
    const { slug } = req.params;
    
    // Basic slug validation
    if (!slug || typeof slug !== 'string' || slug.length === 0 || slug.length > 100) {
      return res.status(400).json({ error: 'Invalid slug' });
    }
    
    const [rows] = await pool.query<Station[]>(
      'SELECT id, name, slug, tagline, genre, stream_url as streamUrl, color, logo_url as logoUrl, is_active as isActive FROM stations WHERE slug = ?',
      [slug]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: 'Station not found' });
    }

    res.json(rows[0]);
  } catch (error) {
    console.error('Error fetching station by slug:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get single station by ID
router.get('/:id', async (req, res: Response) => {
  try {
    const { id } = req.params;
    
    // Validate ID is a number
    const stationId = parseInt(id, 10);
    if (isNaN(stationId) || stationId <= 0) {
      return res.status(400).json({ error: 'Invalid station ID' });
    }
    
    const [rows] = await pool.query<Station[]>(
      'SELECT id, name, slug, tagline, genre, stream_url as streamUrl, color, logo_url as logoUrl, is_active as isActive FROM stations WHERE id = ?',
      [stationId]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: 'Station not found' });
    }

    res.json(rows[0]);
  } catch (error) {
    console.error('Error fetching station:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create new station (admin only)
router.post('/', authenticateToken, requireAdmin, validateStation, async (req: AuthRequest, res: Response) => {
  try {
    const { name, slug, tagline, genre, streamUrl, color, logoUrl } = req.body;

    if (!name || !streamUrl) {
      return res.status(400).json({ error: 'Name and stream URL are required' });
    }

    const [result] = await pool.query<ResultSetHeader>(
      'INSERT INTO stations (name, slug, tagline, genre, stream_url, color, logo_url) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [name, slug || null, tagline || '', genre || '', streamUrl, color || '#3b82f6', logoUrl || null]
    );

    res.status(201).json({
      id: result.insertId,
      name,
      slug,
      tagline,
      genre,
      streamUrl,
      color: color || '#3b82f6',
      message: 'Station created successfully'
    });
  } catch (error) {
    console.error('Error creating station:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update station (admin only)
router.put('/:id', authenticateToken, requireAdmin, validateStation, async (req: AuthRequest, res: Response) => {
  try {
    const { name, slug, tagline, genre, streamUrl, color, logoUrl, isActive } = req.body;
    const { id } = req.params;
    
    // Validate ID is a number
    const stationId = parseInt(id, 10);
    if (isNaN(stationId) || stationId <= 0) {
      return res.status(400).json({ error: 'Invalid station ID' });
    }

    const [result] = await pool.query<ResultSetHeader>(
      'UPDATE stations SET name = ?, slug = ?, tagline = ?, genre = ?, stream_url = ?, color = ?, logo_url = ?, is_active = ? WHERE id = ?',
      [name, slug || null, tagline, genre, streamUrl, color, logoUrl || null, isActive !== undefined ? isActive : true, stationId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Station not found' });
    }

    res.json({ message: 'Station updated successfully' });
  } catch (error) {
    console.error('Error updating station:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete station (admin only)
router.delete('/:id', authenticateToken, requireAdmin, async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    
    // Validate ID is a number
    const stationId = parseInt(id, 10);
    if (isNaN(stationId) || stationId <= 0) {
      return res.status(400).json({ error: 'Invalid station ID' });
    }
    
    const [result] = await pool.query<ResultSetHeader>(
      'DELETE FROM stations WHERE id = ?',
      [stationId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Station not found' });
    }

    res.json({ message: 'Station deleted successfully' });
  } catch (error) {
    console.error('Error deleting station:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
