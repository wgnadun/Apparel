import React, { useState, useMemo, useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { useDispatch } from 'react-redux';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Separator } from '../ui/separator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { COUNTRIES, findCountryByCodeOrName } from '../../utils/countries';
import { toast } from 'sonner';
import ReactCountryFlag from 'react-country-flag';
import { ArrowLeft, Save } from 'lucide-react';
import { auth0Config } from '../../config/auth0';
import { updateUser } from '../../store/auth-slice';
import { useFormValidation } from '../../hooks/useFormValidation';
import { profileSchema, fieldHints } from '../../utils/validation';

const ProfileForm = ({ user, onProfileUpdate, onBackToProfile }) => {
  const initialCountry = useMemo(() => findCountryByCodeOrName(user?.country) || findCountryByCodeOrName('US'), [user]);
  const { getAccessTokenSilently } = useAuth0();
  const dispatch = useDispatch();
  
  // Create initial form data
  const getInitialFormData = () => ({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    userName: user?.userName || '',
    email: user?.email || '',
    phone: user?.phone || '',
    country: initialCountry?.name || ''
  });

  const [isUpdating, setIsUpdating] = useState(false);
  
  // Use validation hook with safe initial data
  const {
    formData,
    handleInputChange,
    handleFieldBlur,
    handleSubmit,
    getFieldError,
    hasFieldError,
    isFormValid,
    hasFormChanged,
    resetForm
  } = useFormValidation(profileSchema, {
    firstName: '',
    lastName: '',
    userName: '',
    email: '',
    phone: '',
    country: ''
  });

  // Update form data when user changes
  useEffect(() => {
    const newInitialData = getInitialFormData();
    resetForm(newInitialData);
  }, [user, initialCountry, resetForm]);

  const handleCountryChange = (countryCode) => {
    const selected = COUNTRIES.find(c => c.code === countryCode);
    if (!selected) return;

    const dial = selected.dialCode;
    let nextPhone = formData.phone || '';
    if (!nextPhone.startsWith(dial)) {
      // Strip existing leading +digits if present, then prepend new dial code
      nextPhone = nextPhone.replace(/^\+\d+\s?/, '');
      nextPhone = `${dial}${nextPhone ? ' ' : ''}${nextPhone}`;
    }
    
    handleInputChange('country', selected.name);
    handleInputChange('phone', nextPhone);
  };

  const handleFormSubmit = async (data) => {
    setIsUpdating(true);

    try {
      // Get Auth0 access token
      const token = await getAccessTokenSilently({
        audience: auth0Config.audience,
        scope: auth0Config.scope
      });

      const response = await fetch('http://localhost:5000/api/shop/user/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        credentials: 'include',
        body: JSON.stringify(data),
      });

      const responseData = await response.json();

      if (responseData.success) {
        toast.success(responseData.message);
        // Update Redux store with new user data
        dispatch(updateUser(responseData.data));
        if (onProfileUpdate) {
          onProfileUpdate(responseData.data);
        }
      } else {
        toast.error(responseData.message || 'Failed to update profile');
      }
    } catch (error) {
      console.error('Update error:', error);
      toast.error('Failed to update profile');
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="w-full">
      <div className="mb-6">
        <h3 className="text-xl font-bold text-gray-900 mb-2">
          Profile Information
          {hasFormChanged && (
            <span className="ml-2 text-sm text-blue-600 font-normal">(Changes made)</span>
          )}
        </h3>
        <p className="text-sm text-gray-600">Update your personal details below</p>
      </div>
      <div className="space-y-6">
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <Label htmlFor="firstName" className={`text-sm font-semibold ${hasFieldError('firstName') ? "text-red-500" : "text-gray-700"}`}>
                First Name <span className="text-red-500">*</span>
              </Label>
              <Input
                id="firstName"
                name="firstName"
                type="text"
                value={formData.firstName}
                onChange={(e) => handleInputChange('firstName', e.target.value)}
                onBlur={() => handleFieldBlur('firstName')}
                placeholder={fieldHints.firstName}
                className={`h-12 rounded-xl border-2 transition-all duration-300 focus:ring-2 focus:ring-blue-500/20 ${hasFieldError('firstName') ? "border-red-500 focus:border-red-500" : "border-gray-200 focus:border-blue-500"}`}
                required
              />
              {getFieldError('firstName') && (
                <p className="text-sm text-red-500 font-medium">{getFieldError('firstName')}</p>
              )}
            </div>
            <div className="space-y-3">
              <Label htmlFor="lastName" className={`text-sm font-semibold ${hasFieldError('lastName') ? "text-red-500" : "text-gray-700"}`}>
                Last Name <span className="text-red-500">*</span>
              </Label>
              <Input
                id="lastName"
                name="lastName"
                type="text"
                value={formData.lastName}
                onChange={(e) => handleInputChange('lastName', e.target.value)}
                onBlur={() => handleFieldBlur('lastName')}
                placeholder={fieldHints.lastName}
                className={`h-12 rounded-xl border-2 transition-all duration-300 focus:ring-2 focus:ring-blue-500/20 ${hasFieldError('lastName') ? "border-red-500 focus:border-red-500" : "border-gray-200 focus:border-blue-500"}`}
                required
              />
              {getFieldError('lastName') && (
                <p className="text-sm text-red-500 font-medium">{getFieldError('lastName')}</p>
              )}
            </div>
          </div>

          <div className="space-y-3">
            <Label htmlFor="userName" className={`text-sm font-semibold ${hasFieldError('userName') ? "text-red-500" : "text-gray-700"}`}>
              Username <span className="text-red-500">*</span>
            </Label>
            <Input
              id="userName"
              name="userName"
              type="text"
              value={formData.userName}
              onChange={(e) => handleInputChange('userName', e.target.value)}
              onBlur={() => handleFieldBlur('userName')}
              placeholder={fieldHints.userName}
              className={`h-12 rounded-xl border-2 transition-all duration-300 focus:ring-2 focus:ring-blue-500/20 ${hasFieldError('userName') ? "border-red-500 focus:border-red-500" : "border-gray-200 focus:border-blue-500"}`}
              required
            />
            {getFieldError('userName') && (
              <p className="text-sm text-red-500 font-medium">{getFieldError('userName')}</p>
            )}
          </div>

          <div className="space-y-3">
            <Label htmlFor="email" className={`text-sm font-semibold ${hasFieldError('email') ? "text-red-500" : "text-gray-700"}`}>
              Email <span className="text-red-500">*</span>
            </Label>
            <Input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              onBlur={() => handleFieldBlur('email')}
              placeholder={fieldHints.email}
              className={`h-12 rounded-xl border-2 transition-all duration-300 focus:ring-2 focus:ring-blue-500/20 ${hasFieldError('email') ? "border-red-500 focus:border-red-500" : "border-gray-200 focus:border-blue-500"}`}
              required
            />
            {getFieldError('email') && (
              <p className="text-sm text-red-500 font-medium">{getFieldError('email')}</p>
            )}
          </div>

          <div className="space-y-3">
            <Label htmlFor="country" className={`text-sm font-semibold ${hasFieldError('country') ? "text-red-500" : "text-gray-700"}`}>
              Country <span className="text-red-500">*</span>
            </Label>
            <Select
              value={(findCountryByCodeOrName(formData.country)?.code) || ''}
              onValueChange={handleCountryChange}
            >
              <SelectTrigger className={`h-12 rounded-xl border-2 transition-all duration-300 focus:ring-2 focus:ring-blue-500/20 ${hasFieldError('country') ? "border-red-500 focus:border-red-500" : "border-gray-200 focus:border-blue-500"}`}>
                <SelectValue placeholder={fieldHints.country} />
              </SelectTrigger>
              <SelectContent className="rounded-xl border-2 border-gray-200">
                {COUNTRIES.map((c) => (
                  <SelectItem key={c.code} value={c.code} className="rounded-lg">
                    <ReactCountryFlag svg countryCode={c.code} style={{ width: '1.2em', height: '1.2em' }} />
                    <span className="ml-2">{c.name}</span>
                    <span className="text-muted-foreground ml-1">({c.dialCode})</span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {getFieldError('country') && (
              <p className="text-sm text-red-500 font-medium">{getFieldError('country')}</p>
            )}
          </div>

          <div className="space-y-3">
            <Label htmlFor="phone" className={`text-sm font-semibold ${hasFieldError('phone') ? "text-red-500" : "text-gray-700"}`}>
              Phone Number
            </Label>
            <Input
              id="phone"
              name="phone"
              type="tel"
              value={formData.phone}
              onChange={(e) => handleInputChange('phone', e.target.value)}
              onBlur={() => handleFieldBlur('phone')}
              placeholder={fieldHints.phone}
              className={`h-12 rounded-xl border-2 transition-all duration-300 focus:ring-2 focus:ring-blue-500/20 ${hasFieldError('phone') ? "border-red-500 focus:border-red-500" : "border-gray-200 focus:border-blue-500"}`}
            />
            {getFieldError('phone') && (
              <p className="text-sm text-red-500 font-medium">{getFieldError('phone')}</p>
            )}
          </div>

          <div className="border-t border-gray-200 pt-6">
            {/* Premium Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={onBackToProfile}
                className="flex-1 h-12 border-2 border-gray-300 hover:border-gray-400 hover:bg-gray-50 rounded-xl font-semibold transition-all duration-300"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Profile
              </Button>
              
              <Button
                type="submit"
                disabled={isUpdating || !isFormValid}
                className="flex-1 h-12 bg-gray-900 hover:bg-gray-800 text-white font-semibold rounded-lg shadow-md hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isUpdating ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    Updating...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Update Profile
                  </>
                )}
              </Button>
            </div>

            {/* Validation Indicator */}
            {!isFormValid && (
              <div className="mt-4 p-4 bg-gray-50 border border-gray-200 rounded-lg">
                <p className="text-sm text-gray-600 text-center font-medium">
                  Please fill in all required fields correctly to enable the update button.
                </p>
              </div>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProfileForm;

