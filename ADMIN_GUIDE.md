# Admin Panel Guide

## Accessing the Admin Panel

### 1. Open Admin Login Page
Go to: **http://localhost:8080/admin/login**

### 2. Login Credentials
- **Username:** admin
- **Password:** admin123

### 3. After Login
You'll be redirected to the admin dashboard at: **http://localhost:8080/admin/dashboard**

## Admin Dashboard Features

### Overview Stats
- Total Stations count
- Active Stations count
- Inactive Stations count

### Station Management

#### Add New Station
1. Click the "Add Station" button
2. Fill in the form:
   - **Station Name** (required) - e.g., "Jazz FM"
   - **Tagline** - e.g., "Smooth Jazz 24/7"
   - **Genre** - e.g., "Jazz"
   - **Stream URL** (required) - The actual radio stream URL
   - **Color** - Pick from presets or use color picker
   - **Active** - Toggle to show/hide on public site
3. Click "Create Station"

#### Edit Existing Station
1. Click the pencil icon on any station
2. Modify the fields you want to change
3. Click "Update Station"

#### Delete Station
1. Click the trash icon on any station
2. Confirm deletion

#### Toggle Active Status
- Inactive stations won't show on the public homepage
- You can reactivate them anytime by editing the station

## Adding Your 9 Stations

Here's how to add your stations from the remote server:

### Option 1: Manual Entry (Recommended)
1. Go to http://localhost:8080/admin/login
2. Login with admin/admin123
3. Click "Add Station" for each station
4. Fill in the details:
   - Name
   - Tagline
   - Genre
   - Stream URL (the actual streaming link)
   - Pick a color
5. Repeat for all 9 stations

### Option 2: Export from Remote
If you have phpMyAdmin access on your remote server:
1. Export the stations table as SQL
2. Import via http://localhost/phpmyadmin
3. The admin dashboard will show all imported stations

### Option 3: Copy-Paste SQL
If you can run a SELECT query on your remote database:
1. Run: `SELECT * FROM stations`
2. Send me the data
3. I'll create an import script for you

## Features

### Station Card
Each station displays:
- Color-coded icon
- Station name
- Active/Inactive status badge
- Tagline
- Genre
- Stream URL
- Edit and Delete buttons

### Real-time Updates
- Changes reflect immediately in the dashboard
- Frontend will need to be refreshed to see changes on public site

## Tips

1. **Use Real Stream URLs**: Replace placeholder URLs with actual radio streaming links
2. **Pick Distinct Colors**: Makes stations easier to identify
3. **Write Clear Taglines**: Helps users know what to expect
4. **Test Stream URLs**: Make sure they work before adding
5. **Use Active Toggle**: Hide stations temporarily without deleting them

## Common Stream URL Formats

Radio streams usually look like:
- `http://stream.example.com:8000/live`
- `https://stream.example.com/radio.mp3`
- `https://example.com/stream`

Make sure to use the direct stream URL, not the website URL.

## Security

### Change Default Password
After first login, create a new admin user with a secure password:

Via API (using Postman or curl):
```bash
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "your_new_admin",
    "email": "your@email.com",
    "password": "your_secure_password",
    "role": "admin"
  }'
```

Then you can delete the default admin user from phpMyAdmin if needed.

## Troubleshooting

### Can't login
- Make sure backend server is running (cd server && npm run dev)
- Check console for errors (F12 in browser)
- Verify credentials: admin / admin123

### Changes not saving
- Check backend server is running on port 3001
- Check browser console for API errors
- Verify you're logged in (check for lock icon in dashboard)

### Stations not showing
- Make sure "Active" toggle is ON
- Refresh the homepage after adding stations
- Check frontend console for errors

## Next Steps

After adding your 9 stations:
1. Update the frontend to load stations from API (instead of hardcoded data)
2. Test station playback with real stream URLs
3. Deploy to production server

---

**Ready to add your stations! Visit http://localhost:8080/admin/login to get started.**
