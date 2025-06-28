
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://pbeborjasiiwuudfnzhm.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBiZWJvcmphc2lpd3V1ZGZuemhtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA2OTg5MDcsImV4cCI6MjA2NjI3NDkwN30.b6I79NZOQUM8mJpLO-k3tzdDrF20s5nSZ2clGLN5MNY';

export const supabase = createClient(supabaseUrl, supabaseKey);
