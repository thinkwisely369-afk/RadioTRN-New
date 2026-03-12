const mysql = require('mysql2/promise');

async function addLogoColumn() {
  let connection;

  try {
    console.log('Connecting to database...');
    connection = await mysql.createConnection({
      host: 'localhost',
      port: 3306,
      user: 'root',
      password: '',
      database: 'radiotrn_station_db'
    });
    console.log('✓ Connected\n');

    console.log('Adding logo_url column...');
    await connection.query(`
      ALTER TABLE stations
      ADD COLUMN IF NOT EXISTS logo_url VARCHAR(500) AFTER color
    `);
    console.log('✓ logo_url column added');

    console.log('\n' + '='.repeat(60));
    console.log('MIGRATION COMPLETE!');
    console.log('='.repeat(60));
    console.log('Stations table now has logo_url column');
    console.log('You can now upload 200x200 logos for each station');
    console.log('='.repeat(60));

  } catch (error) {
    if (error.code === 'ER_DUP_FIELDNAME') {
      console.log('✓ logo_url column already exists');
    } else {
      console.error('\n✗ Error:', error.message);
      process.exit(1);
    }
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

addLogoColumn();
