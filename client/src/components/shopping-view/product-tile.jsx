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
    <Card className="w-full max-w-sm mx-auto group cursor-pointer overflow-hidden">
      {/* Image container with hover effects */}
      <div 
        className="relative "
        onClick={() => handleGetProductDetails(product?._id)}
      >
        <img
          src={product?.image}
          alt={product?.title}
          className="w-full h-[350px] object-cover transition-all duration-300 group-hover:backdrop-blur-xs group-hover:scale-105"
        />
        
        {/* Quick Shop button - appears on hover */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 ">
          <Button 
            className="bg-white text-black hover:bg-gray-100 font-medium px-6 py-2 rounded-full shadow-lg transform translate-y-4 group-hover:translate-y-0 transition-all duration-300"
            onClick={(e) => {
              e.stopPropagation(); // Prevent triggering the parent onClick
              handleGetProductDetails(product?._id);
            }}
          >
            Quick Shop
          </Button>
        </div>

        {/* Stock/Sale badges */}
        {product?.totalStock === 0 ? (
          <Badge className="absolute top-2 left-2 bg-red-500 hover:bg-red-600">
            Out Of Stock
          </Badge>
        ) : product?.totalStock < 10 ? (
          <Badge className="absolute top-2 left-2 bg-red-500 hover:bg-red-600">
            {`Only ${product?.totalStock} items left`}
          </Badge>
        ) : product?.salePrice > 0 ? (
          <Badge className="absolute top-2 left-2 bg-red-500 hover:bg-red-600">
            Sale
          </Badge>
        ) : null}
      </div>

      {/* Product details - minimalistic design */}
      <CardContent className="p-4 space-y-2">
        <h2 className="text-lg font-medium text-gray-900 line-clamp-1">
          {product?.title}
        </h2>
        
        {/* Category and Brand - subtle styling */}
        <div className="flex justify-between items-center text-sm text-gray-500">
          <span>{categoryOptionsMap[product?.category]}</span>
          <span>{brandOptionsMap[product?.brand]}</span>
        </div>
        
        {/* Price - clean layout */}
        <div className="flex items-center space-x-2">
          <span
            className={`${
              product?.salePrice > 0 ? "line-through text-gray-400 text-sm" : "text-lg font-semibold text-gray-900"
            }`}
          >
            ${product?.price}
          </span>
          {product?.salePrice > 0 && (
            <span className="text-lg font-semibold text-gray-900">
              ${product?.salePrice}
            </span>
          )}
        </div>
      </CardContent>

      {/* Footer with Add to Cart button */}
      <CardFooter className="p-4 pt-0">
        {product?.totalStock === 0 ? (
          <Button className="w-full opacity-60 cursor-not-allowed bg-gray-200 text-gray-500">
            Out Of Stock
          </Button>
        ) : (
          <Button
            onClick={() => handleAddtoCart(product?._id, product?.totalStock)}
            className="w-full bg-black hover:bg-gray-800 text-white font-medium py-2"
          >
            Add to cart
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}

export default ShoppingProductTile;