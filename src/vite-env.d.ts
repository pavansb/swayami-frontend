/// <reference types="vite/client" />

/**
 * Environment Variables Type Definitions
 * 
 * ARCHITECTURE NOTE: Frontend only communicates with FastAPI backend.
 * Direct MongoDB access from frontend is SECURITY RISK and unnecessary.
 * All database operations should go through FastAPI backend endpoints.
 */
interface ImportMetaEnv {
  // Supabase Authentication (client-side safe)
  readonly VITE_SUPABASE_URL: string
  readonly VITE_SUPABASE_ANON_KEY: string
  
  // Backend API Configuration
  readonly VITE_BACKEND_URL?: string  // Optional: defaults to localhost:8000 in dev
  
  // Development Environment Detection
  readonly VITE_NODE_ENV?: string
  
  // NOTE: Removed VITE_MONGO_API_KEY - MongoDB access happens securely in FastAPI backend
  // NOTE: Removed VITE_OPENAI_API_KEY - AI features handled securely in FastAPI backend
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
