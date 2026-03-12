-- RadioTRN Database Schema

-- Create database if not exists
CREATE DATABASE IF NOT EXISTS radiotrn_station_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE radiotrn_station_db;

-- Users table (for admin authentication)
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(50) UNIQUE NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  role ENUM('admin', 'user') DEFAULT 'user',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_username (username),
  INDEX idx_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Stations table
CREATE TABLE IF NOT EXISTS stations (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  tagline VARCHAR(255),
  genre VARCHAR(50),
  stream_url VARCHAR(500) NOT NULL,
  color VARCHAR(7) DEFAULT '#3b82f6',
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_genre (genre),
  INDEX idx_active (is_active)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Insert default admin user (password: admin123 - CHANGE THIS IN PRODUCTION!)
-- Password hash is bcrypt hash of 'admin123'
INSERT INTO users (username, email, password, role) VALUES
('admin', 'admin@radiotrn.com', '$2b$10$34mxzvS3HXlsiGRf8avNFeN69QgPFsjVZM1x0TbrVzMORD/Ehq/M.', 'admin')
ON DUPLICATE KEY UPDATE username=username;

-- Insert sample stations from your current data
INSERT INTO stations (name, tagline, genre, stream_url, color) VALUES
('Radio One', 'Your Daily Rhythm', 'Pop', 'https://stream.radioone.example/live', '#3b82f6'),
('Jazz FM', 'Smooth Sounds 24/7', 'Jazz', 'https://stream.jazzfm.example/live', '#8b5cf6'),
('Rock Nation', 'Turn It Up!', 'Rock', 'https://stream.rocknation.example/live', '#ef4444'),
('Classical Vibes', 'Timeless Classics', 'Classical', 'https://stream.classicalvibes.example/live', '#10b981'),
('Hip Hop Hub', 'Fresh Beats Daily', 'Hip Hop', 'https://stream.hiphophub.example/live', '#f59e0b'),
('Country Roads', 'Where Country Lives', 'Country', 'https://stream.countryroads.example/live', '#84cc16'),
('Electronic Dreams', 'Future Sounds', 'Electronic', 'https://stream.electronicdreams.example/live', '#06b6d4'),
('Reggae Roots', 'Island Vibes', 'Reggae', 'https://stream.reggaeroots.example/live', '#14b8a6'),
('Blues Corner', 'Soul & Blues', 'Blues', 'https://stream.bluescorner.example/live', '#6366f1'),
('Latin Beats', 'Ritmos Latinos', 'Latin', 'https://stream.latinbeats.example/live', '#ec4899'),
('Gospel Glory', 'Inspiring Faith', 'Gospel', 'https://stream.gospelglory.example/live', '#f97316'),
('Indie Wave', 'Independent Sounds', 'Indie', 'https://stream.indiewave.example/live', '#a855f7')
ON DUPLICATE KEY UPDATE name=name;
