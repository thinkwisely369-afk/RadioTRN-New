const mysql = require('mysql2/promise');

const fixCharset = async () => {
  try {
    // Connect to MySQL
    const connection = await mysql.createConnection({
      host: '127.0.0.1',
      user: 'radiotrn_newsite',
      password: 'n7WwbYBVc5BNHfjfhUxN',
      database: 'radiotrn_newsite'
    });

    console.log('✓ Connected to MySQL');

    // Convert database to UTF-8
    await connection.query('ALTER DATABASE radiotrn_newsite CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci');
    console.log('✓ Database charset updated to utf8mb4');

    // Convert stations table to UTF-8
    await connection.query('ALTER TABLE stations CONVERT TO CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci');
    console.log('✓ Stations table converted to utf8mb4');

    // Convert users table to UTF-8
    await connection.query('ALTER TABLE users CONVERT TO CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci');
    console.log('✓ Users table converted to utf8mb4');

    await connection.end();
    console.log('\n✅ Character set conversion completed successfully!');
    console.log('The database now supports Sinhala, Tamil, Emoji, and all Unicode characters.');

  } catch (error) {
    console.error('❌ Character set conversion failed:', error.message);
    process.exit(1);
  }
};

fixCharset();
