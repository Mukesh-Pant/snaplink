import { nanoid } from 'nanoid';

/**
 * Generates a unique 6-character short code for URLs
 * Uses nanoid with URL-safe alphabet (A-Za-z0-9_-)
 * 
 * @returns {string} A 6-character unique identifier
 */
export function generateShortCode() {
  // Generate 6-character code using nanoid
  // nanoid uses URL-safe alphabet by default: A-Za-z0-9_-
  // With 6 characters, we get 64^6 = 68.7 billion possible combinations
  return nanoid(6);
}

export default generateShortCode;
