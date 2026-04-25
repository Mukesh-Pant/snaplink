import { body, param, validationResult } from 'express-validator';

/**
 * Validation middleware for URL shortening endpoint
 * Validates that originalUrl is present and is a valid http/https URL
 */
export const validateUrlShorten = [
  body('originalUrl')
    .exists()
    .withMessage('originalUrl is required')
    .notEmpty()
    .withMessage('originalUrl cannot be empty')
    .isString()
    .withMessage('originalUrl must be a string')
    .trim()
    .custom((value) => {
      // Check if URL starts with http:// or https://
      if (!value.startsWith('http://') && !value.startsWith('https://')) {
        throw new Error('URL must start with http:// or https://');
      }
      
      // Validate URL format
      try {
        const url = new URL(value);
        
        // Validate hostname exists and has valid structure
        if (!url.hostname) {
          throw new Error('URL must contain a valid domain');
        }
        
        // Validate domain structure (must have at least one dot or be localhost)
        if (url.hostname !== 'localhost' && !url.hostname.includes('.')) {
          throw new Error('URL must contain a valid domain structure');
        }
        
        return true;
      } catch (error) {
        throw new Error('Invalid URL format');
      }
    }),
  
  // Middleware to check validation results
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: 'Invalid URL format',
        details: errors.array()[0].msg
      });
    }
    next();
  }
];

/**
 * Validation middleware for redirect endpoint
 * Validates that code parameter is present
 */
export const validateRedirect = [
  param('code')
    .exists()
    .withMessage('Short code is required')
    .notEmpty()
    .withMessage('Short code cannot be empty')
    .isString()
    .withMessage('Short code must be a string')
    .trim()
    .isLength({ min: 1, max: 10 })
    .withMessage('Short code must be between 1 and 10 characters'),
  
  // Middleware to check validation results
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: 'Invalid short code',
        details: errors.array()[0].msg
      });
    }
    next();
  }
];

export default {
  validateUrlShorten,
  validateRedirect
};
