const mysql = require('mysql2/promise');

const addSlugColumn = async () => {
  try {
    // Connect to MySQL
    const connection = await mysql.createConnection({
      host: '127.0.0.1',
      user: 'radiotrn_newsite',
      password: 'n7WwbYBVc5BNHfjfhUxN',
      database: 'radiotrn_newsite'
    });

    console.log('✓ Connected to MySQL');

    // Add slug column to stations table
    await connection.query(`
      ALTER TABLE stations
      ADD COLUMN slug VARCHAR(255) UNIQUE AFTER name
    `);
    console.log('✓ Added slug column to stations table');

    await connection.end();
    console.log('\n✅ Slug column added successfully!');
    console.log('You can now set slugs for stations (e.g., "livefm", "popfm", etc.)');

  } catch (error) {
    if (error.code === 'ER_DUP_FIELDNAME') {
      console.log('✓ Slug column already exists');
    } else {
      console.error('❌ Failed to add slug column:', error.message);
      process.exit(1);
    }
  }
};

addSlugColumn();
