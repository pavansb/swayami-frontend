-- Disable the automatic user creation trigger since we're using MongoDB for user data
-- This prevents the "Database error saving new user" error during Google sign-in

-- Drop the trigger that creates users in Supabase database
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Drop the function as well since we don't need it
DROP FUNCTION IF EXISTS public.handle_new_user();

-- Optional: Drop RLS policies for tables we're not using anymore
-- (Keep these commented out for now in case we need to rollback)

-- DROP POLICY IF EXISTS "Users can view their own profile" ON public.users;
-- DROP POLICY IF EXISTS "Users can update their own profile" ON public.users;
-- DROP POLICY IF EXISTS "Users can view their own goals" ON public.goals;
-- DROP POLICY IF EXISTS "Users can create their own goals" ON public.goals;
-- DROP POLICY IF EXISTS "Users can update their own goals" ON public.goals;
-- DROP POLICY IF EXISTS "Users can delete their own goals" ON public.goals;
-- DROP POLICY IF EXISTS "Users can view their own tasks" ON public.tasks;
-- DROP POLICY IF EXISTS "Users can create their own tasks" ON public.tasks;
-- DROP POLICY IF EXISTS "Users can update their own tasks" ON public.tasks;
-- DROP POLICY IF EXISTS "Users can delete their own tasks" ON public.tasks;
-- DROP POLICY IF EXISTS "Users can view their own journals" ON public.journals;
-- DROP POLICY IF EXISTS "Users can create their own journals" ON public.journals;
-- DROP POLICY IF EXISTS "Users can update their own journals" ON public.journals;
-- DROP POLICY IF EXISTS "Users can delete their own journals" ON public.journals;

-- Add comment to document the change
COMMENT ON SCHEMA public IS 'MongoDB migration: Disabled user creation triggers. User data now stored in MongoDB, Supabase used for auth only.'; 