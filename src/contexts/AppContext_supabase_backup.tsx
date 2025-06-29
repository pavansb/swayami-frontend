import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '../utils/supabaseClient';
import { User as SupabaseUser } from '@supabase/supabase-js';
import { mongoService } from '../services/mongoService';

// Interfaces
interface Goal {
  _id: string;
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
  _id: string;
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
  _id: string;
  content: string;
  mood_score?: number;
  summary?: string;
  created_at?: string;
  user_id?: string;
}

interface User {
  _id: string;
  email: string;
  name?: string;
  full_name?: string;
  avatar_url?: string;
  isLoggedIn: boolean;
  hasCompletedOnboarding: boolean;
  streak: number;
  level: string;
  google_id?: string;
}

interface AppContextType {
  user: User | null;
  supabaseUser: SupabaseUser | null;
  goals: Goal[];
  tasks: Task[];
  journalEntries: JournalEntry[];
  habits: Array<{ _id: string; emoji: string; label: string; completed: boolean }>;
  isLoading: boolean;
  login: (email: string) => void;
  loginWithToken: (userData: { id: string; email: string; name?: string }) => void;
  logout: () => void;
  completeOnboarding: (selectedGoals: { type: string; description: string }[]) => Promise<void>;
  addTask: (task: Omit<Task, '_id' | 'created_at'>) => Promise<void>;
  toggleTask: (taskId: string) => Promise<void>;
  deleteTask: (taskId: string) => Promise<void>;
  editTask: (taskId: string, updates: Partial<Task>) => Promise<void>;
  addJournalEntry: (entry: Omit<JournalEntry, '_id' | 'created_at'>) => Promise<void>;
  updateJournalEntry: (entryId: string, updates: Partial<JournalEntry>) => Promise<void>;
  toggleHabit: (habitId: string) => void;
  regenerateRecommendations: () => void;
  resetAllData: () => void;
  loadUserData: () => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
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
  const [habits, setHabits] = useState<Array<{ _id: string; emoji: string; label: string; completed: boolean }>>([
    { _id: '1', emoji: '💧', label: 'Drink 8 glasses of water', completed: false },
    { _id: '2', emoji: '🏃', label: '30-minute morning run', completed: false },
    { _id: '3', emoji: '📚', label: 'Read for 20 minutes', completed: true },
    { _id: '4', emoji: '🧘', label: 'Meditate for 10 minutes', completed: false },
    { _id: '5', emoji: '🌱', label: 'Practice gratitude', completed: true },
  ]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        console.log('🔄 MongoDB App: Initializing authentication...');
        
        // Get current Supabase session (for auth only)
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session?.user) {
          console.log('✅ MongoDB App: Found existing Supabase session');
          setSupabaseUser(session.user);
          await initializeUserFromSupabase(session.user);
        } else {
          console.log('📭 MongoDB App: No existing session found');
        }

