const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');

async function setupDatabase() {
  let connection;

  try {
    console.log('Connecting to MySQL...');

    // Connect without database first
    connection = await mysql.createConnection({
      host: 'localhost',
      port: 3306,
      user: 'root',
      password: '' // XAMPP default has no password
    });

    console.log('✓ Connected to MySQL');

    // Create database
    console.log('\nCreating database...');
    await connection.query('CREATE DATABASE IF NOT EXISTS radiotrn_station_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci');
    console.log('✓ Database created: radiotrn_station_db');

    // Use the database
    await connection.query('USE radiotrn_station_db');

    // Create users table
    console.log('\nCreating users table...');
    await connection.query(`
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
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);
    console.log('✓ Users table created');

    // Create stations table
    console.log('\nCreating stations table...');
    await connection.query(`
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
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);
    console.log('✓ Stations table created');

    // Insert admin user
    console.log('\nCreating admin user...');
    const hashedPassword = '$2b$10$34mxzvS3HXlsiGRf8avNFeN69QgPFsjVZM1x0TbrVzMORD/Ehq/M.'; // admin123

    await connection.query(`
      INSERT INTO users (username, email, password, role) VALUES (?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE username=username
    `, ['admin', 'admin@radiotrn.com', hashedPassword, 'admin']);
    console.log('✓ Admin user created');
    console.log('  Username: admin');
    console.log('  Password: admin123');

    // Insert sample stations
    console.log('\nCreating sample stations...');
    const stations = [
      ['Radio One', 'Your Daily Rhythm', 'Pop', 'https://stream.radioone.example/live', '#3b82f6'],
      ['Jazz FM', 'Smooth Sounds 24/7', 'Jazz', 'https://stream.jazzfm.example/live', '#8b5cf6'],
      ['Rock Nation', 'Turn It Up!', 'Rock', 'https://stream.rocknation.example/live', '#ef4444'],
      ['Classical Vibes', 'Timeless Classics', 'Classical', 'https://stream.classicalvibes.example/live', '#10b981'],
      ['Hip Hop Hub', 'Fresh Beats Daily', 'Hip Hop', 'https://stream.hiphophub.example/live', '#f59e0b'],
      ['Country Roads', 'Where Country Lives', 'Country', 'https://stream.countryroads.example/live', '#84cc16'],
      ['Electronic Dreams', 'Future Sounds', 'Electronic', 'https://stream.electronicdreams.example/live', '#06b6d4'],
      ['Reggae Roots', 'Island Vibes', 'Reggae', 'https://stream.reggaeroots.example/live', '#14b8a6'],
      ['Blues Corner', 'Soul & Blues', 'Blues', 'https://stream.bluescorner.example/live', '#6366f1'],
      ['Latin Beats', 'Ritmos Latinos', 'Latin', 'https://stream.latinbeats.example/live', '#ec4899'],
      ['Gospel Glory', 'Inspiring Faith', 'Gospel', 'https://stream.gospelglory.example/live', '#f97316'],
      ['Indie Wave', 'Independent Sounds', 'Indie', 'https://stream.indiewave.example/live', '#a855f7']
    ];

    for (const station of stations) {
      await connection.query(`
        INSERT INTO stations (name, tagline, genre, stream_url, color)
        VALUES (?, ?, ?, ?, ?)
        ON DUPLICATE KEY UPDATE name=name
      `, station);
    }
    console.log(`✓ ${stations.length} sample stations created`);

    // Verify data
    const [users] = await connection.query('SELECT COUNT(*) as count FROM users');
    const [stationsCount] = await connection.query('SELECT COUNT(*) as count FROM stations');

    console.log('\n' + '='.repeat(50));
    console.log('DATABASE SETUP COMPLETE!');
    console.log('='.repeat(50));
    console.log(`Users: ${users[0].count}`);
    console.log(`Stations: ${stationsCount[0].count}`);
    console.log('\nYou can now start the server with: npm run dev');
    console.log('='.repeat(50));

  } catch (error) {
    console.error('\n✗ Error:', error.message);
    process.exit(1);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

setupDatabase();
