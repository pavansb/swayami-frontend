import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useNavigate } from 'react-router-dom';
import { useApp } from '@/contexts/AppContext';
import { apiService } from '@/services/api';
import { toast } from '@/hooks/use-toast';

const Login = () => {
  const navigate = useNavigate();
  const { loginWithToken, user } = useApp();
  const [formData, setFormData] = useState({
    email: 'contact.pavansb@gmail.com',
    password: 'test123'
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.email || !formData.password) {
      toast({
        title: "Error",
        description: "Please enter both email and password",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    
    try {
      const response = await apiService.login({
        email: formData.email,
        password: formData.password
      });

      // Store token in localStorage
      localStorage.setItem('swayami_token', response.access_token);
      
      // Update app context with user data
      loginWithToken(response.user);
      
      toast({
        title: "Success",
        description: "Logged in successfully!",
      });

      // Route based on onboarding status
      if (!user.hasCompletedOnboarding) {
        navigate('/onboarding');
      } else {
        navigate('/dashboard');
      }
    } catch (error: any) {
      console.error('Login error:', error);
      toast({
        title: "Login Failed",
        description: error.detail || "Invalid credentials. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4">
      <div className="w-full max-w-md mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-swayami-black mb-4">
            Swayami
          </h1>
          <h2 className="text-3xl font-bold text-swayami-black mb-4">
            Welcome Back
          </h2>
          <p className="text-xl text-swayami-light-text">
            Your mirror for goals, growth & focus.
          </p>
        </div>
        
        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="email" className="text-swayami-black font-medium">
              Email
            </Label>
            <Input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="Enter your email"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-swayami-primary focus:border-transparent"
              disabled={isLoading}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="password" className="text-swayami-black font-medium">
              Password
            </Label>
            <Input
              id="password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleInputChange}
              placeholder="Enter your password"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-swayami-primary focus:border-transparent"
              disabled={isLoading}
            />
          </div>
          
          <Button 
            type="submit"
            disabled={isLoading}
            className="bg-swayami-primary hover:bg-swayami-primary-hover w-full text-lg py-6 rounded-xl font-semibold transition-all duration-200 hover:shadow-lg hover:translate-y-[-2px] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
          >
            {isLoading ? 'Signing In...' : 'Sign In'}
          </Button>
        </form>
        
        <div className="mt-6 text-center">
          <p className="text-sm text-swayami-light-text">
            Demo credentials are pre-filled for testing
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
