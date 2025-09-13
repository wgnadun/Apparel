import { useEffect, useRef } from "react";
import { Input } from "../ui/input";
import { Label } from "@radix-ui/react-label";
import { FileIcon, UploadCloudIcon, XIcon, CheckCircle, ImageIcon } from "lucide-react";
import { Button } from "../ui/button";
import api from "../../services/api";
import { createAuthenticatedApi } from "../../services/api";
import { Skeleton } from "../ui/skeleton";
import { useAuth0 } from '@auth0/auth0-react';
import { useSelector } from "react-redux";

function ProductImageUpload({
   imageFile, 
   setImageFile, 
   uploadedImageUrl, 
   imageLoadingState,
   setUploadedImageUrl,
   setImageLoadingState ,
   isEditMode,
   isCustomStyle = false, 

  }) {

    const inputRef = useRef(null);
    const { authType } = useSelector(state => state.auth);
    const { getAccessTokenSilently } = useAuth0();

    function handleImageFileChange(event) {
      const selectedFile = event.target.files?.[0];
      console.log('File selected:', selectedFile);
      if(selectedFile) {
        console.log('File details:', {
          name: selectedFile.name,
          size: selectedFile.size,
          type: selectedFile.type
        });
        setImageFile(selectedFile);
      }
    }

    function handleDragOver(event) {
      event.preventDefault();
    }

    function handleDrop(event) {
      event.preventDefault();
      const droppedFile = event.dataTransfer.files?.[0];
      console.log('File dropped:', droppedFile);
      if (droppedFile) {
        console.log('Dropped file details:', {
          name: droppedFile.name,
          size: droppedFile.size,
          type: droppedFile.type
        });
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
      
      let apiInstance;
      
      // Use authenticated API for Auth0 users, regular API for JWT users
      if (authType === 'auth0' && getAccessTokenSilently) {
          apiInstance = createAuthenticatedApi(getAccessTokenSilently);
      } else {
          apiInstance = api;
      }
      
      try {
        const response =  await apiInstance.post('/admin/products/upload-image',data);

        console.log('Image upload response:', response.data);

        if(response?.data?.success) {
          // Cloudinary returns the URL in result.secure_url
          const imageUrl = response.data.result.secure_url || response.data.result.url;
          console.log('Setting image URL:', imageUrl);
          setUploadedImageUrl(imageUrl);
          setImageLoadingState(false);
        } else {
          console.error('Image upload failed:', response.data);
          setImageLoadingState(false);
        }
      } catch (error) {
        console.error('Image upload error:', error);
        setImageLoadingState(false);
      }
    }

    useEffect(()=>{
      console.log('useEffect triggered, imageFile:', imageFile);
      if(imageFile !== null) {
        console.log('Starting image upload...');
        uploadImageToCloudinary();
      }
    },[imageFile]);

    return(
      <div className={`w-full ${isCustomStyle ? '':'mx-auto mt-4'}`}>
        <div className="space-y-2">
          <Label className="text-sm font-semibold text-gray-900 flex items-center gap-2">
            <ImageIcon className="w-4 h-4" />
            Product Image
          </Label>
          <p className="text-xs text-gray-600">Upload a high-quality image for your product</p>
        </div>

        <div 
          onDragOver={handleDragOver} 
          onDrop={handleDrop} 
          className="relative group transition-all duration-300 hover:border-gray-400 hover:bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg p-4 bg-white"
        >
          <Input 
            id="image-upload" 
            type="file" 
            className="hidden" 
            ref={inputRef} 
            onChange={handleImageFileChange}
            accept="image/*"
          />
          
          {!imageFile ? (
            <Label 
              htmlFor="image-upload" 
              className="cursor-pointer group-hover:scale-105 flex flex-col items-center justify-center h-24 transition-transform duration-200"
            >
              <div className="relative">
                <div className="w-10 h-10 bg-black rounded-lg flex items-center justify-center mb-2 shadow-sm group-hover:shadow-md transition-shadow duration-200">
                  <UploadCloudIcon className="w-5 h-5 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-gray-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs font-bold">+</span>
                </div>
              </div>
              <div className="text-center">
                <p className="text-sm font-semibold text-gray-900 mb-1">Upload Image</p>
                <p className="text-xs text-gray-600">Drag & drop or click to browse</p>
                <p className="text-xs text-gray-500 mt-1">PNG, JPG, WEBP up to 10MB</p>
              </div>
            </Label>
          ) : imageLoadingState ? (
            <div className="flex flex-col items-center justify-center h-24">
              <div className="relative">
                <div className="w-10 h-10 bg-black rounded-lg flex items-center justify-center mb-2 animate-pulse">
                  <UploadCloudIcon className="w-5 h-5 text-white" />
                </div>
                <div className="absolute inset-0 rounded-lg bg-black animate-spin opacity-20"></div>
              </div>
              <p className="text-xs font-medium text-gray-700">Uploading...</p>
              <Skeleton className="h-1 w-24 mt-1" />
            </div>
          ) : (
            <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-200 shadow-sm">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
                  <CheckCircle className="w-4 h-4 text-white" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-green-900 truncate max-w-32">{imageFile.name}</p>
                  <p className="text-xs text-green-600">{(imageFile.size / 1024 / 1024).toFixed(2)} MB • Ready to upload</p>
                </div>
              </div>
              <Button 
                variant="ghost" 
                size="icon" 
                className="text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors duration-200 w-6 h-6" 
                onClick={handleRemoveImage}
              >
                <XIcon className="w-4 h-4" />
                <span className="sr-only">Remove image</span>
              </Button>
            </div>
          )}
        </div>
      </div>
    );
}

export default ProductImageUpload;