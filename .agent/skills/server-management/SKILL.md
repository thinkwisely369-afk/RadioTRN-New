---
name: radiotrn-server-management
description: Procedures for maintaining, deploying, and troubleshooting the RadioTRN live server and API.
---

# RadioTRN Server Management Skill

This document tracks the technical details and procedures for maintaining the RadioTRN live environment.

## 📡 Server Information

- **Host:** `198.251.81.14`
- **SSH Port:** `25552`
- **Username:** `radiotrn`
- **Password:** `S9vVp9wnfcyxGNAyBPN9`
- **API Port:** `35001`
- **Website:** `https://radiotrn.com`

## 📂 Key Directories (Remote)

- **Backend (API):** `/home/radiotrn/api`
- **Frontend (Web):** `/home/radiotrn/domains/radiotrn.com/public_html`
- **PM2 Logs:** `/home/radiotrn/.pm2/logs/`

## 🛠️ Maintenance & Troubleshooting

### 1. Backend Service (PM2)
The backend runs using PM2. If the site shows "Failed to load stations" or a 503 error, check the process.

- **Check Status:** `~/.nvm/versions/node/v20.19.6/bin/pm2 status`
- **Restart API:** `~/.nvm/versions/node/v20.19.6/bin/pm2 restart radiotrn-api`
- **View Logs:** `~/.nvm/versions/node/v20.19.6/bin/pm2 logs radiotrn-api --lines 50`

### 2. Common Issues Resolved
- **Missing Dependencies:** If the server crashes with "Module not found", run `npm install` in `/home/radiotrn/api`.
- **Database Connection:** Use `127.0.0.1` instead of `localhost` in the `.env` file for reliable local database access.
- **Static Assets:** The `uploads` directory is served relative to the process root. Ensure `Serving uploads from: /home/radiotrn/api/uploads` appears in logs.

## 🚀 Deployment Procedures

### Frontend Deployment
1. **Build locally:** `npm run build`
2. **Package dist:** `tar -cf dist.tar -C dist .`
3. **Upload & Extract:** 
   - Upload `dist.tar` to `/home/radiotrn/domains/radiotrn.com/public_html/`
   - Extract: `tar -xf dist.tar`
   - Cleanup: `rm dist.tar`

### Backend Deployment
1. **Build locally:** In `server/` directory, run `npm run build`.
2. **Package dist:** `tar -cf server_dist.tar -C server/dist .`
3. **Upload & Update:**
   - Upload `server_dist.tar` to `/home/radiotrn/api/`
   - Extract: `tar -xf server_dist.tar -C dist` (overwrites existing files)
   - Restart: `~/.nvm/versions/node/v20.19.6/bin/pm2 restart radiotrn-api`

## 🧪 Remote Execution Helper
To run commands without an interactive terminal, use a Python script with `paramiko`:

```python
import paramiko
client = paramiko.SSHClient()
client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
client.connect('198.251.81.14', port=25552, username='radiotrn', password='S9vVp9wnfcyxGNAyBPN9')
stdin, stdout, stderr = client.exec_command('YOUR_COMMAND_HERE')
print(stdout.read().decode())
client.close()
```
