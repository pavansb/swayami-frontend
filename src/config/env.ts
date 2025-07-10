/**
 * Swayami Frontend Configuration
 * 
 * SECURITY ARCHITECTURE NOTES:
 * ============================
 * 
 * ✅ SECURE: Frontend → FastAPI Backend → MongoDB Atlas
 * ❌ INSECURE: Frontend → MongoDB Data API (Direct Access)
 * 
 * WHY NO DIRECT MONGODB ACCESS FROM FRONTEND:
 * 1. Security Risk: Database credentials exposed to client
 * 2. No Server-Side Validation: Business logic can be bypassed
 * 3. CORS Issues: Cross-origin requests to MongoDB Atlas
 * 4. No Rate Limiting: Potential for abuse and excessive usage
 * 5. No Authentication Layer: Can't implement proper user authorization
 * 
 * OUR SECURE APPROACH:
 * - Frontend authenticates via Supabase (Google OAuth)
 * - All database operations go through FastAPI backend
 * - FastAPI handles validation, business logic, and security
 * - MongoDB credentials stay secure on the server side
 */

export interface Config {
  API_BASE_URL: string;
  ENVIRONMENT: 'development' | 'staging' | 'production';
}

const getConfig = (): Config => {
  // Get current hostname for environment detection
  const hostname = window.location.hostname;
  
  // COMPREHENSIVE ENVIRONMENT DETECTION LOGGING
  console.log('🔧 ENVIRONMENT DETECTION DEBUG:', {
    hostname,
    href: window.location.href,
    protocol: window.location.protocol,
    port: window.location.port
  });

  // Check if we're in development mode
  const isDev = hostname === 'localhost' || hostname === '127.0.0.1';
  
  // Check if we're in RENDER staging environment
  const isRenderStaging = hostname === 'swayami-frontend.onrender.com';
  
  // Check if we're in Lovable QA/staging environment  
  const isLovableQA = hostname === 'swayami-focus-mirror.lovable.app';
  
  // Check if we're in production environment (new domain structure)
  const isProd = hostname === 'app.swayami.com';

  console.log('🔧 ENVIRONMENT FLAGS:', { isDev, isRenderStaging, isLovableQA, isProd });

  if (isDev) {
    const config = {
      API_BASE_URL: 'http://localhost:8000',
      ENVIRONMENT: 'development' as const
    };
    console.log('✅ DEVELOPMENT CONFIG:', config);
    return config;
  } else if (isRenderStaging) {
    // RENDER STAGING DEPLOYMENT CONFIGURATION
    const config = {
      API_BASE_URL: 'https://swayami-backend.onrender.com',
      ENVIRONMENT: 'staging' as const
    };
    console.log('✅ RENDER STAGING CONFIG:', config);
    console.log('🚀 Using Render backend:', config.API_BASE_URL);
    return config;
  } else if (isLovableQA) {
    // LOVABLE QA/STAGING CONFIGURATION (Legacy)
    const config = {
      API_BASE_URL: 'https://api-staging-placeholder.swayami.com', // Non-existent URL for demo
      ENVIRONMENT: 'staging' as const
    };
    console.log('⚠️  LOVABLE QA/STAGING CONFIG (BACKEND NOT DEPLOYED):', config);
    console.log('⚠️  STAGING NOTICE: Backend will gracefully fallback to mock data');
    return config;
  } else if (isProd) {
    const config = {
      API_BASE_URL: 'https://api.swayami.com',
      ENVIRONMENT: 'production' as const
    };
    console.log('✅ PRODUCTION CONFIG:', config);
    return config;
  } else {
    // Default to development for unknown environments
    const config = {
      API_BASE_URL: 'http://localhost:8000',
      ENVIRONMENT: 'development' as const
    };
    console.log('⚠️  UNKNOWN ENVIRONMENT - DEFAULTING TO DEVELOPMENT:', config);
    console.log('⚠️  Unknown hostname:', hostname);
    return config;
  }
};

export const config = getConfig();

// Log final configuration
console.log('🚀 FINAL API CONFIGURATION:', {
  API_BASE_URL: config.API_BASE_URL,
  ENVIRONMENT: config.ENVIRONMENT,
  timestamp: new Date().toISOString()
});

// STAGING NOTICE: Display user-friendly message for staging environment
if (config.ENVIRONMENT === 'staging' && config.API_BASE_URL.includes('placeholder')) {
  console.log('%c🚧 STAGING ENVIRONMENT NOTICE', 'background: #ff9800; color: white; padding: 8px; border-radius: 4px; font-weight: bold;');
  console.log('%cBackend API is not yet deployed for staging.', 'color: #ff9800; font-weight: bold;');
  console.log('%cThe app will use mock data and localStorage for demonstration.', 'color: #ff9800;');
  console.log('%cAuthentication (Google OAuth) works normally via Supabase.', 'color: #4caf50;');
  console.log('%cThis is expected behavior for the staging environment.', 'color: #ff9800;');
} else if (config.ENVIRONMENT === 'staging') {
  console.log('%c🚀 RENDER STAGING DEPLOYMENT', 'background: #4caf50; color: white; padding: 8px; border-radius: 4px; font-weight: bold;');
  console.log('%cBackend API is deployed and ready!', 'color: #4caf50; font-weight: bold;');
  console.log('%cFull backend integration active.', 'color: #4caf50;');
  console.log('%cAuthentication (Google OAuth) works via Supabase.', 'color: #4caf50;');
} 