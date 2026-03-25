import { Airplay, BabyIcon, ChevronLeft, ChevronRight, CloudLightning, Heater, Images, Shirt, ShirtIcon, ShoppingBasket, UmbrellaIcon, WashingMachine, WatchIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllFilteredProducts, fetchProductDetails } from '@/store/shop/products-slice';
import ShoppingProductTile from '@/components/shopping-view/product-tile';
import { useNavigate } from 'react-router-dom';
import ProductDetailsDialog from '@/components/shopping-view/product-details';
import { addToCart, fetchCartItems, addToGuestCart } from '@/store/shop/cart-slice';
import { toast } from 'sonner';
import { getFeatureImages } from '@/store/common/feature-slice';
 
const categoriesWithIcons = 
            [
            { id: "men", label: "Men" , icon : ShirtIcon, image: "/categories/men.png" },
            { id: "women", label: "Women",icon:CloudLightning, image: "/categories/women.png" },
            { id: "kids", label: "Kids" , icon: BabyIcon, image: "/categories/kids.png" },
            { id: "accessories", label: "Accessories", icon: WatchIcon, image: "/categories/accessories.png" },
            { id: "footwear", label: "Footwear", icon: UmbrellaIcon, image: "/categories/footwear.png" },
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
    const { cartItems, guestCartItems } = useSelector((state) => state.shopCart);
    const { isAuthenticated } = useSelector((state) => state.auth);

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

    function handleAddtoCart(getCurrentProductId, getTotalStock) {
        let getItems = isAuthenticated ? (cartItems?.items || []) : guestCartItems;

        if (getItems.length) {
            const indexOfCurrentItem = getItems.findIndex(
                (item) => item.productId === getCurrentProductId
            );

            if (indexOfCurrentItem > -1) {
                const getQuantity = getItems[indexOfCurrentItem].quantity;
                if (getQuantity + 1 > getTotalStock) {
                    toast.error(`Only ${getQuantity} can be added for this item`, {
                        style: {
                            background: "white",
                            color: "red",
                        },
                    });
                    return;
                }
            }
        }

        if (isAuthenticated) {
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
        } else {
            dispatch(
                addToGuestCart({
                    productId: getCurrentProductId,
                    quantity: 1,
                })
            );
            toast.success("Product added to guest cart");
        }
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
            {/* Hero Section */}
            <div className="relative w-full h-[85vh] overflow-hidden bg-gray-900">
                {/* Background Slider */}
                <div className="absolute inset-0 z-0">
                    {featureImageList && featureImageList.length > 0 ? featureImageList.map((slide, index) => (
                        <div 
                            key={index} 
                            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${index === currentSlide ? 'opacity-100' : 'opacity-0'}`}
                        >
                            <img 
                                src={slide?.image} 
                                className="w-full h-full object-cover brightness-[0.75]"
                                alt={`Hero slide ${index + 1}`}
                            />
                            <div className="absolute inset-0 bg-black/40"></div>
                        </div>
                    )) : null}
                </div>

                {/* Hero Content - Professional Core */}
                <div className="relative z-10 h-full max-w-7xl mx-auto flex items-center px-6 sm:px-12">
                    <div className="w-full max-w-3xl space-y-10 animate-fade-up">
                        <div className="space-y-4">
                            <span className="inline-block px-3 py-1 bg-yellow-400 text-black text-[10px] font-bold tracking-[0.3em] uppercase rounded-sm">
                                New Season 2026
                            </span>
                            <h1 className="text-6xl md:text-8xl font-bold text-white leading-tight tracking-tight">
                                Timeless <br /> 
                                <span className="text-yellow-400">Excellence</span>
                            </h1>
                            <p className="text-lg md:text-xl text-gray-200 leading-relaxed font-normal max-w-xl">
                                Elevate your everyday with our curated collection of premium essentials. 
                                Designed for durability, crafted for style.
                            </p>
                        </div>

                        <div className="flex flex-wrap gap-5">
                            <Button 
                                onClick={() => {
                                    document.getElementById('categories-section')?.scrollIntoView({ 
                                        behavior: 'smooth',
                                        block: 'start'
                                    });
                                }}
                                className="px-10 py-7 text-lg font-bold bg-white text-black hover:bg-yellow-400 transition-colors rounded-md"
                            >
                                Shop Collection
                            </Button>
                            
                            <Button 
                                variant="outline"
                                onClick={() => navigate('/shop/listing')}
                                className="px-10 py-7 text-lg font-bold border-white/30 text-white hover:bg-white/10 backdrop-blur-md rounded-md transition-colors"
                            >
                                View Lookbook
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Refined Navigation & Progress */}
                <div className="absolute bottom-12 left-0 w-full z-20 px-8 md:px-12 flex justify-between items-end">
                    
                    {/* Slide Selector Buttons */}
                    <div className="flex gap-2">
                        {featureImageList.map((_, index) => (
                            <button
                                key={index}
                                onClick={() => setCurrentSlide(index)}
                                className={`h-1.5 transition-all duration-300 rounded-full ${index === currentSlide ? 'w-12 bg-yellow-400' : 'w-4 bg-white/20'}`}
                                aria-label={`Go to slide ${index + 1}`}
                            />
                        ))}
                    </div>

                    {/* Minimal Controls */}
                    <div className="flex items-center gap-4">
                        <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={() => setCurrentSlide(prevSlide=>(prevSlide - 1 + featureImageList.length) % featureImageList.length)}
                            className="bg-black/20 hover:bg-white text-white hover:text-black h-12 w-12 rounded-full border border-white/10"
                        >
                            <ChevronLeft className='w-5 h-5' />
                        </Button>
                        <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={() => setCurrentSlide(prevSlide=>(prevSlide + 1) % featureImageList.length)}
                            className="bg-black/20 hover:bg-white text-white hover:text-black h-12 w-12 rounded-full border border-white/10"
                        >
                            <ChevronRight className='w-5 h-5' />
                        </Button>
                    </div>
                </div>
            </div>

            {/* Categories Section */}
            <section id="categories-section" className="py-32 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
                        <div className="max-w-2xl">
                            <span className="text-yellow-600 font-bold tracking-widest uppercase text-sm mb-4 block">Our Collections</span>
                            <h2 className="text-5xl md:text-6xl font-black text-gray-900 leading-tight">
                                Shop by <span className="text-transparent bg-clip-text bg-gradient-to-r from-gray-900 via-gray-700 to-gray-500">Essential</span> Category
                            </h2>
                        </div>
                        <p className="text-xl text-gray-500 max-w-sm mb-2">
                            Curated pieces that blend timeless elegance with contemporary trends.
                        </p>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-6 h-[800px] md:h-[600px]">
                        {/* Men Category - Large */}
                        <div 
                            onClick={() => handleNavigateToListingPage(categoriesWithIcons[0],'category')}
                            className="md:col-span-4 relative group cursor-pointer overflow-hidden rounded-3xl"
                        >
                            <img src={categoriesWithIcons[0].image} alt="Men" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                            <div className="absolute bottom-8 left-8">
                                <h3 className="text-3xl font-bold text-white mb-2">{categoriesWithIcons[0].label}</h3>
                                <span className="text-white/60 text-sm tracking-widest uppercase group-hover:text-yellow-400 transition-colors">Explore Now →</span>
                            </div>
                        </div>

                        {/* Middle Column */}
                        <div className="md:col-span-4 grid grid-rows-2 gap-6">
                            {/* Women */}
                            <div 
                                onClick={() => handleNavigateToListingPage(categoriesWithIcons[1],'category')}
                                className="relative group cursor-pointer overflow-hidden rounded-3xl"
                            >
                                <img src={categoriesWithIcons[1].image} alt="Women" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                                <div className="absolute bottom-6 left-6">
                                    <h3 className="text-2xl font-bold text-white mb-1">{categoriesWithIcons[1].label}</h3>
                                    <span className="text-white/60 text-xs tracking-widest uppercase group-hover:text-yellow-400 transition-colors">Shop Now →</span>
                                </div>
                            </div>
                            {/* Kids */}
                            <div 
                                onClick={() => handleNavigateToListingPage(categoriesWithIcons[2],'category')}
                                className="relative group cursor-pointer overflow-hidden rounded-3xl"
                            >
                                <img src={categoriesWithIcons[2].image} alt="Kids" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                                <div className="absolute bottom-6 left-6">
                                    <h3 className="text-2xl font-bold text-white mb-1">{categoriesWithIcons[2].label}</h3>
                                    <span className="text-white/60 text-xs tracking-widest uppercase group-hover:text-yellow-400 transition-colors">Shop Now →</span>
                                </div>
                            </div>
                        </div>

                        {/* Last Column */}
                        <div className="md:col-span-4 grid grid-rows-2 gap-6">
                            {/* Accessories */}
                            <div 
                                onClick={() => handleNavigateToListingPage(categoriesWithIcons[3],'category')}
                                className="relative group cursor-pointer overflow-hidden rounded-3xl"
                            >
                                <img src={categoriesWithIcons[3].image} alt="Accessories" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                                <div className="absolute bottom-6 left-6">
                                    <h3 className="text-2xl font-bold text-white mb-1">{categoriesWithIcons[3].label}</h3>
                                    <span className="text-white/60 text-xs tracking-widest uppercase group-hover:text-yellow-400 transition-colors">Shop Now →</span>
                                </div>
                            </div>
                            {/* Footwear */}
                            <div 
                                onClick={() => handleNavigateToListingPage(categoriesWithIcons[4],'category')}
                                className="relative group cursor-pointer overflow-hidden rounded-3xl"
                            >
                                <img src={categoriesWithIcons[4].image} alt="Footwear" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                                <div className="absolute bottom-6 left-6">
                                    <h3 className="text-2xl font-bold text-white mb-1">{categoriesWithIcons[4].label}</h3>
                                    <span className="text-white/60 text-xs tracking-widest uppercase group-hover:text-yellow-400 transition-colors">Shop Now →</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Brands Section - Minimalist Scroller */}
            <section className="py-24 bg-gray-50 overflow-hidden">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <span className="text-xs font-bold tracking-[0.4em] uppercase text-gray-400 mb-4 block">Trusted Partners</span>
                        <h2 className="text-3xl font-bold text-gray-900">The Powerhouse Brands</h2>
                    </div>
                    
                    <div className="flex flex-wrap justify-center items-center gap-12 md:gap-20">
                        {
                            brandsWithIcon.map((brandItem)=> 
                            <div 
                                key={brandItem.id} 
                                onClick={() => handleNavigateToListingPage(brandItem,'brand')} 
                                className="group cursor-pointer flex flex-col items-center grayscale hover:grayscale-0 transition-all duration-500 transform hover:scale-110"
                            >
                                <brandItem.icon className="w-12 h-12 text-gray-400 group-hover:text-gray-900 mb-2 transition-colors" />
                                <span className="text-xs font-bold tracking-widest uppercase text-gray-400 group-hover:text-gray-900 transition-colors">
                                    {brandItem.label}
                                </span>
                            </div>)
                        }
                    </div>
                </div>
            </section>

            {/* Editorial / Shop the Look Section */}
            <section className="py-32 bg-gray-900 text-white overflow-hidden">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                        <div className="relative group">
                            <div className="absolute -inset-4 bg-yellow-400/20 rounded-3xl blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                            <img 
                                src="/categories/women.png" 
                                alt="Shop the Look" 
                                className="relative rounded-3xl shadow-2xl w-full object-cover aspect-[4/5] transform group-hover:scale-[1.02] transition-transform duration-700" 
                            />
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center">
                                <Button className="w-20 h-20 rounded-full bg-white text-black hover:bg-yellow-400 transform hover:scale-110 transition-all shadow-xl">
                                    <ShoppingBasket className="w-8 h-8" />
                                </Button>
                            </div>
                        </div>
                        <div className="space-y-8">
                            <span className="text-yellow-400 font-bold tracking-[0.4em] uppercase text-sm block">Editorial Focus</span>
                            <h2 className="text-5xl md:text-7xl font-black leading-tight">
                                Shop the <br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500 italic font-serif py-2">Signature</span> Look
                            </h2>
                            <p className="text-xl text-gray-400 leading-relaxed max-w-lg">
                                Each season, our stylists curate the perfect outfits that blend our latest arrivals into cohesive, trend-setting ensembles. Shop this curated look and redefine your wardrobe essentials.
                            </p>
                            <div className="pt-8">
                                <Button 
                                    onClick={() => navigate('/shop/listing')}
                                    className="px-10 py-8 text-xl font-bold bg-white text-black hover:bg-yellow-400 rounded-2xl transition-all transform hover:-translate-y-1 shadow-lg"
                                >
                                    Browse the Collection
                                </Button>
                            </div>
                            
                            <div className="grid grid-cols-2 gap-8 pt-12">
                                <div className="space-y-2">
                                    <span className="text-4xl font-black text-white">01</span>
                                    <p className="text-gray-500 text-sm tracking-widest uppercase">Premium Fabrics</p>
                                </div>
                                <div className="space-y-2">
                                    <span className="text-4xl font-black text-white">02</span>
                                    <p className="text-gray-500 text-sm tracking-widest uppercase">Ethical Sourcing</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Featured Products Section */}
            <section className='py-32 bg-white'>
                <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-20">
                    <div className="flex flex-col items-center text-center mb-20">
                        <span className="text-yellow-600 font-bold tracking-[0.4em] uppercase text-xs mb-4 block">New Arrivals</span>
                        <h2 className="text-5xl md:text-6xl font-black text-gray-900 mb-6">
                            Trending <span className="text-transparent bg-clip-text bg-gradient-to-r from-gray-900 to-gray-500">Collections</span>
                        </h2>
                        <p className="text-xl text-gray-500 max-w-2xl mx-auto mb-8">
                            Handpicked items that define the latest trends in global fashion.
                        </p>
                        <div className="w-20 h-1.5 bg-yellow-400 rounded-full"></div>
                    </div>    
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8">
                        {
                            displayedProducts && displayedProducts.length > 0 ? 
                            displayedProducts.map((productItem)=>(
                                <div key={productItem._id} className="group transform transition-all duration-500 hover:-translate-y-2">
                                    <ShoppingProductTile 
                                        handleGetProductDetails={handleGetProductDetails}
                                        product={productItem}
                                        handleAddtoCart={handleAddtoCart}
                                    />
                                </div>
                            ))
                            : (
                                <div className="col-span-full text-center py-20 bg-gray-50 rounded-3xl">
                                    <ShoppingBasket className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                                    <div className="text-gray-500 text-xl font-medium">Curating your selection...</div>
                                </div>
                            )
                        }
                    </div>
                    
                    {/* Show More Button */}
                    {hasMoreProducts && (
                        <div className="text-center mt-20">
                            <Button 
                                onClick={handleShowMore}
                                className="bg-black hover:bg-yellow-400 hover:text-black text-white px-12 py-7 rounded-2xl font-bold text-lg shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
                            >
                                Discover More Products
                            </Button>
                        </div>
                    )}                  
                </div>
            </section>

            {/* CTA Section - Sophisticated Banner */}
            <section className="py-32 bg-black relative overflow-hidden">
                <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-yellow-400/10 to-transparent pointer-events-none"></div>
                <div className="absolute bottom-0 left-0 w-1/3 h-1/2 bg-gradient-to-tr from-white/5 to-transparent pointer-events-none"></div>
                
                <div className="max-w-7xl mx-auto text-center px-4 sm:px-6 lg:px-8 relative z-10">
                    <h2 className="text-5xl md:text-7xl font-black text-white mb-8 tracking-tighter">
                        Elevate Your <span className="text-yellow-400">Identity.</span>
                    </h2>
                    <p className="text-xl md:text-2xl text-gray-400 mb-12 max-w-3xl mx-auto font-light leading-relaxed">
                        Join the FashionHub circle and get early access to limited drops, exclusive events, and personalized styling advice.
                    </p>
                    <div className="flex flex-wrap justify-center gap-6">
                        <Button 
                            onClick={() => navigate('/shop/listing')}
                            className="px-12 py-8 text-xl font-bold bg-white text-black hover:bg-yellow-400 transition-all duration-300 transform hover:scale-105 rounded-2xl shadow-2xl"
                        >
                            Start Shopping Now
                        </Button>
                        <Button 
                            variant="outline"
                            className="px-12 py-8 text-xl font-bold border-white/20 text-white hover:bg-white/10 rounded-2xl transition-all"
                        >
                            Join Member Club
                        </Button>
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