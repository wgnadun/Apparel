import { Button } from "../ui/button";
import { Minus, Plus, Trash2 } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { updateCartQuantity, deleteCartItem } from "@/store/shop/cart-slice";
import { toast } from "sonner";

function UserCartItemsContent({ cartItems }) {
    const { user } = useSelector(state => state.auth);
    const dispatch = useDispatch();

    const handleQuantityChange = (newQuantity) => {
        if (newQuantity < 1) return;
        
        dispatch(updateCartQuantity({
            userId: user.id,
            productId: cartItems.productId,
            quantity: newQuantity
        })).then((data) => {
            if (data?.payload?.success) {
                toast.success("Quantity updated successfully!");
            } else {
                toast.error("Failed to update quantity");
            }
        }).catch((error) => {
            console.error("Update quantity error:", error);
            toast.error("Failed to update quantity");
        });
    };

    const handleRemoveItem = () => {
        dispatch(deleteCartItem({
            userId: user.id,
            productId: cartItems.productId
        })).then((data) => {
            if (data?.payload?.success) {
                toast.success("Item removed from cart!");
            } else {
                toast.error("Failed to remove item");
            }
        }).catch((error) => {
            console.error("Remove item error:", error);
            toast.error("Failed to remove item");
        });
    };

    const price = cartItems.salePrice > 0 ? cartItems.salePrice : cartItems.price;
    const totalPrice = price * cartItems.quantity;

    return (
        <div className="flex items-center gap-4 p-4 border rounded-lg">
            <div className="flex-shrink-0">
                <img 
                    src={cartItems?.image} 
                    alt={cartItems?.title}
                    className="w-16 h-16 object-cover rounded"
                />
            </div>
            <div className="flex-1 min-w-0">
                <h3 className="text-sm font-medium text-gray-900 truncate">
                    {cartItems.title}
                </h3>
                <p className="text-sm text-gray-500">
                    ${price.toFixed(2)}
                </p>
            </div>
            <div className="flex items-center gap-2">
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleQuantityChange(cartItems.quantity - 1)}
                    disabled={cartItems.quantity === 1}
                >
                    <Minus className="h-4 w-4" />
                </Button>
                <span className="text-sm font-medium w-8 text-center">
                    {cartItems.quantity}
                </span>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleQuantityChange(cartItems.quantity + 1)}
                >
                    <Plus className="h-4 w-4" />
                </Button>
            </div>
            <div className="flex flex-col items-end gap-2">
                <p className="text-sm font-medium">
                    ${totalPrice.toFixed(2)}
                </p>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={handleRemoveItem}
                    className="text-red-500 hover:text-red-700"
                >
                    <Trash2 className="cursor-pointer h-4 w-4 size={20}" />
                </Button>
            </div>
        </div>
    );
}

export default UserCartItemsContent;