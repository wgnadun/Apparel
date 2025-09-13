import { Button } from "../ui/button";
import { Card, CardContent, CardFooter } from "../ui/card";
import { Badge } from "../ui/badge";
import { Edit, Trash2, Eye, Package, DollarSign, Tag, Layers } from "lucide-react";

function AdminProductTile({
  product,
  setFormData,
  setOpenCreateProductsDialog,
  setCurrentEditedId,
  setUploadedImageUrl,
  setOriginalFormData,
  setOriginalImageUrl,
  handleDelete,
}) {
  const isOnSale = product?.salePrice > 0;
  const discountPercentage = isOnSale 
    ? Math.round(((product?.price - product?.salePrice) / product?.price) * 100)
    : 0;

  // Debug logging
  console.log('Product data:', product);
  console.log('Product image URL:', product?.image);
  console.log('Image URL type:', typeof product?.image);
  console.log('Image URL length:', product?.image?.length);

  return (
    <Card className="group w-full max-w-sm mx-auto bg-white border border-gray-200 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden">
      <div className="relative">
        {/* Image Container */}
        <div className="relative overflow-hidden">
          {product?.image && product.image !== '' && product.image !== 'null' ? (
            <div className="relative">
              <img
                src={product.image}
                alt={product?.title || 'Product image'}
                className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                onLoad={() => console.log('Image loaded successfully:', product.image)}
                onError={(e) => {
                  console.log('Image failed to load:', product.image);
                  console.log('Error details:', e);
                  e.target.parentElement.style.display = 'none';
                  e.target.parentElement.nextElementSibling.style.display = 'flex';
                }}
              />
            </div>
          ) : null}
          
          {/* Fallback when no image or image fails to load */}
          <div 
            className={`w-full h-64 bg-gray-100 flex items-center justify-center group-hover:bg-gray-200 transition-colors duration-300 ${
              product?.image && product.image !== '' && product.image !== 'null' ? 'hidden' : ''
            }`}
          >
            <div className="text-center">
              <Package className="w-12 h-12 text-gray-400 mx-auto mb-2" />
              <p className="text-sm text-gray-500 font-medium">No Image</p>
              <p className="text-xs text-gray-400">Upload an image</p>
              {product?.image && (
                <p className="text-xs text-red-400 mt-1">
                  URL: {product.image.substring(0, 50)}...
                </p>
              )}
            </div>
          </div>
          

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

        <CardContent className="p-4">
          {/* Product Title */}
          <h2 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-black transition-colors">
            {product?.title}
          </h2>

          {/* Category & Brand */}
          <div className="flex items-center gap-2 mb-3">
            <Badge variant="outline" className="text-xs">
              {product?.category}
            </Badge>
            <Badge variant="outline" className="text-xs">
              {product?.brand}
            </Badge>
          </div>

          {/* Price Section */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-gray-600" />
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
          </div>

          {/* Stock Info */}
          <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
            <Layers className="w-4 h-4" />
            <span>{product?.totalStock} in stock</span>
          </div>

          {/* Description Preview */}
          {product?.description && (
            <p className="text-sm text-gray-600 line-clamp-2 mb-4">
              {product?.description}
            </p>
          )}
        </CardContent>

        <CardFooter className="p-4 pt-0 border-t border-gray-100">
          <div className="flex gap-2 w-full">
            <Button
              onClick={() => {
                const productFormData = {
                  ...product,
                  price: product?.price?.toString() || '',
                  salePrice: product?.salePrice?.toString() || '',
                  totalStock: product?.totalStock?.toString() || ''
                };
                
                setOpenCreateProductsDialog(true);
                setCurrentEditedId(product?._id);
                setUploadedImageUrl(product?.image || '');
                setFormData(productFormData);
                
                // Set original state for change detection
                setOriginalFormData(productFormData);
                setOriginalImageUrl(product?.image || '');
              }}
              className="flex-1 bg-black hover:bg-gray-800 text-white font-medium"
              size="sm"
            >
              <Edit className="w-4 h-4 mr-2" />
              Edit
            </Button>
            <Button 
              onClick={() => handleDelete(product?._id)}
              variant="outline"
              className="flex-1 border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300"
              size="sm"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Delete
            </Button>
          </div>
        </CardFooter>
      </div>
    </Card>
  );
}

export default AdminProductTile;