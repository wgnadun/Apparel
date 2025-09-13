import { useDispatch, useSelector } from 'react-redux';
import img from '../../assets/account.jpg';
import Address from '../../components/shopping-view/address';
import UserCartItemsContent from '@/components/shopping-view/cart-items-content';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { createNewOrder } from '@/store/shop/order-slice';
import { toast } from 'sonner';

function ShoppingCheckout() {

const {cartItems} = useSelector((state)=>state.shopCart);
const {user} = useSelector((state)=>state.auth);
const {approvalURL} = useSelector((state)=>state.shopOrder);
const[currentSelectedAddress,setCurrentSelectedAddress]= useState(null);
const [isPaymentStart,setIsPaymentStart] = useState(false);
const dispatch = useDispatch();

console.log(currentSelectedAddress,' current Selected Address')

    
   const totalCartAmount =
    cartItems && cartItems.items && cartItems.items.length > 0
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

function handleInitiatePaypalPayment(){
  
  
  if(cartItems.length === 0){
       toast.error('Your cart is empty. Please add items to proceed checkout !',{
         style:
         {
           background:'white',
           color:'#8B0000'
         }
       });
       return;
  }
  if(currentSelectedAddress === null){
       toast.error('please select one address to proceed !',{
         style:
         {
           background:'white',
           color:'#8B0000'
         }
       });
       return;
  }
 const orderData = {
      userId: user?.id,
      cartId: cartItems?._id,
      cartItems: cartItems.items.map((singleCartItem) => ({
        productId: singleCartItem?.productId,
        title: singleCartItem?.title,
        image: singleCartItem?.image,
        price:
          singleCartItem?.salePrice > 0
            ? singleCartItem?.salePrice
            : singleCartItem?.price,
        quantity: singleCartItem?.quantity,
      })),
      addressInfo: {
        addressId: currentSelectedAddress?._id,
        address: currentSelectedAddress?.address,
        city: currentSelectedAddress?.city,
        pincode: currentSelectedAddress?.pincode,
        phone: currentSelectedAddress?.phone,
        notes: currentSelectedAddress?.notes,
      },
      orderStatus: "pending",
      paymentMethod: "paypal",
      paymentStatus: "pending",
      totalAmount: totalCartAmount,
      orderDate: new Date(),
      orderUpdateDate: new Date(),
      paymentId: "",
      payerId: "",
    };

   dispatch(createNewOrder(orderData)).then((data)=>{
    console.log(data,'nadun');
    if(data?.payload?.success){
        setIsPaymentStart(true);
    }else{
      setIsPaymentStart(false);
    }
   })
}

if(approvalURL){
  window.location.href = approvalURL;
}


    return(
        <div className="flex flex-col">
            {/* Banner Image */}
            <div className="relative h-[300px] w-full overflow-hidden">
                <img src={img} alt="Checkout Banner" className="object-cover object-center w-full h-full" />
                <div className="absolute inset-0 bg-opacity-40 flex items-center justify-center">
                    <div className="text-center text-white">
                        <h1 className="text-4xl font-bold mb-4">Checkout</h1>
                        <p className="text-xl">Complete your order securely</p>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    
                    {/* Address Section */}
                    <div className="space-y-6">
                        <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
                            <div className="bg-black text-white px-6 py-4">
                                <h2 className="text-xl font-semibold">Shipping Address</h2>
                                <p className="text-gray-300 text-sm">Select or add a delivery address</p>
                            </div>
                            <div className="p-6">
                                <Address 
                                    selectedId={currentSelectedAddress}
                                    setCurrentSelectedAddress={setCurrentSelectedAddress} 
                                />
                            </div>
                        </div>
                    </div>

                    {/* Order Summary Section */}
                    <div className="space-y-6">
                        <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
                            <div className="bg-black text-white px-6 py-4">
                                <h2 className="text-xl font-semibold">Order Summary</h2>
                                <p className="text-gray-300 text-sm">Review your items and total</p>
                            </div>
                            
                            <div className="p-6">
                                {/* Cart Items */}
                                <div className="space-y-4 max-h-96 overflow-y-auto">
                                    {cartItems && cartItems?.items?.length > 0 ? (
                                        cartItems.items.map((item, index) => (
                                            <div
                                                key={index}
                                                className="bg-gray-50 rounded-lg p-4 border border-gray-200 hover:shadow-md transition-all duration-300"
                                            >
                                                <UserCartItemsContent cartItem={item} />
                                            </div>
                                        ))
                                    ) : (
                                        <div className="text-center py-8">
                                            <p className="text-gray-500">No items in cart</p>
                                        </div>
                                    )}
                                </div>

                                {/* Total Section */}
                                <div className="mt-6 pt-6 border-t border-gray-200">
                                    <div className="bg-gray-50 rounded-lg p-4">
                                        <div className="flex justify-between items-center">
                                            <span className="text-lg font-semibold text-black">Total Amount</span>
                                            <span className="text-2xl font-bold text-black">${totalCartAmount.toFixed(2)}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Checkout Button */}
                                <div className="mt-6">
                                    <Button 
                                        onClick={handleInitiatePaypalPayment} 
                                        className="w-full bg-black hover:bg-gray-800 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                                        disabled={isPaymentStart}
                                    >
                                        {isPaymentStart ? (
                                            <div className="flex items-center justify-center gap-2">
                                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                                Processing Payment...
                                            </div>
                                        ) : (
                                            'Checkout with PayPal'
                                        )}
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
    
}

export default ShoppingCheckout;