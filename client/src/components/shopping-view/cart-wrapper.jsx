import { useNavigate } from "react-router-dom";
import { Button } from "../ui/button";
import { SheetContent, SheetHeader, SheetTitle } from "../ui/sheet";
import UserCartItemsContent from "./cart-items-content";

function UserCartWrapper({cartItems,setOpenCartSheet}) {
    const navigate = useNavigate();
    const totalAmount = cartItems?.reduce((total, item) => {
        const price = item.salePrice > 0 ? item.salePrice : item.price;
        return total + (price * item.quantity);
    }, 0) || 0;

    return(
        <SheetContent className="sm:max-w-md">
            <SheetHeader>
                <SheetTitle>Your Cart</SheetTitle>
            </SheetHeader>
            <div className="mt-8 space-y-4">
                {
                    cartItems && cartItems.length > 0 ?
                    cartItems.map((item, index) => (
                        <UserCartItemsContent 
                            key={item.productId || index} 
                            cartItems={item}
                        />
                    )) : (
                        <div className="text-center text-muted-foreground py-8">
                            Your cart is empty
                        </div>
                    )
                }
            </div>
            {cartItems && cartItems.length > 0 && (
                <div className="mt-8 space-y-4">
                    <div className="flex justify-between">
                        <span className="font-bold">Total</span>
                        <span className="font-bold">Total Amount : ${totalAmount.toFixed(2)}</span>
                    </div>
                </div>
            )}
            <Button 
            onClick={()=> 
            {navigate("/shop/checkout")
             setOpenCartSheet(false)

            }}
            className="w-full mt-6" disabled={!cartItems || cartItems.length === 0}>
                Checkout
            </Button>

        </SheetContent>
    )
}

export default UserCartWrapper; 