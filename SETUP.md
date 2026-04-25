# SnapLink Setup Guide

Complete step-by-step guide to set up and run the SnapLink URL Shortener application.

## Prerequisites Installation

### 1. Install Node.js

**Windows:**
- Download from https://nodejs.org/ (LTS version recommended)
- Run the installer and follow the prompts

**macOS:**
```bash
brew install node
```

**Linux:**
```bash
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs
```

Verify installation:
```bash
node --version  # Should show v18.x or higher
npm --version   # Should show 9.x or higher
```

### 2. Install Docker (for PostgreSQL and Redis)

**Windows/macOS:**
- Download Docker Desktop from https://www.docker.com/products/docker-desktop
- Install and start Docker Desktop

**Linux:**
```bash
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo systemctl start docker
sudo systemctl enable docker
```

Verify installation:
```bash
docker --version
docker ps  # Should show running containers
```

## Step-by-Step Setup

### Step 1: Clone or Download the Project

If you have the project files, navigate to the project directory:
```bash
cd snaplink
```

### Step 2: Start PostgreSQL Database

```bash
# Start PostgreSQL container
docker run --name snaplink-postgres \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_DB=snaplink \
  -p 5432:5432 \
  -d postgres:15

# Wait a few seconds for PostgreSQL to start
sleep 5

# Verify PostgreSQL is running
docker ps | grep snaplink-postgres
```

### Step 3: Start Redis Cache

```bash
# Start Redis container
docker run --name snaplink-redis \
  -p 6379:6379 \
  -d redis:7-alpine

# Verify Redis is running
docker ps | grep snaplink-redis
```

### Step 4: Set Up Backend

```bash
# Navigate to backend directory
cd backend

# Install dependencies (this may take a few minutes)
npm install

# Create environment configuration
cp .env.example .env

# Initialize the database schema
docker exec -i snaplink-postgres psql -U postgres -d snaplink < init.sql

# You should see output like:
# CREATE TABLE
# CREATE INDEX
# CREATE INDEX
```

### Step 5: Start Backend Server

```bash
# Still in backend directory
npm run dev

# You should see:
# ✅ PostgreSQL database connected successfully
# ✅ Redis client connected successfully
# 🚀 SnapLink URL Shortener Backend
# ✅ Server running on port 3000
```

**Keep this terminal open!** The backend server needs to keep running.

### Step 6: Set Up Frontend (New Terminal)

Open a **new terminal window** and navigate to the project:

```bash
cd snaplink/frontend

# Install dependencies
npm install

# Start frontend dev server
npm run dev

# You should see:
# VITE v5.x.x  ready in xxx ms
# ➜  Local:   http://localhost:5173/
```

### Step 7: Access the Application

Open your web browser and go to:
```
http://localhost:5173
```

You should see the SnapLink home page!

## Testing the Application

### Test URL Shortening

1. On the home page, enter a URL: `https://www.example.com/very/long/url/path`
2. Click "Shorten URL"
3. You should see a shortened URL like `http://localhost:3000/abc123`
4. Click the "Copy" button to copy the short URL

### Test Redirection

1. Open a new browser tab
2. Paste the short URL (e.g., `http://localhost:3000/abc123`)
3. You should be redirected to the original URL

### Test Dashboard

1. Click "Dashboard" in the navigation bar
2. You should see:
   - Total URLs count
   - Total clicks count
   - A table with all shortened URLs
   - Click counts for each URL

## Troubleshooting

### Backend won't start - "Database connection error"

**Problem:** PostgreSQL is not running or not accessible

**Solution:**
```bash
# Check if PostgreSQL container is running
docker ps | grep snaplink-postgres

# If not running, start it
docker start snaplink-postgres

# Check logs
docker logs snaplink-postgres
```

### Backend won't start - "Redis connection error"

**Problem:** Redis is not running (this is non-fatal, app will work without cache)

**Solution:**
```bash
# Check if Redis container is running
docker ps | grep snaplink-redis

# If not running, start it
docker start snaplink-redis

# Check logs
docker logs snaplink-redis
```

### Frontend shows "Failed to fetch URLs"

**Problem:** Backend is not running or not accessible

**Solution:**
1. Check if backend is running on port 3000
2. Look at the backend terminal for errors
3. Try restarting the backend: `npm run dev`

### Port 3000 already in use

**Problem:** Another application is using port 3000

**Solution:**
```bash
# Option 1: Stop the other application

# Option 2: Change the port in backend/.env
# Edit backend/.env and change:
PORT=3001
BASE_URL=http://localhost:3001

# Then restart backend
```

### Port 5173 already in use

**Problem:** Another Vite app is running

**Solution:**
```bash
# Kill the other Vite process or change the port
# Vite will automatically use the next available port (5174, 5175, etc.)
```

### "npm install" fails

**Problem:** Network issues or npm cache problems

**Solution:**
```bash
# Clear npm cache
npm cache clean --force

# Try again
npm install

# If still failing, delete node_modules and try again
rm -rf node_modules
npm install
```

## Stopping the Application

### Stop the servers

1. In the backend terminal: Press `Ctrl+C`
2. In the frontend terminal: Press `Ctrl+C`

### Stop Docker containers

```bash
# Stop containers
docker stop snaplink-postgres snaplink-redis

# Optional: Remove containers (data will be lost)
docker rm snaplink-postgres snaplink-redis
```

## Restarting the Application

### Quick restart (containers already exist)

```bash
# Start Docker containers
docker start snaplink-postgres snaplink-redis

# Terminal 1: Start backend
cd backend
npm run dev

# Terminal 2: Start frontend
cd frontend
npm run dev
```

## Next Steps

- Read the [Backend README](backend/README.md) for API documentation
- Read the [Frontend README](frontend/README.md) for component details
- Explore the code in `backend/src/` and `frontend/src/`
- Try modifying the UI in `frontend/src/components/`
- Add new features or customize the application

## Getting Help

If you encounter issues:

1. Check the terminal output for error messages
2. Check Docker container logs: `docker logs snaplink-postgres`
3. Verify all prerequisites are installed correctly
4. Make sure ports 3000, 5173, 5432, and 6379 are not in use
5. Try restarting Docker Desktop (Windows/macOS)

## Production Deployment

For production deployment, see:
- [Backend README - Production Deployment](backend/README.md#production-deployment)
- [Frontend README - Building for Production](frontend/README.md#building-for-production)

---

**Happy URL Shortening! ⚡**
