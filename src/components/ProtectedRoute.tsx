import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '@/contexts/AppContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiresOnboarding?: boolean;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  requiresOnboarding = true 
}) => {
  const { user, goals, isLoading } = useApp();
  const navigate = useNavigate();

  useEffect(() => {
    // Don't redirect while loading
    if (isLoading) return;

    // Check authentication first
    if (!user || !user.isLoggedIn) {
      console.log('ProtectedRoute: User not authenticated, redirecting to login');
      navigate('/login');
      return;
    }

    // Check onboarding completion if required
    if (requiresOnboarding) {
      const hasCompletedOnboarding = user.hasCompletedOnboarding || goals.length > 0;
      
      console.log('ProtectedRoute: Checking onboarding completion', {
        hasCompletedOnboarding: user.hasCompletedOnboarding,
        goalsLength: goals.length,
        finalResult: hasCompletedOnboarding
      });
      
      if (!hasCompletedOnboarding) {
        console.log('ProtectedRoute: Onboarding not completed, redirecting to onboarding');
        navigate('/onboarding');
        return;
      } else {
        console.log('ProtectedRoute: Onboarding completed, allowing access');
      }
    }
  }, [user, goals, isLoading, navigate, requiresOnboarding]);

  // Show loading state while checking authentication/onboarding
  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#9650D4] mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Don't render if user isn't authenticated
  if (!user || !user.isLoggedIn) {
    return null;
  }

  // Don't render if onboarding is required but not completed
  if (requiresOnboarding && !user.hasCompletedOnboarding && goals.length === 0) {
    return null;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
