import React, { useState, useRef } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { Button } from '../ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Separator } from '../ui/separator';
import { toast } from 'sonner';
import { auth0Config } from '../../config/auth0';

const ProfilePictureUpload = ({ user, onProfileUpdate }) => {
  const [isUploading, setIsUploading] = useState(false);
  const [isRemoving, setIsRemoving] = useState(false);
  const fileInputRef = useRef(null);
  const { getAccessTokenSilently } = useAuth0();

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
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Profile Picture</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-col items-center space-y-4">
          <Avatar className="h-24 w-24">
            <AvatarImage 
              src={user?.image} 
              alt={user?.userName || 'Profile'} 
            />
            <AvatarFallback className="text-lg">
              {user?.userName?.charAt(0)?.toUpperCase() || 'U'}
            </AvatarFallback>
          </Avatar>
          
          <div className="text-center">
            <p className="text-sm text-muted-foreground">
              {user?.image ? 'Current profile picture' : 'No profile picture set'}
            </p>
          </div>
        </div>

        <Separator />

        <div className="space-y-3">
          <div>
            <Label htmlFor="profile-picture" className="text-sm font-medium">
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

          <div className="flex flex-col space-y-2">
            <Button
              onClick={handleUploadClick}
              disabled={isUploading}
              className="w-full"
            >
              {isUploading ? 'Uploading...' : user?.image ? 'Change Picture' : 'Upload Picture'}
            </Button>

            {user?.image && (
              <Button
                variant="outline"
                onClick={removeProfilePicture}
                disabled={isRemoving}
                className="w-full"
              >
                {isRemoving ? 'Removing...' : 'Remove Picture'}
              </Button>
            )}
          </div>
        </div>

        <div className="text-xs text-muted-foreground text-center">
          <p>Supported formats: JPG, PNG, GIF</p>
          <p>Maximum size: 5MB</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProfilePictureUpload;

