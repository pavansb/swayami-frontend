import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { supabase } from '@/utils/supabaseClient';
import { useApp } from '@/contexts/AppContext';

const AuthCallback = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user } = useApp();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('Processing authentication...');
  const [debugInfo, setDebugInfo] = useState<any>({});

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        // COMPREHENSIVE LOGGING - Step 1: Initial URL analysis
        const currentUrl = window.location.href;
        const currentOrigin = window.location.origin;
        const isProduction = currentOrigin.includes('onrender.com') || currentOrigin.includes('lovable.app');
        
        console.log('🔄 AUTH CALLBACK DEBUG - Step 1: Starting auth callback processing...');
        console.log('🔍 CRITICAL - Environment Detection:');
        console.log('🔍 Current URL:', currentUrl);
        console.log('🔍 Current origin:', currentOrigin);
        console.log('🔍 Is production/staging:', isProduction);
        console.log('🔍 Search params:', Object.fromEntries(searchParams.entries()));
        
        // CRITICAL FIX: Handle both hash fragments and search params
        const urlHash = window.location.hash;
        const hashParams = new URLSearchParams(urlHash.substring(1)); // Remove the '#'
        
        console.log('🔍 HASH DEBUG: URL hash:', urlHash);
        console.log('🔍 HASH DEBUG: Hash params:', Object.fromEntries(hashParams.entries()));
        
        // Check for auth tokens in both locations
        const accessToken = hashParams.get('access_token') || searchParams.get('access_token');
        const refreshToken = hashParams.get('refresh_token') || searchParams.get('refresh_token');
        const error = hashParams.get('error') || searchParams.get('error');
        const errorDescription = hashParams.get('error_description') || searchParams.get('error_description');
        
        console.log('🔍 TOKEN DEBUG: Access token found:', !!accessToken);
        console.log('🔍 TOKEN DEBUG: Refresh token found:', !!refreshToken);
        console.log('🔍 TOKEN DEBUG: Error found:', error);
        
        setDebugInfo(prev => ({
          ...prev,
          currentUrl,
          currentOrigin,
          isProduction,
          hashParams: Object.fromEntries(hashParams.entries()),
          searchParams: Object.fromEntries(searchParams.entries()),
          tokensFound: { accessToken: !!accessToken, refreshToken: !!refreshToken }
        }));

        // Handle OAuth errors first
        if (error) {
          console.error('❌ AUTH CALLBACK ERROR: OAuth error from URL:', error, errorDescription);
          setStatus('error');
          setMessage(`Authentication failed: ${errorDescription || error}`);
          setTimeout(() => navigate('/login'), 3000);
          return;
        }

        // COMPREHENSIVE LOGGING - Step 2: Supabase session handling
        console.log('🔄 AUTH CALLBACK DEBUG - Step 2: Getting Supabase session...');
        
        // If we have tokens in the URL, let Supabase handle the session from URL
        if (accessToken) {
          console.log('✅ AUTH CALLBACK: Found access token in URL, letting Supabase handle session establishment...');
          // Give Supabase a moment to process the hash fragment
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
        
        const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
        
        console.log('🔍 CRITICAL - Supabase Session Result:');
        console.log('🔍 Session data:', sessionData);
        console.log('🔍 Session error:', sessionError);
        console.log('🔍 User from session:', sessionData?.session?.user);
        
        if (sessionError) {
          console.error('❌ AUTH CALLBACK ERROR: Session error:', sessionError);
          setStatus('error');
          setMessage(`Session error: ${sessionError.message}`);
          setDebugInfo(prev => ({ ...prev, sessionError: sessionError.message }));
          
          // Still try to redirect after a delay to avoid infinite loops
          setTimeout(() => {
            console.log('🔄 Redirecting to login due to session error...');
            navigate('/login');
          }, 3000);
          return;
        }

        const session = sessionData?.session;
        if (!session || !session.user) {
          console.log('⚠️ AUTH CALLBACK: No session found yet...');
          
          // If we have tokens but no session yet, wait a bit longer for Supabase to process
          if (accessToken) {
            console.log('🔄 AUTH CALLBACK: Have tokens but no session yet, waiting longer...');
            await new Promise(resolve => setTimeout(resolve, 2000));
            
            // Try getting session again
            const { data: retrySessionData } = await supabase.auth.getSession();
            if (retrySessionData?.session?.user) {
              console.log('✅ AUTH CALLBACK: Session found on retry!');
              // Continue with the session
              const finalUser = retrySessionData.session.user;
              setStatus('success');
              setMessage('Authentication successful! Redirecting...');
              
              setTimeout(() => {
                if (user?.hasCompletedOnboarding) {
                  navigate('/dashboard');
                } else {
                  navigate('/onboarding');
                }
              }, 1500);
              return;
            }
          }
          
          console.error('❌ AUTH CALLBACK ERROR: No valid session or auth data after retries');
          setStatus('error');
          setMessage('Authentication failed - no valid session found');
          setTimeout(() => navigate('/login'), 3000);
          return;
        }

        const finalUser = session?.user;
        
        console.log('✅ AUTH CALLBACK SUCCESS: Valid session found');
        console.log('🔍 Final user object:', finalUser);
        console.log('🔍 User email:', finalUser?.email);
        console.log('🔍 User metadata:', finalUser?.user_metadata);
        
        setStatus('success');
        setMessage('Authentication successful! Redirecting...');
        setDebugInfo(prev => ({
          ...prev,
          finalUser: {
            email: finalUser?.email,
            metadata: finalUser?.user_metadata,
            id: finalUser?.id
          }
        }));

        // COMPREHENSIVE LOGGING - Step 3: Database operations with fallback awareness
        console.log('🔄 AUTH CALLBACK DEBUG - Step 3: Processing user in context...');
        console.log('🔄 NOTE: If MongoDB CORS errors occur, app will use localStorage fallback');
        
        // Wait a moment for the session to be established
        setTimeout(() => {
          console.log('🔄 Redirecting to appropriate page...');
          
          // Check if user has completed onboarding
          if (user?.hasCompletedOnboarding) {
            console.log('🔄 User has completed onboarding, redirecting to dashboard');
            navigate('/dashboard');
          } else {
            console.log('🔄 User needs onboarding, redirecting to onboarding');
            navigate('/onboarding');
          }
        }, 1500);

      } catch (error: any) {
        console.error('❌ AUTH CALLBACK CRITICAL ERROR:', error);
        setStatus('error');
        setMessage(`Authentication error: ${error.message}`);
        setDebugInfo(prev => ({ ...prev, criticalError: error.message }));
        
        setTimeout(() => {
          console.log('🔄 Redirecting to login due to critical error...');
          navigate('/login');
        }, 3000);
      }
    };

    handleAuthCallback();
  }, [navigate, searchParams, user]);

  // Don't render anything if we already have a user and they've completed onboarding
  if (user?.hasCompletedOnboarding) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
        <div className="mb-6">
          {status === 'loading' && (
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
          )}
          {status === 'success' && (
            <div className="h-12 w-12 bg-green-100 rounded-full flex items-center justify-center mx-auto">
              <svg className="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
          )}
          {status === 'error' && (
            <div className="h-12 w-12 bg-red-100 rounded-full flex items-center justify-center mx-auto">
              <svg className="h-6 w-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
          )}
        </div>
        
        <h2 className="text-xl font-semibold text-gray-900 mb-2">
          {status === 'loading' && 'Processing Authentication...'}
          {status === 'success' && 'Authentication Successful!'}
          {status === 'error' && 'Authentication Error'}
        </h2>
        
        <p className="text-gray-600 mb-4">{message}</p>
        
        {status === 'success' && (
          <div className="text-sm text-gray-500">
            Setting up your account... This may take a moment.
          </div>
        )}
        
        {status === 'error' && (
          <div className="text-sm text-gray-500">
            You will be redirected to the login page shortly.
          </div>
        )}

        {/* Debug information for staging/development */}
        {(process.env.NODE_ENV === 'development' || window.location.hostname.includes('onrender.com')) && Object.keys(debugInfo).length > 0 && (
          <details className="mt-4 text-left">
            <summary className="text-sm cursor-pointer text-gray-500">Debug Info (Staging)</summary>
            <pre className="text-xs bg-gray-100 p-2 rounded mt-2 overflow-auto max-h-40">
              {JSON.stringify(debugInfo, null, 2)}
            </pre>
          </details>
        )}
      </div>
    </div>
  );
};

export default AuthCallback; 