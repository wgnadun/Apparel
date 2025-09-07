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

  const [formData, setFormData] = useState(getInitialFormData());
  const [initialData, setInitialData] = useState(getInitialFormData());
  const [isUpdating, setIsUpdating] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  // Update initial data when user changes
  useEffect(() => {
    const newInitialData = getInitialFormData();
    setInitialData(newInitialData);
    setFormData(newInitialData);
  }, [user, initialCountry]);

  // Check for changes
  useEffect(() => {
    const changed = Object.keys(formData).some(key => formData[key] !== initialData[key]);
    setHasChanges(changed);
  }, [formData, initialData]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCountryChange = (countryCode) => {
    const selected = COUNTRIES.find(c => c.code === countryCode);
    if (!selected) return;

    setFormData(prev => {
      const dial = selected.dialCode;
      let nextPhone = prev.phone || '';
      if (!nextPhone.startsWith(dial)) {
        // Strip existing leading +digits if present, then prepend new dial code
        nextPhone = nextPhone.replace(/^\+\d+\s?/, '');
        nextPhone = `${dial}${nextPhone ? ' ' : ''}${nextPhone}`;
      }
      return {
        ...prev,
        country: selected.name,
        phone: nextPhone,
      };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
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
        body: JSON.stringify(formData),
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
        toast.error(data.message || 'Failed to update profile');
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
        <CardTitle className="text-lg font-semibold">Profile Information</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">First Name</Label>
              <Input
                id="firstName"
                name="firstName"
                type="text"
                value={formData.firstName}
                onChange={handleInputChange}
                placeholder="Enter your first name"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name</Label>
              <Input
                id="lastName"
                name="lastName"
                type="text"
                value={formData.lastName}
                onChange={handleInputChange}
                placeholder="Enter your last name"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="userName">Username</Label>
            <Input
              id="userName"
              name="userName"
              type="text"
              value={formData.userName}
              onChange={handleInputChange}
              placeholder="Enter your username"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="Enter your email"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="country">Country</Label>
            <Select
              value={(findCountryByCodeOrName(formData.country)?.code) || ''}
              onValueChange={handleCountryChange}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select your country" />
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
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number</Label>
            <Input
              id="phone"
              name="phone"
              type="tel"
              value={formData.phone}
              onChange={handleInputChange}
              placeholder="Enter your phone number"
            />
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
              disabled={isUpdating || !hasChanges}
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

          {/* Change Indicator */}
          {!hasChanges && (
            <p className="text-sm text-slate-500 text-center">
              No changes detected. Make changes to enable the update button.
            </p>
          )}
        </form>
      </CardContent>
    </Card>
  );
};

export default ProfileForm;

