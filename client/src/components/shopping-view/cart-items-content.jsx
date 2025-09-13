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
    <div className="flex items-center space-x-4 group">
      {/* Product Image */}
      <div className="relative overflow-hidden rounded-lg flex-shrink-0">
        <img
          src={cartItem?.image}
          alt={cartItem?.title}
          className="w-16 h-16 rounded-lg object-cover transition-transform duration-300 group-hover:scale-105"
        />
      </div>
      
      {/* Product Details */}
      <div className="flex-1 min-w-0">
        <h3 className="font-semibold text-black text-sm leading-tight line-clamp-2 mb-2">
          {cartItem?.title}
        </h3>
        
        {/* Quantity Controls */}
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            className="h-6 w-6 rounded-full border border-gray-300 hover:border-black hover:bg-black hover:text-white transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            size="icon"
            disabled={cartItem?.quantity === 1}
            onClick={() => handleUpdateQuantity(cartItem, "minus")}
          >
            <Minus className="w-3 h-3" />
            <span className="sr-only">Decrease</span>
          </Button>
          <div className="bg-gray-100 px-2 py-1 rounded-full min-w-[2rem] text-center">
            <span className="font-semibold text-black text-xs">{cartItem?.quantity}</span>
          </div>
          <Button
            variant="outline"
            className="h-6 w-6 rounded-full border border-gray-300 hover:border-black hover:bg-black hover:text-white transition-all duration-300"
            size="icon"
            onClick={() => handleUpdateQuantity(cartItem, "plus")}
          >
            <Plus className="w-3 h-3" />
            <span className="sr-only">Increase</span>
          </Button>
        </div>
      </div>
      
      {/* Price and Actions */}
      <div className="flex flex-col items-end space-y-2">
        {/* Price */}
        <div className="text-right">
          <p className="font-bold text-black text-sm">
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
        
        {/* Delete Button */}
        <Button
          variant="outline"
          size="icon"
          onClick={() => handleCartItemDelete(cartItem)}
          className="h-6 w-6 rounded-full border border-gray-300 hover:border-red-500 hover:bg-red-500 hover:text-white transition-all duration-300"
        >
          <Trash className="w-3 h-3" />
          <span className="sr-only">Remove item</span>
        </Button>
      </div>
    </div>
  );
}

export default UserCartItemsContent;