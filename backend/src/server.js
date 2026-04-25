import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import cors from 'cors';
import { config } from './config/env.js';
import urlRoutes from './routes/urlRoutes.js';
import { errorHandler } from './middleware/errorHandler.js';

// Import database and redis to initialize connections
import './config/database.js';
import './config/redis.js';

// Create Express app
const app = express();

// Apply security middleware
app.use(helmet());

// Apply logging middleware
app.use(morgan(config.nodeEnv === 'development' ? 'dev' : 'combined'));

// Apply CORS middleware
app.use(cors({
  origin: '*', // Allow all origins in development
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Parse JSON request bodies
app.use(express.json());

// Parse URL-encoded request bodies
app.use(express.urlencoded({ extended: true }));

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// Mount URL routes
app.use('/', urlRoutes);

// 404 handler for undefined routes
app.use((req, res) => {
  res.status(404).json({
    error: 'Route not found',
    path: req.path
  });
});

// Apply global error handler (must be last)
app.use(errorHandler);

// Start server
const PORT = config.port;
app.listen(PORT, () => {
  console.log('');
  console.log('🚀 SnapLink URL Shortener Backend');
  console.log('================================');
  console.log(`✅ Server running on port ${PORT}`);
  console.log(`✅ Base URL: ${config.baseUrl}`);
  console.log(`✅ Environment: ${config.nodeEnv}`);
  console.log('');
  console.log('📡 API Endpoints:');
  console.log(`   POST   ${config.baseUrl}/api/urls`);
  console.log(`   GET    ${config.baseUrl}/api/urls`);
  console.log(`   GET    ${config.baseUrl}/:code`);
  console.log('');
});

export default app;
