import { useSelector } from 'react-redux';
import img from '../../assets/account.jpg';
import Address from '../../components/shopping-view/address';
import UserCartItemsContent from '@/components/shopping-view/cart-items-content';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

function ShoppingCheckout() {

const {cartItems} = useSelector((state)=>state.shopCart);
const {user} = useSelector((state)=>state.auth);
const[currentSelectedAddress,setCurrentSelectedAddress]= useState(null);

console.log(currentSelectedAddress,'cart currentSelectedAddress')

    
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

   console.log(orderData);
}



    return(
        <div className="flex flex-col">
            <div className="relative h-[300px] w-full overflow-hidden">
                <img src={img} alt="Account" className="object-cover object-center w-full h-full" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-5 p-5">
                <Address setCurrentSelectedAddress={setCurrentSelectedAddress} />
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
                         Pay with Payapal
                    </Button>
            </div>     
          </div>
        </div>
            
        </div>
    );
    
}

export default ShoppingCheckout;