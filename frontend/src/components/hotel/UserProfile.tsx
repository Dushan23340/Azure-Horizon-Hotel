import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { updateUserProfile } from '@/lib/api';
import { toast } from 'sonner';
import PasswordChangeModal from './PasswordChangeModal';

const UserProfile = () => {
  const { user, isAuthenticated, loading } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: ''
  });
  const [originalData, setOriginalData] = useState({
    name: '',
    email: '',
    phone: ''
  });
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);

  useEffect(() => {
    if (user) {
      const userData = {
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || ''
      };
      setFormData(userData);
      setOriginalData(userData);
    }
  }, [user]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Check if there are any changes
    const hasChanges = 
      formData.name !== originalData.name ||
      formData.email !== originalData.email ||
      formData.phone !== originalData.phone;
    
    if (!hasChanges) {
      toast.info('No changes made to your profile');
      setIsEditing(false);
      return;
    }
    
    setIsSaving(true);

    try {
      await updateUserProfile({
        name: formData.name,
        email: formData.email,
        phone: formData.phone
      });
      
      toast.success('Profile updated successfully');
      setIsEditing(false);
      
      // Update original data to match the saved data
      setOriginalData({
        name: formData.name,
        email: formData.email,
        phone: formData.phone
      });
    } catch (error: any) {
      toast.error(error.message || 'Failed to update profile');
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return (
      <div className="text-center py-10">
        <p className="text-lg">Please log in to view your profile</p>
      </div>
    );
  }

  return (
    <div className="container-hotel py-10">
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-serif">My Profile</CardTitle>
          </CardHeader>
          <CardContent>
            <form className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  disabled={!isEditing}
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
                  disabled={!isEditing}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                />
              </div>
              
              <div className="space-y-2">
                <Label>Account Type</Label>
                <div className="text-sm text-muted-foreground capitalize">
                  {user.role}
                </div>
              </div>
              
              <div className="space-y-2">
                <Label>Account Status</Label>
                <div className="text-sm text-muted-foreground">
                  Active
                </div>
              </div>
              
              <div className="space-y-2">
                <Label>Security</Label>
                <div className="flex gap-2">
                  <Button 
                    type="button" 
                    variant="outline" 
                    size="sm"
                    onClick={() => setShowPasswordModal(true)}
                  >
                    Change Password
                  </Button>
                </div>
              </div>
              
              <div className="flex gap-3 pt-4">
                {!isEditing ? (
                  <Button type="button" onClick={() => setIsEditing(true)}>
                    Edit Profile
                  </Button>
                ) : (
                  <>
                    <Button type="button" onClick={handleSubmit} disabled={isSaving}>
                      {isSaving ? 'Saving...' : 'Save Changes'}
                    </Button>
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={() => {
                        setIsEditing(false);
                        // Reset form to original values
                        setFormData({
                          name: originalData.name,
                          email: originalData.email,
                          phone: originalData.phone
                        });
                      }}
                      disabled={isSaving}
                    >
                      Cancel
                    </Button>
                  </>
                )}
              </div>
              
              {/* Password Change Modal */}
              <PasswordChangeModal 
                isOpen={showPasswordModal}
                onClose={() => setShowPasswordModal(false)}
              />
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default UserProfile;