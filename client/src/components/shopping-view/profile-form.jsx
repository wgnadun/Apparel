import React, { useState, useMemo } from 'react';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Separator } from '../ui/separator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { COUNTRIES, findCountryByCodeOrName } from '../../utils/countries';
import { toast } from 'sonner';
import ReactCountryFlag from 'react-country-flag';

const ProfileForm = ({ user, onProfileUpdate }) => {
  const initialCountry = useMemo(() => findCountryByCodeOrName(user?.country) || findCountryByCodeOrName('US'), [user]);
  const [formData, setFormData] = useState({
    userName: user?.userName || '',
    email: user?.email || '',
    phone: user?.phone || '',
    country: initialCountry?.name || ''
  });
  const [isUpdating, setIsUpdating] = useState(false);

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
      const response = await fetch('http://localhost:5000/api/shop/user/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
        toast.success(data.message);
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

          <Button
            type="submit"
            disabled={isUpdating}
            className="w-full"
          >
            {isUpdating ? 'Updating...' : 'Update Profile'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default ProfileForm;

