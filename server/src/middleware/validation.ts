import { Request, Response, NextFunction } from 'express';

// Validation helper functions
const isValidUrl = (url: string): boolean => {
  try {
    const urlObj = new URL(url);
    return ['http:', 'https:'].includes(urlObj.protocol);
  } catch {
    return false;
  }
};

const isValidColor = (color: string): boolean => {
  // Check if it's a valid hex color (#RRGGBB or #RRGGBBAA)
  return /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(color);
};

const isValidSlug = (slug: string): boolean => {
  // Allow alphanumeric, hyphens, and underscores, 1-100 chars
  return /^[a-zA-Z0-9_-]{1,100}$/.test(slug);
};

// Validate station creation/update data
export const validateStation = (req: Request, res: Response, next: NextFunction) => {
  const { name, slug, tagline, genre, streamUrl, color, logoUrl } = req.body;

  // Required fields
  if (!name || typeof name !== 'string' || name.trim().length === 0) {
    return res.status(400).json({ error: 'Station name is required and must be a non-empty string' });
  }

  if (name.length > 200) {
    return res.status(400).json({ error: 'Station name must be 200 characters or less' });
  }

  // Stream URL validation
  if (!streamUrl || typeof streamUrl !== 'string' || !isValidUrl(streamUrl)) {
    return res.status(400).json({ error: 'Valid stream URL is required (must be http:// or https://)' });
  }

  if (streamUrl.length > 500) {
    return res.status(400).json({ error: 'Stream URL must be 500 characters or less' });
  }

  // Optional slug validation
  if (slug !== undefined && slug !== null) {
    if (typeof slug !== 'string') {
      return res.status(400).json({ error: 'Slug must be a string' });
    }
    if (slug.trim().length > 0 && !isValidSlug(slug)) {
      return res.status(400).json({ error: 'Slug must contain only alphanumeric characters, hyphens, and underscores (1-100 characters)' });
    }
  }

  // Optional tagline validation
  if (tagline !== undefined && tagline !== null && typeof tagline === 'string' && tagline.length > 500) {
    return res.status(400).json({ error: 'Tagline must be 500 characters or less' });
  }

  // Optional genre validation
  if (genre !== undefined && genre !== null && typeof genre === 'string' && genre.length > 100) {
    return res.status(400).json({ error: 'Genre must be 100 characters or less' });
  }

  // Optional color validation
  if (color !== undefined && color !== null) {
    if (typeof color !== 'string' || !isValidColor(color)) {
      return res.status(400).json({ error: 'Color must be a valid hex color code (e.g., #3b82f6)' });
    }
  }

  // Optional logo URL validation
  if (logoUrl !== undefined && logoUrl !== null) {
    if (typeof logoUrl !== 'string') {
      return res.status(400).json({ error: 'Logo URL must be a string' });
    }
    if (logoUrl.length > 0 && logoUrl.length > 500) {
      return res.status(400).json({ error: 'Logo URL must be 500 characters or less' });
    }
    // If it's a full URL, validate it
    if (logoUrl.startsWith('http://') || logoUrl.startsWith('https://')) {
      if (!isValidUrl(logoUrl)) {
        return res.status(400).json({ error: 'Logo URL must be a valid URL' });
      }
    }
  }

  // Optional isActive validation (for updates)
  if (req.body.isActive !== undefined && typeof req.body.isActive !== 'boolean') {
    return res.status(400).json({ error: 'isActive must be a boolean value' });
  }

  next();
};

// Validate login data
export const validateLogin = (req: Request, res: Response, next: NextFunction) => {
  const { username, password } = req.body;

  if (!username || typeof username !== 'string' || username.trim().length === 0) {
    return res.status(400).json({ error: 'Username is required and must be a non-empty string' });
  }

  if (username.length > 100) {
    return res.status(400).json({ error: 'Username must be 100 characters or less' });
  }

  if (!password || typeof password !== 'string' || password.length === 0) {
    return res.status(400).json({ error: 'Password is required' });
  }

  if (password.length > 200) {
    return res.status(400).json({ error: 'Password must be 200 characters or less' });
  }

  next();
};

// Validate registration data
export const validateRegister = (req: Request, res: Response, next: NextFunction) => {
  const { username, email, password, role } = req.body;

  if (!username || typeof username !== 'string' || username.trim().length === 0) {
    return res.status(400).json({ error: 'Username is required and must be a non-empty string' });
  }

  if (username.length > 100) {
    return res.status(400).json({ error: 'Username must be 100 characters or less' });
  }

  // Basic email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email || typeof email !== 'string' || !emailRegex.test(email)) {
    return res.status(400).json({ error: 'Valid email address is required' });
  }

  if (email.length > 255) {
    return res.status(400).json({ error: 'Email must be 255 characters or less' });
  }

  if (!password || typeof password !== 'string' || password.length < 12) {
    return res.status(400).json({ error: 'Password is required and must be at least 12 characters long' });
  }

  if (password.length > 200) {
    return res.status(400).json({ error: 'Password must be 200 characters or less' });
  }

  // Password complexity validation
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecialChar = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password);

  if (!hasUpperCase || !hasLowerCase || !hasNumber || !hasSpecialChar) {
    return res.status(400).json({
      error: 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'
    });
  }

  // Validate role if provided
  if (role !== undefined && role !== null) {
    if (typeof role !== 'string' || !['admin', 'user'].includes(role)) {
      return res.status(400).json({ error: 'Role must be either "admin" or "user"' });
    }
  }

  next();
};

