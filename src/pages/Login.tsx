
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/utils/supabaseClient';
import { useToast } from '@/hooks/use-toast';

const Login = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Check if user is already logged in
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        localStorage.setItem('swayami_token', session.access_token);
        navigate('/dashboard');
      }
    };

    checkSession();

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' && session) {
        localStorage.setItem('swayami_token', session.access_token);
        navigate('/dashboard');
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleGoogleLogin = async () => {
    try {
      setIsLoading(true);
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/dashboard`
        }
      });
      
      if (error) {
        console.error("Google sign-in error", error);
        toast({
          title: "Login Error",
          description: error.message || "Failed to sign in with Google",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Unexpected error:", error);
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex animate-fadeIn">
      {/* Left Panel */}
      <div className="flex-1 lg:flex-[0.4] bg-white flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <div className="text-center mb-12">
            <img 
              src="/lovable-uploads/9cf37de0-ba28-4f72-9b5c-2c838d6562f4.png" 
              alt="Swayami" 
              className="h-12 w-auto mx-auto mb-8"
            />
            
            <h1 className="text-3xl font-bold text-[#1A1A1A] mb-3">
              Welcome Back!
            </h1>
            <p className="text-[#4A4A4A] text-lg leading-relaxed">
              Sign in with Google to unlock your productivity mirror.
            </p>
          </div>
          
          <Button 
            onClick={handleGoogleLogin}
            disabled={isLoading}
            className="w-full bg-white hover:bg-gray-50 text-[#1A1A1A] border-2 border-gray-200 hover:border-gray-300 font-semibold py-4 px-6 rounded-xl transition-all duration-200 hover:shadow-lg flex items-center justify-center gap-3 text-base"
          >
            {isLoading ? (
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-[#9650D4]"></div>
            ) : (
              <>
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC04" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Sign in with Google
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Right Panel */}
      <div className="hidden lg:flex lg:flex-[0.6] bg-gradient-to-br from-[#9650D4]/10 to-[#9650D4]/20 items-center justify-center p-12">
        <div className="max-w-lg text-center">
          <div className="bg-white/50 backdrop-blur-sm rounded-3xl p-12 border border-white/20">
            <div className="text-[#9650D4] text-4xl font-bold mb-4">
              Your Growth Journey
            </div>
            <div className="text-[#4A4A4A] text-lg">
              Starts with a single sign-in
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
