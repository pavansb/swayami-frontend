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