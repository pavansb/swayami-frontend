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
  ENVIRONMENT: 'development' | 'qa' | 'production';
}

const getConfig = (): Config => {
  // Check if we're in development mode
  const isDev = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
  
  // Check if we're in QA/staging environment
  const isQA = window.location.hostname === 'swayami-focus-mirror.lovable.app';
  
  // Check if we're in production environment
  const isProd = window.location.hostname === 'app.swayami.com';

  if (isDev) {
    return {
      API_BASE_URL: 'http://localhost:8000',
      ENVIRONMENT: 'development'
    };
  } else if (isQA) {
    return {
      API_BASE_URL: 'https://api-qa.swayami.com', // Update this when QA backend is deployed
      ENVIRONMENT: 'qa'
    };
  } else if (isProd) {
    return {
      API_BASE_URL: 'https://api.swayami.com', // Update this when prod backend is deployed
      ENVIRONMENT: 'production'
    };
  } else {
    // Default to development
    return {
      API_BASE_URL: 'http://localhost:8000',
      ENVIRONMENT: 'development'
    };
  }
};

export const config = getConfig(); 