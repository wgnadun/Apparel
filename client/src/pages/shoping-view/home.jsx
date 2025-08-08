import { Airplay, BabyIcon, ChevronLeft, ChevronRight, CloudLightning, Heater, Images, Shirt, ShirtIcon, ShoppingBasket, UmbrellaIcon, WashingMachine, WatchIcon } from 'lucide-react';
import  bannerOne from '../../assets/banner-1.webp';
import  bannerTwo from '../../assets/banner-2.webp';
import  bannerThree from '../../assets/banner-3.webp';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllFilteredProducts, fetchProductDetails } from '@/store/shop/products-slice';
import ShoppingProductTile from '@/components/shopping-view/product-tile';
import { useNavigate } from 'react-router-dom';
import ProductDetailsDialog from '@/components/shopping-view/product-details';
import { addToCart, fetchCartItems } from '@/store/shop/cart-slice';
import { toast } from 'sonner';
import { getFeatureImages } from '@/store/common/feature-slice';
 
const categoriesWithIcons = 
            [
            { id: "men", label: "Men" , icon : ShirtIcon },
            { id: "women", label: "Women",icon:CloudLightning },
            { id: "kids", label: "Kids" , icon: BabyIcon },
            { id: "accessories", label: "Accessories", icon: WatchIcon },
            { id: "footwear", label: "Footwear", icon: UmbrellaIcon },
            ];
 const brandsWithIcon = [
  { id: "nike", label: "Nike", icon: Shirt },
  { id: "adidas", label: "Adidas", icon: WashingMachine },
  { id: "puma", label: "Puma", icon: ShoppingBasket },
  { id: "levi", label: "Levi's", icon: Airplay },
  { id: "zara", label: "Zara", icon: Images },
  { id: "h&m", label: "H&M", icon: Heater },
];
function ShoppingHome() {

    const [currentSlide, setCurrentSlide] = useState(0);
    const { productList ,productDetails} = useSelector((state) => state.shopProducts);
    const { user } = useSelector((state) => state.auth);
    const [openDetailsDialog, setOpenDetailsDialog] = useState(false);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { cartItems } = useSelector((state) => state.shopCart);

      const {featureImageList} = useSelector(state => state.commonFeature)

    

    useEffect(()=>{
        if(productDetails !==null) setOpenDetailsDialog(true);
    },[productDetails]);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentSlide((prevSlide) => (prevSlide + 1) % featureImageList.length);
        }, 4000);

        return () => clearInterval(interval);
    }, [featureImageList]);

    useEffect(() =>{
        dispatch(fetchAllFilteredProducts({ filterParams : {},sortParams :'price-lowtohigh'}));
    },[dispatch])


      useEffect(()=>{
        dispatch(getFeatureImages())
      },[dispatch]);
    

function handleGetProductDetails(getCurrentProductId) {
                dispatch(fetchProductDetails(getCurrentProductId))
                console.log(getCurrentProductId)
         }

