import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Separator } from '../../components/ui/separator';
import { toast } from 'sonner';
import ProfilePictureUpload from '../../components/shopping-view/profile-picture-upload';
import ProfileForm from '../../components/shopping-view/profile-form';
import { Avatar, AvatarFallback, AvatarImage } from '../../components/ui/avatar';
import { COUNTRIES, findCountryByCodeOrName } from '../../utils/countries';
import ReactCountryFlag from 'react-country-flag';

function UserProfile() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showSettings, setShowSettings] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/shop/user/profile', {
        credentials: 'include',
      });

      if (response.status === 401) {
        toast.error('Please login to view your profile');
        navigate('/login');
        return;
      }

      const data = await response.json();

      if (data.success) {
        setUser(data.data);
      } else {
        toast.error(data.message || 'Failed to fetch profile');
      }
    } catch (error) {
      console.error('Fetch profile error:', error);
      toast.error('Failed to fetch profile');
    } finally {
      setLoading(false);
    }
  };

  const handleProfileUpdate = (updatedUser) => {
    setUser(updatedUser);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Profile Not Found</h2>
          <p className="text-gray-600 mb-4">Unable to load your profile information.</p>
          <Button onClick={() => navigate('/login')}>
            Go to Login
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">My Profile</h1>
              <p className="text-gray-600">
                {showSettings ? 'Manage your account information and profile picture' : 'View your profile details'}
              </p>
            </div>
            <div className="flex items-center gap-3">
              {showSettings ? (
                <Button variant="outline" onClick={() => setShowSettings(false)}>
                  Back to Profile
                </Button>
              ) : (
                <Button onClick={() => setShowSettings(true)}>
                  Profile Settings
                </Button>
              )}
            </div>
          </div>

          {showSettings ? (
            <>
              {/* Profile Content - Editable */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Profile Picture Section */}
                <div className="space-y-6">
                  <ProfilePictureUpload 
                    user={user} 
                    onProfileUpdate={handleProfileUpdate}
                  />
                </div>

                {/* Profile Information Section */}
                <div className="space-y-6">
                  <ProfileForm 
                    user={user} 
                    onProfileUpdate={handleProfileUpdate}
                  />
                </div>
              </div>
            </>
          ) : (
            <>
              {/* Profile Details - Read Only */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg font-semibold">Personal Details</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-4 mb-4">
                      <Avatar className="h-16 w-16">
                        <AvatarImage src={user?.image} alt={user?.userName || 'Profile'} />
                        <AvatarFallback className="text-lg">
                          {user?.userName?.charAt(0)?.toUpperCase() || 'U'}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-base font-semibold text-gray-900">{user.userName || '-'}</p>
                        <p className="text-sm text-gray-600">{user.email || '-'}</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 gap-4">
                      <div>
                        <p className="text-sm font-medium text-gray-500">Phone</p>
                        <p className="text-sm text-gray-900">{user.phone || '-'}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">Country</p>
                        <div className="flex items-center gap-2">
                          {(() => {
                            const c = findCountryByCodeOrName(user.country);
                            return (
                              <>
                                {c?.code && (
                                  <ReactCountryFlag svg countryCode={c.code} style={{ width: '1.2em', height: '1.2em' }} />
                                )}
                                <span className="text-sm text-gray-900">{c?.name || user.country || '-'}</span>
                              </>
                            );
                          })()}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg font-semibold">Account Information</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 gap-4">
                      <div>
                        <p className="text-sm font-medium text-gray-500">User ID</p>
                        <p className="text-sm text-gray-900">{user._id}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">Role</p>
                        <p className="text-sm text-gray-900 capitalize">{user.role}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">Member Since</p>
                        <p className="text-sm text-gray-900">{new Date(user.createdAt).toLocaleDateString()}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">Last Updated</p>
                        <p className="text-sm text-gray-900">{new Date(user.updatedAt).toLocaleDateString()}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </>
          )}

          {/* Back to Home Button */}
          <div className="mt-8 text-center">
            <Button 
              variant="outline" 
              onClick={() => navigate('/')}
              className="px-8"
            >
              Back to Home
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserProfile;
