import ProductDetailsDialog from "@/components/shopping-view/product-details";
import ShoppingProductTile from "@/components/shopping-view/product-tile";
import { addToCart, fetchCartItems } from "@/store/shop/cart-slice";
import { fetchProductDetails } from "@/store/shop/products-slice";
import {
  getSearchResults,
  resetSearchResults,
} from "@/store/shop/search-slice";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";
import { toast } from "sonner";

function SearchResults() {
  const [keyword, setKeyword] = useState("");
  const [openDetailsDialog, setOpenDetailsDialog] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const dispatch = useDispatch();
  const { searchResults, isLoading: searchLoading } = useSelector((state) => state.shopSearch);
  const { productDetails } = useSelector((state) => state.shopProducts);
  const { user } = useSelector((state) => state.auth);
  const { cartItems } = useSelector((state) => state.shopCart);

  // Initialize keyword from URL params
  useEffect(() => {
    const urlKeyword = searchParams.get("keyword");
    if (urlKeyword) {
      setKeyword(urlKeyword);
    }
  }, [searchParams]);

  // Handle search functionality
  useEffect(() => {
    if (keyword && keyword.trim() !== "" && keyword.trim().length >= 3) {
      console.log('Triggering search for keyword:', keyword);
      dispatch(getSearchResults(keyword));
    } else if (keyword && keyword.trim().length < 3) {
      console.log('Clearing search results for short keyword');
      dispatch(resetSearchResults());
    } else if (!keyword) {
      console.log('No search keyword, clearing search results');
      dispatch(resetSearchResults());
    }
  }, [dispatch, keyword]);

  function handleAddtoCart(getCurrentProductId, getTotalStock) {
    console.log(cartItems);
    let getCartItems = cartItems.items || [];

    if (getCartItems.length) {
      const indexOfCurrentItem = getCartItems.findIndex(
        (item) => item.productId === getCurrentProductId
      );
      if (indexOfCurrentItem > -1) {
        const getQuantity = getCartItems[indexOfCurrentItem].quantity;
        if (getQuantity + 1 > getTotalStock) {
          toast.error(`Only ${getQuantity} quantity can be added for this item`, {
            style: {
              backgroundColor: "#f87171", // red-400
              color: "white",
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
        quantity: 1,
      })
    ).then((data) => {
      if (data?.payload?.success) {
        dispatch(fetchCartItems(user?.id));
        toast.success("Product is added to cart", {
          style: {
            backgroundColor: "#4ade80", // green-400
            color: "white",
          },
        });
      }
    });
  }

  function handleGetProductDetails(getCurrentProductId) {
    console.log(getCurrentProductId);
    dispatch(fetchProductDetails(getCurrentProductId));
  }

  useEffect(() => {
    if (productDetails !== null) setOpenDetailsDialog(true);
  }, [productDetails]);

  return (
    <div className="container mx-auto md:px-6 px-4 py-8">
      {/* Search Results Header */}
      {keyword && keyword.trim().length >= 3 && (
        <div className="mb-6">
          <h2 className="text-2xl font-bold mb-2">
            Search Results for "{keyword}"
          </h2>
          <p className="text-gray-600">
            {searchResults.length} product{searchResults.length !== 1 ? 's' : ''} found
          </p>
        </div>
      )}

      {/* Loading State */}
      {searchLoading && (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Searching for "{keyword}"...</p>
        </div>
      )}

      {/* Short Keyword Message */}
      {keyword && keyword.trim().length > 0 && keyword.trim().length < 3 && (
        <div className="text-center py-12">
          <h1 className="text-xl font-semibold text-gray-600 mb-2">Type at least 3 characters to search</h1>
          <p className="text-gray-500">Keep typing to see search results</p>
        </div>
      )}

      {/* No Results */}
      {keyword && keyword.trim().length >= 3 && !searchLoading && !searchResults.length && (
        <div className="text-center py-12">
          <h1 className="text-3xl font-bold text-gray-600 mb-4">No results found!</h1>
          <p className="text-gray-500">Try searching with different keywords</p>
        </div>
      )}

      {/* Search Results */}
      {searchResults.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {searchResults.map((item) => (
            <ShoppingProductTile
              key={item._id || item.id}
              handleAddtoCart={handleAddtoCart}
              product={item}
              handleGetProductDetails={handleGetProductDetails}
            />
          ))}
        </div>
      )}

      {/* Product Details Dialog */}
      <ProductDetailsDialog
        open={openDetailsDialog}
        setOpen={setOpenDetailsDialog}
        productDetails={productDetails}
      />
    </div>
  );
}

export default SearchResults;
