import { useEffect, useRef } from "react";
import { Input } from "../ui/input";
import { Label } from "@radix-ui/react-label";
import { FileIcon, UploadCloudIcon, XIcon } from "lucide-react";
import { Button } from "../ui/button";
import axios from "axios";
import { Skeleton } from "../ui/skeleton";

function ProductImageUpload({
   imageFile, 
   setImageFile, 
   uploadImageUrl, 
   imageLoadingState,
   setUploadImageUrl,
   setImageLoadingState ,
    isEditMode 

  }) {

    const inputRef = useRef(null);

    function handleImageFileChange(event) {
      const selectedFile = event.target.files?.[0];
      if(selectedFile) setImageFile(selectedFile);
     
    }

    function handleDragOver(event) {
      event.preventDefault();
    }

    function handleDrop(event) {
      event.preventDefault();
      const droppedFile = event.dataTransfer.files?.[0];
      if (droppedFile) {
        setImageFile(droppedFile);
      }
    }

    console.log(imageFile);
    function handleRemoveImage() {
      setImageFile(null);
      if (inputRef.current) {
        inputRef.current.value = ''; // Clear the input value
      }
    }

    async function uploadImageToCloudinary(){
      setImageLoadingState(true);
      const data =  new FormData();
      data.append('my_image_file', imageFile);
      const response =  await axios.post('http://localhost:5000/api/admin/products/upload-image',data);

      if(response?.data?.success) {
        setUploadImageUrl(response.data.result.url);
        setImageLoadingState(false);
      }
    }

    useEffect(()=>{
      if(imageFile!== null) uploadImageToCloudinary()
    },[imageFile]);

    return(
      <div className="max-w-md mx-auto mt-4">
        <label className="text-lg font-semibold mb-5 block ">Upload Image</label>

        <div 
                onDragOver={handleDragOver} 
                onDrop={handleDrop} 
                className={`${isEditMode ? "opacity-60" : ""
                            } border-2 border-dashed rounded-lg p-4`}
                >
          <Input 
                id="image-upload" 
                type="file" 
                className="hidden" 
                ref={inputRef} 
                onChange={handleImageFileChange}
                disabled={isEditMode}
          />
          {!imageFile ? (
              <Label htmlFor="image-upload" className={`${isEditMode ? "cursor-not-allowed":""}flex flex-col items-center justify-center h-32 cursor-pointer`}>
                     <UploadCloudIcon className ="w-10 h-10 text-muted-foreground mb-2"/>
                     <span>Drag & Drop or click to upload image</span>
              </Label>
            ): imageLoadingState ? (
              <Skeleton className="h-10 bg-gray-100"/> 
            ) : (
            <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <FileIcon className="w-8 h-8 mr-2 text-primary"/>
                </div>
                <p className="text-sm font-medium">{imageFile.name}</p>
                 <Button 
                        variant ="ghost" 
                        size ="icon" 
                        className="text-muted-foreground hover:text-foreground" 
                        onClick= {handleRemoveImage}
                >
                  <XIcon className="w-4 h-4"/>
                  <span className="sr-only">Remove image</span>

                 </Button>

              </div>
              )}
        </div>
      </div>
    );
}

export default ProductImageUpload;