# Local Database Setup Guide

This guide will help you set up a local MySQL/MariaDB database as a backup or for development.

## Option 1: Install MySQL (Recommended for Windows)

### Step 1: Download MySQL
1. Go to https://dev.mysql.com/downloads/installer/
2. Download "MySQL Installer for Windows"
3. Choose the smaller "mysql-installer-web-community" version

### Step 2: Install MySQL
1. Run the installer
2. Choose "Developer Default" or "Server only"
3. Click "Next" through the installation
4. Set a root password (remember this!)
5. Complete the installation

### Step 3: Verify Installation
Open Command Prompt and run:
```bash
mysql --version
```

### Step 4: Configure for RadioTRN
1. Copy `.env.local` to `.env`:
   ```bash
   cd server
   copy .env.local .env
   ```

2. Edit `server\.env` and set your MySQL root password:
   ```env
   DB_PASSWORD=your_mysql_root_password
   ```

3. Import the database schema:
   ```bash
   mysql -u root -p < src/database/schema.sql
   ```
   Enter your MySQL root password when prompted.

4. Start the server:
   ```bash
   npm run dev
   ```

## Option 2: Install MariaDB (MySQL Alternative)

### Step 1: Download MariaDB
1. Go to https://mariadb.org/download/
2. Download the Windows installer
3. Run the installer

### Step 2: Install MariaDB
1. Follow the installation wizard
2. Set a root password (remember this!)
3. Complete the installation

### Step 3: Verify Installation
```bash
mariadb --version
```

### Step 4: Configure (Same as MySQL above)
Follow Step 4 from MySQL instructions, but use `mariadb` command instead of `mysql`:
```bash
mariadb -u root -p < src/database/schema.sql
```

## Option 3: Use XAMPP (Easiest for Beginners)

XAMPP includes MySQL, phpMyAdmin, and Apache in one package.

### Step 1: Download XAMPP
1. Go to https://www.apachefriends.org/
2. Download XAMPP for Windows
3. Install it (default location: C:\xampp)

### Step 2: Start MySQL
1. Open XAMPP Control Panel
2. Click "Start" next to MySQL
3. Click "Admin" next to MySQL (opens phpMyAdmin)

### Step 3: Import Schema via phpMyAdmin
1. In phpMyAdmin, click "Import" tab
2. Click "Choose File" and select: `server/src/database/schema.sql`
3. Click "Go" at the bottom
4. Database and tables will be created

### Step 4: Configure RadioTRN
1. Copy `.env.local` to `.env`:
   ```bash
   cd server
   copy .env.local .env
   ```

2. Edit `server\.env`:
   ```env
   DB_HOST=localhost
   DB_PORT=3306
   DB_USER=root
   DB_PASSWORD=
   DB_NAME=radiotrn_station_db
   ```
   (XAMPP MySQL has no password by default)

3. Start the server:
   ```bash
   npm run dev
   ```

## Option 4: Docker (Advanced)

If you have Docker installed:

```bash
# Create docker-compose.yml in server folder
cd server

# Run MySQL in Docker
docker run -d \
  --name radiotrn-mysql \
  -e MYSQL_ROOT_PASSWORD=radiotrn123 \
  -e MYSQL_DATABASE=radiotrn_station_db \
  -p 3306:3306 \
  mysql:8.0

# Wait for MySQL to start (30 seconds)
timeout 30

# Import schema
docker exec -i radiotrn-mysql mysql -uroot -pradiotrn123 radiotrn_station_db < src/database/schema.sql
```

Then use these settings in `.env`:
```env
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=radiotrn123
DB_NAME=radiotrn_station_db
```

## Switching Between Local and Remote Database

I've created two config files for you:

- **`.env.local`** - For local development database
- **`.env.remote`** - For remote production database

To switch:
```bash
# Use local database
copy .env.local .env

# Use remote database
copy .env.remote .env
```

## Testing the Connection

After setup, test your database connection:

```bash
cd server
npm run dev
```

You should see:
```
✓ Database connected successfully
🚀 RadioTRN API Server running on port 3001
```

## Default Admin Credentials

After importing the schema, you can login with:
- **Username:** admin
- **Password:** admin123

**⚠️ Change this password immediately in production!**

## Troubleshooting

### "Access denied" error
- Double-check your password in `.env`
- Make sure MySQL/MariaDB is running
- Verify the username (usually `root` for local)

### "Unknown database" error
- Run the schema.sql file to create the database
- Or manually create it in phpMyAdmin/MySQL Workbench

### Port 3306 already in use
- Another MySQL instance might be running
- Change `DB_PORT` in `.env` to 3307 or another port

### Can't connect to MySQL server
- Start MySQL service from XAMPP or Services (Windows)
- Check if firewall is blocking port 3306

## Next Steps

Once your local database is running:
1. The server will start successfully on port 3001
2. You can test the API at http://localhost:3001
3. Import/export data between local and remote as needed
4. Use local database for development, remote for production
