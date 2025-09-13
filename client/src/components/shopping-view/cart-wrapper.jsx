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
    <SheetContent className="sm:max-w-md px-0 bg-gradient-to-br from-gray-50 via-white to-gray-100 flex flex-col">
      {/* Premium Header with Glass Morphism */}
      <SheetHeader className="border-b border-gray-200/50 pb-6 px-6 pt-6 bg-white/80 backdrop-blur-md flex-shrink-0">
        <SheetTitle className="text-3xl font-bold bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 bg-clip-text text-transparent">
          Shopping Cart
        </SheetTitle>
        <p className="text-sm text-gray-600 font-medium">
          Review your items before proceeding to checkout.
        </p>
      </SheetHeader>

      {/* Cart Items Container with Premium Styling - Flexible height */}
      <div className="flex-1 mt-4 space-y-2 overflow-y-auto px-4 min-h-0">
        {cartItems && cartItems?.items?.length > 0
          ? cartItems.items.map((item, index) => (
              <div
                key={index}
                className="transition-all duration-500 hover:shadow-xl hover:scale-[1.02] rounded-xl p-3 bg-white/90 backdrop-blur-sm border border-gray-200/50 hover:border-gray-300/70 shadow-lg hover:shadow-2xl"
              >
                <UserCartItemsContent cartItem={item} />
              </div>
            ))
          : (
            <div className="flex flex-col items-center justify-center py-12 px-6">
              <div className="w-20 h-20 bg-gradient-to-br from-gray-200 to-gray-300 rounded-full flex items-center justify-center mb-4">
                <svg className="w-8 h-8 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m6-5v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6m8 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v4.01" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-700 mb-2">Your cart is empty</h3>
              <p className="text-sm text-gray-500 text-center">Add some items to get started</p>
            </div>
          )}
      </div>

      {/* Fixed Bottom Section - Total and Checkout Button */}
      <div className="flex-shrink-0 bg-white/95 backdrop-blur-md border-t border-gray-200/50">
        {/* Premium Separator */}
        <Separator className="bg-gradient-to-r from-transparent via-gray-300 to-transparent"/>
        
        {/* Compact Total Section */}
        <div className="px-4 pt-4 pb-3">
          <div className="bg-gradient-to-r from-gray-800 to-gray-700 rounded-xl p-4 text-white shadow-lg">
            <div className="flex justify-between items-center">
              <span className="text-sm font-semibold">Total</span>
              <span className="text-lg font-bold">
                ${totalCartAmount.toFixed(2)}
              </span>
            </div>
          </div>
        </div>
      
        {/* Compact Checkout Button */}
        {cartItems?.items?.length > 0 &&(
          <div className="px-4 pb-4">
            <Button
              onClick={() => {
                navigate("/shop/checkout");
                setOpenCartSheet(false);
              }}
              className="w-full h-10 bg-gradient-to-r from-gray-900 to-gray-800 hover:from-gray-800 hover:to-gray-700 text-white font-semibold text-sm rounded-xl shadow-md hover:shadow-lg transition-all duration-300 border-0"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
              </svg>
              Checkout
            </Button>
          </div>
        )}
      </div>

    </SheetContent>
  );
}

export default UserCartWrapper;