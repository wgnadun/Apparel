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
            <div className="relative h-[300px] w-full overflow-hidden">
                <img src={img} alt="Account" className="object-cover object-center w-full h-full" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-5 p-5">
                <Address 
                selectedId = {currentSelectedAddress}
                setCurrentSelectedAddress={setCurrentSelectedAddress} />
                <div className='flex flex-col gap-4'>
                     {cartItems && cartItems.items && cartItems.items.length > 0
                        ? cartItems.items.map((item) => (
                            <UserCartItemsContent cartItem={item} />
                          ))
                        : null}
                <div className="mt-8 space-y-4">
                      <div className="flex justify-between">
                        <span className="font-bold">Total</span>
                        <span className="font-bold">${totalCartAmount}</span>
                      </div>
                </div> 
                <div className="mt-4 w-full">
                    <Button onClick={handleInitiatePaypalPayment} className="w-full">
                         {
                          isPaymentStart ? 'Proccessing payment' : 'Checkout with Paypal'
                         }
                    </Button>
            </div>     
          </div>
        </div>
            
        </div>
    );
    
}

export default ShoppingCheckout;