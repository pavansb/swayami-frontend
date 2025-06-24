
import React from 'react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { useApp } from '@/contexts/AppContext';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useApp();

  const handleGoogleLogin = () => {
    // Mock Google login
    login('user@example.com');
    navigate('/onboarding');
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="text-center max-w-md mx-auto px-6">
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-swayami-black mb-4">
            Swayami
          </h1>
          <h2 className="text-3xl font-bold text-swayami-black mb-4">
            Welcome to Swayami.
          </h2>
          <p className="text-xl text-swayami-light-text">
            Your mirror for goals, growth & focus.
          </p>
        </div>
        
        <Button 
          onClick={handleGoogleLogin}
          className="swayami-button w-full text-lg py-6"
        >
          Login with Google
        </Button>
      </div>
    </div>
  );
};

export default Login;
