import axios from 'axios';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json'
  },
  timeout: 10000 // 10 second timeout
});

/**
 * Shortens a URL
 * 
 * @param {string} originalUrl - The URL to shorten
 * @returns {Promise<{shortUrl: string, shortCode: string, originalUrl: string}>}
 */
export async function shortenUrl(originalUrl) {
  try {
    const response = await api.post('/urls', { originalUrl });
    return response.data;
  } catch (error) {
    // Extract error message from response
    const errorMessage = error.response?.data?.error || error.message || 'Failed to shorten URL';
    throw new Error(errorMessage);
  }
}

/**
 * Gets all shortened URLs
 * 
 * @returns {Promise<Array>} Array of URL records
 */
export async function getAllUrls() {
  try {
    const response = await api.get('/urls');
    return response.data;
  } catch (error) {
    // Extract error message from response
    const errorMessage = error.response?.data?.error || error.message || 'Failed to fetch URLs';
    throw new Error(errorMessage);
  }
}

export default {
  shortenUrl,
  getAllUrls
};
