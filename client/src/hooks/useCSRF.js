import { useState, useEffect, useCallback } from 'react';
import csrfService from '../services/csrfService';

/**
 * Custom hook for managing CSRF tokens
 * @returns {Object} CSRF token utilities
 */
export const useCSRF = () => {
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch CSRF token
  const fetchToken = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const csrfToken = await csrfService.getToken();
      setToken(csrfToken);
      return csrfToken;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Clear CSRF token
  const clearToken = useCallback(() => {
    csrfService.clearToken();
    setToken(null);
    setError(null);
  }, []);

  // Refresh CSRF token
  const refreshToken = useCallback(async () => {
    clearToken();
    return await fetchToken();
  }, [clearToken, fetchToken]);

  // Get token for form data
  const getTokenForForm = useCallback(async () => {
    try {
      return await csrfService.getTokenForForm();
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, []);

  // Get token for headers
  const getTokenForHeaders = useCallback(async () => {
    try {
      return await csrfService.getTokenForHeaders();
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, []);

  // Auto-fetch token on mount
  useEffect(() => {
    fetchToken();
  }, [fetchToken]);

  return {
    token,
    loading,
    error,
    fetchToken,
    clearToken,
    refreshToken,
    getTokenForForm,
    getTokenForHeaders
  };
};

export default useCSRF;
