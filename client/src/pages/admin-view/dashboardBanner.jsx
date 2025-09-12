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
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 p-4 sm:p-6 lg:p-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
              🎨 Banner Management
            </h1>
            <p className="text-gray-600 text-lg">
              Upload and manage your website's featured banners
            </p>
          </div>

          {/* Upload Section */}
          <div className="bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-xl border border-white/20">
            <div className="text-center mb-6">
              <div className="text-6xl mb-4">📷</div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">No banners uploaded yet</h3>
              <p className="text-gray-600">Start by uploading your first banner image</p>
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
              className="mt-6 w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold py-3 rounded-xl transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {imageLoadingState ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-2"></div>
                  Uploading...
                </div>
              ) : (
                "🚀 Upload Banner"
              )}
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center lg:text-left mb-8">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-6">
          Banner Management Center
          </h1>
          <p className="text-gray-600 text-lg sm:text-xl">
            Manage your website's featured banners and carousel images
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Upload Section - Left Column */}
          <div className="lg:col-span-1">
            <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-xl border border-white/20 sticky top-6">
              <div className="flex items-center mb-6">
                <div className="w-3 h-8 bg-gradient-to-b from-green-400 to-emerald-600 rounded-full mr-3"></div>
                <div>
                  <h3 className="text-xl font-bold text-gray-800">Add New Banner</h3>
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
                className="mt-6 w-full bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white font-semibold py-3 rounded-xl transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {imageLoadingState ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-2"></div>
                    Uploading...
                  </div>
                ) : (
                  "Upload Banner"
                )}
              </Button>

              {/* Banner Stats */}
              <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border border-blue-200">
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-800">{total}</div>
                  <div className="text-sm text-gray-600">Total Uploaded Banners</div>
                </div>
              </div>
            </div>
          </div>

          {/* Banner Display Section - Right 2/3 */}
          <div className="lg:col-span-2">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 overflow-hidden">
              {/* Banner Header */}
              <div className="p-6 border-b border-gray-100">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-3 h-8 bg-gradient-to-b from-pink-400 to-purple-600 rounded-full mr-3"></div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-800"> Banner Preview</h3>
                      <p className="text-sm text-gray-600">Banner {currentIndex + 1} of {total}</p>
                    </div>
                  </div>
                  
                  {/* Banner Counter */}
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
                          className="bg-white/90 backdrop-blur-sm text-gray-800 p-3 rounded-full hover:bg-white transition-all duration-300 transform hover:scale-110 shadow-lg"
                        >
                          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                          </svg>
                        </button>
                        
                        <button
                          onClick={handleNext}
                          className="bg-white/90 backdrop-blur-sm text-gray-800 p-3 rounded-full hover:bg-white transition-all duration-300 transform hover:scale-110 shadow-lg"
                        >
                          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </button>
                      </>
                    )}

                    {/* Delete Button */}
                    <button
                      onClick={() => setShowDeleteConfirm(true)}
                      className="bg-red-500/90 backdrop-blur-sm text-white p-3 rounded-full hover:bg-red-600 transition-all duration-300 transform hover:scale-110 shadow-lg"
                    >
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
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
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                      </button>
                      
                      <span className="text-white text-sm flex items-center px-2">
                        {currentIndex + 1}/{total}
                      </span>
                      
                      <button
                        onClick={handleNext}
                        className="text-white p-2 hover:bg-white/20 rounded-full transition-all"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Banner Info Footer */}
              <div className="p-6 bg-gradient-to-r from-gray-50 to-blue-50">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
                  <div>
                    <h4 className="font-semibold text-gray-800 text-lg">Banner {currentIndex + 1}</h4>
                    <p className="text-gray-600 text-sm">
                      Active since: {new Date(currentImage.createdAt || Date.now()).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                  </div>
                  
                  {/* Quick Actions */}
                  <div className="flex space-x-3 mt-4 sm:mt-0">
                    <div className="text-xs bg-green-100 text-green-800 px-3 py-1 rounded-full font-medium">
                      Active
                    </div>
                  
                  </div>
                </div>
              </div>
            </div>

            {/* Thumbnail Strip */}
            {total > 1 && (
              <div className="mt-6 bg-white/80 backdrop-blur-sm p-4 rounded-2xl shadow-lg border border-white/20">
                <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                  <span className="text-purple-600 mr-2"></span>
                  All Banners
                </h4>
                <div className="flex space-x-4 overflow-x-auto pb-2">
                  {featureImageList.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentIndex(index)}
                      className={`flex-shrink-0 relative group ${
                        index === currentIndex ? 'ring-4 ring-purple-500' : ''
                      }`}
                    >
                      <img
                        src={image.image}
                        alt={`Thumbnail ${index + 1}`}
                        className="w-20 h-16 sm:w-24 sm:h-20 object-cover rounded-lg transition-all duration-300 group-hover:scale-110"
                      />
                      <div className={`absolute inset-0 rounded-lg transition-all duration-300 ${
                        index === currentIndex 
                          ? 'bg-purple-500/30' 
                          : 'bg-transparent group-hover:bg-black/20'
                      }`}>
                        {index === currentIndex && (
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="bg-purple-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">
                              ✓
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
        </div>

        {/* Delete Confirmation Modal */}
        {showDeleteConfirm && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 transform animate-pulse">
              <div className="text-center">
                <div className="text-red-500 text-6xl mb-4">⚠️</div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">Delete Banner?</h3>
                <p className="text-gray-600 mb-6">
                  Are you sure you want to delete banner #{currentIndex + 1}? This action cannot be undone.
                </p>
                
                <div className="flex space-x-4">
                  <Button
                    onClick={() => setShowDeleteConfirm(false)}
                    className="flex-1 bg-gray-200 text-gray-800 hover:bg-gray-300 transition-all duration-300"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleDelete}
                    className="flex-1 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white transition-all duration-300"
                  >
                    🗑️ Delete
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