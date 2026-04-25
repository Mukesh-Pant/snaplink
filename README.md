# ⚡ SnapLink - URL Shortener

A modern, full-stack URL shortener application that transforms long URLs into short, shareable links with click tracking and analytics.

![SnapLink](https://img.shields.io/badge/SnapLink-URL%20Shortener-blue)
![Node.js](https://img.shields.io/badge/Node.js-18.x-green)
![React](https://img.shields.io/badge/React-18.2-blue)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15.x-blue)
![Redis](https://img.shields.io/badge/Redis-7.x-red)

## 🌟 Features

- **⚡ Lightning Fast**: Generate short URLs in milliseconds
- **📊 Click Tracking**: Monitor how many times your URLs are accessed
- **🎨 Modern UI**: Beautiful, responsive interface built with React and Tailwind CSS
- **🔒 Secure**: Input validation and security headers
- **💾 Persistent Storage**: PostgreSQL database for reliable data storage
- **🚀 High Performance**: Redis caching for frequently accessed URLs
- **📱 Responsive**: Works seamlessly on desktop and mobile devices

## 🏗️ Architecture

```
┌─────────────┐         ┌──────────────┐         ┌──────────────┐
│   React     │────────▶│   Express    │────────▶│  PostgreSQL  │
│  Frontend   │         │   Backend    │         │   Database   │
│  (Vite)     │◀────────│    (API)     │◀────────│              │
└─────────────┘         └──────────────┘         └──────────────┘
                               │
                               │
                               ▼
                        ┌──────────────┐
                        │    Redis     │
                        │    Cache     │
                        └──────────────┘
```

### Technology Stack

**Frontend:**
- React 18 with Vite
- React Router DOM v6
- Axios for API calls
- Tailwind CSS for styling

**Backend:**
- Node.js with Express.js
- PostgreSQL for persistent storage
- Redis for caching
- nanoid for unique code generation
- express-validator for input validation

## 🚀 Quick Start

### Prerequisites

- Node.js 18.x or higher
- PostgreSQL 15.x or higher
- Redis 7.x or higher
- npm or yarn

### 1. Start PostgreSQL and Redis with Docker

```bash
# Start PostgreSQL
docker run --name snaplink-postgres \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_DB=snaplink \
  -p 5432:5432 \
  -d postgres:15

# Start Redis
docker run --name snaplink-redis \
  -p 6379:6379 \
  -d redis:7-alpine
```

### 2. Set Up Backend

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Initialize database
docker exec -i snaplink-postgres psql -U postgres -d snaplink < init.sql

# Start backend server
npm run dev
```

The backend will start on `http://localhost:3000`

### 3. Set Up Frontend

```bash
# Navigate to frontend directory (in a new terminal)
cd frontend

# Install dependencies
npm install

# Start frontend dev server
npm run dev
```

The frontend will start on `http://localhost:5173`

### 4. Access the Application

Open your browser and navigate to `http://localhost:5173`

## 📁 Project Structure

```
snaplink/
├── backend/                  # Backend API
│   ├── src/
│   │   ├── config/          # Database, Redis, environment config
│   │   ├── controllers/     # Request handlers
│   │   ├── routes/          # API routes
│   │   ├── middleware/      # Validation, error handling
│   │   ├── utils/           # Business logic, utilities
│   │   └── server.js        # Express app setup
│   ├── init.sql             # Database schema
│   ├── package.json
│   └── README.md
│
├── frontend/                 # Frontend application
│   ├── src/
│   │   ├── components/      # Reusable UI components
│   │   ├── pages/           # Page components
│   │   ├── api/             # API client
│   │   ├── App.jsx          # Root component
│   │   └── main.jsx         # Entry point
│   ├── index.html
│   ├── vite.config.js
│   ├── tailwind.config.js
│   ├── package.json
│   └── README.md
│
└── README.md                 # This file
```

## 🔌 API Endpoints

### Shorten URL
```http
POST /api/urls
Content-Type: application/json

{
  "originalUrl": "https://example.com/very/long/url"
}
```

**Response:**
```json
{
  "shortUrl": "http://localhost:3000/abc123",
  "shortCode": "abc123",
  "originalUrl": "https://example.com/very/long/url"
}
```

### Get All URLs
```http
GET /api/urls
```

**Response:**
```json
[
  {
    "id": 1,
    "original_url": "https://example.com/page1",
    "short_code": "abc123",
    "click_count": 42,
    "created_at": "2024-01-15T10:30:00.000Z"
  }
]
```

### Redirect to Original URL
```http
GET /:code
```

**Response:** 302 redirect to original URL

## 🧪 Testing

### Backend Tests
```bash
cd backend
npm test
```

### Frontend Tests
```bash
cd frontend
npm test
```

## 🎯 Key Features Explained

### URL Shortening
- Generates unique 6-character codes using nanoid
- Checks for duplicate URLs to avoid redundant entries
- Validates URL format (must start with http:// or https://)

### Caching Strategy
- Uses Redis cache-aside pattern
- 1-hour TTL for cached entries
- Graceful degradation if Redis is unavailable

### Click Tracking
- Increments click count on each redirect
- Asynchronous update to avoid blocking redirects
- Real-time statistics on dashboard

### Error Handling
- Comprehensive validation with express-validator
- Global error handler for consistent error responses
- User-friendly error messages

## 🔧 Configuration

### Backend Environment Variables

Create a `.env` file in the `backend/` directory:

```env
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=postgres
DB_NAME=snaplink
REDIS_URL=redis://localhost:6379
PORT=3000
BASE_URL=http://localhost:3000
NODE_ENV=development
```

### Frontend Configuration

The frontend uses Vite's proxy to forward API requests to the backend. Configuration is in `frontend/vite.config.js`.

## 📊 Database Schema

```sql
CREATE TABLE urls (
  id SERIAL PRIMARY KEY,
  original_url TEXT NOT NULL,
  short_code VARCHAR(10) UNIQUE NOT NULL,
  click_count INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_short_code ON urls(short_code);
CREATE INDEX idx_original_url ON urls(original_url);
```

## 🚀 Production Deployment

### Backend Deployment

1. Set environment variables for production
2. Use a process manager like PM2
3. Set up HTTPS with Let's Encrypt or AWS Certificate Manager
4. Configure PostgreSQL with connection pooling
5. Use Redis Cluster for high availability
6. Add rate limiting middleware
7. Implement structured logging (Winston, Pino)

### Frontend Deployment

1. Build the production bundle: `npm run build`
2. Deploy the `dist/` directory to:
   - Vercel
   - Netlify
   - AWS S3 + CloudFront
   - Any static hosting service

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📝 License

MIT License - feel free to use this project for personal or commercial purposes.

## 🙏 Acknowledgments

- Built with modern web technologies
- Inspired by popular URL shorteners like bit.ly and TinyURL
- Designed for simplicity and performance

## 📧 Support

For issues, questions, or suggestions, please open an issue on GitHub.

---

**Made with ❤️ by the SnapLink Team**
