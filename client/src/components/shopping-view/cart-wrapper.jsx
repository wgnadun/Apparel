import { useNavigate } from "react-router-dom";
import { Button } from "../ui/button";
import { SheetContent, SheetHeader, SheetTitle } from "../ui/sheet";
import UserCartItemsContent from "./cart-items-content";
import { Separator } from "../ui/separator";

function UserCartWrapper({ cartItems, setOpenCartSheet }) {
  const navigate = useNavigate();

  const totalCartAmount =
    cartItems && cartItems?.items?.length > 0
      ? cartItems.items.reduce(
          (sum, currentItem) =>
            sum +
            (currentItem?.salePrice > 0
              ? currentItem?.salePrice
              : currentItem?.price) *
              currentItem?.quantity,
          0
        )
      : 0;

  return (
    <SheetContent className="sm:max-w-md px-5">
      <SheetHeader className="border-b pb-4">
        <SheetTitle className="text-2xl font-bold text-gray-800">
          Shopping Cart
        </SheetTitle>
        <p className="text-sm text-gray-500">
          Review your items before proceeding to checkout.
        </p>
      </SheetHeader>

     <div className="mt-8 space-y-4 max-h-150 overflow-y-auto px-4">
        {cartItems && cartItems?.items?.length > 0
          ? cartItems.items.map((item, index) => (
              <div
                key={index}
                className="transition-all duration-300 hover:shadow-md hover:scale-[1.02] rounded-lg p-2"
              >
                <UserCartItemsContent cartItem={item} />
              </div>
            ))
          : null}
      </div>

      <Separator/>
      <div className="mt-8 space-y-4">
        <div className="flex justify-between">
          <span className="font-bold">Total Amount :</span>
          <span className="font-bold">${totalCartAmount.toFixed(2)}</span>
        </div>
      </div>
    
      {cartItems?.items?.length > 0 &&(
            <Button
              onClick={() => {
                navigate("/shop/checkout");
                setOpenCartSheet(false);
              }}
              className="w-full mt-6"
              
            >
              Checkout
            </Button>
      )}

    </SheetContent>
  );
}

export default UserCartWrapper;