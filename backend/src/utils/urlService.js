import { query } from '../config/database.js';
import { getCache, setCache } from '../config/redis.js';
import { generateShortCode } from './generateCode.js';
import { config } from '../config/env.js';

/**
 * Creates a shortened URL
 * Checks for existing URL, generates short code, stores in DB, caches in Redis
 * 
 * @param {string} originalUrl - The original URL to shorten
 * @returns {Promise<{shortCode: string, shortUrl: string, originalUrl: string}>}
 */
export async function createShortUrl(originalUrl) {
  // Check if URL already exists in database
  const existingUrl = await query(
    'SELECT short_code FROM urls WHERE original_url = $1',
    [originalUrl]
  );

  if (existingUrl.rows.length > 0) {
    // URL already exists, return existing short code
    const shortCode = existingUrl.rows[0].short_code;
    const shortUrl = `${config.baseUrl}/${shortCode}`;
    
    // Ensure it's cached
    await setCache(`url:${shortCode}`, originalUrl, 3600);
    
    return {
      shortCode,
      shortUrl,
      originalUrl
    };
  }

  // Generate new short code
  let shortCode;
  let isUnique = false;
  let attempts = 0;
  const maxAttempts = 5;

  // Retry logic in case of collision (very unlikely with nanoid)
  while (!isUnique && attempts < maxAttempts) {
    shortCode = generateShortCode();
    
    // Check if short code already exists
    const existing = await query(
      'SELECT id FROM urls WHERE short_code = $1',
      [shortCode]
    );
    
    if (existing.rows.length === 0) {
      isUnique = true;
    }
    attempts++;
  }

  if (!isUnique) {
    throw new Error('Failed to generate unique short code after multiple attempts');
  }

  // Store in database
  await query(
    'INSERT INTO urls (original_url, short_code, click_count, created_at) VALUES ($1, $2, $3, NOW())',
    [originalUrl, shortCode, 0]
  );

  // Cache in Redis with 1 hour TTL
  await setCache(`url:${shortCode}`, originalUrl, 3600);

  const shortUrl = `${config.baseUrl}/${shortCode}`;

  return {
    shortCode,
    shortUrl,
    originalUrl
  };
}

/**
 * Retrieves the original URL for a given short code
 * Checks cache first, then database, populates cache on miss
 * 
 * @param {string} shortCode - The short code to look up
 * @returns {Promise<string|null>} The original URL or null if not found
 */
export async function getOriginalUrl(shortCode) {
  // Check cache first
  const cachedUrl = await getCache(`url:${shortCode}`);
  
  if (cachedUrl) {
    return cachedUrl;
  }

  // Cache miss, query database
  const result = await query(
    'SELECT original_url FROM urls WHERE short_code = $1',
    [shortCode]
  );

  if (result.rows.length === 0) {
    return null;
  }

  const originalUrl = result.rows[0].original_url;

  // Populate cache for future requests
  await setCache(`url:${shortCode}`, originalUrl, 3600);

  return originalUrl;
}

/**
 * Increments the click count for a given short code
 * 
 * @param {string} shortCode - The short code to increment
 * @returns {Promise<void>}
 */
export async function incrementClickCount(shortCode) {
  await query(
    'UPDATE urls SET click_count = click_count + 1 WHERE short_code = $1',
    [shortCode]
  );
}

/**
 * Retrieves all URL records from the database
 * Ordered by creation date (newest first)
 * 
 * @returns {Promise<Array>} Array of URL records
 */
export async function getAllUrlRecords() {
  const result = await query(
    'SELECT id, original_url, short_code, click_count, created_at FROM urls ORDER BY created_at DESC'
  );

  return result.rows;
}

export default {
  createShortUrl,
  getOriginalUrl,
  incrementClickCount,
  getAllUrlRecords
};
