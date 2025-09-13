
import { Card, CardContent, CardFooter } from "../ui/card";
import { Button } from "../ui/button";
import { brandOptionsMap, categoryOptionsMap } from "@/config";
import { Badge } from "../ui/badge";

function ShoppingProductTile({
  product,
  handleGetProductDetails,
  handleAddtoCart,
}) {
  return (
    <Card className="w-full max-w-md mx-auto group cursor-pointer overflow-hidden bg-white border-0 shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 rounded-2xl">
      {/* Image container with premium hover effects */}
      <div 
        className="relative overflow-hidden rounded-t-2xl"
        onClick={() => handleGetProductDetails(product?._id)}
      >
        <img
          src={product?.image}
          alt={product?.title}
          className="w-full h-[450px] object-cover transition-all duration-700 group-hover:scale-110"
        />
        
        {/* Gradient overlay on hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        
        {/* Quick Shop button - premium styling */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500">
          <Button 
            className="bg-white/95 backdrop-blur-md text-gray-900 hover:bg-white font-semibold px-8 py-3 rounded-full shadow-xl transform translate-y-6 group-hover:translate-y-0 transition-all duration-500 border-0"
            onClick={(e) => {
              e.stopPropagation();
              handleGetProductDetails(product?._id);
            }}
          >
            Quick View
          </Button>
        </div>

        {/* Premium badges */}
        {product?.totalStock === 0 ? (
          <Badge className="absolute top-4 left-4 bg-red-500 hover:bg-red-600 text-white font-semibold px-3 py-1 rounded-full shadow-lg">
            Out Of Stock
          </Badge>
        ) : product?.totalStock < 10 ? (
          <Badge className="absolute top-4 left-4 bg-orange-500 hover:bg-orange-600 text-white font-semibold px-3 py-1 rounded-full shadow-lg">
            {`Only ${product?.totalStock} left`}
          </Badge>
        ) : product?.salePrice > 0 ? (
          <Badge className="absolute top-4 left-4 bg-gradient-to-r from-red-500 to-pink-500 text-white font-bold px-4 py-1 rounded-full shadow-lg">
            SALE
          </Badge>
        ) : null}

        {/* Wishlist button */}
        <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <Button 
            size="icon"
            className="h-10 w-10 rounded-full bg-white/90 backdrop-blur-md hover:bg-white shadow-lg border-0"
            onClick={(e) => {
              e.stopPropagation();
              // Add wishlist functionality here
            }}
          >
            <svg className="h-5 w-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </Button>
        </div>
      </div>

      {/* Product details - premium typography */}
      <CardContent className="p-6 space-y-3">
        <h2 className="text-2xl font-bold text-gray-900 line-clamp-2 leading-tight">
          {product?.title}
        </h2>
        
        {/* Category and Brand - elegant styling */}
        <div className="flex justify-between items-center text-base">
          <span className="text-gray-500 font-medium bg-gray-100 px-3 py-1 rounded-full">
            {categoryOptionsMap[product?.category]}
          </span>
          <span className="text-gray-600 font-semibold">
            {brandOptionsMap[product?.brand]}
          </span>
        </div>
        
        {/* Price - premium layout */}
        <div className="flex items-center space-x-3">
          <span
            className={`${
              product?.salePrice > 0 ? "line-through text-gray-400 text-xl" : "text-3xl font-bold text-gray-900"
            }`}
          >
            ${product?.price}
          </span>
          {product?.salePrice > 0 && (
            <span className="text-3xl font-bold text-gray-900">
              ${product?.salePrice}
            </span>
          )}
        </div>
      </CardContent>

      {/* Footer with premium Add to Cart button */}
      <CardFooter className="p-6 pt-0">
        {product?.totalStock === 0 ? (
          <Button className="w-full h-14 opacity-60 cursor-not-allowed bg-gray-200 text-gray-500 rounded-xl font-semibold">
            Out Of Stock
          </Button>
        ) : (
          <Button
            onClick={() => handleAddtoCart(product?._id, product?.totalStock)}
            className="w-full h-12 bg-gradient-to-r from-gray-900 to-gray-800 hover:from-gray-800 hover:to-gray-700 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
          >
            Add to Cart
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}

export default ShoppingProductTile;