// Auth0 Configuration
// Replace these values with your actual Auth0 configuration
console.log('Environment variables:', {
  VITE_AUTH0_DOMAIN: import.meta.env.VITE_AUTH0_DOMAIN,
  VITE_AUTH0_CLIENT_ID: import.meta.env.VITE_AUTH0_CLIENT_ID,
  VITE_AUTH0_AUDIENCE: import.meta.env.VITE_AUTH0_AUDIENCE
});

export const auth0Config = {
  domain: import.meta.env.VITE_AUTH0_DOMAIN || 'dev-ca2pzh408v2ns42c.us.auth0.com',
  clientId: import.meta.env.VITE_AUTH0_CLIENT_ID || 'uLh3uZE4gQYe6l4k0Kq1dx6IuJe999jt',
  audience: import.meta.env.VITE_AUTH0_AUDIENCE || 'http://apparel.com/',
  redirectUri: window.location.origin,
  scope: 'openid profile email'
};

console.log('Auth0 Config:', auth0Config);
