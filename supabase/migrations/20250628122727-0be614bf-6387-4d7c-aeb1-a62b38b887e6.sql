
-- Enable RLS on all tables
ALTER TABLE public.goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.journals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Goals policies
CREATE POLICY "Users can view their own goals" ON public.goals
FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own goals" ON public.goals
FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own goals" ON public.goals
FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own goals" ON public.goals
FOR DELETE USING (auth.uid() = user_id);

-- Tasks policies
CREATE POLICY "Users can view their own tasks" ON public.tasks
FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own tasks" ON public.tasks
FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own tasks" ON public.tasks
FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own tasks" ON public.tasks
FOR DELETE USING (auth.uid() = user_id);

-- Journals policies
CREATE POLICY "Users can view their own journals" ON public.journals
FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own journals" ON public.journals
FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own journals" ON public.journals
FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own journals" ON public.journals
FOR DELETE USING (auth.uid() = user_id);

-- Users table policies (convert text id to uuid for comparison)
CREATE POLICY "Users can view their own profile" ON public.users
FOR SELECT USING (auth.uid() = id::uuid);

CREATE POLICY "Users can update their own profile" ON public.users
FOR UPDATE USING (auth.uid() = id::uuid);

-- Function to handle new user creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.users (id, email, full_name)
  VALUES (
    new.id::text,
    new.email,
    new.raw_user_meta_data->>'full_name'
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create profile on signup
CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
