import express from 'express';
import { shortenUrl, redirectUrl, getAllUrls } from '../controllers/urlController.js';
import { validateUrlShorten, validateRedirect } from '../middleware/validators.js';

const router = express.Router();

/**
 * POST /api/urls
 * Create a shortened URL
 * 
 * Request body: { originalUrl: string }
 * Response: { shortUrl: string, shortCode: string, originalUrl: string }
 */
router.post('/api/urls', validateUrlShorten, shortenUrl);

/**
 * GET /api/urls
 * Get all shortened URLs
 * 
 * Response: Array of URL records
 */
router.get('/api/urls', getAllUrls);

/**
 * GET /:code
 * Redirect to original URL
 * 
 * Response: 302 redirect to original URL
 */
router.get('/:code', validateRedirect, redirectUrl);

export default router;
