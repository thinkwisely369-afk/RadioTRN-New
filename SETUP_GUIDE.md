# RadioTRN Setup Guide

## Quick Start Guide

### Step 1: Configure Database Connection

1. Open `server/.env` file
2. Update your MySQL/MariaDB credentials:
   ```env
   DB_HOST=localhost
   DB_PORT=3306
   DB_USER=your_mysql_username
   DB_PASSWORD=your_mysql_password
   DB_NAME=radiotrn
   ```

### Step 2: Import Database Schema

Run the SQL schema to create the database, tables, and default admin user:

**Option A: Using command line**
```bash
mysql -u your_username -p < server/src/database/schema.sql
```

**Option B: Using MySQL/MariaDB client**
1. Open your database client (MySQL Workbench, phpMyAdmin, HeidiSQL, etc.)
2. Connect to your database server
3. Open the file `server/src/database/schema.sql`
4. Execute the SQL script

This will create:
- Database: `radiotrn`
- Tables: `users` and `stations`
- Default admin user:
  - Username: `admin`
  - Password: `admin123`
  - Email: `admin@radiotrn.com`
- 12 sample radio stations

### Step 3: Start the Backend Server

```bash
cd server
npm run dev
```

The backend API will start on `http://localhost:3001`

You should see:
```
✓ Database connected successfully
🚀 RadioTRN API Server running on port 3001
```

### Step 4: Test the API

**Test health endpoint:**
```bash
curl http://localhost:3001/health
```

**Test login:**
```bash
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}'
```

You should get a JWT token in response.

**Test getting stations:**
```bash
curl http://localhost:3001/api/stations
```

### Step 5: Start the Frontend

In a separate terminal:
```bash
npm run dev
```

The frontend will run on `http://localhost:8080`

## API Endpoints Summary

### Authentication
- `POST /api/auth/login` - Login and get JWT token
- `POST /api/auth/register` - Register new user

### Stations (Public)
- `GET /api/stations` - Get all active stations
- `GET /api/stations/:id` - Get single station

### Stations (Admin Only - Requires JWT Token)
- `GET /api/stations/all` - Get all stations including inactive
- `POST /api/stations` - Create new station
- `PUT /api/stations/:id` - Update station
- `DELETE /api/stations/:id` - Delete station

## Using the Admin API

1. **Login to get token:**
```bash
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}'
```

Save the token from the response.

2. **Create a new station:**
```bash
curl -X POST http://localhost:3001/api/stations \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "name": "New Radio Station",
    "tagline": "Best music ever",
    "genre": "Pop",
    "streamUrl": "https://stream.example.com/live",
    "color": "#3b82f6"
  }'
```

3. **Update a station:**
```bash
curl -X PUT http://localhost:3001/api/stations/1 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "name": "Updated Name",
    "tagline": "Updated tagline",
    "genre": "Rock",
    "streamUrl": "https://new-stream.example.com/live",
    "color": "#ef4444",
    "isActive": true
  }'
```

4. **Delete a station:**
```bash
curl -X DELETE http://localhost:3001/api/stations/1 \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

## Adding a New Admin User

You can create additional admin users via API:

```bash
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "newadmin",
    "email": "newadmin@radiotrn.com",
    "password": "securepassword123",
    "role": "admin"
  }'
```

## Troubleshooting

### Database Connection Failed
- Check your `.env` file has correct credentials
- Make sure MySQL/MariaDB is running
- Verify the database name is correct
- Check firewall settings

### "Unknown database" error
- Run the schema.sql file to create the database
- Or manually create it: `CREATE DATABASE radiotrn;`

### Port already in use
- Change `PORT=3001` in `.env` to another port
- Or kill the process using port 3001

### CORS errors
- Make sure `CLIENT_URL` in `.env` matches your frontend URL
- Default is `http://localhost:8080`

## Security Recommendations

⚠️ **IMPORTANT FOR PRODUCTION:**

1. Change the default admin password immediately
2. Use a strong, random `JWT_SECRET` (generate with: `openssl rand -hex 32`)
3. Enable HTTPS/SSL
4. Use environment variables for all credentials
5. Set up proper database user permissions (don't use root)
6. Implement rate limiting
7. Add input validation and sanitization
8. Enable MySQL SSL connections
9. Set secure CORS policies

## Next Steps

- [ ] Update `.env` with your database credentials
- [ ] Run the schema.sql file
- [ ] Start the backend server
- [ ] Test the API endpoints
- [ ] Change default admin password
- [ ] Connect frontend to backend API
- [ ] Build admin panel UI