        // Listen for auth changes (Supabase auth only)
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
          async (event, session) => {
            console.log('🔔 MongoDB App: Auth state changed:', event);
            
            if (event === 'SIGNED_IN' && session?.user) {
              console.log('✅ MongoDB App: User signed in');
              setSupabaseUser(session.user);
              await initializeUserFromSupabase(session.user);
            } else if (event === 'SIGNED_OUT') {
              console.log('👋 MongoDB App: User signed out');
              setSupabaseUser(null);
              setUser(null);
              setGoals([]);
              setTasks([]);
              setJournalEntries([]);
            }
          }
        );

        return () => {
          subscription.unsubscribe();
        };
      } catch (error) {
        console.error('❌ MongoDB App: Error initializing auth:', error);
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const initializeUserFromSupabase = async (supabaseUser: SupabaseUser) => {
    try {
      console.log('🔄 MongoDB App: Initializing user from Supabase auth...');
      
      // First, try to find user in MongoDB
      let mongoUser = await mongoService.getUserByEmail(supabaseUser.email || '');
      
      if (!mongoUser) {
        console.log('👤 MongoDB App: Creating new user in MongoDB...');
        // Create user in MongoDB
        mongoUser = await mongoService.createUser({
          google_id: supabaseUser.id,
          email: supabaseUser.email || '',
          full_name: supabaseUser.user_metadata?.full_name || 
                    supabaseUser.user_metadata?.name ||
                    supabaseUser.email?.split('@')[0] || 
                    'User'
        });
      }

      if (mongoUser) {
        console.log('✅ MongoDB App: User initialized:', mongoUser.email);
        setUser({
          _id: mongoUser._id,
          email: mongoUser.email,
          full_name: mongoUser.full_name,
          name: mongoUser.full_name,
          isLoggedIn: true,
          hasCompletedOnboarding: mongoUser.has_completed_onboarding || false,
          streak: mongoUser.streak || 0,
          level: mongoUser.level || 'Mindful Novice',
          google_id: mongoUser.google_id
        });

        // Load user data
        await loadUserDataFromMongo(mongoUser._id);
      }
    } catch (error) {
      console.error('❌ MongoDB App: Error initializing user:', error);
    }
  };

  const loadUserDataFromMongo = async (userId: string) => {
    try {
      console.log('📊 MongoDB App: Loading user data...');
      
      // Load goals, tasks, and journal entries in parallel
      const [goalsData, tasksData, journalsData] = await Promise.all([
        mongoService.getUserGoals(userId),
        mongoService.getUserTasks(userId),
        mongoService.getUserJournalEntries(userId)
      ]);

      console.log('📊 MongoDB App: Loaded data:', {
        goals: goalsData.length,
        tasks: tasksData.length,
        journals: journalsData.length
      });

      setGoals(goalsData.map(goal => ({
        ...goal,
        status: goal.status as 'active' | 'completed' | 'stalled'
      })));
      
      setTasks(tasksData.map(task => ({
        ...task,
        status: task.status as 'pending' | 'completed' | 'in_progress'
      })));
      
      setJournalEntries(journalsData);

    } catch (error) {
      console.error('❌ MongoDB App: Error loading user data:', error);
    }
  };

  const loadUserData = async () => {
    if (user?._id) {
      await loadUserDataFromMongo(user._id);
    }
  };

  const login = (email: string) => {
    console.log('🔄 MongoDB App: Triggering login for:', email);
    // Supabase Google Auth will handle the actual login
  };

  const loginWithToken = (userData: { id: string; email: string; name?: string }) => {
    console.log('🔄 MongoDB App: Login with token:', userData.email);
    // This will be handled by Supabase auth state change
  };

  const logout = async () => {
    try {
      console.log('👋 MongoDB App: Logging out...');
      await supabase.auth.signOut();
      setUser(null);
      setSupabaseUser(null);
      setGoals([]);
      setTasks([]);
      setJournalEntries([]);
    } catch (error) {
      console.error('❌ MongoDB App: Error during logout:', error);
    }
  };

  const completeOnboarding = async (selectedGoals: { type: string; description: string }[]) => {
    if (!user?._id) {
      throw new Error('User not authenticated');
    }

    try {
      console.log('🎯 MongoDB App: Completing onboarding with goals:', selectedGoals);

      // Create goals in MongoDB
      const createdGoals: Goal[] = [];
      for (const goalData of selectedGoals) {
        const goal = await mongoService.createGoal({
          user_id: user._id,
          title: goalData.type,
          description: goalData.description,
          category: goalData.type.toLowerCase().replace(/[^a-z0-9]/g, '_'),
          priority: 'medium'
        });
        
        createdGoals.push({
          ...goal,
          status: goal.status as 'active' | 'completed' | 'stalled'
        });
      }

      // Update user onboarding status
      await mongoService.updateUserOnboarding(user._id, true);

      // Update local state
      setGoals(createdGoals);
      setUser(prev => prev ? { ...prev, hasCompletedOnboarding: true } : null);

      console.log('✅ MongoDB App: Onboarding completed successfully');
    } catch (error) {
      console.error('❌ MongoDB App: Error completing onboarding:', error);
      throw error;
    }
  };

  const addTask = async (task: Omit<Task, '_id' | 'created_at'>) => {
    if (!user?._id) return;

    try {
      console.log('📝 MongoDB App: Adding task:', task.title);
      const newTask = await mongoService.createTask({
        user_id: user._id,
        goal_id: task.goal_id || '',
        title: task.title,
        description: task.description,
        priority: task.priority,
        status: task.status
      });

      setTasks(prev => [{
        ...newTask,
        status: newTask.status as 'pending' | 'completed' | 'in_progress'
      }, ...prev]);
    } catch (error) {
      console.error('❌ MongoDB App: Error adding task:', error);
    }
  };

  const toggleTask = async (taskId: string) => {
    if (!user?._id) return;

    const task = tasks.find(t => t._id === taskId);
    if (!task) return;

    const newStatus = task.status === 'completed' ? 'pending' : 'completed';

    try {
      await mongoService.updateTaskStatus(taskId, newStatus);
      setTasks(prev => 
        prev.map(t => 
          t._id === taskId ? { ...t, status: newStatus } : t
        )
      );
    } catch (error) {
      console.error('❌ MongoDB App: Error toggling task:', error);
    }
  };

  const deleteTask = async (taskId: string) => {
    if (!user?._id) return;

    try {
      await mongoService.deleteTask(taskId);
      setTasks(prev => prev.filter(t => t._id !== taskId));
    } catch (error) {
      console.error('❌ MongoDB App: Error deleting task:', error);
    }
  };

  const editTask = async (taskId: string, updates: Partial<Task>) => {
    if (!user?._id) return;

    try {
      await mongoService.updateTaskStatus(taskId, updates.status || 'pending');
      setTasks(prev => 
        prev.map(t => 
          t._id === taskId ? { ...t, ...updates } : t
        )
      );
    } catch (error) {
      console.error('❌ MongoDB App: Error editing task:', error);
    }
  };

  const addJournalEntry = async (entry: Omit<JournalEntry, '_id' | 'created_at'>) => {
    if (!user?._id) return;

    try {
      const newEntry = await mongoService.createJournalEntry({
        user_id: user._id,
        content: entry.content,
        mood_score: entry.mood_score
      });

      setJournalEntries(prev => [newEntry, ...prev]);
    } catch (error) {
      console.error('❌ MongoDB App: Error adding journal entry:', error);
    }
  };

  const updateJournalEntry = async (entryId: string, updates: Partial<JournalEntry>) => {
    // MongoDB service doesn't have update journal entry yet
    console.log('🔄 MongoDB App: Journal entry update not implemented yet');
  };

  const toggleHabit = (habitId: string) => {
    setHabits(prev => 
      prev.map(habit => 
        habit._id === habitId ? { ...habit, completed: !habit.completed } : habit
      )
    );
  };

  const regenerateRecommendations = () => {
    console.log('🔄 MongoDB App: Regenerating recommendations...');
  };

  const resetAllData = () => {
    console.log('🧹 MongoDB App: Resetting all data...');
    setGoals([]);
    setTasks([]);
    setJournalEntries([]);
  };

  const value: AppContextType = {
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
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
