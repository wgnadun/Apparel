import { Button } from "@/components/ui/button";
import { Fragment, useEffect, useState, useMemo } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import ValidatedForm from "@/components/common/validated-form";
import { addProductFormElements } from "@/config";
import ProductImageUpload from "@/components/admin-view/image-upload";
import { useDispatch, useSelector } from "react-redux";
import { addNewProduct, fetchAllProducts, editProduct, deleteProduct } from "@/store/admin/products-slice";
import { toast } from "sonner";
import AdminProductTile from "@/components/admin-view/product-tile";
import { productSchema } from "@/utils/validation";
import { useAuth0 } from '@auth0/auth0-react';
import { Plus, Package } from 'lucide-react';

const initialFormData = {
  image: null,
  title: "",
  description: "",
  category: "",
  brand: "",
  price: "",
  salePrice: "",
  totalStock: ""
}



function AdminProducts() {
  const [openCreateProductsDialog, setOpenCreateProductsDialog] = useState(false);
  const [formData, setFormData] = useState(initialFormData);
  const [imageFile ,setImageFile] = useState(null);
  const [uploadedImageUrl, setUploadedImageUrl] = useState('');
  const [imageLoadingState,setImageLoadingState] = useState(false)
  const [currentEditedId,setCurrentEditedId] = useState(null);
  
  // Track original state for change detection
  const [originalFormData, setOriginalFormData] = useState(initialFormData);
  const [originalImageUrl, setOriginalImageUrl] = useState('');

  const {productList} = useSelector(state => state.adminProducts);
  const { authType } = useSelector(state => state.auth);
  const dispatch = useDispatch();
  const { getAccessTokenSilently } = useAuth0();

  // Check if there are actual changes from original state
  const hasFormChanged = JSON.stringify(formData) !== JSON.stringify(originalFormData);
  const hasImageChanged = uploadedImageUrl !== originalImageUrl;
  const hasAnyChanges = hasFormChanged || hasImageChanged;
  
  // Debug logging
  console.log('Change detection:', {
    hasFormChanged,
    hasImageChanged,
    hasAnyChanges,
    currentFormData: formData,
    originalFormData,
    currentImageUrl: uploadedImageUrl,
    originalImageUrl
  });

  function onSubmit(formData) {
    const authParams = { getAccessTokenSilently, authType };
    
    console.log('Form data being submitted:', formData);
    console.log('Uploaded image URL:', uploadedImageUrl);
    
    // Use uploadedImageUrl if available (new upload), otherwise keep existing image
    const imageToUse = uploadedImageUrl || formData.image;
    
    // For new products, require an image
    if (currentEditedId === null && !imageToUse) {
      toast.error("Please upload a product image");
      return;
    }
    
    const productData = {
      ...formData,
      image: imageToUse,
    };
    
    console.log('Final product data being sent to API:', productData);
    
    currentEditedId !== null
      ? dispatch(
          editProduct({
            id: currentEditedId,
            formData: productData,
            ...authParams,
          })
        ).then((data) => {
          console.log(data, "edit");

          if (data?.payload?.success) {
            dispatch(fetchAllProducts(authParams));
            setFormData(initialFormData);
            setOpenCreateProductsDialog(false);
            setCurrentEditedId(null);
          }
        })
      : dispatch(
          addNewProduct({
            formData: productData,
            ...authParams,
          })
        ).then((data) => {
          console.log('Add product response:', data);
          if (data?.payload?.success) {
            dispatch(fetchAllProducts(authParams));
            setOpenCreateProductsDialog(false);
            setImageFile(null);
            setFormData(initialFormData);
            toast("Product add successfully");
          }
        });
  }
//delete product
   function handleDelete(getCurrentProductId) {
    const authParams = { getAccessTokenSilently, authType };
    
    dispatch(deleteProduct({
      id: getCurrentProductId,
      ...authParams,
    })).then((data) => {
      if (data?.payload?.success) {
        dispatch(fetchAllProducts(authParams));
      }
    });
  }

// Remove the old isFormValid function as it's now handled by the validation hook

  useEffect(()=>{
    const authParams = { getAccessTokenSilently, authType };
    dispatch(fetchAllProducts(authParams))
  },[dispatch, getAccessTokenSilently, authType])

  console.log(productList,uploadedImageUrl,"productList");

  return ( 
    <Fragment>
      {/* Premium Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-1 h-12 bg-black rounded-full"></div>
            <div>
              <h1 className="text-3xl font-bold text-black">Products Management</h1>
              <p className="text-gray-600 mt-1 font-medium">
                Manage your product catalog and inventory
              </p>
            </div>
          </div>
          <Button 
            onClick={() => {
              setOpenCreateProductsDialog(true);
              setCurrentEditedId(null);
              setFormData(initialFormData);
              setUploadedImageUrl('');
              setOriginalFormData(initialFormData);
              setOriginalImageUrl('');
            }}
            className="bg-black hover:bg-gray-800 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
          >
            <Plus className="w-5 h-5 mr-2" />
            Add New Product
          </Button>
        </div>
      </div>

      {/* Products Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {
          productList && productList.length > 0 ? 
          productList.map(productItem =>
             <AdminProductTile 
                  setFormData={setFormData}
                  setOpenCreateProductsDialog={setOpenCreateProductsDialog} 
                  setCurrentEditedId={setCurrentEditedId}
                  setUploadedImageUrl={setUploadedImageUrl}
                  setOriginalFormData={setOriginalFormData}
                  setOriginalImageUrl={setOriginalImageUrl}
                  key={productItem._id} 
                  product={productItem} 
                  handleDelete={handleDelete}
                  />
                ) : (
                  <div className="col-span-full flex flex-col items-center justify-center py-16 bg-white rounded-2xl shadow-lg border border-gray-200">
                    <Package className="w-16 h-16 text-gray-400 mb-4" />
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">No Products Yet</h3>
                    <p className="text-gray-600 text-center mb-6">Start building your product catalog by adding your first product</p>
                    <Button 
                      onClick={() => setOpenCreateProductsDialog(true)}
                      className="bg-black hover:bg-gray-800 text-white px-6 py-3 rounded-xl font-semibold"
                    >
                      <Plus className="w-5 h-5 mr-2" />
                      Add Your First Product
                    </Button>
                  </div>
                )
        }
      </div>
      <Sheet 
          open={openCreateProductsDialog} 
          onOpenChange={() => { 
            setOpenCreateProductsDialog(false);
            setCurrentEditedId(null);
            setFormData(initialFormData);
            setUploadedImageUrl('');
            setImageFile(null);
          }}
      >
        <SheetContent side="right" className="overflow-auto w-full max-w-2xl">
          <div className="h-full flex flex-col">
            <SheetHeader className="pb-6 border-b border-gray-200">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-black rounded-xl flex items-center justify-center">
                  <Package className="w-5 h-5 text-white" />
                </div>
                <div>
                  <SheetTitle className="text-2xl font-bold text-gray-900">
                    {currentEditedId !== null ? "Edit Product" : "Add New Product"}
                  </SheetTitle>
                  <p className="text-sm text-gray-600 mt-1">
                    {currentEditedId !== null 
                      ? "Update your product information" 
                      : "Fill in the details to add a new product to your catalog"
                    }
                  </p>
                </div>
              </div>
            </SheetHeader>

            <div className="flex-1 overflow-y-auto py-4 px-6">
              <div className="space-y-6">
                <ProductImageUpload 
                  imageFile={imageFile} 
                  setImageFile={setImageFile} 
                  uploadedImageUrl={uploadedImageUrl} 
                  setUploadedImageUrl={setUploadedImageUrl} 
                  setImageLoadingState={setImageLoadingState}
                  imageLoadingState={imageLoadingState}
                  isEditMode={currentEditedId !== null}
                />

                <div className="bg-white rounded-2xl border border-gray-200 shadow-sm">
                  <div className="p-4 border-b border-gray-200">
                    <div className="space-y-2">
                      <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                        <div className="w-2 h-2 bg-black rounded-full"></div>
                        Product Information
                      </h3>
                      <p className="text-sm text-gray-600">Enter the essential details for your product listing</p>
                    </div>
                  </div>
                  
                  <div className="p-4">
                    {/* Form Status Indicator */}
                    {currentEditedId === null && (
                      <div className="mb-4 p-3 rounded-lg border border-gray-200 bg-gray-50">
                        <div className="flex items-center gap-2 text-sm">
                          {hasImageChanged ? (
                            <>
                              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                              <span className="text-green-700 font-medium">Image uploaded successfully</span>
                            </>
                          ) : (
                            <>
                              <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                              <span className="text-red-700 font-medium">Please upload a product image</span>
                            </>
                          )}
                        </div>
                      </div>
                    )}
                    
                    <ValidatedForm
                      schema={productSchema}
                      onSubmit={onSubmit}
                      initialData={formData}
                      buttonText={
                        currentEditedId !== null ? "Update Product" : "Add Product"
                      } 
                      formControls={addProductFormElements}
                      isBtnDisabled={currentEditedId === null ? !hasImageChanged : !hasAnyChanges}
                      hasImageUploaded={hasImageChanged}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </Fragment>
  );
}
export default AdminProducts;