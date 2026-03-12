import express, { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import pool from '../config/database';
import { RowDataPacket } from 'mysql2';
import { authenticateToken, requireAdmin, AuthRequest } from '../middleware/auth';
import { validateLogin, validateRegister } from '../middleware/validation';
import { loginLimiter, registerLimiter } from '../middleware/rateLimit';

const router = express.Router();

interface User extends RowDataPacket {
  id: number;
  username: string;
  email: string;
  password: string;
  role: string;
}

// Login endpoint
router.post('/login', loginLimiter, validateLogin, async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password are required' });
    }

    // Get user from database
    const [rows] = await pool.query<User[]>(
      'SELECT * FROM users WHERE username = ?',
      [username]
    );

    if (rows.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const user = rows[0];

    // Verify password
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Get JWT secret - required
    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      console.error('JWT_SECRET environment variable is not set');
      return res.status(500).json({ error: 'Server configuration error' });
    }

    // Generate JWT token
    const token = jwt.sign(
      {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role
      },
      jwtSecret,
      { expiresIn: '24h' }
    );

    res.json({
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Register endpoint (admin only - for creating new admin users)
router.post('/register', registerLimiter, authenticateToken, requireAdmin, validateRegister, async (req: AuthRequest, res: Response) => {
  try {
    const { username, email, password, role = 'user' } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert user
    const [result] = await pool.query(
      'INSERT INTO users (username, email, password, role) VALUES (?, ?, ?, ?)',
      [username, email, hashedPassword, role]
    );

    res.status(201).json({ message: 'User created successfully' });
  } catch (error: unknown) {
    if (error && typeof error === 'object' && 'code' in error && error.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ error: 'Username or email already exists' });
    }
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
