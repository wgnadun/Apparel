import axios from 'axios';
import { auth0Config } from '../config/auth0';
import csrfService from './csrfService';

// Create axios instance
const api = axios.create({
  baseURL: 'http://localhost:5000/api',
  withCredentials: true,
});

// Request interceptor to add CSRF token
api.interceptors.request.use(
  async (config) => {
    // Only add CSRF token for state-changing requests
    if (['POST', 'PUT', 'PATCH', 'DELETE'].includes(config.method?.toUpperCase())) {
      try {
        console.log('Adding CSRF token to request:', config.url);
        const csrfHeaders = await csrfService.getTokenForHeaders();
        if (csrfHeaders && csrfHeaders['X-CSRF-Token']) {
          config.headers = { ...config.headers, ...csrfHeaders };
          console.log('CSRF token added successfully:', csrfHeaders);
        } else {
          console.warn('CSRF token not available, proceeding without it');
        }
      } catch (error) {
        console.error('Error adding CSRF token:', error);
        // Don't throw error, just proceed without CSRF token
        // This allows the app to continue working even if CSRF fails
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle authentication errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.log('401 Unauthorized - clearing auth state');
      // Don't automatically clear auth state here as it might interfere with Auth0
      // Let the components handle this
    }
    return Promise.reject(error);
  }
);

// Function to create authenticated API calls
export const createAuthenticatedApi = (getAccessTokenSilently) => {
  const authenticatedApi = axios.create({
    baseURL: 'http://localhost:5000/api',
    withCredentials: true,
  });

  // Request interceptor to add Auth0 token and CSRF token
  authenticatedApi.interceptors.request.use(
    async (config) => {
      try {
        console.log('Creating authenticated API call to:', config.url);
        console.log('Auth0 config for token:', {
          audience: auth0Config.audience,
          scope: auth0Config.scope
        });
        
        // Get the access token
        const token = await getAccessTokenSilently({
          audience: auth0Config.audience,
          scope: auth0Config.scope
        });
        
        console.log('Got access token:', token ? `Token received (length: ${token.length})` : 'No token');
        
        // Add the token to the Authorization header
        config.headers.Authorization = `Bearer ${token}`;
        console.log('Authorization header set:', config.headers.Authorization ? 'Yes' : 'No');

        // Admin routes (Auth0 JWT) don't need CSRF tokens
        // Only add CSRF token for non-admin routes that need it
        if (!config.url.includes('/admin') && ['POST', 'PUT', 'PATCH', 'DELETE'].includes(config.method?.toUpperCase())) {
          try {
            console.log('Adding CSRF token to non-admin request:', config.url);
            const csrfHeaders = await csrfService.getTokenForHeaders();
            if (csrfHeaders && csrfHeaders['X-CSRF-Token']) {
              config.headers = { ...config.headers, ...csrfHeaders };
              console.log('CSRF token added to non-admin request successfully:', csrfHeaders);
            } else {
              console.warn('CSRF token not available for non-admin request, proceeding without it');
            }
          } catch (csrfError) {
            console.error('Error adding CSRF token to non-admin request:', csrfError);
            // Don't throw error, just proceed without CSRF token
            // This allows the app to continue working even if CSRF fails
          }
        } else if (config.url.includes('/admin')) {
          console.log('Skipping CSRF token for admin route (using Auth0 JWT):', config.url);
        }
      } catch (error) {
        console.error('Error getting access token:', error);
        // You might want to redirect to login or handle this differently
      }
      
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  // Response interceptor for error handling
  authenticatedApi.interceptors.response.use(
    (response) => {
      console.log('Authenticated API response:', response.status, response.config.url);
      return response;
    },
    (error) => {
      console.error('Authenticated API error:', {
        status: error.response?.status,
        url: error.config?.url,
        message: error.message,
        data: error.response?.data
      });
      
      if (error.response?.status === 401) {
        console.error('Unauthorized access - Auth0 token may be invalid');
      } else if (error.response?.status === 500) {
        console.error('Server error - check server logs');
      }
      return Promise.reject(error);
    }
  );

  return authenticatedApi;
};

// For non-authenticated requests
export default api;
