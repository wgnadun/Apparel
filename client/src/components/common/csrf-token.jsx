import React from 'react';
import { useCSRF } from '../../hooks/useCSRF';

/**
 * CSRF Token component for forms
 * Automatically includes CSRF token in form submissions
 */
const CSRFToken = ({ name = '_csrf' }) => {
  const { token, loading, error } = useCSRF();

  if (loading) {
    return null; // Don't render anything while loading
  }

  if (error) {
    console.error('CSRF token error:', error);
    return null; // Don't render anything on error
  }

  if (!token) {
    return null; // Don't render anything if no token
  }

  return (
    <input
      type="hidden"
      name={name}
      value={token}
    />
  );
};

export default CSRFToken;

