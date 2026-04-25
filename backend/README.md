# SnapLink Backend API

The backend API for SnapLink URL Shortener, built with Node.js, Express, PostgreSQL, and Redis.

## Prerequisites

- **Node.js** 18.x or higher
- **PostgreSQL** 15.x or higher
- **Redis** 7.x or higher
- **npm** or **yarn**

## Quick Start with Docker

### Start PostgreSQL

```bash
docker run --name snaplink-postgres \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_DB=snaplink \
  -p 5432:5432 \
  -d postgres:15
```

### Start Redis

```bash
docker run --name snaplink-redis \
  -p 6379:6379 \
  -d redis:7-alpine
```

### Initialize Database

```bash
docker exec -i snaplink-postgres psql -U postgres -d snaplink < init.sql
```

Or if PostgreSQL is running locally:

```bash
psql -U postgres -d snaplink -f init.sql
```

## Installation

1. **Install dependencies:**

```bash
npm install
```

2. **Create environment file:**

Copy `.env.example` to `.env` and configure your environment variables:

```bash
cp .env.example .env
```

Edit `.env` with your configuration:

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

3. **Initialize the database:**

```bash
psql -U postgres -d snaplink -f init.sql
```

## Running the Server

### Development Mode (with auto-reload)

```bash
npm run dev
```

### Production Mode

```bash
npm start
```

The server will start on `http://localhost:3000` (or the PORT specified in your `.env` file).

## API Endpoints

### 1. Shorten URL

**Endpoint:** `POST /api/urls`

**Description:** Creates a shortened URL

**Request Body:**
```json
{
  "originalUrl": "https://example.com/very/long/url"
}
```

**Success Response (200):**
```json
{
  "shortUrl": "http://localhost:3000/abc123",
  "shortCode": "abc123",
  "originalUrl": "https://example.com/very/long/url"
}
```

**Error Response (400):**
```json
{
  "error": "Invalid URL format",
  "details": "URL must start with http:// or https://"
}
```

**Example with curl:**
```bash
curl -X POST http://localhost:3000/api/urls \
  -H "Content-Type: application/json" \
  -d '{"originalUrl": "https://example.com/very/long/url"}'
```

### 2. Get All URLs

**Endpoint:** `GET /api/urls`

**Description:** Retrieves all shortened URLs with statistics

**Success Response (200):**
```json
[
  {
    "id": 1,
    "original_url": "https://example.com/page1",
    "short_code": "abc123",
    "click_count": 42,
    "created_at": "2024-01-15T10:30:00.000Z"
  },
  {
    "id": 2,
    "original_url": "https://example.com/page2",
    "short_code": "xyz789",
    "click_count": 15,
    "created_at": "2024-01-15T11:45:00.000Z"
  }
]
```

**Example with curl:**
```bash
curl http://localhost:3000/api/urls
```

### 3. Redirect to Original URL

**Endpoint:** `GET /:code`

**Description:** Redirects to the original URL and increments click count

**Success Response (302):**
Redirects to the original URL

**Error Response (404):**
```json
{
  "error": "Short URL not found"
}
```

**Example:**
```bash
# Visit in browser or use curl
curl -L http://localhost:3000/abc123
```

### 4. Health Check

**Endpoint:** `GET /health`

**Description:** Check if the server is running

**Success Response (200):**
```json
{
  "status": "ok",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "uptime": 123.456
}
```

## Testing

### Run All Tests

```bash
npm test
```

### Run Specific Test Suites

```bash
# Run only unit tests
npm test -- unit

# Run only integration tests
npm test -- integration

# Run only property-based tests
npm test -- properties
```

## Project Structure

```
backend/
├── src/
│   ├── config/
│   │   ├── database.js       # PostgreSQL connection pool
│   │   ├── redis.js          # Redis client configuration
│   │   └── env.js            # Environment variable loading
│   ├── controllers/
│   │   └── urlController.js  # HTTP request handlers
│   ├── routes/
│   │   └── urlRoutes.js      # API route definitions
│   ├── middleware/
│   │   ├── validators.js     # Input validation middleware
│   │   └── errorHandler.js   # Global error handler
│   ├── utils/
│   │   ├── urlService.js     # Business logic for URL operations
│   │   ├── generateCode.js   # Short code generation
│   │   └── urlValidator.js   # URL validation utilities
│   └── server.js             # Express app setup and startup
├── init.sql                  # Database schema initialization
├── package.json
├── .env.example
└── README.md
```

## Architecture

### Technology Stack

- **Express.js** - Web framework
- **PostgreSQL** - Persistent data storage
- **Redis** - Caching layer for frequently accessed URLs
- **nanoid** - Unique short code generation
- **express-validator** - Input validation
- **helmet** - Security headers
- **morgan** - Request logging
- **cors** - Cross-origin resource sharing

### Caching Strategy

The application uses a **cache-aside pattern** with Redis:

1. When a short URL is accessed, check Redis cache first
2. If cache miss, query PostgreSQL and populate cache
3. All cached entries have a 1-hour TTL
4. If Redis is unavailable, the system continues with database-only operation (graceful degradation)

### Error Handling

- All errors are caught and passed to a global error handler
- Validation errors return 400 status codes
- Not found errors return 404 status codes
- Database errors return 500 status codes
- Redis failures are non-fatal and logged as warnings

## Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `DB_HOST` | PostgreSQL host | `localhost` |
| `DB_PORT` | PostgreSQL port | `5432` |
| `DB_USER` | PostgreSQL user | `postgres` |
| `DB_PASSWORD` | PostgreSQL password | `postgres` |
| `DB_NAME` | PostgreSQL database name | `snaplink` |
| `REDIS_URL` | Redis connection URL | `redis://localhost:6379` |
| `PORT` | Server port | `3000` |
| `BASE_URL` | Base URL for short links | `http://localhost:3000` |
| `NODE_ENV` | Environment (development/production) | `development` |

## Troubleshooting

### Database Connection Error

If you see "Database connection error":

1. Ensure PostgreSQL is running
2. Verify database credentials in `.env`
3. Check if the database exists: `psql -U postgres -l`
4. Run the initialization script: `psql -U postgres -d snaplink -f init.sql`

### Redis Connection Warning

If you see "Redis connection error":

1. Ensure Redis is running: `redis-cli ping` (should return "PONG")
2. Verify Redis URL in `.env`
3. The system will continue without caching (graceful degradation)

### Port Already in Use

If port 3000 is already in use:

1. Change the `PORT` in `.env` to a different port
2. Or stop the process using port 3000

## Production Deployment

For production deployment, consider:

1. **Environment Variables**: Use proper secrets management (AWS Secrets Manager, HashiCorp Vault)
2. **Database**: Use connection pooling with appropriate pool size
3. **Redis**: Use Redis Cluster for high availability
4. **Logging**: Replace console.log with structured logging (Winston, Pino)
5. **Monitoring**: Add APM (Application Performance Monitoring)
6. **Rate Limiting**: Add rate limiting middleware to prevent abuse
7. **HTTPS**: Use HTTPS in production (Let's Encrypt, AWS Certificate Manager)
8. **Horizontal Scaling**: Deploy multiple instances behind a load balancer

## License

MIT
