
import { Card, CardContent, CardFooter } from "../ui/card";
import { Button } from "../ui/button";
import { brandOptionsMap, categoryOptionsMap } from "@/config";
import { Badge } from "../ui/badge";
import { Package, Layers } from "lucide-react";

function ShoppingProductTile({
  product,
  handleGetProductDetails,
  handleAddtoCart,
}) {
  const isOnSale = product?.salePrice > 0;
  const discountPercentage = isOnSale 
    ? Math.round(((product?.price - product?.salePrice) / product?.price) * 100)
    : 0;

  return (
    <Card className="group w-full max-w-md mx-auto bg-white border border-gray-200 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden">
      <div className="relative">
        {/* Image Container */}
        <div className="relative overflow-hidden">
          {product?.image && product.image !== '' && product.image !== 'null' ? (
            <div className="relative">
              <img
                src={product.image}
                alt={product?.title || 'Product image'}
                className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                onClick={() => handleGetProductDetails(product?._id)}
              />
              
              {/* Gradient overlay on hover */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              
              {/* Quick View button - appears on hover */}
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
            </div>
          ) : (
            <div 
              className="w-full h-64 bg-gray-100 flex items-center justify-center group-hover:bg-gray-200 transition-colors duration-300"
              onClick={() => handleGetProductDetails(product?._id)}
            >
              <div className="text-center">
                <Package className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-500 font-medium">No Image</p>
                <p className="text-xs text-gray-400">Click to view</p>
              </div>
            </div>
          )}

          {/* Sale Badge */}
          {isOnSale && (
            <div className="absolute top-3 left-3">
              <Badge className="bg-red-500 text-white font-semibold px-2 py-1">
                -{discountPercentage}%
              </Badge>
            </div>
          )}

          {/* Stock Status */}
          <div className="absolute top-3 right-3">
            <Badge 
              variant={product?.totalStock > 0 ? "default" : "destructive"}
              className="bg-black text-white"
            >
              {product?.totalStock > 0 ? "In Stock" : "Out of Stock"}
            </Badge>
          </div>
        </div>
      </div>

      <CardContent className="p-2.5">
        {/* Product Title */}
        <h2 className="text-lg font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-black transition-colors">
          {product?.title}
        </h2>

        {/* Category & Brand */}
        <div className="flex items-center gap-2 mb-3">
          <Badge variant="outline" className="text-xs px-3 py-1.5">
            {categoryOptionsMap[product?.category]}
          </Badge>
          <Badge variant="outline" className="text-xs px-3 py-1.5">
            {brandOptionsMap[product?.brand]}
          </Badge>
        </div>

        {/* Price Section */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex flex-col">
            {isOnSale ? (
              <>
                <span className="text-lg font-bold text-gray-900">
                  ${product?.salePrice}
                </span>
                <span className="text-sm text-gray-500 line-through">
                  ${product?.price}
                </span>
              </>
            ) : (
              <span className="text-lg font-bold text-gray-900">
                ${product?.price}
              </span>
            )}
          </div>
        </div>

        {/* Stock Info */}
        <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
          <Layers className="w-4 h-4" />
          <span>{product?.totalStock} in stock</span>
        </div>

        {/* Description Preview */}
        {product?.description && (
          <p className="text-sm text-gray-600 line-clamp-2 mb-3">
            {product?.description}
          </p>
        )}
      </CardContent>

      <CardFooter className="p-4 pt-0 border-t border-gray-100">
        {product?.totalStock === 0 ? (
          <Button 
            className="w-full opacity-60 cursor-not-allowed bg-gray-200 text-gray-500"
            size="sm"
            disabled
          >
            Out of Stock
          </Button>
        ) : (
          <Button
            onClick={() => handleAddtoCart(product?._id, product?.totalStock)}
            className="w-full bg-black hover:bg-gray-800 text-white font-medium"
            size="sm"
          >
            Add to Cart
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}

export default ShoppingProductTile;