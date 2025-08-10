import ProductImageUpload from "@/components/admin-view/image-upload";
import { Button } from "@/components/ui/button";
import {
  addFeatureImage,
  getFeatureImages,
  deleteFeatureImages
} from "@/store/common/feature-slice";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

function AdminDashboardBanner() {
  const [imageFile, setImageFile] = useState(null);
  const [uploadedImageUrl, setUploadedImageUrl] = useState("");
  const [imageLoadingState, setImageLoadingState] = useState(false);
  const dispatch = useDispatch();
  const { featureImageList } = useSelector((state) => state.commonFeature);

  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    dispatch(getFeatureImages());
  }, [dispatch]);

  function handleUploadFeatureImage() {
    dispatch(addFeatureImage(uploadedImageUrl)).then((data) => {
      if (data?.payload?.success) {
        dispatch(getFeatureImages());
        setImageFile(null);
        setUploadedImageUrl("");
      }
    });
  }

  const total = featureImageList?.length || 0;
  const currentImage = featureImageList ? featureImageList[currentIndex] : null;

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? total - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === total - 1 ? 0 : prev + 1));
  };

  

  if (!featureImageList || total === 0) {
    return null; // or a placeholder message
  }
  function handleDelete() {
      dispatch(deleteFeatureImages(featureImageList?.id)).then((data) => {
        if (data?.payload?.success) {
          dispatch(getFeatureImages());
        }
      });
    }

  return (
    <>
      <ProductImageUpload
        imageFile={imageFile}
        setImageFile={setImageFile}
        uploadedImageUrl={uploadedImageUrl}
        setUploadedImageUrl={setUploadedImageUrl}
        setImageLoadingState={setImageLoadingState}
        imageLoadingState={imageLoadingState}
        isCustomStyle={true}
      />

      <Button onClick={handleUploadFeatureImage} className="mt-5 w-full">
        Upload
      </Button>

      <div className="mt-5 max-w-full relative">


        <div className="relative">
          <img
            src={currentImage.image}
            alt={`Slide ${currentIndex + 1}`}
            className="w-full h-[600px] object-cover rounded-t-lg"
          />

          {/* Delete Button */}
         <Button 
           className="absolute top-2 right-2 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 z-10"
          onClick={() => handleDelete()}>Delete</Button>
        </div>

        {/* Navigation buttons */}
        {total > 1 && (
          <div className="flex justify-between mt-2">
            <button
              onClick={handlePrev}
              className="bg-gray-300 px-3 py-1 rounded hover:bg-gray-400"
            >
              Prev
            </button>
            <button
              onClick={handleNext}
              className="bg-gray-300 px-3 py-1 rounded hover:bg-gray-400"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </>
  );
}

export default AdminDashboardBanner;
