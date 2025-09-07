import axios from 'axios';
import { auth0Config } from '../config/auth0';

// Create axios instance
const api = axios.create({
  baseURL: 'http://localhost:5000/api',
  withCredentials: true,
});

// Function to create authenticated API calls
export const createAuthenticatedApi = (getAccessTokenSilently) => {
  const authenticatedApi = axios.create({
    baseURL: 'http://localhost:5000/api',
    withCredentials: true,
  });

  // Request interceptor to add Auth0 token
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
