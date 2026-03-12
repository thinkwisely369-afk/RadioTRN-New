const mysql = require('mysql2/promise');

// PASTE YOUR STATION DATA HERE
// You can get this by:
// 1. Going to phpMyAdmin on your remote server
// 2. Selecting the stations table
// 3. Click "Export" -> "Go" to download SQL
// OR paste station data in this format:

const stations = [
  {
    name: 'Station Name 1',
    tagline: 'Your tagline here',
    genre: 'Pop',
    stream_url: 'https://stream.example.com/station1',
    color: '#3b82f6',
    is_active: true
  },
  // Add more stations here...
];

async function importStations() {
  let connection;

  try {
    console.log('Connecting to local database...');
    connection = await mysql.createConnection({
      host: 'localhost',
      port: 3306,
      user: 'root',
      password: '',
      database: 'radiotrn_station_db'
    });
    console.log('✓ Connected to local database\n');

    if (stations.length === 0) {
      console.log('No stations to import. Please edit import-stations.js and add your station data.');
      return;
    }

    // Clear existing stations
    console.log('Clearing existing stations...');
    await connection.query('DELETE FROM stations');
    console.log('✓ Existing stations cleared\n');

    // Import stations
    console.log(`Importing ${stations.length} stations...\n`);
    let imported = 0;

    for (const station of stations) {
      try {
        const [result] = await connection.query(
          `INSERT INTO stations (name, tagline, genre, stream_url, color, is_active)
           VALUES (?, ?, ?, ?, ?, ?)`,
          [
            station.name,
            station.tagline || '',
            station.genre || '',
            station.stream_url,
            station.color || '#3b82f6',
            station.is_active !== false ? 1 : 0
          ]
        );
        imported++;
        console.log(`✓ Imported: ${station.name} (ID: ${result.insertId})`);
      } catch (err) {
        console.error(`✗ Failed to import ${station.name}:`, err.message);
      }
    }

    // Verify
    const [count] = await connection.query('SELECT COUNT(*) as total FROM stations');

    console.log('\n' + '='.repeat(60));
    console.log('IMPORT COMPLETE!');
    console.log('='.repeat(60));
    console.log(`Successfully imported: ${imported} stations`);
    console.log(`Total stations in database: ${count[0].total}`);
    console.log('='.repeat(60));

  } catch (error) {
    console.error('\n✗ Import Error:', error.message);
    process.exit(1);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

importStations();
