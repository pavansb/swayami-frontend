import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { useApp } from '@/contexts/AppContext';
import { toast } from '@/hooks/use-toast';

const Login = () => {
  const navigate = useNavigate();
  const { user, loginWithToken, signInWithGoogle } = useApp();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Check if user is already logged in
    if (user && user.isLoggedIn) {
      navigate('/dashboard');
    }

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Login: Auth state changed:', event, session);
        
        if (event === 'SIGNED_IN' && session?.user) {
          // Login the user in our app context
          loginWithToken({
            id: session.user.id,
            email: session.user.email || '',
            name: session.user.user_metadata?.full_name || session.user.email || ''
          });
          
          toast({
            title: "Welcome!",
            description: "Successfully signed in with Google.",
          });
          
          navigate('/dashboard');
        } else if (event === 'SIGNED_OUT') {
          console.log('Login: User signed out');
        }
      }
    );

    return () => subscription.unsubscribe();
  }, [user, navigate, loginWithToken]);

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    
    try {
      console.log('🔄 COMPREHENSIVE LOGIN DEBUG - Step 1: Initiating Google sign-in...');
      console.log('🔍 Current user state:', {
        hasUser: !!user,
        isLoggedIn: user?.isLoggedIn,
        userEmail: user?.email
      });
      
      // Use the robust sign-in function from AppContext
      const result = await signInWithGoogle();
      
      console.log('🔍 COMPREHENSIVE LOGIN DEBUG - Step 2: Sign-in result:', result);
      
      if (result.success) {
        console.log('✅ COMPREHENSIVE LOGIN DEBUG - Google sign-in initiated successfully');
        console.log('✅ User should be redirected to Google OAuth now');
        toast({
          title: "Signing you in...",
          description: "Please wait while we set up your account.",
        });
      } else {
        console.error('❌ COMPREHENSIVE LOGIN DEBUG - Google sign-in failed:', result.error);
        
        // Only show error toast for actual failures, not database trigger issues
        if (result.error && !result.error.message?.includes('Database error saving new user')) {
          console.error('❌ COMPREHENSIVE LOGIN DEBUG - Showing error toast for non-database error');
          toast({
            title: "Sign-in Error",
            description: result.error.message || "Failed to sign in with Google. Please try again.",
            variant: "destructive",
          });
        } else {
          console.log('🔧 COMPREHENSIVE LOGIN DEBUG - Database error detected, showing informative message');
          // For database errors, show informative message
          toast({
            title: "Almost there!",
            description: "Authentication is processing. You'll be redirected shortly.",
          });
        }
      }
    } catch (error) {
      console.error('❌ COMPREHENSIVE LOGIN DEBUG - Unexpected error during sign-in:', error);
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex animate-fadeIn">
      {/* Left Panel - Login Form */}
      <div className="w-full lg:w-2/5 bg-white flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <img 
              src="/lovable-uploads/9cf37de0-ba28-4f72-9b5c-2c838d6562f4.png" 
              alt="Swayami" 
              className="h-32 w-auto mx-auto mb-8"
            />
            <h1 className="text-3xl font-bold text-[#1A1A1A] mb-4">
              Welcome Back!
            </h1>
            <p className="text-lg text-[#4A4A4A] leading-relaxed">
              Sign in with Google to unlock your productivity mirror.
            </p>
          </div>
          
          <Button 
            onClick={handleGoogleSignIn}
            disabled={isLoading}
            className="w-full bg-white hover:bg-gray-50 text-gray-700 border border-gray-300 py-4 px-6 rounded-xl font-medium text-base transition-all duration-200 hover:shadow-md flex items-center justify-center gap-3"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            {isLoading ? 'Signing in...' : 'Sign in with Google'}
          </Button>

          <div className="mt-6 text-center">
            <p className="text-sm text-[#4A4A4A]">
              Don't have an account? Signing in will automatically create one for you.
            </p>
          </div>
        </div>
      </div>

      {/* Right Panel - Visual/Branding */}
      <div className="hidden lg:flex w-3/5 bg-gradient-to-br from-green-50 to-green-100 items-center justify-center p-12">
        <div className="text-center">
          <div className="text-[#6FCC7F] text-8xl font-bold opacity-20 mb-8">
            Swayami
          </div>
          <p className="text-[#4A4A4A] text-xl max-w-md leading-relaxed">
            Command your growth. Shape your destiny.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
