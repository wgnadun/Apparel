import { Button } from "@/components/ui/button";
import { Fragment, useEffect, useState } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import CommonForm from "@/components/common/form";
import { addProductFormElements } from "@/config";
import ProductImageUpload from "@/components/admin-view/image-upload";
import { useDispatch, useSelector } from "react-redux";
import { addNewProduct, fetchAllProducts } from "@/store/admin/products-slice";
import { toast } from "sonner";
import AdminProductTile from "@/components/admin-view/product-tile";

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
  const [uploadImageUrl, setUploadImageUrl] = useState('');
  const [imageLoadingState,setImageLoadingState] = useState(false)
  const [currentEditedId,setCurrentEditedId] = useState(null);

  const {productList} = useSelector(state => state.adminProducts);
  const dispatch = useDispatch();

  function onSubmit(event) {
    event.preventDefault();
    dispatch(addNewProduct({
      ...formData,
      image:uploadImageUrl
    })).then((data)=> 
      
      {
        console.log(data);
        console.log(uploadImageUrl);
        if(data?.payload?.success) {
          setOpenCreateProductsDialog(false);
          dispatch(fetchAllProducts());
          setFormData(initialFormData);
          setImageFile(null);
          setUploadImageUrl('');
          toast(
            'Product added successfully!',
        )
      }

    })
  }

  useEffect(()=>{
    dispatch(fetchAllProducts())
  },[dispatch])

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
                  />
                ) : null
        }
      </div>
      <Sheet open={openCreateProductsDialog} onOpenChange={() => { setOpenCreateProductsDialog(false) }}>
        <SheetContent side="right" className="overflow-auto m-5">
          <SheetHeader>

            <SheetTitle>Add new</SheetTitle>
          </SheetHeader>
          <ProductImageUpload 
                imageFile={imageFile} 
                setImageFile={setImageFile} 
                uploadImageUrl={uploadImageUrl} 
                setUploadImageUrl={setUploadImageUrl} 
                setImageLoadingState ={setImageLoadingState}
                imageLoadingState={imageLoadingState}
                isEditMode={currentEditedId !==null}
          />

          <div className="py-6 m-5">
          <CommonForm
              onSubmit={onSubmit}
              formData={formData} 
              setFormData={setFormData} 
              buttonText='Add' 
              formControls={addProductFormElements}
          />

          </div>
        </SheetContent>
      </Sheet>
    </Fragment>
  );
}
export default AdminProducts;