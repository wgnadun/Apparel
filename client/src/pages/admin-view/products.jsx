import { Button } from "@/components/ui/button";
import { Fragment, useState } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import CommonForm from "@/components/common/form";
import { addProductFormElements } from "@/config";

const initialFormData = {
  image: null,
  title: "",
  description: "",
  category: "",
  brand: "",
  price: "",
  salePrice: "",
  totalPrice: ""
}



function AdminProducts() {
  const [openCreateProductsDialog, setOpenCreateProductsDialog] = useState(false);
  const [formData, setFormData] = useState(initialFormData);

  function onSubmit() {
  
  }

  return (
    <Fragment>
      <div className="mb-5 flex justify-end">
        <Button onClick={() => setOpenCreateProductsDialog(true)}>Add new Product</Button>
      </div>
      <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-4"></div>
      <Sheet open={openCreateProductsDialog} onOpenChange={() => { setOpenCreateProductsDialog(false) }}>
        <SheetContent side="right" className="overflow-auto m-5">
          <SheetHeader>
            <SheetTitle>Add new</SheetTitle>
          </SheetHeader>
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