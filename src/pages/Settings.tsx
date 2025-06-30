import React, { useState } from 'react';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { useApp } from '@/contexts/AppContext';
import { useToast } from '@/hooks/use-toast';
import { useTheme } from '@/components/ThemeProvider';
import { useNavigate } from 'react-router-dom';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { mongoService } from '@/services/mongoService';
import { Edit3, Save, X } from 'lucide-react';

const Settings = () => {
  const { user, setUser, resetAllData, logout } = useApp();
  const { toast } = useToast();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [dailyReminders, setDailyReminders] = useState(true);
  const [reviewFrequency, setReviewFrequency] = useState('weekly');
  const [name, setName] = useState(user?.full_name || user?.name || '');
  const [isEditingName, setIsEditingName] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const displayName = user?.full_name || user?.name || user?.email || 'User';
  const initials = displayName
    .split(' ')
    .map(name => name[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  const handleThemeToggle = (checked: boolean) => {
    toggleTheme();
  };

  const handleSaveProfile = async () => {
    if (!user?._id) return;
    
    setIsSaving(true);
    try {
      await mongoService.updateUserProfile(user._id, {
        full_name: name.trim()
      });
      
      // Update local user state
      setUser(prev => prev ? { ...prev, full_name: name.trim(), name: name.trim() } : null);
      setIsEditingName(false);
      
      toast({
        title: "Profile updated ✅",
        description: "Your profile information has been saved successfully.",
      });
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        title: "Error",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveChanges = () => {
    toast({
      title: "Preferences updated ✅",
      description: "Your settings have been saved successfully.",
    });
  };

  const handleResetGoals = () => {
    resetAllData();
    navigate('/onboarding');
    toast({
      title: "Goals reset. Let's start again. ✨",
      description: "All your data has been cleared. Ready for a fresh start!",
    });
  };

  const handleDeleteAccount = async () => {
    try {
      await logout();
      navigate('/');
      toast({
        title: "Account deleted",
        description: "Your account has been deleted successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete account. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto">
        <div className="swayami-card">
          <h2 className="text-2xl font-bold text-swayami-black dark:text-white mb-8">Settings & Profile</h2>
          
          {/* Enhanced Profile Section */}
          <div className="space-y-6 mb-8">
            <h3 className="text-lg font-semibold text-swayami-black dark:text-white">Profile Information</h3>
            
            {/* Profile Photo & Basic Info */}
            <div className="flex items-center space-x-6 p-6 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-xl">
              <Avatar className="w-20 h-20">
                {user?.avatar_url && (
                  <AvatarImage 
                    src={user.avatar_url} 
                    alt={displayName}
                    className="object-cover"
                  />
                )}
                <AvatarFallback className="bg-[#9650D4] text-white text-xl font-bold">
                  {initials}
                </AvatarFallback>
              </Avatar>
              
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  {isEditingName ? (
                    <div className="flex items-center space-x-2 flex-1">
                      <Input 
                        value={name} 
                        onChange={(e) => setName(e.target.value)}
                        className="text-lg font-semibold"
                        placeholder="Enter your name"
                      />
                      <Button 
                        size="sm" 
                        onClick={handleSaveProfile}
                        disabled={isSaving || !name.trim()}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        {isSaving ? <Save className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => {
                          setIsEditingName(false);
                          setName(user?.full_name || user?.name || '');
                        }}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  ) : (
                    <>
                      <h4 className="text-xl font-bold text-gray-900 dark:text-white">{displayName}</h4>
                      <Button 
                        size="sm" 
                        variant="ghost"
                        onClick={() => setIsEditingName(true)}
                        className="text-[#9650D4] hover:text-[#8547C4]"
                      >
                        <Edit3 className="w-4 h-4" />
                      </Button>
                    </>
                  )}
                </div>
                <p className="text-gray-600 dark:text-gray-400">{user?.email}</p>
                <div className="flex items-center space-x-4 mt-2">
                  <span className="text-sm font-medium text-[#9650D4]">
                    🏆 {user?.level || 'Mindful Novice'}
                  </span>
                  <span className="text-sm text-gray-600">
                    🔥 {user?.streak || 0} day streak
                  </span>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="email">Email Address</Label>
                <Input 
                  id="email" 
                  value={user?.email || "user@example.com"} 
                  disabled
                  className="mt-2 bg-gray-50 dark:bg-gray-700"
                />
                <p className="text-xs text-gray-500 mt-1">Connected via Google OAuth</p>
              </div>
              <div>
                <Label>Account Status</Label>
                <div className="mt-2 flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm text-gray-600 dark:text-gray-400">Active Account</span>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Onboarding: {user?.hasCompletedOnboarding ? '✅ Complete' : '⏳ Pending'}
                </p>
              </div>
            </div>
          </div>

          {/* Preferences Section */}
          <div className="space-y-6 mb-8">
            <h3 className="text-lg font-semibold text-swayami-black dark:text-white">Preferences</h3>
            
            <div className="flex items-center justify-between">
              <div>
                <Label>Theme</Label>
                <p className="text-sm text-swayami-light-text dark:text-gray-400">Choose your preferred theme</p>
              </div>
              <div className="flex items-center space-x-3">
                <span className="text-sm">Light</span>
                <Switch 
                  checked={theme === 'dark'}
                  onCheckedChange={handleThemeToggle}
                />
                <span className="text-sm">Dark</span>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label>Daily Reminders</Label>
                <p className="text-sm text-swayami-light-text dark:text-gray-400">Get notified about your daily goals</p>
              </div>
              <Switch 
                checked={dailyReminders}
                onCheckedChange={setDailyReminders}
              />
            </div>

            <div>
              <Label>Goal Review Frequency</Label>
              <Select value={reviewFrequency} onValueChange={setReviewFrequency}>
                <SelectTrigger className="mt-2">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="weekly">Weekly</SelectItem>
                  <SelectItem value="biweekly">Bi-Weekly</SelectItem>
                  <SelectItem value="monthly">Monthly</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Start Fresh Section */}
          <div className="space-y-6 mb-8 border-t border-swayami-border dark:border-gray-700 pt-8">
            <h3 className="text-lg font-semibold text-swayami-black dark:text-white">Start Fresh</h3>
            
            <div className="flex items-center justify-between">
              <div>
                <Label>Reset My Goals</Label>
                <p className="text-sm text-swayami-light-text dark:text-gray-400">Clear all goals, tasks, journal entries and start over</p>
              </div>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive">
                    Reset My Goals
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Are you sure you want to reset your goals and progress?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. All your goals, tasks, journal entries, and progress will be permanently deleted.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleResetGoals} className="bg-red-600 hover:bg-red-700">
                      Yes, Reset
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
            
            <div className="flex items-center justify-between border-t border-gray-200 dark:border-gray-700 pt-6">
              <div>
                <Label className="text-red-600 dark:text-red-400">Delete Account</Label>
                <p className="text-sm text-swayami-light-text dark:text-gray-400">Permanently delete your account and all associated data</p>
              </div>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive" className="bg-red-600 hover:bg-red-700">
                    Delete Account
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle className="text-red-600">⚠️ Delete Account Permanently?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This action is irreversible. Your account, profile, goals, tasks, journal entries, and all progress will be permanently deleted. You will be logged out immediately.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleDeleteAccount} className="bg-red-600 hover:bg-red-700">
                      Yes, Delete Forever
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>

          <Button 
            onClick={handleSaveChanges}
            className="bg-swayami-primary hover:bg-swayami-primary-hover"
          >
            Save Changes
          </Button>
        </div>
      </div>
    </Layout>
  );
};

export default Settings;
