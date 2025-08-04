import { HousePlug, LogOut, Menu, ShoppingCart, UserCog } from "lucide-react";
import { Link, useNavigate} from "react-router-dom";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "../ui/sheet";
import { Button } from "../ui/button";
import { useDispatch, useSelector } from "react-redux";
import { shoppingViewHeaderMenuItems } from "@/config";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { logoutUser } from "@/store/auth-slice";
import UserCartWrapper from "./cart-wrapper";
import { useEffect, useState } from "react";
import { fetchCartItems } from "@/store/shop/cart-slice";
import { Label } from "@radix-ui/react-label";

function HeaderRightContent() {
        const {user} = useSelector(state => state.auth);
        const { cartItems } = useSelector(state => state.shopCart);
        const [OpenCartSheet, setOpenCartSheet] = useState(false);
        const navigate = useNavigate();
        const dispatch = useDispatch();

        function handleLogout() {
             dispatch(logoutUser());
        }
        
        useEffect(()=>{
            if (user?.id) {
                dispatch(fetchCartItems(user.id))
            }
        }, [dispatch, user?.id]);

    return (
        <div className="flex lg:items-center lg:flex-row flex-col gap-4">
           <Sheet open={OpenCartSheet} onOpenChange={() => setOpenCartSheet(false)}>
            <Button onClick ={() => setOpenCartSheet(true)} variant="outline" size="icon" className="hidden lg:inline-flex">
             <ShoppingCart className="h-6 w-6   "/>
             <span className="sr-only">user Cart icon</span>
           </Button>
           <UserCartWrapper 
           setOpenCartSheet={setOpenCartSheet}
           cartItems={cartItems || []} />
           </Sheet>

            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Avatar className="bg to-black">
                        <AvatarFallback className="bg-black text-white font-extrabold">{user?.userName[0].toUpperCase()}</AvatarFallback>
                    </Avatar>
                </DropdownMenuTrigger>
                    <DropdownMenuContent sideright="right" className="w-56">
                        <DropdownMenuLabel>Logged in as {user?.userName}</DropdownMenuLabel>
                        <DropdownMenuSeparator/>
                        <DropdownMenuItem onClick ={() => navigate("/shop/account")}>
                            <UserCog className="mr-2 h-4 w-4"/>
                            Account
                        </DropdownMenuItem>
                        <DropdownMenuSeparator/>
                        <DropdownMenuItem onClick={handleLogout}>
                            <LogOut className="mr-2 h-4 w-4"/>
                            Logout
                        </DropdownMenuItem>
                    </DropdownMenuContent>
            </DropdownMenu>

        </div>
    );
}

function MenuItems() {

    const navigate = useNavigate();

    function handleNavigate(getCurrentMenuItem){
        const currentFilter = getCurrentMenuItem.id !== 'home'
        ? { category: [getCurrentMenuItem.id] }
        : null;

    currentFilter
        ? sessionStorage.setItem('filters', JSON.stringify(currentFilter))
        : sessionStorage.removeItem('filters');

    // Dispatch a custom event to notify the listing page about filter changes
    window.dispatchEvent(new CustomEvent('filtersChanged', { 
        detail: { filters: currentFilter } 
    }));

    navigate(getCurrentMenuItem.path);
    }
    return(
        <nav className="flex flex-col mb-3 lg:mb-0 lg:items-center gap-6 lg:flex-row"> 
            {
                shoppingViewHeaderMenuItems.map(menuItem =>
                     <Label
                     className="text-sm font-medium cursor-pointer"
                     onClick={() => {handleNavigate(menuItem)}}
                     key={menuItem.id}
                     > {menuItem.label}
                     
                     </Label>)
            }
        </nav>
    );
}


function ShoppingHeader() {

    const {isAuthenticated} = useSelector(state => state.auth);
    return (
        <header className="sticky top-0 z-40 w-full border-b bg-background">
            <div className="flex h-16 items-center justify-between px-4 md:px-6">
               <Link className="flex items-center gap-2" to="/shop/home">
                    <img src="/suit.png" className="h-10 w-10"/>
                    <span className="font-bold">FashionHub</span>
               </Link> 

               <Sheet>
                   <SheetTrigger asChild>
                       <Button variant="outline" size="icon" className="lg:hidden">
                            <Menu className="h-6 w-6"/>
                            <span className="sr-only">Toggle header menu</span>
                       </Button>
                   </SheetTrigger>
                   <SheetContent side="left" className="w-full max-w-xs">
                    <SheetTitle className="sr-only">Main menu</SheetTitle>
                    <MenuItems />
                    <HeaderRightContent />
                   </SheetContent>
               </Sheet>
               <div className="hidden lg:block">
                     <MenuItems />
               </div>
               <div className="hidden lg:block"> <HeaderRightContent /> </div>
            </div>
        </header>
    );    
}


export default ShoppingHeader;