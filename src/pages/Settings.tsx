
import React, { useState } from 'react';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useApp } from '@/contexts/AppContext';
import { useToast } from '@/hooks/use-toast';

const Settings = () => {
  const { user } = useApp();
  const { toast } = useToast();
  const [isDarkMode, setIsDarkMode] = useState(() => {
    return localStorage.getItem('theme') === 'dark';
  });
  const [dailyReminders, setDailyReminders] = useState(true);
  const [reviewFrequency, setReviewFrequency] = useState('weekly');
  const [name, setName] = useState('John Doe');

  const handleThemeToggle = (checked: boolean) => {
    setIsDarkMode(checked);
    localStorage.setItem('theme', checked ? 'dark' : 'light');
    document.documentElement.classList.toggle('dark', checked);
  };

  const handleSaveChanges = () => {
    toast({
      title: "Preferences updated ✅",
      description: "Your settings have been saved successfully.",
    });
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto">
        <div className="swayami-card">
          <h2 className="text-2xl font-bold text-swayami-black mb-8">Settings & Profile</h2>
          
          {/* Profile Section */}
          <div className="space-y-6 mb-8">
            <h3 className="text-lg font-semibold text-swayami-black">Profile Information</h3>
            
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
                  className="mt-2 bg-gray-50"
                />
              </div>
            </div>
            
            <div>
              <Label>Date Joined</Label>
              <p className="text-sm text-swayami-light-text mt-1">June 25, 2025</p>
            </div>
          </div>

          {/* Preferences Section */}
          <div className="space-y-6 mb-8">
            <h3 className="text-lg font-semibold text-swayami-black">Preferences</h3>
            
            <div className="flex items-center justify-between">
              <div>
                <Label>Theme</Label>
                <p className="text-sm text-swayami-light-text">Choose your preferred theme</p>
              </div>
              <div className="flex items-center space-x-3">
                <span className="text-sm">Light</span>
                <Switch 
                  checked={isDarkMode}
                  onCheckedChange={handleThemeToggle}
                />
                <span className="text-sm">Dark</span>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label>Daily Reminders</Label>
                <p className="text-sm text-swayami-light-text">Get notified about your daily goals</p>
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
