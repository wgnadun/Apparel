import axios from 'axios';

class CSRFService {
  constructor() {
    this.token = null;
    this.tokenPromise = null;
    // Create a separate axios instance for fetching CSRF tokens
    // This avoids circular dependency with the main api instance
    this.csrfApi = axios.create({
      baseURL: 'http://localhost:5000/api',
      withCredentials: true,
    });
  }

  // Get CSRF token from server
  async getToken() {
    // If we already have a token, return it
    if (this.token) {
      return this.token;
    }

    // If we're already fetching a token, wait for it
    if (this.tokenPromise) {
      return this.tokenPromise;
    }

    // Fetch new token
    this.tokenPromise = this.fetchToken();
    this.token = await this.tokenPromise;
    this.tokenPromise = null;
    
    return this.token;
  }

  // Fetch token from server
  async fetchToken() {
    try {
      console.log('Fetching CSRF token from server...');
      const response = await this.csrfApi.get('/csrf-token');
      console.log('CSRF token response:', response.data);
      if (response.data.success) {
        console.log('CSRF token fetched successfully');
        return response.data.csrfToken;
      }
      throw new Error('Failed to get CSRF token');
    } catch (error) {
      console.error('Error fetching CSRF token:', error);
      // Don't throw error for CSRF token fetch failures
      // This allows the app to continue working even if CSRF fails
      return null;
    }
  }

  // Clear stored token (useful for logout)
  clearToken() {
    this.token = null;
    this.tokenPromise = null;
  }

  // Get token for headers
  async getTokenForHeaders() {
    const token = await this.getToken();
    return {
      'X-CSRF-Token': token
    };
  }

  // Get token for form data
  async getTokenForForm() {
    const token = await this.getToken();
    return {
      _csrf: token
    };
  }
}

// Create singleton instance
const csrfService = new CSRFService();

export default csrfService;
