import { useAuth0 } from '@auth0/auth0-react';
import { createAuthenticatedApi } from '../services/api';

// Hook to get authenticated API instance for Auth0 users
export const useAuthenticatedApi = () => {
  const { getAccessTokenSilently, isAuthenticated } = useAuth0();
  
  const getAuthenticatedApi = () => {
    if (!isAuthenticated) {
      throw new Error('User not authenticated');
    }
    return createAuthenticatedApi(getAccessTokenSilently);
  };
  
  return { getAuthenticatedApi, isAuthenticated };
};
