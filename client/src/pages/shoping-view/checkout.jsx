import { useSelector } from 'react-redux';
import img from '../../assets/account.jpg';
import Address from './address';
import UserCartItemsContent from '@/components/shopping-view/cart-items-content';

function ShoppingCheckout() {
    const {cartItems} = useSelector((state)=>state.shopCart);
    console.log(cartItems);
    return(
        <div className="flex flex-col">
            <div className="relative h-[300px] w-full overflow-hidden">
                <img src={img} alt="Account" className="object-cover object-center w-full h-full" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-5 p-5">
                <Address />
                <div className='flex flex-col gap-4'>
                    {cartItems && cartItems.length > 0
                        ? cartItems.map((item, idx) => (
                            <UserCartItemsContent key={item.productId || idx} cartItems={item} />
                        ))
                        : null}
                </div>
            </div>
            
        </div>
    );
    
}

export default ShoppingCheckout;