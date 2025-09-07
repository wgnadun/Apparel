import { Button } from "@/components/ui/button";
import { Fragment, useEffect, useState } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import ValidatedForm from "@/components/common/validated-form";
import { addProductFormElements } from "@/config";
import ProductImageUpload from "@/components/admin-view/image-upload";
import { useDispatch, useSelector } from "react-redux";
import { addNewProduct, fetchAllProducts, editProduct, deleteProduct } from "@/store/admin/products-slice";
import { toast } from "sonner";
import AdminProductTile from "@/components/admin-view/product-tile";
import { productSchema } from "@/utils/validation";

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

  const {productList} = useSelector(state => state.adminProducts);
  const dispatch = useDispatch();

 function onSubmit(formData) {
    currentEditedId !== null
      ? dispatch(
          editProduct({
            id: currentEditedId,
            formData,
          })
        ).then((data) => {
          console.log(data, "edit");

          if (data?.payload?.success) {
            dispatch(fetchAllProducts());
            setFormData(initialFormData);
            setOpenCreateProductsDialog(false);
            setCurrentEditedId(null);
          }
        })
      : dispatch(
          addNewProduct({
            ...formData,
            image: uploadedImageUrl,
          })
        ).then((data) => {
          if (data?.payload?.success) {
            console.log(data)
            dispatch(fetchAllProducts());
            setOpenCreateProductsDialog(false);
            setImageFile(null);
            setFormData(initialFormData);
            toast(
              "Product add successfully",
            );
          }
        });
  }
//delete product
   function handleDelete(getCurrentProductId) {
    dispatch(deleteProduct(getCurrentProductId)).then((data) => {
      if (data?.payload?.success) {
        dispatch(fetchAllProducts());
      }
    });
  }

// Remove the old isFormValid function as it's now handled by the validation hook

  useEffect(()=>{
    dispatch(fetchAllProducts())
  },[dispatch])

  console.log(productList,uploadedImageUrl,"productList");

  return ( 
    <Fragment>
      <div className="mb-5 flex justify-end">
        <Button onClick={() => setOpenCreateProductsDialog(true)}>Add new Product</Button>
      </div>
      <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-4 ">
        {
          productList && productList.length > 0 ? 
          productList.map(productItem =>
             <AdminProductTile 
                  setFormData={setFormData}
                  setOpenCreateProductsDialog={setOpenCreateProductsDialog} 
                  setCurrentEditedId={setCurrentEditedId} 
                  key={productItem._id} 
                  product={productItem} 
                  handleDelete={handleDelete}
                  />
                ) : null
        }
      </div>
      <Sheet 
          open={openCreateProductsDialog} 
          onOpenChange={() => { 
            setOpenCreateProductsDialog(false);
            setCurrentEditedId(null);
            setFormData(initialFormData);
          }}
      >
        <SheetContent side="right" className="overflow-auto m-5">
          <SheetHeader>

            <SheetTitle>{
              currentEditedId !== null ? "Edit Product" : "Add New Product"
            }</SheetTitle>
          </SheetHeader>
          <ProductImageUpload 
                imageFile={imageFile} 
                setImageFile={setImageFile} 
                uploadedImageUrl={uploadedImageUrl} 
                setUploadedImageUrl={setUploadedImageUrl} 
                setImageLoadingState ={setImageLoadingState}
                imageLoadingState={imageLoadingState}
                isEditMode={currentEditedId !==null}
          />

          <div className="py-6 m-5">
          <ValidatedForm
              schema={productSchema}
              onSubmit={onSubmit}
              initialData={formData}
              buttonText={
                currentEditedId !== null ? "Update Product" : "Add Product"
              } 
              formControls={addProductFormElements}
          />

          </div>
        </SheetContent>
      </Sheet>
    </Fragment>
  );
}
export default AdminProducts;