import { Card, CardContent } from "../ui/card";
import { Button } from "../ui/button";
import { brandOptionsMap, categoryOptionsMap } from "@/config";
import { Badge } from "../ui/badge";
import { ShoppingBag, Eye, Star } from "lucide-react";

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
    <Card 
      className="group relative w-full max-w-sm mx-auto bg-white border-0 shadow-none hover:shadow-2xl transition-all duration-700 overflow-hidden rounded-3xl"
    >
      <div 
        className="relative aspect-[4/5] overflow-hidden cursor-pointer bg-gray-50"
        onClick={() => handleGetProductDetails(product?._id)}
      >
        {/* Product Image */}
        {product?.image && product.image !== '' && product.image !== 'null' ? (
          <img
            src={product.image}
            alt={product?.title}
            className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-300">
            <ShoppingBag className="w-12 h-12" />
          </div>
        )}

        {/* Hover Overlays */}
        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        
        {/* Action Buttons on Hover */}
        <div className="absolute bottom-6 left-0 right-0 px-6 translate-y-12 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 flex gap-3">
          <Button
            onClick={(e) => {
              e.stopPropagation();
              handleGetProductDetails(product?._id);
            }}
            size="lg"
            className="flex-1 bg-white/90 backdrop-blur-md text-black hover:bg-white rounded-2xl border-0 shadow-xl font-bold py-6"
          >
            <Eye className="w-4 h-4 mr-2" />
            View Detail
          </Button>
          <Button
            onClick={(e) => {
              e.stopPropagation();
              handleAddtoCart(product?._id, product?.totalStock);
            }}
            disabled={product?.totalStock === 0}
            size="icon"
            className="h-14 w-14 bg-yellow-400 text-black hover:bg-yellow-500 rounded-2xl border-0 shadow-xl transition-all active:scale-95"
          >
            <ShoppingBag className="w-6 h-6" />
          </Button>
        </div>

        {/* Badges */}
        <div className="absolute top-4 left-4 flex flex-col gap-2">
          {isOnSale && (
            <Badge className="bg-red-500 text-white font-black text-[10px] px-3 py-1 rounded-full uppercase tracking-widest border-0">
              Sale {discountPercentage}%
            </Badge>
          )}
          {product?.totalStock < 5 && product?.totalStock > 0 && (
            <Badge className="bg-orange-500 text-white font-black text-[10px] px-3 py-1 rounded-full uppercase tracking-widest border-0 animate-pulse">
              Low Stock
            </Badge>
          )}
        </div>

        {product?.totalStock === 0 && (
            <div className="absolute inset-0 bg-white/60 backdrop-blur-[2px] flex items-center justify-center">
                 <Badge className="bg-black text-white font-black text-xs px-6 py-2 rounded-full uppercase tracking-widest border-0">
                    Sold Out
                </Badge>
            </div>
        )}
      </div>

      <CardContent className="pt-6 pb-2 px-1">
        <div className="flex flex-col gap-1.5">
          {/* Category & Brand Pin */}
          <div className="flex items-center gap-2">
             <span className="text-[10px] font-black tracking-[0.2em] uppercase text-yellow-600">
                {brandOptionsMap[product?.brand]}
             </span>
             <span className="w-1 h-1 rounded-full bg-gray-300"></span>
             <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-gray-400">
                {categoryOptionsMap[product?.category]}
             </span>
          </div>

          {/* Product Title */}
          <h3 
            className="text-lg font-bold text-gray-900 line-clamp-1 group-hover:text-yellow-600 transition-colors cursor-pointer"
            onClick={() => handleGetProductDetails(product?._id)}
          >
            {product?.title}
          </h3>

          {/* Pricing & Rating */}
          <div className="flex items-center justify-between mt-1">
            <div className="flex items-center gap-3">
              {isOnSale ? (
                <>
                  <span className="text-xl font-black text-gray-900">${product?.salePrice}</span>
                  <span className="text-sm text-gray-400 line-through font-medium">${product?.price}</span>
                </>
              ) : (
                <span className="text-xl font-black text-gray-900">${product?.price}</span>
              )}
            </div>
            
            <div className="flex items-center gap-1.5 px-2.5 py-1 bg-gray-50 rounded-full border border-gray-100">
                <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                <span className="text-[11px] font-bold text-gray-700">4.5</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default ShoppingProductTile;