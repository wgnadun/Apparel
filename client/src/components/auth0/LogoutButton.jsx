import { useAuth0 } from '@auth0/auth0-react';
import { Button } from '@/components/ui/button';
import { LogOut } from 'lucide-react';

const LogoutButton = ({ className, variant = "outline" }) => {
  const { logout } = useAuth0();

  const handleLogout = () => {
    console.log('Logging out...', window.location.origin);
    logout({
      logoutParams: {
        returnTo: window.location.origin
      }
    });
  };

  return (
    <Button 
      onClick={handleLogout}
      variant={variant}
      className={className}
    >
      <LogOut className="w-4 h-4 mr-2" />
      Logout
    </Button>
  );
};

export default LogoutButton;
