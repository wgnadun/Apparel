import { useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import { syncAuth0User, clearAuth } from '../../store/auth-slice';
import { Loader2 } from 'lucide-react';

const Auth0Provider = ({ children }) => {
  const { isAuthenticated, isLoading, user, getAccessTokenSilently } = useAuth0();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { user: storeUser, isAuthenticated: storeIsAuthenticated } = useSelector(state => state.auth);

  useEffect(() => {
    const syncUser = async () => {
      if (isAuthenticated && user) {
        try {
          console.log('Auth0Provider: Syncing user...');
          const result = await dispatch(syncAuth0User(getAccessTokenSilently));
          
          // Check if sync was successful and handle redirect
          if (result.payload?.success && result.payload?.user) {
            const userRole = result.payload.user.role;
            const currentPath = location.pathname;
            
            console.log('Auth0Provider: User synced successfully, role:', userRole, 'current path:', currentPath);
            
            // Handle redirect based on role and current location
            handlePostAuthRedirect(userRole, currentPath);
          }
        } catch (error) {
          console.error('Error syncing Auth0 user:', error);
        }
      } else if (!isAuthenticated) {
        // Clear auth state when not authenticated
        dispatch(clearAuth());
      }
    };

    syncUser();
  }, [isAuthenticated, user, getAccessTokenSilently, dispatch, location.pathname]);

  const handlePostAuthRedirect = (userRole, currentPath) => {
    // Define all admin routes
    const adminRoutes = [
      '/admin',
      '/admin/dashboard',
      '/admin/banner',
      '/admin/stats',
      '/admin/orders',
      '/admin/products'
    ];

    // Check for saved redirect path after login first
    const savedRedirect = localStorage.getItem('redirectAfterLogin');
    if (savedRedirect && savedRedirect !== currentPath) {
      console.log('Auth0Provider: Found saved redirect path:', savedRedirect);
      localStorage.removeItem('redirectAfterLogin');
      
      // Validate the saved redirect path based on user role
      const isAdminRoute = adminRoutes.some(route => savedRedirect.startsWith(route));
      if (isAdminRoute && userRole !== 'admin') {
        console.log('Auth0Provider: Saved redirect is admin path but user is not admin, redirecting to shop');
        navigate('/shop/home', { replace: true });
      } else {
        navigate(savedRedirect, { replace: true });
      }
      return;
    }

    // If user is on login page or root, redirect based on role
    if (currentPath === '/auth/login' || currentPath === '/') {
      if (userRole === 'admin') {
        console.log('Auth0Provider: Redirecting admin to dashboard');
        navigate('/admin/dashboard', { replace: true });
      } else {
        console.log('Auth0Provider: Redirecting user to shop home');
        navigate('/shop/home', { replace: true });
      }
      return;
    }

    // If user is trying to access any admin route but is not admin
    const isCurrentPathAdminRoute = adminRoutes.some(route => currentPath.startsWith(route));
    if (isCurrentPathAdminRoute && userRole !== 'admin') {
      console.log('Auth0Provider: Non-admin user trying to access admin area, redirecting to shop');
      navigate('/shop/home', { replace: true });
      return;
    }

    // If user is authenticated and on a protected route they can access, stay there
    console.log('Auth0Provider: User authenticated successfully, staying on current path:', currentPath);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return children;
};

export default Auth0Provider;
