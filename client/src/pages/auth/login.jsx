import { useAuth0 } from '@auth0/auth0-react';
import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';
import { setUser } from '@/store/auth-slice';

function AuthLogin() {
  const { loginWithRedirect, isAuthenticated, isLoading, user } = useAuth0();
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  useEffect(() => {
    // Handle Auth0 callback with URL parameters (legacy support)
    const urlParams = new URLSearchParams(location.search);
    const token = urlParams.get('token');
    const id = urlParams.get('id');
    const role = urlParams.get('role');
    const email = urlParams.get('email');
    const firstName = urlParams.get('firstName');
    const lastName = urlParams.get('lastName');
    const username = urlParams.get('username');
    const returnTo = urlParams.get('returnTo');

    if (token && id && role) {
      console.log('🔵 Auth0 callback - User data received (legacy mode):');
      console.log('  - ID:', id);
      console.log('  - Role:', role);
      console.log('  - Email:', email);
      console.log('  - Name:', firstName, lastName);
      console.log('  - Username:', username);
      
      // Set user data in Redux store
      dispatch(setUser({
        id,
        role,
        email,
        firstName,
        lastName,
        userName: username
      }));

      // Navigate based on role from database
      console.log('🎯 Redirecting based on role:', role);
      if (role === 'admin') {
        console.log('✅ Redirecting to ADMIN DASHBOARD');
        navigate('/admin/dashboard', { replace: true });
      } else {
        console.log('✅ Redirecting to USER HOME PAGE');
        navigate(returnTo || '/shop/home', { replace: true });
      }
    }
    // For regular Auth0 authentication, let Auth0Provider handle the sync and redirect
  }, [navigate, location.search, dispatch]);

  const handleLogin = () => {
    loginWithRedirect({
      authorizationParams: {
        screen_hint: 'login'
      }
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-md space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-center text-3xl font-bold tracking-tight text-foreground">
            Sign in to your account
          </CardTitle>
          <p className="text-center mt-2 text-muted-foreground">
            Welcome back! Please sign in to continue.
          </p>
        </CardHeader>
        <CardContent>
          <Button 
            onClick={handleLogin}
            className="w-full"
            size="lg"
          >
            Sign In with Auth0
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

export default AuthLogin;