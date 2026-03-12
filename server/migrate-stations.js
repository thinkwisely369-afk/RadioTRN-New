const mysql = require('mysql2/promise');

async function migrateStations() {
  let remoteConnection;
  let localConnection;

  try {
    console.log('Starting station migration...\n');

    // Remote database connection
    console.log('Connecting to remote database...');
    const REMOTE_HOST = process.argv[2] || 'localhost'; // Pass host as argument

    remoteConnection = await mysql.createConnection({
      host: REMOTE_HOST,
      port: 3306,
      user: 'radiotrn_new',
      password: 'vMDhtuYACQSVQXSMeLLK',
      database: 'radiotrn_station_db'
    });
    console.log('✓ Connected to remote database');

    // Local database connection
    console.log('Connecting to local database...');
    localConnection = await mysql.createConnection({
      host: 'localhost',
      port: 3306,
      user: 'root',
      password: '',
      database: 'radiotrn_station_db'
    });
    console.log('✓ Connected to local database\n');

    // Fetch stations from remote
    console.log('Fetching stations from remote database...');
    const [remoteStations] = await remoteConnection.query(
      'SELECT * FROM stations ORDER BY id'
    );
    console.log(`✓ Found ${remoteStations.length} stations on remote server\n`);

    if (remoteStations.length === 0) {
      console.log('No stations found on remote database.');
      return;
    }

    // Display stations to be migrated
    console.log('Stations to migrate:');
    console.log('='.repeat(80));
    remoteStations.forEach((station, index) => {
      console.log(`${index + 1}. ${station.name} - ${station.genre || 'No genre'}`);
      console.log(`   URL: ${station.stream_url}`);
      console.log(`   Tagline: ${station.tagline || 'No tagline'}`);
      console.log(`   Color: ${station.color || '#3b82f6'}`);
      console.log('-'.repeat(80));
    });

    // Clear existing local stations (optional)
    console.log('\nClearing existing local stations...');
    await localConnection.query('DELETE FROM stations');
    console.log('✓ Local stations cleared');

    // Insert stations into local database
    console.log('\nMigrating stations to local database...');
    let migrated = 0;

    for (const station of remoteStations) {
      try {
        await localConnection.query(
          `INSERT INTO stations (name, tagline, genre, stream_url, color, is_active)
           VALUES (?, ?, ?, ?, ?, ?)`,
          [
            station.name,
            station.tagline || '',
            station.genre || '',
            station.stream_url,
            station.color || '#3b82f6',
            station.is_active !== undefined ? station.is_active : 1
          ]
        );
        migrated++;
        console.log(`✓ Migrated: ${station.name}`);
      } catch (err) {
        console.error(`✗ Failed to migrate ${station.name}:`, err.message);
      }
    }

    // Verify migration
    const [localStations] = await localConnection.query(
      'SELECT COUNT(*) as count FROM stations'
    );

    console.log('\n' + '='.repeat(80));
    console.log('MIGRATION COMPLETE!');
    console.log('='.repeat(80));
    console.log(`Remote stations: ${remoteStations.length}`);
    console.log(`Local stations: ${localStations[0].count}`);
    console.log(`Successfully migrated: ${migrated}`);
    console.log('='.repeat(80));

  } catch (error) {
    console.error('\n✗ Migration Error:', error.message);

    if (error.code === 'ENOTFOUND') {
      console.error('\nCould not find remote host. Please check:');
      console.error('1. The remote host address is correct');
      console.error('2. You have internet connection');
      console.error('3. The remote server is accessible');
    } else if (error.code === 'ER_ACCESS_DENIED_ERROR') {
      console.error('\nAccess denied. Please check:');
      console.error('1. Username and password are correct');
      console.error('2. Remote user has proper permissions');
      console.error('3. Remote server allows external connections');
    } else if (error.code === 'ECONNREFUSED') {
      console.error('\nConnection refused. Please check:');
      console.error('1. Remote MySQL server is running');
      console.error('2. Firewall allows MySQL connections (port 3306)');
      console.error('3. Remote MySQL is configured to accept external connections');
    }

    process.exit(1);
  } finally {
    if (remoteConnection) {
      await remoteConnection.end();
      console.log('\n✓ Closed remote connection');
    }
    if (localConnection) {
      await localConnection.end();
      console.log('✓ Closed local connection');
    }
  }
}

// Get remote host from command line argument
if (process.argv.length < 3) {
  console.log('Usage: node migrate-stations.js <remote-host>');
  console.log('Example: node migrate-stations.js radiotrn.com');
  console.log('Example: node migrate-stations.js 123.456.789.012');
  process.exit(1);
}

migrateStations();
