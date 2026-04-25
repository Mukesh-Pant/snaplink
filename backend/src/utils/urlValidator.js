/**
 * Validates if a string is a valid URL with http or https protocol
 * 
 * @param {string} url - The URL string to validate
 * @returns {boolean} True if valid, false otherwise
 */
export function isValidUrl(url) {
  if (!url || typeof url !== 'string') {
    return false;
  }

  // Check if URL starts with http:// or https://
  if (!url.startsWith('http://') && !url.startsWith('https://')) {
    return false;
  }

  try {
    const urlObj = new URL(url);
    
    // Validate protocol
    if (urlObj.protocol !== 'http:' && urlObj.protocol !== 'https:') {
      return false;
    }

    // Validate hostname exists
    if (!urlObj.hostname) {
      return false;
    }

    // Validate domain structure (must have at least one dot or be localhost)
    if (urlObj.hostname !== 'localhost' && !urlObj.hostname.includes('.')) {
      return false;
    }

    return true;
  } catch (error) {
    return false;
  }
}

/**
 * Parses a URL string into a URL object
 * 
 * @param {string} url - The URL string to parse
 * @returns {URL|null} URL object if valid, null otherwise
 */
export function parseUrl(url) {
  try {
    if (!isValidUrl(url)) {
      return null;
    }
    return new URL(url);
  } catch (error) {
    return null;
  }
}

export default { isValidUrl, parseUrl };