function handleAddtoCart(getCurrentProductId,getTotalStock) {
       
            let getCartItems = cartItems.items || [];

            if (getCartItems.length) {
            const indexOfCurrentItem = getCartItems.findIndex(
                (item) => item.productId === getCurrentProductId
            );

            if (indexOfCurrentItem > -1) {
            
                const getQuantity = getCartItems[indexOfCurrentItem].quantity;
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

        dispatch(
            addToCart({
            userId: user?.id, 
            productId: getCurrentProductId, 
            quantity: 1
        })).then((data) => {
            if (data?.payload?.success) {
                dispatch(fetchCartItems(user.id));
                toast.success("Item added to cart successfully!");
            } else {
                toast.error("Failed to add item to cart");
            }
        }).catch((error) => {
            console.error("Add to cart error:", error);
            toast.error("Failed to add item to cart");
        });
     }


    function handleNavigateToListingPage(getCurrentItem, section) {
        sessionStorage.removeItem('filters');
        const currentFilter ={
            [section] : [getCurrentItem.id]
        }

        sessionStorage.setItem('filters',JSON.stringify(currentFilter));
        
        // Dispatch a custom event to notify the listing page about filter changes
        window.dispatchEvent(new CustomEvent('filtersChanged', { 
            detail: { filters: currentFilter } 
        }));
        
        navigate('/shop/listing');
    }


   console.log(productList,'productList');
    return(
        <div className="flex flex-col min-h-screen">
            <div className="relative w-full h-[600px] overflow-hidden">
                {
                    featureImageList && featureImageList.length > 0 ? featureImageList.map((slide,index)=>
                        <img 
                        src={slide?.image} 
                        key={index} 
                        className={
                            `${index === currentSlide ? 'opacity-100' : 'opacity-0'} absolute top-0 left-0 w-full h-full object-cover transition-opacity duration-1000`
                        }
                /> ) : null
                }
                <Button variant="outline" size="icon"
                        onClick ={()=> setCurrentSlide(prevSlide=>(prevSlide - 1 + featureImageList.length) % featureImageList.length)}
                        className="absolute top-1/2 left-4 transform -translate-y-1/2 bg-white/80">
                    <ChevronLeft className='w-4 h-4' />
                </Button>
                <Button variant="outline" size="icon"
                        onClick ={()=> setCurrentSlide(prevSlide=>(prevSlide + 1) % featureImageList.length)}
                        className="absolute top-1/2 right-4 transform -translate-y-1/2 bg-white/80">
                    <ChevronRight className='w-4 h-4' />
                </Button>
            </div>
            <section className="py-12 bg-gray-50">
                <div className="container mx-auto px-4">
                    <h2 className="text-3xl font-bold text-center mb-8">Shop By Category</h2>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                        {
                            categoriesWithIcons.map((categoryItem)=> 
                            <Card onClick={() => handleNavigateToListingPage(categoryItem,'category')} className="cursor-pointer hover:shadow-lg transition-shadow">
                                    <CardContent className="flex flex-col items-center justify-center p-6">
                                        <categoryItem.icon className="w-12 h-12 text-primary mb-4" />
                                        <span className="text-lg font-semibold">{categoryItem.label}</span>
                                    </CardContent>
                            </Card>)
                        }
                    </div>
                </div>
            </section>

            <section className="py-12 bg-gray-50">
                <div className="container mx-auto px-4">
                    <h2 className="text-3xl font-bold text-center mb-8">Shop By Brand</h2>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                        {
                            brandsWithIcon.map((brandItem)=> 

                            <Card onClick={() => handleNavigateToListingPage(brandItem,'brand')} className="cursor-pointer hover:shadow-lg transition-shadow">
                                    <CardContent className="flex flex-col items-center justify-center p-6">
                                        <brandItem.icon className="w-12 h-12 text-primary mb-4" />
                                        <span className="text-lg font-semibold">{brandItem.label}</span>
                                    </CardContent>
                            </Card>)
                        }
                    </div>
                </div>
            </section>

            <section className='py-12 bg-gray-50'>
                <div className="container mx-auto px-4">
                    <h2 className="text-3xl font-bold text-center mb-8">
                        Feature products
                    </h2>    
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {
                            productList && productList.length > 0 ? 
                            
                           productList.map((productItem)=>(
                           <ShoppingProductTile 
                                handleGetProductDetails={handleGetProductDetails}
                                product={productItem}
                                handleAddtoCart={handleAddtoCart}
                            />
                        ))
                      
                            : null  }
                           
                    </div>                  
                </div>
            </section>
              <ProductDetailsDialog 
                open={openDetailsDialog} 
                setOpen={setOpenDetailsDialog} 
                productDetails={productDetails}
                handleAddtoCart={handleAddtoCart}
            />
        </div>
    );
    
}

export default ShoppingHome;