import React, { useState, useRef } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { useDispatch } from 'react-redux';
import { Button } from '../ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Separator } from '../ui/separator';
import { toast } from 'sonner';
import { auth0Config } from '../../config/auth0';
import { updateUser } from '../../store/auth-slice';

const ProfilePictureUpload = ({ user, onProfileUpdate }) => {
  const [isUploading, setIsUploading] = useState(false);
  const [isRemoving, setIsRemoving] = useState(false);
  const fileInputRef = useRef(null);
  const { getAccessTokenSilently } = useAuth0();
  const dispatch = useDispatch();

  const handleFileSelect = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please select a valid image file');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size should be less than 5MB');
      return;
    }

    await uploadProfilePicture(file);
  };

  const uploadProfilePicture = async (file) => {
    setIsUploading(true);
    
    try {
      // Get Auth0 access token
      const token = await getAccessTokenSilently({
        audience: auth0Config.audience,
        scope: auth0Config.scope
      });

      const formData = new FormData();
      formData.append('image', file);

      const response = await fetch('http://localhost:5000/api/shop/user/profile/picture', {
        method: user?.image ? 'PUT' : 'POST', // PUT for update, POST for new upload
        body: formData,
        credentials: 'include',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();

      if (data.success) {
        toast.success(data.message);
        // Update Redux store with new user data
        dispatch(updateUser(data.data.user));
        if (onProfileUpdate) {
          onProfileUpdate(data.data.user);
        }
      } else {
        toast.error(data.message || 'Failed to upload profile picture');
      }
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Failed to upload profile picture');
    } finally {
      setIsUploading(false);
    }
  };

  const removeProfilePicture = async () => {
    setIsRemoving(true);
    
    try {
      // Get Auth0 access token
      const token = await getAccessTokenSilently({
        audience: auth0Config.audience,
        scope: auth0Config.scope
      });

      const response = await fetch('http://localhost:5000/api/shop/user/profile/picture', {
        method: 'DELETE',
        credentials: 'include',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();

      if (data.success) {
        toast.success(data.message);
        // Update Redux store with new user data
        dispatch(updateUser(data.data));
        if (onProfileUpdate) {
          onProfileUpdate(data.data);
        }
      } else {
        toast.error(data.message || 'Failed to remove profile picture');
      }
    } catch (error) {
      console.error('Remove error:', error);
      toast.error('Failed to remove profile picture');
    } finally {
      setIsRemoving(false);
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="w-full">
      <div className="flex flex-col items-center space-y-6">
        {/* Clean Avatar Display */}
        <div className="relative">
          <Avatar className="h-32 w-32 ring-4 ring-gray-100 shadow-lg">
            <AvatarImage 
              src={user?.image} 
              alt={user?.userName || 'Profile'} 
              className="object-cover"
            />
            <AvatarFallback className="text-3xl font-bold bg-gray-800 text-white">
              {user?.userName?.charAt(0)?.toUpperCase() || 'U'}
            </AvatarFallback>
          </Avatar>
          <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-500 rounded-full border-4 border-white shadow-md"></div>
        </div>
        
        <div className="text-center">
          <p className="text-sm font-semibold text-gray-700">
            {user?.image ? 'Current profile picture' : 'No profile picture set'}
          </p>
          <p className="text-xs text-gray-500 mt-1">Click below to upload or change</p>
        </div>

        <div className="w-full space-y-4">
          <div>
            <Label htmlFor="profile-picture" className="text-sm font-semibold text-gray-700">
              Upload New Picture
            </Label>
            <Input
              id="profile-picture"
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              className="hidden"
            />
          </div>

          <div className="flex flex-col space-y-3">
            <Button
              onClick={handleUploadClick}
              disabled={isUploading}
              className="w-full h-12 bg-gray-900 hover:bg-gray-800 text-white font-semibold rounded-lg shadow-md hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isUploading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Uploading...
                </>
              ) : (
                <>
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                  {user?.image ? 'Change Picture' : 'Upload Picture'}
                </>
              )}
            </Button>

            {user?.image && (
              <Button
                variant="outline"
                onClick={removeProfilePicture}
                disabled={isRemoving}
                className="w-full h-12 border-2 border-red-200 hover:border-red-500 hover:bg-red-50 hover:text-red-700 rounded-xl font-semibold transition-all duration-300 disabled:opacity-50"
              >
                {isRemoving ? (
                  <>
                    <div className="w-4 h-4 border-2 border-red-500 border-t-transparent rounded-full animate-spin mr-2"></div>
                    Removing...
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                    Remove Picture
                  </>
                )}
              </Button>
            )}
          </div>
        </div>

        <div className="w-full p-4 bg-gray-50 rounded-lg border border-gray-200">
          <div className="text-xs text-gray-600 text-center space-y-1">
            <p className="font-semibold">Supported formats: JPG, PNG, GIF</p>
            <p>Maximum size: 5MB</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePictureUpload;

