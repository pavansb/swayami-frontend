
import React from 'react';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Settings, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '@/contexts/AppContext';
import UserProfile from './UserProfile';

const ProfileDropdown = () => {
  const navigate = useNavigate();
  const { logout } = useApp();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="p-0 h-auto">
          <UserProfile showName={false} size="md" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48 bg-white border border-swayami-border">
        <DropdownMenuItem 
          onClick={() => navigate('/settings')}
          className="cursor-pointer hover:bg-gray-50"
        >
          <Settings className="w-4 h-4 mr-2" />
          Settings
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={handleLogout}
          className="cursor-pointer hover:bg-gray-50 text-red-600"
        >
          <LogOut className="w-4 h-4 mr-2" />
          Log Out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ProfileDropdown;
