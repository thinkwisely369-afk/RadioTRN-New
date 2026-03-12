# API Testing Guide

## Backend Server Status

✅ **Server Running:** http://localhost:3001
✅ **Database:** radiotrn_station_db (XAMPP MySQL)
✅ **Admin User:** admin / admin123
✅ **Stations:** 12 sample stations loaded

## Quick API Tests

### 1. Health Check
```bash
curl http://localhost:3001/health
```

### 2. Get All Stations (Public)
```bash
curl http://localhost:3001/api/stations
```

### 3. Login as Admin
```bash
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d "{\"username\":\"admin\",\"password\":\"admin123\"}"
```

Save the token from the response!

### 4. Get All Stations (Admin - Including Inactive)
Replace `YOUR_TOKEN` with the token from login:
```bash
curl http://localhost:3001/api/stations/all \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### 5. Create New Station
```bash
curl -X POST http://localhost:3001/api/stations \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d "{\"name\":\"New Station\",\"tagline\":\"Great Music\",\"genre\":\"Pop\",\"streamUrl\":\"https://stream.example.com\",\"color\":\"#3b82f6\"}"
```

### 6. Update Station
```bash
curl -X PUT http://localhost:3001/api/stations/1 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d "{\"name\":\"Updated Name\",\"tagline\":\"New Tagline\",\"genre\":\"Rock\",\"streamUrl\":\"https://newstream.example.com\",\"color\":\"#ef4444\",\"isActive\":true}"
```

### 7. Delete Station
```bash
curl -X DELETE http://localhost:3001/api/stations/1 \
  -H "Authorization: Bearer YOUR_TOKEN"
```

## Using Postman or Insomnia

Import these endpoints:

**Base URL:** `http://localhost:3001`

### Authentication
- **POST** `/api/auth/login`
  - Body: `{"username":"admin","password":"admin123"}`

- **POST** `/api/auth/register`
  - Body: `{"username":"newuser","email":"user@example.com","password":"password123","role":"admin"}`

### Stations (Public)
- **GET** `/api/stations` - Get all active stations
- **GET** `/api/stations/:id` - Get single station

### Stations (Admin - Add Bearer Token in Headers)
- **GET** `/api/stations/all` - Get all stations
- **POST** `/api/stations` - Create station
- **PUT** `/api/stations/:id` - Update station
- **DELETE** `/api/stations/:id` - Delete station

## Database Access

You can view/edit the database directly in phpMyAdmin:
1. Open http://localhost/phpmyadmin
2. Select `radiotrn_station_db` database
3. View tables: `users` and `stations`

## Current Database Content

### Users Table
| ID | Username | Email | Role |
|----|----------|-------|------|
| 1 | admin | admin@radiotrn.com | admin |

### Stations Table
12 sample radio stations with genres: Pop, Jazz, Rock, Classical, Hip Hop, Country, Electronic, Reggae, Blues, Latin, Gospel, Indie

## Next Steps

1. ✅ Backend API is fully functional
2. ⏳ Connect frontend to backend
3. ⏳ Build admin panel UI
4. ⏳ Add real stream URLs for stations
