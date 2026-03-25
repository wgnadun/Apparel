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
import { fetchCartItems, syncCart, clearGuestCart } from "@/store/shop/cart-slice";
import { Separator } from "../ui/separator";
import { toast } from "sonner";

function HeaderRightContent() {
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const { cartItems, guestCartItems } = useSelector((state) => state.shopCart);
  const { productList } = useSelector((state) => state.shopProducts);
  const [OpenCartSheet, setOpenCartSheet] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { logout } = useAuth0();
  const [prevIsAuthenticated, setPrevIsAuthenticated] = useState(isAuthenticated);

  function handleLogout() {
    logout({
      logoutParams: {
        returnTo: window.location.origin,
      },
    });
  }

  useEffect(() => {
    if (user?.id) {
      dispatch(fetchCartItems(user.id));
    }
  }, [dispatch, user?.id]);

  useEffect(() => {
    if (isAuthenticated && user?.id && guestCartItems.length > 0) {
      console.log("Header: Starting guest cart sync...", { userId: user.id, items: guestCartItems });
      
      dispatch(syncCart({ userId: user.id, items: guestCartItems }))
        .then((action) => {
          if (action.payload?.success) {
            console.log("Header: Sync successful, clearing guest cart");
            dispatch(clearGuestCart());
            toast.success("Guest cart synchronized successfully!");
            dispatch(fetchCartItems(user.id));
          } else {
            console.error("Header: Sync failed with payload:", action.payload);
            toast.error(action.payload?.message || "Failed to sync guest cart");
          }
        })
        .catch((error) => {
          console.error("Header: Sync error:", error);
          toast.error("An error occurred while syncing your cart");
        });
    }
  }, [isAuthenticated, user?.id, guestCartItems, dispatch]);

  const displayCartItems = isAuthenticated
    ? cartItems
    : {
        items: guestCartItems.map(guestItem => {
          const product = productList.find(p => p._id === guestItem.productId);
          return {
            ...guestItem,
            image: product?.image,
            title: product?.title,
            price: product?.price,
            salePrice: product?.salePrice,
          };
        }) 
      };

  return (
    <div className="flex lg:items-center lg:flex-row flex-col gap-6">
      {/* Shopping Cart */}
      <Sheet open={OpenCartSheet} onOpenChange={() => setOpenCartSheet(false)}>
        <Button
          onClick={() => setOpenCartSheet(true)}
          variant="ghost"
          size="icon"
          className="relative h-12 w-12 hover:bg-black/5 rounded-full transition-all duration-300 group"
        >
          <ShoppingCart className="h-6 w-6 text-gray-800 transition-transform duration-300 group-hover:scale-110" />
          <span className="absolute top-1 right-1 bg-yellow-400 text-black font-black text-[10px] rounded-full h-5 w-5 flex items-center justify-center shadow-md border-2 border-white">
            {displayCartItems?.items?.length || 0}
          </span>
          <span className="sr-only">Shopping Cart</span>
        </Button>
        <UserCartWrapper
          setOpenCartSheet={setOpenCartSheet}
          cartItems={displayCartItems || []}
        />
      </Sheet>

      {/* User Authentication */}
      {isAuthenticated ? (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <div className="relative group cursor-pointer ml-2">
              <Avatar className="h-11 w-11 border-2 border-transparent group-hover:border-yellow-400 transition-all duration-500 shadow-md">
                <AvatarImage
                  src={user?.image}
                  alt={user?.userName || "Profile"}
                  className="object-cover"
                />
                <AvatarFallback className="bg-black text-white font-bold text-base">
                  {user?.userName?.charAt(0)?.toUpperCase() || "U"}
                </AvatarFallback>
              </Avatar>
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            side="bottom"
            align="end"
            className="w-72 bg-white/80 backdrop-blur-2xl border-white/20 shadow-2xl rounded-2xl p-2 mt-4 animate-in fade-in slide-in-from-top-4 duration-300"
          >
            <DropdownMenuLabel className="px-4 py-4">
              <div className="flex flex-col gap-1">
                <span className="text-xs font-bold tracking-widest text-yellow-600 uppercase">Member Account</span>
                <span className="text-lg font-black text-gray-900 truncate">{user?.userName}</span>
              </div>
            </DropdownMenuLabel>

            <DropdownMenuSeparator className="bg-gray-100/50" />
            
            <div className="py-2">
              <DropdownMenuItem
                onClick={() => navigate("/shop/account")}
                className="flex items-center gap-4 py-3 px-4 rounded-xl hover:bg-black/5 transition-all cursor-pointer group"
              >
                <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center group-hover:bg-white transition-colors">
                  <UserCog className="h-4 w-4 text-gray-600" />
                </div>
                <span className="font-semibold text-gray-700">Account Dashboard</span>
              </DropdownMenuItem>

              <DropdownMenuItem
                onClick={() => navigate("/shop/userprofile")}
                className="flex items-center gap-4 py-3 px-4 rounded-xl hover:bg-black/5 transition-all cursor-pointer group"
              >
                <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center group-hover:bg-white transition-colors">
                  <UserCog className="h-4 w-4 text-gray-600" />
                </div>
                <span className="font-semibold text-gray-700">Profile Settings</span>
              </DropdownMenuItem>
            </div>

            <DropdownMenuSeparator className="bg-gray-100/50" />
            
            <DropdownMenuItem
              onClick={handleLogout}
              className="flex items-center gap-4 py-3 px-4 rounded-xl hover:bg-red-50 text-red-600 transition-all cursor-pointer group mt-1"
            >
              <div className="w-8 h-8 rounded-lg bg-red-50 flex items-center justify-center group-hover:bg-white transition-colors">
                <LogOut className="h-4 w-4" />
              </div>
              <span className="font-bold">Sign Out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ) : (
        <Button
          onClick={() => navigate("/auth/login")}
          className="h-11 px-8 bg-black text-white hover:bg-yellow-400 hover:text-black font-bold rounded-2xl shadow-lg transition-all duration-300 transform hover:scale-105 active:scale-95"
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
      getCurrentMenuItem.id !== "home" && getCurrentMenuItem.id !== "products"
        ? { category: [getCurrentMenuItem.id] }
        : null;

    currentFilter
      ? sessionStorage.setItem("filters", JSON.stringify(currentFilter))
      : sessionStorage.removeItem("filters");

    if (location.pathname.includes("listing")) {
      if (currentFilter !== null) {
        setSearchParams(
          new URLSearchParams(`?category=${getCurrentMenuItem.id}`)
        );
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
    <nav className="flex flex-col mb-3 lg:mb-0 lg:items-center gap-8 lg:flex-row lg:gap-10">
      {shoppingViewHeaderMenuItems.map((menuItem) => {
        const isActive = location.pathname === menuItem.path || (menuItem.id !== 'home' && location.search.includes(`category=${menuItem.id}`));
        return (
          <div
            key={menuItem.id}
            onClick={() => handleNavigate(menuItem)}
            className={`text-sm font-bold tracking-tight cursor-pointer relative group transition-all duration-300 p-2
              ${isActive ? 'text-black' : 'text-gray-500 hover:text-black'}`}
          >
            <span className="relative z-10">{menuItem.label}</span>
            <div className={`absolute bottom-0 left-1/2 -translate-x-1/2 h-1 bg-yellow-400 transition-all duration-500 rounded-full
              ${isActive ? 'w-2/3 opacity-100' : 'w-0 opacity-0 group-hover:w-1/2 group-hover:opacity-50'}`}></div>
          </div>
        );
      })}
    </nav>
  );
}

function ShoppingHeader() {
  const { isAuthenticated } = useSelector((state) => state.auth);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header 
      className={`fixed top-0 z-50 w-full transition-all duration-500 
        ${scrolled 
          ? 'h-20 bg-white/80 backdrop-blur-2xl border-b border-gray-100 shadow-xl py-2' 
          : 'h-24 bg-white border-b border-transparent shadow-none py-4'}`}
    >
      <div className="max-w-7xl mx-auto h-full flex items-center justify-between px-6 md:px-10 lg:px-12 gap-8">
        {/* Logo Section */}
        <Link className="flex items-center gap-3 group shrink-0" to="/shop/home">
          <div className="relative">
            <div className={`w-12 h-12 rounded-2xl bg-black flex items-center justify-center transition-all duration-500 group-hover:rotate-12 group-hover:scale-110 shadow-lg ${scrolled ? 'scale-90' : 'scale-100'}`}>
                <img src="/suit.png" className="h-7 w-7 invert" alt="Logo" />
            </div>
            <div className="absolute -inset-2 bg-yellow-400/20 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </div>
          <div className="flex flex-col">
            <span className="text-2xl font-black tracking-tighter text-black leading-none uppercase">
              Fashion<span className="text-yellow-500">Hub</span>
            </span>
            <span className="text-[10px] text-gray-400 font-bold tracking-[0.3em] uppercase mt-1">
              Premium Couture
            </span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden lg:block">
          <MenuItems />
        </div>

        {/* Search Component - Modernized Container */}
        <div className="hidden md:block flex-1 max-w-md">
          <div className={`relative group transition-all duration-500 ${scrolled ? 'scale-95' : 'scale-100'}`}>
            <SearchComponent className="premium-search" />
          </div>
        </div>

        {/* Mobile Menu Button */}
        <div className="flex items-center gap-4 lg:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-11 w-11 rounded-xl bg-gray-50 border border-gray-100 hover:bg-gray-100 transition-all"
              >
                <Menu className="h-6 w-6 text-gray-900" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent
              side="right"
              className="w-[85vw] max-w-sm p-8 flex flex-col gap-8 bg-white/95 backdrop-blur-2xl border-l border-white/20"
            >
              <div className="flex flex-col gap-2 mt-8">
                 <span className="text-xs font-bold tracking-[0.3em] uppercase text-yellow-600">Explore</span>
                 <SheetTitle className="text-3xl font-black tracking-tighter">FashionHub</SheetTitle>
              </div>
              
              <div className="my-4">
                <SearchComponent />
              </div>
              
              <MenuItems />
              
              <div className="mt-auto">
                <Separator className="bg-gray-100 mb-8" />
                <HeaderRightContent />
              </div>
            </SheetContent>
          </Sheet>
        </div>

        {/* Desktop User Actions */}
        <div className="hidden lg:block shrink-0">
          <HeaderRightContent />
        </div>
      </div>
    </header>
  );
}

export default ShoppingHeader;
