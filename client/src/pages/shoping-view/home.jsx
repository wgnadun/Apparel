import { Airplay, BabyIcon, ChevronLeft, ChevronRight, CloudLightning, Heater, Images, Shirt, ShirtIcon, ShoppingBasket, UmbrellaIcon, WashingMachine, WatchIcon } from 'lucide-react';
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
    
    // Show More functionality
    const [visibleProducts, setVisibleProducts] = useState(10); // Show 10 products initially
    const productsPerPage = 10; // Load 10 more products each time

    // Get visible products for display
    const displayedProducts = productList?.slice(0, visibleProducts) || [];
    const hasMoreProducts = productList && productList.length > visibleProducts;

    // Show More handler
    const handleShowMore = () => {
        setVisibleProducts(prev => prev + productsPerPage);
    };

    // Reset visible products when productList changes
    useEffect(() => {
        setVisibleProducts(10);
    }, [productList]);

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
        <div className="flex flex-col min-h-screen bg-white">
            {/* Hero Section */}
            <div className="relative w-full h-screen overflow-hidden">
                {
                    featureImageList && featureImageList.length > 0 ? featureImageList.map((slide,index)=>
                        <div 
                        key={index} 
                        className={
                            `${index === currentSlide ? 'opacity-100' : 'opacity-0'} absolute top-0 left-0 w-full h-full transition-opacity duration-1000`
                        }
                        >
                            <img 
                                src={slide?.image} 
                                className="w-full h-full object-cover"
                                alt={`Hero slide ${index + 1}`}
                            />
                            <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-black/20"></div>
                        </div>
                    ) : null
                }
                
                {/* Hero Content */}
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center text-white max-w-6xl px-4 sm:px-6 lg:px-8">
                        {/* Main Heading */}
                        <div className="mb-8">
                            <h1 className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-black mb-4 bg-gradient-to-r from-white via-gray-100 to-gray-300 bg-clip-text text-transparent leading-tight">
                                FashionHub
                            </h1>
                            <div className="w-32 h-1 bg-gradient-to-r from-yellow-400 to-orange-500 mx-auto mb-6"></div>
                        </div>
                        
                        {/* Subheading */}
                        <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-light mb-6 text-gray-100 leading-relaxed">
                            Discover Premium Fashion
                        </h2>
                        
                        {/* Description */}
                        <p className="text-lg sm:text-xl md:text-2xl mb-12 text-gray-200 font-light max-w-3xl mx-auto leading-relaxed">
                            Experience luxury fashion that defines your unique style. From timeless classics to cutting-edge trends, 
                            we curate the finest collection for the modern fashion enthusiast.
                        </p>
                        
                        {/* CTA Button */}
                        <div className="flex justify-center">
                            <Button 
                                onClick={() => {
                                    document.getElementById('categories-section')?.scrollIntoView({ 
                                        behavior: 'smooth',
                                        block: 'start'
                                    });
                                }}
                                className="px-12 py-6 text-2xl font-bold bg-gradient-to-r from-yellow-400 to-orange-500 text-gray-900 hover:from-yellow-500 hover:to-orange-600 transition-all duration-300 transform hover:scale-105 shadow-2xl rounded-full"
                            >
                                Shop Now
                            </Button>
                        </div>
                        
                        {/* Additional Info */}
                        <div className="mt-16 flex flex-col sm:flex-row justify-center items-center gap-8 text-sm text-gray-300">
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                                <span>Free Worldwide Shipping</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                                <span>Premium Quality</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                                <span>30-Day Returns</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Navigation Arrows */}
                <Button 
                    variant="outline" 
                    size="icon"
                    onClick={() => setCurrentSlide(prevSlide=>(prevSlide - 1 + featureImageList.length) % featureImageList.length)}
                    className="absolute top-1/2 left-8 transform -translate-y-1/2 bg-white/10 backdrop-blur-md border-white/20 hover:bg-white/20 text-white h-14 w-14 rounded-full"
                >
                    <ChevronLeft className='w-7 h-7' />
                </Button>
                <Button 
                    variant="outline" 
                    size="icon"
                    onClick={() => setCurrentSlide(prevSlide=>(prevSlide + 1) % featureImageList.length)}
                    className="absolute top-1/2 right-8 transform -translate-y-1/2 bg-white/10 backdrop-blur-md border-white/20 hover:bg-white/20 text-white h-14 w-14 rounded-full"
                >
                    <ChevronRight className='w-7 h-7' />
                </Button>

                {/* Slide Indicators */}
                <div className="absolute bottom-12 left-1/2 transform -translate-x-1/2 flex space-x-3">
                    {featureImageList.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => setCurrentSlide(index)}
                            className={`w-4 h-4 rounded-full transition-all duration-300 ${
                                index === currentSlide ? 'bg-white scale-125' : 'bg-white/50 hover:bg-white/75'
                            }`}
                        />
                    ))}
                </div>

            </div>

            {/* Categories Section */}
            <section id="categories-section" className="py-20 bg-gradient-to-b from-white to-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                            Shop By Category
                        </h2>
                        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                            Discover our curated collections designed for every style and occasion
                        </p>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
                        {
                            categoriesWithIcons.map((categoryItem)=> 
                            <Card 
                                key={categoryItem.id} 
                                onClick={() => handleNavigateToListingPage(categoryItem,'category')} 
                                className="group cursor-pointer hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 bg-white border-0 shadow-lg overflow-hidden"
                            >
                                <CardContent className="flex flex-col items-center justify-center p-8 relative">
                                    <div className="absolute inset-0 bg-gradient-to-br from-yellow-400/10 to-orange-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                    <div className="relative z-10">
                                        <categoryItem.icon className="w-16 h-16 text-gray-700 mb-6 group-hover:text-yellow-600 transition-colors duration-300" />
                                        <span className="text-lg font-semibold text-gray-900 group-hover:text-yellow-600 transition-colors duration-300">
                                            {categoryItem.label}
                                        </span>
                                    </div>
                                </CardContent>
                            </Card>)
                        }
                    </div>
                </div>
            </section>

            {/* Brands Section */}
            <section className="py-20 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                            Premium Brands
                        </h2>
                        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                            Shop from the world's most prestigious fashion brands
                        </p>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
                        {
                            brandsWithIcon.map((brandItem)=> 
                            <Card 
                                key={brandItem.id} 
                                onClick={() => handleNavigateToListingPage(brandItem,'brand')} 
                                className="group cursor-pointer hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 bg-white border-0 shadow-lg overflow-hidden"
                            >
                                <CardContent className="flex flex-col items-center justify-center p-6 relative">
                                    <div className="absolute inset-0 bg-gradient-to-br from-gray-100/50 to-gray-200/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                    <div className="relative z-10">
                                        <brandItem.icon className="w-14 h-14 text-gray-600 mb-4 group-hover:text-gray-900 transition-colors duration-300" />
                                        <span className="text-sm font-semibold text-gray-800 group-hover:text-gray-900 transition-colors duration-300">
                                            {brandItem.label}
                                        </span>
                                    </div>
                                </CardContent>
                            </Card>)
                        }
                    </div>
                </div>
            </section>

            {/* Featured Products Section */}
            <section className='py-20 bg-gradient-to-b from-gray-50 to-white'>
                <div className="max-w-8xl mx-auto px-3 sm:px-4 lg:px-20">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                            Featured Products
                        </h2>
                        <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
                            Handpicked items that define the latest trends
                        </p>
                        <div className="w-24 h-1 bg-gradient-to-r from-yellow-400 to-orange-500 mx-auto"></div>
                    </div>    
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
                        {
                            displayedProducts && displayedProducts.length > 0 ? 
                            displayedProducts.map((productItem)=>(
                                <div key={productItem._id} className="group">
                                    <ShoppingProductTile 
                                        handleGetProductDetails={handleGetProductDetails}
                                        product={productItem}
                                        handleAddtoCart={handleAddtoCart}
                                    />
                                </div>
                            ))
                            : (
                                <div className="col-span-full text-center py-12">
                                    <div className="text-gray-500 text-lg">No products available at the moment</div>
                                </div>
                            )
                        }
                    </div>
                    
                    {/* Show More Button */}
                    {hasMoreProducts && (
                        <div className="text-center mt-12">
                            <Button 
                                onClick={handleShowMore}
                                className="bg-black hover:bg-gray-800 text-white px-8 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
                            >
                                Show More Products
                            </Button>
                        </div>
                    )}                  
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 bg-gradient-to-r from-gray-900 to-gray-800">
                <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
                    <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                        Ready to Elevate Your Style?
                    </h2>
                    <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
                        Join thousands of fashion enthusiasts who trust FashionHub for their style needs
                    </p>
                    <Button 
                        onClick={() => navigate('/shop/listing')}
                        className="px-8 py-4 text-lg font-semibold bg-gradient-to-r from-yellow-400 to-orange-500 text-gray-900 hover:from-yellow-500 hover:to-orange-600 transition-all duration-300 transform hover:scale-105 shadow-xl"
                    >
                        Start Shopping Now
                    </Button>
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