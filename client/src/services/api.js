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
        config.headers = { ...config.headers, ...csrfHeaders };
        console.log('CSRF token added successfully:', csrfHeaders);
      } catch (error) {
        console.error('Error adding CSRF token:', error);
        // Don't continue - let the error propagate so we can see what's wrong
        throw error;
      }
    }
    return config;
  },
  (error) => {
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
        // Get the access token
        const token = await getAccessTokenSilently({
          audience: auth0Config.audience,
          scope: auth0Config.scope
        });
        
        // Add the token to the Authorization header
        config.headers.Authorization = `Bearer ${token}`;

        // Add CSRF token for state-changing requests
        if (['POST', 'PUT', 'PATCH', 'DELETE'].includes(config.method?.toUpperCase())) {
          try {
            console.log('Adding CSRF token to authenticated request:', config.url);
            const csrfHeaders = await csrfService.getTokenForHeaders();
            config.headers = { ...config.headers, ...csrfHeaders };
            console.log('CSRF token added to authenticated request successfully:', csrfHeaders);
          } catch (csrfError) {
            console.error('Error adding CSRF token to authenticated request:', csrfError);
            // Don't continue - let the error propagate so we can see what's wrong
            throw csrfError;
          }
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
    (response) => response,
    (error) => {
      if (error.response?.status === 401) {
        // Handle unauthorized access
        console.error('Unauthorized access');
        // You might want to redirect to login or refresh the token
      }
      return Promise.reject(error);
    }
  );

  return authenticatedApi;
};

// For non-authenticated requests
export default api;
