import {
  createShortUrl,
  getOriginalUrl,
  incrementClickCount,
  getAllUrlRecords
} from '../utils/urlService.js';

/**
 * Controller for shortening a URL
 * POST /api/urls
 * 
 * @param {Request} req - Express request object
 * @param {Response} res - Express response object
 * @param {NextFunction} next - Express next function
 */
export async function shortenUrl(req, res, next) {
  try {
    const { originalUrl } = req.body;

    // Create shortened URL
    const result = await createShortUrl(originalUrl);

    // Return success response
    res.status(200).json(result);
  } catch (error) {
    // Pass error to global error handler
    next(error);
  }
}

/**
 * Controller for redirecting to original URL
 * GET /:code
 * 
 * @param {Request} req - Express request object
 * @param {Response} res - Express response object
 * @param {NextFunction} next - Express next function
 */
export async function redirectUrl(req, res, next) {
  try {
    const { code } = req.params;

    // Get original URL
    const originalUrl = await getOriginalUrl(code);

    if (!originalUrl) {
      // Short code not found
      return res.status(404).json({
        error: 'Short URL not found'
      });
    }

    // Increment click count asynchronously (don't wait for it)
    incrementClickCount(code).catch(err => {
      console.error('Error incrementing click count:', err);
    });

    // Redirect to original URL
    res.redirect(302, originalUrl);
  } catch (error) {
    // Pass error to global error handler
    next(error);
  }
}

/**
 * Controller for getting all URLs
 * GET /api/urls
 * 
 * @param {Request} req - Express request object
 * @param {Response} res - Express response object
 * @param {NextFunction} next - Express next function
 */
export async function getAllUrls(req, res, next) {
  try {
    // Get all URL records
    const urls = await getAllUrlRecords();

    // Return success response
    res.status(200).json(urls);
  } catch (error) {
    // Pass error to global error handler
    next(error);
  }
}

export default {
  shortenUrl,
  redirectUrl,
  getAllUrls
};
