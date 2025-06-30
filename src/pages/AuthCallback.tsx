import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { supabase } from '@/utils/supabaseClient';
import { useApp } from '@/contexts/AppContext';

const AuthCallback = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user } = useApp();
  const [status, setStatus] = useState<'loading' | 'success' | 'error' | 'trigger_error'>('loading');
  const [message, setMessage] = useState('Processing authentication...');
  const [debugInfo, setDebugInfo] = useState<any>({});

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        // COMPREHENSIVE LOGGING - Step 1: Initial URL analysis
        const currentUrl = window.location.href;
        const isProduction = currentUrl.includes('lovable.app');
        const error = searchParams.get('error');
        const errorCode = searchParams.get('error_code');
        const errorDescription = searchParams.get('error_description');
        const code = searchParams.get('code');
        const accessToken = searchParams.get('access_token');
        
        console.log('🔍 STAGING/PRODUCTION AUTH DEBUG - Step 1: Environment Analysis');
        console.log('🔍 Current URL:', currentUrl);
        console.log('🔍 Is Production:', isProduction);
        console.log('🔍 Error param:', error);
        console.log('🔍 Error code param:', errorCode);
        console.log('🔍 Error description param:', errorDescription);
        console.log('🔍 Auth code param:', code);
        console.log('🔍 Access token param:', accessToken);

        setDebugInfo({
          currentUrl,
          isProduction,
          error,
          errorCode,
          errorDescription,
          code,
          accessToken,
          timestamp: new Date().toISOString()
        });

        // CRITICAL ANALYSIS: Check for database trigger error
        if (error && errorDescription?.includes('Database error saving new user')) {
          console.log('🚨 CRITICAL DATABASE TRIGGER ERROR DETECTED!');
          console.log('🔍 ANALYSIS: Auth Code is:', code || 'NONE');
          console.log('🔍 ANALYSIS: This means the trigger blocked OAuth BEFORE completion');
          console.log('💡 SOLUTION: Database trigger must be removed from Supabase');
          
          setStatus('trigger_error');
          setMessage('Database trigger is blocking authentication. Immediate fix required.');
          return;
        }

        // PRODUCTION-SPECIFIC: Check for OAuth redirect URL mismatch
        if (error && (error === 'redirect_uri_mismatch' || errorDescription?.includes('redirect_uri'))) {
          console.log('🚨 OAUTH REDIRECT URL MISMATCH DETECTED!');
          console.log('🔍 ANALYSIS: Google OAuth redirect URLs not configured for staging domain');
          console.log('💡 SOLUTION: Update Google Console and Supabase redirect URLs');
          
          setStatus('error');
          setMessage('OAuth configuration error. Please check redirect URLs in Google Console and Supabase.');
          setTimeout(() => navigate('/login'), 10000); // Longer timeout for reading error
          return;
        }

        // Handle other OAuth errors  
        if (error) {
          console.log('🔍 STAGING AUTH DEBUG - Step 3: Other Error Handling');
          console.error('❌ AuthCallback: OAuth error detected:', error, errorDescription);
          setStatus('error');
          setMessage(`Authentication failed: ${errorDescription || error}`);
          setTimeout(() => navigate('/login'), 5000);
          return;
        }

        // COMPREHENSIVE LOGGING - Step 2: Session check with retries for staging
        console.log('🔍 STAGING AUTH DEBUG - Step 2: Session Check with Retries');
        let sessionResult = await supabase.auth.getSession();
        console.log('🔍 Initial session result:', {
          hasSession: !!sessionResult.data.session,
          hasUser: !!sessionResult.data.session?.user,
          userEmail: sessionResult.data.session?.user?.email,
          sessionError: sessionResult.error
        });

        // STAGING FIX: If no session but we have auth code, retry session check
        if (!sessionResult.data.session && code) {
          console.log('🔄 STAGING AUTH DEBUG - Retrying session check (OAuth code present)');
          
          // Wait a bit for session to be established
          await new Promise(resolve => setTimeout(resolve, 1000));
          sessionResult = await supabase.auth.getSession();
          
          console.log('🔍 Retry session result:', {
            hasSession: !!sessionResult.data.session,
            hasUser: !!sessionResult.data.session?.user,
            userEmail: sessionResult.data.session?.user?.email,
            sessionError: sessionResult.error
          });
        }

        // STAGING FIX: Try exchanging auth code for session if still no session
        if (!sessionResult.data.session && code) {
          console.log('🔄 STAGING AUTH DEBUG - Attempting to exchange auth code for session');
          try {
            const { data, error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);
            if (data.session) {
              console.log('✅ STAGING AUTH DEBUG - Successfully exchanged code for session');
              sessionResult = { data: { session: data.session }, error: null };
            } else {
              console.error('❌ STAGING AUTH DEBUG - Failed to exchange code:', exchangeError);
            }
          } catch (exchangeError) {
            console.error('❌ STAGING AUTH DEBUG - Exception during code exchange:', exchangeError);
          }
        }

        // COMPREHENSIVE LOGGING - Step 5: Success case handling
        console.log('🔍 STAGING AUTH DEBUG - Step 5: Success Case Handling');
        
        // Check for successful authentication
        if (sessionResult.data.session?.user) {
          console.log('✅ STAGING AUTH DEBUG - Authentication Success');
          console.log('✅ User:', sessionResult.data.session.user.email);
          
          setStatus('success');
          setMessage(`Welcome, ${sessionResult.data.session.user.email}! Redirecting...`);
          
          // STAGING FIX: Wait for app context to catch up
          setTimeout(() => {
            if (user?.hasCompletedOnboarding) {
              console.log('🔄 STAGING AUTH DEBUG - Redirecting to dashboard');
              navigate('/dashboard');
            } else {
              console.log('🔄 STAGING AUTH DEBUG - Redirecting to onboarding');
              navigate('/onboarding');
            }
          }, 2000);
        } else {
          console.warn('⚠️ STAGING AUTH DEBUG - No session found in success case');
          setStatus('error');
          setMessage('Authentication session could not be established. Please try again.');
          setTimeout(() => navigate('/login'), 5000);
        }
        
      } catch (error) {
        console.error('❌ STAGING AUTH DEBUG - Unexpected Error:', error);
        setStatus('error');
        setMessage('An unexpected error occurred during authentication');
        setTimeout(() => navigate('/login'), 3000);
      }
    };

    handleAuthCallback();
  }, [searchParams, navigate, user]);

  const getStatusColor = () => {
    switch (status) {
      case 'loading': return 'text-blue-600';
      case 'success': return 'text-green-600';
      case 'error': return 'text-red-600';
      case 'trigger_error': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getStatusIcon = () => {
    switch (status) {
      case 'loading': return '🔄';
      case 'success': return '✅';
      case 'error': return '❌';
      case 'trigger_error': return '🚨';
      default: return '🔄';
    }
  };

  const openSupabaseDashboard = () => {
    window.open('https://supabase.com/dashboard/project/nqpvomjuaszhwfdhnmik/sql', '_blank');
  };

  const openGoogleConsole = () => {
    window.open('https://console.cloud.google.com/apis/credentials', '_blank');
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-6">
      <div className="max-w-2xl w-full text-center">
        {/* Logo */}
        <img 
          src="/lovable-uploads/9cf37de0-ba28-4f72-9b5c-2c838d6562f4.png" 
          alt="Swayami" 
          className="h-24 w-auto mx-auto mb-8"
        />

        {/* Status */}
        <div className="mb-8">
          <div className="text-6xl mb-4 animate-pulse">
            {getStatusIcon()}
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            {status === 'loading' && 'Authenticating...'}
            {status === 'success' && 'Welcome to Swayami!'}
            {status === 'error' && 'Authentication Error'}
            {status === 'trigger_error' && 'Critical Database Issue'}
          </h1>
          <p className={`text-lg ${getStatusColor()}`}>
            {message}
          </p>
        </div>

        {/* Loading indicator */}
        {status === 'loading' && (
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#9650D4]"></div>
          </div>
        )}

        {/* OAuth Configuration Error */}
        {status === 'error' && debugInfo.error === 'redirect_uri_mismatch' && (
          <div className="mt-6 space-y-4">
            <div className="p-6 bg-yellow-50 border border-yellow-200 rounded-lg text-left">
              <h3 className="font-bold text-yellow-800 mb-3">🔧 OAuth Configuration Required</h3>
              <p className="text-sm text-yellow-700 mb-4">
                The Google OAuth application needs to be configured for the staging domain.
              </p>
              
              <div className="space-y-3">
                <h4 className="font-semibold text-yellow-800">Required Steps:</h4>
                <ol className="text-sm text-yellow-700 space-y-2">
                  <li>1. Update Google Console OAuth redirect URLs</li>
                  <li>2. Update Supabase auth configuration</li>
                  <li>3. Add staging domain to allowed origins</li>
                </ol>
                
                <div className="flex space-x-3">
                  <button
                    onClick={openGoogleConsole}
                    className="bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded text-sm font-medium"
                  >
                    Open Google Console
                  </button>
                  <button
                    onClick={openSupabaseDashboard}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm font-medium"
                  >
                    Open Supabase
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Critical Database Trigger Fix */}
        {status === 'trigger_error' && (
          <div className="mt-6 space-y-4">
            <div className="p-6 bg-red-50 border border-red-200 rounded-lg text-left">
              <h3 className="font-bold text-red-800 mb-3">🚨 CRITICAL: Database Trigger Blocking Authentication</h3>
              <p className="text-sm text-red-700 mb-4">
                A Supabase database trigger is preventing OAuth authentication from completing. 
                This requires an immediate permanent fix.
              </p>
              
              <div className="bg-red-100 p-4 rounded border mb-4">
                <h4 className="font-semibold text-red-800 mb-2">Evidence:</h4>
                <ul className="text-xs text-red-700 space-y-1">
                  <li>• Auth Code: {debugInfo.code || 'NONE'} ← Critical: OAuth never completed</li>
                  <li>• Error: Database error saving new user</li>
                  <li>• Cause: Trigger tries to insert into non-existent profiles table</li>
                </ul>
              </div>

              <div className="space-y-3">
                <h4 className="font-semibold text-red-800">IMMEDIATE FIX REQUIRED:</h4>
                <ol className="text-sm text-red-700 space-y-2">
                  <li>1. Click "Open Supabase SQL Editor" below</li>
                  <li>2. Copy and paste this command:</li>
                </ol>
                
                <div className="bg-gray-900 text-green-400 p-3 rounded font-mono text-xs overflow-x-auto">
                  <div className="mb-2">-- Remove problematic database trigger</div>
                  <div>DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;</div>
                  <div>DROP FUNCTION IF EXISTS public.handle_new_user();</div>
                </div>
                
                <div className="flex space-x-3">
                  <button
                    onClick={openSupabaseDashboard}
                    className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded text-sm font-medium"
                  >
                    Open Supabase SQL Editor
                  </button>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(`DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;\nDROP FUNCTION IF EXISTS public.handle_new_user();`);
                      alert('SQL command copied to clipboard!');
                    }}
                    className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded text-sm font-medium"
                  >
                    Copy SQL Command
                  </button>
                </div>
              </div>
            </div>
            
            <button
              onClick={() => navigate('/login')}
              className="bg-[#9650D4] hover:bg-[#8547C4] text-white px-6 py-3 rounded-xl font-medium transition-colors"
            >
              Back to Login (Fix Required First)
            </button>
          </div>
        )}

        {/* Error actions */}
        {status === 'error' && debugInfo.error !== 'redirect_uri_mismatch' && (
          <div className="mt-6 space-y-4">
            <button
              onClick={() => navigate('/login')}
              className="bg-[#9650D4] hover:bg-[#8547C4] text-white px-6 py-3 rounded-xl font-medium transition-colors"
            >
              Back to Login
            </button>
          </div>
        )}

        {/* Debug info */}
        {(import.meta.env.DEV || debugInfo.isProduction) && (
          <div className="mt-8 p-4 bg-gray-100 rounded-lg text-left text-sm text-gray-600 max-h-60 overflow-y-auto">
            <strong>Debug Info:</strong>
            <br />
            Environment: {debugInfo.isProduction ? 'Production/Staging' : 'Development'}
            <br />
            Status: {status}
            <br />
            Current URL: {debugInfo.currentUrl}
            <br />
            Error: {debugInfo.error || 'None'}
            <br />
            Error Code: {debugInfo.errorCode || 'None'}
            <br />
            Error Description: {debugInfo.errorDescription || 'None'}
            <br />
            Auth Code: {debugInfo.code || 'None'}
            <br />
            User: {user ? user.email : 'None'}
            <br />
            Has completed onboarding: {user?.hasCompletedOnboarding ? 'Yes' : 'No'}
            <br />
            Debug Timestamp: {debugInfo.timestamp}
          </div>
        )}
      </div>
    </div>
  );
};

export default AuthCallback; 