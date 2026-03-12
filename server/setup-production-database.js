const mysql = require('mysql2/promise');

const setupDatabase = async () => {
  try {
    // Connect to MySQL
    const connection = await mysql.createConnection({
      host: '127.0.0.1',
      user: 'radiotrn_newsite',
      password: 'n7WwbYBVc5BNHfjfhUxN',
      database: 'radiotrn_newsite'
    });

    console.log('✓ Connected to MySQL');
    console.log('✓ Using database: radiotrn_newsite');

    // Create users table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS users (
        id INT PRIMARY KEY AUTO_INCREMENT,
        username VARCHAR(255) UNIQUE NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        role ENUM('admin', 'user') DEFAULT 'user',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✓ Users table created');

    // Create stations table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS stations (
        id INT PRIMARY KEY AUTO_INCREMENT,
        name VARCHAR(255) NOT NULL,
        tagline VARCHAR(255),
        genre VARCHAR(100),
        stream_url VARCHAR(500) NOT NULL,
        color VARCHAR(7) DEFAULT '#3b82f6',
        logo_url VARCHAR(500),
        is_active BOOLEAN DEFAULT true,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);
    console.log('✓ Stations table created');

    // Check if admin user exists
    const [users] = await connection.query('SELECT * FROM users WHERE username = ?', ['admin']);

    if (users.length === 0) {
      // Insert admin user (password: admin123 - hashed with bcrypt)
      await connection.query(`
        INSERT INTO users (username, email, password, role)
        VALUES (?, ?, ?, ?)
      `, ['admin', 'admin@radiotrn.com', '$2b$10$34mxzvS3HXlsiGRf8avNFeN69QgPFsjVZM1x0TbrVzMORD/Ehq/M.', 'admin']);
      console.log('✓ Admin user created (username: admin, password: admin123)');
    } else {
      console.log('✓ Admin user already exists');
    }

    await connection.end();
    console.log('\n✅ Database setup completed successfully!');
    console.log('\n📝 Database credentials:');
    console.log('   Database: radiotrn_newsite');
    console.log('   Username: radiotrn_newsite');
    console.log('   Password: n7WwbYBVc5BNHfjfhUxN');
    console.log('\n👤 Admin login:');
    console.log('   Username: admin');
    console.log('   Password: admin123');

  } catch (error) {
    console.error('❌ Database setup failed:', error.message);
    process.exit(1);
  }
};

setupDatabase();
