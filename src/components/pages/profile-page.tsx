/**
 * Profile Page - User Account Management
 *
 * Features:
 * - View and edit user profile information
 * - Change avatar
 * - Update personal details
 * - Change password
 * - Account security settings
 */

import { useState } from 'react';
import { Camera, Mail, User as UserIcon, Save, Edit } from 'lucide-react';
import { Card } from '@atoms/card';
import { Button } from '@atoms/button';
import { Input } from '@atoms/input';
import { Label } from '@atoms/label';
import { UserAvatar } from '@/components/molecules/user-avatar';
import { useAuth } from '@/features/auth';
import { cn } from '@/utils';
import { Separator } from '@atoms/separator';

interface Props extends React.ComponentProps<'div'> { }

export const ProfilePage = ({ className, ...rest }: Props) => {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    fullName: user?.full_name || '',
    email: user?.email || '',
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSave = () => {
    // TODO: Implement save logic
    console.log('Saving profile:', formData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setFormData({
      fullName: user?.full_name || '',
      email: user?.email || '',
    });
    setIsEditing(false);
  };

  return (
    <div className={cn('min-h-screen bg-background pb-10 md:pb-8', className)} {...rest}>
      <div className="container mx-auto max-w-2xl py-6 space-y-6">
        {/* Avatar Section */}
        <Card className="p-6 bg-muted shadow-none">
          <div className="flex flex-col items-center gap-4">
            <div className="relative">
              <UserAvatar
                name={user?.full_name || 'User'}
                imageUrl={user?.user_image}
                size="xl"
                showBorder
                className="ring-4 ring-background shadow-lg"
              />
              <button
                className="absolute -bottom-1 -right-1 p-2 rounded-full bg-primary text-primary-foreground shadow-lg hover:bg-primary/90 transition-colors"
                onClick={() => console.log('Change avatar')}
              >
                <Camera className="h-4 w-4" />
              </button>
            </div>
            <div className="text-center">
              <h2 className="text-xl font-semibold">{user?.full_name || 'User Name'}</h2>
              <p className="text-sm text-muted-foreground">{user?.name || 'user@example.com'}</p>
            </div>
          </div>
        </Card>

        {/* Profile Information */}
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-semibold">Personal Info</h3>
          {!isEditing ? (
            <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
              <Edit className="h-4 w-4 mr-1" />
              Edit
            </Button>
          ) : (
            <div className="flex gap-2">
              <Button variant="ghost" size="sm" onClick={handleCancel}>
                Cancel
              </Button>
              <Button size="sm" onClick={handleSave}>
                <Save className="h-4 w-4 mr-2" />
                Save
              </Button>
            </div>
          )}
        </div>
        <Card className="p-6">
          <div className="space-y-4">
            {/* Full Name */}
            <div className="space-y-2">
              <Label htmlFor="fullName" className="flex items-center gap-2">
                <UserIcon className="h-4 w-4 text-muted-foreground" />
                Full Name
              </Label>
              <Input
                id="fullName"
                value={formData.fullName}
                onChange={(e) => handleInputChange('fullName', e.target.value)}
                disabled={!isEditing}
                className={cn(!isEditing && 'border-none bg-transparent p-0')}
              />
            </div>

            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email" className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-muted-foreground" />
                Email
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="Not updated"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                disabled={!isEditing}
                className={cn(!isEditing && 'border-none bg-transparent p-0')}
              />
            </div>
          </div>
        </Card>

        {/* Account Details */}
        <h3 className="font-semibold mb-2">Account Details</h3>
        <Card className="p-4  ">
          <div className="space-y-3 text-sm">
           
            <div className="flex justify-between py-2">
              <span className="text-muted-foreground">Account Status</span>
              <span className="font-medium text-green-600 dark:text-green-400">Active</span>
            </div>
            <Separator />
            <div className="flex justify-between py-2">
              <span className="text-muted-foreground">Member Since</span>
              <span className="font-medium">{new Date().toLocaleDateString()}</span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};
