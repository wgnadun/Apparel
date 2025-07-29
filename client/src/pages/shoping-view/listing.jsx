import ProductFilter from "@/components/shopping-view/filter";
import ProductDetailsDialog from "@/components/shopping-view/product-details";
import ShoppingProductTile from "@/components/shopping-view/product-tile";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuRadioGroup, DropdownMenuRadioItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { sortOptions } from "@/config";
import { addToCart, fetchCartItems } from "@/store/shop/cart-slice";
import { fetchAllFilteredProducts, fetchProductDetails } from "@/store/shop/products-slice";
import { ArrowUpDownIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";


function createSearchParamsHelper(filterParams) {
    const queryParams=[];
    for(const[key,value] of Object.entries(filterParams)){
        if(Array.isArray(value) && value.length > 0){
            const paramValue = value.join(',');

            queryParams.push(`${key}=${encodeURIComponent(paramValue)}`)

        }
    }
    return queryParams.join('&')
}

function ShoppingListing() {

    const {user} =  useSelector(state => state.auth);
    const dispatch = useDispatch();
    const {productList,productDetails} = useSelector(state=> state.shopProducts);
    const [filters,setfilters] = useState({});
    const [sort,setSort] = useState(null);
    const [searchParams,setSearchParams] = useSearchParams();
    const [openDetailsDialog,setOpenDetailsDialog] = useState(false);

    function handleSort(value) {
        console.log(value);
        setSort(value);
    }

    function handleFilter(getSectionId,getCurrentOption) {
                console.log(getSectionId,getCurrentOption);
        
        let copyFilters = {... filters};
        const indexOfCurrentSection = Object.keys(copyFilters).indexOf(getSectionId);

        if(indexOfCurrentSection === -1){
            copyFilters = {
                ...copyFilters,
                [getSectionId]: [getCurrentOption]
            }
        } else {
            const indexOfCurrentOption = copyFilters[getSectionId].indexOf(getCurrentOption);
            if(indexOfCurrentOption === -1 ) copyFilters[getSectionId].push(getCurrentOption)
                else copyFilters[getSectionId].splice(indexOfCurrentOption, 1);
        }
        setfilters(copyFilters);
        sessionStorage.setItem('filters' , JSON.stringify(copyFilters));
    }

    function handleGetProductDetails(getCurrentProductId) {
            console.log(getCurrentProductId);
            dispatch(fetchProductDetails(getCurrentProductId))
     }

     function handleAddtoCart(getCurrentProductId) {
        console.log(getCurrentProductId);
        dispatch(addToCart({
            userId:user?.id, 
            productId:getCurrentProductId, 
            quantity:1})
        ).then(data=> {
            if(data?.payload?.success){
                dispatch(fetchCartItems(user?.id));
            }
        })
     }


    useEffect(()=>{
        setSort('price-lowtohigh');
        setfilters(JSON.parse(sessionStorage.getItem('filters')) || {});
    },[])

    useEffect(()=>{
        if(filters !== null && sort !== null)
        dispatch(fetchAllFilteredProducts({filterParams: filters ,sortParams : sort}));
    },[dispatch,sort,filters])

    useEffect(()=>{
        if(filters && Object.keys(filters).length > 0){
            const createQueryString =  createSearchParamsHelper(filters);
            setSearchParams(new URLSearchParams(createQueryString));
        }
    },[filters])

    useEffect(()=>{
        if(productDetails !==null) setOpenDetailsDialog(true)
    },[productDetails])
    
    return(
        <div className="grid grid-cols-1 md:grid-cols-[200px_1fr] gap-6 p-4 md:p-6">
            <ProductFilter filters={filters} handleFilter={handleFilter}/>
            <div className="bg-background w-full rounded-lg shadow-sm">
                <ProductDetailsDialog open={openDetailsDialog} setOpen={setOpenDetailsDialog} productDetails={productDetails}/>
                <div className="p-4 border-b flex  items-center justify-between">
                    <h2 className="text-lg font-extrabold">All Products</h2>
                    <div className="flex items-center gap-3">
                        <span className="text-muted-foreground">
                            {productList.length}
                        </span>

                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" size="sm" className={"flex items-center gap-1"}>
                                <ArrowUpDownIcon className="h-4 w-4" />
                                <span className="sr-only">Sort by</span>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align = "end" className="w-[200px]">
                            <DropdownMenuRadioGroup value={sort} onValueChange ={handleSort}> 
                                {
                                    sortOptions.map(sortItem => <DropdownMenuRadioItem value={sortItem.id} key={sortItem.id}>{sortItem.label}</DropdownMenuRadioItem>)
                                }
                            </DropdownMenuRadioGroup>
                        </DropdownMenuContent>
                    </DropdownMenu>
                    </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4  gap-4">
                                {
                                    productList && productList.length > 0 ?
                                    productList.map(productItem => <ShoppingProductTile 
                                        handleGetProductDetails={handleGetProductDetails}
                                        key={productItem.id} 
                                        product={productItem}
                                        handleAddtoCart={handleAddtoCart}
                                        />) :null
                                }
                </div>
            </div>
        </div>
    );
    
}

export default ShoppingListing;