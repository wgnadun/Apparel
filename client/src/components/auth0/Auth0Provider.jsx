import { useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { useDispatch } from 'react-redux';
import { syncAuth0User } from '../../store/auth-slice';
import { Loader2 } from 'lucide-react';

const Auth0Provider = ({ children }) => {
  const { isAuthenticated, isLoading, user, getAccessTokenSilently } = useAuth0();
  const dispatch = useDispatch();

  useEffect(() => {
    const syncUser = async () => {
      if (isAuthenticated && user) {
        try {
          await dispatch(syncAuth0User(getAccessTokenSilently));
        } catch (error) {
          console.error('Error syncing Auth0 user:', error);
        }
      }
    };

    syncUser();
  }, [isAuthenticated, user, getAccessTokenSilently, dispatch]);

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
