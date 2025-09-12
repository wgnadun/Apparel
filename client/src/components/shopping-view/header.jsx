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
import SearchComponent from "./search-component";
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
      {/* Shopping Cart */}
      <Sheet open={OpenCartSheet} onOpenChange={() => setOpenCartSheet(false)}>
        <Button
          onClick={() => setOpenCartSheet(true)}
          variant="outline"
          size="icon"
          className="relative h-12 w-12 border-gray-300 hover:border-gray-400 hover:bg-gray-50 transition-all duration-200 group"
        >
          <ShoppingCart className="h-5 w-5 transition-transform duration-200 group-hover:scale-110" />
          <span className="absolute -top-2 -right-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-white font-bold text-xs rounded-full h-6 w-6 flex items-center justify-center shadow-lg">
            {cartItems?.items?.length || 0}
          </span>
          <span className="sr-only">Shopping Cart</span>
        </Button>
        <UserCartWrapper
          setOpenCartSheet={setOpenCartSheet}
          cartItems={cartItems || []}
        />
      </Sheet>

      {/* User Authentication */}
      {isAuthenticated ? (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <div className="relative group cursor-pointer">
              <Avatar className="h-12 w-12 border-2 border-gray-200 hover:border-yellow-400 transition-all duration-200 group-hover:scale-105">
                <AvatarImage 
                  src={user?.image} 
                  alt={user?.userName || 'Profile'} 
                  className="object-cover"
                />
                <AvatarFallback className="bg-gradient-to-br from-gray-800 to-gray-900 text-white font-bold text-lg">
                  {user?.userName?.charAt(0)?.toUpperCase() || 'U'}
                </AvatarFallback>
              </Avatar>
              <div className="absolute inset-0 bg-gradient-to-br from-yellow-400/20 to-orange-500/20 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent 
            side="right" 
            className="w-64 bg-white/95 backdrop-blur-md border-gray-200/50 shadow-xl"
          >
            <DropdownMenuLabel className="text-center py-3 border-b border-gray-100">
              <div className="text-sm font-medium text-gray-900">Welcome back!</div>
              <div className="text-xs text-gray-500">{user?.userName}</div>
            </DropdownMenuLabel>
            
            <DropdownMenuSeparator />
            <DropdownMenuItem 
              onClick={() => navigate("/shop/account")}
              className="py-3 px-4 hover:bg-gray-50 transition-colors duration-200"
            >
              <UserCog className="mr-3 h-4 w-4 text-gray-600" />
              <span className="font-medium">My Account</span>
            </DropdownMenuItem>
           
            <DropdownMenuSeparator />
            <DropdownMenuItem 
              onClick={() => navigate("/shop/userprofile")}
              className="py-3 px-4 hover:bg-gray-50 transition-colors duration-200"
            >
              <UserCog className="mr-3 h-4 w-4 text-gray-600" />
              <span className="font-medium">Profile Settings</span>
            </DropdownMenuItem>

            <DropdownMenuSeparator/>
            <DropdownMenuItem 
              onClick={handleLogout}
              className="py-3 px-4 hover:bg-red-50 text-red-600 transition-colors duration-200"
            >
              <LogOut className="mr-3 h-4 w-4" />
              <span className="font-medium">Sign Out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ) : (
        <Button 
          onClick={() => navigate("/auth/login")} 
          className="h-12 px-6 bg-gradient-to-r from-gray-900 to-gray-800 hover:from-gray-800 hover:to-gray-700 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
        >
          Sign In
        </Button>
      )}
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
      getCurrentMenuItem.id !== "products"
        ? { category: [getCurrentMenuItem.id] }
        : null;

    currentFilter
      ? sessionStorage.setItem("filters", JSON.stringify(currentFilter))
      : sessionStorage.removeItem("filters");
    
    if (location.pathname.includes("listing")) {
      if (currentFilter !== null) {
        setSearchParams(new URLSearchParams(`?category=${getCurrentMenuItem.id}`));
      } else {
        setSearchParams(new URLSearchParams());
      }
    } else {
      navigate(getCurrentMenuItem.path);
    }

    // Dispatch a custom event to notify the listing page about filter changes
    window.dispatchEvent(
      new CustomEvent("filtersChanged", {
        detail: { filters: currentFilter },
      })
    );
  }
  return (
    <nav className="flex flex-col mb-3 lg:mb-0 lg:items-center gap-6 lg:flex-row lg:gap-8">
      {shoppingViewHeaderMenuItems.map((menuItem) => (
        <Label
          className="text-sm font-semibold cursor-pointer relative group transition-all duration-200 hover:text-gray-900 text-gray-700"
          onClick={() => {
            handleNavigate(menuItem);
          }}
          key={menuItem.id}
        >
          <span className="relative z-10">{menuItem.label}</span>
          <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-yellow-400 to-orange-500 transition-all duration-300 group-hover:w-full"></div>
        </Label>
      ))}
    </nav>
  );
}

function ShoppingHeader() {
  const { isAuthenticated } = useSelector((state) => state.auth);
  return (
    <header className="fixed top-0 z-50 w-full bg-white/95 backdrop-blur-md border-b border-gray-200/50 shadow-sm">
      <div className="flex h-20 items-center justify-between px-4 md:px-8 lg:px-12">
        {/* Logo Section */}
        <Link className="flex items-center gap-3 group" to="/shop/home">
          <div className="relative">
            <img src="/suit.png" className="h-12 w-12 transition-transform duration-300 group-hover:scale-110" alt="FashionHub Logo" />
            <div className="absolute inset-0 bg-gradient-to-br from-yellow-400/20 to-orange-500/20 rounded-full blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </div>
          <div className="flex flex-col">
            <span className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
              FashionHub
            </span>
            <span className="text-xs text-gray-500 font-medium tracking-wider uppercase">
              Premium Style
            </span>
          </div>
        </Link>

        {/* Search Component - Hidden on mobile, shown on desktop */}
        <div className="hidden md:block flex-1 max-w-lg mx-8">
          <div className="relative">
            <SearchComponent />
          </div>
        </div>

        {/* Mobile Menu Button */}
        <Sheet>
          <SheetTrigger asChild>
            <Button 
              variant="outline" 
              size="icon" 
              className="lg:hidden h-12 w-12 border-gray-300 hover:border-gray-400 hover:bg-gray-50 transition-all duration-200"
            >
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle header menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent
            side="left"
            className="w-full max-w-xs p-6 flex flex-col gap-6 bg-white/95 backdrop-blur-md sm:max-w-sm md:max-w-md"
          >
            <SheetTitle className="sr-only">Main menu</SheetTitle>
            {/* Search Component for Mobile */}
            <div className="md:hidden">
              <SearchComponent />
            </div>
            <SheetTitle className="sr-only">Main menu</SheetTitle>
            <MenuItems />
            <Separator className="my-4" />
            <HeaderRightContent />
          </SheetContent>
        </Sheet>

        {/* Desktop Navigation */}
        <div className="hidden lg:block">
          <MenuItems />
        </div>
        
        {/* Desktop User Actions */}
        <div className="hidden lg:block">
          <HeaderRightContent />
        </div>
      </div>
    </header>
  );
}

export default ShoppingHeader;
