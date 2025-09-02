import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Separator } from '../../components/ui/separator';
import { toast } from 'sonner';
import ProfilePictureUpload from '../../components/shopping-view/profile-picture-upload';
import ProfileForm from '../../components/shopping-view/profile-form';
import { Avatar, AvatarFallback, AvatarImage } from '../../components/ui/avatar';
import { COUNTRIES, findCountryByCodeOrName } from '../../utils/countries';
import ReactCountryFlag from 'react-country-flag';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar, 
  Shield, 
  Settings, 
  ArrowLeft,
  Home,
  Edit3,
  Check
} from 'lucide-react';

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
    toast.success('Profile updated successfully');
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getRoleColor = (role) => {
    switch (role?.toLowerCase()) {
      case 'admin': return 'bg-red-100 text-red-800 border-red-200';
      case 'user': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'premium': return 'bg-purple-100 text-purple-800 border-purple-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <Card className="w-96 shadow-lg">
          <CardContent className="pt-6">
            <div className="text-center space-y-4">
              <div className="animate-spin rounded-full h-12 w-12 border-2 border-blue-600 border-t-transparent mx-auto"></div>
              <div className="space-y-2">
                <h3 className="text-lg font-semibold text-slate-800">Loading Profile</h3>
                <p className="text-sm text-slate-600">Please wait while we fetch your information...</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <Card className="w-96 shadow-lg">
          <CardContent className="pt-6">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto">
                <User className="w-8 h-8 text-red-600" />
              </div>
              <div className="space-y-2">
                <h3 className="text-lg font-semibold text-slate-800">Profile Not Found</h3>
                <p className="text-sm text-slate-600">Unable to load your profile information.</p>
              </div>
              <Button onClick={() => navigate('/login')} className="w-full">
                Go to Login
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <Separator orientation="vertical" className="h-6" />
              <div>
                <h1 className="text-3xl font-bold text-slate-900">Profile</h1>
                <p className="text-slate-600 mt-1">
                  {showSettings ? 'Update your personal information' : 'View and manage your account'}
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              {showSettings ? null : (
                <Button 
                  onClick={() => setShowSettings(true)}
                  className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700"
                >
                  <Settings className="w-4 h-4" />
                  <span>Edit Profile</span>
                </Button>
              )}
            </div>
          </div>
        </div>

        {showSettings ? (
          /* Edit Mode */
          <div className="space-y-8">
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
              {/* Profile Picture Section */}
              <div className="xl:col-span-1">
                <Card className="shadow-sm border-slate-200">
                  <CardHeader className="pb-4">
                    <CardTitle className="flex items-center space-x-2 text-slate-800">
                      <Edit3 className="w-5 h-5" />
                      <span>Profile Picture</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ProfilePictureUpload 
                      user={user} 
                      onProfileUpdate={handleProfileUpdate}
                    />
                  </CardContent>
                </Card>
              </div>

              {/* Profile Form Section */}
              <div className="xl:col-span-2">
                <Card className="shadow-sm border-slate-200">
                  <CardHeader className="pb-4">
                    <CardTitle className="flex items-center space-x-2 text-slate-800">
                      <User className="w-5 h-5" />
                      <span>Personal Information</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                                         <ProfileForm 
                       user={user} 
                       onProfileUpdate={handleProfileUpdate}
                       onBackToProfile={() => setShowSettings(false)}
                     />
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        ) : (
          /* View Mode */
          <div className="space-y-8">
            {/* Profile Header Card */}
            <Card className="shadow-lg border-slate-200 bg-white">
              <CardContent className="pt-8">
                <div className="flex flex-col md:flex-row items-start md:items-center space-y-6 md:space-y-0 md:space-x-8">
                  {/* Avatar */}
                  <div className="flex-shrink-0">
                    <div className="relative">
                      <Avatar className="h-24 w-24 ring-4 ring-white shadow-lg">
                        <AvatarImage src={user?.image} alt={user?.userName || 'Profile'} />
                        <AvatarFallback className="text-2xl font-semibold bg-gradient-to-br from-blue-500 to-blue-600 text-white">
                          {user?.userName?.charAt(0)?.toUpperCase() || 'U'}
                        </AvatarFallback>
                      </Avatar>
                      <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-2 border-white"></div>
                    </div>
                  </div>

                  {/* User Info */}
                  <div className="flex-grow space-y-4">
                                                               <div>
                        <h2 className="text-2xl font-bold text-slate-900 mb-1">
                          {user.firstName && user.lastName ? `${user.firstName} ${user.lastName}` : user.userName || 'Unnamed User'}
                        </h2>
                        <div className="flex items-center space-x-2">
                          <User className="w-4 h-4 text-slate-500" />
                          <span className="text-slate-600">{user.userName}</span>
                        </div>
                      </div>
                    
                    <div className="flex flex-wrap items-center gap-4">
                      <Badge variant="outline" className={`${getRoleColor(user.role)} font-medium`}>
                        <Shield className="w-3 h-3 mr-1" />
                        {user.role || 'User'}
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Details Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Contact Information */}
              <Card className="shadow-sm border-slate-200">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center space-x-2 text-slate-800">
                    <span>Contact Information</span>
                  </CardTitle>
                </CardHeader>
                                 <CardContent className="space-y-6">
                   <div className="space-y-4">
                     <div className="flex items-start space-x-3 p-3 rounded-lg bg-slate-50">
                       <User className="w-5 h-5 text-slate-500 mt-0.5" />
                       <div>
                         <p className="text-sm font-medium text-slate-700">Full Name</p>
                         <p className="text-slate-900 font-medium">
                           {user.firstName && user.lastName ? `${user.firstName} ${user.lastName}` : 'Not provided'}
                         </p>
                       </div>
                     </div>
                     
                     <div className="flex items-start space-x-3 p-3 rounded-lg bg-slate-50">
                       <User className="w-5 h-5 text-slate-500 mt-0.5" />
                       <div>
                         <p className="text-sm font-medium text-slate-700">Username</p>
                         <p className="text-slate-900 font-medium">{user.userName || 'Not provided'}</p>
                       </div>
                     </div>
                     
                     <div className="flex items-start space-x-3 p-3 rounded-lg bg-slate-50">
                       <Mail className="w-5 h-5 text-slate-500 mt-0.5" />
                       <div>
                         <p className="text-sm font-medium text-slate-700">Email Address</p>
                         <p className="text-slate-900 font-medium">{user.email}</p>
                       </div>
                     </div>
                    
                    <div className="flex items-start space-x-3 p-3 rounded-lg bg-slate-50">
                      <Phone className="w-5 h-5 text-slate-500 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-slate-700">Phone Number</p>
                        <p className="text-slate-900 font-medium">{user.phone || 'Not provided'}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-3 p-3 rounded-lg bg-slate-50">
                      <MapPin className="w-5 h-5 text-slate-500 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-slate-700">Country</p>
                        <div className="flex items-center space-x-2 mt-1">
                          {(() => {
                            const country = findCountryByCodeOrName(user.country);
                            return (
                              <>
                                {country?.code && (
                                  <ReactCountryFlag 
                                    svg 
                                    countryCode={country.code} 
                                    style={{ width: '1.25em', height: '1.25em' }} 
                                    className="rounded-sm"
                                  />
                                )}
                                <span className="text-slate-900 font-medium">
                                  {country?.name || user.country || 'Not specified'}
                                </span>
                              </>
                            );
                          })()}
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Account Details */}
              <Card className="shadow-sm border-slate-200">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center space-x-2 text-slate-800">
                    <Shield className="w-5 h-5" />
                    <span>Account Details</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-start space-x-3 p-3 rounded-lg bg-slate-50">
                      <User className="w-5 h-5 text-slate-500 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-slate-700">User ID</p>
                        <p className="text-slate-900 font-mono text-sm break-all">{user._id}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-3 p-3 rounded-lg bg-slate-50">
                      <Shield className="w-5 h-5 text-slate-500 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-slate-700">Account Type</p>
                        <Badge variant="outline" className={`${getRoleColor(user.role)} mt-1`}>
                          {user.role || 'User'}
                        </Badge>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-3 p-3 rounded-lg bg-slate-50">
                      <Calendar className="w-5 h-5 text-slate-500 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-slate-700">Last Updated</p>
                        <p className="text-slate-900 font-medium">{formatDate(user.updatedAt)}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Action Bar */}
            <div className="flex justify-center pt-4">
              <Button 
                variant="outline" 
                onClick={() => navigate('/')}
                className="flex items-center space-x-2 px-8 py-2"
              >
                <Home className="w-4 h-4" />
                <span>Return to Home</span>
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default UserProfile;