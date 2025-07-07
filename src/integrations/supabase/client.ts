// Supabase client for authentication only
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = "https://pbeborjasiiwuudfnzhm.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBiZWJvcmphc2lpd3V1ZGZuemhtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA2OTg5MDcsImV4cCI6MjA2NjI3NDkwN30.b6I79NZOQUM8mJpLO-k3tzdDrF20s5nSZ2clGLN5MNY";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);