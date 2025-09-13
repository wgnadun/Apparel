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
    <header className="flex items-center justify-between px-4 py-3 bg-background border-b">
      <Button onClick={() => setOpen(true)} className="lg:hidden sm:block">
        <AlignJustify />
      </Button>
      <div className="flex flex-1 justify-end">
        <Button
          onClick={handleLogout}
          className="inline-flex gap-2 items-center rounded-md px-4 py-2 text-sm font-medium shadow"
        >
          <LogOut />
          Logout
        </Button>
      </div>
    </header>
  );
}

export default AdminHeader;