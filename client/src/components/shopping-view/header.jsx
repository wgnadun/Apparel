import { HousePlug, LogOut, Menu, ShoppingCart, UserCog } from "lucide-react";
import {
  Link,
  useLocation,
  useNavigate,
  useSearchParams,
} from "react-router-dom";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "../ui/sheet";
import { Button } from "../ui/button";
import { useDispatch, useSelector } from "react-redux";
import { shoppingViewHeaderMenuItems } from "@/config";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { useAuth0 } from '@auth0/auth0-react';
import UserCartWrapper from "./cart-wrapper";
import { useEffect, useState } from "react";
import { fetchCartItems } from "@/store/shop/cart-slice";
import { Label } from "@radix-ui/react-label";
import { Separator } from "../ui/separator";

function HeaderRightContent() {
  const { user,isAuthenticated } = useSelector((state) => state.auth);
  const { cartItems } = useSelector((state) => state.shopCart);
  const [OpenCartSheet, setOpenCartSheet] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { logout } = useAuth0();

  function handleLogout() {
    logout({
      logoutParams: {
        returnTo: window.location.origin
      }
    });
  }

  useEffect(() => {
    if (user?.id) {
      dispatch(fetchCartItems(user.id));
    }
  }, [dispatch, user?.id]);

  return (
    <div className="flex lg:items-center lg:flex-row flex-col gap-4">
      <Sheet open={OpenCartSheet} onOpenChange={() => setOpenCartSheet(false)}>
        <Button
          onClick={() => setOpenCartSheet(true)}
          variant="outline"
          size="icon"
          className="relative"
        >
          <ShoppingCart className="h-6 w-6   " />
              <span className="absolute top-[-3px] right-[1px] font-bold text-sm">{cartItems?.items?.length || 0 }</span>

          <span className="sr-only">user Cart icon</span>
        </Button>
        <UserCartWrapper
          setOpenCartSheet={setOpenCartSheet}
          cartItems={cartItems || []}
        />
      </Sheet>

   {isAuthenticated ? (
<DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Avatar className="bg to-black">
            <AvatarImage 
              src={user?.image} 
              alt={user?.userName || 'Profile'} 
            />
            <AvatarFallback className="bg-black text-white font-extrabold">
              {user?.userName?.charAt(0)?.toUpperCase() || 'U'}
            </AvatarFallback>
          </Avatar>
        </DropdownMenuTrigger>
        <DropdownMenuContent sideright="right" className="w-56">
          <DropdownMenuLabel>Logged in as {user?.userName}</DropdownMenuLabel>
          
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => navigate("/shop/account")}>
            <UserCog className="mr-2 h-4 w-4" />
            Account
          </DropdownMenuItem>
         
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => navigate("/shop/userprofile")}>
            <UserCog className="mr-2 h-4 w-4" />
            Profile
          </DropdownMenuItem>

          <DropdownMenuSeparator/>
          <DropdownMenuItem onClick={handleLogout}>
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
   ): (<Button onClick={() => navigate("/auth/login")} variant="default">
          Log In
        </Button>)}
      
    </div>
  );
}

function MenuItems() {
  const navigate = useNavigate();
  const location = useLocation();
  const [serchParams, setSearchParams] = useSearchParams();

  function handleNavigate(getCurrentMenuItem) {
    const currentFilter =
      getCurrentMenuItem.id !== "home" &&
      getCurrentMenuItem.id !== "products" &&
      getCurrentMenuItem.id !== "search"
        ? { category: [getCurrentMenuItem.id] }
        : null;

    currentFilter
      ? sessionStorage.setItem("filters", JSON.stringify(currentFilter))
      : sessionStorage.removeItem("filters");
    location.pathname.includes("listing") && currentFilter !== null
      ? setSearchParams(
          new URLSearchParams(`?category=${getCurrentMenuItem.id}`)
        )
      : navigate(getCurrentMenuItem.path);

    // Dispatch a custom event to notify the listing page about filter changes
    window.dispatchEvent(
      new CustomEvent("filtersChanged", {
        detail: { filters: currentFilter },
      })
    );
  }
  return (
    <nav className="flex flex-col mb-3 lg:mb-0 lg:items-center gap-6 lg:flex-row">
      {shoppingViewHeaderMenuItems.map((menuItem) => (
        <Label
          className="text-sm font-medium cursor-pointer"
          onClick={() => {
            handleNavigate(menuItem);
          }}
          key={menuItem.id}
        >
          {" "}
          {menuItem.label}
        </Label>
      ))}
    </nav>
  );
}

function ShoppingHeader() {
  const { isAuthenticated } = useSelector((state) => state.auth);
  return (
    <header className=" fixed top-0 z-40 w-full border-b bg-background">
      <div className=" flex h-16 items-center justify-between px-4  md:px-6">
        <Link className="flex items-center gap-2" to="/shop/home">
          <img src="/suit.png" className="h-10 w-10" />
          <span className="font-bold">FashionHub</span>
        </Link>

          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="lg:hidden">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Toggle header menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent
              side="left"
              className="w-full max-w-xs p-6 flex flex-col gap-6
                        sm:max-w-sm md:max-w-md"
            >
              <SheetTitle className="sr-only">Main menu</SheetTitle>
              <MenuItems />
              <Separator className="my-4" />
              <HeaderRightContent />
            </SheetContent>
          </Sheet>

        <div className="hidden lg:block">
          <MenuItems />
        </div>
        <div className="hidden lg:block">
          {" "}
          <HeaderRightContent />{" "}
        </div>
      </div>
    </header>
  );
}

export default ShoppingHeader;
