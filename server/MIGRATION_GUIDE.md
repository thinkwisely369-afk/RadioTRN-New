# Station Migration Guide

Since direct remote database connection isn't working (likely due to firewall/security), here are alternative methods to import your 9 stations:

## Method 1: Export from Remote phpMyAdmin (RECOMMENDED)

### Step 1: Export from Remote Server
1. Log into phpMyAdmin on your remote server (e.g., https://radiotrn.com/phpmyadmin)
2. Select the database: `radiotrn_station_db`
3. Click on the `stations` table
4. Click the "Export" tab at the top
5. Choose "Quick" export method
6. Format: SQL
7. Click "Go" to download the file

### Step 2: Import to Local
1. Open http://localhost/phpmyadmin (local XAMPP)
2. Select `radiotrn_station_db` database
3. Click "Import" tab
4. Click "Choose File" and select the downloaded SQL file
5. Click "Go" at the bottom

Done! Your stations are now imported.

## Method 2: Manual Station Entry

If you can't access phpMyAdmin, provide me with the station data in this format:

```javascript
Station 1:
- Name: Radio One
- Tagline: Your Daily Rhythm
- Genre: Pop
- Stream URL: https://stream.radioone.com/live
- Color: #3b82f6

Station 2:
- Name: Jazz FM
- Tagline: Smooth Jazz 24/7
...
```

I'll then add them to the database for you.

## Method 3: Use the Import Script

1. Edit `server/import-stations.js`
2. Replace the `stations` array with your station data:

```javascript
const stations = [
  {
    name: 'Your Station Name',
    tagline: 'Your Station Tagline',
    genre: 'Genre',
    stream_url: 'https://your-stream-url.com/live',
    color: '#3b82f6',
    is_active: true
  },
  // Add more stations...
];
```

3. Run the script:
```bash
cd server
node import-stations.js
```

## Method 4: Direct SQL Insert

If you have SQL INSERT statements, you can:

1. Open http://localhost/phpmyadmin
2. Select `radiotrn_station_db`
3. Click "SQL" tab
4. Paste your INSERT statements
5. Click "Go"

Example SQL:
```sql
INSERT INTO stations (name, tagline, genre, stream_url, color) VALUES
('Station 1', 'Tagline 1', 'Pop', 'https://stream1.com', '#3b82f6'),
('Station 2', 'Tagline 2', 'Rock', 'https://stream2.com', '#ef4444');
```

## Need Help?

Just provide me with the station information in any format you have, and I'll help you import it!

Example formats I can work with:
- SQL dump file
- CSV file
- JSON data
- Plain text list
- Screenshot of the data
