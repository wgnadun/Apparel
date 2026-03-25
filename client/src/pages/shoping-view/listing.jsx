import ProductFilter from "@/components/shopping-view/filter";
import ProductDetailsDialog from "@/components/shopping-view/product-details";
import ShoppingProductTile from "@/components/shopping-view/product-tile";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { sortOptions } from "@/config";
import { addToCart, fetchCartItems, addToGuestCart } from "@/store/shop/cart-slice";
import {
  fetchAllFilteredProducts,
  fetchProductDetails,
} from "@/store/shop/products-slice";
import { ArrowUpDownIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";
import { toast } from "sonner";

function createSearchParamsHelper(filterParams) {
  const queryParams = [];

  for (const [key, value] of Object.entries(filterParams)) {
    if (Array.isArray(value) && value.length > 0) {
      const paramValue = value.join(",");
      // Don't double-encode, just join with commas
      queryParams.push(`${key}=${paramValue}`);
    }
  }

  console.log(queryParams, "queryParams");

  return queryParams.join("&");
}

function ShoppingListing() {
  const dispatch = useDispatch();
  const { productList, productDetails } = useSelector(
    (state) => state.shopProducts
  );
  const { cartItems } = useSelector((state) => state.shopCart);
  const { user } = useSelector((state) => state.auth);
  const [filters, setFilters] = useState({});
  const [sort, setSort] = useState(null);
  const [searchParams, setSearchParams] = useSearchParams();
  const [openDetailsDialog, setOpenDetailsDialog] = useState(false);

  const categorySearchParam = searchParams.get("category");

  function handleSort(value) {
    setSort(value);
  }

  function handleFilter(getSectionId, getCurrentOption) {
    console.log('handleFilter called:', { getSectionId, getCurrentOption, currentFilters: filters });
    
    // Create a deep copy of filters to avoid reference issues
    let cpyFilters = JSON.parse(JSON.stringify(filters || {}));
    const indexOfCurrentSection = Object.keys(cpyFilters).indexOf(getSectionId);

    if (indexOfCurrentSection === -1) {
      console.log('Creating new filter section:', getSectionId);
      cpyFilters[getSectionId] = [getCurrentOption];
    } else {
      console.log('Updating existing filter section:', getSectionId, 'current options:', cpyFilters[getSectionId]);
      
      // Ensure the section exists and is an array
      if (!Array.isArray(cpyFilters[getSectionId])) {
        cpyFilters[getSectionId] = [];
      }
      
      const indexOfCurrentOption = cpyFilters[getSectionId].indexOf(getCurrentOption);

      if (indexOfCurrentOption === -1) {
        console.log('Adding option:', getCurrentOption);
        cpyFilters[getSectionId] = [...cpyFilters[getSectionId], getCurrentOption];
      } else {
        console.log('Removing option:', getCurrentOption);
        cpyFilters[getSectionId] = cpyFilters[getSectionId].filter(option => option !== getCurrentOption);
      }
    }

    console.log('Final filters after update:', cpyFilters);
    setFilters(cpyFilters);
    sessionStorage.setItem("filters", JSON.stringify(cpyFilters));
  }

  function handleGetProductDetails(getCurrentProductId) {
    console.log(getCurrentProductId);
    dispatch(fetchProductDetails(getCurrentProductId));
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
          toast.error(`Only ${getQuantity} quantity can be added for this item`, {
            style: {
              backgroundColor: "#f87171",
              color: "white",
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
          quantity: 1,
        })
      ).then((data) => {
        if (data?.payload?.success) {
          dispatch(fetchCartItems(user?.id));
          toast.success("Product is added to cart", {
            style: {
              backgroundColor: "#4ade80",
              color: "white",
            },
          });
        }
      });
    } else {
      dispatch(
        addToGuestCart({
          productId: getCurrentProductId,
          quantity: 1,
        })
      );
      toast.success("Product added to guest cart", {
        style: {
          backgroundColor: "#4ade80",
          color: "white",
        },
      });
    }
  }

  useEffect(() => {
    console.log('Initializing filters, categorySearchParam:', categorySearchParam);
    setSort("price-lowtohigh");
    
    // Get filters from session storage or initialize empty
    let initialFilters = JSON.parse(sessionStorage.getItem("filters")) || {};
    console.log('Initial filters from session storage:', initialFilters);
    
    // If there's a category in URL params, parse it properly
    if (categorySearchParam) {
      console.log('Setting category filter from URL param:', categorySearchParam);
      // Handle comma-separated categories from URL
      const categories = categorySearchParam.split(',').map(cat => cat.trim());
      initialFilters = {
        ...initialFilters,
        category: categories
      };
      // Update session storage with the category filter
      sessionStorage.setItem("filters", JSON.stringify(initialFilters));
    }
    
    console.log('Final initial filters:', initialFilters);
    setFilters(initialFilters);
  }, [categorySearchParam]);

  // Listen for filter changes from header navigation
  useEffect(() => {
    const handleFiltersChanged = (event) => {
      console.log('Received filtersChanged event:', event.detail);
      const newFilters = event.detail.filters;
      if (newFilters) {
        setFilters(newFilters);
        sessionStorage.setItem("filters", JSON.stringify(newFilters));
      } else {
        setFilters({});
        sessionStorage.removeItem("filters");
      }
    };

    window.addEventListener('filtersChanged', handleFiltersChanged);
    
    return () => {
      window.removeEventListener('filtersChanged', handleFiltersChanged);
    };
  }, []);

  useEffect(() => {
    console.log('URL params effect triggered, filters:', filters);
    if (filters && Object.keys(filters).length > 0) {
      const createQueryString = createSearchParamsHelper(filters);
      console.log('Creating query string:', createQueryString);
      
      // Only update URL params if they're different to prevent circular updates
      const currentParams = new URLSearchParams(createQueryString);
      const existingParams = new URLSearchParams(window.location.search);
      
      if (currentParams.toString() !== existingParams.toString()) {
        setSearchParams(currentParams);
      }
    } else {
      console.log('No filters or empty filters, clearing URL params');
      const existingParams = new URLSearchParams(window.location.search);
      if (existingParams.toString() !== '') {
        setSearchParams(new URLSearchParams());
      }
    }
  }, [filters]);

  useEffect(() => {
    console.log('Fetch products effect triggered, filters:', filters, 'sort:', sort);
    if (filters !== null && sort !== null)
      dispatch(
        fetchAllFilteredProducts({ filterParams: filters, sortParams: sort })
      );
  }, [dispatch, sort, filters]);

  useEffect(() => {
    if (productDetails !== null) setOpenDetailsDialog(true);
  }, [productDetails]);

  console.log(productList, "productListproductListproductList");

  return (
    <div className="grid grid-cols-1 md:grid-cols-[250px_1fr] gap-12 p-4 md:p-12 bg-white min-h-screen">
      <div className="hidden md:block sticky top-28 h-fit">
        <ProductFilter filters={filters} handleFilter={handleFilter} />
      </div>
      <div className="w-full">
        <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-8 border-b border-gray-100 pb-10">
          <div className="space-y-2">
            <h2 className="text-5xl font-black text-gray-900 tracking-tighter uppercase leading-none">
              The <span className="text-yellow-500 italic font-serif normal-case">Signature</span> <br />
              Collection
            </h2>
            <p className="text-xs text-gray-400 font-black tracking-[0.3em] uppercase">
              {productList?.length || 0} Curated Masterpieces
            </p>
          </div>
          
          <div className="flex items-center gap-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="flex items-center gap-3 bg-gray-50 hover:bg-black hover:text-white rounded-2xl px-8 py-8 transition-all duration-500 font-black tracking-widest text-xs uppercase shadow-sm active:scale-95"
                >
                  <ArrowUpDownIcon className="h-4 w-4" />
                  Sort Style
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-[240px] rounded-3xl p-3 border-white/20 shadow-2xl backdrop-blur-2xl bg-white/80 animate-in fade-in slide-in-from-top-4 duration-300">
                <DropdownMenuRadioGroup value={sort} onValueChange={handleSort}>
                  {sortOptions.map((sortItem) => (
                    <DropdownMenuRadioItem
                      value={sortItem.id}
                      key={sortItem.id}
                      className="rounded-2xl py-4 px-5 focus:bg-yellow-400 focus:text-black font-bold text-sm cursor-pointer transition-colors"
                    >
                      {sortItem.label}
                    </DropdownMenuRadioItem>
                  ))}
                </DropdownMenuRadioGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-8 gap-y-16">
          {productList && productList.length > 0
            ? productList.map((productItem) => (
                <div key={productItem._id} className="animate-in fade-in slide-in-from-bottom-8 duration-1000">
                    <ShoppingProductTile
                      handleGetProductDetails={handleGetProductDetails}
                      product={productItem}
                      handleAddtoCart={handleAddtoCart}
                    />
                </div>
              ))
            : (
                <div className="col-span-full py-40 text-center bg-gray-50 rounded-[40px] border border-dashed border-gray-200">
                    <p className="text-gray-400 font-bold uppercase tracking-[0.2em] text-sm">No items found for your selection</p>
                </div>
            )}
        </div>
      </div>
      <ProductDetailsDialog
        open={openDetailsDialog}
        setOpen={setOpenDetailsDialog}
        productDetails={productDetails}
      />
    </div>
  );
}

export default ShoppingListing;