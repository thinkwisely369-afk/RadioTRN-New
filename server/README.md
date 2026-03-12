# RadioTRN Backend Server

Express.js + TypeScript + MySQL/MariaDB backend for RadioTRN radio station management.

## Setup Instructions

### 1. Database Configuration

First, set up your database connection:

```bash
# Copy the example environment file
cp .env.example .env

# Edit .env with your database credentials
```

Update the `.env` file with your MySQL/MariaDB credentials:
```env
DB_HOST=localhost
DB_PORT=3306
DB_USER=your_username
DB_PASSWORD=your_password
DB_NAME=radiotrn
JWT_SECRET=your_secure_random_secret_here
```

### 2. Create Database Schema

Run the SQL schema file to create the database and tables:

```bash
mysql -u your_username -p < src/database/schema.sql
```

Or if using MariaDB:
```bash
mariadb -u your_username -p < src/database/schema.sql
```

Or connect to your database client and run the contents of `src/database/schema.sql`.

This will:
- Create the `radiotrn` database
- Create `users` and `stations` tables
- Insert a default admin user (username: `admin`, password: `admin123`)
- Insert sample radio stations

**IMPORTANT:** Change the default admin password after first login!

### 3. Install Dependencies

```bash
npm install
```

### 4. Start the Server

Development mode with auto-reload:
```bash
npm run dev
```

The server will start on `http://localhost:3001`

## API Endpoints

### Authentication

#### POST `/api/auth/login`
Login with username and password.

**Request:**
```json
{
  "username": "admin",
  "password": "admin123"
}
```

**Response:**
```json
{
  "token": "jwt_token_here",
  "user": {
    "id": 1,
    "username": "admin",
    "email": "admin@radiotrn.com",
    "role": "admin"
  }
}
```

#### POST `/api/auth/register`
Create a new user (admin or regular user).

**Request:**
```json
{
  "username": "newuser",
  "email": "user@example.com",
  "password": "securepassword",
  "role": "admin"
}
```

### Stations

#### GET `/api/stations`
Get all active stations (public, no auth required).

#### GET `/api/stations/all`
Get all stations including inactive (admin only, requires JWT token).

**Headers:**
```
Authorization: Bearer your_jwt_token
```

#### GET `/api/stations/:id`
Get a single station by ID.

#### POST `/api/stations`
Create a new station (admin only).

**Headers:**
```
Authorization: Bearer your_jwt_token
```

**Request:**
```json
{
  "name": "New Station",
  "tagline": "Your favorite music",
  "genre": "Pop",
  "streamUrl": "https://stream.example.com/live",
  "color": "#3b82f6"
}
```

#### PUT `/api/stations/:id`
Update a station (admin only).

**Headers:**
```
Authorization: Bearer your_jwt_token
```

**Request:**
```json
{
  "name": "Updated Station Name",
  "tagline": "New tagline",
  "genre": "Rock",
  "streamUrl": "https://stream.example.com/live",
  "color": "#ef4444",
  "isActive": true
}
```

#### DELETE `/api/stations/:id`
Delete a station (admin only).

**Headers:**
```
Authorization: Bearer your_jwt_token
```

## Database Schema

### Users Table
- `id` - Auto-increment primary key
- `username` - Unique username
- `email` - Unique email
- `password` - Bcrypt hashed password
- `role` - 'admin' or 'user'
- `created_at` - Timestamp
- `updated_at` - Timestamp

### Stations Table
- `id` - Auto-increment primary key
- `name` - Station name
- `tagline` - Station tagline
- `genre` - Music genre
- `stream_url` - Radio stream URL
- `color` - Hex color code
- `is_active` - Boolean active status
- `created_at` - Timestamp
- `updated_at` - Timestamp

## Default Admin Credentials

**Username:** admin
**Password:** admin123
**Email:** admin@radiotrn.com

⚠️ **IMPORTANT:** Change this password immediately after first login in production!

## Security Notes

1. Always use a strong, random `JWT_SECRET` in production
2. Use HTTPS in production
3. Change default admin credentials
4. Enable MySQL SSL connections for production
5. Implement rate limiting for auth endpoints
6. Use environment variables for all sensitive data

## Production Build

```bash
# Build TypeScript to JavaScript
npm run build

# Start production server
npm start
```
