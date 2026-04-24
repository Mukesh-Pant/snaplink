import Redis from 'ioredis';
import { config } from './env.js';

// Create Redis client instance
export const redisClient = new Redis(config.redis.url, {
  retryStrategy: (times) => {
    const delay = Math.min(times * 50, 2000);
    return delay;
  },
  maxRetriesPerRequest: 3,
  enableReadyCheck: true,
  lazyConnect: false
});

// Track Redis availability
let isRedisAvailable = false;

// Handle Redis connection events
redisClient.on('connect', () => {
  console.log('🔄 Connecting to Redis...');
});

redisClient.on('ready', () => {
  console.log('✅ Redis client connected successfully');
  isRedisAvailable = true;
});

redisClient.on('error', (err) => {
  console.warn('⚠️  Redis connection error:', err.message);
  console.warn('⚠️  System will continue with database-only operation');
  isRedisAvailable = false;
});

redisClient.on('close', () => {
  console.warn('⚠️  Redis connection closed');
  isRedisAvailable = false;
});

// Helper function to get value from cache
export async function getCache(key) {
  if (!isRedisAvailable) {
    return null;
  }
  
  try {
    const value = await redisClient.get(key);
    return value;
  } catch (error) {
    console.warn('⚠️  Redis GET error:', error.message);
    return null;
  }
}

// Helper function to set value in cache with TTL
export async function setCache(key, value, ttlSeconds = 3600) {
  if (!isRedisAvailable) {
    return;
  }
  
  try {
    await redisClient.setex(key, ttlSeconds, value);
  } catch (error) {
    console.warn('⚠️  Redis SET error:', error.message);
  }
}

// Helper function to delete value from cache
export async function deleteCache(key) {
  if (!isRedisAvailable) {
    return;
  }
  
  try {
    await redisClient.del(key);
  } catch (error) {
    console.warn('⚠️  Redis DEL error:', error.message);
  }
}

// Helper function to check if Redis is available
export function isRedisConnected() {
  return isRedisAvailable;
}

export default redisClient;
