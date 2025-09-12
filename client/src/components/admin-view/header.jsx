import { AlignJustify, LogOut } from "lucide-react";
import { Button } from "../ui/button";
import { useAuth0 } from '@auth0/auth0-react';

function AdminHeader({ setOpen }) {
  const { logout } = useAuth0();

  function handleLogout() {
    logout({
      logoutParams: {
        returnTo: window.location.origin
      }
    });
  }

  return (
    <header className="flex items-center justify-between px-6 py-4 bg-white/95 backdrop-blur-md border-b border-gray-200/50 shadow-sm">
      <Button 
        onClick={() => setOpen(true)} 
        className="lg:hidden sm:block h-12 w-12 border-gray-300 hover:border-gray-400 hover:bg-gray-50 transition-all duration-200"
      >
        <AlignJustify className="h-5 w-5" />
      </Button>
      <div className="flex flex-1 justify-end">
        <Button
          onClick={handleLogout}
          className="inline-flex gap-2 items-center rounded-lg px-6 py-3 text-sm font-semibold bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
        >
          <LogOut className="h-4 w-4" />
          Sign Out
        </Button>
      </div>
    </header>
  );
}

export default AdminHeader;