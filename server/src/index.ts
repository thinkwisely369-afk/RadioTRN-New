import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import helmet from 'helmet';
import { testConnection } from './config/database';
import authRoutes from './routes/auth';
import stationsRoutes from './routes/stations';
import uploadRoutes from './routes/upload';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// HTTPS enforcement in production
if (process.env.NODE_ENV === 'production') {
  app.use((req, res, next) => {
    if (req.header('x-forwarded-proto') !== 'https') {
      res.redirect(`https://${req.header('host')}${req.url}`);
    } else {
      next();
    }
  });
}

// Security Headers with Helmet
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: ["'self'"],
      fontSrc: ["'self'"],
      objectSrc: ["'none'"],
      mediaSrc: ["'self'", "https:"],
      frameSrc: ["'none'"],
    },
  },
  crossOriginEmbedderPolicy: false, // Allow embedding audio streams
  hsts: {
    maxAge: 31536000, // 1 year
    includeSubDomains: true,
    preload: true
  }
}));

// Middleware
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:8080',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploaded files
// Serve uploaded files - using a more robust path that works from root or dist
const uploadsPath = path.resolve(process.cwd(), 'uploads');
app.use('/uploads', express.static(uploadsPath));
console.log('Serving uploads from:', uploadsPath);

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'RadioTRN API Server is running' });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/stations', stationsRoutes);
app.use('/api/upload', uploadRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Endpoint not found' });
});

// Error handling middleware
app.use((err: unknown, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Error:', err);
  const status = (err as { status?: number })?.status || 500;
  const message = (err as { message?: string })?.message || 'Internal server error';
  res.status(status).json({
    error: message
  });
});

// Start server
const startServer = async () => {
  try {
    // Check for required environment variables
    if (!process.env.JWT_SECRET) {
      console.error('❌ JWT_SECRET environment variable is required');
      console.log('Please set JWT_SECRET in your .env file.');
      console.log('You can generate a secure secret with: openssl rand -hex 32');
      process.exit(1);
    }

    // Test database connection
    const dbConnected = await testConnection();

    if (!dbConnected) {
      console.error('Failed to connect to database. Please check your .env configuration.');
      console.log('Make sure to:');
      console.log('1. Copy .env.example to .env');
      console.log('2. Update database credentials in .env');
      console.log('3. Run the schema.sql file to create tables');
      process.exit(1);
    }

    app.listen(PORT, () => {
      console.log(`\n${'='.repeat(50)}`);
      console.log(`🚀 RadioTRN API Server running on port ${PORT}`);
      console.log(`📡 API endpoint: http://localhost:${PORT}`);
      console.log(`🏥 Health check: http://localhost:${PORT}/health`);
      console.log(`${'='.repeat(50)}\n`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
