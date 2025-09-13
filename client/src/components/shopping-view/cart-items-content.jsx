import { Minus, Plus, Trash } from "lucide-react";
import { Button } from "../ui/button";
import { useDispatch, useSelector } from "react-redux";
import { deleteCartItem, updateCartQuantity } from "@/store/shop/cart-slice";
import { toast } from "sonner";

function UserCartItemsContent({ cartItem }) {

  const { user } = useSelector((state) => state.auth);
  const { cartItems } = useSelector((state) => state.shopCart);
  const { productList } = useSelector((state) => state.shopProducts);
  const dispatch = useDispatch();

  function handleUpdateQuantity(getCartItem, typeOfAction) {

    if (typeOfAction == "plus") {

    let getCartItems = cartItems.items || [];

    if (getCartItems.length) {
      
      const indexOfCurrentCartItem = getCartItems.findIndex(
        (item) => item.productId === getCartItem?.productId
      );

      const getCurrentProductIndex = productList.findIndex(
      (product) => product._id === getCartItem?.productId
    );
      
      const getTotalStock = productList[getCurrentProductIndex].totalStock;

      if (indexOfCurrentCartItem > -1) {
        const getQuantity = getCartItems[indexOfCurrentCartItem].quantity;
        if (getQuantity + 1 > getTotalStock) {
          toast.error(`only ${getQuantity} can be added for this Items`, {
            style: {
              background: "white",
              color: "red",
            },
          });
          return;
        }
      }
    }
    }

    dispatch(
      updateCartQuantity({
        userId: user?.id,
        productId: getCartItem?.productId,
        quantity:
          typeOfAction === "plus"
            ? getCartItem?.quantity + 1
            : getCartItem?.quantity - 1,
      })
    ).then((data) => {
      if (data?.payload?.success) {
        toast.success('Cart item is updated successfully');
      }
    });
  }

  function handleCartItemDelete(getCartItem) {
    dispatch(
      deleteCartItem({ userId: user?.id, productId: getCartItem?.productId })
    ).then((data) => {
      if (data?.payload?.success) {
        toast.success('Cart item is deleted successfully');
      }
    });
  }

  return (
    <div className="flex items-center space-x-3 group">
      {/* Compact Product Image */}
      <div className="relative overflow-hidden rounded-lg">
        <img
          src={cartItem?.image}
          alt={cartItem?.title}
          className="w-20 h-20 rounded-lg object-cover transition-transform duration-300 group-hover:scale-105 shadow-sm"
        />
        {/* Subtle gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      </div>
      
      {/* Product Details with Compact Typography */}
      <div className="flex-1 min-w-0">
        <h3 className="font-semibold text-gray-900 text-base leading-tight line-clamp-2 mb-2">
          {cartItem?.title}
        </h3>
        
        {/* Compact Quantity Controls */}
        <div className="flex items-center gap-2 mt-2">
          <Button
            variant="outline"
            className="h-7 w-7 rounded-full border border-gray-300 hover:border-gray-900 hover:bg-gray-900 hover:text-white transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            size="icon"
            disabled={cartItem?.quantity === 1}
            onClick={() => handleUpdateQuantity(cartItem, "minus")}
          >
            <Minus className="w-3 h-3" />
            <span className="sr-only">Decrease</span>
          </Button>
          <div className="bg-gray-100 px-3 py-1 rounded-full min-w-[2.5rem] text-center">
            <span className="font-semibold text-gray-900 text-sm">{cartItem?.quantity}</span>
          </div>
          <Button
            variant="outline"
            className="h-7 w-7 rounded-full border border-gray-300 hover:border-gray-900 hover:bg-gray-900 hover:text-white transition-all duration-300"
            size="icon"
            onClick={() => handleUpdateQuantity(cartItem, "plus")}
          >
            <Plus className="w-3 h-3" />
            <span className="sr-only">Increase</span>
          </Button>
        </div>
      </div>
      
      {/* Compact Price and Actions */}
      <div className="flex flex-col items-end space-y-2">
        {/* Price with Compact Styling */}
        <div className="text-right">
          <p className="font-semibold text-lg text-gray-900">
            ${(
              (cartItem?.salePrice > 0 ? cartItem?.salePrice : cartItem?.price) *
              cartItem?.quantity
            ).toFixed(2)}
          </p>
          {cartItem?.salePrice > 0 && cartItem?.salePrice !== cartItem?.price && (
            <p className="text-xs text-gray-500 line-through">
              ${(cartItem?.price * cartItem?.quantity).toFixed(2)}
            </p>
          )}
        </div>
        
        {/* Compact Delete Button */}
        <Button
          variant="outline"
          size="icon"
          onClick={() => handleCartItemDelete(cartItem)}
          className="h-7 w-7 rounded-full border border-red-200 hover:border-red-500 hover:bg-red-500 hover:text-white transition-all duration-300 group/delete"
        >
          <Trash className="w-3 h-3 group-hover/delete:scale-110 transition-transform duration-200" />
          <span className="sr-only">Remove item</span>
        </Button>
      </div>
    </div>
  );
}

export default UserCartItemsContent;