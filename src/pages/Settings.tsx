
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

const Settings = () => {
  const { user, resetAllData } = useApp();
  const { toast } = useToast();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [dailyReminders, setDailyReminders] = useState(true);
  const [reviewFrequency, setReviewFrequency] = useState('weekly');
  const [name, setName] = useState('John Doe');

  const handleThemeToggle = (checked: boolean) => {
    toggleTheme();
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

  return (
    <Layout>
      <div className="max-w-4xl mx-auto">
        <div className="swayami-card">
          <h2 className="text-2xl font-bold text-swayami-black dark:text-white mb-8">Settings & Profile</h2>
          
          {/* Profile Section */}
          <div className="space-y-6 mb-8">
            <h3 className="text-lg font-semibold text-swayami-black dark:text-white">Profile Information</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="name">Name</Label>
                <Input 
                  id="name" 
                  value={name} 
                  onChange={(e) => setName(e.target.value)}
                  className="mt-2"
                />
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input 
                  id="email" 
                  value={user.email || "user@example.com"} 
                  disabled
                  className="mt-2 bg-gray-50 dark:bg-gray-700"
                />
              </div>
            </div>
            
            <div>
              <Label>Date Joined</Label>
              <p className="text-sm text-swayami-light-text dark:text-gray-400 mt-1">June 25, 2025</p>
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
