import { useAuth0 } from '@auth0/auth0-react';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';

function AuthRegister() {
  const { loginWithRedirect, isAuthenticated, isLoading, user } = useAuth0();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated && user) {
      navigate('/');
    }
  }, [isAuthenticated, user, navigate]);

  const handleSignUp = () => {
    loginWithRedirect({
      authorizationParams: {
        screen_hint: 'signup'
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
            Create a new account
          </CardTitle>
          <p className="text-center mt-2 text-muted-foreground">
            Join us today! Create your account to get started.
          </p>
        </CardHeader>
        <CardContent>
          <Button 
            onClick={handleSignUp}
            className="w-full"
            size="lg"
          >
            Sign Up with Auth0
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

export default AuthRegister;