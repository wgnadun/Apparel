import { Item } from "@radix-ui/react-dropdown-menu";
import { Button } from "../ui/button";
import { SheetContent, SheetHeader, SheetTitle } from "../ui/sheet";
import UserCartItemsContent from "./cart-items-content";

function UserCartWrapper({cartItems}) {
    return(
        <SheetContent className="sm:max-w-md">
            <SheetHeader>
                <SheetTitle>Your Cart</SheetTitle>
            </SheetHeader>
            <div className="mt-8 space-y-4">
                {
                    cartItems && cartItems.length > 0 ?
                    cartItems.map((Item)=> <UserCartItemsContent cartItems={Item}/>):null
                }
            </div>
            <div className="mt-8 space-y-4">
                <div className="flex justify-between">
                    <span className="font-bold">Total</span>
                    <span className="font-bold">Total Amount : $10000</span>
                </div>
            </div>
            <Button className="w-full mt-6">Checkout</Button>

        </SheetContent>
    )
}

export default UserCartWrapper; 