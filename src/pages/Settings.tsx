import React, { useState } from 'react';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { useApp } from '@/contexts/AppContext';
import { useToast } from '@/hooks/use-toast';
import { User, Bell, Shield, Palette, Download, Trash2, RefreshCw } from 'lucide-react';
import UserProfile from '@/components/UserProfile';

const Settings = () => {
  const { user, logout, refreshUserProfile } = useApp();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const handleLogout = async () => {
    await logout();
    // Redirect to external static landing page
    window.location.href = 'https://swayami-spark-bliss.lovable.app';
  };

  const handleRefreshProfile = async () => {
    setIsLoading(true);
    const { success, error } = await refreshUserProfile();
    setIsLoading(false);

    if (success) {
      toast({
        title: "Profile Refreshed ✅",
        description: "Your profile photo has been updated.",
      });
    } else {
      toast({
        variant: "destructive",
        title: "Refresh Failed ❌",
        description: error || "Failed to refresh profile. Please try again.",
      });
    }
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto">
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl font-bold">Account</CardTitle>
              <CardDescription>Manage your account settings.</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-0.5">
                  <Label htmlFor="name">Name</Label>
                  <Input id="name" defaultValue={user?.name} className="bg-gray-100" disabled />
                </div>
                <div className="space-y-0.5">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" defaultValue={user?.email} className="bg-gray-100" disabled />
                </div>
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="new-photo">Profile Photo</Label>
                  <Card className="w-[200px] border">
                    <CardContent className="flex items-center justify-center p-3">
                      <UserProfile showName={false} size="lg" />
                    </CardContent>
                  </Card>
                </div>
                <Button onClick={handleRefreshProfile} disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                      Refreshing...
                    </>
                  ) : (
                    <>
                      <RefreshCw className="mr-2 h-4 w-4" />
                      Refresh Photo
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl font-bold">Preferences</CardTitle>
              <CardDescription>Manage your preferences.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="push">Push Notifications</Label>
                <Switch id="push" defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="email-notifications">Email Notifications</Label>
                <Switch id="email-notifications" defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="dark-mode">Dark Mode</Label>
                <Switch id="dark-mode" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl font-bold">Danger Zone</CardTitle>
              <CardDescription>Be careful with these actions.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="destructive" onClick={handleLogout}>
                Log Out
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default Settings;
