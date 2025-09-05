# Profile Picture Update Feature

This document describes the implementation of the profile picture update functionality for logged-in users.

## Features

### Backend API Endpoints

1. **GET /api/shop/user/profile** - Get user profile information
2. **PUT /api/shop/user/profile** - Update user profile information (excluding password and image)
3. **POST /api/shop/user/profile/picture** - Upload new profile picture
4. **PUT /api/shop/user/profile/picture** - Update existing profile picture
5. **DELETE /api/shop/user/profile/picture** - Remove profile picture

### Frontend Components

1. **ProfilePictureUpload** - Component for uploading and managing profile pictures
2. **ProfileForm** - Component for updating user profile information
3. **Updated UserProfile Page** - Complete profile management page

## Implementation Details

### Backend

#### User Model
- Already includes `image` field for storing profile picture URL
- Uses Cloudinary for image storage

#### User Controller (`server/controllers/shop/user-controller.js`)
- `uploadProfilePicture()` - Handles new profile picture uploads
- `updateProfilePicture()` - Handles profile picture updates
- `getUserProfile()` - Retrieves user profile data
- `updateUserProfile()` - Updates user profile information
- `removeProfilePicture()` - Removes profile picture

#### User Routes (`server/routes/shop/user-rotes.js`)
- All routes require authentication via `authMiddleware`
- Uses multer for file upload handling
- Supports image upload, update, and removal

### Frontend

#### ProfilePictureUpload Component
- Supports drag-and-drop and click-to-upload
- File validation (type and size)
- Real-time preview
- Upload progress indication
- Remove picture functionality

#### ProfileForm Component
- Form for updating user information
- Real-time validation
- Success/error notifications

#### UserProfile Page
- Complete profile management interface
- Responsive design
- Loading states
- Error handling

## Usage

### For Users

1. Navigate to the profile page
2. Upload a new profile picture or update existing one
3. Update profile information
4. Remove profile picture if needed

### File Requirements

- **Supported formats**: JPG, PNG, GIF
- **Maximum size**: 5MB
- **Aspect ratio**: Any (will be displayed as circular avatar)

### API Usage Examples

#### Upload Profile Picture
```javascript
const formData = new FormData();
formData.append('image', file);

const response = await fetch('/api/shop/user/profile/picture', {
  method: 'POST',
  body: formData,
  credentials: 'include'
});
```

#### Update Profile Picture
```javascript
const formData = new FormData();
formData.append('image', file);

const response = await fetch('/api/shop/user/profile/picture', {
  method: 'PUT',
  body: formData,
  credentials: 'include'
});
```

#### Get User Profile
```javascript
const response = await fetch('/api/shop/user/profile', {
  credentials: 'include'
});
```

## Security Features

- Authentication required for all profile operations
- File type validation
- File size limits
- Secure image storage via Cloudinary
- CORS configuration for secure cross-origin requests

## Error Handling

- Comprehensive error messages
- User-friendly notifications
- Graceful fallbacks for missing images
- Loading states for better UX

## Dependencies

### Backend
- `cloudinary` - Image storage and processing
- `multer` - File upload handling
- `mongoose` - Database operations

### Frontend
- `@radix-ui/react-avatar` - Avatar component
- `sonner` - Toast notifications
- `react-router-dom` - Navigation

## Future Enhancements

1. Image cropping functionality
2. Multiple image formats support
3. Image compression
4. Profile picture history
5. Social media integration

