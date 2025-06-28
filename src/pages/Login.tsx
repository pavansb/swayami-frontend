
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { supabase } from '@/utils/supabaseClient';
import { useApp } from '@/contexts/AppContext';
import { toast } from '@/hooks/use-toast';

const Login = () => {
  const navigate = useNavigate();
  const { user, loginWithSupabase } = useApp();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/dashboard`
        }
      });

      if (error) {
        console.error('Google sign-in error:', error);
        toast({
          title: "Sign-in Error",
          description: "Failed to sign in with Google. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Unexpected error during sign-in:', error);
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
              className="h-16 w-auto mx-auto mb-8"
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
        </div>
      </div>

      {/* Right Panel - Visual/Branding */}
      <div className="hidden lg:flex w-3/5 bg-gradient-to-br from-purple-50 to-purple-100 items-center justify-center p-12">
        <div className="text-center">
          <div className="text-[#9650D4] text-8xl font-bold opacity-20 mb-8">
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
