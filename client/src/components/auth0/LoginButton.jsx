import { useAuth0 } from '@auth0/auth0-react';
import { Button } from '@/components/ui/button';
import { LogIn } from 'lucide-react';

const LoginButton = ({ className, variant = "default" }) => {
  const { loginWithRedirect } = useAuth0();

  const handleLogin = () => {
    loginWithRedirect({
      authorizationParams: {
        screen_hint: 'login'
      }
    });
  };

  return (
    <Button 
      onClick={handleLogin}
      variant={variant}
      className={className}
    >
      <LogIn className="w-4 h-4 mr-2" />
      Login
    </Button>
  );
};

export default LoginButton;
