import { useRef } from "react";
import { Input } from "../ui/input";
import { Label } from "@radix-ui/react-label";
import { FileIcon, UploadCloudIcon, XIcon } from "lucide-react";
import { Button } from "../ui/button";

function ProductImageUpload({
   imageFile, 
   setImageFile, 
   uploadImageUrl, 
   setUploadImageUrl 
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

    function handleRemoveImage() {
      setImageFile(null);
      if (inputRef.current) {
        inputRef.current.value = ''; // Clear the input value
      }
    }

    return(
      <div className="max-w-md mx-auto mt-4">
        <label className="text-lg font-semibold mb-5 block ">Upload Image</label>

        <div onDragOver={handleDragOver} onDrop={handleDrop} className="border-2 border-dashed rounded-lg p-4">
          <Input 
                id="image-upload" 
                type="file" 
                className="hidden" 
                ref={inputRef} 
                onChange={handleImageFileChange}
          />
          {!imageFile ? (
              <Label htmlFor="image-upload" className="flex flex-col items-center justify-center h-32 cursor-pointer">
                     <UploadCloudIcon className ="w-10 h-10 text-muted-foreground mb-2"/>
                     <span>Drag & Drop or click to upload image</span>
              </Label>
            ): (
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