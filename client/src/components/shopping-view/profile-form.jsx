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
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">
          Profile Information
          {hasFormChanged && (
            <span className="ml-2 text-sm text-blue-600 font-normal">(Changes made)</span>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName" className={hasFieldError('firstName') ? "text-red-500" : ""}>
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
                className={hasFieldError('firstName') ? "border-red-500 focus:border-red-500" : ""}
                required
              />
              {getFieldError('firstName') && (
                <p className="text-sm text-red-500">{getFieldError('firstName')}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName" className={hasFieldError('lastName') ? "text-red-500" : ""}>
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
                className={hasFieldError('lastName') ? "border-red-500 focus:border-red-500" : ""}
                required
              />
              {getFieldError('lastName') && (
                <p className="text-sm text-red-500">{getFieldError('lastName')}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="userName" className={hasFieldError('userName') ? "text-red-500" : ""}>
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
              className={hasFieldError('userName') ? "border-red-500 focus:border-red-500" : ""}
              required
            />
            {getFieldError('userName') && (
              <p className="text-sm text-red-500">{getFieldError('userName')}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="email" className={hasFieldError('email') ? "text-red-500" : ""}>
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
              className={hasFieldError('email') ? "border-red-500 focus:border-red-500" : ""}
              required
            />
            {getFieldError('email') && (
              <p className="text-sm text-red-500">{getFieldError('email')}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="country" className={hasFieldError('country') ? "text-red-500" : ""}>
              Country <span className="text-red-500">*</span>
            </Label>
            <Select
              value={(findCountryByCodeOrName(formData.country)?.code) || ''}
              onValueChange={handleCountryChange}
            >
              <SelectTrigger className={`w-full ${hasFieldError('country') ? "border-red-500 focus:border-red-500" : ""}`}>
                <SelectValue placeholder={fieldHints.country} />
              </SelectTrigger>
              <SelectContent>
                {COUNTRIES.map((c) => (
                  <SelectItem key={c.code} value={c.code}>
                    <ReactCountryFlag svg countryCode={c.code} style={{ width: '1.2em', height: '1.2em' }} />
                    <span>{c.name}</span>
                    <span className="text-muted-foreground">({c.dialCode})</span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {getFieldError('country') && (
              <p className="text-sm text-red-500">{getFieldError('country')}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone" className={hasFieldError('phone') ? "text-red-500" : ""}>
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
              className={hasFieldError('phone') ? "border-red-500 focus:border-red-500" : ""}
            />
            {getFieldError('phone') && (
              <p className="text-sm text-red-500">{getFieldError('phone')}</p>
            )}
          </div>

          <Separator />

          {/* Action Buttons */}
          <div className="flex gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={onBackToProfile}
              className="flex-1"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Profile
            </Button>
            
            <Button
              type="submit"
              disabled={isUpdating || !isFormValid}
              className="flex-1"
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
            <p className="text-sm text-slate-500 text-center">
              Please fill in all required fields correctly to enable the update button.
            </p>
          )}
        </form>
      </CardContent>
    </Card>
  );
};

export default ProfileForm;

