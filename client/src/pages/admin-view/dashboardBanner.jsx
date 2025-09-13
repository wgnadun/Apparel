import ProductImageUpload from "@/components/admin-view/image-upload";
import { Button } from "@/components/ui/button";
import {
  addFeatureImage,
  getFeatureImages,
  deleteFeatureImages
} from "@/store/common/feature-slice";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useAuth0 } from '@auth0/auth0-react';
import { Plus, Image, Eye, Trash2, ChevronLeft, ChevronRight, Check } from 'lucide-react';

function AdminDashboardBanner() {
  const [imageFile, setImageFile] = useState(null);
  const [uploadedImageUrl, setUploadedImageUrl] = useState("");
  const [imageLoadingState, setImageLoadingState] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const dispatch = useDispatch();
  const { featureImageList } = useSelector((state) => state.commonFeature);
  const { authType } = useSelector(state => state.auth);
  const { getAccessTokenSilently } = useAuth0();

  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    dispatch(getFeatureImages());
  }, [dispatch]);

  function handleUploadFeatureImage() {
    if (!uploadedImageUrl) return;
    
    const authParams = { getAccessTokenSilently, authType };
    dispatch(addFeatureImage({ image: uploadedImageUrl, ...authParams })).then((data) => {
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

  function handleDelete() {
    // Use _id field from MongoDB document
    const imageId = currentImage?._id;
    if (!imageId) {
      console.error('No image ID found for deletion');
      return;
    }
    
    const authParams = { getAccessTokenSilently, authType };
    dispatch(deleteFeatureImages({ id: imageId, ...authParams })).then((data) => {
      if (data?.payload?.success) {
        dispatch(getFeatureImages());
        setShowDeleteConfirm(false);
        // Adjust current index if needed
        if (currentIndex >= total - 1 && total > 1) {
          setCurrentIndex(0);
        }
      }
    });
  }

  if (!featureImageList || total === 0) {
    return (
      <div className="p-8">
        <div className="max-w-4xl mx-auto">
          {/* Empty State */}
          <div className="text-center mb-12">
            <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
              <Image className="w-12 h-12 text-gray-400" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">No banners yet</h2>
            <p className="text-gray-600 mb-8">Upload your first banner to get started</p>
          </div>

          {/* Upload Section */}
          <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-200">
            <div className="flex items-center mb-6">
              <div className="w-1 h-8 bg-gray-800 rounded-full mr-3"></div>
              <h3 className="text-xl font-bold text-gray-900">Upload New Banner</h3>
            </div>

            <ProductImageUpload
              imageFile={imageFile}
              setImageFile={setImageFile}
              uploadedImageUrl={uploadedImageUrl}
              setUploadedImageUrl={setUploadedImageUrl}
              setImageLoadingState={setImageLoadingState}
              imageLoadingState={imageLoadingState}
              isCustomStyle={true}
            />

            <Button 
              onClick={handleUploadFeatureImage} 
              disabled={!uploadedImageUrl || imageLoadingState}
              className="mt-6 w-full bg-gray-900 hover:bg-gray-800 text-white font-semibold py-3 rounded-lg shadow-md transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {imageLoadingState ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-2"></div>
                  Uploading...
                </div>
              ) : (
                <div className="flex items-center justify-center">
                  <Plus className="w-5 h-5 mr-2" />
                  Upload Banner
                </div>
              )}
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Upload Section - Left Column */}
          <div className="lg:col-span-1">
            <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200 sticky top-6">
              <div className="flex items-center mb-6">
                <div className="w-1 h-8 bg-gray-800 rounded-full mr-3"></div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">Add New Banner</h3>
                </div>
              </div>

              <ProductImageUpload
                imageFile={imageFile}
                setImageFile={setImageFile}
                uploadedImageUrl={uploadedImageUrl}
                setUploadedImageUrl={setUploadedImageUrl}
                setImageLoadingState={setImageLoadingState}
                imageLoadingState={imageLoadingState}
                isCustomStyle={true}
              />

              <Button 
                onClick={handleUploadFeatureImage} 
                disabled={!uploadedImageUrl || imageLoadingState}
                className="mt-6 w-full bg-gray-900 hover:bg-gray-800 text-white font-semibold py-3 rounded-lg shadow-md transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {imageLoadingState ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-2"></div>
                    Uploading...
                  </div>
                ) : (
                  <div className="flex items-center justify-center">
                    <Plus className="w-5 h-5 mr-2" />
                    Upload Banner
                  </div>
                )}
              </Button>

              {/* Banner Stats */}
              <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">{total}</div>
                  <div className="text-sm text-gray-600">Total Banners</div>
                </div>
              </div>
            </div>
          </div>

          {/* Banner Preview Section */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
              {/* Banner Header */}
              <div className="p-6 border-b border-gray-200 bg-gray-50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-1 h-8 bg-gray-800 rounded-full mr-3"></div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">Banner Preview</h3>
                      <p className="text-sm text-gray-600">Banner {currentIndex + 1} of {total}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Banner Image */}
              <div className="relative group">
                <img
                  src={currentImage.image}
                  alt={`Banner ${currentIndex + 1}`}
                  className="w-full h-64 sm:h-80 lg:h-96 object-cover transition-transform duration-300 group-hover:scale-105"
                />

                {/* Overlay Controls */}
                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <div className="flex space-x-4">
                    {/* Navigation Buttons */}
                    {total > 1 && (
                      <>
                        <button
                          onClick={handlePrev}
                          className="bg-white/90 backdrop-blur-sm text-gray-800 p-3 rounded-full hover:bg-white transition-all duration-300 shadow-lg"
                        >
                          <ChevronLeft className="w-6 h-6" />
                        </button>
                        
                        <button
                          onClick={handleNext}
                          className="bg-white/90 backdrop-blur-sm text-gray-800 p-3 rounded-full hover:bg-white transition-all duration-300 shadow-lg"
                        >
                          <ChevronRight className="w-6 h-6" />
                        </button>
                      </>
                    )}

                    {/* Delete Button */}
                    <button
                      onClick={() => setShowDeleteConfirm(true)}
                      className="bg-red-500/90 backdrop-blur-sm text-white p-3 rounded-full hover:bg-red-600 transition-all duration-300 shadow-lg"
                    >
                      <Trash2 className="w-6 h-6" />
                    </button>
                  </div>
                </div>

                {/* Mobile Navigation */}
                {total > 1 && (
                  <div className="sm:hidden absolute bottom-4 left-1/2 transform -translate-x-1/2">
                    <div className="flex space-x-2 bg-black/50 backdrop-blur-sm px-4 py-2 rounded-full">
                      <button
                        onClick={handlePrev}
                        className="text-white p-2 hover:bg-white/20 rounded-full transition-all"
                      >
                        <ChevronLeft className="w-5 h-5" />
                      </button>
                      
                      <span className="text-white text-sm flex items-center px-2">
                        {currentIndex + 1}/{total}
                      </span>
                      
                      <button
                        onClick={handleNext}
                        className="text-white p-2 hover:bg-white/20 rounded-full transition-all"
                      >
                        <ChevronRight className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Banner Info Footer */}
              <div className="p-6 bg-gray-50">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
                  <div>
                    <h4 className="font-semibold text-gray-900 text-lg">Banner {currentIndex + 1}</h4>
                    <p className="text-gray-600 text-sm">
                      Uploaded: {new Date(currentImage.createdAt || Date.now()).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                  </div>
                  
                  {/* Status Badge */}
                  <div className="flex space-x-3 mt-4 sm:mt-0">
                    <div className="text-xs bg-green-100 text-green-800 px-3 py-1 rounded-full font-medium">
                      Active
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* All Banners Thumbnail Section */}
            {total > 1 && (
              <div className="mt-6 bg-white p-6 rounded-xl shadow-lg border border-gray-200">
                <div className="flex items-center mb-4">
                  <div className="w-1 h-8 bg-gray-800 rounded-full mr-3"></div>
                  <h4 className="text-lg font-bold text-gray-900">All Banners</h4>
                  <div className="ml-auto text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                    {total} banners
                  </div>
                </div>
                <div className="flex space-x-4 overflow-x-auto pb-2">
                  {featureImageList.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentIndex(index)}
                      className={`flex-shrink-0 relative group ${
                        index === currentIndex ? 'ring-2 ring-gray-800' : ''
                      }`}
                    >
                      <img
                        src={image.image}
                        alt={`Thumbnail ${index + 1}`}
                        className="w-20 h-16 sm:w-24 sm:h-20 object-cover rounded-lg transition-all duration-300 group-hover:scale-105"
                      />
                      <div className={`absolute inset-0 rounded-lg transition-all duration-300 ${
                        index === currentIndex 
                          ? 'bg-gray-800/30' 
                          : 'bg-transparent group-hover:bg-black/20'
                      }`}>
                        {index === currentIndex && (
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="bg-gray-800 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">
                              <Check className="w-4 h-4" />
                            </div>
                          </div>
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Quick Actions Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
              <div className="flex items-center mb-6">
                <div className="w-1 h-8 bg-gray-800 rounded-full mr-3"></div>
                <h3 className="text-xl font-bold text-gray-900">Quick Actions</h3>
              </div>
              
              <div className="space-y-4">
                <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <div className="flex items-center mb-2">
                    <Eye className="w-5 h-5 text-gray-600 mr-2" />
                    <span className="font-medium text-gray-900">Current Banner</span>
                  </div>
                  <p className="text-sm text-gray-600">Banner {currentIndex + 1} is currently selected</p>
                </div>
                
                <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <div className="flex items-center mb-2">
                    <Image className="w-5 h-5 text-gray-600 mr-2" />
                    <span className="font-medium text-gray-900">Total Banners</span>
                  </div>
                  <p className="text-2xl font-bold text-gray-900">{total}</p>
                </div>
                
                {total > 0 && (
                  <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <div className="flex items-center mb-2">
                      <Trash2 className="w-5 h-5 text-gray-600 mr-2" />
                      <span className="font-medium text-gray-900">Delete Current</span>
                    </div>
                    <Button
                      onClick={() => setShowDeleteConfirm(true)}
                      variant="outline"
                      className="w-full border-red-200 text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Delete Banner
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Delete Confirmation Modal */}
        {showDeleteConfirm && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6">
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
                  <Trash2 className="w-8 h-8 text-red-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Delete Banner?</h3>
                <p className="text-gray-600 mb-6">
                  Are you sure you want to delete banner #{currentIndex + 1}? This action cannot be undone.
                </p>
                
                <div className="flex space-x-4">
                  <Button
                    onClick={() => setShowDeleteConfirm(false)}
                    variant="outline"
                    className="flex-1 border-gray-300 text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleDelete}
                    className="flex-1 bg-red-600 hover:bg-red-700 text-white"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminDashboardBanner;