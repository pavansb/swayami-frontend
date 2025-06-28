
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { User as SupabaseUser } from '@supabase/supabase-js';

interface Goal {
  id: string;
  title: string;
  description?: string;
  category?: string;
  status: 'active' | 'completed' | 'stalled';
  priority?: string;
  progress?: number;
  created_at?: string;
  user_id?: string;
}

interface Task {
  id: string;
  title: string;
  description?: string;
  goal_id?: string;
  status: 'pending' | 'completed' | 'in_progress';
  priority?: string;
  due_date?: string;
  created_at?: string;
  user_id?: string;
}

interface JournalEntry {
  id: string;
  content: string;
  mood_score?: number;
  summary?: string;
  created_at?: string;
  user_id?: string;
}

interface User {
  id: string;
  email: string;
  name?: string;
  avatar_url?: string;
  isLoggedIn: boolean;
  hasCompletedOnboarding: boolean;
  streak: number;
  level: string;
}

interface AppContextType {
  user: User | null;
  supabaseUser: SupabaseUser | null;
  goals: Goal[];
  tasks: Task[];
  journalEntries: JournalEntry[];
  habits: Array<{ id: string; emoji: string; label: string; completed: boolean }>;
  isLoading: boolean;
  login: (email: string) => void;
  loginWithToken: (userData: { id: string; email: string; name?: string }) => void;
  logout: () => void;
  completeOnboarding: (selectedGoals: { type: string; description: string }[]) => Promise<void>;
  addTask: (task: Omit<Task, 'id' | 'created_at'>) => Promise<void>;
  toggleTask: (taskId: string) => Promise<void>;
  deleteTask: (taskId: string) => Promise<void>;
  editTask: (taskId: string, updates: Partial<Task>) => Promise<void>;
  addJournalEntry: (entry: Omit<JournalEntry, 'id' | 'created_at'>) => Promise<void>;
  updateJournalEntry: (entryId: string, updates: Partial<JournalEntry>) => Promise<void>;
  toggleHabit: (habitId: string) => void;
  regenerateRecommendations: () => void;
  resetAllData: () => void;
  loadUserData: () => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [supabaseUser, setSupabaseUser] = useState<SupabaseUser | null>(null);
  const [goals, setGoals] = useState<Goal[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [journalEntries, setJournalEntries] = useState<JournalEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const [habits, setHabits] = useState(() => {
    const saved = localStorage.getItem('swayami_habits');
    return saved ? JSON.parse(saved) : [
      { id: '1', emoji: '💧', label: 'Drink Water', completed: false },
      { id: '2', emoji: '🏃', label: 'Exercise', completed: false },
      { id: '3', emoji: '📚', label: 'Read', completed: false },
    ];
  });

  // Initialize auth state
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session?.user) {
          setSupabaseUser(session.user);
          setUser({
            id: session.user.id,
            email: session.user.email || '',
            name: session.user.user_metadata?.full_name || session.user.email || '',
            avatar_url: session.user.user_metadata?.avatar_url,
            isLoggedIn: true,
            hasCompletedOnboarding: false,
            streak: 0,
            level: 'Mindful Novice',
          });
          await loadUserData();
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session);
        
        if (event === 'SIGNED_IN' && session?.user) {
          setSupabaseUser(session.user);
          setUser({
            id: session.user.id,
            email: session.user.email || '',
            name: session.user.user_metadata?.full_name || session.user.email || '',
            avatar_url: session.user.user_metadata?.avatar_url,
            isLoggedIn: true,
            hasCompletedOnboarding: false,
            streak: 0,
            level: 'Mindful Novice',
          });
          await loadUserData();
        } else if (event === 'SIGNED_OUT') {
          setSupabaseUser(null);
          setUser(null);
          setGoals([]);
          setTasks([]);
          setJournalEntries([]);
        }
        setIsLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  // Save habits to localStorage
  useEffect(() => {
    localStorage.setItem('swayami_habits', JSON.stringify(habits));
  }, [habits]);

  const loadUserData = async () => {
    if (!supabaseUser) return;

    try {
      // Load goals
      const { data: goalsData, error: goalsError } = await supabase
        .from('goals')
        .select('*')
        .eq('user_id', supabaseUser.id)
        .order('created_at', { ascending: false });

      if (goalsError) {
        console.error('Error loading goals:', goalsError);
      } else {
        setGoals((goalsData || []).map(goal => ({
          ...goal,
          status: goal.status as 'active' | 'completed' | 'stalled'
        })));
      }

      // Load tasks
      const { data: tasksData, error: tasksError } = await supabase
        .from('tasks')
        .select('*')
        .eq('user_id', supabaseUser.id)
        .order('created_at', { ascending: false });

      if (tasksError) {
        console.error('Error loading tasks:', tasksError);
      } else {
        setTasks((tasksData || []).map(task => ({
          ...task,
          status: task.status as 'pending' | 'completed' | 'in_progress'
        })));
      }

      // Load journals
      const { data: journalsData, error: journalsError } = await supabase
        .from('journals')
        .select('*')
        .eq('user_id', supabaseUser.id)
        .order('created_at', { ascending: false });

      if (journalsError) {
        console.error('Error loading journals:', journalsError);
      } else {
        setJournalEntries(journalsData || []);
      }
    } catch (error) {
      console.error('Error loading user data:', error);
    }
  };

  const login = (email: string) => {
    // This method is kept for compatibility but not used with Supabase auth
    console.log('Login called with:', email);
  };

  const loginWithToken = (userData: { id: string; email: string; name?: string }) => {
    setUser({
      id: userData.id,
      email: userData.email,
      name: userData.name,
      isLoggedIn: true,
      hasCompletedOnboarding: false,
      streak: 0,
      level: 'Mindful Novice',
    });
  };

  const logout = async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
      setSupabaseUser(null);
      setGoals([]);
      setTasks([]);
      setJournalEntries([]);
      localStorage.removeItem('swayami_habits');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  const completeOnboarding = async (selectedGoals: { type: string; description: string }[]) => {
    if (!supabaseUser) {
      console.log('AppContext: No supabase user, cannot complete onboarding');
      return;
    }

    console.log('AppContext: Starting onboarding completion for', selectedGoals.length, 'goals');

    try {
      // Check if user record exists in users table
      const { data: existingUser, error: userCheckError } = await supabase
        .from('users')
        .select('*')
        .eq('id', supabaseUser.id)
        .single();

      if (userCheckError || !existingUser) {
        console.log('AppContext: User record does not exist, creating it...', userCheckError);
        
        // Create user record
        const userToInsert = {
          id: supabaseUser.id,
          email: supabaseUser.email,
          full_name: supabaseUser.user_metadata?.full_name || supabaseUser.email?.split('@')[0] || 'User'
        };
        
        const { data: createdUser, error: userCreateError } = await supabase
          .from('users')
          .insert([userToInsert])
          .select()
          .single();

        if (userCreateError) {
          console.error('AppContext: Failed to create user record:', userCreateError);
        } else {
          console.log('AppContext: User record created successfully');
        }
      } else {
        console.log('AppContext: User record exists:', existingUser);
      }

      // Then, check if user already has goals and clear them to prevent conflicts
      const { data: existingGoals } = await supabase
        .from('goals')
        .select('id')
        .eq('user_id', supabaseUser.id);

      if (existingGoals && existingGoals.length > 0) {
        console.log('AppContext: Deleting existing goals to prevent conflicts:', existingGoals.length);
        await supabase
          .from('goals')
          .delete()
          .eq('user_id', supabaseUser.id);
      }

      const goalsToInsert = selectedGoals.map((goal, index) => ({
        user_id: supabaseUser.id,
        title: goal.type,
        description: goal.description || '',
        status: 'active' as const,
        priority: 'medium',
        progress: 0,
        category: goal.type.toLowerCase().replace(/[^a-z0-9]/g, '_'),
      }));
      
      console.log('AppContext: Inserting goals to Supabase');

      const { data: insertedGoals, error } = await supabase
        .from('goals')
        .insert(goalsToInsert)
        .select();

      if (error) {
        console.error('Error creating goals:', error);
        console.error('Goals insertion failed with data:', goalsToInsert);
        console.error('User ID being used:', supabaseUser.id);
        
        // Check if it's a foreign key constraint error
        if (error.code === '23503') {
          console.error('Foreign key constraint violation - user_id not found in users table');
          throw new Error('User profile not found. Please try logging out and back in.');
        }
        
        throw new Error(`Failed to create goals: ${error.message}`);
      }

      console.log('AppContext: Goals inserted successfully:', insertedGoals);

      setGoals((insertedGoals || []).map(goal => ({
        ...goal,
        status: goal.status as 'active' | 'completed' | 'stalled'
      })));
      
      console.log('AppContext: Setting user hasCompletedOnboarding to true');
      setUser(prev => {
        const updatedUser = prev ? { ...prev, hasCompletedOnboarding: true } : null;
        console.log('AppContext: Updated user state:', updatedUser);
        return updatedUser;
      });

      // Generate AI-recommended tasks
      if (insertedGoals) {
        await generateTasksFromGoals(insertedGoals.map(goal => ({
          ...goal,
          status: goal.status as 'active' | 'completed' | 'stalled'
        })));
      }
    } catch (error) {
      console.error('Error completing onboarding:', error);
    }
  };

  const generateTasksFromGoals = async (goals: Goal[]) => {
    if (!supabaseUser) return;

    const taskSuggestions: Record<string, string[]> = {
      'Personal Wellbeing': ['Meditate for 10 minutes', 'Take a 20-minute walk', 'Practice gratitude journaling'],
      'Health / Fitness': ['Complete 30-minute workout', 'Drink 8 glasses of water', 'Prepare healthy meal'],
      'Financial Discipline': ['Review monthly budget', 'Track daily expenses', 'Research investment options'],
      'Career Growth': ['Update LinkedIn profile', 'Read industry article', 'Network with one professional'],
      'Side Hustle': ['Work on project for 1 hour', 'Research market opportunities', 'Update business plan'],
      'Mental Clarity': ['Practice deep breathing', 'Organize workspace', 'Plan tomorrow\'s priorities'],
    };

    const tasksToInsert: any[] = [];

    goals.forEach(goal => {
      const suggestions = taskSuggestions[goal.title] || ['Work on your goal'];
      suggestions.forEach(suggestion => {
        tasksToInsert.push({
          user_id: supabaseUser.id,
          goal_id: goal.id,
          title: suggestion,
          status: 'pending',
          priority: 'medium',
        });
      });
    });

    try {
      const { data: insertedTasks, error } = await supabase
        .from('tasks')
        .insert(tasksToInsert)
        .select();

      if (error) {
        console.error('Error creating tasks:', error);
      } else {
        setTasks(prev => [...prev, ...(insertedTasks || []).map(task => ({
          ...task,
          status: task.status as 'pending' | 'completed' | 'in_progress'
        }))]);
      }
    } catch (error) {
      console.error('Error generating tasks:', error);
    }
  };

  const addTask = async (task: Omit<Task, 'id' | 'created_at'>) => {
    if (!supabaseUser) return;

    try {
      const { data, error } = await supabase
        .from('tasks')
        .insert([{
          ...task,
          user_id: supabaseUser.id,
        }])
        .select()
        .single();

      if (error) {
        console.error('Error adding task:', error);
      } else {
        setTasks(prev => [{
          ...data,
          status: data.status as 'pending' | 'completed' | 'in_progress'
        }, ...prev]);
      }
    } catch (error) {
      console.error('Error adding task:', error);
    }
  };

  const toggleTask = async (taskId: string) => {
    if (!supabaseUser) return;

    const task = tasks.find(t => t.id === taskId);
    if (!task) return;

    const newStatus = task.status === 'completed' ? 'pending' : 'completed';

    try {
      const { error } = await supabase
        .from('tasks')
        .update({ status: newStatus })
        .eq('id', taskId)
        .eq('user_id', supabaseUser.id);

      if (error) {
        console.error('Error toggling task:', error);
      } else {
        setTasks(prev => 
          prev.map(t => 
            t.id === taskId ? { ...t, status: newStatus } : t
          )
        );
      }
    } catch (error) {
      console.error('Error toggling task:', error);
    }
  };

  const deleteTask = async (taskId: string) => {
    if (!supabaseUser) return;

    try {
      const { error } = await supabase
        .from('tasks')
        .delete()
        .eq('id', taskId)
        .eq('user_id', supabaseUser.id);

      if (error) {
        console.error('Error deleting task:', error);
      } else {
        setTasks(prev => prev.filter(t => t.id !== taskId));
      }
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  const editTask = async (taskId: string, updates: Partial<Task>) => {
    if (!supabaseUser) return;

    try {
      const { error } = await supabase
        .from('tasks')
        .update(updates)
        .eq('id', taskId)
        .eq('user_id', supabaseUser.id);

      if (error) {
        console.error('Error updating task:', error);
      } else {
        setTasks(prev => 
          prev.map(t => 
            t.id === taskId ? { ...t, ...updates } : t
          )
        );
      }
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  const addJournalEntry = async (entry: Omit<JournalEntry, 'id' | 'created_at'>) => {
    if (!supabaseUser) return;

    try {
      const { data, error } = await supabase
        .from('journals')
        .insert([{
          ...entry,
          user_id: supabaseUser.id,
        }])
        .select()
        .single();

      if (error) {
        console.error('Error adding journal entry:', error);
      } else {
        setJournalEntries(prev => [data, ...prev]);
        setUser(prev => prev ? { ...prev, streak: prev.streak + 1 } : null);
      }
    } catch (error) {
      console.error('Error adding journal entry:', error);
    }
  };

  const updateJournalEntry = async (entryId: string, updates: Partial<JournalEntry>) => {
    if (!supabaseUser) return;

    try {
      const { error } = await supabase
        .from('journals')
        .update(updates)
        .eq('id', entryId)
        .eq('user_id', supabaseUser.id);

      if (error) {
        console.error('Error updating journal entry:', error);
      } else {
        setJournalEntries(prev => 
          prev.map(entry => 
            entry.id === entryId ? { ...entry, ...updates } : entry
          )
        );
      }
    } catch (error) {
      console.error('Error updating journal entry:', error);
    }
  };

  const toggleHabit = (habitId: string) => {
    setHabits(prev => 
      prev.map(habit => 
        habit.id === habitId 
          ? { ...habit, completed: !habit.completed }
          : habit
      )
    );
  };

  const regenerateRecommendations = async () => {
    await generateTasksFromGoals(goals);
  };

  const resetAllData = async () => {
    if (!supabaseUser) return;

    try {
      // Delete all user data from Supabase
      await Promise.all([
        supabase.from('goals').delete().eq('user_id', supabaseUser.id),
        supabase.from('tasks').delete().eq('user_id', supabaseUser.id),
        supabase.from('journals').delete().eq('user_id', supabaseUser.id),
      ]);

      // Reset local state
      setGoals([]);
      setTasks([]);
      setJournalEntries([]);
      setHabits([
        { id: '1', emoji: '💧', label: 'Drink Water', completed: false },
        { id: '2', emoji: '🏃', label: 'Exercise', completed: false },
        { id: '3', emoji: '📚', label: 'Read', completed: false },
      ]);
      setUser(prev => prev ? {
        ...prev,
        hasCompletedOnboarding: false,
        streak: 0,
        level: 'Mindful Novice',
      } : null);
    } catch (error) {
      console.error('Error resetting data:', error);
    }
  };

  return (
    <AppContext.Provider
      value={{
        user,
        supabaseUser,
        goals,
        tasks,
        journalEntries,
        habits,
        isLoading,
        login,
        loginWithToken,
        logout,
        completeOnboarding,
        addTask,
        toggleTask,
        deleteTask,
        editTask,
        addJournalEntry,
        updateJournalEntry,
        toggleHabit,
        regenerateRecommendations,
        resetAllData,
        loadUserData,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
