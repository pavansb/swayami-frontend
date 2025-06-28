
import React from 'react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { useApp } from '@/contexts/AppContext';

interface UserProfileProps {
  className?: string;
  showName?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

const UserProfile = ({ className = '', showName = true, size = 'md' }: UserProfileProps) => {
  const { user } = useApp();

  if (!user) return null;

  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-12 h-12'
  };

  const textSizes = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg'
  };

  const displayName = user.name || user.email;
  const initials = displayName
    .split(' ')
    .map(name => name[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <Avatar className={sizeClasses[size]}>
        {user.avatar_url && (
          <AvatarImage 
            src={user.avatar_url} 
            alt={displayName}
            className="object-cover"
          />
        )}
        <AvatarFallback className="bg-swayami-primary text-white font-medium">
          {initials}
        </AvatarFallback>
      </Avatar>
      {showName && (
        <span className={`font-medium text-gray-900 ${textSizes[size]}`}>
          {displayName}
        </span>
      )}
    </div>
  );
};

export default UserProfile;
